/**
 * 在 Web Worker 中运行 PostgreSQL（PGlite）。
 *
 * 每次执行都在事务里重建表、灌数据、跑用户 SQL，结束后回滚。
 * PostgreSQL 的 DDL 也受事务保护，因此回滚能彻底清掉本次建的表，
 * 既保证每次运行环境干净，又避免反复创建数据库实例的开销。
 */
import { PGlite } from '@electric-sql/pglite'

type RunRequest = {
  id: number
  schema: string
  seed: string
  sql: string
  kind: 'query' | 'mutation'
  verifyQuery?: string
}

export type SqlRunResult = {
  ok: boolean
  /** 用户 SQL 最后一条语句的结果，mutation 题为 verifyQuery 的结果 */
  columns: string[]
  rows: unknown[][]
  /** 受影响行数，用于给写操作反馈 */
  affected?: number
  error?: string
  /** 执行耗时（毫秒） */
  elapsed?: number
}

type WorkerScope = {
  postMessage: (message: unknown) => void
  onmessage: ((event: MessageEvent<RunRequest>) => void) | null
}

const scope = self as unknown as WorkerScope

let dbPromise: Promise<PGlite> | null = null
let ready = false
function getDb() {
  dbPromise ??= PGlite.create()
  return dbPromise
}

type PgResult = {
  fields?: Array<{ name: string }>
  rows?: Array<Record<string, unknown>>
  affectedRows?: number
}

/** PGlite 返回的行是对象，这里转成按列顺序排列的数组 */
function toResultSet(result: PgResult | undefined) {
  const columns = (result?.fields ?? []).map(field => field.name)
  const rows = (result?.rows ?? []).map(row => columns.map(column => row[column]))
  return { columns, rows, affected: result?.affectedRows }
}

scope.onmessage = async ({ data }) => {
  const startedAt = Date.now()
  try {
    if (!ready) scope.postMessage({ id: data.id, phase: 'loading' })
    const db = await getDb()
    ready = true
    scope.postMessage({ id: data.id, phase: 'running' })

    await db.exec('BEGIN')
    try {
      await db.exec(data.schema)
      if (data.seed.trim()) await db.exec(data.seed)

      const executed = (await db.exec(data.sql)) as PgResult[]
      let payload = toResultSet(executed[executed.length - 1])

      // 写操作题：以执行后的表状态作为答案
      if (data.kind === 'mutation' && data.verifyQuery) {
        const snapshot = (await db.query(data.verifyQuery)) as PgResult
        payload = { ...toResultSet(snapshot), affected: payload.affected }
      }

      scope.postMessage({
        id: data.id,
        ok: true,
        ...payload,
        elapsed: Date.now() - startedAt,
      } satisfies SqlRunResult & { id: number })
    } finally {
      // 回滚掉本次建的表与数据，让下一次运行从干净状态开始
      await db.exec('ROLLBACK').catch(() => {})
    }
  } catch (error) {
    scope.postMessage({
      id: data.id,
      ok: false,
      columns: [],
      rows: [],
      error: error instanceof Error ? error.message : String(error),
      elapsed: Date.now() - startedAt,
    } satisfies SqlRunResult & { id: number })
  }
}

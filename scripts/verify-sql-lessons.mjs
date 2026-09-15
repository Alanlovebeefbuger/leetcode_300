#!/usr/bin/env node
/**
 * 用真实 PostgreSQL（PGlite）逐题执行参考答案，验证题库自身正确。
 *
 * 校验内容：
 *   1. schema 与 seed 能建库成功
 *   2. 参考答案能执行且结果与 expected 完全一致
 *   3. mutation 题执行后表状态符合期望
 *   4. 元数据完整（题号唯一、字段齐全、包含 MySQL 对应写法）
 *   5. orderMatters 为 false 时，答案不依赖偶然的返回顺序
 *
 * 用法：npm run sql:verify
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { PGlite } from '@electric-sql/pglite'

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sqlverify-'))
const bundle = path.join(tempDir, 'lessons.mjs')
const entry = path.join(tempDir, 'entry.ts')

fs.writeFileSync(
  entry,
  `export { sqlLessons } from ${JSON.stringify(path.resolve('src/data/sql/lessons.ts'))}
export { compareResultSets } from ${JSON.stringify(path.resolve('src/data/sql/compare.ts'))}
`,
)
execFileSync('npx', ['esbuild', entry, '--bundle', '--platform=node', '--format=esm', `--outfile=${bundle}`, '--log-level=warning'], { stdio: 'inherit' })

const { sqlLessons, compareResultSets } = await import(bundle)

const REQUIRED_TEXT = ['title', 'titleEn', 'slug', 'difficulty', 'category', 'schema', 'seed', 'solution', 'summary', 'intuition', 'mysqlNote']
const REQUIRED_LIST = ['constraints', 'approach', 'walkthrough', 'pitfalls', 'related']

const failures = []
const ids = Object.keys(sqlLessons)
let checked = 0

/** 把 PGlite 的查询结果转成 { columns, rows } 形式 */
function toResultSet(result) {
  const columns = (result.fields ?? []).map((field) => field.name)
  const rows = (result.rows ?? []).map((row) => columns.map((column) => row[column]))
  return { columns, rows }
}

/** 执行一段可能含多条语句的 SQL，返回最后一条 SELECT 的结果 */
async function runStatements(db, sql) {
  const results = await db.exec(sql)
  const last = results[results.length - 1]
  return last ? toResultSet(last) : { columns: [], rows: [] }
}

for (const key of ids) {
  const lesson = sqlLessons[key]
  checked += 1
  const label = `${lesson.id} ${lesson.title}`

  // --- 元数据 ---
  if (String(lesson.id) !== key) failures.push({ label, kind: '元数据', detail: `键 ${key} 与 id ${lesson.id} 不一致` })
  for (const field of REQUIRED_TEXT) {
    if (typeof lesson[field] !== 'string' || !lesson[field].trim()) {
      failures.push({ label, kind: '元数据', detail: `缺少字段 ${field}` })
    }
  }
  for (const field of REQUIRED_LIST) {
    if (!Array.isArray(lesson[field]) || !lesson[field].length) {
      failures.push({ label, kind: '元数据', detail: `缺少数组字段 ${field}` })
    }
  }
  if (!['query', 'mutation'].includes(lesson.kind)) {
    failures.push({ label, kind: '元数据', detail: `kind 非法：${lesson.kind}` })
  }
  if (lesson.kind === 'mutation' && !lesson.verifyQuery) {
    failures.push({ label, kind: '元数据', detail: 'mutation 题缺少 verifyQuery' })
  }
  if (!lesson.expected?.columns?.length) {
    failures.push({ label, kind: '元数据', detail: 'expected.columns 为空' })
  }

  // --- 实跑参考答案 ---
  const db = new PGlite()
  try {
    await db.exec(lesson.schema)
    await db.exec(lesson.seed)

    let actual
    if (lesson.kind === 'mutation') {
      await db.exec(lesson.solution)
      actual = toResultSet(await db.query(lesson.verifyQuery))
    } else {
      actual = await runStatements(db, lesson.solution)
    }

    const verdict = compareResultSets(actual, lesson.expected, lesson.orderMatters)
    if (!verdict.ok) {
      failures.push({ label, kind: '结果不符', detail: verdict.reason })
    }

    // orderMatters=false 的题，用逆序重放数据再跑一次，
    // 确认答案不依赖插入顺序造成的偶然排序。
    if (lesson.kind === 'query' && !lesson.orderMatters) {
      const shuffled = new PGlite()
      try {
        await shuffled.exec(lesson.schema)
        const inserts = lesson.seed.split(';').map((s) => s.trim()).filter(Boolean)
        for (const statement of inserts.reverse()) await shuffled.exec(`${statement};`)
        const again = await runStatements(shuffled, lesson.solution)
        const second = compareResultSets(again, lesson.expected, false)
        if (!second.ok) {
          failures.push({ label, kind: '顺序敏感', detail: `逆序插入后结果不符：${second.reason}` })
        }
      } finally {
        await shuffled.close()
      }
    }
  } catch (error) {
    failures.push({ label, kind: '执行出错', detail: error.message.split('\n')[0] })
  } finally {
    await db.close()
  }
}

fs.rmSync(tempDir, { recursive: true, force: true })

const byKind = {}
for (const item of failures) (byKind[item.kind] ??= []).push(item)

console.log(`SQL 题库校验：共 ${checked} 题，通过 ${checked - new Set(failures.map((f) => f.label)).size} 题\n`)
if (!failures.length) {
  console.log('✅ 全部通过：参考答案结果与期望一致，元数据完整。')
} else {
  for (const [kind, items] of Object.entries(byKind)) {
    console.log(`### ${kind}（${items.length}）`)
    for (const item of items) console.log(`  ❌ ${item.label}: ${item.detail}`)
    console.log()
  }
}
process.exit(failures.length ? 1 : 0)

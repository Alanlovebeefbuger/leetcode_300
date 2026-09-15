import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { compareResultSets, format } from './data/sql/compare'
import type { SqlLesson, SqlResultSet } from './data/sql/types'

type Props = { lesson: SqlLesson }
type RunResult = {
  ok: boolean
  columns: string[]
  rows: unknown[][]
  affected?: number
  error?: string
  elapsed?: number
}
type WorkerMessage =
  | { id: number; phase: 'loading' | 'running' }
  | (RunResult & { id: number; phase?: undefined })
type Pending = { id: number; resolve: (result: RunResult) => void; timer: number }
type Outcome =
  | { kind: 'idle'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'result'; text: string; data: SqlResultSet; affected?: number }
  | { kind: 'passed'; text: string; data: SqlResultSet }
  | { kind: 'failed'; text: string; data: SqlResultSet; expected: SqlResultSet }

const draftKey = (id: number | string) => `leetcode-sql-draft-${id}`

export default function SqlPlayground({ lesson }: Props) {
  const [sql, setSql] = useState('')
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showSchema, setShowSchema] = useState(false)
  const [outcome, setOutcome] = useState<Outcome>({ kind: 'idle', text: '写下你的 SQL，然后「运行」查看结果或「验证提交」比对答案。' })
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<Pending | null>(null)
  const requestId = useRef(0)
  const tickerRef = useRef<number | null>(null)

  function stopTicker() {
    if (tickerRef.current !== null) {
      window.clearInterval(tickerRef.current)
      tickerRef.current = null
    }
  }

  useEffect(() => {
    setSql(localStorage.getItem(draftKey(lesson.id)) ?? '')
    setOutcome({ kind: 'idle', text: '写下你的 SQL，然后「运行」查看结果或「验证提交」比对答案。' })
    setCopied(false)
    setShowSchema(false)
  }, [lesson.id])

  useEffect(() => () => {
    workerRef.current?.terminate()
    if (pendingRef.current) window.clearTimeout(pendingRef.current.timer)
    stopTicker()
  }, [])

  function stopWorker(message: string) {
    workerRef.current?.terminate()
    workerRef.current = null
    stopTicker()
    const pending = pendingRef.current
    if (pending) {
      window.clearTimeout(pending.timer)
      pending.resolve({ ok: false, columns: [], rows: [], error: message })
      pendingRef.current = null
    }
  }

  /** 首次运行需下载 Postgres 运行时，用计时提示让等待过程可见 */
  function startDownloadTicker() {
    stopTicker()
    const startedAt = Date.now()
    const render = () => {
      const seconds = Math.round((Date.now() - startedAt) / 1000)
      setOutcome({
        kind: 'idle',
        text: `正在下载 PostgreSQL 运行时（首次约 3MB，已等待 ${seconds} 秒）…\n下载后会缓存，之后执行几乎瞬间完成。`,
      })
    }
    render()
    tickerRef.current = window.setInterval(render, 1000)
  }

  function execute(statement: string): Promise<RunResult> {
    const worker = workerRef.current ?? new Worker(new URL('./sql.worker.ts', import.meta.url), { type: 'module' })
    workerRef.current = worker
    return new Promise(resolve => {
      const id = ++requestId.current
      const setTimer = (ms: number, message: string) => window.setTimeout(() => stopWorker(message), ms)
      pendingRef.current = { id, resolve, timer: setTimer(60_000, 'PostgreSQL 运行时加载超时，请检查网络后重试。') }
      worker.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
        const pending = pendingRef.current
        if (!pending || data.id !== pending.id) return
        if (data.phase) {
          if (data.phase === 'loading') {
            startDownloadTicker()
          } else {
            stopTicker()
            setOutcome({ kind: 'idle', text: '数据库已就绪，正在执行 SQL…' })
            window.clearTimeout(pending.timer)
            pending.timer = setTimer(10_000, '执行超过 10 秒，已自动终止。请检查是否写出了笛卡尔积或死循环。')
          }
          return
        }
        window.clearTimeout(pending.timer)
        pendingRef.current = null
        resolve(data)
      }
      worker.onerror = event => stopWorker(`执行线程异常：${event.message}`)
      worker.postMessage({
        id,
        schema: lesson.schema,
        seed: lesson.seed,
        sql: statement,
        kind: lesson.kind,
        verifyQuery: lesson.verifyQuery,
      })
    })
  }

  async function run(validate: boolean) {
    if (!sql.trim()) {
      setOutcome({ kind: 'error', text: '请先写下 SQL 语句。' })
      return
    }
    setRunning(true)
    setOutcome({ kind: 'idle', text: '正在准备数据库…' })
    const result = await execute(sql)
    stopTicker()
    setRunning(false)

    if (!result.ok) {
      setOutcome({ kind: 'error', text: `✗ 执行失败\n\n${result.error ?? '未知错误'}` })
      return
    }

    const data: SqlResultSet = { columns: result.columns, rows: result.rows }
    const timing = result.elapsed !== undefined ? `　用时 ${result.elapsed} ms` : ''

    if (!validate) {
      const summary = lesson.kind === 'mutation'
        ? `✓ 语句已执行，下表是执行后的表状态${timing}`
        : `✓ 查询成功，返回 ${data.rows.length} 行${timing}`
      setOutcome({ kind: 'result', text: summary, data, affected: result.affected })
      return
    }

    const verdict = compareResultSets(data, lesson.expected, lesson.orderMatters)
    if (verdict.ok) {
      setOutcome({ kind: 'passed', text: `✓ 结果与期望完全一致${timing}`, data })
    } else {
      setOutcome({ kind: 'failed', text: `✗ 结果不符：${verdict.reason}`, data, expected: lesson.expected })
    }
  }

  function saveSql(value: string) {
    setSql(value)
    localStorage.setItem(draftKey(lesson.id), value)
  }

  function handleKeys(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      if (!running) void run(event.shiftKey)
      return
    }
    if (event.key !== 'Tab') return
    event.preventDefault()
    const target = event.currentTarget
    const next = `${sql.slice(0, target.selectionStart)}  ${sql.slice(target.selectionEnd)}`
    const cursor = target.selectionStart + 2
    saveSql(next)
    requestAnimationFrame(() => { target.selectionStart = cursor; target.selectionEnd = cursor })
  }

  async function copySql() {
    try {
      await navigator.clipboard.writeText(sql || lesson.solution)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setOutcome({ kind: 'error', text: '浏览器拒绝了剪贴板访问，请在编辑框内手动选择并复制。' })
    }
  }

  function reset() {
    setSql('')
    localStorage.removeItem(draftKey(lesson.id))
    setOutcome({ kind: 'idle', text: '已清空编辑区。' })
  }

  return <div className="playground sql-playground">
    <div className="playground-toolbar">
      <div><b>SQL 在线练习</b><span>浏览器内运行 PostgreSQL · 草稿自动保存</span></div>
      <div className="toolbar-actions">
        <button onClick={() => setShowSchema(value => !value)} aria-expanded={showSchema}>
          {showSchema ? '收起表结构' : '查看表结构'}
        </button>
        <button onClick={copySql}>{copied ? '✓ 已复制' : '⧉ 复制'}</button>
        <button onClick={reset} disabled={running}>清空</button>
      </div>
    </div>

    {showSchema && <div className="schema-view">
      <div className="schema-block"><b>表结构</b><pre>{lesson.schema}</pre></div>
      <div className="schema-block"><b>测试数据</b><pre>{lesson.seed}</pre></div>
    </div>}

    <label className="editor-label" htmlFor={`sql-${lesson.id}`}>
      你的 SQL
      <span>{lesson.kind === 'mutation' ? '本题需要写 DELETE / UPDATE，提交后按表的最终状态判定' : `期望列：${lesson.expected.columns.join(', ')}${lesson.orderMatters ? '　需要按题意排序' : '　行顺序不限'}`}</span>
    </label>
    <textarea id={`sql-${lesson.id}`} className="code-editor sql-editor" spellCheck={false} value={sql}
      placeholder={lesson.kind === 'mutation' ? 'DELETE FROM ...' : 'SELECT ...'}
      onChange={event => saveSql(event.target.value)}
      onKeyDown={handleKeys} />

    <div className="runner-actions">
      <button onClick={() => run(false)} disabled={running} title="快捷键 Cmd/Ctrl + Enter">{running ? '执行中…' : '▶ 运行'}</button>
      <button className="submit-code" onClick={() => run(true)} disabled={running} title="快捷键 Cmd/Ctrl + Shift + Enter">{running ? '请稍候…' : '✓ 验证提交'}</button>
      <span className="shortcut-hint">Cmd/Ctrl + Enter 运行 · 加 Shift 验证提交</span>
    </div>

    <div className={`runner-output ${outcome.kind === 'passed' ? 'success' : outcome.kind === 'failed' || outcome.kind === 'error' ? 'error' : 'idle'}`} role="status" aria-live="polite">
      <div><span/>执行结果</div>
      <pre>{outcome.text}</pre>
      {outcome.kind === 'failed'
        ? <div className="result-compare">
            <ResultTable title="你的结果" data={outcome.data} compareWith={outcome.expected} orderMatters={lesson.orderMatters}/>
            <ResultTable title="期望结果" data={outcome.expected}/>
          </div>
        : (outcome.kind === 'result' || outcome.kind === 'passed') && <ResultTable title="返回结果" data={outcome.data}/>}
    </div>
    <p className="runner-note">列名比较不区分大小写，PostgreSQL 会把未加引号的别名转为小写。数值与字符串形式的数字按数值比较。</p>
  </div>
}

/** 结果表格；传入 compareWith 时标出与期望不一致的单元格 */
function ResultTable({ title, data, compareWith, orderMatters }: {
  title: string
  data: SqlResultSet
  compareWith?: SqlResultSet
  orderMatters?: boolean
}) {
  if (!data.columns.length) {
    return <div className="result-table empty-result"><b>{title}</b><p>没有返回任何列。</p></div>
  }
  // 只有在题目要求顺序时逐行标注差异，否则行位置本身没有意义
  const canMark = !!compareWith && orderMatters === true
  return <div className="result-table">
    <b>{title}<em>{data.rows.length} 行</em></b>
    <div className="table-scroll">
      <table>
        <thead><tr>{data.columns.map(column => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>
          {data.rows.length
            ? data.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => {
                const expectedCell = canMark ? compareWith!.rows[r]?.[c] : undefined
                const differs = canMark && JSON.stringify(cell ?? null) !== JSON.stringify(expectedCell ?? null)
                return <td key={c} className={differs ? 'cell-diff' : undefined}>{format(cell)}</td>
              })}</tr>)
            : <tr><td colSpan={data.columns.length} className="no-rows">（空结果集）</td></tr>}
        </tbody>
      </table>
    </div>
  </div>
}

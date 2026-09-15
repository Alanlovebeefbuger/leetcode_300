import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { buildAutoTests } from './autoTests'

type Example = { input?: string; output?: string; explanation?: string }
type Props = { problemId: number | string; initialCode: string; examples?: Example[] }
type RunResult = { ok: boolean; stdout: string; stderr: string; error?: string }
/** worker 先回传阶段消息，最后才回传执行结果，两者字段并不相同 */
type WorkerMessage =
  | { id: number; phase: 'loading' | 'running' }
  | (RunResult & { id: number; phase?: undefined })
type Pending = { id: number; resolve: (result: RunResult) => void; timer: number }

const codeKey = (id: number | string) => `leetcode-top300-code-${id}`
const testKey = (id: number | string) => `leetcode-top300-tests-${id}`
// 稳定的空数组：作为默认参数写 `examples = []` 会在每次渲染生成新引用，
// 使依赖它的 effect 每轮都执行并 setState，进而造成无限渲染。
const NO_EXAMPLES: Example[] = []

function makeTests(problemId: number | string, code: string, examples: Example[]) {
  const auto = buildAutoTests(code, examples, problemId)
  if (auto) return auto

  const method = code.match(/def\s+([A-Za-z_]\w*)\s*\(\s*self/)?.[1] ?? 'solve'
  const hints = examples.slice(0, 2).map((item, index) =>
    `# 示例 ${index + 1} 输入：${item.input ?? '—'}\n# 示例 ${index + 1} 输出：${item.output ?? '—'}`
  ).join('\n')
  return `# 自定义测试区：调用你的方法并用 assert 判断结果
${hints || '# 请根据题意补充输入和期望输出'}

# 示例写法（请按当前题目的参数修改并取消注释）：
# result = Solution().${method}(输入参数)
# assert _lc_normalize(result) == 期望输出, f"实际得到 {result}"
# print("测试通过")`
}

export default function PythonPlayground({ problemId, initialCode, examples = NO_EXAMPLES }: Props) {
  const [code, setCode] = useState(initialCode)
  const [tests, setTests] = useState(() => makeTests(problemId, initialCode, examples))
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState<{ kind: 'idle' | 'success' | 'error'; text: string }>({ kind: 'idle', text: '点击“运行代码”检查语法，或编写断言后“验证提交”。' })
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

  /** 下载运行时期间按秒更新提示，让等待过程可见 */
  function startDownloadTicker() {
    stopTicker()
    const startedAt = Date.now()
    const render = () => {
      const seconds = Math.round((Date.now() - startedAt) / 1000)
      setResult({
        kind: 'idle',
        text: `正在下载 Python 运行时（首次约 10MB，已等待 ${seconds} 秒）…\n下载完成后会缓存，之后运行几乎瞬间完成。`,
      })
    }
    render()
    tickerRef.current = window.setInterval(render, 1000)
  }

  useEffect(() => {
    const savedCode = localStorage.getItem(codeKey(problemId))
    const nextCode = savedCode ?? initialCode
    setCode(nextCode)
    setTests(localStorage.getItem(testKey(problemId)) ?? makeTests(problemId, nextCode, examples))
    setResult({ kind: 'idle', text: savedCode ? '已恢复这道题上次保存的代码。' : '代码会自动保存在当前浏览器。' })
    setCopied(false)
  }, [problemId, initialCode, examples])

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
      pending.resolve({ ok: false, stdout: '', stderr: '', error: message })
      pendingRef.current = null
    }
  }

  function execute(source: string): Promise<RunResult> {
    const worker = workerRef.current ?? new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' })
    workerRef.current = worker
    return new Promise(resolve => {
      const id = ++requestId.current
      const setTimer = (milliseconds: number, message: string) => window.setTimeout(() => stopWorker(message), milliseconds)
      pendingRef.current = { id, resolve, timer: setTimer(60_000, 'Python 运行时加载超时，请检查网络后重试。') }
      worker.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
        const pending = pendingRef.current
        if (!pending || data.id !== pending.id) return
        if (data.phase) {
          if (data.phase === 'loading') {
            startDownloadTicker()
          } else {
            stopTicker()
            setResult({ kind: 'idle', text: 'Python 运行时已就绪，正在执行代码…' })
            window.clearTimeout(pending.timer)
            pending.timer = setTimer(8_000, '执行超过 8 秒，已自动终止。请检查是否存在死循环。')
          }
          return
        }
        window.clearTimeout(pending.timer)
        pendingRef.current = null
        resolve(data)
      }
      worker.onerror = event => stopWorker(`运行线程异常：${event.message}`)
      worker.postMessage({ id, source })
    })
  }

  async function run(validate: boolean) {
    if (validate && !/^\s*assert\b/m.test(tests)) {
      setResult({ kind: 'error', text: '提交前至少写一条 assert 断言，不能只打印结果。' })
      return
    }
    setRunning(true)
    setResult({ kind: 'idle', text: '正在准备 Python 环境…' })
    const execution = await execute(validate ? `${code}\n\n${tests}` : code)
    stopTicker()
    setRunning(false)
    const output = [execution.stdout, execution.stderr].filter(Boolean).join('\n')
    if (execution.ok) {
      setResult({ kind: 'success', text: `${validate ? '✓ 本地测试全部通过' : '✓ 代码执行成功'}${output ? `\n\n${output}` : '\n\n程序没有标准输出。'}` })
    } else {
      setResult({ kind: 'error', text: `✗ ${validate ? '测试未通过' : '执行失败'}\n\n${execution.error ?? output ?? '未知错误'}` })
    }
  }

  function saveCode(value: string) {
    setCode(value)
    localStorage.setItem(codeKey(problemId), value)
  }

  function saveTests(value: string) {
    setTests(value)
    localStorage.setItem(testKey(problemId), value)
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // 非 HTTPS 或用户拒绝授权时剪贴板不可用，提示手动复制而不是静默失败。
      setResult({ kind: 'error', text: '浏览器拒绝了剪贴板访问，请在代码框内手动选择并复制。' })
    }
  }

  /** Cmd/Ctrl + Enter 运行，加 Shift 直接验证提交 */
  function handleShortcuts(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || !(event.metaKey || event.ctrlKey)) return
    event.preventDefault()
    if (running) return
    void run(event.shiftKey)
  }

  function insertIndent(event: KeyboardEvent<HTMLTextAreaElement>, value: string, update: (next: string) => void) {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const target = event.currentTarget
    const next = `${value.slice(0, target.selectionStart)}    ${value.slice(target.selectionEnd)}`
    const cursor = target.selectionStart + 4
    update(next)
    requestAnimationFrame(() => { target.selectionStart = cursor; target.selectionEnd = cursor })
  }

  function resetDraft() {
    const freshTests = makeTests(problemId, initialCode, examples)
    setCode(initialCode)
    setTests(freshTests)
    localStorage.removeItem(codeKey(problemId))
    localStorage.removeItem(testKey(problemId))
    setResult({ kind: 'idle', text: '已恢复讲义代码和默认测试。' })
  }

  return <div className="playground">
    <div className="playground-toolbar">
      <div><b>Python 在线练习</b><span>浏览器本地运行 · 草稿自动保存</span></div>
      <div className="toolbar-actions">
        <button onClick={copyCode}>{copied ? '✓ 已复制' : '⧉ 复制代码'}</button>
        <button onClick={resetDraft} disabled={running}>恢复初始代码</button>
      </div>
    </div>
    <label className="editor-label" htmlFor={`code-${problemId}`}>解答代码</label>
    <textarea id={`code-${problemId}`} className="code-editor" spellCheck={false} value={code}
      onChange={event => saveCode(event.target.value)}
      onKeyDown={event => { handleShortcuts(event); insertIndent(event, code, saveCode) }} />
    <label className="editor-label" htmlFor={`tests-${problemId}`}>自定义测试 <span>使用 assert 判断答案，不通过时会显示错误</span></label>
    <textarea id={`tests-${problemId}`} className="code-editor test-editor" spellCheck={false} value={tests}
      onChange={event => saveTests(event.target.value)}
      onKeyDown={event => { handleShortcuts(event); insertIndent(event, tests, saveTests) }} />
    <div className="runner-actions">
      <button onClick={() => run(false)} disabled={running} title="快捷键 Cmd/Ctrl + Enter">{running ? '执行中…' : '▶ 运行代码'}</button>
      <button className="submit-code" onClick={() => run(true)} disabled={running} title="快捷键 Cmd/Ctrl + Shift + Enter">{running ? '请稍候…' : '✓ 验证提交'}</button>
      <span className="shortcut-hint">Cmd/Ctrl + Enter 运行 · 加 Shift 验证提交</span>
    </div>
    <div className={`runner-output ${result.kind}`} role="status" aria-live="polite"><div><span/>运行结果</div><pre>{result.text}</pre></div>
    <p className="runner-note">“验证提交”运行你写的自定义断言，不等同于 LeetCode 官方隐藏测试；正式提交可使用页面顶部的官方题目链接。</p>
  </div>
}
import { useEffect, useMemo, useRef, useState } from 'react'
import type * as React from 'react'
import { problems as problemCatalog } from './data/problems'
import { extraProblems } from './data/problems-extra'
import { getLoadedLesson, loadLesson, prefetchLesson } from './data/lessonLoader'
import { lessonSource } from './data/lessonIndex'
import { sqlProblems } from './data/sql/catalog'
import PythonPlayground from './PythonPlayground'
import SqlWorkspace from './SqlWorkspace'

type Difficulty = '简单' | '中等' | '困难'
type Problem = { id: number | string; title: string; titleCn?: string; titleZh?: string; slug?: string; difficulty: Difficulty | string; category: string; url?: string; link?: string; tags?: string[] }
type Example = { input?: string; output?: string; explanation?: string }
type Trace = { title?: string; description?: string; variables?: Record<string, unknown> }
type Lesson = { summary?: string; constraints?: string[]; examples?: Example[]; intuition?: string; bruteForce?: string; optimization?: string; approach?: string[]; steps?: string[]; code?: string; trace?: Trace[]; walkthrough?: { input?: string; steps?: string[]; result?: string }; complexity?: { time?: string; space?: string }; timeComplexity?: string; spaceComplexity?: string; pitfalls?: string[]; related?: Array<number | string> }

const rawProblems: Problem[] = [...problemCatalog, ...extraProblems]
const totalProblems = rawProblems.length
const difficultyLabel = (value: string) => ({ Easy: '简单', Medium: '中等', Hard: '困难' }[value] ?? value)
const storageKey = 'leetcode-top300-completed'
const sqlStorageKey = 'leetcode-sql-completed'
const problemIdSet = new Set(rawProblems.map(problem => String(problem.id)))
const sqlIdSet = new Set(sqlProblems.map(problem => String(problem.id)))
const totalSqlProblems = sqlProblems.length

function readCompleted(key: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')) } catch { return new Set() }
}
// 关联练习条目形如 '253 会议室 II'，也可能是 '0/1 背包' 这类纯知识点。
// 只有解析出的题号确实存在于题库时才允许跳转，否则渲染为不可点击的延伸阅读。
const relatedProblemId = (item: number | string): string | undefined => {
  const key = String(item).trim().match(/^\d+/)?.[0]
  return key && problemIdSet.has(key) ? key : undefined
}

const frameworks: Record<string, string[]> = {
  数组: ['明确下标、区间与原地修改约束', '尝试双指针、前缀和或哈希表', '用边界样例验证循环不变量'],
  链表: ['画出节点与指针变化', '优先考虑虚拟头结点与快慢指针', '修改前保存 next，检查成环风险'],
  二叉树: ['先确定递归函数的语义', '选择前序、后序或层序遍历', '写清终止条件与返回值组合'],
  动态规划: ['定义状态与选择', '写出转移方程和初始状态', '确认遍历顺序，再考虑空间压缩'],
  图: ['建立节点、边和访问状态', '按场景选择 BFS、DFS 或拓扑排序', '处理连通分量、环与重复访问'],
  默认: ['先复述输入、输出与约束', '从可验证的暴力解法开始', '识别重复计算并选择合适数据结构', '用最小、极端和重复数据验证']
}
function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [difficulty, setDifficulty] = useState('全部')
  const [selectedId, setSelectedId] = useState<number | string | null>(rawProblems[0]?.id ?? null)
  const [completed, setCompleted] = useState<Set<string>>(() => readCompleted(storageKey))
  const [sqlCompleted, setSqlCompleted] = useState<Set<string>>(() => readCompleted(sqlStorageKey))
  const [mode, setMode] = useState<'algorithm' | 'sql'>('algorithm')
  const [traceStep, setTraceStep] = useState(0)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [status, setStatus] = useState<'全部' | '未完成' | '已完成'>('全部')
  const [progressNotice, setProgressNotice] = useState('')
  const importInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify([...completed])) }, [completed])
  useEffect(() => { localStorage.setItem(sqlStorageKey, JSON.stringify([...sqlCompleted])) }, [sqlCompleted])
  const categories = useMemo(() => ['全部', ...new Set(rawProblems.map(p => p.category).filter(Boolean))], [])
  const filtered = useMemo(() => rawProblems.filter(problem => {
    const text = `${problem.id} ${problem.titleZh ?? problem.titleCn ?? ''} ${problem.title} ${problem.category} ${(problem.tags ?? []).join(' ')}`.toLowerCase()
    const done = completed.has(String(problem.id))
    return text.includes(query.trim().toLowerCase())
      && (category === '全部' || problem.category === category)
      && (difficulty === '全部' || difficultyLabel(problem.difficulty) === difficulty)
      && (status === '全部' || (status === '已完成' ? done : !done))
  }).sort((a, b) => Number(a.id) - Number(b.id)), [query, category, difficulty, status, completed])
  const selected = rawProblems.find(p => String(p.id) === String(selectedId)) ?? filtered[0]
  const selectedKey = selected ? String(selected.id) : undefined
  // 讲义按需加载：已在内存中的直接同步取用，避免切回旧题时闪一下加载态。
  const [lesson, setLesson] = useState<Lesson | undefined>(() =>
    selectedKey ? getLoadedLesson<Lesson>(selectedKey) : undefined)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [lessonFailed, setLessonFailed] = useState(false)
  // 加载失败后自增即可重跑加载 effect
  const [lessonRetry, setLessonRetry] = useState(0)
  // 筛选或搜索可能把当前题目移出列表，导致详情区落到另一道题。
  // 若不重置推演步数，会出现「STEP 5 / 3」这类越界状态。
  useEffect(() => { setTraceStep(0) }, [selectedKey])
  useEffect(() => {
    const reset = (nextLesson?: Lesson) => { setLesson(nextLesson); setLessonLoading(false); setLessonFailed(false) }
    if (!selectedKey) { reset(); return }
    const cached = getLoadedLesson<Lesson>(selectedKey)
    if (cached) { reset(cached); return }
    // 题库里没有对应讲义时不必发起请求，直接走通用框架兜底。
    if (!lessonSource[selectedKey]) { reset(); return }

    let cancelled = false
    setLesson(undefined)
    setLessonFailed(false)
    setLessonLoading(true)
    loadLesson<Lesson>(selectedKey)
      .then(loaded => { if (!cancelled) { setLesson(loaded); setLessonLoading(false) } })
      // 网络中断时讲义 chunk 会加载失败，必须与「讲义未编写」区分开，
      // 否则用户会误以为这道题没有内容。
      .catch(() => { if (!cancelled) { setLesson(undefined); setLessonLoading(false); setLessonFailed(true) } })
    return () => { cancelled = true }
  }, [selectedKey, lessonRetry])

  // 侧边栏统计跟随当前板块
  const isSql = mode === 'sql'
  const activeDone = isSql ? sqlCompleted.size : completed.size
  const activeTotal = isSql ? totalSqlProblems : totalProblems
  const activeProgress = activeTotal ? Math.round(activeDone / activeTotal * 100) : 0
  const difficultyStats = (isSql ? sqlProblems : rawProblems).map(problem => ({
    level: difficultyLabel(problem.difficulty),
    done: (isSql ? sqlCompleted : completed).has(String(problem.id)),
  }))

  const doneCount = completed.size
  const trace = lesson?.trace ?? lesson?.walkthrough?.steps?.map((description, index) => ({
    title: `推演第 ${index + 1} 步`, description,
    variables: index === 0 && lesson.walkthrough?.input ? { input: lesson.walkthrough.input } : index === lesson.walkthrough!.steps!.length - 1 && lesson.walkthrough?.result ? { result: lesson.walkthrough.result } : undefined,
  })) ?? []
  const currentTrace = trace[traceStep]

  function toggleDone(id: number | string) {
    setCompleted(current => { const next = new Set(current); const key = String(id); next.has(key) ? next.delete(key) : next.add(key); return next })
  }
  function toggleSqlDone(id: number) {
    setSqlCompleted(current => { const next = new Set(current); const key = String(id); next.has(key) ? next.delete(key) : next.add(key); return next })
  }
  function openProblem(id: number | string) { setSelectedId(id); setTraceStep(0); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // 进度只存在当前浏览器的 localStorage，换设备或清缓存就会丢失，
  // 因此提供导出与导入，让学习记录可以迁移和备份。
  function exportProgress() {
    const payload = {
      app: 'leetcode-top-500-tutorial',
      version: 2,
      exportedAt: new Date().toISOString(),
      total: totalProblems,
      totalSql: totalSqlProblems,
      completed: [...completed].sort((a, b) => Number(a) - Number(b)),
      sqlCompleted: [...sqlCompleted].sort((a, b) => Number(a) - Number(b)),
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `leetcode500-progress-${new Date().toISOString().slice(0, 10)}.json`
    // 需要真正挂到文档上，部分浏览器不会响应游离节点的点击。
    document.body.append(link)
    link.click()
    link.remove()
    // Safari 若在同一事件循环内 revoke，下载会被取消，因此延后释放。
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setProgressNotice(`已导出算法 ${payload.completed.length} 条、SQL ${payload.sqlCompleted.length} 条`)
  }

  async function importProgress(file: File) {
    try {
      const parsed = JSON.parse(await file.text())
      // 兼容三种来源：裸数组、v1（只有算法进度）、v2（含 SQL 进度）
      const algorithmIncoming: unknown = Array.isArray(parsed) ? parsed : parsed?.completed
      const sqlIncoming: unknown = Array.isArray(parsed) ? [] : parsed?.sqlCompleted ?? []
      if (!Array.isArray(algorithmIncoming) || !Array.isArray(sqlIncoming)) throw new Error('格式不符')

      // 只接受题库中真实存在的题号，避免导入脏数据污染进度统计。
      const validAlgorithm = algorithmIncoming.map(String).filter(id => problemIdSet.has(id))
      const validSql = sqlIncoming.map(String).filter(id => sqlIdSet.has(id))
      const mergedAlgorithm = new Set([...completed, ...validAlgorithm])
      const mergedSql = new Set([...sqlCompleted, ...validSql])
      const added = mergedAlgorithm.size - completed.size
      const addedSql = mergedSql.size - sqlCompleted.size
      setCompleted(mergedAlgorithm)
      setSqlCompleted(mergedSql)

      const ignored = (algorithmIncoming.length - validAlgorithm.length) + (sqlIncoming.length - validSql.length)
      setProgressNotice(
        `导入完成：算法新增 ${added} 条、SQL 新增 ${addedSql} 条${ignored ? `，忽略 ${ignored} 条无效题号` : ''}`,
      )
    } catch {
      setProgressNotice('导入失败：请选择本站导出的进度 JSON 文件')
    }
  }

  // 在当前筛选结果内按顺序跳转，让「学完一题接着下一题」不必回列表找位置。
  const currentIndex = filtered.findIndex(p => String(p.id) === String(selected?.id))
  const previousProblem = currentIndex > 0 ? filtered[currentIndex - 1] : undefined
  // 当前题可能已被筛掉（例如在「未完成」视图里刚标记完成），
  // 此时把「下一题」指向筛选结果的第一项，避免导航变成死路。
  const nextProblem = currentIndex >= 0
    ? (currentIndex < filtered.length - 1 ? filtered[currentIndex + 1] : undefined)
    : filtered[0]
  // 提前拉取相邻题目所在模块，让翻页几乎无等待。
  useEffect(() => {
    prefetchLesson(nextProblem?.id)
    prefetchLesson(previousProblem?.id)
  }, [nextProblem?.id, previousProblem?.id])
  function openRandom() {
    const pool = filtered.filter(p => String(p.id) !== String(selected?.id))
    const candidates = pool.length ? pool : filtered
    if (!candidates.length) return
    openProblem(candidates[Math.floor(Math.random() * candidates.length)].id)
  }
  // 列表内用上下方向键切换题目，长列表不必一直滚鼠标。
  function handleListKeys(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const target = event.key === 'ArrowDown' ? nextProblem : previousProblem
    if (!target) return
    event.preventDefault()
    setSelectedId(target.id)
    // 让新选中项进入可视区域并接管焦点，否则连续按键时焦点会留在原处、
    // 选中行也可能滚出视野。
    const row = event.currentTarget.querySelector<HTMLButtonElement>(`[data-problem-id="${target.id}"]`)
    row?.scrollIntoView({ block: 'nearest' })
    row?.focus()
  }
  const officialUrl = selected ? selected.url ?? selected.link ?? `https://leetcode.cn/problems/${selected.slug ?? selected.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/` : '#'

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">LC</div><div><strong>LeetCode 500</strong><small>结构化算法训练营</small></div></div>
      <div className="side-label">{isSql ? 'SQL 学习进度' : '算法学习进度'}</div>
      <div className="progress-ring" style={{ '--progress': activeProgress } as React.CSSProperties}><div className="progress-value"><b>{activeProgress}%</b><span>{activeDone} / {activeTotal} 已完成</span></div></div>
      <div className="side-stats">
        {['简单', '中等', '困难'].map(level => {
          const scoped = difficultyStats.filter(item => item.level === level)
          return <div key={level}><span className={`dot ${level}`}/><span>{level}</span><b>{scoped.filter(item => item.done).length}/{scoped.length}</b></div>
        })}
      </div>
      <nav>
        <button className={`nav-item ${isSql ? '' : 'active'}`} onClick={() => setMode('algorithm')} aria-current={isSql ? undefined : 'page'}>
          ⌁<span>算法题库</span><i>{completed.size}/{totalProblems}</i>
        </button>
        <button className={`nav-item ${isSql ? 'active' : ''}`} onClick={() => setMode('sql')} aria-current={isSql ? 'page' : undefined}>
          ⛁<span>SQL 题库</span><i>{sqlCompleted.size}/{totalSqlProblems}</i>
        </button>
      </nav>
      <div className="progress-io">
        <div className="side-label">进度备份</div>
        <div className="progress-io-actions">
          <button onClick={exportProgress} disabled={!completed.size} title="把完成记录导出为 JSON 文件">↓ 导出</button>
          <button onClick={() => importInput.current?.click()} title="从 JSON 文件合并完成记录">↑ 导入</button>
        </div>
        <input ref={importInput} type="file" accept="application/json,.json" className="sr-only" aria-label="导入学习进度文件"
          onChange={event => { const file = event.target.files?.[0]; if (file) void importProgress(file); event.target.value = '' }} />
        <p className="progress-io-note" role="status" aria-live="polite">{progressNotice || '进度保存在当前浏览器，导出可跨设备迁移。'}</p>
      </div>
      <div className="side-tip"><b>今日建议</b><p>理解比刷题更重要。完成一道题后，尝试不看代码复述核心不变量。</p></div>
    </aside>

    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">{isSql ? 'SQL INTERVIEW COLLECTION' : 'TOP INTERVIEW COLLECTION'}</p>
          <h1>{isSql ? '把 SQL 写成一种直觉' : '把 500 道题，学成一套方法'}</h1>
        </div>
        <div className="header-progress"><b>{activeDone}</b><span>已掌握</span><i>/</i><b>{activeTotal}</b><span>总题数</span></div>
      </header>
      {isSql ? <SqlWorkspace completed={sqlCompleted} onToggleDone={toggleSqlDone}/> : <section className="workspace">
        <div className={`catalog ${mobileFilters ? 'show-filters' : ''}`}>
          <div className="catalog-head"><div><h2>题目地图</h2><span>{filtered.length} 道匹配</span></div><button className="filter-toggle" onClick={() => setMobileFilters(v => !v)}>筛选</button></div>
          <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索题号、题目、标签…"/></label>
          <div className="filters">
            <select value={category} onChange={e => setCategory(e.target.value)} aria-label="按分类筛选">{categories.map(item => <option key={item}>{item}</option>)}</select>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} aria-label="按难度筛选"><option>全部</option><option>简单</option><option>中等</option><option>困难</option></select>
            <select value={status} onChange={e => setStatus(e.target.value as typeof status)} aria-label="按完成状态筛选"><option>全部</option><option>未完成</option><option>已完成</option></select>
            <button className="shuffle" onClick={openRandom} disabled={!filtered.length} title="在当前筛选范围内随机选一题">🎲 随机</button>
          </div>
          <div className="problem-list" onKeyDown={handleListKeys}>{filtered.length ? filtered.map(problem => <button key={problem.id} data-problem-id={problem.id} onClick={() => openProblem(problem.id)} className={`problem-row ${String(selected?.id) === String(problem.id) ? 'selected' : ''}`}>
            <span className={`check ${completed.has(String(problem.id)) ? 'done' : ''}`}>{completed.has(String(problem.id)) ? '✓' : ''}</span>
            <span className="problem-copy"><b><em>{problem.id}.</em> {problem.titleZh ?? problem.titleCn ?? problem.title}</b><small>{problem.category} · {(problem.tags ?? []).slice(0, 2).join(' / ') || '核心题型'}</small></span>
            <span className={`difficulty ${difficultyLabel(problem.difficulty)}`}>{difficultyLabel(problem.difficulty)}</span>
          </button>) : <div className="empty">没有匹配题目<br/><button onClick={() => { setQuery(''); setCategory('全部'); setDifficulty('全部'); setStatus('全部') }}>清除筛选</button></div>}</div>
        </div>
        <article className="lesson-panel">{selected ? <>
          <div className="lesson-hero"><div className="lesson-meta"><span className={`difficulty ${difficultyLabel(selected.difficulty)}`}>{difficultyLabel(selected.difficulty)}</span><span>{selected.category}</span><span>第 {selected.id} 题</span></div><h2>{selected.titleZh ?? selected.titleCn ?? selected.title}</h2><p>{selected.title}</p><div className="hero-actions"><button className={completed.has(String(selected.id)) ? 'complete done' : 'complete'} onClick={() => toggleDone(selected.id)}>{completed.has(String(selected.id)) ? '✓ 已完成' : '○ 标记完成'}</button><a href={officialUrl} target="_blank" rel="noreferrer">前往官方题目 ↗</a></div></div>
          {lesson
            ? <DeepLesson problemId={selected.id} lesson={lesson} trace={trace} currentTrace={currentTrace} traceStep={traceStep} setTraceStep={setTraceStep} onRelated={openProblem}/>
            : lessonLoading ? <LessonSkeleton/>
            : lessonFailed ? <LessonLoadError onRetry={() => setLessonRetry(value => value + 1)}/>
            : <GenericLesson category={selected.category}/>}
          <nav className="lesson-nav" aria-label="题目导航">
            <button onClick={() => previousProblem && openProblem(previousProblem.id)} disabled={!previousProblem}>
              ← 上一题{previousProblem && <span>{previousProblem.id}. {previousProblem.titleZh ?? previousProblem.title}</span>}
            </button>
            <span className="lesson-nav-position">{currentIndex >= 0 ? `${currentIndex + 1} / ${filtered.length}` : `不在当前筛选内 · 共 ${filtered.length} 道`}</span>
            <button onClick={() => nextProblem && openProblem(nextProblem.id)} disabled={!nextProblem}>
              下一题 →{nextProblem && <span>{nextProblem.id}. {nextProblem.titleZh ?? nextProblem.title}</span>}
            </button>
          </nav>
        </> : <div className="empty detail-empty"><b>等待题目数据</b><p>从左侧选择一道题，开始结构化学习。</p></div>}</article>
      </section>}
    </main>
  </div>
}
function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="lesson-section"><div className="section-title"><span>{number}</span><h3>{title}</h3></div>{children}</section>
}

function DeepLesson({ problemId, lesson, trace, currentTrace, traceStep, setTraceStep, onRelated }: { problemId: number | string; lesson: Lesson; trace: Trace[]; currentTrace?: Trace; traceStep: number; setTraceStep: React.Dispatch<React.SetStateAction<number>>; onRelated: (id: number | string) => void }) {
  return <div className="lesson-content">
    <Section number="01" title="题意摘要"><p className="lead">{lesson.summary ?? '先识别输入与输出，再把题目约束翻译成可执行条件。'}</p>
      {!!lesson.constraints?.length && <ul className="constraints">{lesson.constraints.map(item => <li key={item}>{item}</li>)}</ul>}
      {(lesson.examples ?? []).map((example, index) => <div className="example" key={index}><b>示例 {index + 1}</b><pre><span>输入：</span>{example.input ?? '—'}{`\n`}<span>输出：</span>{example.output ?? '—'}</pre>{example.explanation && <p>{example.explanation}</p>}</div>)}
    </Section>
    <Section number="02" title="从直觉到最优解"><div className="insight"><span>INTUITION</span><p>{lesson.intuition ?? '先寻找数据之间稳定不变的关系，并让数据结构替我们保存历史信息。'}</p></div>
      <div className="approach-grid"><div><span className="approach-label muted-label">朴素起点</span><h4>暴力思考</h4><p>{lesson.bruteForce ?? '枚举所有可能并逐一验证，先得到正确性基线。'}</p></div><div className="optimized"><span className="approach-label">推荐路径</span><h4>优化突破</h4><p>{lesson.optimization ?? lesson.approach?.join('；') ?? '消除重复计算，把已经获得的信息缓存或组织起来。'}</p></div></div>
    </Section>
    <Section number="03" title="解题步骤"><ol className="steps">{(lesson.steps ?? lesson.approach ?? ['确认边界与状态', '执行核心转移', '返回满足条件的结果']).map((step, index) => <li key={index}><span>{index + 1}</span><p>{step}</p></li>)}</ol></Section>
    <Section number="04" title="Python 实现与在线练习"><PythonPlayground problemId={problemId} initialCode={lesson.code ?? '# 写下你的解法\nclass Solution:\n    def solve(self, nums):\n        pass'} examples={lesson.examples}/></Section>
    <Section number="05" title="逐步运行">{trace.length ? <div className="trace-card"><div className="trace-top"><div><span>STEP {traceStep + 1} / {trace.length}</span><h4>{currentTrace?.title ?? `执行第 ${traceStep + 1} 步`}</h4></div><div><button disabled={traceStep === 0} onClick={() => setTraceStep(value => Math.max(0, value - 1))}>← 上一步</button><button disabled={traceStep === trace.length - 1} onClick={() => setTraceStep(value => Math.min(trace.length - 1, value + 1))}>下一步 →</button></div></div><p>{currentTrace?.description}</p>{currentTrace?.variables && <div className="variables">{Object.entries(currentTrace.variables).map(([key, value]) => <div key={key}><span>{key}</span><code>{JSON.stringify(value)}</code></div>)}</div>}<div className="trace-track">{trace.map((_, index) => <button aria-label={`跳到第 ${index + 1} 步`} key={index} className={index <= traceStep ? 'active' : ''} onClick={() => setTraceStep(index)}/>)}</div></div> : <div className="notice">逐步运行数据正在补充。建议先在纸上记录每轮循环后的关键变量。</div>}</Section>
    <Section number="06" title="复杂度与复盘"><div className="complexity"><div><span>时间复杂度</span><b>{lesson.timeComplexity ?? lesson.complexity?.time ?? 'O(n)'}</b></div><div><span>空间复杂度</span><b>{lesson.spaceComplexity ?? lesson.complexity?.space ?? 'O(1)'}</b></div></div>
      <h4 className="subheading">易错点</h4><ul className="pitfalls">{(lesson.pitfalls ?? ['忽略空输入或最小规模', '没有验证循环边界']).map((item, index) => <li key={index}><span>!</span>{item}</li>)}</ul>
      {!!lesson.related?.length && <><h4 className="subheading">关联练习</h4><div className="related">{lesson.related.map(item => { const id = relatedProblemId(item); return <button key={String(item)} onClick={() => id && onRelated(id)} disabled={!id}>{String(item)} <span>{id ? '打开题目 →' : '延伸阅读'}</span></button> })}</div></>}
    </Section>
  </div>
}

function LessonSkeleton() {
  return <div className="lesson-content" aria-busy="true" aria-live="polite">
    <span className="sr-only">讲义加载中</span>
    <div className="skeleton-block" style={{ height: 22, width: '38%' }}/>
    <div className="skeleton-block" style={{ height: 74 }}/>
    <div className="skeleton-block" style={{ height: 22, width: '30%' }}/>
    <div className="skeleton-block" style={{ height: 130 }}/>
    <div className="skeleton-block" style={{ height: 22, width: '34%' }}/>
    <div className="skeleton-block" style={{ height: 180 }}/>
  </div>
}

function LessonLoadError({ onRetry }: { onRetry: () => void }) {
  return <div className="lesson-content">
    <div className="notice load-error" role="alert">
      <b>讲义加载失败</b>
      <p>这道题的讲义内容按需加载，刚才的请求没有成功，通常是网络中断导致。</p>
      <button onClick={onRetry}>重新加载</button>
    </div>
  </div>
}

function GenericLesson({ category }: { category: string }) {
  const framework = frameworks[category] ?? frameworks.默认
  return <div className="lesson-content generic"><div className="unlock"><span>ROUTE IN PROGRESS</span><h3>核心讲义正在按路线解锁</h3><p>这道题的深度拆解仍在编写中。在讲义上线前，先使用「{category}」通用框架完成一次主动推导。</p></div>
    <Section number="01" title={`${category} · 通用学习框架`}><ol className="steps">{framework.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></Section>
    <Section number="02" title="自主推导清单"><div className="checklist">{['我能用一句话复述题目目标', '我写出了最直接的暴力方案', '我找到了重复计算或冗余扫描', '我能解释优化方案为何正确', '我验证了空值、重复值与极端输入'].map(item => <label key={item}><input type="checkbox"/><span>{item}</span></label>)}</div></Section>
    <div className="notice">提示：完成自主推导后点击顶部「标记完成」，进度会保存在当前浏览器。</div>
  </div>
}

export default App

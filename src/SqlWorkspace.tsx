import { useEffect, useMemo, useState } from 'react'
import type * as React from 'react'
import { sqlProblems } from './data/sql/catalog'
import type { SqlLesson } from './data/sql/types'
import SqlLessonView from './SqlLessonView'

/** SQL 讲义整体作为一个按需加载的模块，首屏只带目录 */
let lessonCache: Record<string, SqlLesson> | null = null
let lessonRequest: Promise<Record<string, SqlLesson>> | null = null
function loadSqlLessons() {
  if (lessonCache) return Promise.resolve(lessonCache)
  lessonRequest ??= import('./data/sql/lessons').then(module => {
    lessonCache = module.sqlLessons
    return lessonCache
  })
  return lessonRequest
}

const difficultyLabel = (value: string) => ({ Easy: '简单', Medium: '中等', Hard: '困难' }[value] ?? value)
const problemIds = new Set(sqlProblems.map(problem => problem.id))

type Props = {
  completed: Set<string>
  onToggleDone: (id: number) => void
}

export default function SqlWorkspace({ completed, onToggleDone }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [difficulty, setDifficulty] = useState('全部')
  const [status, setStatus] = useState<'全部' | '未完成' | '已完成'>('全部')
  const [selectedId, setSelectedId] = useState<number | null>(sqlProblems[0]?.id ?? null)
  const [lesson, setLesson] = useState<SqlLesson | undefined>(() =>
    selectedId !== null ? lessonCache?.[String(selectedId)] : undefined)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  const [mobileFilters, setMobileFilters] = useState(false)

  const categories = useMemo(
    () => ['全部', ...new Set(sqlProblems.map(problem => problem.category))],
    [],
  )
  const filtered = useMemo(() => sqlProblems.filter(problem => {
    const text = `${problem.id} ${problem.title} ${problem.titleEn} ${problem.category}`.toLowerCase()
    const done = completed.has(String(problem.id))
    return text.includes(query.trim().toLowerCase())
      && (category === '全部' || problem.category === category)
      && (difficulty === '全部' || difficultyLabel(problem.difficulty) === difficulty)
      && (status === '全部' || (status === '已完成' ? done : !done))
  }).sort((a, b) => a.id - b.id), [query, category, difficulty, status, completed])

  const selected = sqlProblems.find(problem => problem.id === selectedId) ?? filtered[0]

  useEffect(() => {
    if (!selected) { setLesson(undefined); setLoading(false); setFailed(false); return }
    const cached = lessonCache?.[String(selected.id)]
    if (cached) { setLesson(cached); setLoading(false); setFailed(false); return }
    let cancelled = false
    setLesson(undefined)
    setFailed(false)
    setLoading(true)
    loadSqlLessons()
      .then(map => { if (!cancelled) { setLesson(map[String(selected.id)]); setLoading(false) } })
      .catch(() => { if (!cancelled) { setLoading(false); setFailed(true) } })
    return () => { cancelled = true }
  }, [selected?.id, retry])

  const currentIndex = filtered.findIndex(problem => problem.id === selected?.id)
  const previous = currentIndex > 0 ? filtered[currentIndex - 1] : undefined
  const next = currentIndex >= 0
    ? (currentIndex < filtered.length - 1 ? filtered[currentIndex + 1] : undefined)
    : filtered[0]

  function open(id: number) {
    setSelectedId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function openRelated(id: number) {
    if (problemIds.has(id)) open(id)
  }
  function openRandom() {
    const pool = filtered.filter(problem => problem.id !== selected?.id)
    const candidates = pool.length ? pool : filtered
    if (candidates.length) open(candidates[Math.floor(Math.random() * candidates.length)].id)
  }
  function handleListKeys(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const target = event.key === 'ArrowDown' ? next : previous
    if (!target) return
    event.preventDefault()
    setSelectedId(target.id)
    const row = event.currentTarget.querySelector<HTMLButtonElement>(`[data-problem-id="${target.id}"]`)
    row?.scrollIntoView({ block: 'nearest' })
    row?.focus()
  }

  const officialUrl = selected ? `https://leetcode.cn/problems/${selected.slug}/` : '#'
  const isDone = selected ? completed.has(String(selected.id)) : false

  return <section className="workspace">
    <div className={`catalog ${mobileFilters ? 'show-filters' : ''}`}>
      <div className="catalog-head">
        <div><h2>SQL 题库</h2><span>{filtered.length} 道匹配</span></div>
        <button className="filter-toggle" onClick={() => setMobileFilters(value => !value)}>筛选</button>
      </div>
      <label className="search"><span>⌕</span>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索题号、题目、考点…"/>
      </label>
      <div className="filters">
        <select value={category} onChange={event => setCategory(event.target.value)} aria-label="按考点筛选">
          {categories.map(item => <option key={item}>{item}</option>)}
        </select>
        <select value={difficulty} onChange={event => setDifficulty(event.target.value)} aria-label="按难度筛选">
          <option>全部</option><option>简单</option><option>中等</option><option>困难</option>
        </select>
        <select value={status} onChange={event => setStatus(event.target.value as typeof status)} aria-label="按完成状态筛选">
          <option>全部</option><option>未完成</option><option>已完成</option>
        </select>
        <button className="shuffle" onClick={openRandom} disabled={!filtered.length} title="在当前筛选范围内随机选一题">🎲 随机</button>
      </div>
      <div className="problem-list" onKeyDown={handleListKeys}>
        {filtered.length ? filtered.map(problem => <button key={problem.id} data-problem-id={problem.id}
          onClick={() => open(problem.id)}
          className={`problem-row ${selected?.id === problem.id ? 'selected' : ''}`}>
          <span className={`check ${completed.has(String(problem.id)) ? 'done' : ''}`}>{completed.has(String(problem.id)) ? '✓' : ''}</span>
          <span className="problem-copy"><b><em>{problem.id}.</em> {problem.title}</b><small>{problem.category}</small></span>
          <span className={`difficulty ${difficultyLabel(problem.difficulty)}`}>{difficultyLabel(problem.difficulty)}</span>
        </button>) : <div className="empty">没有匹配题目<br/>
          <button onClick={() => { setQuery(''); setCategory('全部'); setDifficulty('全部'); setStatus('全部') }}>清除筛选</button>
        </div>}
      </div>
    </div>

    <article className="lesson-panel">{selected ? <>
      <div className="lesson-hero">
        <div className="lesson-meta">
          <span className={`difficulty ${difficultyLabel(selected.difficulty)}`}>{difficultyLabel(selected.difficulty)}</span>
          <span>{selected.category}</span>
          <span>第 {selected.id} 题</span>
        </div>
        <h2>{selected.title}</h2>
        <p>{selected.titleEn}</p>
        <div className="hero-actions">
          <button className={isDone ? 'complete done' : 'complete'} onClick={() => onToggleDone(selected.id)}>
            {isDone ? '✓ 已完成' : '○ 标记完成'}
          </button>
          <a href={officialUrl} target="_blank" rel="noreferrer">前往官方题目 ↗</a>
        </div>
      </div>

      {lesson ? <SqlLessonView lesson={lesson} onRelated={openRelated}/>
        : loading ? <div className="lesson-content" aria-busy="true">
            <span className="sr-only">讲义加载中</span>
            <div className="skeleton-block" style={{ height: 22, width: '34%' }}/>
            <div className="skeleton-block" style={{ height: 90 }}/>
            <div className="skeleton-block" style={{ height: 22, width: '28%' }}/>
            <div className="skeleton-block" style={{ height: 170 }}/>
          </div>
        : failed ? <div className="lesson-content"><div className="notice load-error" role="alert">
            <b>讲义加载失败</b>
            <p>SQL 讲义按需加载，刚才的请求没有成功，通常是网络中断导致。</p>
            <button onClick={() => setRetry(value => value + 1)}>重新加载</button>
          </div></div>
        : <div className="lesson-content"><div className="notice">这道题的讲义还在编写中。</div></div>}

      <nav className="lesson-nav" aria-label="题目导航">
        <button onClick={() => previous && open(previous.id)} disabled={!previous}>
          ← 上一题{previous && <span>{previous.id}. {previous.title}</span>}
        </button>
        <span className="lesson-nav-position">
          {currentIndex >= 0 ? `${currentIndex + 1} / ${filtered.length}` : `不在当前筛选内 · 共 ${filtered.length} 道`}
        </span>
        <button onClick={() => next && open(next.id)} disabled={!next}>
          下一题 →{next && <span>{next.id}. {next.title}</span>}
        </button>
      </nav>
    </> : <div className="empty detail-empty"><b>等待题目数据</b><p>从左侧选择一道题开始练习 SQL。</p></div>}</article>
  </section>
}

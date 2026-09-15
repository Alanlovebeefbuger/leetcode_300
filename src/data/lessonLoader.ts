/**
 * 讲义按需加载。
 *
 * 500 篇讲义正文（题意、代码、推演、复杂度）合计体积很大，但用户一次只看一题。
 * 这里按题号查索引表，只动态加载它所在的那个模块，并缓存已加载的模块，
 * 使首屏只需下载壳与索引，切题时才拉取对应讲义。
 */
import { lessonSource, type LessonSource } from './lessonIndex'

type LessonRecord = Record<string, unknown>

const loaders: Record<LessonSource, () => Promise<LessonRecord>> = {
  core: () => import('./lessons').then(m => m.lessons as unknown as LessonRecord),
  b1: () => import('./lessons-batch-1').then(m => m.lessonsBatch1 as unknown as LessonRecord),
  b2: () => import('./lessons-batch-2').then(m => m.lessonsBatch2 as unknown as LessonRecord),
  b3: () => import('./lessons-batch-3').then(m => m.lessonsBatch3 as unknown as LessonRecord),
  b4: () => import('./lessons-batch-4').then(m => m.lessonsBatch4 as unknown as LessonRecord),
  b5: () => import('./lessons-batch-5').then(m => m.lessonsBatch5 as unknown as LessonRecord),
  b6: () => import('./lessons-batch-6').then(m => m.lessonsBatch6 as unknown as LessonRecord),
  b7: () => import('./lessons-batch-7').then(m => m.lessonsBatch7 as unknown as LessonRecord),
  b8: () => import('./lessons-batch-8').then(m => m.lessonsBatch8 as unknown as LessonRecord),
  b9: () => import('./lessons-batch-9').then(m => m.lessonsBatch9 as unknown as LessonRecord),
  b10: () => import('./lessons-batch-10').then(m => m.lessonsBatch10 as unknown as LessonRecord),
  b11: () => import('./lessons-batch-11').then(m => m.lessonsBatch11 as unknown as LessonRecord),
  b12: () => import('./lessons-batch-12').then(m => m.lessonsBatch12 as unknown as LessonRecord),
  b13: () => import('./lessons-batch-13').then(m => m.lessonsBatch13 as unknown as LessonRecord),
  b14: () => import('./lessons-batch-14').then(m => m.lessonsBatch14 as unknown as LessonRecord),
  b15: () => import('./lessons-batch-15').then(m => m.lessonsBatch15 as unknown as LessonRecord),
  b16: () => import('./lessons-batch-16').then(m => m.lessonsBatch16 as unknown as LessonRecord),
}

/** 已解析的模块内容，避免同一批次重复请求 */
const moduleCache = new Map<LessonSource, LessonRecord>()
/** 进行中的请求，保证并发调用共享同一个 Promise */
const inflight = new Map<LessonSource, Promise<LessonRecord>>()

function loadModule(source: LessonSource): Promise<LessonRecord> {
  const cached = moduleCache.get(source)
  if (cached) return Promise.resolve(cached)

  const pending = inflight.get(source)
  if (pending) return pending

  const request = loaders[source]()
    .then(content => {
      moduleCache.set(source, content)
      inflight.delete(source)
      return content
    })
    .catch(error => {
      inflight.delete(source)
      throw error
    })
  inflight.set(source, request)
  return request
}

/** 题目讲义是否已在内存中，可用于同步渲染而不闪烁加载态 */
export function getLoadedLesson<T>(problemId: number | string): T | undefined {
  const source = lessonSource[String(problemId)]
  if (!source) return undefined
  return moduleCache.get(source)?.[String(problemId)] as T | undefined
}

export async function loadLesson<T>(problemId: number | string): Promise<T | undefined> {
  const key = String(problemId)
  const source = lessonSource[key]
  if (!source) return undefined
  const content = await loadModule(source)
  return content[key] as T | undefined
}

/** 预取某题所在模块，用于提前加载相邻题目，让翻页几乎无感 */
export function prefetchLesson(problemId: number | string | undefined): void {
  if (problemId === undefined) return
  const source = lessonSource[String(problemId)]
  if (!source || moduleCache.has(source)) return
  void loadModule(source).catch(() => {})
}

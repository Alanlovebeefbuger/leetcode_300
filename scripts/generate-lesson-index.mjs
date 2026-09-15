#!/usr/bin/env node
/**
 * 生成 src/data/lessonIndex.ts：题号 → 讲义所在模块的映射。
 *
 * 讲义按批次分文件存放并按需加载，索引表让首屏无需引入全部讲义正文。
 * 新增或调整讲义后请运行 `npm run lesson-index` 重新生成；
 * `npm run lesson-index:check` 只校验现有索引是否与讲义文件一致，不写入。
 *
 * 合并优先级与运行时一致：批次 1..16 先展开，核心讲义 lessons.ts 最后覆盖。
 */
import fs from 'node:fs'
import path from 'node:path'

const dataDir = path.join('src', 'data')
const indexFile = path.join(dataDir, 'lessonIndex.ts')

/** [模块键, 文件名]，顺序即覆盖顺序，后者覆盖前者 */
const modules = [
  ...Array.from({ length: 16 }, (_, i) => [`b${i + 1}`, `lessons-batch-${i + 1}.ts`]),
  ['core', 'lessons.ts'],
]

/**
 * 讲义对象的顶层键是行首的题号，各批次文件缩进不统一（0 或 2 空格），
 * 因此按「行首若干空白 + 数字 + 冒号」匹配。讲义字段名均为标识符，不会误匹配。
 */
function readLessonIds(file) {
  const text = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const ids = [...text.matchAll(/^[ \t]*(\d+):/gm)].map(match => match[1])
  if (!ids.length) throw new Error(`${file} 中没有解析到任何题号`)
  return ids
}

const owner = new Map()
for (const [key, file] of modules) {
  for (const id of readLessonIds(file)) owner.set(id, key)
}

const sortedIds = [...owner.keys()].sort((a, b) => Number(a) - Number(b))
const content = `/**
 * 题号 → 讲义所在模块的索引。
 *
 * 本文件由 scripts/generate-lesson-index.mjs 生成，请勿手工编辑。
 * 新增讲义后运行 \`npm run lesson-index\` 重新生成。
 *
 * 讲义正文体积很大，全部打进首屏没有必要（用户一次只看一题）。
 * 这张表只保存题号到模块的映射，供 lessonLoader 按需动态加载对应模块。
 * 若某题同时存在于批次与核心讲义，这里记录的是最终生效的那一份（核心讲义优先）。
 */

export type LessonSource =
${modules.map(([key]) => `  | '${key}'`).join('\n')}

export const lessonSource: Record<string, LessonSource> = {
${sortedIds.map(id => `  ${id}: '${owner.get(id)}',`).join('\n')}
}
`

const checkOnly = process.argv.includes('--check')
const existing = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, 'utf8') : ''

if (checkOnly) {
  if (existing !== content) {
    console.error('lessonIndex.ts 与讲义文件不一致，请运行 npm run lesson-index 重新生成。')
    process.exit(1)
  }
  console.log(`lessonIndex.ts 已是最新，覆盖 ${sortedIds.length} 道题。`)
} else {
  fs.writeFileSync(indexFile, content)
  const coreCount = sortedIds.filter(id => owner.get(id) === 'core').length
  console.log(`已生成 lessonIndex.ts：${sortedIds.length} 道题，其中 ${coreCount} 道使用核心讲义。`)
}

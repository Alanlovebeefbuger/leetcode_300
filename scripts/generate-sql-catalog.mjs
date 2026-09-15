#!/usr/bin/env node
/**
 * 生成 src/data/sql/catalog.ts：SQL 题目的精简目录。
 *
 * 讲义正文（建表语句、数据、参考答案、解析）体积较大且按需加载，
 * 但题目列表需要立刻显示，因此把列表所需的少量字段单独生成一份。
 *
 * 用法：npm run sql-catalog      重新生成
 *       npm run sql-catalog:check 只校验是否与讲义一致
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const catalogFile = path.join('src', 'data', 'sql', 'catalog.ts')
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sqlcatalog-'))
const entry = path.join(tempDir, 'entry.ts')
const bundle = path.join(tempDir, 'bundle.mjs')

fs.writeFileSync(entry, `export { sqlLessons } from ${JSON.stringify(path.resolve('src/data/sql/lessons.ts'))}\n`)
execFileSync('npx', ['esbuild', entry, '--bundle', '--platform=node', '--format=esm', `--outfile=${bundle}`, '--log-level=warning'], { stdio: 'inherit' })
const { sqlLessons } = await import(bundle)
fs.rmSync(tempDir, { recursive: true, force: true })

const rows = Object.values(sqlLessons)
  .sort((a, b) => a.id - b.id)
  .map(lesson => `  { id: ${lesson.id}, title: ${JSON.stringify(lesson.title)}, titleEn: ${JSON.stringify(lesson.titleEn)}, slug: ${JSON.stringify(lesson.slug)}, difficulty: '${lesson.difficulty}', category: ${JSON.stringify(lesson.category)} },`)
  .join('\n')

const content = `/**
 * SQL 题目目录。
 *
 * 本文件由 scripts/generate-sql-catalog.mjs 生成，请勿手工编辑。
 * 增删 SQL 讲义后运行 \`npm run sql-catalog\` 重新生成。
 */

export type SqlProblem = {
  id: number
  title: string
  titleEn: string
  slug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
}

export const sqlProblems: SqlProblem[] = [
${rows}
]
`

const checkOnly = process.argv.includes('--check')
const existing = fs.existsSync(catalogFile) ? fs.readFileSync(catalogFile, 'utf8') : ''
if (checkOnly) {
  if (existing !== content) {
    console.error('catalog.ts 与 SQL 讲义不一致，请运行 npm run sql-catalog 重新生成。')
    process.exit(1)
  }
  console.log(`catalog.ts 已是最新，覆盖 ${Object.keys(sqlLessons).length} 道 SQL 题。`)
} else {
  fs.writeFileSync(catalogFile, content)
  console.log(`已生成 catalog.ts：${Object.keys(sqlLessons).length} 道 SQL 题。`)
}

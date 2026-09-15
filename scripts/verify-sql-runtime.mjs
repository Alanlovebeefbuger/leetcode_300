#!/usr/bin/env node
/**
 * 校验 SQL 运行时链路：复刻 sql.worker.ts 的执行方式（事务内建表、跑 SQL、回滚），
 * 并用 compare.ts 的判定逻辑验证。
 *
 * 重点检查三件事：
 *   1. 事务回滚能否真正隔离两次运行（上一次的写操作不能影响下一次）
 *   2. 正确答案判定为通过
 *   3. 各类错误答案（少列、错列名、少行、多行、值错、顺序错）都能被判定为不通过
 *
 * 用法：npm run sql:runtime
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { PGlite } from '@electric-sql/pglite'

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sqlruntime-'))
const entry = path.join(tempDir, 'entry.ts')
const bundle = path.join(tempDir, 'bundle.mjs')
fs.writeFileSync(entry, `export { sqlLessons } from ${JSON.stringify(path.resolve('src/data/sql/lessons.ts'))}
export { compareResultSets } from ${JSON.stringify(path.resolve('src/data/sql/compare.ts'))}
`)
execFileSync('npx', ['esbuild', entry, '--bundle', '--platform=node', '--format=esm', `--outfile=${bundle}`, '--log-level=warning'], { stdio: 'inherit' })
const { sqlLessons, compareResultSets } = await import(bundle)
fs.rmSync(tempDir, { recursive: true, force: true })

const toResultSet = (result) => {
  const columns = (result?.fields ?? []).map((f) => f.name)
  return { columns, rows: (result?.rows ?? []).map((row) => columns.map((c) => row[c])) }
}

// 与 sql.worker.ts 完全相同的执行流程
const db = await PGlite.create()
async function runLikeWorker(lesson, sql) {
  await db.exec('BEGIN')
  try {
    await db.exec(lesson.schema)
    if (lesson.seed.trim()) await db.exec(lesson.seed)
    const executed = await db.exec(sql)
    let payload = toResultSet(executed[executed.length - 1])
    if (lesson.kind === 'mutation' && lesson.verifyQuery) {
      payload = toResultSet(await db.query(lesson.verifyQuery))
    }
    return { ok: true, ...payload }
  } catch (error) {
    return { ok: false, columns: [], rows: [], error: error.message.split('\n')[0] }
  } finally {
    await db.exec('ROLLBACK').catch(() => {})
  }
}

const checks = []
const record = (name, ok, detail = '') => checks.push([name, ok ? 'PASS' : 'FAIL', detail])

// 1. 所有题的参考答案在 worker 流程下判定为通过
let solved = 0
for (const lesson of Object.values(sqlLessons)) {
  const result = await runLikeWorker(lesson, lesson.solution)
  if (!result.ok) { record(`${lesson.id} 参考答案可执行`, false, result.error); continue }
  const verdict = compareResultSets({ columns: result.columns, rows: result.rows }, lesson.expected, lesson.orderMatters)
  if (verdict.ok) solved += 1
  else record(`${lesson.id} 参考答案判定通过`, false, verdict.reason)
}
record(`全部 ${Object.keys(sqlLessons).length} 题参考答案在 worker 流程下通过`, solved === Object.keys(sqlLessons).length, `通过 ${solved}`)

// 2. 事务隔离：连续运行写操作题两次，第二次应看到原始数据
const mutation = Object.values(sqlLessons).find((l) => l.kind === 'mutation')
if (mutation) {
  const first = await runLikeWorker(mutation, mutation.solution)
  const second = await runLikeWorker(mutation, mutation.verifyQuery)
  const seedRows = second.rows.length
  record('写操作题回滚后数据恢复原状', first.ok && seedRows === 3, `第二次运行看到 ${seedRows} 行（应为 3 行原始数据）`)
  // 误删表这类破坏性操作：本次判定失败，但不能污染后续运行
  const dropped = await runLikeWorker(mutation, 'DROP TABLE Person')
  const after = await runLikeWorker(mutation, mutation.verifyQuery)
  record('DROP TABLE 本次判定失败但不崩溃', dropped.ok === false && !!dropped.error, dropped.error ?? '')
  record('DROP TABLE 后下一次运行数据完好', after.ok && after.rows.length === 3, `后续看到 ${after.rows.length} 行`)
}

// 3. 各类错误答案必须被判定为不通过
const target = sqlLessons['184']
const wrongCases = [
  ['少一列', 'SELECT d.name AS "Department", e.name AS "Employee" FROM Employee e JOIN Department d ON e.departmentId = d.id'],
  ['列名拼错', 'SELECT d.name AS "Dept", e.name AS "Employee", e.salary AS "Salary" FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId)'],
  ['漏掉并列最高（少行）', `SELECT d.name AS "Department", e.name AS "Employee", e.salary AS "Salary" FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE e.id IN (SELECT MIN(id) FROM Employee e2 WHERE e2.salary = (SELECT MAX(salary) FROM Employee e3 WHERE e3.departmentId = e2.departmentId) GROUP BY e2.departmentId)`],
  ['没过滤最高薪（多行）', 'SELECT d.name AS "Department", e.name AS "Employee", e.salary AS "Salary" FROM Employee e JOIN Department d ON e.departmentId = d.id'],
  ['跨部门误判', 'SELECT d.name AS "Department", e.name AS "Employee", e.salary AS "Salary" FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE e.salary = (SELECT MAX(salary) FROM Employee)'],
]
for (const [name, sql] of wrongCases) {
  const result = await runLikeWorker(target, sql)
  const verdict = result.ok
    ? compareResultSets({ columns: result.columns, rows: result.rows }, target.expected, target.orderMatters)
    : { ok: false, reason: result.error }
  record(`错误答案被拦截：${name}`, verdict.ok === false, verdict.ok ? '被误判为正确' : '')
}

// 4. 顺序敏感题：打乱顺序必须判定失败
const ordered = sqlLessons['196']
if (ordered) {
  const result = await runLikeWorker(ordered, ordered.solution)
  const reversed = { columns: result.columns, rows: [...result.rows].reverse() }
  const verdict = compareResultSets(reversed, ordered.expected, true)
  record('要求排序的题目对行序敏感', verdict.ok === false, verdict.ok ? '逆序仍被判通过' : '')
}

// 5. 语法错误应给出可读信息而不是崩溃
const broken = await runLikeWorker(target, 'SELEC * FROM Employee')
record('语法错误返回可读报错', !broken.ok && !!broken.error, broken.error ?? '')

// 6. 大小写别名：未加引号的别名会被 Postgres 转小写，应仍判通过
const lower = await runLikeWorker(sqlLessons['182'], 'SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(*) > 1')
const lowerVerdict = compareResultSets({ columns: lower.columns, rows: lower.rows }, sqlLessons['182'].expected, false)
record('未加引号别名（被转小写）仍判通过', lowerVerdict.ok, lowerVerdict.ok ? `列名实际为 ${lower.columns}` : lowerVerdict.reason)

await db.close()

const passed = checks.filter((c) => c[1] === 'PASS').length
console.log(`\nSQL 运行时校验：${checks.length} 项  通过 ${passed}\n`)
for (const [name, status, detail] of checks) {
  console.log(`${status === 'PASS' ? '✅' : '❌'} ${name}${detail ? `  — ${detail}` : ''}`)
}
process.exit(passed === checks.length ? 0 : 1)

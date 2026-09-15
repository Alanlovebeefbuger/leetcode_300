/**
 * 结果集比较：用户查询结果与期望结果是否等价。
 *
 * 有三处必须容忍的合理差异：
 * 1. PostgreSQL 会把未加引号的别名转成小写，因此列名按大小写不敏感比较；
 * 2. numeric/decimal 在 PGlite 中以字符串返回，数值需要按数字比较；
 * 3. 题目未要求排序时，行顺序不应影响判定。
 */
import type { SqlResultSet } from './types'

export type CompareResult =
  | { ok: true }
  | { ok: false; reason: string }

const normalizeName = (name: string) => name.trim().toLowerCase()

/** 归一化单元格：统一空值、按数字比较数值型字符串、日期取 ISO 日期部分 */
export function normalizeCell(value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (typeof value === 'boolean') return value
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'number') return Number.isInteger(value) ? value : Number(value.toFixed(6))
  if (typeof value === 'string') {
    const text = value.trim()
    // numeric 类型会以字符串返回，'78000.00' 应与 78000 判定相等
    if (text !== '' && Number.isFinite(Number(text))) {
      const numeric = Number(text)
      return Number.isInteger(numeric) ? numeric : Number(numeric.toFixed(6))
    }
    return text
  }
  return value
}

const rowKey = (row: unknown[]) => JSON.stringify(row.map(normalizeCell))

const cellsEqual = (a: unknown, b: unknown) =>
  JSON.stringify(normalizeCell(a)) === JSON.stringify(normalizeCell(b))

export function compareResultSets(
  actual: SqlResultSet,
  expected: SqlResultSet,
  orderMatters: boolean,
): CompareResult {
  if (actual.columns.length !== expected.columns.length) {
    return {
      ok: false,
      reason: `列数不符：期望 ${expected.columns.length} 列（${expected.columns.join(', ')}），实际 ${actual.columns.length} 列（${actual.columns.join(', ') || '无'}）`,
    }
  }

  const actualNames = actual.columns.map(normalizeName)
  const expectedNames = expected.columns.map(normalizeName)
  for (let i = 0; i < expectedNames.length; i += 1) {
    if (actualNames[i] !== expectedNames[i]) {
      return {
        ok: false,
        reason: `第 ${i + 1} 列列名应为 ${expected.columns[i]}，实际为 ${actual.columns[i]}`,
      }
    }
  }

  if (actual.rows.length !== expected.rows.length) {
    return {
      ok: false,
      reason: `行数不符：期望 ${expected.rows.length} 行，实际 ${actual.rows.length} 行`,
    }
  }

  if (orderMatters) {
    for (let r = 0; r < expected.rows.length; r += 1) {
      for (let c = 0; c < expected.columns.length; c += 1) {
        if (!cellsEqual(actual.rows[r][c], expected.rows[r][c])) {
          return {
            ok: false,
            reason: `第 ${r + 1} 行「${expected.columns[c]}」应为 ${format(expected.rows[r][c])}，实际为 ${format(actual.rows[r][c])}`,
          }
        }
      }
    }
    return { ok: true }
  }

  // 未要求排序：按规范化后的行做多重集合比较
  const remaining = new Map<string, number>()
  for (const row of expected.rows) {
    const key = rowKey(row)
    remaining.set(key, (remaining.get(key) ?? 0) + 1)
  }
  for (const row of actual.rows) {
    const key = rowKey(row)
    const count = remaining.get(key)
    if (!count) {
      return { ok: false, reason: `出现了期望结果中没有的行：${format(row)}` }
    }
    remaining.set(key, count - 1)
  }
  const missing = [...remaining.entries()].find(([, count]) => count > 0)
  if (missing) {
    return { ok: false, reason: `缺少期望结果中的行：${missing[0]}` }
  }
  return { ok: true }
}

export function format(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (Array.isArray(value)) return `[${value.map(format).join(', ')}]`
  if (typeof value === 'string') return value
  return String(value)
}

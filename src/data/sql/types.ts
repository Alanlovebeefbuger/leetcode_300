/** SQL 练习题的数据结构 */

/** 结果集：列名与按列顺序排列的行 */
export type SqlResultSet = {
  columns: string[]
  rows: unknown[][]
}

export type SqlLesson = {
  id: number
  /** 中文题名 */
  title: string
  /** 官方英文题名，用于生成 leetcode.cn 链接 */
  titleEn: string
  slug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  /** 考点分类：基础查询 / 连接 / 聚合与分组 / 子查询 / 窗口函数 / 日期处理 / 字符串处理 / 数据修改 */
  category: string

  /** 建表语句，每次运行前重建，保证环境干净 */
  schema: string
  /** 测试数据 */
  seed: string

  /**
   * query：比较用户查询返回的结果集。
   * mutation：题目考的是 DELETE/UPDATE，执行用户语句后再用 verifyQuery 快照表状态。
   */
  kind: 'query' | 'mutation'
  /** 仅 mutation 题使用：执行用户语句后运行此查询，与 expected 比较 */
  verifyQuery?: string

  /** 题目是否明确要求排序；为 false 时比较前对行做规范化排序 */
  orderMatters: boolean
  expected: SqlResultSet

  /** 参考答案（PostgreSQL 方言） */
  solution: string

  summary: string
  constraints: string[]
  intuition: string
  approach: string[]
  /** 逐步推演：解释查询是如何一步步得出结果的 */
  walkthrough: string[]
  pitfalls: string[]
  /** MySQL 对应写法与方言差异说明 */
  mysqlNote: string
  related: string[]
}

export type SqlLessonMap = Record<string, SqlLesson>

import type { SqlLessonMap } from './types'
import { sqlLessons1 } from './lessons-1'
import { sqlLessons2 } from './lessons-2'
import { sqlLessons3 } from './lessons-3'
import { sqlLessons4 } from './lessons-4'

/** 全部 SQL 讲义。按批次文件维护，这里汇总为单一映射。 */
export const sqlLessons: SqlLessonMap = {
  ...sqlLessons1,
  ...sqlLessons2,
  ...sqlLessons3,
  ...sqlLessons4,
}

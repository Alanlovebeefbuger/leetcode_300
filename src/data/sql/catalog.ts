/**
 * SQL 题目目录。
 *
 * 本文件由 scripts/generate-sql-catalog.mjs 生成，请勿手工编辑。
 * 增删 SQL 讲义后运行 `npm run sql-catalog` 重新生成。
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
  { id: 175, title: "组合两个表", titleEn: "Combine Two Tables", slug: "combine-two-tables", difficulty: 'Easy', category: "连接" },
  { id: 176, title: "第二高的薪水", titleEn: "Second Highest Salary", slug: "second-highest-salary", difficulty: 'Medium', category: "子查询" },
  { id: 178, title: "分数排名", titleEn: "Rank Scores", slug: "rank-scores", difficulty: 'Medium', category: "窗口函数" },
  { id: 180, title: "连续出现的数字", titleEn: "Consecutive Numbers", slug: "consecutive-numbers", difficulty: 'Medium', category: "窗口函数" },
  { id: 181, title: "超过经理收入的员工", titleEn: "Employees Earning More Than Their Managers", slug: "employees-earning-more-than-their-managers", difficulty: 'Easy', category: "连接" },
  { id: 182, title: "查找重复的电子邮箱", titleEn: "Duplicate Emails", slug: "duplicate-emails", difficulty: 'Easy', category: "聚合与分组" },
  { id: 183, title: "从不订购的客户", titleEn: "Customers Who Never Order", slug: "customers-who-never-order", difficulty: 'Easy', category: "子查询" },
  { id: 184, title: "部门工资最高的员工", titleEn: "Department Highest Salary", slug: "department-highest-salary", difficulty: 'Medium', category: "子查询" },
  { id: 185, title: "部门工资前三高的所有员工", titleEn: "Department Top Three Salaries", slug: "department-top-three-salaries", difficulty: 'Hard', category: "窗口函数" },
  { id: 196, title: "删除重复的电子邮箱", titleEn: "Delete Duplicate Emails", slug: "delete-duplicate-emails", difficulty: 'Easy', category: "数据修改" },
  { id: 197, title: "上升的温度", titleEn: "Rising Temperature", slug: "rising-temperature", difficulty: 'Easy', category: "日期处理" },
  { id: 262, title: "行程和用户", titleEn: "Trips and Users", slug: "trips-and-users", difficulty: 'Hard', category: "聚合与分组" },
  { id: 511, title: "游戏玩法分析 I", titleEn: "Game Play Analysis I", slug: "game-play-analysis-i", difficulty: 'Easy', category: "聚合与分组" },
  { id: 550, title: "游戏玩法分析 IV", titleEn: "Game Play Analysis IV", slug: "game-play-analysis-iv", difficulty: 'Medium', category: "日期处理" },
  { id: 570, title: "至少有5名直接下属的经理", titleEn: "Managers with at Least 5 Direct Reports", slug: "managers-with-at-least-5-direct-reports", difficulty: 'Medium', category: "聚合与分组" },
  { id: 577, title: "员工奖金", titleEn: "Employee Bonus", slug: "employee-bonus", difficulty: 'Easy', category: "连接" },
  { id: 584, title: "寻找用户推荐人", titleEn: "Find Customer Referee", slug: "find-customer-referee", difficulty: 'Easy', category: "基础查询" },
  { id: 595, title: "大的国家", titleEn: "Big Countries", slug: "big-countries", difficulty: 'Easy', category: "基础查询" },
  { id: 596, title: "超过5名学生的课", titleEn: "Classes More Than 5 Students", slug: "classes-more-than-5-students", difficulty: 'Easy', category: "聚合与分组" },
  { id: 601, title: "体育馆的人流量", titleEn: "Human Traffic of Stadium", slug: "human-traffic-of-stadium", difficulty: 'Hard', category: "窗口函数" },
  { id: 602, title: "好友申请 II：谁有最多的好友", titleEn: "Friend Requests II: Who Has the Most Friends", slug: "friend-requests-ii-who-has-the-most-friends", difficulty: 'Medium', category: "聚合与分组" },
  { id: 610, title: "判断三角形", titleEn: "Triangle Judgement", slug: "triangle-judgement", difficulty: 'Easy', category: "基础查询" },
  { id: 619, title: "只出现一次的最大数字", titleEn: "Biggest Single Number", slug: "biggest-single-number", difficulty: 'Easy', category: "子查询" },
  { id: 620, title: "有趣的电影", titleEn: "Not Boring Movies", slug: "not-boring-movies", difficulty: 'Easy', category: "基础查询" },
  { id: 626, title: "换座位", titleEn: "Exchange Seats", slug: "exchange-seats", difficulty: 'Medium', category: "基础查询" },
  { id: 627, title: "变更性别", titleEn: "Swap Salary", slug: "swap-salary", difficulty: 'Easy', category: "数据修改" },
  { id: 1050, title: "合作过至少三次的演员和导演", titleEn: "Actors and Directors Who Cooperated At Least Three Times", slug: "actors-and-directors-who-cooperated-at-least-three-times", difficulty: 'Easy', category: "聚合与分组" },
  { id: 1068, title: "产品销售分析 I", titleEn: "Product Sales Analysis I", slug: "product-sales-analysis-i", difficulty: 'Easy', category: "连接" },
  { id: 1070, title: "产品销售分析 III", titleEn: "Product Sales Analysis III", slug: "product-sales-analysis-iii", difficulty: 'Medium', category: "子查询" },
  { id: 1075, title: "项目员工 I", titleEn: "Project Employees I", slug: "project-employees-i", difficulty: 'Easy', category: "聚合与分组" },
  { id: 1084, title: "销售分析 III", titleEn: "Sales Analysis III", slug: "sales-analysis-iii", difficulty: 'Easy', category: "聚合与分组" },
  { id: 1141, title: "查询近30天活跃用户数", titleEn: "User Activity for the Past 30 Days I", slug: "user-activity-for-the-past-30-days-i", difficulty: 'Easy', category: "日期处理" },
  { id: 1148, title: "文章浏览 I", titleEn: "Article Views I", slug: "article-views-i", difficulty: 'Easy', category: "基础查询" },
  { id: 1158, title: "市场分析 I", titleEn: "Market Analysis I", slug: "market-analysis-i", difficulty: 'Medium', category: "连接" },
  { id: 1164, title: "指定日期的产品价格", titleEn: "Product Price at a Given Date", slug: "product-price-at-a-given-date", difficulty: 'Medium', category: "子查询" },
  { id: 1174, title: "即时食物配送 II", titleEn: "Immediate Food Delivery II", slug: "immediate-food-delivery-ii", difficulty: 'Medium', category: "子查询" },
  { id: 1179, title: "重新格式化部门表", titleEn: "Reformat Department Table", slug: "reformat-department-table", difficulty: 'Easy', category: "聚合与分组" },
  { id: 1193, title: "每月交易 I", titleEn: "Monthly Transactions I", slug: "monthly-transactions-i", difficulty: 'Medium', category: "日期处理" },
  { id: 1204, title: "最后一个能进入巴士的人", titleEn: "Last Person to Fit in the Bus", slug: "last-person-to-fit-in-the-bus", difficulty: 'Medium', category: "窗口函数" },
  { id: 1211, title: "查询结果的质量和占比", titleEn: "Queries Quality and Percentage", slug: "queries-quality-and-percentage", difficulty: 'Easy', category: "聚合与分组" },
  { id: 1251, title: "平均售价", titleEn: "Average Selling Price", slug: "average-selling-price", difficulty: 'Easy', category: "连接" },
  { id: 1280, title: "学生们参加各科测试的次数", titleEn: "Students and Examinations", slug: "students-and-examinations", difficulty: 'Easy', category: "连接" },
  { id: 1321, title: "餐馆营业额变化增长", titleEn: "Restaurant Growth", slug: "restaurant-growth", difficulty: 'Medium', category: "窗口函数" },
  { id: 1327, title: "列出指定时间段内所有的下单产品", titleEn: "List the Products Ordered in a Period", slug: "list-the-products-ordered-in-a-period", difficulty: 'Easy', category: "聚合与分组" },
  { id: 1341, title: "电影评分", titleEn: "Movie Rating", slug: "movie-rating", difficulty: 'Medium', category: "子查询" },
  { id: 1378, title: "使用唯一标识码替换员工ID", titleEn: "Replace Employee ID With The Unique Identifier", slug: "replace-employee-id-with-the-unique-identifier", difficulty: 'Easy', category: "连接" },
  { id: 1517, title: "查找拥有有效邮箱的用户", titleEn: "Find Users With Valid E-Mails", slug: "find-users-with-valid-e-mails", difficulty: 'Easy', category: "字符串处理" },
  { id: 1527, title: "患某种疾病的患者", titleEn: "Patients With a Condition", slug: "patients-with-a-condition", difficulty: 'Easy', category: "字符串处理" },
  { id: 1667, title: "修复表中的名字", titleEn: "Fix Names in a Table", slug: "fix-names-in-a-table", difficulty: 'Easy', category: "字符串处理" },
  { id: 1683, title: "无效的推文", titleEn: "Invalid Tweets", slug: "invalid-tweets", difficulty: 'Easy', category: "字符串处理" },
]

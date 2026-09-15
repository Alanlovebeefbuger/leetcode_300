import type { SqlLessonMap } from './types'

export const sqlLessons4: SqlLessonMap = {
  1179: {
    id: 1179,
    title: '重新格式化部门表',
    titleEn: 'Reformat Department Table',
    slug: 'reformat-department-table',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Department (
  id int,
  revenue int,
  month varchar(10),
  PRIMARY KEY (id, month)
);`,
    seed: `INSERT INTO Department VALUES
 (1,8000,'Jan'),(2,9000,'Jan'),(3,10000,'Feb'),(1,7000,'Feb'),(1,6000,'Mar');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['id', 'Jan_Revenue', 'Feb_Revenue', 'Mar_Revenue'],
      rows: [
        [1, 8000, 7000, 6000],
        [2, 9000, null, null],
        [3, null, 10000, null],
      ],
    },
    solution: `SELECT id,
       MAX(CASE WHEN month = 'Jan' THEN revenue END) AS "Jan_Revenue",
       MAX(CASE WHEN month = 'Feb' THEN revenue END) AS "Feb_Revenue",
       MAX(CASE WHEN month = 'Mar' THEN revenue END) AS "Mar_Revenue"
FROM Department
GROUP BY id;`,
    summary: '把「一行一个月份」的长表转成「一行一个部门、每月一列」的宽表，缺失月份填 NULL。（完整题目有 12 个月，这里演示前三个月。）',
    constraints: [
      '每个部门每月最多一条记录。',
      '某月没有数据时该列为 NULL。',
    ],
    intuition: '行转列的通用套路：按目标行的键分组，每个目标列写一个「条件取值」的聚合表达式。CASE 在不匹配时返回 NULL，聚合函数会自动忽略 NULL，于是只留下该月的值。',
    approach: [
      '按 id 分组，让每个部门成为一行。',
      '为每个月份写一个 CASE WHEN，只在月份匹配时返回 revenue。',
      '用 MAX 把组内唯一的非空值提取出来。',
      '给每列取题目要求的别名。',
    ],
    walkthrough: [
      '部门 1 有三条记录，分别落进 Jan、Feb、Mar 三个 CASE 表达式。',
      '每个 CASE 在不匹配的行上返回 NULL，MAX 忽略 NULL 后得到该月的营收。',
      '部门 2 只有一月数据，另两列的组内全为 NULL，结果即 NULL。',
    ],
    pitfalls: [
      '不能用 SUM 之外的普通选择，必须用聚合函数把多行压成一行。',
      '列名含大写字母，必须用双引号别名，否则 PostgreSQL 会转成小写。',
      '用 COUNT 代替 MAX 会得到条数而不是营收值。',
    ],
    mysqlNote: 'MySQL 写法一致，也常用 SUM(IF(month = \'Jan\', revenue, NULL))；PostgreSQL 无 IF 函数，用 CASE WHEN。两者都没有内置的 PIVOT 语法（PostgreSQL 可通过 tablefunc 扩展的 crosstab 实现）。',
    related: ['1084 销售分析 III', '1193 每月交易 I'],
  },

  1193: {
    id: 1193,
    title: '每月交易 I',
    titleEn: 'Monthly Transactions I',
    slug: 'monthly-transactions-i',
    difficulty: 'Medium',
    category: '日期处理',
    schema: `CREATE TABLE Transactions (
  id int PRIMARY KEY,
  country varchar(50),
  state varchar(20),
  amount int,
  trans_date date
);`,
    seed: `INSERT INTO Transactions VALUES
 (121,'US','approved',1000,'2018-12-18'),
 (122,'US','declined',2000,'2018-12-19'),
 (123,'US','approved',2000,'2019-01-01'),
 (124,'DE','approved',2000,'2019-01-07');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['month', 'country', 'trans_count', 'approved_count', 'trans_total_amount', 'approved_total_amount'],
      rows: [
        ['2018-12', 'US', 2, 1, 3000, 1000],
        ['2019-01', 'US', 1, 1, 2000, 2000],
        ['2019-01', 'DE', 1, 1, 2000, 2000],
      ],
    },
    solution: `SELECT TO_CHAR(trans_date, 'YYYY-MM') AS month,
       country,
       COUNT(*) AS trans_count,
       SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count,
       SUM(amount) AS trans_total_amount,
       SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount
FROM Transactions
GROUP BY TO_CHAR(trans_date, 'YYYY-MM'), country;`,
    summary: '按月份和国家汇总交易：总笔数、通过笔数、总金额与通过金额。',
    constraints: [
      '月份格式为 YYYY-MM。',
      '通过的交易是 state 等于 approved 的记录。',
    ],
    intuition: '总数与总额是普通聚合；「通过」的两个指标用条件聚合表达——CASE 在不满足时给 0，SUM 就只累加满足条件的部分。',
    approach: [
      '把日期格式化成 YYYY-MM 作为月份维度。',
      '按月份与国家分组。',
      '用 COUNT(*) 与 SUM(amount) 得到总量。',
      '用 SUM(CASE WHEN ...) 得到仅计通过交易的两个指标。',
    ],
    walkthrough: [
      '2018-12 的美国有两笔，其中 1000 那笔通过、2000 那笔被拒。',
      '总笔数为 2、总额 3000；通过笔数为 1、通过金额 1000。',
      '2019-01 的两个国家各一笔且都通过，因此四个指标两两相等。',
    ],
    pitfalls: [
      '分组键是格式化后的月份，SELECT 与 GROUP BY 中的表达式必须一致。',
      '统计通过金额时 ELSE 要给 0 而不是 NULL，否则某些数据库下全为 NULL 时结果为 NULL。',
    ],
    mysqlNote: 'MySQL 用 DATE_FORMAT(trans_date, \'%Y-%m\')，PostgreSQL 用 TO_CHAR(trans_date, \'YYYY-MM\')。MySQL 还可用 SUM(state = \'approved\') 直接利用布尔转数字，PostgreSQL 需写 CASE WHEN 或 (state = \'approved\')::int。',
    related: ['1179 重新格式化部门表', '1141 查询近 30 天活跃用户数'],
  },

  1204: {
    id: 1204,
    title: '最后一个能进入巴士的人',
    titleEn: 'Last Person to Fit in the Bus',
    slug: 'last-person-to-fit-in-the-bus',
    difficulty: 'Medium',
    category: '窗口函数',
    schema: `CREATE TABLE Queue (
  person_id int PRIMARY KEY,
  person_name varchar(50),
  weight int,
  turn int
);`,
    seed: `INSERT INTO Queue VALUES
 (5,'Alice',250,1),
 (4,'Bob',175,5),
 (3,'Alex',350,2),
 (6,'John Cena',400,3),
 (1,'Winston',500,6),
 (2,'Marie',200,4);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['person_name'],
      rows: [['John Cena']],
    },
    solution: `WITH running AS (
  SELECT person_name, turn,
         SUM(weight) OVER (ORDER BY turn) AS total
  FROM Queue
)
SELECT person_name
FROM running
WHERE total <= 1000
ORDER BY turn DESC
LIMIT 1;`,
    summary: '按上车顺序累加体重，巴士限重 1000，找出最后一个能上车的人。',
    constraints: [
      '上车顺序由 turn 决定。',
      '累计体重超过 1000 的人及其后的人都不能上车。',
    ],
    intuition: '「按顺序累加」正是窗口函数的累计求和：SUM(...) OVER (ORDER BY turn) 给出每个人上车后的总重量，再取满足限重的最后一位。',
    approach: [
      '用窗口函数按 turn 顺序计算累计体重。',
      '筛选累计体重不超过 1000 的人。',
      '按 turn 降序取第一行，即最后一个能上车的人。',
    ],
    walkthrough: [
      '按 turn 排序后依次是 Alice(250)、Alex(350)、John Cena(400)、Marie(200)、Bob(175)、Winston(500)。',
      '累计体重为 250、600、1000、1200、1375、1875。',
      '不超过 1000 的最后一位是累计恰好 1000 的 John Cena。',
    ],
    pitfalls: [
      '窗口函数不能直接写在 WHERE 中，必须先在子查询或 CTE 里算出累计值。',
      '取「最后一个」要按 turn 降序，而不是按累计体重排序。',
    ],
    mysqlNote: 'MySQL 8.0 支持相同的窗口累计写法；5.7 需用自连接对每个人累加不晚于其 turn 的所有体重，成本更高。',
    related: ['601 体育馆的人流量', '178 分数排名'],
  },

  1211: {
    id: 1211,
    title: '查询结果的质量和占比',
    titleEn: 'Queries Quality and Percentage',
    slug: 'queries-quality-and-percentage',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Queries (
  query_name varchar(50),
  result varchar(50),
  position int,
  rating int
);`,
    seed: `INSERT INTO Queries VALUES
 ('Dog','Golden Retriever',1,5),
 ('Dog','German Shepherd',2,5),
 ('Dog','Mule',200,1),
 ('Cat','Shirazi',5,2),
 ('Cat','Siamese',3,3),
 ('Cat','Sphynx',7,4);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['query_name', 'quality', 'poor_query_percentage'],
      rows: [
        ['Dog', 2.5, 33.33],
        ['Cat', 0.66, 33.33],
      ],
    },
    solution: `SELECT query_name,
       ROUND(AVG(rating::numeric / position), 2) AS quality,
       ROUND(100.0 * SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) / COUNT(*), 2) AS poor_query_percentage
FROM Queries
GROUP BY query_name;`,
    summary: '按查询名统计两个指标：质量（rating 与 position 比值的平均）与低质量查询占比（rating 小于 3 的百分比），都保留两位小数。',
    constraints: [
      '质量定义为 rating / position 的平均值。',
      '低质量查询指 rating 小于 3 的记录。',
    ],
    intuition: '两个指标都是分组聚合：前者先逐行算比值再取平均，后者用条件计数除以总数。注意必须先转成小数类型再做除法。',
    approach: [
      '按 query_name 分组。',
      '逐行计算 rating 除以 position，再对结果取平均。',
      '用 CASE WHEN 统计 rating 小于 3 的条数，除以总条数并乘 100。',
      '两个结果都保留两位小数。',
    ],
    walkthrough: [
      'Dog 组三行的比值为 5/1=5、5/2=2.5、1/200=0.005，平均约 2.5。',
      'Dog 组中只有 Mule 的 rating 小于 3，占比 1/3≈33.33%。',
      'Cat 组比值为 0.4、1、0.571…，平均约 0.66；同样只有一条低质量记录。',
    ],
    pitfalls: [
      '先算 SUM(rating)/SUM(position) 是错的：题目要求的是逐行比值的平均，不是总和之比。',
      '整数除法会截断，必须把分子转成 numeric。',
    ],
    mysqlNote: 'MySQL 中整数除法自动得到小数，可直接写 AVG(rating / position)；PostgreSQL 必须显式 rating::numeric / position，否则会做整数除法得到 0。',
    related: ['262 行程和用户', '1174 即时食物配送 II'],
  },

  1251: {
    id: 1251,
    title: '平均售价',
    titleEn: 'Average Selling Price',
    slug: 'average-selling-price',
    difficulty: 'Easy',
    category: '连接',
    schema: `CREATE TABLE Prices (
  product_id int,
  start_date date,
  end_date date,
  price int,
  PRIMARY KEY (product_id, start_date, end_date)
);
CREATE TABLE UnitsSold (
  product_id int,
  purchase_date date,
  units int
);`,
    seed: `INSERT INTO Prices VALUES
 (1,'2019-02-17','2019-02-28',5),
 (1,'2019-03-01','2019-03-22',20),
 (2,'2019-02-01','2019-02-20',15),
 (2,'2019-02-21','2019-03-31',30);
INSERT INTO UnitsSold VALUES
 (1,'2019-02-25',100),
 (1,'2019-03-01',15),
 (2,'2019-02-10',200),
 (2,'2019-03-22',30);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['product_id', 'average_price'],
      rows: [
        [1, 6.96],
        [2, 16.96],
      ],
    },
    solution: `SELECT p.product_id,
       ROUND(SUM(p.price * u.units)::numeric / SUM(u.units), 2) AS average_price
FROM Prices p
JOIN UnitsSold u
  ON u.product_id = p.product_id
 AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id;`,
    summary: '每个产品在不同时间段有不同价格，按销量加权计算平均售价，保留两位小数。',
    constraints: [
      '销售日期落在哪个价格区间就用该区间的价格。',
      '平均售价是按销量加权的，不是各区间价格的简单平均。',
    ],
    intuition: '用日期区间作为连接条件把每笔销量匹配到当时的价格，再用「总销售额除以总销量」得到加权平均。',
    approach: [
      '按产品与日期区间连接两张表。',
      '逐行计算 price × units 得到该笔销售额。',
      '按产品分组，用销售额总和除以销量总和。',
      '结果保留两位小数。',
    ],
    walkthrough: [
      '产品 1 在 2 月 25 日售出 100 件，单价 5；3 月 1 日售出 15 件，单价 20。',
      '销售额为 500 + 300 = 800，销量为 115，加权均价约 6.96。',
      '产品 2 的两笔分别按 15 与 30 计价，得到约 16.96。',
    ],
    pitfalls: [
      '用 AVG(price) 会算成区间价格的简单平均，忽略销量权重。',
      '整数相除需转 numeric，否则结果被截断。',
      '连接条件必须同时限定产品与日期区间，只按产品连接会产生错误配对。',
    ],
    mysqlNote: 'MySQL 中除法自动转小数，可直接 ROUND(SUM(price * units) / SUM(units), 2)；PostgreSQL 需显式转 numeric。BETWEEN 的语义两者一致，都是闭区间。',
    related: ['1075 项目员工 I', '1211 查询结果的质量和占比'],
  },

  1280: {
    id: 1280,
    title: '学生们参加各科测试的次数',
    titleEn: 'Students and Examinations',
    slug: 'students-and-examinations',
    difficulty: 'Easy',
    category: '连接',
    schema: `CREATE TABLE Students (
  student_id int PRIMARY KEY,
  student_name varchar(50)
);
CREATE TABLE Subjects (
  subject_name varchar(50) PRIMARY KEY
);
CREATE TABLE Examinations (
  student_id int,
  subject_name varchar(50)
);`,
    seed: `INSERT INTO Students VALUES (1,'Alice'),(2,'Bob'),(13,'John'),(6,'Alex');
INSERT INTO Subjects VALUES ('Math'),('Physics'),('Programming');
INSERT INTO Examinations VALUES
 (1,'Math'),(1,'Physics'),(1,'Programming'),
 (2,'Programming'),(1,'Physics'),(1,'Math'),
 (13,'Math'),(13,'Programming'),(13,'Physics'),
 (2,'Math'),(1,'Math');`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['student_id', 'student_name', 'subject_name', 'attended_exams'],
      rows: [
        [1, 'Alice', 'Math', 3],
        [1, 'Alice', 'Physics', 2],
        [1, 'Alice', 'Programming', 1],
        [2, 'Bob', 'Math', 1],
        [2, 'Bob', 'Physics', 0],
        [2, 'Bob', 'Programming', 1],
        [6, 'Alex', 'Math', 0],
        [6, 'Alex', 'Physics', 0],
        [6, 'Alex', 'Programming', 0],
        [13, 'John', 'Math', 1],
        [13, 'John', 'Physics', 1],
        [13, 'John', 'Programming', 1],
      ],
    },
    solution: `SELECT s.student_id, s.student_name, b.subject_name,
       COUNT(e.student_id) AS attended_exams
FROM Students s
CROSS JOIN Subjects b
LEFT JOIN Examinations e
  ON e.student_id = s.student_id AND e.subject_name = b.subject_name
GROUP BY s.student_id, s.student_name, b.subject_name
ORDER BY s.student_id, b.subject_name;`,
    summary: '列出每位学生每门科目的考试次数，没考过的组合也要出现并显示 0，按学号和科目名排序。',
    constraints: [
      '结果必须覆盖「学生 × 科目」的所有组合。',
      '没有考试记录的组合次数为 0。',
    ],
    intuition: '要输出所有组合就必须先用交叉连接造出完整的笛卡尔积，再左连接考试记录统计次数——这是「补全缺失组合」的标准套路。',
    approach: [
      '用 CROSS JOIN 生成学生与科目的全部组合。',
      '左连接考试表，条件同时匹配学生与科目。',
      '按三个维度分组，用 COUNT(e.student_id) 统计次数。',
      '按学号与科目名排序。',
    ],
    walkthrough: [
      '4 名学生与 3 门科目先组合出 12 行骨架。',
      'Alice 的 Math 有三条考试记录，计 3；Programming 只有一条，计 1。',
      'Alex 没有任何考试记录，三行都通过左连接得到 0。',
    ],
    pitfalls: [
      '只用左连接考试表无法造出「学生没考过的科目」这些行，必须先做交叉连接。',
      '用 COUNT(*) 会把左连接的空行算成 1，必须统计考试表的列。',
    ],
    mysqlNote: '写法一致，两种方言都支持 CROSS JOIN 与后续 LEFT JOIN 的组合。',
    related: ['1158 市场分析 I', '577 员工奖金'],
  },

  1321: {
    id: 1321,
    title: '餐馆营业额变化增长',
    titleEn: 'Restaurant Growth',
    slug: 'restaurant-growth',
    difficulty: 'Medium',
    category: '窗口函数',
    schema: `CREATE TABLE Customer (
  customer_id int,
  name varchar(50),
  visited_on date,
  amount int,
  PRIMARY KEY (customer_id, visited_on)
);`,
    seed: `INSERT INTO Customer VALUES
 (1,'Jhon','2019-01-01',100),
 (2,'Daniel','2019-01-02',110),
 (3,'Jade','2019-01-03',120),
 (4,'Khaled','2019-01-04',130),
 (5,'Winston','2019-01-05',110),
 (6,'Elvis','2019-01-06',140),
 (7,'Anna','2019-01-07',150),
 (8,'Maria','2019-01-08',80),
 (9,'Jaze','2019-01-09',110),
 (1,'Jhon','2019-01-10',130);`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['visited_on', 'amount', 'average_amount'],
      rows: [
        ['2019-01-07', 860, 122.86],
        ['2019-01-08', 840, 120.0],
        ['2019-01-09', 840, 120.0],
        ['2019-01-10', 850, 121.43],
      ],
    },
    solution: `WITH daily AS (
  SELECT visited_on, SUM(amount) AS amount
  FROM Customer
  GROUP BY visited_on
),
windowed AS (
  SELECT visited_on,
         SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount,
         COUNT(*) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS days
  FROM daily
)
SELECT visited_on, amount, ROUND(amount::numeric / 7, 2) AS average_amount
FROM windowed
WHERE days = 7
ORDER BY visited_on;`,
    summary: '计算每个「七天窗口」的营业额总和与日均值，只输出能凑满七天的窗口，按日期升序排列。',
    constraints: [
      '同一天可能有多位顾客，需先按天汇总。',
      '只有累计满七天的窗口才输出。',
    ],
    intuition: '先把顾客明细压成每日营业额，再用滑动窗口 ROWS BETWEEN 6 PRECEDING AND CURRENT ROW 求七天合计；用窗口内行数判断是否凑满七天。',
    approach: [
      '按 visited_on 分组求每日营业额。',
      '在日粒度上用滑动窗口求七天总额，同时统计窗口内天数。',
      '过滤掉天数不足七天的窗口。',
      '总额除以 7 得到日均值并保留两位小数。',
    ],
    walkthrough: [
      '每日营业额从 1 月 1 日到 1 月 10 日依次为 100、110、120、130、110、140、150、80、110、130。',
      '第一个满七天的窗口截止到 1 月 7 日，总额 860，日均 860/7≈122.86。',
      '窗口逐日右移，截止 1 月 10 日时覆盖 1 月 4 日到 10 日，总额 850，日均约 121.43。',
    ],
    pitfalls: [
      '必须先按天聚合再开窗，否则同一天的多位顾客会各占一个窗口行，导致「七行」不等于「七天」。',
      '日均要除以固定的 7，而不是除以窗口内的行数（虽然过滤后两者相等，但语义不同）。',
      '本题数据中日期连续；若日期有缺口，需改用 RANGE 按日期区间开窗。',
    ],
    mysqlNote: 'MySQL 8.0 支持相同的 ROWS BETWEEN 窗口语法；5.7 需用自连接匹配日期区间。除法方面 PostgreSQL 需转 numeric。',
    related: ['1204 最后一个能进入巴士的人', '601 体育馆的人流量'],
  },

  1327: {
    id: 1327,
    title: '列出指定时间段内所有的下单产品',
    titleEn: 'List the Products Ordered in a Period',
    slug: 'list-the-products-ordered-in-a-period',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Products (
  product_id int PRIMARY KEY,
  product_name varchar(50),
  product_category varchar(50)
);
CREATE TABLE Orders (
  product_id int,
  order_date date,
  unit int
);`,
    seed: `INSERT INTO Products VALUES
 (1,'Leetcode Solutions','Book'),
 (2,'Jewels of Stringology','Book'),
 (3,'HP','Laptop'),
 (4,'Lenovo','Laptop'),
 (5,'Leetcode Kit','T-shirt');
INSERT INTO Orders VALUES
 (1,'2020-02-05',60),
 (1,'2020-02-10',70),
 (2,'2020-01-18',30),
 (2,'2020-02-11',80),
 (3,'2020-02-17',2),
 (3,'2020-02-24',3),
 (4,'2020-03-01',20),
 (4,'2020-03-04',30),
 (4,'2020-03-04',60),
 (5,'2020-02-25',50),
 (5,'2020-02-27',50),
 (5,'2020-03-01',50);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['product_name', 'unit'],
      rows: [
        ['Leetcode Solutions', 130],
        ['Leetcode Kit', 100],
      ],
    },
    solution: `SELECT p.product_name, SUM(o.unit) AS unit
FROM Orders o
JOIN Products p ON p.product_id = o.product_id
WHERE o.order_date >= DATE '2020-02-01'
  AND o.order_date < DATE '2020-03-01'
GROUP BY p.product_id, p.product_name
HAVING SUM(o.unit) >= 100;`,
    summary: '统计 2020 年 2 月内下单量不少于 100 的产品及其总下单量。',
    constraints: [
      '只统计 2020 年 2 月的订单。',
      '下单量按该月订单求和，达到 100 才输出。',
    ],
    intuition: '先用 WHERE 把统计范围限定在 2 月，再按产品分组求和，最后用 HAVING 对聚合结果设阈值——WHERE 筛行、HAVING 筛组，分工明确。',
    approach: [
      '连接订单与产品表。',
      '用 WHERE 限定订单日期在 2 月。',
      '按产品分组求下单量总和。',
      '用 HAVING 保留总和不小于 100 的产品。',
    ],
    walkthrough: [
      '2 月内产品 1 有 60 与 70 两笔，合计 130，达标。',
      '产品 5 在 2 月有 50 与 50 两笔，合计 100，恰好达标。',
      '产品 2 在 2 月只有 80、产品 3 只有 5，均不达标；产品 4 的订单都在 3 月被排除。',
    ],
    pitfalls: [
      '日期范围用「不小于 2 月 1 日且小于 3 月 1 日」最稳，避免月末天数判断。',
      '阈值是闭区间，恰好 100 的产品要保留。',
      '筛选聚合结果只能用 HAVING。',
    ],
    mysqlNote: 'MySQL 可用 DATE_FORMAT(order_date, \'%Y-%m\') = \'2020-02\'，PostgreSQL 对应 TO_CHAR(order_date, \'YYYY-MM\') = \'2020-02\'；但两者都更推荐区间比较以便使用索引。',
    related: ['1084 销售分析 III', '596 超过 5 名学生的课'],
  },

  1341: {
    id: 1341,
    title: '电影评分',
    titleEn: 'Movie Rating',
    slug: 'movie-rating',
    difficulty: 'Medium',
    category: '子查询',
    schema: `CREATE TABLE Movies (
  movie_id int PRIMARY KEY,
  title varchar(100)
);
CREATE TABLE Users (
  user_id int PRIMARY KEY,
  name varchar(50)
);
CREATE TABLE MovieRating (
  movie_id int,
  user_id int,
  rating int,
  created_at date,
  PRIMARY KEY (movie_id, user_id)
);`,
    seed: `INSERT INTO Movies VALUES (1,'Avengers'),(2,'Frozen 2'),(3,'Joker');
INSERT INTO Users VALUES (1,'Daniel'),(2,'Monica'),(3,'Maria'),(4,'James');
INSERT INTO MovieRating VALUES
 (1,1,3,'2020-01-12'),
 (1,2,4,'2020-02-11'),
 (1,3,2,'2020-02-12'),
 (1,4,1,'2020-01-01'),
 (2,1,5,'2020-02-17'),
 (2,2,2,'2020-02-01'),
 (2,3,2,'2020-03-01'),
 (3,1,3,'2020-02-22'),
 (3,2,4,'2020-02-25');`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['results'],
      rows: [['Daniel'], ['Frozen 2']],
    },
    solution: `(
  SELECT u.name AS results
  FROM MovieRating r
  JOIN Users u ON u.user_id = r.user_id
  GROUP BY u.user_id, u.name
  ORDER BY COUNT(*) DESC, u.name ASC
  LIMIT 1
)
UNION ALL
(
  SELECT m.title AS results
  FROM MovieRating r
  JOIN Movies m ON m.movie_id = r.movie_id
  WHERE r.created_at >= DATE '2020-02-01'
    AND r.created_at < DATE '2020-03-01'
  GROUP BY m.movie_id, m.title
  ORDER BY AVG(r.rating) DESC, m.title ASC
  LIMIT 1
);`,
    summary: '返回两行结果：评分次数最多的用户名，以及 2020 年 2 月平均评分最高的电影名。并列时取名称字典序较小者。',
    constraints: [
      '两个指标并列时都按名称字典序取较小者。',
      '第二个指标只统计 2020 年 2 月的评分。',
    ],
    intuition: '两个互不相关的「取第一名」子问题，各自用分组加排序取一行，再用 UNION ALL 纵向拼接成两行。',
    approach: [
      '第一部分：按用户分组统计评分条数，按条数降序、姓名升序取第一。',
      '第二部分：限定 2 月的评分，按电影分组求平均分，按平均分降序、片名升序取第一。',
      '两部分都把输出列命名为 results。',
      '用 UNION ALL 合并，保持先用户后电影的顺序。',
    ],
    walkthrough: [
      'Daniel 与 Monica 都评了 3 次，并列最多，按姓名字典序取 Daniel。',
      '2 月内 Frozen 2 只有 Monica 的 2 分与 Daniel 的 5 分，平均 3.5；Joker 平均 3.5；Avengers 平均 3。',
      'Frozen 2 与 Joker 平均分并列，按片名字典序取 Frozen 2。',
    ],
    pitfalls: [
      '必须用 UNION ALL：若两行内容恰好相同，UNION 会去重导致只剩一行。',
      '并列时的字典序规则容易漏，会得到另一个合法但不符题意的答案。',
      'PostgreSQL 中带 ORDER BY 与 LIMIT 的子查询参与 UNION 时需要用括号包裹。',
    ],
    mysqlNote: 'MySQL 同样需要给带 LIMIT 的分支加括号。区别是 MySQL 中 UNION 各分支的 ORDER BY 有时会被优化器忽略，写法上更依赖括号；PostgreSQL 语义更严格。',
    related: ['602 好友申请 II：谁有最多的好友', '1211 查询结果的质量和占比'],
  },

  1378: {
    id: 1378,
    title: '使用唯一标识码替换员工ID',
    titleEn: 'Replace Employee ID With The Unique Identifier',
    slug: 'replace-employee-id-with-the-unique-identifier',
    difficulty: 'Easy',
    category: '连接',
    schema: `CREATE TABLE Employees (
  id int PRIMARY KEY,
  name varchar(50)
);
CREATE TABLE EmployeeUNI (
  id int,
  unique_id int,
  PRIMARY KEY (id, unique_id)
);`,
    seed: `INSERT INTO Employees VALUES (1,'Alice'),(7,'Bob'),(11,'Meir'),(90,'Winston'),(3,'Jonathan');
INSERT INTO EmployeeUNI VALUES (3,1),(11,2),(90,3);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['unique_id', 'name'],
      rows: [
        [null, 'Alice'],
        [null, 'Bob'],
        [2, 'Meir'],
        [3, 'Winston'],
        [1, 'Jonathan'],
      ],
    },
    solution: `SELECT u.unique_id, e.name
FROM Employees e
LEFT JOIN EmployeeUNI u ON u.id = e.id;`,
    summary: '为每位员工附上唯一标识码，没有对应标识码的员工显示 NULL。',
    constraints: [
      '所有员工都要出现在结果中。',
      '没有标识码时该列为 NULL。',
    ],
    intuition: '典型的左连接补充信息场景：以员工表为主，缺失的标识码自动为 NULL。',
    approach: [
      '以 Employees 为左表。',
      '按 id 左连接 EmployeeUNI。',
      '输出标识码与姓名两列。',
    ],
    walkthrough: [
      'Meir、Winston、Jonathan 在标识码表中有记录，取到各自的 unique_id。',
      'Alice 与 Bob 匹配不到，unique_id 为 NULL。',
      '五名员工全部保留在结果中。',
    ],
    pitfalls: [
      '用内连接会丢掉没有标识码的员工。',
      '注意输出列顺序是先 unique_id 再 name。',
    ],
    mysqlNote: '写法完全一致。',
    related: ['175 组合两个表', '1068 产品销售分析 I'],
  },

  1517: {
    id: 1517,
    title: '查找拥有有效邮箱的用户',
    titleEn: 'Find Users With Valid E-Mails',
    slug: 'find-users-with-valid-e-mails',
    difficulty: 'Easy',
    category: '字符串处理',
    schema: `CREATE TABLE Users (
  user_id int PRIMARY KEY,
  name varchar(50),
  mail varchar(100)
);`,
    seed: `INSERT INTO Users VALUES
 (1,'Winston','winston@leetcode.com'),
 (2,'Jonathan','jonathanisgreat'),
 (3,'Annabelle','bella-@leetcode.com'),
 (4,'Sally','sally.come@leetcode.com'),
 (5,'Marwan','quarz#2020@leetcode.com'),
 (6,'David','david69@gmail.com'),
 (7,'Shapiro','.shapo@leetcode.com');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['user_id', 'name', 'mail'],
      rows: [
        [1, 'Winston', 'winston@leetcode.com'],
        [3, 'Annabelle', 'bella-@leetcode.com'],
        [4, 'Sally', 'sally.come@leetcode.com'],
      ],
    },
    solution: `SELECT user_id, name, mail
FROM Users
WHERE mail ~ '^[A-Za-z][A-Za-z0-9_.\\-]*@leetcode\\.com$';`,
    summary: '筛出合法邮箱：前缀以字母开头，其后可包含字母、数字、下划线、点和减号，域名必须是 @leetcode.com。',
    constraints: [
      '前缀首字符必须是英文字母。',
      '域名部分必须严格等于 @leetcode.com。',
    ],
    intuition: '规则本身就是一个正则表达式，直接用正则匹配比拼接多个字符串函数清晰得多。关键是用 ^ 与 $ 锚定首尾，并对点做转义。',
    approach: [
      '用 ^ 锚定开头并要求首字符为字母。',
      '中间部分允许字母、数字、下划线、点与减号，数量可以为零。',
      '结尾用 @leetcode\\.com$ 锚定域名，点要转义。',
    ],
    walkthrough: [
      'jonathanisgreat 没有域名部分，不匹配。',
      'quarz#2020@leetcode.com 含非法字符 #，不匹配。',
      '.shapo@leetcode.com 以点开头违反首字符规则，不匹配；其余三条全部命中。',
    ],
    pitfalls: [
      '正则里的点必须转义，否则会匹配任意字符，导致 @leetcodeXcom 之类也通过。',
      '缺少 ^ 或 $ 锚点会变成子串匹配，非法邮箱可能被放过。',
      '减号放在字符类中间需要转义或放在末尾，否则会被解释为范围。',
    ],
    mysqlNote: 'MySQL 用 REGEXP 或 RLIKE：WHERE mail REGEXP \'^[A-Za-z][A-Za-z0-9_.-]*@leetcode[.]com$\'；PostgreSQL 用 ~ 运算符（~* 为不区分大小写）。两者正则方言基本兼容。',
    related: ['1667 修复表中的名字', '620 有趣的电影'],
  },

  1527: {
    id: 1527,
    title: '患某种疾病的患者',
    titleEn: 'Patients With a Condition',
    slug: 'patients-with-a-condition',
    difficulty: 'Easy',
    category: '字符串处理',
    schema: `CREATE TABLE Patients (
  patient_id int PRIMARY KEY,
  patient_name varchar(50),
  conditions varchar(100)
);`,
    seed: `INSERT INTO Patients VALUES
 (1,'Daniel','YFEV COUGH'),
 (2,'Alice',''),
 (3,'Bob','DIAB100 MYOP'),
 (4,'George','ACNE DIAB100'),
 (5,'Alain','DIAB201');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['patient_id', 'patient_name', 'conditions'],
      rows: [
        [3, 'Bob', 'DIAB100 MYOP'],
        [4, 'George', 'ACNE DIAB100'],
      ],
    },
    solution: `SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions LIKE 'DIAB1%'
   OR conditions LIKE '% DIAB1%';`,
    summary: '找出患有 I 型糖尿病的患者：条件码以 DIAB1 开头，且该编码是空格分隔列表中的一个独立项。',
    constraints: [
      '条件码之间用空格分隔。',
      '必须是某个编码的前缀，不能匹配到编码中间。',
    ],
    intuition: '目标编码要么位于整个字符串开头，要么紧跟在一个空格之后。用两个 LIKE 分别覆盖这两种位置即可，避免匹配到 SADIAB100 这类中间出现的情况。',
    approach: [
      '第一个条件匹配位于字符串开头的编码。',
      '第二个条件匹配前面带空格的编码。',
      '两者用 OR 连接。',
    ],
    walkthrough: [
      'Bob 的条件码以 DIAB100 开头，命中第一个条件。',
      'George 的 DIAB100 前面有空格，命中第二个条件。',
      'Alain 的 DIAB201 不以 DIAB1 开头，Daniel 与 Alice 都没有相关编码。',
    ],
    pitfalls: [
      '只写 LIKE \'%DIAB1%\' 会误命中编码中间含该串的情况，例如 SADIAB100。',
      '不能只判断开头，否则会漏掉编码位于列表中间或末尾的患者。',
    ],
    mysqlNote: 'MySQL 写法一致，也可用 REGEXP \'\\\\bDIAB1\' 借助单词边界；PostgreSQL 对应 conditions ~ \'\\yDIAB1\'。注意 MySQL 的 LIKE 默认不区分大小写，PostgreSQL 的 LIKE 区分大小写（不区分需用 ILIKE）。',
    related: ['1517 查找拥有有效邮箱的用户', '1667 修复表中的名字'],
  },

  1667: {
    id: 1667,
    title: '修复表中的名字',
    titleEn: 'Fix Names in a Table',
    slug: 'fix-names-in-a-table',
    difficulty: 'Easy',
    category: '字符串处理',
    schema: `CREATE TABLE Users (
  user_id int PRIMARY KEY,
  name varchar(50)
);`,
    seed: `INSERT INTO Users VALUES (1,'aLice'),(2,'bOB');`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['user_id', 'name'],
      rows: [
        [1, 'Alice'],
        [2, 'Bob'],
      ],
    },
    solution: `SELECT user_id,
       UPPER(LEFT(name, 1)) || LOWER(SUBSTRING(name FROM 2)) AS name
FROM Users
ORDER BY user_id;`,
    summary: '把姓名规范成首字母大写、其余小写的形式，按用户 id 升序输出。',
    constraints: [
      '首字母转大写，其余字符转小写。',
      '结果按 user_id 升序排列。',
    ],
    intuition: '把字符串拆成「首字符」与「其余部分」，分别转换大小写后再拼接。',
    approach: [
      '用 LEFT(name, 1) 取首字符并转大写。',
      '用 SUBSTRING(name FROM 2) 取剩余部分并转小写。',
      '用 || 拼接两段并按 user_id 排序。',
    ],
    walkthrough: [
      'aLice 的首字符 a 转成 A，剩余 Lice 转成 lice。',
      '拼接得到 Alice。',
      'bOB 同理得到 Bob，按 id 升序输出两行。',
    ],
    pitfalls: [
      '只对首字母处理而忘记把其余部分转小写，会得到 ALice 这类结果。',
      'PostgreSQL 的字符串拼接用 ||，用 + 会报类型错误。',
      'SUBSTRING 的起始下标从 1 开始，取剩余部分应从 2 开始。',
    ],
    mysqlNote: 'MySQL 用 CONCAT(UPPER(LEFT(name,1)), LOWER(SUBSTRING(name,2)))；PostgreSQL 可用 || 拼接，也支持 CONCAT。PostgreSQL 另有 INITCAP(name) 一步完成首字母大写（MySQL 无此函数）。',
    related: ['1527 患某种疾病的患者', '627 变更性别'],
  },

  1683: {
    id: 1683,
    title: '无效的推文',
    titleEn: 'Invalid Tweets',
    slug: 'invalid-tweets',
    difficulty: 'Easy',
    category: '字符串处理',
    schema: `CREATE TABLE Tweets (
  tweet_id int PRIMARY KEY,
  content varchar(100)
);`,
    seed: `INSERT INTO Tweets VALUES (1,'Vote for Biden'),(2,'Let us make America great again!');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['tweet_id'],
      rows: [[2]],
    },
    solution: `SELECT tweet_id
FROM Tweets
WHERE LENGTH(content) > 15;`,
    summary: '找出内容长度超过 15 个字符的无效推文编号。',
    constraints: [
      '长度按字符数计算。',
      '恰好 15 个字符属于有效推文。',
    ],
    intuition: '直接用长度函数比较即可，注意边界是严格大于 15。',
    approach: [
      '用 LENGTH 计算内容字符数。',
      '筛选长度大于 15 的记录。',
      '输出推文编号。',
    ],
    walkthrough: [
      '第一条内容 14 个字符，不超过 15，属于有效推文。',
      '第二条内容 32 个字符，超过阈值。',
      '因此只返回编号 2。',
    ],
    pitfalls: [
      '边界写成 >= 15 会把恰好 15 字符的有效推文误判为无效。',
      '含多字节字符时应区分字符数与字节数：LENGTH 数字符，OCTET_LENGTH 数字节。',
    ],
    mysqlNote: 'MySQL 中 LENGTH 返回字节数、CHAR_LENGTH 返回字符数，处理中文等多字节内容时必须用 CHAR_LENGTH；PostgreSQL 的 LENGTH 直接返回字符数，字节数用 OCTET_LENGTH。',
    related: ['1527 患某种疾病的患者', '595 大的国家'],
  },
}

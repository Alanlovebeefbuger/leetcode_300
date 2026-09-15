import type { SqlLessonMap } from './types'

export const sqlLessons3: SqlLessonMap = {
  601: {
    id: 601,
    title: '体育馆的人流量',
    titleEn: 'Human Traffic of Stadium',
    slug: 'human-traffic-of-stadium',
    difficulty: 'Hard',
    category: '窗口函数',
    schema: `CREATE TABLE Stadium (
  id int PRIMARY KEY,
  visit_date date,
  people int
);`,
    seed: `INSERT INTO Stadium VALUES
 (1,'2017-01-01',10),
 (2,'2017-01-02',109),
 (3,'2017-01-03',150),
 (4,'2017-01-04',99),
 (5,'2017-01-05',145),
 (6,'2017-01-06',1455),
 (7,'2017-01-07',199),
 (8,'2017-01-09',188);`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['id', 'visit_date', 'people'],
      rows: [
        [5, '2017-01-05', 145],
        [6, '2017-01-06', 1455],
        [7, '2017-01-07', 199],
        [8, '2017-01-09', 188],
      ],
    },
    solution: `WITH qualified AS (
  SELECT id, visit_date, people,
         id - ROW_NUMBER() OVER (ORDER BY id) AS grp
  FROM Stadium
  WHERE people >= 100
)
SELECT id, visit_date, people
FROM qualified
WHERE grp IN (
  SELECT grp FROM qualified GROUP BY grp HAVING COUNT(*) >= 3
)
ORDER BY visit_date;`,
    summary: '找出连续三天及以上人流量都不少于 100 的所有记录，按日期升序输出。',
    constraints: [
      '连续指 id 连续，而不是日期连续。',
      '一段连续区间只要长度不小于 3，其中每一行都要输出。',
    ],
    intuition: '这是经典的「间隔与孤岛」问题：先过滤出达标行，再用 id 减去行号得到一个分组键——同一段连续 id 的差值恒定，于是每段连续区间自然聚成一组。',
    approach: [
      '先筛出人流量不小于 100 的行。',
      '用 id - ROW_NUMBER() 计算分组键，同一连续段该值相同。',
      '按分组键统计每段长度，保留长度不小于 3 的段。',
      '取出这些段中的全部记录并按日期排序。',
    ],
    walkthrough: [
      '达标行的 id 依次为 2、3、5、6、7、8，行号为 1 到 6，差值分别是 1、1、2、2、2、2。',
      '差值为 1 的一段只有 2 行（id 2 与 3），长度不足被丢弃。',
      '差值为 2 的一段有 4 行（id 5 到 8），全部保留并按日期输出。',
    ],
    pitfalls: [
      '直接用日期判断连续会出错：本题 id 8 对应的日期是 1 月 9 日，与 1 月 7 日并不相邻，但仍算连续记录。',
      '只找出连续段的起点会漏掉段内其余行，必须整段输出。',
      'ROW_NUMBER 必须指定 ORDER BY id，否则分组键无意义。',
    ],
    mysqlNote: 'MySQL 8.0 支持窗口函数，写法一致；5.7 需用三表自连接列出所有「三连」组合再 UNION 去重，代码长得多。',
    related: ['180 连续出现的数字', '1225 报告系统状态的连续日期'],
  },

  602: {
    id: 602,
    title: '好友申请 II：谁有最多的好友',
    titleEn: 'Friend Requests II: Who Has the Most Friends',
    slug: 'friend-requests-ii-who-has-the-most-friends',
    difficulty: 'Medium',
    category: '聚合与分组',
    schema: `CREATE TABLE RequestAccepted (
  requester_id int,
  accepter_id int,
  accept_date date,
  PRIMARY KEY (requester_id, accepter_id)
);`,
    seed: `INSERT INTO RequestAccepted VALUES
 (1,2,'2016-06-03'),
 (1,3,'2016-06-08'),
 (2,3,'2016-06-08'),
 (3,4,'2016-06-09');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['id', 'num'],
      rows: [[3, 3]],
    },
    solution: `WITH everyone AS (
  SELECT requester_id AS id FROM RequestAccepted
  UNION ALL
  SELECT accepter_id AS id FROM RequestAccepted
)
SELECT id, COUNT(*) AS num
FROM everyone
GROUP BY id
ORDER BY num DESC
LIMIT 1;`,
    summary: '好友关系是双向的，一条记录同时给双方各加一个好友。找出好友最多的人及其好友数。',
    constraints: [
      '每条记录中的两个人各获得一个好友。',
      '题目保证好友数最多的人唯一。',
    ],
    intuition: '把「发起人」和「接受人」两列纵向拼成一列，每个人出现几次就有几个好友，问题随即变成普通的分组计数。',
    approach: [
      '用 UNION ALL 把两列 id 合并成一列。',
      '按 id 分组统计出现次数即好友数。',
      '按好友数降序取第一行。',
    ],
    walkthrough: [
      '合并后 id 序列为 1、1、2、3（发起人）与 2、3、3、4（接受人）。',
      '分组计数得到 1 有 2 个、2 有 2 个、3 有 3 个、4 有 1 个。',
      '降序取第一行得到 id=3、num=3。',
    ],
    pitfalls: [
      '必须用 UNION ALL：UNION 会去重，导致同一人的多个好友被合并成一个。',
      '只统计 requester_id 或只统计 accepter_id 都会漏掉另一半关系。',
    ],
    mysqlNote: '写法一致，两种方言的 UNION ALL 与 LIMIT 语义相同。',
    related: ['1050 合作过至少三次的演员和导演', '182 查找重复的电子邮箱'],
  },

  626: {
    id: 626,
    title: '换座位',
    titleEn: 'Exchange Seats',
    slug: 'exchange-seats',
    difficulty: 'Medium',
    category: '基础查询',
    schema: `CREATE TABLE Seat (
  id int PRIMARY KEY,
  student varchar(255)
);`,
    seed: `INSERT INTO Seat VALUES (1,'Abbot'),(2,'Doris'),(3,'Emerson'),(4,'Green'),(5,'Jeames');`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['id', 'student'],
      rows: [
        [1, 'Doris'],
        [2, 'Abbot'],
        [3, 'Green'],
        [4, 'Emerson'],
        [5, 'Jeames'],
      ],
    },
    solution: `SELECT
  CASE
    WHEN id % 2 = 1 AND id = (SELECT MAX(id) FROM Seat) THEN id
    WHEN id % 2 = 1 THEN id + 1
    ELSE id - 1
  END AS id,
  student
FROM Seat
ORDER BY id;`,
    summary: '两两交换相邻同学的座位号；学生总数为奇数时，最后一位保持不动。',
    constraints: [
      '座位号从 1 开始连续。',
      '总数为奇数时最后一个座位不参与交换。',
    ],
    intuition: '不必真的移动数据，只要重新计算每个人的座位号：奇数号加一、偶数号减一，唯一例外是总数为奇数时的最后一号。',
    approach: [
      '用子查询取出最大座位号。',
      '奇数号且是最后一号时保持原值。',
      '其余奇数号加一，偶数号减一。',
      '按新座位号排序输出。',
    ],
    walkthrough: [
      '1 号是奇数且不是最后一号，变成 2 号；2 号是偶数，变成 1 号。',
      '3 号与 4 号同理互换。',
      '5 号是奇数且等于最大号，保持 5 不变，排序后得到最终座位表。',
    ],
    pitfalls: [
      '忘记处理奇数总数的末位，会产生一个不存在的座位号。',
      '必须按新座位号排序，否则输出顺序仍是原顺序。',
    ],
    mysqlNote: 'MySQL 可用 IF(id % 2 = 1, ...) 或 IFNULL 配合自连接；PostgreSQL 无 IF 函数，用 CASE WHEN（该写法在 MySQL 同样有效）。',
    related: ['610 判断三角形', '620 有趣的电影'],
  },

  627: {
    id: 627,
    title: '变更性别',
    titleEn: 'Swap Salary',
    slug: 'swap-salary',
    difficulty: 'Easy',
    category: '数据修改',
    schema: `CREATE TABLE Salary (
  id int PRIMARY KEY,
  name varchar(100),
  sex varchar(1),
  salary int
);`,
    seed: `INSERT INTO Salary VALUES (1,'A','m',2500),(2,'B','f',1500),(3,'C','m',5500),(4,'D','f',500);`,
    kind: 'mutation',
    verifyQuery: 'SELECT id, name, sex, salary FROM Salary ORDER BY id',
    orderMatters: true,
    expected: {
      columns: ['id', 'name', 'sex', 'salary'],
      rows: [
        [1, 'A', 'f', 2500],
        [2, 'B', 'm', 1500],
        [3, 'C', 'f', 5500],
        [4, 'D', 'm', 500],
      ],
    },
    solution: `UPDATE Salary
SET sex = CASE WHEN sex = 'm' THEN 'f' ELSE 'm' END;`,
    summary: '把所有记录的性别互换：m 变 f，f 变 m。要求用一条 UPDATE 完成，不能借助中间表。这是一道写操作题。',
    constraints: [
      '只能使用一条 UPDATE 语句。',
      '不允许使用临时表或中间列。',
    ],
    intuition: '关键在于两个值要同时互换，不能先把 m 全改成 f 再把 f 改成 m（那样所有人都会变成 m）。用 CASE 表达式在一次扫描中根据原值决定新值即可。',
    approach: [
      '用一条 UPDATE 覆盖全表。',
      'SET 中用 CASE WHEN 判断原值。',
      '原值为 m 则写入 f，否则写入 m。',
    ],
    walkthrough: [
      'UPDATE 逐行读取原始 sex 值。',
      'id=1 原值为 m，计算得到 f；id=2 原值为 f，计算得到 m。',
      '所有行在同一条语句中完成互换，不存在中间状态互相覆盖的问题。',
    ],
    pitfalls: [
      '分两条 UPDATE 先后执行会把所有人改成同一个性别，这是本题的核心陷阱。',
      '本题要求修改表，写成 SELECT 查询不算完成。',
    ],
    mysqlNote: 'MySQL 常见写法是 UPDATE Salary SET sex = IF(sex = \'m\', \'f\', \'m\')，PostgreSQL 没有 IF 函数，需用 CASE WHEN。MySQL 也可用 CHAR(ASCII(\'m\') + ASCII(\'f\') - ASCII(sex)) 之类的技巧，可读性差不推荐。',
    related: ['196 删除重复的电子邮箱', '1667 修复表中的名字'],
  },

  1050: {
    id: 1050,
    title: '合作过至少三次的演员和导演',
    titleEn: 'Actors and Directors Who Cooperated At Least Three Times',
    slug: 'actors-and-directors-who-cooperated-at-least-three-times',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE ActorDirector (
  actor_id int,
  director_id int,
  timestamp int PRIMARY KEY
);`,
    seed: `INSERT INTO ActorDirector VALUES (1,1,0),(1,1,1),(1,1,2),(1,2,3),(1,2,4),(2,1,5),(2,1,6);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['actor_id', 'director_id'],
      rows: [[1, 1]],
    },
    solution: `SELECT actor_id, director_id
FROM ActorDirector
GROUP BY actor_id, director_id
HAVING COUNT(*) >= 3;`,
    summary: '找出合作次数不少于三次的演员与导演组合。',
    constraints: [
      '合作次数按记录条数统计。',
      '分组依据是演员与导演的组合，不是单独某一方。',
    ],
    intuition: '「某个组合出现多少次」就是按多列分组后计数，再用 HAVING 设阈值。',
    approach: [
      '按 actor_id 与 director_id 两列共同分组。',
      '统计每个组合的记录数。',
      '用 HAVING 保留次数不小于 3 的组合。',
    ],
    walkthrough: [
      '组合 (1,1) 出现 3 次，(1,2) 出现 2 次，(2,1) 出现 2 次。',
      'HAVING COUNT(*) >= 3 只保留 (1,1)。',
      '输出该组合的两列。',
    ],
    pitfalls: [
      '只按 actor_id 分组会把不同导演的合作混在一起。',
      '筛选聚合结果必须用 HAVING 而不是 WHERE。',
    ],
    mysqlNote: '写法一致。注意 timestamp 在两种方言中都是可用的列名，但它同时是类型名，规范做法是避免这样命名。',
    related: ['602 好友申请 II：谁有最多的好友', '596 超过 5 名学生的课'],
  },

  1068: {
    id: 1068,
    title: '产品销售分析 I',
    titleEn: 'Product Sales Analysis I',
    slug: 'product-sales-analysis-i',
    difficulty: 'Easy',
    category: '连接',
    schema: `CREATE TABLE Sales (
  sale_id int,
  product_id int,
  year int,
  quantity int,
  price int,
  PRIMARY KEY (sale_id, year)
);
CREATE TABLE Product (
  product_id int PRIMARY KEY,
  product_name varchar(50)
);`,
    seed: `INSERT INTO Sales VALUES (1,100,2008,10,5000),(2,100,2009,12,5000),(7,200,2011,15,9000);
INSERT INTO Product VALUES (100,'Nokia'),(200,'Apple'),(300,'Samsung');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['product_name', 'year', 'price'],
      rows: [
        ['Nokia', 2008, 5000],
        ['Nokia', 2009, 5000],
        ['Apple', 2011, 9000],
      ],
    },
    solution: `SELECT p.product_name, s.year, s.price
FROM Sales s
JOIN Product p ON p.product_id = s.product_id;`,
    summary: '把销售记录关联到产品表，输出产品名称、年份与售价。',
    constraints: [
      '只输出有销售记录的产品。',
      '同一产品多年销售时每年各输出一行。',
    ],
    intuition: '销售表已有全部所需数据，唯一缺的是产品名称，用内连接补上即可；没有销售记录的产品自然被排除。',
    approach: [
      '以 Sales 为主表。',
      '按 product_id 内连接 Product。',
      '输出产品名、年份与价格。',
    ],
    walkthrough: [
      '产品 100 有 2008 与 2009 两条销售记录，各输出一行。',
      '产品 200 有一条 2011 年的记录。',
      '产品 300（Samsung）没有销售记录，内连接将其排除。',
    ],
    pitfalls: [
      '用左连接以 Product 为主表会多出销售额为空的产品行。',
      '不要对结果去重，同一产品的多年记录都要保留。',
    ],
    mysqlNote: '写法一致。year 在两种方言中都可以作为列名。',
    related: ['1070 产品销售分析 III', '175 组合两个表'],
  },

  1070: {
    id: 1070,
    title: '产品销售分析 III',
    titleEn: 'Product Sales Analysis III',
    slug: 'product-sales-analysis-iii',
    difficulty: 'Medium',
    category: '子查询',
    schema: `CREATE TABLE Sales (
  sale_id int,
  product_id int,
  year int,
  quantity int,
  price int,
  PRIMARY KEY (sale_id, year)
);`,
    seed: `INSERT INTO Sales VALUES (1,100,2008,10,5000),(2,100,2009,12,5000),(7,200,2011,15,9000);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['product_id', 'first_year', 'quantity', 'price'],
      rows: [
        [100, 2008, 10, 5000],
        [200, 2011, 15, 9000],
      ],
    },
    solution: `SELECT product_id, year AS first_year, quantity, price
FROM Sales
WHERE (product_id, year) IN (
  SELECT product_id, MIN(year)
  FROM Sales
  GROUP BY product_id
);`,
    summary: '找出每个产品首次销售那一年的销售记录，包含销量与价格。同一年有多条记录时全部输出。',
    constraints: [
      '首次销售年份按每个产品单独计算。',
      '同一产品在首年可能有多条销售记录，都要输出。',
    ],
    intuition: '先按产品求出最早年份，再回到明细表匹配「产品 + 年份」这一组合，这样首年的所有记录都会被保留。',
    approach: [
      '按 product_id 分组求 MIN(year)。',
      '用行值 (product_id, year) 与该结果集比较。',
      '输出命中记录的产品、年份、销量与价格。',
    ],
    walkthrough: [
      '分组得到产品 100 的最早年份 2008、产品 200 的最早年份 2011。',
      '明细中 (100, 2008) 与 (200, 2011) 命中组合。',
      '产品 100 的 2009 年记录不匹配，被排除。',
    ],
    pitfalls: [
      '只按 MIN(year) 匹配而不带上 product_id，会让所有产品都拿全局最早年份去比。',
      '用聚合后连接再取一行会漏掉首年的并列记录。',
    ],
    mysqlNote: 'MySQL 同样支持 (a, b) IN (子查询) 的行值比较；也可改用窗口函数 RANK() OVER (PARTITION BY product_id ORDER BY year)，两种方言 8.0 以上都支持。',
    related: ['1068 产品销售分析 I', '184 部门工资最高的员工'],
  },

  1075: {
    id: 1075,
    title: '项目员工 I',
    titleEn: 'Project Employees I',
    slug: 'project-employees-i',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Project (
  project_id int,
  employee_id int,
  PRIMARY KEY (project_id, employee_id)
);
CREATE TABLE Employee (
  employee_id int PRIMARY KEY,
  name varchar(50),
  experience_years int
);`,
    seed: `INSERT INTO Project VALUES (1,1),(1,2),(1,3),(2,1),(2,4);
INSERT INTO Employee VALUES (1,'Khaled',3),(2,'Ali',2),(3,'John',1),(4,'Doe',2);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['project_id', 'average_years'],
      rows: [
        [1, 2.0],
        [2, 2.5],
      ],
    },
    solution: `SELECT p.project_id,
       ROUND(AVG(e.experience_years), 2) AS average_years
FROM Project p
JOIN Employee e ON e.employee_id = p.employee_id
GROUP BY p.project_id;`,
    summary: '计算每个项目参与员工的平均工作年限，保留两位小数。',
    constraints: [
      '平均值按项目内的员工计算。',
      '结果保留两位小数。',
    ],
    intuition: '连接两表拿到每个项目每位员工的年限，再按项目分组求平均。',
    approach: [
      '按 employee_id 连接项目表与员工表。',
      '按 project_id 分组。',
      '对 experience_years 求平均并保留两位小数。',
    ],
    walkthrough: [
      '项目 1 有三名员工，年限为 3、2、1，平均 2.00。',
      '项目 2 有两名员工，年限为 3、2，平均 2.50。',
      'ROUND 把结果统一成两位小数输出。',
    ],
    pitfalls: [
      'PostgreSQL 中整数的 AVG 返回 numeric，可直接 ROUND；但整数相除会截断，手写 SUM/COUNT 时必须转类型。',
      '不要对未分组的员工姓名做选择，分组查询中只能出现分组键与聚合值。',
    ],
    mysqlNote: 'MySQL 中 AVG 返回浮点数，ROUND(AVG(x), 2) 同样可用；差别在于 PostgreSQL 的 ROUND(double precision, int) 不存在，需要 numeric，而整数列的 AVG 恰好返回 numeric，因此本题两边写法一致。',
    related: ['1084 销售分析 III', '620 有趣的电影'],
  },

  1084: {
    id: 1084,
    title: '销售分析 III',
    titleEn: 'Sales Analysis III',
    slug: 'sales-analysis-iii',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Product (
  product_id int PRIMARY KEY,
  product_name varchar(50),
  unit_price int
);
CREATE TABLE Sales (
  seller_id int,
  product_id int,
  buyer_id int,
  sale_date date,
  quantity int,
  price int
);`,
    seed: `INSERT INTO Product VALUES (1,'S8',1000),(2,'G4',800),(3,'iPhone',1400);
INSERT INTO Sales VALUES
 (1,1,1,'2019-01-21',2,2000),
 (1,2,2,'2019-02-17',1,800),
 (2,2,3,'2019-06-02',1,800),
 (3,3,4,'2019-05-13',2,2800);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['product_id', 'product_name'],
      rows: [[1, 'S8']],
    },
    solution: `SELECT p.product_id, p.product_name
FROM Sales s
JOIN Product p ON p.product_id = s.product_id
GROUP BY p.product_id, p.product_name
HAVING MIN(s.sale_date) >= DATE '2019-01-01'
   AND MAX(s.sale_date) <= DATE '2019-03-31';`,
    summary: '找出只在 2019 年第一季度销售过的产品，在该区间之外有任何销售记录的产品都要排除。',
    constraints: [
      '统计区间为 2019-01-01 到 2019-03-31，含端点。',
      '只要有一条记录落在区间外，该产品就不符合条件。',
    ],
    intuition: '「全部记录都落在区间内」等价于「最早销售日不早于区间起点，且最晚销售日不晚于区间终点」，用分组后的 MIN 与 MAX 即可表达。',
    approach: [
      '连接销售表与产品表。',
      '按产品分组。',
      '用 HAVING 同时约束该产品的最早与最晚销售日期。',
    ],
    walkthrough: [
      '产品 1 只有 1 月 21 日一条记录，最早与最晚都在区间内，入选。',
      '产品 2 有 2 月与 6 月两条记录，最晚日期越界，被排除。',
      '产品 3 的记录在 5 月，同样越界。',
    ],
    pitfalls: [
      '用 WHERE 限定日期区间再分组是错的：那样会先丢掉区间外的记录，导致「只在区间内销售」的判断失效。',
      '判断必须同时约束 MIN 与 MAX 两端。',
    ],
    mysqlNote: '写法一致。MySQL 中日期字面量可直接写 \'2019-01-01\'，PostgreSQL 建议写 DATE \'2019-01-01\' 明确类型。',
    related: ['1068 产品销售分析 I', '1141 查询近 30 天活跃用户数'],
  },

  1141: {
    id: 1141,
    title: '查询近30天活跃用户数',
    titleEn: 'User Activity for the Past 30 Days I',
    slug: 'user-activity-for-the-past-30-days-i',
    difficulty: 'Easy',
    category: '日期处理',
    schema: `CREATE TABLE Activity (
  user_id int,
  session_id int,
  activity_date date,
  activity_type varchar(30)
);`,
    seed: `INSERT INTO Activity VALUES
 (1,1,'2019-07-20','open_session'),
 (1,1,'2019-07-20','scroll_down'),
 (1,1,'2019-07-20','end_session'),
 (2,4,'2019-07-20','open_session'),
 (2,4,'2019-07-21','send_message'),
 (2,4,'2019-07-21','end_session'),
 (3,2,'2019-07-21','open_session'),
 (3,2,'2019-07-21','send_message'),
 (3,2,'2019-07-21','end_session'),
 (4,3,'2019-06-25','open_session'),
 (4,3,'2019-06-25','end_session');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['day', 'active_users'],
      rows: [
        ['2019-07-20', 2],
        ['2019-07-21', 2],
      ],
    },
    solution: `SELECT activity_date AS day,
       COUNT(DISTINCT user_id) AS active_users
FROM Activity
WHERE activity_date > DATE '2019-07-27' - 30
  AND activity_date <= DATE '2019-07-27'
GROUP BY activity_date;`,
    summary: '统计截至 2019-07-27 的近 30 天内，每天有多少活跃用户。同一用户当天多次活动只计一次。',
    constraints: [
      '统计窗口是包含 2019-07-27 在内的 30 天。',
      '同一用户同一天的多条记录只算一个活跃用户。',
    ],
    intuition: '按日期分组后对用户去重计数即可；窗口用日期减法表达，避免逐日枚举。',
    approach: [
      '用日期条件限定近 30 天窗口。',
      '按 activity_date 分组。',
      '用 COUNT(DISTINCT user_id) 对用户去重计数。',
    ],
    walkthrough: [
      '窗口为 2019-06-28 到 2019-07-27，用户 4 在 6 月 25 日的活动被排除在外。',
      '7 月 20 日有用户 1 与用户 2 活动，用户 1 的三条记录去重后算一人。',
      '7 月 21 日有用户 2 与用户 3，因此两天各有 2 名活跃用户。',
    ],
    pitfalls: [
      '不加 DISTINCT 会把同一用户的多条记录重复计数。',
      '30 天窗口的边界容易差一天：起点应用严格大于「终点减 30 天」，或等价地用不小于「终点减 29 天」。',
    ],
    mysqlNote: 'MySQL 用 DATEDIFF(\'2019-07-27\', activity_date) < 30 或 activity_date > DATE_SUB(\'2019-07-27\', INTERVAL 30 DAY)；PostgreSQL 可直接写 DATE \'2019-07-27\' - 30 得到日期。',
    related: ['1084 销售分析 III', '550 游戏玩法分析 IV'],
  },

  1148: {
    id: 1148,
    title: '文章浏览 I',
    titleEn: 'Article Views I',
    slug: 'article-views-i',
    difficulty: 'Easy',
    category: '基础查询',
    schema: `CREATE TABLE Views (
  article_id int,
  author_id int,
  viewer_id int,
  view_date date
);`,
    seed: `INSERT INTO Views VALUES
 (1,3,5,'2019-08-01'),
 (1,3,6,'2019-08-02'),
 (2,7,7,'2019-08-01'),
 (2,7,6,'2019-08-02'),
 (4,7,1,'2019-07-22'),
 (3,4,4,'2019-07-21'),
 (3,4,4,'2019-07-21');`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['id'],
      rows: [[4], [7]],
    },
    solution: `SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id
ORDER BY id;`,
    summary: '找出浏览过自己文章的作者，按 id 升序输出且不重复。',
    constraints: [
      '同一作者多次浏览自己的文章只输出一次。',
      '结果需按 id 升序排列。',
    ],
    intuition: '「作者浏览了自己的文章」就是同一行里作者与浏览者相同，直接在 WHERE 中比较两列即可。',
    approach: [
      '筛选 author_id 等于 viewer_id 的记录。',
      '用 DISTINCT 去重。',
      '按 id 升序排序。',
    ],
    walkthrough: [
      '第 3 行作者 7 浏览者 7，命中；作者 4 的两行也都命中。',
      'DISTINCT 把作者 4 的两条重复记录合并成一条。',
      '排序后输出 4 与 7。',
    ],
    pitfalls: [
      '忘记 DISTINCT 会因重复浏览产生重复行。',
      '题目要求列名为 id，直接输出 author_id 会因列名不符判错。',
    ],
    mysqlNote: '写法完全一致。',
    related: ['1158 市场分析 I', '620 有趣的电影'],
  },

  1158: {
    id: 1158,
    title: '市场分析 I',
    titleEn: 'Market Analysis I',
    slug: 'market-analysis-i',
    difficulty: 'Medium',
    category: '连接',
    schema: `CREATE TABLE Users (
  user_id int PRIMARY KEY,
  join_date date,
  favorite_brand varchar(50)
);
CREATE TABLE Orders (
  order_id int PRIMARY KEY,
  order_date date,
  item_id int,
  buyer_id int,
  seller_id int
);
CREATE TABLE Items (
  item_id int PRIMARY KEY,
  item_brand varchar(50)
);`,
    seed: `INSERT INTO Users VALUES (1,'2018-01-01','Lenovo'),(2,'2018-02-09','Samsung'),(3,'2018-01-19','LG'),(4,'2018-05-21','HP');
INSERT INTO Items VALUES (1,'Samsung'),(2,'Lenovo'),(3,'LG'),(4,'HP');
INSERT INTO Orders VALUES
 (1,'2019-08-01',4,1,2),
 (2,'2018-08-02',2,1,3),
 (3,'2019-08-03',3,2,3),
 (4,'2018-08-04',1,4,2),
 (5,'2018-08-04',1,3,4),
 (6,'2019-08-05',2,2,4);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['buyer_id', 'join_date', 'orders_in_2019'],
      rows: [
        [1, '2018-01-01', 1],
        [2, '2018-02-09', 2],
        [3, '2018-01-19', 0],
        [4, '2018-05-21', 0],
      ],
    },
    solution: `SELECT u.user_id AS buyer_id,
       u.join_date,
       COUNT(o.order_id) AS orders_in_2019
FROM Users u
LEFT JOIN Orders o
  ON o.buyer_id = u.user_id
 AND o.order_date >= DATE '2019-01-01'
 AND o.order_date <= DATE '2019-12-31'
GROUP BY u.user_id, u.join_date;`,
    summary: '统计每位用户在 2019 年作为买家的下单数量，没有下单的用户也要出现并显示 0。',
    constraints: [
      '所有用户都必须出现在结果中。',
      '只统计 2019 年的订单，其他年份不计入。',
    ],
    intuition: '要保留零订单用户就必须用左连接，而年份过滤必须写在连接条件里——写进 WHERE 会把零订单用户整行过滤掉，等价于内连接。',
    approach: [
      '以 Users 为左表左连接 Orders。',
      '把「买家匹配」和「订单年份在 2019」都放进 ON 条件。',
      '按用户分组，用 COUNT(o.order_id) 统计匹配到的订单数。',
    ],
    walkthrough: [
      '用户 1 在 2019 年只有订单 1，计 1；2018 年的订单 2 因不满足 ON 条件不参与计数。',
      '用户 2 在 2019 年有订单 3 与订单 6，计 2。',
      '用户 3 与用户 4 在 2019 年没有作为买家的订单，左连接产生 NULL 行，COUNT(o.order_id) 得到 0。',
    ],
    pitfalls: [
      '把年份条件写进 WHERE 会让零订单用户消失，这是左连接最经典的陷阱。',
      '用 COUNT(*) 会把左连接的 NULL 行算成 1，必须统计具体列。',
    ],
    mysqlNote: '写法一致。MySQL 中也可用 YEAR(o.order_date) = 2019 作为连接条件，但那样无法利用日期索引；PostgreSQL 对应写法是 EXTRACT(YEAR FROM o.order_date) = 2019，同样建议改成区间比较。',
    related: ['577 员工奖金', '1084 销售分析 III'],
  },

  1164: {
    id: 1164,
    title: '指定日期的产品价格',
    titleEn: 'Product Price at a Given Date',
    slug: 'product-price-at-a-given-date',
    difficulty: 'Medium',
    category: '子查询',
    schema: `CREATE TABLE Products (
  product_id int,
  new_price int,
  change_date date,
  PRIMARY KEY (product_id, change_date)
);`,
    seed: `INSERT INTO Products VALUES
 (1,20,'2019-08-14'),
 (2,50,'2019-08-14'),
 (1,30,'2019-08-15'),
 (1,35,'2019-08-16'),
 (2,65,'2019-08-17'),
 (3,20,'2019-08-18');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['product_id', 'price'],
      rows: [
        [1, 35],
        [2, 50],
        [3, 10],
      ],
    },
    solution: `WITH latest AS (
  SELECT product_id, MAX(change_date) AS change_date
  FROM Products
  WHERE change_date <= DATE '2019-08-16'
  GROUP BY product_id
)
SELECT p.product_id, p.new_price AS price
FROM Products p
JOIN latest l
  ON l.product_id = p.product_id AND l.change_date = p.change_date
UNION ALL
SELECT DISTINCT product_id, 10 AS price
FROM Products
WHERE product_id NOT IN (SELECT product_id FROM latest);`,
    summary: '查询 2019-08-16 当天每个产品的价格。在该日期之前从未调价的产品，价格按初始值 10 计算。',
    constraints: [
      '取的是不晚于指定日期的最后一次调价。',
      '指定日期前没有任何调价记录的产品价格为 10。',
    ],
    intuition: '分两部分：调过价的产品取「不晚于目标日期的最近一次调价」，从未调价的产品补上默认价 10，再把两部分纵向拼起来。',
    approach: [
      '用 CTE 求每个产品在目标日期前的最近调价日期。',
      '回到明细表按「产品 + 该日期」取出对应价格。',
      '另用一个查询找出不在 CTE 中的产品，价格固定为 10。',
      '用 UNION ALL 合并两部分结果。',
    ],
    walkthrough: [
      '目标日期前，产品 1 的最近调价是 8 月 16 日的 35，产品 2 是 8 月 14 日的 50。',
      '产品 3 的调价发生在 8 月 18 日，晚于目标日期，因此不在 CTE 中。',
      '产品 3 走默认分支得到价格 10，最终三个产品各一行。',
    ],
    pitfalls: [
      '只写主查询会漏掉从未调价的产品，本题必须补默认值。',
      '取最近一次调价不能只用 MAX(new_price)，价格可能是降价；必须先定位最大日期再取该日期的价格。',
    ],
    mysqlNote: 'MySQL 8.0 同样支持 WITH 与 UNION ALL，写法一致；5.7 需把 CTE 改写为派生表。两种方言也都可用窗口函数 ROW_NUMBER() 取每个产品的最近一条记录。',
    related: ['1070 产品销售分析 III', '184 部门工资最高的员工'],
  },

  1174: {
    id: 1174,
    title: '即时食物配送 II',
    titleEn: 'Immediate Food Delivery II',
    slug: 'immediate-food-delivery-ii',
    difficulty: 'Medium',
    category: '子查询',
    schema: `CREATE TABLE Delivery (
  delivery_id int PRIMARY KEY,
  customer_id int,
  order_date date,
  customer_pref_delivery_date date
);`,
    seed: `INSERT INTO Delivery VALUES
 (1,1,'2019-08-01','2019-08-02'),
 (2,2,'2019-08-02','2019-08-02'),
 (3,1,'2019-08-11','2019-08-12'),
 (4,3,'2019-08-24','2019-08-24'),
 (5,3,'2019-08-21','2019-08-22'),
 (6,2,'2019-08-11','2019-08-13');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['immediate_percentage'],
      rows: [[33.33]],
    },
    solution: `WITH first_order AS (
  SELECT customer_id, MIN(order_date) AS order_date
  FROM Delivery
  GROUP BY customer_id
)
SELECT ROUND(
         100.0 * SUM(CASE WHEN d.order_date = d.customer_pref_delivery_date THEN 1 ELSE 0 END) / COUNT(*),
         2
       ) AS immediate_percentage
FROM Delivery d
JOIN first_order f
  ON f.customer_id = d.customer_id AND f.order_date = d.order_date;`,
    summary: '在每位客户的首单中，统计「即时配送」（期望配送日等于下单日）所占百分比，保留两位小数。',
    constraints: [
      '只考察每位客户时间最早的那一单。',
      '结果是百分比数值，保留两位小数。',
    ],
    intuition: '先用分组求出每位客户的首单日期，再回表把首单记录取出来，最后在这批记录上算即时配送占比。',
    approach: [
      '按 customer_id 分组求 MIN(order_date) 得到首单日期。',
      '连接回明细表，只保留首单记录。',
      '用 CASE WHEN 统计即时配送单数。',
      '乘 100 后除以首单总数并保留两位小数。',
    ],
    walkthrough: [
      '三位客户的首单分别是 8 月 1 日（客户 1）、8 月 2 日（客户 2）、8 月 21 日（客户 3）。',
      '其中只有客户 2 的首单期望配送日等于下单日，属于即时配送。',
      '1 ÷ 3 × 100 ≈ 33.33。',
    ],
    pitfalls: [
      '直接在全部订单上算比例会偏离题意，必须先筛出首单。',
      'PostgreSQL 中整数相除会截断，用 100.0 参与运算可让结果进入 numeric 计算。',
    ],
    mysqlNote: 'MySQL 中 AVG(条件) 可直接得到比例，写成 ROUND(AVG(order_date = customer_pref_delivery_date) * 100, 2)，因为布尔值会被当作 0/1；PostgreSQL 的布尔不能直接参与算术，必须用 CASE WHEN 或 (条件)::int。',
    related: ['550 游戏玩法分析 IV', '262 行程和用户'],
  },
}

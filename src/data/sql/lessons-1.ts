import type { SqlLessonMap } from './types'

export const sqlLessons1: SqlLessonMap = {
  175: {
    id: 175,
    title: '组合两个表',
    titleEn: 'Combine Two Tables',
    slug: 'combine-two-tables',
    difficulty: 'Easy',
    category: '连接',
    schema: `CREATE TABLE Person (
  personId int PRIMARY KEY,
  lastName varchar(255),
  firstName varchar(255)
);
CREATE TABLE Address (
  addressId int PRIMARY KEY,
  personId int,
  city varchar(255),
  state varchar(255)
);`,
    seed: `INSERT INTO Person VALUES (1,'Wang','Allen'),(2,'Alice','Bob');
INSERT INTO Address VALUES (1,2,'New York City','New York'),(2,3,'Leetcode','California');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['firstName', 'lastName', 'city', 'state'],
      rows: [
        ['Allen', 'Wang', null, null],
        ['Bob', 'Alice', 'New York City', 'New York'],
      ],
    },
    solution: `SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;`,
    summary: '无论人员是否登记了地址，都要返回其姓名；缺失地址时城市与州显示为空。',
    constraints: [
      'Person 表的 personId 唯一，Address 表中同一人最多一条地址。',
      '没有地址的人也必须出现在结果中。',
    ],
    intuition: '要求「左表全部保留」，这正是左外连接的语义：匹配不上时右表列自动补 NULL。',
    approach: [
      '以 Person 为左表，保证每个人都出现。',
      '按 personId 关联 Address。',
      '选出姓名与地址所需的四列。',
    ],
    walkthrough: [
      'Person 有 Allen Wang（personId=1）与 Bob Alice（personId=2）。',
      'Address 中只有 personId=2 与 personId=3 的记录，personId=3 在 Person 中不存在，因此被左连接丢弃。',
      'Allen Wang 匹配不到地址，city 与 state 补 NULL；Bob Alice 匹配到纽约。',
    ],
    pitfalls: [
      '用 INNER JOIN 会漏掉没有地址的人，这是本题最常见错误。',
      '连接方向不能反：以 Address 为左表会丢掉无地址的人。',
    ],
    mysqlNote: '本题两种方言写法完全一致，MySQL 中同样使用 LEFT JOIN。',
    related: ['181 超过经理收入的员工', '183 从不订购的客户'],
  },

  176: {
    id: 176,
    title: '第二高的薪水',
    titleEn: 'Second Highest Salary',
    slug: 'second-highest-salary',
    difficulty: 'Medium',
    category: '子查询',
    schema: `CREATE TABLE Employee (
  id int PRIMARY KEY,
  salary int
);`,
    seed: `INSERT INTO Employee VALUES (1,100),(2,200),(3,300);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['SecondHighestSalary'],
      rows: [[200]],
    },
    solution: `SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
    summary: '返回薪水中第二高的不同值；不存在第二高时必须返回 NULL 而不是空结果。',
    constraints: [
      '相同薪水视为同一档，需要去重后再排名。',
      '不足两档薪水时结果为一行 NULL。',
    ],
    intuition: '去重排序后取第二行即可。关键在于「无结果时要输出 NULL」：把查询包进外层标量子查询，空结果自然变成一行 NULL。',
    approach: [
      '对 salary 去重并按降序排列。',
      '用 LIMIT 1 OFFSET 1 跳过最高值取第二档。',
      '将其包在外层 SELECT 中作为标量子查询，保证空结果时返回 NULL。',
    ],
    walkthrough: [
      '去重降序后薪水为 300、200、100。',
      'OFFSET 1 跳过 300，LIMIT 1 取到 200。',
      '若表中只有一档薪水，内层无结果，外层标量子查询返回 NULL。',
    ],
    pitfalls: [
      '直接写 SELECT ... LIMIT 1 OFFSET 1 在无第二高时返回空结果集，不满足返回 NULL 的要求。',
      '忘记 DISTINCT 会把并列最高的第二行当成第二高。',
    ],
    mysqlNote: 'MySQL 可写 LIMIT 1, 1（先偏移后取数），也支持标准的 LIMIT 1 OFFSET 1；PostgreSQL 只支持后者。',
    related: ['177 第 N 高的薪水', '178 分数排名'],
  },

  181: {
    id: 181,
    title: '超过经理收入的员工',
    titleEn: 'Employees Earning More Than Their Managers',
    slug: 'employees-earning-more-than-their-managers',
    difficulty: 'Easy',
    category: '连接',
    schema: `CREATE TABLE Employee (
  id int PRIMARY KEY,
  name varchar(255),
  salary int,
  managerId int
);`,
    seed: `INSERT INTO Employee VALUES (1,'Joe',70000,3),(2,'Henry',80000,4),(3,'Sam',60000,NULL),(4,'Max',90000,NULL);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['Employee'],
      rows: [['Joe']],
    },
    solution: `SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;`,
    summary: '同一张表里同时存在员工与经理，找出薪水高于其直属经理的员工姓名。',
    constraints: [
      'managerId 指向同表的 id，没有经理时为 NULL。',
      '只比较员工与其直属经理，不涉及更上层。',
    ],
    intuition: '员工和经理在同一张表，需要把表当成两份来用——自连接给同一张表取两个别名，一份代表员工，一份代表经理。',
    approach: [
      '给 Employee 取两个别名，e 表示员工，m 表示经理。',
      '用 e.managerId = m.id 建立上下级关系。',
      '筛选 e.salary > m.salary 的记录并返回员工姓名。',
    ],
    walkthrough: [
      'Joe 的经理是 Sam，70000 > 60000，满足条件。',
      'Henry 的经理是 Max，80000 < 90000，不满足。',
      'Sam 与 Max 的 managerId 为 NULL，内连接直接把它们排除。',
    ],
    pitfalls: [
      '别名不能省略，否则无法区分两份表的同名列。',
      '经理为 NULL 的员工应被排除，内连接天然满足；若误用左连接需额外过滤。',
    ],
    mysqlNote: '写法与 MySQL 完全一致。',
    related: ['175 组合两个表', '182 查找重复的电子邮箱'],
  },

  182: {
    id: 182,
    title: '查找重复的电子邮箱',
    titleEn: 'Duplicate Emails',
    slug: 'duplicate-emails',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Person (
  id int PRIMARY KEY,
  email varchar(255)
);`,
    seed: `INSERT INTO Person VALUES (1,'a@b.com'),(2,'c@d.com'),(3,'a@b.com');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['Email'],
      rows: [['a@b.com']],
    },
    solution: `SELECT email AS Email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;`,
    summary: '找出在表中出现多次的邮箱，每个重复邮箱只返回一次。',
    constraints: [
      '邮箱不含 NULL。',
      '结果中每个邮箱只出现一次。',
    ],
    intuition: '「出现多次」是对分组后的组内数量提条件，因此用 GROUP BY 分组、HAVING 过滤组。',
    approach: [
      '按 email 分组，把相同邮箱聚到一起。',
      '用 HAVING COUNT(*) > 1 保留出现多次的组。',
      '输出分组键作为结果。',
    ],
    walkthrough: [
      '按邮箱分组后，a@b.com 一组含 2 行，c@d.com 一组含 1 行。',
      'HAVING 检查每组行数，a@b.com 的 2 大于 1 被保留。',
      'c@d.com 只有 1 行被过滤掉。',
    ],
    pitfalls: [
      'WHERE 无法使用聚合结果，筛选组必须用 HAVING。',
      '分组后只能选择分组键或聚合值，不能直接选 id。',
    ],
    mysqlNote: '写法一致。注意 MySQL 在非严格模式下允许 SELECT 未分组的列，PostgreSQL 会直接报错，后者更接近标准。',
    related: ['196 删除重复的电子邮箱', '1050 合作过至少三次的演员和导演'],
  },

  183: {
    id: 183,
    title: '从不订购的客户',
    titleEn: 'Customers Who Never Order',
    slug: 'customers-who-never-order',
    difficulty: 'Easy',
    category: '子查询',
    schema: `CREATE TABLE Customers (
  id int PRIMARY KEY,
  name varchar(255)
);
CREATE TABLE Orders (
  id int PRIMARY KEY,
  customerId int
);`,
    seed: `INSERT INTO Customers VALUES (1,'Joe'),(2,'Henry'),(3,'Sam'),(4,'Max');
INSERT INTO Orders VALUES (1,3),(2,1);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['Customers'],
      rows: [['Henry'], ['Max']],
    },
    solution: `SELECT c.name AS "Customers"
FROM Customers c
WHERE NOT EXISTS (
  SELECT 1 FROM Orders o WHERE o.customerId = c.id
);`,
    summary: '找出没有任何订单记录的客户姓名。',
    constraints: [
      'Orders.customerId 指向 Customers.id。',
      '结果只需客户姓名一列。',
    ],
    intuition: '「不存在关联记录」用 NOT EXISTS 表达最直接，它一旦找到匹配就短路，语义也不受 NULL 干扰。',
    approach: [
      '遍历每个客户。',
      '用子查询检查该客户是否有订单。',
      '用 NOT EXISTS 保留没有订单的客户。',
    ],
    walkthrough: [
      '客户 Sam（id=3）与 Joe（id=1）在 Orders 中有记录，被排除。',
      'Henry（id=2）在 Orders 中找不到匹配行，保留。',
      'Max（id=4）同理保留。',
    ],
    pitfalls: [
      '改用 NOT IN 时，若子查询结果含 NULL，整个条件会变成 NULL 导致结果为空，这是经典陷阱。',
      '也可用 LEFT JOIN ... WHERE o.id IS NULL，但要确保判空的列不可能本身为 NULL。',
    ],
    mysqlNote: '写法一致。MySQL 同样存在 NOT IN 遇到 NULL 返回空结果的问题。',
    related: ['175 组合两个表', '1607 没有卖出的卖家'],
  },

  184: {
    id: 184,
    title: '部门工资最高的员工',
    titleEn: 'Department Highest Salary',
    slug: 'department-highest-salary',
    difficulty: 'Medium',
    category: '子查询',
    schema: `CREATE TABLE Employee (
  id int PRIMARY KEY,
  name varchar(255),
  salary int,
  departmentId int
);
CREATE TABLE Department (
  id int PRIMARY KEY,
  name varchar(255)
);`,
    seed: `INSERT INTO Employee VALUES (1,'Joe',70000,1),(2,'Jim',90000,1),(3,'Henry',80000,2),(4,'Sam',60000,2),(5,'Max',90000,1);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['Department', 'Employee', 'Salary'],
      rows: [
        ['IT', 'Jim', 90000],
        ['IT', 'Max', 90000],
        ['Sales', 'Henry', 80000],
      ],
    },
    solution: `SELECT d.name AS "Department", e.name AS "Employee", e.salary AS "Salary"
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
  SELECT departmentId, MAX(salary)
  FROM Employee
  GROUP BY departmentId
);`,
    summary: '找出每个部门薪水最高的员工，同一部门有并列最高时全部返回。',
    constraints: [
      '每个部门至少有一名员工。',
      '并列最高薪水的员工都要出现在结果中。',
    ],
    intuition: '先按部门算出最高薪水，再回到明细表挑出「部门与薪水」同时命中这一组合的员工，这样并列的人都会被保留。',
    approach: [
      '按 departmentId 分组求出每个部门的 MAX(salary)。',
      '把（部门, 薪水）作为行值与该结果集比较。',
      '连接 Department 取部门名称并输出三列。',
    ],
    walkthrough: [
      '分组得到部门 1 的最高薪 90000、部门 2 的最高薪 80000。',
      '明细中 Jim 与 Max 都是部门 1 且薪水 90000，两人都命中。',
      'Sales 部门只有 Henry 的 80000 命中，Sam 的 60000 被排除。',
    ],
    pitfalls: [
      '只按薪水匹配会跨部门误判，必须把部门一起作为匹配条件。',
      '用 MAX 配合分组再连接时，若只取一行会漏掉并列的员工。',
    ],
    mysqlNote: 'MySQL 同样支持 (a, b) IN (子查询) 的行值比较语法，写法一致。也可改用窗口函数 RANK() 实现。',
    related: ['185 部门工资前三高的所有员工', '178 分数排名'],
  },

  196: {
    id: 196,
    title: '删除重复的电子邮箱',
    titleEn: 'Delete Duplicate Emails',
    slug: 'delete-duplicate-emails',
    difficulty: 'Easy',
    category: '数据修改',
    schema: `CREATE TABLE Person (
  id int PRIMARY KEY,
  email varchar(255)
);`,
    seed: `INSERT INTO Person VALUES (1,'john@example.com'),(2,'bob@example.com'),(3,'john@example.com');`,
    kind: 'mutation',
    verifyQuery: 'SELECT id, email FROM Person ORDER BY id',
    orderMatters: true,
    expected: {
      columns: ['id', 'email'],
      rows: [
        [1, 'john@example.com'],
        [2, 'bob@example.com'],
      ],
    },
    solution: `DELETE FROM Person
WHERE id NOT IN (
  SELECT MIN(id) FROM Person GROUP BY email
);`,
    summary: '删除表中重复的邮箱记录，每个邮箱只保留 id 最小的那一行。这是一道写操作题。',
    constraints: [
      '保留的必须是每个邮箱中 id 最小的记录。',
      '需要修改表本身，而不是返回查询结果。',
    ],
    intuition: '先算出「每个邮箱要保留的 id」这一集合，再删除不在集合中的所有行。',
    approach: [
      '按 email 分组，用 MIN(id) 得到每组要保留的 id。',
      '用 DELETE 删除 id 不在该集合中的行。',
    ],
    walkthrough: [
      '分组后 john@example.com 的最小 id 是 1，bob@example.com 是 2。',
      '保留集合为 {1, 2}。',
      'id=3 不在集合中被删除，表中剩下 1 和 2 两行。',
    ],
    pitfalls: [
      '本题要求修改表，写成 SELECT 查询不算完成。',
      'MySQL 不允许在 DELETE 的子查询中直接引用被删表，需要多套一层派生表；PostgreSQL 没有此限制。',
    ],
    mysqlNote: 'MySQL 需写成 DELETE p FROM Person p JOIN Person q ON p.email = q.email AND p.id > q.id，或把子查询再包一层 SELECT * FROM (...) t 绕过「不能在子查询中引用目标表」的限制。PostgreSQL 可直接引用。',
    related: ['182 查找重复的电子邮箱', '1667 修复表中的名字'],
  },

  197: {
    id: 197,
    title: '上升的温度',
    titleEn: 'Rising Temperature',
    slug: 'rising-temperature',
    difficulty: 'Easy',
    category: '日期处理',
    schema: `CREATE TABLE Weather (
  id int PRIMARY KEY,
  recordDate date,
  temperature int
);`,
    seed: `INSERT INTO Weather VALUES (1,'2015-01-01',10),(2,'2015-01-02',25),(3,'2015-01-03',20),(4,'2015-01-04',30);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['id'],
      rows: [[2], [4]],
    },
    solution: `SELECT w.id
FROM Weather w
JOIN Weather p ON w.recordDate = p.recordDate + INTERVAL '1 day'
WHERE w.temperature > p.temperature;`,
    summary: '找出温度高于「昨天」的记录 id。日期可能不连续，必须按日期差判断而不是按 id 相邻。',
    constraints: [
      '比较对象是日期恰好早一天的记录。',
      '日期可能缺失，不能假设 id 连续代表日期连续。',
    ],
    intuition: '自连接把每条记录与「前一天」的记录配对，连接条件直接用日期加一天表达，避免依赖 id 顺序。',
    approach: [
      '给 Weather 取两个别名，w 为当天、p 为前一天。',
      '连接条件写成 w.recordDate = p.recordDate + INTERVAL \'1 day\'。',
      '筛选当天温度高于前一天的记录。',
    ],
    walkthrough: [
      'id=2（1 月 2 日，25 度）与 id=1（1 月 1 日，10 度）配对，25 > 10 满足。',
      'id=3（20 度）与 id=2（25 度）配对，不满足。',
      'id=4（30 度）与 id=3（20 度）配对，满足，最终返回 2 和 4。',
    ],
    pitfalls: [
      '用 id 相邻代替日期相邻是最常见错误，日期缺失时会算错。',
      '直接对日期做减法要注意返回类型：PostgreSQL 中 date - date 得到整数天数，date - interval 得到日期。',
    ],
    mysqlNote: 'MySQL 用 DATEDIFF(w.recordDate, p.recordDate) = 1 或 w.recordDate = DATE_ADD(p.recordDate, INTERVAL 1 DAY)；PostgreSQL 用 p.recordDate + INTERVAL \'1 day\'，或 w.recordDate - p.recordDate = 1。',
    related: ['1661 每台机器的进程平均运行时间', '1141 查询近 30 天活跃用户数'],
  },
}

import type { SqlLessonMap } from './types'

export const sqlLessons2: SqlLessonMap = {
  178: {
    id: 178,
    title: '分数排名',
    titleEn: 'Rank Scores',
    slug: 'rank-scores',
    difficulty: 'Medium',
    category: '窗口函数',
    schema: `CREATE TABLE Scores (
  id int PRIMARY KEY,
  score decimal(3,2)
);`,
    seed: `INSERT INTO Scores VALUES (1,3.50),(2,3.65),(3,4.00),(4,3.85),(5,4.00),(6,3.65);`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['score', 'rank'],
      rows: [
        [4.0, 1],
        [4.0, 1],
        [3.85, 2],
        [3.65, 3],
        [3.65, 3],
        [3.5, 4],
      ],
    },
    solution: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"
FROM Scores
ORDER BY score DESC;`,
    summary: '按分数从高到低排名，相同分数排名相同，且排名之间不留空档。',
    constraints: [
      '并列分数必须得到相同排名。',
      '并列之后的排名要连续，不能跳号。',
    ],
    intuition: '「并列同名次且不跳号」正是 DENSE_RANK 的定义；RANK 会跳号，ROW_NUMBER 不会并列，都不符合要求。',
    approach: [
      '用窗口函数按 score 降序编号。',
      '选择 DENSE_RANK 以保证并列同名次且名次连续。',
      '最后按分数降序输出。',
    ],
    walkthrough: [
      '降序后分数为 4.00、4.00、3.85、3.65、3.65、3.50。',
      '两个 4.00 并列第 1；下一个 3.85 在 DENSE_RANK 下是第 2，而 RANK 会给第 3。',
      '两个 3.65 并列第 3，最后 3.50 为第 4。',
    ],
    pitfalls: [
      'RANK() 在并列后会跳号（1,1,3），本题要求不跳号。',
      'rank 是窗口函数名，作为列别名时建议加双引号避免歧义。',
    ],
    mysqlNote: 'MySQL 8.0 起同样支持 DENSE_RANK() OVER (...)，写法一致；5.7 及以前没有窗口函数，需用相关子查询 SELECT COUNT(DISTINCT s2.score) FROM Scores s2 WHERE s2.score >= s1.score 来模拟。',
    related: ['177 第 N 高的薪水', '185 部门工资前三高的所有员工'],
  },

  180: {
    id: 180,
    title: '连续出现的数字',
    titleEn: 'Consecutive Numbers',
    slug: 'consecutive-numbers',
    difficulty: 'Medium',
    category: '窗口函数',
    schema: `CREATE TABLE Logs (
  id int PRIMARY KEY,
  num int
);`,
    seed: `INSERT INTO Logs VALUES (1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['ConsecutiveNums'],
      rows: [[1]],
    },
    solution: `SELECT DISTINCT num AS "ConsecutiveNums"
FROM (
  SELECT num,
         LAG(num) OVER (ORDER BY id) AS prev_num,
         LEAD(num) OVER (ORDER BY id) AS next_num
  FROM Logs
) t
WHERE num = prev_num AND num = next_num;`,
    summary: '找出至少连续出现三次的数字，每个数字只返回一次。',
    constraints: [
      '连续指按 id 顺序相邻的记录。',
      '同一数字多次满足条件时只输出一次。',
    ],
    intuition: '判断「自己与前后邻居都相同」即可确认它处在连续三个相同值的中间，LAG 与 LEAD 正好取前后行。',
    approach: [
      '用 LAG 取上一行的 num，LEAD 取下一行的 num。',
      '筛选出当前值与前后值都相等的行。',
      '对结果去重，得到满足条件的数字。',
    ],
    walkthrough: [
      'id=2 的 num=1，其前一行与后一行都是 1，命中。',
      'id=6 的 num=2，前一行是 1，不命中。',
      '只有数字 1 满足条件，去重后输出一行。',
    ],
    pitfalls: [
      '忘记 DISTINCT 时，连续四次以上出现会产生重复行。',
      '窗口函数必须指定 ORDER BY id，否则行序不确定。',
    ],
    mysqlNote: 'MySQL 8.0 同样支持 LAG/LEAD，写法一致；也可用三表自连接 l1.id = l2.id - 1 AND l2.id = l3.id - 1，该写法两种方言通用。',
    related: ['601 体育馆的人流量', '178 分数排名'],
  },

  185: {
    id: 185,
    title: '部门工资前三高的所有员工',
    titleEn: 'Department Top Three Salaries',
    slug: 'department-top-three-salaries',
    difficulty: 'Hard',
    category: '窗口函数',
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
    seed: `INSERT INTO Employee VALUES (1,'Joe',85000,1),(2,'Henry',80000,2),(3,'Sam',60000,2),(4,'Max',90000,1),(5,'Janet',69000,1),(6,'Randy',85000,1),(7,'Will',70000,1);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['Department', 'Employee', 'Salary'],
      rows: [
        ['IT', 'Max', 90000],
        ['IT', 'Joe', 85000],
        ['IT', 'Randy', 85000],
        ['IT', 'Will', 70000],
        ['Sales', 'Henry', 80000],
        ['Sales', 'Sam', 60000],
      ],
    },
    solution: `WITH ranked AS (
  SELECT e.name AS employee_name,
         e.salary,
         e.departmentId,
         DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rk
  FROM Employee e
)
SELECT d.name AS "Department", r.employee_name AS "Employee", r.salary AS "Salary"
FROM ranked r
JOIN Department d ON r.departmentId = d.id
WHERE r.rk <= 3;`,
    summary: '找出每个部门薪水排名前三高的员工。这里的「前三高」指薪水的前三个不同档位，同档位的员工全部保留。',
    constraints: [
      '排名按薪水的不同取值计算，并列不占用额外名次。',
      '同一档薪水的多名员工都要出现在结果中。',
    ],
    intuition: '按部门分区、按薪水降序做 DENSE_RANK，名次不超过 3 的就是前三档；并列的员工自然共享同一名次而不会挤掉别人。',
    approach: [
      '用 PARTITION BY departmentId 让排名在部门内独立计算。',
      '按 salary 降序用 DENSE_RANK 得到薪水档位名次。',
      '保留名次不大于 3 的记录。',
      '连接 Department 取部门名称。',
    ],
    walkthrough: [
      'IT 部门薪水档位为 90000、85000、70000、69000，对应名次 1、2、3、4。',
      '85000 有 Joe 与 Randy 两人，都是第 2 名，都保留；Janet 的 69000 为第 4 名被排除。',
      'Sales 部门只有两个档位，两人都在前三之内。',
    ],
    pitfalls: [
      '用 ROW_NUMBER 会让并列的员工只留一个，漏掉同薪同事。',
      '用 RANK 会因跳号导致第三档被误排除。',
      '忘记 PARTITION BY 会变成全公司排名。',
    ],
    mysqlNote: 'MySQL 8.0 写法完全一致；5.7 需用相关子查询统计「比他薪水高的不同薪水个数小于 3」来模拟。',
    related: ['184 部门工资最高的员工', '178 分数排名'],
  },

  262: {
    id: 262,
    title: '行程和用户',
    titleEn: 'Trips and Users',
    slug: 'trips-and-users',
    difficulty: 'Hard',
    category: '聚合与分组',
    schema: `CREATE TABLE Trips (
  id int PRIMARY KEY,
  client_id int,
  driver_id int,
  city_id int,
  status varchar(50),
  request_at date
);
CREATE TABLE Users (
  users_id int PRIMARY KEY,
  banned varchar(10),
  role varchar(20)
);`,
    seed: `INSERT INTO Trips VALUES
 (1,1,10,1,'completed','2013-10-01'),
 (2,2,11,1,'cancelled_by_driver','2013-10-01'),
 (3,3,12,6,'completed','2013-10-01'),
 (4,4,13,6,'cancelled_by_client','2013-10-01'),
 (5,1,10,1,'completed','2013-10-02'),
 (6,2,11,6,'completed','2013-10-02'),
 (7,3,12,6,'completed','2013-10-02'),
 (8,2,12,12,'completed','2013-10-03'),
 (9,3,10,12,'completed','2013-10-03'),
 (10,4,13,12,'cancelled_by_driver','2013-10-03');
INSERT INTO Users VALUES
 (1,'No','client'),(2,'Yes','client'),(3,'No','client'),(4,'No','client'),
 (10,'No','driver'),(11,'No','driver'),(12,'No','driver'),(13,'No','driver');`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['Day', 'Cancellation Rate'],
      rows: [
        ['2013-10-01', 0.33],
        ['2013-10-02', 0.0],
        ['2013-10-03', 0.5],
      ],
    },
    solution: `SELECT t.request_at AS "Day",
       ROUND(
         SUM(CASE WHEN t.status <> 'completed' THEN 1 ELSE 0 END)::numeric / COUNT(*),
         2
       ) AS "Cancellation Rate"
FROM Trips t
JOIN Users c ON c.users_id = t.client_id AND c.banned = 'No'
JOIN Users d ON d.users_id = t.driver_id AND d.banned = 'No'
WHERE t.request_at BETWEEN DATE '2013-10-01' AND DATE '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;`,
    summary: '统计每天的订单取消率，只统计客户与司机都未被封禁的订单，结果保留两位小数。',
    constraints: [
      '客户或司机任一方被封禁的订单要整条排除。',
      '取消率 = 非 completed 订单数 ÷ 该日有效订单总数。',
    ],
    intuition: '把 Users 连接两次，分别过滤客户与司机的封禁状态，这样一次连接就完成筛选；再用条件求和统计取消数，除以总数得到比率。',
    approach: [
      '用两次 JOIN Users 分别校验 client 与 driver 未被封禁。',
      '限定统计日期区间。',
      '按日期分组，用 CASE WHEN 统计非 completed 的订单数。',
      '除以该组总数并用 ROUND 保留两位小数。',
    ],
    walkthrough: [
      '客户 2 被封禁，因此 10 月 1 日的订单 2、10 月 2 日的订单 6、10 月 3 日的订单 8 都被排除。',
      '10 月 1 日剩下 3 单，其中订单 4 被客户取消，比率为 1÷3≈0.33。',
      '10 月 2 日剩下 2 单且都完成，比率 0.00；10 月 3 日剩下 2 单有 1 单取消，比率 0.50。',
    ],
    pitfalls: [
      '整数相除会截断，必须先转成 numeric 再除。',
      '状态判断要覆盖两种取消（客户取消与司机取消），用「不等于 completed」最稳妥。',
      '过滤封禁用户要在连接条件里做，放到 WHERE 里对内连接等价，但对外连接会改变语义。',
    ],
    mysqlNote: 'MySQL 中整数除法会自动转小数，可直接写 SUM(...)/COUNT(*)，并用 ROUND(..., 2)；PostgreSQL 的整数除法会截断，必须显式 ::numeric 或 CAST。日期比较两者一致。',
    related: ['1084 销售分析 III', '577 员工奖金'],
  },

  511: {
    id: 511,
    title: '游戏玩法分析 I',
    titleEn: 'Game Play Analysis I',
    slug: 'game-play-analysis-i',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Activity (
  player_id int,
  device_id int,
  event_date date,
  games_played int,
  PRIMARY KEY (player_id, event_date)
);`,
    seed: `INSERT INTO Activity VALUES
 (1,2,'2016-03-01',5),
 (1,2,'2016-05-02',6),
 (2,3,'2017-06-25',1),
 (3,1,'2016-03-02',0),
 (3,4,'2018-07-03',5);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['player_id', 'first_login'],
      rows: [
        [1, '2016-03-01'],
        [2, '2017-06-25'],
        [3, '2016-03-02'],
      ],
    },
    solution: `SELECT player_id, MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;`,
    summary: '求每位玩家首次登录的日期。',
    constraints: [
      '每位玩家可能有多条活动记录。',
      '首次登录即该玩家最早的活动日期。',
    ],
    intuition: '「每个分组的最早日期」就是按玩家分组后对日期取 MIN，日期类型可以直接比较大小。',
    approach: [
      '按 player_id 分组。',
      '对 event_date 取 MIN 得到最早日期。',
      '输出玩家编号与首登日期两列。',
    ],
    walkthrough: [
      '玩家 1 有 2016-03-01 与 2016-05-02 两条记录，最早为 2016-03-01。',
      '玩家 2 只有一条记录，直接作为首登日期。',
      '玩家 3 的两条记录中 2016-03-02 更早。',
    ],
    pitfalls: [
      '不要对日期做字符串排序，应依赖日期类型的比较。',
      '分组后不能选择未聚合的 device_id，PostgreSQL 会直接报错。',
    ],
    mysqlNote: 'MySQL 写法一致。区别在于 MySQL 非严格模式允许 SELECT 未分组列（返回任意值），PostgreSQL 会报错，后者更安全。',
    related: ['550 游戏玩法分析 IV', '1070 产品销售分析 III'],
  },

  550: {
    id: 550,
    title: '游戏玩法分析 IV',
    titleEn: 'Game Play Analysis IV',
    slug: 'game-play-analysis-iv',
    difficulty: 'Medium',
    category: '日期处理',
    schema: `CREATE TABLE Activity (
  player_id int,
  device_id int,
  event_date date,
  games_played int,
  PRIMARY KEY (player_id, event_date)
);`,
    seed: `INSERT INTO Activity VALUES
 (1,2,'2016-03-01',5),
 (1,2,'2016-03-02',6),
 (2,3,'2017-06-25',1),
 (3,1,'2016-03-02',0),
 (3,4,'2018-07-03',5);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['fraction'],
      rows: [[0.33]],
    },
    solution: `WITH first_day AS (
  SELECT player_id, MIN(event_date) AS d
  FROM Activity
  GROUP BY player_id
)
SELECT ROUND(
         COUNT(a.player_id)::numeric / (SELECT COUNT(*) FROM first_day),
         2
       ) AS fraction
FROM first_day f
LEFT JOIN Activity a
  ON a.player_id = f.player_id AND a.event_date = f.d + 1;`,
    summary: '统计首次登录后第二天仍然登录的玩家占全部玩家的比例，保留两位小数。',
    constraints: [
      '分母是所有玩家数，不是所有活动记录数。',
      '「次日」以每位玩家自己的首登日期为基准。',
    ],
    intuition: '先求出每位玩家的首登日期，再左连接看是否存在「首登日 + 1 天」的记录；左连接保证没有次日登录的玩家仍在分母里。',
    approach: [
      '用 CTE 求每位玩家的首登日期。',
      '左连接 Activity，连接条件为日期等于首登日加一天。',
      '用 COUNT(a.player_id) 统计成功匹配的玩家数（NULL 不计）。',
      '除以玩家总数并保留两位小数。',
    ],
    walkthrough: [
      '三位玩家的首登日期分别是 2016-03-01、2017-06-25、2016-03-02。',
      '只有玩家 1 在 2016-03-02 又登录了，匹配成功。',
      '1 ÷ 3 ≈ 0.33。',
    ],
    pitfalls: [
      '用 COUNT(*) 会把左连接产生的 NULL 行也计入，必须数具体列。',
      '整数相除需转 numeric，否则结果被截断成 0。',
      'PostgreSQL 中 date + 1 直接得到次日，date + INTERVAL \'1 day\' 会变成 timestamp。',
    ],
    mysqlNote: 'MySQL 用 DATE_ADD(f.d, INTERVAL 1 DAY) 或 f.d + INTERVAL 1 DAY；PostgreSQL 可直接写 f.d + 1。除法方面 MySQL 会自动转小数，PostgreSQL 需显式转换。',
    related: ['511 游戏玩法分析 I', '197 上升的温度'],
  },

  570: {
    id: 570,
    title: '至少有5名直接下属的经理',
    titleEn: 'Managers with at Least 5 Direct Reports',
    slug: 'managers-with-at-least-5-direct-reports',
    difficulty: 'Medium',
    category: '聚合与分组',
    schema: `CREATE TABLE Employee (
  id int PRIMARY KEY,
  name varchar(255),
  department varchar(255),
  managerId int
);`,
    seed: `INSERT INTO Employee VALUES
 (101,'John','A',NULL),
 (102,'Dan','A',101),
 (103,'James','A',101),
 (104,'Amy','A',101),
 (105,'Anne','A',101),
 (106,'Ron','B',101);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['name'],
      rows: [['John']],
    },
    solution: `SELECT name
FROM Employee
WHERE id IN (
  SELECT managerId
  FROM Employee
  WHERE managerId IS NOT NULL
  GROUP BY managerId
  HAVING COUNT(*) >= 5
);`,
    summary: '找出直接下属人数不少于 5 人的经理姓名。',
    constraints: [
      '只统计直接下属，不含下属的下属。',
      'managerId 为空表示该员工没有上级。',
    ],
    intuition: '先在同一张表里按 managerId 分组数出每位经理的下属数量，得到合格的经理编号集合，再回表取姓名。',
    approach: [
      '按 managerId 分组统计下属数量。',
      '用 HAVING 保留数量不小于 5 的经理编号。',
      '用 IN 回到员工表取出这些编号对应的姓名。',
    ],
    walkthrough: [
      '按 managerId 分组，101 名下有 102 到 106 共 5 人。',
      'HAVING COUNT(*) >= 5 保留经理编号 101。',
      '回表查到 101 对应 John。',
    ],
    pitfalls: [
      '子查询要排除 managerId 为 NULL 的行，否则会多出一个无意义的分组。',
      '统计的是下属数量而非经理自身记录数，分组键必须是 managerId。',
    ],
    mysqlNote: '写法一致。若改用 JOIN 版本（自连接后按经理分组），两种方言同样通用。',
    related: ['181 超过经理收入的员工', '596 超过 5 名学生的课'],
  },

  577: {
    id: 577,
    title: '员工奖金',
    titleEn: 'Employee Bonus',
    slug: 'employee-bonus',
    difficulty: 'Easy',
    category: '连接',
    schema: `CREATE TABLE Employee (
  empId int PRIMARY KEY,
  name varchar(255),
  supervisor int,
  salary int
);
CREATE TABLE Bonus (
  empId int PRIMARY KEY,
  bonus int
);`,
    seed: `INSERT INTO Employee VALUES (3,'Brad',NULL,4000),(1,'John',3,1000),(2,'Dan',3,2000),(4,'Thomas',3,4000);
INSERT INTO Bonus VALUES (2,500),(4,2000);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['name', 'bonus'],
      rows: [
        ['Brad', null],
        ['John', null],
        ['Dan', 500],
      ],
    },
    solution: `SELECT e.name, b.bonus
FROM Employee e
LEFT JOIN Bonus b ON e.empId = b.empId
WHERE b.bonus < 1000 OR b.bonus IS NULL;`,
    summary: '列出奖金低于 1000 的员工，没有奖金记录的员工也要包含在内。',
    constraints: [
      '没有奖金记录的员工奖金视为空值。',
      '奖金列需要原样输出，缺失时为 NULL。',
    ],
    intuition: '左连接保留所有员工，未匹配到奖金的行 bonus 为 NULL；由于 NULL 参与比较不会成立，必须显式加上 IS NULL 条件。',
    approach: [
      '以 Employee 为左表左连接 Bonus。',
      '筛选奖金小于 1000 的行。',
      '额外用 OR b.bonus IS NULL 把无奖金的员工纳入结果。',
    ],
    walkthrough: [
      'Brad 与 John 在 Bonus 中没有记录，左连接后 bonus 为 NULL。',
      'Dan 的奖金 500 小于 1000，命中条件。',
      'Thomas 的奖金 2000 不满足条件被排除。',
    ],
    pitfalls: [
      '只写 b.bonus < 1000 会漏掉所有无奖金员工，因为 NULL < 1000 的结果是未知而非真。',
      '用内连接会直接丢掉没有奖金记录的员工。',
    ],
    mysqlNote: '写法一致。两种方言中 NULL 的三值逻辑相同，都需要显式判空。',
    related: ['175 组合两个表', '1068 产品销售分析 I'],
  },

  584: {
    id: 584,
    title: '寻找用户推荐人',
    titleEn: 'Find Customer Referee',
    slug: 'find-customer-referee',
    difficulty: 'Easy',
    category: '基础查询',
    schema: `CREATE TABLE Customer (
  id int PRIMARY KEY,
  name varchar(25),
  referee_id int
);`,
    seed: `INSERT INTO Customer VALUES (1,'Will',NULL),(2,'Jane',NULL),(3,'Alex',2),(4,'Bill',NULL),(5,'Zack',1),(6,'Mark',2);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['name'],
      rows: [['Will'], ['Jane'], ['Bill'], ['Zack']],
    },
    solution: `SELECT name
FROM Customer
WHERE referee_id IS NULL OR referee_id <> 2;`,
    summary: '找出推荐人不是 2 号客户的所有客户，包括没有推荐人的客户。',
    constraints: [
      'referee_id 为空表示没有推荐人。',
      '没有推荐人的客户也满足「推荐人不是 2 号」。',
    ],
    intuition: 'NULL 与任何值比较都得到未知而非真，所以只写不等号会把空值行全部过滤掉，必须显式补上判空条件。',
    approach: [
      '筛选 referee_id 不等于 2 的客户。',
      '用 OR referee_id IS NULL 补上没有推荐人的客户。',
    ],
    walkthrough: [
      'Alex 与 Mark 的推荐人是 2，被排除。',
      'Zack 的推荐人是 1，满足不等条件。',
      'Will、Jane、Bill 的 referee_id 为 NULL，靠判空条件纳入结果。',
    ],
    pitfalls: [
      '只写 referee_id <> 2 会漏掉所有 NULL 行，这是本题的核心陷阱。',
      '不要用 = NULL 判空，必须用 IS NULL。',
    ],
    mysqlNote: 'MySQL 写法一致，也可用 IFNULL(referee_id, 0) <> 2；PostgreSQL 对应写 COALESCE(referee_id, 0) <> 2，或更简洁的 referee_id IS DISTINCT FROM 2（MySQL 无此语法）。',
    related: ['183 从不订购的客户', '577 员工奖金'],
  },

  595: {
    id: 595,
    title: '大的国家',
    titleEn: 'Big Countries',
    slug: 'big-countries',
    difficulty: 'Easy',
    category: '基础查询',
    schema: `CREATE TABLE World (
  name varchar(255) PRIMARY KEY,
  continent varchar(255),
  area int,
  population int,
  gdp bigint
);`,
    seed: `INSERT INTO World VALUES
 ('Afghanistan','Asia',652230,25500100,20343000000),
 ('Albania','Europe',28748,2831741,12960000000),
 ('Algeria','Africa',2381741,37100000,188681000000),
 ('Andorra','Europe',468,78115,3712000000),
 ('Angola','Africa',1246700,20609294,100990000000);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['name', 'population', 'area'],
      rows: [
        ['Afghanistan', 25500100, 652230],
        ['Algeria', 37100000, 2381741],
      ],
    },
    solution: `SELECT name, population, area
FROM World
WHERE area >= 3000000 OR population >= 25000000;`,
    summary: '筛出「大国」：面积至少 300 万平方公里，或人口至少 2500 万，满足其一即可。',
    constraints: [
      '两个条件是或的关系，不是且。',
      '边界值取到即满足，使用不小于。',
    ],
    intuition: '条件直接对应一个 OR 表达式，无需分组或连接。',
    approach: [
      '用 WHERE 表达面积或人口任一达标。',
      '注意边界用 >= 而非 >。',
      '输出题目要求的三列。',
    ],
    walkthrough: [
      'Afghanistan 面积不足 300 万，但人口 2550 万达标，入选。',
      'Algeria 面积 238 万不达标，人口 3710 万达标，入选。',
      'Angola 两项都不达标，被排除。',
    ],
    pitfalls: [
      '把 OR 写成 AND 会只留下同时满足两个条件的国家。',
      '边界值容易漏，恰好等于阈值的国家应当入选。',
    ],
    mysqlNote: '写法完全一致。MySQL 中也可用 UNION 拆成两个查询来命中索引，PostgreSQL 同样支持该优化写法。',
    related: ['620 有趣的电影', '584 寻找用户推荐人'],
  },

  596: {
    id: 596,
    title: '超过5名学生的课',
    titleEn: 'Classes More Than 5 Students',
    slug: 'classes-more-than-5-students',
    difficulty: 'Easy',
    category: '聚合与分组',
    schema: `CREATE TABLE Courses (
  student varchar(255),
  class varchar(255),
  PRIMARY KEY (student, class)
);`,
    seed: `INSERT INTO Courses VALUES
 ('A','Math'),('B','English'),('C','Math'),('D','Biology'),('E','Math'),
 ('F','Computer'),('G','Math'),('H','Math'),('I','Math');`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['class'],
      rows: [['Math']],
    },
    solution: `SELECT class
FROM Courses
GROUP BY class
HAVING COUNT(DISTINCT student) >= 5;`,
    summary: '找出至少有 5 名学生选修的课程。',
    constraints: [
      '同一学生在同一课程中只应计一次。',
      '结果中每门课程只出现一次。',
    ],
    intuition: '按课程分组后统计组内学生数，用 HAVING 对聚合结果设阈值；用 DISTINCT 防止重复选课把人数算大。',
    approach: [
      '按 class 分组。',
      '用 COUNT(DISTINCT student) 统计不同学生数。',
      '用 HAVING 保留人数不少于 5 的课程。',
    ],
    walkthrough: [
      '按课程分组后 Math 有 A、C、E、G、H、I 六名学生。',
      'HAVING 判断 6 不小于 5，Math 入选。',
      '其余课程各只有 1 名学生，全部被过滤。',
    ],
    pitfalls: [
      '筛选聚合结果只能用 HAVING，WHERE 阶段还没有聚合值。',
      '若表中可能出现重复选课记录，必须加 DISTINCT。',
    ],
    mysqlNote: '写法一致，COUNT(DISTINCT ...) 两种方言都支持。',
    related: ['570 至少有 5 名直接下属的经理', '182 查找重复的电子邮箱'],
  },

  610: {
    id: 610,
    title: '判断三角形',
    titleEn: 'Triangle Judgement',
    slug: 'triangle-judgement',
    difficulty: 'Easy',
    category: '基础查询',
    schema: `CREATE TABLE Triangle (
  x int,
  y int,
  z int
);`,
    seed: `INSERT INTO Triangle VALUES (13,15,30),(10,20,15);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['x', 'y', 'z', 'triangle'],
      rows: [
        [13, 15, 30, 'No'],
        [10, 20, 15, 'Yes'],
      ],
    },
    solution: `SELECT x, y, z,
       CASE WHEN x + y > z AND x + z > y AND y + z > x
            THEN 'Yes' ELSE 'No' END AS triangle
FROM Triangle;`,
    summary: '判断每组三边能否构成三角形，输出 Yes 或 No。',
    constraints: [
      '三角形成立的条件是任意两边之和大于第三边。',
      '每行都要输出判定结果，不能过滤掉不成立的行。',
    ],
    intuition: '三角不等式需要三个方向同时成立，用 CASE WHEN 把布尔判断转成需要的文本输出。',
    approach: [
      '在 SELECT 中用 CASE WHEN 表达三角不等式。',
      '三个条件用 AND 连接，缺一不可。',
      '满足时输出 Yes，否则输出 No。',
    ],
    walkthrough: [
      '第一组 13+15=28 不大于 30，条件不成立，输出 No。',
      '第二组 10+20>15、10+15>20、20+15>10 三条都成立，输出 Yes。',
      '两行都保留在结果中，只是判定列不同。',
    ],
    pitfalls: [
      '只检查一个方向会误判，必须三个方向都验证。',
      '不等式必须严格大于，等于时三点共线不构成三角形。',
    ],
    mysqlNote: 'MySQL 可用 IF(条件, \'Yes\', \'No\') 简写，PostgreSQL 没有 IF 函数，需用 CASE WHEN（CASE WHEN 是标准语法，MySQL 也支持）。',
    related: ['595 大的国家', '620 有趣的电影'],
  },

  619: {
    id: 619,
    title: '只出现一次的最大数字',
    titleEn: 'Biggest Single Number',
    slug: 'biggest-single-number',
    difficulty: 'Easy',
    category: '子查询',
    schema: `CREATE TABLE MyNumbers (
  num int
);`,
    seed: `INSERT INTO MyNumbers VALUES (8),(8),(3),(3),(1),(4),(5),(6);`,
    kind: 'query',
    orderMatters: false,
    expected: {
      columns: ['num'],
      rows: [[6]],
    },
    solution: `SELECT MAX(num) AS num
FROM (
  SELECT num
  FROM MyNumbers
  GROUP BY num
  HAVING COUNT(*) = 1
) t;`,
    summary: '找出只出现过一次的数字中最大的那个；若不存在这样的数字，返回 NULL。',
    constraints: [
      '只考虑出现次数恰好为一次的数字。',
      '不存在符合条件的数字时结果为 NULL 而不是空结果。',
    ],
    intuition: '先用分组筛出「出现一次」的候选，再对候选取最大值。外层的 MAX 在候选为空时返回 NULL，正好满足题目要求。',
    approach: [
      '按 num 分组并用 HAVING COUNT(*) = 1 保留只出现一次的数字。',
      '把这些候选作为派生表。',
      '对派生表取 MAX 得到最大值，空集时自然为 NULL。',
    ],
    walkthrough: [
      '分组统计后 8 与 3 各出现两次被排除。',
      '候选为 1、4、5、6。',
      '取最大值得到 6。',
    ],
    pitfalls: [
      '直接对全表取 MAX 会得到 8，忽略了「只出现一次」的条件。',
      '若把 HAVING 写在外层，就无法先筛候选再取最大值。',
    ],
    mysqlNote: '写法一致。PostgreSQL 要求派生表必须有别名（此处的 t），MySQL 同样要求。',
    related: ['182 查找重复的电子邮箱', '596 超过 5 名学生的课'],
  },

  620: {
    id: 620,
    title: '有趣的电影',
    titleEn: 'Not Boring Movies',
    slug: 'not-boring-movies',
    difficulty: 'Easy',
    category: '基础查询',
    schema: `CREATE TABLE Cinema (
  id int PRIMARY KEY,
  movie varchar(255),
  description varchar(255),
  rating decimal(2,1)
);`,
    seed: `INSERT INTO Cinema VALUES
 (1,'War','great 3D',8.9),
 (2,'Science','fiction',8.5),
 (3,'irish','boring',6.2),
 (4,'Ice song','Fantacy',8.6),
 (5,'House card','Interesting',9.1);`,
    kind: 'query',
    orderMatters: true,
    expected: {
      columns: ['id', 'movie', 'description', 'rating'],
      rows: [
        [5, 'House card', 'Interesting', 9.1],
        [1, 'War', 'great 3D', 8.9],
      ],
    },
    solution: `SELECT id, movie, description, rating
FROM Cinema
WHERE id % 2 = 1
  AND description <> 'boring'
ORDER BY rating DESC;`,
    summary: '找出编号为奇数且简介不是 boring 的电影，按评分从高到低排列。',
    constraints: [
      '编号需为奇数。',
      '结果必须按评分降序排列。',
    ],
    intuition: '两个筛选条件直接用 AND 组合，取模判断奇偶，最后加排序。',
    approach: [
      '用 id % 2 = 1 判断奇数编号。',
      '排除 description 等于 boring 的记录。',
      '按 rating 降序排序输出。',
    ],
    walkthrough: [
      '偶数编号的 Science 与 Ice song 首先被排除。',
      '奇数编号中 irish 的简介是 boring，也被排除。',
      '剩下 House card（9.1）与 War（8.9），按评分降序输出。',
    ],
    pitfalls: [
      '忘记 ORDER BY 会导致行序不确定，本题明确要求排序。',
      '判断奇数用取模，不要假设 id 连续。',
    ],
    mysqlNote: 'MySQL 中取模也可写 MOD(id, 2) = 1，两种方言都支持 % 运算符；字符串比较默认都不区分大小写与否取决于排序规则，PostgreSQL 默认区分大小写，MySQL 默认不区分。',
    related: ['595 大的国家', '610 判断三角形'],
  },
}

import { PGlite } from '@electric-sql/pglite'

const cases = []
const add = (id, schema, seed, solution) => cases.push({ id, schema, seed, solution })

// 177
add(177,
`CREATE TABLE Employee (
  id int PRIMARY KEY,
  salary int
);`,
`INSERT INTO Employee VALUES (1,100),(2,200),(3,300),(4,300);`,
`SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS "getNthHighestSalary(2)";`)

// 178
add(178,
`CREATE TABLE Scores (
  id int PRIMARY KEY,
  score decimal(3,2)
);`,
`INSERT INTO Scores VALUES (1,3.50),(2,3.65),(3,4.00),(4,3.85),(5,4.00),(6,3.65);`,
`SELECT score,
       DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"
FROM Scores
ORDER BY score DESC;`)

// 180
add(180,
`CREATE TABLE Logs (
  id int PRIMARY KEY,
  num varchar(10)
);`,
`INSERT INTO Logs VALUES (1,'1'),(2,'1'),(3,'1'),(4,'2'),(6,'1'),(7,'2'),(8,'2'),(9,'2');`,
`SELECT DISTINCT num AS "ConsecutiveNums"
FROM (
  SELECT num,
         LAG(num) OVER (ORDER BY id) AS prev_num,
         LEAD(num) OVER (ORDER BY id) AS next_num
  FROM Logs
) t
WHERE num = prev_num AND num = next_num;`)

// 185
add(185,
`CREATE TABLE Employee (
  id int PRIMARY KEY,
  name varchar(255),
  salary int,
  departmentId int
);
CREATE TABLE Department (
  id int PRIMARY KEY,
  name varchar(255)
);`,
`INSERT INTO Employee VALUES (1,'Joe',85000,1),(2,'Henry',80000,2),(3,'Sam',60000,2),(4,'Max',90000,1),(5,'Janet',69000,1),(6,'Randy',85000,1),(7,'Will',70000,1);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');`,
`SELECT d.name AS "Department", t.name AS "Employee", t.salary AS "Salary"
FROM (
  SELECT e.name, e.salary, e.departmentId,
         DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk
  FROM Employee e
) t
JOIN Department d ON d.id = t.departmentId
WHERE t.rnk <= 3;`)

// 262
add(262,
`CREATE TABLE Trips (
  id int PRIMARY KEY,
  client_id int,
  driver_id int,
  city_id int,
  status varchar(32),
  request_at date
);
CREATE TABLE Users (
  users_id int PRIMARY KEY,
  banned varchar(3),
  role varchar(16)
);`,
`INSERT INTO Trips VALUES
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
`SELECT t.request_at AS "Day",
       ROUND(
         SUM(CASE WHEN t.status <> 'completed' THEN 1 ELSE 0 END)::numeric
         / COUNT(*), 2
       ) AS "Cancellation Rate"
FROM Trips t
JOIN Users c ON c.users_id = t.client_id AND c.banned = 'No'
JOIN Users d ON d.users_id = t.driver_id AND d.banned = 'No'
WHERE t.request_at BETWEEN DATE '2013-10-01' AND DATE '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;`)

// 511
add(511,
`CREATE TABLE Activity (
  player_id int,
  device_id int,
  event_date date,
  games_played int,
  PRIMARY KEY (player_id, event_date)
);`,
`INSERT INTO Activity VALUES
  (1,2,'2016-03-01',5),
  (1,2,'2016-05-02',6),
  (2,3,'2017-06-25',1),
  (3,1,'2016-03-02',0),
  (3,4,'2018-07-03',5);`,
`SELECT player_id,
       MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;`)

// 550
add(550,
`CREATE TABLE Activity (
  player_id int,
  device_id int,
  event_date date,
  games_played int,
  PRIMARY KEY (player_id, event_date)
);`,
`INSERT INTO Activity VALUES
  (1,2,'2016-03-01',5),
  (1,2,'2016-03-02',6),
  (2,3,'2017-06-25',1),
  (3,1,'2016-03-02',0),
  (3,4,'2018-07-03',5);`,
`WITH first_login AS (
  SELECT player_id, MIN(event_date) AS d
  FROM Activity
  GROUP BY player_id
)
SELECT ROUND(
         COUNT(a.player_id)::numeric / (SELECT COUNT(*) FROM first_login),
         2
       ) AS fraction
FROM first_login f
LEFT JOIN Activity a
  ON a.player_id = f.player_id
 AND a.event_date = f.d + INTERVAL '1 day';`)

// 570
add(570,
`CREATE TABLE Employee (
  id int PRIMARY KEY,
  name varchar(255),
  department varchar(255),
  managerId int
);`,
`INSERT INTO Employee VALUES
  (101,'John','A',NULL),
  (102,'Dan','A',101),
  (103,'James','A',101),
  (104,'Amy','A',101),
  (105,'Anne','A',101),
  (106,'Ron','B',101),
  (107,'Eve','B',102),
  (108,'Sam','B',102);`,
`SELECT m.name
FROM Employee m
JOIN Employee e ON e.managerId = m.id
GROUP BY m.id, m.name
HAVING COUNT(*) >= 5;`)

// 574
add(574,
`CREATE TABLE Candidate (
  id int PRIMARY KEY,
  name varchar(255)
);
CREATE TABLE Vote (
  id int PRIMARY KEY,
  candidateId int
);`,
`INSERT INTO Candidate VALUES (1,'A'),(2,'B'),(3,'C'),(4,'D'),(5,'E');
INSERT INTO Vote VALUES (1,2),(2,4),(3,3),(4,2),(5,5);`,
`SELECT c.name AS "Name"
FROM Vote v
JOIN Candidate c ON c.id = v.candidateId
GROUP BY c.id, c.name
ORDER BY COUNT(*) DESC
LIMIT 1;`)

// 577
add(577,
`CREATE TABLE Employee (
  empId int PRIMARY KEY,
  name varchar(255),
  supervisor int,
  salary int
);
CREATE TABLE Bonus (
  empId int PRIMARY KEY,
  bonus int
);`,
`INSERT INTO Employee VALUES (3,'Brad',NULL,4000),(1,'John',3,1000),(2,'Dan',3,2000),(4,'Thomas',3,4000);
INSERT INTO Bonus VALUES (2,500),(4,2000);`,
`SELECT e.name, b.bonus
FROM Employee e
LEFT JOIN Bonus b ON b.empId = e.empId
WHERE b.bonus < 1000 OR b.bonus IS NULL;`)

// 578
add(578,
`CREATE TABLE SurveyLog (
  id int,
  action varchar(16),
  question_id int,
  answer_id int,
  q_num int,
  timestamp int
);`,
`INSERT INTO SurveyLog VALUES
  (5,'show',285,NULL,1,123),
  (5,'answer',285,124124,1,124),
  (5,'show',369,NULL,2,125),
  (5,'skip',369,NULL,2,126),
  (6,'show',285,NULL,1,200),
  (6,'skip',285,NULL,1,201),
  (6,'show',369,NULL,2,202),
  (6,'answer',369,124125,2,203),
  (7,'show',369,NULL,1,300),
  (7,'answer',369,124126,1,301);`,
`SELECT question_id AS survey_log
FROM SurveyLog
GROUP BY question_id
ORDER BY SUM(CASE WHEN action = 'answer' THEN 1 ELSE 0 END)::numeric
         / SUM(CASE WHEN action = 'show' THEN 1 ELSE 0 END) DESC,
         question_id
LIMIT 1;`)

// 580
add(580,
`CREATE TABLE Student (
  student_id int PRIMARY KEY,
  student_name varchar(255),
  gender varchar(1),
  dept_id int
);
CREATE TABLE Department (
  dept_id int PRIMARY KEY,
  dept_name varchar(255)
);`,
`INSERT INTO Department VALUES (1,'Engineering'),(2,'Science'),(3,'Law');
INSERT INTO Student VALUES
  (1,'Jack','M',1),
  (2,'Jane','F',1),
  (3,'Mark','M',2),
  (4,'Nina','F',NULL);`,
`SELECT d.dept_name, COUNT(s.student_id) AS student_number
FROM Department d
LEFT JOIN Student s ON s.dept_id = d.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY student_number DESC, d.dept_name;`)

// 584
add(584,
`CREATE TABLE Customer (
  id int PRIMARY KEY,
  name varchar(255),
  referee_id int
);`,
`INSERT INTO Customer VALUES (1,'Will',NULL),(2,'Jane',NULL),(3,'Alex',2),(4,'Bill',NULL),(5,'Zack',1),(6,'Mark',2);`,
`SELECT name
FROM Customer
WHERE referee_id IS DISTINCT FROM 2;`)

// 585
add(585,
`CREATE TABLE Insurance (
  pid int PRIMARY KEY,
  tiv_2015 decimal(15,2),
  tiv_2016 decimal(15,2),
  lat decimal(15,2),
  lon decimal(15,2)
);`,
`INSERT INTO Insurance VALUES
  (1,10,5,10,10),
  (2,20,20,20,20),
  (3,10,30,20,20),
  (4,10,40,40,40);`,
`SELECT ROUND(SUM(tiv_2016), 2) AS tiv_2016
FROM Insurance
WHERE tiv_2015 IN (
        SELECT tiv_2015 FROM Insurance GROUP BY tiv_2015 HAVING COUNT(*) > 1
      )
  AND (lat, lon) IN (
        SELECT lat, lon FROM Insurance GROUP BY lat, lon HAVING COUNT(*) = 1
      );`)

const db = await PGlite.create()
for (const c of cases) {
  await db.exec('BEGIN')
  try {
    await db.exec(c.schema)
    await db.exec(c.seed)
    const res = await db.query(c.solution)
    const columns = res.fields.map((f) => f.name)
    const rows = res.rows.map((r) => columns.map((col) => r[col]))
    console.log(`=== ${c.id} OK`)
    console.log('columns:', JSON.stringify(columns))
    console.log('rows:', JSON.stringify(rows))
  } catch (e) {
    console.log(`=== ${c.id} ERROR: ${e.message.split('\n')[0]}`)
  } finally {
    await db.exec('ROLLBACK').catch(() => {})
  }
}
await db.close()

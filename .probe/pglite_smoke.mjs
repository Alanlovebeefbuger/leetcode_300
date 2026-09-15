import { PGlite } from '@electric-sql/pglite'

const db = new PGlite()

// 建库、灌数据、查询一次走通
await db.exec(`
  CREATE TABLE Employee (id int, name text, salary int, departmentId int);
  INSERT INTO Employee VALUES (1,'Joe',70000,1),(2,'Jim',90000,1),(3,'Henry',80000,2),(4,'Sam',60000,2),(5,'Max',90000,1);
  CREATE TABLE Department (id int, name text);
  INSERT INTO Department VALUES (1,'IT'),(2,'Sales');
`)

const result = await db.query(`
  SELECT d.name AS "Department", e.name AS "Employee", e.salary AS "Salary"
  FROM Employee e JOIN Department d ON e.departmentId = d.id
  WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId
  )
  ORDER BY d.name, e.name
`)

console.log('列名:', result.fields.map(f => f.name))
console.log('行数:', result.rows.length)
console.log('数据:', JSON.stringify(result.rows))

// 窗口函数
const win = await db.query(`
  SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employee ORDER BY rnk, name
`)
console.log('\n窗口函数:', JSON.stringify(win.rows.slice(0, 3)))

// CTE
const cte = await db.query(`
  WITH avg_sal AS (SELECT AVG(salary) AS a FROM Employee)
  SELECT ROUND(a::numeric, 2) AS avg FROM avg_sal
`)
console.log('CTE + 类型转换:', JSON.stringify(cte.rows))

// 数据修改类题目
await db.exec(`CREATE TABLE Person (id int, email text); INSERT INTO Person VALUES (1,'a@b.com'),(2,'c@d.com'),(3,'a@b.com');`)
await db.exec(`DELETE FROM Person WHERE id NOT IN (SELECT MIN(id) FROM Person GROUP BY email)`)
const after = await db.query('SELECT * FROM Person ORDER BY id')
console.log('DELETE 后表状态:', JSON.stringify(after.rows))

// 报错信息是否可读
try {
  await db.query('SELECT * FROM NoSuchTable')
} catch (error) {
  console.log('\n错误信息:', error.message)
}

await db.close()
console.log('\nPGlite 在 Node 中可用')

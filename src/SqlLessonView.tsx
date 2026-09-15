import type * as React from 'react'
import SqlPlayground from './SqlPlayground'
import type { SqlLesson } from './data/sql/types'

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="lesson-section"><div className="section-title"><span>{number}</span><h3>{title}</h3></div>{children}</section>
}

export default function SqlLessonView({ lesson, onRelated }: { lesson: SqlLesson; onRelated: (id: number) => void }) {
  return <div className="lesson-content">
    <Section number="01" title="题意与数据">
      <p className="lead">{lesson.summary}</p>
      <ul className="constraints">{lesson.constraints.map(item => <li key={item}>{item}</li>)}</ul>
      <div className="expected-preview">
        <b>期望结果</b>
        <div className="table-scroll">
          <table>
            <thead><tr>{lesson.expected.columns.map(column => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>{lesson.expected.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{cell === null || cell === undefined ? 'NULL' : String(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <small>{lesson.orderMatters ? '本题要求按题意排序。' : '本题不要求行顺序。'}</small>
      </div>
    </Section>

    <Section number="02" title="思路">
      <div className="insight"><span>INTUITION</span><p>{lesson.intuition}</p></div>
    </Section>

    <Section number="03" title="解题步骤">
      <ol className="steps">{lesson.approach.map((step, index) => <li key={index}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
    </Section>

    <Section number="04" title="SQL 在线练习">
      <SqlPlayground lesson={lesson}/>
    </Section>

    <Section number="05" title="查询是怎么得出结果的">
      <ol className="steps">{lesson.walkthrough.map((step, index) => <li key={index}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
      <details className="solution-reveal">
        <summary>查看参考答案</summary>
        <pre className="solution-sql">{lesson.solution}</pre>
      </details>
    </Section>

    <Section number="06" title="易错点与方言差异">
      <ul className="pitfalls">{lesson.pitfalls.map((item, index) => <li key={index}><span>!</span>{item}</li>)}</ul>
      <div className="dialect-note">
        <b>MySQL 对应写法</b>
        <p>{lesson.mysqlNote}</p>
      </div>
      {!!lesson.related.length && <>
        <h4 className="subheading">关联练习</h4>
        <div className="related">{lesson.related.map(item => {
          const id = String(item).trim().match(/^\d+/)?.[0]
          return <button key={String(item)} onClick={() => id && onRelated(Number(id))} disabled={!id}>
            {String(item)} <span>{id ? '打开题目 →' : '延伸阅读'}</span>
          </button>
        })}</div>
      </>}
    </Section>
  </div>
}

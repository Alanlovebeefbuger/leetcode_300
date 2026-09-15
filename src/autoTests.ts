/**
 * 从讲义示例自动生成可运行的 Python 断言测试。
 *
 * 讲义示例输入形如 `nums = [2,7,11,15], target = 9`，输出是一个字面量。
 * 只要能同时确定「方法签名 + 全部实参 + 期望输出」，就能生成用户可直接点
 * 「验证提交」运行的测试，无需自己手写调用。
 *
 * 生成器刻意保守：任何无法确信的情况都返回 null，由调用方回退到注释式模板。
 * 宁可不生成，也不能让正确的解法被误判为错误。
 */

export type AutoTestExample = { input?: string; output?: string; explanation?: string }

/** 需要由字面量构造出对象的参数类型，键为注解中出现的类名 */
const NODE_BUILDERS: Record<string, string> = {
  ListNode: '_lc_make_list',
  TreeNode: '_lc_make_tree',
}

/**
 * 平台注入但本生成器无法从字面量还原的类型。
 * 命中这些注解一律放弃生成，避免构造出错误的调用。
 */
const UNSUPPORTED_ANNOTATIONS = [
  'Node', 'NestedInteger', 'Employee', 'MountainArray', 'ArrayReader',
  'BinaryMatrix', 'GridMaster', 'Robot', 'Sea', 'Callable',
]

/** 答案不唯一，示例值只是其中一种合法输出，无法用相等性断言 */
const AMBIGUOUS_ANSWER_PROBLEMS = new Set<string>([
  '108', // 将有序数组转换为二叉搜索树：任意平衡形态均合法
  '451', // 根据字符出现频率排序：同频字符顺序任意
  '1382', // 将二叉搜索树变平衡：任意平衡形态均合法
])

/** 按顶层逗号切分，忽略括号与引号内部的逗号 */
function splitTopLevel(text: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  let quote: string | null = null
  for (const char of text) {
    if (quote) {
      current += char
      if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      current += char
      continue
    }
    if ('[({'.includes(char)) depth += 1
    if ('])}'.includes(char)) depth -= 1
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += char
  }
  if (current.trim()) parts.push(current)
  return parts
}

/**
 * 严格校验字面量：只接受数组、字符串、数字和 true/false/null 三个关键字。
 * 用正则容易被 `[0,1] 或 [1,0]` 这类带说明文字的输出骗过，所以逐字符扫描。
 */
function isStrictLiteral(text: string): boolean {
  const value = text.trim()
  if (!value || value.includes('...') || value.includes('…')) return false

  let index = 0
  const stack: string[] = []
  let sawValue = false

  while (index < value.length) {
    const char = value[index]
    if (char === ' ' || char === '\n' || char === '\t') {
      index += 1
      continue
    }
    if (char === '"' || char === "'") {
      const close = value.indexOf(char, index + 1)
      if (close === -1) return false
      index = close + 1
      sawValue = true
      continue
    }
    if (char === '[') {
      stack.push(']')
      index += 1
      continue
    }
    if (char === ']') {
      if (stack.pop() !== ']') return false
      index += 1
      sawValue = true
      continue
    }
    if (char === ',') {
      if (!stack.length) return false
      index += 1
      continue
    }
    const numberMatch = value.slice(index).match(/^-?\d+(?:\.\d+)?/)
    if (numberMatch) {
      index += numberMatch[0].length
      sawValue = true
      continue
    }
    const wordMatch = value.slice(index).match(/^(true|false|null|True|False|None)\b/)
    if (wordMatch) {
      index += wordMatch[0].length
      sawValue = true
      continue
    }
    return false
  }
  return sawValue && stack.length === 0
}

/** 把 JS 风格字面量转成等价的 Python 字面量 */
function toPythonLiteral(raw: string): string {
  return raw
    .trim()
    .replace(/\btrue\b/g, 'True')
    .replace(/\bfalse\b/g, 'False')
    .replace(/\bnull\b/g, 'None')
}

type Parameter = { name: string; annotation: string }
type SolutionShape = { method: string; parameters: Parameter[] }

/**
 * 解析唯一的 Solution 公开方法及其形参注解。
 * 设计类（非 Solution 类或多公开方法）与原地修改类（无 return）都不适合示例式断言。
 */
function inspectSolution(code: string): SolutionShape | null {
  if (/^\s*class\s+(?!Solution\b)\w+/m.test(code)) return null

  const definitions = [...code.matchAll(/^\s{4}def\s+([A-Za-z_]\w*)\s*\(([\s\S]*?)\)\s*(?:->[^:]*)?:/gm)]
  const publicDefinitions = definitions.filter(match => !match[1].startsWith('_'))
  if (publicDefinitions.length !== 1) return null

  const [, method, rawParameters] = publicDefinitions[0]
  const body = code.slice(code.indexOf(`def ${method}`))
  if (!/\breturn\s+\S/.test(body)) return null

  const parameters: Parameter[] = []
  for (const part of splitTopLevel(rawParameters)) {
    const text = part.trim()
    if (!text || text === 'self') continue
    const [nameWithAnnotation] = text.split('=')
    const [name, ...annotationParts] = nameWithAnnotation.split(':')
    parameters.push({ name: name.trim(), annotation: annotationParts.join(':').trim() })
  }
  if (!parameters.length) return null
  return { method, parameters }
}

/** 依据形参注解把字面量包装成对象；无法确信时返回 null 以放弃生成 */
function buildArgument(parameter: Parameter, literal: string): string | null {
  const { annotation } = parameter
  if (UNSUPPORTED_ANNOTATIONS.some(name => new RegExp(`\\b${name}\\b`).test(annotation))) return null

  const isArrayLiteral = literal.startsWith('[')
  for (const [className, builder] of Object.entries(NODE_BUILDERS)) {
    if (!new RegExp(`\\b${className}\\b`).test(annotation)) continue
    // 形如 List[ListNode]：数组的每个元素各自构造
    if (/\b(List|list)\s*\[/.test(annotation)) {
      if (!isArrayLiteral) return null
      return `[${builder}(item) for item in ${literal}]`
    }
    // 注解要求节点对象，但示例给的是标量（例如 236 题的 p = 5 指节点值），无法还原
    if (!isArrayLiteral) return null
    return `${builder}(${literal})`
  }
  return literal
}

export function buildAutoTests(
  code: string,
  examples: AutoTestExample[] = [],
  problemId?: number | string,
): string | null {
  if (problemId !== undefined && AMBIGUOUS_ANSWER_PROBLEMS.has(String(problemId))) return null

  const shape = inspectSolution(code)
  if (!shape) return null

  const cases: Array<{ call: string; expected: string; label: string }> = []
  for (const example of examples) {
    if (!example.input || !example.output) continue

    const parts = splitTopLevel(example.input)
    const provided = new Map<string, string>()
    let parsable = true
    for (const part of parts) {
      const match = part.match(/^\s*([A-Za-z_]\w*)\s*=\s*([\s\S]+?)\s*$/)
      if (!match || !isStrictLiteral(match[2])) {
        parsable = false
        break
      }
      provided.set(match[1], toPythonLiteral(match[2]))
    }
    if (!parsable) continue

    // 实参必须与签名参数一一对应：数量或名字不符（例如交互题的 bad、pick）一律跳过
    if (provided.size !== shape.parameters.length) continue
    if (!shape.parameters.every(parameter => provided.has(parameter.name))) continue
    if (!isStrictLiteral(example.output)) continue

    const args: string[] = []
    for (const parameter of shape.parameters) {
      const argument = buildArgument(parameter, provided.get(parameter.name)!)
      if (argument === null) {
        args.length = 0
        break
      }
      args.push(argument)
    }
    if (!args.length) continue

    cases.push({
      call: `Solution().${shape.method}(${args.join(', ')})`,
      expected: toPythonLiteral(example.output),
      label: example.input.replace(/\s+/g, ' ').trim(),
    })
  }
  if (!cases.length) return null

  const lines = [
    '# 依据讲义示例自动生成，可直接点「验证提交」运行。',
    '# 想加强验证就继续往下追加自己的 assert。',
    '',
  ]
  cases.forEach((item, index) => {
    lines.push(`# 示例 ${index + 1}：${item.label}`)
    lines.push(`result = ${item.call}`)
    lines.push(`expected = ${item.expected}`)
    lines.push(
      `assert _lc_match(result, expected), f"示例 ${index + 1} 期望 {expected}，实际得到 {_lc_show(result)}"`,
    )
    lines.push('')
  })
  lines.push(`print("示例测试全部通过，共 ${cases.length} 个")`)
  return lines.join('\n')
}

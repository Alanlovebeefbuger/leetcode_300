import { loadPyodide, version, type PyodideInterface } from 'pyodide'

type RunRequest = { id: number; source: string }
type WorkerScope = {
  postMessage: (message: unknown) => void
  onmessage: ((event: MessageEvent<RunRequest>) => void) | null
}

const scope = self as unknown as WorkerScope
const prelude = `from typing import *
from collections import *
from functools import *
from itertools import *
from math import *
from heapq import *
from bisect import *

# math.pow 会覆盖内建 pow，导致 pow(base, exp, mod) 模幂报错且返回浮点数，这里恢复内建版本。
from builtins import pow

class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def _lc_tree_to_list(root):
    out, queue = [], [root]
    while queue:
        node = queue.pop(0)
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out

def _lc_normalize(value):
    if isinstance(value, ListNode):
        result, seen = [], set()
        while value is not None and id(value) not in seen:
            seen.add(id(value)); result.append(value.val); value = value.next
        return result
    if isinstance(value, TreeNode):
        return _lc_tree_to_list(value)
    if isinstance(value, (list, tuple)):
        return [_lc_normalize(item) for item in value]
    if isinstance(value, set):
        return sorted(_lc_normalize(item) for item in value)
    return value

def _lc_make_list(values):
    head = None
    for value in reversed(values or []):
        head = ListNode(value, head)
    return head

def _lc_make_tree(values):
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue, i = [root], 1
    while queue and i < len(values):
        node = queue.pop(0)
        if i < len(values):
            if values[i] is not None:
                node.left = TreeNode(values[i])
                queue.append(node.left)
            i += 1
        if i < len(values):
            if values[i] is not None:
                node.right = TreeNode(values[i])
                queue.append(node.right)
            i += 1
    return root

def _lc_show(value):
    return _lc_normalize(value)

def _lc_key(value):
    if isinstance(value, list):
        return repr(sorted((_lc_key(item) for item in value)))
    return repr(value)

def _lc_same(left, right):
    # 空链表既可能表示为 None，也可能表示为 []
    if left is None and right == []:
        return True
    if right is None and left == []:
        return True
    if isinstance(left, bool) != isinstance(right, bool):
        return False
    if isinstance(left, (int, float)) and isinstance(right, (int, float)):
        return abs(left - right) < 1e-5
    if isinstance(left, list) and isinstance(right, list):
        return len(left) == len(right) and all(_lc_same(a, b) for a, b in zip(left, right))
    return left == right

def _lc_match(result, expected):
    left, right = _lc_normalize(result), _lc_normalize(expected)
    if _lc_same(left, right):
        return True
    # 不少题目的答案顺序不唯一（三数之和、字母异位词分组等），
    # 此时退化为「元素多重集合相同」的比较。
    if isinstance(left, list) and isinstance(right, list) and len(left) == len(right):
        try:
            return sorted(_lc_key(item) for item in left) == sorted(_lc_key(item) for item in right)
        except TypeError:
            return False
    return False
`

let runtimePromise: Promise<PyodideInterface> | null = null
let runtimeReady = false
function getRuntime() {
  runtimePromise ??= loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${version}/full/`,
  })
  return runtimePromise
}

scope.onmessage = async ({ data }) => {
  const stdout: string[] = []
  const stderr: string[] = []
  try {
    // 首次运行需要从 CDN 下载 Python 运行时，先告知界面进入下载阶段，
    // 否则用户在十几秒内看不到任何反馈，容易误以为卡死。
    if (!runtimeReady) scope.postMessage({ id: data.id, phase: 'loading' })
    const runtime = await getRuntime()
    runtimeReady = true
    scope.postMessage({ id: data.id, phase: 'running' })
    runtime.setStdout({ batched: value => stdout.push(value) })
    runtime.setStderr({ batched: value => stderr.push(value) })
    const globals = runtime.runPython('dict()')
    try {
      await runtime.runPythonAsync(`${prelude}\n${data.source}`, { globals })
    } finally {
      globals.destroy()
    }
    scope.postMessage({ id: data.id, ok: true, stdout: stdout.join('\n'), stderr: stderr.join('\n') })
  } catch (error) {
    scope.postMessage({
      id: data.id,
      ok: false,
      stdout: stdout.join('\n'),
      stderr: stderr.join('\n'),
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
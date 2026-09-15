import type { Lesson } from './lessons';

export const lessonsBatch7: Record<number, Lesson> = {

  37: {
    id: 37, title: '解数独', summary: '在 9×9 棋盘中填入数字，使每行、每列和每个 3×3 宫都恰好包含 1 到 9。',
    constraints: ['棋盘固定为 9×9，空格用字符 "." 表示。', '初始数字不冲突，题目保证存在且通常只有一个解。'],
    examples: [{ input: 'board 首行 = "53..7...."', output: '原地填成合法数独', explanation: '所有空格被 1 到 9 填满，三类区域均无重复。' }],
    intuition: '每个空格的候选由所在行、列、宫共同排除；优先选择候选最少的空格能尽早暴露冲突，大幅压缩搜索树。',
    bruteForce: '给每个空格盲试 1 到 9，再在填完后验证，最坏会产生 9^k 个候选棋盘。',
    approach: ['建立 9 个行集合、列集合和宫集合。', '扫描棋盘，把已有数字登记并收集空格坐标。', '每轮在未填空格中找合法候选最少的位置。', '逐个放入候选，同时更新三个集合。', '递归失败时撤销数字和集合记录，成功填完后停止。'],
    code: `class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        empty = []
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.': empty.append((r, c))
                else:
                    x = board[r][c]; rows[r].add(x); cols[c].add(x); boxes[r//3*3+c//3].add(x)
        def dfs(i):
            if i == len(empty): return True
            best = i
            for j in range(i, len(empty)):
                r, c = empty[j]; b = r//3*3+c//3
                if len(rows[r] | cols[c] | boxes[b]) < len(rows[empty[best][0]] | cols[empty[best][1]] | boxes[empty[best][0]//3*3+empty[best][1]//3]): best = j
            empty[i], empty[best] = empty[best], empty[i]
            r, c = empty[i]; b = r//3*3+c//3
            for x in '123456789':
                if x not in rows[r] and x not in cols[c] and x not in boxes[b]:
                    board[r][c] = x; rows[r].add(x); cols[c].add(x); boxes[b].add(x)
                    if dfs(i + 1): return True
                    rows[r].remove(x); cols[c].remove(x); boxes[b].remove(x); board[r][c] = '.'
            empty[i], empty[best] = empty[best], empty[i]
            return False
        dfs(0)`,
    walkthrough: { input: '某空格位于第 1 行第 3 列', steps: ['读取已有数字并建立占用集合。', '该格所在行排除 5、3、7。', '所在列与宫继续排除候选。', '放入一个剩余数字后递归，冲突则撤销。'], result: '所有空格填完时棋盘即为答案。' },
    complexity: { time: '最坏 O(9^k)，k 为空格数；约束传播通常远快于上界。', space: 'O(k+81)，递归栈、空格表与占用集合。' },
    pitfalls: ['宫编号应为 (r//3)*3+c//3。', '回溯时必须同步恢复棋盘和三类集合。'], related: ['回溯', '约束满足问题'],
  },
  40: {
    id: 40, title: '组合总和 II', summary: '从含重复值的数组中选取若干元素凑成目标，每个下标至多使用一次且结果组合不能重复。',
    constraints: ['候选数通常为正整数，同一数值可能出现多次。', '每个数组位置最多选一次，答案按数值组合去重。'],
    examples: [{ input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[[1,1,6],[1,2,5],[1,7],[2,6]]', explanation: '各组合总和为 8，且没有重复组合。' }],
    intuition: '排序让相同值相邻；同一递归层只尝试第一个相同值，就能阻止相同组合由不同下标顺序重复产生。',
    bruteForce: '枚举所有 2^n 个下标子集，再用集合按排序后的值去重，浪费搜索和额外存储。',
    approach: ['先把 candidates 升序排序。', '递归参数包含起点 start、剩余值 remain 和当前路径。', '从 start 开始枚举，保证每个下标只用一次。', '同层遇到与前一项相同的值就跳过，值超过 remain 时停止。', '选择后递归 i+1，remain 为零时复制路径。'],
    code: `class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort(); ans = []
        def dfs(start, remain, path):
            if remain == 0:
                ans.append(path[:]); return
            for i in range(start, len(candidates)):
                x = candidates[i]
                if x > remain: break
                if i > start and x == candidates[i - 1]: continue
                path.append(x); dfs(i + 1, remain - x, path); path.pop()
        dfs(0, target, [])
        return ans`,
    walkthrough: { input: '[1,1,2,5], target=3', steps: ['排序后数组不变。', '首层选择第一个 1。', '下一层可再选第二个 1 或选择 2。', '路径 [1,2] 命中；首层第二个 1 因同层重复被跳过。'], result: '得到 [[1,2]]。' },
    complexity: { time: '最坏 O(2^n·n)，需枚举子集并复制答案。', space: 'O(n)，不计输出时为路径与递归栈。' },
    pitfalls: ['去重条件必须是 i > start，而不是 i > 0。', '递归应传 i+1，否则会重复使用同一下标。'], related: ['39 组合总和', '90 子集 II'],
  },
  77: {
    id: 77, title: '组合', summary: '从 1 到 n 中选择 k 个不同整数，返回全部不计顺序的组合。',
    constraints: ['1 <= k <= n，元素只能来自闭区间 [1,n]。', '组合不区分排列顺序，每个数字最多出现一次。'],
    examples: [{ input: 'n = 4, k = 2', output: '[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]', explanation: '每个二元集合只按递增顺序生成一次。' }],
    intuition: '只允许后续数字大于已选数字，就同时保证不重复选数和不生成排列副本；剩余数量不足时可以提前剪枝。',
    bruteForce: '枚举长度 k 的所有序列后按集合去重，会探索 n^k 个分支并产生大量排列重复。',
    approach: ['维护下一个可选起点 start 与路径 path。', '路径长度达到 k 时复制到答案。', '计算还需要 need=k-len(path) 个数。', '枚举上界设为 n-need+1，确保后面仍有足够数字。', '选入 x 后从 x+1 递归，返回时弹出。'],
    code: `class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        ans = []
        def dfs(start, path):
            if len(path) == k:
                ans.append(path[:]); return
            need = k - len(path)
            for x in range(start, n - need + 2):
                path.append(x); dfs(x + 1, path); path.pop()
        dfs(1, [])
        return ans`,
    walkthrough: { input: 'n=4, k=2', steps: ['从 1 开始，先选 1。', '依次补入 2、3、4，产生三组。', '回退后首位选 2，再补 3、4。', '首位选 3 时只补 4，之后剩余数量不足即结束。'], result: '共生成 6 个组合。' },
    complexity: { time: 'O(C(n,k)·k)，每个答案需要复制 k 个元素。', space: 'O(k)，不计输出。' },
    pitfalls: ['组合递归必须从 x+1 开始。', '剪枝上界若少加 1 会漏掉边界数字。'], related: ['46 全排列', '78 子集'],
  },
  90: {
    id: 90, title: '子集 II', summary: '返回含重复元素数组的所有不同子集，既保留合法的多个相同值，又避免结果重复。',
    constraints: ['输入元素可以重复，空集必须包含在答案中。', '每个下标最多选择一次，结果子集按元素多重集合去重。'],
    examples: [{ input: 'nums = [1,2,2]', output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]', explanation: '两个 2 可同时选择，但相同内容只出现一次。' }],
    intuition: '排序后，同层的相同值代表“作为本层第一个选择”会产生同样后续，因此跳过；递归到下一层后仍可选择第二个副本。',
    bruteForce: '枚举所有下标子集并把规范化结果放入集合，时间仍为 O(2^n·n)，还承担集合转换开销。',
    approach: ['将 nums 排序，使重复值相邻。', '每次进入递归都把当前 path 复制进答案。', '从 start 向后枚举下一个元素。', '若 i>start 且值等于前一项，跳过这个同层分支。', '选入后递归 i+1，返回时撤销选择。'],
    code: `class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort(); ans = []
        def dfs(start, path):
            ans.append(path[:])
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]: continue
                path.append(nums[i]); dfs(i + 1, path); path.pop()
        dfs(0, [])
        return ans`,
    walkthrough: { input: '[1,2,2]', steps: ['根节点记录空集。', '选择 1 后记录 [1]。', '其下依次得到 [1,2] 与 [1,2,2]。', '回到根后只让第一个 2 开枝，第二个同层 2 被跳过。'], result: '得到 6 个不同子集。' },
    complexity: { time: 'O(2^n·n)，输出规模及复制成本决定上界。', space: 'O(n)，不计答案。' },
    pitfalls: ['不能无条件跳过所有相邻重复值，否则会漏掉 [2,2]。', '必须先排序才能用相邻比较去重。'], related: ['78 子集', '40 组合总和 II'],
  },
  47: {
    id: 47, title: '全排列 II', summary: '生成可能含重复数字的数组的所有不同排列。',
    constraints: ['排列必须使用输入中的每个下标恰好一次。', '相同数值可来自不同下标，但相同结果序列只保留一次。'],
    examples: [{ input: 'nums = [1,1,2]', output: '[[1,1,2],[1,2,1],[2,1,1]]', explanation: '共三个不同排列。' }],
    intuition: '排序后，若前一个相同值在当前层还未被使用，就应让它代表这个位置；否则选择后一个副本会生成完全相同的分支。',
    bruteForce: '按下标生成 n! 个排列后用集合去重，重复值多时绝大部分工作都被丢弃。',
    approach: ['排序 nums，并创建 used 布尔数组。', '路径长度等于 n 时复制答案。', '每层枚举所有尚未使用的下标。', '若当前值等于前值且前值尚未使用，跳过当前下标。', '标记、递归、再取消标记并弹出路径。'],
    code: `class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        nums.sort(); ans = []; used = [False] * len(nums)
        def dfs(path):
            if len(path) == len(nums):
                ans.append(path[:]); return
            for i, x in enumerate(nums):
                if used[i]: continue
                if i and x == nums[i - 1] and not used[i - 1]: continue
                used[i] = True; path.append(x); dfs(path); path.pop(); used[i] = False
        dfs([])
        return ans`,
    walkthrough: { input: '[1,1,2]', steps: ['排序后两个 1 相邻。', '首位先用第一个 1，继续排列剩余元素。', '回到首层时第二个 1 因前一个未使用而跳过。', '首位选 2 后，两个 1 仍按固定相对顺序进入。'], result: '输出 3 个唯一排列。' },
    complexity: { time: 'O(U·n)，U 为不同排列数，复制每个排列需 O(n)。', space: 'O(n)，路径、标记和递归栈。' },
    pitfalls: ['去重条件中的 not used[i-1] 不能写反。', '回溯后必须恢复 used 和 path。'], related: ['46 全排列', '90 子集 II'],
  },
  93: {
    id: 93, title: '复原 IP 地址', summary: '在纯数字字符串中插入三个点，枚举所有四段均合法的 IPv4 地址。',
    constraints: ['每段数值在 0 到 255，恰好分成四段。', '多位段不能以 0 开头，单独的 "0" 合法。'],
    examples: [{ input: 's = "25525511135"', output: '["255.255.11.135","255.255.111.35"]', explanation: '两种切分的四段都满足范围与前导零规则。' }],
    intuition: '每段长度只可能是 1 到 3，深度固定为四；结合剩余字符数剪枝，搜索规模很小。',
    bruteForce: '枚举所有三个切点后再统一验证也可行，但若不限制段长与剩余长度，会检查许多显然无效的切分。',
    approach: ['递归记录当前位置 start 与已选 segments。', '若段数为 4，仅在字符恰好用完时收集。', '用剩余段数检查剩余字符是否在可行长度范围。', '尝试截取 1 到 3 位，前导零时只允许一位。', '数值不超过 255 时加入路径并继续，之后回溯。'],
    code: `class Solution:
    def restoreIpAddresses(self, s: str) -> List[str]:
        ans = []
        def dfs(start, parts):
            left = len(s) - start; slots = 4 - len(parts)
            if left < slots or left > 3 * slots: return
            if slots == 0:
                ans.append('.'.join(parts)); return
            for size in range(1, 4):
                if start + size > len(s): break
                part = s[start:start + size]
                if len(part) > 1 and part[0] == '0': break
                if int(part) > 255: break
                parts.append(part); dfs(start + size, parts); parts.pop()
        dfs(0, [])
        return ans`,
    walkthrough: { input: 's="101023"', steps: ['第一段尝试 "1"。', '第二段可尝试 "0"，不能扩为 "01"。', '继续选择 "10" 与 "23"，形成一个答案。', '回溯改变切点，并用剩余字符范围淘汰不可能分支。'], result: '返回所有合法四段地址。' },
    complexity: { time: 'O(1)，IPv4 固定至多 12 个字符；泛化可写为 O(3^4)。', space: 'O(1)，递归深度固定为 4，不计输出。' },
    pitfalls: ['"0" 合法但 "00"、"01" 不合法。', '四段选完后还必须确认字符串也恰好耗尽。'], related: ['回溯切分', '131 分割回文串'],
  },

  301: {
    id: 301, title: '删除无效的括号', summary: '删除最少数量的圆括号，使字符串有效，并返回所有不同结果。',
    constraints: ['非括号字符必须保留且相对顺序不变。', '结果只包含最少删除量的方案，并且不能重复。'],
    examples: [{ input: 's = "()())()"', output: '["(())()","()()()"]', explanation: '删除一个右括号即可得到两种不同有效串。' }],
    intuition: '按层 BFS 时，第 d 层代表删掉 d 个字符；首次发现合法串后，该层所有合法结果就是最少删除答案，无需扩展更深层。',
    bruteForce: '枚举每个字符删或不删的 2^n 种子序列，验证后再筛最短删除量和去重。',
    approach: ['用集合 current 保存当前删除层的不同字符串。', '逐个检查本层字符串是否括号平衡。', '若找到合法串，返回本层全部合法结果。', '否则只删除括号字符，生成下一层集合。', '集合负责去重，逐层推进保证删除数最少。'],
    code: `class Solution:
    def removeInvalidParentheses(self, s: str) -> List[str]:
        def valid(text):
            balance = 0
            for ch in text:
                if ch == '(': balance += 1
                elif ch == ')':
                    balance -= 1
                    if balance < 0: return False
            return balance == 0
        current = {s}
        while True:
            good = [text for text in current if valid(text)]
            if good: return good
            nxt = set()
            for text in current:
                for i, ch in enumerate(text):
                    if ch in '()': nxt.add(text[:i] + text[i + 1:])
            current = nxt`,
    walkthrough: { input: 's="())"', steps: ['第 0 层只有 "())"，扫描时余额变负，非法。', '删除第一个左括号得到 "))"。', '删除两个右括号中的任意一个都得到 "()"，集合自动合并。', '第 1 层检查到 "()" 合法，停止继续删除。'], result: '返回 ["()"]。' },
    complexity: { time: '最坏 O(2^n·n)，候选字符串均需验证。', space: '最坏 O(2^n·n)，保存一层候选。' },
    pitfalls: ['发现合法结果后不能只返回第一个，要收集整层。', '普通字母不能作为删除对象。'], related: ['20 有效的括号', '广度优先搜索'],
  },
  491: {
    id: 491, title: '非递减子序列', summary: '找出长度至少为 2 的所有不同非递减子序列，保持原数组下标顺序。',
    constraints: ['子序列可跳过元素但不能改变相对顺序。', '允许相等相邻值，结果按数值序列去重。'],
    examples: [{ input: 'nums = [4,6,7,7]', output: '包含 [4,6]、[4,7,7]、[6,7] 等', explanation: '每个结果非递减且相同值序列只出现一次。' }],
    intuition: '不能排序，因为下标顺序有意义；在每个递归层用 used 值集合，阻止相同数值作为“下一项”重复开出等价分支。',
    bruteForce: '枚举所有 2^n 个下标子集，检查非递减并用全局元组集合去重。',
    approach: ['递归维护扫描起点和当前 path。', 'path 长度至少 2 时复制进答案。', '本层创建 used 集合，记录已尝试的下一数值。', '只选择不小于 path 末尾且本层未用过的数。', '选择后从 i+1 递归，返回时弹出。'],
    code: `class Solution:
    def findSubsequences(self, nums: List[int]) -> List[List[int]]:
        ans = []
        def dfs(start, path):
            if len(path) >= 2: ans.append(path[:])
            used = set()
            for i in range(start, len(nums)):
                x = nums[i]
                if x in used or (path and x < path[-1]): continue
                used.add(x); path.append(x); dfs(i + 1, path); path.pop()
        dfs(0, [])
        return ans`,
    walkthrough: { input: '[4,7,7]', steps: ['根层选择 4。', '下一层选择第一个 7，记录 [4,7]。', '继续选择第二个 7，记录 [4,7,7]。', '回到 4 的层时，第二个 7 与已尝试值相同而跳过。'], result: '不会重复生成 [4,7]。' },
    complexity: { time: 'O(2^n·n)，不同子序列数量可达指数级。', space: 'O(n²)，递归层的 used 集合与路径；不计输出。' },
    pitfalls: ['不能先排序，否则会改变可选子序列。', 'used 必须每层新建，不能作为全局集合。'], related: ['90 子集 II', '300 最长递增子序列'],
  },
  473: {
    id: 473, title: '火柴拼正方形', summary: '判断所有火柴能否恰好分配到四条等长边，每根必须使用一次且不能折断。',
    constraints: ['每根火柴长度为正，全部都必须使用。', '四边目标长度相同，火柴总和必须能被 4 整除。'],
    examples: [{ input: 'matchsticks = [1,1,2,2,2]', output: 'true', explanation: '可组成四条长度为 2 的边。' }],
    intuition: '把长火柴优先放入当前四个边桶，越早超过目标就越早剪枝；相同桶和空桶具有对称性，只需尝试一次。',
    bruteForce: '为每根火柴任选四条边，共 4^n 种分配，再检查边长。',
    approach: ['检查总和是否能被 4 整除并计算 target。', '按长度降序排序，若最长火柴超过 target 立即失败。', '维护四个边长 sides，逐根尝试放入。', '超过 target 的桶跳过，相同当前边长的桶只试一次。', '所有火柴放完时检查四边均达到 target。'],
    code: `class Solution:
    def makesquare(self, matchsticks: List[int]) -> bool:
        total = sum(matchsticks)
        if total % 4: return False
        target = total // 4
        matchsticks.sort(reverse=True)
        if matchsticks and matchsticks[0] > target: return False
        sides = [0] * 4
        def dfs(i):
            if i == len(matchsticks): return all(x == target for x in sides)
            seen = set(); length = matchsticks[i]
            for j in range(4):
                if sides[j] in seen or sides[j] + length > target: continue
                seen.add(sides[j]); sides[j] += length
                if dfs(i + 1): return True
                sides[j] -= length
            return False
        return dfs(0)`,
    walkthrough: { input: '[1,1,2,2,2]', steps: ['总长 8，目标边长为 2。', '降序后先处理三个 2，分别占满三条边。', '两个 1 依次放入第四条边。', '全部用完后四个桶均为 2。'], result: '返回 true。' },
    complexity: { time: '最坏 O(4^n)，排序与剪枝显著减少实际分支。', space: 'O(n)，递归深度；四个桶为常数空间。' },
    pitfalls: ['必须使用全部火柴，不能只找到四条局部可行边。', '不先降序会让冲突出现得太晚。'], related: ['698 划分为 k 个相等的子集', '回溯装桶'],
  },
  698: {
    id: 698, title: '划分为 k 个相等的子集', summary: '判断数组能否分成 k 个非空子集，使每个子集元素和相等。',
    constraints: ['每个元素必须且只能属于一个子集。', '元素通常为正整数，k 不超过数组长度。'],
    examples: [{ input: 'nums = [4,3,2,3,5,2,1], k = 4', output: 'true', explanation: '可分为 [5]、[1,4]、[2,3]、[2,3]。' }],
    intuition: '问题等价于把数字放进 k 个容量相同的桶；降序放置和跳过等容量桶能优先消除困难情况与对称分支。',
    bruteForce: '每个元素任选 k 个桶，直接搜索有 k^n 种分配。',
    approach: ['验证总和可被 k 整除并得到 target。', '将数字降序，最大值超过 target 时失败。', '维护 k 个桶的当前和。', '对当前数字尝试所有未超容量且状态不同的桶。', '放置后递归，失败则撤销；全部数字放完即成功。'],
    code: `class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total = sum(nums)
        if total % k: return False
        target = total // k
        nums.sort(reverse=True)
        if nums[0] > target: return False
        buckets = [0] * k
        def dfs(i):
            if i == len(nums): return True
            seen = set()
            for b in range(k):
                if buckets[b] in seen or buckets[b] + nums[i] > target: continue
                seen.add(buckets[b]); buckets[b] += nums[i]
                if dfs(i + 1): return True
                buckets[b] -= nums[i]
            return False
        return dfs(0)`,
    walkthrough: { input: 'nums=[2,2,2,2], k=2', steps: ['总和 8，桶容量为 4。', '第一个 2 放入桶 0。', '第二个 2 填满桶 0。', '剩余两个 2 依次填满桶 1。'], result: '返回 true。' },
    complexity: { time: '最坏 O(k^n)，对称剪枝可减少大量状态。', space: 'O(n+k)，递归栈与桶数组。' },
    pitfalls: ['只检查总和整除并不能保证可分。', '同一层对多个空桶重复尝试会造成指数级冗余。'], related: ['473 火柴拼正方形', '416 分割等和子集'],
  },
  980: {
    id: 980, title: '不同路径 III', summary: '从起点走到终点，四向移动且每个可走格恰好访问一次，统计不同路径数。',
    constraints: ['网格含一个起点和一个终点，障碍不可进入。', '所有非障碍格必须恰好访问一次，不能重复走格子。'],
    examples: [{ input: 'grid = [[1,0,0],[0,0,2]]', output: '1', explanation: '只有一条路线能覆盖全部六个可走格后到达终点。' }],
    intuition: '这不是普通计数 DP，因为“已经走过哪些格”会影响下一步；用回溯标记访问，并只在覆盖数正确时接受终点。',
    bruteForce: '枚举四个方向组成的所有移动序列而不标记状态，会包含回环和大量重复无效路线。',
    approach: ['扫描网格定位起点，并统计全部非障碍格数。', '从起点 DFS，参数记录还需访问的格数。', '进入普通格后暂时标为障碍，防止重复访问。', '向四个边界内且非障碍邻格递归。', '到终点时仅当剩余数为 1 才计数，返回前恢复当前格。'],
    code: `class Solution:
    def uniquePathsIII(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0]); remain = 0
        for r in range(m):
            for c in range(n):
                if grid[r][c] != -1: remain += 1
                if grid[r][c] == 1: sr, sc = r, c
        def dfs(r, c, left):
            if grid[r][c] == 2: return int(left == 1)
            old = grid[r][c]; grid[r][c] = -1; total = 0
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] != -1:
                    total += dfs(nr, nc, left - 1)
            grid[r][c] = old
            return total
        return dfs(sr, sc, remain)`,
    walkthrough: { input: '[[1,0],[0,2]]', steps: ['统计 4 个可走格并从左上出发。', '先向右，标记起点已访问。', '右上只能到右下终点，但尚有左下未访问，因此不计。', '另一分支先向下也会过早到终点。'], result: '没有覆盖全部格的路径，返回 0。' },
    complexity: { time: '最坏 O(4^w)，w 为可走格数。', space: 'O(w)，递归路径深度。' },
    pitfalls: ['到达终点不代表合法，还要检查是否覆盖全部空格。', '回溯返回前必须恢复格子值。'], related: ['62 不同路径', '回溯 Hamilton 路径'],
  },
};
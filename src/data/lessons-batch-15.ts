import type { Lesson } from './lessons';

export const lessonsBatch15: Record<number, Lesson> = {
  959: {
    id: 959,
    title: '由斜杠划分区域',
    summary: '把每个字符格放大成细网格并将斜杠涂成墙，统计剩余空白区域的连通块数量。',
    constraints: ['grid 是 n×n 的方阵，每格为 /、\\ 或空格。', '区域只通过上下左右相邻的空白位置连通。'],
    examples: [{ input: 'grid = [" /", "/ "]', output: '2', explanation: '两条斜杠把正方形内部切成两个区域。' }],
    intuition: '将一格扩为 3×3 后，斜线可用三个像素无歧义地表示；原问题随即转为普通连通块计数。',
    bruteForce: '构造真实几何边界并逐面追踪区域，边界相交与角点处理复杂且容易重复计数。',
    approach: ['建立大小为 3n×3n 的空白矩阵。', '按 / 或 \\ 的方向把每格对应的三个位置标为墙。', '遍历所有未访问空白点，以深度优先搜索淹没整个区域。', '每启动一次搜索，就把区域数加一。'],
    code: `class Solution:
    def regionsBySlashes(self, grid: List[str]) -> int:
        n = len(grid)
        board = [[0] * (3 * n) for _ in range(3 * n)]
        for i, row in enumerate(grid):
            for j, ch in enumerate(row):
                if ch == '/':
                    for k in range(3):
                        board[3 * i + k][3 * j + 2 - k] = 1
                elif ch == '\\\\':
                    for k in range(3):
                        board[3 * i + k][3 * j + k] = 1
        ans = 0
        for i in range(3 * n):
            for j in range(3 * n):
                if board[i][j] == 0:
                    ans += 1
                    stack = [(i, j)]
                    board[i][j] = 1
                    while stack:
                        x, y = stack.pop()
                        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < 3 * n and 0 <= ny < 3 * n and board[nx][ny] == 0:
                                board[nx][ny] = 1
                                stack.append((nx, ny))
        return ans`,
    walkthrough: { input: 'grid = [" /", "/ "]', steps: ['把每个原格扩成 3×3，并涂出两条斜线。', '从首个空白像素出发淹没一侧区域。', '剩余空白像素又形成一个独立连通块。'], result: '共启动两次搜索，返回 2。' },
    complexity: { time: 'O(n²)，放大常数为 9。', space: 'O(n²)，保存细网格与搜索栈。' },
    pitfalls: ['反斜杠在 TypeScript 字符串和 Python 代码模板中都需要正确转义。', '放大倍数不能用 2，否则斜线附近的角点可能产生错误连通。'],
    related: ['200 岛屿数量', '并查集与平面区域'],
  },
  965: {
    id: 965,
    title: '单值二叉树',
    summary: '判断二叉树中每个节点是否都与根节点具有相同的值。',
    constraints: ['树至少包含一个节点。', '节点值可以重复，左右子树可能为空。'],
    examples: [{ input: 'root = [1,1,1,1,1,null,1]', output: 'true', explanation: '所有可见节点的值均为 1。' }],
    intuition: '根值是全树唯一允许出现的值，遍历时一旦发现不同值便可立即失败。',
    bruteForce: '先收集全部节点值，再判断集合大小是否为 1；仍为 O(n)，但需要 O(n) 额外空间。',
    approach: ['记录根节点的目标值。', '用栈遍历每个非空节点。', '发现节点值不同则立刻返回 false。', '遍历结束仍未冲突则返回 true。'],
    code: `class Solution:
    def isUnivalTree(self, root: Optional[TreeNode]) -> bool:
        target = root.val
        stack = [root]
        while stack:
            node = stack.pop()
            if node.val != target:
                return False
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        return True`,
    walkthrough: { input: 'root = [1,1,1]', steps: ['以根值 1 作为比较基准。', '左右孩子依次出栈，值都等于 1。', '栈清空且没有发现冲突。'], result: '返回 true。' },
    complexity: { time: 'O(n)，每个节点访问一次。', space: 'O(h) 到 O(n)，取决于树形与栈中节点数。' },
    pitfalls: ['不要只比较父子节点后漏掉某个分支。', '题目保证根非空，若迁移到通用场景需额外处理空树。'],
    related: ['100 相同的树', '二叉树遍历'],
  },
  976: {
    id: 976,
    title: '三角形的最大周长',
    summary: '从数组选三条边组成非退化三角形，返回所有可行组合中的最大周长，无解返回 0。',
    constraints: ['边长均为正整数。', '三边需满足较短两边之和严格大于最长边。'],
    examples: [{ input: 'nums = [2,1,2]', output: '5', explanation: '三条边 1、2、2 可组成三角形，周长为 5。' }],
    intuition: '降序后优先检查最大的连续三元组；若其中较小两边都无法超过最大边，更小的第三边也不可能改善。',
    bruteForce: '枚举所有三元组并验证三角形条件，时间为 O(n³)。',
    approach: ['将边长按降序排列。', '从左到右取连续的三个长度 a≥b≥c。', '若 b+c>a，当前三元组就是最大周长解。', '扫描结束仍未命中则返回 0。'],
    code: `class Solution:
    def largestPerimeter(self, nums: List[int]) -> int:
        nums.sort(reverse=True)
        for i in range(len(nums) - 2):
            if nums[i + 1] + nums[i + 2] > nums[i]:
                return nums[i] + nums[i + 1] + nums[i + 2]
        return 0`,
    walkthrough: { input: 'nums = [3,6,2,3]', steps: ['降序得到 [6,3,3,2]。', '检查 6、3、3，因 3+3 不大于 6 而失败。', '检查 3、3、2，满足条件并计算周长。'], result: '返回 8。' },
    complexity: { time: 'O(n log n)，主要是排序。', space: 'O(1) 或 O(log n)，取决于排序实现。' },
    pitfalls: ['必须使用严格大于，等于时三角形退化。', '只需验证两个较短边之和，不必重复检查另外两组。'],
    related: ['611 有效三角形的个数', '排序贪心'],
  },
  977: {
    id: 977,
    title: '有序数组的平方',
    summary: '将非递减数组的每个元素平方，并在不额外排序的前提下输出非递减结果。',
    constraints: ['输入数组已按非递减顺序排列。', '元素可为负数、零或正数。'],
    examples: [{ input: 'nums = [-4,-1,0,3,10]', output: '[0,1,9,16,100]', explanation: '平方后按大小排列即为该结果。' }],
    intuition: '平方后的最大值必来自当前区间两端绝对值较大的元素，因此可从结果末尾向前填充。',
    bruteForce: '逐个平方后调用排序，时间 O(n log n)。',
    approach: ['令左右指针位于数组两端。', '比较两端平方值，把较大者写入结果末端。', '移动被选中的指针并继续向前填。', '所有位置填满后返回结果。'],
    code: `class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        left, right = 0, len(nums) - 1
        ans = [0] * len(nums)
        for pos in range(len(nums) - 1, -1, -1):
            if abs(nums[left]) > abs(nums[right]):
                ans[pos] = nums[left] * nums[left]
                left += 1
            else:
                ans[pos] = nums[right] * nums[right]
                right -= 1
        return ans`,
    walkthrough: { input: 'nums = [-4,-1,0,3]', steps: ['比较两端绝对值 4 与 3，将 16 放到末尾。', '随后将 9、1 依次放入剩余靠后位置。', '最后填入 0，结果自然有序。'], result: '返回 [0,1,9,16]。' },
    complexity: { time: 'O(n)，双指针各移动一次。', space: 'O(n)，用于返回结果数组。' },
    pitfalls: ['应比较绝对值或平方值，而不是原数大小。', '结果要从后向前填写，否则会破坏顺序。'],
    related: ['88 合并两个有序数组', '双指针'],
  },
  981: {
    id: 981,
    title: '基于时间的键值存储',
    summary: '为同一键保存多个带时间戳的值，并查询不晚于指定时间的最新记录。',
    constraints: ['同一 key 的 set 时间戳严格递增。', 'get 在没有合格时间戳时返回空字符串。'],
    examples: [{ input: 'set("foo","bar",1); get("foo",1); get("foo",3)', output: '"bar"; "bar"', explanation: '两次查询能找到的最新记录都是时间 1 的 bar。' }],
    intuition: '每个键对应一条按时间天然有序的历史列表，查询目标就是找最后一个 timestamp≤给定值的位置。',
    bruteForce: '每次 get 从该键全部历史中线性寻找，单次查询最坏 O(m)。',
    approach: ['哈希表把 key 映射到 (timestamp,value) 列表。', 'set 利用时间戳递增性质直接追加。', 'get 对列表做右边界二分，寻找最后一个不超过目标的记录。', '若边界落在首项之前则返回空字符串。'],
    code: `class TimeMap:
    def __init__(self):
        self.data = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.data.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        records = self.data.get(key, [])
        left, right = 0, len(records)
        while left < right:
            mid = (left + right) // 2
            if records[mid][0] <= timestamp:
                left = mid + 1
            else:
                right = mid
        return records[left - 1][1] if left else ''`,
    walkthrough: { input: 'set("a","x",2), set("a","y",5), get("a",4)', steps: ['键 a 的历史为 [(2,x),(5,y)]。', '二分找到第一个时间戳大于 4 的位置 1。', '取其前一项，即时间 2 的值 x。'], result: '返回 "x"。' },
    complexity: { time: 'set 为 O(1)，get 为 O(log m)。', space: 'O(N)，保存全部 N 次 set 记录。' },
    pitfalls: ['查询需要小于等于 timestamp，而不是只找完全相等。', '不存在 key 或所有记录都太新时必须返回空字符串。'],
    related: ['二分查找右边界', '哈希表设计'],
  },
  983: {
    id: 983,
    title: '最低票价',
    summary: '给定全年出行日期与三种通票价格，计算覆盖所有出行日所需的最低总费用。',
    constraints: ['days 严格递增且日期位于一年内。', '通票有效期为连续 1、7 或 30 天，并覆盖购买当天。'],
    examples: [{ input: 'days = [1,4,6,7,8,20], costs = [2,7,15]', output: '11', explanation: '第 1 天买 1 日票，第 4 天买 7 日票，第 20 天买 1 日票，共 11。' }],
    intuition: '到每个出行日时，最后一张票只有三种选择；向前找到它未覆盖的首个出行日即可复用已算出的最优费用。',
    bruteForce: '递归尝试每个出行日购买三种票而不记忆状态，会产生指数级重复分支。',
    approach: ['令 dp[i] 表示覆盖前 i 个出行日的最低费用。', '对第 i 个出行日分别考虑购买 1、7、30 日票。', '用双指针向前找到每种票覆盖区间之前的出行日数。', '取三种转移费用的最小值写入 dp[i]。'],
    code: `class Solution:
    def mincostTickets(self, days: List[int], costs: List[int]) -> int:
        n = len(days)
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            choices = []
            for duration, cost in zip((1, 7, 30), costs):
                j = i - 1
                start = days[i - 1] - duration + 1
                while j > 0 and days[j - 1] >= start:
                    j -= 1
                choices.append(dp[j] + cost)
            dp[i] = min(choices)
        return dp[n]`,
    walkthrough: { input: 'days = [1,4,6], costs = [2,7,15]', steps: ['覆盖第 1 天的最低费用为 2。', '到第 4 天，两个 1 日票累计为 4，比 7 日票便宜。', '到第 6 天，继续买 1 日票累计为 6。'], result: '返回 6。' },
    complexity: { time: 'O(n²)，每次转移最多向前扫描 n 项。', space: 'O(n)，保存动态规划数组。' },
    pitfalls: ['票的覆盖区间包含购买当天，起点计算需加 1。', 'dp 下标表示出行日数量，不是自然日日期。'],
    related: ['322 零钱兑换', '动态规划'],
  },
  986: {
    id: 986,
    title: '区间列表的交集',
    summary: '求两个各自有序且内部互不相交的闭区间列表之间的全部交集。',
    constraints: ['每个列表内的区间按起点递增且互不重叠。', '区间端点包含在区间内，单点也可构成交集。'],
    examples: [{ input: 'firstList = [[0,2],[5,10]], secondList = [[1,5],[8,12]]', output: '[[1,2],[5,5],[8,10]]', explanation: '依次取两边当前区间的重叠部分。' }],
    intuition: '两当前区间若相交，交集端点由较晚起点和较早终点决定；结束更早的区间此后不可能再有贡献。',
    bruteForce: '枚举两个列表的所有区间对并检查交集，时间 O(mn)。',
    approach: ['用两个指针分别指向两列表当前区间。', '计算 lo=max(起点)、hi=min(终点)，若 lo≤hi 就记录交集。', '移动终点较小的区间指针。', '任一列表扫描结束时返回答案。'],
    code: `class Solution:
    def intervalIntersection(self, firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
        i = j = 0
        ans = []
        while i < len(firstList) and j < len(secondList):
            lo = max(firstList[i][0], secondList[j][0])
            hi = min(firstList[i][1], secondList[j][1])
            if lo <= hi:
                ans.append([lo, hi])
            if firstList[i][1] < secondList[j][1]:
                i += 1
            else:
                j += 1
        return ans`,
    walkthrough: { input: 'firstList = [[0,2],[5,10]], secondList = [[1,5]]', steps: ['[0,2] 与 [1,5] 产生交集 [1,2]，移动第一指针。', '[5,10] 与 [1,5] 产生单点交集 [5,5]。', '第二列表耗尽，停止扫描。'], result: '返回 [[1,2],[5,5]]。' },
    complexity: { time: 'O(m+n)，每次至少移动一个指针。', space: 'O(1) 额外空间，不计输出。' },
    pitfalls: ['闭区间在 lo==hi 时仍有一个合法交点。', '应移动结束更早的一方，而不是起点更早的一方。'],
    related: ['56 合并区间', '双指针'],
  },
  1004: {
    id: 1004,
    title: '最大连续 1 的个数 III',
    summary: '最多把 k 个 0 翻转为 1，求可得到的最长连续 1 区间长度。',
    constraints: ['数组元素仅为 0 或 1。', 'k 为非负整数，允许一个 0 都不翻转。'],
    examples: [{ input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', output: '6', explanation: '选择一个含两个 0 的长度 6 窗口并翻转即可。' }],
    intuition: '合法区间等价于“内部 0 的数量不超过 k”，该条件随右端扩张单调变化，适合滑动窗口。',
    bruteForce: '枚举所有子数组并统计其中 0 的数量，时间 O(n²)。',
    approach: ['右指针逐个纳入元素，并累计窗口中的 0。', '当 0 的数量超过 k 时移动左指针缩窗。', '左移时若移出 0，则同步减少计数。', '每轮用当前合法窗口长度更新最大值。'],
    code: `class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        left = zeros = ans = 0
        for right, value in enumerate(nums):
            if value == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            ans = max(ans, right - left + 1)
        return ans`,
    walkthrough: { input: 'nums = [1,0,0,1,1], k = 1', steps: ['窗口扩到第二个 0 时计数超限。', '左端右移越过第一个 0，窗口重新合法。', '继续纳入两个 1，最大合法长度达到 3。'], result: '返回 3。' },
    complexity: { time: 'O(n)，每个指针最多走完整个数组。', space: 'O(1)。' },
    pitfalls: ['窗口内 0 的数量超过 k 时要持续收缩，而非只移动一次。', 'k=0 时算法仍应正确处理纯 1 区间。'],
    related: ['424 替换后的最长重复字符', '滑动窗口'],
  },
  1008: {
    id: 1008,
    title: '前序遍历构造二叉搜索树',
    summary: '根据一组互异值的前序遍历，恢复对应的二叉搜索树并返回根节点。',
    constraints: ['preorder 中所有值互不相同。', '给定序列保证是某棵二叉搜索树的前序遍历。'],
    examples: [{ input: 'preorder = [8,5,1,7,10,12]', output: '[8,5,10,1,7,null,12]', explanation: '8 为根，小于 8 的连续段构成左子树，其余构成右子树。' }],
    intuition: '前序序列按根、左、右出现；递归携带当前子树允许的上界，遇到越界值时就把它留给祖先的右子树。',
    bruteForce: '依次把每个值按普通 BST 插入，树退化时需要 O(n²) 时间。',
    approach: ['维护共享下标 i，表示下一个尚未使用的前序值。', '若当前值超过子树上界，则该子树为空。', '消费当前值创建根，并以根值为上界构造左子树。', '再沿用父上界构造右子树。'],
    code: `class Solution:
    def bstFromPreorder(self, preorder: List[int]) -> Optional[TreeNode]:
        i = 0
        def build(bound):
            nonlocal i
            if i == len(preorder) or preorder[i] > bound:
                return None
            root = TreeNode(preorder[i])
            i += 1
            root.left = build(root.val)
            root.right = build(bound)
            return root
        return build(float('inf'))`,
    walkthrough: { input: 'preorder = [8,5,1,7,10]', steps: ['先消费 8 作为根，在上界 8 内构造左侧。', '依次构造 5、1，值 7 越过节点 1 的边界后成为 5 的右孩子。', '值 10 越过根的左侧边界，最终成为 8 的右孩子。'], result: '得到前序与输入一致的搜索树。' },
    complexity: { time: 'O(n)，每个值只消费一次。', space: 'O(h)，递归栈深度等于树高。' },
    pitfalls: ['共享下标在值越界时不能前移。', '右子树仍受祖先上界约束，不能一律使用正无穷。'],
    related: ['105 从前序与中序遍历序列构造二叉树', '701 二叉搜索树中的插入操作'],
  },
  1020: {
    id: 1020,
    title: '飞地的数量',
    summary: '统计无法通过上下左右移动抵达网格边界的陆地单元格数量。',
    constraints: ['网格仅含 0 表示海洋、1 表示陆地。', '移动只允许在相邻陆地间沿四个方向进行。'],
    examples: [{ input: 'grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]', output: '3', explanation: '左边界陆地可离开，其余三个相连陆地属于飞地。' }],
    intuition: '问题的反面更容易：所有与边界陆地连通的格子都不是飞地，先从边界淹没它们即可。',
    bruteForce: '从每个陆地分别搜索能否到边界，会反复遍历相同连通块，最坏 O((mn)²)。',
    approach: ['收集并访问四条边上的全部陆地。', '从这些位置进行深度优先搜索，把可达陆地改为海洋。', '搜索结束后，剩余的 1 都无法到达边界。', '累加剩余陆地数量并返回。'],
    code: `class Solution:
    def numEnclaves(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        stack = []
        for i in range(m):
            stack.extend([(i, 0), (i, n - 1)])
        for j in range(n):
            stack.extend([(0, j), (m - 1, j)])
        while stack:
            x, y = stack.pop()
            if not (0 <= x < m and 0 <= y < n) or grid[x][y] == 0:
                continue
            grid[x][y] = 0
            stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
        return sum(map(sum, grid))`,
    walkthrough: { input: 'grid = [[1,0,0],[0,1,1],[0,0,0]]', steps: ['从边界左上角陆地开始淹没。', '中部两个相连陆地无法被边界搜索触及。', '求剩余网格元素之和。'], result: '返回 2。' },
    complexity: { time: 'O(mn)，每个陆地至多处理一次。', space: 'O(mn)，最坏情况下搜索栈容纳整片陆地。' },
    pitfalls: ['四条边都要作为起点，角点重复入栈不影响正确性。', '原地改写网格会改变输入；若需保留输入应另建 visited。'],
    related: ['130 被围绕的区域', '200 岛屿数量'],
  },
  1026: {
    id: 1026,
    title: '节点与其祖先之间的最大差值',
    summary: '在二叉树所有祖先—后代节点对中，求节点值绝对差的最大值。',
    constraints: ['树非空，节点值为整数。', '祖先可以是父节点或更高层节点，但不能是节点自身。'],
    examples: [{ input: 'root = [8,3,10,1,6,null,14,null,null,4,7,13]', output: '7', explanation: '祖先 8 与后代 1 的绝对差为 7，且没有更大值。' }],
    intuition: '对当前节点而言，只需知道根到它路径上的最小值与最大值；任意祖先差值都不会超过这两个极值形成的范围。',
    bruteForce: '对每个节点再次遍历其全部后代并计算差值，最坏 O(n²)。',
    approach: ['从根出发，携带路径最小值 lo 与最大值 hi。', '到达节点后用其值更新两个极值。', '在叶后空节点处返回 hi-lo。', '左右子树结果取最大值。'],
    code: `class Solution:
    def maxAncestorDiff(self, root: Optional[TreeNode]) -> int:
        def dfs(node, lo, hi):
            if not node:
                return hi - lo
            lo = min(lo, node.val)
            hi = max(hi, node.val)
            return max(dfs(node.left, lo, hi), dfs(node.right, lo, hi))
        return dfs(root, root.val, root.val)`,
    walkthrough: { input: 'root = [8,3,10,1]', steps: ['根路径极值初始化为 8 与 8。', '沿左侧经过 3 到达 1，路径极值更新为 1 与 8。', '空孩子处计算路径范围 8-1。'], result: '最大差值为 7。' },
    complexity: { time: 'O(n)，每个节点访问一次。', space: 'O(h)，递归栈取决于树高。' },
    pitfalls: ['极值必须按当前根到节点的路径分别维护，不能跨兄弟分支共享。', '比较的是任意祖先而非仅父节点。'],
    related: ['543 二叉树的直径', '1448 统计二叉树中好节点的数目'],
  },
  1035: {
    id: 1035,
    title: '不相交的线',
    summary: '连接两个数组中值相等的元素，要求连线互不相交，求最多可画的连线数。',
    constraints: ['每个位置最多属于一条连线。', '连线不相交等价于两端所选下标顺序一致。'],
    examples: [{ input: 'nums1 = [1,4,2], nums2 = [1,2,4]', output: '2', explanation: '可连接两个 1，并再连接 2 或 4，最多两条。' }],
    intuition: '不相交强制匹配保持相对顺序，因此问题正是求两个数组的最长公共子序列长度。',
    bruteForce: '枚举两数组的匹配子序列组合，数量呈指数增长。',
    approach: ['令 dp[j] 表示处理当前 nums1 前缀后与 nums2 前 j 项的最大匹配数。', '逐行扫描 nums1，并保存更新前左上角状态 prev。', '元素相等时取 prev+1，否则取上方与左方状态较大值。', '完成全部行后返回 dp[n]。'],
    code: `class Solution:
    def maxUncrossedLines(self, nums1: List[int], nums2: List[int]) -> int:
        dp = [0] * (len(nums2) + 1)
        for a in nums1:
            prev = 0
            for j, b in enumerate(nums2, 1):
                old = dp[j]
                if a == b:
                    dp[j] = prev + 1
                else:
                    dp[j] = max(dp[j], dp[j - 1])
                prev = old
        return dp[-1]`,
    walkthrough: { input: 'nums1 = [1,4,2], nums2 = [1,2,4]', steps: ['处理 1 后，公共子序列最大长度为 1。', '处理 4 后，可保持 1 或匹配末尾 4，长度仍为 2 的潜力状态。', '处理 2 后最优顺序选出 [1,2]。'], result: '返回 2。' },
    complexity: { time: 'O(mn)，比较所有前缀状态。', space: 'O(n)，使用一维滚动数组。' },
    pitfalls: ['一维更新时必须保存旧的左上角值。', '相等时只能由左上角加一，不能直接用已更新的 dp[j-1]。'],
    related: ['1143 最长公共子序列', '动态规划'],
  },
  1051: {
    id: 1051,
    title: '高度检查器',
    summary: '比较学生当前身高顺序与非递减目标顺序，统计值不同的位置数量。',
    constraints: ['heights 中每项为正整数身高。', '目标顺序是原数组元素排序后的非递减序列。'],
    examples: [{ input: 'heights = [1,1,4,2,1,3]', output: '3', explanation: '目标为 [1,1,1,2,3,4]，下标 2、4、5 不同。' }],
    intuition: '学生集合不变，唯一目标排列就是排序结果；逐位置比较即可确定需要调整的站位数。',
    bruteForce: '对每个位置重新寻找剩余最小身高来模拟选择排序，时间 O(n²)。',
    approach: ['复制并排序 heights 得到 expected。', '同步遍历原数组与目标数组。', '每遇到一对不同值就增加计数。', '返回最终计数。'],
    code: `class Solution:
    def heightChecker(self, heights: List[int]) -> int:
        expected = sorted(heights)
        return sum(a != b for a, b in zip(heights, expected))`,
    walkthrough: { input: 'heights = [1,2,1]', steps: ['排序副本得到 [1,1,2]。', '下标 0 相同，下标 1 与 2 均不同。', '累计两个不匹配位置。'], result: '返回 2。' },
    complexity: { time: 'O(n log n)，由排序主导。', space: 'O(n)，保存排序副本。' },
    pitfalls: ['统计的是位置不匹配数，不是需要交换的最少次数。', '不要原地排序后再与自身比较，否则答案恒为 0。'],
    related: ['75 颜色分类', '排序'],
  },
  1071: {
    id: 1071,
    title: '字符串的最大公因子',
    summary: '寻找能重复若干次分别构成两个字符串的最长基础字符串，不存在则返回空串。',
    constraints: ['两个输入均为非空字符串。', '基础字符串必须完整重复整数次得到两个输入。'],
    examples: [{ input: 'str1 = "ABCABC", str2 = "ABC"', output: '"ABC"', explanation: 'ABC 重复两次得到前者，重复一次得到后者。' }],
    intuition: '若两串源自同一重复单元，交换拼接顺序后必相等；此时最长单元长度就是两串长度的最大公约数。',
    bruteForce: '从较短字符串开始枚举所有前缀，并逐个验证能否整除两串，最坏需 O(n²)。',
    approach: ['检查 str1+str2 是否等于 str2+str1。', '若不等，说明字符周期不兼容，返回空串。', '计算两字符串长度的最大公约数 g。', '返回任一字符串长度为 g 的前缀。'],
    code: `class Solution:
    def gcdOfStrings(self, str1: str, str2: str) -> str:
        if str1 + str2 != str2 + str1:
            return ''
        a, b = len(str1), len(str2)
        while b:
            a, b = b, a % b
        return str1[:a]`,
    walkthrough: { input: 'str1 = "ABABAB", str2 = "ABAB"', steps: ['两种拼接顺序都得到 ABABABABAB。', '长度 6 与 4 的最大公约数为 2。', '截取长度 2 的公共周期前缀 AB。'], result: '返回 "AB"。' },
    complexity: { time: 'O(n+m)，包括拼接比较与最大公约数计算。', space: 'O(n+m)，拼接字符串占用额外空间。' },
    pitfalls: ['仅计算长度最大公约数而不验证字符周期会误判。', '候选必须能重复构成整串，不能只要求是公共前缀。'],
    related: ['28 找出字符串中第一个匹配项的下标', '欧几里得算法'],
  },
  1079: {
    id: 1079,
    title: '活字印刷',
    summary: '用给定字母牌组成非空序列，每张牌最多使用一次，统计不同序列总数。',
    constraints: ['tiles 只包含大写英文字母。', '相同字母牌不可区分，重复排列只计一次。'],
    examples: [{ input: 'tiles = "AAB"', output: '8', explanation: '可组成 A、B、AA、AB、BA、AAB、ABA、BAA。' }],
    intuition: '每次从仍有库存的某种字母中选一个追加，当前选择本身形成一个新序列，再递归扩展后缀。',
    bruteForce: '排列所有牌的所有子集后用集合去重，会生成大量由相同字母造成的重复分支。',
    approach: ['统计每个字母剩余数量。', '遍历仍有库存的字母，把选择它计为一个新序列。', '暂时减少该字母库存并递归统计所有后续扩展。', '回溯恢复库存后尝试下一种字母。'],
    code: `class Solution:
    def numTilePossibilities(self, tiles: str) -> int:
        counts = [0] * 26
        for ch in tiles:
            counts[ord(ch) - 65] += 1
        def dfs():
            total = 0
            for i in range(26):
                if counts[i]:
                    total += 1
                    counts[i] -= 1
                    total += dfs()
                    counts[i] += 1
            return total
        return dfs()`,
    walkthrough: { input: 'tiles = "AB"', steps: ['首位选 A，计入 A，并递归得到 AB。', '恢复库存后首位选 B，计入 B，并递归得到 BA。', '四个非空序列均由唯一选择路径产生。'], result: '返回 4。' },
    complexity: { time: 'O(Σ P(n,k))，最坏枚举所有长度的排列。', space: 'O(n+字符集大小)，递归深度最多 n。' },
    pitfalls: ['按具体牌下标选择会重复计算相同字母。', '空序列不计入答案，因此只在实际选择字母时加一。'],
    related: ['47 全排列 II', '回溯计数'],
  },
  1105: {
    id: 1105,
    title: '填充书架',
    summary: '保持书籍给定顺序分层摆放，在每层总宽不超过限制时最小化书架总高度。',
    constraints: ['每本书给出正的厚度与高度。', '书籍相对顺序不可改变，每层厚度和不得超过 shelfWidth。'],
    examples: [{ input: 'books = [[1,1],[2,3],[2,3]], shelfWidth = 4', output: '4', explanation: '第一本单独一层高 1，后两本同层总宽 4、层高 3。' }],
    intuition: '确定前 i 本的最后一层起点后，该层高度由其中最高书决定，之前书籍的最优高度可直接复用。',
    bruteForce: '在每两本书之间枚举换层或不换层，组合数为指数级。',
    approach: ['令 dp[i] 表示摆放前 i 本书的最小总高度。', '固定第 i 本在最后一层，向前逐本扩展该层。', '累计厚度并维护层内最大高度，超过宽度即停止。', '用 dp[j-1]+层高更新 dp[i]。'],
    code: `class Solution:
    def minHeightShelves(self, books: List[List[int]], shelfWidth: int) -> int:
        n = len(books)
        dp = [0] + [float('inf')] * n
        for i in range(1, n + 1):
            width = height = 0
            for j in range(i, 0, -1):
                width += books[j - 1][0]
                if width > shelfWidth:
                    break
                height = max(height, books[j - 1][1])
                dp[i] = min(dp[i], dp[j - 1] + height)
        return dp[n]`,
    walkthrough: { input: 'books = [[1,1],[2,3],[2,3]], shelfWidth = 4', steps: ['只摆第一本时最小总高为 1。', '前两本同层总宽 3、层高 3；也可分两层得到 1+3，两者都是 4。', '第三本与第二本同层总宽 4、层高 3，接在只放第一本的前缀之后总高 4。'], result: '返回 4。' },
    complexity: { time: 'O(n²)，每个结尾向前尝试最后一层。', space: 'O(n)，保存前缀最优值。' },
    pitfalls: ['层高取该层最大书高，不是高度之和。', '不能重排书籍来填补层内剩余宽度。'],
    related: ['139 单词拆分', '分段动态规划'],
  },
  1110: {
    id: 1110,
    title: '删点成林',
    summary: '从二叉树删除指定值的节点及其连接边，返回删除后所有剩余树的根节点。',
    constraints: ['树中节点值互不相同。', 'to_delete 中值互不相同，删除根节点也被允许。'],
    examples: [{ input: 'root = [1,2,3,4,5,6,7], to_delete = [3,5]', output: '[[1,2,null,4],[6],[7]]', explanation: '删除 3 后其孩子 6、7 成为新根，删除 5 后不留下子树。' }],
    intuition: '节点是否成为森林根只取决于它的父节点是否被删除；后序处理还能把已删除孩子从父节点断开。',
    bruteForce: '对每个待删值反复搜索节点及父节点并重连，最坏 O(n·d)。',
    approach: ['把待删除值放入集合。', '深度优先遍历并传入当前节点是否处于根位置。', '若节点处于根位置且不删除，就加入结果。', '递归处理孩子；当前节点删除时返回空，否则返回更新后的节点。'],
    code: `class Solution:
    def delNodes(self, root: Optional[TreeNode], to_delete: List[int]) -> List[TreeNode]:
        removed = set(to_delete)
        forest = []
        def dfs(node, is_root):
            if not node:
                return None
            deleted = node.val in removed
            if is_root and not deleted:
                forest.append(node)
            node.left = dfs(node.left, deleted)
            node.right = dfs(node.right, deleted)
            return None if deleted else node
        dfs(root, True)
        return forest`,
    walkthrough: { input: 'root = [1,2,3], to_delete = [1]', steps: ['根 1 被标记删除，因此不加入结果。', '它的孩子 2、3 都以根位置递归，且自身保留。', '两个孩子分别加入森林，原根返回空。'], result: '返回以 2 和 3 为根的两棵树。' },
    complexity: { time: 'O(n+d)，建集合并遍历整棵树。', space: 'O(h+d)，递归栈与删除集合。' },
    pitfalls: ['删除节点后，它的每个非空孩子都可能成为新根。', '必须把递归返回值重新赋给左右孩子以断开删除节点。'],
    related: ['450 删除二叉搜索树中的节点', '后序遍历'],
  },
  1122: {
    id: 1122,
    title: '数组的相对排序',
    summary: '按 arr2 给定的值顺序排列 arr1 中对应元素，其余元素放在末尾并升序排列。',
    constraints: ['arr2 中元素互不相同且都出现在 arr1。', 'arr1 可包含重复元素。'],
    examples: [{ input: 'arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]', output: '[2,2,2,1,4,3,3,9,6,7,19]', explanation: '先按 arr2 顺序放置指定值，再升序放置 7、19。' }],
    intuition: 'arr2 为部分值定义了优先级；先按频次展开这些值，再对没有优先级的剩余值排序即可。',
    bruteForce: '为 arr1 每个元素在线性扫描 arr2 中寻找排名后排序，比较成本较高。',
    approach: ['统计 arr1 中每个值的出现次数。', '按 arr2 顺序把对应值重复写入答案，并从计数中移除。', '将剩余键按数值升序排列。', '按剩余频次展开并追加到答案。'],
    code: `from collections import Counter

class Solution:
    def relativeSortArray(self, arr1: List[int], arr2: List[int]) -> List[int]:
        counts = Counter(arr1)
        ans = []
        for value in arr2:
            ans.extend([value] * counts.pop(value))
        for value in sorted(counts):
            ans.extend([value] * counts[value])
        return ans`,
    walkthrough: { input: 'arr1 = [2,3,1,3,2], arr2 = [3,2]', steps: ['计数得到 2 与 3 各两次、1 一次。', '按 arr2 先写两个 3，再写两个 2。', '剩余键只有 1，升序追加。'], result: '返回 [3,3,2,2,1]。' },
    complexity: { time: 'O(n+r log r)，r 为不在 arr2 中的不同值数。', space: 'O(u)，u 为 arr1 的不同值数，不计输出。' },
    pitfalls: ['arr2 规定的是值的整体顺序，同值必须连续放置。', '未出现在 arr2 的元素需要按数值升序，而非保持原相对位置。'],
    related: ['75 颜色分类', '计数排序'],
  },
  1123: {
    id: 1123,
    title: '最深叶节点的最近公共祖先',
    summary: '找出二叉树所有最深叶节点共同的最近祖先，并返回该节点。',
    constraints: ['树非空，节点值可按题目范围出现。', '最深叶节点指深度达到整棵树最大值的叶节点。'],
    examples: [{ input: 'root = [3,5,1,6,2,0,8,null,null,7,4]', output: '[2,7,4]', explanation: '最深叶节点为 7 和 4，它们最近的公共祖先是 2。' }],
    intuition: '后序遍历可同时得到子树最深深度与其最深叶公共祖先；两侧同深时当前节点正好汇合两边答案。',
    bruteForce: '先找所有最深叶，再对它们反复执行普通最近公共祖先查询，可能达到 O(n²)。',
    approach: ['递归返回 (子树最深高度, 对应公共祖先)。', '空节点返回高度 0 与空答案。', '左右高度相等时，当前节点是两侧最深叶的公共祖先。', '高度不等时继承更深一侧的答案，并把高度加一。'],
    code: `class Solution:
    def lcaDeepestLeaves(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        def dfs(node):
            if not node:
                return 0, None
            ld, left = dfs(node.left)
            rd, right = dfs(node.right)
            if ld == rd:
                return ld + 1, node
            if ld > rd:
                return ld + 1, left
            return rd + 1, right
        return dfs(root)[1]`,
    walkthrough: { input: 'root = [1,2,3,4]', steps: ['节点 4 返回高度 1 且答案为自身。', '节点 2 的左侧更深，因此继承答案 4。', '根 1 的左侧仍比右侧深，继续继承 4。'], result: '唯一最深叶为 4，返回节点 4。' },
    complexity: { time: 'O(n)，每个节点只做常数工作。', space: 'O(h)，递归栈深度为树高。' },
    pitfalls: ['唯一最深叶存在时，它自身就是答案。', '比较的是子树高度；左右相等时必须返回当前节点。'],
    related: ['236 二叉树的最近公共祖先', '865 具有所有最深节点的最小子树'],
  },
  1137: {
    id: 1137,
    title: '第 N 个泰波那契数',
    summary: '按前三项之和生成泰波那契序列，计算下标 n 对应的数值。',
    constraints: ['初值为 T0=0、T1=1、T2=1。', '当 n≥3 时，Tn=Tn-1+Tn-2+Tn-3。'],
    examples: [{ input: 'n = 4', output: '4', explanation: 'T3=2，T4=1+1+2=4。' }],
    intuition: '每个新值只依赖最近三个状态，无需保留完整序列，可滚动更新三个变量。',
    bruteForce: '直接按递推式递归会重复计算相同下标，时间呈指数增长。',
    approach: ['单独处理 n=0，返回 0。', '以 a,b,c 初始化 T0、T1、T2。', '从下标 3 到 n，将三个状态滚动为 b,c,a+b+c。', '返回代表当前下标的 c。'],
    code: `class Solution:
    def tribonacci(self, n: int) -> int:
        if n == 0:
            return 0
        a, b, c = 0, 1, 1
        for _ in range(3, n + 1):
            a, b, c = b, c, a + b + c
        return c`,
    walkthrough: { input: 'n = 4', steps: ['初始化最近三项为 0、1、1。', '计算 T3=0+1+1=2，状态变为 1、1、2。', '计算 T4=1+1+2=4。'], result: '返回 4。' },
    complexity: { time: 'O(n)，顺序计算到目标项。', space: 'O(1)，仅保存三个状态。' },
    pitfalls: ['n=0 必须单独处理，否则会错误返回初始 c。', '滚动赋值要同时更新，避免覆盖仍需参与求和的旧值。'],
    related: ['70 爬楼梯', '509 斐波那契数'],
  },
  1161: {
    id: 1161,
    title: '最大层内元素和',
    summary: '计算二叉树每一层的节点值总和，返回总和最大且层号最小的那一层。',
    constraints: ['根节点位于第 1 层，树至少有一个节点。', '节点值可能为负数，因此最大层和也可能为负。'],
    examples: [{ input: 'root = [1,7,0,7,-8,null,null]', output: '2', explanation: '各层和为 1、7、-1，最大值 7 出现在第 2 层。' }],
    intuition: '层序遍历天然把同层节点成批取出；只在层和严格增大时更新，就能保留最小层号。',
    bruteForce: '先求树高，再对每个深度从根重新遍历收集节点，退化树最坏 O(n²)。',
    approach: ['用队列初始化根节点，并从层号 1 开始。', '每轮取出当前队列长度个节点并累加其值。', '将这些节点的非空孩子加入下一层队列。', '若当前层和严格大于历史最大值，记录当前层号。'],
    code: `from collections import deque

class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        queue = deque([root])
        level = best_level = 1
        best_sum = float('-inf')
        while queue:
            total = 0
            for _ in range(len(queue)):
                node = queue.popleft()
                total += node.val
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            if total > best_sum:
                best_sum, best_level = total, level
            level += 1
        return best_level`,
    walkthrough: { input: 'root = [1,2,3]', steps: ['第 1 层和为 1，暂记层号 1。', '第 2 层和为 5，严格超过历史最大值。', '队列清空，保留第 2 层。'], result: '返回 2。' },
    complexity: { time: 'O(n)，每个节点入队出队一次。', space: 'O(w)，w 为树的最大层宽。' },
    pitfalls: ['历史最大和应初始化为负无穷，不能用 0。', '层和相等时不要更新，题目要求返回较小层号。'],
    related: ['102 二叉树的层序遍历', '515 在每个树行中找最大值'],
  },
  1207: {
    id: 1207,
    title: '独一无二的出现次数',
    summary: '判断数组中每个不同数值的出现次数是否两两不同。',
    constraints: ['数组包含整数，数值可为负。', '只比较不同数值的频次，元素本身无需互异。'],
    examples: [{ input: 'arr = [1,2,2,1,1,3]', output: 'true', explanation: '1、2、3 的频次分别为 3、2、1，互不相同。' }],
    intuition: '先把数值映射到频次，再判断频次列表放入集合后是否发生数量缩减。',
    bruteForce: '对每个不同值重新扫描整个数组统计频次，最坏 O(n²)。',
    approach: ['用哈希计数器统计每个值出现次数。', '取出所有计数值。', '将计数放入集合以消除重复。', '比较集合大小与不同数值数量是否相等。'],
    code: `from collections import Counter

class Solution:
    def uniqueOccurrences(self, arr: List[int]) -> bool:
        counts = Counter(arr)
        return len(set(counts.values())) == len(counts)`,
    walkthrough: { input: 'arr = [1,1,2,2]', steps: ['统计得到 1→2、2→2。', '两个频次放入集合后只剩一个 2。', '集合大小小于不同元素数量。'], result: '返回 false。' },
    complexity: { time: 'O(n)，计数和集合检查均为线性期望时间。', space: 'O(u)，u 为不同数值个数。' },
    pitfalls: ['应检查频次是否唯一，而不是数组元素是否唯一。', '负数可直接作为哈希键，无需偏移处理。'],
    related: ['217 存在重复元素', '哈希计数'],
  },
  1209: {
    id: 1209,
    title: '删除字符串中的所有相邻重复项 II',
    summary: '反复删除字符串中连续 k 个相同字符，返回所有连锁删除结束后的字符串。',
    constraints: ['字符串由小写英文字母组成。', 'k≥2，一次删除恰好消去一组连续 k 个相同字符。'],
    examples: [{ input: 's = "deeedbbcccbdaa", k = 3', output: '"aa"', explanation: '删除 eee 与 ccc 后形成 bbb，再删除 bbb，最后剩 aa。' }],
    intuition: '栈保存压缩后的字符段及其计数；新字符只会影响栈顶段，计数达到 k 时立即弹出即可自然处理连锁反应。',
    bruteForce: '反复扫描字符串寻找可删段并创建新字符串，最坏会产生 O(n²) 时间和大量拷贝。',
    approach: ['维护元素为 [字符,连续次数] 的栈。', '新字符等于栈顶字符时增加栈顶计数，否则压入新段。', '某段计数达到 k 时立即弹栈删除。', '扫描后按剩余计数展开各段并拼接。'],
    code: `class Solution:
    def removeDuplicates(self, s: str, k: int) -> str:
        stack = []
        for ch in s:
            if stack and stack[-1][0] == ch:
                stack[-1][1] += 1
            else:
                stack.append([ch, 1])
            if stack[-1][1] == k:
                stack.pop()
        return ''.join(ch * count for ch, count in stack)`,
    walkthrough: { input: 's = "abbba", k = 3', steps: ['读入 a 后建立计数 1 的字符段。', '三个 b 使栈顶计数达到 3，该段被弹出。', '末尾 a 与原有 a 合并为计数 2。'], result: '返回 "aa"。' },
    complexity: { time: 'O(n)，每个字符至多入栈并参与一次弹出。', space: 'O(n)，最坏每个字符形成独立段。' },
    pitfalls: ['不能先固定所有删除位置，因为一次删除可能让两侧字符相邻。', '计数到 k 时要删除整段，不能保留 count mod k 之外的错误状态。'],
    related: ['1047 删除字符串中的所有相邻重复项', '栈'],
  },
  1235: {
    id: 1235,
    title: '规划兼职工作',
    summary: '从带开始时间、结束时间和收益的工作中选择互不重叠的一组，使总收益最大。',
    constraints: ['结束时间等于下一工作开始时间时，两项工作可以连续选择。', '每项工作有正收益，输入三数组按同一下标对应。'],
    examples: [{ input: 'startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]', output: '120', explanation: '选择时间 [1,3] 收益 50 和 [3,6] 收益 70。' }],
    intuition: '按结束时间排序后，选当前工作时只需接到最后一个结束时间不晚于其开始时间的最优前缀。',
    bruteForce: '对每项工作枚举选择或跳过，并检查重叠，最坏需要 O(2ⁿ)。',
    approach: ['将工作按结束时间升序排列。', '维护 ends 与 dp，其中 dp[i] 是前 i 项工作的最大收益。', '对当前工作二分找到结束时间≤其开始时间的工作数量 j。', '比较跳过当前工作的 dp[i-1] 与选择它的 dp[j]+profit。'],
    code: `class Solution:
    def jobScheduling(self, startTime: List[int], endTime: List[int], profit: List[int]) -> int:
        jobs = sorted(zip(endTime, startTime, profit))
        ends = [job[0] for job in jobs]
        dp = [0] * (len(jobs) + 1)
        for i, (end, start, gain) in enumerate(jobs, 1):
            left, right = 0, i - 1
            while left < right:
                mid = (left + right) // 2
                if ends[mid] <= start:
                    left = mid + 1
                else:
                    right = mid
            j = left if left == 0 or ends[left - 1] <= start else 0
            dp[i] = max(dp[i - 1], dp[j] + gain)
        return dp[-1]`,
    walkthrough: { input: 'startTime = [1,3], endTime = [3,5], profit = [50,40]', steps: ['按结束时间排序后先处理 [1,3]，最优收益为 50。', '第二项开始于 3，二分找到第一项可作为兼容前缀。', '选择两项得到 90，优于跳过第二项的 50。'], result: '返回 90。' },
    complexity: { time: 'O(n log n)，排序及每项一次二分。', space: 'O(n)，保存排序工作、结束时间与 dp。' },
    pitfalls: ['结束时间等于开始时间属于兼容，二分条件必须使用≤。', 'dp 的下标是已考虑工作数量，比 jobs 下标多一位。'],
    related: ['435 无重叠区间', '加权区间调度'],
  },
  1249: {
    id: 1249,
    title: '移除无效的括号',
    summary: '从含字母与圆括号的字符串中删除最少括号，使剩余括号序列合法并返回任一结果。',
    constraints: ['字符串只含英文字母与字符 (、)。', '字母必须保留，只允许删除括号。'],
    examples: [{ input: 's = "lee(t(c)o)de)"', output: '"lee(t(c)o)de"', explanation: '删除最后一个无法匹配的右括号即可合法。' }],
    intuition: '从左向右可确定多余右括号；扫描结束后栈中残留的左括号也必定多余，删除这两类位置正好达到最少。',
    bruteForce: '按删除数量枚举括号子集并逐个验证合法性，组合数量呈指数级。',
    approach: ['用栈保存尚未匹配的左括号下标。', '遇到右括号时优先与栈顶匹配；无可匹配项则标记删除。', '扫描结束后把栈中剩余左括号下标全部标记删除。', '跳过删除集合中的位置，拼接其余字符。'],
    code: `class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        stack = []
        remove = set()
        for i, ch in enumerate(s):
            if ch == '(':
                stack.append(i)
            elif ch == ')':
                if stack:
                    stack.pop()
                else:
                    remove.add(i)
        remove.update(stack)
        return ''.join(ch for i, ch in enumerate(s) if i not in remove)`,
    walkthrough: { input: 's = "a)b(c"', steps: ['扫描到下标 1 的右括号时栈为空，将其标记删除。', '后续左括号入栈但直到结束都未匹配，也标记删除。', '保留三个字母并按原顺序拼接。'], result: '返回 "abc"。' },
    complexity: { time: 'O(n)，两次线性扫描。', space: 'O(n)，保存括号下标集合与栈。' },
    pitfalls: ['只删除多余右括号不够，末尾残留的左括号也要处理。', '不能删除字母，也不应改变保留字符的相对顺序。'],
    related: ['20 有效的括号', '921 使括号有效的最少添加'],
  },
};

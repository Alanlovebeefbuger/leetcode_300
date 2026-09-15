import type { Lesson } from './lessons';

export const lessonsBatch16: Record<number, Lesson> = {
  1268: {
    id: 1268, title: '搜索推荐系统',
    summary: '按搜索词逐字符形成前缀，每次返回字典序最小且匹配该前缀的至多三个商品名。',
    constraints: ['商品名和搜索词均由小写英文字母组成。', '每个前缀的推荐数量最多为 3，且按字典序排列。'],
    examples: [{ input: 'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"', output: '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]', explanation: '前缀逐步变为 m、mo、mou、mous、mouse。' }],
    intuition: '商品排序后，拥有相同前缀的名字连续出现；二分找到前缀的插入点，只需检查其后的三个名字。',
    bruteForce: '对每个前缀扫描全部商品并排序匹配项，重复工作多，最坏约 O(L·n log n)。',
    approach: ['先将 products 按字典序排序。', '逐字符扩展当前前缀。', '二分查找该前缀在商品数组中的左边界。', '从边界起检查至多三个确实以此前缀开头的商品。'],
    code: `class Solution:
    def suggestedProducts(self, products: List[str], searchWord: str) -> List[List[str]]:
        from bisect import bisect_left
        products.sort()
        ans, prefix = [], ""
        for ch in searchWord:
            prefix += ch
            left = bisect_left(products, prefix)
            ans.append([name for name in products[left:left + 3]
                        if name.startswith(prefix)])
        return ans`,
    walkthrough: { input: 'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"', steps: ['排序后，前缀 m 的左边界指向 mobile，取前三项。', '扩展到 mou 时，边界移到 mouse，只剩 mouse 与 mousepad 匹配。', '后续 mous、mouse 仍得到这两个商品。'], result: '得到五组按前缀递进的推荐列表。' },
    complexity: { time: 'O(n log n + L log n + L·P)，P 为至多三个候选的字符串检查成本。', space: 'O(L·3)，不计排序与输出时仅保存前缀。' },
    pitfalls: ['二分后的三个元素仍须用 startswith 验证。', '必须先排序，否则同前缀商品不连续且顺序不正确。'],
    related: ['二分查找', '前缀', '字典树'],
  },
  1288: {
    id: 1288, title: '删除被覆盖区间',
    summary: '删除所有被另一区间完全包含的区间，返回最终保留的区间数量。',
    constraints: ['区间满足 start < end。', '若 a≤c 且 d≤b，则 [c,d] 被 [a,b] 覆盖。'],
    examples: [{ input: 'intervals = [[1,4],[3,6],[2,8]]', output: '2', explanation: '[1,4] 被 [2,8] 覆盖，另外两个区间保留。' }],
    intuition: '按起点升序、终点降序排列后，能覆盖别人的区间必先出现；当前终点不超过历史最大终点时，它已被覆盖。',
    bruteForce: '逐对判断包含关系并标记被覆盖区间，需要 O(n²) 次比较。',
    approach: ['按 (起点升序，终点降序) 排序。', '维护已见区间的最大终点 maxEnd。', '若当前终点大于 maxEnd，说明未被覆盖并计数。', '更新 maxEnd 后继续扫描。'],
    code: `class Solution:
    def removeCoveredIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: (x[0], -x[1]))
        kept, max_end = 0, -1
        for _, end in intervals:
            if end > max_end:
                kept += 1
                max_end = end
        return kept`,
    walkthrough: { input: 'intervals = [[1,4],[3,6],[2,8]]', steps: ['排序得到 [1,4]、[2,8]、[3,6]。', '前两个终点依次刷新最大值，因此都计入。', '[3,6] 的终点不超过 8，被此前区间覆盖。'], result: '保留数量为 2。' },
    complexity: { time: 'O(n log n)，主要是排序。', space: 'O(log n)，取决于排序实现。' },
    pitfalls: ['起点相同时必须让终点更大的区间在前。', '相同终点且起点更晚的区间也属于被覆盖。'],
    related: ['区间排序', '贪心', '合并区间'],
  },
  1290: {
    id: 1290, title: '二进制链表转整数',
    summary: '链表从高位到低位保存二进制位，计算其对应的十进制整数。',
    constraints: ['每个节点值只能是 0 或 1。', '头节点表示最高有效位，链表非空。'],
    examples: [{ input: 'head = [1,0,1]', output: '5', explanation: '二进制 101 等于十进制 5。' }],
    intuition: '从左到右读新位时，已有数值左移一位再加当前位，即 value = value·2 + bit。',
    bruteForce: '先保存全部位，再为每一位单独计算 2 的幂并求和，需要额外数组。',
    approach: ['令累计值 value 为 0。', '从头到尾遍历链表。', '每到一个节点，将 value 左移一位并合入节点值。', '遍历结束返回 value。'],
    code: `class Solution:
    def getDecimalValue(self, head: ListNode) -> int:
        value = 0
        while head:
            value = (value << 1) | head.val
            head = head.next
        return value`,
    walkthrough: { input: 'head = [1,0,1]', steps: ['读 1 后累计值为 1。', '读 0 后左移得到 2。', '读最后的 1 后得到 2×2+1=5。'], result: '返回 5。' },
    complexity: { time: 'O(n)，每个节点访问一次。', space: 'O(1)。' },
    pitfalls: ['链表顺序是高位到低位，不能按低位权重处理。', '更新时应先扩大旧值的位权，再加入当前位。'],
    related: ['链表遍历', '位运算', '进制转换'],
  },
  1293: {
    id: 1293, title: '网格中的最短路径',
    summary: '从网格左上角走到右下角，每步上下左右移动，可消除至多 k 个障碍，求最少步数。',
    constraints: ['网格元素为 0 或 1，起点和终点为空地。', '同一坐标在剩余消除次数不同时属于不同搜索状态。'],
    examples: [{ input: 'grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1', output: '6', explanation: '消除一个障碍后可用 6 步到达右下角。' }],
    intuition: '无权图最短路用 BFS；到达同一格时，剩余消除次数更多的状态支配更少的状态，可据此剪枝。',
    bruteForce: '枚举所有简单路径及障碍消除组合，路径数量随网格大小指数增长。',
    approach: ['队列状态记录行、列、剩余消除数和步数。', '按 BFS 层序扩展四个方向。', '进入障碍格时消耗一次额度，额度为负则丢弃。', '每格只保留见过的最大剩余额度，抵达终点立即返回。'],
    code: `class Solution:
    def shortestPath(self, grid: List[List[int]], k: int) -> int:
        from collections import deque
        m, n = len(grid), len(grid[0])
        if k >= m + n - 2:
            return m + n - 2
        best = [[-1] * n for _ in range(m)]
        best[0][0] = k
        q = deque([(0, 0, k, 0)])
        while q:
            r, c, left, dist = q.popleft()
            if r == m - 1 and c == n - 1:
                return dist
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n:
                    nxt = left - grid[nr][nc]
                    if nxt >= 0 and nxt > best[nr][nc]:
                        best[nr][nc] = nxt
                        q.append((nr, nc, nxt, dist + 1))
        return -1`,
    walkthrough: { input: '示例网格，k = 1', steps: ['从 (0,0) 以剩余额度 1 开始逐层扩展。', '遇到障碍可令额度减一；同格仅保留额度更优的到达方式。', '第 6 层首次到达右下角，因此该距离最短。'], result: '返回 6。' },
    complexity: { time: 'O(mn(k+1))，状态数受坐标和额度限制。', space: 'O(mn(k+1))，最坏队列包含多种额度状态。' },
    pitfalls: ['只用坐标做 visited 会错误丢弃剩余额度更优的路径。', '消耗障碍额度后再判断状态是否可入队。'],
    related: ['广度优先搜索', '状态压缩', '网格最短路'],
  },
  1319: {
    id: 1319, title: '连通网络的操作次数',
    summary: '可拔下一条已有网线并连接任意两台电脑，求使整个网络连通的最少操作数；不可行返回 -1。',
    constraints: ['连接表示无向边，电脑编号为 0 到 n-1。', '要连通 n 个节点至少需要 n-1 条网线。'],
    examples: [{ input: 'n = 4, connections = [[0,1],[0,2],[1,2]]', output: '1', explanation: '三台已连通电脑中有冗余线，可将它改接到电脑 3。' }],
    intuition: '网线总数足够时，连通分量之间每连接一次就减少一个分量，因此答案是分量数减一。',
    bruteForce: '反复尝试拔线和重连的全部组合，候选操作数量巨大且没有必要。',
    approach: ['若边数少于 n-1，直接返回 -1。', '用并查集合并每条连接的两个端点。', '统计最终不同根节点的数量 components。', '返回 components-1。'],
    code: `class Solution:
    def makeConnected(self, n: int, connections: List[List[int]]) -> int:
        if len(connections) < n - 1:
            return -1
        parent = list(range(n))
        def find(x):
            while x != parent[x]:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        for a, b in connections:
            ra, rb = find(a), find(b)
            if ra != rb:
                parent[ra] = rb
        components = sum(find(i) == i for i in range(n))
        return components - 1`,
    walkthrough: { input: 'n = 4, connections = [[0,1],[0,2],[1,2]]', steps: ['三条边达到 n-1，网线数量足够。', '并查集得到分量 {0,1,2} 和 {3}。', '两个分量只需用一条冗余线连接。'], result: '返回 1。' },
    complexity: { time: 'O(n+e·α(n))，并查集操作近似常数。', space: 'O(n)，保存父节点数组。' },
    pitfalls: ['边数不足时，无论怎样重接都不可能连通。', '答案由连通分量数决定，不是直接统计环边数量。'],
    related: ['并查集', '连通分量', '生成树'],
  },
  1337: {
    id: 1337, title: '矩阵中战斗力最弱的 K 行',
    summary: '按每行士兵数量从少到多选出 k 行；数量相同时，行下标更小者优先。',
    constraints: ['每行由若干个 1 后接若干个 0 构成。', 'k 不超过矩阵行数。'],
    examples: [{ input: 'mat = [[1,1,0],[1,0,0],[1,1,1]], k = 2', output: '[1,0]', explanation: '三行士兵数为 2、1、3，最弱两行为 1 和 0。' }],
    intuition: '每行可归纳为二元排序键 (士兵数, 行号)，将这些键排序即可自然处理平局。',
    bruteForce: '逐轮扫描尚未选择的行寻找最弱者，取 k 次需要 O(km) 次行级比较。',
    approach: ['统计每行中 1 的数量。', '为每行建立 (数量, 下标) 元组。', '按元组的默认顺序排序。', '取前 k 个元组的下标。'],
    code: `class Solution:
    def kWeakestRows(self, mat: List[List[int]], k: int) -> List[int]:
        order = sorted((sum(row), i) for i, row in enumerate(mat))
        return [i for _, i in order[:k]]`,
    walkthrough: { input: 'mat = [[1,1,0],[1,0,0],[1,1,1]], k = 2', steps: ['统计得到键 (2,0)、(1,1)、(3,2)。', '排序后顺序为 (1,1)、(2,0)、(3,2)。', '取前两个键中的行号。'], result: '返回 [1,0]。' },
    complexity: { time: 'O(mn + m log m)，统计并排序 m 行。', space: 'O(m)，保存排序键。' },
    pitfalls: ['士兵数相同时必须按原行号升序。', '利用 sum 的前提是矩阵元素只有 0 和 1。'],
    related: ['排序', '二分计数', '优先队列'],
  },
  1345: {
    id: 1345, title: '跳跃游戏 IV',
    summary: '在数组中可走到相邻下标，也可跳到任意同值下标，求从 0 到末尾的最少跳跃次数。',
    constraints: ['一次跳跃可到 i-1、i+1 或任意满足 arr[j]=arr[i] 的 j。', '数组可能包含大量重复值。'],
    examples: [{ input: 'arr = [100,-23,-23,404,100,23,23,23,3,404]', output: '3', explanation: '可按 0→4→3→9 到达末尾。' }],
    intuition: '下标构成无权图，BFS 保证最少步；同值下标表提供隐式边，展开一次后立即删除可避免重复扫描。',
    bruteForce: '每到一个下标就扫描整个数组寻找同值位置，最坏会退化为 O(n²)。',
    approach: ['预处理 value 到全部下标的映射。', '从下标 0 开始按层 BFS。', '扩展相邻下标和当前值对应的所有下标。', '同值列表使用后删除，避免以后反复展开。'],
    code: `class Solution:
    def minJumps(self, arr: List[int]) -> int:
        from collections import defaultdict, deque
        positions = defaultdict(list)
        for i, value in enumerate(arr):
            positions[value].append(i)
        q, seen, steps = deque([0]), {0}, 0
        while q:
            for _ in range(len(q)):
                i = q.popleft()
                if i == len(arr) - 1:
                    return steps
                for j in positions.pop(arr[i], []) + [i - 1, i + 1]:
                    if 0 <= j < len(arr) and j not in seen:
                        seen.add(j)
                        q.append(j)
            steps += 1
        return -1`,
    walkthrough: { input: 'arr = [100,-23,-23,404,100,23,23,23,3,404]', steps: ['从下标 0 可借同值 100 跳到下标 4。', '从 4 走相邻位置到下标 3。', '值 404 的同值边把 3 直接连到末尾 9。'], result: '最少跳跃次数为 3。' },
    complexity: { time: 'O(n)，每个下标与每组同值边至多展开一次。', space: 'O(n)，保存映射、队列和访问集合。' },
    pitfalls: ['同值列表若不清除，会被多个节点重复遍历导致超时。', '应在入队时标记 visited，防止同层重复加入。'],
    related: ['广度优先搜索', '隐式图', '哈希表'],
  },
  1347: {
    id: 1347, title: '制造字母异位词的最小步骤数',
    summary: '每步可替换字符串 t 的一个字符，求使 t 与等长字符串 s 成为字母异位词的最少替换次数。',
    constraints: ['s 与 t 长度相同且仅含小写英文字母。', '异位词要求每种字符的出现次数相同。'],
    examples: [{ input: 's = "bab", t = "aba"', output: '1', explanation: 't 缺少一个 b 且多出一个 a，替换一次即可。' }],
    intuition: 't 中缺少的每个目标字符都必须由某个多余字符替换得到，因此把 s 相对 t 的正频次差求和即可。',
    bruteForce: '枚举 t 中位置的替换目标并检查所有排列，会产生指数级或阶乘级候选。',
    approach: ['分别统计 s 与 t 的字符频次。', '对每个字符计算 countS-countT。', '只累加正差，它们表示 t 的缺口。', '缺口总数就是最少替换次数。'],
    code: `class Solution:
    def minSteps(self, s: str, t: str) -> int:
        from collections import Counter
        need = Counter(s)
        need.subtract(t)
        return sum(max(diff, 0) for diff in need.values())`,
    walkthrough: { input: 's = "bab", t = "aba"', steps: ['s 中 b 有 2 个、a 有 1 个。', 't 中 b 有 1 个、a 有 2 个，因此只缺一个 b。', '把一个多余的 a 替换成 b 即可补齐。'], result: '返回 1。' },
    complexity: { time: 'O(n)，扫描两个字符串。', space: 'O(1)，字符集固定为 26 个字母。' },
    pitfalls: ['只累加正差，正负差同时求绝对值会重复计算。', '操作对象是 t，但用 s-t 的缺口统计最直观。'],
    related: ['字符计数', '哈希表', '字母异位词'],
  },
  1353: {
    id: 1353, title: '最多可以参加的会议数目',
    summary: '每场会议可在其起止日期间任选一天参加，且每天最多参加一场，求最多可参加多少场。',
    constraints: ['会议日期区间包含起始日和结束日。', '同一天只能分配给一场会议。'],
    examples: [{ input: 'events = [[1,2],[2,3],[3,4]]', output: '3', explanation: '分别在第 1、2、3 天参加三场会议。' }],
    intuition: '每天应优先参加最早结束的可用会议，把更宽松的会议留到未来；最小堆可随日期维护最早截止日。',
    bruteForce: '尝试把每场会议分配给区间内各天并回溯，会产生大量排列组合。',
    approach: ['按开始日期排序会议。', '若堆为空，将日期跳到下一场会议开始日。', '把当天已开始的会议结束日压入最小堆，并移除过期项。', '弹出最早结束会议参加，答案和日期各加一。'],
    code: `class Solution:
    def maxEvents(self, events: List[List[int]]) -> int:
        import heapq
        events.sort()
        heap, i, day, attended = [], 0, 0, 0
        while i < len(events) or heap:
            if not heap:
                day = events[i][0]
            while i < len(events) and events[i][0] <= day:
                heapq.heappush(heap, events[i][1])
                i += 1
            while heap and heap[0] < day:
                heapq.heappop(heap)
            if heap:
                heapq.heappop(heap)
                attended += 1
                day += 1
        return attended`,
    walkthrough: { input: 'events = [[1,2],[2,3],[3,4]]', steps: ['第 1 天选择结束于 2 的第一场。', '第 2 天第二场已开始，选择它。', '第 3 天选择第三场，三场均未过期。'], result: '最多参加 3 场。' },
    complexity: { time: 'O(n log n)，每场会议排序并进出堆一次。', space: 'O(n)，最坏所有可用会议同时在堆中。' },
    pitfalls: ['堆中保存结束日，并优先弹出最早结束者。', '日期有空档且堆为空时应直接跳到下个开始日。'],
    related: ['贪心', '最小堆', '区间调度'],
  },
  1372: {
    id: 1372, title: '二叉树中的最长交错路径',
    summary: '在二叉树中选一个起点，沿左右方向交替向下移动，求路径包含的最大边数。',
    constraints: ['路径方向必须在左、右之间严格交替。', '长度按经过的边数计算，单个节点长度为 0。'],
    examples: [{ input: 'root = [1,null,1,1,1,null,null,1,1,null,1]', output: '3', explanation: '存在连续三条边且方向交替的向下路径。' }],
    intuition: '后序遍历时，让每个节点返回“第一步向左”和“第一步向右”的最长长度；父节点从相反方向的子状态续接。',
    bruteForce: '从每个节点分别启动模拟交错路径，会重复遍历相同子树，最坏 O(n²)。',
    approach: ['递归返回当前节点向左起步和向右起步的长度。', '向左起步等于左孩子向右起步长度加一。', '向右起步同理由右孩子向左状态续接。', '用全局值记录所有节点两种状态的最大值。'],
    code: `class Solution:
    def longestZigZag(self, root: Optional[TreeNode]) -> int:
        best = 0
        def dfs(node):
            nonlocal best
            if not node:
                return -1, -1
            ll, lr = dfs(node.left)
            rl, rr = dfs(node.right)
            go_left, go_right = lr + 1, rl + 1
            best = max(best, go_left, go_right)
            return go_left, go_right
        dfs(root)
        return best`,
    walkthrough: { input: '一条方向为右→左→右的三边路径', steps: ['最底层节点的两种起步长度均为 0。', '向上回传时，每层从孩子的相反方向状态加一。', '起点的向右状态累积为 3，并刷新全局答案。'], result: '最长交错路径长度为 3。' },
    complexity: { time: 'O(n)，每个节点只计算一次。', space: 'O(h)，递归栈深度为树高。' },
    pitfalls: ['长度计算的是边而不是节点，空节点返回 -1 可统一叶节点结果。', '续接左孩子时要取它“下一步向右”的状态。'],
    related: ['树形动态规划', '深度优先搜索', '后序遍历'],
  },
  1376: {
    id: 1376, title: '通知所有员工所需的时间',
    summary: '公司管理关系形成以负责人为根的树，通知沿直属关系传播，求所有员工收到消息的最晚时间。',
    constraints: ['除总负责人外，每名员工恰有一名直属经理。', '经理可同时通知所有直属下属，耗时为其 informTime。'],
    examples: [{ input: 'n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]', output: '1', explanation: '负责人 2 用 1 分钟同时通知所有其他员工。' }],
    intuition: '并行传播的总时长由最慢管理链决定；某经理子树的完成时间是自身通知耗时加各下属完成时间的最大值。',
    bruteForce: '对每名员工沿 manager 数组反复追溯到负责人并累加，链状结构会达到 O(n²)。',
    approach: ['由 manager 数组建立经理到直属下属的邻接表。', '从 headID 深度优先遍历。', '叶员工无需继续通知，返回 0。', '经理返回 informTime 加所有子树耗时最大值。'],
    code: `class Solution:
    def numOfMinutes(self, n: int, headID: int, manager: List[int], informTime: List[int]) -> int:
        children = [[] for _ in range(n)]
        for employee, boss in enumerate(manager):
            if boss != -1:
                children[boss].append(employee)
        def dfs(employee):
            if not children[employee]:
                return 0
            return informTime[employee] + max(dfs(child) for child in children[employee])
        return dfs(headID)`,
    walkthrough: { input: 'headID = 2，负责人有五名直属下属，informTime[2] = 1', steps: ['从 manager 建出负责人 2 的五条子边。', '五名下属都是叶子，各自子树耗时为 0。', '负责人耗时 1 加子树最大值 0。'], result: '所有人最晚在 1 分钟后获知。' },
    complexity: { time: 'O(n)，构图和遍历各一次。', space: 'O(n)，邻接表与递归栈。' },
    pitfalls: ['同级下属是并行获知，应取最大值而非求和。', '叶员工的 informTime 不会再用于传播。'],
    related: ['树形遍历', '邻接表', '最长路径'],
  },
  1382: {
    id: 1382, title: '将二叉搜索树变平衡',
    summary: '重建给定二叉搜索树，使任意节点左右子树高度差不超过 1，并保留全部节点值。',
    constraints: ['输入满足二叉搜索树性质且节点值互不相同。', '输出只需是任意一棵包含相同值的平衡二叉搜索树。'],
    examples: [{ input: 'root = [1,null,2,null,3,null,4]', output: '[2,1,3,null,null,null,4]', explanation: '中序值不变，重建后树高更均衡。' }],
    intuition: '二叉搜索树的中序遍历严格递增；反复选择有序序列中点作为根，就能让左右节点数尽量接近。',
    bruteForce: '不断通过局部旋转修复失衡虽可行，但实现复杂，且要持续维护高度。',
    approach: ['用迭代中序遍历收集递增节点值。', '在有序区间中选择中点创建根。', '递归用中点左侧构造左子树。', '用右侧构造右子树并返回根。'],
    code: `class Solution:
    def balanceBST(self, root: TreeNode) -> TreeNode:
        values, stack = [], []
        node = root
        while stack or node:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            values.append(node.val)
            node = node.right
        def build(left, right):
            if left > right:
                return None
            mid = (left + right) // 2
            node = TreeNode(values[mid])
            node.left = build(left, mid - 1)
            node.right = build(mid + 1, right)
            return node
        return build(0, len(values) - 1)`,
    walkthrough: { input: 'root = [1,null,2,null,3,null,4]', steps: ['中序遍历得到有序值 [1,2,3,4]。', '选择中点值 2 为根，左段 [1] 构造左子树。', '右段 [3,4] 同样按中点递归构造。'], result: '得到高度平衡且中序值相同的新树。' },
    complexity: { time: 'O(n)，遍历与重建各处理每个节点一次。', space: 'O(n)，保存有序值；新树之外递归深度为 O(log n)。' },
    pitfalls: ['不能只改变节点值而保留原来的失衡结构。', '原树可能极度倾斜，中序遍历用迭代可避免深递归。'],
    related: ['二叉搜索树', '中序遍历', '分治'],
  },
  1396: {
    id: 1396, title: '设计地铁系统',
    summary: '记录乘客进出站，并支持查询任意起终站路线的历史平均乘车时间。',
    constraints: ['同一乘客同一时刻最多有一段未结束行程。', '查询的路线保证至少存在一条已完成行程。'],
    examples: [{ input: 'checkIn(1,"A",3); checkOut(1,"B",8); getAverageTime("A","B")', output: '5.0', explanation: '该路线唯一行程耗时 8-3=5。' }],
    intuition: '未完成行程按乘客 ID 保存；完成时只需把耗时加入路线的总时长与次数，平均值无需保留每条历史记录。',
    bruteForce: '永久保存所有完整行程，每次查询再筛选并求平均，会让查询随历史记录线性变慢。',
    approach: ['用 active 映射记录 id 对应的进站名和时间。', '出站时取出并删除该乘客的进站记录。', '以 (起点,终点) 为键累计总耗时和次数。', '查询时返回总耗时除以次数。'],
    code: `class UndergroundSystem:
    def __init__(self):
        self.active = {}
        self.stats = {}

    def checkIn(self, id: int, stationName: str, t: int) -> None:
        self.active[id] = (stationName, t)

    def checkOut(self, id: int, stationName: str, t: int) -> None:
        start, begin = self.active.pop(id)
        key = (start, stationName)
        total, count = self.stats.get(key, (0, 0))
        self.stats[key] = (total + t - begin, count + 1)

    def getAverageTime(self, startStation: str, endStation: str) -> float:
        total, count = self.stats[(startStation, endStation)]
        return total / count`,
    walkthrough: { input: '乘客 1 在时刻 3 从 A 进站，时刻 8 从 B 出站', steps: ['checkIn 保存 1→(A,3)。', 'checkOut 计算耗时 5，并把路线 (A,B) 更新为 (5,1)。', '查询该路线，用总时长 5 除以次数 1。'], result: '返回平均时间 5.0。' },
    complexity: { time: '每个操作平均 O(1)。', space: 'O(p+r)，p 为在途乘客数，r 为出现过的路线数。' },
    pitfalls: ['路线键有方向，(A,B) 与 (B,A) 不同。', '乘客出站后应删除 active 记录，避免陈旧状态。'],
    related: ['系统设计', '哈希表', '增量统计'],
  },
  1405: {
    id: 1405, title: '最长快乐字符串',
    summary: '使用给定数量的 a、b、c 构造尽可能长的字符串，且不能出现三个相同字符连续。',
    constraints: ['每种字符最多使用给定次数，可不全部用完。', '合法字符串不能包含 aaa、bbb 或 ccc。'],
    examples: [{ input: 'a = 1, b = 1, c = 7', output: '"ccaccbcc"', explanation: '该字符串使用 8 个字符且没有三个连续相同字符。' }],
    intuition: '优先放剩余最多的字符最利于延长结果；若它会形成三连，就临时改放次多字符打断。',
    bruteForce: '回溯尝试每个位置放三种字符，状态分支接近 3^(a+b+c)。',
    approach: ['把剩余数量为正的字符放入最大堆。', '每轮取数量最多的字符。', '若它会造成三连，则改取次多字符，并把首选放回。', '追加字符、减少计数并把仍有余量者重新入堆。'],
    code: `class Solution:
    def longestDiverseString(self, a: int, b: int, c: int) -> str:
        import heapq
        heap = [(-count, ch) for count, ch in ((a, "a"), (b, "b"), (c, "c")) if count]
        heapq.heapify(heap)
        ans = []
        while heap:
            count, ch = heapq.heappop(heap)
            if len(ans) >= 2 and ans[-1] == ans[-2] == ch:
                if not heap:
                    break
                count2, ch2 = heapq.heappop(heap)
                ans.append(ch2)
                count2 += 1
                if count2 < 0:
                    heapq.heappush(heap, (count2, ch2))
                heapq.heappush(heap, (count, ch))
            else:
                ans.append(ch)
                count += 1
                if count < 0:
                    heapq.heappush(heap, (count, ch))
        return "".join(ans)`,
    walkthrough: { input: 'a = 1, b = 1, c = 7', steps: ['堆首先多次选择 c，但最多连续放两个。', '将要形成 ccc 时，取 a 或 b 作为分隔。', '分隔字符耗尽且再放 c 会三连时停止。'], result: '可构造长度 8 的合法字符串。' },
    complexity: { time: 'O(a+b+c)，堆大小最多为 3，每次操作视为常数。', space: 'O(a+b+c)，用于结果；堆空间 O(1)。' },
    pitfalls: ['最大字符受阻时不能直接结束，仍可能使用次多字符。', 'Python 最小堆需用负计数模拟最大堆。'],
    related: ['贪心', '最大堆', '重构字符串'],
  },
  1423: {
    id: 1423, title: '可获得的最大点数',
    summary: '从卡牌数组两端合计拿走恰好 k 张，求可获得的最大分数。',
    constraints: ['每次只能拿当前最左或最右卡牌。', 'k 的范围为 1 到卡牌总数。'],
    examples: [{ input: 'cardPoints = [1,2,3,4,5,6,1], k = 3', output: '12', explanation: '从右端依次拿 1、6、5，得分为 12。' }],
    intuition: '拿走两端 k 张等价于在中间留下连续的 n-k 张；总和固定时，让留下窗口的和最小即可。',
    bruteForce: '枚举从左拿 x 张、从右拿 k-x 张可用 O(k)；若每次重新求和则是 O(k²)。',
    approach: ['计算所有卡牌总和。', '令窗口长度为 n-k，计算首个窗口和。', '滑动该固定长度窗口并维护最小窗口和。', '返回总和减最小窗口和；窗口为空时直接返回总和。'],
    code: `class Solution:
    def maxScore(self, cardPoints: List[int], k: int) -> int:
        total = sum(cardPoints)
        window = len(cardPoints) - k
        if window == 0:
            return total
        current = sum(cardPoints[:window])
        minimum = current
        for right in range(window, len(cardPoints)):
            current += cardPoints[right] - cardPoints[right - window]
            minimum = min(minimum, current)
        return total - minimum`,
    walkthrough: { input: 'cardPoints = [1,2,3,4,5,6,1], k = 3', steps: ['总和为 22，需要留下长度 4 的连续窗口。', '各长度 4 窗口中，[1,2,3,4] 的和 10 最小。', '拿走窗口外的 [5,6,1]，得分 22-10。'], result: '返回 12。' },
    complexity: { time: 'O(n)，求总和并滑动一次。', space: 'O(1)。' },
    pitfalls: ['必须恰好拿 k 张，所以留下窗口长度固定为 n-k。', 'k=n 时窗口为空，应单独返回总和。'],
    related: ['滑动窗口', '前缀和', '数组两端选择'],
  },
  1438: {
    id: 1438, title: '绝对差不超过限制的最长连续子数组',
    summary: '寻找最长连续子数组，使其中任意两元素的绝对差都不超过 limit。',
    constraints: ['limit 为非负整数。', '条件等价于窗口最大值减最小值不超过 limit。'],
    examples: [{ input: 'nums = [8,2,4,7], limit = 4', output: '2', explanation: '[2,4] 或 [4,7] 满足条件，无法取得长度 3。' }],
    intuition: '右端扩张时只需知道窗口最大、最小值；两个单调队列可在 O(1) 摊还时间维护它们，超限就移动左端。',
    bruteForce: '枚举所有子数组并扫描求最大最小值，最坏需要 O(n³)。',
    approach: ['递减队列保存最大值候选下标，递增队列保存最小值候选下标。', '加入右端元素前，弹掉队尾不再可能成为极值的下标。', '当最大值减最小值超限时右移 left，并清理过期队首。', '每轮用 right-left+1 更新答案。'],
    code: `class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        from collections import deque
        max_q, min_q = deque(), deque()
        left = best = 0
        for right, value in enumerate(nums):
            while max_q and nums[max_q[-1]] < value:
                max_q.pop()
            while min_q and nums[min_q[-1]] > value:
                min_q.pop()
            max_q.append(right)
            min_q.append(right)
            while nums[max_q[0]] - nums[min_q[0]] > limit:
                if max_q[0] == left:
                    max_q.popleft()
                if min_q[0] == left:
                    min_q.popleft()
                left += 1
            best = max(best, right - left + 1)
        return best`,
    walkthrough: { input: 'nums = [8,2,4,7], limit = 4', steps: ['加入 8、2 后极差为 6，左端收缩到只含 2。', '加入 4 后窗口 [2,4] 合法，长度更新为 2。', '加入 7 使 [2,4,7] 超限，移除 2 后 [4,7] 合法。'], result: '最长长度为 2。' },
    complexity: { time: 'O(n)，每个下标在两个队列中各进出至多一次。', space: 'O(n)，单调队列最坏保存全部下标。' },
    pitfalls: ['队列应存下标，才能判断元素是否离开窗口。', '维护的是整个窗口极差，不是只比较相邻元素。'],
    related: ['滑动窗口', '单调队列', '区间极值'],
  },
  1448: {
    id: 1448, title: '统计二叉树中好节点的数目',
    summary: '若从根到某节点的路径上不存在值比它更大的节点，则该节点为好节点，求总数。',
    constraints: ['根节点总是好节点。', '判断依赖根到当前节点路径上的最大值。'],
    examples: [{ input: 'root = [3,1,4,3,null,1,5]', output: '4', explanation: '值为 3 的根、左下 3、右子 4 和右下 5 是好节点。' }],
    intuition: '遍历树时携带路径最大值；当前值不小于该最大值就计数，再把二者较大值传给孩子。',
    bruteForce: '对每个节点重新向上检查全部祖先，倾斜树中会达到 O(n²)。',
    approach: ['栈中保存节点及到其父节点为止的路径最大值。', '弹出节点后比较 node.val 与路径最大值。', '满足条件则将答案加一。', '把更新后的最大值随左右孩子压栈。'],
    code: `class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        count = 0
        stack = [(root, root.val)]
        while stack:
            node, path_max = stack.pop()
            if node.val >= path_max:
                count += 1
            next_max = max(path_max, node.val)
            if node.left:
                stack.append((node.left, next_max))
            if node.right:
                stack.append((node.right, next_max))
        return count`,
    walkthrough: { input: 'root = [3,1,4,3,null,1,5]', steps: ['根 3 与初始最大值相等，计为好节点。', '左侧 1 不计，但其孩子 3 达到路径最大值，计入。', '右侧 4 刷新最大值，其孩子 5 再次刷新并计入。'], result: '共得到 4 个好节点。' },
    complexity: { time: 'O(n)，每个节点访问一次。', space: 'O(n)，显式栈最坏保存线性数量节点。' },
    pitfalls: ['好节点允许等于路径最大值，比较符号应为 >=。', '路径最大值必须按分支分别传递，不能使用跨分支全局最大值。'],
    related: ['深度优先搜索', '路径状态', '二叉树'],
  },
  1456: {
    id: 1456, title: '定长子串中元音的最大数目',
    summary: '在字符串中寻找长度恰为 k 的子串，返回其中元音字母数量的最大值。',
    constraints: ['字符串只含小写英文字母。', 'k 不超过字符串长度，元音集合为 a、e、i、o、u。'],
    examples: [{ input: 's = "abciiidef", k = 3', output: '3', explanation: '子串 "iii" 含有 3 个元音。' }],
    intuition: '相邻定长窗口只差一个离开字符和一个进入字符，增量更新元音数即可避免重复统计。',
    bruteForce: '枚举每个长度 k 的子串并逐字符计数，需要 O(nk) 时间。',
    approach: ['统计首个长度 k 窗口中的元音数。', '从下标 k 开始移动右边界。', '加入新字符的贡献并减去离开字符的贡献。', '持续更新最大值，达到 k 时可提前结束。'],
    code: `class Solution:
    def maxVowels(self, s: str, k: int) -> int:
        vowels = set("aeiou")
        current = sum(ch in vowels for ch in s[:k])
        best = current
        for right in range(k, len(s)):
            current += (s[right] in vowels) - (s[right - k] in vowels)
            best = max(best, current)
            if best == k:
                return k
        return best`,
    walkthrough: { input: 's = "abciiidef", k = 3', steps: ['首窗 "abc" 含 1 个元音。', '窗口右移时依次加入 i，并移出前面的非元音。', '窗口变为 "iii" 时计数达到理论上限 3。'], result: '返回 3。' },
    complexity: { time: 'O(n)，每个字符至多作为窗口边界处理一次。', space: 'O(1)，元音集合大小固定。' },
    pitfalls: ['窗口长度必须始终为 k，更新时要同时加右端、减左端。', 'Python 的布尔值可参与加减，但括号能避免表达式歧义。'],
    related: ['滑动窗口', '字符串', '定长区间'],
  },
  1462: {
    id: 1462, title: '课程表 IV',
    summary: '给定课程间的直接先修关系，逐个判断查询中的第一门课是否为第二门课的直接或间接先修课。',
    constraints: ['课程编号为 0 到 numCourses-1。', '先修关系构成有向图，查询需要考虑传递关系。'],
    examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]', output: '[false,true]', explanation: '课程 1 是课程 0 的先修课，反向不是。' }],
    intuition: '查询很多时，可预先求所有点对的可达性；若 a 能沿有向边到 b，则 a 是 b 的先修课。',
    bruteForce: '对每条查询单独从起点 DFS/BFS，重复探索相同图结构，代价为 O(q(n+e))。',
    approach: ['建立 n×n 布尔矩阵，直接关系 a→b 置真。', '依次把每门课程 k 当作中转点。', '若 i 可达 k 且 k 可达 j，则标记 i 可达 j。', '按查询顺序读取矩阵结果。'],
    code: `class Solution:
    def checkIfPrerequisite(self, numCourses: int, prerequisites: List[List[int]], queries: List[List[int]]) -> List[bool]:
        reach = [[False] * numCourses for _ in range(numCourses)]
        for before, after in prerequisites:
            reach[before][after] = True
        for mid in range(numCourses):
            for start in range(numCourses):
                if reach[start][mid]:
                    for end in range(numCourses):
                        reach[start][end] |= reach[mid][end]
        return [reach[a][b] for a, b in queries]`,
    walkthrough: { input: 'prerequisites = [[0,1],[1,2]], query = [0,2]', steps: ['矩阵先记录 0→1 与 1→2。', '以课程 1 为中转，发现 0 可经 1 到达 2。', '查询矩阵位置 reach[0][2] 为真。'], result: '0 是 2 的间接先修课。' },
    complexity: { time: 'O(n³+q)，预处理传递闭包后常数时间回答每个查询。', space: 'O(n²)，保存可达矩阵。' },
    pitfalls: ['边方向是先修课指向后续课程，不能反建。', '只记录直接边无法回答跨多门课程的间接关系。'],
    related: ['有向图', '传递闭包', '动态规划'],
  },
  1466: {
    id: 1466, title: '重新规划路线',
    summary: '道路底层形成一棵树，但每条边有方向；求最少反转多少条边，才能让所有城市都能到达城市 0。',
    constraints: ['忽略方向后，n 个城市与 n-1 条道路构成一棵树。', '一次操作可反转一条道路方向。'],
    examples: [{ input: 'n = 6, connections = [[0,1],[1,3],[2,3],[4,0],[4,5]]', output: '3', explanation: '反转 0→1、1→3、4→5 后，所有城市可沿方向到达 0。' }],
    intuition: '从 0 沿无向树遍历：若遇到的原始边方向是从父层指向子层，它背离 0，必须反转且只需反转一次。',
    bruteForce: '枚举边的反转子集并检查可达性，需要考察 2^(n-1) 种方案。',
    approach: ['把每条原边 a→b 加为 (a,b,代价1) 和 (b,a,代价0)。', '从城市 0 在这张双向邻接表上遍历。', '首次走向未访问邻居时累加该方向的代价。', '树无环路选择问题，累计值即最少反转数。'],
    code: `class Solution:
    def minReorder(self, n: int, connections: List[List[int]]) -> int:
        graph = [[] for _ in range(n)]
        for a, b in connections:
            graph[a].append((b, 1))
            graph[b].append((a, 0))
        changes = 0
        stack, seen = [0], {0}
        while stack:
            city = stack.pop()
            for neighbor, cost in graph[city]:
                if neighbor not in seen:
                    seen.add(neighbor)
                    changes += cost
                    stack.append(neighbor)
        return changes`,
    walkthrough: { input: 'connections = [[0,1],[1,3],[2,3],[4,0],[4,5]]', steps: ['从 0 走向 1 时原边为 0→1，背离根，计一次。', '继续到 3 同样计一次，而 3→2 的遍历代价为 0。', '0→4 已朝向根无需改，4→5 背离根再计一次。'], result: '共需反转 3 条道路。' },
    complexity: { time: 'O(n)，树中每条边检查两次。', space: 'O(n)，邻接表、栈与访问集合。' },
    pitfalls: ['遍历方向与车辆最终行驶方向相反，因此从 0 向外的原边需要反转。', '双向邻接表必须保留原始方向对应的代价。'],
    related: ['树', '深度优先搜索', '有向边'],
  },
  1472: {
    id: 1472, title: '设计浏览器历史记录',
    summary: '实现访问新网址、后退若干步和前进若干步，并在访问新网址后丢弃原有前进历史。',
    constraints: ['后退或前进超过边界时停在最远可达页面。', '调用 visit 后，当前位置之后的记录全部失效。'],
    examples: [{ input: 'BrowserHistory("a.com"); visit("b.com"); visit("c.com"); back(1); visit("d.com"); forward(2)', output: '"d.com"', explanation: '访问 d.com 会删除原先位于前进方向的 c.com。' }],
    intuition: '数组按时间保存当前有效历史，用下标表示当前位置；visit 截断下标右侧再追加，移动操作只需夹紧下标。',
    bruteForce: '用字符串链表并在每次移动时逐步走节点可行，但随机步数操作更繁琐，也不便截断后续历史。',
    approach: ['初始化历史数组只含主页，当前位置为 0。', 'visit 时保留当前位置及其左侧，再追加新网址。', 'back 将位置减 steps，但不小于 0。', 'forward 将位置加 steps，但不超过末下标。'],
    code: `class BrowserHistory:
    def __init__(self, homepage: str):
        self.history = [homepage]
        self.index = 0

    def visit(self, url: str) -> None:
        self.history = self.history[:self.index + 1]
        self.history.append(url)
        self.index += 1

    def back(self, steps: int) -> str:
        self.index = max(0, self.index - steps)
        return self.history[self.index]

    def forward(self, steps: int) -> str:
        self.index = min(len(self.history) - 1, self.index + steps)
        return self.history[self.index]`,
    walkthrough: { input: 'a→b→c，后退到 b，再访问 d', steps: ['访问 b、c 后历史为 [a,b,c]，位置在 c。', '后退一步后位置指向 b。', '访问 d 截断 c 并追加 d，历史变为 [a,b,d]。'], result: '此后无法再前进到 c。' },
    complexity: { time: 'back/forward 为 O(1)；visit 因切片最坏 O(n)。', space: 'O(n)，保存当前有效访问历史。' },
    pitfalls: ['visit 必须清空当前位置之后的前进记录。', '前进和后退都要将位置限制在合法边界。'],
    related: ['设计', '数组', '双栈'],
  },
  1480: {
    id: 1480, title: '一维数组的动态和',
    summary: '返回数组的前缀和，使结果第 i 项等于原数组从 0 到 i 的元素总和。',
    constraints: ['输入为非空整数数组。', '每个结果位置包含当前位置及此前全部元素。'],
    examples: [{ input: 'nums = [1,2,3,4]', output: '[1,3,6,10]', explanation: '各项依次为 1、1+2、1+2+3、1+2+3+4。' }],
    intuition: '相邻前缀和只差当前元素，因此从左到右维护累计值即可。',
    bruteForce: '对每个下标重新求 nums[0:i+1] 的总和，需要 O(n²) 时间。',
    approach: ['初始化累计值 total 和答案数组。', '按顺序遍历每个元素。', '把元素加入 total。', '将更新后的 total 追加到答案。'],
    code: `class Solution:
    def runningSum(self, nums: List[int]) -> List[int]:
        ans = []
        total = 0
        for value in nums:
            total += value
            ans.append(total)
        return ans`,
    walkthrough: { input: 'nums = [1,2,3,4]', steps: ['读 1，累计值为 1。', '再读 2、3，累计值依次为 3、6。', '最后加入 4 得到 10。'], result: '返回 [1,3,6,10]。' },
    complexity: { time: 'O(n)，线性遍历数组。', space: 'O(n)，用于返回结果；额外变量为 O(1)。' },
    pitfalls: ['每项应包含当前元素，不能只累计到 i-1。', '若选择原地修改，要确认题目允许改变输入数组。'],
    related: ['前缀和', '数组遍历', '区间求和'],
  },
  1493: {
    id: 1493, title: '删掉一个元素以后全为 1 的最长子数组',
    summary: '必须从二进制数组中删除恰好一个元素，求删除后只含 1 的最长非空连续子数组长度。',
    constraints: ['数组元素只能是 0 或 1。', '即使数组全为 1，也必须删除一个元素。'],
    examples: [{ input: 'nums = [1,1,0,1]', output: '3', explanation: '删除唯一的 0 后，三个 1 连成连续子数组。' }],
    intuition: '维护至多含一个 0 的窗口；把这个 0 删除后，所得全 1 长度恰为窗口长度减一。全 1 窗口也要预留一次删除。',
    bruteForce: '枚举删除位置，再扫描剩余数组寻找最长连续 1，需要 O(n²)。',
    approach: ['用左右指针维护窗口内 0 的数量。', '右端加入 0 时增加计数。', '若窗口含两个 0，就移动左端直到至多一个。', '用 right-left 更新答案，它等于当前窗口长度减一。'],
    code: `class Solution:
    def longestSubarray(self, nums: List[int]) -> int:
        left = zeros = best = 0
        for right, value in enumerate(nums):
            if value == 0:
                zeros += 1
            while zeros > 1:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left)
        return best`,
    walkthrough: { input: 'nums = [1,1,0,1]', steps: ['窗口扩张到整个数组时只含一个 0，始终合法。', '窗口长度为 4，删除其中的 0 后剩下三个连续的 1。', 'right-left 的最大值为 3。'], result: '返回 3。' },
    complexity: { time: 'O(n)，左右指针各前进至多 n 次。', space: 'O(1)。' },
    pitfalls: ['题目要求恰好删除一个元素，全 1 数组答案是 n-1。', '更新长度使用 right-left，而不是 right-left+1。'],
    related: ['滑动窗口', '二进制数组', '最大连续 1'],
  },
  1512: {
    id: 1512, title: '好数对的数目',
    summary: '统计满足 i<j 且 nums[i]=nums[j] 的下标对数量。',
    constraints: ['数对由下标定义，相同数值的不同位置可组成多个数对。', '只统计 i<j，避免同一对重复。'],
    examples: [{ input: 'nums = [1,2,3,1,1,3]', output: '4', explanation: '值 1 贡献三对，值 3 贡献一对。' }],
    intuition: '从左到右读到某值时，它可与此前出现的每个同值位置组成新好数对，因此先加旧频次，再更新频次。',
    bruteForce: '枚举所有 i<j 并比较数值，需要 O(n²) 时间。',
    approach: ['维护每个数值此前出现的次数。', '遍历当前值 value。', '把 value 的已有次数加入答案。', '再将该值频次加一。'],
    code: `class Solution:
    def numIdenticalPairs(self, nums: List[int]) -> int:
        counts = {}
        pairs = 0
        for value in nums:
            pairs += counts.get(value, 0)
            counts[value] = counts.get(value, 0) + 1
        return pairs`,
    walkthrough: { input: 'nums = [1,2,3,1,1,3]', steps: ['前三个值首次出现，不产生数对。', '第二个 1 遇到一个旧 1，新增一对；第三个 1 再新增两对。', '第二个 3 遇到一个旧 3，再新增一对。'], result: '总数为 4。' },
    complexity: { time: 'O(n)，单次哈希扫描。', space: 'O(u)，u 为不同数值个数。' },
    pitfalls: ['应先累加旧频次再自增，避免把当前位置与自己配对。', '统计的是位置对，而不是不同数值的种类数。'],
    related: ['哈希计数', '组合计数', '数组'],
  },
  1514: {
    id: 1514, title: '概率最大的路径',
    summary: '无向图每条边有成功概率，路径概率为边概率乘积，求起点到终点的最大成功概率。',
    constraints: ['边概率位于 0 到 1 之间，图中可能不存在可达路径。', '路径总概率由沿途所有边概率相乘得到。'],
    examples: [{ input: 'n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start = 0, end = 2', output: '0.25', explanation: '路径 0→1→2 的概率 0.5×0.5=0.25，大于直达的 0.2。' }],
    intuition: '这是把最短路的“距离相加取最小”改成“概率相乘取最大”；最大堆每次确定当前可达到的最高概率节点。',
    bruteForce: '枚举起终点之间所有简单路径并计算乘积，路径数量可能指数增长。',
    approach: ['建立无向邻接表，保存邻居和边概率。', 'best[v] 记录目前到 v 的最大概率，起点设为 1。', '最大堆弹出当前概率最高的节点，过期状态跳过。', '用 current·edge 松弛邻居，终点首次弹出时返回。'],
    code: `class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start_node: int, end_node: int) -> float:
        import heapq
        graph = [[] for _ in range(n)]
        for (a, b), probability in zip(edges, succProb):
            graph[a].append((b, probability))
            graph[b].append((a, probability))
        best = [0.0] * n
        best[start_node] = 1.0
        heap = [(-1.0, start_node)]
        while heap:
            negative, node = heapq.heappop(heap)
            probability = -negative
            if probability < best[node]:
                continue
            if node == end_node:
                return probability
            for neighbor, edge_probability in graph[node]:
                candidate = probability * edge_probability
                if candidate > best[neighbor]:
                    best[neighbor] = candidate
                    heapq.heappush(heap, (-candidate, neighbor))
        return 0.0`,
    walkthrough: { input: '0-1 概率 0.5，1-2 概率 0.5，0-2 概率 0.2', steps: ['从 0 更新 best[1]=0.5、best[2]=0.2。', '最大堆先弹出节点 1，经它把 best[2] 改进为 0.25。', '节点 2 以概率 0.25 弹出，此时已是全局最优。'], result: '返回 0.25。' },
    complexity: { time: 'O((n+e) log n)，每次有效松弛进行堆操作。', space: 'O(n+e)，保存邻接表、最优概率和堆。' },
    pitfalls: ['路径概率是乘积，不是边概率之和。', 'Python 用负概率模拟最大堆，并要跳过堆中的过期状态。'],
    related: ['Dijkstra', '最大堆', '图最优路径'],
  },
};

import type { Lesson } from './lessons';

export const lessonsBatch9: Record<number, Lesson> = {
  252: { id: 252, title: '会议室', summary: '判断一组会议能否由同一个人全部参加，核心是发现任意两个时间区间是否冲突。', constraints: ['区间满足开始时间小于结束时间，输入可以为空。', '前一场恰好结束于后一场开始时不算重叠。'], examples: [{ input: 'intervals = [[0,30],[5,10],[15,20]]', output: 'false', explanation: '后两场都与第一场的时间范围相交。' }], intuition: '先按开始时刻排序；如果存在冲突，排序后一定能在某对相邻会议间观察到。', bruteForce: '逐对检查全部会议是否重叠，需要 O(n²) 次比较。', approach: ['按开始时间升序排列所有区间。', '从第二个区间开始与前一个区间比较。', '若当前开始早于前一结束则返回 false。', '扫描完成后返回 true。'], code: `class Solution:\n    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:\n        intervals.sort(key=lambda x: x[0])\n        for i in range(1, len(intervals)):\n            if intervals[i][0] < intervals[i - 1][1]:\n                return False\n        return True`, walkthrough: { input: '[[7,10],[2,4],[10,12]]', steps: ['排序得到 [[2,4],[7,10],[10,12]]。', '7 不小于 4，第一对可衔接。', '10 等于前一结束时刻，也不冲突。'], result: '返回 true。' }, complexity: { time: 'O(n log n)，主要成本是排序。', space: 'O(log n)，取决于排序辅助空间。' }, pitfalls: ['把端点相等误判为冲突。', '未排序就只比较输入中的相邻项。'], related: ['253 会议室 II', '区间排序', '扫描线'] },
  253: { id: 253, title: '会议室 II', summary: '求安排全部会议所需的最少房间数，也就是任一时刻同时进行的会议峰值。', constraints: ['每个会议的开始时间严格早于结束时间。', '会议结束时可以立刻把房间交给同一时刻开始的会议。'], examples: [{ input: 'intervals = [[0,30],[5,10],[15,20]]', output: '2', explanation: '最多有两场会议同时进行。' }], intuition: '按开始时间处理会议，用最小堆记录各房间的结束时刻，堆顶代表最早可复用的房间。', bruteForce: '为每场新会议线性搜索可用房间，最坏为 O(n²)。', approach: ['将会议按开始时间排序。', '维护房间结束时间的最小堆。', '若堆顶不晚于当前开始，则弹出并复用。', '压入当前结束时间，最终堆大小就是答案。'], code: `class Solution:\n    def minMeetingRooms(self, intervals: List[List[int]]) -> int:\n        import heapq\n        intervals.sort(key=lambda x: x[0])\n        rooms = []\n        for start, end in intervals:\n            if rooms and rooms[0] <= start:\n                heapq.heappop(rooms)\n            heapq.heappush(rooms, end)\n        return len(rooms)`, walkthrough: { input: '[[0,30],[5,10],[15,20]]', steps: ['[0,30] 占用第一个房间。', '[5,10] 开始时没有房间释放，因此增加一个。', '[15,20] 复用结束于 10 的房间。'], result: '最少需要 2 个房间。' }, complexity: { time: 'O(n log n)，包含排序和堆操作。', space: 'O(n)，最坏所有会议同时存在。' }, pitfalls: ['复用条件应包含结束时刻等于开始时刻。', '堆中应保存结束时间而不是开始时间。'], related: ['252 会议室', '最小堆', '区间问题'] },
  261: { id: 261, title: '以图判树', summary: '判断给定无向图是否为一棵树，即同时满足连通和无环。', constraints: ['节点编号为 0 到 n-1。', '无向树拥有 n 个节点时必须恰有 n-1 条边。'], examples: [{ input: 'n=5, edges=[[0,1],[0,2],[0,3],[1,4]]', output: 'true', explanation: '四条边连通五个节点且没有环。' }], intuition: '先用树的边数性质筛选；在恰有 n-1 条边时，只要所有节点连通就必然无环。', bruteForce: '反复删除每条边并检查两端可达性来找环，代价可达 O(E(V+E))。', approach: ['检查边数是否为 n-1。', '建立双向邻接表。', '从节点 0 遍历并记录已访问节点。', '访问数等于 n 时返回 true。'], code: `class Solution:\n    def validTree(self, n: int, edges: List[List[int]]) -> bool:\n        if len(edges) != n - 1:\n            return False\n        graph = [[] for _ in range(n)]\n        for a, b in edges:\n            graph[a].append(b)\n            graph[b].append(a)\n        seen, stack = {0}, [0]\n        while stack:\n            node = stack.pop()\n            for nei in graph[node]:\n                if nei not in seen:\n                    seen.add(nei)\n                    stack.append(nei)\n        return len(seen) == n`, walkthrough: { input: 'n=4, edges=[[0,1],[1,2],[2,3]]', steps: ['边数 3 等于 n-1。', '从 0 出发可依次到达 1、2、3。', '所有四个节点都被访问。'], result: '返回 true。' }, complexity: { time: 'O(n+E)。', space: 'O(n+E)，用于图和访问状态。' }, pitfalls: ['只检查边数却不检查连通性。', '建立无向图时漏掉反向边。'], related: ['323 连通分量', '并查集', '深度优先搜索'] },
  269: { id: 269, title: '火星词典', summary: '根据一组已经按未知字母表排序的单词，推导任意一种合法字符顺序；矛盾时返回空串。', constraints: ['答案必须包含输入中出现过的全部字符。', '较长单词位于其严格前缀之前时，给定顺序无效。'], examples: [{ input: 'words=["wrt","wrf","er","ett","rftt"]', output: '"wertf"', explanation: '相邻词的首个差异提供字符先后关系。' }], intuition: '相邻单词首个不同字符形成一条有向边，问题随即变为字符图的拓扑排序。', bruteForce: '枚举所有字符排列并逐一验证，最坏达到阶乘级。', approach: ['为每个出现的字符初始化邻接集合和入度。', '比较相邻单词，检查非法前缀并添加首个差异边。', '把入度为零的字符加入队列。', '执行拓扑排序，若未覆盖全部字符则返回空串。'], code: `class Solution:\n    def alienOrder(self, words: List[str]) -> str:\n        from collections import deque\n        graph = {c: set() for w in words for c in w}\n        indegree = {c: 0 for c in graph}\n        for a, b in zip(words, words[1:]):\n            size = min(len(a), len(b))\n            if a[:size] == b[:size] and len(a) > len(b):\n                return ""\n            for x, y in zip(a, b):\n                if x != y:\n                    if y not in graph[x]:\n                        graph[x].add(y)\n                        indegree[y] += 1\n                    break\n        queue = deque(c for c in indegree if indegree[c] == 0)\n        order = []\n        while queue:\n            c = queue.popleft()\n            order.append(c)\n            for nxt in graph[c]:\n                indegree[nxt] -= 1\n                if indegree[nxt] == 0:\n                    queue.append(nxt)\n        return "".join(order) if len(order) == len(indegree) else ""`, walkthrough: { input: '["z","x","z"]', steps: ['前两个词给出 z→x。', '后两个词给出 x→z。', '两个字符形成环，无法完成拓扑排序。'], result: '返回空串。' }, complexity: { time: 'O(C)，C 为输入总字符数。', space: 'O(U+E)，保存字符图。' }, pitfalls: ['忽略非法前缀情况。', '重复边不能重复增加入度。'], related: ['207 课程表', '拓扑排序', '有向图'] },
  271: { id: 271, title: '字符串的编码与解码', summary: '设计一个可逆协议，把字符串列表变为单个字符串，并能精确恢复列表边界和内容。', constraints: ['元素可以是空串，也可以包含任意分隔字符。', '必须区分空列表、一个空串和多个空串。'], examples: [{ input: 'strs=["lint","","co#de"]', output: '["lint","","co#de"]', explanation: '编码后再解码可无损恢复。' }], intuition: '给每段正文增加“长度#”头部，解码器按长度切片，因此正文里的 # 不会造成歧义。', bruteForce: '直接用固定字符拼接，遇到正文包含该字符时无法可靠拆分。', approach: ['把每项编码为长度、# 和原文。', '解码时寻找当前长度头后的 #。', '解析长度并读取精确数量的字符。', '移动指针直到编码串末尾。'], code: `class Codec:\n    def encode(self, strs: List[str]) -> str:\n        return "".join(str(len(s)) + "#" + s for s in strs)\n\n    def decode(self, s: str) -> List[str]:\n        ans, i = [], 0\n        while i < len(s):\n            j = s.find("#", i)\n            size = int(s[i:j])\n            start = j + 1\n            ans.append(s[start:start + size])\n            i = start + size\n        return ans`, walkthrough: { input: '["a#b",""]', steps: ['第一项编码为 3#a#b。', '空串编码为 0#。', '解码器依次读取长度 3 和 0 后切片。'], result: '恢复 ["a#b",""]。' }, complexity: { time: 'O(T)，T 为编码数据总长度。', space: 'O(T)，用于结果。' }, pitfalls: ['不能仅依赖不会出现的特殊分隔符。', '长度为零的元素也必须写入头部。'], related: ['序列化', '字符串解析', '长度前缀协议'] },
  278: { id: 278, title: '第一个错误的版本', summary: '在版本状态从正常单调变为错误的序列中，调用接口定位最早的错误版本。', constraints: ['版本编号范围是 1 到 n。', '至少有一个错误版本，且错误状态具有单调性。'], examples: [{ input: 'n=5, bad=4', output: '4', explanation: '4 和 5 错误，而 3 正常。' }], intuition: '这是寻找单调布尔序列中第一个 true 的边界二分。', bruteForce: '从版本 1 开始逐个查询，最坏调用 n 次接口。', approach: ['初始化闭区间 [1,n]。', '查询区间中点。', '中点错误时保留中点并收缩右边界。', '中点正常时令左边界越过它，最终返回重合位置。'], code: `# isBadVersion is provided.\nclass Solution:\n    def firstBadVersion(self, n: int) -> int:\n        left, right = 1, n\n        while left < right:\n            mid = left + (right - left) // 2\n            if isBadVersion(mid):\n                right = mid\n            else:\n                left = mid + 1\n        return left`, walkthrough: { input: 'n=5, bad=4', steps: ['检查 3，结果正常，左界移到 4。', '检查 4，结果错误，右界移到 4。', '左右边界在 4 重合。'], result: '返回 4。' }, complexity: { time: 'O(log n)。', space: 'O(1)。' }, pitfalls: ['错误时写 right=mid-1 会跳过答案。', '版本编号不是从 0 开始。'], related: ['374 猜数字大小', '二分边界', '单调谓词'] },
  280: { id: 280, title: '摆动排序', summary: '原地重排数组，使相邻关系按小于等于、大于等于交替出现。', constraints: ['不等式允许相等。', '需要直接修改输入，任意合法排列都可接受。'], examples: [{ input: 'nums=[3,5,2,1,6,4]', output: '[3,5,1,6,2,4]', explanation: '结果满足 <=、>= 交替关系。' }], intuition: '扫描时只修复当前位置与前一位置的关系；相邻交换不会破坏更早已经成立的关系。', bruteForce: '先排序再按对交换可行，但需要 O(n log n)。', approach: ['从下标 1 开始遍历。', '奇数下标应不小于前一项。', '偶数下标应不大于前一项。', '违反对应关系时交换相邻元素。'], code: `class Solution:\n    def wiggleSort(self, nums: List[int]) -> None:\n        for i in range(1, len(nums)):\n            if (i % 2 == 1 and nums[i] < nums[i - 1]) or (i % 2 == 0 and nums[i] > nums[i - 1]):\n                nums[i], nums[i - 1] = nums[i - 1], nums[i]`, walkthrough: { input: '[3,5,2,1]', steps: ['3<=5，首对无需调整。', '5>=2，第二个关系也成立。', '位置 3 应为峰值，交换 2 和 1。'], result: '得到 [3,5,1,2]。' }, complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['误以为必须满足严格不等式。', '把奇数位和偶数位的方向写反。'], related: ['324 摆动排序 II', '贪心', '原地数组'] },
  286: { id: 286, title: '墙与门', summary: '把每个空房间更新为它到最近大门的最短距离，墙壁不可穿过。', constraints: ['-1 表示墙、0 表示门、2147483647 表示空房间。', '只能上下左右移动，并要求原地更新网格。'], examples: [{ input: 'rooms=[[INF,-1,0],[INF,INF,INF]]', output: '写入各空房到门的距离', explanation: '每格采用最近大门的最短步数。' }], intuition: '把所有门同时加入 BFS，波纹第一次到达空房时就是该房间的最短距离。', bruteForce: '从每个空房间分别搜索最近门，最坏需要 O((mn)²)。', approach: ['收集全部门作为初始队列。', '依次弹出位置并考察四邻格。', '仅更新仍为 INF 的空房间。', '把新更新的房间入队继续扩散。'], code: `class Solution:\n    def wallsAndGates(self, rooms: List[List[int]]) -> None:\n        from collections import deque\n        if not rooms:\n            return\n        rows, cols = len(rooms), len(rooms[0])\n        q = deque((r, c) for r in range(rows) for c in range(cols) if rooms[r][c] == 0)\n        directions = ((1, 0), (-1, 0), (0, 1), (0, -1))\n        while q:\n            r, c = q.popleft()\n            for dr, dc in directions:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == 2147483647:\n                    rooms[nr][nc] = rooms[r][c] + 1\n                    q.append((nr, nc))`, walkthrough: { input: '[[INF,0],[INF,INF]]', steps: ['将门 (0,1) 放入队列。', '第一层把 (0,0)、(1,1) 写为 1。', '下一层首次到达 (1,0)，写为 2。'], result: '网格变为 [[1,0],[2,1]]。' }, complexity: { time: 'O(mn)。', space: 'O(mn)，用于 BFS 队列。' }, pitfalls: ['从每扇门单独搜索会重复工作。', '不能覆盖墙、门或已获得距离的格子。'], related: ['542 01 矩阵', '多源 BFS', '994 腐烂的橘子'] },
  307: { id: 307, title: '区域和检索 - 数组可修改', summary: '设计支持单点赋值和闭区间求和的数据结构，使两类操作都达到对数复杂度。', constraints: ['update 会把指定下标改为新值。', '更新和查询会频繁交错，不能每次重建全部前缀和。'], examples: [{ input: 'NumArray([1,3,5]); update(1,2); sumRange(0,2)', output: '8', explanation: '修改后数组为 [1,2,5]。' }], intuition: '树状数组按 lowbit 管理分段前缀和，单点增量和前缀查询都只访问对数个节点。', bruteForce: '普通数组可常数更新但查询为 O(n)；普通前缀和查询快但更新为 O(n)。', approach: ['保存原数组及 1 下标树状数组。', '更新时计算新旧值之差。', '沿 i+=lowbit(i) 写入差值。', '用两个前缀和之差回答区间查询。'], code: `class NumArray:\n    def __init__(self, nums: List[int]):\n        self.nums = nums[:]\n        self.tree = [0] * (len(nums) + 1)\n        for i, x in enumerate(nums):\n            self._add(i + 1, x)\n    def _add(self, i, delta):\n        while i < len(self.tree):\n            self.tree[i] += delta\n            i += i & -i\n    def update(self, index: int, val: int) -> None:\n        delta = val - self.nums[index]\n        self.nums[index] = val\n        self._add(index + 1, delta)\n    def _prefix(self, i):\n        total = 0\n        while i:\n            total += self.tree[i]\n            i -= i & -i\n        return total\n    def sumRange(self, left: int, right: int) -> int:\n        return self._prefix(right + 1) - self._prefix(left)`, walkthrough: { input: '[1,3,5]，update(1,2)', steps: ['初始化树状数组的分段和。', '新旧差值为 -1，沿相关节点累加。', '查询 prefix(3)-prefix(0)。'], result: '区间和为 8。' }, complexity: { time: '初始化 O(n log n)，单次更新或查询 O(log n)。', space: 'O(n)。' }, pitfalls: ['内部下标必须从 1 开始。', '更新树时加入差值而不是新值本身。'], related: ['树状数组', '线段树', '前缀和'] },
  310: { id: 310, title: '最小高度树', summary: '找出无向树中作为根时高度最小的全部节点，它们就是树的中心。', constraints: ['输入是一棵连通无环树。', '单节点树的唯一节点就是答案。'], examples: [{ input: 'n=4, edges=[[1,0],[1,2],[1,3]]', output: '[1]', explanation: '以 1 为根时树高最低。' }], intuition: '同步剥离最外层叶子，相当于从树的边缘向直径中点收缩，最后只剩一个或两个中心。', bruteForce: '以每个节点为根分别遍历求高度，需要 O(n²)。', approach: ['建立邻接集合并找出所有叶子。', '在剩余节点超过两个时按层删除叶子。', '邻居度数降为一时加入下一层。', '返回最后一层的一个或两个节点。'], code: `class Solution:\n    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:\n        if n <= 2:\n            return list(range(n))\n        graph = [set() for _ in range(n)]\n        for a, b in edges:\n            graph[a].add(b); graph[b].add(a)\n        leaves = [i for i in range(n) if len(graph[i]) == 1]\n        remain = n\n        while remain > 2:\n            remain -= len(leaves)\n            nxt = []\n            for leaf in leaves:\n                nei = graph[leaf].pop()\n                graph[nei].remove(leaf)\n                if len(graph[nei]) == 1:\n                    nxt.append(nei)\n            leaves = nxt\n        return leaves`, walkthrough: { input: 'n=6, edges=[[0,3],[1,3],[2,3],[4,3],[4,5]]', steps: ['初始叶子为 0、1、2、5。', '剥离这一层后只剩 3 和 4。', '剩余节点不超过两个，停止。'], result: '返回 [3,4]。' }, complexity: { time: 'O(n)。', space: 'O(n)。' }, pitfalls: ['单节点树没有度数为一的节点，要单独处理。', '必须整层删除后再判断剩余数量。'], related: ['树的直径', '拓扑剥叶', '图的中心'] },
  313: { id: 313, title: '超级丑数', summary: '求只由给定质数作为质因子的第 n 个正整数，并规定 1 是第一项。', constraints: ['n 为正整数，primes 中质数互不相同。', '生成序列必须严格递增并去除重复候选。'], examples: [{ input: 'n=12, primes=[2,7,13,19]', output: '32', explanation: '按序生成后第十二项为 32。' }], intuition: '每个质数维护一个指针，下一项取所有“质数×当前指向丑数”候选的最小值。', bruteForce: '逐个整数分解质因数，会检查大量不可能成为答案的数。', approach: ['以 1 初始化结果序列。', '为每个质数维护指针和候选乘积。', '选择最小候选作为下一项。', '推进所有命中该最小值的指针以去重。'], code: `class Solution:\n    def nthSuperUglyNumber(self, n: int, primes: List[int]) -> int:\n        ugly = [1] * n\n        index = [0] * len(primes)\n        values = primes[:]\n        for i in range(1, n):\n            ugly[i] = min(values)\n            for j, p in enumerate(primes):\n                if values[j] == ugly[i]:\n                    index[j] += 1\n                    values[j] = p * ugly[index[j]]\n        return ugly[-1]`, walkthrough: { input: 'n=5, primes=[2,3]', steps: ['初始候选是 2 和 3。', '依次选择 2、3、4，并推进命中的指针。', '候选 6 由两个质数产生时同时推进。'], result: '第五项为 6。' }, complexity: { time: 'O(nk)，k 为质数数量。', space: 'O(n+k)。' }, pitfalls: ['相同最小候选对应的指针都要推进。', '忘记把 1 计为第一项会造成偏移。'], related: ['264 丑数 II', '多指针', '动态规划'] },
  318: { id: 318, title: '最大单词长度乘积', summary: '选出两个没有公共字母的单词，使它们的长度乘积尽可能大。', constraints: ['单词只含小写英文字母。', '一个字母在单词内重复出现不改变共享关系。'], examples: [{ input: 'words=["abcw","baz","foo","bar","xtfn","abcdef"]', output: '16', explanation: 'abcw 和 xtfn 没有公共字母。' }], intuition: '用 26 位掩码表示字母集合；两个掩码按位与为零就代表单词不共享字符。', bruteForce: '逐对构造字符集合求交，需要 O(n²L)。', approach: ['为每个单词构造位掩码。', '相同掩码只保留最大长度。', '枚举不同掩码对。', '按位与为零时更新长度乘积。'], code: `class Solution:\n    def maxProduct(self, words: List[str]) -> int:\n        best = {}\n        for word in words:\n            mask = 0\n            for ch in word:\n                mask |= 1 << (ord(ch) - 97)\n            best[mask] = max(best.get(mask, 0), len(word))\n        items = list(best.items())\n        ans = 0\n        for i, (a, x) in enumerate(items):\n            for b, y in items[i + 1:]:\n                if a & b == 0:\n                    ans = max(ans, x * y)\n        return ans`, walkthrough: { input: '["ab","cd","aef"]', steps: ['分别生成三个字母掩码。', 'ab 与 cd 的掩码按位与为零。', '其余可行乘积不超过 4。'], result: '返回 4。' }, complexity: { time: 'O(S+u²)，S 为总字符数，u 为不同掩码数。', space: 'O(u)。' }, pitfalls: ['判断无交集应检查按位与等于零。', '相同掩码无需保存较短单词。'], related: ['位掩码', '集合判交', '状态压缩'] },
  323: {
    id: 323, title: '无向图中连通分量的数目', summary: '统计无向图中互相不可达的连通块数量，孤立节点也单独构成一个分量。',
    constraints: ['节点编号为 0 到 n-1，n 可以为正整数。', '边是无向的，图可以不连通，也可以没有任何边。'],
    examples: [{ input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2', explanation: '节点 0、1、2 属于一块，节点 3、4 属于另一块。' }],
    intuition: '并查集起初把每个节点视作一个分量；每当一条边连接了两个不同根，就合并它们并把分量数减一。',
    bruteForce: '为每个尚未访问的节点启动一次 DFS 也能得到答案，但若用矩阵反复判断可达性会达到 O(n³)。',
    approach: ['初始化 parent、size，并令分量数为 n。', '对每条边查找两个端点的根。', '根不同则按集合大小合并，并把计数减一。', '处理完全部边后返回剩余分量数。'],
    code: `class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))
        size = [1] * n

        def find(x):
            while x != parent[x]:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        count = n
        for a, b in edges:
            ra, rb = find(a), find(b)
            if ra == rb:
                continue
            if size[ra] < size[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            size[ra] += size[rb]
            count -= 1
        return count`,
    walkthrough: { input: 'n=5, edges=[[0,1],[1,2],[3,4]]', steps: ['开始时有 5 个单节点分量。', '合并 0 与 1 后剩 4 个，再合并 1 与 2 后剩 3 个。', '合并 3 与 4 后剩 2 个，且两组之间没有边。'], result: '返回 2。' },
    complexity: { time: 'O((n+E)α(n))，路径压缩与按大小合并近似常数。', space: 'O(n)，保存并查集数组。' },
    pitfalls: ['重复连接同一集合时不能再次减少计数。', '孤立节点未出现在边中，但仍必须计入分量。'], related: ['261 以图判树', '并查集', '深度优先搜索'],
  },
  325: {
    id: 325, title: '和等于 k 的最长子数组长度', summary: '在含正负数的数组中寻找总和恰为 k 的最长连续子数组，并返回其长度。',
    constraints: ['数组元素和 k 都可能为负数、零或正数。', '答案要求连续区间；不存在时返回 0。'],
    examples: [{ input: 'nums = [1,-1,5,-2,3], k = 3', output: '4', explanation: '子数组 [1,-1,5,-2] 的和为 3，长度为 4。' }],
    intuition: '若当前位置前缀和为 S，要让某段和为 k，就需要更早出现前缀和 S-k；保留每种前缀和最早下标可得到最长距离。',
    bruteForce: '枚举每个起点并向右累加检查，最坏 O(n²) 时间。',
    approach: ['以前缀和 0 出现在下标 -1 初始化哈希表。', '从左到右累加当前前缀和 prefix。', '若 prefix-k 已出现，用当前下标减最早下标更新答案。', '只在 prefix 首次出现时记录它，保证未来区间最长。'],
    code: `class Solution:
    def maxSubArrayLen(self, nums: List[int], k: int) -> int:
        first = {0: -1}
        prefix = 0
        best = 0
        for i, value in enumerate(nums):
            prefix += value
            if prefix - k in first:
                best = max(best, i - first[prefix - k])
            if prefix not in first:
                first[prefix] = i
        return best`,
    walkthrough: { input: 'nums=[1,-1,5,-2,3], k=3', steps: ['前缀和 0 预先对应下标 -1。', '扫描到下标 3 时前缀和为 3，需要的前缀和 0 已在 -1。', '区间长度为 3-(-1)=4，后续没有更长候选。'], result: '返回 4。' },
    complexity: { time: 'O(n)，每个位置进行常数次哈希操作。', space: 'O(n)，保存不同前缀和的最早位置。' },
    pitfalls: ['必须保留最早下标，覆盖它会使答案变短。', '含负数时滑动窗口不具单调性，不能套用双指针。'], related: ['560 和为 K 的子数组', '前缀和', '哈希表'],
  },
  328: {
    id: 328, title: '奇偶链表', summary: '按节点原始位置的奇偶性重排单链表：所有奇数位节点在前，偶数位节点在后，并保持各组内部顺序。',
    constraints: ['这里的奇偶指从 1 开始的位置，不是节点值。', '要求原地重连节点，额外空间应为常数级。'],
    examples: [{ input: 'head = [1,2,3,4,5]', output: '[1,3,5,2,4]', explanation: '原位置 1、3、5 的节点先出现，随后是位置 2、4。' }],
    intuition: '分别维护奇数链尾和偶数链尾，交替越过一个节点重连；最后把奇数链尾接回最初的偶数链头。',
    bruteForce: '把所有节点放入数组，再按奇偶下标重建链表，需要 O(n) 额外空间。',
    approach: ['空链表或单节点直接返回。', '保存 odd=head、even=head.next 和偶数链头。', '只要 even 及其后继存在，就分别推进奇链和偶链。', '循环结束后把 odd.next 指向偶数链头。'],
    code: `class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        odd = head
        even = head.next
        even_head = even
        while even and even.next:
            odd.next = even.next
            odd = odd.next
            even.next = odd.next
            even = even.next
        odd.next = even_head
        return head`,
    walkthrough: { input: 'head=[1,2,3,4,5]', steps: ['odd 指向 1，even 指向 2，并保存偶链头 2。', '第一次重连得到奇链 1→3、偶链 2→4。', '第二次把 5 接到奇链末尾，随后把奇链末尾接到 2。'], result: '链表变为 [1,3,5,2,4]。' },
    complexity: { time: 'O(n)，每个节点只被重连一次。', space: 'O(1)，只使用若干指针。' },
    pitfalls: ['不要按节点值的奇偶分类。', '必须保存 even_head，否则最后找不到偶数链起点。'], related: ['链表重排', '双指针', '206 反转链表'],
  },
  330: {
    id: 330, title: '按要求补齐数组', summary: '向升序正整数数组补入尽量少的数字，使区间 [1,n] 内每个整数都能表示为某个子序列之和。',
    constraints: ['nums 已按升序排列且元素为正整数。', '每个数组元素在一次子序列求和中最多使用一次。'],
    examples: [{ input: 'nums = [1,3], n = 6', output: '1', explanation: '补入 2 后，可以组合得到 1 到 6 的所有整数。' }],
    intuition: '若当前已能覆盖 [1,miss)，下一项不大于 miss 时可把覆盖扩到 miss+value；若下一项大于 miss，只有补入 miss 才能填上首个缺口并最大化扩张。',
    bruteForce: '枚举补入数字的组合并验证所有子集和，搜索空间随 n 指数增长。',
    approach: ['令 miss=1，表示当前最小不可表示正数。', '若数组下一项 value<=miss，就消费它并令 miss+=value。', '否则补入 miss，自身与已有覆盖组合后令 miss*=2。', '当 miss>n 时停止并返回补丁数量。'],
    code: `class Solution:
    def minPatches(self, nums: List[int], n: int) -> int:
        miss = 1
        i = 0
        patches = 0
        while miss <= n:
            if i < len(nums) and nums[i] <= miss:
                miss += nums[i]
                i += 1
            else:
                miss += miss
                patches += 1
        return patches`,
    walkthrough: { input: 'nums=[1,3], n=6', steps: ['开始可覆盖空区间 [1,1)，消费 1 后覆盖 [1,2)。', '下一项 3 大于缺口 2，因此补入 2，覆盖扩为 [1,4)。', '消费 3 后覆盖扩为 [1,7)，已经越过 6。'], result: '只需补入 1 个数。' },
    complexity: { time: 'O(m+log n)，m 为被扫描的原数组长度。', space: 'O(1)。' },
    pitfalls: ['补丁必须选当前 miss，选更大的数仍无法表示 miss。', '覆盖区间使用左闭右开 [1,miss)，停止条件是 miss>n。'], related: ['贪心覆盖', '子集和', '45 跳跃游戏 II'],
  },
  334: {
    id: 334, title: '递增的三元子序列', summary: '判断数组中是否存在三个下标递增且数值严格递增的元素，不要求它们连续。',
    constraints: ['子序列保持原下标顺序，但元素可以不相邻。', '要求严格递增，相等值不能充当下一层。'],
    examples: [{ input: 'nums = [2,1,5,0,4,6]', output: 'true', explanation: '可以选择 0、4、6，且它们的下标依次增大。' }],
    intuition: '维护目前最小的第一项 first，以及在它之后能得到的最小第二项 second；出现比 second 大的值时，三元组已经成立。',
    bruteForce: '枚举三个下标并比较，时间复杂度 O(n³)。',
    approach: ['初始化 first 和 second 为正无穷。', '值不大于 first 时更新更小的第一项。', '否则值不大于 second 时更新更小的第二项。', '若值同时大于 first 和 second，立即返回 true；扫描完则返回 false。'],
    code: `class Solution:
    def increasingTriplet(self, nums: List[int]) -> bool:
        first = float('inf')
        second = float('inf')
        for value in nums:
            if value <= first:
                first = value
            elif value <= second:
                second = value
            else:
                return True
        return False`,
    walkthrough: { input: 'nums=[2,1,5,0,4,6]', steps: ['2 后 first=2，读到 1 后 first 降为 1。', '读到 5 后 second=5；0 又把 first 降为 0，随后 4 把 second 降为 4。', '6 大于 second=4，因此此前存在更小的 first 和 second。'], result: '返回 true。' },
    complexity: { time: 'O(n)，只扫描一遍。', space: 'O(1)。' },
    pitfalls: ['比较必须允许相等值更新阈值，否则会误判严格递增。', 'first 后来变小不破坏已有 second 所代表的有效二元序列。'], related: ['300 最长递增子序列', '贪心', '子序列'],
  },
  344: {
    id: 344, title: '反转字符串', summary: '将字符数组原地反转，不创建另一份等长数组。',
    constraints: ['输入以可修改的字符数组给出。', '要求原地修改，额外空间为 O(1)。'],
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '首尾字符成对交换后顺序完全倒置。' }],
    intuition: '反转后下标 i 与 n-1-i 的字符互换，因此让两个指针从两端向中间收拢即可。',
    bruteForce: '创建逆序副本再写回输入，虽为 O(n) 时间，但使用 O(n) 额外空间。',
    approach: ['设置 left=0、right=len(s)-1。', '当 left<right 时交换两端字符。', 'left 加一、right 减一继续收拢。', '指针相遇或交错时完成原地反转。'],
    code: `class Solution:
    def reverseString(self, s: List[str]) -> None:
        left, right = 0, len(s) - 1
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1`,
    walkthrough: { input: 's=["h","e","l","l","o"]', steps: ['交换下标 0 和 4，得到 ["o","e","l","l","h"]。', '交换下标 1 和 3，得到 ["o","l","l","e","h"]。', '两个指针在中间字符相遇，不必再交换。'], result: '输入数组被改为 ["o","l","l","e","h"]。' },
    complexity: { time: 'O(n)，执行约 n/2 次交换。', space: 'O(1)。' },
    pitfalls: ['题目要求修改原数组，而不是返回新字符串。', '循环条件用 left<right，避免中心字符做无意义交换。'], related: ['双指针', '541 反转字符串 II', '345 反转字符串中的元音字母'],
  },
  350: {
    id: 350, title: '两个数组的交集 II', summary: '返回两个数组的多重集合交集，同一数值在结果中的次数取两边出现次数的较小值。',
    constraints: ['数组可以包含重复整数，结果顺序不限。', '每个元素最多按它在两个数组中共同拥有的次数输出。'],
    examples: [{ input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2,2]', explanation: '数字 2 在两个数组中至少都出现了两次。' }],
    intuition: '统计较短数组的元素库存，再扫描另一个数组；遇到库存为正的值就加入结果并扣减一次。',
    bruteForce: '对第一个数组的每个元素在线性列表中查找并删除匹配项，最坏 O(mn)。',
    approach: ['让 nums1 指向较短数组以减少哈希空间。', '统计 nums1 中每个值的可用次数。', '扫描 nums2，库存大于零时把该值加入答案。', '每次匹配后将对应库存减一，最后返回结果。'],
    code: `class Solution:
    def intersect(self, nums1: List[int], nums2: List[int]) -> List[int]:
        from collections import Counter
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        count = Counter(nums1)
        answer = []
        for value in nums2:
            if count[value] > 0:
                answer.append(value)
                count[value] -= 1
        return answer`,
    walkthrough: { input: 'nums1=[4,9,5,4], nums2=[9,4,9,8,4]', steps: ['计数 nums1 得到 4 有 2 次、9 和 5 各 1 次。', '扫描 nums2 时匹配 9 后其库存归零，第二个 9 被跳过。', '两个 4 分别消费库存并加入答案。'], result: '可返回 [9,4,4]。' },
    complexity: { time: 'O(m+n)，分别计数和扫描。', space: 'O(min(m,n))，统计较短数组。' },
    pitfalls: ['不能用普通集合，否则会丢失重复次数。', '成功匹配后必须扣减库存。'], related: ['349 两个数组的交集', '哈希计数', '双指针排序解法'],
  },
  354: {
    id: 354, title: '俄罗斯套娃信封问题', summary: '选择尽可能多的信封组成嵌套链，每一步的宽和高都必须严格增大。',
    constraints: ['旋转信封不被允许。', '宽或高相等的两个信封不能互相嵌套。'],
    examples: [{ input: 'envelopes = [[5,4],[6,4],[6,7],[2,3]]', output: '3', explanation: '可以依次选择 [2,3]、[5,4]、[6,7]。' }],
    intuition: '宽升序后问题可化为高度的最长严格递增子序列；同宽时把高度降序排列，可阻止同宽信封被 LIS 错误连续选中。',
    bruteForce: '把每个信封作为状态做 O(n²) 动态规划，检查所有前驱。',
    approach: ['按宽升序、同宽高度降序排序。', '维护 tails，tails[i] 是长度 i+1 的递增链最小末尾高度。', '对每个高度用 bisect_left 找到第一个不小于它的位置。', '替换该位置或追加到末尾，最终 tails 长度即答案。'],
    code: `class Solution:
    def maxEnvelopes(self, envelopes: List[List[int]]) -> int:
        from bisect import bisect_left
        envelopes.sort(key=lambda item: (item[0], -item[1]))
        tails = []
        for _, height in envelopes:
            i = bisect_left(tails, height)
            if i == len(tails):
                tails.append(height)
            else:
                tails[i] = height
        return len(tails)`,
    walkthrough: { input: '[[5,4],[6,4],[6,7],[2,3]]', steps: ['排序得到 [[2,3],[5,4],[6,7],[6,4]]。', '高度 3、4、7 依次追加，tails 变为 [3,4,7]。', '同宽的高度 4 只能替换已有位置，不能把长度扩为 4。'], result: '最长嵌套链长度为 3。' },
    complexity: { time: 'O(n log n)，排序及每个高度二分。', space: 'O(n)，保存 tails。' },
    pitfalls: ['同宽高度必须降序，否则可能被当成可嵌套。', '严格递增 LIS 使用 bisect_left，而不是 bisect_right。'], related: ['300 最长递增子序列', '排序', '二分查找'],
  },
  355: {
    id: 355, title: '设计推特', summary: '实现发帖、关注、取关与获取最近十条动态；动态流只包含自己和当前关注用户的帖子，并按新到旧排列。',
    constraints: ['每次发帖分配全局递增时间，tweetId 本身不代表时间。', '新闻流最多返回 10 条，关注关系可动态变化。'],
    examples: [{ input: 'postTweet(1,5); getNewsFeed(1); follow(1,2); postTweet(2,6); getNewsFeed(1)', output: '[5]，随后 [6,5]', explanation: '关注用户 2 后，他更新的帖子会进入用户 1 的动态流。' }],
    intuition: '每个用户的帖子天然按时间递增保存；读取动态时把每条个人时间线视为一个有序序列，用堆做多路归并，只取前十项。',
    bruteForce: '每次获取动态都收集所有相关用户的全部历史帖子并整体排序，历史越长成本越高。',
    approach: ['用集合保存关注者，用列表保存各用户的 (时间,帖子) 序列。', '发帖时递增全局时钟并追加到个人序列。', '获取动态时把自己与关注者各自最新帖子压入最大时间堆。', '每弹出一帖就补入同一用户更早一帖，直到得到 10 条或堆为空。', '关注和取关直接更新集合，忽略自我关注操作。'],
    code: `class Twitter:
    def __init__(self):
        from collections import defaultdict
        self.time = 0
        self.tweets = defaultdict(list)
        self.following = defaultdict(set)

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.time += 1
        self.tweets[userId].append((self.time, tweetId))

    def getNewsFeed(self, userId: int) -> List[int]:
        import heapq
        heap = []
        users = self.following[userId] | {userId}
        for user in users:
            if self.tweets[user]:
                i = len(self.tweets[user]) - 1
                time, tweet = self.tweets[user][i]
                heapq.heappush(heap, (-time, tweet, user, i))
        feed = []
        while heap and len(feed) < 10:
            _, tweet, user, i = heapq.heappop(heap)
            feed.append(tweet)
            if i > 0:
                time, previous = self.tweets[user][i - 1]
                heapq.heappush(heap, (-time, previous, user, i - 1))
        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        if followerId != followeeId:
            self.following[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].discard(followeeId)`,
    walkthrough: { input: '用户 1 发 5，关注用户 2；用户 2 发 6', steps: ['帖子 5 和 6 分别写入两个用户的时间线，6 的时间更晚。', '查询用户 1 时，把用户 1 和用户 2 的最新帖子都放入堆。', '先弹出帖子 6，再弹出帖子 5，堆随后为空。'], result: '动态流返回 [6,5]。' },
    complexity: { time: '发帖/关注/取关平均 O(1)；取流 O((F+10)log F)，F 为相关且有帖用户数。', space: 'O(P+R)，P 为帖子总数，R 为关注关系数。' },
    pitfalls: ['不能按 tweetId 排序，必须维护独立时间戳。', '用户自己的帖子始终要纳入动态，无需真的关注自己。'], related: ['堆', '多路归并', '设计数据结构'],
  },
  367: {
    id: 367, title: '有效的完全平方数', summary: '不使用内置开方函数，判断正整数是否等于某个整数的平方。',
    constraints: ['输入为正整数。', '结果要求精确整数判断，不能依赖可能有误差的浮点近似。'],
    examples: [{ input: 'num = 16', output: 'true', explanation: '4×4 等于 16。' }],
    intuition: '平方函数在非负整数上严格递增，因此可在可能的平方根范围内二分查找。',
    bruteForce: '从 1 起逐个平方，直到等于或超过 num，最坏需要 O(√num) 次。',
    approach: ['在闭区间 [1,num] 中搜索整数平方根。', '计算中点及 square=mid*mid。', '平方相等立即返回 true；偏小则移动左界，偏大则移动右界。', '区间耗尽仍未命中时返回 false。'],
    code: `class Solution:
    def isPerfectSquare(self, num: int) -> bool:
        left, right = 1, num
        while left <= right:
            mid = left + (right - left) // 2
            square = mid * mid
            if square == num:
                return True
            if square < num:
                left = mid + 1
            else:
                right = mid - 1
        return False`,
    walkthrough: { input: 'num=16', steps: ['搜索 [1,16]，中点 8 的平方 64 过大，右界降到 7。', '中点 4 的平方恰为 16。', '命中整数平方根，无需继续收缩。'], result: '返回 true。' },
    complexity: { time: 'O(log num)。', space: 'O(1)。' },
    pitfalls: ['固定宽度语言计算 mid*mid 时要防止溢出。', '浮点 sqrt 对大整数可能产生精度边界问题。'], related: ['69 x 的平方根', '二分查找', '牛顿迭代'],
  },
  368: {
    id: 368, title: '最大整除子集', summary: '从互不相同的正整数中选出最大子集，使任意两个元素中较小者都能整除较大者。',
    constraints: ['所有元素均为互不相同的正整数。', '答案可以按任意顺序返回，存在多个最大解时返回任意一个。'],
    examples: [{ input: 'nums = [1,2,4,8]', output: '[1,2,4,8]', explanation: '链中每个较小元素都整除后面的较大元素。' }],
    intuition: '排序后，若 x 整除 y 且已有一条以 x 结尾的整除链，就可把 y 接在链尾；传递性保证链内任意两项都满足条件。',
    bruteForce: '枚举所有子集并逐对检查整除关系，需要指数时间。',
    approach: ['将数组升序排序。', '令 dp[i] 表示以 nums[i] 结尾的最长链长度，parent 记录前驱。', '枚举 j<i，若 nums[i] 能被 nums[j] 整除则尝试转移。', '从最大 dp 对应下标沿 parent 回溯并反转得到答案。'],
    code: `class Solution:
    def largestDivisibleSubset(self, nums: List[int]) -> List[int]:
        if not nums:
            return []
        nums.sort()
        n = len(nums)
        dp = [1] * n
        parent = [-1] * n
        best = 0
        for i in range(n):
            for j in range(i):
                if nums[i] % nums[j] == 0 and dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    parent[i] = j
            if dp[i] > dp[best]:
                best = i
        answer = []
        while best != -1:
            answer.append(nums[best])
            best = parent[best]
        return answer[::-1]`,
    walkthrough: { input: 'nums=[1,2,3,6]', steps: ['排序后依次建立以各元素结尾的最长整除链。', '2 和 3 都可接在 1 后；处理 6 时可接在 2 或 3 后。', '最大 dp 为 3，沿前驱可回溯得到 1、2、6。'], result: '可返回 [1,2,6]。' },
    complexity: { time: 'O(n²)，枚举每对有序前驱。', space: 'O(n)，保存长度和前驱。' },
    pitfalls: ['必须先排序，才能把两两条件转成可传递的链。', '只保存 dp 长度无法恢复具体子集，还需 parent。'], related: ['300 最长递增子序列', '动态规划', '整除关系'],
  },
  374: {
    id: 374, title: '猜数字大小', summary: '通过只能返回偏大、偏小或命中的接口，在 1 到 n 中定位唯一隐藏整数。',
    constraints: ['隐藏数位于闭区间 [1,n]。', 'guess(x) 返回 -1 表示 x 偏大，1 表示 x 偏小，0 表示命中。'],
    examples: [{ input: 'n = 10, pick = 6', output: '6', explanation: '根据接口反馈逐步缩小范围，最终命中 6。' }],
    intuition: '接口反馈直接指出答案位于中点左侧还是右侧，搜索区间每次可减半。',
    bruteForce: '从 1 到 n 依次调用 guess，最坏需要 n 次。',
    approach: ['初始化闭区间 left=1、right=n。', '取不会溢出的中点 mid 并调用 guess(mid)。', '返回 0 时直接返回 mid；偏大则缩右界，偏小则升左界。', '循环持续到命中唯一答案。'],
    code: `# guess is provided by the judge.
class Solution:
    def guessNumber(self, n: int) -> int:
        left, right = 1, n
        while left <= right:
            mid = left + (right - left) // 2
            result = guess(mid)
            if result == 0:
                return mid
            if result < 0:
                right = mid - 1
            else:
                left = mid + 1`,
    walkthrough: { input: 'n=10, pick=6', steps: ['先猜 5，接口返回 1，说明答案更大，左界移到 6。', '再猜 8，接口返回 -1，说明答案更小，右界移到 7。', '猜 6 时接口返回 0。'], result: '返回 6。' },
    complexity: { time: 'O(log n)，接口调用次数随区间折半。', space: 'O(1)。' },
    pitfalls: ['要按题目定义解释 -1 与 1，方向写反会丢失答案。', '搜索范围从 1 开始，不包含 0。'], related: ['278 第一个错误的版本', '二分查找', '单调反馈'],
  },
  381: {
    id: 381, title: 'O(1) 时间插入、删除和获取随机元素 - 允许重复', summary: '设计允许重复值的集合，支持平均常数时间插入、删除一个实例，并让随机返回按实例等概率。',
    constraints: ['insert 在该值此前不存在时返回 true，否则仍插入但返回 false。', 'remove 只删除一个实例；getRandom 在非空结构上调用，重复实例应提高被选概率。'],
    examples: [{ input: 'insert(1); insert(1); insert(2); remove(1); getRandom()', output: 'true,false,true,true；随机为 1 或 2', explanation: '删除一个 1 后数组中剩一个 1 和一个 2，两者概率相同。' }],
    intuition: '动态数组提供 O(1) 随机取样；哈希表把每个值映射到它在数组中的全部下标。删除中间项时用末尾项覆盖空位，再同步修正下标集合。',
    bruteForce: '只用数组时插入和随机简单，但删除指定值要线性搜索；只用计数字典又无法按实例 O(1) 等概率抽样。',
    approach: ['用 values 保存所有实例，用 positions[value] 保存其下标集合。', '插入时记录新下标并追加值。', '删除时任选目标下标，用数组末项覆盖它并更新末项的下标集合。', '弹出数组末尾，清理空集合；随机时从 values 等概率选择一个位置。'],
    code: `class RandomizedCollection:
    def __init__(self):
        from collections import defaultdict
        self.values = []
        self.positions = defaultdict(set)

    def insert(self, val: int) -> bool:
        is_new = not self.positions[val]
        self.positions[val].add(len(self.values))
        self.values.append(val)
        return is_new

    def remove(self, val: int) -> bool:
        if not self.positions[val]:
            return False
        remove_index = self.positions[val].pop()
        last_index = len(self.values) - 1
        last_value = self.values[last_index]
        if remove_index != last_index:
            self.values[remove_index] = last_value
            self.positions[last_value].remove(last_index)
            self.positions[last_value].add(remove_index)
        self.values.pop()
        if not self.positions[val]:
            del self.positions[val]
        return True

    def getRandom(self) -> int:
        import random
        return random.choice(self.values)`,
    walkthrough: { input: 'values=[1,1,2]，remove(1)', steps: ['值 1 的下标集合为 {0,1}，任选其中一个待删下标。', '若删除下标 0，就用末尾值 2 覆盖，并把 2 的下标从 2 改为 0。', '弹出末项后数组剩 [2,1]，两个实例都可被等概率抽到。'], result: '删除成功并返回 true。' },
    complexity: { time: 'insert、remove 平均 O(1)，getRandom 为 O(1)。', space: 'O(n)，数组和下标集合各记录所有实例。' },
    pitfalls: ['删除数组中间项后必须同步更新末尾值的索引集合。', '随机应从实例数组取样，不能从不同值的键集合取样。'], related: ['380 O(1) 时间插入、删除和获取随机元素', '哈希表', '随机化设计'],
  },
};
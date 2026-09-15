import type { Lesson } from './lessons';

export const lessonsBatch4: Record<number, Lesson> = {
  212: {
    id: 212, title: '单词搜索 II', summary: '在字符网格中一次寻找多个字典单词，用字典树共享前缀，并从每个格子回溯搜索。',
    constraints: ['单词只能由上下左右相邻格组成，同一条路径不能重复使用格子。', 'board 与 words 均非空，答案中的单词不能重复。'],
    examples: [{ input: 'board=[["o","a"],["e","t"]], words=["oat","eat","tea"]', output: '["oat"]', explanation: 'o→a→t 相邻可达，其余单词无法按四方向连成。' }],
    intuition: '把所有单词放进字典树，搜索路径一旦不再是任何单词前缀即可停止；命中词后清空终止标记可天然去重。', bruteForce: '对每个单词分别从每格 DFS，会反复探索相同前缀，最坏代价接近所有单词长度对应的指数搜索之和。',
    approach: ['建立嵌套字典形式的字典树。', '在单词末节点保存完整单词。', '从每个网格位置启动 DFS。', '字符不在当前树节点时立即剪枝。', '临时标记格子后搜索四邻格并恢复。', '取出末节点单词加入答案并清空以防重复。'],
    code: `from typing import List

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = {}
        for word in words:
            node = root
            for ch in word:
                node = node.setdefault(ch, {})
            node['$'] = word
        rows, cols, ans = len(board), len(board[0]), []
        def dfs(r: int, c: int, node: dict) -> None:
            ch = board[r][c]
            if ch not in node:
                return
            nxt = node[ch]
            word = nxt.pop('$', None)
            if word:
                ans.append(word)
            board[r][c] = '#'
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, nxt)
            board[r][c] = ch
            if not nxt:
                node.pop(ch)
        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        return ans`,
    walkthrough: { input: 'board=[[o,a],[e,t]], words=[oat,eat]', steps: ['字典树根包含 o、e 两条前缀。', '从 o 进入节点并标记该格。', '向右经过 a，再向下到 t。', '读到末节点 oat，记录并恢复路径。'], result: '返回 [oat]。' },
    complexity: { time: '建树 O(单词总长度)，搜索最坏 O(mn·4^L)。', space: 'O(单词总长度+L)，用于字典树与递归栈。' }, pitfalls: ['回溯后必须恢复网格字符。', '命中同一单词的多条路径时仍只能输出一次。'], related: ['79 单词搜索', '208 实现 Trie'],
  },
  211: {
    id: 211, title: '添加与搜索单词', summary: '设计支持插入单词和点号通配搜索的数据结构，字典树负责前缀分支，DFS 处理通配符。',
    constraints: ['点号仅在 search 中出现，可匹配任意一个字符。', '搜索必须匹配完整单词，不能只匹配前缀。'],
    examples: [{ input: 'addWord("bad"), addWord("dad"), search(".ad")', output: 'true', explanation: '点号可取 b 或 d，从而匹配已加入单词。' }],
    intuition: '普通字符只沿一条 Trie 边前进；遇到点号时尝试当前节点所有孩子，只要任一后缀成功即可。', bruteForce: '把所有单词存在列表中，每次 search 逐个比较字符，查询代价与已存单词总字符数成正比。',
    approach: ['根节点使用字典表示。', 'addWord 逐字符创建孩子节点。', '末尾写入终止标记。', 'search 从根和下标零开始 DFS。', '普通字符只递归对应孩子。', '点号枚举所有非终止孩子，末尾检查终止标记。'],
    code: `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['$'] = True

    def search(self, word: str) -> bool:
        def dfs(i: int, node: dict) -> bool:
            if i == len(word):
                return '$' in node
            ch = word[i]
            if ch != '.':
                return ch in node and dfs(i + 1, node[ch])
            return any(key != '$' and dfs(i + 1, child) for key, child in node.items())
        return dfs(0, self.root)`,
    walkthrough: { input: '加入 bad、dad，搜索 b..', steps: ['插入后根有 b 与 d 分支。', '首字符 b 只进入 b 分支。', '第一个点枚举 b 节点的 a 孩子。', '第二个点到 d，且末节点有终止标记。'], result: '搜索返回 true。' },
    complexity: { time: '插入 O(L)；搜索最坏 O(26^L)。', space: 'O(总字符数)，搜索递归栈 O(L)。' }, pitfalls: ['点号恰好匹配一个字符，不是任意长度。', '到达模式末尾还必须检查单词终止标记。'], related: ['208 实现 Trie', '212 单词搜索 II'],
  },
  373: {
    id: 373, title: '查找和最小的 K 对数字', summary: '从两个升序数组中取出和最小的 k 个数对，用最小堆合并按首数组下标划分的有序序列。',
    constraints: ['两个输入数组均按非递减顺序排列。', '数对按下标组合计数，k 可能超过全部组合数。'],
    examples: [{ input: 'nums1=[1,7,11], nums2=[2,4,6], k=3', output: '[[1,2],[1,4],[1,6]]', explanation: '这三个组合的和依次为 3、5、7。' }],
    intuition: '固定 nums1[i] 后，与 nums2[0..] 组成的和有序；先放每行首项，每弹出一项只推进同一行的下一列。', bruteForce: '生成 mn 个数对后整体排序，时间 O(mn log(mn))、空间 O(mn)，即使 k 很小也做了全部工作。',
    approach: ['把每个 i 看成一条按 j 递增的有序行。', '仅初始化前 min(k,m) 行的 j=0。', '堆键使用两数之和。', '反复弹出最小项并记录数对。', '若该行还有下一列，将 j+1 入堆。', '收集 k 项或堆空后返回。'],
    code: `from typing import List
import heapq

class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        if not nums1 or not nums2 or k == 0:
            return []
        heap = [(nums1[i] + nums2[0], i, 0) for i in range(min(k, len(nums1)))]
        heapq.heapify(heap)
        ans = []
        while heap and len(ans) < k:
            _, i, j = heapq.heappop(heap)
            ans.append([nums1[i], nums2[j]])
            if j + 1 < len(nums2):
                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
        return ans`,
    walkthrough: { input: 'nums1=[1,3], nums2=[2,4], k=3', steps: ['堆放入 (1,2) 与 (3,2)。', '弹出 (1,2)，推入同一行 (1,4)。', '弹出和为 5 的候选之一。', '再弹出另一个和为 5 的候选，已满三对。'], result: '得到三个最小和数对。' },
    complexity: { time: 'O(k log min(k,m))。', space: 'O(min(k,m))，不计输出。' }, pitfalls: ['空数组时不能访问 nums2[0]。', '推进的是弹出项所在行的下一列，不能一次加入整行。'], related: ['23 合并 K 个升序链表', '378 有序矩阵中第 K 小元素'],
  },
  502: {
    id: 502, title: 'IPO', summary: '在最多完成 k 个项目的限制下最大化资本；按资本门槛排序，并用最大堆选择当前可做项目中利润最高者。',
    constraints: ['同一项目最多选择一次，做完后利润立即加入资本。', '只有 capital[i] 不超过当前资本的项目才可启动。'],
    examples: [{ input: 'k=2, w=0, profits=[1,2,3], capital=[0,1,1]', output: '4', explanation: '先做利润 1 的项目，资本变 1，再做利润 3 的项目。' }],
    intuition: '每轮把所有新解锁项目加入候选；在不会影响可行性的前提下选最大利润，得到的资本至少不差于选其他候选。', bruteForce: '每轮枚举所有可做项目并递归尝试选择顺序，分支数随项目数阶乘级增长。',
    approach: ['将项目按所需资本排序。', '维护指针指向尚未解锁项目。', '每轮把门槛不高于 w 的利润压入最大堆。', '若堆为空则无法继续，提前结束。', '弹出最大利润并加入资本。', '最多执行 k 轮后返回资本。'],
    code: `from typing import List
import heapq

class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
        projects = sorted(zip(capital, profits))
        heap, i = [], 0
        for _ in range(k):
            while i < len(projects) and projects[i][0] <= w:
                heapq.heappush(heap, -projects[i][1])
                i += 1
            if not heap:
                break
            w -= heapq.heappop(heap)
        return w`,
    walkthrough: { input: 'k=2,w=0, 项目=(门槛,利润)[(0,1),(1,2),(1,3)]', steps: ['门槛 0 的利润 1 入堆。', '选择利润 1，资本升为 1。', '两个门槛 1 的项目都入堆。', '选择最大利润 3，资本升为 4。'], result: '返回 4。' },
    complexity: { time: 'O(n log n+k log n)。', space: 'O(n)，保存排序项目与堆。' }, pitfalls: ['Python heapq 是最小堆，利润需取负。', '没有可做项目时必须停止而不是访问空堆。'], related: ['630 课程表 III', '871 最低加油次数'],
  },
  228: {
    id: 228, title: '汇总区间', summary: '把有序且互异的整数数组压缩成连续区间字符串，双指针定位每段起止位置。',
    constraints: ['数组严格递增，不含重复元素。', '空数组返回空列表，单点区间只输出一个数字。'],
    examples: [{ input: 'nums=[0,1,2,4,5,7]', output: '["0->2","4->5","7"]', explanation: '连续段分别是 0 到 2、4 到 5，以及单点 7。' }],
    intuition: '从一段起点出发，只要下一数等于当前数加一就继续；首次断裂处确定该段终点。', bruteForce: '用集合逐值判断邻居也能分组，但浪费有序信息和额外空间，还需另行保证输出顺序。',
    approach: ['令 i 指向当前区间起点。', '令 j 从 i 开始向右扩展。', '当 nums[j+1]=nums[j]+1 时继续。', '若 i=j，输出单个值。', '否则输出起点箭头终点。', '令 i=j+1 开始下一段。'],
    code: `from typing import List

class Solution:
    def summaryRanges(self, nums: List[int]) -> List[str]:
        ans, i = [], 0
        while i < len(nums):
            j = i
            while j + 1 < len(nums) and nums[j + 1] == nums[j] + 1:
                j += 1
            ans.append(str(nums[i]) if i == j else f'{nums[i]}->{nums[j]}')
            i = j + 1
        return ans`,
    walkthrough: { input: 'nums=[-1,0,2,3,4]', steps: ['从 -1 开始，0 连续。', '2 与 0 不连续，输出 -1->0。', '从 2 开始扩到 4。', '到数组末尾，输出 2->4。'], result: '返回 ["-1->0","2->4"]。' },
    complexity: { time: 'O(n)。', space: 'O(1)，不计答案。' }, pitfalls: ['单元素区间不能输出 x->x。', '连续条件是差恰为 1，不是只要递增。'], related: ['56 合并区间', '163 缺失的区间'],
  },
  352: {
    id: 352, title: '将数据流变为多个不相交区间', summary: '在线接收整数并返回不相交有序区间；用集合保存已见值，查询时线性整理连续段。',
    constraints: ['addNum 可能重复加入同一数值。', 'getIntervals 必须返回按起点升序且互不相交的区间。'],
    examples: [{ input: 'addNum(1),addNum(3),addNum(2),getIntervals()', output: '[[1,3]]', explanation: '加入 2 后把原本分离的 1 与 3 连接为连续区间。' }],
    intuition: '集合让插入天然去重；在查询时排序所有不同值并按相邻差一合并，代码清晰且符合接口正确性。', bruteForce: '每次加入后扫描整个整数值域判断存在性，若数值范围很大将产生与数据量无关的巨大开销。',
    approach: ['构造时创建空集合。', 'addNum 将值加入集合。', '查询时将集合升序排序。', '用首值初始化当前段。', '相邻值连续时延长段终点。', '出现断点时提交旧段，最后提交末段。'],
    code: `from typing import List

class SummaryRanges:
    def __init__(self):
        self.values = set()

    def addNum(self, value: int) -> None:
        self.values.add(value)

    def getIntervals(self) -> List[List[int]]:
        ans = []
        for value in sorted(self.values):
            if not ans or value > ans[-1][1] + 1:
                ans.append([value, value])
            else:
                ans[-1][1] = value
        return ans`,
    walkthrough: { input: '依次加入 1,3,7,2', steps: ['集合先得到 {1}。', '加入 3 后查询会形成 [1,1]、[3,3]。', '加入 7 形成第三段。', '加入 2 后排序为 1,2,3,7，前三项合并。'], result: '区间为 [[1,3],[7,7]]。' },
    complexity: { time: 'addNum 平均 O(1)，getIntervals O(n log n)。', space: 'O(n)，保存不同值及查询排序结果。' }, pitfalls: ['重复值不应制造重复区间。', '差一的两个区间必须合并。'], related: ['228 汇总区间', '56 合并区间'],
  },
  67: {
    id: 67, title: '二进制求和', summary: '从低位到高位模拟二进制竖式加法，同时处理两个字符串长度差与进位。',
    constraints: ['输入只含字符 0 和 1，且除数字零外无前导零。', '结果不能依赖把超长二进制串转换为内置整数。'],
    examples: [{ input: 'a="1010", b="1011"', output: '"10101"', explanation: '十进制 10 加 11 等于 21。' }],
    intuition: '每一位只依赖两个当前位和前一位进位；从字符串末尾逆向计算，最终再反转答案。', bruteForce: '先转十进制相加再转回二进制虽短，但可能违反题意，固定宽度语言还会溢出。',
    approach: ['指针分别指向两串末尾。', 'carry 初始化为零。', '循环读取仍存在的当前位。', '计算总和并用模二得到结果位。', '整除二得到新进位。', '处理最终进位并反转字符列表。'],
    code: `class Solution:
    def addBinary(self, a: str, b: str) -> str:
        i, j, carry, out = len(a) - 1, len(b) - 1, 0, []
        while i >= 0 or j >= 0 or carry:
            total = carry
            if i >= 0:
                total += ord(a[i]) - ord('0')
                i -= 1
            if j >= 0:
                total += ord(b[j]) - ord('0')
                j -= 1
            out.append(str(total % 2))
            carry = total // 2
        return ''.join(reversed(out))`,
    walkthrough: { input: 'a=11,b=1', steps: ['最低位 1+1=2，写 0 进 1。', '下一位 1+进位 1=2。', '写第二个 0，仍进 1。', '补写最终进位 1，再反转。'], result: '得到 100。' },
    complexity: { time: 'O(max(m,n))。', space: 'O(max(m,n))，用于结果。' }, pitfalls: ['循环条件必须包含 carry。', '追加顺序是低位到高位，返回前必须反转。'], related: ['2 两数相加', '43 字符串相乘'],
  },
  190: {
    id: 190, title: '颠倒二进制位', summary: '把无符号整数的固定 32 位逐位取出，并按相反次序构造结果。',
    constraints: ['必须按 32 位处理，前导零也参与颠倒。', '输入按无符号 32 位整数解释。'],
    examples: [{ input: 'n 的 32 位末尾为 00000101', output: '高三位为 101 的整数', explanation: '原最低位依次成为结果最高位。' }],
    intuition: '重复 32 次：结果左移腾位，再拼接 n 的最低位，随后 n 右移。', bruteForce: '转成二进制字符串后补齐 32 位再反转可行，但创建额外字符串且容易忘记前导零。',
    approach: ['result 初始化为零。', '固定循环 32 次。', 'result 左移一位。', '用 n&1 取得当前最低位并拼入。', 'n 右移一位。', '循环结束返回 result。'],
    code: `class Solution:
    def reverseBits(self, n: int) -> int:
        result = 0
        for _ in range(32):
            result = (result << 1) | (n & 1)
            n >>= 1
        return result`,
    walkthrough: { input: '低四位 1101，其余为 0', steps: ['取最低位 1，结果写入 1。', '取下一位 0，结果变为二进制 10。', '再取 1，结果变 101。', '再取 1，之后剩余零继续左移到满 32 位。'], result: '原低位 1101 出现在结果最高四位。' },
    complexity: { time: 'O(1)，固定 32 轮。', space: 'O(1)。' }, pitfalls: ['只循环到 n 为零会漏掉用于把结果推到高位的剩余轮次。', '不要把题目误当成反转十进制数字。'], related: ['191 位 1 的个数', '位运算'],
  },
  191: {
    id: 191, title: '位 1 的个数', summary: '统计整数二进制表示中的置位数，反复用 n&(n-1) 删除最低位的一个 1。',
    constraints: ['输入按非负或无符号整数解释。', '每个二进制 1 都需计数，包括最高位。'],
    examples: [{ input: 'n=11（二进制 1011）', output: '3', explanation: '1011 中共有三个 1。' }],
    intuition: 'n-1 会把最低的 1 变成 0 并翻转其后零位，与原数相与正好清掉最低 1。', bruteForce: '逐位右移并检查最低位也正确，但固定宽度下总要检查全部位。',
    approach: ['计数器初始化为零。', '当 n 非零时循环。', '计算 n-1。', '令 n=n&(n-1) 清除最低 1。', '计数器增加一。', 'n 归零后返回计数。'],
    code: `class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count`,
    walkthrough: { input: 'n=13（二进制 1101）', steps: ['1101 清最低 1 得 1100，count=1。', '1100 清最低 1 得 1000，count=2。', '1000 清最低 1 得 0000，count=3。', 'n 已为零，结束循环。'], result: '返回 3。' },
    complexity: { time: 'O(s)，s 为 1 的个数，至多 32。', space: 'O(1)。' }, pitfalls: ['在 Python 中对负数直接右移不会归零；本题按无符号数。', '表达式必须用 n 与 n-1 相与。'], related: ['190 颠倒二进制位', '338 比特位计数'],
  },
  201: {
    id: 201, title: '数字范围按位与', summary: '求闭区间所有整数的按位与，只保留左右端点共有且区间内不会变化的高位前缀。',
    constraints: ['left 与 right 满足 0<=left<=right。', '区间可能很大，不能逐个整数累计。'],
    examples: [{ input: 'left=5, right=7', output: '4', explanation: '101 & 110 & 111 = 100。' }],
    intuition: '左右端点不同的最低高位意味着该位及以下在区间内经历过 0/1 变化，按位与必为零；不断右移直到端点相等。', bruteForce: '从 left 到 right 逐个相与，时间与区间宽度成正比，极大区间不可接受。',
    approach: ['shift 初始化为零。', '比较 left 与 right。', '不相等时两者同时右移一位。', '每次右移递增 shift。', '相等部分就是公共高位前缀。', '将前缀左移 shift 位补零返回。'],
    code: `class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left != right:
            left >>= 1
            right >>= 1
            shift += 1
        return left << shift`,
    walkthrough: { input: 'left=5(101),right=7(111)', steps: ['两端不同，右移得 10 与 11。', '仍不同，再右移得 1 与 1。', '公共前缀为 1，共移两位。', '左移两位补零得到 100。'], result: '返回 4。' },
    complexity: { time: 'O(log right)。', space: 'O(1)。' }, pitfalls: ['公共前缀后的低位必须全补零。', '逐个枚举区间会超时。'], related: ['191 位 1 的个数', '338 比特位计数'],
  },
  137: {
    id: 137, title: '只出现一次的数字 II', summary: '除一个数出现一次外其余都出现三次，用两个位掩码记录每一位计数模三的状态。',
    constraints: ['数组非空且恰有一个只出现一次的元素。', '元素可能为负数，算法应正确处理二进制补码。'],
    examples: [{ input: 'nums=[2,2,3,2]', output: '3', explanation: '2 出现三次后各位状态归零，只留下 3。' }],
    intuition: 'ones 与 twos 分别表示某位出现次数模三为 1 和 2；第三次到来后该位从两个集合中同时消失。', bruteForce: '哈希计数后找频次 1 的键需要 O(n) 额外空间，没有利用“三次抵消”的结构。',
    approach: ['初始化 ones=twos=0。', '逐个读取整数 x。', '用异或把 x 合入 ones。', '排除已在 twos 的位。', '更新 twos 并排除新 ones 的位。', '所有三次位归零后返回 ones。'],
    code: `from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        ones = twos = 0
        for x in nums:
            ones = (ones ^ x) & ~twos
            twos = (twos ^ x) & ~ones
        return ones`,
    walkthrough: { input: 'nums=[5,5,8,5]', steps: ['首个 5 的位进入 ones。', '第二个 5 从 ones 转入 twos。', '8 的位按当前状态加入。', '第三个 5 使对应位从 twos 清除，只剩 8。'], result: '返回 8。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['ones 与 twos 更新有先后依赖，不能随意交换。', '普通异或只适合其余元素出现两次的情形。'], related: ['136 只出现一次的数字', '260 只出现一次的数字 III'],
  },
  66: {
    id: 66, title: '加一', summary: '把十进制数字数组加一，从最低位向前传播进位，遇到非 9 位即可结束。',
    constraints: ['每项是 0 到 9 的数字，首位不为零。', '数组表示非负整数且可能所有位都是 9。'],
    examples: [{ input: 'digits=[9,9]', output: '[1,0,0]', explanation: '两个 9 都变零，最终在最高位补 1。' }],
    intuition: '加一只会影响末尾连续的 9；第一个非 9 位加一后不会再有进位。', bruteForce: '拼成整数后加一再拆位在固定宽度语言可能溢出，也没有必要构造大整数。',
    approach: ['从最后一位向前扫描。', '若当前位小于 9，将它加一。', '此时进位结束，立即返回数组。', '若当前位是 9，将其改为 0。', '继续处理更高一位。', '若全部为 9，返回前置 1 的新数组。'],
    code: `from typing import List

class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        for i in range(len(digits) - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0
        return [1] + digits`,
    walkthrough: { input: 'digits=[1,9,9]', steps: ['末位 9 改为 0。', '次末位 9 也改为 0。', '首位 1 小于 9，加一得 2。', '进位终止并返回。'], result: '得到 [2,0,0]。' },
    complexity: { time: 'O(n)，最坏扫描全部位。', space: 'O(1)，全 9 时返回数组需 O(n) 结果空间。' }, pitfalls: ['从高位开始加会使进位处理复杂。', '全 9 时必须增加数组长度。'], related: ['67 二进制求和', '989 数组形式的整数加法'],
  },
  172: {
    id: 172, title: '阶乘后的零', summary: '统计 n! 末尾零的数量，本质是计算乘积中因子 5 的总个数。',
    constraints: ['n 为非负整数。', '不能实际计算巨大阶乘再转字符串。'],
    examples: [{ input: 'n=25', output: '6', explanation: '5、10、15、20 各贡献一个 5，25 额外贡献两个，共 6。' }],
    intuition: '因子 2 比 5 多，零由 10=2×5 产生；累加 floor(n/5)、floor(n/25) 等即可统计每层额外的 5。', bruteForce: '计算 n! 后反复除 10，不仅整数巨大，乘法成本也远超所需。',
    approach: ['令 count=0。', '当 n 至少为 5 时循环。', '把 n 整除 5。', '将商加入 count，统计本层 5 的倍数。', '继续整除会统计 25、125 的额外贡献。', 'n 归零后返回 count。'],
    code: `class Solution:
    def trailingZeroes(self, n: int) -> int:
        count = 0
        while n:
            n //= 5
            count += n
        return count`,
    walkthrough: { input: 'n=30', steps: ['30//5=6，先计六个 5。', '6//5=1，补计 25 的第二个 5。', '1//5=0。', '累加值为 7，循环结束。'], result: '30! 有 7 个末尾零。' },
    complexity: { time: 'O(log₅n)。', space: 'O(1)。' }, pitfalls: ['只计算 n//5 会漏掉 25 等高次幂。', '末尾零不是数字 0 在阶乘乘数中的个数。'], related: ['793 阶乘函数后 K 个零', '数学因子计数'],
  },
  69: {
    id: 69, title: 'X 的平方根', summary: '返回非负整数平方根的向下取整，用二分搜索寻找满足 mid²<=x 的最大整数。',
    constraints: ['x 为非负整数。', '结果要求向下取整，不返回浮点数。'],
    examples: [{ input: 'x=8', output: '2', explanation: '2²<=8，而 3²>8。' }],
    intuition: '谓词 m²<=x 随 m 单调地从真变假，因此可以二分最后一个为真的位置。', bruteForce: '从 0 递增测试平方，最坏需要 O(√x) 次。',
    approach: ['令 left=0、right=x。', 'ans 保存当前可行值。', '闭区间内取中点 mid。', '若 mid²<=x，记录并向右找更大值。', '否则收缩右边界。', '区间为空后返回 ans。'],
    code: `class Solution:
    def mySqrt(self, x: int) -> int:
        left, right, ans = 0, x, 0
        while left <= right:
            mid = (left + right) // 2
            if mid * mid <= x:
                ans = mid
                left = mid + 1
            else:
                right = mid - 1
        return ans`,
    walkthrough: { input: 'x=8', steps: ['区间 [0,8]，mid=4，平方过大。', '区间 [0,3]，mid=1，可行，ans=1。', '区间 [2,3]，mid=2，可行，ans=2。', 'mid=3 不可行，区间结束。'], result: '返回 2。' },
    complexity: { time: 'O(log x)。', space: 'O(1)。' }, pitfalls: ['要找最后一个可行值而非任意近似。', '固定宽度语言计算 mid²时需防溢出。'], related: ['367 有效的完全平方数', '50 Pow(x,n)'],
  },
  50: {
    id: 50, title: 'Pow(x, n)', summary: '用二进制快速幂计算 x 的整数次幂，把指数按二进制拆成若干平方因子。',
    constraints: ['指数可为负数或零。', 'x 为零时题目保证不会要求非法的负指数情形。'],
    examples: [{ input: 'x=2.0, n=-3', output: '0.125', explanation: '先计算 2³=8，再取倒数。' }],
    intuition: '指数每次减半，底数同步平方；当前指数最低位为 1 时把该底数乘入答案。', bruteForce: '重复乘 |n| 次，时间 O(|n|)，大指数不可行。',
    approach: ['若 n 为负，将 x 取倒数并把 n 变正。', 'result 初始化为 1。', '当 n 大于零时检查最低位。', '最低位为 1 时乘入当前 x。', '令 x 自乘完成平方。', 'n 右移一位，最终返回 result。'],
    code: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x, n = 1.0 / x, -n
        result = 1.0
        while n:
            if n & 1:
                result *= x
            x *= x
            n >>= 1
        return result`,
    walkthrough: { input: 'x=2,n=10', steps: ['10 二进制最低位为 0，底数平方为 4。', '指数变 5，最低位 1，结果乘 4。', '底数平方为 16，指数变 2。', '继续平方到 256，指数位为 1 时乘入，得到 1024。'], result: '返回 1024。' },
    complexity: { time: 'O(log |n|)。', space: 'O(1)。' }, pitfalls: ['负指数要对底数取倒数。', 'n=0 时应返回 1。'], related: ['69 X 的平方根', '372 超级次方'],
  },
  149: {
    id: 149, title: '直线上最多的点数', summary: '枚举每个点作为锚点，用约分后的方向向量统计与它共线的其他点。',
    constraints: ['点坐标为整数，点在输入中互不相同。', '垂直线与负斜率必须得到统一且稳定的键。'],
    examples: [{ input: 'points=[[1,1],[2,2],[3,3],[3,1]]', output: '3', explanation: '前三点位于直线 y=x。' }],
    intuition: '同一锚点下，共线点的 dx、dy 方向经最大公约数约分后相同；统一符号后可直接哈希计数。', bruteForce: '枚举两点确定直线，再遍历所有点验证共线，时间 O(n³)。',
    approach: ['依次选择锚点 i。', '计算后续点与锚点的 dx、dy。', '用 gcd(|dx|,|dy|) 约分。', '统一符号使 dx 非负，垂直方向也唯一。', '哈希统计每个方向出现次数。', '方向计数加锚点自身更新全局最大值。'],
    code: `from typing import List
from math import gcd
from collections import defaultdict

class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        if n <= 2:
            return n
        best = 2
        for i in range(n):
            count = defaultdict(int)
            for j in range(i + 1, n):
                dx = points[j][0] - points[i][0]
                dy = points[j][1] - points[i][1]
                g = gcd(abs(dx), abs(dy))
                dx, dy = dx // g, dy // g
                if dx < 0 or (dx == 0 and dy < 0):
                    dx, dy = -dx, -dy
                count[(dx, dy)] += 1
                best = max(best, count[(dx, dy)] + 1)
        return best`,
    walkthrough: { input: 'points=[[0,0],[1,1],[2,2],[2,0]]', steps: ['以 (0,0) 为锚点。', '到 (1,1) 的方向约分为 (1,1)。', '到 (2,2) 也约分为 (1,1)，计数变 2。', '加上锚点自身，共线数更新为 3。'], result: '返回 3。' },
    complexity: { time: 'O(n² log C)，gcd 与坐标范围 C 有关。', space: 'O(n)，保存一个锚点的方向计数。' }, pitfalls: ['直接用浮点斜率可能有精度问题。', '相反方向必须统一符号，否则同一直线被拆开。'], related: ['356 直线镜像', '数学最大公约数'],
  },
  9: {
    id: 9, title: '回文数', summary: '不转字符串，只反转整数的后半部分，再与前半部分比较。',
    constraints: ['负数不是回文数。', '除零外末位为零的数不可能回文。'],
    examples: [{ input: 'x=1221', output: 'true', explanation: '反转后半 21 得 12，与前半 12 相同。' }],
    intuition: '只处理一半既避免完整反转溢出，也可在 reversed>=剩余前半时停止；奇数位要去掉中间位。', bruteForce: '转字符串后与逆序比较需要 O(d) 额外空间，虽然简单但没有练习数值操作。',
    approach: ['先排除负数和非零末位零。', '令 rev=0。', '当 x>rev 时取出 x 的末位。', '把该位追加到 rev。', '循环后比较 x==rev。', '奇数位时也允许 x==rev//10。'],
    code: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        rev = 0
        while x > rev:
            rev = rev * 10 + x % 10
            x //= 10
        return x == rev or x == rev // 10`,
    walkthrough: { input: 'x=12321', steps: ['取 1，rev=1，x=1232。', '取 2，rev=12，x=123。', '取 3，rev=123，x=12，循环停止。', '去掉 rev 中间位后 12 与 x 相等。'], result: '返回 true。' },
    complexity: { time: 'O(log x)。', space: 'O(1)。' }, pitfalls: ['负数的负号无法对称。', '奇数位比较时需去掉反转部分的中间位。'], related: ['7 整数反转', '234 回文链表'],
  },
  7: {
    id: 7, title: '整数反转', summary: '逐位取出十进制数字构造反转值，并在结果超出 32 位有符号范围时返回零。',
    constraints: ['输入与有效输出均按 32 位有符号整数范围判断。', '反转后前导零自然消失，负号保持。'],
    examples: [{ input: 'x=-120', output: '-21', explanation: '绝对值 120 反转为 21，再恢复负号。' }],
    intuition: '在绝对值上重复取模 10 得到最低位，按 result*10+digit 追加；最终统一恢复符号并检查边界。', bruteForce: '转字符串反转后解析也可行，但仍需单独处理符号、前导零和溢出。',
    approach: ['记录输入正负号。', '对绝对值进行处理。', '循环取 x%10 得到末位。', '把末位追加到 result。', '用整除 10 删除已处理位。', '恢复符号并检查 32 位范围。'],
    code: `class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        x, result = abs(x), 0
        while x:
            result = result * 10 + x % 10
            x //= 10
        result *= sign
        return result if -(2 ** 31) <= result <= 2 ** 31 - 1 else 0`,
    walkthrough: { input: 'x=-120', steps: ['记录符号为负，处理 120。', '取 0，结果仍为 0。', '取 2、再取 1，结果依次为 2、21。', '恢复负号并检查范围。'], result: '返回 -21。' },
    complexity: { time: 'O(log |x|)。', space: 'O(1)。' }, pitfalls: ['必须按反转后的结果检查溢出。', 'Python 对负数整除语义不同，先取绝对值更稳妥。'], related: ['9 回文数', '8 字符串转换整数'],
  },
  43: {
    id: 43, title: '字符串相乘', summary: '模拟十进制长乘法，用长度 m+n 的数组累积每对数字的乘积与进位。',
    constraints: ['输入是非负整数字符串，不能直接转大整数。', '除数字零外输入没有前导零。'],
    examples: [{ input: 'num1="123", num2="45"', output: '"5535"', explanation: '123×45=5535。' }],
    intuition: '下标 i、j 两位的乘积只影响结果位置 i+j 与 i+j+1；从低位向高位处理即可就地传播进位。', bruteForce: '反复把 num1 相加 num2 次，次数可能由一个极大的字符串表示，完全不可行。',
    approach: ['若任一输入为零直接返回零。', '创建长度 m+n 的零数组。', '从两串低位向高位枚举。', '把乘积加到位置 i+j+1。', '个位留在该位置，进位加到 i+j。', '去掉结果前导零并拼接字符。'],
    code: `class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == '0' or num2 == '0':
            return '0'
        out = [0] * (len(num1) + len(num2))
        for i in range(len(num1) - 1, -1, -1):
            for j in range(len(num2) - 1, -1, -1):
                total = out[i + j + 1] + int(num1[i]) * int(num2[j])
                out[i + j + 1] = total % 10
                out[i + j] += total // 10
        start = 0
        while start < len(out) - 1 and out[start] == 0:
            start += 1
        return ''.join(map(str, out[start:]))`,
    walkthrough: { input: 'num1=12,num2=34', steps: ['2×4=8 放在最低位。', '2×3=6 累积到十位。', '1×4=4 也累积到十位，形成 10 并进位。', '1×3 加上进位完成高位，得到 408。'], result: '返回 "408"。' },
    complexity: { time: 'O(mn)。', space: 'O(m+n)。' }, pitfalls: ['乘积落点是 i+j+1，进位落在 i+j。', '零输入要避免返回空串或多余前导零。'], related: ['2 两数相加', '67 二进制求和'],
  },
  166: {
    id: 166, title: '分数到小数', summary: '把分数转成小数字符串，用余数首次出现位置检测循环节并插入括号。',
    constraints: ['分母非零，分子和分母可为负。', '小数可能终止，也可能存在循环部分。'],
    examples: [{ input: 'numerator=2, denominator=3', output: '"0.(6)"', explanation: '余数 2 重复出现，对应数字 6 无限循环。' }],
    intuition: '长除法下一位完全由当前余数决定；同一余数再次出现后，后续数字必然重复。', bruteForce: '无限地产生小数位并猜测循环会无法终止，也不能可靠确定括号起点。',
    approach: ['根据分子分母符号决定结果符号。', '对绝对值做 divmod 得到整数部分和余数。', '余数为零时直接返回。', '用映射记录每个余数对应的输出下标。', '每轮余数乘十产生下一位。', '余数重复时在首次位置插入左括号并末尾加右括号。'],
    code: `class Solution:
    def fractionToDecimal(self, numerator: int, denominator: int) -> str:
        if numerator == 0:
            return '0'
        sign = '-' if (numerator < 0) ^ (denominator < 0) else ''
        n, d = abs(numerator), abs(denominator)
        integer, rem = divmod(n, d)
        if rem == 0:
            return sign + str(integer)
        out = list(sign + str(integer) + '.')
        seen = {}
        while rem:
            if rem in seen:
                out.insert(seen[rem], '(')
                out.append(')')
                break
            seen[rem] = len(out)
            digit, rem = divmod(rem * 10, d)
            out.append(str(digit))
        return ''.join(out)`,
    walkthrough: { input: '1/6', steps: ['整数部分为 0，余数为 1。', '记录余数 1，乘十得到数字 1、余数 4。', '记录余数 4，乘十得到数字 6、余数仍为 4。', '余数 4 重复，在数字 6 前后加括号。'], result: '返回 "0.1(6)"。' },
    complexity: { time: 'O(d)，d 为循环前及循环节位数。', space: 'O(d)。' }, pitfalls: ['符号由两个操作数异号决定。', '必须记录余数位置而不是小数数字位置。'], related: ['29 两数相除', '长除法'],
  },
  179: {
    id: 179, title: '最大数', summary: '重排非负整数使拼接结果最大，自定义比较两个字符串拼接顺序。',
    constraints: ['数组非空且元素为非负整数。', '若所有元素为零，结果应为单个 "0"。'],
    examples: [{ input: 'nums=[3,30,34,5,9]', output: '"9534330"', explanation: '按两两拼接比较得到顺序 9、5、34、3、30。' }],
    intuition: '对字符串 a、b，若 a+b>b+a，则 a 必须排在 b 前；该规则直接优化局部相邻拼接。', bruteForce: '枚举所有排列并比较拼接字符串需要 O(n!)。',
    approach: ['把所有整数转换为字符串。', '定义比较器比较 a+b 与 b+a。', '按比较器从优到劣排序。', '连接排序后的所有字符串。', '检查结果首字符是否为零。', '全零时返回单个 0，否则返回连接结果。'],
    code: `from typing import List
from functools import cmp_to_key

class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        parts = list(map(str, nums))
        def compare(a: str, b: str) -> int:
            if a + b > b + a:
                return -1
            if a + b < b + a:
                return 1
            return 0
        parts.sort(key=cmp_to_key(compare))
        result = ''.join(parts)
        return '0' if result[0] == '0' else result`,
    walkthrough: { input: 'nums=[10,2,9]', steps: ['比较 2 与 10：210 大于 102，所以 2 在前。', '比较 9 与 2：92 大于 29，所以 9 在前。', '排序顺序为 9、2、10。', '连接得到 9210，首位非零。'], result: '返回 "9210"。' },
    complexity: { time: 'O(n log n·L)，L 为拼接比较长度。', space: 'O(nL)。' }, pitfalls: ['不能按数值大小或字符串字典序直接排序。', '全零结果要压缩为一个 0。'], related: ['拼接排序', '953 验证外星语词典'],
  },
  268: {
    id: 268, title: '丢失的数字', summary: '在 0 到 n 中找唯一缺失值，把完整下标与现有元素全部异或以抵消成对数字。',
    constraints: ['数组含 n 个互异数字，均位于 [0,n]。', '恰好缺失范围中的一个数字。'],
    examples: [{ input: 'nums=[3,0,1]', output: '2', explanation: '范围 0 到 3 中只有 2 未出现。' }],
    intuition: 'x^x=0 且 0^x=x；完整范围与数组异或后，所有出现数字都成对消失，只剩缺失值。', bruteForce: '对每个 0..n 检查是否在数组中，若使用线性查找会达到 O(n²)。',
    approach: ['用 n 初始化答案，补入下标范围缺少的 n。', '遍历每个下标 i 与元素 x。', '把 i 异或进答案。', '再把 x 异或进答案。', '相同数字最终两两抵消。', '扫描后返回唯一未抵消值。'],
    code: `from typing import List

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        result = len(nums)
        for i, x in enumerate(nums):
            result ^= i ^ x
        return result`,
    walkthrough: { input: 'nums=[3,0,1]', steps: ['result 从 n=3 开始。', 'i=0 与 x=3 异或，两个 3 将最终抵消。', 'i=1 与 x=0 异或，0 和 1 也对应抵消。', '完整范围中未有配对的 2 留下。'], result: '返回 2。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['初始化必须包含范围端点 n。', '题目范围从 0 开始而非 1。'], related: ['136 只出现一次的数字', '448 找到所有数组中消失的数字'],
  },
  204: {
    id: 204, title: '计数质数', summary: '用埃氏筛统计严格小于 n 的质数，从每个质数的平方开始标记倍数。',
    constraints: ['统计范围是 [0,n)，不包含 n。', '0 与 1 都不是质数。'],
    examples: [{ input: 'n=10', output: '4', explanation: '小于 10 的质数为 2、3、5、7。' }],
    intuition: '合数必有不超过其平方根的质因子；处理质数 p 时，小于 p² 的倍数已被更小因子标记。', bruteForce: '对每个数试除到平方根，总时间约 O(n√n)。',
    approach: ['创建长度 n 的布尔数组并先设为真。', '把 0 与 1 设为非质数。', '从 p=2 扫描到 p²<n。', '若 p 仍为真，它就是质数。', '从 p² 开始按步长 p 标记合数。', '最终统计真值数量。'],
    code: `class Solution:
    def countPrimes(self, n: int) -> int:
        if n <= 2:
            return 0
        prime = [True] * n
        prime[0] = prime[1] = False
        p = 2
        while p * p < n:
            if prime[p]:
                for multiple in range(p * p, n, p):
                    prime[multiple] = False
            p += 1
        return sum(prime)`,
    walkthrough: { input: 'n=12', steps: ['先排除 0 与 1。', 'p=2，从 4 标记 4、6、8、10。', 'p=3，从 9 标记 9。', '剩余真位置为 2、3、5、7、11。'], result: '返回 5。' },
    complexity: { time: 'O(n log log n)。', space: 'O(n)。' }, pitfalls: ['题目要求小于 n，筛数组不包含 n。', 'n<=2 时不能访问 prime[1]。'], related: ['埃氏筛', '279 完全平方数'],
  },
  371: {
    id: 371, title: '两整数之和', summary: '不用加减运算符，异或计算无进位和，与运算后左移计算进位，并在 32 位掩码内迭代。',
    constraints: ['输入与答案按 32 位有符号整数解释。', '实现需要正确处理负数在 Python 中的无限符号扩展。'],
    examples: [{ input: 'a=-2,b=3', output: '1', explanation: '32 位补码迭代后结果解释为有符号整数 1。' }],
    intuition: 'a^b 相当于逐位相加但忽略进位，(a&b)<<1 给出下一轮待加进位；进位归零即完成。', bruteForce: '循环递增或递减一个数来模拟加法需要 O(|b|)，且题目禁止使用加减符号。',
    approach: ['设置 32 位 mask 与最大正数界。', '先把 a、b 限制到 32 位。', '当 b 非零时计算无进位和。', '计算共同 1 产生的左移进位。', '两者均用 mask 截断并继续。', '若最高符号位为零直接返回，否则转回负数。'],
    code: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        max_int = 0x7FFFFFFF
        a, b = a & mask, b & mask
        while b:
            a, b = (a ^ b) & mask, ((a & b) << 1) & mask
        return a if a <= max_int else ~(a ^ mask)`,
    walkthrough: { input: 'a=1,b=3', steps: ['1^3 得无进位和 2。', '共同最低位产生进位 2。', '2^2 得 0，共同位产生进位 4。', '再异或得到 4，进位归零。'], result: '返回 4。' },
    complexity: { time: 'O(1)，32 位下最多常数轮。', space: 'O(1)。' }, pitfalls: ['Python 负数必须用 32 位 mask 截断。', '进位是 (a&b)<<1，不是只做与。'], related: ['67 二进制求和', '191 位 1 的个数'],
  },
  384: {
    id: 384, title: '打乱数组', summary: '保存原数组，并用 Fisher-Yates 算法等概率生成所有排列；reset 返回初始排列。',
    constraints: ['每种排列出现概率必须相同。', 'reset 应恢复构造时的原始数组，不能受此前 shuffle 修改影响。'],
    examples: [{ input: '初始化 [1,2,3]，shuffle()，reset()', output: '某个等概率排列；[1,2,3]', explanation: '打乱不改变保存的原始副本。' }],
    intuition: '处理位置 i 时，在 [i,n-1] 中等概率选一个元素交换过来；连乘概率保证每个最终排列都是 1/n!。', bruteForce: '随机交换若干次不保证所有排列等概率；生成所有排列再随机选则需阶乘空间。',
    approach: ['构造时复制输入为 original。', 'reset 返回 original 的副本。', 'shuffle 从 original 的副本开始。', '依次处理位置 i。', '在闭区间 [i,n-1] 均匀选择 j。', '交换 i、j，循环结束返回数组。'],
    code: `from typing import List
import random

class Solution:
    def __init__(self, nums: List[int]):
        self.original = nums[:]

    def reset(self) -> List[int]:
        return self.original[:]

    def shuffle(self) -> List[int]:
        values = self.original[:]
        for i in range(len(values)):
            j = random.randrange(i, len(values))
            values[i], values[j] = values[j], values[i]
        return values`,
    walkthrough: { input: 'nums=[1,2,3]', steps: ['复制原数组保存。', 'i=0 时从三个位置等概率选择并交换。', 'i=1 时从剩余两个位置选择。', 'i=2 只有自身可选，形成一个完整排列。'], result: '六种排列各以 1/6 概率产生。' },
    complexity: { time: 'reset O(n)，shuffle O(n)。', space: 'O(n)，保存原数组和结果副本。' }, pitfalls: ['不能让 original 与工作数组共享同一引用。', '每轮随机范围必须从 i 开始，而非总在全数组选择。'], related: ['380 O(1) 随机集合', 'Fisher-Yates 洗牌'],
  },
  122: {
    id: 122, title: '买卖股票的最佳时机 II', summary: '允许多次交易时，累加所有相邻上涨差值即可获得最大利润。',
    constraints: ['同一时刻最多持有一股，卖出后才能再次买入。', '可以不交易，下降区间不应产生负利润。'],
    examples: [{ input: 'prices=[7,1,5,3,6,4]', output: '7', explanation: '1 买 5 卖赚 4，3 买 6 卖赚 3。' }],
    intuition: '一段连续上涨从谷底到峰顶的利润等于每个相邻正差之和，因此可把长交易拆成每日上涨而不损失收益。', bruteForce: '每天递归选择买、卖或等待会产生指数级状态路径。',
    approach: ['初始化 profit=0。', '从第二天开始扫描。', '计算当天价减前一天价。', '差值为正时加入利润。', '差值非正时忽略。', '扫描结束返回累计值。'],
    code: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit`,
    walkthrough: { input: 'prices=[1,3,2,5]', steps: ['1 到 3 上涨 2，累计 2。', '3 到 2 下跌，忽略。', '2 到 5 上涨 3，累计 5。', '所有相邻日扫描完毕。'], result: '返回 5。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['不要把多个上涨段误合并成一次跨越下跌的交易。', '只有正差才累加。'], related: ['121 买卖股票的最佳时机', '714 含手续费的股票交易'],
  },
  123: {
    id: 123, title: '买卖股票的最佳时机 III', summary: '最多完成两笔交易，用四个滚动状态表示第一次买卖和第二次买卖后的最大收益。',
    constraints: ['最多两笔完整交易，不能同时持有多股。', '第二次买入必须发生在第一次卖出之后或同日状态更新中等价衔接。'],
    examples: [{ input: 'prices=[3,3,5,0,0,3,1,4]', output: '6', explanation: '0 买 3 卖，再 1 买 4 卖，共 6。' }],
    intuition: '依次维护 buy1、sell1、buy2、sell2，每个状态只取保持原状或当天执行对应动作的较大值。', bruteForce: '枚举两笔交易的四个日期需要 O(n⁴)，即使预处理也不如状态机直接。',
    approach: ['四个状态初始化为负无穷或零。', '逐日读取价格 p。', '更新第一次买入 buy1。', '用 buy1 更新第一次卖出 sell1。', '用 sell1-p 更新第二次买入 buy2。', '用 buy2+p 更新第二次卖出 sell2，最终返回它。'],
    code: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        buy1 = buy2 = float('-inf')
        sell1 = sell2 = 0
        for p in prices:
            buy1 = max(buy1, -p)
            sell1 = max(sell1, buy1 + p)
            buy2 = max(buy2, sell1 - p)
            sell2 = max(sell2, buy2 + p)
        return sell2`,
    walkthrough: { input: 'prices=[1,5,2,6]', steps: ['价格 1 建立第一次买入状态。', '价格 5 使 sell1=4。', '价格 2 使 buy2=2，表示携带首笔利润再买。', '价格 6 使 sell2=8。'], result: '两笔交易总利润为 8。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['买入状态表示净收益，通常为负。', '返回 sell2 而不是 buy2。'], related: ['188 买卖股票 IV', '121 买卖股票 I'],
  },
  188: {
    id: 188, title: '买卖股票的最佳时机 IV', summary: '最多交易 k 次，用一维 buy/sell 状态更新每个交易次数；k 很大时退化为无限次贪心。',
    constraints: ['一次交易由一次买入与之后一次卖出组成。', '不能同时参与多笔交易，k 可能大于有效上限 n/2。'],
    examples: [{ input: 'k=2, prices=[3,2,6,5,0,3]', output: '7', explanation: '2 买 6 卖赚 4，0 买 3 卖赚 3。' }],
    intuition: 'sell[t] 是完成至多 t 次交易且空仓的最大收益，buy[t] 是对应持仓收益；每天据前态决定保持或交易。', bruteForce: '枚举每一笔买卖日期组合，交易数增长时产生指数级候选。',
    approach: ['若 k>=n/2，累加所有正差直接返回。', '创建长度 k+1 的 buy 与 sell。', 'buy 初始化为负无穷，sell 为零。', '逐日扫描价格。', '对 t=1..k 更新 buy[t]=max(buy[t],sell[t-1]-p)。', '更新 sell[t]=max(sell[t],buy[t]+p)，最后返回 sell[k]。'],
    code: `from typing import List

class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        n = len(prices)
        if k >= n // 2:
            return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, n))
        buy = [float('-inf')] * (k + 1)
        sell = [0] * (k + 1)
        for p in prices:
            for t in range(1, k + 1):
                buy[t] = max(buy[t], sell[t - 1] - p)
                sell[t] = max(sell[t], buy[t] + p)
        return sell[k]`,
    walkthrough: { input: 'k=2,prices=[2,6,1,4]', steps: ['价格 2 建立各次买入状态。', '价格 6 使第一笔卖出利润为 4。', '价格 1 允许携带首笔利润建立第二次持仓。', '价格 4 卖出第二笔，总利润 7。'], result: '返回 7。' },
    complexity: { time: 'O(nk)，退化分支为 O(n)。', space: 'O(k)。' }, pitfalls: ['k 很大时若仍分配 O(k) 会浪费甚至超限。', 'buy[t] 应由 sell[t-1] 转移。'], related: ['123 买卖股票 III', '122 买卖股票 II'],
  },
  309: {
    id: 309, title: '最佳买卖股票时机含冷冻期', summary: '卖出后次日不能买入，用持有、当天卖出、空闲三个状态刻画每日选择。',
    constraints: ['可交易多次但不能同时持有多股。', '卖出后的下一天处于冷冻期，不能买入。'],
    examples: [{ input: 'prices=[1,2,3,0,2]', output: '3', explanation: '买 1 卖 2，冷冻一天，再买 0 卖 2。' }],
    intuition: '买入只能来自前一天空闲状态；当天卖出来自前一天持有；空闲可由持续空闲或前一天卖出转来。', bruteForce: '每天递归尝试买卖或跳过，会重复计算相同日期与持仓状态。',
    approach: ['hold 初始化为第一天买入后的收益。', 'sold 表示当天刚卖出，初始不可达。', 'rest 表示空仓且可买，初始为零。', '逐日保存旧状态。', 'hold 由旧 hold 或旧 rest-price 更新。', 'sold=旧hold+price，rest=max(旧rest,旧sold)，最后返回空仓最大值。'],
    code: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        hold, sold, rest = float('-inf'), float('-inf'), 0
        for p in prices:
            old_hold, old_sold, old_rest = hold, sold, rest
            hold = max(old_hold, old_rest - p)
            sold = old_hold + p
            rest = max(old_rest, old_sold)
        return max(sold, rest)`,
    walkthrough: { input: 'prices=[1,2,3,0,2]', steps: ['价格 1 后 hold=-1。', '价格 2 卖出可得 1。', '价格 3 若继续持有后卖可得 2。', '冷冻转为空闲后在价格 0 买入，末日价格 2 卖出，总计 3。'], result: '返回 3。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['买入不能从前一天 sold 状态直接转移。', '最终必须空仓，不能返回 hold。'], related: ['714 含手续费股票', '122 股票 II'],
  },
  714: {
    id: 714, title: '买卖股票的最佳时机含手续费', summary: '允许多次交易但每笔收手续费，用空仓 cash 与持仓 hold 两状态滚动求最大收益。',
    constraints: ['每次完整交易收取一次手续费。', '同一时刻只能持有一股，可选择不交易。'],
    examples: [{ input: 'prices=[1,3,2,8,4,9], fee=2', output: '8', explanation: '1 买 8 卖净赚 5，4 买 9 卖净赚 3。' }],
    intuition: '每天要么保持状态，要么买入或卖出；把手续费统一在卖出时扣除可避免重复收费。', bruteForce: '枚举所有买卖时点组合会产生指数级方案。',
    approach: ['cash=0 表示初始空仓收益。', 'hold=-prices[0] 表示初始持仓收益。', '逐日保存旧 cash。', 'cash=max(cash,hold+price-fee)。', 'hold=max(hold,旧cash-price)。', '扫描结束返回 cash。'],
    code: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int], fee: int) -> int:
        cash, hold = 0, -prices[0]
        for p in prices[1:]:
            old_cash = cash
            cash = max(cash, hold + p - fee)
            hold = max(hold, old_cash - p)
        return cash`,
    walkthrough: { input: 'prices=[1,4,2,7],fee=1', steps: ['价格 1 买入，hold=-1。', '价格 4 卖出净得 2，cash=2。', '价格 2 再买时 hold 可更新为 0。', '价格 7 卖出后 cash=6。'], result: '返回 6。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['手续费每笔只扣一次。', '更新 hold 时应使用更新前的 cash 以保持清晰状态语义。'], related: ['122 股票 II', '309 含冷冻期股票'],
  },
  213: {
    id: 213, title: '打家劫舍 II', summary: '房屋首尾相邻，把环拆成“不选末屋”和“不选首屋”两个线性打家劫舍问题。',
    constraints: ['不能偷相邻房屋，首屋与末屋也相邻。', '数组至少有一间房，金额非负。'],
    examples: [{ input: 'nums=[2,3,2]', output: '3', explanation: '首尾两间不能同时偷，选择中间房收益最大。' }],
    intuition: '任何合法方案不可能同时包含首尾，因此最优解必落在区间 [0,n-2] 或 [1,n-1] 的线性最优解之一。', bruteForce: '枚举每间房偷或不偷并检查邻接约束需要 O(2^n)。',
    approach: ['单间房直接返回其金额。', '定义线性区间求解函数。', '维护 skip 与 take 或相邻滚动最优值。', '扫描每个金额更新偷当前与不偷当前的最优值。', '分别计算去掉末屋和去掉首屋。', '返回两个结果较大者。'],
    code: `from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]
        def linear(values: List[int]) -> int:
            prev2 = prev1 = 0
            for money in values:
                prev2, prev1 = prev1, max(prev1, prev2 + money)
            return prev1
        return max(linear(nums[:-1]), linear(nums[1:]))`,
    walkthrough: { input: 'nums=[1,2,3,1]', steps: ['考虑 [1,2,3]，线性最优偷 1 与 3 得 4。', '该方案排除了末屋。', '考虑 [2,3,1]，线性最优为 3。', '取两种互斥范围结果的较大值。'], result: '返回 4。' },
    complexity: { time: 'O(n)。', space: 'O(n)，切片产生副本；状态本身 O(1)。' }, pitfalls: ['长度为 1 时两个切片都为空，需单独处理。', '不能直接在线性答案上事后排除首尾。'], related: ['198 打家劫舍', '337 打家劫舍 III'],
  },
  337: {
    id: 337, title: '打家劫舍 III', summary: '房屋形成二叉树，后序 DFS 为每个节点同时返回偷与不偷该节点的最大收益。',
    constraints: ['父子节点不能同时被偷。', '树可能为空，节点金额非负。'],
    examples: [{ input: 'root=[3,2,3,null,3,null,1]', output: '7', explanation: '偷根节点 3 和两个孙节点 3、1。' }],
    intuition: '若偷当前节点，就只能取两个孩子“不偷”的值；若不偷，则每个孩子可独立取偷或不偷中的较大值。', bruteForce: '对每个节点分别递归计算偷与不偷，会重复求同一子树，朴素写法可指数增长。',
    approach: ['定义 dfs 返回 (不偷,偷)。', '空节点返回 (0,0)。', '后序取得左右孩子状态。', '偷当前值=节点值+左右不偷值。', '不偷当前值=左右各自状态最大值之和。', '根节点两状态取最大返回。'],
    code: `from typing import Optional, Tuple

class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        def dfs(node: Optional[TreeNode]) -> Tuple[int, int]:
            if not node:
                return 0, 0
            left_skip, left_take = dfs(node.left)
            right_skip, right_take = dfs(node.right)
            take = node.val + left_skip + right_skip
            skip = max(left_skip, left_take) + max(right_skip, right_take)
            return skip, take
        return max(dfs(root))`,
    walkthrough: { input: 'root=[3,2,3,null,3,null,1]', steps: ['叶子 3 返回不偷 0、偷 3。', '叶子 1 返回 0、1。', '两个中间节点分别组合其孩子状态。', '根的偷状态取孩子不偷，根不偷状态取孩子最优，最终较大为 7。'], result: '返回 7。' },
    complexity: { time: 'O(n)，每个节点一次。', space: 'O(h)，递归栈取决于树高。' }, pitfalls: ['偷当前节点时不能取孩子的偷状态。', '只返回子树单个最优值会丢失父节点决策所需信息。'], related: ['198 打家劫舍', '213 打家劫舍 II'],
  },
  221: {
    id: 221, title: '最大正方形', summary: '在 0/1 矩阵中寻找全为 1 的最大正方形，用 DP 记录以每格为右下角的最大边长。',
    constraints: ['矩阵元素是字符 0 或 1。', '正方形必须连续且所有格均为 1，返回面积。'],
    examples: [{ input: 'matrix=[["1","0"],["1","1"]]', output: '1', explanation: '没有 2×2 全一方块，最大边长为 1。' }],
    intuition: '若当前格为 1，它能扩成的边长受上、左、左上三个邻居中最短者限制，因此状态为三者最小值加一。', bruteForce: '枚举每个左上角和边长，再逐格验证，最坏 O(mn·min(m,n)²)。',
    approach: ['使用长度 n+1 的一维 dp。', 'prev 保存更新前的左上状态。', '逐行逐列扫描矩阵。', '当前为 1 时取上、左、左上的最小值加一。', '当前为 0 时把 dp[j] 清零。', '维护最大边长并返回其平方。'],
    code: `from typing import List

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        rows, cols = len(matrix), len(matrix[0])
        dp = [0] * (cols + 1)
        best = 0
        for r in range(1, rows + 1):
            prev = 0
            for c in range(1, cols + 1):
                top = dp[c]
                if matrix[r - 1][c - 1] == '1':
                    dp[c] = 1 + min(dp[c], dp[c - 1], prev)
                    best = max(best, dp[c])
                else:
                    dp[c] = 0
                prev = top
        return best * best`,
    walkthrough: { input: 'matrix=[[1,1],[1,1]]', steps: ['首格为 1，边长状态为 1。', '首行第二格仍只能为 1。', '第二行首格也为 1。', '右下格的上、左、左上均至少 1，状态变 2。'], result: '最大面积为 4。' },
    complexity: { time: 'O(mn)。', space: 'O(n)。' }, pitfalls: ['返回的是面积而不是边长。', '一维压缩时必须在覆盖前保存左上旧值。'], related: ['85 最大矩形', '1277 统计全为 1 的正方形子矩阵'],
  },
  63: {
    id: 63, title: '不同路径 II', summary: '统计带障碍网格从左上到右下的路径数，一维 DP 累加来自上方和左方的方案。',
    constraints: ['只能向右或向下移动。', '障碍格不可进入，起点或终点可能是障碍。'],
    examples: [{ input: 'grid=[[0,0,0],[0,1,0],[0,0,0]]', output: '2', explanation: '绕开中心障碍可沿上边或左边两条路线。' }],
    intuition: 'dp[c] 更新前表示从上方到当前格的方案，dp[c-1] 表示从左方到达；障碍把当前方案数清零。', bruteForce: 'DFS 枚举每条右下路径，空网格中路径数量呈组合爆炸。',
    approach: ['创建列数长度的 dp。', '若起点可走则令 dp[0]=1。', '按行从左到右扫描。', '遇到障碍把 dp[c] 置零。', '可走格且 c>0 时令 dp[c]+=dp[c-1]。', '最终返回最后一列状态。'],
    code: `from typing import List

class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        cols = len(obstacleGrid[0])
        dp = [0] * cols
        dp[0] = 1
        for row in obstacleGrid:
            for c, blocked in enumerate(row):
                if blocked:
                    dp[c] = 0
                elif c > 0:
                    dp[c] += dp[c - 1]
        return dp[-1]`,
    walkthrough: { input: 'grid=[[0,0],[1,0]]', steps: ['起点使 dp=[1,0]。', '首行第二格从左得到 1，dp=[1,1]。', '第二行首格是障碍，dp[0] 清零。', '终点从上方得到 1，从左方得到 0。'], result: '返回 1。' },
    complexity: { time: 'O(mn)。', space: 'O(n)。' }, pitfalls: ['障碍位置必须清零，否则上方路径会穿过障碍。', '起点是障碍时首轮会自然把 dp[0] 清零。'], related: ['62 不同路径', '64 最小路径和'],
  },
  91: {
    id: 91, title: '解码方法', summary: '统计数字串映射为 A 到 Z 的方案数，用滚动 DP 检查单字符与双字符解码。',
    constraints: ['字符只含数字，1 到 26 才有字母映射。', '字符 0 不能单独解码，只能出现在 10 或 20 中。'],
    examples: [{ input: 's="226"', output: '3', explanation: '可解为 2-2-6、22-6、2-26。' }],
    intuition: '到位置 i 的方案来自：当前一位非零时继承 dp[i-1]；最后两位在 10..26 时再加 dp[i-2]。', bruteForce: '递归尝试取一位或两位会重复计算相同后缀，最坏近似斐波那契增长。',
    approach: ['空串或首字符为 0 时返回零。', 'prev2=1 表示空前缀。', 'prev1=1 表示首位合法。', '从第二个字符开始计算 current。', '当前字符非零时加 prev1。', '两位数合法时加 prev2，滚动状态并返回 prev1。'],
    code: `class Solution:
    def numDecodings(self, s: str) -> int:
        if not s or s[0] == '0':
            return 0
        prev2 = prev1 = 1
        for i in range(1, len(s)):
            current = 0
            if s[i] != '0':
                current += prev1
            if 10 <= int(s[i - 1:i + 1]) <= 26:
                current += prev2
            prev2, prev1 = prev1, current
        return prev1`,
    walkthrough: { input: 's=226', steps: ['首位 2 有一种解法。', '处理第二位 2：单独解与 22 均合法，共 2。', '处理 6：单独接在两种前缀后。', '双字符 26 还可接在首位前的空前缀后，总计 3。'], result: '返回 3。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['0 不能单独贡献方案。', '两位数必须在 10 到 26，不能接受 06。'], related: ['639 解码方法 II', '70 爬楼梯'],
  },
  97: {
    id: 97, title: '交错字符串', summary: '判断 s3 能否保持 s1、s2 各自字符顺序交错形成，用二维状态压缩到一维。',
    constraints: ['每个来源字符串内部相对顺序不能改变。', '若长度之和不等于 s3 长度，必定失败。'],
    examples: [{ input: 's1="aab",s2="axy",s3="aaxaby"', output: 'true', explanation: '可依次从 s1、s2 取字符并保持两边顺序。' }],
    intuition: 'dp[j] 表示已取 s1 前 i 个和 s2 前 j 个能否构成 s3 前 i+j 个；末字符只能来自两者之一。', bruteForce: '每个匹配位置都递归选择来自 s1 或 s2，重复状态导致指数时间。',
    approach: ['先检查总长度。', 'dp[0]=true 初始化空前缀。', '初始化只使用 s2 的第一行。', '逐步加入 s1 字符。', '每行先更新 j=0 的状态。', '对每个 j 合并来自上方或左方且字符匹配的状态。'],
    code: `class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False
        dp = [False] * (len(s2) + 1)
        dp[0] = True
        for j in range(1, len(s2) + 1):
            dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]
        for i in range(1, len(s1) + 1):
            dp[0] = dp[0] and s1[i - 1] == s3[i - 1]
            for j in range(1, len(s2) + 1):
                k = i + j - 1
                dp[j] = (dp[j] and s1[i - 1] == s3[k]) or (dp[j - 1] and s2[j - 1] == s3[k])
        return dp[-1]`,
    walkthrough: { input: 's1=ab,s2=cd,s3=acbd', steps: ['空前缀状态为真。', '首字符 a 只能来自 s1。', '第二字符 c 来自 s2，状态保持可达。', '随后取 b、d，分别保持两源顺序并到达终态。'], result: '返回 true。' },
    complexity: { time: 'O(mn)。', space: 'O(n)。' }, pitfalls: ['必须先验证长度之和。', '一维更新顺序应从左到右以使用当前行左状态。'], related: ['1143 最长公共子序列', '115 不同的子序列'],
  },
  115: {
    id: 115, title: '不同的子序列', summary: '统计 s 中等于 t 的不同子序列数量，一维 DP 逆序更新目标前缀。',
    constraints: ['子序列可删除字符但不能改变剩余顺序。', '不同下标选择即使字符相同也算不同方案。'],
    examples: [{ input: 's="rabbbit",t="rabbit"', output: '3', explanation: '三个 b 中选择不同两个可形成三种下标方案。' }],
    intuition: '读到源字符 ch 时，若它等于 t[j-1]，可把所有形成 t 前 j-1 字符的方案扩展为前 j 字符。', bruteForce: '枚举 s 的全部子序列共 2^m 个，再与 t 比较。',
    approach: ['创建长度 n+1 的 dp。', '令 dp[0]=1，空目标有一种选法。', '逐字符扫描 s。', '目标下标从后向前遍历。', '字符匹配时执行 dp[j]+=dp[j-1]。', '逆序避免同一源字符在一轮被重复使用，返回 dp[n]。'],
    code: `class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        dp = [0] * (len(t) + 1)
        dp[0] = 1
        for ch in s:
            for j in range(len(t), 0, -1):
                if ch == t[j - 1]:
                    dp[j] += dp[j - 1]
        return dp[-1]`,
    walkthrough: { input: 's=bab,t=ab', steps: ['dp[0]=1。', '首个 b 可形成目标前缀 b，但不能形成 a。', '读到 a，形成目标前缀 a 的方案变 1。', '末尾 b 把该 a 方案扩展为 ab，完整方案为 1。'], result: '返回 1。' },
    complexity: { time: 'O(|s||t|)。', space: 'O(|t|)。' }, pitfalls: ['目标维度必须逆序更新。', '空目标串应有一种空选择。'], related: ['97 交错字符串', '392 判断子序列'],
  },
  120: {
    id: 120, title: '三角形最小路径和', summary: '从三角形底部向上做动态规划，每格选择其正下方与右下方较小路径。',
    constraints: ['每步只能走到下一行同下标或下标加一位置。', '元素可为负数，必须恰好走到最后一行。'],
    examples: [{ input: 'triangle=[[2],[3,4],[6,5,7],[4,1,8,3]]', output: '11', explanation: '路径 2→3→5→1 的和最小。' }],
    intuition: '从底部已知每个位置到终点的最小代价，上一层位置只需加上两个可达孩子中的较小值。', bruteForce: '从顶点递归选择两个孩子，共有约 2^(rows-1) 条路径。',
    approach: ['复制最后一行作为 dp。', '从倒数第二行向上遍历。', '对该行每个位置 i。', '取 dp[i] 与 dp[i+1] 的较小值。', '加上当前三角形值并写回 dp[i]。', '处理到顶层后返回 dp[0]。'],
    code: `from typing import List

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        dp = triangle[-1][:]
        for r in range(len(triangle) - 2, -1, -1):
            for c in range(r + 1):
                dp[c] = triangle[r][c] + min(dp[c], dp[c + 1])
        return dp[0]`,
    walkthrough: { input: 'triangle=[[2],[3,4],[6,5,7]]', steps: ['底层状态为 [6,5,7]。', '位置 3 选择孩子 5，更新为 8。', '位置 4 选择孩子 5，更新为 9。', '顶点 2 选择 8，得到 10。'], result: '返回 10。' },
    complexity: { time: 'O(n²)，n 为行数。', space: 'O(n)。' }, pitfalls: ['不能在同一层从右向左使用已混合层次的错误状态；此底向上写法按当前范围更新安全。', '不要贪心选择下一行较小值，后续路径可能更大。'], related: ['64 最小路径和', '931 下降路径最小和'],
  },
  343: {
    id: 343, title: '整数拆分', summary: '把整数拆成至少两个正整数使乘积最大，动态规划枚举第一段并决定余数是否继续拆。',
    constraints: ['n>=2，必须至少拆分一次。', '各部分为正整数。'],
    examples: [{ input: 'n=10', output: '36', explanation: '拆成 3+3+4，乘积为 36。' }],
    intuition: '固定第一段 j 后，余数 n-j 可保持整体或采用其最优拆分，取 max(n-j,dp[n-j]) 再乘 j。', bruteForce: '递归枚举所有整数分拆，重复子问题很多，方案数快速增长。',
    approach: ['创建 dp[0..n] 并初始化零。', '从 i=2 递增计算。', '枚举第一段 j 从 1 到 i-1。', '比较余数不拆与继续拆的收益。', '用 j 乘较大余数收益更新 dp[i]。', '全部计算后返回 dp[n]。'],
    code: `class Solution:
    def integerBreak(self, n: int) -> int:
        dp = [0] * (n + 1)
        for total in range(2, n + 1):
            for first in range(1, total):
                dp[total] = max(dp[total], first * max(total - first, dp[total - first]))
        return dp[n]`,
    walkthrough: { input: 'n=5', steps: ['dp[2]=1。', 'dp[3] 可由 1+2 得 2。', 'dp[4] 的最优乘积为 4。', 'dp[5] 取 2×3 得到 6。'], result: '返回 6。' },
    complexity: { time: 'O(n²)。', space: 'O(n)。' }, pitfalls: ['必须至少拆一次，不能直接把 n 本身作为最终答案。', '转移时要比较余数继续拆与不拆。'], related: ['动态规划', '数学贪心'],
  },
};
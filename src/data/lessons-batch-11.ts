import type { Lesson } from './lessons';

export const lessonsBatch11: Record<number, Lesson> = {
  500: {
    id: 500,
    title: '键盘行',
    summary: '筛出所有字母都能在美式键盘同一行找到的单词，保留原单词与输入顺序。',
    constraints: ['单词仅含英文字母，但可能混合大小写。', '同一单词的全部字符必须属于同一键盘行。'],
    examples: [{ input: 'words = ["Hello","Alaska","Dad","Peace"]', output: '["Alaska","Dad"]', explanation: 'Alaska 与 Dad 的字母分别全部位于键盘第二行。' }],
    intuition: '把三行字母预先变成集合；单词转小写后形成字符集合，只要它是任意一行集合的子集，该单词就合法。',
    bruteForce: '对每个字符逐个扫描三条行字符串来确认归属，能完成任务，但重复线性查找使逻辑冗长。',
    approach: ['建立三行小写字母集合。', '逐个单词取其小写字符集合。', '判断该集合是否为任意键盘行的子集。', '合法时把原始单词加入答案。'],
    code: `class Solution:
    def findWords(self, words: List[str]) -> List[str]:
        rows = [set("qwertyuiop"), set("asdfghjkl"), set("zxcvbnm")]
        return [word for word in words
                if any(set(word.lower()) <= row for row in rows)]`,
    walkthrough: { input: 'words = ["Alaska","Peace","Dad"]', steps: ['Alaska 转小写后的字符都属于第二行。', 'Peace 同时使用第一、第二行字母，因此舍弃。', 'Dad 的字符集合仍是第二行的子集。'], result: '返回 ["Alaska","Dad"]。' },
    complexity: { time: 'O(L)，L 为所有单词的字符总数。', space: 'O(1) 额外空间（字母表大小固定，不计返回值）。' },
    pitfalls: ['忘记统一大小写会误判大写字母。', '答案应保留单词原本的大小写。'],
    related: ['哈希集合', '字符分类', '集合子集判断'],
  },
  504: {
    id: 504,
    title: '七进制数',
    summary: '把十进制整数转换为七进制字符串，同时正确处理零与负号。',
    constraints: ['输入是可由题目范围容纳的整数。', '结果不能含多余前导零，负数只在开头保留负号。'],
    examples: [{ input: 'num = 100', output: '"202"', explanation: '100 = 2×49 + 0×7 + 2。' }],
    intuition: '反复除以 7，余数依次给出从低位到高位的七进制数字；收集后反转即可。',
    bruteForce: '枚举七进制位权并逐位试商也可行，但需要先寻找最高位权，边界处理更多。',
    approach: ['单独处理 num=0。', '记录符号，并对绝对值转换。', '循环执行除以 7，将余数加入数组。', '反转数字并在需要时添加负号。'],
    code: `class Solution:
    def convertToBase7(self, num: int) -> str:
        if num == 0:
            return "0"
        sign = "-" if num < 0 else ""
        num = abs(num)
        digits = []
        while num:
            num, remainder = divmod(num, 7)
            digits.append(str(remainder))
        return sign + "".join(reversed(digits))`,
    walkthrough: { input: 'num = -100', steps: ['记录负号，并把待转换值变成 100。', '连续除以 7 得到低位起的余数 2、0、2。', '反转为 202，再拼接负号。'], result: '返回 "-202"。' },
    complexity: { time: 'O(log₇ |num|)。', space: 'O(log₇ |num|)，保存结果数字。' },
    pitfalls: ['零不会进入除法循环，必须特殊处理。', '不能直接对负数使用语言相关的整除余数规则。'],
    related: ['进制转换', '数学', '405 数字转换为十六进制数'],
  },
  506: {
    id: 506,
    title: '相对名次',
    summary: '按分数从高到低给运动员排名，前三名使用奖牌名称，其余位置使用十进制名次。',
    constraints: ['所有分数互不相同，因此名次唯一。', '输出顺序必须与原 score 数组一致。'],
    examples: [{ input: 'score = [10,3,8,9,4]', output: '["Gold Medal","5","Bronze Medal","Silver Medal","4"]', explanation: '降序分数为 10、9、8、4、3，再映射回原位置。' }],
    intuition: '排序下标而不是只排序分数，便能同时得到名次并知道应写回答案的原位置。',
    bruteForce: '对每个分数统计有多少分数比它高，需要 O(n²) 次比较。',
    approach: ['按 score 值降序排列所有下标。', '准备与输入等长的结果数组。', '遍历排序下标，前三位写入奖牌名称。', '其余位置写入 rank+1 的字符串。'],
    code: `class Solution:
    def findRelativeRanks(self, score: List[int]) -> List[str]:
        order = sorted(range(len(score)), key=lambda i: score[i], reverse=True)
        answer = [""] * len(score)
        medals = ["Gold Medal", "Silver Medal", "Bronze Medal"]
        for rank, index in enumerate(order):
            answer[index] = medals[rank] if rank < 3 else str(rank + 1)
        return answer`,
    walkthrough: { input: 'score = [5,9,7]', steps: ['按分数降序得到原下标 [1,2,0]。', '下标 1、2、0 依次获得金、银、铜牌。', '按原数组位置读取写好的结果。'], result: '返回 ["Bronze Medal","Gold Medal","Silver Medal"]。' },
    complexity: { time: 'O(n log n)，主要成本为排序。', space: 'O(n)，保存下标顺序与答案。' },
    pitfalls: ['不要直接返回排序后的名次，输出要对齐原下标。', '第四名开始输出数字字符串而非整数。'],
    related: ['排序', '索引映射', '1331 数组序号转换'],
  },
  509: {
    id: 509,
    title: '斐波那契数',
    summary: '计算 F(0)=0、F(1)=1 且 F(n)=F(n-1)+F(n-2) 的第 n 项。',
    constraints: ['n 为非负整数。', '基础值 F(0) 与 F(1) 必须直接符合定义。'],
    examples: [{ input: 'n = 4', output: '3', explanation: '序列前几项为 0、1、1、2、3。' }],
    intuition: '下一项只依赖最近两项，无需保存完整动态规划数组，用两个变量滚动更新即可。',
    bruteForce: '按定义递归会重复计算大量相同子问题，时间复杂度呈指数增长。',
    approach: ['令 a=F(0)、b=F(1)。', '循环 n 次，同时更新为下一对相邻项。', '每轮后 a 表示当前推进到的 Fibonacci 项。', '循环结束返回 a。'],
    code: `class Solution:
    def fib(self, n: int) -> int:
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return a`,
    walkthrough: { input: 'n = 4', steps: ['初始相邻项为 (0,1)。', '推进两次后相邻项变为 (1,2)。', '再推进两次得到 (3,5)，此时 a=F(4)。'], result: '返回 3。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['n=0 时应返回 0，循环写法可自然覆盖。', '同时赋值可避免先更新 a 后丢失旧值。'],
    related: ['动态规划', '1137 第 N 个泰波那契数', '70 爬楼梯'],
  },
  520: {
    id: 520,
    title: '检测大写字母',
    summary: '判断单词的大写使用是否属于三种合法形式：全大写、全小写，或仅首字母大写。',
    constraints: ['输入是由英文字母组成的非空单词。', '大小写规则针对整个单词，而非单个字符独立判断。'],
    examples: [{ input: 'word = "Google"', output: 'true', explanation: '只有首字母 G 大写，符合规则。' }],
    intuition: 'Python 字符串已提供全大写、全小写和首字母格式检测，可直接组合三种互斥的合法模式。',
    bruteForce: '手工统计大写字母数量并判断位置也能在线性时间完成，但分支更多、容易漏掉单字符情况。',
    approach: ['检查 word.isupper()。', '检查 word.islower()。', '检查首字符大写且剩余字符全小写。', '任一条件成立即返回 true。'],
    code: `class Solution:
    def detectCapitalUse(self, word: str) -> bool:
        return (word.isupper() or word.islower() or
                (word[0].isupper() and word[1:].islower()))`,
    walkthrough: { input: 'word = "FlaG"', steps: ['单词不是全大写，因为包含 la。', '单词也不是全小写，因为包含 F 和 G。', '虽然首字母大写，但剩余 laG 并非全小写。'], result: '返回 false。' },
    complexity: { time: 'O(n)，字符串检查至多扫描常数轮。', space: 'O(n) 或 O(1)，取决于切片实现；可用逐字符判断降为 O(1)。' },
    pitfalls: ['仅统计大写数量为 1 不够，还必须位于首字符。', '单字符大写或小写都应合法。'],
    related: ['字符串', '字符分类', '正则模式判断'],
  },

  523: {
    id: 523,
    title: '连续的子数组和',
    summary: '判断是否存在长度至少为 2 的连续子数组，其元素和是 k 的倍数。',
    constraints: ['数组元素为非负整数，候选子数组长度至少为 2。', '当 k=0 时，目标应理解为子数组和恰好为 0。'],
    examples: [{ input: 'nums = [23,2,4,6,7], k = 6', output: 'true', explanation: '子数组 [2,4] 的和为 6，且长度为 2。' }],
    intuition: '两个前缀和对 k 的余数相同，它们之差便能被 k 整除。只记录某余数最早出现位置，最有利于满足长度至少为 2。',
    bruteForce: '枚举所有起止位置并累加区间和，直接实现 O(n²)，没有复用前缀之间的同余关系。',
    approach: ['用映射记录余数首次出现下标，初始化 0:-1。', '扫描并累加前缀和，计算对 k 的余数。', '若 k=0，则直接用前缀和作为键。', '键已出现且下标差至少为 2 时返回 true。', '只在键首次出现时记录下标。'],
    code: `class Solution:
    def checkSubarraySum(self, nums: List[int], k: int) -> bool:
        first = {0: -1}
        prefix = 0
        for i, value in enumerate(nums):
            prefix += value
            key = prefix % k if k != 0 else prefix
            if key in first:
                if i - first[key] >= 2:
                    return True
            else:
                first[key] = i
        return False`,
    walkthrough: { input: 'nums = [23,2,4], k = 6', steps: ['初始余数 0 位于虚拟下标 -1；读 23 后余数 5 首次出现于 0。', '读 2 后前缀余数为 1，记录于下标 1。', '读 4 后余数回到 5，与下标 0 的距离为 2。'], result: '区间 [2,4] 合法，返回 true。' },
    complexity: { time: 'O(n)，每个位置进行常数次哈希操作。', space: 'O(min(n, |k|))；k=0 时最坏 O(n)。' },
    pitfalls: ['初始化 0:-1 才能识别从下标 0 开始的区间。', '不要覆盖余数的最早下标，否则可能错过长度条件。'],
    related: ['前缀和', '同余', '560 和为 K 的子数组'],
  },
  525: {
    id: 525,
    title: '连续数组',
    summary: '在只含 0 和 1 的数组中，寻找 0 与 1 数量相等的最长连续子数组。',
    constraints: ['数组元素只能是 0 或 1。', '答案要求连续区间的最大长度，找不到时返回 0。'],
    examples: [{ input: 'nums = [0,1,0]', output: '2', explanation: '[0,1] 或 [1,0] 都包含相同数量的 0 和 1。' }],
    intuition: '把 0 视为 -1、1 视为 +1，问题转化为最长和为 0 的区间；相同前缀平衡值之间的区间和为 0。',
    bruteForce: '枚举每个子数组并统计两类元素，使用增量计数仍需 O(n²)。',
    approach: ['设置 balance=0，并记录 0 首次位于虚拟下标 -1。', '遇到 1 加一，遇到 0 减一。', '若 balance 曾出现，用当前下标减最早下标更新答案。', '若首次出现该 balance，则记录当前位置。'],
    code: `class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        first = {0: -1}
        balance = 0
        best = 0
        for i, value in enumerate(nums):
            balance += 1 if value == 1 else -1
            if balance in first:
                best = max(best, i - first[balance])
            else:
                first[balance] = i
        return best`,
    walkthrough: { input: 'nums = [0,1,1,0]', steps: ['下标 0 后 balance=-1，首次记录。', '下标 1 后 balance=0，与 -1 形成长度 2。', '扫描到下标 3 时 balance 再次为 0，与 -1 形成长度 4。'], result: '返回 4。' },
    complexity: { time: 'O(n)。', space: 'O(n)，保存不同平衡值的最早位置。' },
    pitfalls: ['必须把 0 当作 -1，而不是忽略它。', '相同平衡值只保存第一次出现的位置。'],
    related: ['前缀和', '哈希表', '523 连续的子数组和'],
  },
  532: {
    id: 532,
    title: '数组中的 K-diff 数对',
    summary: '统计数组中差的绝对值恰为 k 的不重复数值对数量。',
    constraints: ['k 为非负整数，数值对按值去重而非按下标计数。', '当 k=0 时，只有出现至少两次的值能形成一对。'],
    examples: [{ input: 'nums = [3,1,4,1,5], k = 2', output: '2', explanation: '不重复数值对为 (1,3) 与 (3,5)。' }],
    intuition: '频率表同时解决去重和 k=0 的特殊情况：正 k 时只需查看 value+k 是否存在；零差时统计频率至少为 2 的键。',
    bruteForce: '枚举所有下标对再把合法数值对加入集合，时间 O(n²)。',
    approach: ['建立每个数值的频率表。', '若 k=0，统计频率大于 1 的不同值。', '若 k>0，遍历不同值。', '对每个 value 检查 value+k 是否存在并计数。'],
    code: `class Solution:
    def findPairs(self, nums: List[int], k: int) -> int:
        from collections import Counter
        count = Counter(nums)
        if k == 0:
            return sum(freq > 1 for freq in count.values())
        return sum(value + k in count for value in count)`,
    walkthrough: { input: 'nums = [1,1,2,2,3], k = 1', steps: ['频率表的不同键为 1、2、3。', '值 1 能找到 2，贡献数值对 (1,2)。', '值 2 能找到 3；值 3 找不到 4。'], result: '共有 2 个不重复数值对。' },
    complexity: { time: 'O(n)，平均哈希查询为 O(1)。', space: 'O(n)。' },
    pitfalls: ['k=0 不能只判断键存在，否则单次出现也会被误计。', '遍历频率表的键而非原数组，才能避免重复计数。'],
    related: ['哈希表', '1 两数之和', '2006 差的绝对值为 K 的数对数目'],
  },
  539: {
    id: 539,
    title: '最小时间差',
    summary: '给定若干 24 小时制时刻，求任意两者在环形一天中的最小分钟差。',
    constraints: ['时刻格式固定为 HH:MM，范围在同一天内。', '午夜相邻关系必须考虑，例如 23:59 与 00:00 相差 1 分钟。'],
    examples: [{ input: 'timePoints = ["23:59","00:00"]', output: '1', explanation: '跨越午夜的环形差值为 1 分钟。' }],
    intuition: '把时刻统一换算为从午夜起的分钟并排序，相邻值给出线性最小差；首尾还需通过加上一天长度比较跨午夜差。',
    bruteForce: '两两计算环形差需要 O(n²)，没有利用一维排序后最近点必相邻的性质。',
    approach: ['把每个 HH:MM 转为 h*60+m。', '升序排列分钟值。', '比较所有相邻分钟值之差。', '额外比较 1440-last+first 的跨午夜差。'],
    code: `class Solution:
    def findMinDifference(self, timePoints: List[str]) -> int:
        minutes = []
        for text in timePoints:
            hour, minute = map(int, text.split(":"))
            minutes.append(hour * 60 + minute)
        minutes.sort()
        best = 1440
        for i in range(1, len(minutes)):
            best = min(best, minutes[i] - minutes[i - 1])
        return min(best, 1440 - minutes[-1] + minutes[0])`,
    walkthrough: { input: 'timePoints = ["23:50","00:10","12:00"]', steps: ['换算并排序为 [10,720,1430]。', '线性相邻差为 710 与 710。', '首尾跨午夜差为 1440-1430+10=20。'], result: '返回 20。' },
    complexity: { time: 'O(n log n)，主要成本为排序。', space: 'O(n)，保存分钟值。' },
    pitfalls: ['不能遗漏排序后首尾之间的环形差。', '重复时刻应得到 0。'],
    related: ['排序', '环形数组', '2446 判断两个事件是否存在冲突'],
  },
  540: {
    id: 540,
    title: '有序数组中的单一元素',
    summary: '在其余元素都成对出现的有序数组中，用对数时间找到唯一只出现一次的元素。',
    constraints: ['数组有序且长度为奇数。', '除一个元素出现一次外，其余元素都恰好出现两次。'],
    examples: [{ input: 'nums = [1,1,2,3,3,4,4]', output: '2', explanation: '只有 2 没有相邻副本。' }],
    intuition: '唯一元素之前，每对的首下标为偶数；之后配对关系错位。把 mid 调整为偶数并比较 mid 与 mid+1，即可判断异常位于哪一侧。',
    bruteForce: '线性扫描相邻元素或异或全部元素都需 O(n)，不满足对数时间目标。',
    approach: ['维护包含答案的闭区间 [left,right]。', '取 mid，并将其调整为偶数下标。', '若 nums[mid]=nums[mid+1]，完整配对在左侧，答案位于其后。', '否则答案在 mid 或更左侧。', '边界重合时返回该元素。'],
    code: `class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if mid % 2 == 1:
                mid -= 1
            if nums[mid] == nums[mid + 1]:
                left = mid + 2
            else:
                right = mid
        return nums[left]`,
    walkthrough: { input: 'nums = [1,1,2,3,3]', steps: ['区间 [0,4] 取偶数 mid=2，比较 2 与 3，不相等。', '答案保留在 [0,2]，新 mid 调整为 0。', 'nums[0]=nums[1]，跳过该完整配对后落到下标 2。'], result: '返回 2。' },
    complexity: { time: 'O(log n)。', space: 'O(1)。' },
    pitfalls: ['mid 必须对齐到一对的偶数起点。', '确认配对后要跳过两个位置，即 left=mid+2。'],
    related: ['二分查找', '136 只出现一次的数字', '34 在排序数组中查找元素范围'],
  },
  541: {
    id: 541,
    title: '反转字符串 II',
    summary: '每隔 2k 个字符反转其中前 k 个；末尾不足一组时按实际长度处理。',
    constraints: ['字符串由字符序列组成，k 为正整数。', '每个 2k 分块仅反转区间开头至多 k 个字符。'],
    examples: [{ input: 's = "abcdefg", k = 2', output: '"bacdfeg"', explanation: '分块 abc d 与 efg，分别反转前两字符。' }],
    intuition: '规则以固定长度 2k 周期重复。直接让起点按 2k 跳跃，并反转切片 [start:start+k]，Python 切片会自然截断尾部。',
    bruteForce: '逐字符构造并为每个位置计算所属块与映射位置，虽为 O(n)，但下标公式复杂且易错。',
    approach: ['把字符串转成可修改字符列表。', '起点从 0 开始每次增加 2k。', '反转 start 到 start+k 的有效切片。', '全部分块处理后拼接字符。'],
    code: `class Solution:
    def reverseStr(self, s: str, k: int) -> str:
        chars = list(s)
        for start in range(0, len(chars), 2 * k):
            chars[start:start + k] = reversed(chars[start:start + k])
        return "".join(chars)`,
    walkthrough: { input: 's = "abcdefghij", k = 3', steps: ['首个 6 字符块反转 abc，得到 cbadef。', '下一块从下标 6 开始，尾部 ghij 的前 3 个反转为 ihg。', '未被反转的字符保持原相对位置。'], result: '返回 "cbadefihgj"。' },
    complexity: { time: 'O(n)。', space: 'O(n)，字符串不可变，需要字符列表。' },
    pitfalls: ['步长是 2k，而不是 k。', '尾部少于 k 个字符时应全部反转。'],
    related: ['344 反转字符串', '557 反转字符串中的单词 III', '字符串模拟'],
  },

  542: {
    id: 542,
    title: '01 矩阵',
    summary: '为矩阵中每个位置计算到最近 0 的曼哈顿距离，只能沿上下左右移动。',
    constraints: ['矩阵仅含 0 和 1，且至少存在一个 0。', '相邻格移动一步，距离按最短路径步数计算。'],
    examples: [{ input: 'mat = [[0,0,0],[0,1,0],[1,1,1]]', output: '[[0,0,0],[0,1,0],[1,2,1]]', explanation: '所有 0 同时作为距离为 0 的起点向外扩散。' }],
    intuition: '从每个 1 单独找 0 会重复搜索。把所有 0 一次性加入队列做多源 BFS，首次到达每个 1 时的层数就是最近距离。',
    bruteForce: '对每个 1 分别执行 BFS 或扫描所有 0，最坏会达到 O((mn)²)。',
    approach: ['建立距离矩阵，并把所有 0 以距离 0 入队。', '将 1 暂标为未访问。', '从队首取格子，检查四个相邻位置。', '首次访问邻格时赋值为当前距离加一并入队。', '队列清空后返回距离矩阵。'],
    code: `class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        from collections import deque
        rows, cols = len(mat), len(mat[0])
        dist = [[-1] * cols for _ in range(rows)]
        queue = deque()
        for r in range(rows):
            for c in range(cols):
                if mat[r][c] == 0:
                    dist[r][c] = 0
                    queue.append((r, c))
        while queue:
            r, c = queue.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[r][c] + 1
                    queue.append((nr, nc))
        return dist`,
    walkthrough: { input: 'mat = [[0,1,1],[1,1,1]]', steps: ['唯一的 0 以距离 0 入队。', '第一层访问其右侧与下侧，距离都设为 1。', '后续按层继续扩散，其余格首次到达即得到最短距离。'], result: '返回 [[0,1,2],[1,2,3]]。' },
    complexity: { time: 'O(mn)，每格最多入队一次。', space: 'O(mn)，用于距离矩阵与队列。' },
    pitfalls: ['必须从全部 0 同时出发，不能只选一个起点。', '入队时就标记距离，避免同一格重复入队。'],
    related: ['多源 BFS', '286 墙与门', '994 腐烂的橘子'],
  },
  554: {
    id: 554,
    title: '砖墙',
    summary: '选择一条竖线穿过最少砖块；竖线不能沿墙的最左或最右外边界。',
    constraints: ['每行砖宽之和相同，砖宽为正数。', '穿过砖缝不算穿砖，但墙的整体右边界不能作为候选。'],
    examples: [{ input: 'wall = [[1,2,2,1],[3,1,2],[1,3,2]]', output: '1', explanation: '某个内部位置可对齐两行砖缝，只穿过剩余一行。' }],
    intuition: '某位置穿过的砖数等于总行数减去该位置出现的砖缝数，因此只需统计所有内部前缀宽度，选择出现最多的缝。',
    bruteForce: '枚举每个横向单位位置并逐行定位砖块，墙宽很大时成本依赖坐标值而非砖块数量。',
    approach: ['创建哈希表统计砖缝位置。', '对每行累加砖宽形成前缀位置。', '只统计最后一块砖之前的前缀，排除右边界。', '用行数减去最高砖缝频率。'],
    code: `class Solution:
    def leastBricks(self, wall: List[List[int]]) -> int:
        from collections import Counter
        gaps = Counter()
        for row in wall:
            position = 0
            for width in row[:-1]:
                position += width
                gaps[position] += 1
        return len(wall) - (max(gaps.values()) if gaps else 0)`,
    walkthrough: { input: 'wall = [[1,2],[2,1],[1,2]]', steps: ['三行内部砖缝分别位于 1、2、1。', '位置 1 的砖缝频率最高，为 2。', '总行数 3 减去对齐砖缝的 2 行。'], result: '最少穿过 1 块砖。' },
    complexity: { time: 'O(B)，B 为全部砖块数量。', space: 'O(B)，保存不同内部砖缝位置。' },
    pitfalls: ['不要统计每行最终总宽度，否则会错误选择墙边界。', '若每行只有一块砖，答案就是行数。'],
    related: ['前缀和', '哈希计数', '区间边界'],
  },
  556: {
    id: 556,
    title: '下一个更大元素 III',
    summary: '重排正整数的十进制数字，找到严格大于原数的最小 32 位有符号整数；不存在则返回 -1。',
    constraints: ['只能使用原数的全部数字且每个数字使用次数不变。', '结果必须严格更大，并且不超过 2³¹-1。'],
    examples: [{ input: 'n = 12443322', output: '13222344', explanation: '这是相同数字组成且紧邻原排列之后的字典序排列。' }],
    intuition: '目标就是数字序列的下一个字典序排列：从右找第一个上升转折，换入右侧刚好更大的数字，再把后缀改成最小升序。',
    bruteForce: '枚举数字的所有排列、转整数后筛选最小更大值，排列数量可达阶乘级。',
    approach: ['从右向左找首个 digits[i]<digits[i+1] 的位置。', '若找不到，当前排列已最大，返回 -1。', '从右找第一个大于 digits[i] 的数字并交换。', '反转原本非递增的后缀，使其升序最小。', '转换为整数并检查 32 位上界。'],
    code: `class Solution:
    def nextGreaterElement(self, n: int) -> int:
        digits = list(str(n))
        i = len(digits) - 2
        while i >= 0 and digits[i] >= digits[i + 1]:
            i -= 1
        if i < 0:
            return -1
        j = len(digits) - 1
        while digits[j] <= digits[i]:
            j -= 1
        digits[i], digits[j] = digits[j], digits[i]
        digits[i + 1:] = reversed(digits[i + 1:])
        answer = int("".join(digits))
        return answer if answer <= 2**31 - 1 else -1`,
    walkthrough: { input: 'n = 230241', steps: ['从右找到转折数字 2（其右侧存在更大的 4）。', '用右侧最靠右且大于 2 的 4 与它交换。', '把交换位置后的后缀按升序整理为 122。'], result: '得到 230412。' },
    complexity: { time: 'O(d)，d 为数字位数。', space: 'O(d)，数字字符串需要可变列表。' },
    pitfalls: ['交换后必须把后缀变为最小排列。', '合法排列若超过 2³¹-1 仍要返回 -1。'],
    related: ['31 下一个排列', '排列', '贪心'],
  },
  557: {
    id: 557,
    title: '反转字符串中的单词 III',
    summary: '保持单词顺序与空格分隔不变，把句子中每个单词内部的字符逆序。',
    constraints: ['单词由空格分隔，题目输入格式保证分隔规则明确。', '只反转单词内部，不改变单词之间的顺序。'],
    examples: [{ input: 's = "Let us code"', output: '"teL su edoc"', explanation: '三个单词分别独立反转。' }],
    intuition: '先按空格切分得到单词，再对每个单词使用切片逆序，最后按原分隔符拼回即可。',
    bruteForce: '逐字符寻找每个边界并原地双指针交换也可做到 O(n)，但在 Python 中代码更长。',
    approach: ['按空格切分字符串。', '对每个单词执行逆序切片。', '保持切分后的单词次序不变。', '用单个空格重新连接。'],
    code: `class Solution:
    def reverseWords(self, s: str) -> str:
        return " ".join(word[::-1] for word in s.split(" "))`,
    walkthrough: { input: 's = "Hello World"', steps: ['切分得到 ["Hello","World"]。', '分别反转为 "olleH" 与 "dlroW"。', '按原单词顺序用空格连接。'], result: '返回 "olleH dlroW"。' },
    complexity: { time: 'O(n)。', space: 'O(n)，用于结果字符串。' },
    pitfalls: ['不要把整个句子反转，否则单词顺序也会变化。', '若输入允许多重空格，应使用显式分隔方式保留空串。'],
    related: ['344 反转字符串', '541 反转字符串 II', '151 反转字符串中的单词'],
  },
  561: {
    id: 561,
    title: '数组拆分',
    summary: '把 2n 个整数分成 n 对，使每对较小值之和最大。',
    constraints: ['数组长度为偶数，每个元素恰好使用一次。', '数值可为负数，目标仍是最大化各对最小值之和。'],
    examples: [{ input: 'nums = [1,4,3,2]', output: '4', explanation: '排序后配成 (1,2)、(3,4)，较小值之和为 1+3。' }],
    intuition: '排序后让相邻元素配对，可避免某个较大元素被更大的数“浪费”同时迫使小数拖累其他配对；每对较小值正是偶数下标元素。',
    bruteForce: '递归枚举所有配对方案数量为 (2n-1)!!，很快不可计算。',
    approach: ['将 nums 升序排序。', '把相邻两个元素组成一对。', '每对的第一个元素是该对较小值。', '累加排序数组所有偶数下标元素。'],
    code: `class Solution:
    def arrayPairSum(self, nums: List[int]) -> int:
        nums.sort()
        return sum(nums[::2])`,
    walkthrough: { input: 'nums = [6,2,6,5,1,2]', steps: ['排序得到 [1,2,2,5,6,6]。', '相邻配对为 (1,2)、(2,5)、(6,6)。', '累加每对较小值 1+2+6。'], result: '返回 9。' },
    complexity: { time: 'O(n log n)。', space: 'O(1) 或 O(n)，取决于排序实现。' },
    pitfalls: ['应累加排序后的偶数下标，而非奇数下标。', '不要把最大值与最小值配对，这会损失中间较大值。'],
    related: ['排序', '贪心', '1877 数组中最大数对和的最小值'],
  },
  566: {
    id: 566,
    title: '重塑矩阵',
    summary: '在元素顺序不变的前提下，把矩阵改成 r 行 c 列；元素数量不匹配时返回原矩阵。',
    constraints: ['按行优先顺序读取和填充元素。', '只有原元素总数等于 r×c 时才能重塑。'],
    examples: [{ input: 'mat = [[1,2],[3,4]], r = 1, c = 4', output: '[[1,2,3,4]]', explanation: '按行读取的序列不变，只改变行列边界。' }],
    intuition: '二维下标可映射为线性序号 index；新矩阵中的位置 (index//c,index%c) 与原矩阵行优先序完全一致。',
    bruteForce: '先展平到额外数组再按 c 个元素切片，逻辑简单但额外保存了一份所有元素。',
    approach: ['计算原矩阵行列数并检查元素总数。', '创建 r×c 的结果矩阵。', '按原矩阵行优先遍历每个元素。', '用线性序号映射到结果的商和余数位置。'],
    code: `class Solution:
    def matrixReshape(self, mat: List[List[int]], r: int, c: int) -> List[List[int]]:
        rows, cols = len(mat), len(mat[0])
        if rows * cols != r * c:
            return mat
        answer = [[0] * c for _ in range(r)]
        for index in range(rows * cols):
            answer[index // c][index % c] = mat[index // cols][index % cols]
        return answer`,
    walkthrough: { input: 'mat = [[1,2,3],[4,5,6]], r=3, c=2', steps: ['原矩阵与目标矩阵都含 6 个元素。', '线性序号 0、1 填入新矩阵第一行，2、3 填入第二行。', '最后两个元素 5、6 填入第三行。'], result: '返回 [[1,2],[3,4],[5,6]]。' },
    complexity: { time: 'O(mn)。', space: 'O(mn)，用于返回的新矩阵。' },
    pitfalls: ['元素总数不等时必须原样返回 mat。', '原列数 cols 与目标列数 c 在下标映射中不能混用。'],
    related: ['矩阵', '二维下标映射', '867 转置矩阵'],
  },

  575: {
    id: 575,
    title: '分糖果',
    summary: '把全部糖果平均分给妹妹一半，在数量限制下最大化她能获得的不同种类数。',
    constraints: ['糖果总数为偶数，妹妹必须得到其中一半。', '同一类型可重复出现，目标只统计不同类型数量。'],
    examples: [{ input: 'candyType = [1,1,2,2,3,3]', output: '3', explanation: '妹妹可拿 3 颗并分别选择类型 1、2、3。' }],
    intuition: '不同种类数既不能超过数组中真实类型总数，也不能超过妹妹可拿的糖果数；两者较小值一定可实现。',
    bruteForce: '枚举妹妹可获得的所有一半大小子集并统计类型，组合数量呈指数增长。',
    approach: ['用集合统计不同糖果类型数。', '计算妹妹可拿的数量 len(candyType)//2。', '答案不能超过上述任一上界。', '返回两个上界的较小值。'],
    code: `class Solution:
    def distributeCandies(self, candyType: List[int]) -> int:
        return min(len(set(candyType)), len(candyType) // 2)`,
    walkthrough: { input: 'candyType = [1,1,1,2]', steps: ['数组中只有类型 1 和 2，共 2 种。', '妹妹必须拿 2 颗，因此容量上限也是 2 种。', '选择一颗类型 1 和一颗类型 2 即可达到上界。'], result: '返回 2。' },
    complexity: { time: 'O(n)。', space: 'O(n)，集合最坏保存所有类型。' },
    pitfalls: ['不能只返回不同类型总数，妹妹拿取数量有限。', '题目最大化的是种类数，不是糖果价值或数量。'],
    related: ['哈希集合', '贪心', '分配上界'],
  },
  581: {
    id: 581,
    title: '最短无序连续子数组',
    summary: '找出最短连续区间，使其排序后整个数组变为非递减；原数组已有序时返回 0。',
    constraints: ['只允许选择一个连续子数组进行排序。', '数组可含重复值，目标整体顺序是非递减。'],
    examples: [{ input: 'nums = [2,6,4,8,10,9,15]', output: '5', explanation: '排序下标 1 到 5 的 [6,4,8,10,9] 后全数组有序。' }],
    intuition: '从左扫描维护历史最大值，当前值若小于它，说明当前位置必须纳入右边界；从右扫描维护历史最小值，当前值若大于它，说明必须纳入左边界。',
    bruteForce: '复制并排序整个数组，再找原数组与排序结果首尾不同位置，需 O(n log n) 时间和 O(n) 空间。',
    approach: ['从左到右维护 max_seen，遇到逆序值就更新 right。', '从右到左维护 min_seen，遇到逆序值就更新 left。', '若从未发现逆序，返回 0。', '否则返回 right-left+1。'],
    code: `class Solution:
    def findUnsortedSubarray(self, nums: List[int]) -> int:
        n = len(nums)
        right = -1
        max_seen = float("-inf")
        for i, value in enumerate(nums):
            max_seen = max(max_seen, value)
            if value < max_seen:
                right = i
        left = n
        min_seen = float("inf")
        for i in range(n - 1, -1, -1):
            min_seen = min(min_seen, nums[i])
            if nums[i] > min_seen:
                left = i
        return 0 if right == -1 else right - left + 1`,
    walkthrough: { input: 'nums = [1,3,2,2,4]', steps: ['左扫时下标 2、3 的值小于历史最大值 3，右边界最终为 3。', '右扫时下标 1 的值 3 大于右侧最小值 2，左边界为 1。', '需要排序的闭区间是 [1,3]。'], result: '返回长度 3。' },
    complexity: { time: 'O(n)，执行两次线性扫描。', space: 'O(1)。' },
    pitfalls: ['比较必须允许相等，非递减数组中的重复值不算逆序。', '已有序时 right 保持 -1，应返回 0。'],
    related: ['单调栈', '排序', '数组边界'],
  },
  583: {
    id: 583,
    title: '两个字符串的删除操作',
    summary: '只允许删除字符，求让两个字符串变得相同所需的最少删除次数。',
    constraints: ['两个字符串都只能通过删除字符，不能插入或替换。', '保留下来的相同字符串必须是二者的公共子序列。'],
    examples: [{ input: 'word1 = "sea", word2 = "eat"', output: '2', explanation: '从 sea 删除 s、从 eat 删除 t，二者都变为 ea。' }],
    intuition: '为了少删，应保留尽可能长的公共子序列 LCS。总删除数等于两个原长度之和减去两倍 LCS 长度。',
    bruteForce: '枚举两个字符串的所有子序列再求最长公共项，候选数量为指数级。',
    approach: ['用一维 dp[j] 表示当前前缀与 word2 前 j 字符的 LCS。', '逐字符扫描 word1，并保存更新前的左上角状态。', '字符相等时由左上角加一，否则取上方与左方最大值。', '用两串总长度减去 2×LCS。'],
    code: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        dp = [0] * (len(word2) + 1)
        for ch1 in word1:
            diagonal = 0
            for j, ch2 in enumerate(word2, 1):
                old = dp[j]
                if ch1 == ch2:
                    dp[j] = diagonal + 1
                else:
                    dp[j] = max(dp[j], dp[j - 1])
                diagonal = old
        lcs = dp[-1]
        return len(word1) + len(word2) - 2 * lcs`,
    walkthrough: { input: 'word1 = "sea", word2 = "eat"', steps: ['动态规划比较前缀，公共字符 e 可将 LCS 延长到 1。', '继续匹配 a，最长公共子序列变为 "ea"，长度 2。', '两串总长 6，减去保留的 2×2 个字符。'], result: '最少删除 2 次。' },
    complexity: { time: 'O(mn)。', space: 'O(n)，n 为 word2 长度。' },
    pitfalls: ['一维更新时要保存旧 dp[j] 作为下一格的左上角。', 'LCS 中每保留一个字符，会同时减少两边各一次删除。'],
    related: ['1143 最长公共子序列', '72 编辑距离', '动态规划'],
  },
  589: {
    id: 589,
    title: 'N 叉树的前序遍历',
    summary: '按“根节点，再从左到右递归访问各子树”的顺序返回 N 叉树节点值。',
    constraints: ['树可能为空，每个节点可有零个或多个 children。', '必须保持 children 数组给出的从左到右顺序。'],
    examples: [{ input: 'root = [1,null,3,2,4,null,5,6]', output: '[1,3,5,6,2,4]', explanation: '先访问根 1，再依次前序访问 3、2、4 的子树。' }],
    intuition: '栈是递归的显式版本。弹出节点时立即记录；为了让最左孩子最先弹出，孩子应按从右到左的顺序压栈。',
    bruteForce: '递归前序本身已是最优遍历，但极深树可能触发 Python 递归深度限制。',
    approach: ['空树直接返回空列表。', '把根节点压入栈。', '循环弹出节点、记录其值。', '将该节点的孩子按逆序压栈。'],
    code: `class Solution:
    def preorder(self, root: 'Node') -> List[int]:
        if root is None:
            return []
        answer = []
        stack = [root]
        while stack:
            node = stack.pop()
            answer.append(node.val)
            stack.extend(reversed(node.children))
        return answer`,
    walkthrough: { input: '根 1 的孩子为 [2,3,4]，2 的孩子为 [5]', steps: ['弹出根 1 并记录，将 4、3、2 依次压栈。', '弹出 2 并记录，再压入其孩子 5。', '访问 5 后继续弹出 3、4。'], result: '返回 [1,2,5,3,4]。' },
    complexity: { time: 'O(n)，每个节点访问一次。', space: 'O(n)，最坏栈中保存一层大量节点。' },
    pitfalls: ['直接按正序压入 children 会导致访问顺序反转。', '空根节点要返回空列表。'],
    related: ['590 N 叉树的后序遍历', '144 二叉树的前序遍历', '深度优先搜索'],
  },
  590: {
    id: 590,
    title: 'N 叉树的后序遍历',
    summary: '按“从左到右访问所有子树，最后访问根节点”的顺序返回 N 叉树节点值。',
    constraints: ['树可能为空，节点的孩子数量不固定。', '各子树必须遵循 children 的左到右次序。'],
    examples: [{ input: 'root = [1,null,3,2,4,null,5,6]', output: '[5,6,3,2,4,1]', explanation: '先完成各孩子子树，最后记录根 1。' }],
    intuition: '先做“根、从右到左孩子”的变体遍历，得到的序列整体反转后，恰好成为“从左到右孩子、根”的后序。',
    bruteForce: '递归后序代码简洁且同为 O(n)，但树过深时可能超过调用栈限制。',
    approach: ['空树返回空列表，并把根压栈。', '弹出节点，把值加入临时序列。', '按 children 正序压栈，使右侧孩子先被处理。', '将临时序列整体反转返回。'],
    code: `class Solution:
    def postorder(self, root: 'Node') -> List[int]:
        if root is None:
            return []
        order = []
        stack = [root]
        while stack:
            node = stack.pop()
            order.append(node.val)
            stack.extend(node.children)
        return order[::-1]`,
    walkthrough: { input: '根 1 的孩子为 [2,3]，2 的孩子为 [4]', steps: ['变体遍历先记录 1，并让右孩子 3 先弹出。', '临时顺序得到 [1,3,2,4]。', '整体反转临时顺序。'], result: '返回 [4,2,3,1]。' },
    complexity: { time: 'O(n)。', space: 'O(n)，保存栈与结果。' },
    pitfalls: ['此反转技巧中 children 应按正序压栈。', '不能只反转每个节点的孩子列表，最终还需反转整体访问序列。'],
    related: ['589 N 叉树的前序遍历', '145 二叉树的后序遍历', '深度优先搜索'],
  },
  594: {
    id: 594,
    title: '最长和谐子序列',
    summary: '寻找最长子序列，使其中最大值与最小值之差恰好为 1。',
    constraints: ['子序列无需连续，但要从原数组选择元素。', '差值必须恰好为 1，全相同元素不能单独构成和谐子序列。'],
    examples: [{ input: 'nums = [1,3,2,2,5,2,3,7]', output: '5', explanation: '选择三个 2 和两个 3，最大值与最小值相差 1。' }],
    intuition: '合法子序列只能由两个相邻整数 x 与 x+1 组成。频率表建立后，若两键都存在，全部选取它们一定最长。',
    bruteForce: '枚举所有子序列并检查极值，候选数量为 2ⁿ。',
    approach: ['统计每个数的出现频率。', '遍历频率表中的不同值 x。', '若 x+1 存在，候选长度为两者频率之和。', '返回所有候选的最大值。'],
    code: `class Solution:
    def findLHS(self, nums: List[int]) -> int:
        from collections import Counter
        count = Counter(nums)
        best = 0
        for value, freq in count.items():
            if value + 1 in count:
                best = max(best, freq + count[value + 1])
        return best`,
    walkthrough: { input: 'nums = [1,1,2,2,2,4]', steps: ['计数得到 1:2、2:3、4:1。', '相邻键 1 和 2 共同形成长度 5 的候选。', '键 2 没有 3，键 4 没有 5，不产生新候选。'], result: '返回 5。' },
    complexity: { time: 'O(n)。', space: 'O(n)。' },
    pitfalls: ['差值要求恰好为 1，不能把单一值频率计为答案。', '只检查 value+1 可避免同一对重复处理。'],
    related: ['哈希计数', '128 最长连续序列', '子序列'],
  },
  599: {
    id: 599,
    title: '两个列表的最小索引总和',
    summary: '找出同时出现在两个字符串列表中且两边下标之和最小的所有字符串。',
    constraints: ['每个列表内部字符串各不相同。', '可能有多个共同字符串并列达到最小索引和，需全部返回。'],
    examples: [{ input: 'list1 = ["Shogun","Tapioca"], list2 = ["Tapioca","Shogun"]', output: '["Tapioca","Shogun"]', explanation: '两个共同字符串的索引和都为 1。' }],
    intuition: '先记录第一个列表的字符串到下标映射，再扫描第二个列表即可在常数平均时间判断交集，并在线维护当前最小和及并列答案。',
    bruteForce: '对两个列表做双重循环比较所有字符串，需要 O(mn) 次比较。',
    approach: ['建立 list1 中字符串到下标的映射。', '扫描 list2，忽略不在映射中的字符串。', '索引和更小时清空答案并更新最优值。', '索引和等于最优值时追加该字符串。'],
    code: `class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        index = {name: i for i, name in enumerate(list1)}
        best = float("inf")
        answer = []
        for j, name in enumerate(list2):
            if name not in index:
                continue
            total = index[name] + j
            if total < best:
                best = total
                answer = [name]
            elif total == best:
                answer.append(name)
        return answer`,
    walkthrough: { input: 'list1=["A","B","C"], list2=["C","B","A"]', steps: ['建立映射 A:0、B:1、C:2。', '扫描 C 得索引和 2，随后 B 的索引和也为 2，加入并列答案。', 'A 的索引和仍为 2，同样追加。'], result: '返回 ["C","B","A"]（顺序可任意）。' },
    complexity: { time: 'O(m+n)。', space: 'O(m)，保存第一个列表的映射。' },
    pitfalls: ['发现更小索引和时必须清空旧答案。', '发现相等索引和时要追加，不能覆盖并列项。'],
    related: ['哈希表', '数组交集', '索引映射'],
  },
  605: {
    id: 605,
    title: '种花问题',
    summary: '判断能否在不相邻种花的规则下，向二进制花坛中再种至少 n 朵花。',
    constraints: ['flowerbed 中 1 表示已有花，输入保证已有花互不相邻。', '只能把 0 改为 1，且新旧花之间都不能相邻。'],
    examples: [{ input: 'flowerbed = [1,0,0,0,1], n = 1', output: 'true', explanation: '可在中间下标 2 种一朵。' }],
    intuition: '从左到右遇到左右均为空的位置就立即种花不会损失后续机会，因为这是当前可用的最左位置，推迟只可能占用更靠右空间。',
    bruteForce: '对每个空位递归选择种或不种并检查全部方案，最坏呈指数增长。',
    approach: ['从左到右扫描每个位置。', '当前位置为 0，且左邻不存在或为 0、右邻不存在或为 0 时种花。', '每种一朵就减少 n，并修改数组阻止相邻位置再种。', 'n 降到 0 时立即返回 true，扫描结束后判断是否完成。'],
    code: `class Solution:
    def canPlaceFlowers(self, flowerbed: List[int], n: int) -> bool:
        if n == 0:
            return True
        for i in range(len(flowerbed)):
            left_empty = i == 0 or flowerbed[i - 1] == 0
            right_empty = i == len(flowerbed) - 1 or flowerbed[i + 1] == 0
            if flowerbed[i] == 0 and left_empty and right_empty:
                flowerbed[i] = 1
                n -= 1
                if n == 0:
                    return True
        return False`,
    walkthrough: { input: 'flowerbed = [0,0,0,0,0], n = 3', steps: ['下标 0 左侧越界且右侧为空，种第一朵。', '跳过相邻下标 1，在下标 2 种第二朵。', '下标 4 的边界条件合法，种第三朵。'], result: '成功种满 3 朵，返回 true。' },
    complexity: { time: 'O(m)，m 为花坛长度。', space: 'O(1)。' },
    pitfalls: ['首尾位置缺失的邻居应视为空。', '种下后必须立刻写回 1，否则下一位置可能被错误种植。'],
    related: ['贪心', '数组模拟', '相邻约束'],
  },
};

import type { Lesson } from './lessons';

export const lessonsBatch3: Record<number, Lesson> = {
  27: {
    id: 27, title: '移除元素', summary: '原地移除所有等于 val 的元素，把保留元素压到数组前部并返回新长度；新长度之后的内容无需关心。',
    constraints: ['数组可能为空，也可能全部等于 val。', '允许改变元素顺序，但稳定覆盖法同样只需常数空间。'],
    examples: [{ input: 'nums = [3,2,2,3], val = 3', output: '2，nums 前两项为 [2,2]', explanation: '两个 3 被跳过，两个 2 依次写到前部。' }],
    intuition: '读指针检查每个值，写指针只在遇到应保留元素时前进，因此区间 [0, write) 始终恰好是已扫描部分的有效结果。', bruteForce: '每发现 val 就删除该项，数组后续元素会整体搬移，连续删除时最坏 O(n²)。',
    approach: ['令 write 指向下一个保留元素的落点。', '从左到右读取每个元素 x。', '若 x 等于 val，则只继续读取。', '否则把 x 写入 nums[write]。', '写入后递增 write，扫描结束返回 write。'],
    code: `class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        write = 0
        for x in nums:
            if x != val:
                nums[write] = x
                write += 1
        return write`,
    walkthrough: { input: 'nums=[0,1,2,2,3], val=2', steps: ['读取 0，写到位置 0。', '读取 1，写到位置 1。', '两个 2 均跳过，write 保持 2。', '读取 3，写到位置 2，write 变为 3。'], result: '返回 3，有效前缀为 [0,1,3]。' },
    complexity: { time: 'O(n)，每项读取一次。', space: 'O(1)，原地覆盖。' }, pitfalls: ['不要返回过滤后的新数组，接口要求长度。', '不能依赖新长度后的元素内容。'], related: ['26 删除有序数组中的重复项', '283 移动零'],
  },
  26: {
    id: 26, title: '删除有序数组中的重复项', summary: '在非递减数组中原地保留每个不同值一次，并返回唯一元素构成的前缀长度。',
    constraints: ['输入已排序，因此相同值必然连续。', '空数组应返回 0，不能直接访问首元素。'],
    examples: [{ input: 'nums = [0,0,1,1,2]', output: '3，前缀 [0,1,2]', explanation: '每段连续相同值只留下第一个。' }],
    intuition: '排序让新值只需与最后一个已保留值比较；不同就写到唯一前缀末尾，相同则忽略。', bruteForce: '反复删除相邻重复项会触发数组搬移，最坏 O(n²)。',
    approach: ['若数组为空，返回 0。', '令 write=1，首元素天然保留。', '从第二项开始扫描 x。', '当 x 不等于 nums[write-1] 时写到 nums[write]。', '每次写入递增 write，最后返回它。'],
    code: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if not nums:
            return 0
        write = 1
        for x in nums[1:]:
            if x != nums[write - 1]:
                nums[write] = x
                write += 1
        return write`,
    walkthrough: { input: 'nums=[1,1,2,2,3]', steps: ['首个 1 已保留，write=1。', '第二个 1 与前项相同，跳过。', '2 不同，写入位置 1。', '第二个 2 跳过，3 写入位置 2。'], result: '返回 3，前缀为 [1,2,3]。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['比较对象应是最后一个保留值，而非固定首项。', '空数组需要单独处理。'], related: ['27 移除元素', '80 删除有序数组中的重复项 II'],
  },
  80: {
    id: 80, title: '删除有序数组中的重复项 II', summary: '原地整理有序数组，使每个数最多出现两次，并返回合法前缀长度。',
    constraints: ['数组非递减，相同值连续出现。', '长度不足两项时所有元素都应保留。'],
    examples: [{ input: 'nums = [1,1,1,2,2,3]', output: '5，前缀 [1,1,2,2,3]', explanation: '第三个 1 被丢弃，其他出现次数不超过二。' }],
    intuition: '准备写入 x 时，只要它不同于结果中倒数第二项，写入后就不会形成三连；这一规则无需显式计数。', bruteForce: '统计后创建新数组很直接，但使用 O(n) 额外空间且不符合原地要求。',
    approach: ['令 write=0 表示合法前缀长度。', '依次读取有序数组中的 x。', '当前缀不足两项时无条件保留。', '否则仅当 x != nums[write-2] 时保留。', '写入 nums[write] 并递增，最终返回 write。'],
    code: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        write = 0
        for x in nums:
            if write < 2 or x != nums[write - 2]:
                nums[write] = x
                write += 1
        return write`,
    walkthrough: { input: 'nums=[0,0,0,1,1,1]', steps: ['前两个 0 无条件写入。', '第三个 0 等于结果倒数第二项，跳过。', '第一个 1 与倒数第二项不同，写入。', '第二个 1 写入，第三个 1 因会成为第三次而跳过。'], result: '返回 4，前缀 [0,0,1,1]。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['比较 write-2 前必须处理 write<2。', '读取值应来自遍历快照语义，写指针绝不能超过读进度。'], related: ['26 删除有序数组中的重复项', '27 移除元素'],
  },
  274: {
    id: 274, title: 'H 指数', summary: '寻找最大的 h，使至少 h 篇论文的引用次数不少于 h；排序后可从高引用端逐步扩大论文集合。',
    constraints: ['引用次数为非负整数，数组可为空。', 'h 不会超过论文总数，超大的引用值只表示满足阈值。'],
    examples: [{ input: 'citations = [3,0,6,1,5]', output: '3', explanation: '有 3 篇至少被引 3 次，但不足 4 篇至少被引 4 次。' }],
    intuition: '升序排序后，位置 i 右侧有 n-i 篇；若 citations[i] 至少为 n-i，这些论文共同支撑该候选 h。', bruteForce: '从 0 到 n 尝试每个 h，并每次重新统计达标论文，时间 O(n²)。',
    approach: ['把引用次数升序排序。', '从最小引用位置向右枚举 i。', '计算右侧论文数 h=n-i。', '若 citations[i] >= h，则右侧全部满足。', '第一次满足时 h 最大，直接返回；否则返回 0。'],
    code: `class Solution:
    def hIndex(self, citations: List[int]) -> int:
        citations.sort()
        n = len(citations)
        for i, value in enumerate(citations):
            h = n - i
            if value >= h:
                return h
        return 0`,
    walkthrough: { input: 'citations=[0,1,3,5,6]', steps: ['i=0 候选 h=5，0 不足。', 'i=1 候选 h=4，1 不足。', 'i=2 候选 h=3，引用 3 达标。', '这是从大候选向小候选的首次成功，立即返回。'], result: 'H 指数为 3。' },
    complexity: { time: 'O(n log n)，主要是排序。', space: '取决于语言排序实现，算法额外 O(1)。' }, pitfalls: ['条件是至少 h 篇且每篇至少 h 次，不要求恰好。', '返回引用次数本身可能超过论文数，应该返回 n-i。'], related: ['排序阈值统计', '计数排序'],
  },
  380: {
    id: 380, title: 'O(1) 时间插入、删除和获取随机元素', summary: '设计集合，使插入、删除和均匀随机取值都具有平均常数时间；数组负责随机访问，哈希表负责定位。',
    constraints: ['集合中元素唯一，insert 与 remove 要返回操作是否生效。', '调用 getRandom 时集合保证非空，所有现存元素概率相同。'],
    examples: [{ input: 'insert(1), insert(2), remove(1), getRandom()', output: 'true, true, true, 2', explanation: '删除 1 后集合只剩 2，随机结果必为 2。' }],
    intuition: '数组可等概率随机下标，但中间删除昂贵；删除时把末项搬到洞位再弹尾，并同步哈希下标，就避开整体移动。', bruteForce: '只用列表可随机取值，但查重和按值删除为 O(n)；只用集合则难以按下标均匀取样。',
    approach: ['用 values 保存紧凑元素，用 index 映射值到下标。', '插入前查哈希，存在则返回 False。', '新值追加到数组末尾并登记下标。', '删除时用末元素覆盖目标位置，再更新末元素下标。', '弹出数组末尾并删哈希键；getRandom 随机选择数组元素。'],
    code: `import random

class RandomizedSet:
    def __init__(self):
        self.values = []
        self.index = {}

    def insert(self, val: int) -> bool:
        if val in self.index:
            return False
        self.index[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.index:
            return False
        i = self.index[val]
        last = self.values[-1]
        self.values[i] = last
        self.index[last] = i
        self.values.pop()
        del self.index[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.values)`,
    walkthrough: { input: 'insert(4), insert(9), insert(7), remove(9)', steps: ['4、9、7 依次追加，数组为 [4,9,7]。', '哈希记录 9 的下标为 1。', '把末项 7 搬到下标 1，并把 7 的映射改为 1。', '弹出原末项并删除键 9，数组保持紧凑。'], result: '集合为 {4,7}，后续随机下标仍均匀。' },
    complexity: { time: '三种操作平均 O(1)。', space: 'O(n)，数组和哈希表各保存 n 个元素。' }, pitfalls: ['覆盖洞位后必须更新末元素的哈希下标。', '删除恰好是末元素时同一流程仍正确，删除哈希键应放在最后。'], related: ['384 打乱数组', '146 LRU 缓存'],
  },
  134: {
    id: 134, title: '加油站', summary: '在环形路线中寻找一个出发站，使油箱从零开始能完成一圈；若总油量不足总耗油则无解。',
    constraints: ['gas 与 cost 长度相同且站点数大于零。', '若存在解题目保证唯一，油量和消耗均非负。'],
    examples: [{ input: 'gas=[1,2,3,4,5], cost=[3,4,5,1,2]', output: '3', explanation: '从下标 3 出发，余额始终不负并最终回到起点。' }],
    intuition: '从候选 start 累积到 i 首次为负，说明 start 到 i 中任何站都不能成为起点，可把候选直接跳到 i+1；全局总差决定最终是否可行。', bruteForce: '从每个站模拟完整一圈，最坏 O(n²)。',
    approach: ['维护 total 表示全局油量差，tank 表示当前候选余额。', '逐站把 gas[i]-cost[i] 加入二者。', '若 tank 仍非负，继续验证当前候选。', '若 tank 变负，把 start 改为 i+1 并清零 tank。', '扫描后 total 非负则返回 start，否则返回 -1。'],
    code: `class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        total = tank = 0
        start = 0
        for i in range(len(gas)):
            diff = gas[i] - cost[i]
            total += diff
            tank += diff
            if tank < 0:
                start = i + 1
                tank = 0
        return start if total >= 0 else -1`,
    walkthrough: { input: 'gas=[2,3,4], cost=[3,4,2]', steps: ['站 0 差值 -1，候选跳到 1。', '站 1 差值 -1，候选跳到 2。', '站 2 差值 2，当前余额为 2。', '全局差值为 0，候选 2 能跨过前面的亏损段。'], result: '返回起点 2。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['局部余额非负不代表一定有解，最后必须检查 total。', '余额失败后应跳过整个已验证区间，而非只尝试原起点下一站重新模拟。'], related: ['135 分发糖果', '55 跳跃游戏'],
  },
  135: {
    id: 135, title: '分发糖果', summary: '给每个孩子至少一颗糖，并让评分更高的相邻孩子得到更多糖，求最少总数。',
    constraints: ['评分可相等，相等邻居之间没有大小要求。', '孩子至少一人，每人糖数必须为正整数。'],
    examples: [{ input: 'ratings = [1,0,2]', output: '5', explanation: '最少可分配 [2,1,2]，两侧高分者都多于中间。' }],
    intuition: '约束来自左右两个方向：左扫满足高于左邻，右扫满足高于右邻；每人取两种下界的最大值才同时合法且最小。', bruteForce: '从全 1 开始反复修正违反关系的位置，最坏会进行多轮传播，达到 O(n²)。',
    approach: ['创建全 1 的 candies 数组。', '从左向右扫描，若评分上升则设为左邻糖数加一。', '从右向左扫描，处理评分高于右邻的约束。', '右扫时取当前值与右邻加一的最大值，避免破坏左约束。', '累加最终数组并返回。'],
    code: `class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        candies = [1] * n
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                candies[i] = candies[i - 1] + 1
        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                candies[i] = max(candies[i], candies[i + 1] + 1)
        return sum(candies)`,
    walkthrough: { input: 'ratings=[1,3,4,2]', steps: ['初始糖果全为 1。', '左扫得到 [1,2,3,1]。', '右扫发现评分 4 高于 2，所需至少 2，但当前 3 更大。', '其余右向约束已满足，求和为 7。'], result: '最少需要 7 颗。' },
    complexity: { time: 'O(n)，两次扫描。', space: 'O(n)，保存每人的糖数。' }, pitfalls: ['右扫直接赋值会抹掉左扫建立的更大值，必须取 max。', '评分相等时不要求糖数递增。'], related: ['134 加油站', '406 根据身高重建队列'],
  },
  13: {
    id: 13, title: '罗马数字转整数', summary: '把规范罗马数字解析为整数；较小符号位于较大符号左边时表示减法，其余情况相加。',
    constraints: ['输入是合法规范罗马数字，仅含 I,V,X,L,C,D,M。', '减法组合可通过比较相邻值统一识别，无需列举所有二字符。'],
    examples: [{ input: 's = "MCMXCIV"', output: '1994', explanation: 'M=1000，CM=900，XC=90，IV=4。' }],
    intuition: '某符号若小于其右侧符号，就应作为减项；否则作为加项。最后一个符号右侧为空，必然相加。', bruteForce: '用大量字符串替换逐个处理特殊组合，容易遗漏且产生重复字符串扫描。',
    approach: ['建立七个符号到数值的映射。', '初始化 total=0。', '从左到右查看每个字符。', '若当前值小于右邻值则减去当前值。', '否则加上当前值；扫描结束返回 total。'],
    code: `class Solution:
    def romanToInt(self, s: str) -> int:
        value = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
        total = 0
        for i, ch in enumerate(s):
            if i + 1 < len(s) and value[ch] < value[s[i + 1]]:
                total -= value[ch]
            else:
                total += value[ch]
        return total`,
    walkthrough: { input: 's="XLII"', steps: ['X 的值 10 小于右侧 L 的 50，因此减 10。', 'L 不小于右侧 I，加 50。', '第一个 I 与右侧 I 相等，加 1。', '末尾 I 必然加 1。'], result: '得到 42。' },
    complexity: { time: 'O(n)。', space: 'O(1)，映射大小固定。' }, pitfalls: ['不能看到小符号就总做减法，必须与右邻比较。', '末字符没有右邻，应正常相加。'], related: ['12 整数转罗马数字', '字符串扫描'],
  },
  12: {
    id: 12, title: '整数转罗马数字', summary: '把范围内正整数编码成规范罗马表示，贪心使用从大到小的普通符号与减法组合。',
    constraints: ['输入位于标准罗马数字可表示的 1 到 3999。', '必须使用 IV、IX 等规范减法写法，而非重复四次同一符号。'],
    examples: [{ input: 'num = 1994', output: '"MCMXCIV"', explanation: '依次取 1000、900、90、4 的符号。' }],
    intuition: '把所有合法原子值按降序排列，每次取不超过余数的最大值，不会妨碍后续表示，并自然产生规范最短形式。', bruteForce: '分千百十个位写多层条件分支可行，但规则重复、容易漏掉 4 和 9 型特殊情况。',
    approach: ['准备按值降序排列的数值与符号表。', '创建空结果片段列表。', '逐个处理当前 value、symbol。', '用 divmod 得到可使用次数和剩余数值。', '追加对应次数的 symbol，余数归零后拼接返回。'],
    code: `class Solution:
    def intToRoman(self, num: int) -> str:
        pairs = [(1000,'M'),(900,'CM'),(500,'D'),(400,'CD'),(100,'C'),(90,'XC'),(50,'L'),(40,'XL'),(10,'X'),(9,'IX'),(5,'V'),(4,'IV'),(1,'I')]
        parts = []
        for value, symbol in pairs:
            count, num = divmod(num, value)
            if count:
                parts.append(symbol * count)
        return ''.join(parts)`,
    walkthrough: { input: 'num=58', steps: ['50 是不超过 58 的最大原子值，加入 L，余 8。', '5 可取一次，加入 V，余 3。', '4 大于余数而跳过。', '1 取三次加入 III。'], result: '得到 LVIII。' },
    complexity: { time: 'O(1)，表长和输出长度受 3999 上界限制。', space: 'O(1)，不计结果字符串。' }, pitfalls: ['映射表必须降序，否则会得到非规范表示。', '必须显式包含 900、400、90、40、9、4。'], related: ['13 罗马数字转整数', '贪心编码'],
  },
  58: {
    id: 58, title: '最后一个单词的长度', summary: '忽略字符串末尾空格，返回最后一段连续非空字符的长度。',
    constraints: ['字符串至少包含一个单词，单词之间可有多个空格。', '末尾可能没有空格，也可能有一串空格。'],
    examples: [{ input: 's = "  fly me   to   moon  "', output: '4', explanation: '去掉尾部空格后最后一段是 moon。' }],
    intuition: '从右侧先跨过无意义空格，再数到下一个空格或字符串开头，恰好只访问与答案有关的尾部。', bruteForce: 'split 后取最后单词很简洁，但会创建所有单词及列表，使用 O(n) 额外空间。',
    approach: ['令 i 指向字符串最后一位。', '当 s[i] 为空格时向左移动。', '初始化 length=0。', '继续向左扫描非空格字符并累加 length。', '遇到空格或越界时返回 length。'],
    code: `class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        i = len(s) - 1
        while i >= 0 and s[i] == ' ':
            i -= 1
        length = 0
        while i >= 0 and s[i] != ' ':
            length += 1
            i -= 1
        return length`,
    walkthrough: { input: 's="day is done   "', steps: ['i 从最后一个尾随空格开始。', '连续跳过三个空格后指向 e。', '向左计数 e、n、o、d 共四个字符。', '遇到单词前的空格后停止。'], result: '返回 4。' },
    complexity: { time: 'O(n) 最坏情况，实际只扫描尾部。', space: 'O(1)。' }, pitfalls: ['直接从末尾计数会把尾随空格算入。', '循环中必须检查 i>=0 后再访问字符。'], related: ['151 反转字符串中的单词', '字符串双指针'],
  },

  14: {
    id: 14, title: '最长公共前缀', summary: '找出所有字符串从第一个字符开始共同拥有的最长片段；任何一串在某位置不匹配都终止前缀。',
    constraints: ['字符串数组可含空串，出现空串时答案必为空。', '公共部分必须从每个字符串下标 0 开始，不能是中间子串。'],
    examples: [{ input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: '前两位 f、l 相同，第三位开始分歧。' }],
    intuition: '把第一个字符串当候选上界，逐列检查同一位置；越界或任意字符不同，就可立即返回此前部分。', bruteForce: '不断缩短候选前缀并对每个字符串调用前缀判断，某些输入会重复比较，最坏 O(nm²)。',
    approach: ['若数组为空，返回空串。', '枚举首字符串的下标 i 和字符 ch。', '依次检查其余每个字符串。', '若 i 越过某串长度或字符不同，返回首串切片 [:i]。', '若首串全部位置通过，返回首串本身。'],
    code: `class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ''
        for i, ch in enumerate(strs[0]):
            for word in strs[1:]:
                if i == len(word) or word[i] != ch:
                    return strs[0][:i]
        return strs[0]`,
    walkthrough: { input: 'strs=["inter","into","integer"]', steps: ['位置 0 的 i 在三串中一致。', '位置 1 的 n 也一致。', '位置 2 首串为 t，into 为 t。', 'integer 在位置 2 为 t，但位置 3 首串 e 与 into 的 o 不同。'], result: '返回 "int"。' },
    complexity: { time: 'O(S)，S 为实际比较过的字符总数。', space: 'O(1)，不计返回切片。' }, pitfalls: ['必须先判断短字符串越界再访问 word[i]。', '公共前缀与任意公共子串含义不同。'], related: ['28 找出字符串中第一个匹配项的下标', '字符串纵向扫描'],
  },
  6: {
    id: 6, title: 'Z 字形变换', summary: '把字符按多行上下往返排列，再逐行读取形成新字符串；核心是模拟当前行和方向。',
    constraints: ['numRows 为正数，可能大于字符串长度。', '一行时方向永远无需改变，应直接返回原串。'],
    examples: [{ input: 's="PAYPALISHIRING", numRows=3', output: '"PAHNAPLSIIGYIR"', explanation: '字符依次下行、斜向上行，最后按三行拼接。' }],
    intuition: '每个字符只属于一行；行号在 0 到 numRows-1 之间往返，到顶或到底时反转步长即可。', bruteForce: '构造完整二维字符网格再读行，会浪费大量空白格，空间可达 O(n·numRows)。',
    approach: ['一行或行数不少于字符数时直接返回。', '创建 numRows 个字符列表。', '维护 row 与 step，初始从第 0 行向下。', '把字符加入当前行，到顶或到底时反转 step。', '更新行号，最后拼接每行及所有行。'],
    code: `class Solution:
    def convert(self, s: str, numRows: int) -> str:
        if numRows == 1 or numRows >= len(s):
            return s
        rows = [[] for _ in range(numRows)]
        row, step = 0, 1
        for ch in s:
            rows[row].append(ch)
            if row == 0:
                step = 1
            elif row == numRows - 1:
                step = -1
            row += step
        return ''.join(''.join(line) for line in rows)`,
    walkthrough: { input: 's="ABCDE", numRows=3', steps: ['A 放第 0 行，方向向下。', 'B 放第 1 行，C 放第 2 行。', '到底后反向，D 放第 1 行。', 'E 回到第 0 行；逐行是 AE、BD、C。'], result: '返回 "AEBDC"。' },
    complexity: { time: 'O(n)。', space: 'O(n)，保存各行字符。' }, pitfalls: ['numRows=1 时若继续模拟会让行号越界。', '方向应在放置当前字符后依据当前边界调整。'], related: ['字符串模拟', '矩阵轨迹'],
  },
  28: {
    id: 28, title: '找出字符串中第一个匹配项的下标', summary: '返回 needle 在 haystack 中首次完整出现的起点，不存在则返回 -1；KMP 利用已匹配前缀避免回退主串。',
    constraints: ['needle 非空，字符可重复并产生大量前后缀重叠。', '要求最早匹配位置，找到首个完整匹配即可结束。'],
    examples: [{ input: 'haystack="sadbutsad", needle="sad"', output: '0', explanation: 'sad 在下标 0 和 6 出现，返回更早的 0。' }],
    intuition: '失配时，模式串已匹配部分的最长真前后缀仍可能继续匹配；lps 表告诉模式指针应跳到哪里，主串字符无需重读。', bruteForce: '枚举每个可能起点逐字符比较，重复模式下最坏 O(nm)。',
    approach: ['为 needle 构建 lps 数组。', '构建时失配就沿已有 lps 回退，匹配则扩展前缀长度。', '用 i 扫主串、j 扫模式串。', '匹配时二者前进，j 达模式长度即返回 i-j。', '失配且 j>0 时令 j=lps[j-1]，否则仅推进 i；结束返回 -1。'],
    code: `class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        lps = [0] * len(needle)
        length = 0
        for i in range(1, len(needle)):
            while length and needle[i] != needle[length]:
                length = lps[length - 1]
            if needle[i] == needle[length]:
                length += 1
                lps[i] = length
        j = 0
        for i, ch in enumerate(haystack):
            while j and ch != needle[j]:
                j = lps[j - 1]
            if ch == needle[j]:
                j += 1
                if j == len(needle):
                    return i - j + 1
        return -1`,
    walkthrough: { input: 'haystack="ababca", needle="abca"', steps: ['needle 的 lps 为 [0,0,0,1]。', '主串前四字符匹配到 aba 后在 b 对 c 失配。', '模式指针按 lps 回退，同时保留可复用前缀。', '随后从主串下标 2 连续匹配 abca。'], result: '返回 2。' },
    complexity: { time: 'O(n+m)，两根指针总回退受线性界限约束。', space: 'O(m)，存 lps。' }, pitfalls: ['失配回退的是模式指针，主串指针不能倒退。', '返回起点应为当前下标减模式长度再加一。'], related: ['14 最长公共前缀', 'KMP 字符串匹配'],
  },
  125: {
    id: 125, title: '验证回文串', summary: '忽略非字母数字字符并忽略大小写，判断清洗后的字符序列是否正反一致。',
    constraints: ['字符串可含空格、标点、数字和大小写字母。', '过滤后为空或只有一个字符时视为回文。'],
    examples: [{ input: 's="A man, a plan, a canal: Panama"', output: 'true', explanation: '忽略标点空格并转小写后正反相同。' }],
    intuition: '左右指针只停在有效字符上，每轮比较一对；任何不等即可否定，无需真的构造清洗字符串。', bruteForce: '先生成清洗后字符串再与逆序副本比较，时间 O(n) 但额外占 O(n) 空间。',
    approach: ['初始化 left=0、right=n-1。', '左侧非字母数字时持续右移。', '右侧非字母数字时持续左移。', '比较两端字符的小写形式，不同则返回 False。', '相同则两端内移，交错后返回 True。'],
    code: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        left, right = 0, len(s) - 1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True`,
    walkthrough: { input: 's="No lemon, no melon"', steps: ['两端 N 与 n 忽略大小写相同。', '跳过右侧标点或空格后继续比较。', '指针依次比较 o-o、l-l 等对称字符。', '所有有效字符都配对，指针最终相遇。'], result: '返回 true。' },
    complexity: { time: 'O(n)，每个位置至多越过一次。', space: 'O(1)。' }, pitfalls: ['数字也是有效字符，不能只检查字母。', '跳过无效字符的循环也要维持 left<right。'], related: ['680 验证回文串 II', '234 回文链表'],
  },
  392: {
    id: 392, title: '判断子序列', summary: '判断 s 能否通过从 t 删除若干字符且不改变剩余顺序得到；无需连续匹配。',
    constraints: ['s 或 t 都可能为空，空 s 总是任意 t 的子序列。', '同一 t 位置不能匹配 s 中多个字符。'],
    examples: [{ input: 's="abc", t="ahbgdc"', output: 'true', explanation: '在 t 中依次选下标 0、2、5 得到 abc。' }],
    intuition: '扫描 t 时，只要遇到 s 当前等待的字符就消费它；贪心选择最早位置为后续匹配留下最多空间。', bruteForce: '枚举 t 的所有删除组合再比较，候选数量为 2^n。',
    approach: ['令 i=0 指向 s 下一个待匹配字符。', '从左到右遍历 t 的字符 ch。', '若 i 尚未到末尾且 ch==s[i]，则 i 加一。', 'i 达 len(s) 时可立即返回 True。', '扫描结束返回 i==len(s)。'],
    code: `class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i = 0
        for ch in t:
            if i < len(s) and ch == s[i]:
                i += 1
                if i == len(s):
                    return True
        return i == len(s)`,
    walkthrough: { input: 's="ace", t="abcde"', steps: ['等待 a，t 首字符即匹配，i 到 1。', 'b 不等于等待的 c，跳过。', 'c 匹配，开始等待 e。', 'd 跳过，e 匹配后 s 全部完成。'], result: '返回 true。' },
    complexity: { time: 'O(|t|)，最坏扫描整个 t。', space: 'O(1)。' }, pitfalls: ['子序列不要求连续，不能调用子串查找。', '访问 s[i] 前要防止空 s 或 i 越界。'], related: ['1143 最长公共子序列', '双指针顺序匹配'],
  },
  167: {
    id: 167, title: '两数之和 II：输入有序数组', summary: '在升序数组中找两个不同位置，使其和等于目标值，并按题意返回从 1 开始的下标。',
    constraints: ['数组按非递减顺序排列且题目保证唯一解。', '必须使用两个不同元素，返回下标采用 1-based。'],
    examples: [{ input: 'numbers=[2,7,11,15], target=9', output: '[1,2]', explanation: '下标 0 与 1 的值相加为 9，转换成题目下标为 1、2。' }],
    intuition: '两端之和过小时，右端已是当前最大，只有增大左值才可能命中；过大时对称地缩小右值。', bruteForce: '枚举所有数对需要 O(n²)；逐项二分可达 O(n log n)，仍不如双指针。',
    approach: ['令 left 指向首项，right 指向末项。', '计算两端和 total。', '等于目标时返回 [left+1,right+1]。', 'total 小于目标则 left 右移。', 'total 大于目标则 right 左移，直到找到答案。'],
    code: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left, right = 0, len(numbers) - 1
        while left < right:
            total = numbers[left] + numbers[right]
            if total == target:
                return [left + 1, right + 1]
            if total < target:
                left += 1
            else:
                right -= 1
        return []`,
    walkthrough: { input: 'numbers=[1,3,4,6,8], target=10', steps: ['1+8=9，和偏小，左指针右移。', '3+8=11，和偏大，右指针左移。', '3+6=9，再次偏小。', '4+6=10 命中，内部下标为 2、3。'], result: '返回 [3,4]。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['返回值必须把零基下标加一。', '和偏小时不能移动右指针，否则只会更小。'], related: ['1 两数之和', '15 三数之和'],
  },
  209: {
    id: 209, title: '长度最小的子数组', summary: '在全为正整数的数组中，寻找和至少为 target 的最短连续子数组长度；不存在则返回 0。',
    constraints: ['数组元素均为正数，这是滑动窗口可单调收缩的关键。', '目标为正，答案要求连续且非空。'],
    examples: [{ input: 'target=7, nums=[2,3,1,2,4,3]', output: '2', explanation: '末尾子数组 [4,3] 的和达到 7，且不存在长度 1 的答案。' }],
    intuition: '右端扩张让和只增；一旦达标，就不断右移左端寻找同一右端下的最短窗口，移除正数后和只减。', bruteForce: '枚举起点向右累加直到达标，最坏 O(n²)。',
    approach: ['初始化 left=0、window=0、best 为无穷。', '右指针逐项扩张并把值加入 window。', '当 window>=target 时记录当前长度。', '减去 nums[left] 并右移 left，继续尝试收缩。', '扫描结束，无穷则返回 0，否则返回 best。'],
    code: `class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        left = 0
        window = 0
        best = len(nums) + 1
        for right, x in enumerate(nums):
            window += x
            while window >= target:
                best = min(best, right - left + 1)
                window -= nums[left]
                left += 1
        return 0 if best == len(nums) + 1 else best`,
    walkthrough: { input: 'target=8, nums=[2,3,1,5,4]', steps: ['右端扩到 5 时窗口和 11，长度 4 达标。', '移除 2 后和 9，长度 3 仍达标。', '再移除 3 后和 6，停止收缩。', '加入 4 后继续收缩，窗口 [5,4] 长度 2 成为最优。'], result: '返回 2。' },
    complexity: { time: 'O(n)，每项最多进入和离开窗口一次。', space: 'O(1)。' }, pitfalls: ['若允许负数，移除左项后和不再单调，此算法不成立。', '达标后要用 while 连续收缩而非只缩一次。'], related: ['76 最小覆盖子串', '560 和为 K 的子数组'],
  },
  30: {
    id: 30, title: '串联所有单词的子串', summary: '寻找所有起点，使长度固定的窗口恰由 words 中每个等长单词各使用一次拼成，顺序不限。',
    constraints: ['words 非空且所有单词长度相同，重复单词必须按次数匹配。', '候选起点可来自单词长度的不同余数轨道。'],
    examples: [{ input: 's="barfoofoobarthefoobarman", words=["bar","foo","the"]', output: '[6,9,12]', explanation: '三个起点后的三词窗口都恰好包含 bar、foo、the。' }],
    intuition: '按单词长度切块后问题变成固定词元序列上的滑动窗口；某词超出需求次数时，从左侧按整词收缩。', bruteForce: '枚举每个字符起点，切出全部词块后重新计数比较，时间约 O(n·k)，且大量重复统计。',
    approach: ['统计 words 的需求频次，记词长 width 与词数 count。', '对 offset=0 到 width-1 分别扫描对齐词块。', '右侧读到无关词时清空窗口并重置左端。', '相关词加入计数；若超量则逐词移出左端。', '窗口词数等于 count 时记录 left，并移出一个词继续寻找重叠答案。'],
    code: `from collections import Counter

class Solution:
    def findSubstring(self, s: str, words: List[str]) -> List[int]:
        need = Counter(words)
        width, count = len(words[0]), len(words)
        ans = []
        for offset in range(width):
            left = offset
            used = 0
            window = Counter()
            for right in range(offset, len(s) - width + 1, width):
                word = s[right:right + width]
                if word not in need:
                    window.clear(); used = 0; left = right + width
                    continue
                window[word] += 1; used += 1
                while window[word] > need[word]:
                    old = s[left:left + width]
                    window[old] -= 1; used -= 1; left += width
                if used == count:
                    ans.append(left)
                    old = s[left:left + width]
                    window[old] -= 1; used -= 1; left += width
        return ans`,
    walkthrough: { input: 's="wordgoodgoodgoodbestword", words=["word","good","best","good"]', steps: ['词长 4，从 offset 0 按块读取。', '读到 word、good、good 后窗口合法但词数不足。', '再读 good 导致 good 超量，从左移出 word 与一个 good。', '继续读 best、word 后窗口包含 word、good、good、best。'], result: '记录起点 8。' },
    complexity: { time: 'O(n)，每条对齐轨道中每个词块最多进出窗口一次。', space: 'O(u)，u 为不同单词数。' }, pitfalls: ['必须按每个 offset 扫描，否则会漏掉非零余数起点。', '只比较单词种类会忽略 words 中的重复次数。'], related: ['76 最小覆盖子串', '438 找到字符串中所有字母异位词'],
  },
  36: {
    id: 36, title: '有效的数独', summary: '检查已填数字是否在每行、每列和每个 3×3 宫内均不重复；空格不参与约束。',
    constraints: ['棋盘固定为 9×9，字符是 1 到 9 或点号。', '只验证当前状态，不要求判断是否存在完整解。'],
    examples: [{ input: '某行含两个字符 5', output: 'false', explanation: '即使两格位于不同宫，同一行重复也已违反规则。' }],
    intuition: '每个数字同时属于一个行集合、列集合与宫集合，扫描到已存在的键即可立即判无效。', bruteForce: '对每个已填格分别扫描整行、整列和宫，约 O(81×27)，虽可运行但重复比较多。',
    approach: ['创建 9 个行集合、9 个列集合和 9 个宫集合。', '逐格扫描棋盘，点号直接跳过。', '用 (r//3)*3+c//3 计算宫编号。', '若数字已在对应任一集合，返回 False。', '否则加入三个集合，全部扫描完返回 True。'],
    code: `class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        for r in range(9):
            for c in range(9):
                value = board[r][c]
                if value == '.':
                    continue
                box = (r // 3) * 3 + c // 3
                if value in rows[r] or value in cols[c] or value in boxes[box]:
                    return False
                rows[r].add(value); cols[c].add(value); boxes[box].add(value)
        return True`,
    walkthrough: { input: '在 (0,0) 与 (1,1) 都填 7', steps: ['扫描 (0,0)，把 7 加入第 0 行、列和左上宫。', '继续处理其他点号，不更新集合。', '到 (1,1) 时行和列中尚无 7。', '但左上宫集合已有 7，因此立即失败。'], result: '返回 false。' },
    complexity: { time: 'O(81)，推广为 n×n 时 O(n²)。', space: 'O(81)，固定棋盘下为常数。' }, pitfalls: ['点号不能加入集合，否则同一区域多个空格会被误判重复。', '宫编号需同时使用行块与列块。'], related: ['37 解数独', '矩阵哈希检查'],
  },
  289: {
    id: 289, title: '生命游戏', summary: '依据每格八邻域的旧状态同步更新棋盘；用额外状态编码同时保存旧值与新值可原地完成。',
    constraints: ['棋盘元素为 0 或 1，邻居包括水平、垂直和对角八个方向。', '所有格必须基于同一代旧状态更新，不能让新状态影响后续统计。'],
    examples: [{ input: 'board=[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]', output: '[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]', explanation: '按八邻域存活数同步产生下一代。' }],
    intuition: '令 2 表示旧死新活、-1 表示旧活新死；统计旧活时把 1 和 -1 都视为活，第二遍再归一化。', bruteForce: '复制整张旧棋盘再写新棋盘，逻辑简单但需 O(mn) 额外空间。',
    approach: ['逐格统计八个方向中旧状态为活的邻居数。', '把值 1 或 -1 的邻格都计作旧活。', '旧活且邻居数不在 2、3 时标为 -1。', '旧死且恰有 3 个活邻居时标为 2。', '第二遍把正数写为 1，非正数写为 0。'],
    code: `class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        rows, cols = len(board), len(board[0])
        directions = [(dr, dc) for dr in (-1, 0, 1) for dc in (-1, 0, 1) if dr or dc]
        for r in range(rows):
            for c in range(cols):
                live = 0
                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] in (1, -1):
                        live += 1
                if board[r][c] == 1 and live not in (2, 3):
                    board[r][c] = -1
                elif board[r][c] == 0 and live == 3:
                    board[r][c] = 2
        for r in range(rows):
            for c in range(cols):
                board[r][c] = 1 if board[r][c] > 0 else 0`,
    walkthrough: { input: 'board=[[1,1,1],[0,0,0]]', steps: ['左上活格只有一个旧活邻居，标为 -1。', '中上活格有两个邻居，保持 1。', '右上活格同样标为 -1。', '下中死格恰有三个旧活邻居，标为 2；归一化得到新代。'], result: 'board 变为 [[0,1,0],[0,1,0]]。' },
    complexity: { time: 'O(mn)，每格检查固定八邻居。', space: 'O(1)，方向列表大小固定。' }, pitfalls: ['统计邻居时 -1 仍代表旧活，2 仍代表旧死。', '不能在第一遍直接覆盖成 0 或 1。'], related: ['73 矩阵置零', '矩阵状态编码'],
  },

  205: {
    id: 205, title: '同构字符串', summary: '判断两个等长字符串能否通过字符的一一映射互相转换；映射必须一致且不同源字符不能指向同一目标字符。',
    constraints: ['两个字符串长度相同，字符出现顺序需保持。', '映射是双射约束：同源同目标，不同源也必须不同目标。'],
    examples: [{ input: 's="egg", t="add"', output: 'true', explanation: 'e 映射 a，g 映射 d，所有位置一致且无目标冲突。' }],
    intuition: '同时维护 s→t 和 t→s 两张表，任一方向已有映射与当前位置矛盾都说明不可能。', bruteForce: '对每对位置比较“s 字符是否相等”与“t 字符是否相等”，可验证结构但需 O(n²)。',
    approach: ['建立 forward 与 backward 两个空映射。', '同步遍历字符 a、b。', '若 a 已映射且目标不是 b，返回 False。', '若 b 已反向映射且来源不是 a，也返回 False。', '登记双向映射，扫描完成返回 True。'],
    code: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        forward, backward = {}, {}
        for a, b in zip(s, t):
            if a in forward and forward[a] != b:
                return False
            if b in backward and backward[b] != a:
                return False
            forward[a] = b
            backward[b] = a
        return True`,
    walkthrough: { input: 's="paper", t="title"', steps: ['p→t 首次登记。', 'a→i、p→t 都一致。', 'e→l 登记后，两个方向仍无冲突。', 'r→e 登记，全部位置满足同一双射。'], result: '返回 true。' },
    complexity: { time: 'O(n)。', space: 'O(k)，k 为不同字符数。' }, pitfalls: ['只检查 s→t 会错误接受 ab→cc。', '不能依赖字符出现次数相同来代替位置映射。'], related: ['290 单词规律', '242 有效的字母异位词'],
  },
  290: {
    id: 290, title: '单词规律', summary: '判断模式字符与句中单词是否形成一一对应关系，每个模式位置必须对应同一个完整单词。',
    constraints: ['句子以单个或若干空格分词，模式长度必须等于单词数。', '不同模式字符不能映射到同一单词。'],
    examples: [{ input: 'pattern="abba", s="dog cat cat dog"', output: 'true', explanation: 'a 对应 dog，b 对应 cat，双向关系一致。' }],
    intuition: '这是字符与单词之间的双射；先检查数量，再用两张映射同步约束两个方向。', bruteForce: '对所有位置对比较模式字符相等性与单词相等性，时间 O(n²)。',
    approach: ['用 split 得到单词数组。', '若单词数与模式长度不同，立即返回 False。', '创建字符到单词与单词到字符两张表。', '逐对检查已有映射是否冲突。', '无冲突则登记，遍历结束返回 True。'],
    code: `class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        words = s.split()
        if len(pattern) != len(words):
            return False
        to_word, to_char = {}, {}
        for ch, word in zip(pattern, words):
            if ch in to_word and to_word[ch] != word:
                return False
            if word in to_char and to_char[word] != ch:
                return False
            to_word[ch] = word
            to_char[word] = ch
        return True`,
    walkthrough: { input: 'pattern="abba", s="dog cat cat fish"', steps: ['长度都为 4，继续。', '登记 a→dog、b→cat。', '第三项 b→cat 与已有映射一致。', '第四项 a 本应对应 dog，却遇到 fish。'], result: '返回 false。' },
    complexity: { time: 'O(n)，分词总字符处理也是线性。', space: 'O(n)，保存单词与映射。' }, pitfalls: ['必须先验证模式长度与单词数相等。', '只做单向映射会接受 ab 与 dog dog。'], related: ['205 同构字符串', '49 字母异位词分组'],
  },
  242: {
    id: 242, title: '有效的字母异位词', summary: '判断两个字符串是否包含完全相同的字符多重集合，只允许排列顺序不同。',
    constraints: ['字符重复次数必须相同，长度不同必然不是异位词。', '实现可适配一般字符，不必假设仅有 26 个小写字母。'],
    examples: [{ input: 's="anagram", t="nagaram"', output: 'true', explanation: '两串中 a 出现三次，其余字符频次也逐一相同。' }],
    intuition: '顺序不重要而频次重要；先为 s 加计数，再由 t 抵消，任何欠账或最终非零都代表不一致。', bruteForce: '对每个字符在另一字符串中线性寻找并删除，字符串搬移会使最坏 O(n²)。',
    approach: ['若长度不同，返回 False。', '建立空频次字典。', '遍历 s，把每个字符计数加一。', '遍历 t，把对应计数减一；若字符不存在或降为负数则失败。', '全部抵消后返回 True。'],
    code: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = {}
        for ch in s:
            count[ch] = count.get(ch, 0) + 1
        for ch in t:
            if count.get(ch, 0) == 0:
                return False
            count[ch] -= 1
        return True`,
    walkthrough: { input: 's="aacc", t="ccac"', steps: ['长度同为 4。', '统计 s 得 a:2、c:2。', 't 的两个 c 抵消 c 计数。', '再抵消一个 a 后，最后 c 已无余额，发生欠账。'], result: '返回 false。' },
    complexity: { time: 'O(n)。', space: 'O(k)，k 为字符种类数。' }, pitfalls: ['集合相等不能反映重复次数。', '若不先检查长度，单向抵消后仍需检查剩余正计数。'], related: ['49 字母异位词分组', '205 同构字符串'],
  },
  202: {
    id: 202, title: '快乐数', summary: '反复把整数替换为各位平方和，判断过程最终是否到达 1；未到 1 的序列会进入循环。',
    constraints: ['输入为正整数，计算过程中位数会变化。', '不能仅设置固定迭代次数猜测终止，应明确检测循环。'],
    examples: [{ input: 'n=19', output: 'true', explanation: '19→82→68→100→1，最终到达 1。' }],
    intuition: '状态是确定性转移：若没有到达 1，有限范围中的值必会重复。快慢指针可像链表判环一样区分终点 1 与非 1 环。', bruteForce: '用集合记录所有出现值也能线性检测环，但需要保存 O(k) 个状态。',
    approach: ['定义 next_value 计算十进制各位平方和。', '令 slow=n，fast=next_value(n)。', 'slow 每轮转移一次，fast 转移两次。', '二者未相遇时持续推进。', '相遇后若值为 1 则快乐，否则落入非 1 循环。'],
    code: `class Solution:
    def isHappy(self, n: int) -> bool:
        def next_value(x: int) -> int:
            total = 0
            while x:
                x, digit = divmod(x, 10)
                total += digit * digit
            return total
        slow, fast = n, next_value(n)
        while slow != fast:
            slow = next_value(slow)
            fast = next_value(next_value(fast))
        return slow == 1`,
    walkthrough: { input: 'n=19', steps: ['slow 从 19 开始，fast 从 82 开始。', 'slow 到 82，fast 经过 68 到 100。', '继续推进后快指针先进入 1 的自环。', '慢指针也最终到 1，二者相遇。'], result: '返回 true。' },
    complexity: { time: 'O(log n) 级别进入有限状态环，实际状态数很小。', space: 'O(1)。' }, pitfalls: ['平方和必须逐位计算，不能平方整个数字。', '相遇只说明进入环，还要判断环是否是值 1。'], related: ['141 环形链表', '数位运算'],
  },
  219: {
    id: 219, title: '存在重复元素 II', summary: '判断是否存在值相等的两个下标，且二者距离不超过 k；哈希表保存每个值最近一次位置。',
    constraints: ['k 可为 0，此时不同下标不可能满足距离要求。', '数组可含负数和多次重复，最近位置对未来最有利。'],
    examples: [{ input: 'nums=[1,2,3,1], k=3', output: 'true', explanation: '值 1 出现在下标 0 和 3，距离恰为 3。' }],
    intuition: '扫描到 x 时，只需和 x 最近的旧位置比较；更早位置距离只会更大，更新成当前下标不会漏解。', bruteForce: '对每个下标向后检查最多 k 个位置，最坏 O(nk)。',
    approach: ['创建 last 映射数值到最近下标。', '从左到右枚举 i、x。', '若 x 已出现，计算 i-last[x]。', '距离不超过 k 时立即返回 True。', '把 last[x] 更新为 i；扫描结束返回 False。'],
    code: `class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        last = {}
        for i, x in enumerate(nums):
            if x in last and i - last[x] <= k:
                return True
            last[x] = i
        return False`,
    walkthrough: { input: 'nums=[1,0,1,1], k=1', steps: ['下标 0 记录 1→0。', '下标 1 记录 0→1。', '下标 2 的 1 距旧位置 2，大于 k，更新 1→2。', '下标 3 的 1 距最近位置 1，满足条件。'], result: '返回 true。' },
    complexity: { time: 'O(n) 期望时间。', space: 'O(n)，最坏所有值不同。' }, pitfalls: ['保存首次位置而不更新，会漏掉后面更近的重复对。', '条件是 <=k，不是严格小于。'], related: ['217 存在重复元素', '220 存在重复元素 III'],
  },
  57: {
    id: 57, title: '插入区间', summary: '把新区间插入已按起点排序且互不重叠的区间表，并合并所有与它重叠的区间。',
    constraints: ['原区间按起点升序且彼此不重叠。', '区间为闭区间，端点相接应视为可合并。'],
    examples: [{ input: 'intervals=[[1,3],[6,9]], newInterval=[2,5]', output: '[[1,5],[6,9]]', explanation: '新区间与 [1,3] 重叠，合并为 [1,5]。' }],
    intuition: '结果分三段：完全在新区间左边的原区间、与新区间重叠并合并成的一段、完全在右边的剩余区间。', bruteForce: '追加新区间后整体排序再统一合并，时间 O(n log n)，没有利用原列表已排序。',
    approach: ['先追加所有 end < newStart 的左侧区间。', '随后处理 start <= newEnd 的重叠区间。', '用最小起点和最大终点持续扩张新区间。', '重叠结束后把合并区间加入结果。', '把剩余右侧区间原样追加并返回。'],
    code: `class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        ans = []
        i, n = 0, len(intervals)
        while i < n and intervals[i][1] < newInterval[0]:
            ans.append(intervals[i]); i += 1
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        ans.append(newInterval)
        ans.extend(intervals[i:])
        return ans`,
    walkthrough: { input: 'intervals=[[1,2],[4,5],[7,9]], new=[3,8]', steps: ['[1,2] 完全在左侧，直接加入。', '[4,5] 与新区间重叠，合并范围变 [3,8]。', '[7,9] 继续重叠，扩成 [3,9]。', '无剩余区间，追加合并段。'], result: '返回 [[1,2],[3,9]]。' },
    complexity: { time: 'O(n)。', space: 'O(n)，用于返回结果。' }, pitfalls: ['左侧判定应是 end < newStart，等于端点仍重叠。', '合并时新区间终点可能扩张，循环条件要读取更新后的终点。'], related: ['56 合并区间', '228 汇总区间'],
  },
  452: {
    id: 452, title: '用最少数量的箭引爆气球', summary: '每支竖直箭可引爆横轴区间覆盖其位置的所有气球，求覆盖全部区间所需最少箭数。',
    constraints: ['气球区间端点可很大且可为负。', '闭区间端点相等时，一支射在该端点的箭可同时命中。'],
    examples: [{ input: 'points=[[10,16],[2,8],[1,6],[7,12]]', output: '2', explanation: '可在 6 射中前两类，在 11 附近射中其余气球。' }],
    intuition: '按右端点排序后，把箭射在最早结束位置最不浪费右侧空间；后续只要起点不超过该位置就被同一箭覆盖。', bruteForce: '尝试每个端点作为箭位置并搜索最小覆盖组合，组合数量呈指数增长。',
    approach: ['若没有气球，返回 0。', '按区间右端点升序排序。', '先用一支箭射在第一个右端点。', '扫描后续区间，若 start<=arrow 则已覆盖。', '若 start>arrow，则新增一箭并把位置更新为该区间右端点。'],
    code: `class Solution:
    def findMinArrowShots(self, points: List[List[int]]) -> int:
        if not points:
            return 0
        points.sort(key=lambda p: p[1])
        arrows = 1
        arrow = points[0][1]
        for start, end in points[1:]:
            if start > arrow:
                arrows += 1
                arrow = end
        return arrows`,
    walkthrough: { input: 'points=[[1,2],[2,3],[4,5],[5,6]]', steps: ['按右端点顺序不变，首箭放在 2。', '[2,3] 起点等于 2，也被首箭命中。', '[4,5] 起点大于 2，新增箭在 5。', '[5,6] 起点等于 5，被第二箭命中。'], result: '返回 2。' },
    complexity: { time: 'O(n log n)，排序占主导。', space: '取决于排序实现。' }, pitfalls: ['按起点贪心不如按最早结束点直接。', '闭区间相交条件包含相等，只有 start>arrow 才需新箭。'], related: ['435 无重叠区间', '56 合并区间'],
  },
  71: {
    id: 71, title: '简化路径', summary: '把 Unix 风格绝对路径规范化：消除重复斜杠、当前目录点号和可返回上层的双点号。',
    constraints: ['输入是以斜杠开头的绝对路径。', '根目录之上仍是根，普通含点名称不能当特殊指令。'],
    examples: [{ input: 'path="/a/./b/../../c/"', output: '"/c"', explanation: '点号忽略，两个双点号依次弹出 b 与 a。' }],
    intuition: '按斜杠切分后，栈保存规范路径中的有效目录；普通名称入栈，双点号弹栈，空段和单点忽略。', bruteForce: '反复做字符串替换很难正确处理根边界、连续斜杠以及名为三个点的目录。',
    approach: ['按 / 分割路径得到各段。', '创建空栈保存有效目录名。', '空段或 . 直接跳过。', '遇到 .. 时若栈非空则弹出一级。', '其他段原样入栈，最后用 / 连接并补前导斜杠。'],
    code: `class Solution:
    def simplifyPath(self, path: str) -> str:
        stack = []
        for part in path.split('/'):
            if not part or part == '.':
                continue
            if part == '..':
                if stack:
                    stack.pop()
            else:
                stack.append(part)
        return '/' + '/'.join(stack)`,
    walkthrough: { input: 'path="/home//foo/../bar/."', steps: ['空段与重复斜杠被切分后忽略。', 'home、foo 依次入栈。', '.. 弹出 foo。', 'bar 入栈，末尾 . 忽略。'], result: '返回 "/home/bar"。' },
    complexity: { time: 'O(n)，切分与拼接总长度线性。', space: 'O(n)，栈保存目录段。' }, pitfalls: ['根目录遇到 .. 时不能弹出不存在的元素。', '只有恰好为 . 或 .. 的段特殊，... 是普通目录名。'], related: ['150 逆波兰表达式求值', '20 有效的括号'],
  },
  150: {
    id: 150, title: '逆波兰表达式求值', summary: '计算后缀表达式：数字入栈，运算符弹出最近两个操作数并把结果压回；除法向零截断。',
    constraints: ['表达式保证有效且除数不为零。', '减法和除法有操作数顺序，先弹出的是右操作数。'],
    examples: [{ input: 'tokens=["2","1","+","3","*"]', output: '9', explanation: '先算 2+1=3，再算 3×3=9。' }],
    intuition: '后缀表达式让运算符出现时其两个操作数已经完成并位于栈顶，因此无需括号和优先级规则。', bruteForce: '不断扫描并替换第一个“数字 数字 运算符”片段，会反复移动列表，最坏 O(n²)。',
    approach: ['创建空整数栈与运算符集合。', '数字令其转成 int 后入栈。', '遇到运算符时先弹出 b，再弹出 a。', '按 a op b 计算；除法用 int(a/b) 向零截断。', '把结果压栈，扫描结束返回唯一栈顶。'],
    code: `class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for token in tokens:
            if token not in {'+', '-', '*', '/'}:
                stack.append(int(token))
                continue
            b = stack.pop()
            a = stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            else: stack.append(int(a / b))
        return stack[-1]`,
    walkthrough: { input: 'tokens=["4","13","5","/","+"]', steps: ['4 入栈。', '13 与 5 依次入栈。', '/ 弹出 b=5、a=13，计算 13/5 向零取 2。', '+ 弹出 2 与 4，压入 6。'], result: '返回 6。' },
    complexity: { time: 'O(n)。', space: 'O(n)，最坏连续数字入栈。' }, pitfalls: ['弹栈顺序不能写成 b-a 或 b/a。', 'Python 的 // 对负数向下取整，不符合向零截断。'], related: ['224 基本计算器', '20 有效的括号'],
  },
  224: {
    id: 224, title: '基本计算器', summary: '计算含非负整数、加减号、括号和空格的表达式；栈保存进入括号前的累计结果与外部符号。',
    constraints: ['表达式有效，可含一元负号与多位整数。', '只需处理加减和括号，空格没有语义。'],
    examples: [{ input: 's="(1+(4+5+2)-3)+(6+8)"', output: '23', explanation: '各括号子表达式按外层符号合并后总值为 23。' }],
    intuition: 'result 保存当前括号层已累计值，sign 表示下一个数字的符号；遇到左括号就暂存外层环境，右括号时把整段视为一个数合并。', bruteForce: '递归寻找最内层括号并反复切片替换，可能产生 O(n²) 字符串复制。',
    approach: ['维护 result=0、number=0、sign=1 和栈。', '数字字符用于扩展多位 number。', '遇到加减号时先把 sign*number 加入 result，再更新 sign。', '遇到左括号时压入 result、sign，并重置当前层。', '遇到右括号时结算 number，再乘外层符号并加外层结果；末尾再结算一次。'],
    code: `class Solution:
    def calculate(self, s: str) -> int:
        result = number = 0
        sign = 1
        stack = []
        for ch in s:
            if ch.isdigit():
                number = number * 10 + int(ch)
            elif ch in '+-':
                result += sign * number
                number = 0
                sign = 1 if ch == '+' else -1
            elif ch == '(':
                stack.append(result); stack.append(sign)
                result = number = 0; sign = 1
            elif ch == ')':
                result += sign * number
                number = 0
                outer_sign = stack.pop()
                outer_result = stack.pop()
                result = outer_result + outer_sign * result
        return result + sign * number`,
    walkthrough: { input: 's="2-(1+3)"', steps: ['读取 2，遇到减号后结算 result=2、sign=-1。', '左括号压入外层结果 2 与符号 -1，并重置。', '括号内算得 1+3=4。', '右括号合并为 2+(-1)×4=-2。'], result: '返回 -2。' },
    complexity: { time: 'O(n)，单次扫描。', space: 'O(d)，d 为括号嵌套深度。' }, pitfalls: ['遇到运算符或右括号时必须先结算已经读取的 number。', '压栈顺序与弹栈顺序要配对，外层符号作用于整个括号值。'], related: ['227 基本计算器 II', '150 逆波兰表达式求值'],
  },

  92: {
    id: 92, title: '反转链表 II', summary: '只反转单链表从 left 到 right 的连续区间，其余节点顺序不变；哑节点统一处理从头开始反转。',
    constraints: ['位置按 1 开始且 1<=left<=right<=链表长度。', '要求原地重连节点，不能只交换节点值。'],
    examples: [{ input: 'head=[1,2,3,4,5], left=2, right=4', output: '[1,4,3,2,5]', explanation: '区间 2→3→4 被翻转为 4→3→2。' }],
    intuition: '先定位反转区间前驱 prev，再重复把 curr 后面的节点摘下并插到 prev 后面，区间头会逐步变成区间尾。', bruteForce: '把所有节点放入数组，反转指定切片再重连，时间 O(n) 但需 O(n) 额外空间。',
    approach: ['创建 dummy 指向 head。', '让 prev 前进到第 left 个节点的前一个位置。', '令 curr=prev.next，它最终成为反转段尾。', '重复 right-left 次：摘下 curr.next。', '把摘下节点插到 prev 后，最后返回 dummy.next。'],
    code: `class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        for _ in range(left - 1):
            prev = prev.next
        curr = prev.next
        for _ in range(right - left):
            moved = curr.next
            curr.next = moved.next
            moved.next = prev.next
            prev.next = moved
        return dummy.next`,
    walkthrough: { input: 'head=[1,2,3,4], left=2, right=4', steps: ['prev 定位节点 1，curr 为 2。', '摘下 3 插到 1 后，链变 1→3→2→4。', '摘下 curr 后的 4 插到 1 后。', '得到 1→4→3→2，curr 作为段尾连接后续。'], result: '返回 [1,4,3,2]。' },
    complexity: { time: 'O(n)，定位和反转均为线性总量。', space: 'O(1)。' }, pitfalls: ['反转从头开始时没有 dummy 会缺少区间前驱。', '每轮摘取的是 curr.next，curr 本身保持为反转段尾。'], related: ['206 反转链表', '25 K 个一组翻转链表'],
  },
  61: {
    id: 61, title: '旋转链表', summary: '把链表向右旋转 k 位，即把末尾 k 个节点整体移到头部；可先成环再在新尾处断开。',
    constraints: ['链表可能为空或只有一个节点，k 可远大于长度。', '节点相对顺序在两段内部保持不变。'],
    examples: [{ input: 'head=[1,2,3,4,5], k=2', output: '[4,5,1,2,3]', explanation: '末尾两节点移动到原头之前。' }],
    intuition: '尾接头形成环后，旋转只是在环上选择新断点；新尾是原头向前走 n-k%n-1 步的位置。', bruteForce: '重复 k 次寻找尾节点并搬到头部，每次 O(n)，总计 O(nk)。',
    approach: ['空链或单节点直接返回。', '遍历得到长度 n 与尾节点。', '令 k%=n，若为 0 直接返回原头。', '把 tail.next 指向 head 形成环。', '走 n-k 步找到新头，其前驱断开为新尾。'],
    code: `class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        n, tail = 1, head
        while tail.next:
            tail = tail.next
            n += 1
        k %= n
        if k == 0:
            return head
        tail.next = head
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head`,
    walkthrough: { input: 'head=[1,2,3,4,5], k=7', steps: ['测得 n=5，k 取模后为 2。', '尾节点 5 连接头节点 1 成环。', '新尾应从头走 5-2-1=2 步到节点 3。', '新头为 4，在 3 后断开环。'], result: '返回 [4,5,1,2,3]。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['必须先对 k 取模，且 k=0 时无需成环。', '断环位置是第 n-k 个节点作为新尾，注意减一的步数。'], related: ['189 轮转数组', '92 反转链表 II'],
  },
  86: {
    id: 86, title: '分隔链表', summary: '按阈值 x 把节点稳定分成“小于 x”和“大于等于 x”两段，并保持每段原有相对次序。',
    constraints: ['链表可为空，节点值可重复或为负。', '必须复用节点且保持两组内部顺序。'],
    examples: [{ input: 'head=[1,4,3,2,5,2], x=3', output: '[1,2,2,4,3,5]', explanation: '小于 3 的节点按 1、2、2 排列，其余按 4、3、5 排列。' }],
    intuition: '分别维护两条尾插链，扫描时按值接入对应尾部，最后把小链尾接到大链头。', bruteForce: '把值收集排序会破坏稳定性；创建新节点虽简单但需要 O(n) 新空间并丢失节点身份。',
    approach: ['创建 beforeDummy 与 afterDummy 两个哑节点。', '分别维护 before、after 尾指针。', '遍历原链，值小于 x 的节点接入 before。', '其余节点接入 after。', '令 after.next=None 断开旧尾关系，再连接两段并返回。'],
    code: `class Solution:
    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        before_dummy = ListNode(0)
        after_dummy = ListNode(0)
        before, after = before_dummy, after_dummy
        while head:
            if head.val < x:
                before.next = head
                before = before.next
            else:
                after.next = head
                after = after.next
            head = head.next
        after.next = None
        before.next = after_dummy.next
        return before_dummy.next`,
    walkthrough: { input: 'head=[3,1,2,4], x=3', steps: ['3 接入大段。', '1 接入小段，成为小段首节点。', '2 继续尾插小段，顺序为 1→2。', '4 尾插大段，断尾后连接为 1→2→3→4。'], result: '返回 [1,2,3,4]。' },
    complexity: { time: 'O(n)。', space: 'O(1)，仅使用固定哑节点和指针。' }, pitfalls: ['最后必须令 after.next=None，否则旧 next 可能形成环。', '使用头插会反转组内顺序，不满足稳定分隔。'], related: ['328 奇偶链表', '27 移除元素'],
  },
  82: {
    id: 82, title: '删除排序链表中的重复元素 II', summary: '删除有序链表中所有出现次数超过一次的值，只保留原本恰好出现一次的节点。',
    constraints: ['链表已按非递减顺序排列，重复值连续。', '头部也可能是一整段重复值，因此需要哑节点。'],
    examples: [{ input: 'head=[1,2,3,3,4,4,5]', output: '[1,2,5]', explanation: '值 3 和 4 都出现多次，其全部节点均被删除。' }],
    intuition: 'prev 始终指向确认保留部分的尾；若 curr 与后继同值，就越过整个相同值区段，并让 prev.next 指向区段之后。', bruteForce: '先用哈希统计每个值次数，再第二遍重连，需 O(n) 额外空间且未利用有序性。',
    approach: ['创建 dummy 指向 head，prev 指向 dummy。', '令 curr 扫描链表。', '若 curr 与 curr.next 同值，记住 duplicate。', '越过所有值等于 duplicate 的节点，再令 prev.next=curr。', '否则 prev 与 curr 同步前进，结束返回 dummy.next。'],
    code: `class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        curr = head
        while curr:
            if curr.next and curr.val == curr.next.val:
                duplicate = curr.val
                while curr and curr.val == duplicate:
                    curr = curr.next
                prev.next = curr
            else:
                prev = curr
                curr = curr.next
        return dummy.next`,
    walkthrough: { input: 'head=[1,1,2,3,3]', steps: ['curr 在第一个 1 发现后继同值。', '越过整段两个 1，dummy 直接连接 2。', '2 没有重复，prev 前进到 2。', '3 出现两次，越过后 prev.next 指向 None。'], result: '返回 [2]。' },
    complexity: { time: 'O(n)，每节点至多越过一次。', space: 'O(1)。' }, pitfalls: ['题意不是每值保留一个，而是重复值全部删除。', '删除重复段时 prev 不能跟随 curr 前进。'], related: ['83 删除排序链表中的重复元素', '26 删除有序数组中的重复项'],
  },
  106: {
    id: 106, title: '从中序与后序遍历序列构造二叉树', summary: '根据无重复节点的中序与后序遍历唯一还原二叉树；后序末项是根，中序位置划分左右子树。',
    constraints: ['两数组长度相同且包含相同的互异值。', '后序从末尾消费时必须先构造右子树。'],
    examples: [{ input: 'inorder=[9,3,15,20,7], postorder=[9,15,7,20,3]', output: '[3,9,20,null,null,15,7]', explanation: '后序末尾 3 为根，中序把左右部分分开。' }],
    intuition: '哈希表让根值在中序中的位置 O(1) 可查；共享后序指针逆向移动，顺序是根、右、左。', bruteForce: '每次在线性中序切片中寻找根并复制子数组，偏斜树最坏 O(n²) 时间和空间。',
    approach: ['建立中序值到下标的映射。', '令 postIndex 指向后序末项。', '递归接收中序闭区间 left、right，空区间返回 None。', '用 postorder[postIndex] 建根并递减指针。', '先递归构造右区间，再构造左区间，返回根。'],
    code: `class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        position = {value: i for i, value in enumerate(inorder)}
        post_index = len(postorder) - 1
        def build(left: int, right: int) -> Optional[TreeNode]:
            nonlocal post_index
            if left > right:
                return None
            value = postorder[post_index]
            post_index -= 1
            root = TreeNode(value)
            mid = position[value]
            root.right = build(mid + 1, right)
            root.left = build(left, mid - 1)
            return root
        return build(0, len(inorder) - 1)`,
    walkthrough: { input: 'inorder=[2,1,3], postorder=[2,3,1]', steps: ['后序末项 1 建为根。', '中序下标 1 将左右区间分为 [2] 与 [3]。', '逆向后序下一项 3，先构造右孩子。', '再消费 2 构造左孩子。'], result: '得到根 1、左 2、右 3 的树。' },
    complexity: { time: 'O(n)，每节点建立一次且位置 O(1) 查询。', space: 'O(n)，映射与递归栈。' }, pitfalls: ['逆向消费后序必须先建右子树，否则指针对应错位。', '若值不唯一，单一位置映射无法确定结构；题设保证唯一。'], related: ['105 从前序与中序遍历序列构造二叉树', '889 根据前序和后序遍历构造二叉树'],
  },
  117: {
    id: 117, title: '填充每个节点的下一个右侧节点指针 II', summary: '为任意二叉树的每层节点建立从左到右的 next 链，层尾指向空；利用上一层 next 可常数空间构造下一层。',
    constraints: ['树不要求完美，任意节点可缺左或右孩子。', '初始 next 指针按题设为空，完成后每层独立串联。'],
    examples: [{ input: 'root=[1,2,3,4,5,null,7]', output: '第二层 2→3，第三层 4→5→7', explanation: '即使 5 与 7 的父节点不同，也应在同层相连。' }],
    intuition: '遍历当前层的 next 链时，用 dummy 与 tail 尾插其所有非空孩子，即可形成下一层的 next 链。', bruteForce: '层序 BFS 用队列逐层连接，正确但最大层宽会占 O(w) 空间。',
    approach: ['令 current 指向当前层首节点。', '每层创建 dummy 与 tail，作为下一层链的哨兵和尾。', '沿 current.next 扫描本层。', '依次把非空左、右孩子接到 tail.next 并推进 tail。', '本层结束后令 current=dummy.next，直到没有下一层。'],
    code: `class Solution:
    def connect(self, root: 'Node') -> 'Node':
        current = root
        while current:
            dummy = Node(0)
            tail = dummy
            while current:
                if current.left:
                    tail.next = current.left
                    tail = tail.next
                if current.right:
                    tail.next = current.right
                    tail = tail.next
                current = current.next
            current = dummy.next
        return root`,
    walkthrough: { input: 'root=[1,2,3,4,null,null,5]', steps: ['第一层扫描 1，把孩子 2、3 接成下一层链。', '切换到 2，沿 next 依次扫描 2、3。', '2 提供孩子 4，3 提供孩子 5，尾插成 4→5。', '扫描 4→5 没有孩子，下一层首为空而结束。'], result: '各层 next 均正确串联。' },
    complexity: { time: 'O(n)，每节点作为当前层节点与孩子各处理常数次。', space: 'O(1)，不计树中写入的 next 指针。' }, pitfalls: ['不能假设每个节点都有两个孩子。', 'tail 必须在每次连接孩子后推进，否则后来的孩子会覆盖连接。'], related: ['116 填充每个节点的下一个右侧节点指针', '102 二叉树的层序遍历'],
  },
  103: {
    id: 103, title: '二叉树的锯齿形层序遍历', summary: '逐层遍历二叉树，但相邻层的输出方向交替为从左到右和从右到左。',
    constraints: ['根可为空，节点值可重复。', '遍历扩展孩子仍按正常顺序，只有本层结果方向交替。'],
    examples: [{ input: 'root=[3,9,20,null,null,15,7]', output: '[[3],[20,9],[15,7]]', explanation: '第二层反向输出，第三层恢复正向。' }],
    intuition: 'BFS 队列负责层次，方向标志只决定本层值追加到双端队列的尾还是头，不应改变孩子入队逻辑。', bruteForce: '先普通层序得到全部层，再对奇数层反转，需要额外遍历和保存相同结果，虽仍为 O(n) 但可一次完成。',
    approach: ['空树返回空列表，队列放入根。', '维护 leftToRight 布尔方向。', '每轮固定处理进入时的队列长度。', '正向时值追加到层尾，反向时追加到层首；孩子始终左后右入队。', '把层转列表加入答案并翻转方向。'],
    code: `from collections import deque

class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        queue = deque([root])
        ans = []
        left_to_right = True
        while queue:
            level = deque()
            for _ in range(len(queue)):
                node = queue.popleft()
                if left_to_right: level.append(node.val)
                else: level.appendleft(node.val)
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            ans.append(list(level))
            left_to_right = not left_to_right
        return ans`,
    walkthrough: { input: 'root=[1,2,3,4,5,6,7]', steps: ['第 0 层正向加入 [1]。', '队列按左 2、右 3 保存下一层。', '第 1 层值从层首加入，形成 [3,2]，孩子仍按 4、5、6、7 入队。', '第 2 层恢复尾部加入，得到 [4,5,6,7]。'], result: '返回 [[1],[3,2],[4,5,6,7]]。' },
    complexity: { time: 'O(n)。', space: 'O(w)，w 为最大层宽。' }, pitfalls: ['反向层不能反向入队孩子，否则会扰乱后续层结构。', '必须固定每层开始时的队列长度。'], related: ['102 二叉树的层序遍历', '637 二叉树的层平均值'],
  },
  112: {
    id: 112, title: '路径总和', summary: '判断是否存在一条从根到叶子的路径，其节点值总和等于目标；只有真正叶节点才能完成路径。',
    constraints: ['树可为空，节点值和目标都可为负。', '路径必须从根开始并在叶子结束，不能停在中间节点。'],
    examples: [{ input: 'root=[5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22', output: 'true', explanation: '路径 5→4→11→2 的和为 22。' }],
    intuition: '沿路径递归减去当前节点值，到叶子时检查剩余目标是否恰等于叶子值。', bruteForce: '先枚举并存储所有根到叶路径，再分别求和，额外保存路径使空间与重复求和增加。',
    approach: ['空节点返回 False。', '若当前是叶节点，比较 node.val 与 targetSum。', '计算 remaining=targetSum-node.val。', '递归检查左子树是否存在剩余和路径。', '若左侧不成功再检查右侧，任一成功即返回 True。'],
    code: `class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False
        if not root.left and not root.right:
            return root.val == targetSum
        remaining = targetSum - root.val
        return self.hasPathSum(root.left, remaining) or self.hasPathSum(root.right, remaining)`,
    walkthrough: { input: 'root=[1,2,3], targetSum=4', steps: ['根 1 不是叶子，剩余目标变为 3。', '检查左叶 2，与剩余 3 不等。', '再检查右叶 3，与剩余 3 相等。', '右分支成功经 or 向上传递。'], result: '返回 true。' },
    complexity: { time: 'O(n)，最坏访问所有节点。', space: 'O(h)，递归栈由树高决定。' }, pitfalls: ['剩余和在中间节点变成 0 不能直接成功。', '叶节点定义是左右孩子都为空，不能只缺一个孩子。'], related: ['113 路径总和 II', '437 路径总和 III'],
  },
  129: {
    id: 129, title: '求根节点到叶节点数字之和', summary: '把每条根到叶路径上的数字按十进制拼接成一个数，并求所有这些数之和。',
    constraints: ['节点值为 0 到 9，树可为空。', '只有根到叶的完整路径计入，内部节点形成的前缀不单独计数。'],
    examples: [{ input: 'root=[1,2,3]', output: '25', explanation: '两条路径表示 12 和 13，总和为 25。' }],
    intuition: '进入节点 digit 时，新前缀是 prefix×10+digit；到叶子就把该前缀作为一项返回，内部节点汇总左右结果。', bruteForce: '先生成每条路径的字符串再转整数，需要保存所有路径并进行字符串复制。',
    approach: ['定义 DFS(node,prefix)。', '空节点贡献 0。', '计算 current=prefix*10+node.val。', '若是叶子，返回 current。', '否则返回左右子树 DFS 结果之和，从根以 0 开始。'],
    code: `class Solution:
    def sumNumbers(self, root: Optional[TreeNode]) -> int:
        def dfs(node: Optional[TreeNode], prefix: int) -> int:
            if not node:
                return 0
            current = prefix * 10 + node.val
            if not node.left and not node.right:
                return current
            return dfs(node.left, current) + dfs(node.right, current)
        return dfs(root, 0)`,
    walkthrough: { input: 'root=[4,9,0,5,1]', steps: ['根前缀变为 4。', '走到 9 时前缀变 49。', '叶 5 与叶 1 分别形成 495、491。', '右侧叶 0 形成 40，三项相加。'], result: '返回 1026。' },
    complexity: { time: 'O(n)。', space: 'O(h)，递归调用栈。' }, pitfalls: ['不能把节点值直接相加，路径表示的是十进制拼接。', '值为 0 的叶子仍构成有效末位，不能因假值跳过。'], related: ['112 路径总和', '257 二叉树的所有路径'],
  },
  173: {
    id: 173, title: '二叉搜索树迭代器', summary: '设计按升序逐个返回 BST 节点值的迭代器，初始化和每次操作使用一条左链栈实现惰性中序遍历。',
    constraints: ['调用 next 前保证 hasNext 为真。', '目标是 next 平均 O(1)，空间 O(h)，不能预先展开整棵树。'],
    examples: [{ input: 'BSTIterator([7,3,15,null,null,9,20])，依次 next', output: '3,7,9,15,20', explanation: '输出顺序等于二叉搜索树中序遍历。' }],
    intuition: '栈顶始终是尚未返回的最小节点；弹出它后，其右子树的整条左链是下一批最小候选。', bruteForce: '构造时完整中序遍历到数组，next 为 O(1)，但空间 O(n) 且不够惰性。',
    approach: ['构造时创建空栈，并把根的整条左链压栈。', '辅助函数 push_left 持续压入节点及其左孩子。', 'next 弹出栈顶，它就是当前最小值。', '若弹出节点有右子树，把右子树左链压栈。', 'hasNext 只需判断栈是否非空。'],
    code: `class BSTIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.stack = []
        self._push_left(root)

    def _push_left(self, node: Optional[TreeNode]) -> None:
        while node:
            self.stack.append(node)
            node = node.left

    def next(self) -> int:
        node = self.stack.pop()
        self._push_left(node.right)
        return node.val

    def hasNext(self) -> bool:
        return bool(self.stack)`,
    walkthrough: { input: 'root=[7,3,15,null,null,9,20]', steps: ['初始化压入 7、3，栈顶 3 最小。', 'next 弹出 3，它无右子树。', '再弹出 7，并压入其右子树左链 15、9。', '随后依次弹 9、15；弹 15 时再压入 20。'], result: '迭代顺序为 3,7,9,15,20。' },
    complexity: { time: 'next 摊还 O(1)，每节点恰好入栈出栈一次；hasNext O(1)。', space: 'O(h)，栈最多保存一条根到叶路径。' }, pitfalls: ['弹出节点后必须处理其右子树左链。', '栈中应存节点而不是只存值，否则无法继续访问右子树。'], related: ['94 二叉树的中序遍历', '230 二叉搜索树中第 K 小的元素'],
  },

  222: {
    id: 222, title: '完全二叉树的节点个数', summary: '利用完全二叉树的结构快速计数：若某子树最左高度等于最右高度，它就是满二叉树，可直接公式求节点数。',
    constraints: ['输入保证是完全二叉树，最后一层节点从左向右排列。', '空树节点数为 0，树高可能为 0。'],
    examples: [{ input: 'root=[1,2,3,4,5,6]', output: '6', explanation: '除最后一层外均满，最后一层有三个节点。' }],
    intuition: '完全树中，最左路径和最右路径等高恰好说明各层都满，节点数为 2^h-1；否则递归拆分左右子树。', bruteForce: '普通 DFS 访问每个节点计数，时间 O(n)，没有利用完全性。',
    approach: ['空根返回 0。', '分别沿 left 与 right 指针计算最左、最右高度。', '若两高度相等，直接返回 (1<<h)-1。', '若不等，当前树不是满树。', '递归计数左右子树并加上根节点。'],
    code: `class Solution:
    def countNodes(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        left_height = right_height = 0
        node = root
        while node:
            left_height += 1
            node = node.left
        node = root
        while node:
            right_height += 1
            node = node.right
        if left_height == right_height:
            return (1 << left_height) - 1
        return 1 + self.countNodes(root.left) + self.countNodes(root.right)`,
    walkthrough: { input: 'root=[1,2,3,4,5,6]', steps: ['整树最左高度 3、最右高度 2，不是满树。', '左子树根 2 的两侧高度都为 2，直接计 3。', '右子树根 3 高度不等，继续拆分。', '其左叶 6 计 1，右空计 0，加根后右子树计 2。'], result: '总数 1+3+2=6。' },
    complexity: { time: 'O(log² n)，每层计算高度 O(log n)，递归深度 O(log n)。', space: 'O(log n)，递归栈。' }, pitfalls: ['公式高度必须按节点层数统一计算。', '该优化依赖完全二叉树；一般树中左右极高相等不能保证满树。'], related: ['104 二叉树的最大深度', '完全二叉树'],
  },
  100: {
    id: 100, title: '相同的树', summary: '判断两棵二叉树是否结构完全一致且对应节点值全部相等。',
    constraints: ['两棵树都可能为空，空树与空树相同。', '节点值相同但孩子位置不同仍不是同一结构。'],
    examples: [{ input: 'p=[1,2,3], q=[1,2,3]', output: 'true', explanation: '根值及左右子树的结构和值逐项相同。' }],
    intuition: '对应位置只有三种情况：都空则相同，仅一方空则不同，都非空则比较值并递归比较左右。', bruteForce: '分别序列化两棵树再比较字符串可以实现，但需额外 O(n) 空间且必须编码空节点。',
    approach: ['若 p 与 q 都为空，返回 True。', '若只有一个为空，返回 False。', '比较当前节点值，不同则返回 False。', '递归比较 p.left 与 q.left。', '再比较右子树，左右都相同才返回 True。'],
    code: `class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q:
            return False
        return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)`,
    walkthrough: { input: 'p=[1,2], q=[1,null,2]', steps: ['两根都存在且值同为 1。', '比较左孩子时，p.left 存在。', 'q.left 为空，只有一方为空。', '左子树比较失败，短路返回 false。'], result: '两树不相同。' },
    complexity: { time: 'O(n)，n 为较小结构失配前或完整树的访问节点数。', space: 'O(h)，递归栈。' }, pitfalls: ['只比较遍历值而忽略空位置可能误判结构。', '左右孩子不能交叉比较，那是对称树问题。'], related: ['101 对称二叉树', '572 另一棵树的子树'],
  },
  637: {
    id: 637, title: '二叉树的层平均值', summary: '按层计算二叉树节点值的算术平均数；广度优先队列在每轮固定消费一层。',
    constraints: ['树非空，节点值可能为负。', '平均值应使用浮点除法并满足精度要求。'],
    examples: [{ input: 'root=[3,9,20,null,null,15,7]', output: '[3.0,14.5,11.0]', explanation: '三层的和与节点数分别为 3/1、29/2、22/2。' }],
    intuition: '进入每轮时队列中的节点恰好属于当前层，记录 size 后累加固定数量节点，就能得到该层总和与个数。', bruteForce: '先求高度，再为每个深度从根递归收集节点，偏斜树最坏 O(n²)。',
    approach: ['队列初始化为根节点。', '每轮保存 size=len(queue) 与 total=0。', '弹出恰好 size 个节点并累加值。', '把每个节点的非空孩子加入队尾。', '将 total/size 加入答案，队列空后返回。'],
    code: `from collections import deque

class Solution:
    def averageOfLevels(self, root: Optional[TreeNode]) -> List[float]:
        queue = deque([root])
        ans = []
        while queue:
            size = len(queue)
            total = 0
            for _ in range(size):
                node = queue.popleft()
                total += node.val
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            ans.append(total / size)
        return ans`,
    walkthrough: { input: 'root=[5,3,8,1,4]', steps: ['首轮 size=1，总和 5，均值 5。', '加入孩子 3、8，第二轮 size=2。', '第二层总和 11，均值 5.5，同时加入 1、4。', '第三层两节点总和 5，均值 2.5。'], result: '返回 [5.0,5.5,2.5]。' },
    complexity: { time: 'O(n)。', space: 'O(w)，w 为最大层宽。' }, pitfalls: ['层内不能使用变化中的队列长度作为循环边界。', '平均数分母是本层节点数，不是树总节点数。'], related: ['102 二叉树的层序遍历', '103 二叉树的锯齿形层序遍历'],
  },
  530: {
    id: 530, title: '二叉搜索树的最小绝对差', summary: '求 BST 任意两节点值之差的最小值；中序遍历产生升序序列，最小差必出现在相邻值之间。',
    constraints: ['树至少有两个节点，节点值互不相同。', 'BST 的中序顺序非递减，本题互异时严格递增。'],
    examples: [{ input: 'root=[4,2,6,1,3]', output: '1', explanation: '中序为 1,2,3,4,6，相邻最小差为 1。' }],
    intuition: '有序序列中，跨过中间元素的差不可能小于其中任一相邻差，因此只需记住上一个中序值。', bruteForce: '收集所有节点值后枚举任意两两差，时间 O(n²)。',
    approach: ['创建空栈、current=root、previous=None、best=无穷。', '沿 current 的左链压栈。', '弹出栈顶作为下一个中序节点。', '若 previous 存在，用当前值减 previous 更新 best。', '更新 previous 并转向右子树，遍历完成返回 best。'],
    code: `class Solution:
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        stack = []
        current = root
        previous = None
        best = float('inf')
        while stack or current:
            while current:
                stack.append(current)
                current = current.left
            current = stack.pop()
            if previous is not None:
                best = min(best, current.val - previous)
            previous = current.val
            current = current.right
        return best`,
    walkthrough: { input: 'root=[4,2,6,1,3]', steps: ['沿左链先访问 1，previous=1。', '访问 2，差为 1，best=1。', '访问 3、4，相邻差也为 1。', '最后访问 6，差为 2，不改变 best。'], result: '返回 1。' },
    complexity: { time: 'O(n)。', space: 'O(h)，显式中序栈。' }, pitfalls: ['必须按中序而非先序才能只比较相邻节点。', 'previous=0 不能代表未初始化，因为节点值可能为 0。'], related: ['783 二叉搜索树节点最小距离', '98 验证二叉搜索树'],
  },
  130: {
    id: 130, title: '被围绕的区域', summary: '把未与边界连通的 O 区域翻为 X；从边界 O 反向搜索可准确保留所有不应翻转的区域。',
    constraints: ['棋盘由 X 与 O 构成，只有上下左右连通。', '边界上的 O 及与之相连的 O 都不能被翻转。'],
    examples: [{ input: 'board=[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', output: '中间三个 O 变 X，边界 O 保留', explanation: '中间区域不接触边界，底部 O 位于边界。' }],
    intuition: '直接识别“被围绕”较难，反过来标记所有从边界可达的安全 O；未标记 O 必然被 X 包围。', bruteForce: '从每个 O 单独搜索是否能到边界，会重复遍历同一区域，最坏 O((mn)²)。',
    approach: ['收集四条边上的所有 O 作为搜索起点。', '起点入栈时改为临时标记 S。', 'DFS/BFS 扩展四向相邻 O 并同样标记。', '扫描全棋盘，把剩余 O 改为 X。', '把临时标记 S 恢复为 O。'],
    code: `class Solution:
    def solve(self, board: List[List[str]]) -> None:
        rows, cols = len(board), len(board[0])
        stack = []
        for r in range(rows):
            for c in (0, cols - 1):
                if board[r][c] == 'O':
                    board[r][c] = 'S'; stack.append((r, c))
        for c in range(cols):
            for r in (0, rows - 1):
                if board[r][c] == 'O':
                    board[r][c] = 'S'; stack.append((r, c))
        while stack:
            r, c = stack.pop()
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] == 'O':
                    board[nr][nc] = 'S'; stack.append((nr, nc))
        for r in range(rows):
            for c in range(cols):
                board[r][c] = 'O' if board[r][c] == 'S' else 'X'`,
    walkthrough: { input: 'board=[["X","O","X"],["X","O","X"],["X","X","X"]]', steps: ['边界 (0,1) 的 O 标为 S 并入栈。', '搜索到其下方 (1,1)，也标为 S。', '搜索结束，没有未标记的 O。', '最终扫描把两个 S 都恢复为 O。'], result: '棋盘保持不变。' },
    complexity: { time: 'O(mn)。', space: 'O(mn) 最坏情况下用于显式栈。' }, pitfalls: ['只保留边界格本身不够，还要搜索与其相连的内部 O。', '标记应在入栈时完成，避免重复加入。'], related: ['200 岛屿数量', '417 太平洋大西洋水流问题'],
  },
  133: {
    id: 133, title: '克隆图', summary: '深拷贝无向连通图，为每个原节点创建唯一新节点，并在克隆节点间重建全部邻接关系。',
    constraints: ['输入节点可为空，图可能含环和自环。', '节点值不应充当唯一身份，应以节点对象作为映射键。'],
    examples: [{ input: 'adjList=[[2,4],[1,3],[2,4],[1,3]]', output: '结构相同但节点对象全新的图', explanation: '四个克隆节点保持原来的双向边。' }],
    intuition: '映射 old→clone 既保证每个节点只创建一次，也充当 visited；递归遇到已见节点时直接复用其克隆，环不会无限展开。', bruteForce: '沿边遇到节点就新建会为同一节点制造多个副本，并在环中无限循环。',
    approach: ['空输入返回 None。', '创建 old_to_new 哈希映射。', 'DFS 若节点已在映射中，返回已有克隆。', '否则先创建克隆并登记，再递归克隆每个邻居。', '把邻居克隆列表赋给新节点并返回根克隆。'],
    code: `class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        if not node:
            return None
        clones = {}
        def clone(current: 'Node') -> 'Node':
            if current in clones:
                return clones[current]
            copied = Node(current.val)
            clones[current] = copied
            for neighbor in current.neighbors:
                copied.neighbors.append(clone(neighbor))
            return copied
        return clone(node)`,
    walkthrough: { input: '两个节点 1 与 2 互相连接', steps: ['克隆节点 1 并立即登记映射。', '处理 1 的邻居 2，创建并登记克隆 2。', '处理 2 的邻居 1 时命中已有映射，不再创建。', '把克隆 1 接入克隆 2 的邻居，再返回完整副本。'], result: '得到两个全新且互连的节点。' },
    complexity: { time: 'O(V+E)，每节点和每条邻接边处理一次。', space: 'O(V)，映射与递归栈。' }, pitfalls: ['必须在递归邻居之前登记克隆，否则环会无限递归。', '不能按 val 去重，通用图中不同节点可能同值。'], related: ['138 随机链表的复制', '200 岛屿数量'],
  },
  399: {
    id: 399, title: '除法求值', summary: '把变量比值建成带权双向图，每个查询通过路径上边权连乘求出比例，不连通或未知变量返回 -1。',
    constraints: ['等式无矛盾且除数变量对应值非零。', '查询可能含图中未出现的变量，也可能查询变量自身。'],
    examples: [{ input: 'equations=[["a","b"],["b","c"]], values=[2,3], queries=[["a","c"],["c","a"]]', output: '[6.0,0.16667]', explanation: 'a/c=(a/b)×(b/c)=6，反向取倒数。' }],
    intuition: '等式 a/b=k 等价于边 a→b 权 k 与 b→a 权 1/k；任意可达路径的权重乘积就是查询结果。', bruteForce: '为每次查询尝试所有变量排列寻找链路会产生指数级组合；图搜索只访问一次节点。',
    approach: ['为每个等式加入正向权值边和倒数反向边。', '查询含未知变量时返回 -1。', '从分子开始 DFS/BFS，累计乘积初始为 1。', '访问邻居时乘上当前边权，并用集合避免成环。', '到达分母即返回累计值；搜索耗尽返回 -1。'],
    code: `from collections import defaultdict

class Solution:
    def calcEquation(self, equations: List[List[str]], values: List[float], queries: List[List[str]]) -> List[float]:
        graph = defaultdict(list)
        for (a, b), value in zip(equations, values):
            graph[a].append((b, value))
            graph[b].append((a, 1.0 / value))
        def evaluate(start: str, target: str) -> float:
            if start not in graph or target not in graph:
                return -1.0
            stack = [(start, 1.0)]
            seen = {start}
            while stack:
                node, product = stack.pop()
                if node == target:
                    return product
                for neighbor, weight in graph[node]:
                    if neighbor not in seen:
                        seen.add(neighbor)
                        stack.append((neighbor, product * weight))
            return -1.0
        return [evaluate(a, b) for a, b in queries]`,
    walkthrough: { input: 'a/b=2, b/c=3，查询 c/a', steps: ['建边 c→b，权重 1/3。', '从 c 出发，累计值 1。', '走到 b 后累计为 1/3。', '再走 b→a 的权 1/2，到 a 时累计 1/6。'], result: '返回约 0.16667。' },
    complexity: { time: '建图 O(E)，每个查询最坏 O(V+E)。', space: 'O(V+E)，图、访问集合与搜索栈。' }, pitfalls: ['反向边权必须是倒数。', '未知变量即使查询 x/x 也应返回 -1，而已知变量自身为 1。'], related: ['133 克隆图', '并查集带权'],
  },
  210: {
    id: 210, title: '课程表 II', summary: '根据先修关系给出任一可完成全部课程的顺序；若依赖图含环则返回空列表。',
    constraints: ['课程编号为 0 到 numCourses-1，可能存在互不相连的课程。', '先修对 [course, prerequisite] 表示 prerequisite 指向 course。'],
    examples: [{ input: 'numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3] 或 [0,2,1,3]', explanation: '0 先于 1、2，而 1、2 都先于 3。' }],
    intuition: '入度为零的课程当前没有未完成前置，可以安全加入顺序；删除它的出边后会释放新的零入度课程。', bruteForce: '不断扫描所有未选课程，检查其先修是否完成，最坏 O(VE)。',
    approach: ['建立 prerequisite→course 邻接表并统计每课入度。', '把所有入度为 0 的课程加入队列。', '每次弹出一课加入 order。', '遍历其后继并将入度减一，新变为 0 的入队。', '若 order 长度等于课程数则返回，否则图有环返回空列表。'],
    code: `from collections import deque

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1
        queue = deque(i for i in range(numCourses) if indegree[i] == 0)
        order = []
        while queue:
            course = queue.popleft()
            order.append(course)
            for nxt in graph[course]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    queue.append(nxt)
        return order if len(order) == numCourses else []`,
    walkthrough: { input: 'numCourses=3, prerequisites=[[1,0],[2,1]]', steps: ['入度为 [0,1,1]，队列先放 0。', '取 0 后课程 1 入度降为 0 并入队。', '取 1 后课程 2 被释放。', '取 2 后顺序长度达到 3。'], result: '返回 [0,1,2]。' },
    complexity: { time: 'O(V+E)。', space: 'O(V+E)。' }, pitfalls: ['边方向不能写反：先修课应指向后续课程。', '只返回已处理前缀会掩盖环，必须检查长度。'], related: ['207 课程表', '269 火星词典'],
  },
  909: {
    id: 909, title: '蛇梯棋', summary: '在蛇形编号棋盘上从 1 出发，每次掷 1 至 6，并按落点的蛇或梯跳转，求到终点的最少次数。',
    constraints: ['棋盘编号从左下角开始逐行蛇形上升。', '一次掷骰只应用落点的一次蛇梯跳转，不连续触发第二次。'],
    examples: [{ input: '经典 6×6 棋盘，含若干蛇梯', output: '最少掷骰次数', explanation: '把每个编号视为图节点，BFS 首次到终点即最短。' }],
    intuition: '每次掷骰代价都为 1，编号之间形成无权图；BFS 按步数扩展。难点只在把编号转换成棋盘行列。', bruteForce: 'DFS 枚举所有骰子序列会因回路和分支产生指数级搜索，即使用 visited 也不天然保证最短。',
    approach: ['定义编号 square 到从底部起行 q、列 r 的转换，奇数行反向列。', '队列从编号 1、步数 0 开始，并标记访问。', '弹出位置后枚举 next 从 pos+1 到 min(pos+6,n²)。', '若落点有蛇梯，将目标替换为棋盘值，否则保留 next。', '未访问目标入队；首次到 n² 时返回步数加一。'],
    code: `from collections import deque

class Solution:
    def snakesAndLadders(self, board: List[List[int]]) -> int:
        n = len(board)
        def destination(square: int) -> int:
            q, r = divmod(square - 1, n)
            row = n - 1 - q
            col = r if q % 2 == 0 else n - 1 - r
            return square if board[row][col] == -1 else board[row][col]
        queue = deque([(1, 0)])
        seen = {1}
        while queue:
            square, moves = queue.popleft()
            for nxt in range(square + 1, min(square + 6, n * n) + 1):
                target = destination(nxt)
                if target == n * n:
                    return moves + 1
                if target not in seen:
                    seen.add(target)
                    queue.append((target, moves + 1))
        return -1`,
    walkthrough: { input: '3×3 空棋盘', steps: ['从编号 1 入队，步数 0。', '第一层可到 2 至 7，均以步数 1 入队。', '处理编号 3 时可掷 6 到编号 9。', 'BFS 首次发现终点时，该路径使用 2 次骰子。'], result: '返回 2。' },
    complexity: { time: 'O(n²)，每个格最多出队一次且检查至多 6 条边。', space: 'O(n²)，队列与访问集合。' }, pitfalls: ['蛇形行的列方向交替，编号映射最易写错。', 'visited 应标记跳转后的 target，而不是掷骰落点 nxt。'], related: ['433 最小基因变化', '127 单词接龙'],
  },
  433: {
    id: 433, title: '最小基因变化', summary: '每次只改一个字符且中间串必须位于基因库，求 start 到 end 的最少变化次数；固定长度字符串形成无权图。',
    constraints: ['基因字符只来自 A、C、G、T 且长度固定为 8。', 'end 不在基因库时无法到达；start 可不在库中。'],
    examples: [{ input: 'start="AACCGGTT", end="AAACGGTA", bank=["AACCGGTA","AACCGCTA","AAACGGTA"]', output: '2', explanation: '先变为 AACCGGTA，再变为 AAACGGTA。' }],
    intuition: '每个合法基因是节点，一字符变化是等权边；BFS 第一次发现 end 的层数就是最少变化数。', bruteForce: 'DFS 枚举每个位置的三种替换会产生约 3^8 分支并可能在库中绕圈。',
    approach: ['把 bank 转成集合，若 end 不在其中返回 -1。', '队列放入 start 与步数 0，visited 包含 start。', '弹出基因后枚举 8 个位置。', '每个位置尝试另外三种字符，构造 candidate。', 'candidate 等于 end 时返回 steps+1；合法未访问则标记并入队，耗尽返回 -1。'],
    code: `from collections import deque

class Solution:
    def minMutation(self, startGene: str, endGene: str, bank: List[str]) -> int:
        allowed = set(bank)
        if endGene not in allowed:
            return -1
        queue = deque([(startGene, 0)])
        seen = {startGene}
        genes = 'ACGT'
        while queue:
            current, steps = queue.popleft()
            if current == endGene:
                return steps
            for i, old in enumerate(current):
                for ch in genes:
                    if ch == old:
                        continue
                    candidate = current[:i] + ch + current[i + 1:]
                    if candidate in allowed and candidate not in seen:
                        seen.add(candidate)
                        queue.append((candidate, steps + 1))
        return -1`,
    walkthrough: { input: 'start=AACCGGTT, end=AACCGGTA, bank=[AACCGGTA]', steps: ['终点存在于基因库，开始 BFS。', '从起点枚举每个位置和替换字符。', '最后一位由 T 改为 A 得到合法候选。', '候选以步数 1 入队，随后出队时等于终点。'], result: '返回 1。' },
    complexity: { time: 'O(B·L·4·L)，B 为库大小、L=8；构造字符串含 O(L)。', space: 'O(B·L)，保存集合、队列与访问标记。' }, pitfalls: ['所有中间状态必须在 bank，不能任意变换。', '候选入队时就应标记 seen，避免同层重复加入。'], related: ['127 单词接龙', '909 蛇梯棋'],
  },
};
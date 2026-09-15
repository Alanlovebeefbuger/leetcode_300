import type { Lesson } from './lessons';

export const lessonsBatch13: Record<number, Lesson> = {
  696: {
    id: 696,
    title: '计数二进制子串',
    summary: '统计 0 和 1 数量相同、且同类字符各自连续成段的非空子串个数。答案只取决于相邻两段的长度。',
    constraints: ['输入仅含字符 0 和 1。', '子串必须由一段连续 0 与一段连续 1 组成，次序不限。'],
    examples: [{ input: 's = "00110011"', output: '6', explanation: '相邻字符段长度为 2、2、2、2，每对贡献 2 个，共 6 个。' }],
    intuition: '把字符串压成连续段长度。相邻两段能组成的合法子串数是较短段长度，因为两侧各取相同数量即可。',
    bruteForce: '枚举所有子串，再检查 0、1 数量及分段结构，最坏需要 O(n³) 时间。',
    approach: ['维护上一段长度 prev 与当前段长度 curr。', '字符不变时扩大 curr。', '字符改变时把 min(prev,curr) 加入答案，再更新两段长度。', '扫描结束后补上最后一对相邻段的贡献。'],
    code: `class Solution:
    def countBinarySubstrings(self, s: str) -> int:
        prev, curr, ans = 0, 1, 0
        for i in range(1, len(s)):
            if s[i] == s[i - 1]:
                curr += 1
            else:
                ans += min(prev, curr)
                prev, curr = curr, 1
        return ans + min(prev, curr)`,
    walkthrough: { input: 's = "00111"', steps: ['先得到连续 0 段，长度为 2。', '遇到 1 后开始新段，最终长度为 3。', '两段贡献 min(2,3)=2。'], result: '返回 2。' },
    complexity: { time: 'O(n)，只扫描一次字符串。', space: 'O(1)，仅保存相邻段长度。' },
    pitfalls: ['不要遗漏扫描结束后的最后一对字符段。', '只比较全局 0、1 数量会误计包含多次切换的子串。'],
    related: ['443 字符串压缩', '滑动分组'],
  },
  700: {
    id: 700,
    title: '二叉搜索树中的搜索',
    summary: '在二叉搜索树中寻找值等于 val 的节点，并返回以该节点为根的子树；不存在则返回空。',
    constraints: ['树满足左子树值更小、右子树值更大的搜索树性质。', '节点值通常互不相同，目标值可能不存在。'],
    examples: [{ input: 'root = [4,2,7,1,3], val = 2', output: '[2,1,3]', explanation: '值 2 位于根的左侧，返回该节点的完整子树。' }],
    intuition: '每次比较目标与当前值即可排除一整棵子树，过程等价于在有序结构上缩小搜索范围。',
    bruteForce: '按普通二叉树遍历全部节点，时间 O(n)，未利用搜索树的有序性。',
    approach: ['从根节点开始迭代。', '当前值等于 val 时立即返回当前节点。', 'val 较小时走左子树，否则走右子树。', '走到空节点说明目标不存在。'],
    code: `class Solution:
    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        node = root
        while node:
            if node.val == val:
                return node
            node = node.left if val < node.val else node.right
        return None`,
    walkthrough: { input: 'root = [4,2,7,1,3], val = 3', steps: ['3<4，转向根的左孩子 2。', '3>2，转向节点 3。', '当前值命中目标，返回该节点。'], result: '返回以 3 为根的子树。' },
    complexity: { time: 'O(h)，h 为树高；退化树最坏 O(n)。', space: 'O(1)，使用迭代指针。' },
    pitfalls: ['比较方向不能写反：较小值去左侧。', '应返回节点本身，而不是布尔值或节点值。'],
    related: ['98 验证二叉搜索树', '701 二叉搜索树中的插入操作'],
  },
  724: {
    id: 724,
    title: '寻找数组的中心下标',
    summary: '寻找最左侧下标，使其左边元素和等于右边元素和；当前元素不计入任一侧。',
    constraints: ['数组可含负数、零和正数。', '若存在多个中心下标，返回最靠左者；不存在返回 -1。'],
    examples: [{ input: 'nums = [1,7,3,6,5,6]', output: '3', explanation: '下标 3 左侧和与右侧和都为 11。' }],
    intuition: '已知总和 total 与当前左侧和 left 后，右侧和就是 total-left-nums[i]，无需为每个位置重复求和。',
    bruteForce: '对每个下标分别求左右两侧之和，时间 O(n²)。',
    approach: ['先计算数组总和 total。', '令 left=0，从左向右扫描。', '若 left 等于 total-left-nums[i]，立即返回 i。', '否则把 nums[i] 加入 left，继续检查下一个位置。'],
    code: `class Solution:
    def pivotIndex(self, nums: List[int]) -> int:
        total = sum(nums)
        left = 0
        for i, value in enumerate(nums):
            if left == total - left - value:
                return i
            left += value
        return -1`,
    walkthrough: { input: 'nums = [2,1,-1]', steps: ['总和为 2，初始左侧和为 0。', '检查下标 0：右侧和为 0，与左侧相等。', '这是从左遇到的首个解，立即返回。'], result: '返回 0。' },
    complexity: { time: 'O(n)，一次求和加一次扫描。', space: 'O(1)。' },
    pitfalls: ['计算右侧和时要减去当前元素。', '命中后应立即返回，才能保证最左答案。'],
    related: ['1480 一维数组的动态和', '前缀和'],
  },
  725: {
    id: 725,
    title: '分隔链表',
    summary: '按原顺序把链表切成 k 个连续部分，使长度差不超过 1，较长部分必须排在前面。',
    constraints: ['需要返回恰好 k 个部分，链表较短时尾部部分为空。', '不得改变节点相对顺序，每个非空部分都要断开尾指针。'],
    examples: [{ input: 'head = [1,2,3], k = 5', output: '[[1],[2],[3],[],[]]', explanation: '基础长度为 0，前三部分各分到一个余数节点。' }],
    intuition: '设链表长度 n，整除得到每部分基础长度 n//k，前 n%k 部分额外多一个节点。',
    bruteForce: '反复估算剩余长度来决定当前切点会重复遍历链表，最坏 O(nk)。',
    approach: ['先遍历链表得到总长度 n。', '计算 base=n//k 与 extra=n%k。', '依次令前 extra 部分长度为 base+1，其余为 base。', '记录每部分头节点，走到尾部后断开与下一部分的连接。'],
    code: `class Solution:
    def splitListToParts(self, head: Optional[ListNode], k: int) -> List[Optional[ListNode]]:
        n, node = 0, head
        while node:
            n += 1
            node = node.next
        base, extra = divmod(n, k)
        ans, node = [], head
        for i in range(k):
            ans.append(node)
            size = base + (1 if i < extra else 0)
            for _ in range(size - 1):
                node = node.next
            if node:
                nxt = node.next
                node.next = None
                node = nxt
        return ans`,
    walkthrough: { input: 'head = [1,2,3,4,5], k = 3', steps: ['n=5，base=1，extra=2。', '前两部分各取 2 个节点并断开。', '最后一部分取剩余 1 个节点。'], result: '返回 [[1,2],[3,4],[5]]。' },
    complexity: { time: 'O(n+k)，计数、切分并生成 k 个结果。', space: 'O(k)，用于返回各部分头节点。' },
    pitfalls: ['前 extra 个部分应更长，不能把余数放到后面。', '每部分尾节点必须设 next=None，否则各部分仍相连。'],
    related: ['876 链表的中间结点', '链表切分'],
  },
  726: {
    id: 726,
    title: '原子的数量',
    summary: '解析含括号与数字倍数的化学式，汇总每种原子数量，并按原子名字典序输出规范字符串。',
    constraints: ['元素名以大写字母开头，可跟若干小写字母；省略数字表示 1。', '括号可以嵌套，括号后的倍数作用于括号内全部原子。'],
    examples: [{ input: 'formula = "K4(ON(SO3)2)2"', output: '"K4N2O14S4"', explanation: '由内向外展开倍数后，各原子计数如输出所示。' }],
    intuition: '每遇左括号就开启新计数作用域；右括号时弹出内层计数，乘以后续数字并合并到外层。栈自然对应嵌套结构。',
    bruteForce: '不断展开括号生成完整原子序列，倍数较大时中间字符串会急剧膨胀。',
    approach: ['用栈保存每层 Counter，初始含一个空计数器。', '遇到左括号压入新层；遇到原子名则解析其可选数字并计数。', '遇到右括号时解析倍数，弹出内层并乘倍数合并。', '最后按原子名字典序拼接，计数为 1 时省略数字。'],
    code: `class Solution:
    def countOfAtoms(self, formula: str) -> str:
        from collections import Counter
        stack, i, n = [Counter()], 0, len(formula)
        while i < n:
            if formula[i] == '(':
                stack.append(Counter())
                i += 1
            elif formula[i] == ')':
                i += 1
                start = i
                while i < n and formula[i].isdigit(): i += 1
                mult = int(formula[start:i] or '1')
                inner = stack.pop()
                for atom, count in inner.items(): stack[-1][atom] += count * mult
            else:
                start = i
                i += 1
                while i < n and formula[i].islower(): i += 1
                atom = formula[start:i]
                start = i
                while i < n and formula[i].isdigit(): i += 1
                stack[-1][atom] += int(formula[start:i] or '1')
        return ''.join(a + (str(c) if c > 1 else '') for a, c in sorted(stack[0].items()))`,
    walkthrough: { input: 'formula = "Mg(OH)2"', steps: ['外层记录 Mg:1，左括号开启新计数层。', '内层记录 O:1、H:1，右括号读到倍数 2。', '合并得到 H:2、Mg:1、O:2，并按名称排序。'], result: '返回 "H2MgO2"。' },
    complexity: { time: 'O(n+a log a)，解析线性，a 种原子用于排序。', space: 'O(n)，栈和计数表最坏随公式长度增长。' },
    pitfalls: ['元素名中的小写字母不能当成新原子。', '括号或原子后未写数字时倍数必须视为 1。'],
    related: ['394 字符串解码', '栈解析'],
  },

  729: {
    id: 729,
    title: '我的日程安排表 I',
    summary: '设计日历以接受半开区间预约；只有与所有既有预约都不重叠时才保存并返回 true。',
    constraints: ['预约区间为 [start,end)，端点相接不算重叠。', '每次 book 成功后会永久加入后续冲突判断。'],
    examples: [{ input: 'book(10,20), book(15,25), book(20,30)', output: 'true, false, true', explanation: '第二段与首段重叠；第三段从 20 开始，可与首段首尾相接。' }],
    intuition: '两个半开区间不重叠当且仅当一个完全位于另一个左侧；反过来，start<oldEnd 且 oldStart<end 就表示冲突。',
    bruteForce: '线性扫描所有已接受区间即可，也是约束规模下直接可靠的方案；若调用量极大可改用有序树。',
    approach: ['维护已成功预约的区间列表。', '对每个 [left,right) 检查 start<right 且 left<end。', '发现任一重叠立即返回 false，不修改日历。', '全部通过后保存新区间并返回 true。'],
    code: `class MyCalendar:
    def __init__(self):
        self.events = []

    def book(self, startTime: int, endTime: int) -> bool:
        for start, end in self.events:
            if startTime < end and start < endTime:
                return False
        self.events.append((startTime, endTime))
        return True`,
    walkthrough: { input: '已有 [10,20)，尝试 [20,25)', steps: ['比较新区间起点 20 与旧终点 20。', '条件 20<20 不成立，因此两段不重叠。', '把 [20,25) 加入预约列表。'], result: '返回 true。' },
    complexity: { time: '第 m 次 book 为 O(m)。', space: 'O(m)，保存成功预约。' },
    pitfalls: ['半开区间端点相等应允许预约。', '冲突失败时不能把新区间写入列表。'],
    related: ['731 我的日程安排表 II', '区间重叠'],
  },
  731: {
    id: 731,
    title: '我的日程安排表 II',
    summary: '设计允许双重预约但禁止三重预约的日历；每次加入新区间时判断是否覆盖已有双重区域。',
    constraints: ['区间采用 [start,end)，端点相接不重叠。', '一次或两次覆盖合法，任何位置达到三次覆盖则整次预约失败。'],
    examples: [{ input: 'book(10,20), book(50,60), book(10,40), book(5,15)', output: 'true, true, true, false', explanation: '最后一段会让 [10,15) 被三次覆盖。' }],
    intuition: '维护所有预约和已经产生的两两交集。新区间若与某个双重区相交就会形成三重覆盖；否则把它与旧预约的新交集加入双重区集合。',
    bruteForce: '加入后对每个坐标点统计覆盖次数不可行，时间范围很大；离散化每次重算也较繁琐。',
    approach: ['维护 bookings 与 overlaps 两个区间列表。', '先检查新区间是否和任一 overlaps 相交，若是则拒绝。', '再与每个旧预约求交集，把非空交集加入 overlaps。', '最后把新区间加入 bookings 并返回 true。'],
    code: `class MyCalendarTwo:
    def __init__(self):
        self.bookings = []
        self.overlaps = []

    def book(self, startTime: int, endTime: int) -> bool:
        for start, end in self.overlaps:
            if startTime < end and start < endTime:
                return False
        for start, end in self.bookings:
            left, right = max(startTime, start), min(endTime, end)
            if left < right:
                self.overlaps.append((left, right))
        self.bookings.append((startTime, endTime))
        return True`,
    walkthrough: { input: '已有 [10,20)、[15,25)，尝试 [18,30)', steps: ['前两段已产生双重区 [15,20)。', '新区间与 [15,20) 在 [18,20) 相交。', '加入后将出现三重覆盖，因此拒绝且不更新状态。'], result: '返回 false。' },
    complexity: { time: '第 m 次调用最坏 O(m²)，双重区数量可达平方级。', space: 'O(m²)，保存预约交集。' },
    pitfalls: ['必须先检查三重冲突，再写入任何新交集。', '交集非空条件是 max(start)<min(end)，不能使用等号。'],
    related: ['729 我的日程安排表 I', '732 我的日程安排表 III'],
  },
  735: {
    id: 735,
    title: '小行星碰撞',
    summary: '模拟同一直线上小行星运动，正数向右、负数向左；相向碰撞时较小者消失，相等则同时消失。',
    constraints: ['绝对值表示大小，符号表示方向。', '只有左侧向右与右侧向左的组合才可能发生碰撞。'],
    examples: [{ input: 'asteroids = [5,10,-5]', output: '[5,10]', explanation: '-5 与 10 相撞后较小的 -5 消失。' }],
    intuition: '新来的左行星只可能与结果末尾尚存的右行星连续碰撞。栈顶正数与当前负数是唯一需要处理的方向组合。',
    bruteForce: '每次寻找相邻碰撞并删除数组元素，频繁移动元素最坏 O(n²)。',
    approach: ['用栈保存当前仍存活的小行星。', '仅当栈顶为正且当前值为负时进入碰撞循环。', '比较两者大小，弹出较小栈顶或让当前行星消失。', '若大小相等则弹栈并结束当前处理；最终仍存活才入栈。'],
    code: `class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack = []
        for asteroid in asteroids:
            alive = True
            while alive and asteroid < 0 and stack and stack[-1] > 0:
                if stack[-1] < -asteroid:
                    stack.pop()
                elif stack[-1] == -asteroid:
                    stack.pop()
                    alive = False
                else:
                    alive = False
            if alive:
                stack.append(asteroid)
        return stack`,
    walkthrough: { input: 'asteroids = [8,-3,-10]', steps: ['8 与 -3 碰撞，8 较大，-3 消失。', '-10 再与栈顶 8 碰撞，8 被弹出。', '栈已空，-10 存活并入栈。'], result: '返回 [-10]。' },
    complexity: { time: 'O(n)，每颗小行星至多入栈、出栈各一次。', space: 'O(n)，栈保存幸存者。' },
    pitfalls: ['同向运动或左行星位于右行星左侧时不会碰撞。', '当前负数可能连续摧毁多个正数，不能只比较一次。'],
    related: ['20 有效的括号', '栈模拟'],
  },
  738: {
    id: 738,
    title: '单调递增的数字',
    summary: '寻找不大于 n 的最大整数，使其十进制各位从左到右非递减。',
    constraints: ['n 为非负整数。', '答案允许位数减少，例如 100 的答案是 99。'],
    examples: [{ input: 'n = 332', output: '299', explanation: '从右向左修复下降位置，前一位减一，后缀全部改成 9。' }],
    intuition: '若 digit[i-1]>digit[i]，想得到最大的合法较小数，必须把前一位减一，并让其后所有位变成最大值 9；减一可能继续破坏更左关系。',
    bruteForce: '从 n 向下逐个检查各位是否单调，n 很大时可能尝试大量数字。',
    approach: ['把 n 转成可修改的数字字符数组。', '从右向左寻找下降对。', '每发现 digits[i-1]>digits[i]，将前一位减一并记录后缀起点 i。', '扫描结束后把记录位置及其右侧全部置为 9。'],
    code: `class Solution:
    def monotoneIncreasingDigits(self, n: int) -> int:
        digits = list(str(n))
        mark = len(digits)
        for i in range(len(digits) - 1, 0, -1):
            if digits[i - 1] > digits[i]:
                digits[i - 1] = str(int(digits[i - 1]) - 1)
                mark = i
        for i in range(mark, len(digits)):
            digits[i] = '9'
        return int(''.join(digits))`,
    walkthrough: { input: 'n = 332', steps: ['从右看 3>2，把十位 3 减为 2，并标记后缀。', '继续向左发现 3>2，把百位减为 2，标记位置前移。', '将标记后的两位都改成 9。'], result: '得到 299。' },
    complexity: { time: 'O(d)，d 为十进制位数。', space: 'O(d)，保存数字字符。' },
    pitfalls: ['必须从右向左，否则前位减一可能产生未处理的新下降。', '后缀应统一改为 9，才能在不超过 n 的前提下最大。'],
    related: ['670 最大交换', '贪心构造'],
  },
  740: {
    id: 740,
    title: '删除并获得点数',
    summary: '选择某个数可获得其值，同时删除所有相邻值 x-1 与 x+1，求可获得的最大总点数。',
    constraints: ['数组元素为正整数，重复值可全部贡献点数。', '选择某个值后不能再选择数值相邻的值。'],
    examples: [{ input: 'nums = [2,2,3,3,3,4]', output: '9', explanation: '选择所有 3 可得 9，优于选择 2 和 4 得 8。' }],
    intuition: '把相同数聚合成 value*frequency 后，问题变成按数值排列的打家劫舍：相邻数值不能同时取。',
    bruteForce: '对每个不同数尝试选或不选并递归，状态不记忆时呈指数增长。',
    approach: ['统计每个数值可贡献的总点数。', '按从 0 到最大值遍历数值轴。', '维护 take：选择当前值的最优分数；skip：不选择当前值的最优分数。', '转移为新 take=skip+points[value]，新 skip=max(skip,take)。', '返回两种状态的最大值。'],
    code: `class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        if not nums:
            return 0
        points = [0] * (max(nums) + 1)
        for value in nums:
            points[value] += value
        take = skip = 0
        for score in points:
            take, skip = skip + score, max(skip, take)
        return max(take, skip)`,
    walkthrough: { input: 'nums = [3,4,2]', steps: ['聚合点数为 2→2、3→3、4→4。', '选择 3 得 3，并排除 2 与 4。', '跳过 3 后可同时选择 2 和 4，合计 6。'], result: '返回 6。' },
    complexity: { time: 'O(n+M)，M 为数组最大值。', space: 'O(M)，保存各值总点数。' },
    pitfalls: ['重复值应聚合为 value×出现次数。', '冲突依据是数值相邻，不是原数组下标相邻。'],
    related: ['198 打家劫舍', '动态规划'],
  },

  746: {
    id: 746,
    title: '使用最小花费爬楼梯',
    summary: '每次支付当前台阶费用后可上 1 或 2 阶，可从下标 0 或 1 出发，求越过最后台阶的最低总花费。',
    constraints: ['cost 至少包含两个非负费用。', '楼顶位于数组末尾之后，到达楼顶本身不收费。'],
    examples: [{ input: 'cost = [10,15,20]', output: '15', explanation: '从下标 1 出发支付 15，再跨两阶到楼顶。' }],
    intuition: '到达当前位置只可能来自前一阶或前两阶。用两个变量保存到达这两个位置的最低代价，即可滚动计算而无需完整 DP 数组。',
    bruteForce: '递归枚举每一步走 1 阶还是 2 阶，会重复计算同一位置，时间指数级。',
    approach: ['令 prev2、prev1 表示到达前两个位置的最低花费，初始都为 0。', '依次处理每个台阶费用 fee。', '到达下一位置的代价为 min(prev2,prev1)+fee。', '滚动更新两个状态，最后返回到楼顶的两种来源中较小者。'],
    code: `class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        prev2 = prev1 = 0
        for fee in cost:
            current = min(prev2, prev1) + fee
            prev2, prev1 = prev1, current
        return min(prev2, prev1)`,
    walkthrough: { input: 'cost = [10,15,20]', steps: ['处理 10 后，到达该阶代价为 10。', '处理 15 后，从起点直接到此阶，代价为 15。', '楼顶可从最后两阶到达，取 min(15,30)=15。'], result: '返回 15。' },
    complexity: { time: 'O(n)，每个台阶处理一次。', space: 'O(1)，使用滚动状态。' },
    pitfalls: ['答案不是到达最后一阶的代价，而是最后两种来源的较小值。', '可以从下标 0 或 1 开始，因此初始到达代价都应为 0。'],
    related: ['70 爬楼梯', '198 打家劫舍'],
  },
  747: {
    id: 747,
    title: '至少是其他数字两倍的最大数',
    summary: '返回数组最大元素的下标，但前提是它至少为其余每个数的两倍；不满足则返回 -1。',
    constraints: ['数组非空，元素为非负整数。', '若存在合格答案，它对应数组中的最大值。'],
    examples: [{ input: 'nums = [3,6,1,0]', output: '1', explanation: '最大值 6 至少是次大值 3 的两倍，因此返回其下标 1。' }],
    intuition: '只需比较最大值与次大值：若最大值至少是次大值两倍，它自然也至少是所有更小元素的两倍。',
    bruteForce: '找出最大值后与每个其他元素逐一比较也为 O(n)，但可在一次扫描中同时维护最大和次大。',
    approach: ['维护最大值 first、次大值 second 与最大值下标。', '遇到更大值时，把旧 first 降为 second，再更新 first 与下标。', '否则用当前值尝试更新 second。', '扫描后判断 first>=2*second，成立返回下标，否则返回 -1。'],
    code: `class Solution:
    def dominantIndex(self, nums: List[int]) -> int:
        first, second, index = -1, -1, -1
        for i, value in enumerate(nums):
            if value > first:
                second, first, index = first, value, i
            elif value > second:
                second = value
        return index if first >= 2 * second else -1`,
    walkthrough: { input: 'nums = [1,2,3,4]', steps: ['扫描后最大值为 4，下标为 3。', '次大值为 3，其余元素都不大于 3。', '4<2×3，最大值不满足条件。'], result: '返回 -1。' },
    complexity: { time: 'O(n)，单次扫描。', space: 'O(1)。' },
    pitfalls: ['比较对象是所有其他数，可等价缩减为次大值。', '更新最大值时别忘了把旧最大值转存为次大值。'],
    related: ['414 第三大的数', '数组极值'],
  },
  748: {
    id: 748,
    title: '最短补全词',
    summary: '从候选单词中找出最短者，使其字母频次覆盖车牌中的全部英文字母；忽略大小写、数字和空格。',
    constraints: ['车牌只提取英文字母并统一为小写。', '单词需覆盖重复字母；最短并列时返回列表中最早者。'],
    examples: [{ input: 'licensePlate = "1s3 PSt", words = ["step","steps","stripe","stepple"]', output: '"steps"', explanation: '需求为 s×2、p×1、t×1，steps 是最短可覆盖单词。' }],
    intuition: '先把车牌归一化为需求计数，再逐词检查每个需求字母是否有足够频次。只在严格更短时替换答案即可保留最早并列项。',
    bruteForce: '为车牌中的每个字母反复在单词中搜索会重复扫描，尤其重复字母容易误判。',
    approach: ['过滤车牌中的字母，转小写后建立 need 频率表。', '依次为每个候选词建立 Counter。', '检查所有字母是否满足 have[ch]>=need[ch]。', '若满足且比当前答案严格更短，则更新答案。'],
    code: `class Solution:
    def shortestCompletingWord(self, licensePlate: str, words: List[str]) -> str:
        from collections import Counter
        need = Counter(ch.lower() for ch in licensePlate if ch.isalpha())
        answer = None
        for word in words:
            have = Counter(word.lower())
            if all(have[ch] >= count for ch, count in need.items()):
                if answer is None or len(word) < len(answer):
                    answer = word
        return answer`,
    walkthrough: { input: 'licensePlate = "A2a", words = ["ab","baa","caaa"]', steps: ['过滤车牌得到需求 a:2。', '"ab" 只有一个 a，不合格。', '"baa" 含两个 a 且比 "caaa" 短，选中它。'], result: '返回 "baa"。' },
    complexity: { time: 'O(L+所有单词字符总数)。', space: 'O(字符集大小)。' },
    pitfalls: ['车牌中的重复字母必须按次数覆盖。', '并列时不能用小于等于更新，否则会错误选择更晚单词。'],
    related: ['383 赎金信', '字符计数'],
  },
  754: {
    id: 754,
    title: '到达终点数字',
    summary: '从 0 出发，第 i 步必须移动 i 个单位，可向左或向右，求到达 target 的最少步数。',
    constraints: ['target 为整数，正负目标具有对称性。', '第 i 步的距离固定为 i，方向可以独立选择。'],
    examples: [{ input: 'target = 3', output: '2', explanation: '先向右走 1，再向右走 2，恰好到达 3。' }],
    intuition: '先假设全向右，走 k 步总和为 S。把某些步改向会让位置减少偶数 2x，所以只要 S>=|target| 且差值为偶数，就能通过翻转方向到达。',
    bruteForce: '逐层枚举每一步的左右选择共有 2^k 种路径，状态快速爆炸。',
    approach: ['利用对称性令 target=abs(target)。', '逐步累加 1、2、3……直到总和不小于 target。', '若 sum-target 为偶数，某些步可翻向，当前步数即答案。', '若差为奇数则继续多走一步并再次检查。'],
    code: `class Solution:
    def reachNumber(self, target: int) -> int:
        target = abs(target)
        steps = total = 0
        while total < target or (total - target) % 2:
            steps += 1
            total += steps
        return steps`,
    walkthrough: { input: 'target = 2', steps: ['走 1、2 步后总和为 3，与目标差 1 为奇数。', '再走第 3 步，总和为 6，差 4 为偶数。', '把长度 2 的一步反向：1-2+3=2。'], result: '返回 3。' },
    complexity: { time: 'O(√|target|)，三角和增长到目标量级。', space: 'O(1)。' },
    pitfalls: ['不仅要总和达到目标，还要检查差值偶性。', '负目标应先取绝对值，答案步数相同。'],
    related: ['数学奇偶性', '贪心'],
  },
  767: {
    id: 767,
    title: '重构字符串',
    summary: '重新排列字符串，使任意相邻字符都不同；若无法完成则返回空字符串。',
    constraints: ['只能重排原字符，所有出现次数必须保留。', '当最高频次超过 (n+1)//2 时必定无解。'],
    examples: [{ input: 's = "aab"', output: '"aba"', explanation: '把两个 a 分隔开即可满足相邻不同。' }],
    intuition: '每次优先放剩余最多的字符最安全，但不能紧接相同字符。用最大堆，并暂存上一轮字符一轮后再放回，可保证相邻不同。',
    bruteForce: '回溯尝试所有不同排列，最坏接近 n!，大量重复分支仍会超时。',
    approach: ['统计频率，若最高频次过大则返回空串。', '把 (-频率,字符) 放入最小堆以模拟最大堆。', '每轮弹出当前最高频字符加入结果。', '把上一轮仍有剩余的字符放回堆，再暂存当前字符。', '堆空后拼接结果。'],
    code: `class Solution:
    def reorganizeString(self, s: str) -> str:
        from collections import Counter
        import heapq
        count = Counter(s)
        if max(count.values()) > (len(s) + 1) // 2:
            return ''
        heap = [(-freq, ch) for ch, freq in count.items()]
        heapq.heapify(heap)
        result = []
        prev_count, prev_ch = 0, ''
        while heap:
            freq, ch = heapq.heappop(heap)
            result.append(ch)
            if prev_count < 0:
                heapq.heappush(heap, (prev_count, prev_ch))
            prev_count, prev_ch = freq + 1, ch
        return ''.join(result)`,
    walkthrough: { input: 's = "aaabc"', steps: ['频率为 a:3、b:1、c:1，仍可构造。', '先放 a，暂不让 a 回堆；随后放 b，再把剩余 a 放回。', '继续交替选择，可得到 "abaca"。'], result: '返回一个合法排列，如 "abaca"。' },
    complexity: { time: 'O(n log u)，u 为不同字符数。', space: 'O(u)，保存频率堆。' },
    pitfalls: ['上一字符必须延迟一轮再入堆，不能立刻放回。', '无解时要返回空串，而不是部分构造结果。'],
    related: ['621 任务调度器', '优先队列'],
  },

  769: {
    id: 769,
    title: '最多能完成排序的块',
    summary: '数组是 0 到 n-1 的一个排列，切成尽量多的连续块，各块单独排序后拼接应得到整体升序数组。',
    constraints: ['数组恰为 [0,n-1] 的一个排列。', '每个块连续且非空，排序后按原块顺序拼接。'],
    examples: [{ input: 'arr = [1,0,2,3,4]', output: '4', explanation: '可切为 [1,0]、[2]、[3]、[4] 四块。' }],
    intuition: '扫描到下标 i 时，若前缀最大值等于 i，那么前 i+1 个位置恰好包含 0..i，内部排序后不会影响后缀，可在此切块。',
    bruteForce: '枚举全部切分方案并逐块排序验证，共有指数级边界组合。',
    approach: ['从左向右维护前缀最大值 maximum。', '每读一个元素就更新 maximum。', '若 maximum==当前下标 i，说明当前前缀元素集合已闭合。', '在该位置结束一块并把答案加一。'],
    code: `class Solution:
    def maxChunksToSorted(self, arr: List[int]) -> int:
        chunks = 0
        maximum = -1
        for i, value in enumerate(arr):
            maximum = max(maximum, value)
            if maximum == i:
                chunks += 1
        return chunks`,
    walkthrough: { input: 'arr = [1,0,2]', steps: ['下标 0 的前缀最大值为 1，不能切。', '下标 1 时最大值仍为 1，可切出 [1,0]。', '下标 2 时最大值为 2，再切出 [2]。'], result: '返回 2。' },
    complexity: { time: 'O(n)，单次扫描。', space: 'O(1)。' },
    pitfalls: ['该简化判据依赖数组是 0..n-1 的排列。', '切点条件是前缀最大值等于下标，不是当前元素等于下标。'],
    related: ['768 最多能完成排序的块 II', '前缀最大值'],
  },
  771: {
    id: 771,
    title: '宝石与石头',
    summary: '给定代表宝石种类的字符集合，统计 stones 中有多少字符属于宝石。',
    constraints: ['字符区分大小写，例如 a 与 A 是不同种类。', 'jewels 中每种字符至多出现一次，stones 可重复。'],
    examples: [{ input: 'jewels = "aA", stones = "aAAbbbb"', output: '3', explanation: '石头中的 a、A、A 三个字符属于宝石。' }],
    intuition: '把宝石字符放入集合后，每块石头只需一次平均 O(1) 的成员判断。',
    bruteForce: '对每块石头线性扫描 jewels，时间 O(|jewels|×|stones|)。',
    approach: ['将 jewels 转成集合 gem_types。', '初始化计数为 0。', '逐个扫描 stones。', '字符在集合中时把计数加一，最后返回。'],
    code: `class Solution:
    def numJewelsInStones(self, jewels: str, stones: str) -> int:
        gem_types = set(jewels)
        return sum(stone in gem_types for stone in stones)`,
    walkthrough: { input: 'jewels = "z", stones = "ZZzz"', steps: ['集合只包含小写 z。', '两个大写 Z 均不匹配。', '两个小写 z 各贡献 1。'], result: '返回 2。' },
    complexity: { time: 'O(j+s)，建立集合并扫描石头。', space: 'O(j)，保存宝石种类。' },
    pitfalls: ['匹配区分大小写，不能统一转小写。', '统计的是石头数量，不是不同宝石种类数。'],
    related: ['哈希集合', '字符计数'],
  },
  779: {
    id: 779,
    title: '第 K 个语法符号',
    summary: '第 1 行为 0，每个 0 下一行生成 01、每个 1 生成 10，求第 n 行第 k 个符号。',
    constraints: ['k 使用 1-based 编号，且位于第 n 行范围内。', '无需实际构造长度为 2^(n-1) 的整行字符串。'],
    examples: [{ input: 'n = 4, k = 5', output: '1', explanation: '第 4 行为 01101001，第 5 个字符是 1。' }],
    intuition: '位置 k 的值等于 k-1 二进制中 1 的个数奇偶性：每经过一次右孩子，相对父节点翻转一次。',
    bruteForce: '逐行构造字符串会占用 O(2^n) 时间与空间。',
    approach: ['把 1-based 的 k 转成零基位置 k-1。', '观察从根到目标的路径，二进制位 1 表示走到会翻转的右孩子。', '统计 k-1 的置位数量。', '置位数为奇数返回 1，为偶数返回 0。'],
    code: `class Solution:
    def kthGrammar(self, n: int, k: int) -> int:
        return (k - 1).bit_count() % 2`,
    walkthrough: { input: 'n = 4, k = 5', steps: ['零基位置为 4，二进制写作 100。', '其中只有一个 1，代表路径上发生一次翻转。', '从初始符号 0 翻转一次得到 1。'], result: '返回 1。' },
    complexity: { time: 'O(log k)，统计整数二进制位。', space: 'O(1)。' },
    pitfalls: ['必须对 k-1 计数，因为题目位置从 1 开始。', '不要真的构造第 n 行，长度呈指数增长。'],
    related: ['递归树', '位计数'],
  },
  783: {
    id: 783,
    title: '二叉搜索树节点最小距离',
    summary: '求二叉搜索树任意两个不同节点值之差的最小值。',
    constraints: ['树中至少有两个节点。', '二叉搜索树中序遍历得到严格递增节点值序列。'],
    examples: [{ input: 'root = [4,2,6,1,3]', output: '1', explanation: '中序序列为 1,2,3,4,6，相邻差的最小值为 1。' }],
    intuition: '有序序列中最小绝对差一定出现在相邻元素之间。对 BST 中序遍历时只需比较当前值与前驱值。',
    bruteForce: '收集所有节点后比较每一对，时间 O(n²)。',
    approach: ['用栈进行迭代中序遍历。', '不断沿左链压栈，再弹出当前最小未访问节点。', '若存在前驱 prev，用 node.val-prev 更新最小差。', '记录当前值后转向右子树，遍历完成返回答案。'],
    code: `class Solution:
    def minDiffInBST(self, root: Optional[TreeNode]) -> int:
        stack, node = [], root
        prev = None
        answer = float('inf')
        while stack or node:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            if prev is not None:
                answer = min(answer, node.val - prev)
            prev = node.val
            node = node.right
        return answer`,
    walkthrough: { input: 'root = [2,1,4]', steps: ['中序先访问 1，记录为前驱。', '访问 2，差为 1，更新答案。', '访问 4，差为 2，最小值仍为 1。'], result: '返回 1。' },
    complexity: { time: 'O(n)，每个节点访问一次。', space: 'O(h)，显式栈最多保存树高节点。' },
    pitfalls: ['只比较中序相邻节点即可，不必比较所有节点对。', '前驱值可能为 0，判断时应使用 is not None。'],
    related: ['530 二叉搜索树的最小绝对差', '94 二叉树的中序遍历'],
  },
  792: {
    id: 792,
    title: '匹配子序列的单词数',
    summary: '统计 words 中有多少单词是字符串 s 的子序列；重复单词按出现次数分别计数。',
    constraints: ['子序列保持字符相对顺序，但不要求连续。', '同一单词在 words 中重复出现时，每次都计入答案。'],
    examples: [{ input: 's = "abcde", words = ["a","bb","acd","ace"]', output: '3', explanation: 'a、acd、ace 都能按顺序从 s 中取出。' }],
    intuition: '把等待某个字符的单词状态分桶。扫描 s 的字符 ch 时，只推进当前正等待 ch 的状态；推进后再放入它下一字符对应的桶。',
    bruteForce: '对每个单词单独用双指针扫描 s，时间 O(|s|×单词数)。',
    approach: ['为每个首字符建立等待队列，状态保存 (word,index)。', '扫描 s 中字符 ch，取出此刻等待 ch 的全部状态。', '将每个状态下标推进一位；若到达词尾则答案加一。', '否则把状态放入下一待匹配字符的队列。'],
    code: `class Solution:
    def numMatchingSubseq(self, s: str, words: List[str]) -> int:
        from collections import defaultdict, deque
        waiting = defaultdict(deque)
        for word in words:
            waiting[word[0]].append((word, 0))
        answer = 0
        for ch in s:
            current = waiting[ch]
            waiting[ch] = deque()
            while current:
                word, index = current.popleft()
                index += 1
                if index == len(word):
                    answer += 1
                else:
                    waiting[word[index]].append((word, index))
        return answer`,
    walkthrough: { input: 's = "abc", words = ["ac","bb"]', steps: ['初始 ac 等待 a，bb 等待 b。', '扫描 a 后 ac 推进为等待 c；扫描 b 后 bb 仍等待第二个 b。', '扫描 c 后 ac 完成，而 bb 未完成。'], result: '返回 1。' },
    complexity: { time: 'O(|s|+所有单词长度总和)。', space: 'O(单词总字符状态量)，保存等待状态。' },
    pitfalls: ['处理字符桶前要先换成空队列，避免同一字符在本轮重复推进。', '重复单词不能去重，每个状态都应独立计数。'],
    related: ['392 判断子序列', '桶式推进'],
  },

  804: {
    id: 804,
    title: '唯一摩尔斯密码词',
    summary: '把每个小写单词按字母映射为摩尔斯串，统计不同转换结果的数量。',
    constraints: ['输入单词仅含小写英文字母。', '不同单词可能得到相同的拼接摩尔斯表示。'],
    examples: [{ input: 'words = ["gin","zen","gig","msg"]', output: '2', explanation: 'gin 与 zen 转换相同，gig 与 msg 转换相同，共两种。' }],
    intuition: '逐字母查固定表并拼接即可得到单词的规范表示；集合能自动合并相同结果。',
    bruteForce: '先保存每个转换结果，再两两比较去重，时间最坏 O(w²)。',
    approach: ['准备 26 个字母对应的摩尔斯编码表。', '对每个单词逐字符查表并拼接。', '把完整转换串加入集合。', '返回集合大小。'],
    code: `class Solution:
    def uniqueMorseRepresentations(self, words: List[str]) -> int:
        codes = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]
        seen = set()
        for word in words:
            seen.add(''.join(codes[ord(ch) - ord('a')] for ch in word))
        return len(seen)`,
    walkthrough: { input: 'words = ["a","e","a"]', steps: ['a 转换为 ".-"，加入集合。', 'e 转换为 "."，形成第二种表示。', '最后一个 a 的表示已存在，集合大小不变。'], result: '返回 2。' },
    complexity: { time: 'O(C)，C 为所有单词字符总数。', space: 'O(C)，最坏保存所有不同编码。' },
    pitfalls: ['统计的是不同转换串，不是不同原单词。', '字母索引应以 a 为 0，避免映射错位。'],
    related: ['771 宝石与石头', '哈希集合'],
  },
  814: {
    id: 814,
    title: '二叉树剪枝',
    summary: '删除二叉树中所有不包含值 1 的子树，并返回剪枝后的根节点。',
    constraints: ['节点值只有 0 或 1。', '若整棵树都不含 1，最终根节点也应被删除。'],
    examples: [{ input: 'root = [1,null,0,0,1]', output: '[1,null,0,null,1]', explanation: '值为 0 的叶子子树不含 1，被剪掉。' }],
    intuition: '是否保留父节点取决于已经剪枝后的左右子树，因此必须后序处理。节点值为 0 且两个孩子都为空时，该子树不含 1。',
    bruteForce: '对每个节点另行遍历其子树判断是否含 1，会重复访问，退化为 O(n²)。',
    approach: ['递归剪枝当前节点的左子树。', '递归剪枝当前节点的右子树。', '把递归返回值重新赋给左右指针。', '若当前值为 0 且左右都为空，返回 None；否则返回当前节点。'],
    code: `class Solution:
    def pruneTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if root is None:
            return None
        root.left = self.pruneTree(root.left)
        root.right = self.pruneTree(root.right)
        if root.val == 0 and root.left is None and root.right is None:
            return None
        return root`,
    walkthrough: { input: 'root = [0,0,1]', steps: ['后序访问左叶子 0，它不含 1，返回空。', '右叶子值为 1，因此保留。', '根虽为 0，但保留的右子树含 1，所以根也保留。'], result: '返回 [0,null,1]。' },
    complexity: { time: 'O(n)，每个节点处理一次。', space: 'O(h)，递归栈深度为树高。' },
    pitfalls: ['必须先处理孩子再判断当前节点，前序无法知道子树结果。', '不要只依据当前节点值删除，值为 0 的节点也可能连接含 1 的后代。'],
    related: ['1110 删点成林', '后序遍历'],
  },
  820: {
    id: 820,
    title: '单词的压缩编码',
    summary: '用一个以 # 分隔的字符串表示所有单词，使每个单词都是某个以 # 结尾片段的后缀，求最短编码长度。',
    constraints: ['单词由小写字母组成。', '若一个单词是另一个单词的后缀，它无需单独占据编码段。'],
    examples: [{ input: 'words = ["time","me","bell"]', output: '10', explanation: '可编码为 "time#bell#"，me 已包含在 time 的后缀中。' }],
    intuition: '只有不是其他单词后缀的词才需要独立写入。先去重，再从集合中删除每个单词的所有真后缀，剩余词贡献 len(word)+1。',
    bruteForce: '尝试各种单词排列并构造最短拼接会产生阶乘级组合。',
    approach: ['用集合对 words 去重，得到 candidates。', '对每个原候选词枚举从下标 1 开始的真后缀。', '用 discard 从 candidates 删除这些后缀。', '对最终剩余单词累加长度与一个 # 字符。'],
    code: `class Solution:
    def minimumLengthEncoding(self, words: List[str]) -> int:
        candidates = set(words)
        for word in list(candidates):
            for i in range(1, len(word)):
                candidates.discard(word[i:])
        return sum(len(word) + 1 for word in candidates)`,
    walkthrough: { input: 'words = ["time","me","e"]', steps: ['去重后候选仍为 time、me、e。', 'time 的后缀中包含 me 和 e，把两者删除。', '只剩 time，需要写成 "time#"。'], result: '返回 5。' },
    complexity: { time: 'O(ΣL²)，切取并哈希各真后缀。', space: 'O(ΣL)，保存候选字符串集合。' },
    pitfalls: ['必须先去重，否则相同单词会被重复计费。', '只删除真后缀，不能从下标 0 开始删除单词自身。'],
    related: ['208 实现 Trie', '字符串后缀'],
  },
  844: {
    id: 844,
    title: '比较含退格的字符串',
    summary: '字符 # 表示删除前一个尚未删除的字符，判断两个字符串经过编辑后是否相等。',
    constraints: ['对空文本执行退格仍保持为空。', '需要比较最终文本，而不是原始字符序列。'],
    examples: [{ input: 's = "ab#c", t = "ad#c"', output: 'true', explanation: '两者处理后都得到 "ac"。' }],
    intuition: '从末尾向前扫描时，遇到 # 就增加待跳过字符数，遇到普通字符则先抵消跳过数；找到的下一个有效字符可直接逐个比较。',
    bruteForce: '分别用栈构造两个最终字符串再比较，时间 O(n+m)，但需要 O(n+m) 额外空间。',
    approach: ['为两个字符串各维护一个从末尾开始的指针。', '辅助过程跳过由 # 抵消的字符，定位下一个有效字符。', '若两边有效字符不同，立即返回 false。', '若都耗尽则返回 true，否则各自左移继续比较。'],
    code: `class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        def previous(text: str, index: int) -> int:
            skip = 0
            while index >= 0:
                if text[index] == '#':
                    skip += 1
                elif skip:
                    skip -= 1
                else:
                    break
                index -= 1
            return index

        i, j = len(s) - 1, len(t) - 1
        while i >= 0 or j >= 0:
            i, j = previous(s, i), previous(t, j)
            if i < 0 or j < 0:
                return i == j
            if s[i] != t[j]:
                return False
            i -= 1
            j -= 1
        return True`,
    walkthrough: { input: 's = "a##c", t = "#a#c"', steps: ['从末尾比较，两边首个有效字符都是 c。', '继续向左时，退格分别消去已有字符或作用于空文本。', '两边都没有剩余有效字符。'], result: '返回 true。' },
    complexity: { time: 'O(n+m)，每个字符最多扫描一次。', space: 'O(1)，只维护指针和跳过计数。' },
    pitfalls: ['连续退格可能超过前面的普通字符数。', '一边先耗尽时必须确认另一边也已耗尽。'],
    related: ['双指针', '栈模拟'],
  },
  852: {
    id: 852,
    title: '山脉数组的峰顶索引',
    summary: '在严格先升后降的山脉数组中，返回唯一峰顶的下标。',
    constraints: ['数组长度至少为 3，且存在唯一的严格峰顶。', '峰顶不在首尾，左侧严格递增、右侧严格递减。'],
    examples: [{ input: 'arr = [0,2,5,3,1]', output: '2', explanation: '值 5 大于左右相邻元素，是唯一峰顶。' }],
    intuition: '比较 mid 与 mid+1 可判断坡向：上坡说明峰顶在右侧；下坡说明 mid 可能就是峰顶，应保留在左半区间。',
    bruteForce: '从左向右找到第一个开始下降的位置，时间 O(n)。',
    approach: ['维护可能包含峰顶的闭区间 [left,right]。', '取 mid 并比较 arr[mid] 与 arr[mid+1]。', '若仍上升，令 left=mid+1。', '否则令 right=mid，保留可能的峰顶；重合时返回下标。'],
    code: `class Solution:
    def peakIndexInMountainArray(self, arr: List[int]) -> int:
        left, right = 0, len(arr) - 1
        while left < right:
            mid = (left + right) // 2
            if arr[mid] < arr[mid + 1]:
                left = mid + 1
            else:
                right = mid
        return left`,
    walkthrough: { input: 'arr = [0,2,5,3,1]', steps: ['区间 [0,4]，mid=2，5>3，峰顶在含 mid 的左半边。', '区间缩为 [0,2]，mid=1，2<5，峰顶在右侧。', '边界重合于下标 2。'], result: '返回 2。' },
    complexity: { time: 'O(log n)，每轮丢弃一半区间。', space: 'O(1)。' },
    pitfalls: ['下降时应令 right=mid，不能跳过可能正是峰顶的 mid。', '循环使用 left<right，才能保证访问 mid+1 不越界。'],
    related: ['162 寻找峰值', '二分查找'],
  },
};

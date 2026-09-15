export interface Lesson {
  id: number;
  title: string;
  summary: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  intuition: string;
  bruteForce: string;
  approach: string[];
  code: string;
  walkthrough: {
    input: string;
    steps: string[];
    result: string;
  };
  complexity: {
    time: string;
    space: string;
  };
  pitfalls: string[];
  related: string[];
}

export const lessons: Record<number, Lesson> = {
  1: {
    id: 1,
    title: '两数之和',
    summary: '在整数数组中找到两个不同位置，使它们的元素之和等于目标值，并返回这两个下标。核心不在求和，而在快速回答“当前数需要的搭档以前是否出现过”。',
    constraints: [
      '数组至少包含两个整数，元素与目标值都可能为负数、零或正数。',
      '题目保证恰有一组有效下标，因此找到后可以立即返回。',
      '同一位置不能使用两次，但相同数值可以出现在不同位置。',
      '返回下标的先后通常不影响正确性。',
    ],
    examples: [
      { input: 'nums = [4, 1, 9, 6], target = 10', output: '[1, 2]', explanation: 'nums[1] + nums[2] = 1 + 9 = 10。' },
      { input: 'nums = [5, 5], target = 10', output: '[0, 1]', explanation: '两个 5 来自不同位置，可以配对。' },
    ],
    intuition: '从左到右看每个数 x 时，真正要找的是 target - x。若把已经看过的数映射到其下标，就能用一次哈希查询确认搭档是否存在。必须先查询、再写入当前数，这一顺序天然避免同一下标与自己配对。',
    bruteForce: '枚举所有 i < j 的下标对并检查 nums[i] + nums[j]。思路直接且不易错，但长度为 n 时最多检查约 n²/2 对，无法利用已经做过的查找。',
    approach: [
      '创建哈希表 seen，键是已经扫描过的数值，值是对应下标。',
      '从左到右枚举当前下标 i 和数值 x。',
      '计算当前需要的补数 need = target - x。',
      '若 need 已在 seen 中，返回 seen[need] 与 i。',
      '若未找到，将 x -> i 写入 seen，再处理下一个元素。',
      '在题目保证有解时循环一定会提前返回；兜底返回空数组仅用于函数签名完整。',
    ],
    code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, x in enumerate(nums):
            need = target - x
            if need in seen:
                return [seen[need], i]
            seen[x] = i
        return []`,
    walkthrough: {
      input: 'nums = [3, 8, 2, 7], target = 9',
      steps: [
        'i=0，x=3，需要 6；seen 为空，于是记录 3 -> 0。',
        'i=1，x=8，需要 1；未找到，记录 8 -> 1。',
        'i=2，x=2，需要 7；未找到，记录 2 -> 2。',
        'i=3，x=7，需要 2；seen 中 2 的下标是 2。',
      ],
      result: '返回 [2, 3]。',
    },
    complexity: { time: 'O(n)，每个元素只做常数次平均 O(1) 的哈希操作。', space: 'O(n)，最坏情况下解出现在末尾，需要保存此前所有元素。' },
    pitfalls: ['先写入当前元素再查询，可能在 target = 2 * x 时错误地重复使用当前下标。', '只存“是否出现”而不存下标，最后无法构造答案。', '不要用排序后双指针直接返回位置，排序会打乱原下标，除非额外保存索引。'],
    related: ['167 两数之和 II - 输入有序数组', '560 和为 K 的子数组', '454 四数相加 II'],
  },

  3: {
    id: 3,
    title: '无重复字符的最长子串',
    summary: '求字符串中不含重复字符的最长连续片段长度。连续性决定了应维护一个可移动窗口，而不是任意挑选字符。',
    constraints: [
      '输入可以是空字符串，此时答案为 0。',
      '字符可能包括字母、数字、空格和符号，不应只按小写字母处理。',
      '需要的是连续子串，不是保持顺序但允许跳跃的子序列。',
      '同一个字符在窗口外再次出现时，不应迫使左边界后退。',
    ],
    examples: [
      { input: 's = "abcaef"', output: '5', explanation: '最长无重复子串可取 "bcaef"。' },
      { input: 's = "zz"', output: '1', explanation: '任意单个 "z" 都是不重复子串。' },
    ],
    intuition: '窗口 [left, right] 始终保持无重复。加入 s[right] 时，如果它上次出现的位置仍在窗口内，就把 left 跳到上次位置的后一格；若上次位置已经在窗口左侧，则无需处理。记录“最后出现下标”比用集合逐格删除更直接。',
    bruteForce: '枚举每个起点，再向右扩展并用集合判断重复；每个起点可能扫描到字符串末尾，最坏 O(n²)。若对每个候选子串再单独判重，甚至会达到 O(n³)。',
    approach: [
      '初始化 left = 0、best = 0，并创建 last 保存字符最后出现的位置。',
      '用 right 从左到右扫描字符串。',
      '若当前字符 ch 已出现，将 left 更新为 max(left, last[ch] + 1)。',
      '用 right - left + 1 计算当前合法窗口长度并更新 best。',
      '把 last[ch] 更新为 right，为后续重复字符提供最新位置。',
      '扫描结束后返回 best；空串会自然保留为 0。',
    ],
    code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            if ch in last:
                left = max(left, last[ch] + 1)
            last[ch] = right
            best = max(best, right - left + 1)
        return best`,
    walkthrough: {
      input: 's = "abbae"',
      steps: [
        'right=0 读到 a，窗口为 "a"，best=1。',
        'right=1 读到 b，窗口为 "ab"，best=2。',
        'right=2 再读到 b，left 跳到 2，窗口变为 "b"。',
        'right=3 读到 a；旧 a 在下标 0，已位于窗口外，left 不能回退。窗口为 "ba"。',
        'right=4 读到 e，窗口为 "bae"，best=3。',
      ],
      result: '最长长度为 3。',
    },
    complexity: { time: 'O(n)，每个右端点处理一次，左边界只向右移动。', space: 'O(min(n, 字符集大小))，保存窗口扫描期间见过字符的最后位置。' },
    pitfalls: ['把 left 直接赋为 last[ch] + 1 会让边界倒退，必须取 max。', '把子串误解为子序列。', '返回窗口内容而题目要求长度，或长度计算漏掉 +1。', '假定字符仅有 26 个小写字母，导致空格或符号处理错误。'],
    related: ['76 最小覆盖子串', '438 找到字符串中所有字母异位词', '424 替换后的最长重复字符'],
  },

  15: {
    id: 15,
    title: '三数之和',
    summary: '找出数组中所有和为零且不重复的三元组。难点是结果去重：排序后固定一个数，再用双指针有序地搜索另外两个数。',
    constraints: [
      '三元组必须来自三个不同下标，但结果按数值组合去重。',
      '数组可能包含大量重复值、负数与零。',
      '答案中三元组的排列顺序以及答案列表顺序通常不作要求。',
      '元素不足三个时没有答案。',
    ],
    examples: [
      { input: 'nums = [-2, 0, 1, 1, 2]', output: '[[-2, 0, 2], [-2, 1, 1]]', explanation: '两组数值组合之和均为 0，重复下标组合不重复输出。' },
      { input: 'nums = [0, 0, 0, 0]', output: '[[0, 0, 0]]', explanation: '虽然可选下标很多，数值三元组只保留一次。' },
    ],
    intuition: '排序把去重和搜索方向统一起来。固定 nums[i] 后，left 与 right 的和过小就左移，过大就右移；命中时同时移动并跳过重复值。固定值本身也要跳重。排序后若固定值已大于零，后面的数只会更大，可直接结束。',
    bruteForce: '枚举所有 i < j < k，计算三数之和，再把命中的排序三元组放入集合去重。时间 O(n³)，集合只能消除重复输出，不能减少枚举成本。',
    approach: [
      '将数组升序排序，使相同值相邻，并允许通过和的大小决定指针方向。',
      '枚举第一个位置 i，只到 n - 3；若 nums[i] > 0 则提前结束。',
      '若 nums[i] 与前一个固定值相同，跳过本轮，避免生成相同三元组。',
      '设置 left = i + 1、right = n - 1，计算三数之和。',
      '和小于 0 时 left 右移；和大于 0 时 right 左移。',
      '和等于 0 时记录三元组，同时移动两端，并跨过两侧所有重复值。',
    ],
    code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        ans = []
        n = len(nums)
        for i in range(n - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, n - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    ans.append([nums[i], nums[left], nums[right]])
                    left += 1
                    right -= 1
                    while left < right and nums[left] == nums[left - 1]:
                        left += 1
                    while left < right and nums[right] == nums[right + 1]:
                        right -= 1
        return ans`,
    walkthrough: {
      input: 'nums = [-1, 0, 1, 2, -1, -4]',
      steps: [
        '排序得到 [-4, -1, -1, 0, 1, 2]。',
        '固定 -4，双指针没有找到和为 4 的一对。',
        '固定第一个 -1，left 指向 -1、right 指向 2，命中 [-1, -1, 2]。',
        '继续移动后，0 与 1 配对，命中 [-1, 0, 1]。',
        '下一个固定值仍为 -1，因重复而跳过；固定 0 后无新答案。',
      ],
      result: '得到 [[-1, -1, 2], [-1, 0, 1]]。',
    },
    complexity: { time: 'O(n²)：排序 O(n log n)，每个固定位置配合一次线性双指针扫描。', space: '若不计输出，取决于排序实现；Python 的排序通常需要 O(n) 辅助空间，双指针本身 O(1)。' },
    pitfalls: ['只跳过固定位置的重复值，却忘记命中后跳过左右重复值。', '命中后不移动指针会造成死循环。', '用集合事后去重虽然可能正确，但增加内存且掩盖了双指针去重逻辑。', '提前结束条件应是 nums[i] > 0，不是 >= 0，否则会漏掉 [0,0,0]。'],
    related: ['16 最接近的三数之和', '18 四数之和', '167 两数之和 II - 输入有序数组'],
  },

  20: {
    id: 20,
    title: '有效的括号',
    summary: '判断只含三类括号的字符串是否按正确类型和顺序闭合。嵌套结构要求“最后打开的括号最先关闭”，正好对应栈的后进先出。',
    constraints: [
      '输入由圆括号、方括号和花括号字符组成。',
      '空串若被允许，应视为有效，因为没有未闭合括号。',
      '每个右括号必须与最近尚未匹配的左括号同类型。',
      '仅统计数量相等不够，括号的嵌套顺序也必须正确。',
    ],
    examples: [
      { input: 's = "{[()]}"', output: 'true', explanation: '每层都由内向外正确闭合。' },
      { input: 's = "([)]"', output: 'false', explanation: '数量虽相等，但右方括号到来时栈顶是左圆括号。' },
    ],
    intuition: '遇到左括号就暂存，遇到右括号只可能关闭栈顶的左括号。可以建立“右括号 -> 左括号”的映射，让每次关闭都变成一次统一比较。扫描途中不匹配立即失败；扫描结束还要确认没有剩余左括号。',
    bruteForce: '反复删除字符串中的 "()"、"[]"、"{}"，直到不能再删；最后为空则有效。这个方法易理解，但每轮替换都可能扫描和复制整个字符串，嵌套很深时可达 O(n²)。',
    approach: [
      '建立 closing 映射，记录每种右括号所期望的左括号。',
      '创建空栈 stack，按顺序扫描字符。',
      '若字符不是右括号，把它作为左括号压栈。',
      '若字符是右括号而栈为空，说明没有可匹配的左括号，返回 false。',
      '弹出栈顶并与 closing[ch] 比较，类型不同立即返回 false。',
      '扫描完毕后仅当栈为空才返回 true。',
    ],
    code: `class Solution:
    def isValid(self, s: str) -> bool:
        closing = {')': '(', ']': '[', '}': '{'}
        stack = []
        for ch in s:
            if ch not in closing:
                stack.append(ch)
            elif not stack or stack.pop() != closing[ch]:
                return False
        return not stack`,
    walkthrough: {
      input: 's = "([]{})"',
      steps: [
        '读到 ( 和 [，依次压栈，栈为 ["(", "["]。',
        '读到 ]，弹出的 [ 与之匹配，栈剩 ["("]。',
        '读到 { 后压栈，再由 } 匹配弹出。',
        '最后读到 )，与栈顶 ( 匹配，栈清空。',
      ],
      result: '所有关闭顺序正确，返回 true。',
    },
    complexity: { time: 'O(n)，每个字符至多入栈和出栈各一次。', space: 'O(n)，全为左括号时栈会保存全部字符。' },
    pitfalls: ['遇到右括号时直接 pop，未先判断空栈会抛出异常。', '只在扫描中检查错误，结束时忘记检查剩余左括号。', '只比较三类括号数量，无法识别交叉嵌套。'],
    related: ['22 括号生成', '32 最长有效括号', '155 最小栈'],
  },

  21: {
    id: 21,
    title: '合并两个有序链表',
    summary: '把两个非递减链表重排为一个非递减链表。通过比较当前头节点，每次摘取较小者；哑节点能统一处理结果链表的第一个节点。',
    constraints: [
      '任一输入链表都可能为空。',
      '两个链表各自已按非递减顺序排列，允许存在重复值。',
      '可以复用原链表节点，无需为每个值创建新节点。',
      '输出应保持全部节点，且不能形成环。',
    ],
    examples: [
      { input: 'list1 = [1, 4, 7], list2 = [2, 2, 8]', output: '[1, 2, 2, 4, 7, 8]', explanation: '每次从两个当前头部取较小节点。' },
      { input: 'list1 = [], list2 = [3]', output: '[3]', explanation: '一个链表为空时直接接上另一个链表。' },
    ],
    intuition: '两个链表的最小剩余元素一定在各自头部之一。比较这两个头节点即可确定合并结果的下一个节点。dummy 是不承载答案值的哑节点，让“第一次连接”和后续连接使用完全相同的 tail.next 操作。',
    bruteForce: '收集两个链表所有值，整体排序，再创建新链表。这样忽略了输入已经有序的信息，时间为 O((m+n) log(m+n))，还需要线性额外存储。',
    approach: [
      '创建 dummy 哑节点，并令 tail 指向它。',
      '当 list1 与 list2 都非空时，比较两个当前节点的 val。',
      '把值较小的节点接到 tail.next，并将对应链表指针前移。',
      '将 tail 移到刚接入的节点，继续比较剩余部分。',
      '循环结束后，至多有一个链表仍非空，把它整体接到 tail.next。',
      '返回 dummy.next，跳过哑节点本身。',
    ],
    code: `class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        tail = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 if list1 else list2
        return dummy.next`,
    walkthrough: {
      input: 'list1 = [1, 5], list2 = [2, 3, 6]',
      steps: [
        '比较 1 与 2，接入节点 1，list1 前进到 5。',
        '比较 5 与 2，接入节点 2，list2 前进到 3。',
        '比较 5 与 3，接入节点 3，list2 前进到 6。',
        '比较 5 与 6，接入节点 5，list1 变空。',
        '把 list2 剩余的节点 6 整段接到尾部。',
      ],
      result: 'dummy.next 指向 [1, 2, 3, 5, 6]。',
    },
    complexity: { time: 'O(m+n)，每个节点恰好被接入一次。', space: 'O(1)，迭代写法只使用固定数量指针，并复用原节点。' },
    pitfalls: ['移动 list1 或 list2 之前没有先连接节点，可能丢失链表。', '连接节点后忘记移动 tail，后续会反复覆盖同一个 next。', '循环条件写成“任一非空”却仍同时访问两个 val。', '返回 dummy 而不是 dummy.next，会多出一个无关节点。'],
    related: ['23 合并 K 个升序链表', '141 环形链表', '206 反转链表'],
  },

  53: {
    id: 53,
    title: '最大子数组和',
    summary: '在数组中寻找元素和最大的连续非空子数组。动态规划的关键判断是：到当前位置时，之前的连续和是值得继承，还是应从当前元素重新开始。',
    constraints: [
      '数组非空，且元素可能全部为负数。',
      '目标片段必须连续，并至少包含一个元素。',
      '只需返回最大和，不要求返回区间位置。',
      '中间和应使用足以容纳题目数值范围的整数类型。',
    ],
    examples: [
      { input: 'nums = [-3, 4, -1, 2, -6, 3]', output: '5', explanation: '连续片段 [4, -1, 2] 的和为 5。' },
      { input: 'nums = [-8, -2, -5]', output: '-2', explanation: '全为负数时必须选择最大的单个元素，而不是空数组。' },
    ],
    intuition: '设 current 为“必须以当前位置结尾”的最大和。加入 x 只有两种合理选择：把 x 接在此前最优结尾后面，或丢弃此前片段从 x 重启，即 current = max(x, current + x)。全局 best 再记录所有结尾状态中的最大值。',
    bruteForce: '枚举所有起点与终点，并累加区间和，优化后是 O(n²)；若每次重新求区间和则是 O(n³)。它重复计算了大量共享前缀的区间。',
    approach: [
      '用首元素初始化 current 和 best，确保全负数组也会选择一个元素。',
      '从第二个元素开始遍历当前值 x。',
      '比较 x 与 current + x，决定重新开始还是延续旧片段。',
      '用更新后的 current 刷新全局最大值 best。',
      '遍历中 current 始终代表以当前下标结尾的最优连续和。',
      '扫描结束返回 best，而不是 current，因为最优片段可能早已结束。',
    ],
    code: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        current = nums[0]
        best = nums[0]
        for x in nums[1:]:
            current = max(x, current + x)
            best = max(best, current)
        return best`,
    walkthrough: {
      input: 'nums = [-2, 3, -1, 4, -5]',
      steps: [
        '初始 current=best=-2。',
        '读到 3：从 3 重启优于 -2+3，current=3，best=3。',
        '读到 -1：延续得到 2，优于单独 -1，current=2。',
        '读到 4：延续得到 6，best 更新为 6。',
        '读到 -5：延续得到 1，但 best 仍为 6。',
      ],
      result: '最大和为 6，对应 [3, -1, 4]。',
    },
    complexity: { time: 'O(n)，只进行一次线性扫描。', space: 'O(1)，滚动变量替代完整动态规划数组。' },
    pitfalls: ['把 best 初始化为 0 会让全负数组错误地选择不存在的空子数组。', '只返回 current，会在最优区间不以末尾结束时出错。', '混淆“以 i 结尾的最优值”和“前 i 个元素的全局最优值”。'],
    related: ['152 乘积最大子数组', '918 环形子数组的最大和', '121 买卖股票的最佳时机'],
  },

  70: {
    id: 70,
    title: '爬楼梯',
    summary: '每次走一阶或两阶，计算到达第 n 阶的不同走法数。最后一步只有两种来源，因此问题自然形成斐波那契式递推。',
    constraints: [
      'n 为正整数，表示必须恰好到达的台阶数。',
      '每一步只能前进 1 阶或 2 阶，跨步顺序不同视为不同走法。',
      '不能越过终点后再退回。',
      '答案随 n 快速增长，语言实现需留意整数范围；Python 整数可自动扩展。',
    ],
    examples: [
      { input: 'n = 3', output: '3', explanation: '走法为 1+1+1、1+2、2+1。' },
      { input: 'n = 5', output: '8', explanation: '由到第 4 阶的 5 种与到第 3 阶的 3 种相加。' },
    ],
    intuition: '任何到达第 i 阶的路线，最后一步要么从 i-1 走 1 阶，要么从 i-2 走 2 阶，两类互斥且覆盖全部路线，所以 dp[i] = dp[i-1] + dp[i-2]。只依赖前两个状态，无需保存整张表。',
    bruteForce: '递归尝试走 1 阶和 2 阶，直到恰好到达或超过终点。递归树中相同剩余台阶会被反复计算，时间接近 O(2^n)，且有 O(n) 调用栈。',
    approach: [
      '确定基础状态：到第 1 阶有 1 种走法，到第 2 阶有 2 种。',
      '若 n 不超过 2，直接返回 n。',
      '用 prev2 表示较早状态 dp[i-2]，prev1 表示 dp[i-1]。',
      '从第 3 阶遍历到第 n 阶，计算 current = prev1 + prev2。',
      '把 prev2、prev1 同步滚动为 prev1、current。',
      '循环结束后 prev1 即为到达第 n 阶的走法数。',
    ],
    code: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        prev2, prev1 = 1, 2
        for _ in range(3, n + 1):
            prev2, prev1 = prev1, prev1 + prev2
        return prev1`,
    walkthrough: {
      input: 'n = 6',
      steps: [
        'dp[1]=1，dp[2]=2。',
        '第 3 阶：1+2=3 种。',
        '第 4 阶：2+3=5 种。',
        '第 5 阶：3+5=8 种。',
        '第 6 阶：5+8=13 种。',
      ],
      result: '共有 13 种走法。',
    },
    complexity: { time: 'O(n)，从 3 到 n 各计算一次。', space: 'O(1)，只保留相邻两个状态。' },
    pitfalls: ['基础状态写成 dp[0]=0 后直接套递推，会让 dp[2] 错误；组合计数中 dp[0] 常应理解为 1 种空走法。', '循环边界漏掉 n，导致返回 dp[n-1]。', '使用朴素递归但没有记忆化，会产生指数级重复计算。'],
    related: ['746 使用最小花费爬楼梯', '198 打家劫舍', '509 斐波那契数'],
  },

  102: {
    id: 102,
    title: '二叉树的层序遍历',
    summary: '按从上到下、每层从左到右的顺序返回二叉树节点值。广度优先搜索用队列保存下一批待访问节点，并以每轮队列长度划定一层边界。',
    constraints: [
      '根节点可能为空，此时返回空列表。',
      '节点值可重复，遍历结构不能依赖值是否唯一。',
      '每层结果应单独成组，且保持左孩子先于右孩子。',
      '树可能极度不平衡，也可能某一层非常宽。',
    ],
    examples: [
      { input: 'root = [8, 4, 10, null, 6]', output: '[[8], [4, 10], [6]]', explanation: '队列按深度逐层扩展。' },
      { input: 'root = []', output: '[]', explanation: '空树没有任何层。' },
    ],
    intuition: '队列的先进先出保证父节点先于子节点、左孩子先于右孩子。进入一轮时，队列中恰好是当前层全部节点，先记下 size，再只弹出 size 个；期间加入的孩子留给下一轮，层次就不会混在一起。',
    bruteForce: '先求树高，再对每个深度从根开始递归搜集该层节点。偏斜树高度为 n 时会反复走相同路径，最坏 O(n²)。一次 BFS 能让每个节点只被访问一次。',
    approach: [
      '若 root 为空，立即返回空列表。',
      '创建双端队列并把 root 入队，创建结果列表 ans。',
      '当队列非空时，记录当前长度 level_size，创建本层列表 level。',
      '恰好循环 level_size 次，从队首取节点并记录其值。',
      '若该节点有左、右孩子，按左后右的顺序加入队尾。',
      '完成固定次数后把 level 加入 ans，继续处理下一层。',
    ],
    code: `class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        from collections import deque
        queue = deque([root])
        ans = []
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            ans.append(level)
        return ans`,
    walkthrough: {
      input: 'root = [1, 2, 3, 4, null, null, 5]',
      steps: [
        '初始队列 [1]，本层长度为 1，输出 [1]，并加入 2、3。',
        '队列 [2,3]，固定处理 2 个节点，输出 [2,3]。',
        '处理 2 时加入 4，处理 3 时加入 5；它们不会混入当前层。',
        '下一轮队列 [4,5]，输出 [4,5]，之后队列为空。',
      ],
      result: '返回 [[1], [2, 3], [4, 5]]。',
    },
    complexity: { time: 'O(n)，每个节点入队、出队各一次。', space: 'O(w)，w 是树的最大层宽；结果空间不计时队列最多容纳一层附近的节点。' },
    pitfalls: ['在层内循环直接使用不断变化的队列长度，会把下一层也消费掉。', '用 Python 列表 pop(0) 作为队列会导致每次搬移元素，应使用 deque.popleft()。', '孩子入队顺序反了会得到从右到左的层序。', '忘记处理空根节点，可能把 None 入队后访问其 val。'],
    related: ['103 二叉树的锯齿形层序遍历', '199 二叉树的右视图', '637 二叉树的层平均值'],
  },

  121: {
    id: 121,
    title: '买卖股票的最佳时机',
    summary: '给定每日价格，只允许先买后卖一次，求最大利润。扫描卖出日时，只需知道此前最低买入价，以及当前价格卖出能获得的最好利润。',
    constraints: [
      '价格数组至少包含一天，价格为非负或正整数。',
      '最多完成一笔交易，买入必须发生在卖出之前。',
      '不交易是允许的，因此价格持续下降时答案为 0。',
      '不能同一天先按未来价格决策，也不能卖出后再把更早日期当买入日。',
    ],
    examples: [
      { input: 'prices = [9, 2, 6, 1, 7]', output: '6', explanation: '第 4 天价格 1 买入，第 5 天价格 7 卖出。' },
      { input: 'prices = [5, 4, 3]', output: '0', explanation: '没有正利润，选择不交易。' },
    ],
    intuition: '把每一天视为潜在卖出日。为了让当天利润最大，买入价应是它之前见过的最低价格。维护 min_price 后，price - min_price 就是当天卖出的最佳利润；再用 best 保存所有卖出日的最大值。',
    bruteForce: '枚举买入日 i 与其后的卖出日 j，计算 prices[j] - prices[i] 并取最大值。它明确保证时间顺序，但需要 O(n²) 次比较。',
    approach: [
      '用第一天价格初始化 min_price，用 0 初始化 best。',
      '从左到右扫描每个当天价格 price。',
      '计算若今天卖出可得的利润 price - min_price。',
      '用该利润更新 best；由于 best 初始为 0，不会返回负利润。',
      '再用当前价格更新 min_price，供未来日期作为买入候选。',
      '扫描结束返回 best，代表至多一笔交易的最大收益。',
    ],
    code: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = prices[0]
        best = 0
        for price in prices[1:]:
            best = max(best, price - min_price)
            min_price = min(min_price, price)
        return best`,
    walkthrough: {
      input: 'prices = [7, 3, 5, 2, 6]',
      steps: [
        '初始最低价为 7，best=0。',
        '看到 3：卖出无利可图，最低价更新为 3。',
        '看到 5：利润 2，best=2。',
        '看到 2：当前利润为负，最低价更新为 2。',
        '看到 6：以 2 买入可赚 4，best 更新为 4。',
      ],
      result: '最大利润为 4。',
    },
    complexity: { time: 'O(n)，只扫描价格一次。', space: 'O(1)，仅维护最低价和最大利润。' },
    pitfalls: ['用全局最低价和全局最高价直接相减，可能让卖出日早于买入日。', '把问题当成可以多次交易，会错误累加多个上涨区间。', '下降行情返回负数；题意允许不交易，应返回 0。', '若输入契约可能为空，需要额外处理；本题常见约束保证至少一天。'],
    related: ['122 买卖股票的最佳时机 II', '123 买卖股票的最佳时机 III', '309 最佳买卖股票时机含冷冻期'],
  },

  200: {
    id: 200,
    title: '岛屿数量',
    summary: '在由陆地与水组成的网格中，统计上下左右相连的陆地连通块数量。每发现一块尚未访问的陆地，就计数一次并用搜索淹没整座岛。',
    constraints: [
      '网格非空时为规则矩阵，每行列数相同。',
      '陆地以字符 "1" 表示，水以字符 "0" 表示。',
      '只有上、下、左、右相邻算连通，对角接触不属于同一座岛。',
      '允许原地修改网格时，可把访问过的陆地改成水以充当 visited 标记。',
    ],
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]', output: '3', explanation: '左上三格相连，左下与右下各自独立。' },
      { input: 'grid = [["0","0"],["0","0"]]', output: '0', explanation: '没有任何陆地。' },
    ],
    intuition: '外层扫描负责发现新岛：一个仍为 "1" 的格子不可能属于此前处理过的岛，否则早已被搜索标记。于是遇到它就把答案加一，再从这里扩展到所有四向相连的陆地并统一标记，确保同一岛只计数一次。',
    bruteForce: '对每个陆地格都尝试与其他陆地判断是否存在路径，再合并归类，会重复遍历大量区域。更系统的并查集也可做到近线性，但对静态网格而言实现比一次 DFS/BFS 更重。',
    approach: [
      '取得行数 rows 与列数 cols，初始化 islands = 0。',
      '逐行逐列扫描每个格子；水或已访问位置直接跳过。',
      '遇到字符 "1" 时，说明发现新连通块，将 islands 加一。',
      '以该位置启动 DFS，并立即把它改为 "0"，避免重复入栈。',
      'DFS 每次检查四个方向，只有边界内且仍为 "1" 的邻格才继续搜索。',
      '当搜索结束时整座岛均已标记；继续外层扫描，最终返回 islands。',
    ],
    code: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        rows, cols = len(grid), len(grid[0])

        def flood(start_r: int, start_c: int) -> None:
            stack = [(start_r, start_c)]
            grid[start_r][start_c] = '0'
            while stack:
                r, c = stack.pop()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                        grid[nr][nc] = '0'
                        stack.append((nr, nc))

        islands = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    islands += 1
                    flood(r, c)
        return islands`,
    walkthrough: {
      input: 'grid = [["1","0","1"],["1","1","0"],["0","0","1"]]',
      steps: [
        '扫描到 (0,0) 的陆地，计数变为 1。',
        '从 (0,0) 淹没 (1,0) 与 (1,1)，这三格成为同一岛。',
        '扫描到 (0,2)，它尚为陆地，计数变为 2；周围无四向陆地。',
        '最后扫描到 (2,2)，计数变为 3，并将其标记。',
      ],
      result: '共有 3 座岛。',
    },
    complexity: { time: 'O(rows × cols)，每个格子至多被扫描并标记一次。', space: 'O(rows × cols) 最坏情况，整张网格为陆地时显式 DFS 栈可能保存大量位置。' },
    pitfalls: ['把对角线也当作相邻方向，会错误合并岛屿。', '入栈时不立刻标记，而在出栈时才标记，可能让同一格被多个邻居重复加入。', '递归 DFS 在大面积陆地上可能超过 Python 递归深度，显式栈更稳妥。', '原地修改会改变输入；若调用方要求保留网格，应改用独立 visited 集合。'],
    related: ['130 被围绕的区域', '695 岛屿的最大面积', '994 腐烂的橘子'],
  },

  206: {
    id: 206,
    title: '反转链表',
    summary: '把单链表所有 next 指针反向，使原尾节点成为新头。迭代时必须先保存尚未处理的后继，再改写当前节点的指向。',
    constraints: [
      '输入头节点可能为空，也可能只有一个节点。',
      '链表按题目约定不含环。',
      '应反转节点连接关系，而不是只交换节点中的值。',
      '可以原地修改 next 指针，不需要创建等长的新链表。',
    ],
    examples: [
      { input: 'head = [2, 4, 6]', output: '[6, 4, 2]', explanation: '三个节点的指向依次反转。' },
      { input: 'head = []', output: '[]', explanation: '空链表反转后仍为空。' },
    ],
    intuition: '遍历到 curr 时，prev 已经是反转完成部分的头，curr 仍指向未处理部分。先用 nxt 保存 curr.next，再让 curr.next 指向 prev，就把 curr 接到反转部分前端；随后整体向前推进 prev 与 curr。',
    bruteForce: '把所有节点值放入数组后逆序写回，能得到值序列反转的表象，却没有真正反转节点关系，且需要 O(n) 额外空间。也可以创建全新节点，但同样浪费空间并失去原节点身份。',
    approach: [
      '初始化 prev = None，curr = head；prev 表示已反转部分。',
      '当 curr 非空时，先保存 nxt = curr.next，避免断开后丢失剩余链表。',
      '令 curr.next = prev，把当前节点的箭头反向。',
      '令 prev = curr，使当前节点成为已反转部分的新头。',
      '令 curr = nxt，继续处理原链表的下一个节点。',
      '循环结束时 curr 为空，prev 指向原尾节点，返回 prev。',
    ],
    code: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev`,
    walkthrough: {
      input: 'head = [1, 3, 5]',
      steps: [
        '开始 prev=None，curr=1；保存 3 后令 1.next=None。',
        '推进后 prev=1，curr=3；保存 5 后令 3.next=1。',
        '推进后 prev=3，curr=5；保存 None 后令 5.next=3。',
        'curr 变为 None，循环结束，prev 指向 5。',
      ],
      result: '返回链表 [5, 3, 1]。',
    },
    complexity: { time: 'O(n)，每个节点处理一次。', space: 'O(1)，迭代过程只使用三个指针变量。' },
    pitfalls: ['先改 curr.next 再保存原后继，会丢失未处理链表。', '循环后返回 head；head 已变成尾节点，正确新头是 prev。', '推进顺序错误可能形成环，例如 curr 尚未前移就让 prev 与 curr 相互指向。', '递归解法虽简洁，但需要 O(n) 调用栈，并可能触发递归深度限制。'],
    related: ['92 反转链表 II', '141 环形链表', '234 回文链表'],
  },

  704: {
    id: 704,
    title: '二分查找',
    summary: '在升序数组中查找目标值并返回下标，不存在则返回 -1。每次比较都能排除一半区间，关键是始终维护清晰一致的边界定义。',
    constraints: [
      '数组按升序排列，常见题设中元素互不相同。',
      '数组可能为空，目标值也可能小于最小值或大于最大值。',
      '只需找到目标的一个下标；在元素唯一时答案自然唯一。',
      '实现应避免边界遗漏和在某些语言中的中点加法溢出。',
    ],
    examples: [
      { input: 'nums = [-4, 0, 3, 9, 12], target = 9', output: '3', explanation: '目标值位于下标 3。' },
      { input: 'nums = [2, 5, 8], target = 6', output: '-1', explanation: '搜索区间最终为空，目标不存在。' },
    ],
    intuition: '维护闭区间 [left, right]，它表示目标若存在就一定仍在其中。比较中点值：相等则完成；中点值偏小意味着中点及其左侧都不可能是目标，令 left = mid + 1；偏大则令 right = mid - 1。',
    bruteForce: '从头到尾逐个比较，命中即返回。该方法对任意数组都适用，但没有利用有序性，最坏需要 O(n) 次比较。',
    approach: [
      '令 left = 0、right = len(nums) - 1，采用两端都包含的闭区间。',
      '只要 left <= right，说明搜索区间仍非空。',
      '计算 mid = left + (right - left) // 2。',
      '若 nums[mid] == target，立即返回 mid。',
      '若 nums[mid] < target，将 left 更新为 mid + 1。',
      '否则将 right 更新为 mid - 1；循环结束仍未命中则返回 -1。',
    ],
    code: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`,
    walkthrough: {
      input: 'nums = [1, 4, 7, 10, 13, 16], target = 13',
      steps: [
        '区间 [0,5]，mid=2，值 7 小于 13，排除 [0,2]。',
        '区间变为 [3,5]，mid=4，值为 13。',
        '比较相等，立即返回下标 4，不再缩小区间。',
      ],
      result: '返回 4。',
    },
    complexity: { time: 'O(log n)，每轮将候选区间至少缩小约一半。', space: 'O(1)，迭代实现只使用边界与中点变量。' },
    pitfalls: ['闭区间写法却使用 left < right，会漏查最后一个候选位置。', '更新为 left = mid 或 right = mid，单元素或相邻元素时可能死循环。', '混用闭区间与左闭右开区间的初始化和循环条件。', '在固定宽度整数语言中直接计算 (left + right) / 2 可能溢出，差值写法更通用。'],
    related: ['35 搜索插入位置', '34 在排序数组中查找元素的第一个和最后一个位置', '33 搜索旋转排序数组'],
  },
};

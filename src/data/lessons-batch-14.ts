import type { Lesson } from './lessons';

export const lessonsBatch14: Record<number, Lesson> = {

  856: {
    id: 856, title: '括号的分数',
    summary: '按规则计算平衡括号串的分值：一对空括号得 1，并列相加，外层包裹使内部得分翻倍。',
    constraints: ['输入仅含左右括号且整体平衡。', '每个左括号都与唯一的右括号匹配。'],
    examples: [{ input: 's = "(()(()))"', output: '6', explanation: '内部 () 与 (()) 分别得 1、2，外层再乘 2。' }],
    intuition: '每个最小单元 () 的贡献由它所处深度决定：闭合后深度为 d 时贡献 2^d；把所有最小单元贡献相加即可。',
    bruteForce: '反复查找 () 并替换成数值，再处理嵌套与相邻表达式，字符串修改多且解析繁琐。',
    approach: ['维护当前未闭合左括号深度。', '读到左括号时深度加一。', '读到右括号先减深度；若前一字符是左括号，累加 2^depth。', '扫描结束返回累计分数。'],
    code: `class Solution:
    def scoreOfParentheses(self, s: str) -> int:
        score = depth = 0
        for i, ch in enumerate(s):
            if ch == "(":
                depth += 1
            else:
                depth -= 1
                if s[i - 1] == "(":
                    score += 1 << depth
        return score`,
    walkthrough: { input: 's = "(()(()))"', steps: ['进入最外层后，首个内部 () 在深度 1 闭合，贡献 2。', '更深处的 () 在深度 2 闭合，贡献 4。', '其余右括号只负责结束包裹，不新增基本单元。'], result: '总分为 2+4=6。' },
    complexity: { time: 'O(n)，线性扫描字符串。', space: 'O(1)，只维护深度与总分。' },
    pitfalls: ['右括号应先降低深度再计算贡献。', '只有紧邻左括号的右括号代表基本单元 ()。'],
    related: ['栈', '括号匹配', '深度计数'],
  },
  859: {
    id: 859, title: '亲密字符串',
    summary: '判断能否在字符串 s 中恰好交换两个不同位置，使结果等于 goal。',
    constraints: ['两个字符串由小写英文字母组成。', '交换操作必须选择两个不同下标，即使字符可能相同。'],
    examples: [{ input: 's = "ab", goal = "ba"', output: 'true', explanation: '交换 s 的两个位置即可得到 goal。' }],
    intuition: '若两串不同，只能有两个错位且交叉相等；若本来相同，必须存在重复字符，交换这两个相同字符后内容才不变。',
    bruteForce: '枚举所有下标对进行交换并比较，需 O(n³) 字符处理或 O(n²) 次候选比较。',
    approach: ['长度不同直接返回 false。', '收集所有 s[i] 与 goal[i] 不同的位置，超过两个即可失败。', '若恰有两个错位，检查两字符能否交叉匹配。', '若没有错位，检查 s 中是否有重复字符。'],
    code: `class Solution:
    def buddyStrings(self, s: str, goal: str) -> bool:
        if len(s) != len(goal):
            return False
        diff = [i for i in range(len(s)) if s[i] != goal[i]]
        if len(diff) == 2:
            i, j = diff
            return s[i] == goal[j] and s[j] == goal[i]
        if len(diff) == 0:
            return len(set(s)) < len(s)
        return False`,
    walkthrough: { input: 's = "ab", goal = "ba"', steps: ['长度相同，继续比较。', '错位下标为 0 和 1。', 'a 对应 goal[1]，b 对应 goal[0]，可交叉匹配。'], result: '返回 true。' },
    complexity: { time: 'O(n)，比较并建立字符集合。', space: 'O(n)，错位列表与集合最坏线性；字母表固定时集合为 O(1)。' },
    pitfalls: ['字符串相等时不能直接返回 true，还需存在可交换的重复字符。', '只有一个错位或多于两个错位都不可能完成。'],
    related: ['字符串比较', '哈希集合', '错位计数'],
  },
  867: {
    id: 867, title: '转置矩阵',
    summary: '把 m×n 矩阵的行列互换，令结果位置 [j][i] 保存原位置 [i][j]。',
    constraints: ['输入是非空矩形矩阵，各行长度一致。', '元素值可为任意题目允许的整数。'],
    examples: [{ input: 'matrix = [[1,2,3],[4,5,6]]', output: '[[1,4],[2,5],[3,6]]', explanation: '原来的三列分别成为结果的三行。' }],
    intuition: '转置只是坐标映射：(i,j) 移到 (j,i)，因此直接按新矩阵的行列顺序取值即可。',
    bruteForce: '逐列取值本身已是最直接方案；若尝试原地交换，非方阵会改变形状并增加处理难度。',
    approach: ['读取原矩阵行数 m 与列数 n。', '创建 n 行、每行 m 个位置的结果。', '遍历原坐标，把 matrix[i][j] 写入 ans[j][i]。'],
    code: `class Solution:
    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:
        rows, cols = len(matrix), len(matrix[0])
        ans = [[0] * rows for _ in range(cols)]
        for i in range(rows):
            for j in range(cols):
                ans[j][i] = matrix[i][j]
        return ans`,
    walkthrough: { input: 'matrix = [[1,2,3],[4,5,6]]', steps: ['结果尺寸从 2×3 变为 3×2。', '第一列 1、4 写成结果第一行。', '其余两列同理写成 [2,5] 与 [3,6]。'], result: '得到 [[1,4],[2,5],[3,6]]。' },
    complexity: { time: 'O(mn)，每个元素搬运一次。', space: 'O(mn)，用于返回转置矩阵。' },
    pitfalls: ['结果尺寸应为 n×m，不能默认矩阵是方阵。', '坐标赋值方向是 ans[j][i] = matrix[i][j]。'],
    related: ['矩阵遍历', '坐标变换', '48 旋转图像'],
  },
  869: {
    id: 869, title: '重新排序得到 2 的幂',
    summary: '判断正整数的十进制数字能否任意重排成一个不含前导零的 2 的幂。',
    constraints: ['输入 n 为正整数。', '重排必须使用全部数字，最高位不能是 0。'],
    examples: [{ input: 'n = 46', output: 'true', explanation: '数字重排为 64，而 64=2^6。' }],
    intuition: '重排只改变顺序，不改变每个数字的出现次数；比较 n 与所有可能的 2 的幂的数字频次即可。',
    bruteForce: '生成全部数字排列并逐个转整数判断，数字重复时还会产生大量相同候选，复杂度阶乘级。',
    approach: ['把数字排序后的字符串作为排列签名。', '生成 32 位整数范围内的各个 2 的幂。', '若某个幂的签名与 n 相同则返回 true。', '全部不匹配则返回 false。'],
    code: `class Solution:
    def reorderedPowerOf2(self, n: int) -> bool:
        signature = "".join(sorted(str(n)))
        for bit in range(31):
            if "".join(sorted(str(1 << bit))) == signature:
                return True
        return False`,
    walkthrough: { input: 'n = 46', steps: ['46 的排序签名是 "46"。', '枚举到 2^6=64，其排序签名也是 "46"。', '签名一致，说明存在合法重排。'], result: '返回 true。' },
    complexity: { time: 'O(k log k)，k 为数字位数；枚举次数在整数范围内为常数。', space: 'O(k)，保存数字签名。' },
    pitfalls: ['不能只比较各位数字之和，不同数字集合可能同和。', '枚举幂的范围要覆盖题目给定 n 的上界。'],
    related: ['数字频次', '排列签名', '位运算'],
  },
  872: {
    id: 872, title: '叶子相似的树',
    summary: '按从左到右的顺序收集两棵二叉树的叶节点值，判断两个序列是否完全相同。',
    constraints: ['叶节点指左右孩子都为空的节点。', '比较既要求值相同，也要求出现顺序一致。'],
    examples: [{ input: 'root1 = [1,2,3], root2 = [1,2,3]', output: 'true', explanation: '两棵树从左到右的叶值序列都是 [2,3]。' }],
    intuition: '树的内部形状并不重要，唯一需要保留的是左到右的叶值序列；一次深度优先遍历即可按该顺序产生叶子。',
    bruteForce: '比较两棵树完整结构会把无关的内部节点纳入判断，而且形状不同也可能叶序列相同。',
    approach: ['定义递归函数收集一棵树的叶值。', '遇到叶节点就记录其值并停止向下。', '否则先遍历左子树，再遍历右子树。', '比较两棵树得到的列表。'],
    code: `class Solution:
    def leafSimilar(self, root1: Optional[TreeNode], root2: Optional[TreeNode]) -> bool:
        def leaves(node, out):
            if not node:
                return
            if not node.left and not node.right:
                out.append(node.val)
                return
            leaves(node.left, out)
            leaves(node.right, out)
        first, second = [], []
        leaves(root1, first)
        leaves(root2, second)
        return first == second`,
    walkthrough: { input: 'root1 = [1,2,3], root2 = [1,2,3]', steps: ['第一棵树先访问左叶 2，再访问右叶 3。', '第二棵树同样得到 [2,3]。', '两个叶序列逐项相等。'], result: '返回 true。' },
    complexity: { time: 'O(n+m)，访问两棵树的全部节点。', space: 'O(h1+h2+L)，递归栈与叶值列表占用空间。' },
    pitfalls: ['必须保持左到右顺序，不能只比较叶值集合。', '仅当左右孩子都为空时才记录节点。'],
    related: ['深度优先搜索', '树的叶节点', '二叉树遍历'],
  },

  876: {
    id: 876, title: '链表的中间结点',
    summary: '返回单链表的中间节点；节点数为偶数时返回两个中间节点中的后一个。',
    constraints: ['链表非空且无环。', '偶数长度必须选择靠后的中间节点。'],
    examples: [{ input: 'head = [1,2,3,4,5,6]', output: '[4,5,6]', explanation: '两个中间节点是 3 和 4，按要求返回节点 4。' }],
    intuition: '慢指针每次走一步，快指针每次走两步；快指针到尾部时，慢指针恰好走过一半。',
    bruteForce: '先遍历统计长度，再从头走 length//2 步也正确，但需要两趟链表扫描。',
    approach: ['快慢指针都从 head 出发。', '只要 fast 与 fast.next 存在，slow 走一步、fast 走两步。', '循环结束时返回 slow。'],
    code: `class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow`,
    walkthrough: { input: 'head = [1,2,3,4,5,6]', steps: ['快慢指针从节点 1 开始。', '快指针依次到 3、5、链尾，慢指针依次到 2、3、4。', '循环停止时 slow 指向节点 4。'], result: '返回以 4 开头的链表。' },
    complexity: { time: 'O(n)，单趟扫描。', space: 'O(1)。' },
    pitfalls: ['循环条件必须同时检查 fast 和 fast.next。', '从同一起点出发会自然得到偶数长度的后中点。'],
    related: ['快慢指针', '链表', '141 环形链表'],
  },
  884: {
    id: 884, title: '两句话中的不常见单词',
    summary: '找出在两句话合并后总共只出现一次的单词，返回顺序不作要求。',
    constraints: ['句子由空格分隔的小写单词组成。', '单词若在任一句中重复，或两句各出现一次，都不属于答案。'],
    examples: [{ input: 's1 = "this apple is sweet", s2 = "this apple is sour"', output: '["sweet","sour"]', explanation: 'sweet 与 sour 在两句合并后各出现一次。' }],
    intuition: '“不常见”可统一为合并词流中的频次恰好为 1，无需分别讨论来自哪一句。',
    bruteForce: '对每个单词反复扫描两句话统计次数，会造成 O(w²) 的重复比较。',
    approach: ['按空格拆分两句话。', '用计数器累计全部单词频次。', '筛选频次等于 1 的单词并返回。'],
    code: `class Solution:
    def uncommonFromSentences(self, s1: str, s2: str) -> List[str]:
        from collections import Counter
        counts = Counter((s1 + " " + s2).split())
        return [word for word, count in counts.items() if count == 1]`,
    walkthrough: { input: 's1 = "this apple is sweet", s2 = "this apple is sour"', steps: ['合并拆词后，this、apple、is 各出现两次。', 'sweet 与 sour 各出现一次。', '筛选频次为 1 的键。'], result: '返回 sweet 和 sour。' },
    complexity: { time: 'O(L)，L 为两句话总字符量。', space: 'O(u)，u 为不同单词数。' },
    pitfalls: ['不能只找每句内部出现一次的词，还要排除另一句也出现的词。', '答案顺序无要求，不应依赖固定顺序判题。'],
    related: ['哈希计数', '字符串分词', '349 两个数组的交集'],
  },
  885: {
    id: 885, title: '螺旋矩阵 III',
    summary: '从指定格出发按东、南、西、北方向向外扩张螺旋，依次记录落在矩阵边界内的全部坐标。',
    constraints: ['起点位于 rows×cols 矩阵内部。', '行列均从 0 开始，移动可暂时越出矩阵。'],
    examples: [{ input: 'rows = 1, cols = 4, rStart = 0, cStart = 0', output: '[[0,0],[0,1],[0,2],[0,3]]', explanation: '螺旋途中只记录位于唯一一行内的坐标。' }],
    intuition: '螺旋的移动长度按 1,1,2,2,3,3… 增长，每走两个方向后步长加一；越界不终止，只是不记录。',
    bruteForce: '在每一轮构造更大的外接矩形并扫描边界，容易重复角点，也要额外处理起点偏移。',
    approach: ['先记录起点，方向依次设为东、南、西、北。', '以当前步长连续走两个方向。', '每移动一步，若坐标在界内就加入答案。', '两个方向后步长加一，收集满 rows×cols 个坐标即结束。'],
    code: `class Solution:
    def spiralMatrixIII(self, rows: int, cols: int, rStart: int, cStart: int) -> List[List[int]]:
        ans = [[rStart, cStart]]
        r, c, length = rStart, cStart, 1
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        d = 0
        while len(ans) < rows * cols:
            for _ in range(2):
                dr, dc = directions[d % 4]
                for _ in range(length):
                    r, c = r + dr, c + dc
                    if 0 <= r < rows and 0 <= c < cols:
                        ans.append([r, c])
                d += 1
            length += 1
        return ans`,
    walkthrough: { input: 'rows=1, cols=4, start=(0,0)', steps: ['记录起点 (0,0)，向东一步记录 (0,1)。', '向南、向西及向北的部分位置越界，不记录。', '后续向东扩张依次覆盖 (0,2)、(0,3)，数量达到 4。'], result: '返回该行四个坐标的访问顺序。' },
    complexity: { time: 'O(M²)，M=max(rows,cols)，包含越界移动；输出本身为 O(rows·cols)。', space: 'O(rows·cols)，保存答案。' },
    pitfalls: ['越界后仍要继续沿螺旋移动，不能重置到边界。', '步长每两个方向增加一次，而不是每次转向都增加。'],
    related: ['矩阵模拟', '螺旋遍历', '54 螺旋矩阵'],
  },
  889: {
    id: 889, title: '根据前序和后序遍历构造二叉树',
    summary: '根据同一棵二叉树的前序与后序序列构造任意一棵符合条件的树；答案可能不唯一。',
    constraints: ['节点值互不相同，两个序列长度相等且描述同一棵树。', '只有单个孩子时无法由这两种遍历唯一判断其左右方向。'],
    examples: [{ input: 'preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]', output: '[1,2,3,4,5,6,7]', explanation: '该树的两种遍历与输入一致。' }],
    intuition: '前序首项是根；若还有节点，下一项就是左子树根。它在后序中的位置给出左子树大小，随后可递归切分两段。',
    bruteForce: '枚举所有可能的左右子树划分并验证遍历，会产生指数级分支。',
    approach: ['建立节点值到后序下标的映射。', '递归区间首个前序值作为根。', '用 preorder[pl+1] 在后序的位置计算左子树大小。', '按大小递归构造左右区间并连接。'],
    code: `class Solution:
    def constructFromPrePost(self, preorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        pos = {value: i for i, value in enumerate(postorder)}
        def build(pl, pr, ql, qr):
            if pl > pr:
                return None
            root = TreeNode(preorder[pl])
            if pl == pr:
                return root
            left_size = pos[preorder[pl + 1]] - ql + 1
            root.left = build(pl + 1, pl + left_size, ql, ql + left_size - 1)
            root.right = build(pl + left_size + 1, pr, ql + left_size, qr - 1)
            return root
        return build(0, len(preorder) - 1, 0, len(postorder) - 1)`,
    walkthrough: { input: 'pre=[1,2,4,5,3], post=[4,5,2,3,1]', steps: ['根为 1，下一前序值 2 在后序下标 2，左子树大小为 3。', '左段 pre=[2,4,5]、post=[4,5,2] 递归构造，右段只含 3。', '连接左右子树后，两种遍历均还原输入。'], result: '得到一棵合法二叉树。' },
    complexity: { time: 'O(n)，映射使每次划分为 O(1)。', space: 'O(n)，下标映射与递归栈。' },
    pitfalls: ['后序区间末项是当前根，递归右子树时要排除它。', '题目允许多解，不必尝试确定单孩子究竟在左还是右。'],
    related: ['树的重建', '前序遍历', '后序遍历'],
  },
  890: {
    id: 890, title: '查找和替换模式',
    summary: '筛选与给定模式存在字符双射的单词：相同模式字符必须对应相同字母，不同字符不能映射到同一字母。',
    constraints: ['所有候选单词与 pattern 长度相同。', '单词和模式由小写英文字母组成。'],
    examples: [{ input: 'words = ["abc","deq","mee","aqq","dkd","ccc"], pattern = "abb"', output: '["mee","aqq"]', explanation: '这两个单词都具有“首字符不同、后两字符相同”的结构。' }],
    intuition: '具体字母不重要，只需比较首次出现位置形成的结构签名；例如 mee 与 abb 都规范化为 [0,1,1]。',
    bruteForce: '为每个单词枚举字母替换关系或排列，候选映射数量巨大。',
    approach: ['定义规范化函数，为字符按首次出现顺序编号。', '计算 pattern 的结构签名。', '逐个规范化单词。', '保留签名与模式完全一致的单词。'],
    code: `class Solution:
    def findAndReplacePattern(self, words: List[str], pattern: str) -> List[str]:
        def shape(text):
            ids = {}
            return [ids.setdefault(ch, len(ids)) for ch in text]
        target = shape(pattern)
        return [word for word in words if shape(word) == target]`,
    walkthrough: { input: 'word = "mee", pattern = "abb"', steps: ['模式 a 首见编号 0，b 首见编号 1，得到 [0,1,1]。', '单词 m 编号 0，e 编号 1，也得到 [0,1,1]。', '两个结构签名相同，因此 mee 被保留。'], result: 'mee 匹配该模式。' },
    complexity: { time: 'O(w·m)，w 为单词数，m 为单词长度。', space: 'O(m)，单次规范化及签名空间。' },
    pitfalls: ['映射必须是双向唯一，仅检查 pattern→word 会误收不同模式字母映到同一字母的情况。', '比较的是结构，不是字母表顺序。'],
    related: ['双射', '哈希映射', '205 同构字符串'],
  },
  896: {
    id: 896, title: '单调数列',
    summary: '判断数组是否整体非递减或整体非递增，相邻元素相等不会破坏单调性。',
    constraints: ['数组至少含一个整数。', '允许重复元素，单调定义包含相等。'],
    examples: [{ input: 'nums = [1,2,2,3]', output: 'true', explanation: '每个元素都不小于前一个，数组非递减。' }],
    intuition: '扫描所有相邻差：若既出现正差又出现负差，方向发生冲突；否则至少满足一种单调方向。',
    bruteForce: '分别复制、升序排序和降序排序后比较，需 O(n log n) 时间及额外数组。',
    approach: ['初始化 increasing 与 decreasing 标记为 true。', '相邻后项小于前项时否定非递减。', '相邻后项大于前项时否定非递增。', '返回两个标记的逻辑或。'],
    code: `class Solution:
    def isMonotonic(self, nums: List[int]) -> bool:
        increasing = decreasing = True
        for i in range(1, len(nums)):
            if nums[i] < nums[i - 1]:
                increasing = False
            if nums[i] > nums[i - 1]:
                decreasing = False
        return increasing or decreasing`,
    walkthrough: { input: 'nums = [1,2,2,3]', steps: ['1→2 上升，因此数组不可能非递增。', '2→2 相等，不影响任一有效方向。', '2→3 继续上升，非递减标记始终为真。'], result: '返回 true。' },
    complexity: { time: 'O(n)，扫描一次。', space: 'O(1)。' },
    pitfalls: ['相等元素不应让任何方向失效。', '最终条件是“非递减或非递增”，不是二者同时成立。'],
    related: ['数组扫描', '相邻差分', '941 有效的山脉数组'],
  },

  897: {
    id: 897, title: '递增顺序搜索树',
    summary: '把二叉搜索树重排为仅有右孩子的递增链，节点顺序等于原树的中序遍历顺序。',
    constraints: ['输入是一棵合法二叉搜索树。', '结果中每个节点的左孩子都必须为空。'],
    examples: [{ input: 'root = [2,1,3]', output: '[1,null,2,null,3]', explanation: '中序顺序 1、2、3 被连接成右向链。' }],
    intuition: '二叉搜索树的中序遍历天然递增；遍历时用尾指针把当前节点追加到结果右侧，并清空其左指针即可。',
    bruteForce: '先收集所有值，再新建整棵树，虽可行但没有复用原节点并需要 O(n) 值列表。',
    approach: ['创建哑节点并令 tail 指向它。', '中序递归访问左子树。', '清空当前节点左孩子，将其接到 tail.right，再更新 tail。', '访问右子树，最后返回 dummy.right。'],
    code: `class Solution:
    def increasingBST(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        dummy = TreeNode(0)
        tail = dummy
        def inorder(node):
            nonlocal tail
            if not node:
                return
            inorder(node.left)
            node.left = None
            tail.right = node
            tail = node
            inorder(node.right)
        inorder(root)
        return dummy.right`,
    walkthrough: { input: 'root = [2,1,3]', steps: ['中序先访问节点 1，将它接到哑节点之后。', '回到节点 2，清空左孩子并接到 1 的右侧。', '最后追加节点 3，形成 1→2→3。'], result: '返回 [1,null,2,null,3]。' },
    complexity: { time: 'O(n)，每个节点处理一次。', space: 'O(h)，递归栈高度为 h。' },
    pitfalls: ['连接前必须清空当前节点的 left。', '应按中序而不是前序连接，否则不会递增。'],
    related: ['二叉搜索树', '中序遍历', '树转链表'],
  },
  904: {
    id: 904, title: '水果成篮',
    summary: '求只包含至多两种数值的最长连续子数组，可理解为两个篮子各装一种水果。',
    constraints: ['每棵树用整数表示水果种类。', '必须选择一段连续区间，篮子容量不限但种类至多两种。'],
    examples: [{ input: 'fruits = [1,2,3,2,2]', output: '4', explanation: '连续区间 [2,3,2,2] 只含两类且长度为 4。' }],
    intuition: '右端不断扩张；出现第三类时，左端收缩并更新频次，直到窗口重新只含两类。',
    bruteForce: '枚举每个起点并向右扩展到出现第三类，最坏需要 O(n²)。',
    approach: ['用哈希表记录窗口内各类数量。', '右指针逐项加入水果。', '种类数超过 2 时移动左指针并删除零频键。', '每轮用窗口长度更新答案。'],
    code: `class Solution:
    def totalFruit(self, fruits: List[int]) -> int:
        counts = {}
        left = answer = 0
        for right, fruit in enumerate(fruits):
            counts[fruit] = counts.get(fruit, 0) + 1
            while len(counts) > 2:
                old = fruits[left]
                counts[old] -= 1
                if counts[old] == 0:
                    del counts[old]
                left += 1
            answer = max(answer, right - left + 1)
        return answer`,
    walkthrough: { input: 'fruits = [1,2,3,2,2]', steps: ['窗口先包含 [1,2]，长度 2。', '加入 3 后有三类，左端移过 1，窗口变为 [2,3]。', '继续加入 2、2，窗口 [2,3,2,2] 长度达到 4。'], result: '返回 4。' },
    complexity: { time: 'O(n)，每个元素至多进出窗口一次。', space: 'O(1)，有效窗口至多保存三类计数。' },
    pitfalls: ['必须删除频次降为零的键，否则种类数判断错误。', '题目要求连续区间，不能只取出现最多的两个全局种类。'],
    related: ['滑动窗口', '至多 K 种字符', '159 至多两个不同字符的最长子串'],
  },
  905: {
    id: 905, title: '按奇偶排序数组',
    summary: '重排数组，使所有偶数出现在所有奇数之前；两组内部顺序不作要求。',
    constraints: ['数组元素为非负整数。', '允许原地修改，答案不要求稳定排序。'],
    examples: [{ input: 'nums = [3,1,2,4]', output: '[4,2,1,3]', explanation: '前两项为偶数、后两项为奇数，组内顺序可不同。' }],
    intuition: '左指针寻找放错位置的奇数，右指针寻找放错位置的偶数，交换后两边各修正一个位置。',
    bruteForce: '对整个数组按奇偶键排序需要 O(n log n)，且做了题目不需要的完整排序。',
    approach: ['左右指针指向数组两端。', '左侧为偶数就右移左指针。', '右侧为奇数就左移右指针。', '两边都停在错位元素时交换，直到相遇。'],
    code: `class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        left, right = 0, len(nums) - 1
        while left < right:
            if nums[left] % 2 == 0:
                left += 1
            elif nums[right] % 2 == 1:
                right -= 1
            else:
                nums[left], nums[right] = nums[right], nums[left]
                left += 1
                right -= 1
        return nums`,
    walkthrough: { input: 'nums = [3,1,2,4]', steps: ['左端 3 是奇数、右端 4 是偶数，交换得 [4,1,2,3]。', '左指针越过偶数 4，右指针越过奇数 3。', '再交换 1 与 2，奇偶分区完成。'], result: '得到 [4,2,1,3]。' },
    complexity: { time: 'O(n)，双指针总共线性移动。', space: 'O(1)，原地交换。' },
    pitfalls: ['结果不唯一，不要依赖示例中的具体组内顺序。', '取模判断应与当前停留条件配套，避免指针不移动。'],
    related: ['双指针', '原地分区', '922 按奇偶排序数组 II'],
  },
  912: {
    id: 912, title: '排序数组',
    summary: '将整数数组按非递减顺序排列，使用稳定且最坏 O(n log n) 的迭代归并排序。',
    constraints: ['数组可含负数、零与重复值。', '需要在大规模输入下避免平方级排序。'],
    examples: [{ input: 'nums = [5,2,3,1]', output: '[1,2,3,5]', explanation: '所有元素按从小到大排列。' }],
    intuition: '先把长度 1 的有序段两两合并，再把段长依次翻倍；每轮所有元素只参与一次归并。',
    bruteForce: '冒泡或选择排序容易实现，但最坏 O(n²)，数据较大时会超时。',
    approach: ['准备同长度辅助数组，初始有序段宽度为 1。', '每次取相邻两个有序段，用双指针归并到辅助数组。', '一轮结束后交换源数组与辅助数组。', '宽度翻倍，直到覆盖整个数组。'],
    code: `class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        n = len(nums)
        src, dst = nums[:], [0] * n
        width = 1
        while width < n:
            for left in range(0, n, 2 * width):
                mid, right = min(left + width, n), min(left + 2 * width, n)
                i, j, k = left, mid, left
                while i < mid or j < right:
                    if j >= right or (i < mid and src[i] <= src[j]):
                        dst[k] = src[i]
                        i += 1
                    else:
                        dst[k] = src[j]
                        j += 1
                    k += 1
            src, dst = dst, src
            width *= 2
        return src`,
    walkthrough: { input: 'nums = [5,2,3,1]', steps: ['宽度 1 时分别归并为 [2,5] 与 [1,3]。', '宽度扩大到 2，比较两个有序段的段首。', '依次取出 1、2、3、5，得到完整有序数组。'], result: '返回 [1,2,3,5]。' },
    complexity: { time: 'O(n log n)，共有对数轮线性归并。', space: 'O(n)，使用辅助数组。' },
    pitfalls: ['最后一段可能不足 width，边界必须用 min 截断。', '每轮交换源与目标数组后，不要错误地固定返回原 nums。'],
    related: ['归并排序', '分治', '215 数组中的第 K 个最大元素'],
  },
  918: {
    id: 918, title: '环形子数组的最大和',
    summary: '求非空环形数组中连续子数组的最大元素和，区间可以跨越数组末尾与开头。',
    constraints: ['必须选择至少一个元素。', '每个数组位置在所选环形子数组中最多使用一次。'],
    examples: [{ input: 'nums = [5,-3,5]', output: '10', explanation: '跨边界选择末尾 5 与开头 5，总和为 10。' }],
    intuition: '最优解要么不跨边界，是普通最大子数组；要么跨边界，等价于总和减去中间的一段最小子数组。',
    bruteForce: '从每个起点向环上扩展最多 n 项并累计，时间 O(n²)。',
    approach: ['一次扫描同时做最大子数组与最小子数组的 Kadane。', '记录数组总和 total。', '若最大子数组和小于 0，说明全为负数，直接返回该最大值。', '否则比较 maxSum 与 total-minSum。'],
    code: `class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        total = 0
        cur_max = cur_min = 0
        best_max = float("-inf")
        best_min = float("inf")
        for value in nums:
            cur_max = max(value, cur_max + value)
            best_max = max(best_max, cur_max)
            cur_min = min(value, cur_min + value)
            best_min = min(best_min, cur_min)
            total += value
        if best_max < 0:
            return best_max
        return max(best_max, total - best_min)`,
    walkthrough: { input: 'nums = [5,-3,5]', steps: ['普通最大子数组和为 7。', '总和为 7，最小子数组是 [-3]，其和为 -3。', '跨界候选为 7-(-3)=10，比 7 更大。'], result: '返回 10。' },
    complexity: { time: 'O(n)，一次遍历。', space: 'O(1)。' },
    pitfalls: ['全负数组中 total-minSum 会对应空子数组，必须单独返回 bestMax。', '跨界候选删除的是连续最小段，不是任意负数。'],
    related: ['Kadane 算法', '53 最大子数组和', '环形数组'],
  },

  921: {
    id: 921, title: '使括号有效的最少添加',
    summary: '计算最少添加多少个左右括号，才能让只含括号的字符串变成有效括号串。',
    constraints: ['输入仅包含 ( 和 )。', '可以在任意位置插入括号，但不能删除或重排原字符。'],
    examples: [{ input: 's = "()))(("', output: '4', explanation: '扫描中缺两个左括号，结束后还缺两个右括号。' }],
    intuition: 'balance 表示尚未匹配的左括号数；遇到无法匹配的右括号就必须补一个左括号，扫描后剩余 balance 个左括号各需补右括号。',
    bruteForce: '尝试在各位置插入不同括号并验证，会形成庞大的组合搜索。',
    approach: ['遇到左括号时 balance 加一。', '遇到右括号且 balance>0 时消耗一个左括号。', '若 balance=0，则记录需要补一个左括号。', '返回缺失左括号数加最终 balance。'],
    code: `class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        balance = missing_left = 0
        for ch in s:
            if ch == "(":
                balance += 1
            elif balance > 0:
                balance -= 1
            else:
                missing_left += 1
        return missing_left + balance`,
    walkthrough: { input: 's = "()))(("', steps: ['前两个字符 () 匹配，balance 回到 0。', '接着两个右括号均无左括号可配，missingLeft 变为 2。', '末尾两个左括号未闭合，balance=2。'], result: '最少添加 2+2=4 个括号。' },
    complexity: { time: 'O(n)，扫描一次。', space: 'O(1)。' },
    pitfalls: ['balance 不应降为负数；无法匹配的右括号应单独计入答案。', '扫描结束后别忘了为剩余左括号补右括号。'],
    related: ['括号匹配', '贪心', '1249 移除无效的括号'],
  },
  922: {
    id: 922, title: '按奇偶排序数组 II',
    summary: '重排等量奇偶元素的数组，使偶数下标放偶数、奇数下标放奇数。',
    constraints: ['数组长度为偶数，奇数与偶数元素数量相同。', '答案可任意排列，不要求保持原相对顺序。'],
    examples: [{ input: 'nums = [4,2,5,7]', output: '[4,5,2,7]', explanation: '下标 0、2 为偶数值，下标 1、3 为奇数值。' }],
    intuition: '只需分别在偶数下标和奇数下标上寻找错位项；一个错位奇数必能与一个错位偶数交换。',
    bruteForce: '为每个错位位置从全数组寻找可交换元素，会重复扫描，最坏 O(n²)。',
    approach: ['even 从 0 开始每次加 2，寻找偶数下标上的奇数。', 'odd 从 1 开始每次加 2，寻找奇数下标上的偶数。', '两者都未到末尾时交换错位元素。', '继续扫描直到所有位置合法。'],
    code: `class Solution:
    def sortArrayByParityII(self, nums: List[int]) -> List[int]:
        even, odd, n = 0, 1, len(nums)
        while even < n and odd < n:
            while even < n and nums[even] % 2 == 0:
                even += 2
            while odd < n and nums[odd] % 2 == 1:
                odd += 2
            if even < n and odd < n:
                nums[even], nums[odd] = nums[odd], nums[even]
        return nums`,
    walkthrough: { input: 'nums = [4,2,5,7]', steps: ['偶数下标 0 的值 4 正确，even 前进到 2。', '奇数下标 1 的值 2 错误，odd 停在 1；下标 2 的值 5 也错位。', '交换下标 1 与 2，得到 [4,5,2,7]。'], result: '所有位置的下标奇偶与数值奇偶一致。' },
    complexity: { time: 'O(n)，两个指针各扫描一半下标。', space: 'O(1)，原地交换。' },
    pitfalls: ['指针每次应加 2，只扫描对应奇偶性的下标。', '交换后无需立即手动推进，内层循环会越过已修正位置。'],
    related: ['双指针', '原地分区', '905 按奇偶排序数组'],
  },
  929: {
    id: 929, title: '独特的电子邮件地址',
    summary: '按本地名规则规范化邮箱并统计不同实际地址：忽略点号，且加号后的本地名内容作废。',
    constraints: ['每个邮箱恰含一个 @，域名部分不应用这些转换。', '加号与点号规则只作用于 @ 之前的本地名。'],
    examples: [{ input: 'emails = ["a.b+c@x.com","ab@x.com","a.b@y.com"]', output: '2', explanation: '前两个都规范为 ab@x.com，第三个域名不同。' }],
    intuition: '为每个原邮箱计算唯一的规范形式，再借助集合自动去重。',
    bruteForce: '两两根据规则比较邮箱是否等价，需要 O(n²) 次字符串处理。',
    approach: ['用 @ 分离本地名与域名。', '本地名在第一个 + 处截断。', '删除截断后本地名中的所有点号。', '拼回域名加入集合，最终返回集合大小。'],
    code: `class Solution:
    def numUniqueEmails(self, emails: List[str]) -> int:
        normalized = set()
        for email in emails:
            local, domain = email.split("@")
            local = local.split("+")[0].replace(".", "")
            normalized.add(local + "@" + domain)
        return len(normalized)`,
    walkthrough: { input: 'a.b+c@x.com 与 ab@x.com', steps: ['第一个本地名在 + 前截为 a.b。', '删除点号后得到 ab，并拼成 ab@x.com。', '第二个本来就是同一规范地址，集合只保留一次。'], result: '这两个输入只计一个独特地址。' },
    complexity: { time: 'O(L)，L 为全部邮箱字符总数。', space: 'O(L)，集合保存规范地址。' },
    pitfalls: ['不能删除域名中的点号。', '只忽略第一个加号及其后的本地名内容。'],
    related: ['字符串规范化', '哈希集合', '域名解析'],
  },
  930: {
    id: 930, title: '和相同的二元子数组',
    summary: '统计二进制数组中元素和恰好等于 goal 的非空连续子数组数量。',
    constraints: ['数组元素只可能是 0 或 1。', 'goal 为非负整数，答案按不同起止下标计数。'],
    examples: [{ input: 'nums = [1,0,1,0,1], goal = 2', output: '4', explanation: '有四段连续区间的元素和为 2。' }],
    intuition: '若当前前缀和为 prefix，任何此前值为 prefix-goal 的前缀都能与当前位置组成一个目标子数组。',
    bruteForce: '枚举所有起止位置并累计区间和，直接实现最坏 O(n²)。',
    approach: ['哈希表初始记录前缀和 0 出现一次。', '扫描元素并更新 prefix。', '把 prefix-goal 的历史出现次数加入答案。', '再增加当前 prefix 的频次。'],
    code: `class Solution:
    def numSubarraysWithSum(self, nums: List[int], goal: int) -> int:
        counts = {0: 1}
        prefix = answer = 0
        for value in nums:
            prefix += value
            answer += counts.get(prefix - goal, 0)
            counts[prefix] = counts.get(prefix, 0) + 1
        return answer`,
    walkthrough: { input: 'nums = [1,0,1,0,1], goal = 2', steps: ['前缀和依次为 1、1、2；到 2 时历史前缀 0 提供一个区间。', '下一项 0 使前缀仍为 2，再增加一个区间。', '末项后前缀为 3，历史前缀 1 出现两次，再增加两个。'], result: '累计得到 4。' },
    complexity: { time: 'O(n)，每项做常数次哈希操作。', space: 'O(n)，保存前缀和频次。' },
    pitfalls: ['必须预置 counts[0]=1，才能统计从下标 0 开始的区间。', '先查询再记录当前前缀，尤其 goal=0 时可避免把空区间计入。'],
    related: ['前缀和', '哈希计数', '560 和为 K 的子数组'],
  },
  931: {
    id: 931, title: '下降路径最小和',
    summary: '从方阵第一行任一格出发，每步走到下一行的同列或相邻列，求到最后一行的最小路径和。',
    constraints: ['输入为非空 n×n 整数矩阵。', '每次列号变化只能为 -1、0 或 1，且不能越界。'],
    examples: [{ input: 'matrix = [[2,1,3],[6,5,4],[7,8,9]]', output: '13', explanation: '路径 1→5→7 的和为 13，是最小值。' }],
    intuition: '到达当前格的最优代价，只依赖上一行可连接的至多三个格；逐行滚动即可。',
    bruteForce: '从第一行每个位置枚举三叉路径，路径数量随行数指数增长。',
    approach: ['令 prev 为第一行的代价。', '对后续每个格，取 prev 中同列及相邻列的最小值。', '加上当前格值得到新一行 cur。', '滚动更新 prev，最后返回其中最小值。'],
    code: `class Solution:
    def minFallingPathSum(self, matrix: List[List[int]]) -> int:
        prev = matrix[0][:]
        n = len(matrix)
        for r in range(1, n):
            cur = [0] * n
            for c in range(n):
                best = prev[c]
                if c > 0:
                    best = min(best, prev[c - 1])
                if c + 1 < n:
                    best = min(best, prev[c + 1])
                cur[c] = matrix[r][c] + best
            prev = cur
        return min(prev)`,
    walkthrough: { input: 'matrix = [[2,1,3],[6,5,4],[7,8,9]]', steps: ['第一行代价为 [2,1,3]。', '计算第二行得到 [7,6,5]。', '计算第三行得到 [13,13,14]，末行最小值为 13。'], result: '返回 13。' },
    complexity: { time: 'O(n²)，处理每个矩阵元素一次。', space: 'O(n)，只保存前一行与当前行。' },
    pitfalls: ['边缘列只有两个可选前驱，不能越界读取。', '当前行不能原地混用刚更新的值，应与 prev 分开。'],
    related: ['动态规划', '滚动数组', '64 最小路径和'],
  },

  946: {
    id: 946, title: '验证栈序列',
    summary: '判断 pushed 与 popped 是否可能分别是同一空栈的一组入栈、出栈顺序。',
    constraints: ['两个序列长度相同且元素互不相同。', '每个元素恰好入栈和出栈一次。'],
    examples: [{ input: 'pushed = [1,2,3,4,5], popped = [4,5,3,2,1]', output: 'true', explanation: '压入 1 至 4 后弹出 4，再压入并弹出 5，随后依次弹出 3、2、1。' }],
    intuition: '按 pushed 固定顺序压栈；只要栈顶正好是下一个期望弹出的元素，就立即弹出。该贪心不会损失任何可行方案。',
    bruteForce: '在每一步枚举选择入栈还是出栈，再回溯验证，会产生指数级操作序列。',
    approach: ['创建空栈与 popped 指针 j。', '依次把 pushed 元素压入栈。', '栈顶等于 popped[j] 时持续弹栈并推进 j。', '最终检查 j 是否到达 popped 末尾。'],
    code: `class Solution:
    def validateStackSequences(self, pushed: List[int], popped: List[int]) -> bool:
        stack = []
        j = 0
        for value in pushed:
            stack.append(value)
            while stack and j < len(popped) and stack[-1] == popped[j]:
                stack.pop()
                j += 1
        return j == len(popped)`,
    walkthrough: { input: 'pushed=[1,2,3,4,5], popped=[4,5,3,2,1]', steps: ['先压入 1、2、3、4，栈顶命中 4 并弹出。', '压入 5 后命中并弹出 5。', '栈顶依次为 3、2、1，全部按目标顺序弹出。'], result: '目标序列被完整消费，返回 true。' },
    complexity: { time: 'O(n)，每个元素入栈、出栈各一次。', space: 'O(n)，模拟栈最坏保存全部元素。' },
    pitfalls: ['一次压栈后可能连续弹出多个元素，必须使用 while。', '比较 popped[j] 前要确保 j 未越界。'],
    related: ['栈模拟', '贪心', '155 最小栈'],
  },
  951: {
    id: 951, title: '翻转等价二叉树',
    summary: '判断两棵二叉树能否通过任意节点交换左右子树而变得完全相同。',
    constraints: ['允许在零个或多个节点执行左右孩子交换。', '节点值按题目约束用于对应比较。'],
    examples: [{ input: 'root1 = [1,2,3], root2 = [1,3,2]', output: 'true', explanation: '翻转 root1 的根节点即可与 root2 相同。' }],
    intuition: '根值必须相等；子树匹配只有两种方式：左右按原方向对应，或左右交叉对应。递归检查其中任一种即可。',
    bruteForce: '枚举每个节点翻或不翻的全部组合，最坏有 2^n 种状态。',
    approach: ['两个节点都空时返回 true，仅一方为空时返回 false。', '节点值不同立即返回 false。', '检查不翻转时左右子树分别匹配。', '再检查翻转时左对右、右对左；任一成立即可。'],
    code: `class Solution:
    def flipEquiv(self, root1: Optional[TreeNode], root2: Optional[TreeNode]) -> bool:
        if not root1 or not root2:
            return root1 is root2
        if root1.val != root2.val:
            return False
        same = (self.flipEquiv(root1.left, root2.left) and
                self.flipEquiv(root1.right, root2.right))
        flipped = (self.flipEquiv(root1.left, root2.right) and
                   self.flipEquiv(root1.right, root2.left))
        return same or flipped`,
    walkthrough: { input: 'root1=[1,2,3], root2=[1,3,2]', steps: ['两个根值都为 1。', '原方向比较时 2 与 3 不同，same 失败。', '交叉比较 2 对 2、3 对 3 均成功。'], result: '返回 true。' },
    complexity: { time: 'O(n)，在节点值可区分对应关系的约束下每个节点常数次比较。', space: 'O(h)，递归栈由树高决定。' },
    pitfalls: ['空节点必须成对判断，不能访问空节点的 val。', '要同时检查“不翻”和“翻转”两种子树对应方式。'],
    related: ['树递归', '100 相同的树', '226 翻转二叉树'],
  },
  953: {
    id: 953, title: '验证外星语词典',
    summary: '根据给定的 26 字母新顺序，判断单词列表是否已按该字典序非递减排列。',
    constraints: ['order 是 26 个小写字母的一种排列。', '字典序比较中，若一词是另一词前缀，较短者应在前。'],
    examples: [{ input: 'words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"', output: 'true', explanation: '首字母 h 在新顺序中位于 l 之前。' }],
    intuition: '只需检查每对相邻单词，因为字典序具有传递性；首个不同字符决定大小，完全匹配到短词末尾时由长度决定。',
    bruteForce: '按新字母序重新排序全部单词再与原列表比较，需要 O(n log n) 次比较。',
    approach: ['建立字符到外星顺序下标的映射。', '逐对比较相邻单词。', '找到首个不同字符时检查其秩是否递增。', '若公共部分覆盖较短词，则禁止较长词排在其前面。'],
    code: `class Solution:
    def isAlienSorted(self, words: List[str], order: str) -> bool:
        rank = {ch: i for i, ch in enumerate(order)}
        for first, second in zip(words, words[1:]):
            for a, b in zip(first, second):
                if a != b:
                    if rank[a] > rank[b]:
                        return False
                    break
            else:
                if len(first) > len(second):
                    return False
        return True`,
    walkthrough: { input: 'words=["hello","leetcode"]', steps: ['建立 order 中每个字母的排名。', '比较相邻两词，首字符 h 与 l 已不同。', 'h 的排名小于 l，因此这一对顺序正确。'], result: '所有相邻对合法，返回 true。' },
    complexity: { time: 'O(L)，L 为比较相邻单词时扫描的字符总量。', space: 'O(1)，排名表固定为 26 项。' },
    pitfalls: ['较长单词不能排在自己的短前缀之前，如 apple 在 app 前非法。', '一旦找到首个不同字符，后续字符不再影响这一对的顺序。'],
    related: ['自定义字典序', '字符串比较', '269 火星词典'],
  },
  958: {
    id: 958, title: '二叉树的完全性检验',
    summary: '判断二叉树是否完全：除最后一层外均填满，最后一层节点从左向右连续出现。',
    constraints: ['输入根节点非空。', '节点缺失后，层序序列中不能再出现任何实际节点。'],
    examples: [{ input: 'root = [1,2,3,4,5,6]', output: 'true', explanation: '最后一层的 4、5、6 从最左侧连续排列。' }],
    intuition: '把空孩子也纳入层序遍历；完全二叉树一旦遇到第一个空位，之后队列中只能继续出现空位。',
    bruteForce: '为节点编号并统计高度、逐层检查数量也能判断，但最后一层边界处理更复杂。',
    approach: ['队列从根开始做层序遍历。', '遇到空节点后设置 seenNull 标记。', '若标记已设置后又遇到非空节点，立即返回 false。', '非空节点的左右孩子都入队，遍历结束返回 true。'],
    code: `class Solution:
    def isCompleteTree(self, root: Optional[TreeNode]) -> bool:
        from collections import deque
        queue = deque([root])
        seen_null = False
        while queue:
            node = queue.popleft()
            if node is None:
                seen_null = True
            else:
                if seen_null:
                    return False
                queue.append(node.left)
                queue.append(node.right)
        return True`,
    walkthrough: { input: 'root = [1,2,3,4,5,6]', steps: ['层序先访问 1、2、3、4、5、6，期间都是真实节点。', '随后访问叶子的空孩子，seenNull 变为 true。', '此后队列中不再出现真实节点，满足完全性。'], result: '返回 true。' },
    complexity: { time: 'O(n)，每个真实节点及其空孩子常数次处理。', space: 'O(n)，队列最坏保存一层及空位。' },
    pitfalls: ['必须把空孩子加入队列，才能发现中间空洞。', '出现首个空位后再见真实节点，无论位于哪一层都应判 false。'],
    related: ['层序遍历', '完全二叉树', '919 完全二叉树插入器'],
  },
};
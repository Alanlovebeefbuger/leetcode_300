import type { Lesson } from './lessons';

export const lessonsBatch12: Record<number, Lesson> = {
  606: {
    id: 606, title: '根据二叉树创建字符串',
    summary: '按前序遍历把二叉树写成带括号的字符串；在不破坏结构唯一性的前提下省略多余空括号。',
    constraints: ['节点数至少为 1，节点值为整数。', '右孩子存在而左孩子为空时，左侧空括号必须保留。'],
    examples: [{ input: 'root = [1,2,3,null,4]', output: '"1(2()(4))(3)"', explanation: '节点 2 缺左孩子却有右孩子 4，因此写出空的左括号。' }],
    intuition: '每个节点先写自身，再写孩子。叶子无需括号；只有左孩子时写左侧即可；只要右孩子存在，就必须同时给左、右位置加括号。',
    bruteForce: '先序列化所有空节点再反复删除冗余括号，既产生长中间串，也容易误删决定左右位置的空标记。',
    approach: ['递归函数返回当前子树的字符串。', '空节点返回空串，叶子只返回数值。', '存在左孩子时追加括住的左子树。', '存在右孩子时，无论左边是否为空都追加左右两组括号。'],
    code: `class Solution:
    def tree2str(self, root: Optional[TreeNode]) -> str:
        def build(node):
            if not node:
                return ""
            text = str(node.val)
            if node.left or node.right:
                text += "(" + build(node.left) + ")"
            if node.right:
                text += "(" + build(node.right) + ")"
            return text
        return build(root)`,
    walkthrough: { input: 'root = [1,2,3,null,4]', steps: ['从根 1 开始，左右子树都要写入。', '节点 2 有右孩子 4，形成 2()(4)。', '根节点拼接左右结果得到 1(2()(4))(3)。'], result: '返回 "1(2()(4))(3)"。' },
    complexity: { time: 'O(n)，每个节点访问一次。', space: 'O(h)，递归栈深度为树高；输出占 O(n)。' },
    pitfalls: ['不能省略“无左有右”节点的空左括号。', '叶子节点后不要添加无意义的 ()。'],
    related: ['前序遍历', '二叉树序列化', '536 从字符串生成二叉树'],
  },
  609: {
    id: 609, title: '在系统中查找重复文件',
    summary: '解析目录描述，把文件内容相同的完整路径归为一组，只返回至少含两个文件的组。',
    constraints: ['每条输入先给目录，随后每项形如 文件名(内容)。', '文件名、目录与内容按题目约定不含会破坏该格式的分隔符。'],
    examples: [{ input: 'paths = ["root/a 1.txt(x) 2.txt(y)","root/b 3.txt(x)"]', output: '[["root/a/1.txt","root/b/3.txt"]]', explanation: '两个文件的内容都为 x。' }],
    intuition: '重复关系由内容决定，因此以内容为哈希键；扫描时解析文件名和括号内文本，再保存目录与文件名拼成的路径。',
    bruteForce: '两两比较所有文件内容需要 O(f²) 次比较，文件数量增加时浪费明显。',
    approach: ['按空格拆分每条目录描述。', '对每个文件项定位左括号，分离文件名与内容。', '以内容为键收集完整路径。', '过滤长度小于 2 的分组。'],
    code: `class Solution:
    def findDuplicate(self, paths: List[str]) -> List[List[str]]:
        from collections import defaultdict
        groups = defaultdict(list)
        for line in paths:
            parts = line.split()
            folder = parts[0]
            for item in parts[1:]:
                pos = item.index("(")
                name = item[:pos]
                content = item[pos + 1:-1]
                groups[content].append(folder + "/" + name)
        return [files for files in groups.values() if len(files) > 1]`,
    walkthrough: { input: '["root/a 1.txt(x) 2.txt(y)", "root/b 3.txt(x)"]', steps: ['第一条建立 x→root/a/1.txt 与 y→root/a/2.txt。', '第二条把 root/b/3.txt 加入内容 x 的分组。', '过滤后仅 x 对应的两个路径满足重复条件。'], result: '返回包含两个 x 文件路径的分组。' },
    complexity: { time: 'O(L)，L 为全部输入字符总量。', space: 'O(L)，保存内容键和所有文件路径。' },
    pitfalls: ['哈希键应是括号内内容，不是文件名。', '答案不能包含只有一个路径的分组。'],
    related: ['哈希分组', '字符串解析', '文件系统设计'],
  },
  611: {
    id: 611, title: '有效三角形的个数',
    summary: '统计数组中任选三个下标可组成非退化三角形的方案数；排序后只需验证两条较短边之和大于最长边。',
    constraints: ['边长为非负整数，三个元素来自不同下标。', '相同长度位于不同下标时仍按不同方案计数。'],
    examples: [{ input: 'nums = [2,2,3,4]', output: '3', explanation: '两个 [2,3,4] 下标组合与一个 [2,2,3] 均有效。' }],
    intuition: '排序后固定最大边 nums[k]，用双指针寻找较短两边。若 nums[i]+nums[j]>nums[k]，那么 i 到 j-1 与 j 搭配都成立，可一次增加 j-i。',
    bruteForce: '枚举所有三元组并检查三角不等式，时间 O(n³)。',
    approach: ['先将边长升序排序。', '从下标 2 起固定每个最大边 k。', '令 i=0、j=k-1；和过小时右移 i。', '和足够大时累加 j-i，再左移 j。'],
    code: `class Solution:
    def triangleNumber(self, nums: List[int]) -> int:
        nums.sort()
        answer = 0
        for k in range(2, len(nums)):
            i, j = 0, k - 1
            while i < j:
                if nums[i] + nums[j] > nums[k]:
                    answer += j - i
                    j -= 1
                else:
                    i += 1
        return answer`,
    walkthrough: { input: 'nums = [2,2,3,4]', steps: ['排序不变，固定最大边 3 时，2+2>3，计 1。', '固定最大边 4，2+3>4，两个 2 都能与 3 配对，计 2。', '累计得到 3 个有效下标组合。'], result: '返回 3。' },
    complexity: { time: 'O(n²)，排序 O(n log n) 后逐个最大边双指针扫描。', space: 'O(log n)，取决于语言排序实现。' },
    pitfalls: ['条件必须严格大于，等于会形成退化三角形。', '计数按下标组合，不能先对边长去重。'],
    related: ['三数之和', '排序与双指针', '259 较小的三数之和'],
  },

  617: {
    id: 617, title: '合并二叉树',
    summary: '把两棵树相同位置的节点值相加；某位置仅一棵树有节点时，保留该侧子树。',
    constraints: ['输入是两棵合法二叉树，节点值可为负数。', '合并结果必须保持原有左右位置关系。'],
    examples: [{ input: 'root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]', output: '[3,4,5,5,4,null,7]', explanation: '重叠节点逐位相加，单独存在的节点直接保留。' }],
    intuition: '合并天然具有递归结构：当前节点负责求和，左右子树分别执行同样操作。任一节点为空时，另一侧已经是该位置的完整答案。',
    bruteForce: '分别遍历两棵树记录“路径→值”，再按路径重建结果，需要额外哈希表且没有利用树结构。',
    approach: ['若一侧节点为空，直接返回另一侧节点。', '两侧都存在时把 root2 的值加到 root1。', '递归合并左右孩子。', '返回修改后的 root1。'],
    code: `class Solution:
    def mergeTrees(self, root1: Optional[TreeNode], root2: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root1:
            return root2
        if not root2:
            return root1
        root1.val += root2.val
        root1.left = self.mergeTrees(root1.left, root2.left)
        root1.right = self.mergeTrees(root1.right, root2.right)
        return root1`,
    walkthrough: { input: 'root1 = [1,3,2], root2 = [2,1,3]', steps: ['根节点相加为 3。', '左孩子 3+1 得 4，右孩子 2+3 得 5。', '叶子以下两侧皆空，递归结束。'], result: '得到 [3,4,5]。' },
    complexity: { time: 'O(m)，m 为两棵树重叠访问及接入节点的数量上界。', space: 'O(h)，递归栈由较小的共同递归深度决定，最坏 O(n)。' },
    pitfalls: ['一侧为空时不要继续访问其属性。', '此实现会修改 root1；若要求保留输入，应新建节点。'],
    related: ['树的递归', '100 相同的树', '226 翻转二叉树'],
  },
  623: {
    id: 623, title: '在二叉树中增加一行',
    summary: '在指定深度插入一整行值为 val 的节点，并让原子树按左右方向分别挂到新节点下。',
    constraints: ['depth 从 1 开始，输入根可能按题目约束为非空。', '插入后原左子树接新左节点的左侧，原右子树接新右节点的右侧。'],
    examples: [{ input: 'root = [4,2,6,3,1,5], val = 1, depth = 2', output: '[4,1,1,2,null,null,6,3,1,5]', explanation: '在根下插入两个值为 1 的新节点。' }],
    intuition: '真正需要修改的是深度 depth-1 的父节点。到达这些节点后保存旧孩子，创建两个新节点并按规定重新连接即可。',
    bruteForce: '把整棵树序列化为层序数组、插入占位再重建，空位处理复杂且耗费 O(n) 额外空间。',
    approach: ['depth=1 时创建新根并把旧根接为其左孩子。', '用队列逐层走到 depth-1。', '对该层每个节点保存原左右孩子。', '创建两个新节点并分别接回旧左、旧右子树。'],
    code: `class Solution:
    def addOneRow(self, root: Optional[TreeNode], val: int, depth: int) -> Optional[TreeNode]:
        from collections import deque
        if depth == 1:
            return TreeNode(val, root, None)
        queue = deque([root])
        for _ in range(depth - 2):
            for _ in range(len(queue)):
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        for node in queue:
            old_left, old_right = node.left, node.right
            node.left = TreeNode(val, old_left, None)
            node.right = TreeNode(val, None, old_right)
        return root`,
    walkthrough: { input: 'root = [4,2,6], val=1, depth=2', steps: ['目标父层是深度 1，仅包含根 4。', '保存原孩子 2 与 6，创建两个值为 1 的节点。', '把 2 接到新左节点左侧，把 6 接到新右节点右侧。'], result: '得到 [4,1,1,2,null,null,6]。' },
    complexity: { time: 'O(n)，最坏访问插入层以上的全部节点。', space: 'O(w)，队列最多保存一层节点。' },
    pitfalls: ['depth=1 必须单独创建新根。', '原右子树应接到新右节点的 right，而不是 left。'],
    related: ['层序遍历', '树结构修改', '919 完全二叉树插入器'],
  },
  628: {
    id: 628, title: '三个数的最大乘积',
    summary: '从数组选择三个数，使乘积最大；候选只可能是三个最大值，或两个最小负数与最大值。',
    constraints: ['数组至少含三个整数，元素可正、可负或为零。', '返回数值乘积，不要求返回所选下标。'],
    examples: [{ input: 'nums = [-10,-10,1,3,2]', output: '300', explanation: '两个最小负数相乘为正，再乘最大值 3。' }],
    intuition: '三个数乘积要最大，若使用两个负数，就应取绝对值最大的两个负数；第三项总应取最大值。除此之外，只需比较最大的三项。',
    bruteForce: '枚举所有三元组需要 O(n³) 次乘法与比较。',
    approach: ['升序排序数组。', '计算末尾三个最大元素的乘积。', '计算开头两个最小元素与最大元素的乘积。', '返回两个候选中的较大者。'],
    code: `class Solution:
    def maximumProduct(self, nums: List[int]) -> int:
        nums.sort()
        return max(nums[-1] * nums[-2] * nums[-3],
                   nums[0] * nums[1] * nums[-1])`,
    walkthrough: { input: 'nums = [-10,-10,1,2,3]', steps: ['排序后最大三项乘积为 1×2×3=6。', '两个最小值与最大值乘积为 (-10)×(-10)×3=300。', '比较两个候选，选择 300。'], result: '返回 300。' },
    complexity: { time: 'O(n log n)，由排序主导。', space: 'O(log n)，取决于排序实现。' },
    pitfalls: ['不能只取三个最大元素，两个大负数可能翻转符号。', '零与全负数组无需特判，两个候选已覆盖。'],
    related: ['排序', '152 乘积最大子数组', '三数选择'],
  },
  633: {
    id: 633, title: '平方数之和',
    summary: '判断非负整数 c 能否写成两个整数平方之和，两个整数可以相同或为零。',
    constraints: ['c 为非负整数。', '只需判断是否存在，不要求列出全部表示。'],
    examples: [{ input: 'c = 5', output: 'true', explanation: '1²+2²=5。' }],
    intuition: '令左端从 0 增长、右端从 floor(sqrt(c)) 减小。平方和偏小就增左端，偏大就减右端，单调性保证不会漏解。',
    bruteForce: '枚举 a 后再枚举 b，最多需要 O(c) 对候选；逐个检查平方也做了大量重复工作。',
    approach: ['设置 a=0、b=isqrt(c)。', '计算 a²+b²。', '和小于 c 时增加 a，大于 c 时减少 b。', '相等返回 true，指针交错后返回 false。'],
    code: `class Solution:
    def judgeSquareSum(self, c: int) -> bool:
        from math import isqrt
        left, right = 0, isqrt(c)
        while left <= right:
            total = left * left + right * right
            if total == c:
                return True
            if total < c:
                left += 1
            else:
                right -= 1
        return False`,
    walkthrough: { input: 'c = 5', steps: ['初始 left=0、right=2，平方和为 4，偏小。', 'left 增为 1，平方和变成 1+4=5。', '命中目标，立即返回 true。'], result: '5 可表示为 1²+2²。' },
    complexity: { time: 'O(√c)，每轮至少移动一个指针。', space: 'O(1)。' },
    pitfalls: ['使用整数平方根，避免浮点精度判断。', '循环条件要允许 left==right，以覆盖两个平方数相同。'],
    related: ['双指针', '367 有效的完全平方数', '平方根'],
  },
  636: {
    id: 636, title: '函数的独占时间',
    summary: '根据单线程嵌套调用日志，计算每个函数真正执行的时间，排除其子调用占用的区间。',
    constraints: ['日志按时间排序且描述合法的单线程调用栈。', 'end 时间戳包含该时刻，因此结束区间长度需加 1。'],
    examples: [{ input: 'n=2, logs=["0:start:0","1:start:2","1:end:5","0:end:6"]', output: '[3,4]', explanation: '函数 1 独占 4 个单位，函数 0 在其前后共执行 3 个单位。' }],
    intuition: '栈顶就是当前运行函数。每条日志到来前，栈顶从 prev 执行到当前边界；start 把边界停在当前时间，end 则把包含终点的一段结算并将下一起点移到 time+1。',
    bruteForce: '逐时间单位模拟并查找当时运行函数，时间跨度很大时成本取决于最大时间戳而非日志数。',
    approach: ['维护调用栈、上一未结算时间 prev 与答案数组。', '遇到 start，先把 [prev,time) 计给旧栈顶，再压入新函数。', '遇到 end，把 [prev,time] 计给栈顶并弹出。', '结束后令 prev=time+1，继续处理下一日志。'],
    code: `class Solution:
    def exclusiveTime(self, n: int, logs: List[str]) -> List[int]:
        answer = [0] * n
        stack = []
        prev = 0
        for log in logs:
            fid, kind, stamp = log.split(":")
            fid, stamp = int(fid), int(stamp)
            if kind == "start":
                if stack:
                    answer[stack[-1]] += stamp - prev
                stack.append(fid)
                prev = stamp
            else:
                answer[stack.pop()] += stamp - prev + 1
                prev = stamp + 1
        return answer`,
    walkthrough: { input: 'logs=["0:start:0","1:start:2","1:end:5","0:end:6"]', steps: ['函数 0 从时刻 0 执行到 2 之前，先计 2。', '函数 1 覆盖 2 到 5，因终点包含在内计 4。', '函数 0 在时刻 6 再执行 1，总计 3。'], result: '返回 [3,4]。' },
    complexity: { time: 'O(m)，m 为日志条数。', space: 'O(n+d)，答案数组加最大调用深度栈。' },
    pitfalls: ['end 日志的持续时间必须加 1。', '结束后 prev 要更新为 timestamp+1，避免重复计数。'],
    related: ['栈', '事件扫描', '394 字符串解码'],
  },
  648: {
    id: 648, title: '单词替换',
    summary: '用词典中最短的词根替换句子里以该词根开头的单词；没有匹配则保留原词。',
    constraints: ['词典和句子由小写单词构成，句中单词以单空格分隔。', '多个词根可匹配时必须选择长度最短者。'],
    examples: [{ input: 'dictionary=["cat","bat","rat"], sentence="the cattle was rattled"', output: '"the cat was rat"', explanation: 'cattle 与 rattled 分别取最短匹配词根。' }],
    intuition: '最短词根一定是单词从第一个字符开始的某个最早前缀。把词根放入集合，然后按前缀长度递增检查，首次命中即可停止。',
    bruteForce: '对每个单词逐一与所有词根比较，最坏需要 O(单词数×词根数×长度)。',
    approach: ['把 dictionary 放入哈希集合。', '对句中每个单词依次生成长度 1 到完整长度的前缀。', '首次在集合中命中时选为替换结果。', '连接替换后的单词并返回。'],
    code: `class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        roots = set(dictionary)
        def replace(word):
            for end in range(1, len(word) + 1):
                if word[:end] in roots:
                    return word[:end]
            return word
        return " ".join(replace(word) for word in sentence.split())`,
    walkthrough: { input: 'dictionary=["cat","c"], sentence="cattle dog"', steps: ['把 cat 与 c 加入词根集合。', '扫描 cattle 的前缀，长度 1 的 c 最先命中。', 'dog 没有命中任何词根，保持不变。'], result: '返回 "c dog"。' },
    complexity: { time: 'O(S·W)，S 为句子字符量、W 为单词最大长度；切片会带来前缀复制。', space: 'O(D+S)，保存词根集合与输出。' },
    pitfalls: ['必须按前缀长度递增，不能任取一个匹配词根。', '词根只能匹配单词开头，不能匹配中间子串。'],
    related: ['字典树', '前缀匹配', '208 实现 Trie'],
  },
  649: {
    id: 649, title: 'Dota2 参议院',
    summary: '两派参议员按循环顺序行动，每次存活者禁用一名对手；双方都采用最优策略，判断最终胜方。',
    constraints: ['字符串仅含 R 与 D，且至少有一名参议员。', '行动顺序循环进行，被禁用者之后不再行动。'],
    examples: [{ input: 'senate = "RDD"', output: '"Dire"', explanation: '首位 R 禁掉一个 D，剩余 D 在下一轮前禁掉 R。' }],
    intuition: '最优选择是禁掉接下来最早行动的对手。分别记录两派下标，较小下标先行动并淘汰对方；胜者下标加 n 后进入下一轮队尾。',
    bruteForce: '反复扫描字符串并删除角色会频繁移动字符，最坏产生 O(n²) 开销。',
    approach: ['把 R、D 的初始下标分别放入两个队列。', '每轮弹出双方最早下标。', '下标较小者先行动，其新下标加 n 后入队。', '某队列为空时返回另一派名称。'],
    code: `class Solution:
    def predictPartyVictory(self, senate: str) -> str:
        from collections import deque
        n = len(senate)
        radiant = deque(i for i, ch in enumerate(senate) if ch == "R")
        dire = deque(i for i, ch in enumerate(senate) if ch == "D")
        while radiant and dire:
            r, d = radiant.popleft(), dire.popleft()
            if r < d:
                radiant.append(r + n)
            else:
                dire.append(d + n)
        return "Radiant" if radiant else "Dire"`,
    walkthrough: { input: 'senate = "RDD"', steps: ['队列为 R:[0]、D:[1,2]，0 先于 1，R 留到下一轮下标 3。', '比较 R 的 3 与 D 的 2，D 先行动并回到下标 5。', 'R 队列已空，D 方仍有人存活。'], result: '返回 "Dire"。' },
    complexity: { time: 'O(n)，每次淘汰一人，总轮数至多 n-1。', space: 'O(n)，两个队列保存存活下标。' },
    pitfalls: ['胜者重新入队时要加 n，表示下一轮顺序。', '不能只按当前人数多少直接判断胜负。'],
    related: ['队列模拟', '贪心', '1823 找出游戏的获胜者'],
  },
  650: {
    id: 650, title: '只有两个键的键盘',
    summary: '从一个字符 A 出发，只能复制全部与粘贴，求得到恰好 n 个 A 的最少操作次数。',
    constraints: ['n 为正整数，初始屏幕已有一个 A。', '复制操作总是复制当前全部内容，粘贴使用最近一次复制结果。'],
    examples: [{ input: 'n = 9', output: '6', explanation: '依次按因子 3、3 扩大，每次需要一次复制和两次粘贴。' }],
    intuition: '一次“复制后粘贴若干次”会把当前长度乘以某个因子 f，成本正好为 f。把 n 分解为质因数后，各质因数之和就是最小成本。',
    bruteForce: '用状态搜索枚举屏幕长度与剪贴板长度，状态多且需要防止超过 n。',
    approach: ['从最小因子 d=2 开始试除 n。', '只要 d 能整除当前 n，就把 d 加入答案并令 n除以d。', '不能整除时增加 d。', '当剩余 n 变为 1 时返回因子总和。'],
    code: `class Solution:
    def minSteps(self, n: int) -> int:
        answer = 0
        factor = 2
        while factor * factor <= n:
            while n % factor == 0:
                answer += factor
                n //= factor
            factor += 1
        if n > 1:
            answer += n
        return answer`,
    walkthrough: { input: 'n = 9', steps: ['9 可被 3 整除，答案加 3，剩余目标因子为 3。', '再次提取因子 3，答案累计为 6，剩余为 1。', '两个三倍阶段各需复制一次、粘贴两次。'], result: '最少需要 6 步。' },
    complexity: { time: 'O(√n)，试除到平方根。', space: 'O(1)。' },
    pitfalls: ['n=1 时无需任何操作，应返回 0。', '最后大于 1 的剩余量本身是质因数，必须加入答案。'],
    related: ['质因数分解', '动态规划', '651 四键键盘'],
  },

  654: {
    id: 654, title: '最大二叉树',
    summary: '按规则递归建树：区间最大值作为根，其左、右侧元素分别构成左右子树。',
    constraints: ['数组元素互不相同，输入数组非空。', '节点在树中的相对结构由原数组顺序决定。'],
    examples: [{ input: 'nums = [3,2,1,6,0,5]', output: '[6,3,5,null,2,0,null,null,1]', explanation: '全局最大值 6 为根，左右区间继续按最大值递归。' }],
    intuition: '题目定义本身就是分治：找到当前区间最大值便确定根和唯一分界，左右区间互不干扰，可分别递归构造。',
    bruteForce: '先枚举所有可能树形再检验是否满足定义会产生指数级候选，完全没有必要。',
    approach: ['递归函数接收半开区间 [left,right)。', '在线性扫描中找到区间最大值下标 best。', '以该值创建根节点。', '递归构造 best 左右两个区间并连接。'],
    code: `class Solution:
    def constructMaximumBinaryTree(self, nums: List[int]) -> Optional[TreeNode]:
        def build(left, right):
            if left >= right:
                return None
            best = left
            for i in range(left + 1, right):
                if nums[i] > nums[best]:
                    best = i
            root = TreeNode(nums[best])
            root.left = build(left, best)
            root.right = build(best + 1, right)
            return root
        return build(0, len(nums))`,
    walkthrough: { input: 'nums = [3,2,1,6,0,5]', steps: ['全区间最大值 6 成为根。', '左区间 [3,2,1] 以 3 为根并向右延伸，右区间 [0,5] 以 5 为根。', '继续处理各空区间与单元素区间，完成连接。'], result: '得到根为 6 的最大二叉树。' },
    complexity: { time: '最坏 O(n²)，单调数组会重复扫描长区间。', space: '最坏 O(n)，递归树退化成链。' },
    pitfalls: ['左右子树必须使用最大值在原数组中的两侧区间。', '半开区间的空区间条件是 left>=right。'],
    related: ['分治', '单调栈', 'Cartesian Tree'],
  },
  659: {
    id: 659, title: '分割数组为连续子序列',
    summary: '把已排序数组的每个元素恰好使用一次，拆成若干公差为 1、长度至少为 3 的子序列。',
    constraints: ['nums 按非递减顺序排列，元素可重复。', '每个元素必须归入且只归入一个子序列。'],
    examples: [{ input: 'nums = [1,2,3,3,4,5]', output: 'true', explanation: '可分为 [1,2,3] 与 [3,4,5]。' }],
    intuition: '处理 x 时，应优先延长等待 x 的旧序列，因为旧序列若断掉将无法补救；没有旧序列可接时，只能立即确认 x+1、x+2 可用并新建长度 3 的序列。',
    bruteForce: '回溯尝试把每个元素放入所有现有序列或新序列，重复值会造成指数级分支。',
    approach: ['用 remain 记录未使用频次，need 记录有多少序列正等待某个值。', '若 x 已用完则跳过；若 need[x]>0，优先接到旧序列并改为等待 x+1。', '否则检查 x+1 与 x+2 是否可用，消耗三者并令新序列等待 x+3。', '两种方式都不可行时返回 false，扫描完返回 true。'],
    code: `class Solution:
    def isPossible(self, nums: List[int]) -> bool:
        from collections import Counter
        remain = Counter(nums)
        need = Counter()
        for x in nums:
            if remain[x] == 0:
                continue
            if need[x] > 0:
                remain[x] -= 1
                need[x] -= 1
                need[x + 1] += 1
            elif remain[x + 1] > 0 and remain[x + 2] > 0:
                remain[x] -= 1
                remain[x + 1] -= 1
                remain[x + 2] -= 1
                need[x + 3] += 1
            else:
                return False
        return True`,
    walkthrough: { input: 'nums = [1,2,3,3,4,5]', steps: ['从 1 无旧序列可接，消耗 1、2、3，新序列等待 4。', '遇到第二个 3，再消耗 3、4、5，新序列等待 6。', '所有频次都被合法使用，两条序列长度均至少为 3。'], result: '返回 true。' },
    complexity: { time: 'O(n)，哈希操作平均 O(1)。', space: 'O(n)，两个频次表保存不同数值。' },
    pitfalls: ['必须优先延长旧序列，否则可能留下无法完成的短序列。', '新开序列时要同时检查并消耗后两个连续值。'],
    related: ['贪心', '频次表', '846 一手顺子'],
  },
  665: {
    id: 665, title: '非递减数列',
    summary: '判断能否至多修改一个元素，使整个数组满足相邻元素非递减。',
    constraints: ['数组长度至少为 1，元素为整数。', '允许修改任意一个元素为任意整数，也可以不修改。'],
    examples: [{ input: 'nums = [4,2,3]', output: 'true', explanation: '把 4 改为不大于 2 的值即可非递减。' }],
    intuition: '遇到 nums[i-1]>nums[i] 时必须立即消除逆序。若 nums[i] 不小于更前一项，可安全降低前项；否则只能抬高当前项，避免破坏左侧已有顺序。第二次逆序必然失败。',
    bruteForce: '枚举修改位置和值再检查数组；可选值范围巨大，即便只试邻居值也需 O(n²) 检查。',
    approach: ['从左到右统计逆序对出现次数。', '首次逆序时，若 i<2 或 nums[i]>=nums[i-2]，降低 nums[i-1]。', '否则把 nums[i] 抬到 nums[i-1]。', '若出现第二次逆序返回 false，否则返回 true。'],
    code: `class Solution:
    def checkPossibility(self, nums: List[int]) -> bool:
        changed = False
        for i in range(1, len(nums)):
            if nums[i] < nums[i - 1]:
                if changed:
                    return False
                changed = True
                if i < 2 or nums[i] >= nums[i - 2]:
                    nums[i - 1] = nums[i]
                else:
                    nums[i] = nums[i - 1]
        return True`,
    walkthrough: { input: 'nums = [3,4,2,5]', steps: ['在 4>2 处发现唯一逆序。', '因为 2<更前面的 3，不能降低 4，只能把当前 2 抬到 4。', '数组等效为 [3,4,4,5]，后续无逆序。'], result: '返回 true。' },
    complexity: { time: 'O(n)，只扫描一次。', space: 'O(1)，原地做局部调整。' },
    pitfalls: ['只统计原数组逆序次数不够，修改方向会影响后续。', '此实现会改动输入数组；需要保留时应复制。'],
    related: ['贪心', '数组局部修复', '896 单调数列'],
  },
  669: {
    id: 669, title: '修剪二叉搜索树',
    summary: '删除二叉搜索树中值不在 [low,high] 的节点，同时保持剩余节点的祖先关系与搜索树性质。',
    constraints: ['输入满足二叉搜索树性质，low<=high。', '修剪后所有保留节点值都必须落在闭区间内。'],
    examples: [{ input: 'root = [1,0,2], low=1, high=2', output: '[1,null,2]', explanation: '值 0 低于下界，删除其所在分支。' }],
    intuition: 'BST 提供整片剪枝：节点值小于 low 时，其左子树全部更小，只需修剪右子树；节点值大于 high 时对称处理。范围内节点则递归修剪两侧。',
    bruteForce: '遍历收集范围内所有值，再逐个插入新树可行，但会丢失原有祖先结构并使用额外空间。',
    approach: ['空节点直接返回 None。', '节点值小于 low 时，返回修剪后的右子树。', '节点值大于 high 时，返回修剪后的左子树。', '值在范围内时递归更新左右孩子并返回当前节点。'],
    code: `class Solution:
    def trimBST(self, root: Optional[TreeNode], low: int, high: int) -> Optional[TreeNode]:
        if not root:
            return None
        if root.val < low:
            return self.trimBST(root.right, low, high)
        if root.val > high:
            return self.trimBST(root.left, low, high)
        root.left = self.trimBST(root.left, low, high)
        root.right = self.trimBST(root.right, low, high)
        return root`,
    walkthrough: { input: 'root = [1,0,2], low=1, high=2', steps: ['根 1 在范围内，分别处理左右子树。', '左节点 0 小于 low，其左侧更小且右侧为空，返回空。', '右节点 2 在范围内，保留并接回根。'], result: '得到 [1,null,2]。' },
    complexity: { time: 'O(n)，最坏访问所有节点。', space: 'O(h)，递归深度为树高。' },
    pitfalls: ['超出下界时应转向右子树，超出上界时应转向左子树。', '根节点本身可能被删除，必须使用递归返回值作为新根。'],
    related: ['二叉搜索树', '递归剪枝', '450 删除 BST 中的节点'],
  },
  670: {
    id: 670, title: '最大交换',
    summary: '至多交换十进制数字中的两个位置一次，使所得非负整数尽可能大。',
    constraints: ['num 为非负整数，交换后仍按原数字位数解释。', '可以不交换；相同数字互换没有收益。'],
    examples: [{ input: 'num = 2736', output: '7236', explanation: '交换首位 2 与其右侧最大的 7。' }],
    intuition: '要让结果最大，应从高位开始找第一个能提升的位置，并与右侧最大数字的最右一次出现交换；取最右位置能把较小原数字放得更靠后。',
    bruteForce: '枚举所有 O(d²) 对数字位置，逐个交换并转回整数比较。',
    approach: ['记录每个数字 0 到 9 最后出现的位置。', '从高位向低位扫描当前位置 digit。', '从 9 降到 digit+1 查找在当前位置右侧出现的更大数字。', '首次找到便交换并立即返回；全程未找到则返回原数。'],
    code: `class Solution:
    def maximumSwap(self, num: int) -> int:
        digits = list(str(num))
        last = {int(ch): i for i, ch in enumerate(digits)}
        for i, ch in enumerate(digits):
            current = int(ch)
            for bigger in range(9, current, -1):
                if last.get(bigger, -1) > i:
                    j = last[bigger]
                    digits[i], digits[j] = digits[j], digits[i]
                    return int("".join(digits))
        return num`,
    walkthrough: { input: 'num = 1993', steps: ['记录 9 最后出现于下标 2。', '扫描首位 1，右侧存在更大的 9。', '将首位与最右侧 9 交换，得到 9913。'], result: '返回 9913。' },
    complexity: { time: 'O(d)，每位最多检查 9 个数字，d 为位数。', space: 'O(d)，保存数字字符数组。' },
    pitfalls: ['同一更大数字应选最右出现位置。', '应提升最靠左的可提升位，找到后立即结束。'],
    related: ['贪心', '31 下一个排列', '738 单调递增的数字'],
  },
  673: {
    id: 673, title: '最长递增子序列的个数',
    summary: '不仅求严格递增子序列的最大长度，还要统计达到该长度的不同下标序列数量。',
    constraints: ['子序列保持原下标顺序但不要求连续。', '递增条件为严格小于，重复值不能接在彼此之后。'],
    examples: [{ input: 'nums = [1,3,5,4,7]', output: '2', explanation: '最长长度为 4，对应 [1,3,5,7] 与 [1,3,4,7]。' }],
    intuition: '对每个结尾 i，同时维护最长长度 length[i] 与该长度方案数 count[i]。更优前驱会重置两者，同样长的前驱则把方案数累加。',
    bruteForce: '枚举全部 2^n 个子序列，筛选递增并统计最长者，规模稍大即不可行。',
    approach: ['初始化每个位置的长度与方案数均为 1。', '对每对 j<i 且 nums[j]<nums[i] 尝试转移。', '若 length[j]+1 更长，更新长度并把 count[i] 设为 count[j]；若相等则累加。', '求全局最长长度，并汇总所有达到该长度位置的方案数。'],
    code: `class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        length = [1] * n
        count = [1] * n
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    candidate = length[j] + 1
                    if candidate > length[i]:
                        length[i] = candidate
                        count[i] = count[j]
                    elif candidate == length[i]:
                        count[i] += count[j]
        best = max(length)
        return sum(count[i] for i in range(n) if length[i] == best)`,
    walkthrough: { input: 'nums = [1,3,5,4,7]', steps: ['前四项得到以 5 和 4 结尾的最长长度均为 3，各有 1 种。', '处理 7 时，两条长度 3 的路径都可接入，最长长度更新为 4。', '同长度转移累加方案数，7 的 count 变为 2。'], result: '返回 2。' },
    complexity: { time: 'O(n²)，枚举所有前驱。', space: 'O(n)，保存长度和计数数组。' },
    pitfalls: ['长度变得更优时计数应覆盖，不是累加旧值。', '严格递增必须使用 nums[j]<nums[i]。'],
    related: ['300 最长递增子序列', '动态规划计数', '674 最长连续递增序列'],
  },
  674: {
    id: 674, title: '最长连续递增序列',
    summary: '寻找数组中严格递增且位置连续的最长片段长度。',
    constraints: ['输入数组至少含一个整数。', '连续意味着不能跳过中间元素，且相邻值必须严格增大。'],
    examples: [{ input: 'nums = [1,3,5,4,7]', output: '3', explanation: '连续片段 [1,3,5] 长度为 3。' }],
    intuition: '连续性使状态只依赖前一个元素：当前值更大就延长当前段，否则当前段从当前位置重新计为 1。扫描中维护历史最大值即可。',
    bruteForce: '从每个起点向右扩展到不再递增，最坏在长递增数组上重复扫描 O(n²)。',
    approach: ['初始化 current=best=1。', '从第二个元素开始与前一项比较。', '严格增大则 current 加一，否则重置为 1。', '每步用 current 更新 best，最后返回 best。'],
    code: `class Solution:
    def findLengthOfLCIS(self, nums: List[int]) -> int:
        current = best = 1
        for i in range(1, len(nums)):
            if nums[i] > nums[i - 1]:
                current += 1
            else:
                current = 1
            best = max(best, current)
        return best`,
    walkthrough: { input: 'nums = [1,3,5,4,7]', steps: ['1→3→5 连续增大，current 依次到 2、3。', '5→4 不递增，current 重置为 1。', '4→7 再增大到 2，但 best 仍为 3。'], result: '返回 3。' },
    complexity: { time: 'O(n)，单次线性扫描。', space: 'O(1)。' },
    pitfalls: ['本题要求连续，不能套用可跳元素的 LIS。', '相等不算严格递增，必须重置当前长度。'],
    related: ['300 最长递增子序列', '673 最长递增子序列的个数', '线性扫描'],
  },
  676: {
    id: 676, title: '实现一个魔法字典',
    summary: '设计字典，查询一个单词能否恰好修改一个字符后变成字典中的某个同长度单词。',
    constraints: ['修改只替换一个位置，不能插入或删除字符。', '必须恰好不同一个字符；完全相同不能算成功。'],
    examples: [{ input: 'buildDict(["hello","leetcode"]); search("hhllo")', output: 'true', explanation: '把第二个字符 h 改为 e 即得到 hello。' }],
    intuition: '只有同长度单词可能匹配。逐个候选统计对应位置差异，一旦超过 1 就停止；最终差异恰为 1 才成功。',
    bruteForce: '对查询的每一位尝试替换成其余字母再查集合，需 O(字符集×单词长度) 次构造与查找。',
    approach: ['buildDict 保存全部字典单词。', 'search 仅遍历长度与查询相同的候选。', '逐位累计不同字符数，超过 1 时提前放弃该候选。', '任一候选最终差异数为 1 即返回 true。'],
    code: `class MagicDictionary:
    def __init__(self):
        self.words = []

    def buildDict(self, dictionary: List[str]) -> None:
        self.words = dictionary

    def search(self, searchWord: str) -> bool:
        for word in self.words:
            if len(word) != len(searchWord):
                continue
            differences = 0
            for a, b in zip(word, searchWord):
                differences += a != b
                if differences > 1:
                    break
            if differences == 1:
                return True
        return False`,
    walkthrough: { input: 'dictionary=["hello","leetcode"], searchWord="hhllo"', steps: ['hello 与查询词长度相同，逐位比较。', '仅第二位 e 与 h 不同，差异数为 1。', '满足恰好修改一次，立即返回成功。'], result: '返回 true。' },
    complexity: { time: 'buildDict O(1) 接管列表；单次 search 为 O(NL)。', space: 'O(NL)，保存字典单词。' },
    pitfalls: ['完全相同的单词差异为 0，必须返回 false。', '长度不同不能通过一次替换变成目标。'],
    related: ['字典树', '哈明距离', '208 实现 Trie'],
  },
  677: {
    id: 677, title: '键值映射',
    summary: '设计支持键值插入覆盖，并查询所有具有给定前缀的键对应值之和。',
    constraints: ['重复插入同一 key 会覆盖旧值，不是累加。', 'prefix 可匹配多个键，查询返回当前值总和。'],
    examples: [{ input: 'insert("apple",3); sum("ap"); insert("app",2); sum("ap")', output: '3, 5', explanation: '第二次查询同时匹配 apple 与 app。' }],
    intuition: '保存完整键到当前值的映射即可正确处理覆盖；查询时扫描所有键并判断 startswith，适合紧凑且不易出错的实现。',
    bruteForce: '若只追加每次插入记录，查询会把同一键的历史值也算入，无法满足覆盖语义。',
    approach: ['构造函数创建空哈希表 values。', 'insert 直接令 values[key]=val，自动覆盖旧值。', 'sum 遍历当前键值对。', '累加所有以 prefix 开头的值并返回。'],
    code: `class MapSum:
    def __init__(self):
        self.values = {}

    def insert(self, key: str, val: int) -> None:
        self.values[key] = val

    def sum(self, prefix: str) -> int:
        return sum(value for key, value in self.values.items()
                   if key.startswith(prefix))`,
    walkthrough: { input: 'insert("apple",3), insert("app",2), sum("ap")', steps: ['映射中先保存 apple→3。', '再保存 app→2，两键都以 ap 开头。', '查询扫描当前映射并累加 3+2。'], result: '返回 5。' },
    complexity: { time: 'insert 平均 O(1)；sum 为 O(NP)，P 为前缀比较长度。', space: 'O(S)，S 为所有不同键的字符总量。' },
    pitfalls: ['同一 key 再次插入必须覆盖旧值。', '前缀匹配从字符串开头开始，不是任意子串。'],
    related: ['字典树', '哈希表', '208 实现 Trie'],
  },

  678: {
    id: 678, title: '有效的括号字符串',
    summary: '判断含左括号、右括号和星号的字符串能否解释为有效括号串；星号可代表任一括号或空串。',
    constraints: ['字符串仅由 (、) 与 * 构成。', '所有左括号都要在其右侧得到匹配，星号可独立选择含义。'],
    examples: [{ input: 's = "(*))"', output: 'true', explanation: '把星号解释为左括号，可得到 (())。' }],
    intuition: '不必确定每个星号。维护当前未匹配左括号数量的最小、最大可能值；右括号让两端减一，星号让范围向两侧扩展。最大值负数说明任何解释都失败。',
    bruteForce: '对每个星号枚举三种解释，共有 3^k 种字符串，再逐一验证。',
    approach: ['维护未匹配左括号数区间 [low,high]。', '左括号令两端加一，右括号令两端减一，星号令 low减一且high加一。', 'low 不能低于 0；若 high<0 则右括号必然过多。', '扫描结束时 low==0 才存在完全匹配的解释。'],
    code: `class Solution:
    def checkValidString(self, s: str) -> bool:
        low = high = 0
        for ch in s:
            if ch == "(":
                low += 1
                high += 1
            elif ch == ")":
                low = max(0, low - 1)
                high -= 1
            else:
                low = max(0, low - 1)
                high += 1
            if high < 0:
                return False
        return low == 0`,
    walkthrough: { input: 's = "(*))"', steps: ['读到 ( 后区间为 [1,1]，读 * 后变为 [0,2]。', '第一个 ) 后范围为 [0,1]，仍存在可行解释。', '最后一个 ) 后范围为 [0,0]，可全部匹配。'], result: '返回 true。' },
    complexity: { time: 'O(n)，扫描字符串一次。', space: 'O(1)。' },
    pitfalls: ['只用一个计数贪心决定星号含义会错过其他解释。', '扫描结束判断 low==0，而不是 high==0。'],
    related: ['括号匹配', '贪心区间', '20 有效的括号'],
  },
  680: {
    id: 680, title: '验证回文串 II',
    summary: '判断字符串能否在最多删除一个字符后成为回文串。',
    constraints: ['字符串由题目约定字符构成，删除次数可以为 0。', '只能删除一个位置，剩余字符相对顺序不变。'],
    examples: [{ input: 's = "abca"', output: 'true', explanation: '删除 b 或 c 都能得到回文串。' }],
    intuition: '双指针从两端收缩；首次不相等之前无需删除。冲突发生后，唯一可能是跳过左字符或右字符，分别检查剩余区间即可。',
    bruteForce: '依次删除每个位置，再用 O(n) 检查回文，总时间 O(n²)。',
    approach: ['用辅助函数判断任意闭区间是否回文。', '主循环从字符串两端向中间移动。', '首次字符不等时，检查 [left+1,right] 与 [left,right-1]。', '任一子区间回文即返回 true；无冲突则直接返回 true。'],
    code: `class Solution:
    def validPalindrome(self, s: str) -> bool:
        def is_palindrome(left, right):
            while left < right:
                if s[left] != s[right]:
                    return False
                left += 1
                right -= 1
            return True

        left, right = 0, len(s) - 1
        while left < right:
            if s[left] != s[right]:
                return (is_palindrome(left + 1, right) or
                        is_palindrome(left, right - 1))
            left += 1
            right -= 1
        return True`,
    walkthrough: { input: 's = "abca"', steps: ['两端 a 相等，指针移到 b 与 c。', 'b、c 首次冲突，尝试分别跳过其中一个。', '跳过 b 得到区间 ca 外加两端 a，即剩余 aca 为回文。'], result: '返回 true。' },
    complexity: { time: 'O(n)，主扫描与至多两次剩余区间检查。', space: 'O(1)。' },
    pitfalls: ['冲突时左右两个删除方向都要尝试。', '题意是至多删除一个，原串回文也应返回 true。'],
    related: ['双指针', '125 验证回文串', '回文判断'],
  },
  686: {
    id: 686, title: '重复叠加字符串匹配',
    summary: '求最少重复字符串 a 多少次，才能让 b 成为其连续子串；若永远无法出现则返回 -1。',
    constraints: ['a 与 b 均为非空字符串。', '匹配必须连续，但可跨越相邻两份 a 的边界。'],
    examples: [{ input: 'a = "abcd", b = "cdabcdab"', output: '3', explanation: '重复三次得到 abcdabcdabcd，其中包含目标串。' }],
    intuition: '先重复到总长度至少覆盖 b，此时若目标跨边界，最多还需要额外一份 a 才能容纳所有可能起点。只检查这两个次数即可。',
    bruteForce: '无上限地持续拼接并搜索，若字符集合不兼容会永不停止。',
    approach: ['计算 count=ceil(len(b)/len(a))。', '构造 a 重复 count 次的字符串并检查 b。', '若未命中，再检查多重复一次的字符串。', '两次均失败则返回 -1。'],
    code: `class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        count = (len(b) + len(a) - 1) // len(a)
        repeated = a * count
        if b in repeated:
            return count
        if b in repeated + a:
            return count + 1
        return -1`,
    walkthrough: { input: 'a="abcd", b="cdabcdab"', steps: ['长度下界为 ceil(8/4)=2，先构造 abcdabcd。', '两份中因起点偏移无法容纳完整目标。', '增加一份得到 abcdabcdabcd，目标从下标 2 连续出现。'], result: '返回 3。' },
    complexity: { time: 'O(|a|+|b|) 的常见子串匹配量级，具体取决于语言实现。', space: 'O(|a|+|b|)，保存重复字符串。' },
    pitfalls: ['只重复到长度刚超过 b 仍可能漏掉跨边界匹配，需再试一份。', '应使用向上取整确定初始次数。'],
    related: ['字符串匹配', '459 重复的子字符串', 'KMP'],
  },
  687: {
    id: 687, title: '最长同值路径',
    summary: '求二叉树中节点值都相同的最长路径，路径可穿过某节点连接左右两侧，长度按边数计算。',
    constraints: ['路径不要求经过根，但节点必须相邻连接。', '答案按边数而非节点数计，单节点树答案为 0。'],
    examples: [{ input: 'root = [5,4,5,1,1,null,5]', output: '2', explanation: '右侧两个值为 5 的边可与根连成长度 2 的路径。' }],
    intuition: '后序遍历让每个节点获得左右向下的同值链长度。当前节点可把左右链相加更新全局答案，但向父节点只能返回其中较长的一条，避免分叉。',
    bruteForce: '从每个节点出发搜索所有同值可达路径，会反复遍历相同子树，最坏 O(n²)。',
    approach: ['递归返回从当前节点向下延伸的最长同值边数。', '先获得左右孩子返回的链长。', '仅当孩子值等于当前值时，才能把对应链长加一。', '用 left+right 更新全局答案，向上返回 max(left,right)。'],
    code: `class Solution:
    def longestUnivaluePath(self, root: Optional[TreeNode]) -> int:
        best = 0
        def dfs(node):
            nonlocal best
            if not node:
                return 0
            left_down = dfs(node.left)
            right_down = dfs(node.right)
            left = left_down + 1 if node.left and node.left.val == node.val else 0
            right = right_down + 1 if node.right and node.right.val == node.val else 0
            best = max(best, left + right)
            return max(left, right)
        dfs(root)
        return best`,
    walkthrough: { input: 'root = [5,4,5,null,null,null,5]', steps: ['最右叶子 5 向父节点返回可延伸链起点。', '右侧中间 5 得到向右长度 1，并可向根继续。', '根 5 的右链长度为 2、左链为 0，全局最大更新为 2。'], result: '返回 2 条边。' },
    complexity: { time: 'O(n)，每个节点后序处理一次。', space: 'O(h)，递归栈深度为树高。' },
    pitfalls: ['全局路径可合并左右链，但向父节点不能返回左右之和。', '答案单位是边，孩子匹配时才在返回长度上加一。'],
    related: ['543 二叉树的直径', '124 二叉树中的最大路径和', '后序遍历'],
  },
  690: {
    id: 690, title: '员工的重要性',
    summary: '给定员工及直属下属关系，计算指定员工与其所有层级下属的重要性总和。',
    constraints: ['员工 id 唯一，目标 id 存在。', '下属关系构成合法层级，题目数据不会要求重复计算同一员工。'],
    examples: [{ input: 'employees=[[1,5,[2,3]],[2,3,[]],[3,3,[]]], id=1', output: '11', explanation: '员工 1 及其两个直属下属的重要性为 5+3+3。' }],
    intuition: '先用 id 建立员工索引，再从目标员工做 DFS 或 BFS。每访问一人累加其重要性，并继续处理其直属下属，便覆盖整个下属子树。',
    bruteForce: '每获得一个下属 id 都重新线性扫描 employees 找对象，链式层级下会退化到 O(n²)。',
    approach: ['建立 id 到 Employee 对象的哈希表。', '用栈从目标 id 开始遍历。', '弹出 id 后累加对应员工的重要性。', '把该员工的直属下属 id 加入栈，直到栈空。'],
    code: `class Solution:
    def getImportance(self, employees: List['Employee'], id: int) -> int:
        by_id = {employee.id: employee for employee in employees}
        total = 0
        stack = [id]
        while stack:
            current = by_id[stack.pop()]
            total += current.importance
            stack.extend(current.subordinates)
        return total`,
    walkthrough: { input: 'employees: 1→[2,3], importance=[5,3,3], id=1', steps: ['索引全部员工，并把目标 id 1 放入栈。', '访问 1 累加 5，同时把下属 2、3 入栈。', '依次访问 2、3 再累加 3 与 3，二者无下属。'], result: '总重要性为 11。' },
    complexity: { time: 'O(n)，建索引并至多访问每名相关员工一次。', space: 'O(n)，哈希索引与遍历栈。' },
    pitfalls: ['subordinates 保存的是 id，需通过映射取员工对象。', '必须递归或迭代包含所有层级下属，不只算直属一层。'],
    related: ['图遍历', '哈希索引', '组织树'],
  },
};

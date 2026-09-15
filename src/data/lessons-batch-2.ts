import type { Lesson } from './lessons';

type ExampleSeed = [input: string, output: string, explanation: string];
type ComplexitySeed = [time: string, space: string];

function makeLesson(
  id: number, title: string, summary: string, constraints: string[], example: ExampleSeed,
  intuition: string, bruteForce: string, approach: string[], code: string, steps: string[],
  complexity: ComplexitySeed, pitfalls: string[], related: string[],
): Lesson {
  return {
    id, title, summary, constraints,
    examples: [{ input: example[0], output: example[1], explanation: example[2] }],
    intuition, bruteForce, approach, code,
    walkthrough: { input: example[0], steps, result: example[1] },
    complexity: { time: complexity[0], space: complexity[1] },
    pitfalls, related,
  };
}

export const lessonsBatch2: Record<number, Lesson> = {
  994: makeLesson(994, '腐烂的橘子', '用多源广度优先搜索模拟腐烂同时向四周扩散，并计算最后一个新鲜橘子被感染的分钟数。', ['网格只含 0、1、2，分别表示空格、新鲜橘子和腐烂橘子。', '腐烂每分钟只传播到上下左右相邻的新鲜橘子。'], ['grid = [[2,1,1],[1,1,0],[0,1,1]]', '4', '四轮同步扩散后所有新鲜橘子腐烂。'], '所有初始腐烂橘子应处于同一时间层，因此一起入队；逐层搜索天然对应分钟推进。', '从每个腐烂橘子分别搜索会反复访问格子，也难以正确合并多个传播源的最早到达时间。', ['统计新鲜橘子并收集全部初始腐烂位置。', '把这些位置同时放入队列，构成第零层。', '每弹出一格就检查四邻，只感染值为 1 的格子。', '感染时立刻改为 2、减少新鲜数并入队。', '记录感染格子的最大时间；结束后按新鲜数判断是否可达。'], `from collections import deque

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        q = deque()
        fresh = 0
        for r, row in enumerate(grid):
            for c, value in enumerate(row):
                if value == 2:
                    q.append((r, c, 0))
                elif value == 1:
                    fresh += 1
        minutes = 0
        for_pop = ((1, 0), (-1, 0), (0, 1), (0, -1))
        while q:
            r, c, minute = q.popleft()
            minutes = max(minutes, minute)
            for dr, dc in for_pop:
                nr, nc = r + dr, c + dc
                if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc, minute + 1))
        return minutes if fresh == 0 else -1`, ['初始腐烂橘子 (0,0) 以时间 0 入队。', '时间 1 感染 (0,1) 与 (1,0)。', '随后各层继续感染尚为 1 的相邻格。', '时间 4 感染 (2,2)，新鲜计数降为 0。'], ['O(mn)', 'O(mn)'], ['必须先把所有腐烂橘子同时入队，不能逐个启动搜索。', '感染时就应标记，若出队时才标记会重复入队。'], ['200 岛屿数量', '286 墙与门']),

  207: makeLesson(207, '课程表', '把先修关系看成有向图，判断图中是否存在阻止完成全部课程的环。', ['课程编号范围是 0 到 numCourses - 1。', '先修对 [a,b] 表示学习 a 前必须先学习 b。'], ['numCourses = 2, prerequisites = [[1,0]]', 'true', '先修课程 0，再修课程 1。'], '无前置要求的课程可以立即学习；不断移除这类节点后若仍有课程，剩余部分必含有向环。', '对每门课分别执行 DFS 搜索环会产生大量重复路径；枚举所有课程顺序更是阶乘复杂度。', ['建立从先修课指向后续课的邻接表。', '统计每门课当前的入度。', '将入度为零的课程全部入队。', '每学完一课就把后续课程入度减一。', '最终比较已学习数量与课程总数。'], `from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, pre in prerequisites:
            graph[pre].append(course)
            indegree[course] += 1
        q = deque(i for i, degree in enumerate(indegree) if degree == 0)
        taken = 0
        while q:
            node = q.popleft()
            taken += 1
            for nxt in graph[node]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    q.append(nxt)
        return taken == numCourses`, ['课程 0 入度为 0，先入队。', '取出 0 后，课程 1 的入度从 1 降至 0。', '课程 1 入队并被学习。', '共处理 2 门课，等于课程总数，返回真。'], ['O(V+E)', 'O(V+E)'], ['边方向应是先修课指向课程，反向建边会混淆入度含义。', '重复先修边也必须逐条计入并逐条消除。'], ['210 课程表 II', '802 找到最终的安全状态']),

  208: makeLesson(208, '实现 Trie（前缀树）', '使用字符逐层分叉的树结构，支持插入单词、完整单词查询和前缀查询。', ['所有输入由小写英文字母组成。', 'search 只认可完整单词，startsWith 只要求路径存在。'], ['operations = ["Trie","insert","search","startsWith"], values = [[],["apple"],["apple"],["app"]]', '[null,null,true,true]', '插入 apple 后，完整词与其前缀路径都存在。'], '共享前缀的单词共享从根开始的路径；节点除子节点映射外，还需一个结束标记区分单词和纯前缀。', '把每个单词存入普通列表后逐项比较，查询会扫描全部单词，无法利用共同前缀。', ['根节点不代表任何字符。', 'insert 沿字符查找，不存在的子节点即时创建。', '单词末尾节点设置结束标记。', 'search 先走完整条路径，再检查结束标记。', 'startsWith 只检查给定前缀路径能否走通。'], `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_word = True

    def _find(self, text: str):
        node = self.root
        for ch in text:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.is_word

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None`, ['构造 Trie，根节点为空。', '插入 apple，依次创建 a、p、p、l、e 节点。', '在 e 节点标记完整单词结束。', '查 apple 到达结束节点，查前缀 app 也能走通。'], ['每次操作 O(L)', '总节点空间 O(S)'], ['仅有路径不代表完整单词，search 必须检查 is_word。', '插入已有前缀时不可覆盖原有子树。'], ['211 添加与搜索单词', '212 单词搜索 II']),

  46: makeLesson(46, '全排列', '通过回溯逐位选择尚未使用的数字，生成数组元素的所有排列。', ['输入数组中的整数互不相同。', '每个结果必须恰好使用所有输入元素一次。'], ['nums = [1,2,3]', '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', '三个位置依次选择未使用元素，共得到 3! 个排列。'], '排列是一棵选择树：路径记录已选顺序，used 集合阻止同一元素在一条路径中被重复使用。', '枚举所有长度为 n 的下标序列再过滤重复，会生成 n 的 n 次方条候选，绝大多数无效。', ['维护当前路径与布尔使用数组。', '遍历每个候选下标。', '跳过当前路径已使用的下标。', '选择后递归填下一位置，返回时撤销选择。', '路径长度达到 n 时复制保存。'], `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        ans, path = [], []
        used = [False] * len(nums)
        def backtrack():
            if len(path) == len(nums):
                ans.append(path[:])
                return
            for i, value in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(value)
                backtrack()
                path.pop()
                used[i] = False
        backtrack()
        return ans`, ['根路径为空，候选为 1、2、3。', '先选 1，再选 2，最后选 3，保存 [1,2,3]。', '撤销 3 和 2，改选 3、2，保存 [1,3,2]。', '根层继续以 2、3 开头，最终收集六个排列。'], ['O(n·n!)', 'O(n)（不计答案）'], ['保存答案时必须复制 path，否则后续回溯会修改已存结果。', 'used 应按下标记录，才能准确表达某个位置是否用过。'], ['47 全排列 II', '77 组合']),

  78: makeLesson(78, '子集', '对每个元素作选或不选的决定，收集幂集中的全部组合。', ['输入元素互不相同。', '答案包含空集，且不能出现重复子集。'], ['nums = [1,2]', '[[],[1],[1,2],[2]]', '两个元素各有选与不选两种状态。'], '每个递归节点本身就是一个合法子集；用递增起点限制后续只能向右选择，可避免同一集合的不同排列。', '枚举所有排列再去重会重复生成同一子集，也会付出远高于 2 的 n 次方的代价。', ['从空路径开始并立即加入答案。', '参数 start 表示下一次可选的最左下标。', '依次选择 start 之后的每个元素。', '递归时将起点推进到 i+1。', '回退路径后尝试同层的下一个元素。'], `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        ans, path = [], []
        def dfs(start: int) -> None:
            ans.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1)
                path.pop()
        dfs(0)
        return ans`, ['空路径先产生 []。', '选择 1，产生 [1]。', '在 1 后选择 2，产生 [1,2]，随后回退。', '根层选择 2，产生 [2]，共四个子集。'], ['O(n·2^n)', 'O(n)（不计答案）'], ['不要漏掉空集，它是递归根节点。', '下一层必须从 i+1 开始，否则会重复选元素或产生排列。'], ['90 子集 II', '77 组合']),

  17: makeLesson(17, '电话号码的字母组合', '按电话按键映射，为数字串的每一位选择一个字母并生成全部组合。', ['输入只包含数字 2 到 9。', '空数字串应返回空列表而不是包含空字符串的列表。'], ['digits = "23"', '["ad","ae","af","bd","be","bf","cd","ce","cf"]', '数字 2 的三个字母与数字 3 的三个字母两两组合。'], '数字位置决定递归层，当前层只遍历该按键对应字母；路径长度到达数字串长度时便形成唯一组合。', '先构造所有字母串再筛选是否符合按键位置没有意义，候选空间巨大且不能利用输入结构。', ['准备 2 到 9 的字符映射。', '空输入直接返回空答案。', '用 index 指向当前待处理数字。', '遍历该数字映射的每个字母并追加到路径。', '递归到末尾时拼接路径并保存。'], `class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        phone = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
        ans, path = [], []
        def dfs(index: int) -> None:
            if index == len(digits):
                ans.append(''.join(path))
                return
            for ch in phone[digits[index]]:
                path.append(ch)
                dfs(index + 1)
                path.pop()
        dfs(0)
        return ans`, ['第一位 2 先选择 a。', '第二位 3 依次选择 d、e、f，得到 ad、ae、af。', '回退第一位并改选 b，再产生 bd、be、bf。', '最后选择 c，全部九个组合完成。'], ['O(4^n·n)', 'O(n)（不计答案）'], ['数字 7 和 9 各映射四个字母，不能假设每键固定三个。', '空输入的题意结果是 []。'], ['22 括号生成', '46 全排列']),

  39: makeLesson(39, '组合总和', '在候选正整数中可重复选数，用回溯寻找和恰好等于目标值的无重复组合。', ['候选数字互不相同且均为正数。', '同一候选可以被不限次数地选择。'], ['candidates = [2,3,6,7], target = 7', '[[2,2,3],[7]]', '2 可重复三次附近组合成 2+2+3，7 也可单独命中。'], '正数使剩余目标单调减小；维持非递减选择顺序，可让每个组合只以一种顺序出现。', '枚举所有有序取数序列会同时产生 [2,2,3]、[2,3,2] 等重复，并需要额外去重。', ['先排序候选以便在数值过大时剪枝。', '用 start 限制本层可选下标。', '选择 value 后令剩余值减去它。', '递归仍传 i，允许再次使用当前候选。', '剩余值为零时复制路径，候选大于剩余值时终止本层。'], `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        ans, path = [], []
        def dfs(start: int, remain: int) -> None:
            if remain == 0:
                ans.append(path[:])
                return
            for i in range(start, len(candidates)):
                value = candidates[i]
                if value > remain:
                    break
                path.append(value)
                dfs(i, remain - value)
                path.pop()
        dfs(0, target)
        return ans`, ['从剩余 7 开始选择 2，剩余 5。', '再次选择 2，剩余 3。', '选择 3 后剩余 0，保存 [2,2,3]。', '回溯到根后选择 7，保存 [7]。'], ['O(N^(T/M))（上界）', 'O(T/M)（不计答案）'], ['递归下一层传 i 而不是 i+1，题目允许复用元素。', '只有候选均为正数时，按剩余值剪枝才保证终止。'], ['40 组合总和 II', '377 组合总和 IV']),

  22: makeLesson(22, '括号生成', '在任意前缀都合法的约束下，回溯生成 n 对括号的全部有效排列。', ['n 表示成对括号数量，结果字符串长度为 2n。', '任意前缀中右括号数量都不能超过左括号数量。'], ['n = 3', '["((()))","(()())","(())()","()(())","()()()"]', '所有长度为 6 且前缀合法的括号串共有五个。'], '不必先生成再验错：只在左括号尚有配额时放左括号，只在右括号数少于左括号数时放右括号。', '枚举长度 2n 的全部二进制括号串再验证，需要检查 2 的 2n 次方个候选。', ['记录已使用的左、右括号数量。', '左括号少于 n 时可追加左括号。', '右括号少于左括号时才可追加右括号。', '每次递归后撤销最后一个字符。', '路径长度达到 2n 时保存字符串。'], `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        ans, path = [], []
        def dfs(left: int, right: int) -> None:
            if len(path) == 2 * n:
                ans.append(''.join(path))
                return
            if left < n:
                path.append('(')
                dfs(left + 1, right)
                path.pop()
            if right < left:
                path.append(')')
                dfs(left, right + 1)
                path.pop()
        dfs(0, 0)
        return ans`, ['起点只能加入左括号。', '连续放三个左括号后，只能逐个闭合，得到 ((()))。', '在第二层提前闭合可探索 (()()) 与 (())()。', '所有分支始终满足右括号不多于左括号，最终得到五项。'], ['O(Cn·n)', 'O(n)（不计答案）'], ['允许 right 等于 left 时再放右括号会立即形成非法前缀。', '完成条件应保证总长度为 2n。'], ['20 有效的括号', '301 删除无效的括号']),

  79: makeLesson(79, '单词搜索', '从网格任意位置出发，沿四方向寻找能依次拼出目标单词且不重复使用格子的路径。', ['同一单元格在一条搜索路径中最多使用一次。', '字符只能移动到上下左右相邻格，不能走对角线。'], ['board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', 'true', '可沿 A→B→C→C→E→D 找到完整路径。'], '从每个匹配首字母的格子启动深搜；暂时改写已访问格可同时完成标记与恢复，避免额外矩阵。', '枚举网格中的所有无重复路径再与单词比较，会探索大量与首字符或当前字符不符的路径。', ['逐格尝试作为单词起点。', 'DFS 参数包含坐标和待匹配下标。', '越界或字符不等立即失败。', '暂时把当前格改为哨兵，再搜索四邻。', '任一方向成功即返回；失败前恢复原字符。'], `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])
        def dfs(r: int, c: int, i: int) -> bool:
            if i == len(word):
                return True
            if r < 0 or r == rows or c < 0 or c == cols or board[r][c] != word[i]:
                return False
            saved = board[r][c]
            board[r][c] = '#'
            found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                     dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
            board[r][c] = saved
            return found
        return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))`, ['从左上角 A 匹配下标 0。', '向右经过 B、C，逐格临时标记。', '再向下到第二行 C，随后向下到 E。', '最后向左到 D，匹配完整单词并返回真。'], ['O(mn·3^L)', 'O(L)'], ['无论搜索成功与否都应恢复网格，避免污染调用状态。', '访问标记必须阻止路径折返使用同一个格子。'], ['212 单词搜索 II', '200 岛屿数量']),

  131: makeLesson(131, '分割回文串', '枚举字符串切割位置，只保留每一段都是回文串的完整分割方案。', ['分割后的片段连接起来必须恰好等于原字符串。', '每个片段都必须正读反读相同。'], ['s = "aab"', '[["a","a","b"],["aa","b"]]', '前两个 a 可分别成段，也可组成回文 aa。'], '切割点构成回溯树；从当前位置尝试每个结束位置，只有当前片段为回文时才继续递归。', '枚举所有切割方案后再逐段检查可行，但会对明显非回文前缀继续做无效深搜。', ['start 指向尚未分割的首字符。', '枚举 end 形成 s[start:end+1]。', '用双指针判断该片段是否回文。', '是回文则加入路径并从 end+1 递归。', 'start 到达末尾时复制完整分割。'], `class Solution:
    def partition(self, s: str) -> List[List[str]]:
        ans, path = [], []
        def palindrome(left: int, right: int) -> bool:
            while left < right:
                if s[left] != s[right]:
                    return False
                left += 1
                right -= 1
            return True
        def dfs(start: int) -> None:
            if start == len(s):
                ans.append(path[:])
                return
            for end in range(start, len(s)):
                if palindrome(start, end):
                    path.append(s[start:end + 1])
                    dfs(end + 1)
                    path.pop()
        dfs(0)
        return ans`, ['从下标 0 选择回文片段 a。', '下一个位置再选 a，最后选 b，保存三段方案。', '回退到开头，片段 aa 也为回文。', '在 aa 后选择 b，保存第二种方案。'], ['O(n·2^n)', 'O(n)（不计答案）'], ['切片终点与 Python 右开区间容易产生少一个字符的错误。', '到达字符串末尾才是完整方案，中途路径不能加入答案。'], ['132 分割回文串 II', '5 最长回文子串']),

  51: makeLesson(51, 'N 皇后', '逐行放置皇后，并用列与两类对角线集合即时排除攻击冲突。', ['棋盘大小为 n×n，每行每列恰放一个皇后。', '两个皇后不能位于同一主对角线或副对角线。'], ['n = 4', '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', '四阶棋盘有两种互为镜像的合法布局。'], '逐行搜索已消除同行冲突；位置 (r,c) 的两条对角线可分别用 r-c 与 r+c 唯一标识。', '从 n² 个格子任取 n 个再检查冲突，会生成大量不满足每行一个皇后的组合。', ['维护已占用列、主对角线和副对角线集合。', '在当前行遍历每一列。', '若三个标识均未占用，就放置 Q。', '递归下一行，返回后清除棋子和三个标识。', '处理完 n 行时把字符行拼接成棋盘。'], `class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        ans = []
        board = [['.'] * n for _ in range(n)]
        cols, diag1, diag2 = set(), set(), set()
        def dfs(r: int) -> None:
            if r == n:
                ans.append([''.join(row) for row in board])
                return
            for c in range(n):
                if c in cols or r - c in diag1 or r + c in diag2:
                    continue
                board[r][c] = 'Q'
                cols.add(c); diag1.add(r - c); diag2.add(r + c)
                dfs(r + 1)
                cols.remove(c); diag1.remove(r - c); diag2.remove(r + c)
                board[r][c] = '.'
        dfs(0)
        return ans`, ['第一行尝试把皇后放在第 2 列。', '第二行可放第 4 列，避开列与对角线。', '第三、四行依次放第 1、3 列，形成首个解。', '回溯并更换第一行选择，找到镜像的第二个解。'], ['O(n!)', 'O(n²)（含棋盘）'], ['主副对角线标识分别是 r-c 与 r+c，不可混用。', '回溯必须同步清理棋盘和三个占用集合。'], ['52 N 皇后 II', '37 解数独']),

  35: makeLesson(35, '搜索插入位置', '在有序数组中寻找第一个大于等于目标值的位置，即标准 lower_bound。', ['数组严格递增。', '若目标不存在，应返回插入后仍保持升序的下标。'], ['nums = [1,3,5,6], target = 2', '1', '2 应插在 1 与 3 之间。'], '把答案定义为左闭右开区间中的第一个不小于 target 的位置；即使目标大于所有元素，右边界 n 也是合法答案。', '线性扫描遇到首个不小于目标的元素即可，但没有利用有序性，最坏检查整个数组。', ['初始化搜索区间 [0,n)。', '取中点 mid。', '若 nums[mid] 小于目标，答案只能在 mid 右侧。', '否则 mid 可能是答案，收缩右边界到 mid。', '左右边界相遇时返回该插入位置。'], `class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left`, ['初始区间 [0,4)，中点值 5 不小于 2，右界变 2。', '区间 [0,2) 中点值 3 不小于 2，右界变 1。', '区间 [0,1) 中点值 1 小于 2，左界变 1。', '边界在 1 相遇，返回插入下标 1。'], ['O(log n)', 'O(1)'], ['右边界设为 n 才能表达插在数组末尾。', '小于目标时左边界必须更新为 mid+1，避免死循环。'], ['34 查找元素首末位置', '704 二分查找']),

  74: makeLesson(74, '搜索二维矩阵', '利用每行有序且下一行首元素更大的性质，把矩阵视作一维升序数组进行二分。', ['每行从左到右升序。', '每行首元素严格大于上一行末元素。'], ['matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', 'true', '展开后的升序序列中下标 1 为 3。'], '一维下标 k 可映射到 row=k//cols、col=k%cols，因此无需真的复制矩阵就能应用普通二分。', '逐格扫描矩阵需要 O(mn)；先找行再找列虽可行，但两段边界处理更繁琐。', ['取得行数和列数。', '在虚拟区间 [0,mn-1] 上二分。', '把中点转换成行列坐标并读取值。', '按中点值与目标的关系收缩边界。', '相等时立即返回真，区间耗尽返回假。'], `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        rows, cols = len(matrix), len(matrix[0])
        left, right = 0, rows * cols - 1
        while left <= right:
            mid = (left + right) // 2
            value = matrix[mid // cols][mid % cols]
            if value == target:
                return True
            if value < target:
                left = mid + 1
            else:
                right = mid - 1
        return False`, ['虚拟数组长度 12，首次中点下标 5 对应值 11。', '11 大于 3，搜索范围移到左半。', '新中点下标 2 对应值 5，继续左移。', '中点下标 1 对应值 3，返回真。'], ['O(log(mn))', 'O(1)'], ['二维下标换算必须使用列数，而不是行数。', '该整体二分依赖跨行也严格有序的额外条件。'], ['240 搜索二维矩阵 II', '704 二分查找']),

  34: makeLesson(34, '在排序数组中查找元素的首末位置', '用两次边界二分分别定位目标值的左端点和严格大于目标值的位置。', ['数组按非递减顺序排列，目标可重复出现。', '目标不存在时返回 [-1,-1]。'], ['nums = [5,7,7,8,8,10], target = 8', '[3,4]', '8 连续出现于下标 3 和 4。'], '左边界是第一个不小于 target 的位置，右边界可由第一个不小于 target+ε 的位置等价实现为 upper_bound 后减一。', '找到任意一个目标后向两侧线性扩展，在重复元素很多时会退化为 O(n)。', ['编写 lower(x) 返回第一个大于等于 x 的下标。', '调用 lower(target) 得到候选左端点。', '检查候选是否越界或值不等，排除目标不存在。', '再找第一个严格大于 target 的位置。', '该位置减一即目标右端点。'], `class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def lower(x: int) -> int:
            left, right = 0, len(nums)
            while left < right:
                mid = (left + right) // 2
                if nums[mid] < x:
                    left = mid + 1
                else:
                    right = mid
            return left
        first = lower(target)
        if first == len(nums) or nums[first] != target:
            return [-1, -1]
        left, right = 0, len(nums)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] <= target:
                left = mid + 1
            else:
                right = mid
        return [first, left - 1]`, ['第一次 lower 把不小于 8 的最左位置锁定为 3。', '下标 3 的值确为 8，因此目标存在。', '第二次二分跳过所有小于等于 8 的元素。', '首个大于 8 的位置为 5，减一得到右端点 4。'], ['O(log n)', 'O(1)'], ['得到左边界后仍需检查值是否真等于目标。', '右端点搜索的比较条件必须包含等号，才能越过所有目标。'], ['35 搜索插入位置', '704 二分查找']),

  33: makeLesson(33, '搜索旋转排序数组', '在无重复旋转升序数组中，每轮识别有序半边并判断目标是否落在其中。', ['数组原本严格递增，旋转后元素仍互不相同。', '目标不存在时返回 -1。'], ['nums = [4,5,6,7,0,1,2], target = 0', '4', '目标 0 位于旋转点后的升序片段。'], '任意二分中点至少有一侧仍然有序；借助该侧端点即可判断目标是否属于它，从而安全舍弃另一半。', '线性扫描无需处理旋转但耗时 O(n)；先显式恢复数组会增加不必要的时间和空间。', ['使用闭区间 left、right。', '中点命中目标则立即返回。', '比较 nums[left] 与 nums[mid] 判断左半是否有序。', '检查目标是否处于有序半边的值域。', '按判断舍弃不可能的一半，耗尽后返回 -1。'], `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1`, ['初始中点值 7，左半 [4,5,6,7] 有序。', '目标 0 不在值域 [4,7) 内，舍弃左半。', '新区间 [0,1,2] 的中点值为 1，左侧含旋转点。', '目标位于 1 左边，最终在下标 4 命中。'], ['O(log n)', 'O(1)'], ['判断值域时一端含等号、一端不含，避免遗漏或重复。', '该写法依赖元素互不相同；有重复值时无法总能辨别有序侧。'], ['81 搜索旋转排序数组 II', '153 寻找旋转数组最小值']),
  153: makeLesson(153, '寻找旋转排序数组中的最小值', '通过中点与右端值比较，定位无重复旋转升序数组的断点。', ['数组元素互不相同，原数组严格递增。', '数组可能旋转零次，此时首元素就是最小值。'], ['nums = [3,4,5,1,2]', '1', '旋转断点位于 5 与 1 之间。'], '右端值可判断中点位于最小值左侧的高值段还是包含最小值的右侧段，并始终保留候选中点。', '线性扫描相邻逆序位置可以找到断点，但没有利用两段有序结构，最坏需要遍历全部元素。', ['使用闭合候选区间 [left,right]。', '当中点值大于右端值时，最小值必在 mid 右侧。', '否则中点可能就是最小值，令 right=mid。', '每轮都缩小候选区间且不丢失最小值。', '左右相遇时返回该位置的值。'], `class Solution:
    def findMin(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        return nums[left]`, ['中点下标 2 的值 5 大于右端值 2，最小值在右侧。', '左边界移到下标 3。', '新区间中点即下标 3，值 1 不大于右端值 2。', '右界收至 3，与左界相遇，返回 1。'], ['O(log n)', 'O(1)'], ['中点不大于右端时不能写 right=mid-1，因为 mid 可能是答案。', '比较基准使用当前右端值，而不是固定的数组末值。'], ['33 搜索旋转排序数组', '154 寻找旋转数组最小值 II']),

  4: makeLesson(4, '寻找两个正序数组的中位数', '在较短数组上二分切分位置，使两个数组左半部分元素总数正确且均不大于右半部分。', ['两个输入数组各自升序，且不会同时为空。', '总长度为奇数返回中间值，为偶数返回中间两值平均数。'], ['nums1 = [1,3], nums2 = [2]', '2.0', '合并次序为 [1,2,3]，中间元素是 2。'], '无需真正合并；只要找到一条切线，使左侧数量为总数的一半且 maxLeft 不大于 minRight，中位数就由四个边界值决定。', '合并两个数组后取中位数需要 O(m+n) 时间和额外空间，未达到题目要求的对数复杂度。', ['确保在较短数组 nums1 上二分。', '令切分 i 与 j 的左侧总数等于 (m+n+1)//2。', '若 nums1 左边界过大则 i 左移。', '若 nums2 左边界过大则 i 右移。', '切分合法后按总长度奇偶返回左侧最大值或两侧边界平均值。'], `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        left, right = 0, m
        while left <= right:
            i = (left + right) // 2
            j = (m + n + 1) // 2 - i
            a_left = float('-inf') if i == 0 else nums1[i - 1]
            a_right = float('inf') if i == m else nums1[i]
            b_left = float('-inf') if j == 0 else nums2[j - 1]
            b_right = float('inf') if j == n else nums2[j]
            if a_left > b_right:
                right = i - 1
            elif b_left > a_right:
                left = i + 1
            else:
                if (m + n) % 2:
                    return float(max(a_left, b_left))
                return (max(a_left, b_left) + min(a_right, b_right)) / 2.0`, ['交换后较短数组为 [2]，长度 1。', '尝试切分 i=0，则另一数组切分 j=2，边界条件不合法。', '右移到 i=1、j=1，此时两侧边界有序。', '总长度为奇数，左侧最大值为 2，返回 2.0。'], ['O(log(min(m,n)))', 'O(1)'], ['必须在较短数组上二分，才能保证另一数组切分下标不越界。', '左侧目标数量使用加一再整除，统一处理奇数长度。'], ['295 数据流中位数', ' kth 两个有序数组第 K 小']),

  155: makeLesson(155, '最小栈', '在普通栈之外同步维护当前位置的最小值，使取最小元素也能常数时间完成。', ['push、pop、top 和 getMin 都要求 O(1) 时间。', '只会在非空栈上调用 pop、top 与 getMin。'], ['operations = ["MinStack","push","push","push","getMin","pop","top","getMin"], values = [[],[-2],[0],[-3],[],[],[],[]]', '[null,null,null,null,-3,null,0,-2]', '辅助最小栈随每次入栈同步保存当前最小值。'], '每个深度都保存截至该深度的最小值，弹出时上一层最小值自然恢复，不必重新扫描。', '只存普通栈并在 getMin 时遍历，单次查询为 O(n)；只记录一个最小值则无法处理最小元素被弹出的情况。', ['values 保存真实入栈值。', 'mins 在每次 push 时保存新值与旧最小值的较小者。', '两个栈始终同步增长。', 'pop 同时弹出两个栈顶。', 'top 读取 values，getMin 读取 mins。'], `class MinStack:
    def __init__(self):
        self.values = []
        self.mins = []

    def push(self, val: int) -> None:
        self.values.append(val)
        current = val if not self.mins else min(val, self.mins[-1])
        self.mins.append(current)

    def pop(self) -> None:
        self.values.pop()
        self.mins.pop()

    def top(self) -> int:
        return self.values[-1]

    def getMin(self) -> int:
        return self.mins[-1]`, ['push -2 后两个栈顶都是 -2。', 'push 0 时当前最小值仍为 -2。', 'push -3 后最小栈顶变成 -3，getMin 返回 -3。', '同步 pop 后 values 顶为 0，最小值恢复为 -2。'], ['所有操作 O(1)', 'O(n)'], ['遇到等于当前最小值的元素也要同步记录，否则弹出时计数会错。', 'pop 必须同时操作数据栈和最小栈。'], ['232 用栈实现队列', '716 最大栈']),

  394: makeLesson(394, '字符串解码', '用栈保存进入方括号前的重复次数和外层字符串，遇到右括号时完成一层展开。', ['编码格式为 k[encoded_string]，k 为正整数。', '方括号可以嵌套，普通字符只包含英文字母。'], ['s = "3[a2[c]]"', 'accaccacc', '内层 2[c] 先解成 cc，再把 acc 重复三次。'], '左括号像函数调用：暂存外层上下文并开始解析内层；右括号返回时把内层结果重复后接回外层。', '反复用正则寻找最内层括号并替换可以实现，但每轮重新扫描字符串，嵌套深时效率较差。', ['连续数字累积成完整重复次数。', '读到左括号时把当前字符串和次数压栈。', '重置当前层字符串与次数。', '读到右括号时弹栈并展开当前层。', '普通字母直接追加，扫描结束返回当前字符串。'], `class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        current = ''
        number = 0
        for ch in s:
            if ch.isdigit():
                number = number * 10 + int(ch)
            elif ch == '[':
                stack.append((current, number))
                current, number = '', 0
            elif ch == ']':
                outer, repeat = stack.pop()
                current = outer + current * repeat
            else:
                current += ch
        return current`, ['读到 3[，保存外层空串和次数 3。', '读入 a，随后遇到 2[，保存当前层 a。', '内层 c 在 ] 处展开为 cc，接回得到 acc。', '外层 ] 将 acc 重复三次，得到 accaccacc。'], ['O(n+输出长度)', 'O(n+输出长度)'], ['重复次数可能有多位，不能逐个数字独立处理。', '压栈时要同时保存外层字符串和重复次数。'], ['227 基本计算器 II', '726 原子的数量']),

  739: makeLesson(739, '每日温度', '维护温度单调递减的下标栈，在更暖日期出现时一次结算之前较冷日期的等待天数。', ['答案记录严格更高温度的距离，相等温度不算更暖。', '若未来没有更高温度，对应答案保持 0。'], ['temperatures = [73,74,75,71,69,72,76,73]', '[1,1,4,2,1,1,0,0]', '例如 75 要等到四天后的 76。'], '栈中日期尚未遇到更暖天且温度递减；当前温度更高时，它就是栈顶日期最近的更暖日。', '对每一天向右逐日寻找更高温度，递减序列会导致 O(n²) 比较。', ['初始化全零答案和空下标栈。', '从左到右扫描温度。', '当前温度严格高于栈顶温度时弹出旧下标。', '用当前下标减旧下标写入等待天数。', '当前下标入栈，最终未弹出的答案保持零。'], `class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        ans = [0] * len(temperatures)
        stack = []
        for i, temp in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < temp:
                previous = stack.pop()
                ans[previous] = i - previous
            stack.append(i)
        return ans`, ['73 入栈，次日 74 更高，结算等待 1 天。', '74 又被 75 结算为 1 天。', '71、69 入栈，72 到来时依次结算为 2、1 天。', '76 弹出 72 和 75，75 的距离为 4；剩余无更暖日为 0。'], ['O(n)', 'O(n)'], ['比较必须用严格小于，相同温度不能结算。', '栈里应存下标而不是只存温度，才能计算距离。'], ['496 下一个更大元素 I', '84 柱状图最大矩形']),

  84: makeLesson(84, '柱状图中最大的矩形', '用单调递增栈在较矮柱出现时确定被弹柱子的左右边界并计算最大面积。', ['每根柱宽度为 1，高度为非负整数。', '矩形必须由一段连续柱子共同支撑。'], ['heights = [2,1,5,6,2,3]', '10', '高度 5 和 6 两柱形成宽 2、高 5 的面积 10。'], '柱子被更矮高度弹出时，当前下标是其右侧首个更矮位置，弹栈后的栈顶是左侧首个更矮位置。', '枚举每个左右区间再求区间最小高度需要 O(n³)，即使增量维护最小值仍为 O(n²)。', ['在原高度末尾逻辑追加高度 0 的哨兵。', '栈保存高度非递减的柱下标。', '当前高度更小时持续弹栈。', '弹出后以新栈顶确定左界，当前下标确定右界。', '计算高度乘宽度并更新最大面积，再压入当前下标。'], `class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = [-1]
        best = 0
        for i, height in enumerate(heights + [0]):
            while stack[-1] != -1 and heights[stack[-1]] > height:
                h = heights[stack.pop()]
                width = i - stack[-1] - 1
                best = max(best, h * width)
            stack.append(i)
        return best`, ['下标 0 的高度 2 被高度 1 弹出，面积为 2。', '高度 5、6 依次入栈形成递增段。', '高度 2 到来时先弹 6，再弹 5。', '弹出 5 时宽度为 2，面积 10 成为最大值。'], ['O(n)', 'O(n)'], ['需要末尾哨兵来结算最终仍在栈中的柱子。', '宽度是当前下标减新栈顶再减一，边界本身不包含。'], ['85 最大矩形', '739 每日温度']),

  215: makeLesson(215, '数组中的第 K 个最大元素', '维护大小为 k 的最小堆，堆顶始终是当前见过元素中的第 k 大候选。', ['k 从 1 开始计数且不超过数组长度。', '重复元素按出现次数参与排名。'], ['nums = [3,2,1,5,6,4], k = 2', '5', '降序排列为 [6,5,4,3,2,1]，第二大是 5。'], '只需保留最大的 k 个数；最小堆顶是这 k 个数中最弱的一个，遇到更大元素即可替换它。', '完整排序后读取下标 k-1 简单但需要 O(n log n)，保存了与答案无关的全部顺序。', ['初始化空最小堆。', '依次把数组元素压入堆。', '堆大小超过 k 时弹出最小元素。', '扫描结束后堆中恰是最大的 k 个元素。', '返回堆顶作为第 k 大。'], `import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []
        for value in nums:
            heapq.heappush(heap, value)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]`, ['3、2 入堆后暂存两个候选。', '1 入堆使大小为 3，弹出 1。', '5、6、4 依次进入，每次淘汰当前最小候选。', '最终堆为 [5,6]，堆顶 5 即第二大。'], ['O(n log k)', 'O(k)'], ['题目求第 k 大，大小为 k 的堆应是最小堆。', '重复值不能去重，否则排名含义会改变。'], ['347 前 K 个高频元素', '703 数据流中的第 K 大元素']),

  347: makeLesson(347, '前 K 个高频元素', '先统计每个值的频率，再用大小为 k 的最小堆保留频率最高的元素。', ['答案保证唯一，返回顺序任意。', 'k 不超过不同元素的数量。'], ['nums = [1,1,1,2,2,3], k = 2', '[1,2]', '1 出现三次、2 出现两次，频率最高。'], '排名对象是不同元素而不是每次出现；计数后，维护 k 个最高频率即可，不需要对所有频率完整排序。', '对每个不同元素重新扫描原数组计数会重复工作，再排序还会增加额外开销。', ['用 Counter 一次得到值到频率的映射。', '遍历映射中的 (值,频率)。', '把 (频率,值) 放入最小堆。', '堆超过 k 时移除最低频项。', '提取堆中元素值作为答案。'], `from collections import Counter
import heapq

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counts = Counter(nums)
        heap = []
        for value, frequency in counts.items():
            heapq.heappush(heap, (frequency, value))
            if len(heap) > k:
                heapq.heappop(heap)
        return [value for frequency, value in heap]`, ['计数得到 1→3、2→2、3→1。', '频率 3 和 2 的项目先进入容量为 2 的堆。', '频率 1 入堆后立即作为最小项被弹出。', '堆中剩余值 1、2，组成答案。'], ['O(n+u log k)', 'O(u+k)'], ['堆比较主键应是频率，不是元素值。', '答案顺序不作要求，不要额外排序造成无谓开销。'], ['215 数组中第 K 大元素', '451 根据字符频率排序']),

  295: makeLesson(295, '数据流的中位数', '用最大堆保存较小一半、最小堆保存较大一半，并持续维持两堆平衡。', ['addNum 逐个加入整数，findMedian 在至少加入一个数后调用。', '奇数个元素返回中间值，偶数个返回两个中间值平均数。'], ['operations = ["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"], values = [[],[1],[2],[],[3],[]]', '[null,null,null,1.5,null,2.0]', '加入 1、2 时中位数为 1.5，再加入 3 后为 2。'], '中位数只关心排序后中央边界；两个堆分别维护左右两半，让边界始终位于堆顶。Python 用负数模拟最大堆。', '每次加入后重新排序所有数据，单次插入或查询会付出 O(n log n)，数据流越长越低效。', ['新值先压入左侧最大堆。', '把左堆最大值转移到右侧，保证左右有序。', '若右堆元素更多，再把其最小值移回左侧。', '维持左堆大小等于右堆或多一个。', '奇数取左堆顶，偶数取两堆顶平均值。'], `import heapq

class MedianFinder:
    def __init__(self):
        self.lower = []
        self.upper = []

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lower, -num)
        heapq.heappush(self.upper, -heapq.heappop(self.lower))
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self) -> float:
        if len(self.lower) > len(self.upper):
            return float(-self.lower[0])
        return (-self.lower[0] + self.upper[0]) / 2.0`, ['加入 1 后 lower 顶为 1，元素数多一个。', '加入 2 后 lower 与 upper 分别保存 1 和 2。', '两堆等大，中位数为 (1+2)/2=1.5。', '加入 3 并再平衡后 lower 顶为 2，返回 2.0。'], ['addNum O(log n)，findMedian O(1)', 'O(n)'], ['最大堆以负数存储，读取真实值时必须再次取负。', '除大小平衡外，还要保证 lower 中所有值不大于 upper。'], ['4 两个正序数组中位数', '480 滑动窗口中位数']),

  55: makeLesson(55, '跳跃游戏', '从左到右维护当前能够到达的最远下标，判断是否能覆盖数组末尾。', ['nums[i] 表示从位置 i 最多可向右跳的步数。', '起点固定在下标 0，数组长度至少为 1。'], ['nums = [2,3,1,1,4]', 'true', '从 0 跳到 1，再跳到末尾。'], '只要当前位置不超过已知最远可达边界，它就能作为新的跳板扩展边界；具体选择哪条跳跃路径并不重要。', '从每个位置递归尝试所有跳跃长度会重复探索相同后缀，最坏产生指数级分支。', ['初始化 farthest=0。', '按下标从左到右扫描。', '若下标超过 farthest，说明出现不可跨越断层。', '否则用 i+nums[i] 更新最远边界。', '边界达到末尾即可返回真，扫描失败返回假。'], `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        farthest = 0
        for i, jump in enumerate(nums):
            if i > farthest:
                return False
            farthest = max(farthest, i + jump)
            if farthest >= len(nums) - 1:
                return True
        return True`, ['起点跳跃 2，使最远可达下标为 2。', '下标 1 在边界内，其跳跃 3 把边界扩到 4。', '边界已覆盖最后下标 4。', '无需构造具体路线即可返回真。'], ['O(n)', 'O(1)'], ['更新边界前先确认当前位置可达，否则会使用站不到的跳板。', '单元素数组起点即终点，应返回真。'], ['45 跳跃游戏 II', '1306 跳跃游戏 III']),

  45: makeLesson(45, '跳跃游戏 II', '按当前跳跃可覆盖的区间分层扫描，在区间末端决定下一跳并取得最远覆盖。', ['题目保证从起点一定能到达末尾。', '每个元素表示该位置允许的最大向右跳跃长度。'], ['nums = [2,3,1,1,4]', '2', '第一跳到下标 1，第二跳到末尾。'], '一次跳跃能到达的所有位置构成一层；扫描这一层时计算下一层最远边界，到达本层末端才增加跳数。', '普通 BFS 把每个可达下标逐一作为边，会产生 O(n²) 的区间展开；枚举所有跳法更慢。', ['current_end 表示当前跳数能覆盖的右端。', 'farthest 汇总本层各位置能到达的最远点。', '只扫描到倒数第二个下标。', '当 i 到达 current_end 时必须使用一次新跳跃。', '将 current_end 更新为 farthest，最终返回跳数。'], `class Solution:
    def jump(self, nums: List[int]) -> int:
        jumps = 0
        current_end = 0
        farthest = 0
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == current_end:
                jumps += 1
                current_end = farthest
        return jumps`, ['起点层只含下标 0，扫描后下一层最远到 2。', '到达 current_end=0，跳数增为 1，当前层扩为 [1,2]。', '扫描下标 1 时 farthest 更新到 4。', '走到本层末端下标 2，跳数增为 2，边界覆盖终点。'], ['O(n)', 'O(1)'], ['循环不能处理最后一个下标，否则到终点还会多计一次跳跃。', '不要在每次 farthest 变大时加跳数，只在当前层边界处增加。'], ['55 跳跃游戏', '1024 视频拼接']),

  763: makeLesson(763, '划分字母区间', '预先记录每个字符最后出现位置，贪心扩展当前片段直到覆盖其中所有字符的末次出现。', ['字符串只包含小写英文字母。', '同一字母必须完全落在一个片段中。'], ['s = "ababcbacadefegdehijhklij"', '[9,7,8]', '三个最短闭合片段分别覆盖各自字符的所有出现。'], '扫描片段时，见到的每个字符都可能把右边界推远；当下标追上这一动态边界，当前片段已封闭且应立即切割。', '枚举所有切割组合再检查字符是否跨段，需要指数级尝试；逐段反复查找末位置也会重复扫描。', ['先遍历字符串记录每个字符的最后下标。', '维护当前片段起点 start 和右界 end。', '扫描字符时用其最后位置扩展 end。', '当 i==end 时当前片段可以结束。', '记录长度 i-start+1，并把下一位置设为新起点。'], `class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {ch: i for i, ch in enumerate(s)}
        ans = []
        start = end = 0
        for i, ch in enumerate(s):
            end = max(end, last[ch])
            if i == end:
                ans.append(i - start + 1)
                start = i + 1
        return ans`, ['字符 a 最后在 8，首片段右界先变为 8。', '片段内遇到 b、c，但它们末次出现也不超过 8。', '扫描到下标 8 时边界闭合，记录长度 9。', '从 d 开始同样扩展并闭合，最终得到 7 和 8。'], ['O(n)', 'O(字符集大小)'], ['切割条件是当前下标等于动态右界，不是字符第一次重复。', '片段长度要加一，因为起止下标都包含。'], ['56 合并区间', '316 去除重复字母']),
  118: makeLesson(118, '杨辉三角', '逐行利用上一行相邻数字之和构造杨辉三角，边界元素固定为 1。', ['numRows 为要生成的行数且至少为 1。', '第 r 行包含 r+1 个元素（按零下标计行）。'], ['numRows = 5', '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]', '每个内部值等于左上与右上元素之和。'], '新行只依赖上一行：先放满 1，再把内部位置替换为上一行的两个相邻值之和。', '用组合数公式逐项计算可行，但会涉及乘除与重复计算，不如直接复用已生成行直观稳定。', ['答案从第一行 [1] 开始。', '为当前行创建长度递增且全为 1 的数组。', '只遍历当前行的内部下标。', '令 row[j]=prev[j-1]+prev[j]。', '将完成的新行加入答案，直到达到 numRows。'], `class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        triangle = []
        for length in range(1, numRows + 1):
            row = [1] * length
            if triangle:
                previous = triangle[-1]
                for j in range(1, length - 1):
                    row[j] = previous[j - 1] + previous[j]
            triangle.append(row)
        return triangle`, ['第一行直接生成 [1]。', '第二行没有内部位置，得到 [1,1]。', '第三行内部值为 1+1=2。', '继续由 [1,3,3,1] 生成第五行 [1,4,6,4,1]。'], ['O(numRows²)', 'O(numRows²)（含答案）'], ['内部循环不能覆盖两端固定的 1。', '生成当前行时必须读取完整的上一行，而非尚未完成的当前行。'], ['119 杨辉三角 II', '120 三角形最小路径和']),

  198: makeLesson(198, '打家劫舍', '对每间房比较跳过它与抢它两种选择，用两个滚动状态求不相邻房屋的最大金额。', ['相邻房屋不能在同一晚被抢。', '房屋金额为非负整数，数组至少含一个元素。'], ['nums = [2,7,9,3,1]', '12', '选择金额 2、9、1 的房屋，总额为 12。'], '处理到当前房时，最优值只依赖前一房最优值和前两房最优值加当前金额，因此无需保存整张 DP 表。', '枚举每个房屋抢或不抢共有 2 的 n 次方种选择，再过滤相邻冲突会指数爆炸。', ['prev2 表示处理到前两间房的最优值。', 'prev1 表示处理到前一间房的最优值。', '抢当前房得到 prev2+money。', '不抢当前房保持 prev1，取两者较大值。', '滚动更新两个状态，最终返回 prev1。'], `class Solution:
    def rob(self, nums: List[int]) -> int:
        prev2 = prev1 = 0
        for money in nums:
            current = max(prev1, prev2 + money)
            prev2, prev1 = prev1, current
        return prev1`, ['处理 2 后最优为 2。', '处理 7 时选择 7，优于只抢 2。', '处理 9 时可由隔一间的 2 加 9，最优变 11。', '继续处理 3、1，最终最优为 12。'], ['O(n)', 'O(1)'], ['滚动赋值前要先计算 current，避免覆盖 prev2 所需旧值。', '状态比较的是累计最优值，不是相邻两间房金额大小。'], ['213 打家劫舍 II', '337 打家劫舍 III']),

  279: makeLesson(279, '完全平方数', '把每个金额视为状态，用完全背包转移求组成 n 所需的最少平方数个数。', ['n 为正整数。', '每个完全平方数可以重复使用任意次。'], ['n = 12', '3', '12 可以写成 4+4+4，且无法只用两个平方数表示。'], '对每个值 x，最后选择一个平方数 q 后，问题变成 1+dp[x-q]；遍历所有不超过 x 的平方数取最小值。', '递归枚举平方数组合会重复求解同一剩余值，并产生大量不同顺序的等价方案。', ['预生成不大于 n 的平方数列表。', '令 dp[0]=0，其余初始化为无穷。', '从 1 到 n 依次计算状态。', '遍历不超过当前值的平方数并尝试 dp[x-square]+1。', 'dp[n] 即最少数量。'], `class Solution:
    def numSquares(self, n: int) -> int:
        squares = [i * i for i in range(1, int(n ** 0.5) + 1)]
        dp = [0] + [float('inf')] * n
        for value in range(1, n + 1):
            for square in squares:
                if square > value:
                    break
                dp[value] = min(dp[value], dp[value - square] + 1)
        return dp[n]`, ['平方数候选为 1、4、9。', 'dp[4] 通过单独使用 4 得到 1。', 'dp[8] 由 dp[4]+1 得到 2。', 'dp[12] 由 dp[8]+1 得到 3。'], ['O(n√n)', 'O(n)'], ['平方数允许重复，状态转移不能把每个平方数限制为一次。', 'dp[0] 必须为 0，才能正确表示单个平方数。'], ['322 零钱兑换', '367 有效的完全平方数']),

  322: makeLesson(322, '零钱兑换', '以金额为状态，用可重复硬币的动态规划求凑成目标金额所需的最少硬币数。', ['每种硬币可使用无限次。', '无法凑成 amount 时返回 -1，amount 为 0 时返回 0。'], ['coins = [1,2,5], amount = 11', '3', '最优组合是 5+5+1，共三枚硬币。'], '若最后一枚使用 coin，则此前必须以最少硬币凑成 value-coin；对所有可用币值取最小转移。', '暴力递归尝试每种硬币会反复处理相同剩余金额，分支数随 amount 指数增长。', ['创建长度 amount+1 的 dp。', 'dp[0]=0，其余用 amount+1 作为不可达哨兵。', '依次计算每个正金额 value。', '对不超过 value 的硬币尝试 dp[value-coin]+1。', '若 dp[amount] 仍是哨兵返回 -1，否则返回它。'], `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        impossible = amount + 1
        dp = [0] + [impossible] * amount
        for value in range(1, amount + 1):
            for coin in coins:
                if coin <= value:
                    dp[value] = min(dp[value], dp[value - coin] + 1)
        return -1 if dp[amount] == impossible else dp[amount]`, ['dp[1] 用硬币 1 得到 1。', 'dp[5] 可直接使用硬币 5，更新为 1。', 'dp[10] 由 dp[5] 再加一枚 5 得到 2。', 'dp[11] 由 dp[10] 加硬币 1 得到 3。'], ['O(amount·种类数)', 'O(amount)'], ['哨兵要大于任何可能的硬币数量，amount+1 足够。', '不要用贪心总选最大币值，任意币制下不保证最优。'], ['279 完全平方数', '518 零钱兑换 II']),

  139: makeLesson(139, '单词拆分', '用前缀动态规划判断字符串每个位置能否由字典单词连续拼接到达。', ['字典中的单词可以重复使用。', '拆分必须覆盖完整字符串，字符顺序不能改变。'], ['s = "leetcode", wordDict = ["leet","code"]', 'true', '前缀 leet 与后缀 code 都在字典中。'], 'dp[i] 表示前 i 个字符可拆分；若某个可达位置 j 后面的片段 s[j:i] 在字典中，则 i 也可达。', '从开头递归尝试所有字典词会对同一后缀进行重复拆分，尤其在大量共同前缀时开销巨大。', ['把词典转为集合以便常数时间查询。', '建立长度 n+1 的布尔数组并令 dp[0]=true。', '对每个结束位置 i 枚举切分点 j。', '只有 dp[j] 为真且 s[j:i] 在词典时设置 dp[i]。', '某个切分成功即可停止该 i 的内层循环，返回 dp[n]。'], `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        dp = [False] * (len(s) + 1)
        dp[0] = True
        for end in range(1, len(s) + 1):
            for start in range(end):
                if dp[start] and s[start:end] in words:
                    dp[end] = True
                    break
        return dp[-1]`, ['dp[0] 表示空前缀可达。', '结束位置 4 时，s[0:4] 为 leet，故 dp[4] 变真。', '继续检查后续结束位置，只有从可达切点出发才有效。', '结束位置 8 时 code 命中，dp[8] 为真。'], ['O(n²·切片成本)', 'O(n+字典大小)'], ['dp 数组需要包含空前缀状态，长度应为 n+1。', '字典词可复用，不应在匹配后从集合删除。'], ['140 单词拆分 II', '472 连接词']),

  300: makeLesson(300, '最长递增子序列', '维护各长度递增子序列的最小尾值，并用二分替换得到 O(n log n) 解法。', ['子序列不要求连续，但必须保持原下标顺序。', '严格递增意味着相等元素不能扩展长度。'], ['nums = [10,9,2,5,3,7,101,18]', '4', '例如 [2,3,7,101] 的长度为 4。'], 'tails[i] 记录长度 i+1 的递增子序列可达到的最小尾值；尾值越小，未来越容易继续扩展。', '枚举所有子序列有 2 的 n 次方种；经典 O(n²) DP 也可行但没有利用尾值的有序性。', ['初始化空 tails。', '对每个 value 在 tails 中二分第一个大于等于它的位置。', '若位置在末尾，则 value 能扩展最长长度。', '否则用 value 替换该位置以降低对应长度的尾值。', 'tails 的最终长度就是最长递增子序列长度。'], `from bisect import bisect_left

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for value in nums:
            position = bisect_left(tails, value)
            if position == len(tails):
                tails.append(value)
            else:
                tails[position] = value
        return len(tails)`, ['10 建立 tails=[10]，9 将其替换为更小尾值。', '2 再次降低长度 1 的尾值，随后 5 扩展为 [2,5]。', '3 替换 5，7 与 101 继续扩展到长度 4。', '18 替换长度 4 的尾值 101，但最长长度保持 4。'], ['O(n log n)', 'O(n)'], ['tails 本身不一定是一条来自原数组的真实子序列，只用于记录最优尾值。', '严格递增要用 bisect_left，相等值应替换而非追加。'], ['354 俄罗斯套娃信封', '674 最长连续递增序列']),

  152: makeLesson(152, '乘积最大子数组', '同时维护以当前位置结尾的最大与最小乘积，让负数能把最小值翻转成新的最大值。', ['必须选择非空且连续的子数组。', '元素可为负数或零，乘积保证在整数范围内。'], ['nums = [2,3,-2,4]', '6', '连续子数组 [2,3] 的乘积 6 最大。'], '负数会交换最大和最小的角色，因此只记录最大乘积会漏掉两个负数相乘变大的机会。', '枚举所有连续区间并逐项相乘需要 O(n³)，复用区间积也仍需 O(n²)。', ['用首元素初始化 currentMax、currentMin 与答案。', '遇到负数先交换当前最大和最小。', '最大状态在重新从 value 开始与延续旧最大之间取大。', '最小状态同理取小，为未来负数保留潜力。', '每步用 currentMax 更新全局答案。'], `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        current_max = current_min = answer = nums[0]
        for value in nums[1:]:
            if value < 0:
                current_max, current_min = current_min, current_max
            current_max = max(value, current_max * value)
            current_min = min(value, current_min * value)
            answer = max(answer, current_max)
        return answer`, ['首元素 2 使最大、最小和答案都为 2。', '乘 3 后当前最大为 6，答案更新为 6。', '遇到 -2 先交换状态，再计算最大为 -2、最小为 -12。', '遇到 4 后当前最大为 4，仍不超过全局答案 6。'], ['O(n)', 'O(1)'], ['必须同步维护最小乘积，负数可能使其变成最大候选。', '状态允许从当前元素重新开始，以正确处理零和不利前缀。'], ['53 最大子数组和', '1567 乘积为正数的最长子数组']),

  416: makeLesson(416, '分割等和子集', '把问题转为 0/1 背包，判断是否能从数组中选出总和一半的子集。', ['每个数组元素只能被使用一次。', '若数组总和为奇数，不可能平分。'], ['nums = [1,5,11,5]', 'true', '子集 [11] 与 [1,5,5] 的和都为 11。'], '两个子集覆盖全部元素时，只需找到一个和为 total/2 的子集；倒序更新布尔状态可保证每个数只用一次。', '枚举每个元素属于左组还是右组共有 2 的 n 次方种分配。', ['计算总和，奇数时立即返回假。', '目标设为总和的一半，dp[0]=true。', '逐个处理数组元素。', '容量从 target 倒序到 value，令 dp[s] 吸收 dp[s-value]。', '若 dp[target] 成真可提前返回，否则处理完返回其值。'], `class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for value in nums:
            for current in range(target, value - 1, -1):
                dp[current] = dp[current] or dp[current - value]
            if dp[target]:
                return True
        return False`, ['总和 22 为偶数，目标为 11。', '处理 1、5 后，可达和包括 0、1、5、6。', '处理元素 11 时由 dp[0] 推出 dp[11]。', '目标状态已可达，说明可以平分并返回真。'], ['O(n·sum)', 'O(sum)'], ['容量必须倒序更新，否则同一个元素会在一轮内被重复使用。', '总和为奇数时要先返回，不能进行整数截断后继续。'], ['494 目标和', '1049 最后一块石头的重量 II']),

  32: makeLesson(32, '最长有效括号', '用栈保存未匹配左括号下标和最近无效边界，在右括号成功匹配时计算合法后缀长度。', ['输入只包含左右圆括号。', '答案要求连续且格式有效的括号子串长度。'], ['s = ")()())"', '4', '下标 1 到 4 的子串 ()() 是最长有效部分。'], '栈底哨兵表示当前合法区间之前的边界；每次匹配后，当前位置减去新栈顶就是以当前位置结尾的有效长度。', '枚举所有子串并逐个用栈验证需要 O(n³)，即使只枚举偶数长度仍然过慢。', ['栈先放入边界下标 -1。', '遇到左括号时压入其下标。', '遇到右括号先弹出一个待匹配下标。', '若栈空，当前右括号成为新的无效边界并入栈。', '否则用 i-stack[-1] 更新最大长度。'], `class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack = [-1]
        best = 0
        for i, ch in enumerate(s):
            if ch == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)
                else:
                    best = max(best, i - stack[-1])
        return best`, ['首字符 ) 弹空栈，因此下标 0 成为新边界。', '下标 1 的 ( 入栈，下标 2 的 ) 与它匹配，长度为 2。', '下一对括号结束于下标 4，距边界 0 的长度为 4。', '末尾 ) 无可匹配左括号，重置边界，最大值保持 4。'], ['O(n)', 'O(n)'], ['栈中必须保存下标，保存字符无法计算长度。', '右括号使栈为空时要把它作为新边界压回，否则后续长度会跨过无效字符。'], ['20 有效的括号', '22 括号生成']),
  62: makeLesson(62, '不同路径', '用一维动态规划累计到达每个网格位置的路径数，移动来源只有上方与左方。', ['机器人只能向右或向下移动。', '起点为左上角，终点为右下角，网格中没有障碍。'], ['m = 3, n = 7', '28', '三行七列网格从左上到右下共有 28 条不同路径。'], '到达当前格的最后一步必来自上或左，因此路径数是两者之和；按行更新时 dp[c] 仍代表上方，dp[c-1] 已代表左方。', '递归枚举每条移动路线会重复计算同一格到终点的路径数，组合数量很快增长。', ['初始化长度 n 的数组并全部设为 1。', '第一行和第一列都只有一条路径。', '从第二行、第二列开始扫描。', '令 dp[c]=dp[c]+dp[c-1]。', '完成 m 行后，dp[n-1] 即终点路径数。'], `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n
        for _ in range(1, m):
            for c in range(1, n):
                dp[c] += dp[c - 1]
        return dp[-1]`, ['第一行初始化为七个 1。', '更新第二行后得到 [1,2,3,4,5,6,7]。', '更新第三行时逐列把上方与左方相加。', '最后一列得到 28，即终点路径数。'], ['O(mn)', 'O(n)'], ['一维状态必须从左向右更新，才能使用本行最新的左侧值。', 'm 或 n 为 1 时答案仍为 1，初始化已覆盖该边界。'], ['63 不同路径 II', '64 最小路径和']),

  64: makeLesson(64, '最小路径和', '原地累计每个格子的最小到达代价，当前格只需选择上方和左方较小路径。', ['每次只能向右或向下移动。', '网格元素为非负数，路径包含起点和终点的数值。'], ['grid = [[1,3,1],[1,5,1],[4,2,1]]', '7', '路径 1→3→1→1→1 的总和为 7。'], '到达内部格的最后一步只有上或左；将网格改为前缀最小和后，当前状态可直接从两个已完成邻居转移。', '枚举所有从起点到终点的路线再求和，路线数为组合数量，随网格尺寸指数式增长。', ['先累加第一行，使其表示只能从左到达的代价。', '再累加第一列，使其表示只能从上到达的代价。', '按行列遍历其余内部格。', '当前值加上上方与左方累计值的较小者。', '右下角最终保存全局最小路径和。'], `class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        for c in range(1, cols):
            grid[0][c] += grid[0][c - 1]
        for r in range(1, rows):
            grid[r][0] += grid[r - 1][0]
        for r in range(1, rows):
            for c in range(1, cols):
                grid[r][c] += min(grid[r - 1][c], grid[r][c - 1])
        return grid[-1][-1]`, ['首行累计为 [1,4,5]。', '首列累计为 [1,2,6]。', '中心格 5 加 min(4,2)，累计为 7。', '逐格转移后右下角累计为 7。'], ['O(mn)', 'O(1)（复用输入网格）'], ['原地写法会修改输入网格；若调用方需要原数据应另建数组。', '第一行和第一列只有单一来源，必须单独初始化。'], ['62 不同路径', '120 三角形最小路径和']),

  5: makeLesson(5, '最长回文子串', '以每个字符和字符间隙为中心向两侧扩展，寻找最长连续回文区间。', ['答案必须是原字符串中的连续子串。', '偶数长度与奇数长度回文都需要处理。'], ['s = "babad"', '"bab"', 'bab 是长度 3 的回文；aba 也是可接受答案。'], '任意回文都有中心：奇数回文中心是字符，偶数回文中心是间隙。从中心扩张直到字符不等即可得到该中心的最长回文。', '枚举所有子串再反转判断回文需要 O(n³) 时间，并反复比较相同字符。', ['维护当前最佳左右边界。', '对每个下标分别尝试 (i,i) 奇数中心。', '再尝试 (i,i+1) 偶数中心。', '扩展函数在边界内且两字符相等时向外移动。', '用扩展后的实际长度更新最佳区间，最后切片返回。'], `class Solution:
    def longestPalindrome(self, s: str) -> str:
        best_left = best_right = 0
        def expand(left: int, right: int):
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return left + 1, right - 1
        for i in range(len(s)):
            for left, right in (expand(i, i), expand(i, i + 1)):
                if right - left > best_right - best_left:
                    best_left, best_right = left, right
        return s[best_left:best_right + 1]`, ['以首个 b 为中心只能得到 b。', '以第一个 a 为中心扩展，左右 b 相等，得到 bab。', '继续外扩越界，记录边界 0 到 2。', '其他中心最长不超过 3，最终返回 bab。'], ['O(n²)', 'O(1)'], ['必须同时检查字符中心和间隙中心，否则会漏掉偶数长度回文。', '扩展循环退出后边界已多走一步，返回时要各自收回。'], ['647 回文子串', '131 分割回文串']),

  1143: makeLesson(1143, '最长公共子序列', '用二维动态规划比较两个文本前缀，求保持相对顺序但允许跳过字符的最长公共序列长度。', ['子序列字符不要求连续，但相对顺序不能改变。', '两个输入均由小写英文字母组成。'], ['text1 = "abcde", text2 = "ace"', '3', '公共子序列 ace 的长度为 3。'], '若两个前缀末字符相同，它可接在更短前缀的公共子序列后；否则至少跳过其中一个末字符，取两种结果较大值。', '枚举两字符串的所有子序列再求交集需要指数时间与巨大存储。', ['建立 (m+1)×(n+1) 的零表表示空前缀。', '按两个字符串的下标逐格填表。', '末字符相等时取左上状态加一。', '不等时取上方与左方状态较大者。', '右下角即完整文本的最长公共子序列长度。'], `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]`, ['字符 a 与 a 相等，首个公共长度变为 1。', '扫描 b、c 时，c 与第二个文本的 c 匹配，长度变 2。', 'd 不匹配时继承上方或左方较大值。', 'e 与 e 匹配，从左上状态加一得到 3。'], ['O(mn)', 'O(mn)'], ['DP 下标比字符串下标多一，访问字符时要减一。', '字符不等时不能取左上状态，必须考虑分别跳过一个字符。'], ['583 两个字符串的删除操作', '72 编辑距离']),

  72: makeLesson(72, '编辑距离', '用动态规划计算一个字符串前缀转成另一个前缀所需的最少插入、删除和替换次数。', ['每次操作可插入、删除或替换一个字符。', '空串转成长度 k 的字符串需要 k 次插入，反向需要 k 次删除。'], ['word1 = "horse", word2 = "ros"', '3', 'horse 可经替换、删除、删除三步变为 ros。'], '比较两个前缀末字符：相同则无需新操作；不同则在插入、删除、替换对应的三个相邻状态中取最小值再加一。', '递归尝试三类编辑会大量重复处理同一对前缀，最坏有指数级分支。', ['建立大小 (m+1)×(n+1) 的表。', '初始化第一列为连续删除次数、第一行为连续插入次数。', '末字符相等时复制左上状态。', '不等时取上方、左方、左上三者最小值加一。', '返回右下角完整字符串的转换代价。'], `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        return dp[m][n]`, ['h 与 r 不同，可先替换，前缀代价为 1。', '后续 o 与 o 匹配，沿用左上代价。', '通过删除多余字符逐步匹配 ros。', '完整前缀状态 dp[5][3] 为 3。'], ['O(mn)', 'O(mn)'], ['三个转移方向分别代表删除、插入、替换，不能漏项。', '首行首列的空串边界必须预先初始化。'], ['1143 最长公共子序列', '712 两个字符串的最小 ASCII 删除和']),

  136: makeLesson(136, '只出现一次的数字', '利用异或的自反与交换性质抵消所有成对元素，留下唯一出现一次的数。', ['除一个元素只出现一次外，其余元素均恰好出现两次。', '要求线性时间且只使用常量额外空间。'], ['nums = [4,1,2,1,2]', '4', '两对 1 和 2 异或后抵消为零，只剩 4。'], 'a 异或 a 等于 0，0 异或 b 等于 b，且异或顺序可交换，所以所有成对数字都会消失。', '对每个数字计数需要哈希表的 O(n) 空间；逐项寻找配对则需要 O(n²) 时间。', ['初始化 accumulator=0。', '遍历数组中的每个 value。', '令 accumulator 与 value 做按位异或。', '成对值无论相隔多远都会最终抵消。', '遍历结束后返回 accumulator。'], `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        answer = 0
        for value in nums:
            answer ^= value
        return answer`, ['初始值 0 异或 4 得到 4。', '继续异或 1、2 得到中间结果。', '第二个 1 抵消第一个 1。', '第二个 2 也抵消，最终只剩 4。'], ['O(n)', 'O(1)'], ['该结论依赖其他元素恰好出现两次。', '不要把逻辑异或与按位异或混淆，Python 运算符是 ^。'], ['137 只出现一次的数字 II', '260 只出现一次的数字 III']),

  169: makeLesson(169, '多数元素', '用 Boyer-Moore 投票法让不同元素两两抵消，最终候选即出现超过一半的多数元素。', ['多数元素出现次数严格大于 n/2。', '题目保证多数元素一定存在。'], ['nums = [2,2,1,1,1,2,2]', '2', '2 出现四次，超过长度 7 的一半。'], '把一个多数元素与一个非多数元素配对删除后，多数元素仍是剩余序列的多数；计数归零时可从当前位置选新候选。', '哈希计数可在线性时间找到答案，但需要 O(n) 额外空间；排序则需要 O(n log n)。', ['初始化候选为空、票数为零。', '票数为零时把当前值设为新候选。', '当前值等于候选则票数加一。', '否则票数减一，表示一对不同元素抵消。', '保证存在多数元素时，最终候选就是答案。'], `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate = None
        votes = 0
        for value in nums:
            if votes == 0:
                candidate = value
            votes += 1 if value == candidate else -1
        return candidate`, ['前两个 2 使候选 2 获得两票。', '两个 1 将票数逐步抵消到零。', '下一项 1 成为新候选，但后续 2 与其抵消。', '末项 2 在零票时成为候选，返回 2。'], ['O(n)', 'O(1)'], ['若题目不保证多数元素存在，最后还需二次计数验证候选。', '票数归零时应先更新候选，再处理当前元素的投票。'], ['229 多数元素 II', '136 只出现一次的数字']),

  75: makeLesson(75, '颜色分类', '用荷兰国旗三指针原地划分 0、1、2，使三种颜色一次扫描归位。', ['数组只包含 0、1、2。', '要求原地修改，不能调用库排序函数。'], ['nums = [2,0,2,1,1,0]', '[0,0,1,1,2,2]', '所有 0 移到前部，1 留在中间，2 移到后部。'], '维护四段不变量：左侧全为 0，中间已确认全为 1，待处理区未知，右侧全为 2。', '计数后重写数组需要两遍虽也线性，但三指针能单遍完成；比较排序为 O(n log n)。', ['low 指向下一个 0 的位置，high 指向下一个 2 的位置。', 'current 扫描尚未分类区域。', '遇到 0 与 low 交换，二者都前进。', '遇到 2 与 high 交换并缩小 high，但 current 暂不前进。', '遇到 1 只推进 current，直到越过 high。'], `class Solution:
    def sortColors(self, nums: List[int]) -> None:
        low = current = 0
        high = len(nums) - 1
        while current <= high:
            if nums[current] == 0:
                nums[low], nums[current] = nums[current], nums[low]
                low += 1
                current += 1
            elif nums[current] == 2:
                nums[current], nums[high] = nums[high], nums[current]
                high -= 1
            else:
                current += 1`, ['current 首先看到 2，与末尾 0 交换，high 左移。', 'current 仍在原位检查换来的 0，再与 low 交换。', '中间的 2 继续被交换到 high 右侧。', '扫描指针越过 high 后，数组成为 [0,0,1,1,2,2]。'], ['O(n)', 'O(1)'], ['从右侧换来的元素尚未分类，遇到 2 后 current 不能立即增加。', '循环条件必须包含 current==high 的最后一个待处理位置。'], ['283 移动零', '324 摆动排序 II']),

  31: makeLesson(31, '下一个排列', '从右侧寻找首个可提升位置，用刚好更大的后缀元素交换，再把后缀反转为最小顺序。', ['必须原地修改，只允许常量额外空间。', '若当前排列已是最大降序排列，应变为最小升序排列。'], ['nums = [1,2,3]', '[1,3,2]', '提升倒数第二位并让剩余后缀最小，得到紧邻的更大排列。'], '下一个字典序排列应尽量保持高位不变；因此从右找第一个上升转折，只做最小幅度提升，并把后缀降到最小。', '生成所有排列并排序后寻找下一项需要阶乘时间和大量空间。', ['从倒数第二位向左找 nums[i]<nums[i+1] 的首个位置。', '若找到 i，从右向左找首个大于 nums[i] 的元素。', '交换这两个位置，使前缀获得最小提升。', '原后缀必为非递增，交换后仍可通过反转变升序。', '反转 i+1 到末尾；若没有转折则反转整个数组。'], `class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = len(nums) - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        left, right = i + 1, len(nums) - 1
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1`, ['从右看 2<3，因此转折位置 i=1。', '后缀中最右且大于 2 的值是 3。', '交换后数组暂为 [1,3,2]。', '其后缀只有一个元素，反转后仍为 [1,3,2]。'], ['O(n)', 'O(1)'], ['交换对象是后缀中刚好更大的元素，从右找可利用后缀降序性质。', '完全降序时 i 会变为 -1，此时应反转整个数组。'], ['46 全排列', '556 下一个更大元素 III']),

  287: makeLesson(287, '寻找重复数', '把数组值视作下一个下标构成链表，用 Floyd 快慢指针寻找环入口，即重复数字。', ['长度为 n+1，所有值都在 [1,n] 内。', '只有一个重复数字但可重复多次，且不能修改数组。'], ['nums = [1,3,4,2,2]', '2', '数值映射形成的环入口下标值为 2。'], '下标到 nums[index] 的映射必然进入环；两个不同位置指向同一值产生环入口，而该入口值就是重复数。', '用集合可线性查重但需 O(n) 空间；排序会修改数组或需要复制，并付出 O(n log n)。', ['slow 每次沿映射走一步，fast 每次走两步。', '两者必在环内相遇。', '把 slow 重置到起点下标 0。', '此后 slow 与 fast 都每次走一步。', '它们再次相遇的位置就是环入口并返回。'], `class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = fast = 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        slow = 0
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow`, ['从下标 0 出发，slow 走一步、fast 走两步。', '两个指针在由数值映射形成的环内相遇。', 'slow 回到 0，fast 留在相遇点。', '二者同速前进并在入口值 2 处相遇，返回 2。'], ['O(n)', 'O(1)'], ['指针移动使用 nums 中的值作为下一下标，不是普通数组左右移动。', '第二阶段只重置一个指针，并让两者都改为每次一步。'], ['142 环形链表 II', '442 数组中重复的数据']),

  88: makeLesson(88, '合并两个有序数组', '从两个数组有效区间的末尾向前比较，把较大元素写入 nums1 尾部空位。', ['nums1 长度为 m+n，前 m 项有效，末尾空间用于结果。', 'nums2 前 n 项均有效，两个有效部分都按非递减顺序排列。'], ['nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', '[1,2,2,3,5,6]', '从末尾依次放入 6、5、3，可避免覆盖 nums1 未处理值。'], 'nums1 的空位在尾部；逆向写入时，目标位置永远不早于 nums1 尚未比较的位置，因此无需额外数组。', '正向合并若每次插入 nums1 会反复搬移元素；复制后统一排序需要额外空间或 O((m+n)log(m+n)) 时间。', ['i=m-1 指向 nums1 最后有效元素。', 'j=n-1 指向 nums2 最后元素，write=m+n-1 指向写入位。', '比较 nums1[i] 与 nums2[j]，把较大者放到 write。', '对应来源指针与 write 向左移动。', '只要 nums2 仍有元素就继续；nums1 剩余元素已在正确位置。'], `class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        i, j, write = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[write] = nums1[i]
                i -= 1
            else:
                nums1[write] = nums2[j]
                j -= 1
            write -= 1`, ['比较 3 与 6，把 6 写到最后一位。', '比较 3 与 5，把 5 写到倒数第二位。', '3 大于 2，写入下一空位。', '继续逆向合并，最终得到 [1,2,2,3,5,6]。'], ['O(m+n)', 'O(1)'], ['必须从后向前写，否则会覆盖 nums1 中尚未比较的有效元素。', '循环只需确保 nums2 清空；nums1 剩余前缀本来就在正确位置。'], ['21 合并两个有序链表', '977 有序数组的平方']),
};

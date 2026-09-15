import type { Lesson } from './lessons';

export const lessonsBatch5: Record<number, Lesson> = {
  95: {
    id: 95, title: '不同的二叉搜索树 II', summary: '生成由 1 到 n 组成的所有结构不同的二叉搜索树，递归枚举根并组合左右子树。',
    constraints: ['n 为正整数，节点值必须恰好使用 1 到 n。', '结果中的树需满足二叉搜索树次序且结构互不相同。'],
    examples: [{ input: 'n = 3', output: '5 棵不同的树', explanation: '分别以 1、2、3 为根组合合法左右子树，共得到 5 种结构。' }],
    intuition: '固定根值 r 后，左侧只能来自较小区间，右侧只能来自较大区间；两边的任意合法树都可配成一棵新树。',
    bruteForce: '枚举所有二叉树形状再填值并检查 BST，会产生大量不合法候选并重复构造相同区间。',
    approach: ['定义 build(lo, hi) 返回该闭区间能形成的所有树。', '空区间返回包含 None 的列表，表示组合中的空子树。', '依次选择每个值 r 作为根。', '递归得到左右区间的候选树列表。', '对左右候选做笛卡尔积，挂到新根并收集。'],
    code: `from typing import List, Optional

class Solution:
    def generateTrees(self, n: int) -> List[Optional[TreeNode]]:
        def build(lo, hi):
            if lo > hi:
                return [None]
            trees = []
            for root_val in range(lo, hi + 1):
                for left in build(lo, root_val - 1):
                    for right in build(root_val + 1, hi):
                        root = TreeNode(root_val)
                        root.left, root.right = left, right
                        trees.append(root)
            return trees
        return build(1, n)`,
    walkthrough: { input: 'n = 2', steps: ['build(1,2) 尝试根 1。', '左区间为空，右区间生成节点 2。', '再尝试根 2。', '左区间生成节点 1，右区间为空。'], result: '得到 1→2 与 2←1 两棵树。' },
    complexity: { time: 'O(n·C_n)，输出 C_n 棵树且每棵含 n 个节点。', space: 'O(n·C_n)，包括输出树与递归栈。' },
    pitfalls: ['空区间必须返回 [None] 而非空列表，否则组合无法发生。', '不能遗漏某个根值，否则会缺失整类结构。'], related: ['卡特兰数', '区间递归'],
  },
  329: {
    id: 329, title: '矩阵中的最长递增路径', summary: '在矩阵四邻接移动中寻找严格递增长度最大路径，用记忆化搜索消除重复子问题。',
    constraints: ['只能上下左右移动，不能走对角线。', '相邻下一格必须严格更大，相等值不能延伸。'],
    examples: [{ input: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]', output: '4', explanation: '路径 1→2→6→9 长度为 4。' }],
    intuition: '严格递增意味着路径不可能成环；每个格子的最佳后缀只依赖更大的邻格，天然构成 DAG 上的动态规划。',
    bruteForce: '从每格枚举所有递增路径会重复探索相同后缀，路径数可能指数增长。',
    approach: ['为每个坐标定义 dfs，表示从此处出发的最长长度。', '初值为 1，代表只取当前格。', '检查四个边界内且值更大的邻格。', '用 1+dfs(邻格) 更新答案。', '缓存 dfs，并取所有起点结果的最大值。'],
    code: `from typing import List
from functools import lru_cache

class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        m, n = len(matrix), len(matrix[0])
        @lru_cache(None)
        def dfs(r, c):
            best = 1
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > matrix[r][c]:
                    best = max(best, 1 + dfs(nr, nc))
            return best
        return max(dfs(r, c) for r in range(m) for c in range(n))`,
    walkthrough: { input: '[[3,4],[2,1]]', steps: ['从 1 可走到 2 或 4。', '走 1→2 后可到 3。', '再由 3 到 4，长度变为 4。', '其他起点的缓存结果均不超过 4。'], result: '4' },
    complexity: { time: 'O(mn)，每格及其四条边只计算一次。', space: 'O(mn)，缓存与最坏递归深度。' },
    pitfalls: ['比较方向必须是严格大于。', '直接 DFS 不缓存会严重超时。'], related: ['记忆化搜索', 'DAG 最长路'],
  },
  174: {
    id: 174, title: '地下城游戏', summary: '从右下向左上计算进入每格至少需要的生命值，使沿途生命始终为正。',
    constraints: ['骑士只能向右或向下移动。', '生命值任何时刻都不能降到 0，格子可增益也可伤害。'],
    examples: [{ input: 'dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]', output: '7', explanation: '选择合适路径时初始 7 可保证到终点后仍至少为 1。' }],
    intuition: '正向状态还需记录当前生命，难以比较；反向问“进入此格至少要多少”时，只需知道右、下两个后继中要求较小者。',
    bruteForce: '枚举每条右下路径，计算各路径前缀和最低点后取最优，路径数量呈组合爆炸。',
    approach: ['建立比地图多一行一列的 DP 并填无穷大。', '在终点右侧和下侧放置哨兵值 1。', '从右下到左上逆序遍历。', '选择右、下所需生命的较小值并减当前格收益。', '结果至少为 1，最终返回 dp[0][0]。'],
    code: `from typing import List

class Solution:
    def calculateMinimumHP(self, dungeon: List[List[int]]) -> int:
        m, n = len(dungeon), len(dungeon[0])
        dp = [[float('inf')] * (n + 1) for _ in range(m + 1)]
        dp[m][n - 1] = dp[m - 1][n] = 1
        for r in range(m - 1, -1, -1):
            for c in range(n - 1, -1, -1):
                need = min(dp[r + 1][c], dp[r][c + 1]) - dungeon[r][c]
                dp[r][c] = max(1, need)
        return dp[0][0]`,
    walkthrough: { input: '[[-2,-3],[5,-4]]', steps: ['终点 -4 需要进入时有 5 点生命。', '左下 5 进入后足以覆盖需求，故只需 1。', '右上 -3 后要满足 5，需 8。', '起点取下方需求 1，受 -2 影响后需 3。'], result: '3' },
    complexity: { time: 'O(mn)。', space: 'O(mn)，可滚动压缩到 O(n)。' },
    pitfalls: ['生命下限是 1，不是 0。', '正向只保留最大剩余生命不能正确反映不同路径需求。'], related: ['逆向动态规划', '网格路径'],
  },
  376: {
    id: 376, title: '摆动序列', summary: '求相邻差值正负交替的最长子序列长度，维护以升差和降差结尾的最优值。',
    constraints: ['子序列可删除元素但保持原相对顺序。', '差值为 0 不算上升或下降。'],
    examples: [{ input: 'nums = [1,7,4,9,2,5]', output: '6', explanation: '所有相邻差依次正、负、正、负、正。' }],
    intuition: '同方向连续变化时只保留更极端的端点最有利；遇到方向翻转才让摆动长度增长。',
    bruteForce: '枚举所有子序列并逐一检查差值符号，候选有 2^n 个。',
    approach: ['令 up 和 down 都为 1。', '从第二个数开始比较相邻元素。', '若当前更大，令 up=down+1。', '若当前更小，令 down=up+1。', '相等时不更新，最后返回 max(up,down)。'],
    code: `from typing import List

class Solution:
    def wiggleMaxLength(self, nums: List[int]) -> int:
        up = down = 1
        for i in range(1, len(nums)):
            if nums[i] > nums[i - 1]:
                up = down + 1
            elif nums[i] < nums[i - 1]:
                down = up + 1
        return max(up, down)`,
    walkthrough: { input: '[1,4,7,2]', steps: ['初始 up=down=1。', '1→4 上升，up=2。', '4→7 同为上升，up 仍为 2。', '7→2 转为下降，down=3。'], result: '3' },
    complexity: { time: 'O(n)，一次扫描。', space: 'O(1)。' },
    pitfalls: ['相等元素不能产生摆动。', '连续上升不应反复增加长度。'], related: ['贪心峰谷', '双状态动态规划'],
  },
  435: {
    id: 435, title: '无重叠区间', summary: '删除最少区间使其互不重叠，等价于保留最多个结束最早的兼容区间。',
    constraints: ['区间端点满足 start < end。', '前一区间结束等于后一区间开始不算重叠。'],
    examples: [{ input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: '删除 [1,3] 后其余三个首尾相接。' }],
    intuition: '每次保留结束最早的区间，会给后续留下最大可用空间，因此最大化保留数也就最小化删除数。',
    bruteForce: '枚举要保留的区间子集并检查两两兼容，复杂度指数级。',
    approach: ['按结束端点升序排序。', '初始化当前结束位置与保留数量。', '依次检查每个区间起点。', '起点不小于当前结束位置时保留它并更新结束位置。', '用总数减保留数得到删除数。'],
    code: `from typing import List

class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: x[1])
        kept, end = 0, float('-inf')
        for start, finish in intervals:
            if start >= end:
                kept += 1
                end = finish
        return len(intervals) - kept`,
    walkthrough: { input: '[[1,3],[2,4],[3,5]]', steps: ['按结束点后顺序不变。', '保留 [1,3]，end=3。', '[2,4] 起点小于 3，舍弃。', '[3,5] 与边界相接，可保留。'], result: '删除 1 个。' },
    complexity: { time: 'O(n log n)，主要是排序。', space: 'O(log n)，取决于排序实现。' },
    pitfalls: ['应按结束点而非开始点贪心。', 'start == end 是允许的。'], related: ['活动选择', '区间排序'],
  },
  646: {
    id: 646, title: '最长数对链', summary: '选择最多数对组成前一对右值严格小于后一对左值的链，按右端点贪心。',
    constraints: ['每个数对满足 left < right。', '数对可以重排，连接条件是严格小于。'],
    examples: [{ input: 'pairs = [[1,2],[2,3],[3,4]]', output: '2', explanation: '可选 [1,2] 与 [3,4]，中间必须严格留出间隔。' }],
    intuition: '最早结束的可用数对占据范围最小，永远不会比结束更晚的选择减少后续机会。',
    bruteForce: '尝试所有排列和子集寻找最长合法链，规模快速爆炸。',
    approach: ['按每个数对的右值升序排列。', '令链尾为负无穷。', '依序检查数对左值是否大于链尾。', '若满足则选入并把链尾更新为右值。', '累计选入数对个数并返回。'],
    code: `from typing import List

class Solution:
    def findLongestChain(self, pairs: List[List[int]]) -> int:
        pairs.sort(key=lambda p: p[1])
        end = float('-inf')
        count = 0
        for left, right in pairs:
            if left > end:
                count += 1
                end = right
        return count`,
    walkthrough: { input: '[[1,2],[2,3],[3,4]]', steps: ['按右端点排序。', '选择 [1,2]，链尾为 2。', '[2,3] 左值不严格大于 2，跳过。', '[3,4] 可接入，计数为 2。'], result: '2' },
    complexity: { time: 'O(n log n)。', space: 'O(log n)，排序栈空间。' },
    pitfalls: ['连接条件不能写成大于等于。', '按右端点排序才有贪心保证。'], related: ['无重叠区间', '活动选择'],
  },
  406: {
    id: 406, title: '根据身高重建队列', summary: '根据每人前方不矮于自己的数量重建队列，先放高个再按 k 插入。',
    constraints: ['每项为 [height,k]，输入保证存在合法排列。', 'k 只统计前方高度大于等于当前人的人数。'],
    examples: [{ input: 'people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]', output: '[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]', explanation: '逐项检查时，每人的 k 都与前方不矮者数量一致。' }],
    intuition: '高个的位置先确定后，插入矮个不会改变高个眼中的“不矮人数”；因此高个可直接放到索引 k。',
    bruteForce: '枚举全部排列再验证每个人的 k，需 O(n!·n²)。',
    approach: ['按身高降序排序。', '同身高时按 k 升序。', '创建空结果队列。', '依次取当前人并插入结果的索引 k。', '所有人处理完即得到合法队列。'],
    code: `from typing import List

class Solution:
    def reconstructQueue(self, people: List[List[int]]) -> List[List[int]]:
        people.sort(key=lambda p: (-p[0], p[1]))
        queue = []
        for person in people:
            queue.insert(person[1], person)
        return queue`,
    walkthrough: { input: '[[6,0],[5,0],[5,1]]', steps: ['排序得到 [6,0],[5,0],[5,1]。', '[6,0] 插在位置 0。', '[5,0] 插到最前方。', '[5,1] 插到位置 1。'], result: '[[5,0],[5,1],[6,0]]' },
    complexity: { time: 'O(n²)，数组中间插入会搬移元素。', space: 'O(n)，结果队列。' },
    pitfalls: ['同身高必须让 k 小者先插入。', '若先处理矮个，后插高个会破坏其计数。'], related: ['贪心排序', '按索引插入'],
  },
  621: {
    id: 621, title: '任务调度器', summary: '安排带冷却间隔的任务并求最短总时长，用最高频任务构造时间骨架。',
    constraints: ['相同字母任务之间至少隔 n 个单位。', '每个任务耗时 1，空闲时段也计入总长。'],
    examples: [{ input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: '8', explanation: '可排成 A,B,空闲,A,B,空闲,A,B。' }],
    intuition: '频率最高的任务决定至少需要多少个冷却槽；最后一组最高频任务无需尾随冷却，多个并列最高频者共同占据末列。',
    bruteForce: '每个时刻尝试所有可执行任务并回溯，状态排列数量巨大。',
    approach: ['统计 26 个任务频率。', '取得最大频率 maxFreq。', '统计有多少种任务达到 maxFreq。', '骨架长度为 (maxFreq-1)·(n+1)+并列数。', '任务足够多可填满空槽，返回骨架与任务总数的较大者。'],
    code: `from typing import List
from collections import Counter

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        counts = Counter(tasks)
        top = max(counts.values())
        tied = sum(freq == top for freq in counts.values())
        frame = (top - 1) * (n + 1) + tied
        return max(len(tasks), frame)`,
    walkthrough: { input: '[A,A,A,B,B,B], n=2', steps: ['A、B 的最高频率均为 3。', '前两轮各需宽度 3。', '最后一列有 A、B 两项。', '骨架为 2×3+2=8，大于任务数 6。'], result: '8' },
    complexity: { time: 'O(m)，m 为任务数。', space: 'O(1)，字符种类固定为 26。' },
    pitfalls: ['并列最高频任务必须全部计入末列。', '任务很多时答案可能只是 len(tasks)，不能只返回骨架。'], related: ['频率计数', '贪心排程'],
  },
  881: {
    id: 881, title: '救生艇', summary: '每艇最多载两人且有重量上限，排序后用双指针尽量让最重者搭配最轻者。',
    constraints: ['每个人重量不超过限重，保证都能单独乘艇。', '每艘艇至多两人，不能用三人组合。'],
    examples: [{ input: 'people = [3,2,2,1], limit = 3', output: '3', explanation: '1 与 2 同艇，另一个 2 和 3 分别单独乘艇。' }],
    intuition: '当前最重者必须占一艘艇；若连最轻者都不能与其同乘，就无人可配，否则配最轻者不会浪费更强的搭配资源。',
    bruteForce: '搜索所有单人和双人分组方案，组合数量指数增长。',
    approach: ['将体重升序排序。', '左右指针指向最轻和最重者。', '每轮让最重者上艇并右移。', '若最轻与最重之和不超限，同时左移。', '每轮计一艘艇，直到所有人处理完。'],
    code: `from typing import List

class Solution:
    def numRescueBoats(self, people: List[int], limit: int) -> int:
        people.sort()
        left, right, boats = 0, len(people) - 1, 0
        while left <= right:
            if people[left] + people[right] <= limit:
                left += 1
            right -= 1
            boats += 1
        return boats`,
    walkthrough: { input: '[1,2,2,3], limit=3', steps: ['最重 3 与最轻 1 超限，3 单独。', '剩余最重 2 可与 1 同乘。', '最后一个 2 单独。', '所有指针越过，共使用三艇。'], result: '3' },
    complexity: { time: 'O(n log n)，用于排序。', space: 'O(log n)，排序额外空间。' },
    pitfalls: ['循环需覆盖 left==right 的单人情况。', '每艇最多两人，不能扩展成一般装箱。'], related: ['双指针配对', '排序贪心'],
  },
  455: {
    id: 455, title: '分发饼干', summary: '用尺寸有限的饼干满足尽可能多孩子的最低需求，排序后进行最小可行匹配。',
    constraints: ['每个孩子最多一块饼干，每块饼干最多给一人。', '只有饼干尺寸不小于胃口时孩子才满足。'],
    examples: [{ input: 'g = [1,2,3], s = [1,1]', output: '1', explanation: '两块尺寸 1 的饼干只能满足胃口为 1 的孩子。' }],
    intuition: '优先满足胃口最小的孩子，并给他当前最小可用饼干，可把大饼干留给更难满足的人。',
    bruteForce: '尝试每块饼干分给每个孩子并回溯，最坏呈指数级。',
    approach: ['将胃口和饼干尺寸分别升序排序。', '用 i 指向当前最小未满足胃口。', '从小到大遍历每块饼干。', '若尺寸达到 g[i]，满足该孩子并推进 i。', '孩子全部满足或饼干耗尽后返回 i。'],
    code: `from typing import List

class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        g.sort()
        s.sort()
        child = 0
        for cookie in s:
            if child < len(g) and cookie >= g[child]:
                child += 1
        return child`,
    walkthrough: { input: 'g=[1,2], s=[1,2,3]', steps: ['两数组排序后不变。', '尺寸 1 满足胃口 1。', '尺寸 2 满足胃口 2。', '孩子已全部满足，无需利用尺寸 3。'], result: '2' },
    complexity: { time: 'O(n log n + m log m)。', space: 'O(log n + log m)，由排序实现决定。' },
    pitfalls: ['不能把过大的饼干优先给小胃口而忽略排序策略。', '访问 g[child] 前要检查孩子是否已全部满足。'], related: ['二分匹配', '双指针贪心'],
  },
  860: {
    id: 860, title: '柠檬水找零', summary: '顾客依次付款 5、10 或 20 元，在线维护零钱并判断能否为每人找零。',
    constraints: ['每杯售价 5 元，初始没有零钱。', '必须按队列顺序服务，不能使用未来顾客的钱。'],
    examples: [{ input: 'bills = [5,5,5,10,20]', output: 'true', explanation: '前三张 5 元积累零钱，10 元找 5，20 元优先找 10+5。' }],
    intuition: '收到 20 元时应优先消耗一张 10 元和一张 5 元，因为 5 元更通用；否则才用三张 5 元。',
    bruteForce: '对每次找零枚举现金组合并回溯未来选择，状态多且没有必要。',
    approach: ['记录手中 5 元和 10 元张数。', '收到 5 元直接增加五元张数。', '收到 10 元必须消耗一张 5 元。', '收到 20 元优先使用 10+5，否则使用三个 5。', '任一步零钱不足返回 false，全部完成返回 true。'],
    code: `from typing import List

class Solution:
    def lemonadeChange(self, bills: List[int]) -> bool:
        five = ten = 0
        for bill in bills:
            if bill == 5:
                five += 1
            elif bill == 10:
                if five == 0:
                    return False
                five -= 1
                ten += 1
            else:
                if ten > 0 and five > 0:
                    ten -= 1
                    five -= 1
                elif five >= 3:
                    five -= 3
                else:
                    return False
        return True`,
    walkthrough: { input: '[5,5,10,20]', steps: ['首张 5 元留作零钱。', '第二张 5 元后共有两张。', '10 元顾客消耗一张 5，新增一张 10。', '20 元用 10+5 找零，零钱恰好用完。'], result: 'true' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['20 元应优先消耗 10 元。', '找零失败必须立即返回，不能透支现金。'], related: ['在线贪心', '现金计数'],
  },
  968: {
    id: 968, title: '监控二叉树', summary: '在二叉树节点放置最少摄像头覆盖自身、父节点和直接孩子，用后序三状态贪心。',
    constraints: ['一个摄像头只覆盖距离至多 1 的节点。', '空孩子视为已覆盖，不能要求其放摄像头。'],
    examples: [{ input: 'root = [0,0,null,0,0]', output: '1', explanation: '在中间的非叶节点放一个摄像头即可覆盖整棵树。' }],
    intuition: '叶子不宜放摄像头，把摄像头上移到其父节点通常覆盖更多；后序遍历让父节点根据孩子状态作局部最优决策。',
    bruteForce: '枚举每个节点是否安装摄像头并验证覆盖，需检查 2^n 种方案。',
    approach: ['约定状态 0=未覆盖、1=有摄像头、2=已覆盖无摄像头。', '空节点返回状态 2。', '后序取得左右孩子状态。', '任一孩子未覆盖就在当前节点安装并返回 1。', '若孩子有摄像头返回 2，否则返回 0；最后单独处理根未覆盖。'],
    code: `from typing import Optional

class Solution:
    def minCameraCover(self, root: Optional[TreeNode]) -> int:
        cameras = 0
        def dfs(node):
            nonlocal cameras
            if not node:
                return 2
            left, right = dfs(node.left), dfs(node.right)
            if left == 0 or right == 0:
                cameras += 1
                return 1
            if left == 1 or right == 1:
                return 2
            return 0
        if dfs(root) == 0:
            cameras += 1
        return cameras`,
    walkthrough: { input: '三节点链 root-left-left', steps: ['最底叶子的空孩子均已覆盖，叶子返回未覆盖。', '中间节点发现孩子未覆盖，安装摄像头。', '根发现孩子有摄像头，判定已覆盖。', '根无需补装，计数保持 1。'], result: '1' },
    complexity: { time: 'O(n)，每节点访问一次。', space: 'O(h)，递归栈高度。' }, pitfalls: ['根没有父节点，遍历后若未覆盖必须补摄像头。', '空节点应返回已覆盖而非未覆盖。'], related: ['树形贪心', '后序遍历状态机'],
  },
  1024: {
    id: 1024, title: '视频拼接', summary: '从若干时间片段中选最少数量覆盖 [0,time]，每轮在当前可达范围内扩展到最远。',
    constraints: ['片段可重叠并可裁剪。', '若覆盖链中出现空隙则返回 -1。'],
    examples: [{ input: 'clips = [[0,2],[1,5],[4,7]], time = 7', output: '3', explanation: '三个片段依次把覆盖终点从 0 扩展到 2、5、7。' }],
    intuition: '已覆盖到 end 时，所有起点不晚于 end 的片段都可接上；选其中终点最远者能最大化本轮收益。',
    bruteForce: '枚举片段子集与排列并检查覆盖，复杂度指数级。',
    approach: ['按起点升序排序片段。', '维护当前覆盖终点 end、扫描下标和使用数。', '扫描所有起点不超过 end 的片段并记录最远终点 far。', '若 far 没有超过 end，说明出现断层。', '使用一次片段令 end=far，重复直到覆盖 time。'],
    code: `from typing import List

class Solution:
    def videoStitching(self, clips: List[List[int]], time: int) -> int:
        clips.sort()
        i = used = end = 0
        while end < time:
            far = end
            while i < len(clips) and clips[i][0] <= end:
                far = max(far, clips[i][1])
                i += 1
            if far == end:
                return -1
            used += 1
            end = far
        return used`,
    walkthrough: { input: '[[0,2],[1,4],[3,6]], time=6', steps: ['在 end=0 时只能选 [0,2]，扩到 2。', '起点不超 2 的 [1,4] 把 far 扩到 4。', 'end=4 时 [3,6] 可接入。', '第三次扩到 6，完成覆盖。'], result: '3' },
    complexity: { time: 'O(n log n)，排序后线性扫描。', space: 'O(log n)，排序栈。' }, pitfalls: ['可接条件是 start <= end。', '每轮必须检测是否真正向右扩展。'], related: ['跳跃游戏 II', '区间覆盖'],
  },
  316: {
    id: 316, title: '去除重复字母', summary: '删除重复字符，使每种字符恰出现一次且结果字典序最小，使用可撤销的单调栈。',
    constraints: ['每个不同字符必须保留且只保留一次。', '结果在所有合法子序列中字典序最小。'],
    examples: [{ input: 's = "cbacdcbc"', output: '"acdb"', explanation: '保留 a、c、d、b 各一次，并得到可行的最小字典序。' }],
    intuition: '若栈顶比当前字符大且之后还会出现，就可安全删除栈顶，让更小字符提前；最后一次出现的字符绝不能弹出。',
    bruteForce: '枚举所有长度等于不同字符数的子序列，筛选合法结果后取字典序最小，指数级。',
    approach: ['统计每个字符剩余出现次数。', '维护结果栈和栈内字符集合。', '扫描字符时先减少其剩余次数。', '若字符已在栈中则跳过。', '弹出更大且未来仍出现的栈顶，再压入当前字符。'],
    code: `from collections import Counter

class Solution:
    def removeDuplicateLetters(self, s: str) -> str:
        remain = Counter(s)
        stack = []
        used = set()
        for ch in s:
            remain[ch] -= 1
            if ch in used:
                continue
            while stack and stack[-1] > ch and remain[stack[-1]] > 0:
                used.remove(stack.pop())
            stack.append(ch)
            used.add(ch)
        return ''.join(stack)`,
    walkthrough: { input: '"bcabc"', steps: ['b 入栈，随后 c 入栈。', '遇到 a，c 与 b 后面都还出现，依次弹出。', 'a 入栈，接着 b 入栈。', '最后 c 入栈，字符均唯一。'], result: '"abc"' },
    complexity: { time: 'O(n)，每字符至多入栈和出栈一次。', space: 'O(k)，k 为字符种类数。' }, pitfalls: ['弹栈必须确认栈顶未来还会出现。', '跳过重复字符前仍要更新剩余计数。'], related: ['单调栈', '最小字典序子序列'],
  },
  402: {
    id: 402, title: '移掉 K 位数字', summary: '从十进制字符串删除恰好 k 位，使剩余数值最小，用单调递增栈优先删除高位下降点。',
    constraints: ['必须删除恰好 k 个字符。', '返回结果不能有多余前导零，空结果表示 0。'],
    examples: [{ input: 'num = "1432219", k = 3', output: '"1219"', explanation: '删除 4、3、2 后得到最小结果 1219。' }],
    intuition: '高位越小影响越大；遇到更小数字时，应在额度允许下删除前面比它大的数字。',
    bruteForce: '枚举删除位置组合并比较所有结果，共有 C(n,k) 种。',
    approach: ['创建字符栈。', '扫描当前数字时，若栈顶更大且 k>0 就弹出。', '将当前数字压栈。', '扫描结束若 k 仍大于 0，从末尾删除 k 位。', '拼接后去除前导零，空串返回 0。'],
    code: `class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        stack = []
        for digit in num:
            while k and stack and stack[-1] > digit:
                stack.pop()
                k -= 1
            stack.append(digit)
        if k:
            stack = stack[:-k]
        answer = ''.join(stack).lstrip('0')
        return answer or '0'`,
    walkthrough: { input: 'num="10200", k=1', steps: ['1 先入栈。', '遇到 0，弹出更大的 1，额度用完。', '其余 2、0、0 依次入栈。', '拼成 0200 并去掉前导零。'], result: '"200"' },
    complexity: { time: 'O(n)。', space: 'O(n)。' }, pitfalls: ['单调不降输入会剩余 k，必须从尾部补删。', '去掉前导零后可能为空，应返回字符串 0。'], related: ['单调栈', '贪心删位'],
  },
  456: {
    id: 456, title: '132 模式', summary: '判断是否存在下标递增且数值满足 ai < ak < aj 的三元组，从右向左维护候选 3 与已确认的 2。',
    constraints: ['三个元素下标必须严格递增。', '数值关系也严格，重复值不能替代小于号。'],
    examples: [{ input: 'nums = [3,1,4,2]', output: 'true', explanation: '1、4、2 的下标递增且 1 < 2 < 4。' }],
    intuition: '从右侧维护递减栈作为“3”候选；被更大数弹出的最大值可充当“2”，之后若左侧出现更小值就完成 132。',
    bruteForce: '枚举 i<j<k 的三元组并比较，需 O(n³)。',
    approach: ['从右向左扫描数组。', '栈保存潜在的较大元素，并保持递减。', 'second 保存已被某个更大元素包住的最大“2”。', '若当前值小于 second，立即找到模式。', '当前值大于栈顶时持续弹栈更新 second，再压入当前值。'],
    code: `from typing import List

class Solution:
    def find132pattern(self, nums: List[int]) -> bool:
        stack = []
        second = float('-inf')
        for value in reversed(nums):
            if value < second:
                return True
            while stack and value > stack[-1]:
                second = stack.pop()
            stack.append(value)
        return False`,
    walkthrough: { input: '[3,1,4,2]', steps: ['从右侧 2 入栈。', '扫描 4，弹出 2，因此 second=2，4 入栈。', '扫描 1 时 1<second。', '此时 1、4、2 构成所需顺序。'], result: 'true' },
    complexity: { time: 'O(n)。', space: 'O(n)。' }, pitfalls: ['必须从右向左扫描。', '比较均为严格不等，等值不能成立。'], related: ['单调栈', '三元组模式'],
  },
  503: {
    id: 503, title: '下一个更大元素 II', summary: '在循环数组中为每个位置寻找右侧第一个更大值，通过扫描两遍下标模拟环。',
    constraints: ['数组首尾相连，但每个位置最多绕一圈。', '必须寻找严格更大的元素。'],
    examples: [{ input: 'nums = [1,2,1]', output: '[2,-1,2]', explanation: '末尾的 1 绕回开头后遇到 2。' }],
    intuition: '单调栈保存尚未找到答案的下标；第二遍只负责补答案，不再加入新下标即可避免重复。',
    bruteForce: '每个位置向后循环检查最多 n-1 个元素，总时间 O(n²)。',
    approach: ['答案初始化为 -1。', '栈保存第一遍中未解决的下标。', '遍历 0 到 2n-1，并用 i%n 取当前位置。', '当前值更大时持续弹栈并填写答案。', '只在 i<n 的第一遍把下标压栈。'],
    code: `from typing import List

class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        n = len(nums)
        answer = [-1] * n
        stack = []
        for i in range(2 * n):
            j = i % n
            while stack and nums[stack[-1]] < nums[j]:
                answer[stack.pop()] = nums[j]
            if i < n:
                stack.append(j)
        return answer`,
    walkthrough: { input: '[1,2,1]', steps: ['下标 0 入栈。', '值 2 弹出下标 0，答案为 2，再压入下标 1。', '末尾 1 入栈，第一遍结束。', '第二遍绕回值 2，解决末尾下标；下标 1 无答案。'], result: '[2,-1,2]' },
    complexity: { time: 'O(n)。', space: 'O(n)。' }, pitfalls: ['第二遍不要再次压栈。', '相等元素不是更大元素，不能弹出。'], related: ['循环数组', '单调栈'],
  },
  496: {
    id: 496, title: '下一个更大元素 I', summary: '预处理 nums2 中每个值右侧首个更大值，再按 nums1 查询。',
    constraints: ['nums1 的元素均出现在 nums2 中。', 'nums2 元素互不相同，因此可直接以值作为映射键。'],
    examples: [{ input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]', output: '[-1,3,-1]', explanation: '1 的右侧首个更大值是 3，4 和 2 均没有。' }],
    intuition: '递减栈中的值都在等待更大元素；当前值一旦更大，就同时成为被弹出元素的第一个更大值。',
    bruteForce: '对 nums1 每个值在 nums2 中定位并向右扫描，最坏 O(mn)。',
    approach: ['创建递减栈和答案映射。', '从左到右扫描 nums2。', '当前值大于栈顶时弹出栈顶。', '记录被弹值的下一个更大元素为当前值。', '将当前值入栈，最后按 nums1 查询，缺省为 -1。'],
    code: `from typing import List

class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        stack = []
        greater = {}
        for value in nums2:
            while stack and stack[-1] < value:
                greater[stack.pop()] = value
            stack.append(value)
        return [greater.get(value, -1) for value in nums1]`,
    walkthrough: { input: 'nums1=[2,1], nums2=[2,3,1]', steps: ['2 入栈等待。', '3 使 2 出栈并映射到 3。', '3 与随后 1 留在栈中。', '查询 2 得 3，查询 1 缺省得 -1。'], result: '[3,-1]' },
    complexity: { time: 'O(n+m)。', space: 'O(n)。' }, pitfalls: ['映射键依赖 nums2 值唯一这一条件。', '栈中未弹出的元素答案应为 -1。'], related: ['下一个更大元素 II', '单调栈映射'],
  },
  85: {
    id: 85, title: '最大矩形', summary: '逐行把二进制矩阵累积成柱状图，并对每行用单调栈求最大矩形。',
    constraints: ['矩阵元素是字符 0 或 1。', '矩形边必须与矩阵边界平行且全部由 1 构成。'],
    examples: [{ input: 'matrix = [["1","0","1"],["1","1","1"]]', output: '3', explanation: '第二行三个连续的 1 构成面积为 3 的矩形。' }],
    intuition: '以当前行为底时，每列连续 1 的高度构成柱状图；所有矩形都会在其最底行被计算一次。',
    bruteForce: '枚举矩形四条边并检查内部是否全 1，复杂度可达 O(m³n³)。',
    approach: ['维护每列连续 1 的高度数组。', '扫描一行，遇 1 加一，遇 0 清零。', '在高度末尾临时加 0 作为哨兵。', '递增栈遇更矮柱时弹出并计算以该柱为最矮高度的面积。', '逐行更新全局最大面积。'],
    code: `from typing import List

class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        if not matrix:
            return 0
        heights = [0] * len(matrix[0])
        best = 0
        for row in matrix:
            for c, value in enumerate(row):
                heights[c] = heights[c] + 1 if value == '1' else 0
            stack = [-1]
            for i, height in enumerate(heights + [0]):
                while stack[-1] != -1 and heights[stack[-1]] > height:
                    h = heights[stack.pop()]
                    best = max(best, h * (i - stack[-1] - 1))
                stack.append(i)
        return best`,
    walkthrough: { input: '[[1,0,1],[1,1,1]]', steps: ['首行高度为 [1,0,1]，最大面积 1。', '第二行更新为 [2,1,2]。', '末尾哨兵触发弹出右侧高度 2。', '继续弹出高度 1，宽度 3，面积更新为 3。'], result: '3' },
    complexity: { time: 'O(mn)。', space: 'O(n)。' }, pitfalls: ['输入元素是字符串，应与字符 1 比较。', '宽度公式是 i-stack[-1]-1。'], related: ['柱状图最大矩形', '单调栈'],
  },
  901: {
    id: 901, title: '股票价格跨度', summary: '在线返回截至今日连续不高于当前价格的天数，用栈压缩被当前价格覆盖的历史区间。',
    constraints: ['每次 next 调用代表新的一天。', '跨度包含当天，并在首个更高历史价格处停止。'],
    examples: [{ input: 'next(100), next(80), next(60), next(70), next(60), next(75), next(85)', output: '[1,1,1,2,1,4,6]', explanation: '价格 75 向前覆盖 60、70、60 对应的连续区间，共跨度 4。' }],
    intuition: '栈中保存严格递减价格及其已合并跨度；当前价格不小时，弹出并直接累加整段跨度。',
    bruteForce: '保存全部价格，每次从末尾向前逐日比较，连续上涨时总成本 O(n²)。',
    approach: ['构造函数创建空栈。', 'next 开始令当前跨度为 1。', '当栈顶价格不高于当前价格时弹出。', '把弹出项已聚合的跨度加到当前跨度。', '压入当前价格与跨度并返回跨度。'],
    code: `class StockSpanner:
    def __init__(self):
        self.stack = []

    def next(self, price: int) -> int:
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`,
    walkthrough: { input: 'next(100), next(80), next(90), next(95)', steps: ['100 入栈，跨度 1。', '80 小于栈顶，跨度 1。', '90 弹出 80，跨度合并为 2。', '95 弹出 90 代表的两天，但停在 100，跨度 3。'], result: '[1,1,2,3]' },
    complexity: { time: '每次均摊 O(1)，每项至多进出栈一次。', space: 'O(n)。' }, pitfalls: ['相等价格也应被当前天覆盖。', '栈中必须存聚合跨度而不只是价格。'], related: ['在线算法', '单调栈压缩'],
  },
  232: {
    id: 232, title: '用栈实现队列', summary: '仅用栈实现先进先出队列，以输入栈接收新元素、输出栈提供最早元素。',
    constraints: ['只能使用栈的标准操作。', 'pop 与 peek 调用时队列保证非空。'],
    examples: [{ input: 'push(1), push(2), peek(), pop(), empty()', output: '[null,null,1,1,false]', explanation: '先进入的 1 位于队首并最先弹出。' }],
    intuition: '把输入栈整体倒入输出栈会反转顺序；只在输出栈为空时搬运，可让每个元素最多搬一次。',
    bruteForce: '每次 push 都把已有元素来回搬移以维持队首在栈顶，单次入队 O(n)。',
    approach: ['构造输入栈和输出栈。', 'push 只压入输入栈。', '需要队首时检查输出栈。', '若输出栈为空，将输入栈逐个弹入输出栈。', 'peek 查看输出栈顶，pop 弹出，empty 检查两栈。'],
    code: `class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x: int) -> None:
        self.in_stack.append(x)

    def _move(self) -> None:
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def pop(self) -> int:
        self._move()
        return self.out_stack.pop()

    def peek(self) -> int:
        self._move()
        return self.out_stack[-1]

    def empty(self) -> bool:
        return not self.in_stack and not self.out_stack`,
    walkthrough: { input: 'push(1), push(2), pop(), push(3), peek()', steps: ['1、2 依次进入输入栈。', '首次 pop 时整体倒入输出栈，弹出 1。', '3 进入输入栈，不影响输出栈中的 2。', 'peek 直接看到输出栈顶 2。'], result: 'pop 返回 1，peek 返回 2。' },
    complexity: { time: 'push O(1)，pop/peek 均摊 O(1)。', space: 'O(n)。' }, pitfalls: ['输出栈非空时不能再次搬运，否则破坏顺序。', 'empty 要同时检查两个栈。'], related: ['双栈摊还分析', '队列设计'],
  },
  225: {
    id: 225, title: '用队列实现栈', summary: '仅用队列实现后进先出栈，每次入栈后旋转队列使新元素位于队首。',
    constraints: ['只能使用队列的标准操作。', 'pop 与 top 调用时栈保证非空。'],
    examples: [{ input: 'push(1), push(2), top(), pop(), empty()', output: '[null,null,2,2,false]', explanation: '最后压入的 2 被旋转到队首。' }],
    intuition: '入队后把此前所有元素依次移到队尾，新元素就成为队首，于是出队等价于出栈。',
    bruteForce: '用两个队列在每次 pop 时搬移 n-1 个元素，弹栈为 O(n)。',
    approach: ['构造一个双端队列但只按普通队列方式使用。', 'push 时先把元素加入队尾。', '将加入前的所有元素逐个从队首移到队尾。', 'pop 直接弹出队首。', 'top 查看队首，empty 判断队列是否为空。'],
    code: `from collections import deque

class MyStack:
    def __init__(self):
        self.queue = deque()

    def push(self, x: int) -> None:
        self.queue.append(x)
        for _ in range(len(self.queue) - 1):
            self.queue.append(self.queue.popleft())

    def pop(self) -> int:
        return self.queue.popleft()

    def top(self) -> int:
        return self.queue[0]

    def empty(self) -> bool:
        return not self.queue`,
    walkthrough: { input: 'push(1), push(2), push(3), pop()', steps: ['push 1 后队列为 [1]。', 'push 2 后旋转为 [2,1]。', 'push 3 后旋转旧元素为 [3,2,1]。', '从队首弹出 3。'], result: '3' },
    complexity: { time: 'push O(n)，pop/top/empty O(1)。', space: 'O(n)。' }, pitfalls: ['旋转次数应是入队前元素数。', '实现约束下不要从队尾直接弹出。'], related: ['队列旋转', '栈设计'],
  },
  622: {
    id: 622, title: '设计循环队列', summary: '用固定数组和环形下标实现容量受限的先进先出队列。',
    constraints: ['容量 k 在构造时确定，不能动态扩容。', '满队列入队和空队列出队都返回 false。'],
    examples: [{ input: 'MyCircularQueue(3), enQueue(1), enQueue(2), enQueue(3), enQueue(4), Rear()', output: '[null,true,true,true,false,3]', explanation: '前三项占满容量，第四次入队失败，队尾仍为 3。' }],
    intuition: '数组位置可通过取模循环复用；额外维护 size 能明确区分 head==tail 时究竟为空还是已满。',
    bruteForce: '用普通数组在每次出队时删除首项并搬移其余元素，出队 O(k)。',
    approach: ['保存长度 k 的数组、队首下标 head 和元素数 size。', '入队写入 (head+size)%k 并增加 size。', '出队令 head=(head+1)%k 并减少 size。', 'Front 读取 data[head]。', 'Rear 读取 data[(head+size-1)%k]，并用 size 判断空满。'],
    code: `class MyCircularQueue:
    def __init__(self, k: int):
        self.data = [0] * k
        self.capacity = k
        self.head = 0
        self.size = 0

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        self.data[(self.head + self.size) % self.capacity] = value
        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self.head = (self.head + 1) % self.capacity
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.data[self.head]

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.data[(self.head + self.size - 1) % self.capacity]

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == self.capacity`,
    walkthrough: { input: 'k=2; enQueue(7), enQueue(8), deQueue(), enQueue(9)', steps: ['7 写入下标 0。', '8 写入下标 1，队列满。', '出队后 head 移到 1。', '9 通过取模写回下标 0。'], result: 'Front=8，Rear=9。' },
    complexity: { time: '所有操作 O(1)。', space: 'O(k)。' }, pitfalls: ['Rear 下标要减一再取模。', '只用首尾下标而无 size 时难以区分空和满。'], related: ['环形缓冲区', '取模下标'],
  },
  641: {
    id: 641, title: '设计循环双端队列', summary: '在固定环形数组两端都支持常数时间插入删除，并提供首尾查询。',
    constraints: ['容量固定，满时插入失败。', '空时删除失败且首尾查询返回 -1。'],
    examples: [{ input: 'MyCircularDeque(3), insertLast(1), insertLast(2), insertFront(3), getRear()', output: '[null,true,true,true,2]', explanation: '逻辑次序为 [3,1,2]，队尾是 2。' }],
    intuition: '令 front 始终指向逻辑首元素，size 决定尾元素和下一个尾插位置；两端移动都用取模完成。',
    bruteForce: '普通数组在首端插入或删除会搬移全部元素，最坏 O(k)。',
    approach: ['保存数组、容量、front 和 size。', '首插先将 front 向前环移再写值。', '尾插写入 (front+size)%k。', '首删将 front 向后环移，尾删只减少 size。', '用 front 与 size 计算首尾值并判断空满。'],
    code: `class MyCircularDeque:
    def __init__(self, k: int):
        self.data = [0] * k
        self.capacity = k
        self.front = 0
        self.size = 0

    def insertFront(self, value: int) -> bool:
        if self.isFull(): return False
        self.front = (self.front - 1) % self.capacity
        self.data[self.front] = value
        self.size += 1
        return True

    def insertLast(self, value: int) -> bool:
        if self.isFull(): return False
        self.data[(self.front + self.size) % self.capacity] = value
        self.size += 1
        return True

    def deleteFront(self) -> bool:
        if self.isEmpty(): return False
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return True

    def deleteLast(self) -> bool:
        if self.isEmpty(): return False
        self.size -= 1
        return True

    def getFront(self) -> int:
        return -1 if self.isEmpty() else self.data[self.front]

    def getRear(self) -> int:
        return -1 if self.isEmpty() else self.data[(self.front + self.size - 1) % self.capacity]

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == self.capacity`,
    walkthrough: { input: 'k=3; insertLast(1), insertFront(2), deleteLast(), insertFront(3)', steps: ['尾插 1 到下标 0。', 'front 环移到下标 2 并写入 2。', '尾删移除逻辑末尾 1。', '再次首插，front 环移并写入 3。'], result: '逻辑队列为 [3,2]。' },
    complexity: { time: '所有接口 O(1)。', space: 'O(k)。' }, pitfalls: ['删除尾部无需清值，但必须减少 size。', 'Python 取模可处理负数，其他语言需额外修正。'], related: ['循环队列', '双端队列'],
  },
  705: {
    id: 705, title: '设计哈希集合', summary: '不使用内建哈希集合实现整数集合，用固定桶数组和链式桶处理冲突。',
    constraints: ['同一键重复加入不应产生重复项。', '删除不存在的键不改变集合。'],
    examples: [{ input: 'add(1), add(2), contains(1), contains(3), remove(2), contains(2)', output: '[null,null,true,false,null,false]', explanation: '1、2 被加入，删除 2 后查询不到。' }],
    intuition: '哈希把大键空间映射到有限桶；同桶冲突的键保存在小列表中，再做局部查找。',
    bruteForce: '把所有键放在一个列表中，每次查询和删除都线性扫描全部元素。',
    approach: ['构造固定数量的空桶。', '用 key % bucket_count 选择桶。', 'add 先检查桶内是否已有键。', 'remove 在对应桶中定位并删除。', 'contains 只搜索目标桶并返回结果。'],
    code: `class MyHashSet:
    def __init__(self):
        self.count = 769
        self.buckets = [[] for _ in range(self.count)]

    def add(self, key: int) -> None:
        bucket = self.buckets[key % self.count]
        if key not in bucket:
            bucket.append(key)

    def remove(self, key: int) -> None:
        bucket = self.buckets[key % self.count]
        if key in bucket:
            bucket.remove(key)

    def contains(self, key: int) -> bool:
        return key in self.buckets[key % self.count]`,
    walkthrough: { input: 'add(1), add(770), contains(770), remove(1)', steps: ['1 映射到桶 1。', '770 也映射到桶 1，形成冲突链。', '桶内扫描仍找到 770。', '删除 1 后 770 仍保留。'], result: 'contains(770) 为 true。' },
    complexity: { time: '平均 O(1)，最坏 O(n)。', space: 'O(n+B)，B 为桶数。' }, pitfalls: ['add 必须去重。', '哈希冲突不能直接覆盖旧键。'], related: ['链地址法', '哈希函数'],
  },
  706: {
    id: 706, title: '设计哈希映射', summary: '实现整数键值映射，用桶数组保存键值对并在冲突桶内更新或查找。',
    constraints: ['put 已存在键时覆盖旧值。', 'get 缺失键返回 -1，remove 缺失键无操作。'],
    examples: [{ input: 'put(1,1), put(2,2), get(1), get(3), put(2,1), get(2)', output: '[null,null,1,-1,null,1]', explanation: '键 2 的第二次 put 将值从 2 更新为 1。' }],
    intuition: '桶号只缩小搜索范围，真正身份仍由完整 key 决定；冲突桶保存多个 [key,value] 对。',
    bruteForce: '用单一键值对列表实现，每个接口都可能遍历全部记录。',
    approach: ['初始化若干空桶。', '按 key 取模选择桶。', 'put 扫描桶，命中键则改值，否则追加新对。', 'get 扫描桶并返回匹配值。', 'remove 定位匹配项后从桶中删除。'],
    code: `class MyHashMap:
    def __init__(self):
        self.count = 769
        self.buckets = [[] for _ in range(self.count)]

    def put(self, key: int, value: int) -> None:
        bucket = self.buckets[key % self.count]
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])

    def get(self, key: int) -> int:
        for stored_key, value in self.buckets[key % self.count]:
            if stored_key == key:
                return value
        return -1

    def remove(self, key: int) -> None:
        bucket = self.buckets[key % self.count]
        for i, pair in enumerate(bucket):
            if pair[0] == key:
                bucket.pop(i)
                return`,
    walkthrough: { input: 'put(1,5), put(770,8), put(1,6), get(770)', steps: ['键 1 写入桶 1。', '键 770 冲突并追加在同桶。', '再次 put(1) 找到原对并更新为 6。', '查询 770 按完整键匹配到值 8。'], result: '8' },
    complexity: { time: '平均 O(1)，最坏 O(n)。', space: 'O(n+B)。' }, pitfalls: ['更新时比较完整 key，不能只看桶号。', 'put 命中后应返回，避免重复追加。'], related: ['设计哈希集合', '链地址冲突'],
  },
  460: {
    id: 460, title: 'LFU 缓存', summary: '实现常数平均时间的最不经常使用缓存；频率相同则淘汰最久未使用项。',
    constraints: ['get 命中与 put 更新都会增加访问频率。', '容量为 0 时任何 put 都不保存数据。'],
    examples: [{ input: 'LFUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2), get(3)', output: '[null,null,null,1,null,-1,3]', explanation: '访问 1 后键 2 频率最低，插入 3 时被淘汰。' }],
    intuition: '键表负责 O(1) 定位值与频率，频率到有序键集合的表负责在最低频率中淘汰最旧键。',
    bruteForce: '每次淘汰扫描所有键找最低频率和最早时间，单次 put 为 O(n)。',
    approach: ['保存 key→[value,freq]，以及 freq→OrderedDict(keys)。', '维护当前最小频率 min_freq。', '访问键时从旧频率桶删除并加入下一频率桶末尾。', '旧桶若为空且等于 min_freq，则递增 min_freq。', '容量满时从 min_freq 桶首淘汰；新键放入频率 1 桶。'],
    code: `from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.items = {}
        self.groups = defaultdict(OrderedDict)
        self.min_freq = 0

    def _touch(self, key):
        value, freq = self.items[key]
        del self.groups[freq][key]
        if not self.groups[freq]:
            del self.groups[freq]
            if self.min_freq == freq:
                self.min_freq += 1
        self.items[key] = (value, freq + 1)
        self.groups[freq + 1][key] = None

    def get(self, key: int) -> int:
        if key not in self.items:
            return -1
        self._touch(key)
        return self.items[key][0]

    def put(self, key: int, value: int) -> None:
        if self.capacity == 0:
            return
        if key in self.items:
            self.items[key] = (value, self.items[key][1])
            self._touch(key)
            return
        if len(self.items) == self.capacity:
            old_key, _ = self.groups[self.min_freq].popitem(last=False)
            del self.items[old_key]
            if not self.groups[self.min_freq]:
                del self.groups[self.min_freq]
        self.items[key] = (value, 1)
        self.groups[1][key] = None
        self.min_freq = 1`,
    walkthrough: { input: 'capacity=2; put(1,1), put(2,2), get(1), put(3,3)', steps: ['键 1、2 都进入频率 1 桶。', 'get(1) 将键 1 移到频率 2 桶。', '插入 3 前容量已满，最低频率仍为 1。', '频率 1 桶最旧的键 2 被淘汰，键 3 入桶。'], result: '缓存含键 1 和 3。' },
    complexity: { time: 'get 与 put 平均 O(1)。', space: 'O(capacity)。' }, pitfalls: ['更新已有键也算一次访问。', '同频率必须按最近使用顺序淘汰最旧项。'], related: ['LRU 缓存', '频率分桶'],
  },
  341: {
    id: 341, title: '扁平化嵌套列表迭代器', summary: '惰性展开嵌套整数列表，让 next 与 hasNext 按从左到右顺序访问所有整数。',
    constraints: ['嵌套元素由平台 NestedInteger 提供。', 'next 只会在 hasNext 确认为真时调用。'],
    examples: [{ input: 'nestedList = [[1,1],2,[1,1]]', output: '[1,1,2,1,1]', explanation: '保持嵌套列表从左到右的深度优先顺序。' }],
    intuition: '栈顶应始终是下一个待处理元素；遇到列表时逆序压入其孩子，就能让最左孩子先被处理。',
    bruteForce: '构造时递归展开全部整数，简单但即使只读取前几个也会占用 O(n) 时间空间。',
    approach: ['构造时把顶层元素逆序压栈。', 'hasNext 检查栈顶。', '若栈顶是整数则返回 true。', '若是列表则弹出并将其子项逆序压栈。', 'next 调用 hasNext 后弹出整数并返回。'],
    code: `class NestedIterator:
    def __init__(self, nestedList):
        self.stack = list(reversed(nestedList))

    def next(self) -> int:
        self.hasNext()
        return self.stack.pop().getInteger()

    def hasNext(self) -> bool:
        while self.stack:
            top = self.stack[-1]
            if top.isInteger():
                return True
            self.stack.pop()
            self.stack.extend(reversed(top.getList()))
        return False`,
    walkthrough: { input: '[[1,[2]],3]', steps: ['顶层逆序入栈，左侧列表在栈顶。', 'hasNext 展开该列表，整数 1 到栈顶。', '取出 1 后继续展开内部 [2]。', '依次取出 2，最后处理顶层整数 3。'], result: '[1,2,3]' },
    complexity: { time: '所有调用总计 O(N)，单次 next 均摊 O(1)。', space: 'O(d+w)，保存尚未访问的嵌套项。' }, pitfalls: ['子列表必须逆序压栈以保持原顺序。', 'hasNext 需要持续展开直到栈顶为整数或栈空。'], related: ['惰性迭代器', '显式 DFS 栈'],
  },
  284: {
    id: 284, title: '顶端迭代器', summary: '包装已有迭代器并增加 peek，使查看下一个元素不会推进底层迭代器。',
    constraints: ['底层 Iterator 由平台提供。', 'peek 与 next 仅在仍有元素时调用。'],
    examples: [{ input: 'iterator=[1,2,3]; peek(), next(), next(), peek()', output: '[1,1,2,3]', explanation: '第一次 peek 缓存 1，随后 next 返回同一个 1。' }],
    intuition: '维护一个单元素前瞻缓存：peek 只读缓存，next 返回缓存后再从底层取一个补上。',
    bruteForce: '每次 peek 都调用底层 next 会丢失元素，除非另建完整剩余序列，浪费 O(n) 空间。',
    approach: ['构造时保存底层迭代器。', '若底层有元素，预取一个到缓存。', 'peek 直接返回缓存。', 'next 保存当前缓存，再从底层补充或置空。', 'hasNext 判断缓存是否非空。'],
    code: `class PeekingIterator:
    def __init__(self, iterator):
        self.iterator = iterator
        self.peeked = iterator.next() if iterator.hasNext() else None

    def peek(self):
        return self.peeked

    def next(self):
        value = self.peeked
        self.peeked = self.iterator.next() if self.iterator.hasNext() else None
        return value

    def hasNext(self):
        return self.peeked is not None`,
    walkthrough: { input: '[4,5]; peek(), peek(), next(), hasNext()', steps: ['构造时预取 4。', '第一次 peek 返回缓存 4。', '第二次 peek 仍返回 4，底层未推进。', 'next 返回 4 并把 5 预取到缓存。'], result: '[4,4,4,true]' },
    complexity: { time: '每个接口 O(1)。', space: 'O(1)。' }, pitfalls: ['peek 不能推进底层迭代器。', '本题元素范围不含 None，才能用 None 表示缓存空。'], related: ['迭代器装饰器', '单元素缓存'],
  },
  297: {
    id: 297, title: '二叉树的序列化与反序列化', summary: '把任意二叉树编码为可逆字符串，并从字符串精确恢复结构和值，采用带空标记的前序遍历。',
    constraints: ['节点值可为负数。', '编码必须保留空孩子位置，否则无法区分不同结构。'],
    examples: [{ input: 'root = [1,2,3,null,null,4,5]', output: '反序列化后结构相同', explanation: '前序值配合 # 空标记能唯一确定每个左右孩子。' }],
    intuition: '前序先给出根，随后左右子树紧随其后；为空时写入哨兵，就能递归无歧义消费 token。',
    bruteForce: '只保存前序节点值会丢失空位，多棵不同结构可能得到相同序列。',
    approach: ['serialize 以前序递归访问节点。', '空节点追加 #，非空追加其值。', '用逗号连接所有 token。', 'deserialize 创建 token 迭代器。', '递归读取：# 返回 None，否则建节点并依次恢复左右子树。'],
    code: `class Codec:
    def serialize(self, root):
        tokens = []
        def dfs(node):
            if not node:
                tokens.append('#')
                return
            tokens.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ','.join(tokens)

    def deserialize(self, data):
        values = iter(data.split(','))
        def build():
            value = next(values)
            if value == '#':
                return None
            node = TreeNode(int(value))
            node.left = build()
            node.right = build()
            return node
        return build()`,
    walkthrough: { input: 'root=[1,null,2]', steps: ['序列化根 1。', '左孩子为空，写入 #。', '右孩子写 2，其两个空孩子各写 #。', '反序列化按相同顺序消费并连接节点。'], result: '编码为 1,#,2,#,#，恢复原树。' },
    complexity: { time: '序列化与反序列化均 O(n)。', space: 'O(n)，token 与递归栈。' }, pitfalls: ['必须记录空节点。', '反序列化负数时应使用 int 转换。'], related: ['前序遍历', '树结构编码'],
  },
  449: {
    id: 449, title: '序列化和反序列化二叉搜索树', summary: '利用二叉搜索树的大小关系，仅保存前序值即可紧凑地恢复整棵树。',
    constraints: ['树中节点值互不相同。', '恢复结果必须保持原 BST 的结构和值。'],
    examples: [{ input: 'root = [2,1,3]', output: '"2 1 3"', explanation: '前序序列配合上下界可判定 1 属于左子树、3 属于右子树。' }],
    intuition: '前序首项是根；后续值是否属于当前子树可由祖先传下的开区间判断，无需显式空标记。',
    bruteForce: '沿用普通二叉树的空标记编码虽可行，但会额外保存大量 #，未利用 BST 性质。',
    approach: ['序列化时收集前序遍历值。', '反序列化维护数组下标。', 'build(low,high) 查看下一个值。', '若值不在边界内则该子树为空且不消费。', '消费合法值建根，再以收紧边界递归建左右子树。'],
    code: `class Codec:
    def serialize(self, root):
        values = []
        def preorder(node):
            if node:
                values.append(str(node.val))
                preorder(node.left)
                preorder(node.right)
        preorder(root)
        return ' '.join(values)

    def deserialize(self, data):
        values = list(map(int, data.split())) if data else []
        index = 0
        def build(low, high):
            nonlocal index
            if index == len(values) or not low < values[index] < high:
                return None
            value = values[index]
            index += 1
            node = TreeNode(value)
            node.left = build(low, value)
            node.right = build(value, high)
            return node
        return build(float('-inf'), float('inf'))`,
    walkthrough: { input: 'BST [4,2,6,1,3]', steps: ['前序得到 4,2,1,3,6。', '4 在无限边界内，成为根。', '左边界 (-∞,4) 依次恢复 2、1、3。', '值 6 越过左子树上界，随后在 (4,∞) 成为右根。'], result: '恢复与原树相同的 BST。' },
    complexity: { time: 'O(n)。', space: 'O(n)，序列与递归栈。' }, pitfalls: ['空字符串要单独处理。', '边界应随左右递归正确收紧。'], related: ['BST 前序恢复', '上下界递归'],
  },
  116: {
    id: 116, title: '填充每个节点的下一个右侧节点指针', summary: '在完美二叉树中连接每层相邻节点，利用上一层已建立的 next 链以常数额外空间推进。',
    constraints: ['输入是完美二叉树，每个内部节点都有两个孩子且叶子同层。', '每层最右节点的 next 应为 null。'],
    examples: [{ input: 'root = [1,2,3,4,5,6,7]', output: '层连接为 1#2→3#4→5→6→7#', explanation: '同一深度从左到右相连，# 表示层尾。' }],
    intuition: '父层已经横向连接后，既能连接同一父亲的左右孩子，也能通过 parent.next 连接跨父亲的两个孩子。',
    bruteForce: '层序遍历用队列逐层连接，时间 O(n) 但额外空间 O(n)。',
    approach: ['从根作为当前层最左节点开始。', '只要当前层还有孩子就遍历该层 next 链。', '连接 parent.left.next 到 parent.right。', '若 parent.next 存在，再连接 parent.right.next 到 parent.next.left。', '层遍历完后下降到 leftmost.left。'],
    code: `from typing import Optional

class Solution:
    def connect(self, root: Optional[Node]) -> Optional[Node]:
        leftmost = root
        while leftmost and leftmost.left:
            parent = leftmost
            while parent:
                parent.left.next = parent.right
                if parent.next:
                    parent.right.next = parent.next.left
                parent = parent.next
            leftmost = leftmost.left
        return root`,
    walkthrough: { input: '完美树 [1,2,3,4,5,6,7]', steps: ['在根层连接 2.next=3。', '下降到节点 2 所在层。', '连接 4→5 与 6→7。', '借助 2.next=3 跨父节点连接 5→6。'], result: '第二层与第三层均完整横向连接。' },
    complexity: { time: 'O(n)。', space: 'O(1)。' }, pitfalls: ['该常数空间写法依赖完美二叉树。', '跨父节点连接前要检查 parent.next。'], related: ['层序遍历', '利用已建链表'],
  },
  109: {
    id: 109, title: '有序链表转换二叉搜索树', summary: '把升序链表转换为高度平衡 BST，用中序构造让链表指针只向前移动。',
    constraints: ['链表按严格升序排列。', '结果需高度平衡，不要求结构唯一。'],
    examples: [{ input: 'head = [-10,-3,0,5,9]', output: '一种平衡 BST 为 [0,-3,9,-10,null,5]', explanation: '中序遍历仍为原升序序列，左右高度差不超过 1。' }],
    intuition: '平衡树的中序访问顺序与链表顺序相同；先按节点数递归构造左半，再用当前链表节点作根即可避免随机访问。',
    bruteForce: '每层用快慢指针寻找链表中点，会重复扫描子链表，总时间 O(n log n)。',
    approach: ['先遍历链表得到总长度 n。', '维护全局前进指针 current。', 'build(size) 递归构造 size//2 个节点的左树。', '用 current.val 创建根并推进 current。', '用剩余节点数构造右树并返回根。'],
    code: `from typing import Optional

class Solution:
    def sortedListToBST(self, head: Optional[ListNode]) -> Optional[TreeNode]:
        length, node = 0, head
        while node:
            length += 1
            node = node.next
        current = head
        def build(size):
            nonlocal current
            if size <= 0:
                return None
            left = build(size // 2)
            root = TreeNode(current.val)
            current = current.next
            root.left = left
            root.right = build(size - size // 2 - 1)
            return root
        return build(length)`,
    walkthrough: { input: '[-1,0,2]', steps: ['统计长度为 3。', '先构造大小 1 的左树，取 -1。', '随后链表指向 0，用 0 建根。', '剩余大小 1 的右树取 2。'], result: '根 0，左右孩子分别为 -1 和 2。' },
    complexity: { time: 'O(n)。', space: 'O(log n)，平衡递归栈。' }, pitfalls: ['根建立前不能提前推进链表指针。', '右子树大小要扣除左树和根。'], related: ['中序模拟', '平衡 BST 构造'],
  },
  110: {
    id: 110, title: '平衡二叉树', summary: '判断每个节点两侧高度差是否不超过 1，用后序遍历同时计算高度并提前传播失衡。',
    constraints: ['空树视为平衡。', '平衡条件必须在树中每个节点都成立。'],
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: 'true', explanation: '每个节点的左右子树高度差都不超过 1。' }],
    intuition: '父节点判断需要左右高度，因此后序最自然；以 -1 作为失衡哨兵，可避免另一次遍历。',
    bruteForce: '对每个节点分别递归计算左右高度，会反复访问后代，退化链上达到 O(n²)。',
    approach: ['定义 height 返回子树高度或 -1。', '空节点高度为 0。', '先递归求左高度，若 -1 立即传播。', '再求右高度并检查哨兵及高度差。', '合法则返回 1+较大高度；根结果非 -1 即平衡。'],
    code: `from typing import Optional

class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def height(node):
            if not node:
                return 0
            left = height(node.left)
            if left == -1:
                return -1
            right = height(node.right)
            if right == -1 or abs(left - right) > 1:
                return -1
            return max(left, right) + 1
        return height(root) != -1`,
    walkthrough: { input: '链状树 1→2→3', steps: ['叶子 3 返回高度 1。', '节点 2 两侧差 1，返回高度 2。', '节点 1 左右高度差达到 2。', '节点 1 返回 -1，最终判定失衡。'], result: 'false' },
    complexity: { time: 'O(n)。', space: 'O(h)。' }, pitfalls: ['只检查根的高度差不够。', '发现子树 -1 后应立即向上传播。'], related: ['树高', '后序剪枝'],
  },
  111: {
    id: 111, title: '二叉树的最小深度', summary: '寻找根到最近叶子的节点数，用广度优先搜索在首次遇到叶子时结束。',
    constraints: ['空树深度为 0。', '叶子必须左右孩子都为空，单边空不能作为路径终点。'],
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '2', explanation: '根 3 到叶子 9 只有两层。' }],
    intuition: 'BFS 按深度递增访问，首个真正叶子必然位于最浅层。',
    bruteForce: '枚举所有根到叶路径再取最短，仍可 O(n)，但无法在发现浅叶时提前停止。',
    approach: ['空根直接返回 0。', '队列放入根和深度 1。', '每次取出队首节点。', '若左右孩子均空，立即返回当前深度。', '把存在的孩子以 depth+1 入队。'],
    code: `from typing import Optional
from collections import deque

class Solution:
    def minDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        queue = deque([(root, 1)])
        while queue:
            node, depth = queue.popleft()
            if not node.left and not node.right:
                return depth
            if node.left:
                queue.append((node.left, depth + 1))
            if node.right:
                queue.append((node.right, depth + 1))`,
    walkthrough: { input: '[1,2,3,4]', steps: ['根 1 以深度 1 入队。', '根不是叶子，节点 2、3 以深度 2 入队。', '节点 2 还有孩子 4，不是叶子。', '节点 3 无孩子，是首个叶子。'], result: '2' },
    complexity: { time: '最坏 O(n)，浅叶时可提前结束。', space: 'O(w)，w 为最大层宽。' }, pitfalls: ['不能把仅缺一个孩子的节点当叶子。', 'DFS 写 min 时要特别处理单孩子节点。'], related: ['层序遍历', '最短无权路径'],
  },
  113: {
    id: 113, title: '路径总和 II', summary: '找出所有根到叶且节点和等于目标值的路径，用 DFS 回溯维护当前路径。',
    constraints: ['路径必须从根开始并在叶子结束。', '节点值可为负数，不能因当前和超过目标而剪枝。'],
    examples: [{ input: 'root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22', output: '[[5,4,11,2],[5,8,4,5]]', explanation: '两条根到叶路径的节点和都为 22。' }],
    intuition: '递归路径天然对应从根到当前节点；进入时加入节点，离开时撤销，就能复用同一列表探索不同分支。',
    bruteForce: '为每个叶子重新从根查找路径与求和，会重复遍历公共前缀。',
    approach: ['维护 path、剩余目标 remain 和结果列表。', '进入节点时把值加入 path 并从 remain 扣除。', '若为叶子且 remain 等于节点值，复制 path 保存。', '递归搜索左右非空孩子。', '返回父层前弹出当前值完成回溯。'],
    code: `from typing import List, Optional

class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
        answer, path = [], []
        def dfs(node, remain):
            if not node:
                return
            path.append(node.val)
            remain -= node.val
            if not node.left and not node.right and remain == 0:
                answer.append(path[:])
            else:
                dfs(node.left, remain)
                dfs(node.right, remain)
            path.pop()
        dfs(root, targetSum)
        return answer`,
    walkthrough: { input: 'root=[1,2,3], target=3', steps: ['路径加入根 1，剩余 2。', '进入左叶 2，剩余变 0。', '复制 [1,2] 到答案并回溯。', '右叶 3 使剩余为 -1，不记录。'], result: '[[1,2]]' },
    complexity: { time: 'O(n+h·p)，复制 p 条路径各需至多 h。', space: 'O(h)，不计输出。' }, pitfalls: ['保存结果时必须复制 path。', '只有叶子才能确认一条完整路径。'], related: ['回溯', '根到叶路径'],
  },
  257: {
    id: 257, title: '二叉树的所有路径', summary: '枚举从根到每个叶子的路径，并按箭头格式输出。',
    constraints: ['空树返回空列表。', '路径终点必须是叶子节点。'],
    examples: [{ input: 'root = [1,2,3,null,5]', output: '["1->2->5","1->3"]', explanation: '树有叶子 5 和 3，对应两条根到叶路径。' }],
    intuition: 'DFS 到达节点时把它追加到路径；只有遇到叶子才把完整序列格式化保存。',
    bruteForce: '对每个叶子向上寻找父节点需要额外父指针或反复从根搜索。',
    approach: ['结果初始化为空。', 'DFS 接收当前节点和已走过的值列表。', '创建包含当前值的新路径。', '若当前是叶子，用箭头连接并保存。', '否则把新路径分别传给存在的左右孩子。'],
    code: `from typing import List, Optional

class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        answer = []
        def dfs(node, path):
            if not node:
                return
            path.append(str(node.val))
            if not node.left and not node.right:
                answer.append('->'.join(path))
            else:
                dfs(node.left, path)
                dfs(node.right, path)
            path.pop()
        dfs(root, [])
        return answer`,
    walkthrough: { input: '[1,2,3,null,5]', steps: ['从根建立路径 [1]。', '向左到 2，再到叶子 5。', '保存字符串 1->2->5 并逐层回溯。', '转向右叶 3，保存 1->3。'], result: '["1->2->5","1->3"]' },
    complexity: { time: 'O(n+h·L)，L 为叶子数，含字符串构造。', space: 'O(h)，不计输出。' }, pitfalls: ['内部节点不能提前输出路径。', '共享 path 时每次递归返回都要 pop。'], related: ['深度优先搜索', '路径格式化'],
  },
  404: {
    id: 404, title: '左叶子之和', summary: '累加所有作为父节点左孩子的叶子值，递归时携带是否来自左边的信息。',
    constraints: ['左叶子必须同时满足“是左孩子”和“没有孩子”。', '根节点即使是叶子也不算左叶子。'],
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '24', explanation: '左叶子为 9 和 15，和为 24。' }],
    intuition: '节点本身无法判断自己是不是左孩子，因此由父层在递归参数中标记进入方向。',
    bruteForce: '先收集所有叶子，再为每个叶子搜索父节点确认方向，会造成重复遍历。',
    approach: ['定义 dfs(node,is_left)。', '空节点贡献 0。', '若当前为叶子，仅在 is_left 为真时返回节点值。', '递归左孩子时传 true。', '递归右孩子时传 false，并相加两侧结果。'],
    code: `from typing import Optional

class Solution:
    def sumOfLeftLeaves(self, root: Optional[TreeNode]) -> int:
        def dfs(node, is_left):
            if not node:
                return 0
            if not node.left and not node.right:
                return node.val if is_left else 0
            return dfs(node.left, True) + dfs(node.right, False)
        return dfs(root, False)`,
    walkthrough: { input: '[3,9,20,15,7]', steps: ['根以非左孩子身份开始。', '节点 9 是根的左孩子且为叶子，贡献 9。', '节点 15 是 20 的左叶，贡献 15。', '节点 7 是右叶，不贡献。'], result: '24' },
    complexity: { time: 'O(n)。', space: 'O(h)。' }, pitfalls: ['左孩子不一定是左叶子，还要检查其无孩子。', '根叶不能计入答案。'], related: ['树递归参数', '叶子判定'],
  },
  572: {
    id: 572, title: '另一棵树的子树', summary: '判断 subRoot 是否与 root 的某个节点起始子树完全相同，结合候选起点遍历与树相等检查。',
    constraints: ['相同要求结构和值都一致。', '不能只比较某种遍历值序列而忽略空位。'],
    examples: [{ input: 'root = [3,4,5,1,2], subRoot = [4,1,2]', output: 'true', explanation: 'root 的节点 4 所在子树与 subRoot 完全一致。' }],
    intuition: 'root 中每个节点都可能是匹配起点；一旦根值可能匹配，就同步比较两棵子树的左右结构。',
    bruteForce: '对所有节点序列化其完整子树再比较，会反复创建大字符串。',
    approach: ['定义 same(a,b) 判断两棵树完全相同。', '两者都空返回 true，仅一者空返回 false。', '值相等后递归比较左右孩子。', '在 root 上 DFS 每个候选节点。', '当前 same 成功或左右任一候选成功即返回 true。'],
    code: `from typing import Optional

class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        def same(a, b):
            if not a or not b:
                return a is b
            return a.val == b.val and same(a.left, b.left) and same(a.right, b.right)
        if not root:
            return False
        return same(root, subRoot) or self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)`,
    walkthrough: { input: 'root=[3,4,5,1,2], sub=[4,1,2]', steps: ['先比较根 3 与 4，值不同。', '转到 root 左节点 4。', '两个根值相同，继续同步比较左叶 1。', '右叶 2 也相同，所有空孩子对应。'], result: 'true' },
    complexity: { time: '最坏 O(nm)。', space: 'O(h1+h2)，递归栈。' }, pitfalls: ['只匹配值而不匹配空孩子结构会误判。', '候选失败后仍需搜索 root 的其他节点。'], related: ['相同的树', '子树匹配'],
  },
  235: {
    id: 235, title: '二叉搜索树的最近公共祖先', summary: '利用 BST 有序性，从根向下找到 p、q 路径首次分叉或命中之处。',
    constraints: ['p、q 均存在于树中且节点不同。', 'BST 节点值唯一。'],
    examples: [{ input: 'root=[6,2,8,0,4,7,9], p=2, q=8', output: '6', explanation: '2 位于根左侧，8 位于根右侧，根 6 是分叉点。' }],
    intuition: '若 p、q 都小于当前值，祖先必在左树；都大于则在右树；否则当前节点正是最低分叉点。',
    bruteForce: '分别记录根到 p、q 的完整路径，再逐项寻找最后公共节点，需要额外 O(h) 空间。',
    approach: ['从根开始循环。', '若 p.val 与 q.val 都小于当前值，走左孩子。', '若两者都大于当前值，走右孩子。', '否则两条搜索路径在当前节点分叉或其中一个就是当前节点。', '返回当前节点作为最近公共祖先。'],
    code: `from typing import Optional

class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
        node = root
        while node:
            if p.val < node.val and q.val < node.val:
                node = node.left
            elif p.val > node.val and q.val > node.val:
                node = node.right
            else:
                return node`,
    walkthrough: { input: 'root=6, p=2, q=4', steps: ['2 与 4 都小于 6，向左到 2。', '当前节点值等于 p。', '此时 p 不会与 q 同在某个严格子树方向。', '节点 2 是两者最低公共祖先。'], result: '2' },
    complexity: { time: 'O(h)。', space: 'O(1)。' }, pitfalls: ['比较应使用节点值而不是对象顺序。', '当前节点等于 p 或 q 时也可能就是答案。'], related: ['BST 搜索', '最近公共祖先'],
  },
  450: {
    id: 450, title: '删除二叉搜索树中的节点', summary: '在 BST 中删除指定键并保持有序性；双孩子节点用右子树最小值替换后再删除后继。',
    constraints: ['键可能不存在，此时原树保持不变。', '删除后仍需满足严格 BST 次序。'],
    examples: [{ input: 'root=[5,3,6,2,4,null,7], key=3', output: '[5,4,6,2,null,null,7]', explanation: '节点 3 有两个孩子，可用右子树最小节点 4 替换。' }],
    intuition: '搜索阶段由键值决定方向；真正命中后，零或单孩子可直接提升孩子，双孩子则转化为删除后继这一更简单情况。',
    bruteForce: '中序收集除 key 外的所有值再重建 BST，会丢失大部分原结构并使用 O(n) 空间。',
    approach: ['按 key 与 root.val 比较递归搜索。', '键较小时更新 root.left，较大时更新 root.right。', '命中且缺一侧孩子时直接返回另一侧。', '双孩子时找到右子树最左节点作为中序后继。', '用后继值覆盖当前值，再从右子树删除该后继值。'],
    code: `from typing import Optional

class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        if not root:
            return None
        if key < root.val:
            root.left = self.deleteNode(root.left, key)
        elif key > root.val:
            root.right = self.deleteNode(root.right, key)
        else:
            if not root.left:
                return root.right
            if not root.right:
                return root.left
            successor = root.right
            while successor.left:
                successor = successor.left
            root.val = successor.val
            root.right = self.deleteNode(root.right, successor.val)
        return root`,
    walkthrough: { input: 'root=[5,3,6,2,4], key=3', steps: ['3 小于 5，进入左子树。', '命中节点 3，发现有两个孩子。', '右子树最小值为 4，用它覆盖节点值。', '递归删除原右叶 4，并把子树接回根。'], result: '得到 [5,4,6,2]。' },
    complexity: { time: 'O(h)。', space: 'O(h)，递归栈。' }, pitfalls: ['双孩子替换后仍要删除原后继节点。', '递归返回的新子树根必须重新赋给父节点。'], related: ['BST 中序后继', '递归树修改'],
  },
  701: {
    id: 701, title: '二叉搜索树中的插入操作', summary: '沿 BST 搜索路径找到空孩子位置并插入新叶子，保持原有节点结构。',
    constraints: ['待插入值在树中不存在。', '允许返回任意满足插入要求的 BST，但通常保留原结构。'],
    examples: [{ input: 'root=[4,2,7,1,3], val=5', output: '[4,2,7,1,3,5]', explanation: '5 大于 4、小于 7，因此成为 7 的左孩子。' }],
    intuition: 'BST 的比较结果唯一决定下降方向，直到空位置；把新值放在那里不会影响其他节点的有序关系。',
    bruteForce: '收集中序值、加入新值后重建整棵树，需要 O(n) 时间空间且改变全部链接。',
    approach: ['若根为空，直接创建新节点。', '保存根以便最终返回。', '从根开始比较 val 与当前值。', '若应走方向的孩子为空，就在该处创建节点并结束。', '否则沿对应孩子继续下降。'],
    code: `from typing import Optional

class Solution:
    def insertIntoBST(self, root: Optional[TreeNode], val: int) -> TreeNode:
        if not root:
            return TreeNode(val)
        node = root
        while True:
            if val < node.val:
                if not node.left:
                    node.left = TreeNode(val)
                    break
                node = node.left
            else:
                if not node.right:
                    node.right = TreeNode(val)
                    break
                node = node.right
        return root`,
    walkthrough: { input: 'root=[4,2,7], val=5', steps: ['5 与根 4 比较，应向右。', '到节点 7 后 5 更小，应向左。', '7 的左孩子为空。', '创建值 5 的叶子并接到该位置。'], result: '[4,2,7,null,null,5]' },
    complexity: { time: 'O(h)。', space: 'O(1)。' }, pitfalls: ['空树时要返回新节点作为根。', '插入后返回原根，而不是最后访问节点。'], related: ['BST 搜索', '树节点插入'],
  },
  538: {
    id: 538, title: '把二叉搜索树转换为累加树', summary: '把每个节点值改成原树中所有大于等于它的值之和，用反向中序维护累计和。',
    constraints: ['输入满足 BST 有序性。', '每个节点的新值基于所有原始值，而非已改值的重新排序。'],
    examples: [{ input: 'root=[4,1,6,0,2,5,7]', output: '根值变为 22', explanation: '大于等于 4 的原值为 4、5、6、7，总和 22。' }],
    intuition: 'BST 的“右-根-左”顺序按值从大到小访问；当前累计和恰是所有已见更大值与自身之和。',
    bruteForce: '对每个节点重新遍历整棵树累加不小于它的值，时间 O(n²)。',
    approach: ['初始化 running=0。', '递归先访问右子树。', '把当前原值加入 running。', '用 running 覆盖当前节点值。', '再访问左子树并最终返回根。'],
    code: `from typing import Optional

class Solution:
    def convertBST(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        running = 0
        def visit(node):
            nonlocal running
            if not node:
                return
            visit(node.right)
            running += node.val
            node.val = running
            visit(node.left)
        visit(root)
        return root`,
    walkthrough: { input: 'BST [2,1,3]', steps: ['先访问最大节点 3，累计为 3，节点变 3。', '回到根 2，累计变 5，根改为 5。', '最后访问节点 1。', '累计变 6，节点 1 改为 6。'], result: '[5,6,3]' },
    complexity: { time: 'O(n)。', space: 'O(h)。' }, pitfalls: ['遍历顺序必须是右、根、左。', '累计前要读取当前原值，不能重复使用改写后的值。'], related: ['反向中序', '前缀和思想'],
  },
  653: {
    id: 653, title: '两数之和 IV：输入二叉搜索树', summary: '判断 BST 中是否有两个不同节点之和为 k，遍历节点并用集合查询补数。',
    constraints: ['必须使用两个不同节点。', '节点值可为负且互不相同。'],
    examples: [{ input: 'root=[5,3,6,2,4,null,7], k=9', output: 'true', explanation: '节点 2 与 7 的值之和为 9。' }],
    intuition: '每访问值 x，只需知道先前是否见过 k-x；先查询再加入可避免同一节点与自己配对。',
    bruteForce: '枚举任意两个节点并求和，需要 O(n²)。',
    approach: ['创建空集合 seen。', '用 DFS 或栈遍历树。', '访问节点 x 时查询 k-x 是否在 seen。', '命中立即返回 true。', '否则加入 x 并继续左右子树，遍历完返回 false。'],
    code: `from typing import Optional

class Solution:
    def findTarget(self, root: Optional[TreeNode], k: int) -> bool:
        seen = set()
        stack = [root] if root else []
        while stack:
            node = stack.pop()
            if k - node.val in seen:
                return True
            seen.add(node.val)
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        return False`,
    walkthrough: { input: 'root=[5,3,6,2,4,7], k=9', steps: ['访问 5，补数 4 未见，记录 5。', '随后遍历到 6，补数 3 尚未见或按栈顺序继续。', '访问 3 后集合包含 3。', '访问 6 或 4 时可与已见补数配对，返回 true。'], result: 'true' },
    complexity: { time: 'O(n)。', space: 'O(n)。' }, pitfalls: ['必须先查补数再加入当前值。', '不要误以为只能寻找父子节点。'], related: ['两数之和', 'BST 双迭代器'],
  },
  515: {
    id: 515, title: '在每个树行中找最大值', summary: '按层遍历二叉树，为每一层记录最大的节点值。',
    constraints: ['空树返回空数组。', '节点值可能全为负数，层最大值不能初始化为 0。'],
    examples: [{ input: 'root=[1,3,2,5,3,null,9]', output: '[1,3,9]', explanation: '三层最大值分别为 1、3、9。' }],
    intuition: '队列在每轮开始时恰好保存一整层；固定本轮长度即可只比较该层节点。',
    bruteForce: '对每个深度从根重新搜索该层，重复访问上层节点，最坏 O(nh)。',
    approach: ['根非空时加入队列。', '每轮记录当前队列长度作为层大小。', '层最大值初始化为负无穷。', '弹出恰好层大小个节点并更新最大值，同时加入孩子。', '本层结束后把最大值追加到答案。'],
    code: `from typing import List, Optional
from collections import deque

class Solution:
    def largestValues(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        answer = []
        queue = deque([root])
        while queue:
            level_max = float('-inf')
            for _ in range(len(queue)):
                node = queue.popleft()
                level_max = max(level_max, node.val)
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            answer.append(level_max)
        return answer`,
    walkthrough: { input: '[1,3,2,5,3,null,9]', steps: ['第一轮只处理根 1，记录 1。', '第二轮固定处理 3、2，记录 3。', '同时把下一层 5、3、9 入队。', '第三轮比较三者并记录 9。'], result: '[1,3,9]' },
    complexity: { time: 'O(n)。', space: 'O(w)。' }, pitfalls: ['层大小必须在本轮开始固定。', '负数树中最大值初值不能为 0。'], related: ['层序遍历', '分层聚合'],
  },
  662: {
    id: 662, title: '二叉树最大宽度', summary: '按完全二叉树位置编号计算每层最左到最右非空节点之间的宽度，空隙也计入。',
    constraints: ['宽度包含两端之间的空节点位置。', '深树位置编号可能很大，应逐层归一化。'],
    examples: [{ input: 'root=[1,3,2,5,3,null,9]', output: '4', explanation: '第三层最左位置 5 到最右位置 9 跨越 4 个完全树槽位。' }],
    intuition: '给根编号 0，左右孩子编号 2i 与 2i+1，层宽就是末编号减首编号加一；每层减去首编号可防止数字膨胀。',
    bruteForce: '显式补齐空节点做完全层序会让稀疏深树产生指数级占位。',
    approach: ['队列保存节点与逻辑位置编号。', '每层取首编号 base。', '处理该层时把位置减 base 归一化。', '用首尾归一位置计算宽度。', '非空孩子按 2i 与 2i+1 入队，更新最大宽度。'],
    code: `from typing import Optional
from collections import deque

class Solution:
    def widthOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        queue = deque([(root, 0)])
        best = 0
        while queue:
            base = queue[0][1]
            first = last = 0
            for i in range(len(queue)):
                node, pos = queue.popleft()
                pos -= base
                if i == 0: first = pos
                last = pos
                if node.left: queue.append((node.left, 2 * pos))
                if node.right: queue.append((node.right, 2 * pos + 1))
            best = max(best, last - first + 1)
        return best`,
    walkthrough: { input: '根的左左与右右均存在', steps: ['根编号 0。', '第二层左右节点编号 0、1。', '第三层左左编号 0，右右编号 3。', '该层宽度为 3-0+1=4。'], result: '4' },
    complexity: { time: 'O(n)。', space: 'O(w)。' }, pitfalls: ['宽度不是本层非空节点数量。', '逐层减 base 可避免编号无界增长。'], related: ['完全二叉树编号', '带索引 BFS'],
  },
  863: {
    id: 863, title: '二叉树中所有距离为 K 的结点', summary: '把树临时视为无向图，从 target 同时向左、右和父节点做 BFS，收集第 k 层。',
    constraints: ['target 是树中实际节点引用。', '距离按边数计算，k=0 时答案只有 target。'],
    examples: [{ input: 'root=[3,5,1,6,2,0,8,null,null,7,4], target=5, k=2', output: '[7,4,1]', explanation: '从节点 5 走两条边可到 7、4 和 1。' }],
    intuition: '原树只能向孩子走，先记录父指针后，每个节点就有最多三个无向邻居；问题转为标准无权图分层搜索。',
    bruteForce: '对每个节点单独求它与 target 的路径距离，会重复搜索整树，达到 O(n²)。',
    approach: ['DFS 全树建立 child→parent 映射。', '队列从 target 开始，访问集合先放 target。', '按层 BFS，当前层数等于 k 时返回队列节点值。', '对每个节点枚举 left、right、parent。', '未访问的非空邻居标记后入队。'],
    code: `from typing import List
from collections import deque

class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
        parent = {root: None}
        stack = [root]
        while stack:
            node = stack.pop()
            for child in (node.left, node.right):
                if child:
                    parent[child] = node
                    stack.append(child)
        queue = deque([target])
        seen = {target}
        distance = 0
        while queue and distance < k:
            for _ in range(len(queue)):
                node = queue.popleft()
                for neighbor in (node.left, node.right, parent[node]):
                    if neighbor and neighbor not in seen:
                        seen.add(neighbor)
                        queue.append(neighbor)
            distance += 1
        return [node.val for node in queue]`,
    walkthrough: { input: 'target=5, k=2（示例树）', steps: ['先建立每个孩子的父节点映射。', '距离 0 队列只有节点 5。', '扩展一层得到 6、2、3。', '再扩展并去重，得到 7、4、1。'], result: '[7,4,1]（次序可不同）' },
    complexity: { time: 'O(n)。', space: 'O(n)。' }, pitfalls: ['必须用 visited 防止父子之间来回循环。', 'k=0 时不应提前扩展。'], related: ['树转无向图', '多方向 BFS'],
  },
  987: {
    id: 987, title: '二叉树的垂序遍历', summary: '按列从左到右输出节点；同列先按行，再按节点值排序。',
    constraints: ['根坐标为 (row=0,col=0)，左孩子列减一，右孩子列加一。', '同坐标节点必须按值升序。'],
    examples: [{ input: 'root=[3,9,20,null,null,15,7]', output: '[[9],[3,15],[20],[7]]', explanation: '列坐标依次为 -1、0、1、2，同列 0 中 3 的行更靠上。' }],
    intuition: '为每个节点记录 (col,row,value)，统一排序即可同时满足列、行和值三层优先级。',
    bruteForce: '逐列反复扫描整棵树寻找属于该列的节点，会产生 O(n²) 重复工作。',
    approach: ['DFS 树并记录三元组 (col,row,value)。', '左递归使用 row+1,col-1。', '右递归使用 row+1,col+1。', '对三元组按默认顺序排序。', '按 col 变化分组，把 value 追加到对应列。'],
    code: `from typing import List, Optional

class Solution:
    def verticalTraversal(self, root: Optional[TreeNode]) -> List[List[int]]:
        nodes = []
        def dfs(node, row, col):
            if not node:
                return
            nodes.append((col, row, node.val))
            dfs(node.left, row + 1, col - 1)
            dfs(node.right, row + 1, col + 1)
        dfs(root, 0, 0)
        nodes.sort()
        answer = []
        previous_col = None
        for col, row, value in nodes:
            if col != previous_col:
                answer.append([])
                previous_col = col
            answer[-1].append(value)
        return answer`,
    walkthrough: { input: '[3,9,20,null,null,15,7]', steps: ['记录根三元组 (0,0,3)。', '节点 9 在 (-1,1)，20 在 (1,1)。', '15 在 (0,2)，7 在 (2,2)。', '排序并按列分组，列 0 中 3 在 15 前。'], result: '[[9],[3,15],[20],[7]]' },
    complexity: { time: 'O(n log n)。', space: 'O(n)。' }, pitfalls: ['排序主键应先是 col，再是 row，最后 value。', '这与只按 BFS 顺序的普通垂序遍历要求不同。'], related: ['坐标化遍历', '多关键字排序'],
  },
  695: {
    id: 695, title: '岛屿的最大面积', summary: '在 0/1 网格中计算四方向连通的 1 的最大数量，用 DFS 淹没已访问陆地。',
    constraints: ['只按上下左右连通，对角线不连接。', '允许原地把访问过的 1 改为 0。'],
    examples: [{ input: 'grid = [[0,1,1],[0,1,0],[1,0,1]]', output: '3', explanation: '上方三个相连的 1 构成最大岛屿。' }],
    intuition: '每遇到未访问陆地就启动一次连通分量搜索；搜索返回该岛所有格子的数量并把它们标记，避免重复。',
    bruteForce: '从每个陆地都独立搜索而不保留访问状态，同一岛会被反复遍历。',
    approach: ['遍历网格每个坐标。', '遇到值 1 时启动栈并立即改为 0。', '弹出坐标并增加当前面积。', '把四个合法且仍为 1 的邻格置 0 后入栈。', '一次搜索结束后用面积更新全局最大值。'],
    code: `from typing import List

class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        best = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != 1:
                    continue
                grid[r][c] = 0
                stack = [(r, c)]
                area = 0
                while stack:
                    x, y = stack.pop()
                    area += 1
                    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1:
                            grid[nx][ny] = 0
                            stack.append((nx, ny))
                best = max(best, area)
        return best`,
    walkthrough: { input: '[[1,1,0],[1,0,1]]', steps: ['从左上 1 启动搜索并标零。', '发现右侧与下侧两个相邻陆地。', '该连通分量面积累计为 3。', '右下孤立陆地面积为 1，不更新最大值。'], result: '3' },
    complexity: { time: 'O(mn)。', space: 'O(mn)，最坏栈大小。' }, pitfalls: ['入栈时就标记，避免同一格被多个邻居重复压栈。', '修改输入若不被允许，应改用 visited 集合。'], related: ['洪水填充', '连通分量'],
  },
  417: {
    id: 417, title: '太平洋大西洋水流问题', summary: '找出雨水能同时流到两片海洋的格子，从海岸反向搜索所有可达高地再求交集。',
    constraints: ['水正向只能流向高度不高于当前格的四邻格。', '太平洋接上、左边界，大西洋接下、右边界。'],
    examples: [{ input: 'heights = [[1,2],[4,3]]', output: '[[0,1],[1,0],[1,1]]', explanation: '这三个格子都能沿非升路径分别到达两组边界。' }],
    intuition: '逐格向海搜索会大量重复；从海边倒着走，只允许到更高或等高邻格，一次搜索就得到所有能流向该海的格子。',
    bruteForce: '从每个格子分别 DFS 判断能否到两片海，最坏 O((mn)²)。',
    approach: ['分别创建太平洋和大西洋可达集合。', '把上、左边界作为太平洋反向搜索起点。', '把下、右边界作为大西洋起点。', '反向 DFS/BFS 只走高度不低于当前格的邻居。', '返回两个可达集合的交集坐标。'],
    code: `from typing import List

class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        rows, cols = len(heights), len(heights[0])
        def reach(starts):
            seen = set(starts)
            stack = list(seen)
            while stack:
                r, c = stack.pop()
                for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                    nr, nc = r + dr, c + dc
                    if (0 <= nr < rows and 0 <= nc < cols and
                        (nr, nc) not in seen and heights[nr][nc] >= heights[r][c]):
                        seen.add((nr, nc))
                        stack.append((nr, nc))
            return seen
        pacific = [(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)]
        atlantic = [(rows - 1, c) for c in range(cols)] + [(r, cols - 1) for r in range(rows)]
        both = reach(pacific) & reach(atlantic)
        return [[r, c] for r, c in both]`,
    walkthrough: { input: '[[1,2],[4,3]]', steps: ['太平洋从上边和左边反向出发。', '可沿不降高度到达右下高度 3 与左下高度 4。', '大西洋从下边和右边出发。', '两份可达集合求交，排除只能到太平洋的左上角。'], result: '[[0,1],[1,0],[1,1]]（次序不限）' },
    complexity: { time: 'O(mn)，每片海至多访问每格一次。', space: 'O(mn)。' }, pitfalls: ['反向搜索比较方向是邻格高度大于等于当前格。', '四个角可能重复作为起点，集合会自动去重。'], related: ['反向图搜索', '多源 DFS'],
  },
};

import type { Lesson } from './lessons';

export const lessonsBatch8: Record<number, Lesson> = {
  162: {
    id: 162,
    title: '寻找峰值',
    summary: '在相邻元素不相等的数组中返回任一峰值下标。无需定位全局最大值，只要沿着上坡方向前进，就能保证前方存在一个局部峰值。',
    constraints: ['数组非空，相邻元素互不相等。', '边界外可视为负无穷，因此首尾元素也可能成为峰值。', '允许返回任意一个满足条件的下标。'],
    examples: [{ input: 'nums = [1,3,5,4,2]', output: '2', explanation: '下标 2 的值 5 同时大于左右邻居。' }],
    intuition: '比较 mid 与 mid+1 就能判断局部坡向：若仍在上升，右侧必会在边界前后出现峰顶；若正在下降，mid 本身或其左侧必有峰顶。由此每轮安全丢弃一半区间。',
    bruteForce: '逐个检查每个位置与左右邻居，时间 O(n)。它正确但没有利用“只需任意峰值”和相邻不等所提供的单调方向信息。',
    approach: ['维护可能含峰值的闭区间 [left,right]。', '当 left < right 时计算中点 mid。', '比较 nums[mid] 与右邻居 nums[mid+1]，后者因循环条件一定存在。', '若 nums[mid] < nums[mid+1]，沿上坡令 left=mid+1。', '否则峰值不会被排除在左半边，令 right=mid。', '两端重合时返回该下标。'],
    code: `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < nums[mid + 1]:
                left = mid + 1
            else:
                right = mid
        return left`,
    walkthrough: { input: 'nums = [1,2,4,3,5,0]', steps: ['初始区间 [0,5]，mid=2，4>3，保留 [0,2]。', '区间 [0,2]，mid=1，2<4，保留 [2,2]。', '左右边界在下标 2 重合。', '检查局部关系可见 4>2 且 4>3。'], result: '返回下标 2。' },
    complexity: { time: 'O(log n)，候选区间每轮减半。', space: 'O(1)，只使用边界与中点变量。' },
    pitfalls: ['循环写成 left<=right 时可能让 mid+1 越界。', '下降时应令 right=mid，不能跳过可能正是峰值的 mid。', '峰值不等于全局唯一最大值，题目允许多解。'],
    related: ['二分查找', '852 山脉数组的峰顶索引', '1901 寻找峰值 II'],
  },
  154: {
    id: 154,
    title: '寻找旋转排序数组中的最小值 II',
    summary: '在允许重复元素的旋转非递减数组中寻找最小值。二分的核心是拿中点与右端比较；相等时无法判断旋转点方向，只能安全缩短右边界。',
    constraints: ['数组非空，原数组非递减排列后经过一次旋转。', '元素允许重复，旋转次数可以为零。', '只返回最小值，不要求旋转位置。'],
    examples: [{ input: 'nums = [2,2,2,0,1,2]', output: '0', explanation: '最小值 0 位于旋转断点之后。' }],
    intuition: '右端值可作为有序片段的参照：mid 大于 right 时最小值严格在右侧；mid 小于 right 时 mid 可能就是最小值；相等时 right 是冗余副本，删除它不会丢掉唯一最小值。',
    bruteForce: '线性扫描并取最小值，时间 O(n)、空间 O(1)。在重复值铺满关键区间时，优化后的二分最坏也会退化到这个上界。',
    approach: ['初始化闭区间 left=0、right=n-1。', '当 left<right 时计算 mid。', '若 nums[mid]>nums[right]，断点在 mid 右边，令 left=mid+1。', '若 nums[mid]<nums[right]，最小值位于含 mid 的左半边，令 right=mid。', '若两值相等，无法判向但可令 right-=1。', '区间收缩到一点后返回 nums[left]。'],
    code: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            elif nums[mid] < nums[right]:
                right = mid
            else:
                right -= 1
        return nums[left]`,
    walkthrough: { input: 'nums = [3,3,1,3]', steps: ['区间 [0,3]，mid=1，nums[mid]=nums[right]=3。', '右端缩为 2，区间变成 [0,2]。', 'mid=1，3>1，令 left=2。', '边界重合于下标 2，其值为 1。'], result: '返回 1。' },
    complexity: { time: '平均 O(log n)，全是重复值时最坏 O(n)。', space: 'O(1)。' },
    pitfalls: ['相等时不能武断选择一侧，只能去掉一个重复端点。', 'nums[mid]<nums[right] 时不能写 right=mid-1。', '不要假设数组一定发生了非零次旋转。'],
    related: ['153 寻找旋转排序数组中的最小值', '33 搜索旋转排序数组', '81 搜索旋转排序数组 II'],
  },

  410: {
    id: 410,
    title: '分割数组的最大值',
    summary: '把非负数组切成恰好 k 个连续非空段，使各段和的最大值尽量小。对答案做二分，再用贪心判断某个上限是否足以完成分割。',
    constraints: ['数组元素非负，1<=k<=数组长度。', '各子数组必须连续、非空并覆盖全部元素。', '目标是最小化所有段和中的最大者。'],
    examples: [{ input: 'nums = [7,2,5,10,8], k = 2', output: '18', explanation: '切为 [7,2,5] 与 [10,8]，最大段和为 18。' }],
    intuition: '答案至少是最大单元素，至多是总和。给定容量 limit 后，尽量把当前段装满会使用最少段数；若最少段数仍超过 k，limit 必然太小。可行性随 limit 增大保持单调。',
    bruteForce: '枚举 k-1 个切点并计算每种分割，组合数可达 C(n-1,k-1)，规模稍大就不可接受。动态规划也可做，但通常需 O(kn²)。',
    approach: ['把搜索下界设为 max(nums)，上界设为 sum(nums)。', '对候选上限 mid，从左到右贪心装入当前段。', '若加入 x 会超过 mid，就在 x 前切段并把段数加一。', '若所需段数不超过 k，则 mid 可行，收缩右边界。', '否则 mid 太小，令左边界为 mid+1。', '边界重合时即为最小可行最大段和。'],
    code: `class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        left, right = max(nums), sum(nums)
        while left < right:
            limit = (left + right) // 2
            groups, current = 1, 0
            for x in nums:
                if current + x > limit:
                    groups += 1
                    current = 0
                current += x
            if groups <= k:
                right = limit
            else:
                left = limit + 1
        return left`,
    walkthrough: { input: 'nums = [7,2,5,10,8], k=2', steps: ['答案区间为 [10,32]，先试 21，贪心可分 2 段，右界降到 21。', '继续试 15，需要 [7,2,5]、[10]、[8] 共 3 段，左界升高。', '试 18 时恰需 2 段，因此 18 可行。', '更小候选最终均需超过 2 段，边界收敛于 18。'], result: '最小可能的最大段和是 18。' },
    complexity: { time: 'O(n log(sum(nums)-max(nums)+1))。', space: 'O(1)。' },
    pitfalls: ['下界不能从 0 开始，任何段都容不下最大元素。', '可行条件是段数<=k；非负数组中可继续拆到恰好 k 段。', '贪心必须保持原顺序和连续性。'],
    related: ['875 爱吃香蕉的珂珂', '1011 在 D 天内送达包裹的能力', '二分答案'],
  },

  875: {
    id: 875,
    title: '爱吃香蕉的珂珂',
    summary: '寻找能在 h 小时内吃完所有香蕉堆的最小整数速度。速度越大耗时越少，形成适合二分答案的单调可行区间。',
    constraints: ['每堆香蕉数为正整数，每小时只能处理一堆。', '速度 k 为正整数，一堆耗时 ceil(pile/k)。', 'h 至少不小于堆数，因而一定存在答案。'],
    examples: [{ input: 'piles = [3,6,7,11], h = 8', output: '4', explanation: '速度 4 时总耗时 1+2+2+3=8。' }],
    intuition: '速度 1 是理论下界，最大堆大小是足够的上界。判断速度 k 是否可行只需累加每堆向上取整耗时；一旦可行，所有更快速度也可行，因此寻找第一个可行值。',
    bruteForce: '从速度 1 逐一试到可行，单次检查 O(n)，最大堆很大时会进行大量无效尝试。',
    approach: ['设置 left=1、right=max(piles)。', '取中间速度 speed。', '用 (pile+speed-1)//speed 计算每堆小时数并求和。', '若总时间<=h，说明速度可行，令 right=speed 尝试更慢。', '若总时间>h，令 left=speed+1。', '左右重合时返回最小可行速度。'],
    code: `class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        left, right = 1, max(piles)
        while left < right:
            speed = (left + right) // 2
            hours = sum((p + speed - 1) // speed for p in piles)
            if hours <= h:
                right = speed
            else:
                left = speed + 1
        return left`,
    walkthrough: { input: 'piles = [3,6,7,11], h=8', steps: ['搜索 [1,11]，试速度 6，总耗时 6，可行。', '缩到 [1,6]，试速度 3，总耗时 10，不可行。', '缩到 [4,6]，试速度 5，总耗时 8，可行。', '再试速度 4，总耗时也为 8，边界收敛于 4。'], result: '返回最小速度 4。' },
    complexity: { time: 'O(n log M)，M 为最大堆大小。', space: 'O(1)。' },
    pitfalls: ['每堆耗时必须向上取整。', '可行时保留 mid，因为它可能正是最小答案。', '不能把不同堆在同一小时合并处理。'],
    related: ['410 分割数组的最大值', '1011 在 D 天内送达包裹的能力', '1482 制作 m 束花所需的最少天数'],
  },

  1011: {
    id: 1011,
    title: '在 D 天内送达包裹的能力',
    summary: '包裹必须按给定顺序装船，求在限定天数内运完所需的最小载重。固定载重后用贪心模拟天数，再对载重二分。',
    constraints: ['包裹重量均为正数，运输顺序不能改变。', '每天可装连续的一段包裹且总重不超过载重。', '载重至少容纳最重包裹，至多取全部重量之和。'],
    examples: [{ input: 'weights = [1,2,3,4,5,6], days = 3', output: '9', explanation: '可按 [1,2,3]、[4,5]、[6] 三天运完。' }],
    intuition: '给定 capacity，尽可能按顺序装满当天可使使用天数最少。容量越大，所需天数不会增加，所以“能否在 days 天内运完”是单调谓词，可寻找第一个可行容量。',
    bruteForce: '从最大单件重量起逐个增加载重并模拟，答案范围大时检查次数接近总重量，效率低。',
    approach: ['令容量下界为 max(weights)，上界为 sum(weights)。', '取中间容量 capacity，并从第一天开始模拟。', '若当前包裹加入后超载，就开启新一天，再装该包裹。', '统计最少所需天数 used。', 'used<=days 时保留 capacity 并向左搜索，否则提高下界。', '区间收敛后返回最小可行容量。'],
    code: `class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        left, right = max(weights), sum(weights)
        while left < right:
            capacity = (left + right) // 2
            used, load = 1, 0
            for weight in weights:
                if load + weight > capacity:
                    used += 1
                    load = 0
                load += weight
            if used <= days:
                right = capacity
            else:
                left = capacity + 1
        return left`,
    walkthrough: { input: 'weights = [3,2,2,4,1,4], days=3', steps: ['容量范围 [4,16]，试 10，只需 2 天，可继续减小。', '试 7：每天可装 [3,2,2]、[4,1]、[4]，恰需 3 天。', '试 5：需要 [3,2]、[2]、[4,1]、[4] 共 4 天。', '5 不可行而 7 可行，继续夹逼后最小边界为 6。'], result: '容量 6 可在 3 天完成，返回 6。' },
    complexity: { time: 'O(n log S)，S 为总重量与最大重量之差量级。', space: 'O(1)。' },
    pitfalls: ['不能重排包裹来追求每天更均匀。', '开启新一天后当前包裹仍要计入 load。', '模拟天数应从 1 开始，表示当前正在装的第一天。'],
    related: ['410 分割数组的最大值', '875 爱吃香蕉的珂珂', '二分答案'],
  },

  378: {
    id: 378,
    title: '有序矩阵中第 K 小的元素',
    summary: '矩阵每行每列均升序，求按重复次数计数的第 k 小值。对值域二分，并在线性时间内统计不大于候选值的元素数量。',
    constraints: ['矩阵为 n×n，行和列均非递减。', '重复值占据多个位置，排名时分别计数。', '1<=k<=n²。'],
    examples: [{ input: 'matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8', output: '13', explanation: '展开排序后的第八个值为 13。' }],
    intuition: '从左下角统计 <=x 的元素：若当前值<=x，则该列上方 r+1 个都满足，可整列计数并右移；否则上移。计数随 x 单调增加，首个 count>=k 的值就是答案。',
    bruteForce: '把 n² 个元素复制到数组并排序，时间 O(n² log n)、额外空间 O(n²)，没有充分利用双向有序性。',
    approach: ['以 matrix[0][0] 和 matrix[-1][-1] 作为值域边界。', '取中间值 mid。', '从左下角开始，统计矩阵中小于等于 mid 的元素个数。', '当前值<=mid 时累加 r+1 并右移，否则上移。', '若计数>=k，答案不大于 mid，收缩右界；否则提高左界。', '边界重合时返回该值，即使它未曾作为中点出现也会是矩阵元素。'],
    code: `class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)
        left, right = matrix[0][0], matrix[-1][-1]
        while left < right:
            mid = (left + right) // 2
            count = 0
            r, c = n - 1, 0
            while r >= 0 and c < n:
                if matrix[r][c] <= mid:
                    count += r + 1
                    c += 1
                else:
                    r -= 1
            if count >= k:
                right = mid
            else:
                left = mid + 1
        return left`,
    walkthrough: { input: 'matrix = [[1,3,7],[5,8,9],[6,10,12]], k=5', steps: ['值域 [1,12]，取 mid=6。', '从左下角 6 开始，第一列三项都<=6，计 3；再统计第二列的 3，共计 4。', 'count=4<5，答案大于 6，左界变 7。', '继续二分时 8 的累计个数达到 6，而 7 只有 5 个，最终收敛到 7。'], result: '第 5 小元素为 7。' },
    complexity: { time: 'O(n log(Vmax-Vmin+1))，每次计数走至多 2n 步。', space: 'O(1)。' },
    pitfalls: ['重复元素必须按位置计数。', 'count>=k 时右界保留 mid。', '从左下或右上开始才能按整行/整列跳过。'],
    related: ['373 查找和最小的 K 对数字', '668 乘法表中第 k 小的数', '二分值域'],
  },

  658: {
    id: 658,
    title: '找到 K 个最接近的元素',
    summary: '在升序数组中选出距离 x 最近的 k 个元素，并按升序返回。答案必为一个连续窗口，可二分窗口的最左起点。',
    constraints: ['数组升序排列，1<=k<=数组长度。', '距离相同时优先较小元素。', '结果要求仍按升序。'],
    examples: [{ input: 'arr = [1,2,3,4,5], k = 4, x = 3', output: '[1,2,3,4]', explanation: '两侧距离打平时保留更小的 1 而不是 5。' }],
    intuition: '长度 k 的候选窗口起点范围是 [0,n-k]。比较 arr[mid] 与窗口右侧外的 arr[mid+k]：若 x-arr[mid] 更大，说明左端比右外元素更差，应右移窗口；否则保留左侧以满足平局取小值。',
    bruteForce: '按 (abs(value-x), value) 排序选前 k 个，再对结果排序，时间 O(n log n)、空间 O(n)。',
    approach: ['确认最优 k 个元素在有序数组中形成连续窗口。', '对窗口起点设置 left=0、right=n-k。', '取 mid，并比较 x-arr[mid] 与 arr[mid+k]-x。', '若左端更远，令 left=mid+1。', '否则令 right=mid，平局也保留较小元素所在的左窗口。', '返回 arr[left:left+k]。'],
    code: `class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        left, right = 0, len(arr) - k
        while left < right:
            mid = (left + right) // 2
            if x - arr[mid] > arr[mid + k] - x:
                left = mid + 1
            else:
                right = mid
        return arr[left:left + k]`,
    walkthrough: { input: 'arr = [1,2,3,4,5], k=3, x=4', steps: ['起点范围 [0,2]，mid=1，对比 arr[1]=2 与 arr[4]=5。', '距离分别为 2 和 1，左端更差，起点右移到 2。', '边界重合，窗口确定为下标 [2,4]。', '窗口元素 [3,4,5] 已自然升序。'], result: '返回 [3,4,5]。' },
    complexity: { time: 'O(log(n-k)+k)，二分起点并复制 k 个答案。', space: 'O(k) 为返回切片；算法额外空间 O(1)。' },
    pitfalls: ['比较的是窗口左端与右边界外的元素 mid+k。', '平局时应移动 right，从而偏向更小元素。', 'x 在数组范围外时公式仍成立，无需特殊分支。'],
    related: ['二分查找', '973 最接近原点的 K 个点', '215 数组中的第 K 个最大元素'],
  },

  973: {
    id: 973,
    title: '最接近原点的 K 个点',
    summary: '从平面点集中选出欧氏距离原点最近的 k 个点。维护大小为 k 的“最大堆”可在流式扫描中随时淘汰当前最远候选。',
    constraints: ['点坐标为整数，k 合法且不超过点数。', '只需比较距离，无需开平方。', '答案顺序通常不作要求，距离并列可返回任意合法组合。'],
    examples: [{ input: 'points = [[1,3],[-2,2],[2,-1]], k = 2', output: '[[-2,2],[2,-1]]', explanation: '两点的平方距离分别为 8 和 5，小于 [1,3] 的 10。' }],
    intuition: '扫描过程中只保留目前最近的 k 点。Python 只有最小堆，把平方距离取负后，堆顶对应候选中距离最大的点；新点加入后若超过 k，弹出的正是最该淘汰者。',
    bruteForce: '计算所有距离并整体排序，时间 O(n log n)。实现简单，但只需前 k 项时排序了不必要的其余元素。',
    approach: ['创建空堆，元素保存 (-distanceSquared,x,y)。', '逐点计算 d=x*x+y*y，避免浮点开方。', '将 (-d,x,y) 压入堆。', '若堆大小超过 k，弹出堆顶，即当前候选中最远点。', '扫描结束后堆内恰有 k 个最近点。', '提取坐标组成结果，顺序无需依赖堆序。'],
    code: `class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        import heapq
        heap = []
        for x, y in points:
            distance = x * x + y * y
            heapq.heappush(heap, (-distance, x, y))
            if len(heap) > k:
                heapq.heappop(heap)
        return [[x, y] for _, x, y in heap]`,
    walkthrough: { input: 'points = [[3,3],[1,1],[-1,2],[5,0]], k=2', steps: ['加入 [3,3]，平方距离 18。', '加入 [1,1]，距离 2，堆中保留两点。', '加入 [-1,2]，距离 5；容量超限，弹出距离 18 的 [3,3]。', '加入 [5,0]，距离 25；它立即成为最远者并被弹出。'], result: '保留 [1,1] 与 [-1,2]。' },
    complexity: { time: 'O(n log k)，每个点进行至多一次入堆和出堆。', space: 'O(k)，堆只保存候选点。' },
    pitfalls: ['不必调用 sqrt，平方距离保持相同次序。', 'Python 模拟最大堆需对距离取负。', '不要误以为堆数组整体已有序；题目不要求输出距离顺序。'],
    related: ['215 数组中的第 K 个最大元素', '347 前 K 个高频元素', '658 找到 K 个最接近的元素'],
  },

  692: {
    id: 692,
    title: '前 K 个高频单词',
    summary: '统计单词频率并返回最高的 k 个；频率相同时按字典序更小者优先。关键是把两级排序规则准确编码。',
    constraints: ['单词列表非空，k 不超过不同单词数。', '频率降序；频率相同则字典序升序。', '同一字符串的所有出现合并计数。'],
    examples: [{ input: 'words = ["i","love","leetcode","i","love","coding"], k = 2', output: '["i","love"]', explanation: 'i 与 love 都出现两次，按字典序排列。' }],
    intuition: '先用哈希表压缩重复输入，再把不同单词按键 (-frequency, word) 排序：负号把频率降序转成默认升序，而字符串本身自然按字典序升序。',
    bruteForce: '每决定一个名次都重新遍历所有单词统计或寻找最大者，会重复做计数与选择，最坏可达 O(kn) 甚至更高。',
    approach: ['遍历 words 建立 Counter 频率表。', '提取所有不同单词。', '为每个词构造排序键 (-count[word],word)。', '按该键排序，先比较频率的相反数。', '频率相同时自动比较单词字典序。', '截取排序结果前 k 个返回。'],
    code: `class Solution:
    def topKFrequent(self, words: List[str], k: int) -> List[str]:
        from collections import Counter
        count = Counter(words)
        ordered = sorted(count, key=lambda word: (-count[word], word))
        return ordered[:k]`,
    walkthrough: { input: 'words = ["b","a","b","c","a","b"], k=2', steps: ['计数得到 b:3、a:2、c:1。', '排序键分别为 (-3,"b")、(-2,"a")、(-1,"c")。', '负频率越小表示原频率越高，因此 b 排第一。', 'a 的频率高于 c，排第二并进入截取范围。'], result: '返回 ["b","a"]。' },
    complexity: { time: 'O(n+u log u)，u 为不同单词数。', space: 'O(u)，保存频率表和排序列表。' },
    pitfalls: ['并列时要求字典序升序，而不是首次出现顺序。', '排序键频率要取负号。', '若用固定大小堆，并列规则在堆顶淘汰方向上更容易写反。'],
    related: ['347 前 K 个高频元素', '451 根据字符出现频率排序', '堆与自定义排序'],
  },

  703: {
    id: 703,
    title: '数据流中的第 K 大元素',
    summary: '设计一个支持不断加入数字的数据结构，并在每次加入后返回当前第 k 大值。大小为 k 的最小堆正好保存最大的 k 个元素。',
    constraints: ['初始化数组可以为空，之后反复调用 add。', '调用返回时数据总量满足至少有 k 个元素。', '重复值按各自出现次数参与排名。'],
    examples: [{ input: 'KthLargest(3,[4,5,8,2]); add(3); add(10)', output: '4, 5', explanation: '加入 3 后第三大为 4；再加入 10 后第三大为 5。' }],
    intuition: '无需保存比当前第 k 大还小的元素。让最小堆只保留最大的 k 项，堆顶便是这 k 项中最小者，也就是全体第 k 大；每次插入后超出容量就淘汰堆顶。',
    bruteForce: '保存所有数据，每次 add 后整体降序排序并取第 k 项，单次更新 O(n log n)，长期数据流成本不断增长。',
    approach: ['构造时创建空最小堆。', '依次把初始元素交给统一的插入逻辑。', '新值压入堆中。', '若堆大小超过 k，弹出最小值。', '维持不变量：堆中始终是当前最大的至多 k 个数。', 'add 返回 heap[0]，即当前第 k 大。'],
    code: `class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        import heapq
        self.k = k
        self.heap = []
        for value in nums:
            heapq.heappush(self.heap, value)
            if len(self.heap) > k:
                heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        import heapq
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`,
    walkthrough: { input: 'k=3, nums=[4,5,8,2]，随后 add(10)', steps: ['依次处理初始值后，堆保留最大的三项 [4,5,8]。', '值 2 因小于堆顶候选，插入后又被弹出。', '加入 10，堆临时含四项。', '弹出最小的 4，剩余 [5,8,10]，堆顶为 5。'], result: 'add(10) 返回 5。' },
    complexity: { time: '构造 O(n log k)，每次 add 为 O(log k)。', space: 'O(k)。' },
    pitfalls: ['应使用保存 k 个最大值的最小堆，不是最大堆。', '重复值不能用集合去重。', '堆数组只保证堆顶最小，并非整体有序。'],
    related: ['215 数组中的第 K 个最大元素', '295 数据流的中位数', '347 前 K 个高频元素'],
  },

  1046: {
    id: 1046,
    title: '最后一块石头的重量',
    summary: '反复取出最重的两块石头相撞，若重量不同则放回差值，求最后剩余重量。优先队列直接支持反复获取最大值。',
    constraints: ['石头重量为正整数。', '每轮必须选择当前最重的两块。', '相等时两块都消失，不等时只放回差值。'],
    examples: [{ input: 'stones = [2,7,4,1,8,1]', output: '1', explanation: '依次处理 8 与 7、4 与 2、2 与 1、1 与 1，最后剩 1。' }],
    intuition: '操作只关心当前最大两项，而放回的差值又会改变后续排名。最大堆能在每轮 O(log n) 更新排名；Python 可存负重量来复用最小堆。',
    bruteForce: '每轮对剩余数组重新排序或线性寻找两次最大值。重新排序会产生 O(n² log n) 量级的重复工作。',
    approach: ['把每块重量取负并堆化。', '当堆中至少有两项时连续弹出两个负数。', '还原后第一块重量 y 不小于第二块 x。', '若 y!=x，把差值 y-x 以负数形式压回。', '相等时不放回任何石头。', '循环结束，空堆返回 0，否则返回堆顶相反数。'],
    code: `class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        import heapq
        heap = [-weight for weight in stones]
        heapq.heapify(heap)
        while len(heap) > 1:
            y = -heapq.heappop(heap)
            x = -heapq.heappop(heap)
            if y != x:
                heapq.heappush(heap, -(y - x))
        return -heap[0] if heap else 0`,
    walkthrough: { input: 'stones = [5,5,3,1]', steps: ['最大两块 5 与 5 被弹出。', '两者相等，均消失，不放回差值。', '剩余 3 与 1 相撞，放回 2。', '此时只剩重量 2，循环结束。'], result: '返回 2。' },
    complexity: { time: 'O(n log n)，堆化 O(n)，至多 n-1 轮堆操作。', space: 'O(n)，保存重量堆。' },
    pitfalls: ['负数堆弹出的第一个值对应最大重量。', '相等时不要把 0 放回。', '结束时可能没有石头，必须返回 0。'],
    related: ['703 数据流中的第 K 大元素', '215 数组中的第 K 个最大元素', '优先队列模拟'],
  },

  239: {
    id: 239,
    title: '滑动窗口最大值',
    summary: '对每个长度为 k 的连续窗口输出最大值。单调递减双端队列保存仍可能成为当前或未来最大值的下标。',
    constraints: ['数组非空，1<=k<=数组长度。', '窗口每次向右移动一格。', '重复最大值需正确保留其有效下标。'],
    examples: [{ input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: '每个连续三元窗口依次取最大值。' }],
    intuition: '若新值大于等于队尾值，队尾在新值过期前永远不可能成为最大值，可以永久删除。队首始终是队列中值最大且尚未过期的下标。保存下标而非数值才能判断窗口边界。',
    bruteForce: '对每个窗口扫描 k 个元素求最大值，时间 O((n-k+1)k)，k 较大时接近 O(n²)。',
    approach: ['创建保存下标的 deque，并保持对应值单调递减。', '扫描下标 i，先从队首移除 i-k 及更早的过期下标。', '当队尾值<=nums[i] 时不断弹出队尾。', '把当前下标 i 加入队尾。', '当 i>=k-1 时，队首值就是当前窗口最大值。', '把该值加入答案并继续滑动。'],
    code: `class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        from collections import deque
        queue = deque()
        answer = []
        for i, value in enumerate(nums):
            while queue and queue[0] <= i - k:
                queue.popleft()
            while queue and nums[queue[-1]] <= value:
                queue.pop()
            queue.append(i)
            if i >= k - 1:
                answer.append(nums[queue[0]])
        return answer`,
    walkthrough: { input: 'nums = [1,3,-1,-3,5], k=3', steps: ['读 1 后队列为 [0]；读 3 时弹出较小的 1，队列为 [1]。', '读 -1，队列对应值 [3,-1]，首个窗口最大值为 3。', '读 -3，队列对应 [3,-1,-3]，第二个窗口最大值仍为 3。', '读 5 时下标 1 已过期，其余较小值也从队尾删除，队列只剩 5。'], result: '前三个窗口最大值为 [3,3,5]。' },
    complexity: { time: 'O(n)，每个下标至多入队、出队各一次。', space: 'O(k)，队列最多保存一个窗口的候选。' },
    pitfalls: ['队列必须保存下标才能移除过期元素。', '结果从 i=k-1 才开始记录。', '先后处理过期和单调性都可以设计，但边界条件必须一致。'],
    related: ['76 最小覆盖子串', '1438 绝对差不超过限制的最长连续子数组', '单调队列'],
  },

  424: {
    id: 424,
    title: '替换后的最长重复字符',
    summary: '至多替换 k 个字符，使某个连续子串全部相同，求最大长度。窗口所需替换数等于窗口长度减去其中最高字符频次。',
    constraints: ['字符串由有限字符集构成，k>=0。', '只能选择连续子串。', '窗口内除最高频字符外的其余位置都可作为替换对象。'],
    examples: [{ input: 's = "AABABBA", k = 1', output: '4', explanation: '例如把 "AABA" 中的 B 替换为 A。' }],
    intuition: '窗口能转成同一字符当且仅当 length-maxFreq<=k。右移时维护字符计数和历史最大频次；即使左移后 maxFreq 没有下降，也只会让窗口保持一个对答案上界有用的宽度，不会产生超过真实最优的答案。',
    bruteForce: '枚举所有子串，并统计每段最高频字符来判断替换数，直接实现通常 O(n³)，增量计数也至少 O(n²)。',
    approach: ['初始化 left=0、频率表、max_freq=0 和 best=0。', '右指针加入字符并更新其频率。', '用该字符频率刷新历史 max_freq。', '若窗口长度-max_freq>k，移动 left 并减少离开字符计数。', '当前窗口宽度更新 best。', '继续扩张直到扫描完整个字符串。'],
    code: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {}
        left = 0
        max_freq = 0
        best = 0
        for right, ch in enumerate(s):
            count[ch] = count.get(ch, 0) + 1
            max_freq = max(max_freq, count[ch])
            while right - left + 1 - max_freq > k:
                count[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best`,
    walkthrough: { input: 's = "AABABBA", k=1', steps: ['窗口扩到 "AAB"，A 出现 2 次，只需替换 1 次，best=3。', '加入 A 得 "AABA"，最高频为 3，best=4。', '继续加入 B 后窗口所需替换超过 1，左边界右移。', '后续窗口维持不超过最佳宽度，扫描完成仍以 4 为最大值。'], result: '返回 4。' },
    complexity: { time: 'O(n)，左右指针都只向右移动。', space: 'O(字符集大小)。' },
    pitfalls: ['合法条件是窗口长度减最高频次，不是不同字符种数。', '只允许替换至多 k 个，并不要求恰好用完。', '若不理解历史 max_freq 技巧，也可在固定小字符集上每轮重算最大频率。'],
    related: ['3 无重复字符的最长子串', '567 字符串的排列', '1004 最大连续 1 的个数 III'],
  },

  567: {
    id: 567,
    title: '字符串的排列',
    summary: '判断 s2 是否含有一个长度与 s1 相同、字符多重集合也相同的连续子串。固定长度滑动窗口能避免枚举全部排列。',
    constraints: ['常见约束中字符串只含小写英文字母。', '排列必须作为 s2 的连续子串出现。', '字符出现次数必须完全相同。'],
    examples: [{ input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', explanation: 's2 中的 "ba" 是 s1 的一个排列。' }],
    intuition: '任何排列长度都固定为 len(s1)。维护 s2 中同长度窗口的 26 维频率，窗口每右移一格只需加入新字符、删除旧字符；频率向量相等即找到排列。',
    bruteForce: '生成 s1 的所有排列再逐一搜索会产生 m! 个字符串；即使枚举 s2 子串后排序比较，也需 O((n-m+1)m log m)。',
    approach: ['若 s1 比 s2 长，直接返回 false。', '建立长度 26 的 need 与 window 数组。', '先统计 s1 和 s2 首个等长窗口。', '若两个频率数组相等，立即成功。', '每次右移时加入新字符并移除窗口左侧旧字符。', '每次更新后比较频率，扫描结束仍不相等则返回 false。'],
    code: `class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        m = len(s1)
        if m > len(s2):
            return False
        need = [0] * 26
        window = [0] * 26
        for i in range(m):
            need[ord(s1[i]) - 97] += 1
            window[ord(s2[i]) - 97] += 1
        if need == window:
            return True
        for right in range(m, len(s2)):
            window[ord(s2[right]) - 97] += 1
            window[ord(s2[right - m]) - 97] -= 1
            if need == window:
                return True
        return False`,
    walkthrough: { input: 's1 = "adc", s2 = "dcda"', steps: ['目标频率包含 a、d、c 各一次。', '首窗口 "dcd" 中 d 多一次且缺 a，不匹配。', '窗口右移：加入 a，同时移除最左侧 d。', '新窗口 "cda" 的频率与目标完全相同。'], result: '返回 true。' },
    complexity: { time: 'O(n)，26 维数组比较视为常数；n 为 s2 长度。', space: 'O(1)，两个固定长度计数数组。' },
    pitfalls: ['窗口长度必须始终等于 len(s1)。', '滑动时加入和删除都不可遗漏。', '若字符集不限定小写字母，应改用哈希表。'],
    related: ['438 找到字符串中所有字母异位词', '76 最小覆盖子串', '424 替换后的最长重复字符'],
  },

  713: {
    id: 713,
    title: '乘积小于 K 的子数组',
    summary: '统计乘积严格小于 k 的连续子数组数量。正整数条件使窗口乘积随右扩张不减，从而可用双指针维护合法窗口。',
    constraints: ['数组元素为正整数，这是窗口可单调收缩的关键。', '目标条件严格小于 k。', '只统计连续且非空的子数组。'],
    examples: [{ input: 'nums = [10,5,2,6], k = 100', output: '8', explanation: '所有单元素及若干相邻组合共 8 个满足条件。' }],
    intuition: '当窗口 [left,right] 的乘积合法时，以 right 结尾、起点位于 left 到 right 的所有子数组都合法，一次新增 right-left+1 个。乘积过大就从左侧除去元素，直到恢复合法。',
    bruteForce: '枚举每个起点并向右累乘，最坏 O(n²)。相比每段重新求积已有改进，但仍重复处理大量重叠区间。',
    approach: ['若 k<=1，正整数乘积不可能严格小于 k，返回 0。', '初始化 left=0、product=1、answer=0。', '右指针扫描并把 nums[right] 乘入 product。', '当 product>=k 时，除去 nums[left] 并右移 left。', '恢复合法后，以 right 结尾的合法子数组有 right-left+1 个。', '累加该数量并继续扫描。'],
    code: `class Solution:
    def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:
        if k <= 1:
            return 0
        left = 0
        product = 1
        answer = 0
        for right, value in enumerate(nums):
            product *= value
            while product >= k:
                product //= nums[left]
                left += 1
            answer += right - left + 1
        return answer`,
    walkthrough: { input: 'nums = [10,5,2,6], k=100', steps: ['right=0，窗口 [10] 合法，新增 1 个。', 'right=1，乘积 50，新增 [5]、[10,5] 共 2 个。', 'right=2，乘积达到 100，移除 10 后为 10，新增 [2]、[5,2] 共 2 个。', 'right=3，乘积 60，新增 [6]、[2,6]、[5,2,6] 共 3 个。'], result: '总数 1+2+2+3=8。' },
    complexity: { time: 'O(n)，每个元素至多被右端加入和左端移除一次。', space: 'O(1)。' },
    pitfalls: ['条件是严格小于，收缩循环必须用 product>=k。', 'k<=1 要提前返回，避免窗口越界。', '若数组含 0、负数或小数，当前单调性与整除逻辑需重新设计。'],
    related: ['209 长度最小的子数组', '560 和为 K 的子数组', '滑动窗口'],
  },

  395: {
    id: 395,
    title: '至少有 K 个重复字符的最长子串',
    summary: '寻找最长连续子串，使其中每种出现过的字符都至少出现 k 次。某段中总频率不足 k 的字符绝不可能属于该段内的合法答案，可据此分治切割。',
    constraints: ['字符串常由小写英文字母组成，k 为正整数。', '合法条件约束子串内出现的每一种字符。', '空串或长度小于 k 的区间不可能产生非空合法答案。'],
    examples: [{ input: 's = "ababbc", k = 2', output: '5', explanation: '子串 "ababb" 中 a 出现 2 次、b 出现 3 次。' }],
    intuition: '若字符 c 在当前候选段中总共不足 k 次，那么任何跨过 c 的子串都不合法，c 可作为必然切点。把区间按所有坏字符切开，答案只能落在某个子段中；若没有坏字符，整段本身合法。',
    bruteForce: '枚举所有 O(n²) 个子串并统计字符频率，若每次重新统计则达到 O(n³)；即使增量计数，仍有二次枚举。',
    approach: ['定义 solve(text) 返回该片段内的最长合法长度。', '若片段长度小于 k，返回 0。', '统计片段内每个字符频率。', '找出频率小于 k 的坏字符集合。', '若坏字符集合为空，整个片段合法，返回其长度。', '按坏字符切分片段，对每个非空子段递归并取最大值。'],
    code: `class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        from collections import Counter

        def solve(text: str) -> int:
            if len(text) < k:
                return 0
            count = Counter(text)
            bad = {ch for ch, freq in count.items() if freq < k}
            if not bad:
                return len(text)
            best = 0
            start = 0
            for i, ch in enumerate(text):
                if ch in bad:
                    if i > start:
                        best = max(best, solve(text[start:i]))
                    start = i + 1
            if start < len(text):
                best = max(best, solve(text[start:]))
            return best

        return solve(s)`,
    walkthrough: { input: 's = "ababbc", k=2', steps: ['统计整串：a=2、b=3、c=1。', 'c 的总频率不足 2，因此任何包含 c 的候选都不合法。', '按 c 切分得到主要子段 "ababb"。', '该子段中 a=2、b=3，没有坏字符，整段长度 5 合法。'], result: '返回 5。' },
    complexity: { time: '最坏 O(n²)，若每层只切掉很少字符会重复扫描；字符集固定时通常接近 O(字符集大小×n)。', space: '最坏 O(n)，来自切片与递归栈；用下标区间可减少切片开销。' },
    pitfalls: ['坏字符按当前递归片段频率判断，不是按原字符串全局频率。', '切点字符本身不能进入任何当前段内的合法答案。', 'k=1 时整串直接合法。'],
    related: ['424 替换后的最长重复字符', '3 无重复字符的最长子串', '分治'],
  },

  187: {
    id: 187,
    title: '重复的 DNA 序列',
    summary: '找出 DNA 字符串中所有出现超过一次的长度 10 片段，每种重复片段只输出一次。固定窗口配合两个集合即可在线识别首次重复。',
    constraints: ['字符串仅由 A、C、G、T 构成。', '只考察长度恰为 10 的连续片段。', '同一片段即使出现三次以上也只返回一次。'],
    examples: [{ input: 's = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"', output: '["AAAAACCCCC","CCCCCAAAAA"]', explanation: '这两个长度 10 的片段均至少出现两次。' }],
    intuition: '窗口长度固定，扫描所有起点即可。seen 记录出现过一次的片段；当片段再次出现时加入 repeated 集合。集合天然去重，第三次及以后不会制造重复输出。',
    bruteForce: '比较任意两段长度 10 的窗口是否相同，需要 O(n²) 次配对。直接集合扫描已经把查重降为平均常数时间。',
    approach: ['若字符串长度小于 10，返回空列表。', '创建 seen 与 repeated 两个集合。', '枚举起点 i 从 0 到 len(s)-10。', '切出当前长度 10 的 window。', '若 window 已在 seen 中，将其加入 repeated；否则加入 seen。', '扫描结束后把 repeated 转为列表返回。'],
    code: `class Solution:
    def findRepeatedDnaSequences(self, s: str) -> List[str]:
        if len(s) < 10:
            return []
        seen = set()
        repeated = set()
        for i in range(len(s) - 9):
            window = s[i:i + 10]
            if window in seen:
                repeated.add(window)
            else:
                seen.add(window)
        return list(repeated)`,
    walkthrough: { input: 's = "AAAAAAAAAAAA"', steps: ['起点 0 得到 "AAAAAAAAAA"，首次出现，加入 seen。', '起点 1 得到相同片段，已在 seen，加入 repeated。', '起点 2 再次得到相同片段，集合内容不变。', '所有三个窗口扫描完成，repeated 只有一个元素。'], result: '返回 ["AAAAAAAAAA"]。' },
    complexity: { time: 'O(n)，窗口长度固定为 10，切片成本视为常数。', space: 'O(n)，最坏保存线性数量的不同窗口。' },
    pitfalls: ['起点范围应包含 len(s)-10，即 Python 使用 range(len(s)-9)。', '只用列表收集会在出现三次时重复输出。', '题目要求长度固定为 10，不能扩缩窗口。'],
    related: ['重复子串', '滚动哈希', '1044 最长重复子串'],
  },

  454: {
    id: 454,
    title: '四数相加 II',
    summary: '从四个等长数组各选一个元素，统计四数和为零的下标四元组数量。把四项拆成两对，用哈希表连接互为相反数的两数和。',
    constraints: ['四个数组中的元素可重复且可为负数。', '按下标选择计数，相同数值来自不同位置会贡献多次。', '只需返回数量，不需列出四元组。'],
    examples: [{ input: 'nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]', output: '2', explanation: '共有两组下标选择使四数和为零。' }],
    intuition: '等式 a+b+c+d=0 可改写为 a+b=-(c+d)。先统计前两数组每种和出现多少次，再枚举后两数组的和；每次查到的频率就是可与当前下标对组合的方案数。',
    bruteForce: '四重循环枚举全部 n⁴ 组下标，逐组求和，n 稍大就不可行。',
    approach: ['创建 Counter pair_count。', '枚举 nums1 与 nums2 的所有下标对。', '把和值 a+b 的出现次数累加到 pair_count。', '初始化 answer=0。', '枚举 nums3 与 nums4 的所有下标对，计算需要的相反数 -(c+d)。', '把 pair_count[-c-d] 累加到答案并返回。'],
    code: `class Solution:
    def fourSumCount(self, nums1: List[int], nums2: List[int], nums3: List[int], nums4: List[int]) -> int:
        from collections import Counter
        pair_count = Counter(a + b for a in nums1 for b in nums2)
        answer = 0
        for c in nums3:
            for d in nums4:
                answer += pair_count[-c - d]
        return answer`,
    walkthrough: { input: 'nums1=[1,1], nums2=[-1], nums3=[0], nums4=[0]', steps: ['前两数组有两个不同下标对。', '两对的和值都为 0，因此 pair_count[0]=2。', '后两数组只有一对，其和值为 0，需要前半和也为 0。', '查询频率得到 2，一次累加两种前半下标选择。'], result: '返回 2。' },
    complexity: { time: 'O(n²)，建立与查询两组两数和。', space: 'O(n²)，不同两数和最坏达到 n² 种。' },
    pitfalls: ['Counter 存的是出现次数，不能用 set，否则会漏掉重复下标组合。', '查询键应为 -(c+d)。', '本题统计数量，不需要像四数之和那样对数值组合去重。'],
    related: ['1 两数之和', '18 四数之和', '560 和为 K 的子数组'],
  },

  18: {
    id: 18,
    title: '四数之和',
    summary: '找出数组中四个不同下标组成、和为 target 的所有不重复数值四元组。排序后固定前两项，再用双指针完成剩余两数搜索与系统去重。',
    constraints: ['数组可含重复值、负数和零。', '四个元素必须来自不同下标，答案按数值组合去重。', '求和时在固定宽度语言中应防止整数溢出。'],
    examples: [{ input: 'nums = [1,0,-1,0,-2,2], target = 0', output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]', explanation: '三种不同四元组均和为零。' }],
    intuition: '排序让相同值相邻，也让双指针可根据总和决定方向。第一、第二固定位置分别跳过同层重复值；命中后左右指针同时移动并跨过重复值，就不会生成相同四元组。',
    bruteForce: '枚举四个递增下标需 O(n⁴)，再借助集合去重；即使正确，也浪费了排序后可用的单调结构。',
    approach: ['升序排序 nums，创建答案列表。', '枚举第一项 i，并跳过与上一轮相同的值。', '枚举第二项 j，同样只在当前 i 下跳过重复值。', '设置 left=j+1、right=n-1，计算四数总和。', '总和偏小则 left++，偏大则 right--。', '命中时记录四元组、双端内移，并分别跳过相邻重复值。'],
    code: `class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        nums.sort()
        answer = []
        n = len(nums)
        for i in range(n - 3):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            for j in range(i + 1, n - 2):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                left, right = j + 1, n - 1
                while left < right:
                    total = nums[i] + nums[j] + nums[left] + nums[right]
                    if total < target:
                        left += 1
                    elif total > target:
                        right -= 1
                    else:
                        answer.append([nums[i], nums[j], nums[left], nums[right]])
                        left += 1
                        right -= 1
                        while left < right and nums[left] == nums[left - 1]:
                            left += 1
                        while left < right and nums[right] == nums[right + 1]:
                            right -= 1
        return answer`,
    walkthrough: { input: 'nums = [1,0,-1,0,-2,2], target=0', steps: ['排序得到 [-2,-1,0,0,1,2]。', '固定 -2、-1，双指针找到 1 与 2，记录 [-2,-1,1,2]。', '固定 -2、0，找到另一个 0 与 2，记录 [-2,0,0,2]。', '固定 -1、0，找到 0 与 1；重复的固定值和指针值按层跳过。'], result: '得到三个互不重复的四元组。' },
    complexity: { time: 'O(n³)，两层固定枚举配合线性双指针。', space: '不计输出时主要取决于排序实现；双指针额外 O(1)。' },
    pitfalls: ['j 的去重条件必须是 j>i+1，不能跨不同 i 错误跳过。', '命中后左右指针都要移动并跳重。', '不能复用同一下标；排序后通过严格递增位置自然保证。'],
    related: ['15 三数之和', '16 最接近的三数之和', '454 四数相加 II'],
  },
};

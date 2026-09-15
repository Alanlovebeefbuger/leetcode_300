import type { Lesson } from './lessons';

export const lessonsBatch1: Record<number, Lesson> = {

  49: {
    id: 49, title: '字母异位词分组',
    summary: '把包含相同字符及相同出现次数的单词归入同组；关键是为每个单词构造与字符排列无关的稳定签名。',
    constraints: ['输入是字符串数组，单词可重复且空串也能形成一组。', '同组顺序和各组顺序通常不限，但签名必须能区分不同字符频次。'],
    examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]', explanation: '排序后 eat、tea、ate 的签名均为 aet；tan、nat 的签名均为 ant。' }],
    intuition: '异位词只改变排列，不改变排序结果；因此排序后的字符串可作为哈希表键，原词追加到对应桶。',
    bruteForce: '逐对比较两个单词的字符计数并维护已分组标记，需要反复扫描，最坏约 O(n²k)。',
    approach: ['建立“签名到原单词列表”的哈希表。', '依次读取每个单词。', '将其字符排序并拼成签名。', '把原单词加入该签名对应的桶。', '遍历完后返回所有桶，桶内保留输入顺序。'],
    code: `from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = {}
        for word in strs:
            key = ''.join(sorted(word))
            groups.setdefault(key, []).append(word)
        return list(groups.values())`,
    walkthrough: { input: '["eat","tea","bat"]', steps: ['eat 排序得 aet，创建第一个桶。', 'tea 排序也得 aet，加入已有桶。', 'bat 排序得 abt，创建新桶。', '取出哈希表的两个桶。'], result: '[["eat","tea"],["bat"]]' },
    complexity: { time: 'O(n·k log k)，k 为最长单词长度。', space: 'O(n·k)，用于签名和分组结果。' },
    pitfalls: ['不能把原单词直接当键，否则异位词不会相遇。', '若用 26 位计数签名，要避免含糊拼接，应用元组。'], related: ['哈希分组', '字符频次签名'],
  },
  128: {
    id: 128, title: '最长连续序列',
    summary: '在无序整数中找出数值连续且长度最大的序列，不要求元素在原数组中相邻。',
    constraints: ['数组可为空并可能含重复值、负数。', '目标是线性期望时间，不能先排序作为最优解。'],
    examples: [{ input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: '数值序列 1,2,3,4 连续，长度为 4。' }],
    intuition: '集合能常数时间判断相邻数；只从“前驱不存在”的数开始向右延伸，避免同一序列被反复扫描。',
    bruteForce: '从每个元素不断在线性数组中搜索下一个整数，最坏 O(n³)；排序可降至 O(n log n)。',
    approach: ['把所有数放入集合并自然去重。', '遍历集合中的每个值。', '若 value-1 存在，说明它不是序列起点，跳过。', '从起点反复检查 value+1、value+2。', '用延伸长度更新全局最大值并最终返回。'],
    code: `from typing import List

class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        values = set(nums)
        best = 0
        for x in values:
            if x - 1 not in values:
                y = x
                while y in values:
                    y += 1
                best = max(best, y - x)
        return best`,
    walkthrough: { input: '[100,4,200,1,3,2]', steps: ['建集合 {1,2,3,4,100,200}。', '100 无前驱，延伸长度 1。', '1 无前驱，连续命中 1 到 4。', '2、3、4 有前驱而跳过，最大值保持 4。'], result: '4' },
    complexity: { time: '期望 O(n)，每段只从起点完整扫描一次。', space: 'O(n)，哈希集合。' },
    pitfalls: ['必须遍历集合或容忍重复，否则重复起点造成额外工作。', '只有前驱不存在时才延伸是线性复杂度的关键。'], related: ['哈希集合', '序列起点判定'],
  },
  283: {
    id: 283, title: '移动零',
    summary: '原地把所有零移到数组末尾，同时保持非零元素的相对次序。',
    constraints: ['必须原地修改输入数组。', '非零元素顺序不能改变，数组可能全零或完全无零。'],
    examples: [{ input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]', explanation: '三个非零数按原顺序压到前方，剩余位置填零。' }],
    intuition: '把 write 看作下一个非零数应该落下的位置；read 扫描到非零时与 write 交换，可一次完成稳定压缩。',
    bruteForce: '每遇到零就删除并在末尾追加零，数组搬移使最坏时间达到 O(n²)。',
    approach: ['令 write=0 表示非零区间尾部。', 'read 从左到右扫描全部元素。', '遇到零时只推进 read。', '遇到非零时交换 nums[write] 与 nums[read]。', '推进 write，扫描结束后数组即满足要求。'],
    code: `from typing import List

class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        write = 0
        for read in range(len(nums)):
            if nums[read] != 0:
                nums[write], nums[read] = nums[read], nums[write]
                write += 1`,
    walkthrough: { input: '[0,1,0,3]', steps: ['write=0，首个零跳过。', '读到 1，与位置 0 交换，write=1。', '下一个零跳过。', '读到 3，与位置 1 交换，得到 [1,3,0,0]。'], result: '[1,3,0,0]' },
    complexity: { time: 'O(n)，单次扫描。', space: 'O(1)，只用两个下标。' },
    pitfalls: ['返回值应为 None，而不是新数组。', '不能通过排序实现，因为会破坏非零元素相对顺序。'], related: ['稳定分区', '快慢指针'],
  },
  11: {
    id: 11, title: '盛最多水的容器',
    summary: '选择两条竖线作为容器边界，使较短边乘两线距离得到的面积最大。',
    constraints: ['高度均为非负整数，至少有两条线。', '容器不能倾斜，面积受较短边限制。'],
    examples: [{ input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: '下标 1 与 8 的距离为 7，短边为 7，面积 49。' }],
    intuition: '两端向内移动时宽度必减；若想弥补宽度损失，只能丢弃当前较短边，期待遇到更高边。',
    bruteForce: '枚举所有左右边界并计算面积，共 O(n²) 对。',
    approach: ['左右指针置于数组两端。', '计算当前宽度与两端较小高度的乘积。', '用当前面积更新最大值。', '左边较矮则左移，否则右移。', '两指针相遇时返回记录的最大面积。'],
    code: `from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right, best = 0, len(height) - 1, 0
        while left < right:
            best = max(best, (right - left) * min(height[left], height[right]))
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return best`,
    walkthrough: { input: '[1,8,6,2,5,4,8,3,7]', steps: ['初始面积 8，左边较矮而右移。', '边界 8 与 7 形成面积 49。', '随后逐次丢弃不更高的短边。', '所有候选宽度检查完，49 未被超过。'], result: '49' },
    complexity: { time: 'O(n)，每轮移动一个指针。', space: 'O(1)。' },
    pitfalls: ['高度应取两端最小值而非最大值。', '移动较高边无法突破当前短边上限，会漏掉正确贪心逻辑。'], related: ['相向双指针', '贪心消除候选'],
  },
  42: {
    id: 42, title: '接雨水',
    summary: '计算柱状图下雨后能留住的总水量，每格水位由其左右最高边界中的较低者决定。',
    constraints: ['高度为非负整数，空数组或少于三根柱子时结果为零。', '每个位置只能蓄到 min(左最高,右最高) 的高度。'],
    examples: [{ input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '各低洼位置蓄水量依次为 2、4、1、2，总计 9。' }],
    intuition: '当左侧最高不高于右侧最高时，左位置的水量已由左最高确定；对称地可安全处理右侧。',
    bruteForce: '对每个位置分别扫描左、右最大高度，时间 O(n²)。',
    approach: ['左右指针从两端开始，并维护 leftMax、rightMax。', '比较两侧当前高度。', '较低的一侧拥有已确定的另一侧屏障。', '更新该侧最高值，并累加最高值减当前高度。', '移动该侧指针，直到左右相遇后返回总量。'],
    code: `from typing import List

class Solution:
    def trap(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = water = 0
        while left <= right:
            if height[left] <= height[right]:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1
        return water`,
    walkthrough: { input: '[4,2,0,3,2,5]', steps: ['左 4 不高于右 5，记录 leftMax=4。', '处理高度 2，加入 2。', '处理高度 0 和 3，分别加入 4、1。', '继续处理高度 2 加入 2，总水量为 9。'], result: '9' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['水量不能用相邻高度差计算。', '累加前应先更新该侧最大高度，保证不会加入负数。'], related: ['双指针', '单调栈'],
  },
  438: {
    id: 438, title: '找到字符串中所有字母异位词',
    summary: '找出主串中所有长度等于模式串且字符频次完全一致的窗口起点。',
    constraints: ['模式串长度可能大于主串，此时没有答案。', '字符重复次数必须一致，返回下标按从小到大排列。'],
    examples: [{ input: 's = "cbaebabacd", p = "abc"', output: '[0,6]', explanation: '窗口 cba 与 bac 都含有恰好一个 a、b、c。' }],
    intuition: '异位词窗口长度固定；滑动一步只增删各一个字符，维护 26 位频次数组即可避免重复统计。',
    bruteForce: '枚举每个定长子串并排序比较，时间 O((n-m+1)·m log m)。',
    approach: ['若模式串更长则直接返回空列表。', '统计模式串与首个窗口的字符频次。', '比较两份频次，相等就记录起点 0。', '窗口右移时加入新右字符并移除旧左字符。', '每次移动后比较频次并记录匹配起点。'],
    code: `from typing import List

class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        m = len(p)
        if m > len(s): return []
        need, window = [0] * 26, [0] * 26
        for c in p: need[ord(c) - 97] += 1
        for c in s[:m]: window[ord(c) - 97] += 1
        ans = [0] if window == need else []
        for right in range(m, len(s)):
            window[ord(s[right]) - 97] += 1
            window[ord(s[right - m]) - 97] -= 1
            if window == need: ans.append(right - m + 1)
        return ans`,
    walkthrough: { input: 's="abab", p="ab"', steps: ['模式频次为 a:1,b:1。', '首窗 ab 匹配，记录 0。', '滑到 ba：加 a、删 a，仍匹配，记录 1。', '滑到 ab，仍匹配，记录 2。'], result: '[0,1,2]' },
    complexity: { time: 'O(n)，26 位数组比较视为常数。', space: 'O(1)，固定大小频次数组。' },
    pitfalls: ['窗口必须始终保持与 p 等长。', '移除字符应使用 right-m，而不是当前左端的新位置。'], related: ['固定窗口', '字符计数'],
  },
  560: {
    id: 560, title: '和为 K 的子数组',
    summary: '统计连续子数组中元素和恰好等于 k 的个数，负数使普通伸缩窗口不再可靠。',
    constraints: ['数组可含正数、零和负数。', '需要统计所有位置不同的子数组，不是判断是否存在。'],
    examples: [{ input: 'nums = [1,1,1], k = 2', output: '2', explanation: '前两个元素和后两个元素分别组成一个和为 2 的子数组。' }],
    intuition: '若当前前缀和为 prefix，先前出现过 prefix-k，则从那些位置之后到当前位置的区间和都为 k。',
    bruteForce: '枚举起点并向右累加，时间 O(n²)。',
    approach: ['哈希表先放入前缀和 0 的次数 1。', '从左到右累加当前前缀和。', '查询 prefix-k 以前出现的次数。', '把该次数加入答案。', '再将当前 prefix 次数加一，避免把当前位置错误用作起点。'],
    code: `from typing import List

class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        count = {0: 1}
        prefix = ans = 0
        for x in nums:
            prefix += x
            ans += count.get(prefix - k, 0)
            count[prefix] = count.get(prefix, 0) + 1
        return ans`,
    walkthrough: { input: 'nums=[1,-1,1], k=1', steps: ['初始 count[0]=1。', '前缀和 1，查 0 得 1，答案为 1。', '前缀和回到 0，查 -1 无匹配。', '前缀和再次为 1，查 0 有两次，答案增至 3。'], result: '3' },
    complexity: { time: 'O(n) 期望时间。', space: 'O(n)，记录不同前缀和。' },
    pitfalls: ['必须初始化 {0:1} 才能统计从下标 0 开始的区间。', '先查询再登记当前前缀，尤其 k=0 时不能颠倒。'], related: ['前缀和', '哈希计数'],
  },

  76: {
    id: 76, title: '最小覆盖子串',
    summary: '在主串中找最短连续窗口，使它包含目标串全部字符及其重复次数。',
    constraints: ['目标字符的重复次数必须被完整覆盖。', '若不存在覆盖窗口返回空串；答案若存在通常唯一。'],
    examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'BANC 同时覆盖 A、B、C，且不存在更短的合法窗口。' }],
    intuition: '右端扩张直到满足需求，再持续收缩左端寻找当前右端下的最短解；用 formed 记录已达标的字符种类。',
    bruteForce: '枚举所有子串并统计覆盖情况，最坏 O(n³)。',
    approach: ['统计 t 中每种字符的需求量。', '右指针扩张并更新窗口计数，刚好达标时增加 formed。', '当 formed 等于需求种类数，当前窗口合法。', '记录更短窗口，然后从左侧移除字符；跌破需求时减少 formed。', '继续扩张，最终按最佳边界切片或返回空串。'],
    code: `from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not t: return ''
        need = Counter(t); window = Counter()
        required, formed, left = len(need), 0, 0
        best = (float('inf'), 0, 0)
        for right, c in enumerate(s):
            window[c] += 1
            if c in need and window[c] == need[c]: formed += 1
            while formed == required:
                if right - left + 1 < best[0]: best = (right-left+1, left, right+1)
                d = s[left]; window[d] -= 1; left += 1
                if d in need and window[d] < need[d]: formed -= 1
        return '' if best[0] == float('inf') else s[best[1]:best[2]]`,
    walkthrough: { input: 's="ABAAC", t="AAC"', steps: ['需求为 A:2、C:1。', '右端扩到末尾后窗口 ABAAC 首次合法。', '移除首个 A 后 BAAC 仍合法并更短。', '再移除 B 得 AAC，继续收缩会缺 A，因此最佳为 AAC。'], result: '"AAC"' },
    complexity: { time: 'O(|s|+|t|)，每个字符至多进出窗口一次。', space: 'O(字符种类数)。' },
    pitfalls: ['formed 应统计达标种类，不是窗口字符总数。', '只有计数从满足变为不足时才减少 formed。'], related: ['可变滑动窗口', '字符频次覆盖'],
  },
  56: {
    id: 56, title: '合并区间',
    summary: '将所有相交或相接的闭区间合并，输出互不重叠的区间集合。',
    constraints: ['每个区间起点不大于终点。', '输入可能无序；闭区间端点相等视为重叠。'],
    examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] 与 [2,6] 重叠，合并成 [1,6]。' }],
    intuition: '按起点排序后，新区间只可能与结果中的最后一个区间重叠，因此无需回看更早区间。',
    bruteForce: '反复寻找任意重叠对并合并，可能多轮扫描到 O(n²)。',
    approach: ['按区间起点升序排序。', '建立空结果列表。', '若结果为空或新区间起点大于末区间终点，直接追加。', '否则二者重叠，把末区间终点扩展到较大终点。', '处理全部区间后返回结果。'],
    code: `from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda x: x[0])
        merged = []
        for start, end in intervals:
            if not merged or start > merged[-1][1]:
                merged.append([start, end])
            else:
                merged[-1][1] = max(merged[-1][1], end)
        return merged`,
    walkthrough: { input: '[[1,4],[2,3],[6,8],[8,9]]', steps: ['排序后顺序不变，先加入 [1,4]。', '[2,3] 被 [1,4] 覆盖，末端仍为 4。', '[6,8] 不重叠，新增区间。', '[8,9] 与闭区间 [6,8] 相接，合并为 [6,9]。'], result: '[[1,4],[6,9]]' },
    complexity: { time: 'O(n log n)，主要为排序。', space: 'O(n)，输出列表；忽略排序栈则额外空间可视实现而定。' },
    pitfalls: ['重叠判断是 start <= lastEnd。', '被包含区间不能把已有较大终点缩小。'], related: ['区间排序', '插入区间'],
  },
  189: {
    id: 189, title: '轮转数组',
    summary: '把数组整体向右移动 k 个位置，并要求原地完成。',
    constraints: ['数组非空，k 可能远大于数组长度。', '应把 k 对 n 取模，目标使用常数额外空间。'],
    examples: [{ input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', explanation: '末尾三个元素整体移到最前，内部次序不变。' }],
    intuition: '整体反转把后 k 个放到前面但各段倒序；再分别反转两段就恢复段内顺序。',
    bruteForce: '重复 k 次把末元素移到开头，每次搬移 O(n)，总计 O(nk)。',
    approach: ['令 k %= n 消除完整轮转。', '定义原地反转闭区间的双指针函数。', '反转整个数组。', '反转前 k 个元素。', '反转剩余 n-k 个元素，数组即完成右移。'],
    code: `from typing import List

class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums); k %= n
        def reverse(left: int, right: int) -> None:
            while left < right:
                nums[left], nums[right] = nums[right], nums[left]
                left += 1; right -= 1
        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)`,
    walkthrough: { input: '[1,2,3,4,5], k=2', steps: ['k 取模仍为 2。', '整体反转得 [5,4,3,2,1]。', '反转前两项得 [4,5,3,2,1]。', '反转后三项得 [4,5,1,2,3]。'], result: '[4,5,1,2,3]' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['忘记 k %= n 会造成错误边界。', '题目要求原地修改，不应只返回切片拼接结果。'], related: ['数组反转', '环状替换'],
  },
  238: {
    id: 238, title: '除自身以外数组的乘积',
    summary: '为每个位置计算其余所有元素的乘积，不使用除法，并在线性时间完成。',
    constraints: ['不能使用除法，因此零值也能自然处理。', '答案通常保证在整数范围内，输出数组不计入额外空间。'],
    examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: '每项等于该位置左侧乘积乘右侧乘积。' }],
    intuition: '答案可拆成“左边所有数的积 × 右边所有数的积”；先写左积，再用一个变量从右累乘。',
    bruteForce: '对每个位置扫描其余元素相乘，时间 O(n²)。',
    approach: ['创建长度 n 的答案数组并令 prefix=1。', '从左到右把当前 prefix 写入答案。', '再把当前数乘进 prefix。', '令 suffix=1，从右到左把 suffix 乘到答案对应项。', '把当前数乘进 suffix，扫描完返回答案。'],
    code: `from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        ans = [1] * len(nums)
        prefix = 1
        for i, x in enumerate(nums):
            ans[i] = prefix
            prefix *= x
        suffix = 1
        for i in range(len(nums) - 1, -1, -1):
            ans[i] *= suffix
            suffix *= nums[i]
        return ans`,
    walkthrough: { input: '[2,3,4]', steps: ['左扫后答案为 [1,2,6]。', '从右端开始，位置 2 乘右积 1 得 6。', 'suffix 变 4，位置 1 得 8。', 'suffix 变 12，位置 0 得 12。'], result: '[12,8,6]' },
    complexity: { time: 'O(n)。', space: 'O(1) 额外空间（不计输出）。' },
    pitfalls: ['更新 prefix/suffix 必须在使用当前值之后。', '不能用总乘积除当前数，零会失效且违反要求。'], related: ['前后缀积', '数组扫描'],
  },
  41: {
    id: 41, title: '缺失的第一个正数',
    summary: '在线性时间和常数额外空间内，找出数组中没有出现的最小正整数。',
    constraints: ['负数、零和重复值都可能出现。', '长度为 n 时答案一定落在 1 到 n+1。'],
    examples: [{ input: 'nums = [3,4,-1,1]', output: '2', explanation: '1 已出现，2 未出现，因此无需关心更大的缺口。' }],
    intuition: '把数组本身当哈希表：值 x 若在 1..n，就应放到下标 x-1；归位后首个错位下标就是答案。',
    bruteForce: '从 1 开始逐个在线性数组中查找，最坏 O(n²)；集合方案需要 O(n) 空间。',
    approach: ['遍历下标 i，检查 nums[i] 是否在 1..n。', '若它不在目标位置且目标位置不是同值，就交换归位。', '交换后不推进 i，继续处理换来的新值。', '无法归位时推进 i，避免重复值死循环。', '第二遍找首个 nums[i] != i+1，返回 i+1；若都正确返回 n+1。'],
    code: `from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        i = 0
        while i < n:
            x = nums[i]
            if 1 <= x <= n and nums[x - 1] != x:
                nums[i], nums[x - 1] = nums[x - 1], nums[i]
            else:
                i += 1
        for i, x in enumerate(nums):
            if x != i + 1: return i + 1
        return n + 1`,
    walkthrough: { input: '[3,4,-1,1]', steps: ['3 归位到下标 2，数组变 [-1,4,3,1]。', '4 归位到下标 3，得到 [-1,1,3,4]。', '1 再归位到下标 0，得到 [1,-1,3,4]。', '下标 1 期望值 2 却为 -1，返回 2。'], result: '2' },
    complexity: { time: 'O(n)，每次交换至少归位一个元素。', space: 'O(1)。' },
    pitfalls: ['重复值时必须检测目标位置是否已相等，否则会死循环。', '只有 1..n 的值需要参与归位。'], related: ['原地哈希', '循环置换'],
  },
  73: {
    id: 73, title: '矩阵置零',
    summary: '若矩阵某格为零，就把该格所在整行与整列都置零，并原地完成。',
    constraints: ['矩阵至少有一行一列。', '不能边发现零边立即清空，否则新产生的零会污染标记。'],
    examples: [{ input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]', explanation: '中心零使第二行和第二列全部变为零。' }],
    intuition: '利用第一行和第一列存储其余各行列是否应清零，只需额外记录第一列自身是否含零。',
    bruteForce: '复制矩阵或用两个集合记录零所在行列，需要 O(mn) 或 O(m+n) 额外空间。',
    approach: ['用 first_col_zero 记录第一列原本是否有零。', '扫描矩阵；遇到零就在对应行首和列首写零。', '从最后一行、最后一列向前回填。', '若某格行标记或列标记为零，就将该格置零。', '每行最后处理第一列，避免过早覆盖仍需使用的标记。'],
    code: `from typing import List

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        rows, cols = len(matrix), len(matrix[0])
        first_col_zero = False
        for r in range(rows):
            if matrix[r][0] == 0: first_col_zero = True
            for c in range(1, cols):
                if matrix[r][c] == 0:
                    matrix[r][0] = matrix[0][c] = 0
        for r in range(rows - 1, -1, -1):
            for c in range(cols - 1, 0, -1):
                if matrix[r][0] == 0 or matrix[0][c] == 0:
                    matrix[r][c] = 0
            if first_col_zero: matrix[r][0] = 0`,
    walkthrough: { input: '[[1,2,0],[4,5,6]]', steps: ['扫描到 (0,2) 的零。', '把第 0 行首和第 2 列首作为零标记。', '反向处理第二行，将 (1,2) 置零。', '处理第一行，行标记为零使整行归零。'], result: '[[0,0,0],[4,5,0]]' },
    complexity: { time: 'O(mn)。', space: 'O(1)。' },
    pitfalls: ['第一行和第一列同时充当标记，需要单独保存第一列状态。', '回填应反向进行，避免先破坏标记。'], related: ['原地标记', '矩阵遍历'],
  },
  54: {
    id: 54, title: '螺旋矩阵',
    summary: '按从外到内、顺时针的顺序读取矩阵全部元素。',
    constraints: ['矩阵可以是单行或单列。', '每个元素必须恰好访问一次，边界收缩后要防止重复。'],
    examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: '先绕外圈一周，再读取中心元素 5。' }],
    intuition: '维护尚未访问矩形的上、下、左、右边界，每完成一条边就向内收缩对应边界。',
    bruteForce: '逐步移动并用 visited 矩阵判断转向，虽为 O(mn) 但需 O(mn) 空间且边界复杂。',
    approach: ['初始化 top、bottom、left、right 四条边界。', '从左到右读取 top 行并下移 top。', '从上到下读取 right 列并左移 right。', '若仍有行，从右到左读取 bottom 行；若仍有列，从下到上读取 left 列。', '重复四向读取直至边界交错，返回结果。'],
    code: `from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1
        ans = []
        while top <= bottom and left <= right:
            for c in range(left, right+1): ans.append(matrix[top][c])
            top += 1
            for r in range(top, bottom+1): ans.append(matrix[r][right])
            right -= 1
            if top <= bottom:
                for c in range(right, left-1, -1): ans.append(matrix[bottom][c])
                bottom -= 1
            if left <= right:
                for r in range(bottom, top-1, -1): ans.append(matrix[r][left])
                left += 1
        return ans`,
    walkthrough: { input: '[[1,2,3],[4,5,6]]', steps: ['顶边加入 1,2,3。', '右边加入 6。', '底边反向加入 5,4。', '边界交错，停止而不再读取左边。'], result: '[1,2,3,6,5,4]' },
    complexity: { time: 'O(mn)。', space: 'O(1) 额外空间（不计输出）。' },
    pitfalls: ['读底边和左边前必须再次检查边界。', '每条边读取后要立即收缩相应边界。'], related: ['边界模拟', '矩阵层遍历'],
  },

  48: {
    id: 48, title: '旋转图像',
    summary: '把 n×n 矩阵原地顺时针旋转 90 度，不能另建同尺寸矩阵。',
    constraints: ['输入一定是方阵。', '必须原地修改，元素可能重复或为负数。'],
    examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: '原矩阵第一列反向后成为旋转矩阵第一行。' }],
    intuition: '先沿主对角线转置，再逐行左右翻转，坐标 (r,c) 最终恰好映射到 (c,n-1-r)。',
    bruteForce: '创建新矩阵并按坐标映射写入，时间 O(n²)、额外空间 O(n²)。',
    approach: ['取得方阵边长 n。', '遍历每一行 r。', '只遍历主对角线右侧的 c>r 元素。', '交换 matrix[r][c] 与 matrix[c][r] 完成转置。', '逐行原地反转，得到顺时针旋转结果。'],
    code: `from typing import List

class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for r in range(n):
            for c in range(r + 1, n):
                matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
        for row in matrix:
            row.reverse()`,
    walkthrough: { input: '[[1,2],[3,4]]', steps: ['边长为 2。', '交换对角线外的 2 与 3。', '转置结果为 [[1,3],[2,4]]。', '每行反转得到 [[3,1],[4,2]]。'], result: '[[3,1],[4,2]]' },
    complexity: { time: 'O(n²)。', space: 'O(1)。' },
    pitfalls: ['转置时只交换对角线一侧，否则会换回原状。', '转置后应反转每行；反转行顺序会得到另一方向。'], related: ['矩阵转置', '坐标变换'],
  },
  240: {
    id: 240, title: '搜索二维矩阵 II',
    summary: '在每行从左到右、每列从上到下均递增的矩阵中判断目标值是否存在。',
    constraints: ['矩阵行列均有序，但整体不一定按行首尾连续。', '矩阵非空，目标可能不在其中。'],
    examples: [{ input: 'matrix = [[1,4,7],[2,5,8],[3,6,9]], target = 6', output: 'true', explanation: '从右上角逐步排除一行或一列，最终到达值 6。' }],
    intuition: '右上角同时是所在行最大候选方向和所在列最小候选方向：过大就左移，过小就下移。',
    bruteForce: '逐格扫描需要 O(mn)；每行二分需要 O(m log n)。',
    approach: ['从右上角 (0,n-1) 开始。', '若当前值等于 target，立即返回 True。', '当前值大于 target 时左移，排除当前列的下方值。', '当前值小于 target 时下移，排除当前行的左方值。', '越过矩阵边界仍未命中则返回 False。'],
    code: `from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        r, c = 0, len(matrix[0]) - 1
        while r < len(matrix) and c >= 0:
            if matrix[r][c] == target: return True
            if matrix[r][c] > target: c -= 1
            else: r += 1
        return False`,
    walkthrough: { input: 'matrix=[[1,4,7],[2,5,8],[3,6,9]], target=6', steps: ['右上角 7 大于 6，左移到 4。', '4 小于 6，下移到 5。', '5 小于 6，下移到 6。', '命中目标并返回真。'], result: 'true' },
    complexity: { time: 'O(m+n)。', space: 'O(1)。' },
    pitfalls: ['不能对展平后的矩阵整体二分，因为行尾未必小于下一行行首。', '选择左上角无法唯一决定移动方向。'], related: ['阶梯式搜索', '有序矩阵'],
  },
  160: {
    id: 160, title: '相交链表',
    summary: '找出两个单链表共享的第一个节点；相交按节点身份而非节点值判断。',
    constraints: ['两个链表都无环。', '链表可能不相交，也可能从头节点就共享。'],
    examples: [{ input: 'A: 4→1→8→4→5, B: 5→6→1→8→4→5（8 起共享）', output: '值为 8 的共享节点', explanation: '两条链在同一个节点对象 8 处汇合，此后尾部完全相同。' }],
    intuition: '指针走完自己的链后改走对方链，两者总路程都为 lenA+lenB，长度差被自动抵消。',
    bruteForce: '把 A 的每个节点与 B 的每个节点比较身份，最坏 O(mn)。',
    approach: ['令指针 a、b 分别从两个头节点出发。', '每轮比较 a 与 b 是否为同一对象。', 'a 到空后跳到 headB，否则前进一步。', 'b 到空后跳到 headA，否则前进一步。', '两指针会在交点或共同的 None 相遇，返回该对象。'],
    code: `from typing import Optional

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        a, b = headA, headB
        while a is not b:
            a = a.next if a else headB
            b = b.next if b else headA
        return a`,
    walkthrough: { input: 'A 长 5、B 长 6，共享尾部从节点 8 开始', steps: ['a、b 同速前进，暂因前缀长度不同而错开。', 'a 走完 A 后切到 B 头。', 'b 走完 B 后切到 A 头。', '两者都走相同总前缀距离后在共享节点 8 相遇。'], result: '共享节点 8' },
    complexity: { time: 'O(m+n)。', space: 'O(1)。' },
    pitfalls: ['必须用节点身份 is 比较，值相同不代表相交。', '切换发生在指针为 None 时，不应跳过对方头节点。'], related: ['链表长度对齐', '双指针换道'],
  },
  234: {
    id: 234, title: '回文链表',
    summary: '判断单链表从头到尾的节点值是否与反向读取完全一致，并以常数额外空间完成。',
    constraints: ['空链表或单节点链表可视为回文。', '链表节点值可重复，要求比较完整次序。'],
    examples: [{ input: 'head = 1→2→2→1', output: 'true', explanation: '从前向后和从后向前的值序列都为 1,2,2,1。' }],
    intuition: '快慢指针定位中点，再反转后半段，就能从两端对应位置同步比较。',
    bruteForce: '把所有值复制到数组再与逆序比较，时间 O(n)、空间 O(n)。',
    approach: ['快指针走两步、慢指针走一步定位后半段起点。', '从慢指针开始原地反转后半链。', '令 left 指向头，right 指向反转后的头。', '同步比较两侧值，任一不等则返回 False。', 'right 走完说明后半全部匹配，返回 True。'],
    code: `from typing import Optional

class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        prev = None
        while slow:
            nxt = slow.next
            slow.next = prev
            prev, slow = slow, nxt
        left, right = head, prev
        while right:
            if left.val != right.val: return False
            left, right = left.next, right.next
        return True`,
    walkthrough: { input: '1→2→2→1', steps: ['快慢指针令 slow 到第三个节点。', '反转后半段得到 1→2。', '比较头尾两个 1，匹配。', '比较两个 2，匹配且右侧结束。'], result: 'true' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['奇数长度时中间节点参与反转但不会影响比较。', '此实现会改变后半链；若业务要求保持原状，应比较后再恢复。'], related: ['链表反转', '快慢指针'],
  },
  141: {
    id: 141, title: '环形链表',
    summary: '判断单链表是否存在沿 next 指针可重复到达的环。',
    constraints: ['链表可能为空或只有一个节点。', '不得依赖节点值唯一，最好使用常数空间。'],
    examples: [{ input: '3→2→0→-4，尾节点指回值 2 的节点', output: 'true', explanation: '沿 next 会重复经过 2、0、-4，快慢指针最终相遇。' }],
    intuition: '若有环，快指针每轮比慢指针多走一步，会在有限环长内追上；无环则快指针先到空。',
    bruteForce: '用集合保存访问过的节点，遇到重复即有环，需 O(n) 空间。',
    approach: ['slow 与 fast 都从头节点开始。', '仅当 fast 和 fast.next 存在时继续。', 'slow 每轮走一步。', 'fast 每轮走两步。', '若二者身份相同返回 True；循环结束则返回 False。'],
    code: `from typing import Optional

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast: return True
        return False`,
    walkthrough: { input: '1→2→3→4，4 指回 2', steps: ['首轮 slow=2、fast=3。', '次轮 slow=3、fast=2。', '第三轮 slow=4、fast=4。', '两个指针身份相同，确认存在环。'], result: 'true' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['比较节点身份而非节点值。', '循环条件必须同时检查 fast 与 fast.next。'], related: ['Floyd 判圈', '快慢指针'],
  },
  142: {
    id: 142, title: '环形链表 II',
    summary: '若链表有环，返回环的入口节点；否则返回 None。',
    constraints: ['链表可能无环。', '不能修改链表，目标使用常数额外空间。'],
    examples: [{ input: '3→2→0→-4，尾节点指回值 2 的节点', output: '入口为值 2 的节点', explanation: '快慢指针先在环内相遇，再从头与相遇点同步前进会在入口汇合。' }],
    intuition: '设头到入口距离 a、入口到相遇点距离 b，Floyd 路程关系推出 a 等价于从相遇点继续走到入口的距离。',
    bruteForce: '用集合记录首次访问节点，第一次重复的对象就是入口，空间 O(n)。',
    approach: ['快慢指针按二步和一步前进寻找相遇。', '若快指针到空，说明无环并返回 None。', '相遇后把一个指针重置到链表头。', '两个指针都改为每轮走一步。', '它们再次相遇的位置就是环入口，返回该节点。'],
    code: `from typing import Optional

class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                seeker = head
                while seeker is not slow:
                    seeker = seeker.next
                    slow = slow.next
                return seeker
        return None`,
    walkthrough: { input: '3→2→0→-4，-4 指回 2', steps: ['快慢指针进入环。', '两者在环内某节点首次相遇。', 'seeker 回到头 3，slow 留在相遇点。', '二者同速移动并在节点 2 汇合。'], result: '入口节点 2' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['首次快慢相遇点通常不是入口。', '第二阶段两个指针都必须每次只走一步。'], related: ['Floyd 判圈', '环入口推导'],
  },
  2: {
    id: 2, title: '两数相加',
    summary: '两个链表按低位在前表示非负整数，逐位相加并返回同样低位在前的新链表。',
    constraints: ['链表非空，每个节点值是 0 到 9。', '两数位数可不同，最高位运算后可能新增进位节点。'],
    examples: [{ input: 'l1 = 2→4→3, l2 = 5→6→4', output: '7→0→8', explanation: '链表分别表示 342 与 465，相加为 807。' }],
    intuition: '低位正好位于链表头，可像手算加法一样同步前进，用 carry 保存向下一位的进位。',
    bruteForce: '先把链表转换为整数、求和再转回链表，受大整数与位数限制且失去链表逐位优势。',
    approach: ['创建哑节点、尾指针和 carry=0。', '只要任一链表未结束或 carry 非零就继续。', '读取两侧当前值，不存在的一侧按 0 处理。', '用 divmod(total,10) 得到新进位和当前位。', '追加新节点并推进存在的输入指针，最后返回 dummy.next。'],
    code: `from typing import Optional

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode(0)
        carry = 0
        while l1 or l2 or carry:
            total = carry + (l1.val if l1 else 0) + (l2.val if l2 else 0)
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit); tail = tail.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next`,
    walkthrough: { input: '2→4→3 + 5→6→4', steps: ['个位 2+5=7，写 7。', '十位 4+6=10，写 0、进位 1。', '百位 3+4+1=8，写 8。', '两链与进位均结束，返回结果链。'], result: '7→0→8' },
    complexity: { time: 'O(max(m,n))。', space: 'O(max(m,n))，用于结果链表。' },
    pitfalls: ['循环条件必须包含 carry，防止漏掉最终进位。', 'divmod 返回顺序是商、余数，即 carry、digit。'], related: ['链表逐位运算', '进位模拟'],
  },

  19: {
    id: 19, title: '删除链表的倒数第 N 个结点',
    summary: '在一次主要扫描中删除单链表倒数第 n 个节点，并返回可能改变后的头节点。',
    constraints: ['n 合法且不超过链表长度。', '删除对象可能是头节点，因此需要统一处理边界。'],
    examples: [{ input: 'head = 1→2→3→4→5, n = 2', output: '1→2→3→5', explanation: '倒数第二个节点是 4，将其前驱直接连接到 5。' }],
    intuition: '让 fast 比 slow 领先 n 个节点；fast 到末尾时，slow 的后继就是待删节点。哑节点可把删头转化为普通删除。',
    bruteForce: '先遍历求长度，再走 length-n 步定位前驱，需要两次扫描。',
    approach: ['在头前创建 dummy，并令 slow、fast 都指向 dummy。', '让 fast 先向前走 n+1 步，建立固定间距。', 'slow 与 fast 同步前进直到 fast 为 None。', '此时 slow.next 是倒数第 n 个节点。', '令 slow.next 跳过该节点并返回 dummy.next。'],
    code: `from typing import Optional

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        slow = fast = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            slow = slow.next
            fast = fast.next
        slow.next = slow.next.next
        return dummy.next`,
    walkthrough: { input: '1→2→3→4→5, n=2', steps: ['dummy 接在 1 前面。', 'fast 先走 3 步到节点 3。', '两指针同步移动，fast 越过 5 时 slow 在 3。', 'slow 跳过后继 4，连接到 5。'], result: '1→2→3→5' },
    complexity: { time: 'O(L)。', space: 'O(1)。' },
    pitfalls: ['从 dummy 出发时 fast 应先走 n+1 步。', '不用 dummy 会额外处理删除头节点的情况。'], related: ['链表双指针', '固定间距'],
  },
  24: {
    id: 24, title: '两两交换链表中的节点',
    summary: '每两个相邻节点一组交换连接关系，不能只交换节点值；末尾单节点保持原位。',
    constraints: ['链表可为空或只有一个节点。', '要求修改 next 指针，节点值不应被改写。'],
    examples: [{ input: 'head = 1→2→3→4', output: '2→1→4→3', explanation: '节点对 (1,2) 与 (3,4) 分别交换。' }],
    intuition: '哑节点后的每一轮都有 prev→first→second，把它重连成 prev→second→first。',
    bruteForce: '复制值到数组、两两交换后重建链表，使用 O(n) 额外空间且没有复用节点。',
    approach: ['创建 dummy 指向 head，prev 指向 dummy。', '确认 prev 后至少还有两个节点。', '保存 first=prev.next 与 second=first.next。', '依次重连 prev.next、first.next、second.next。', '令 prev=first 进入下一对，结束后返回 dummy.next。'],
    code: `from typing import Optional

class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            first = prev.next
            second = first.next
            first.next = second.next
            second.next = first
            prev.next = second
            prev = first
        return dummy.next`,
    walkthrough: { input: '1→2→3', steps: ['prev 在 dummy，first=1、second=2。', '先令 1 指向 3。', '令 2 指向 1，再令 dummy 指向 2。', '剩余节点 3 不成对，结果为 2→1→3。'], result: '2→1→3' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['重连前先保存 second，避免丢失后续链。', 'prev 应移动到交换后的尾节点 first。'], related: ['链表重连', '哑节点'],
  },
  25: {
    id: 25, title: 'K 个一组翻转链表',
    summary: '每连续 k 个节点原地翻转，最后不足 k 个的部分保持原顺序。',
    constraints: ['k 为正且不大于链表长度。', '只能改变节点连接，不能只交换节点值。'],
    examples: [{ input: 'head = 1→2→3→4→5, k = 3', output: '3→2→1→4→5', explanation: '首组三个节点翻转，剩余两个不足一组而保留。' }],
    intuition: '每轮先确认第 k 个节点存在，再把 [groupPrev.next, kth] 这段反转，并接回前后两段。',
    bruteForce: '把节点放进数组后按块倒序重连，需要 O(n) 额外空间。',
    approach: ['dummy 指向头，group_prev 指向每组前驱。', '向后走 k 步寻找 kth；不存在则结束。', '保存 group_next=kth.next 作为反转后的边界。', '从组头开始，把 next 逐个改指向前驱，直到 group_next。', '把旧组头变成新组尾并更新 group_prev，继续下一组。'],
    code: `from typing import Optional

class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth: return dummy.next
            group_next = kth.next
            prev, cur = group_next, group_prev.next
            while cur is not group_next:
                nxt = cur.next
                cur.next = prev
                prev, cur = cur, nxt
            old_head = group_prev.next
            group_prev.next = kth
            group_prev = old_head`,
    walkthrough: { input: '1→2→3→4→5, k=2', steps: ['找到首组 kth=2，保存后继 3。', '反转 1、2 并接回 3，得到 2→1→3…。', '找到次组 kth=4，保存后继 5。', '反转 3、4；最后 5 不足两节点，停止。'], result: '2→1→4→3→5' },
    complexity: { time: 'O(n)。', space: 'O(1)。' },
    pitfalls: ['必须先确认整组长度达到 k，不能翻转残组。', '反转初始 prev 应是 group_next，才能自动接回后段。'], related: ['分组链表反转', '区间重连'],
  },
  138: {
    id: 138, title: '随机链表的复制',
    summary: '深拷贝含 next 与 random 两种指针的链表，新链中的所有指针都必须指向新节点。',
    constraints: ['random 可以为空，也可指向链表中任意节点或自身。', '不能让复制链与原链共享任何节点对象。'],
    examples: [{ input: '7→13，7.random=None，13.random=7', output: '结构与指向关系相同的新链', explanation: '新 13 的 random 指向新 7，而不是原 7。' }],
    intuition: '哈希表建立“原节点→新节点”映射后，next 与 random 都能通过同一映射被准确翻译。',
    bruteForce: '每处理一个 random 都从头查找目标下标，再在新链找对应节点，最坏 O(n²)。',
    approach: ['第一遍遍历原链，为每个原节点创建副本并存入映射。', '映射中额外放入 None→None，统一空指针处理。', '第二遍再次遍历原链。', '把副本的 next 设为 mapping[cur.next]。', '把副本的 random 设为 mapping[cur.random]，最后返回 mapping[head]。'],
    code: `from typing import Optional

class Solution:
    def copyRandomList(self, head: Optional['Node']) -> Optional['Node']:
        copies = {None: None}
        cur = head
        while cur:
            copies[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:
            copies[cur].next = copies[cur.next]
            copies[cur].random = copies[cur.random]
            cur = cur.next
        return copies[head]`,
    walkthrough: { input: 'A→B，A.random=B，B.random=B', steps: ['创建映射 A→A副本。', '创建映射 B→B副本。', '设置 A副本.next 和 random 都指向 B副本。', '设置 B副本.random 指向 B副本自身并返回新头。'], result: '独立的新链 A副本→B副本，随机关系保持一致' },
    complexity: { time: 'O(n)。', space: 'O(n)，原节点到副本的映射。' },
    pitfalls: ['random 必须通过映射连接，不能直接复制原指针。', '节点作为键按对象身份区分，不应按 val 建映射。'], related: ['深拷贝', '图节点映射'],
  },
  148: {
    id: 148, title: '排序链表',
    summary: '按升序排列单链表，利用归并排序适配链表的顺序访问特性。',
    constraints: ['链表可能为空，节点值可重复或为负数。', '目标时间 O(n log n)，尽量使用少量额外空间。'],
    examples: [{ input: 'head = 4→2→1→3', output: '1→2→3→4', explanation: '拆成短链排序后，再按节点值有序合并。' }],
    intuition: '快慢指针可在线性时间把链表二分；两个有序链表只需顺序比较即可合并。',
    bruteForce: '反复寻找剩余链中的最小节点，时间 O(n²)。',
    approach: ['空链或单节点链直接返回。', '用 slow、fast 找中点前驱并断开成左右两链。', '递归排序左半链。', '递归排序右半链。', '用哑节点线性合并两个有序链并返回新头。'],
    code: `from typing import Optional

class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next: return head
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next; fast = fast.next.next
        right = slow.next; slow.next = None
        left = self.sortList(head); right = self.sortList(right)
        dummy = tail = ListNode(0)
        while left and right:
            if left.val <= right.val:
                tail.next, left = left, left.next
            else:
                tail.next, right = right, right.next
            tail = tail.next
        tail.next = left or right
        return dummy.next`,
    walkthrough: { input: '4→2→1→3', steps: ['切成 4→2 与 1→3。', '两半继续拆成单节点。', '分别合并为 2→4 与 1→3。', '最终有序合并得到 1→2→3→4。'], result: '1→2→3→4' },
    complexity: { time: 'O(n log n)。', space: 'O(log n)，递归调用栈。' },
    pitfalls: ['二分后必须 slow.next=None，否则递归不会缩短。', 'fast 从 head.next 开始可让偶数长度均匀切分。'], related: ['链表归并排序', '有序链表合并'],
  },
  23: {
    id: 23, title: '合并 K 个升序链表',
    summary: '把 k 条各自升序的链表合并成一条升序链表，并复用原节点。',
    constraints: ['列表中可包含空链表。', '节点值可能相等，堆元素需要稳定且可比较。'],
    examples: [{ input: 'lists = [1→4→5, 1→3→4, 2→6]', output: '1→1→2→3→4→4→5→6', explanation: '每次从各链当前头中取最小节点接入结果。' }],
    intuition: '任一时刻全局最小剩余节点必在某条链的头部；最小堆只维护至多 k 个候选头。',
    bruteForce: '每次在线性扫描 k 个链头中选最小值，总时间 O(Nk)。',
    approach: ['把每条非空链的头以 (值,序号,节点) 压入最小堆。', '序号用于值相等时避免比较 ListNode。', '弹出堆顶并接到结果链尾。', '若该节点有后继，将后继连同新序号压入堆。', '堆空时终止并返回 dummy.next。'],
    code: `from typing import List, Optional
import heapq
from itertools import count

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        heap, ticket = [], count()
        for node in lists:
            if node: heapq.heappush(heap, (node.val, next(ticket), node))
        dummy = tail = ListNode(0)
        while heap:
            _, _, node = heapq.heappop(heap)
            tail.next = node; tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, next(ticket), node.next))
        return dummy.next`,
    walkthrough: { input: '[1→4, 1→3, 2]', steps: ['三个头节点 1、1、2 入堆。', '弹出首个 1，并把其后继 4 入堆。', '弹出另一个 1，再压入 3。', '依次弹出 2、3、4，结果有序。'], result: '1→1→2→3→4' },
    complexity: { time: 'O(N log k)，N 为节点总数。', space: 'O(k)，堆中至多每链一个节点。' },
    pitfalls: ['值相同时不能让 Python 直接比较 ListNode，应加入唯一序号。', '弹出节点后只压入它自己的后继。'], related: ['最小堆', '多路归并'],
  },
  146: {
    id: 146, title: 'LRU 缓存',
    summary: '设计固定容量缓存，使查询和写入都为 O(1)，容量满时淘汰最久未被使用的键。',
    constraints: ['capacity 为正整数。', 'get 不存在键返回 -1；get 命中和 put 更新都算一次最近使用。'],
    examples: [{ input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2)', output: '[null,null,null,1,null,-1]', explanation: 'get(1) 使键 1 最新；加入键 3 时淘汰最久未使用的键 2。' }],
    intuition: '哈希表负责 O(1) 定位，OrderedDict 的顺序负责记录新旧；访问后把键移到末端，首端就是淘汰对象。',
    bruteForce: '用普通列表按新旧排序，每次命中或更新都线性查找和移动，操作为 O(capacity)。',
    approach: ['构造时保存 capacity 与空 OrderedDict。', 'get 查键；缺失返回 -1。', 'get 命中后把键移动到末端并返回值。', 'put 若键已存在先覆盖；随后把它移动到末端表示最新。', '若长度超过容量，从首端弹出最旧键值对。'],
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        self.cache[key] = value
        self.cache.move_to_end(key)
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
    walkthrough: { input: 'capacity=2; put(1,1); put(2,2); get(1); put(3,3)', steps: ['写入 1，顺序为 [1]。', '写入 2，顺序为 [1,2]。', '读取 1 后顺序更新为 [2,1]。', '写入 3 超容，弹出首端 2，保留 [1,3]。'], result: 'get(2) 返回 -1，get(1) 返回 1' },
    complexity: { time: 'get 与 put 均为 O(1) 平均时间。', space: 'O(capacity)。' },
    pitfalls: ['更新已有键也必须刷新最近使用顺序。', '淘汰的是 OrderedDict 首端，popitem 必须传 last=False。'], related: ['哈希表加双向链表', '缓存淘汰策略'],
  },

  94: {
    id: 94, title: '二叉树的中序遍历',
    summary: '按左子树、根节点、右子树的次序返回二叉树节点值。',
    constraints: ['树可能为空或退化成链。', '节点值可重复，中序结果保留每个节点。'],
    examples: [{ input: 'root = [1,null,2,3]', output: '[1,3,2]', explanation: '先访问根 1，再访问右子树中较左的 3，最后访问 2。' }],
    intuition: '显式栈模拟递归调用：一路压入左链，无法再左移时弹栈访问，再转向右子树。',
    bruteForce: '递归写法直接但调用栈深度可能达到树高；它仍是正确基线而非低效时间方案。',
    approach: ['初始化空栈、空结果和 cur=root。', '只要 cur 存在，就把它压栈并转向左孩子。', 'cur 为空时弹出最近未访问节点。', '记录该节点值，再让 cur 转向其右孩子。', '栈和 cur 都为空时返回结果。'],
    code: `from typing import List, Optional

class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        ans, stack = [], []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            ans.append(cur.val)
            cur = cur.right
        return ans`,
    walkthrough: { input: '1(null, 2(3, null))', steps: ['压入节点 1，左侧为空。', '弹出并记录 1，转向右节点 2。', '压入 2 再压入其左节点 3。', '依次弹出记录 3、2。'], result: '[1,3,2]' },
    complexity: { time: 'O(n)。', space: 'O(h)，h 为树高。' },
    pitfalls: ['外层条件必须是 cur 或 stack 任一非空。', '访问节点后应转向右孩子，而不是继续使用已空的左孩子。'], related: ['深度优先遍历', '显式栈'],
  },
  104: {
    id: 104, title: '二叉树的最大深度',
    summary: '计算根节点到最远叶节点路径上的节点数量。',
    constraints: ['空树深度为 0，单节点树深度为 1。', '树可能高度不平衡。'],
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: '最长根叶路径如 3→20→15，共三个节点。' }],
    intuition: '一棵非空树的深度等于左右子树较大深度再加当前根这一层。',
    bruteForce: '层序遍历逐层计数同样是 O(n)，但需保存最宽一层；递归更直接。',
    approach: ['定义递归函数处理当前节点。', '若节点为空返回 0。', '递归计算左子树深度。', '递归计算右子树深度。', '返回 1+两者较大值，根调用即答案。'],
    code: `from typing import Optional

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
    walkthrough: { input: '[3,9,20,null,null,15,7]', steps: ['叶节点 9、15、7 各返回 1。', '节点 20 取左右最大 1，再加一得到 2。', '根 3 的左右深度为 1 与 2。', '根加一得到总深度 3。'], result: '3' },
    complexity: { time: 'O(n)。', space: 'O(h)，递归栈。' },
    pitfalls: ['深度按节点数定义，非空节点要加 1。', '不能只沿固定一侧走，必须取左右最大值。'], related: ['树递归', '后序计算'],
  },
  226: {
    id: 226, title: '翻转二叉树',
    summary: '对每个节点交换左右子树，得到原树的镜像。',
    constraints: ['树可能为空。', '要求返回翻转后的根，允许原地修改节点连接。'],
    examples: [{ input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: '根和每个后代节点的左右孩子都被交换。' }],
    intuition: '镜像操作在每个节点上都相同：交换左右孩子，再递归处理两个新子树。',
    bruteForce: '创建一棵全新的镜像树可行，但需 O(n) 新节点空间。',
    approach: ['递归函数接收当前根。', '空节点直接返回 None。', '交换当前节点的 left 与 right。', '递归翻转交换后的左子树。', '递归翻转交换后的右子树并返回当前根。'],
    code: `from typing import Optional

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root`,
    walkthrough: { input: '[2,1,3]', steps: ['在根 2 交换孩子 1 与 3。', '递归到新左叶 3。', '叶节点的两个空孩子交换后不变。', '递归处理叶 1，最终根结构为 2,3,1。'], result: '[2,3,1]' },
    complexity: { time: 'O(n)。', space: 'O(h)，递归栈。' },
    pitfalls: ['只交换根节点不够，所有后代都需处理。', '交换后递归新左右子树，不能因引用混淆漏掉一侧。'], related: ['树的镜像', '前序递归'],
  },
  101: {
    id: 101, title: '对称二叉树',
    summary: '判断二叉树是否关于根的垂直轴镜像对称。',
    constraints: ['空树和单节点树对称。', '对称要求结构与对应节点值都一致。'],
    examples: [{ input: 'root = [1,2,2,3,4,4,3]', output: 'true', explanation: '左子树的外侧/内侧分别与右子树的外侧/内侧镜像对应。' }],
    intuition: '比较的不是两棵树相同位置，而是镜像位置：左.left 对右.right，左.right 对右.left。',
    bruteForce: '复制并翻转一侧后再比较，需要额外构造树。',
    approach: ['定义 mirror(left,right) 比较一对镜像节点。', '两者都空返回 True，只有一个为空返回 False。', '值不同立即返回 False。', '递归比较 left.left 与 right.right。', '递归比较 left.right 与 right.left，两组都真才对称。'],
    code: `from typing import Optional

class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def mirror(a, b):
            if not a or not b:
                return a is b
            return (a.val == b.val and
                    mirror(a.left, b.right) and
                    mirror(a.right, b.left))
        return mirror(root.left, root.right) if root else True`,
    walkthrough: { input: '[1,2,2,3,4,4,3]', steps: ['先比较根的两个值 2。', '比较左外侧 3 与右外侧 3。', '比较左内侧 4 与右内侧 4。', '所有对应空孩子也成对出现，返回真。'], result: 'true' },
    complexity: { time: 'O(n)。', space: 'O(h)。' },
    pitfalls: ['镜像比较的孩子方向必须交叉。', '值相等但一个节点缺失仍不对称。'], related: ['镜像递归', '双树比较'],
  },
  543: {
    id: 543, title: '二叉树的直径',
    summary: '求二叉树任意两节点间最长路径的边数，路径不一定经过根。',
    constraints: ['空树直径为 0。', '直径按边数计算，而递归高度可按节点数计算。'],
    examples: [{ input: 'root = [1,2,3,4,5]', output: '3', explanation: '路径 4→2→1→3 或 5→2→1→3 含三条边。' }],
    intuition: '对每个节点，经过它的最长路径等于左子树高度加右子树高度；后序遍历能同时返回高度并更新全局直径。',
    bruteForce: '对每个节点再单独计算左右高度，会重复遍历子树，最坏 O(n²)。',
    approach: ['初始化 best=0。', '定义 depth(None)=0。', '后序计算当前节点左右子树深度。', '用 left+right 更新经过当前节点的最大边数。', '向父节点返回 1+max(left,right)，遍历完成后返回 best。'],
    code: `from typing import Optional

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0
        def depth(node):
            nonlocal best
            if not node: return 0
            left = depth(node.left)
            right = depth(node.right)
            best = max(best, left + right)
            return 1 + max(left, right)
        depth(root)
        return best`,
    walkthrough: { input: '[1,2,3,4,5]', steps: ['叶 4、5、3 返回深度 1。', '节点 2 的左右深度和为 2，更新直径 2。', '节点 2 向根返回深度 2。', '根处 2+1=3，最终直径为 3。'], result: '3' },
    complexity: { time: 'O(n)。', space: 'O(h)。' },
    pitfalls: ['答案是边数，left+right 无需再加 1。', '最长路径可能完全位于某棵子树，必须在每个节点更新。'], related: ['树形动态规划', '后序遍历'],
  },
  108: {
    id: 108, title: '将有序数组转换为二叉搜索树',
    summary: '把升序数组构造成高度平衡的二叉搜索树，使每个节点左右子树高度差不超过一。',
    constraints: ['数组严格递增，可为空。', '只需返回任一合法的平衡 BST。'],
    examples: [{ input: 'nums = [-10,-3,0,5,9]', output: '[0,-3,9,-10,null,5]', explanation: '选择中点 0 为根，左右区间继续选中点，树保持平衡且中序有序。' }],
    intuition: '每次选择有序区间中点为根，可让左右元素数量尽可能接近；左段、右段天然分别属于左右子树。',
    bruteForce: '依次插入 BST 可能因升序输入退化成高度 n 的链。',
    approach: ['定义 build(left,right) 构造闭区间。', 'left>right 时返回 None。', '取 mid=(left+right)//2 并创建根节点。', '递归用左半区间构造 root.left。', '递归用右半区间构造 root.right，返回根。'],
    code: `from typing import List, Optional

class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        def build(left, right):
            if left > right: return None
            mid = (left + right) // 2
            root = TreeNode(nums[mid])
            root.left = build(left, mid - 1)
            root.right = build(mid + 1, right)
            return root
        return build(0, len(nums) - 1)`,
    walkthrough: { input: '[-10,-3,0,5,9]', steps: ['全区间中点值 0 成为根。', '左区间中点 -10 或 -3 构造左子树。', '右区间中点 5 或 9 构造右子树。', '递归空区间停止，各层规模接近。'], result: '一棵中序为 [-10,-3,0,5,9] 的高度平衡 BST' },
    complexity: { time: 'O(n)。', space: 'O(log n)，平衡递归栈。' },
    pitfalls: ['递归区间应排除已使用的 mid。', '选择端点为根会破坏高度平衡。'], related: ['分治构树', '二叉搜索树'],
  },
  98: {
    id: 98, title: '验证二叉搜索树',
    summary: '判断整棵二叉树是否满足每个节点严格大于左子树所有值且严格小于右子树所有值。',
    constraints: ['节点值可能达到整数边界。', '重复值不允许出现在有效 BST 中。'],
    examples: [{ input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: '值 3 位于根 5 的右子树，却小于 5，违反祖先范围。' }],
    intuition: '局部比较孩子不够；从祖先继承允许区间 (low,high)，每深入一层就收紧一侧边界。',
    bruteForce: '为每个节点扫描左子树最大值和右子树最小值，最坏 O(n²)。',
    approach: ['递归函数接收 node、low、high。', '空节点返回 True。', '若 node.val 不严格位于开区间内，返回 False。', '左子树继承 low，并把 high 收紧为当前值。', '右子树把 low 收紧为当前值并继承 high；两侧均有效才返回 True。'],
    code: `from typing import Optional

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def valid(node, low, high):
            if not node: return True
            if not (low < node.val < high): return False
            return (valid(node.left, low, node.val) and
                    valid(node.right, node.val, high))
        return valid(root, float('-inf'), float('inf'))`,
    walkthrough: { input: '[5,1,4,null,null,3,6]', steps: ['根 5 位于无限区间。', '左节点 1 位于 (-∞,5)，合法。', '右节点 4 需位于 (5,+∞)，但 4 小于 5。', '立即判定整树不是 BST。'], result: 'false' },
    complexity: { time: 'O(n)。', space: 'O(h)。' },
    pitfalls: ['只比较父子值会漏掉违反更高祖先边界的节点。', '边界必须严格，等值节点也应判无效。'], related: ['BST 中序单调性', '上下界递归'],
  },

  230: {
    id: 230, title: '二叉搜索树中第 K 小的元素',
    summary: '利用二叉搜索树的有序性质，找出按值升序排列后的第 k 个节点值。',
    constraints: ['k 从 1 开始且不超过节点总数。', '输入是一棵有效 BST，节点值通常互不相同。'],
    examples: [{ input: 'root = [3,1,4,null,2], k = 1', output: '1', explanation: '中序序列为 [1,2,3,4]，第一个元素是 1。' }],
    intuition: 'BST 的中序遍历天然升序；使用显式栈可在弹出第 k 个节点时提前停止，无需生成完整数组。',
    bruteForce: '遍历全部节点、收集后排序再取第 k 个，时间 O(n log n)、空间 O(n)。',
    approach: ['初始化空栈和 cur=root。', '沿左孩子一路压栈，直到为空。', '弹出当前最小的未访问节点。', 'k 减一；若 k 变为零，返回节点值。', '否则转向该节点右子树并重复。'],
    code: `from typing import Optional

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack, cur = [], root
        while True:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            k -= 1
            if k == 0: return cur.val
            cur = cur.right`,
    walkthrough: { input: 'root=[3,1,4,null,2], k=3', steps: ['沿左链压入 3、1。', '弹出 1，k 变 2，再访问其右子树。', '弹出 2，k 变 1。', '弹出 3，k 变 0，返回 3。'], result: '3' },
    complexity: { time: 'O(h+k)，可在第 k 个节点提前结束。', space: 'O(h)。' },
    pitfalls: ['k 是 1-based，弹出节点后再减一。', '必须在访问节点后转向其右子树。'], related: ['BST 中序遍历', '顺序统计'],
  },
  199: {
    id: 199, title: '二叉树的右视图',
    summary: '返回从树右侧观察时每一层能看到的最右节点值。',
    constraints: ['空树返回空列表。', '结构不完整时，可见节点不一定沿着一条纯右链。'],
    examples: [{ input: 'root = [1,2,3,null,5,null,4]', output: '[1,3,4]', explanation: '三层最右可见节点分别为 1、3、4。' }],
    intuition: '层序遍历天然分层；每层队列中最后处理的节点就是这一层最右节点。',
    bruteForce: '先收集每层全部节点值再取末项，仍为 O(n) 但保存了不必要的完整层结果。',
    approach: ['若根为空返回空列表。', '用队列保存当前待访问节点。', '每轮先记录当前层节点数。', '依次弹出这一层，并把非空孩子入队。', '当本层下标等于 size-1 时记录该节点值，重复至队列为空。'],
    code: `from typing import List, Optional
from collections import deque

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans, queue = [], deque([root])
        while queue:
            size = len(queue)
            for i in range(size):
                node = queue.popleft()
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
                if i == size - 1: ans.append(node.val)
        return ans`,
    walkthrough: { input: '[1,2,3,null,5,null,4]', steps: ['第一层只有 1，记录 1。', '第二层依次处理 2、3，记录末项 3。', '它们的下一层有效孩子为 5、4。', '第三层末项是 4，队列随后为空。'], result: '[1,3,4]' },
    complexity: { time: 'O(n)。', space: 'O(w)，w 为最大层宽。' },
    pitfalls: ['每层开始时固定 size，不能让新入队孩子混入当前层。', '不能只沿 right 指针走，缺右孩子时左后代也可能可见。'], related: ['层序遍历', '按层聚合'],
  },
  114: {
    id: 114, title: '二叉树展开为链表',
    summary: '把二叉树原地展开成仅使用 right 指针的先序遍历链，所有 left 指针置空。',
    constraints: ['不能创建替代整棵树的新节点链。', '展开顺序必须为根、左、右。'],
    examples: [{ input: 'root = [1,2,5,3,4,null,6]', output: '1→2→3→4→5→6（均为 right）', explanation: '结果节点次序等于原树先序遍历。' }],
    intuition: '反向先序按右、左、根递归，用 prev 保存已展开链头；当前节点的 right 指向 prev，恰好不断前插。',
    bruteForce: '先序遍历收集所有节点，再第二遍重连，需要 O(n) 节点数组。',
    approach: ['初始化 prev=None。', '递归函数先处理右子树。', '再处理左子树，确保 prev 是当前节点先序后继。', '令当前节点 right=prev。', '令 left=None，并更新 prev=当前节点；根调用结束即完成。'],
    code: `from typing import Optional

class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        prev = None
        def visit(node):
            nonlocal prev
            if not node: return
            visit(node.right)
            visit(node.left)
            node.right = prev
            node.left = None
            prev = node
        visit(root)`,
    walkthrough: { input: '[1,2,5,3,4,null,6]', steps: ['反向先序先处理最右节点 6。', '节点 5 的 right 接到 6。', '再逆序处理左子树中的 4、3、2，逐个前插。', '最后根 1 接到 2，形成完整先序链。'], result: '1→2→3→4→5→6' },
    complexity: { time: 'O(n)。', space: 'O(h)，递归栈。' },
    pitfalls: ['普通先序直接改指针容易丢失原右子树。', '每个节点的 left 都必须显式设为 None。'], related: ['反向先序', '树的原地重连'],
  },
  105: {
    id: 105, title: '从前序与中序遍历序列构造二叉树',
    summary: '根据同一棵无重复值二叉树的前序和中序序列还原唯一结构。',
    constraints: ['两个序列长度一致且包含相同的不重复值。', '前序首元素是当前子树根，中序根两侧分别属于左右子树。'],
    examples: [{ input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]', explanation: '前序确定根 3，中序把剩余节点分成 [9] 与 [15,20,7]。' }],
    intuition: '用哈希表 O(1) 查根在中序中的位置，再按中序区间递归；前序指针始终给出下一棵子树的根。',
    bruteForce: '每层都在线性中序切片中寻找根并复制子数组，偏斜树最坏 O(n²)。',
    approach: ['建立中序值到下标的映射。', '设置 preorder 下标 pre=0。', 'build(left,right) 空区间返回 None。', '取 preorder[pre] 建根并推进 pre，在中序映射中定位 mid。', '先构造 [left,mid-1] 左子树，再构造 [mid+1,right] 右子树并返回根。'],
    code: `from typing import List, Optional

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        position = {value: i for i, value in enumerate(inorder)}
        pre = 0
        def build(left, right):
            nonlocal pre
            if left > right: return None
            value = preorder[pre]; pre += 1
            root = TreeNode(value)
            mid = position[value]
            root.left = build(left, mid - 1)
            root.right = build(mid + 1, right)
            return root
        return build(0, len(inorder) - 1)`,
    walkthrough: { input: 'pre=[3,9,20,15,7], in=[9,3,15,20,7]', steps: ['前序首值 3 建根，中序下标为 1。', '左区间只有 9，建立左叶。', '右区间根由下一前序值 20 确定。', '20 的中序左右值 15、7 分别建为孩子。'], result: '[3,9,20,null,null,15,7]' },
    complexity: { time: 'O(n)。', space: 'O(n)，映射与递归栈。' },
    pitfalls: ['必须先构造左子树，因为前序在根后先列左子树。', '若值可重复，单一值到下标映射不足；本题依赖值唯一。'], related: ['遍历序列构树', '分治'],
  },
  437: {
    id: 437, title: '路径总和 III',
    summary: '统计二叉树中向下连续路径和等于目标值的条数，路径可从任意节点开始和结束。',
    constraints: ['路径只能从父到子，但不必经过根或到达叶子。', '节点值可为负数，因此不能用和过大就剪枝。'],
    examples: [{ input: 'root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8', output: '3', explanation: '三条路径分别为 5→3、5→2→1、-3→11。' }],
    intuition: '当前根到节点前缀和为 s，祖先路径中每个前缀 s-target 都对应一条以当前节点结尾的目标路径。',
    bruteForce: '以每个节点为起点再向下枚举路径，偏斜树最坏 O(n²)。',
    approach: ['哈希表初始化前缀和 0 的次数为 1。', 'DFS 到节点时累加当前前缀和。', '把 count[prefix-target] 加入答案。', '登记当前 prefix 后递归左右孩子。', '离开节点时撤销当前 prefix 的次数，避免把另一分支当祖先。'],
    code: `from typing import Optional

class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        seen = {0: 1}
        def dfs(node, prefix):
            if not node: return 0
            prefix += node.val
            total = seen.get(prefix - targetSum, 0)
            seen[prefix] = seen.get(prefix, 0) + 1
            total += dfs(node.left, prefix) + dfs(node.right, prefix)
            seen[prefix] -= 1
            return total
        return dfs(root, 0)`,
    walkthrough: { input: '根 10，左路径 10→5→3，target=8', steps: ['根处前缀 10，登记一次。', '到 5 前缀 15，登记一次。', '到 3 前缀 18，查询 18-8=10。', '祖先前缀 10 出现一次，因此计入路径 5→3；回溯时撤销 18。'], result: '该分支贡献 1 条目标路径' },
    complexity: { time: 'O(n) 期望时间。', space: 'O(h) 到 O(n)，前缀表与递归栈。' },
    pitfalls: ['回溯离开节点时必须减去当前前缀计数。', '初始化 seen[0]=1 才能统计从根开始的路径。'], related: ['树上前缀和', 'DFS 回溯'],
  },
  236: {
    id: 236, title: '二叉树的最近公共祖先',
    summary: '在普通二叉树中找出同时是节点 p、q 祖先且深度最大的节点，节点也可作为自己的祖先。',
    constraints: ['p、q 均存在于树中且是不同节点。', '二叉树不具备 BST 的大小关系。'],
    examples: [{ input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1', output: '3', explanation: '5 与 1 分居根 3 两侧，因此根是最近公共祖先。' }],
    intuition: '后序递归向上汇报是否找到目标；若左右子树各返回一个非空目标，当前节点就是它们首次汇合处。',
    bruteForce: '分别记录根到 p、q 的完整路径，再寻找最后一个共同节点，需要额外 O(n) 存储。',
    approach: ['空节点返回 None；当前节点等于 p 或 q 时返回自身。', '递归在左子树寻找 p 或 q。', '递归在右子树寻找 p 或 q。', '若左右返回均非空，说明目标分居两侧，返回当前节点。', '否则返回唯一非空结果，向祖先传播目标或已找到的祖先。'],
    code: `from typing import Optional

class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
        if not root or root is p or root is q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root
        return left or right`,
    walkthrough: { input: '根 3，p=5，q=4（4 在 5 的子树中）', steps: ['递归到节点 5 时命中 p，直接向上返回 5。', '不必要求继续把 q 单独汇报到 5 之上。', '根的另一侧找不到目标，返回 None。', '根最终传播唯一非空结果 5，它也是 q 的祖先。'], result: '节点 5' },
    complexity: { time: 'O(n)。', space: 'O(h)。' },
    pitfalls: ['比较的是节点身份，不是节点值。', '不能使用 BST 的大小方向来搜索普通二叉树。'], related: ['后序汇报', '树上公共祖先'],
  },
  124: {
    id: 124, title: '二叉树中的最大路径和',
    summary: '求二叉树任意非空路径的最大节点值之和；路径相邻节点相连，且每个节点最多出现一次。',
    constraints: ['节点值可全部为负数，答案不能默认取 0。', '向父节点延伸的路径只能选择当前节点的一侧子树。'],
    examples: [{ input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: '路径 15→20→7 的和为 42，大于经过根 -10 的候选。' }],
    intuition: '每个节点可形成“左增益+节点+右增益”的完整路径更新答案，但向父节点只能返回节点加左右较大的一条增益。',
    bruteForce: '枚举路径端点并重复寻找节点间路径，最坏可达 O(n³)。',
    approach: ['全局 best 初始化为负无穷，保证全负树正确。', '后序递归得到左右子树可向上贡献的最大增益。', '负增益取 0，表示不选该分支。', '用 node.val+left+right 更新经过当前节点的完整路径。', '向父节点返回 node.val+max(left,right)，遍历完返回 best。'],
    code: `from typing import Optional

class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = float('-inf')
        def gain(node):
            nonlocal best
            if not node: return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            best = max(best, node.val + left + right)
            return node.val + max(left, right)
        gain(root)
        return best`,
    walkthrough: { input: '[-10,9,20,null,null,15,7]', steps: ['叶 9、15、7 分别向上返回自身正增益。', '节点 20 用 20+15+7=42 更新全局答案。', '节点 20 向根只能返回 20+15=35。', '根候选为 -10+9+35=34，未超过 42。'], result: '42' },
    complexity: { time: 'O(n)。', space: 'O(h)。' },
    pitfalls: ['全负树下 best 不能初始化为 0。', '向父节点不能同时携带左右两支，否则路径会在父处产生分叉。'], related: ['树形动态规划', '最大贡献值'],
  },
};
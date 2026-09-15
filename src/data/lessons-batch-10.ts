import type { Lesson } from './lessons';

export const lessonsBatch10: Record<number, Lesson> = {
  383: {
    id: 383, title: '赎金信', summary: '判断能否从杂志字符串中逐个取字符拼出赎金信；每个字符位置最多使用一次。',
    constraints: ['两个字符串只含小写英文字母。', 'magazine 中同一字符的可用次数不能被重复消费。'],
    examples: [{ input: 'ransomNote = "aa", magazine = "aab"', output: 'true', explanation: '杂志里有两个 a，足以组成目标。' }],
    intuition: '问题只关心字符库存，不关心顺序。先统计 magazine，再逐字扣减 ransomNote；任何库存变负都说明无法构造。',
    bruteForce: '对目标中的每个字符在线性容器中寻找并删除，最坏需要 O(nm) 时间。',
    approach: ['统计 magazine 中每个字符的出现次数。', '遍历 ransomNote，消费对应字符一次。', '若消费前库存为零则立即返回 false。', '全部字符消费成功后返回 true。'],
    code: `class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        count = [0] * 26
        for ch in magazine:
            count[ord(ch) - ord('a')] += 1
        for ch in ransomNote:
            i = ord(ch) - ord('a')
            if count[i] == 0:
                return False
            count[i] -= 1
        return True`,
    walkthrough: { input: 'ransomNote="aa", magazine="aab"', steps: ['统计得到 a 有 2 个、b 有 1 个。', '依次消费目标中的两个 a，库存变为 0。', '遍历结束且未出现短缺。'], result: '返回 true。' },
    complexity: { time: 'O(n+m)，分别扫描两个字符串。', space: 'O(1)，固定 26 个计数槽。' },
    pitfalls: ['不能只比较字符集合，必须比较次数。', '应统计 magazine 而不是先消费后再猜测缺口。'], related: ['242 有效的字母异位词', '哈希计数'],
  },
  386: {
    id: 386, title: '字典序排数', summary: '按字符串字典序返回 1 到 n 的所有整数，同时避免把全部数字转成字符串后排序。',
    constraints: ['n 为正整数，答案必须包含 1 到 n 恰好一次。', '期望 O(n) 时间并只使用常数级额外状态（不计输出）。'],
    examples: [{ input: 'n = 13', output: '[1,10,11,12,13,2,3,4,5,6,7,8,9]', explanation: '以 1 为前缀的数字排在 2 之前。' }],
    intuition: '字典序对应一棵十叉前缀树的先序遍历：优先乘 10 下探；无法下探时不断去掉末位，再转向下一个兄弟。',
    bruteForce: '生成 1..n，转为字符串排序后再转回整数，需 O(n log n) 时间和 O(n) 额外空间。',
    approach: ['从当前数字 cur=1 开始，共输出 n 次。', '若 cur*10<=n，乘 10 进入最小子节点。', '否则在末位为 9 或下一个数越界时不断除以 10 回退。', '回退完成后令 cur 加一，访问下一个兄弟。'],
    code: `class Solution:
    def lexicalOrder(self, n: int) -> List[int]:
        ans, cur = [], 1
        for _ in range(n):
            ans.append(cur)
            if cur * 10 <= n:
                cur *= 10
            else:
                while cur % 10 == 9 or cur + 1 > n:
                    cur //= 10
                cur += 1
        return ans`,
    walkthrough: { input: 'n=13', steps: ['输出 1 后下探到 10。', '依次转向 11、12、13，13 已无后继子节点。', '从 13 回退到 1，再转向 2，之后继续。'], result: '得到从 1 开始的完整字典序序列。' },
    complexity: { time: 'O(n)，每个整数输出一次，回退总次数受遍历规模约束。', space: 'O(1)，不计答案数组。' },
    pitfalls: ['越界时可能要连续回退多层。', '末位为 9 时不能直接加一，否则字典序跳转错误。'], related: ['前缀树', '440 字典序的第 K 小数字'],
  },
  387: {
    id: 387, title: '字符串中的第一个唯一字符', summary: '返回字符串中最靠左且只出现一次的字符下标；若不存在则返回 -1。',
    constraints: ['字符串只含小写英文字母。', '“第一个”按原字符串下标判断，而非字母大小。'],
    examples: [{ input: 's = "loveleetcode"', output: '2', explanation: '字符 v 只出现一次，且是最早满足条件的位置。' }],
    intuition: '一次扫描无法知道字符以后是否重复，因此先获得全局频次，再按原顺序寻找首个频次为一的位置。',
    bruteForce: '对每个位置重新扫描整个字符串统计对应字符，最坏 O(n²)。',
    approach: ['建立 26 长度计数数组。', '第一次遍历累计每个字符频次。', '第二次按下标从左到右检查频次。', '遇到频次 1 立即返回，否则最终返回 -1。'],
    code: `class Solution:
    def firstUniqChar(self, s: str) -> int:
        count = [0] * 26
        for ch in s:
            count[ord(ch) - 97] += 1
        for i, ch in enumerate(s):
            if count[ord(ch) - 97] == 1:
                return i
        return -1`,
    walkthrough: { input: 's="loveleetcode"', steps: ['第一遍统计所有字母次数。', '下标 0 的 l 与下标 1 的 o 都重复。', '下标 2 的 v 频次为 1，立即停止。'], result: '返回 2。' },
    complexity: { time: 'O(n)，最多扫描两遍。', space: 'O(1)，字符集大小固定。' },
    pitfalls: ['只统计集合无法区分出现一次与多次。', '答案要求原下标，不能对字符串排序。'], related: ['383 赎金信', '哈希计数'],
  },
  389: {
    id: 389, title: '找不同', summary: '字符串 t 由 s 打乱后额外加入一个字符，找出这个新增字符。',
    constraints: ['t 比 s 恰好多一个字符。', '字符可能重复，顺序不提供对应关系。'],
    examples: [{ input: 's = "abcd", t = "abcde"', output: '"e"', explanation: '两边公共字符抵消后只剩新增的 e。' }],
    intuition: '相同整数异或为零且异或满足交换律，把两串所有字符编码异或后，公共部分完全抵消，只留下新增字符。',
    bruteForce: '排序两个字符串后逐位比较可找到差异，但需要 O(n log n) 时间和额外存储。',
    approach: ['初始化异或累积值为 0。', '遍历 s，把每个字符编码异或进去。', '遍历 t，以相同方式继续异或。', '将最终编码转换回字符并返回。'],
    code: `class Solution:
    def findTheDifference(self, s: str, t: str) -> str:
        value = 0
        for ch in s:
            value ^= ord(ch)
        for ch in t:
            value ^= ord(ch)
        return chr(value)`,
    walkthrough: { input: 's="abcd", t="abcde"', steps: ['把 s 中 a、b、c、d 的编码异或。', '再异或 t，a 到 d 各出现两次而归零。', '累积值只剩 e 的编码。'], result: '返回 "e"。' },
    complexity: { time: 'O(n)，n 为两串总长度。', space: 'O(1)。' },
    pitfalls: ['异或对象应是字符编码而非字符串本身。', '计数差也可行，但不要假设新增字符未在 s 中出现过。'], related: ['136 只出现一次的数字', '位运算'],
  },
  393: {
    id: 393, title: 'UTF-8 编码验证', summary: '检查整数数组的低 8 位能否组成合法 UTF-8 字节序列，确保每个字符头字节与后续字节数量匹配。',
    constraints: ['每个整数只按最低 8 位解释，输入值位于 0 到 255。', '合法字符占 1 到 4 字节，续字节必须以二进制 10 开头。'],
    examples: [{ input: 'data = [197,130,1]', output: 'true', explanation: '197 以 110 开头，130 是合法续字节，1 是单字节字符。' }],
    intuition: '维护当前还需要多少个续字节。需要为零时识别头部前缀；需要大于零时只接受 10xxxxxx，并逐个倒计数。',
    bruteForce: '把每个数转成八位二进制字符串再做前缀切片，逻辑可行但产生不必要的字符串和转换。',
    approach: ['用 need 表示尚欠的续字节数。', 'need 为零时按位掩码识别 0、110、1110 或 11110 前缀。', 'need 大于零时验证当前字节最高两位为 10。', '遍历结束后仅当 need 恰为零才合法。'],
    code: `class Solution:
    def validUtf8(self, data: List[int]) -> bool:
        need = 0
        for byte in data:
            if need:
                if byte >> 6 != 0b10:
                    return False
                need -= 1
            elif byte >> 7 == 0:
                continue
            elif byte >> 5 == 0b110:
                need = 1
            elif byte >> 4 == 0b1110:
                need = 2
            elif byte >> 3 == 0b11110:
                need = 3
            else:
                return False
        return need == 0`,
    walkthrough: { input: 'data=[197,130,1]', steps: ['197 的前三位为 110，因此记录还需 1 个续字节。', '130 的最高两位为 10，need 降为 0。', '1 的最高位为 0，作为独立单字节字符。'], result: '所有字节恰好配对，返回 true。' },
    complexity: { time: 'O(n)，每个字节检查一次。', space: 'O(1)。' },
    pitfalls: ['结尾 need>0 表示字符被截断，必须判 false。', '11111xxx 不是合法 UTF-8 起始前缀。'], related: ['位掩码', '状态机'],
  },
  396: {
    id: 396, title: '旋转函数', summary: '数组每次循环右移后，计算下标与元素乘积之和，返回所有旋转状态中的最大值。',
    constraints: ['数组可以包含负数，长度至少为 1。', '第 k 次旋转把原数组末尾元素依次移到开头。'],
    examples: [{ input: 'nums = [4,3,2,6]', output: '26', explanation: '旋转为 [3,2,6,4] 时加权和 0×3+1×2+2×6+3×4=26。' }],
    intuition: '相邻旋转的加权和无需重算：整体下标加一贡献总和，被移到开头的元素原本多算了 n 倍，因此 F(k)=F(k-1)+sum-n×移入元素。',
    bruteForce: '显式生成 n 次旋转并各用 O(n) 计算加权和，总时间 O(n²)。',
    approach: ['计算元素总和 total 与初始 F(0)。', '按从数组末尾向前的顺序确定每次移到开头的元素。', '用递推式更新当前旋转函数值。', '每次更新全局最大值并最终返回。'],
    code: `class Solution:
    def maxRotateFunction(self, nums: List[int]) -> int:
        n = len(nums)
        total = sum(nums)
        current = sum(i * x for i, x in enumerate(nums))
        best = current
        for k in range(1, n):
            current += total - n * nums[n - k]
            best = max(best, current)
        return best`,
    walkthrough: { input: 'nums=[4,3,2,6]', steps: ['计算 total=15、F(0)=25。', '把 6 移到开头：F(1)=25+15-4×6=16。', '继续递推其余旋转并比较，最大值更新为 26。'], result: '返回 26。' },
    complexity: { time: 'O(n)，初始化和递推各扫描一次。', space: 'O(1)。' },
    pitfalls: ['递推中减去的是本轮移到开头的原数组元素。', '最大值初始应为 F(0)，不能设为 0，因为答案可能为负。'], related: ['数组旋转', '数学递推'],
  },
  397: {
    id: 397, title: '整数替换', summary: '把正整数通过偶数除以 2、奇数加一或减一变到 1，求最少操作次数。',
    constraints: ['输入是正整数，奇数时只能选择加一或减一。', '加一可能暂时超过 32 位有符号范围，实现不应溢出。'],
    examples: [{ input: 'n = 8', output: '3', explanation: '8→4→2→1。' }],
    intuition: '偶数唯一选择是减半；奇数应尽量选择能制造更多末尾零的方向，以便连续除二。例外 n=3，减一只需两步，比加一更短。',
    bruteForce: '对每个奇数同时递归 n-1 和 n+1；若不记忆会重复探索并形成庞大搜索树。',
    approach: ['当 n 为偶数时直接右移一位。', '奇数 n=3 时选择减一。', '其他奇数若倒数第二位为 1，则加一制造更多尾零。', '否则减一；每轮累计一步直到 n=1。'],
    code: `class Solution:
    def integerReplacement(self, n: int) -> int:
        steps = 0
        while n != 1:
            if n % 2 == 0:
                n //= 2
            elif n == 3 or n % 4 == 1:
                n -= 1
            else:
                n += 1
            steps += 1
        return steps`,
    walkthrough: { input: 'n=7', steps: ['7 为奇数且模 4 等于 3，选择加一到 8。', '8 连续除以 2，经过 4、2。', '2 再除以 2 到达 1，共 4 步。'], result: '返回 4。' },
    complexity: { time: 'O(log n)，数值整体按位缩短。', space: 'O(1)。' },
    pitfalls: ['n=3 是贪心规则的特殊例外。', '固定宽度语言要防止最大整数执行加一溢出。'], related: ['位运算', '贪心'],
  },
  400: {
    id: 400, title: '第 N 位数字', summary: '在无限串 123456789101112… 中找到从 1 开始计数的第 n 个数字。',
    constraints: ['n 为正整数，位置按单个十进制数字计数。', '答案是 0 到 9 的一个数字，而不是所在整数。'],
    examples: [{ input: 'n = 11', output: '0', explanation: '第 10、11 位来自数字 10，第二位是 0。' }],
    intuition: '按位数分组：一位数贡献 9 位，两位数贡献 90×2 位。先跳过完整分组，再通过商和余数定位具体整数及其内部下标。',
    bruteForce: '不断拼接正整数直到长度达到 n，会创建规模 O(n) 的字符串并做大量转换。',
    approach: ['维护当前位数 digits、组起点 start 和数字个数 count。', '当 n 超过整组贡献时扣除 digits×count 并进入下一组。', '用 (n-1)//digits 定位目标整数。', '用 (n-1)%digits 取该整数中的目标字符。'],
    code: `class Solution:
    def findNthDigit(self, n: int) -> int:
        digits, start, count = 1, 1, 9
        while n > digits * count:
            n -= digits * count
            digits += 1
            start *= 10
            count *= 10
        number = start + (n - 1) // digits
        return int(str(number)[(n - 1) % digits])`,
    walkthrough: { input: 'n=11', steps: ['跳过 9 个一位数字后，组内位置变为 2。', '在两位数组中定位到 start+(2-1)//2=10。', '组内字符下标为 (2-1)%2=1，取到 0。'], result: '返回 0。' },
    complexity: { time: 'O(log n)，按十进制位数组跳组。', space: 'O(log n)，仅最后把目标整数转为短字符串；数值状态为 O(1)。' },
    pitfalls: ['定位公式必须使用 n-1 处理整除边界。', '每组贡献是数字个数乘以每个数字的位数。'], related: ['数学分组', '字典序定位'],
  },
  401: {
    id: 401, title: '二进制手表', summary: '枚举二进制手表上恰好点亮指定数量 LED 时可能显示的所有合法时间。',
    constraints: ['小时范围为 0 到 11，分钟范围为 0 到 59。', '分钟必须格式化为两位，小时不能补前导零。'],
    examples: [{ input: 'turnedOn = 1', output: '["0:01","0:02",...,"8:00"]', explanation: '每个结果恰有一个二进制位为 1。' }],
    intuition: '合法时间总共只有 12×60=720 个，直接枚举并统计小时与分钟二进制中的 1，代码简单且边界清晰。',
    bruteForce: '回溯选择 10 盏灯的开关组合再验证小时和分钟，需处理无效编码且实现更复杂。',
    approach: ['枚举所有 12 个小时。', '对每个小时枚举 60 个分钟。', '统计 hour 与 minute 的置位数之和。', '等于 turnedOn 时按 h:mm 格式加入答案。'],
    code: `class Solution:
    def readBinaryWatch(self, turnedOn: int) -> List[str]:
        ans = []
        for hour in range(12):
            for minute in range(60):
                if hour.bit_count() + minute.bit_count() == turnedOn:
                    ans.append(f"{hour}:{minute:02d}")
        return ans`,
    walkthrough: { input: 'turnedOn=1', steps: ['枚举时间 0:00 到 11:59。', '例如 0:01 的总置位数为 1，因此收集。', '3:00 的小时二进制含两个 1，因此跳过。'], result: '返回所有恰亮一盏灯的合法时间。' },
    complexity: { time: 'O(12×60)，在本题范围内为常数。', space: 'O(1)，不计输出。' },
    pitfalls: ['分钟必须使用两位格式，例如 0:01。', '不能枚举到小时 15 或分钟 63 后仍保留无效时间。'], related: ['位计数', '回溯枚举'],
  },
  403: {
    id: 403, title: '青蛙过河', summary: '青蛙从第一块石头出发，上次跳 k 单位后下一次只能跳 k-1、k 或 k+1，判断能否到达末石。',
    constraints: ['石头位置严格递增，第一块位于 0。', '跳跃距离必须为正，且只能落在给定石头上。'],
    examples: [{ input: 'stones = [0,1,3,5,6,8,12,17]', output: 'true', explanation: '可按跳长 1、2、2、3、4、5 到达终点。' }],
    intuition: '到达同一石头时，上一次跳长不同会影响后续选择，因此状态必须同时记录位置与跳长；用集合传播所有可达状态即可。',
    bruteForce: '从每个位置递归尝试三种跳长而不记忆，许多相同的“石头+跳长”状态会被反复计算。',
    approach: ['为每块石头建立可达跳长集合，起点放入 0。', '按位置遍历其所有已知跳长。', '尝试 step-1、step、step+1 中的正数。', '若目标位置是石头，就把新跳长加入其集合。', '最终末石集合非空即能到达。'],
    code: `class Solution:
    def canCross(self, stones: List[int]) -> bool:
        reachable = {x: set() for x in stones}
        reachable[0].add(0)
        for position in stones:
            for last in reachable[position]:
                for step in (last - 1, last, last + 1):
                    target = position + step
                    if step > 0 and target in reachable:
                        reachable[target].add(step)
        return bool(reachable[stones[-1]])`,
    walkthrough: { input: 'stones=[0,1,3,5]', steps: ['起点状态为 (0,0)，只能传播跳长 1 到位置 1。', '从 (1,1) 用跳长 2 到位置 3。', '从 (3,2) 用跳长 2 到位置 5。'], result: '末石存在可达状态，返回 true。' },
    complexity: { time: 'O(n²)，每块石头可能记录 O(n) 种跳长。', space: 'O(n²)，保存可达状态。' },
    pitfalls: ['不能只记录石头是否访问过，跳长也是状态。', 'step=0 或负数必须跳过。'], related: ['动态规划', '记忆化搜索'],
  },
  409: {
    id: 409, title: '最长回文串', summary: '用给定字符重新排列出尽可能长的回文串，返回可达到的最大长度。',
    constraints: ['字符区分大小写，每个字符最多使用其原有次数。', '只需返回长度，不要求构造具体回文串。'],
    examples: [{ input: 's = "abccccdd"', output: '7', explanation: '可组成例如 "dccaccd"，长度为 7。' }],
    intuition: '回文两侧需要成对字符，所以每种字符贡献不超过其频次的最大偶数；若存在任意剩余奇数，还能在中心额外放一个。',
    bruteForce: '枚举字符排列并逐一检查回文，排列数量呈阶乘增长。',
    approach: ['统计每个字符的频次。', '对每个频次加入 count//2×2 个字符。', '记录是否存在奇数频次。', '若存在且尚有中心位置，最终长度加一。'],
    code: `class Solution:
    def longestPalindrome(self, s: str) -> int:
        counts = {}
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1
        length = sum(value // 2 * 2 for value in counts.values())
        if length < len(s):
            length += 1
        return length`,
    walkthrough: { input: 's="abccccdd"', steps: ['频次为 a:1、b:1、c:4、d:2。', '偶数配对贡献 4+2=6。', '存在未使用的奇数字符，可放一个在中心。'], result: '最大长度为 7。' },
    complexity: { time: 'O(n)，统计一次字符。', space: 'O(k)，k 为不同字符数；固定字符集时可视为 O(1)。' },
    pitfalls: ['多个奇数频次也只能贡献一个中心字符。', '大小写字符不能合并计数。'], related: ['哈希计数', '回文构造'],
  },
  413: {
    id: 413, title: '等差数列划分', summary: '统计长度至少为 3、相邻差恒定的连续子数组数量。',
    constraints: ['只统计连续片段，不是任意子序列。', '同一长等差段中的不同起止位置分别计数。'],
    examples: [{ input: 'nums = [1,2,3,4]', output: '3', explanation: '合法片段是 [1,2,3]、[2,3,4] 和 [1,2,3,4]。' }],
    intuition: '若当前三项保持相同差值，那么以当前位置结尾的新等差片段数比前一位置多一个；把该数量累加即可覆盖所有结尾。',
    bruteForce: '枚举所有起止区间并检查差值，最坏 O(n³)；增量检查也至少 O(n²)。',
    approach: ['用 current 表示以上一位置结尾的等差片段数。', '从下标 2 开始比较相邻两段差值。', '相等时 current 加一，并累加到答案。', '不相等时将 current 清零。'],
    code: `class Solution:
    def numberOfArithmeticSlices(self, nums: List[int]) -> int:
        total = current = 0
        for i in range(2, len(nums)):
            if nums[i] - nums[i - 1] == nums[i - 1] - nums[i - 2]:
                current += 1
                total += current
            else:
                current = 0
        return total`,
    walkthrough: { input: 'nums=[1,2,3,4]', steps: ['到下标 2 时差值连续相等，current=1、total=1。', '到下标 3 时仍相等，current=2。', '把 2 加入 total，代表新增 [2,3,4] 与 [1,2,3,4]。'], result: '返回 3。' },
    complexity: { time: 'O(n)，单次线性扫描。', space: 'O(1)。' },
    pitfalls: ['最短合法长度是 3，因此循环从下标 2 开始。', '遇到差值变化必须清空 current。'], related: ['动态规划', '446 等差数列划分 II'],
  },
  415: {
    id: 415, title: '字符串相加', summary: '不把整个输入转换为整数，直接计算两个非负整数字符串之和并返回字符串。',
    constraints: ['输入只含数字且除数字 0 外无前导零。', '不能依赖大整数库或整体整数转换。'],
    examples: [{ input: 'num1 = "456", num2 = "77"', output: '"533"', explanation: '从个位逐位相加并传播进位。' }],
    intuition: '模拟竖式加法：两个指针从末尾向前读取，不存在的位置视为 0；当前位由总和模 10 得到，整除 10 得到进位。',
    bruteForce: '直接转成机器整数相加，在输入位数很大时溢出，也违反题意。',
    approach: ['令两个指针分别指向字符串末尾，并初始化 carry=0。', '循环读取仍存在的数字，与 carry 相加。', '把总和个位加入结果，更新十位进位。', '直到两串和进位均耗尽，再反转结果。'],
    code: `class Solution:
    def addStrings(self, num1: str, num2: str) -> str:
        i, j, carry = len(num1) - 1, len(num2) - 1, 0
        digits = []
        while i >= 0 or j >= 0 or carry:
            a = ord(num1[i]) - 48 if i >= 0 else 0
            b = ord(num2[j]) - 48 if j >= 0 else 0
            carry, digit = divmod(a + b + carry, 10)
            digits.append(str(digit))
            i -= 1
            j -= 1
        return ''.join(reversed(digits))`,
    walkthrough: { input: 'num1="456", num2="77"', steps: ['个位 6+7=13，写 3 进 1。', '十位 5+7+1=13，写 3 进 1。', '百位 4+0+1=5，反转暂存数字。'], result: '返回 "533"。' },
    complexity: { time: 'O(max(n,m))。', space: 'O(max(n,m))，用于结果字符。' },
    pitfalls: ['循环条件必须包含最终 carry。', '暂存数字是逆序，返回前需要反转。'], related: ['2 两数相加', '67 二进制求和'],
  },
  419: {
    id: 419, title: '甲板上的战舰', summary: '在字符网格中统计互不相邻的水平或垂直战舰数量，不修改网格且只需一次扫描。',
    constraints: ['战舰由连续的 X 横向或纵向组成，不会弯折。', '不同战舰之间至少有一个空单元，因此不会相邻连接。'],
    examples: [{ input: 'board = [["X",".",".","X"],[".",".",".","X"],[".",".",".","X"]]', output: '2', explanation: '左上角是单格战舰，最右列是一艘竖直战舰。' }],
    intuition: '每艘战舰恰有一个“头部”：该 X 的上方和左方都不是 X。只计头部便不会按长度重复计数，也无需搜索整艘船。',
    bruteForce: '遇到 X 就 DFS/BFS 标记整艘战舰，虽为 O(mn)，但需要修改棋盘或使用访问集合。',
    approach: ['按行列扫描每个单元格。', '跳过所有非 X 单元格。', '若上方存在 X，当前格不是船头，跳过。', '若左方存在 X，同样跳过；否则答案加一。'],
    code: `class Solution:
    def countBattleships(self, board: List[List[str]]) -> int:
        rows, cols = len(board), len(board[0])
        count = 0
        for r in range(rows):
            for c in range(cols):
                if board[r][c] != 'X':
                    continue
                if r > 0 and board[r - 1][c] == 'X':
                    continue
                if c > 0 and board[r][c - 1] == 'X':
                    continue
                count += 1
        return count`,
    walkthrough: { input: 'X 在 (0,0)、(0,3)、(1,3)、(2,3)', steps: ['(0,0) 上方和左方均无 X，计数一次。', '(0,3) 也满足船头条件，再计一次。', '(1,3)、(2,3) 上方有 X，均跳过。'], result: '返回 2。' },
    complexity: { time: 'O(mn)，扫描整个网格。', space: 'O(1)。' },
    pitfalls: ['边界格检查上方或左方前要先判断下标。', '船头条件依赖题目保证战舰不会相邻或弯折。'], related: ['200 岛屿数量', '矩阵扫描'],
  },
  421: {
    id: 421, title: '数组中两个数的最大异或值', summary: '从非负整数数组中选择两个数，使它们的按位异或结果最大。',
    constraints: ['数组至少包含两个非负整数。', '目标按数值最大化，因此应从最高有效位向低位贪心确定。'],
    examples: [{ input: 'nums = [3,10,5,25,2,8]', output: '28', explanation: '5 XOR 25 = 28，为最大值。' }],
    intuition: '从高位到低位试图把答案当前位设为 1。若存在两个高位前缀 p、q 满足 p XOR q 等于候选答案，则该候选可实现。',
    bruteForce: '枚举所有数对并计算异或，需要 O(n²) 时间。',
    approach: ['从最高位向最低位逐步扩展掩码 mask。', '收集每个数字在当前 mask 下的高位前缀。', '令 candidate 为当前答案把新位设成 1。', '若存在前缀 p 使 p XOR candidate 也在集合中，就接受 candidate。', '处理完所有位后返回答案。'],
    code: `class Solution:
    def findMaximumXOR(self, nums: List[int]) -> int:
        answer = mask = 0
        for bit in range(max(nums).bit_length() - 1, -1, -1):
            mask |= 1 << bit
            prefixes = {x & mask for x in nums}
            candidate = answer | (1 << bit)
            if any((p ^ candidate) in prefixes for p in prefixes):
                answer = candidate
        return answer`,
    walkthrough: { input: 'nums=[3,10,5,25,2,8]', steps: ['从最高有效位开始收集数字前缀。', '每一位先假设答案可设为 1，并寻找互补前缀。', '可行就保留该位，不可行则保持 0，最终得到二进制 11100。'], result: '返回 28。' },
    complexity: { time: 'O(nW)，W 为整数位数。', space: 'O(n)，保存当前位前缀集合。' },
    pitfalls: ['必须从高位到低位决定，低位不能补偿丢失的高位。', '互补前缀应为 p XOR candidate，而不是普通差值。'], related: ['字典树', '位运算'],
  },
  436: {
    id: 436, title: '寻找右区间', summary: '对每个区间寻找起点不小于其终点且起点最小的区间，并返回该区间的原下标。',
    constraints: ['所有区间起点互不相同。', '找不到满足 start>=end 的区间时返回 -1。'],
    examples: [{ input: 'intervals = [[3,4],[2,3],[1,2]]', output: '[-1,0,1]', explanation: '[2,3] 的右区间从 3 开始，[1,2] 的右区间从 2 开始。' }],
    intuition: '只需对起点排序。每个终点对应“第一个大于等于它的起点”，正是标准 lower_bound 二分查找。',
    bruteForce: '对每个区间扫描全部区间并维护最小合格起点，时间 O(n²)。',
    approach: ['把 (起点,原下标) 按起点排序。', '对每个区间的终点在排序数组中做左边界二分。', '若二分位置仍在数组内，取该位置的原下标。', '否则答案为 -1。'],
    code: `class Solution:
    def findRightInterval(self, intervals: List[List[int]]) -> List[int]:
        starts = sorted((start, i) for i, (start, _) in enumerate(intervals))
        ans = []
        for _, end in intervals:
            left, right = 0, len(starts)
            while left < right:
                mid = (left + right) // 2
                if starts[mid][0] < end:
                    left = mid + 1
                else:
                    right = mid
            ans.append(starts[left][1] if left < len(starts) else -1)
        return ans`,
    walkthrough: { input: 'intervals=[[3,4],[2,3],[1,2]]', steps: ['排序起点得到 1、2、3，并保留原下标。', '终点 4 的 lower_bound 越界，所以首项为 -1。', '终点 3 和 2 分别命中起点 3、2。'], result: '返回 [-1,0,1]。' },
    complexity: { time: 'O(n log n)，排序及 n 次二分。', space: 'O(n)，保存排序起点和答案。' },
    pitfalls: ['比较条件允许起点等于终点。', '排序后必须保留并返回原始下标。'], related: ['二分查找', '区间'],
  },
  442: {
    id: 442, title: '数组中重复的数据', summary: '在长度为 n、值域为 1..n 且每个数最多出现两次的数组中，找出所有出现两次的值。',
    constraints: ['每个元素都在闭区间 [1,n]。', '要求线性时间，并可利用输入数组本身作为标记空间。'],
    examples: [{ input: 'nums = [4,3,2,7,8,2,3,1]', output: '[2,3]', explanation: '2 和 3 各出现两次。' }],
    intuition: '值 x 可映射到下标 x-1。第一次见 x 时把该位置取负；再次见到时发现已经为负，便可确认 x 重复。',
    bruteForce: '对每个值重新扫描计数需 O(n²)；使用哈希表则需要 O(n) 额外空间。',
    approach: ['遍历数组，使用 abs(nums[i]) 取得原始值。', '将该值映射到索引 value-1。', '若映射位置已经为负，把 value 加入答案。', '否则把映射位置改为负数以表示见过。'],
    code: `class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        ans = []
        for i in range(len(nums)):
            value = abs(nums[i])
            index = value - 1
            if nums[index] < 0:
                ans.append(value)
            else:
                nums[index] = -nums[index]
        return ans`,
    walkthrough: { input: 'nums=[4,3,2,7,8,2,3,1]', steps: ['第一次遇到 2 时把下标 1 的位置标负。', '再次遇到 2 时该位置已为负，收集 2。', '3 同理被第二次命中，其余值只标记一次。'], result: '得到 [2,3]。' },
    complexity: { time: 'O(n)。', space: 'O(1)，不计输出，但会临时修改输入。' },
    pitfalls: ['读取当前值必须先取绝对值，因为它可能已被标负。', '值映射到下标时要减一。'], related: ['448 找到所有数组中消失的数字', '原地标记'],
  },
  443: {
    id: 443, title: '压缩字符串', summary: '把连续相同字符原地压缩为字符加次数，单个字符不写次数，并返回新长度。',
    constraints: ['必须在输入字符数组上原地写回。', '次数大于 9 时要逐位写入，例如 12 写成字符 1、2。'],
    examples: [{ input: 'chars = ["a","a","b","b","c","c","c"]', output: '6，chars 前缀为 ["a","2","b","2","c","3"]', explanation: '三个连续分组分别压缩。' }],
    intuition: '读指针按组找到相同字符的连续区间，写指针只写组字符和必要的计数字符；写入位置不会超过已读位置。',
    bruteForce: '创建新的压缩字符串再复制回数组，需要 O(n) 额外空间。',
    approach: ['read 指向当前组开头，向后找到组尾。', '在 write 位置写入该组字符。', '若组长度大于 1，将十进制次数逐字符写入。', '移动 read 到下一组，最终返回 write。'],
    code: `class Solution:
    def compress(self, chars: List[str]) -> int:
        read = write = 0
        while read < len(chars):
            end = read
            while end < len(chars) and chars[end] == chars[read]:
                end += 1
            chars[write] = chars[read]
            write += 1
            count = end - read
            if count > 1:
                for digit in str(count):
                    chars[write] = digit
                    write += 1
            read = end
        return write`,
    walkthrough: { input: 'chars=["a","a","a","b"]', steps: ['读出 a 组长度 3，写入 a 和字符 3。', 'read 跳到 b，写入单个 b，不写次数 1。', 'write 最终停在下标 3 之后。'], result: '返回 3，数组有效前缀为 ["a","3","b"]。' },
    complexity: { time: 'O(n)，每个字符参与有限次读写。', space: 'O(1)，次数字符串长度至多为 O(log n) 且通常视作临时标量。' },
    pitfalls: ['单个字符后不能写 1。', '返回的是有效长度，不是新数组。'], related: ['双指针', '38 外观数列'],
  },
  445: {
    id: 445, title: '两数相加 II', summary: '两个链表按最高位到最低位保存非负整数，在不反转输入链表的前提下返回它们的和。',
    constraints: ['除数字 0 外，链表表示中没有前导零。', '每个节点保存一位数字，输入链表顺序不能破坏。'],
    examples: [{ input: 'l1 = [7,2,4,3], l2 = [5,6,4]', output: '[7,8,0,7]', explanation: '7243+564=7807。' }],
    intuition: '加法应从低位开始，而链表从高位开始。分别把节点值压栈，再从栈顶弹出模拟竖式，并通过头插构造正序结果。',
    bruteForce: '把链表整体转为整数相加再拆位，超长输入可能溢出且绕过链表处理。',
    approach: ['遍历两个链表，将数字分别压入栈。', '当任一栈非空或仍有进位时弹出低位。', '计算当前位和新进位。', '把当前数字节点插到结果链表头部。'],
    code: `class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        a, b = [], []
        while l1:
            a.append(l1.val)
            l1 = l1.next
        while l2:
            b.append(l2.val)
            l2 = l2.next
        head = None
        carry = 0
        while a or b or carry:
            total = (a.pop() if a else 0) + (b.pop() if b else 0) + carry
            carry, digit = divmod(total, 10)
            head = ListNode(digit, head)
        return head`,
    walkthrough: { input: 'l1=[7,2,4,3], l2=[5,6,4]', steps: ['两栈顶分别是 3 和 4，生成结果低位 7。', '继续弹出 4 与 6，写 0 并产生进位 1。', '处理剩余高位并持续头插，形成 7→8→0→7。'], result: '返回链表 [7,8,0,7]。' },
    complexity: { time: 'O(n+m)。', space: 'O(n+m)，两个栈及结果链表。' },
    pitfalls: ['循环条件必须保留最终进位。', '结果节点要头插，否则得到逆序数字。'], related: ['2 两数相加', '415 字符串相加'],
  },
  451: {
    id: 451, title: '根据字符出现频率排序', summary: '重排字符串，使出现次数更多的字符排在更前面；频次相同者顺序任意。',
    constraints: ['字符可包含大小写字母、数字等，大小写分别计数。', '输出必须恰好保留输入中的全部字符及次数。'],
    examples: [{ input: 's = "tree"', output: '"eert"', explanation: 'e 出现两次，必须排在只出现一次的字符之前；"eetr" 也合法。' }],
    intuition: '先统计频次，再按频次降序处理不同字符；每个字符一次性重复写出对应次数即可。',
    bruteForce: '直接按每个字符的全局频次排序全部 n 个位置，需要 O(n log n) 时间。',
    approach: ['用哈希表统计每个字符次数。', '把不同字符按频次从大到小排序。', '对每个字符生成 ch 重复 count 次的片段。', '拼接所有片段并返回。'],
    code: `class Solution:
    def frequencySort(self, s: str) -> str:
        count = {}
        for ch in s:
            count[ch] = count.get(ch, 0) + 1
        ordered = sorted(count, key=count.get, reverse=True)
        return ''.join(ch * count[ch] for ch in ordered)`,
    walkthrough: { input: 's="tree"', steps: ['统计 t:1、r:1、e:2。', '按频次排序后 e 位于最前。', '输出 ee，再拼接 t 与 r 的任意顺序。'], result: '可返回 "eetr"。' },
    complexity: { time: 'O(n+k log k)，k 为不同字符数。', space: 'O(n+k)，包含输出片段和计数。' },
    pitfalls: ['同频字符顺序不唯一，测试不应锁定唯一字符串。', '字符大小写应独立统计。'], related: ['347 前 K 个高频元素', '桶排序'],
  },
  459: {
    id: 459, title: '重复的子字符串', summary: '判断非空字符串能否由某个更短的非空子串重复若干次构成。',
    constraints: ['重复次数至少为 2，因此模式长度必须严格小于原串。', '字符顺序和大小写必须完全一致。'],
    examples: [{ input: 's = "abab"', output: 'true', explanation: '字符串由子串 "ab" 重复两次组成。' }],
    intuition: '若 s 是周期串，把 s+s 去掉首尾字符后仍会出现完整的 s；非周期串的跨边界错位无法形成完整匹配。',
    bruteForce: '枚举所有可能模式长度，逐个构造重复串比较，最坏需要 O(n²) 字符处理。',
    approach: ['将字符串与自身拼接得到 doubled。', '删除 doubled 的第一个和最后一个字符。', '检查原字符串 s 是否是剩余字符串的子串。', '存在则说明有非平凡周期，否则没有。'],
    code: `class Solution:
    def repeatedSubstringPattern(self, s: str) -> bool:
        return s in (s + s)[1:-1]`,
    walkthrough: { input: 's="abab"', steps: ['拼接得到 "abababab"。', '去掉首尾后得到 "bababa"。', '其中仍包含完整的 "abab"。'], result: '返回 true。' },
    complexity: { time: 'O(n)，采用线性子串匹配时；具体语言内置实现通常接近线性。', space: 'O(n)，用于拼接字符串。' },
    pitfalls: ['必须去掉拼接串的首尾，否则任何字符串都会匹配自身。', '模式不能等于整个字符串本身。'], related: ['KMP', '字符串周期'],
  },
  462: {
    id: 462, title: '最少移动次数使数组元素相等 II', summary: '每次可把任一元素加一或减一，求把所有元素变成同一值所需的最少总步数。',
    constraints: ['每次单位移动的代价为 1。', '目标值可任选整数，不要求原数组中唯一出现。'],
    examples: [{ input: 'nums = [1,2,3]', output: '2', explanation: '统一到中位数 2，代价为 1+0+1。' }],
    intuition: '绝对距离之和在中位数处最小：把目标向中位数靠近时，一侧减少的总距离不会少于另一侧增加的距离。',
    bruteForce: '从最小值到最大值枚举每个目标并计算总距离，数值范围大时耗时极高。',
    approach: ['将数组排序。', '选取排序后中间位置的值作为目标中位数。', '累加每个元素与中位数的绝对差。', '返回总差值。'],
    code: `class Solution:
    def minMoves2(self, nums: List[int]) -> int:
        nums.sort()
        median = nums[len(nums) // 2]
        return sum(abs(x - median) for x in nums)`,
    walkthrough: { input: 'nums=[1,10,2,9]', steps: ['排序得到 [1,2,9,10]。', '选择中位区间中的 9 作为目标。', '距离和为 8+7+0+1=16；选择 2 也同样为 16。'], result: '返回 16。' },
    complexity: { time: 'O(n log n)，由排序主导。', space: 'O(log n) 或 O(n)，取决于排序实现。' },
    pitfalls: ['平均数最小化的是平方误差，不是绝对误差。', '偶数长度时两个中位数之间的整数目标都最优。'], related: ['中位数', '296 最佳的碰头地点'],
  },
  474: {
    id: 474, title: '一和零', summary: '在二进制字符串数组中选最多字符串，使所选字符串使用的 0 不超过 m 个、1 不超过 n 个。',
    constraints: ['每个字符串只能选择一次。', 'm 与 n 是两类独立容量，字符串只含 0 和 1。'],
    examples: [{ input: 'strs = ["10","0001","111001","1","0"], m = 5, n = 3', output: '4', explanation: '可选 "10"、"0001"、"1"、"0"。' }],
    intuition: '这是二维 0/1 背包：每个字符串消耗若干 0 和 1，价值为 1。容量必须倒序更新，防止同一字符串在本轮被重复选择。',
    bruteForce: '枚举所有字符串子集并统计 0、1，时间 O(2^k·k)。',
    approach: ['建立 dp[i][j]，表示最多使用 i 个 0、j 个 1 时的最大数量。', '统计当前字符串的 zeros 与 ones。', '两个容量维度都从上限倒序遍历。', '用 dp[i-zeros][j-ones]+1 更新当前状态。', '处理完所有字符串后返回 dp[m][n]。'],
    code: `class Solution:
    def findMaxForm(self, strs: List[str], m: int, n: int) -> int:
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for word in strs:
            zeros = word.count('0')
            ones = len(word) - zeros
            for i in range(m, zeros - 1, -1):
                for j in range(n, ones - 1, -1):
                    dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] + 1)
        return dp[m][n]`,
    walkthrough: { input: 'strs=["10","0","1"], m=1, n=1', steps: ['处理 "10" 后，dp[1][1] 可取 1。', '处理 "0" 时倒序更新，不会重复使用它。', '处理 "1" 后可在选 "0" 的状态上增加，dp[1][1]=2。'], result: '返回 2。' },
    complexity: { time: 'O(kmn)，k 为字符串数量。', space: 'O(mn)。' },
    pitfalls: ['容量必须倒序，否则会变成可重复选择的完全背包。', '两个维度分别表示 0 和 1，不能只按字符串长度处理。'], related: ['0/1 背包', '416 分割等和子集'],
  },
  486: {
    id: 486, title: '预测赢家', summary: '两名玩家轮流从数组两端取数且都最优，判断先手最终得分能否不少于后手。',
    constraints: ['每回合只能取当前区间最左或最右元素。', '双方都采用最优策略，平局也算先手获胜。'],
    examples: [{ input: 'nums = [1,5,2]', output: 'false', explanation: '先手无论取 1 还是 2，后手都能取得 5 并领先。' }],
    intuition: '定义区间状态为“当前行动者相对对手最多领先多少分”。取左端后的净优势是左值减去对手在剩余区间的优势，取右端同理。',
    bruteForce: '递归枚举双方每一步的左右选择，不记忆时有 O(2^n) 个分支。',
    approach: ['令 dp[i] 初始为单个元素 nums[i] 的净优势。', '按区间长度从 2 增长到 n。', '对区间 [i,j] 比较取左 nums[i]-dp[i+1] 与取右 nums[j]-dp[i]。', '把较大优势写回 dp[i]。', '最终 dp[0]>=0 表示先手至少平局。'],
    code: `class Solution:
    def predictTheWinner(self, nums: List[int]) -> bool:
        dp = nums[:]
        for length in range(2, len(nums) + 1):
            for i in range(len(nums) - length + 1):
                j = i + length - 1
                dp[i] = max(nums[i] - dp[i + 1], nums[j] - dp[i])
        return dp[0] >= 0`,
    walkthrough: { input: 'nums=[1,5,2]', steps: ['长度 2 时计算区间 [1,5] 与 [5,2] 的当前玩家优势。', '长度 3 时，取左的净优势为 1-dp[1]，取右为 2-dp[0]。', '两种选择的最大值仍小于 0。'], result: '先手无法追平，返回 false。' },
    complexity: { time: 'O(n²)，遍历所有区间。', space: 'O(n)，滚动保存区间优势。' },
    pitfalls: ['状态保存的是分差，不是当前玩家的绝对得分。', '判断条件是 >=0，因为平局算先手成功。'], related: ['区间动态规划', '877 石子游戏'],
  },
  498: {
    id: 498, title: '对角线遍历', summary: '按右上、左下交替方向遍历矩阵的每条反对角线，返回所有元素的一维顺序。',
    constraints: ['矩阵非空且各行长度一致。', '每个单元格必须恰好访问一次，转向时不能重复边界元素。'],
    examples: [{ input: 'mat = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,4,7,5,3,6,8,9]', explanation: '沿各条 r+c 相同的对角线交替方向输出。' }],
    intuition: '同一反对角线上的坐标满足 r+c 固定。按对角线编号枚举坐标，再根据编号奇偶决定是否反向，就能统一处理四条边界。',
    bruteForce: '逐步模拟移动方向并针对四种撞墙情况修正坐标，虽是 O(mn)，但分支多且容易重复或越界。',
    approach: ['对角线编号 d 从 0 遍历到 rows+cols-2。', '计算该对角线上合法行号的起止范围。', '按行递增收集坐标 (r,d-r) 的元素。', '偶数编号将当前对角线反转，奇数保持顺序。', '把处理后的元素追加到答案。'],
    code: `class Solution:
    def findDiagonalOrder(self, mat: List[List[int]]) -> List[int]:
        rows, cols = len(mat), len(mat[0])
        ans = []
        for d in range(rows + cols - 1):
            low = max(0, d - cols + 1)
            high = min(rows - 1, d)
            diagonal = [mat[r][d - r] for r in range(low, high + 1)]
            if d % 2 == 0:
                diagonal.reverse()
            ans.extend(diagonal)
        return ans`,
    walkthrough: { input: 'mat=[[1,2,3],[4,5,6],[7,8,9]]', steps: ['d=0 收集 [1]，偶数反转后不变。', 'd=1 按行收集 [2,4]，奇数保持。', 'd=2 收集 [3,5,7] 后反转为 [7,5,3]，其余对角线同理。'], result: '得到 [1,2,4,7,5,3,6,8,9]。' },
    complexity: { time: 'O(mn)，每个元素访问一次。', space: 'O(min(m,n))，临时保存一条对角线；不计输出。' },
    pitfalls: ['对角线总数是 rows+cols-1。', '偶数对角线需要反转，且列号始终为 d-r。'], related: ['54 螺旋矩阵', '矩阵模拟'],
  },
};

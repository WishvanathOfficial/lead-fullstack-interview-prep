window.PREP = window.PREP || {};
window.PREP.dsa = String.raw`
@title DSA in JavaScript
@icon braces
@tagline Problem-solving patterns, complexity and clean code for coding rounds: arrays, hashing, two pointers, trees, graphs, heaps and dynamic programming, all in JavaScript.
@resume Performance optimisation (30–40% faster pages and APIs) | Search, sorting and pagination in real APIs | Writing efficient, readable JavaScript | Reviewing code for time and space complexity

## ROADMAP

### Phase 1 · Foundations and core patterns (Basic)
- Big-O notation: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ) :: Say the complexity of any loop you write, and know which JS built-ins hide a loop (includes, indexOf, slice, spread).
- Time vs space trade-offs and amortised analysis :: Know why array push is amortised O(1) and why a Map trades memory for speed.
- Arrays and strings: indexing, slicing, in-place edits, immutability :: Know which methods mutate (push, splice, sort, reverse) and which copy (slice, map, toSorted).
- Hash maps and sets: frequency counting, dedupe, lookup tables :: Turn nested-loop O(n²) problems into O(n) with a Map or Set (two sum, anagrams).
- Map vs Object vs Set vs WeakMap in JavaScript :: Know key types, insertion order, size, and when an Object is the wrong choice (prototype keys).
- Two pointers (opposite ends and same direction) :: Use on sorted arrays, palindromes, pair sums and in-place filtering.
- Sliding window (fixed and variable size) :: Longest substring, max sum of k elements, minimum window problems.
- Prefix sums and difference arrays :: Answer range-sum queries in O(1) after O(n) preparation.
- Sorting basics and JavaScript sort pitfalls :: Default sort is lexicographic; always pass a comparator for numbers; sort mutates.
- Binary search: classic template and boundaries :: Write it without off-by-one errors using lo, hi and mid = lo + ((hi - lo) >> 1).
- Stacks and queues: LIFO and FIFO, array-based implementations :: Know that array shift is O(n); use an index pointer or linked list for real queues.
- Linked lists: nodes, traversal, dummy head :: Draw pointers before coding; use a dummy node to avoid head special cases.
- Recursion: base case, recursive case, call stack :: Convert simple recursion to iteration and know the stack depth limit.
- Interview method: clarify, examples, brute force, optimise, test, complexity :: Rehearse the six-step routine until it is automatic.

### Phase 2 · Core data structures and algorithms (Intermediate)
- Sorting algorithms: insertion, merge, quick, counting :: Implement merge sort and quick sort; know stability and worst cases.
- Binary search on the answer and on rotated or monotonic data :: Recognise "minimum value that satisfies a condition" problems.
- Linked list patterns: reverse, merge, fast and slow pointers, cycle detection :: Floyd's algorithm finds cycles and middles in O(1) space.
- Monotonic stack and next-greater-element problems :: Daily temperatures, histogram and stock span style questions.
- Queue via stacks and stack via queues :: Know amortised cost of the two-stack queue.
- Trees: terminology, binary tree node, recursion on trees :: Every tree problem is "solve left, solve right, combine".
- Tree traversals: preorder, inorder, postorder (DFS) and level order (BFS) :: Write each recursively and iteratively.
- Binary search trees: search, insert, validate, inorder property :: Inorder of a BST is sorted; validate with min and max bounds.
- Lowest common ancestor, height, diameter, path sum :: Return values up the recursion instead of using globals.
- Heaps and priority queues: MinHeap and MaxHeap implementation :: Implement push, pop and heapify with array index math (2i+1, 2i+2).
- Top-K and merge-K patterns :: Keep a heap of size k, or use bucket sort for frequencies.
- Backtracking: subsets, permutations, combinations, n-queens basics :: Choose, explore, un-choose; prune early.
- Intervals: merge, insert, meeting rooms :: Sort by start, then sweep.
- Matrix and grid problems: traversal, rotation, spiral :: Use direction arrays and bounds checks.
- Greedy algorithms: activity selection, jump game, intervals :: Know when local best choices are provably global best.
- Tries (prefix trees) :: Autocomplete and prefix search; know memory trade-offs.
- Bit manipulation basics: &, |, ^, <<, >>, XOR tricks :: Single number, power of two, count set bits.

### Phase 3 · Advanced and design (Advanced)
- Graphs: adjacency list vs matrix, directed vs undirected :: Build a graph from edge lists in O(V + E).
- Graph traversal: BFS and DFS, visited sets :: BFS gives shortest path in unweighted graphs.
- Connected components, grid islands and cycle detection :: Flood fill with DFS or BFS; track recursion stack for directed cycles.
- Topological sort: Kahn's algorithm and DFS :: Course schedule and build-order problems.
- Shortest paths: Dijkstra with a priority queue :: Needs non-negative weights; know the O((V + E) log V) cost.
- Union-Find (disjoint set) with path compression and union by rank :: Connected components, redundant connections, Kruskal.
- Dynamic programming foundations: overlapping subproblems and memoisation :: Start with recursion plus a cache, then convert to a table.
- 1D DP: climbing stairs, house robber, coin change, longest increasing subsequence :: Define state, transition and base case out loud.
- 2D DP: LCS, edit distance, unique paths, knapsack :: Draw the table; reduce space to one row when possible.
- Design problems: LRU cache, min stack, iterator, rate limiter :: Combine Map, doubly linked list and heaps.
- Serialize and deserialize trees and graphs :: Preorder with null markers; JSON for graphs.
- JavaScript utility coding: deep clone, flatten, debounce, throttle, memoize, promise pool :: Frequent in front-end and full-stack rounds.
- Typed arrays, bitsets and memory-aware structures :: Use Uint8Array or Int32Array for large numeric data.
- Complexity of real code: N+1 queries, nested loops over API data, pagination :: Connect Big-O to the performance wins on your resume.
- Mock-interview routine: timed problems, talking while coding :: 45 minutes: 5 clarify, 10 plan, 20 code, 10 test.

## QA

### [basic] What is Big-O notation and why does it matter?
Big-O describes how the running time or memory of an algorithm grows as the input size n grows, ignoring constants and lower-order terms. It lets you compare solutions without running them.
| Notation | Name | Example |
|---|---|---|
| O(1) | Constant | Map lookup, array index |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | One loop, hash map build |
| O(n log n) | Linearithmic | Merge sort, sort() |
| O(n²) | Quadratic | Nested loops |
| O(2ⁿ) | Exponential | Naive subsets, naive Fibonacci |
In interviews, state the complexity of both time and space for your final solution.

### [basic] What is the difference between time and space complexity?
Time complexity measures how many operations run as input grows; space complexity measures extra memory used (not counting the input itself, unless stated). They often trade off: a hash map reduces time from O(n²) to O(n) at the cost of O(n) extra space. Recursion also uses stack space proportional to depth.

### [basic] What is amortised analysis? Give a JavaScript example.
It averages the cost of an operation over a sequence. Array ¦push¦ is usually O(1), but occasionally the engine must grow the underlying storage (O(n)). Spread over many pushes, the average is O(1) per push. Contrast with ¦shift¦ and ¦unshift¦, which are O(n) because elements move.

### [basic] Which common JavaScript operations hide a loop?
¦includes¦, ¦indexOf¦, ¦find¦, ¦filter¦, ¦map¦, ¦slice¦, ¦concat¦, ¦join¦, ¦sort¦ (O(n log n)), the spread operator ¦[...arr]¦, ¦Object.keys¦ and string concatenation in a loop. Calling ¦arr.includes(x)¦ inside a ¦for¦ loop makes the whole thing O(n²). Replace it with a ¦Set¦ for O(1) lookups.

### [basic] When do you choose a Map over an Object?
Use a ¦Map¦ when keys are not strings (numbers, objects), when you need guaranteed insertion order, frequent add/delete, or a reliable ¦size¦. Plain objects inherit prototype keys (¦"constructor"¦, ¦"toString"¦), so counting words like "constructor" can break. Use ¦Object.create(null)¦ or a Map for user-controlled keys. A ¦Set¦ stores unique values with O(1) ¦has¦, ideal for visited tracking and dedupe.

### [basic] What are the JavaScript ¦sort¦ pitfalls?
¦[10, 9, 1].sort()¦ returns ¦[1, 10, 9]¦ because the default compares strings. Always pass a comparator: ¦arr.sort((a, b) => a - b)¦. ¦sort¦ mutates the array (use ¦toSorted¦ or copy first), is stable in modern engines, and the comparator must return a number (not a boolean). Sorting objects: ¦arr.sort((a, b) => a.age - b.age)¦; strings: ¦a.localeCompare(b)¦.

### [basic] How does binary search work and what are its requirements?
It repeatedly halves a sorted search range by comparing the middle element with the target. It needs sorted (or monotonic) data and random access. Complexity O(log n). Compute the middle as ¦lo + ((hi - lo) >> 1)¦ to avoid overflow in other languages, and be careful with ¦lo <= hi¦ and ¦mid ± 1¦ updates to avoid infinite loops.

### [basic] What is the two-pointer technique? When do you use it?
Two indices move through data to avoid a nested loop. Opposite-direction pointers work on sorted arrays (pair sum, container with most water, palindromes). Same-direction pointers (slow/fast) work for in-place removal of duplicates and for linked-list cycle detection. It typically turns O(n²) into O(n).

### [basic] What is the sliding window pattern?
Maintain a window ¦[left, right]¦ over an array or string, expand ¦right¦, and shrink ¦left¦ when a condition breaks. Used for longest substring without repeats, max sum subarray of size k, and minimum window substring. Each element enters and leaves the window once, so the total time is O(n).

### [basic] What is a prefix sum and when is it useful?
A prefix array stores running totals so the sum of any range ¦[i, j]¦ equals ¦prefix[j + 1] - prefix[i]¦ in O(1). Preparation costs O(n). It powers subarray-sum questions, often combined with a Map for "subarray equals k" (store counts of prefix sums seen).

### [basic] Why is ¦array.shift()¦ a bad queue in large loops, and what is the fix?
¦shift¦ removes the first element and re-indexes the rest, which is O(n), making BFS O(n²) on big graphs. Fix: keep a head index (¦let head = 0; while (head < q.length) { const x = q[head++]; ... }¦) or implement a linked-list queue. Modern engines optimise small arrays, but interviewers expect you to know the cost.

### [basic] How do you handle recursion safely in JavaScript?
Define a clear base case, make sure each call moves toward it, and consider depth: engines limit the call stack (roughly 10,000 frames), so deep recursion on 100,000 nodes throws ¦RangeError¦. Convert to an iterative loop with an explicit stack, or use memoisation to avoid repeated work. JavaScript does not guarantee tail-call optimisation.

### [intermediate] Compare merge sort and quick sort.
Merge sort: always O(n log n), stable, needs O(n) extra space, great for linked lists. Quick sort: average O(n log n), worst O(n²) with bad pivots (sorted input with first-element pivot), in-place O(log n) stack, not stable. Pick a random or median-of-three pivot to avoid the worst case. V8's ¦Array.prototype.sort¦ uses TimSort (stable, O(n log n), good on partially sorted data).

### [intermediate] What is Floyd's cycle detection algorithm?
Use a slow pointer (1 step) and a fast pointer (2 steps). If they ever meet, the list has a cycle; if fast reaches ¦null¦, it does not. To find the cycle start, reset one pointer to the head and move both one step at a time; they meet at the entry. O(n) time, O(1) space.

### [intermediate] What is a monotonic stack?
A stack that keeps elements in increasing or decreasing order. While the new element breaks the order, pop and resolve the popped elements. It solves "next greater element", daily temperatures and largest rectangle in histogram in O(n) because each element is pushed and popped once.

### [intermediate] What are the tree traversals and their uses?
Preorder (root, left, right): copy or serialise a tree. Inorder (left, root, right): sorted order for a BST. Postorder (left, right, root): delete a tree, compute sizes and heights. Level order (BFS with a queue): shortest depth and per-level answers. DFS recursion uses O(h) stack space, where h is the tree height (O(log n) balanced, O(n) skewed).

### [intermediate] How do you validate a binary search tree?
Checking only a node's immediate children is wrong. Pass down allowed bounds: every node must be greater than ¦min¦ and less than ¦max¦, updating ¦max¦ when going left and ¦min¦ when going right. Alternatively, run an inorder traversal and verify the values are strictly increasing. O(n) time, O(h) space.

### [intermediate] How does a binary heap work, and what are its complexities?
A heap is a complete binary tree stored in an array: parent of ¦i¦ is ¦(i - 1) >> 1¦, children are ¦2i + 1¦ and ¦2i + 2¦. Min-heap keeps the smallest at index 0. Push (sift up) and pop (sift down) are O(log n), peek is O(1), and building a heap from an array is O(n). JavaScript has no built-in heap, so interviews expect you to write a small class.

### [intermediate] How do you find the top K frequent elements efficiently?
Count with a Map (O(n)). Then either keep a min-heap of size k (O(n log k)), or use bucket sort where the index is the frequency (O(n)). Sorting all entries is O(n log n), which is simpler but slower for huge inputs. Use the heap when the data is a stream.

### [intermediate] What is backtracking and how do you structure it?
Backtracking builds a solution step by step and abandons (prunes) a path when it cannot lead to a valid answer. Template: ¦choose → explore (recurse) → un-choose¦. Used for subsets, permutations, combinations, sudoku and n-queens. Complexity is often exponential (subsets O(2ⁿ), permutations O(n!)), so pruning matters.

### [intermediate] BFS vs DFS: how do you choose?
BFS (queue) explores level by level, so it finds the shortest path in unweighted graphs and the minimum number of steps. DFS (stack or recursion) uses less memory on wide graphs and suits path existence, cycle detection, components and topological sort. Both are O(V + E). Always track ¦visited¦ to avoid infinite loops.

### [intermediate] How does topological sort work, and when do you use it?
It orders nodes of a directed acyclic graph so every edge goes from earlier to later (build order, course prerequisites). Kahn's algorithm: compute in-degrees, queue nodes with in-degree 0, repeatedly remove one and decrement neighbours. If the output has fewer nodes than the graph, there is a cycle. O(V + E).

### [intermediate] When do you use a greedy algorithm instead of DP?
When a locally optimal choice always leads to a global optimum (provable by an exchange argument), for example interval scheduling by earliest end time, or jump game. If a local choice can hurt later (coin change with arbitrary coins, 0/1 knapsack), you need DP. Always test greedy ideas on a counter-example before committing.

### [intermediate] What are the classic bit-manipulation tricks?
¦x & (x - 1)¦ clears the lowest set bit (power of two check: ¦x > 0 && (x & (x - 1)) === 0¦). XOR of equal values is 0, so ¦a ^ a = 0¦ finds the single non-duplicate number. ¦x << 1¦ doubles, ¦x >> 1¦ halves. JavaScript bitwise operators work on 32-bit signed integers, so large numbers need ¦BigInt¦ or care with ¦>>>¦.

### [advanced] What is dynamic programming and how do you approach it?
DP solves problems with overlapping subproblems and optimal substructure by storing sub-results. Steps: (1) define the state ("dp[i] means..."), (2) write the transition, (3) set the base cases, (4) choose the order (top-down with memoisation or bottom-up table), (5) optimise space if possible. Example: ¦dp[a] = min(dp[a - coin] + 1)¦ for coin change. Practise saying the state definition out loud before coding.

### [advanced] Explain Dijkstra's algorithm and its requirements.
It finds shortest paths from one source in a graph with non-negative edge weights. Keep a min-heap of ¦(distance, node)¦. Pop the smallest, skip if it is stale, relax each neighbour (¦dist[u] + w < dist[v]¦), push updates. Complexity O((V + E) log V). Negative edges need Bellman-Ford. For unweighted graphs, plain BFS is enough.

### [advanced] What is Union-Find and why use path compression?
A disjoint-set structure supporting ¦find(x)¦ (which set?) and ¦union(a, b)¦ (merge sets). With path compression (point nodes directly to the root while finding) and union by rank/size, operations run in nearly O(1) amortised (inverse Ackermann). Use for connected components, detecting cycles in undirected graphs, redundant connections and Kruskal's minimum spanning tree.

### [advanced] How do you implement an LRU cache with O(1) operations?
Combine a hash map (key to node) with a doubly linked list ordered by recency: ¦get¦ moves the node to the front; ¦put¦ inserts at the front and evicts the tail when capacity is exceeded. In JavaScript, a ¦Map¦ preserves insertion order, so delete-and-reinsert on access and evicting ¦map.keys().next().value¦ achieves the same with less code, still O(1).

### [advanced] How do you detect and explain a hidden O(n²) in real application code?
Look for loops that call ¦includes/find/filter¦ inside another loop, database queries inside loops (N+1), repeated sorting inside renders, and string concatenation in loops. Fix with Maps/Sets for lookups, batching queries, memoisation, pagination and indexes. On your projects: describe measuring first (profiler, EXPLAIN), then replacing the nested search with a Map, and quote the before/after numbers.

### [advanced] How do you talk through a coding problem in an interview?
1. Restate the problem and ask about input size, duplicates, negatives, empty input and expected output. 2. Walk through a small example. 3. State the brute force and its complexity. 4. Improve with a pattern (hash map, two pointers, heap, DP) and explain why. 5. Code cleanly with good names. 6. Test with normal, edge and tricky cases, then state final time and space complexity. Narrate your thinking; silence is the biggest mistake.

### [advanced] How do you choose the right data structure for a problem?
Need fast lookup by key: Map/Set. Need ordering or range queries: sorted array with binary search, or a tree. Need the min/max repeatedly: heap. Need LIFO: stack; FIFO: queue. Prefix searching: trie. Relationships between items: graph. Grouping and connectivity: union-find. Ask "what operation do I repeat most?" and pick the structure that makes it cheapest.

## EXERCISES

### [basic] Two sum
Given an array of integers ¦nums¦ and a ¦target¦, return the indices of the two numbers that add up to the target. Exactly one solution exists; do not use the same element twice.
¦¦¦js
twoSum([2, 7, 11, 15], 9)  // [0, 1]
twoSum([3, 2, 4], 6)       // [1, 2]
twoSum([3, 3], 6)          // [0, 1]
¦¦¦
> Hint: For each number, which value would complete the pair? Store seen numbers in a Map.
--- solution ---
Brute force checks every pair, O(n²). Instead, store each number's index in a Map and look for the complement as you scan.
¦¦¦js
function twoSum(nums, target) {
  const seen = new Map();                 // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];        // the number that completes the pair
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);                 // store after checking (no self reuse)
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]
¦¦¦
**Complexity:** time O(n), space O(n).
--- starter ---
¦¦¦js
function twoSum(nums, target) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example: [2, 7, 11, 15], target 9', () => { eq(twoSum([2, 7, 11, 15], 9), [0, 1]); });
test('pair is not at the start', () => { eq(twoSum([3, 2, 4], 6), [1, 2]); });
test('duplicate values', () => { eq(twoSum([3, 3], 6), [0, 1]); });
test('negative numbers and zero target', () => { eq(twoSum([-3, 4, 3, 90], 0), [0, 2]); });
test('does not reuse the same element', () => { eq(twoSum([5, 2, 8], 10), [1, 2]); });
test('large input (50,000 numbers) finishes quickly', () => {
  const n = 50000;
  const nums = Array.from({ length: n }, (_, i) => i * 2);
  eq(twoSum(nums, nums[n - 2] + nums[n - 1]), [n - 2, n - 1]);
});
¦¦¦


### [basic] Valid anagram
Return ¦true¦ if string ¦t¦ is an anagram of string ¦s¦ (same letters, same counts). Assume lowercase English letters.
¦¦¦js
isAnagram('anagram', 'nagaram') // true
isAnagram('rat', 'car')         // false
¦¦¦
> Hint: Count letters of one string up, the other down. Everything must return to zero.
--- solution ---
¦¦¦js
function isAnagram(s, t) {
  if (s.length !== t.length) return false;     // quick reject
  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - 97]++;            // 'a' is 97
    counts[t.charCodeAt(i) - 97]--;
  }
  return counts.every(c => c === 0);
}

console.log(isAnagram('anagram', 'nagaram')); // true
console.log(isAnagram('rat', 'car'));         // false
¦¦¦
For Unicode input, use a ¦Map¦ instead of a 26-slot array. **Complexity:** time O(n), space O(1) (fixed 26 slots).
--- starter ---
¦¦¦js
function isAnagram(s, t) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('anagram', () => { eq(isAnagram('anagram', 'nagaram'), true); });
test('not an anagram', () => { eq(isAnagram('rat', 'car'), false); });
test('different lengths', () => { eq(isAnagram('ab', 'abc'), false); });
test('both empty', () => { eq(isAnagram('', ''), true); });
test('same letters, different counts', () => { eq(isAnagram('aacc', 'ccac'), false); });
test('single identical letter', () => { eq(isAnagram('z', 'z'), true); });
test('large strings (100,000 letters)', () => {
  const s = 'abcdefghij'.repeat(10000);
  const t = [...s].reverse().join('');
  eq(isAnagram(s, t), true);
});
¦¦¦


### [basic] Group anagrams
Group the words that are anagrams of each other.
¦¦¦js
groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
// [['eat','tea','ate'], ['tan','nat'], ['bat']]
¦¦¦
> Hint: Anagrams share the same sorted letters. Use that as a Map key.
--- solution ---
¦¦¦js
function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join('');        // 'eat' and 'tea' -> 'aet'
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}

console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));
// [ [ 'eat', 'tea', 'ate' ], [ 'tan', 'nat' ], [ 'bat' ] ]
¦¦¦
**Complexity:** time O(n · k log k) for n words of length k, space O(n · k). A character-count key (26 numbers joined) makes it O(n · k).
--- starter ---
¦¦¦js
function groupAnagrams(words) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const gaNorm = g => g.map(x => [...x].sort()).sort((a, b) => a.join('').localeCompare(b.join('')));
test('example', () => {
  eq(gaNorm(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])), gaNorm([['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]));
});
test('empty array', () => { eq(groupAnagrams([]), []); });
test('single word', () => { eq(groupAnagrams(['a']), [['a']]); });
test('no anagrams at all', () => {
  eq(gaNorm(groupAnagrams(['abc', 'def', 'ghi'])), gaNorm([['abc'], ['def'], ['ghi']]));
});
test('all words are the same anagram group', () => {
  eq(gaNorm(groupAnagrams(['abc', 'bca', 'cab'])), gaNorm([['abc', 'bca', 'cab']]));
});
test('empty string forms its own group', () => {
  eq(gaNorm(groupAnagrams(['', 'a', ''])), gaNorm([['', ''], ['a']]));
});
¦¦¦


### [basic] Longest substring without repeating characters
Return the length of the longest substring of ¦s¦ that has no repeated characters.
¦¦¦js
lengthOfLongestSubstring('abcabcbb') // 3 ('abc')
lengthOfLongestSubstring('bbbbb')     // 1
lengthOfLongestSubstring('pwwkew')    // 3 ('wke')
¦¦¦
> Hint: Slide a window; when a repeat appears, jump the left edge just past the previous occurrence.
--- solution ---
¦¦¦js
function lengthOfLongestSubstring(s) {
  const last = new Map();   // char -> last index seen
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    // repeated inside the current window: move left past it
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(lengthOfLongestSubstring('abcabcbb')); // 3
console.log(lengthOfLongestSubstring('bbbbb'));    // 1
console.log(lengthOfLongestSubstring('pwwkew'));   // 3
console.log(lengthOfLongestSubstring(''));         // 0
¦¦¦
**Complexity:** time O(n), space O(min(n, alphabet)).
--- starter ---
¦¦¦js
function lengthOfLongestSubstring(s) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('abcabcbb -> 3', () => { eq(lengthOfLongestSubstring('abcabcbb'), 3); });
test('bbbbb -> 1', () => { eq(lengthOfLongestSubstring('bbbbb'), 1); });
test('pwwkew -> 3', () => { eq(lengthOfLongestSubstring('pwwkew'), 3); });
test('empty string -> 0', () => { eq(lengthOfLongestSubstring(''), 0); });
test('abba -> 2 (left edge must never move backwards)', () => { eq(lengthOfLongestSubstring('abba'), 2); });
test('dvdf -> 3', () => { eq(lengthOfLongestSubstring('dvdf'), 3); });
test('single space -> 1', () => { eq(lengthOfLongestSubstring(' '), 1); });
test('long input (100,000 chars)', () => { eq(lengthOfLongestSubstring('abcdefghij'.repeat(10000)), 10); });
¦¦¦


### [basic] Best time to buy and sell stock
Given daily prices, return the maximum profit from one buy followed by one later sell (0 if none).
¦¦¦js
maxProfit([7, 1, 5, 3, 6, 4]) // 5 (buy 1, sell 6)
maxProfit([7, 6, 4, 3, 1])    // 0
¦¦¦
> Hint: Track the lowest price so far; at each day, profit is price minus that minimum.
--- solution ---
¦¦¦js
function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;          // cheapest buy so far
    else best = Math.max(best, p - minPrice); // sell today
  }
  return best;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1]));    // 0
¦¦¦
**Complexity:** time O(n), space O(1).
--- starter ---
¦¦¦js
function maxProfit(prices) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example: buy 1, sell 6', () => { eq(maxProfit([7, 1, 5, 3, 6, 4]), 5); });
test('prices only fall -> 0', () => { eq(maxProfit([7, 6, 4, 3, 1]), 0); });
test('empty array -> 0', () => { eq(maxProfit([]), 0); });
test('single day -> 0', () => { eq(maxProfit([5]), 0); });
test('always rising', () => { eq(maxProfit([1, 2, 3, 4, 5]), 4); });
test('lowest price comes last (cannot sell before buy)', () => { eq(maxProfit([2, 4, 1]), 2); });
test('large rising input (100,000 days)', () => { eq(maxProfit(Array.from({ length: 100000 }, (_, i) => i)), 99999); });
¦¦¦


### [basic] Maximum subarray (Kadane's algorithm)
Find the contiguous subarray with the largest sum and return that sum.
¦¦¦js
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) // 6 ([4, -1, 2, 1])
maxSubArray([5, 4, -1, 7, 8])                // 23
maxSubArray([-3, -1, -2])                    // -1
¦¦¦
> Hint: At each element decide: extend the previous subarray or start fresh here.
--- solution ---
¦¦¦js
function maxSubArray(nums) {
  let current = nums[0];     // best sum ending at this index
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]); // extend or restart
    best = Math.max(best, current);
  }
  return best;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([5, 4, -1, 7, 8]));                // 23
console.log(maxSubArray([-3, -1, -2]));                    // -1
¦¦¦
Initialising with ¦nums[0]¦ (not 0) handles all-negative arrays. **Complexity:** time O(n), space O(1).
--- starter ---
¦¦¦js
function maxSubArray(nums) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('classic example -> 6', () => { eq(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6); });
test('mostly positive -> 23', () => { eq(maxSubArray([5, 4, -1, 7, 8]), 23); });
test('all negative returns the largest element', () => { eq(maxSubArray([-3, -1, -2]), -1); });
test('single element', () => { eq(maxSubArray([1]), 1); });
test('single negative element', () => { eq(maxSubArray([-1]), -1); });
test('two negatives', () => { eq(maxSubArray([-2, -1]), -1); });
test('large input (100,000 ones)', () => { eq(maxSubArray(new Array(100000).fill(1)), 100000); });
¦¦¦


### [intermediate] Product of array except self
Return an array where ¦out[i]¦ is the product of all elements except ¦nums[i]¦, without using division, in O(n).
¦¦¦js
productExceptSelf([1, 2, 3, 4]) // [24, 12, 8, 6]
productExceptSelf([1, 0, 3])    // [0, 3, 0]
¦¦¦
> Hint: Multiply everything to the left of i, then everything to the right, in two passes.
--- solution ---
¦¦¦js
function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);

  let left = 1;                       // product of elements left of i
  for (let i = 0; i < n; i++) {
    out[i] = left;
    left *= nums[i];
  }

  let right = 1;                      // product of elements right of i
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}

console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]
console.log(productExceptSelf([1, 0, 3]));    // [0, 3, 0]
¦¦¦
**Complexity:** time O(n), extra space O(1) beyond the output.
--- starter ---
¦¦¦js
function productExceptSelf(nums) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example [1, 2, 3, 4]', () => { eq(productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]); });
test('one zero', () => { eq(productExceptSelf([1, 0, 3]), [0, 3, 0]); });
test('two zeros', () => { eq(productExceptSelf([0, 0]), [0, 0]); });
test('two elements swap', () => { eq(productExceptSelf([2, 3]), [3, 2]); });
test('negatives and a zero', () => { eq(productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]); });
test('does not change the input array', () => {
  const input = [1, 2, 3];
  productExceptSelf(input);
  eq(input, [1, 2, 3]);
});
test('large input (50,000 ones)', () => {
  const r = productExceptSelf(new Array(50000).fill(1));
  eq(r.length, 50000);
  ok(r.every(x => x === 1), 'every value should be 1');
});
¦¦¦


### [intermediate] Container with most water
Given heights of vertical lines, pick two lines that together with the x-axis hold the most water. Return the maximum area.
¦¦¦js
maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) // 49
maxArea([1, 1])                      // 1
¦¦¦
> Hint: Start with the widest pair and move the shorter line inward; moving the taller one can never help.
--- solution ---
¦¦¦js
function maxArea(height) {
  let l = 0;
  let r = height.length - 1;
  let best = 0;
  while (l < r) {
    const area = Math.min(height[l], height[r]) * (r - l);
    best = Math.max(best, area);
    // the shorter side limits the area, so move it
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                      // 1
¦¦¦
**Complexity:** time O(n), space O(1).
--- starter ---
¦¦¦js
function maxArea(height) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example -> 49', () => { eq(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49); });
test('two lines -> 1', () => { eq(maxArea([1, 1]), 1); });
test('tall walls at both ends', () => { eq(maxArea([4, 3, 2, 1, 4]), 16); });
test('[1, 2, 1] -> 2', () => { eq(maxArea([1, 2, 1]), 2); });
test('[1, 2, 4, 3] -> 4', () => { eq(maxArea([1, 2, 4, 3]), 4); });
test('large input (100,000 equal lines)', () => { eq(maxArea(new Array(100000).fill(5)), 5 * 99999); });
¦¦¦


### [intermediate] 3Sum
Return all unique triplets that sum to zero.
¦¦¦js
threeSum([-1, 0, 1, 2, -1, -4]) // [[-1,-1,2], [-1,0,1]]
threeSum([0, 0, 0])             // [[0,0,0]]
threeSum([1, 2, 3])             // []
¦¦¦
> Hint: Sort first. Fix one number, then use two pointers for the rest and skip duplicates.
--- solution ---
¦¦¦js
function threeSum(input) {
  const nums = [...input].sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;                          // smallest is positive: no more zero sums
    if (i > 0 && nums[i] === nums[i - 1]) continue;  // skip duplicate anchors
    let l = i + 1;
    let r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        l++; r--;
        while (l < r && nums[l] === nums[l - 1]) l++;   // skip duplicate left
        while (l < r && nums[r] === nums[r + 1]) r--;   // skip duplicate right
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [ [ -1, -1, 2 ], [ -1, 0, 1 ] ]
console.log(threeSum([0, 0, 0]));             // [ [ 0, 0, 0 ] ]
console.log(threeSum([1, 2, 3]));             // []
¦¦¦
**Complexity:** time O(n²), space O(1) besides output (sorting aside).
--- starter ---
¦¦¦js
function threeSum(nums) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const tsNorm = r => r.map(t => [...t].sort((a, b) => a - b));
test('example', () => { sameItems(tsNorm(threeSum([-1, 0, 1, 2, -1, -4])), [[-1, -1, 2], [-1, 0, 1]]); });
test('all zeros -> one triplet', () => { sameItems(tsNorm(threeSum([0, 0, 0])), [[0, 0, 0]]); });
test('no triplet', () => { eq(threeSum([1, 2, 3]), []); });
test('fewer than three numbers', () => { eq(threeSum([0, 0]), []); });
test('empty array', () => { eq(threeSum([]), []); });
test('four zeros -> still one unique triplet', () => { sameItems(tsNorm(threeSum([0, 0, 0, 0])), [[0, 0, 0]]); });
test('duplicates inside a triplet', () => { sameItems(tsNorm(threeSum([-2, 0, 1, 1, 2])), [[-2, 0, 2], [-2, 1, 1]]); });
test('large input (2,000 zeros)', () => { sameItems(tsNorm(threeSum(new Array(2000).fill(0))), [[0, 0, 0]]); });
¦¦¦


### [advanced] Trapping rain water
Given elevation heights, compute how much water is trapped after raining.
¦¦¦js
trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) // 6
trap([4, 2, 0, 3, 2, 5])                   // 9
¦¦¦
> Hint: Water above a bar = min(tallest on the left, tallest on the right) minus its height. Do it with two pointers.
--- solution ---
¦¦¦js
function trap(h) {
  let l = 0;
  let r = h.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (l < r) {
    if (h[l] < h[r]) {
      // the left side is the limiting side
      if (h[l] >= leftMax) leftMax = h[l];
      else water += leftMax - h[l];
      l++;
    } else {
      if (h[r] >= rightMax) rightMax = h[r];
      else water += rightMax - h[r];
      r--;
    }
  }
  return water;
}

console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trap([4, 2, 0, 3, 2, 5]));                   // 9
¦¦¦
**Complexity:** time O(n), space O(1). The prefix/suffix max array version is O(n) space and easier to explain first.
--- starter ---
¦¦¦js
function trap(height) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example -> 6', () => { eq(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6); });
test('example -> 9', () => { eq(trap([4, 2, 0, 3, 2, 5]), 9); });
test('empty array', () => { eq(trap([]), 0); });
test('single bar', () => { eq(trap([3]), 0); });
test('ascending staircase holds nothing', () => { eq(trap([1, 2, 3]), 0); });
test('simple basin', () => { eq(trap([3, 0, 3]), 3); });
test('uneven walls', () => { eq(trap([5, 4, 1, 2]), 1); });
test('wide basin (100,000 bars)', () => {
  const h = new Array(100000).fill(0);
  h[0] = 10; h[99999] = 10;
  eq(trap(h), 10 * 99998);
});
¦¦¦


### [intermediate] Binary search and search in rotated sorted array
(a) Implement binary search returning the index or -1. (b) Search a target in a sorted array that was rotated at an unknown pivot.
¦¦¦js
binarySearch([1, 3, 5, 7, 9], 7)        // 3
searchRotated([4, 5, 6, 7, 0, 1, 2], 0) // 4
searchRotated([4, 5, 6, 7, 0, 1, 2], 3) // -1
¦¦¦
> Hint: In a rotated array, one half around mid is always sorted. Decide if the target lies in that sorted half.
--- solution ---
¦¦¦js
function binarySearch(a, target) {
  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

function searchRotated(a, target) {
  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] === target) return mid;
    if (a[lo] <= a[mid]) {                        // left half is sorted
      if (a[lo] <= target && target < a[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                      // right half is sorted
      if (a[mid] < target && target <= a[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9], 7));          // 3
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0));   // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3));   // -1
¦¦¦
**Complexity:** time O(log n), space O(1). With duplicates, the rotated version can degrade to O(n).
--- starter ---
¦¦¦js
function binarySearch(a, target) {
  // your code here
}

function searchRotated(a, target) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('binarySearch: found in the middle', () => { eq(binarySearch([1, 3, 5, 7, 9], 5), 2); });
test('binarySearch: first and last element', () => {
  eq(binarySearch([1, 3, 5, 7, 9], 1), 0);
  eq(binarySearch([1, 3, 5, 7, 9], 9), 4);
});
test('binarySearch: missing value and empty array', () => {
  eq(binarySearch([1, 3, 5, 7, 9], 4), -1);
  eq(binarySearch([], 1), -1);
});
test('searchRotated: target after the pivot', () => { eq(searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4); });
test('searchRotated: target before the pivot', () => { eq(searchRotated([4, 5, 6, 7, 0, 1, 2], 6), 2); });
test('searchRotated: missing target', () => { eq(searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1); });
test('searchRotated: tiny arrays', () => {
  eq(searchRotated([1], 1), 0);
  eq(searchRotated([3, 1], 1), 1);
  eq(searchRotated([1, 3], 3), 1);
});
test('searchRotated: 100,000 elements', () => {
  const big = Array.from({ length: 100000 }, (_, i) => (i + 40000) % 100000);
  eq(searchRotated(big, 0), 60000);
  eq(searchRotated(big, 99999), 59999);
  eq(searchRotated(big, 100000), -1);
});
¦¦¦


### [intermediate] Merge intervals
Merge all overlapping intervals.
¦¦¦js
merge([[1, 3], [2, 6], [8, 10], [15, 18]]) // [[1,6], [8,10], [15,18]]
merge([[1, 4], [4, 5]])                    // [[1,5]]
¦¦¦
> Hint: Sort by start time. Then each interval either overlaps the last merged one or starts a new one.
--- solution ---
¦¦¦js
function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const res = [];
  for (const [start, end] of sorted) {
    const last = res[res.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);   // overlap: extend the previous interval
    } else {
      res.push([start, end]);             // no overlap: new interval (fresh array)
    }
  }
  return res;
}

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]])); // [ [ 1, 6 ], [ 8, 10 ], [ 15, 18 ] ]
console.log(merge([[1, 4], [4, 5]]));                    // [ [ 1, 5 ] ]
¦¦¦
**Complexity:** time O(n log n) from sorting, space O(n).
--- starter ---
¦¦¦js
function merge(intervals) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example', () => { eq(merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]); });
test('touching intervals merge', () => { eq(merge([[1, 4], [4, 5]]), [[1, 5]]); });
test('unsorted input', () => { eq(merge([[8, 10], [1, 3], [2, 6]]), [[1, 6], [8, 10]]); });
test('one interval inside another', () => { eq(merge([[1, 10], [2, 3]]), [[1, 10]]); });
test('single interval and empty input', () => {
  eq(merge([[5, 6]]), [[5, 6]]);
  eq(merge([]), []);
});
test('does not change the input', () => {
  const input = [[2, 3], [1, 2]];
  merge(input);
  eq(input, [[2, 3], [1, 2]]);
});
test('large input (50,000 separate intervals)', () => {
  const input = Array.from({ length: 50000 }, (_, i) => [i * 3, i * 3 + 1]);
  eq(merge(input).length, 50000);
});
¦¦¦


### [basic] Reverse a linked list
Reverse a singly linked list and return the new head.
¦¦¦js
// 1 -> 2 -> 3 -> 4 -> 5   becomes   5 -> 4 -> 3 -> 2 -> 1
¦¦¦
> Hint: Keep prev and current; before re-pointing current.next, save the original next node.
--- solution ---
¦¦¦js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
const fromArray = arr => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = head => { const out = []; for (let n = head; n; n = n.next) out.push(n.val); return out; };

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;   // 1. remember the rest of the list
    curr.next = prev;         // 2. flip the pointer
    prev = curr;              // 3. advance prev
    curr = next;              // 4. advance curr
  }
  return prev;                // prev is the new head
}

console.log(toArray(reverseList(fromArray([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(toArray(reverseList(fromArray([]))));              // []
¦¦¦
**Complexity:** time O(n), space O(1). The recursive version uses O(n) stack space.
--- starter ---
¦¦¦js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function reverseList(head) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const mkList = arr => { let head = null; for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head); return head; };
const listVals = head => { const out = []; for (let n = head; n; n = n.next) out.push(n.val); return out; };
test('reverses 1 -> 2 -> 3 -> 4 -> 5', () => { eq(listVals(reverseList(mkList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]); });
test('empty list returns null', () => { eq(reverseList(null), null); });
test('single node', () => { eq(listVals(reverseList(mkList([7]))), [7]); });
test('two nodes', () => { eq(listVals(reverseList(mkList([1, 2]))), [2, 1]); });
test('new tail points to null (no cycle left behind)', () => {
  const head = reverseList(mkList([1, 2, 3]));
  eq(listVals(head), [3, 2, 1]);
});
test('long list (5,000 nodes)', () => {
  const arr = Array.from({ length: 5000 }, (_, i) => i);
  eq(listVals(reverseList(mkList(arr))), [...arr].reverse());
});
¦¦¦


### [basic] Detect a cycle in a linked list
Return ¦true¦ if a linked list has a cycle. Then return the node where the cycle begins.
¦¦¦js
// 3 -> 2 -> 0 -> -4 -> (back to 2)   => true, start node value 2
¦¦¦
> Hint: A fast pointer (2 steps) will eventually lap a slow pointer (1 step) inside a cycle.
--- solution ---
¦¦¦js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function detectCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {                // they met inside the cycle
      let p = head;
      while (p !== slow) { p = p.next; slow = slow.next; } // meet at the entry
      return p;
    }
  }
  return null;                          // fast reached the end: no cycle
}

const a = new ListNode(3);
const b = new ListNode(2);
const c = new ListNode(0);
const d = new ListNode(-4);
a.next = b; b.next = c; c.next = d; d.next = b;   // cycle back to b
console.log(detectCycle(a).val);                  // 2
console.log(detectCycle(new ListNode(1)));        // null
¦¦¦
**Complexity:** time O(n), space O(1). The Set-of-visited-nodes approach is simpler but O(n) space.
--- starter ---
¦¦¦js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function detectCycle(head) {
  // return the node where the cycle begins, or null
}
¦¦¦
--- tests ---
¦¦¦js
const mkNodes = (n) => {
  const nodes = Array.from({ length: n }, (_, i) => new ListNode(i));
  for (let i = 0; i < n - 1; i++) nodes[i].next = nodes[i + 1];
  return nodes;
};
test('cycle back to the second node', () => {
  const nodes = mkNodes(4);
  nodes[3].next = nodes[1];
  ok(detectCycle(nodes[0]) === nodes[1], 'should return the node where the cycle starts');
});
test('no cycle returns null', () => { eq(detectCycle(mkNodes(3)[0]), null); });
test('empty list returns null', () => { eq(detectCycle(null), null); });
test('single node with no cycle', () => { eq(detectCycle(new ListNode(1)), null); });
test('single node pointing at itself', () => {
  const n = new ListNode(1);
  n.next = n;
  ok(detectCycle(n) === n);
});
test('whole list is a cycle (starts at head)', () => {
  const nodes = mkNodes(3);
  nodes[2].next = nodes[0];
  ok(detectCycle(nodes[0]) === nodes[0]);
});
test('long list (20,000 nodes) with a cycle in the middle', () => {
  const nodes = mkNodes(20000);
  nodes[19999].next = nodes[9000];
  ok(detectCycle(nodes[0]) === nodes[9000]);
});
¦¦¦


### [basic] Merge two sorted linked lists
Merge two sorted lists into one sorted list.
¦¦¦js
// 1->2->4 and 1->3->4   =>   1->1->2->3->4->4
¦¦¦
> Hint: Use a dummy head and a tail pointer; always append the smaller current node.
--- solution ---
¦¦¦js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
const fromArray = arr => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = head => { const out = []; for (let n = head; n; n = n.next) out.push(n.val); return out; };

function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);      // avoids special-casing the head
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    else { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = l1 || l2;               // append whichever list still has nodes
  return dummy.next;
}

console.log(toArray(mergeTwoLists(fromArray([1, 2, 4]), fromArray([1, 3, 4])))); // [1,1,2,3,4,4]
console.log(toArray(mergeTwoLists(fromArray([]), fromArray([0]))));              // [0]
¦¦¦
**Complexity:** time O(n + m), space O(1) (nodes are reused).
--- starter ---
¦¦¦js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function mergeTwoLists(l1, l2) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const mkList = arr => { let head = null; for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head); return head; };
const listVals = head => { const out = []; for (let n = head; n; n = n.next) out.push(n.val); return out; };
test('example 1->2->4 and 1->3->4', () => { eq(listVals(mergeTwoLists(mkList([1, 2, 4]), mkList([1, 3, 4]))), [1, 1, 2, 3, 4, 4]); });
test('first list empty', () => { eq(listVals(mergeTwoLists(mkList([]), mkList([0]))), [0]); });
test('second list empty', () => { eq(listVals(mergeTwoLists(mkList([5, 6]), mkList([]))), [5, 6]); });
test('both empty -> null', () => { eq(mergeTwoLists(null, null), null); });
test('different lengths', () => { eq(listVals(mergeTwoLists(mkList([1]), mkList([2, 3, 4, 5]))), [1, 2, 3, 4, 5]); });
test('negative numbers and duplicates', () => { eq(listVals(mergeTwoLists(mkList([-3, -1, 2]), mkList([-3, 0, 2]))), [-3, -3, -1, 0, 2, 2]); });
test('long lists (3,000 nodes each)', () => {
  const a = Array.from({ length: 3000 }, (_, i) => i * 2);
  const b = Array.from({ length: 3000 }, (_, i) => i * 2 + 1);
  const merged = listVals(mergeTwoLists(mkList(a), mkList(b)));
  eq(merged.length, 6000);
  ok(merged.every((v, i) => v === i), 'result should be 0..5999 in order');
});
¦¦¦


### [basic] Valid parentheses
Given a string of ¦()[]{}¦, return ¦true¦ if brackets are closed in the correct order.
¦¦¦js
isValid('()[]{}') // true
isValid('(]')     // false
isValid('([)]')   // false
isValid('{[]}')   // true
¦¦¦
> Hint: Push opening brackets; on a closing bracket, the top of the stack must be its partner.
--- solution ---
¦¦¦js
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;  // wrong or missing opener
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;                         // nothing left unclosed
}

console.log(isValid('()[]{}')); // true
console.log(isValid('(]'));     // false
console.log(isValid('([)]'));   // false
console.log(isValid('{[]}'));   // true
console.log(isValid('('));      // false
¦¦¦
**Complexity:** time O(n), space O(n).
--- starter ---
¦¦¦js
function isValid(s) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('all three pairs, in a row', () => { eq(isValid('()[]{}'), true); });
test('wrong closer', () => { eq(isValid('(]'), false); });
test('interleaved pairs', () => { eq(isValid('([)]'), false); });
test('nested pairs', () => { eq(isValid('{[]}'), true); });
test('empty string is valid', () => { eq(isValid(''), true); });
test('only an opener', () => { eq(isValid('('), false); });
test('only a closer', () => { eq(isValid(')'), false); });
test('deep nesting then a row', () => { eq(isValid('{[()]}([{}])()'), true); });
test('large valid input (100,000 chars)', () => { eq(isValid('()'.repeat(50000)), true); });
test('large invalid input (50,000 openers)', () => { eq(isValid('('.repeat(50000)), false); });
¦¦¦


### [intermediate] Min stack
Design a stack supporting ¦push¦, ¦pop¦, ¦top¦ and ¦getMin¦, all in O(1).
¦¦¦js
const s = new MinStack();
s.push(-2); s.push(0); s.push(-3);
s.getMin(); // -3
s.pop();
s.top();    // 0
s.getMin(); // -2
¦¦¦
> Hint: Store each value together with the minimum seen so far.
--- solution ---
¦¦¦js
class MinStack {
  constructor() { this.stack = []; }          // items: [value, minAtThisPoint]
  push(x) {
    const min = this.stack.length ? Math.min(x, this.getMin()) : x;
    this.stack.push([x, min]);
  }
  pop() { this.stack.pop(); }
  top() { return this.stack[this.stack.length - 1][0]; }
  getMin() { return this.stack[this.stack.length - 1][1]; }
}

const s = new MinStack();
s.push(-2); s.push(0); s.push(-3);
console.log(s.getMin()); // -3
s.pop();
console.log(s.top());    // 0
console.log(s.getMin()); // -2
¦¦¦
**Complexity:** every operation O(1); space O(n).
--- starter ---
¦¦¦js
class MinStack {
  constructor() {
    // your code here
  }
  push(x) {}
  pop() {}
  top() {}
  getMin() {}
}
¦¦¦
--- tests ---
¦¦¦js
test('example from the problem', () => {
  const st = new MinStack();
  st.push(-2); st.push(0); st.push(-3);
  eq(st.getMin(), -3);
  st.pop();
  eq(st.top(), 0);
  eq(st.getMin(), -2);
});
test('single element', () => {
  const st = new MinStack();
  st.push(5);
  eq(st.top(), 5);
  eq(st.getMin(), 5);
});
test('duplicate minimums survive one pop', () => {
  const st = new MinStack();
  st.push(1); st.push(1);
  st.pop();
  eq(st.getMin(), 1);
});
test('increasing pushes keep the first as minimum', () => {
  const st = new MinStack();
  st.push(1); st.push(2); st.push(3);
  eq(st.getMin(), 1);
  st.pop(); st.pop();
  eq(st.getMin(), 1);
});
test('minimum is restored after popping the smallest', () => {
  const st = new MinStack();
  st.push(5); st.push(3); st.push(4); st.push(1);
  eq(st.getMin(), 1);
  st.pop();
  eq(st.getMin(), 3);
  st.pop(); st.pop();
  eq(st.getMin(), 5);
});
test('large number of operations (100,000)', () => {
  const st = new MinStack();
  for (let i = 100000; i > 0; i--) st.push(i);
  eq(st.getMin(), 1);
  for (let i = 0; i < 99999; i++) st.pop();
  eq(st.top(), 100000);
  eq(st.getMin(), 100000);
});
¦¦¦


### [intermediate] Binary tree level-order traversal
Return the values of a binary tree level by level.
¦¦¦js
//     3
//    / \
//   9  20
//      / \
//     15  7        => [[3], [9, 20], [15, 7]]
¦¦¦
> Hint: Use a queue; process exactly the number of nodes that were in the queue at the start of each level.
--- solution ---
¦¦¦js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function levelOrder(root) {
  if (!root) return [];
  const result = [];
  let queue = [root];
  while (queue.length) {
    const next = [];
    const level = [];
    for (const node of queue) {           // everything in queue is one level
      level.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    result.push(level);
    queue = next;                          // avoids O(n) shift() calls
  }
  return result;
}

const tree = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log(levelOrder(tree)); // [ [ 3 ], [ 9, 20 ], [ 15, 7 ] ]
console.log(levelOrder(null)); // []
¦¦¦
**Complexity:** time O(n), space O(w) where w is the maximum tree width.
--- starter ---
¦¦¦js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function levelOrder(root) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const mkTree = vals => {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]), q = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const node = q.shift();
    if (i < vals.length && vals[i] !== null) { node.left = new TreeNode(vals[i]); q.push(node.left); }
    i++;
    if (i < vals.length && vals[i] !== null) { node.right = new TreeNode(vals[i]); q.push(node.right); }
    i++;
  }
  return root;
};
test('example [3, 9, 20, null, null, 15, 7]', () => { eq(levelOrder(mkTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]); });
test('empty tree', () => { eq(levelOrder(null), []); });
test('single node', () => { eq(levelOrder(mkTree([1])), [[1]]); });
test('left-leaning chain', () => { eq(levelOrder(mkTree([1, 2, null, 3])), [[1], [2], [3]]); });
test('complete tree of 7 nodes', () => { eq(levelOrder(mkTree([1, 2, 3, 4, 5, 6, 7])), [[1], [2, 3], [4, 5, 6, 7]]); });
test('large perfect tree (16,383 nodes)', () => {
  const build = d => d === 0 ? null : new TreeNode(d, build(d - 1), build(d - 1));
  const levels = levelOrder(build(14));
  eq(levels.length, 14);
  eq(levels[13].length, 8192);
});
¦¦¦


### [intermediate] Validate a binary search tree
Return ¦true¦ if a binary tree is a valid BST (left < node < right for the whole subtree).
¦¦¦js
//   2        valid           5
//  / \                      / \
// 1   3                    1   4
//                              / \
//                             3   6      invalid (3 is left of 5's right child 4 but < 5)
¦¦¦
> Hint: Pass the allowed (min, max) range down. Checking only direct children is not enough.
--- solution ---
¦¦¦js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;   // outside allowed range
  return isValidBST(node.left, min, node.val) &&           // left must be < node
         isValidBST(node.right, node.val, max);            // right must be > node
}

const valid = new TreeNode(2, new TreeNode(1), new TreeNode(3));
const invalid = new TreeNode(5, new TreeNode(1), new TreeNode(4, new TreeNode(3), new TreeNode(6)));
console.log(isValidBST(valid));   // true
console.log(isValidBST(invalid)); // false
¦¦¦
**Complexity:** time O(n), space O(h) recursion depth.
--- starter ---
¦¦¦js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function isValidBST(node) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const mkTree = vals => {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]), q = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const node = q.shift();
    if (i < vals.length && vals[i] !== null) { node.left = new TreeNode(vals[i]); q.push(node.left); }
    i++;
    if (i < vals.length && vals[i] !== null) { node.right = new TreeNode(vals[i]); q.push(node.right); }
    i++;
  }
  return root;
};
test('valid: [2, 1, 3]', () => { eq(isValidBST(mkTree([2, 1, 3])), true); });
test('invalid: right child has a smaller node on the left', () => { eq(isValidBST(mkTree([5, 1, 4, null, null, 3, 6])), false); });
test('empty tree is valid', () => { eq(isValidBST(null), true); });
test('single node is valid', () => { eq(isValidBST(mkTree([1])), true); });
test('equal values are not allowed', () => { eq(isValidBST(mkTree([2, 2, 2])), false); });
test('deep violation: 3 sits in the right subtree of 5', () => { eq(isValidBST(mkTree([5, 4, 6, null, null, 3, 7])), false); });
test('deep violation on the other side', () => { eq(isValidBST(mkTree([10, 5, 15, null, null, 6, 20])), false); });
test('long valid chain (5,000 nodes)', () => {
  let node = null;
  for (let v = 5000; v >= 1; v--) node = new TreeNode(v, null, node);
  eq(isValidBST(node), true);
});
¦¦¦


### [intermediate] Lowest common ancestor of a binary tree
Given a binary tree and two nodes ¦p¦ and ¦q¦, return their lowest common ancestor.
¦¦¦js
//        3
//      /   \
//     5     1
//    / \   / \
//   6   2 0   8
// LCA(5, 1) = 3     LCA(5, 6) = 5
¦¦¦
> Hint: Search both subtrees. If p is found on one side and q on the other, the current node is the LCA.
--- solution ---
¦¦¦js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;      // found a target (or null)
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;                          // p and q are on different sides
  return left || right;                                    // both are in the same subtree
}

const n6 = new TreeNode(6), n2 = new TreeNode(2), n0 = new TreeNode(0), n8 = new TreeNode(8);
const n5 = new TreeNode(5, n6, n2);
const n1 = new TreeNode(1, n0, n8);
const root = new TreeNode(3, n5, n1);
console.log(lowestCommonAncestor(root, n5, n1).val); // 3
console.log(lowestCommonAncestor(root, n5, n6).val); // 5
¦¦¦
**Complexity:** time O(n), space O(h). For a BST you can do O(h) by comparing values and walking down one path.
--- starter ---
¦¦¦js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function lowestCommonAncestor(root, p, q) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const mkTree = vals => {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]), q = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const node = q.shift();
    if (i < vals.length && vals[i] !== null) { node.left = new TreeNode(vals[i]); q.push(node.left); }
    i++;
    if (i < vals.length && vals[i] !== null) { node.right = new TreeNode(vals[i]); q.push(node.right); }
    i++;
  }
  return root;
};
const findNode = (node, val) => {
  if (!node) return null;
  if (node.val === val) return node;
  return findNode(node.left, val) || findNode(node.right, val);
};
const sample = () => mkTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
test('LCA(5, 1) is the root 3', () => {
  const r = sample();
  ok(lowestCommonAncestor(r, findNode(r, 5), findNode(r, 1)) === r);
});
test('LCA(5, 4) is 5 (a node can be its own ancestor)', () => {
  const r = sample();
  ok(lowestCommonAncestor(r, findNode(r, 5), findNode(r, 4)) === findNode(r, 5));
});
test('LCA(7, 4) is 2', () => {
  const r = sample();
  ok(lowestCommonAncestor(r, findNode(r, 7), findNode(r, 4)) === findNode(r, 2));
});
test('LCA(6, 8) is 3', () => {
  const r = sample();
  ok(lowestCommonAncestor(r, findNode(r, 6), findNode(r, 8)) === r);
});
test('same node twice', () => {
  const r = sample();
  const n = findNode(r, 7);
  ok(lowestCommonAncestor(r, n, n) === n);
});
test('two-node tree', () => {
  const r = mkTree([1, 2]);
  ok(lowestCommonAncestor(r, r, r.left) === r);
});
test('deep chain (3,000 nodes)', () => {
  let node = null, deepest = null;
  for (let v = 3000; v >= 1; v--) { node = new TreeNode(v, node, null); if (!deepest) deepest = node; }
  ok(lowestCommonAncestor(node, deepest, node) === node);
});
¦¦¦


### [intermediate] Top K frequent elements
Return the ¦k¦ most frequent elements of an array.
¦¦¦js
topKFrequent([1, 1, 1, 2, 2, 3], 2) // [1, 2]
topKFrequent([1], 1)                // [1]
¦¦¦
> Hint: Count with a Map, then bucket numbers by frequency (index = count) instead of sorting.
--- solution ---
¦¦¦js
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  // buckets[c] holds the numbers that appear exactly c times
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, c] of freq) buckets[c].push(n);

  const res = [];
  for (let c = buckets.length - 1; c >= 0 && res.length < k; c--) {
    for (const n of buckets[c]) {
      res.push(n);
      if (res.length === k) break;
    }
  }
  return res;
}

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1, 2]
console.log(topKFrequent([1], 1));                // [1]
¦¦¦
**Complexity:** time O(n), space O(n). A min-heap of size k gives O(n log k) and works for streams.
--- starter ---
¦¦¦js
function topKFrequent(nums, k) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example: [1,1,1,2,2,3], k = 2', () => { sameItems(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]); });
test('single element', () => { eq(topKFrequent([1], 1), [1]); });
test('k equals the number of distinct values', () => { sameItems(topKFrequent([4, 4, 5, 6], 3), [4, 5, 6]); });
test('negative numbers', () => { eq(topKFrequent([-1, -1, -2], 1), [-1]); });
test('k = 1 picks the most frequent', () => { eq(topKFrequent([3, 0, 1, 0], 1), [0]); });
test('returns exactly k values', () => { eq(topKFrequent([1, 2, 3, 1, 2, 1], 2).length, 2); });
test('large input (100,500 numbers)', () => {
  const nums = Array.from({ length: 100000 }, (_, i) => i % 1000);
  for (let i = 0; i < 500; i++) nums.push(7);
  eq(topKFrequent(nums, 1), [7]);
});
¦¦¦


### [intermediate] Number of islands
Given a grid of ¦'1'¦ (land) and ¦'0'¦ (water), count the islands (land connected up, down, left, right).
¦¦¦js
numIslands([
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1'],
]) // 3
¦¦¦
> Hint: When you find land, flood-fill the whole island (DFS) and mark it visited.
--- solution ---
¦¦¦js
function numIslands(input) {
  const grid = input.map(row => [...row]);    // copy so the input is not mutated
  const rows = grid.length;
  const cols = rows ? grid[0].length : 0;
  let count = 0;

  function sink(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';                         // mark visited
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; sink(r, c); }
    }
  }
  return count;
}

console.log(numIslands([
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1'],
])); // 3
¦¦¦
**Complexity:** time O(rows · cols), space O(rows · cols) (copy plus recursion). Use an explicit stack for very large grids to avoid stack overflow.
--- starter ---
¦¦¦js
function numIslands(grid) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('example with 3 islands', () => {
  eq(numIslands([
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
  ]), 3);
});
test('one big island', () => { eq(numIslands([['1', '1'], ['1', '1']]), 1); });
test('empty grid', () => { eq(numIslands([]), 0); });
test('all water', () => { eq(numIslands([['0', '0'], ['0', '0']]), 0); });
test('single land cell', () => { eq(numIslands([['1']]), 1); });
test('diagonal cells are not connected', () => { eq(numIslands([['1', '0', '1'], ['0', '1', '0'], ['1', '0', '1']]), 5); });
test('does not change the input grid', () => {
  const g = [['1', '0'], ['0', '1']];
  numIslands(g);
  eq(g, [['1', '0'], ['0', '1']]);
});
test('large striped grid (100 x 100)', () => {
  const g = Array.from({ length: 100 }, (_, r) => new Array(100).fill(r % 2 === 0 ? '1' : '0'));
  eq(numIslands(g), 50);
});
¦¦¦


### [advanced] Course schedule (topological sort)
There are ¦n¦ courses. ¦prerequisites[i] = [course, prereq]¦ means you must take ¦prereq¦ first. Return ¦true¦ if you can finish all courses.
¦¦¦js
canFinish(2, [[1, 0]])         // true
canFinish(2, [[1, 0], [0, 1]]) // false (cycle)
¦¦¦
> Hint: Build the graph with in-degrees, then repeatedly take courses with in-degree 0 (Kahn's algorithm).
--- solution ---
¦¦¦js
function canFinish(n, prerequisites) {
  const adj = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);        // prereq -> course
    indegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) queue.push(i);

  let taken = 0;
  for (let head = 0; head < queue.length; head++) {   // index pointer, no shift()
    const u = queue[head];
    taken++;
    for (const v of adj[u]) {
      if (--indegree[v] === 0) queue.push(v);
    }
  }
  return taken === n;                // fewer means a cycle blocked some courses
}

console.log(canFinish(2, [[1, 0]]));          // true
console.log(canFinish(2, [[1, 0], [0, 1]]));  // false
console.log(canFinish(4, [[1, 0], [2, 1], [3, 2]])); // true
¦¦¦
**Complexity:** time O(V + E), space O(V + E). Record the queue order to return the actual course order.
--- starter ---
¦¦¦js
function canFinish(n, prerequisites) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('single prerequisite', () => { eq(canFinish(2, [[1, 0]]), true); });
test('two courses need each other', () => { eq(canFinish(2, [[1, 0], [0, 1]]), false); });
test('a chain of four courses', () => { eq(canFinish(4, [[1, 0], [2, 1], [3, 2]]), true); });
test('no prerequisites', () => { eq(canFinish(3, []), true); });
test('three-course cycle', () => { eq(canFinish(3, [[0, 1], [1, 2], [2, 0]]), false); });
test('a course that requires itself', () => { eq(canFinish(1, [[0, 0]]), false); });
test('diamond-shaped dependencies are fine', () => { eq(canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]), true); });
test('a cycle hidden in a disconnected part', () => { eq(canFinish(4, [[1, 0], [2, 3], [3, 2]]), false); });
test('long chain (20,000 courses)', () => {
  const pre = [];
  for (let i = 1; i < 20000; i++) pre.push([i, i - 1]);
  eq(canFinish(20000, pre), true);
});
¦¦¦


### [intermediate] Climbing stairs and coin change (1D DP)
(a) You can climb 1 or 2 steps. In how many distinct ways can you reach step ¦n¦? (b) Given coin denominations and an amount, return the fewest coins needed (or -1).
¦¦¦js
climbStairs(5)             // 8
coinChange([1, 2, 5], 11)  // 3 (5 + 5 + 1)
coinChange([2], 3)         // -1
¦¦¦
> Hint: Define dp[i] clearly. Stairs: dp[i] = dp[i-1] + dp[i-2]. Coins: dp[a] = min(dp[a - coin] + 1).
--- solution ---
¦¦¦js
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;                 // ways to reach step 1
  let b = 2;                 // ways to reach step 2
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);  // dp[a] = fewest coins for amount a
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(climbStairs(5));              // 8
console.log(coinChange([1, 2, 5], 11));   // 3
console.log(coinChange([2], 3));          // -1
console.log(coinChange([1], 0));          // 0
¦¦¦
**Complexity:** climbStairs O(n) time, O(1) space. coinChange O(amount · coins) time, O(amount) space. A greedy "largest coin first" approach fails for coins like ¦[1, 3, 4]¦ and amount 6 (greedy gives 4+1+1, optimal is 3+3).
--- starter ---
¦¦¦js
function climbStairs(n) {
  // your code here
}

function coinChange(coins, amount) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('climbStairs: small values', () => {
  eq(climbStairs(1), 1);
  eq(climbStairs(2), 2);
  eq(climbStairs(3), 3);
});
test('climbStairs(5) = 8 and climbStairs(10) = 89', () => {
  eq(climbStairs(5), 8);
  eq(climbStairs(10), 89);
});
test('climbStairs(45) = 1836311903 (needs an O(n) solution)', () => { eq(climbStairs(45), 1836311903); });
test('coinChange: 5 + 5 + 1', () => { eq(coinChange([1, 2, 5], 11), 3); });
test('coinChange: impossible amount', () => { eq(coinChange([2], 3), -1); });
test('coinChange: amount zero needs zero coins', () => { eq(coinChange([1], 0), 0); });
test('coinChange: greedy fails here (3 + 3)', () => { eq(coinChange([1, 3, 4], 6), 2); });
test('coinChange: harder case', () => { eq(coinChange([186, 419, 83, 408], 6249), 20); });
test('coinChange: large amount', () => { eq(coinChange([1, 5, 10, 25, 50], 10000), 200); });
¦¦¦


### [advanced] Longest common subsequence (2D DP)
Return the length of the longest common subsequence of two strings (characters in order, not necessarily contiguous).
¦¦¦js
longestCommonSubsequence('abcde', 'ace') // 3 ('ace')
longestCommonSubsequence('abc', 'def')   // 0
¦¦¦
> Hint: dp[i][j] is the LCS of the first i chars of a and the first j chars of b. Match: diagonal + 1; else max of up and left.
--- solution ---
¦¦¦js
function longestCommonSubsequence(a, b) {
  const m = a.length;
  const n = b.length;
  // dp[i][j] = LCS length of a[0..i) and b[0..j)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;   // characters match
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);          // skip one character
    }
  }
  return dp[m][n];
}

console.log(longestCommonSubsequence('abcde', 'ace')); // 3
console.log(longestCommonSubsequence('abc', 'def'));   // 0
console.log(longestCommonSubsequence('abc', 'abc'));   // 3
¦¦¦
**Complexity:** time O(m · n), space O(m · n), reducible to O(min(m, n)) by keeping only two rows. Edit distance uses the same table with three transitions (insert, delete, replace).
--- starter ---
¦¦¦js
function longestCommonSubsequence(a, b) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
test('abcde / ace -> 3', () => { eq(longestCommonSubsequence('abcde', 'ace'), 3); });
test('no letters in common', () => { eq(longestCommonSubsequence('abc', 'def'), 0); });
test('identical strings', () => { eq(longestCommonSubsequence('abc', 'abc'), 3); });
test('one empty string', () => {
  eq(longestCommonSubsequence('', 'abc'), 0);
  eq(longestCommonSubsequence('abc', ''), 0);
});
test('classic AGGTAB / GXTXAYB -> 4', () => { eq(longestCommonSubsequence('AGGTAB', 'GXTXAYB'), 4); });
test('repeated letters', () => { eq(longestCommonSubsequence('aaaa', 'aa'), 2); });
test('large strings (1,000 x 1,000)', () => {
  eq(longestCommonSubsequence('ab'.repeat(500), 'ba'.repeat(500)), 999);
});
¦¦¦


### [intermediate] Subsets and permutations (backtracking)
(a) Return all subsets of an array of distinct numbers. (b) Return all permutations.
¦¦¦js
subsets([1, 2, 3])     // [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
permutations([1, 2, 3]) // 6 arrays: [1,2,3], [1,3,2], [2,1,3], ...
¦¦¦
> Hint: Choose an element, recurse, then remove it (un-choose). For subsets, record the path at every step.
--- solution ---
¦¦¦js
function subsets(nums) {
  const res = [];
  const path = [];
  function dfs(start) {
    res.push([...path]);                    // every path is a valid subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);                   // choose
      dfs(i + 1);                           // explore
      path.pop();                           // un-choose
    }
  }
  dfs(0);
  return res;
}

function permutations(nums) {
  const res = [];
  const path = [];
  const used = new Array(nums.length).fill(false);
  function dfs() {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);   // choose
      dfs();                                // explore
      path.pop(); used[i] = false;          // un-choose
    }
  }
  dfs();
  return res;
}

console.log(subsets([1, 2, 3]));
// [ [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3] ]
console.log(permutations([1, 2, 3]).length); // 6
¦¦¦
**Complexity:** subsets O(n · 2ⁿ) time; permutations O(n · n!) time; both O(n) recursion space plus output.
--- starter ---
¦¦¦js
function subsets(nums) {
  // your code here
}

function permutations(nums) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const sortInner = r => r.map(x => [...x].sort((a, b) => a - b));
test('subsets of [1, 2, 3]', () => {
  sameItems(sortInner(subsets([1, 2, 3])), [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]);
});
test('subsets of an empty array', () => { eq(subsets([]), [[]]); });
test('subsets of one element', () => { sameItems(subsets([5]), [[], [5]]); });
test('subsets of 15 elements -> 32,768', () => {
  const r = subsets(Array.from({ length: 15 }, (_, i) => i));
  eq(r.length, 32768);
});
test('permutations of [1, 2, 3]', () => {
  sameItems(permutations([1, 2, 3]), [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]);
});
test('permutations of one element', () => { eq(permutations([1]), [[1]]); });
test('permutations of an empty array', () => { eq(permutations([]), [[]]); });
test('permutations of 7 elements -> 5,040 distinct arrays', () => {
  const r = permutations([1, 2, 3, 4, 5, 6, 7]);
  eq(r.length, 5040);
  eq(new Set(r.map(x => x.join(','))).size, 5040);
});
¦¦¦


### [advanced] LRU cache
Design a cache with a fixed capacity. ¦get(key)¦ returns the value or -1; ¦put(key, value)¦ inserts or updates. When capacity is exceeded, evict the least recently used key. Both must be O(1).
¦¦¦js
const cache = new LRUCache(2);
cache.put(1, 1); cache.put(2, 2);
cache.get(1);    // 1
cache.put(3, 3); // evicts key 2
cache.get(2);    // -1
¦¦¦
> Hint: A JavaScript Map remembers insertion order. Delete and re-insert a key to mark it recently used.
--- solution ---
¦¦¦js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();            // insertion order = recency order (oldest first)
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);            // refresh: remove ...
    this.map.set(key, value);        // ... and re-insert as most recent
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      this.map.delete(this.map.keys().next().value);   // evict the oldest key
    }
    this.map.set(key, value);
  }
}

const cache = new LRUCache(2);
cache.put(1, 1); cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3);           // evicts key 2
console.log(cache.get(2)); // -1
cache.put(4, 4);           // evicts key 1
console.log(cache.get(1)); // -1
console.log(cache.get(3)); // 3
console.log(cache.get(4)); // 4
¦¦¦
**Complexity:** O(1) per operation, space O(capacity). In an interview, also explain the classic version: a hash map from key to node plus a doubly linked list, so you can move nodes and evict the tail in O(1).
--- starter ---
¦¦¦js
class LRUCache {
  constructor(capacity) {
    // your code here
  }
  get(key) {}
  put(key, value) {}
}
¦¦¦
--- tests ---
¦¦¦js
test('example: evicts the least recently used key', () => {
  const c = new LRUCache(2);
  c.put(1, 1); c.put(2, 2);
  eq(c.get(1), 1);
  c.put(3, 3);
  eq(c.get(2), -1);
  c.put(4, 4);
  eq(c.get(1), -1);
  eq(c.get(3), 3);
  eq(c.get(4), 4);
});
test('missing key returns -1', () => {
  const c = new LRUCache(2);
  eq(c.get(99), -1);
});
test('updating a key refreshes it and replaces the value', () => {
  const c = new LRUCache(2);
  c.put(1, 1); c.put(2, 2);
  c.put(1, 10);
  c.put(3, 3);
  eq(c.get(2), -1);
  eq(c.get(1), 10);
});
test('capacity of one', () => {
  const c = new LRUCache(1);
  c.put(1, 1);
  c.put(2, 2);
  eq(c.get(1), -1);
  eq(c.get(2), 2);
});
test('get() counts as a use', () => {
  const c = new LRUCache(2);
  c.put(1, 1); c.put(2, 2);
  c.get(1);
  c.put(3, 3);
  eq(c.get(2), -1);
  eq(c.get(1), 1);
});
test('stored value 0 is not mistaken for missing', () => {
  const c = new LRUCache(1);
  c.put(1, 0);
  eq(c.get(1), 0);
});
test('large workload (100,000 puts, capacity 1,000)', () => {
  const c = new LRUCache(1000);
  for (let i = 0; i < 100000; i++) c.put(i, i);
  eq(c.get(99999), 99999);
  eq(c.get(99000), 99000);
  eq(c.get(98999), -1);
});
¦¦¦


### [advanced] Implement a Trie (prefix tree)
Implement ¦insert(word)¦, ¦search(word)¦ and ¦startsWith(prefix)¦.
¦¦¦js
const t = new Trie();
t.insert('apple');
t.search('apple');    // true
t.search('app');      // false
t.startsWith('app');  // true
t.insert('app');
t.search('app');      // true
¦¦¦
> Hint: Each node holds a Map of child characters and a flag marking the end of a word.
--- solution ---
¦¦¦js
class TrieNode {
  constructor() {
    this.children = new Map();   // char -> TrieNode
    this.isEnd = false;          // true if a word ends here
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  _find(prefix) {                // walk the prefix; return the last node or null
    let node = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  search(word) { const n = this._find(word); return !!n && n.isEnd; }
  startsWith(prefix) { return this._find(prefix) !== null; }
}

const t = new Trie();
t.insert('apple');
console.log(t.search('apple'));   // true
console.log(t.search('app'));     // false
console.log(t.startsWith('app')); // true
t.insert('app');
console.log(t.search('app'));     // true
¦¦¦
**Complexity:** insert, search and startsWith are O(L) for word length L; space O(total characters). Use it for autocomplete (collect words under a prefix node).
--- starter ---
¦¦¦js
class Trie {
  constructor() {
    // your code here
  }
  insert(word) {}
  search(word) {}
  startsWith(prefix) {}
}
¦¦¦
--- tests ---
¦¦¦js
test('example from the problem', () => {
  const t = new Trie();
  t.insert('apple');
  eq(t.search('apple'), true);
  eq(t.search('app'), false);
  eq(t.startsWith('app'), true);
  t.insert('app');
  eq(t.search('app'), true);
});
test('prefix that does not exist', () => {
  const t = new Trie();
  t.insert('apple');
  eq(t.startsWith('apx'), false);
  eq(t.search('apples'), false);
});
test('words that share a prefix', () => {
  const t = new Trie();
  ['car', 'card', 'care', 'cat'].forEach(w => t.insert(w));
  eq(t.search('car'), true);
  eq(t.search('card'), true);
  eq(t.search('ca'), false);
  eq(t.startsWith('ca'), true);
  eq(t.startsWith('cab'), false);
});
test('empty trie finds nothing', () => {
  const t = new Trie();
  eq(t.search('a'), false);
  eq(t.startsWith('a'), false);
});
test('inserting the same word twice is harmless', () => {
  const t = new Trie();
  t.insert('hi'); t.insert('hi');
  eq(t.search('hi'), true);
  eq(t.search('h'), false);
});
test('large trie (20,000 words)', () => {
  const t = new Trie();
  const word = i => 'w' + i.toString(26);
  for (let i = 0; i < 20000; i++) t.insert(word(i));
  eq(t.search(word(12345)), true);
  eq(t.search(word(20000)), false);
  eq(t.startsWith('w1'), true);
});
¦¦¦


### [intermediate] Flatten, debounce and throttle (JavaScript utilities)
(a) Flatten a nested array to any depth without ¦flat(Infinity)¦. (b) Write ¦debounce(fn, wait)¦: run ¦fn¦ only after calls have stopped for ¦wait¦ ms. (c) Write ¦throttle(fn, wait)¦: run ¦fn¦ at most once per ¦wait¦ ms.
¦¦¦js
flatten([1, [2, [3, [4]], 5]]) // [1, 2, 3, 4, 5]
¦¦¦
> Hint: Flatten: recurse on arrays. Debounce: clear and reset one timer. Throttle: remember the last run time.
--- solution ---
¦¦¦js
function flatten(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flatten(item));   // go deeper
    else out.push(item);
  }
  return out;
}

function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);                                   // restart the countdown
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {                              // enough time has passed
      last = now;
      fn.apply(this, args);
    }
  };
}

console.log(flatten([1, [2, [3, [4]], 5]]));   // [ 1, 2, 3, 4, 5 ]

const log = debounce(v => console.log('debounced:', v), 100);
log('a'); log('b'); log('c');                  // prints only "debounced: c" after 100 ms

const hit = throttle(() => console.log('throttled run'), 1000);
hit(); hit(); hit();                           // prints "throttled run" once
¦¦¦
Use cases: debounce for search-as-you-type and window resize end; throttle for scroll handlers and button spam. **Complexity:** flatten O(n) over all elements, O(depth) stack.
--- starter ---
¦¦¦js
function flatten(arr) {
  // your code here
}

function debounce(fn, wait) {
  // your code here
}

function throttle(fn, wait) {
  // your code here
}
¦¦¦
--- tests ---
¦¦¦js
const waitThen = (ms, fn) => new Promise((res, rej) => setTimeout(() => { try { fn(); res(); } catch (e) { rej(e); } }, ms));
test('flatten: nested example', () => { eq(flatten([1, [2, [3, [4]], 5]]), [1, 2, 3, 4, 5]); });
test('flatten: empty and empty nested arrays', () => {
  eq(flatten([]), []);
  eq(flatten([[], [[]]]), []);
});
test('flatten: already flat array and strings', () => {
  eq(flatten([1, 2, 3]), [1, 2, 3]);
  eq(flatten(['a', ['b', ['c']]]), ['a', 'b', 'c']);
});
test('flatten: does not change the input', () => {
  const input = [1, [2, [3]]];
  flatten(input);
  eq(input, [1, [2, [3]]]);
});
test('flatten: 500 levels deep', () => {
  let nested = [1];
  for (let i = 0; i < 500; i++) nested = [nested];
  eq(flatten(nested), [1]);
});
test('debounce: only the last call of a burst runs', () => {
  const calls = [];
  const d = debounce(v => calls.push(v), 40);
  d('a'); d('b'); d('c');
  return waitThen(150, () => eq(calls, ['c']));
});
test('debounce: nothing runs before the wait has passed', () => {
  const calls = [];
  const d = debounce(() => calls.push(1), 100);
  d();
  return waitThen(20, () => eq(calls, []));
});
test('debounce: keeps this and arguments', () => {
  const out = [];
  const obj = { n: 5, run: debounce(function (x) { out.push(this.n + x); }, 20) };
  obj.run(1);
  return waitThen(100, () => eq(out, [6]));
});
test('debounce: runs again after a quiet period', () => {
  const calls = [];
  const d = debounce(v => calls.push(v), 30);
  d('a');
  return waitThen(100, () => { eq(calls, ['a']); d('b'); })
    .then(() => waitThen(100, () => eq(calls, ['a', 'b'])));
});
test('throttle: first call runs at once, extra calls in the window are ignored', () => {
  let count = 0;
  const t = throttle(() => { count++; }, 200);
  t(); t(); t();
  eq(count, 1);
});
test('throttle: runs again after the wait and keeps arguments', () => {
  const calls = [];
  const t = throttle(v => calls.push(v), 50);
  t('a'); t('b');
  return waitThen(120, () => { t('c'); eq(calls, ['a', 'c']); });
});
¦¦¦


## SCENARIOS

### Search-as-you-type for a course catalogue of 100,000 titles. Which data structures and optimisations would you use?
Start with the requirements: results must appear in under about 100 ms and handle typos or only prefixes. For prefix search, a trie (or a sorted array with binary search for the first match) gives O(L) or O(log n) per keystroke instead of scanning 100,000 titles. Debounce input by about 150 ms, cancel stale requests, cap results (top 10) and cache recent queries in a Map or LRU. For production scale, push search to the database or a search engine (full-text index) and use the in-memory structure for hot suggestions. Mention measuring latency before and after.

### Your API endpoint is slow because it matches users to enrolments with nested loops over two large arrays. How do you fix it?
Explain the complexity (O(n · m)). Fix by building a Map keyed by user id once (O(n)), then iterating enrolments with O(1) lookups (O(n + m) total). Better still, do the join in the database with an index, avoid fetching everything, and use pagination. Show the before and after: for 10,000 × 10,000 items that is 100 million comparisons versus 20,000 operations. This is the pattern behind many "30–40% faster API" improvements.

### Design pagination for a feed with millions of rows. Compare offset and keyset approaches.
Offset pagination (¦LIMIT 20 OFFSET 100000¦) scans and discards earlier rows, so cost grows with the page number and rows can shift between requests. Keyset (cursor) pagination uses ¦WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT 20¦ with an index on the sort columns, giving O(log n) per page and stable results. Return an opaque cursor to the client. Mention trade-offs: keyset cannot jump to arbitrary page numbers, so use offset for small admin tables.

### How would you implement an in-memory cache with expiry and a size limit for a Node API?
Use a Map for O(1) lookup and an LRU policy for eviction (delete and re-insert on access, evict the first key). Store ¦{ value, expiresAt }¦ and check expiry on read; clean expired keys lazily or with a periodic sweep (or a min-heap ordered by expiry for efficient purging). Protect against cache stampede with in-flight promise de-duplication. Note limits: per-process memory and no sharing across instances, so use Redis when running multiple servers or when data must be shared.

### You must schedule background jobs by priority and run time (for example report generation and email sends). Which structure fits?
A priority queue (min-heap) keyed by ¦runAt¦ then priority gives O(log n) insert and O(log n) extraction of the next job. A worker loop peeks at the top; if it is due, pop and run it, otherwise sleep until ¦runAt¦. Add retries with exponential backoff by re-inserting with a later ¦runAt¦. For multiple servers use a durable queue (Redis, SQS, BullMQ) and keep the heap only for local timers. Mention idempotency and dead-letter handling for failures.
`;

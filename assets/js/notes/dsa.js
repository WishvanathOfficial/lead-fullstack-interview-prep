window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.dsa = String.raw`
## Phase 1 · Foundations and core patterns (Basic)
### Big-O notation: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
#### In one line
Big-O tells you how the work grows when the input grows, ignoring constants, so you can compare solutions before running them.

#### Real-life analogy
Finding a name in a phone book: opening to a known page is O(1), flipping page by page is O(n), halving the book each time is O(log n), and comparing every person with every other person at a party is O(n²).

#### How it works
- Count the **steps as a function of n** and keep the biggest term: 3n² + 5n + 2 becomes O(n²).
- A single loop over n items is O(n). Two nested loops over n are O(n²). Halving the range each step is O(log n). Sorting is O(n log n).
- Branching recursion that calls itself twice per level is O(2ⁿ).
- Hidden costs: ¦includes¦, ¦indexOf¦, ¦slice¦, ¦shift¦, ¦splice¦ and spread ¦[...a]¦ are all O(n). Map and Set lookups are O(1) on average.
- Always state **time and space** separately.

#### Example
¦¦¦js
function hasDuplicateSlow(a) {      // O(n^2) time, O(1) space
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++)
      if (a[i] === a[j]) return true;
  return false;
}
function hasDuplicateFast(a) {      // O(n) time, O(n) space
  const seen = new Set();
  for (const x of a) { if (seen.has(x)) return true; seen.add(x); }
  return false;
}
console.log(hasDuplicateSlow([1, 2, 3, 2]), hasDuplicateFast([1, 2, 3, 4])); // true false
¦¦¦
Trade-off: the fast version spends memory to save time.

#### Remember it
| Class | Typical example |
|---|---|
| O(1) | array index, Map get |
| O(log n) | binary search |
| O(n) | single loop |
| O(n log n) | merge sort, ¦sort()¦ |
| O(n²) | nested loops |
| O(2ⁿ) | subsets, naive Fibonacci |

Cue: "Can I drop a loop with a Map or sorting?"

#### Common mistakes
- Forgetting that ¦arr.includes¦ inside a loop makes it O(n²).
- Quoting only time and ignoring space.
- Treating O(n) with a huge constant as always better than O(n log n).

#### Interview angle
Say: "My brute force is O(n²) time and O(1) space; with a hash set it becomes O(n) time and O(n) space." Follow-up: "What is the complexity of ¦[...a].sort()¦?" Answer: O(n log n) time and O(n) extra space.

### Time vs space trade-offs and amortised analysis
#### In one line
You can often buy speed with memory (caches, maps), and **amortised** cost averages a rare expensive step over many cheap ones.

#### Real-life analogy
A kitchen with a prep table: spending table space on pre-chopped vegetables (memory) makes each order (time) faster. A bus that occasionally takes 10 minutes to refuel but runs all day still averages a fast trip.

#### How it works
- Memoisation, lookup tables, indexes and prefix sums use extra space to cut time.
- In-place algorithms (two pointers, swapping) cut space but may be harder to read.
- **Dynamic array push**: when the array is full it copies to a bigger one (O(n)), but doubling means the copy happens rarely, so the average push is O(1) amortised.
- Total cost of n pushes ≈ n + (1 + 2 + 4 + ... + n) ≈ 3n, so about 3 per push.

#### Example
¦¦¦js
let copies = 0;
class Vec {
  constructor() { this.cap = 1; this.len = 0; this.data = new Array(1); }
  push(x) {
    if (this.len === this.cap) {
      this.cap *= 2; const nd = new Array(this.cap);
      for (let i = 0; i < this.len; i++) { nd[i] = this.data[i]; copies++; }
      this.data = nd;
    }
    this.data[this.len++] = x;
  }
}
const v = new Vec(); for (let i = 0; i < 1000; i++) v.push(i);
console.log(v.len, copies); // 1000 1023  (about 1 copy per push on average)
¦¦¦
Time per push: O(1) amortised. Space: O(n).

#### Remember it
- More memory, less time: Map, Set, cache, prefix array.
- Less memory, more time: recompute, in-place, streaming.
- Amortised = average over a sequence, not the average over random inputs.

#### Common mistakes
- Calling amortised O(1) the same as worst-case O(1).
- Caching without an eviction limit (memory leak).
- Over-optimising time when n is small.

#### Interview angle
"Array push is amortised O(1) because capacity doubles." Follow-up: "What if it grew by a fixed 10 slots?" Answer: then each push is O(n) amortised.

### Arrays and strings: indexing, slicing, in-place edits, immutability
#### In one line
Arrays and strings are contiguous sequences; knowing which methods copy and which mutate prevents bugs and hidden O(n) costs.

#### Real-life analogy
A row of numbered lockers: opening locker 5 is instant, but inserting a new locker in the middle means moving everyone after it.

#### How it works
- Index access ¦a[i]¦ is O(1). ¦push/pop¦ at the end are O(1) amortised. ¦shift/unshift/splice/insert¦ are O(n).
- **Mutating**: ¦push, pop, shift, unshift, splice, sort, reverse, fill¦. **Copying**: ¦slice, map, filter, concat, toSorted, toReversed, with¦.
- Strings are immutable: ¦s[0] = 'x'¦ does nothing. Build with an array and ¦join¦ instead of ¦+=¦ in huge loops.
- Use in-place swaps ¦[a[i], a[j]] = [a[j], a[i]]¦ to reach O(1) space.

#### Example
¦¦¦js
function reverseInPlace(a) {
  for (let l = 0, r = a.length - 1; l < r; l++, r--) [a[l], a[r]] = [a[r], a[l]];
  return a;
}
console.log(reverseInPlace([1, 2, 3, 4, 5])); // [ 5, 4, 3, 2, 1 ]
const s = 'hello';
console.log(s.split('').reverse().join('')); // olleh  (O(n) extra space)
const a = [3, 1, 2];
console.log(a.toSorted(), a); // [1,2,3] [3,1,2]  (original untouched)
¦¦¦
In place: O(n) time, O(1) space.

#### Remember it
Mutate = ¦push pop shift unshift splice sort reverse fill¦. Everything else copies. Cue: "modify without extra space" means swap in place.

#### Common mistakes
- ¦arr.sort()¦ on numbers without a comparator.
- Assuming ¦slice¦ deep copies objects (it is shallow).
- ¦shift¦ in a loop for a queue (O(n²) total).

#### Interview angle
"Which array methods mutate?" Give the list. Follow-up: "How do you reverse a string in O(1) extra space?" Strings are immutable in JS, so you need an array; in languages with mutable strings you swap in place.

### Hash maps and sets: frequency counting, dedupe, lookup tables
#### In one line
A hash map stores key-value pairs with average O(1) lookup, turning many O(n²) searches into O(n).

#### Real-life analogy
A cloakroom with numbered tickets: handing over the ticket gets your coat instantly, instead of searching every hook.

#### How it works
- Keys are hashed to a bucket index; collisions are handled inside the engine. Average O(1) get/set/has, worst case O(n).
- **Frequency map**: count occurrences. **Seen set**: detect duplicates. **Complement lookup**: store what you have seen and ask "have I seen the partner?".
- Use ¦Map¦ for any key type and insertion order; use ¦Set¦ for membership.

#### Example
¦¦¦js
function twoSum(nums, target) {
  const seen = new Map();                       // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9)); // [ 0, 1 ]
// trace: i=0 need 7 no, store 2; i=1 need 2 found at 0 -> [0,1]
¦¦¦
Time O(n), space O(n).

#### Remember it
Cue: "find a pair", "count", "duplicate", "group". Template: ¦const m = new Map(); for (x of a) { check m; update m }¦.

#### Common mistakes
- Using an Object with keys like ¦__proto__¦ or ¦constructor¦.
- Storing the item before checking, so an element matches itself.
- Forgetting that ¦Map¦ keys compare objects by reference.

#### Interview angle
"How would you speed up a nested loop search?" Use a Map or Set. Follow-up: "What is the worst case of a hash lookup?" O(n) with many collisions, but average is O(1).

### Map vs Object vs Set vs WeakMap in JavaScript
#### In one line
Pick the structure by key type, ordering, size access and cleanup needs: Map for dictionaries, Set for unique values, Object for fixed records, WeakMap for private data tied to object lifetime.

#### Real-life analogy
A Map is a proper register book; an Object is a form with fixed fields; a Set is a guest list with no repeats; a WeakMap is a sticky note on a guest that disappears when the guest leaves.

#### How it works
| | Object | Map | Set | WeakMap |
|---|---|---|---|---|
| Key types | string, symbol | any | any (values) | objects only |
| Order | mostly insertion | insertion | insertion | none |
| Size | ¦Object.keys(o).length¦ | ¦m.size¦ | ¦s.size¦ | none |
| Iterable | indirect | yes | yes | no |
| GC of keys | no | no | no | yes |
- Objects inherit from ¦Object.prototype¦, so ¦'toString' in obj¦ is true; use ¦Object.create(null)¦ or a Map.
- Frequent add/delete is faster and safer with Map.

#### Example
¦¦¦js
const m = new Map([[1, 'a']]);
m.set('1', 'b');                 // number 1 and string '1' are different keys
console.log(m.size, m.get(1));   // 2 a
const o = {}; o[1] = 'a'; o['1'] = 'b';
console.log(Object.keys(o).length, o[1]); // 1 b
const uniq = [...new Set([3, 1, 3, 2, 1])];
console.log(uniq);               // [ 3, 1, 2 ]
¦¦¦

#### Remember it
Dictionary or counter → Map. Unique/visited → Set. JSON record → Object. Metadata that must not leak memory → WeakMap.

#### Common mistakes
- Using an Object as a counter with user-provided keys.
- Expecting ¦JSON.stringify(map)¦ to work (it gives ¦{}¦).
- Trying to iterate a WeakMap.

#### Interview angle
"Why Map over Object?" Any key type, guaranteed order, ¦size¦, no prototype keys, better for frequent updates. Follow-up: "When use WeakMap?" Caching or private data keyed by objects so they can be garbage collected.

### Two pointers (opposite ends and same direction)
#### In one line
Use two indexes that move through the data to avoid a nested loop, usually turning O(n²) into O(n).

#### Real-life analogy
Two people searching a corridor from opposite ends and meeting in the middle, or one slow and one fast person walking the same path.

#### How it works
- **Opposite ends**: sorted array; compare the sum at ¦l¦ and ¦r¦. Too small, move ¦l¦ right; too big, move ¦r¦ left.
- **Same direction**: ¦write¦ pointer tracks the output position, ¦read¦ scans (remove duplicates, move zeroes).
- It works because sortedness or a rule lets you discard a whole row of candidates each move.

#### Example
¦¦¦js
function pairSumSorted(a, t) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === t) return [l, r];
    if (s < t) l++; else r--;
  }
  return null;
}
console.log(pairSumSorted([1, 2, 4, 7, 11], 15)); // [ 2, 4 ]
function removeDuplicates(a) {            // sorted, in place
  let w = 0;
  for (let r = 0; r < a.length; r++) if (r === 0 || a[r] !== a[r - 1]) a[w++] = a[r];
  return w;
}
const b = [1, 1, 2, 2, 3];
console.log(removeDuplicates(b), b.slice(0, 3)); // 3 [ 1, 2, 3 ]
¦¦¦
Time O(n), space O(1).

#### Remember it
Cue: sorted array, palindrome, pair/triplet sum, in-place filter. Skeleton: ¦let l=0, r=n-1; while(l<r){ ... l++ or r-- }¦.

#### Common mistakes
- Using it on unsorted data without sorting first.
- Off-by-one: ¦l <= r¦ vs ¦l < r¦.
- Skipping duplicate handling in 3Sum.

#### Interview angle
"Two sum on a sorted array in O(1) space?" Two pointers. Follow-up: "Unsorted?" Use a Map, or sort first (O(n log n)).

### Sliding window (fixed and variable size)
#### In one line
Keep a window over a contiguous range and update it as you slide, instead of recomputing every range from scratch.

#### Real-life analogy
A camera frame moving along a film strip: you add the new frame at the right and drop the old one at the left.

#### How it works
- **Fixed size k**: add the entering element, subtract the leaving one.
- **Variable size**: expand ¦right¦ always; while the window breaks a rule, shrink ¦left¦. Record the best at each step.
- Track window state with a Map (counts) or a running sum.

#### Example
¦¦¦js
function longestUniqueSubstring(s) {
  const last = new Map(); let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    if (last.has(s[right]) && last.get(s[right]) >= left) left = last.get(s[right]) + 1;
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
console.log(longestUniqueSubstring('abcabcbb')); // 3 ("abc")
function maxSumK(a, k) {
  let sum = a.slice(0, k).reduce((x, y) => x + y, 0), best = sum;
  for (let i = k; i < a.length; i++) { sum += a[i] - a[i - k]; best = Math.max(best, sum); }
  return best;
}
console.log(maxSumK([2, 1, 5, 1, 3, 2], 3)); // 9
¦¦¦
Time O(n), space O(min(n, alphabet)).

#### Remember it
Cue: "longest/shortest/maximum **contiguous** subarray or substring". Skeleton: ¦for(right){ add; while(bad){ remove left; left++ } update best }¦.

#### Common mistakes
- Moving ¦left¦ backwards when a repeated character is older than the window.
- Recomputing the window sum each time (O(nk)).
- Using it for non-contiguous subsets.

#### Interview angle
"Longest substring without repeating characters." Explain the window and the last-seen map. Follow-up: "Minimum window substring?" Same pattern with a need-count map.

### Prefix sums and difference arrays
#### In one line
Precompute running totals so any range sum becomes one subtraction.

#### Real-life analogy
A bank statement with a running balance: spending between two dates is just balance at the end minus balance at the start.

#### How it works
- ¦prefix[i+1] = prefix[i] + a[i]¦. Sum of range [l, r] = ¦prefix[r+1] - prefix[l]¦.
- Combine with a Map of prefix counts to count subarrays summing to k.
- A **difference array** does the reverse: add ¦v¦ to a range in O(1) by ¦d[l]+=v; d[r+1]-=v¦, then prefix-sum once.

#### Example
¦¦¦js
function buildPrefix(a) { const p = [0]; for (const x of a) p.push(p[p.length - 1] + x); return p; }
const p = buildPrefix([2, 4, 6, 8]);
console.log(p[3] - p[1]);   // 10  (4 + 6)
function subarraySumK(a, k) {
  const cnt = new Map([[0, 1]]); let sum = 0, res = 0;
  for (const x of a) { sum += x; res += cnt.get(sum - k) || 0; cnt.set(sum, (cnt.get(sum) || 0) + 1); }
  return res;
}
console.log(subarraySumK([1, 1, 1], 2)); // 2
¦¦¦
Build O(n), query O(1).

#### Remember it
Cue: many range-sum queries, or "subarray sum equals k". Formula: ¦sum(l..r) = P[r+1] - P[l]¦.

#### Common mistakes
- Off-by-one with the leading 0.
- Forgetting to seed the Map with ¦{0:1}¦.
- Using sliding window when negatives exist.

#### Interview angle
"Handle 100k range-sum queries." Prefix sums. Follow-up: "Updates between queries?" Use a Fenwick tree or segment tree.

### Sorting basics and JavaScript sort pitfalls
#### In one line
Sorting orders data to unlock binary search and two pointers; in JavaScript the default sort compares as strings, so numbers need a comparator.

#### Real-life analogy
Alphabetising files before searching them: sorting costs effort once, then every lookup is fast.

#### How it works
- ¦sort()¦ is stable in modern engines, in place and O(n log n).
- Default order is **lexicographic**: ¦[10, 9, 1].sort()¦ gives ¦[1, 10, 9]¦.
- Comparator returns negative (a first), zero, or positive (b first). Use ¦(a, b) => a - b¦ for numbers; for strings use ¦localeCompare¦.
- Sort by several keys by chaining ¦||¦. ¦toSorted¦ returns a copy.

#### Example
¦¦¦js
console.log([10, 9, 1].sort());                 // [ 1, 10, 9 ]
console.log([10, 9, 1].sort((a, b) => a - b));  // [ 1, 9, 10 ]
const learners = [{ n: 'Ravi', s: 90 }, { n: 'Asha', s: 90 }, { n: 'Meera', s: 95 }];
learners.sort((a, b) => b.s - a.s || a.n.localeCompare(b.n));
console.log(learners.map(x => x.n).join()); // Meera,Asha,Ravi
¦¦¦
Time O(n log n), space O(log n) to O(n) depending on engine.

#### Remember it
"Numbers need ¦(a,b)=>a-b¦." Sorting is the first idea when order, duplicates or pairs matter.

#### Common mistakes
- Comparator returning a boolean (¦a > b¦).
- Mutating the original array unexpectedly.
- Subtracting huge numbers that overflow or NaN values.

#### Interview angle
"Why does ¦[10,9,1].sort()¦ give ¦[1,10,9]¦?" Values are converted to strings. Follow-up: "Is JS sort stable?" Yes since ES2019.

### Binary search: classic template and boundaries
#### In one line
Binary search finds a target in a sorted range by halving the search space each step, in O(log n).

#### Real-life analogy
Guessing a number from 1 to 100: ask "higher or lower" and always pick the middle.

#### How it works
- Keep ¦lo¦ and ¦hi¦ so the answer is always inside [lo, hi].
- ¦mid = lo + ((hi - lo) >> 1)¦ avoids overflow in other languages and floors in JS.
- If ¦a[mid] < target¦ move ¦lo = mid + 1¦, otherwise ¦hi = mid - 1¦. Stop when ¦lo > hi¦.
- For first/last occurrence or insertion point, keep searching after a match (lower bound).

#### Example
¦¦¦js
function binarySearch(a, t) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] === t) return mid;
    if (a[mid] < t) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}
function lowerBound(a, t) {             // first index with a[i] >= t
  let lo = 0, hi = a.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (a[mid] < t) lo = mid + 1; else hi = mid; }
  return lo;
}
const a = [1, 3, 3, 3, 7, 9];
console.log(binarySearch(a, 7), lowerBound(a, 3), lowerBound(a, 8)); // 4 1 5
¦¦¦
Time O(log n), space O(1).

#### Remember it
Cue: sorted data or a yes/no condition that flips once. Pick ONE template and use it every time.

#### Common mistakes
- Infinite loop from ¦lo = mid¦ with ¦lo <= hi¦.
- Mixing ¦hi = n¦ and ¦hi = n - 1¦ conventions.
- Running on unsorted input.

#### Interview angle
"Write binary search." Narrate invariants. Follow-up: "Find the first position of a duplicate." Use lower bound.

### Stacks and queues: LIFO and FIFO, array-based implementations
#### In one line
A stack gives last-in first-out access and a queue gives first-in first-out, each with O(1) operations when implemented well.

#### Real-life analogy
A stack of plates (take the top) versus a queue at a ticket counter (first person served first).

#### How it works
- Stack with an array: ¦push¦ and ¦pop¦ are O(1).
- Queue with an array: ¦shift()¦ is O(n) because every element moves. Use a head index, a linked list, or a two-stack queue.
- Typical uses: stack for undo, parentheses and DFS; queue for BFS, task scheduling and buffers.

#### Example
¦¦¦js
class Queue {
  constructor() { this.items = []; this.head = 0; }
  enqueue(x) { this.items.push(x); }
  dequeue() {
    if (this.head >= this.items.length) return undefined;
    const x = this.items[this.head++];
    if (this.head > 50 && this.head * 2 > this.items.length) { this.items = this.items.slice(this.head); this.head = 0; }
    return x;
  }
  get size() { return this.items.length - this.head; }
}
const q = new Queue(); q.enqueue('a'); q.enqueue('b');
console.log(q.dequeue(), q.size); // a 1
function isValid(s) {
  const st = [], pair = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if ('([{'.includes(c)) st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}
console.log(isValid('{[()]}'), isValid('(]')); // true false
¦¦¦

#### Remember it
Nested or reversed order → stack. Level by level or arrival order → queue.

#### Common mistakes
- ¦shift¦ in a hot loop.
- Popping from an empty stack without a check.
- Using a queue where DFS needs a stack.

#### Interview angle
"Why is ¦shift¦ slow?" It re-indexes the whole array. Follow-up: "Build a queue from two stacks." Push to input, pop from output, refill when empty (amortised O(1)).

### Linked lists: nodes, traversal, dummy head
#### In one line
A linked list stores items as nodes that point to the next node, giving O(1) insert/delete at a known node but O(n) access.

#### Real-life analogy
A treasure hunt where each clue tells you where the next clue is: you cannot jump straight to clue 7.

#### How it works
- Node: ¦{ val, next }¦. Traverse with ¦while (cur) cur = cur.next¦.
- A **dummy head** node in front removes special cases when the real head changes (deleting the first node, merging).
- Always save ¦next¦ before you overwrite a pointer.
- Draw boxes and arrows before coding.

#### Example
¦¦¦js
class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
const fromArray = a => { const d = new ListNode(0); let c = d; for (const x of a) c = c.next = new ListNode(x); return d.next; };
const toArray = h => { const r = []; for (; h; h = h.next) r.push(h.val); return r; };
function removeValue(head, v) {
  const dummy = new ListNode(0, head); let cur = dummy;
  while (cur.next) { if (cur.next.val === v) cur.next = cur.next.next; else cur = cur.next; }
  return dummy.next;
}
console.log(toArray(removeValue(fromArray([1, 2, 6, 2, 3]), 2))); // [ 1, 6, 3 ]
¦¦¦
Time O(n), space O(1).

#### Remember it
Cue: pointers, "in place", insert/delete. Skeleton: ¦const dummy = new Node(0, head); let cur = dummy; ... return dummy.next¦.

#### Common mistakes
- Losing the rest of the list by overwriting ¦next¦ first.
- Null dereference on ¦cur.next.next¦.
- Forgetting to return ¦dummy.next¦.

#### Interview angle
"Remove all nodes with value v." Use a dummy head. Follow-up: "Why use a linked list at all?" O(1) insert/delete in the middle given the node, as in LRU caches.

### Recursion: base case, recursive case, call stack
#### In one line
Recursion solves a problem by calling itself on a smaller piece until it reaches a base case.

#### Real-life analogy
Russian nesting dolls: open each doll until you reach the smallest one, then close them back up.

#### How it works
- Every recursive function needs a **base case** (stop) and a **step** that moves toward it.
- Calls are stored on the **call stack**; each pending call keeps its variables. Too deep causes ¦RangeError: Maximum call stack size exceeded¦.
- Time grows with the number of calls; space with the maximum depth.
- Convert to iteration with an explicit stack or a loop, and add memoisation for overlapping calls.

#### Example
¦¦¦js
const sum = n => (n === 0 ? 0 : n + sum(n - 1));
console.log(sum(4)); // 10  (4 + 3 + 2 + 1 + 0)
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, v); return v;
}
console.log(fib(50)); // 12586269025
function power(x, n) {                 // fast exponentiation O(log n)
  if (n === 0) return 1;
  const h = power(x, n >> 1);
  return n % 2 ? h * h * x : h * h;
}
console.log(power(2, 10)); // 1024
¦¦¦

#### Remember it
Write: (1) base case, (2) smaller call, (3) combine. Naive Fibonacci is O(2ⁿ); with memo it is O(n).

#### Common mistakes
- Missing or unreachable base case.
- Recomputing the same subproblem.
- Recursing 100,000 deep on an array.

#### Interview angle
"What happens in memory during recursion?" Stack frames. Follow-up: "How would you avoid stack overflow?" Iteration with an explicit stack, or tail-style loops.

### Interview method: clarify, examples, brute force, optimise, test, complexity
#### In one line
A repeatable six-step routine that keeps you calm and shows the interviewer how you think.

#### Real-life analogy
A surgeon's checklist: you do the same safe steps every time, so pressure does not make you skip one.

#### How it works
1. **Clarify**: input size, duplicates, negatives, empty input, sorted or not, return format.
2. **Examples**: write one normal and one edge case.
3. **Brute force**: state it and its complexity first.
4. **Optimise**: look for the bottleneck; ask "can a Map, sorting, two pointers or a heap remove it?"
5. **Code**: clean names, small helpers, talk while coding.
6. **Test and complexity**: trace an example by hand, then state time and space.

#### Example
¦¦¦js
// Problem: first non-repeating character index.
// Clarify: lowercase letters? empty string -> -1.
// Brute force O(n^2); optimise with counts O(n).
function firstUniq(s) {
  const c = new Map();
  for (const ch of s) c.set(ch, (c.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i++) if (c.get(s[i]) === 1) return i;
  return -1;
}
console.log(firstUniq('leetcode'), firstUniq('aabb'), firstUniq('')); // 0 -1 -1
¦¦¦
Time O(n), space O(1) for a fixed alphabet.

#### Remember it
CEBO-TC: Clarify, Examples, Brute force, Optimise, Test, Complexity.

#### Common mistakes
- Coding in silence.
- Jumping to the optimal answer without stating a brute force.
- Not testing edge cases such as empty input.

#### Interview angle
Interviewers grade communication and process as much as the answer. If stuck, say what you tried and ask a targeted question.

## Phase 2 · Core data structures and algorithms (Intermediate)
### Sorting algorithms: insertion, merge, quick, counting
#### In one line
Know how the main sorts work, their complexity and when each wins, because interviewers ask you to write merge or quick sort.

#### Real-life analogy
Insertion sort is sorting a hand of cards; merge sort is two teams each sorting half a pile and then interleaving; quick sort is picking a pivot and splitting the pile into smaller and larger; counting sort is dropping cards into labelled bins.

#### How it works
| Sort | Time (avg / worst) | Space | Stable |
|---|---|---|---|
| Insertion | O(n²) / O(n²) | O(1) | yes |
| Merge | O(n log n) / O(n log n) | O(n) | yes |
| Quick | O(n log n) / O(n²) | O(log n) | no |
| Counting | O(n + k) | O(k) | yes |
- Merge sort: split, sort halves, merge two sorted arrays with two pointers.
- Quick sort: partition around a pivot, recurse on both sides; random pivots avoid the worst case.
- Counting sort works for small integer ranges.

#### Example
¦¦¦js
function mergeSort(a) {
  if (a.length < 2) return a;
  const m = a.length >> 1, L = mergeSort(a.slice(0, m)), R = mergeSort(a.slice(m));
  const out = []; let i = 0, j = 0;
  while (i < L.length && j < R.length) out.push(L[i] <= R[j] ? L[i++] : R[j++]);
  return out.concat(L.slice(i), R.slice(j));
}
console.log(mergeSort([5, 2, 9, 1, 5, 6])); // [ 1, 2, 5, 5, 6, 9 ]
function quickSort(a) {
  if (a.length < 2) return a;
  const p = a[a.length >> 1];
  return [...quickSort(a.filter(x => x < p)), ...a.filter(x => x === p), ...quickSort(a.filter(x => x > p))];
}
console.log(quickSort([3, 6, 1, 8, 2, 9, 2])); // [ 1, 2, 2, 3, 6, 8, 9 ]
¦¦¦

#### Remember it
Stable and guaranteed: merge. Fast in practice and in place: quick. Tiny range of integers: counting. Nearly sorted: insertion.

#### Common mistakes
- Using quick sort on already sorted data with a bad pivot.
- Forgetting the leftover tail in merge.
- Claiming merge sort is O(1) space.

#### Interview angle
"Why is the merge step O(n)?" Each element is placed once. Follow-up: "Which sort does ¦Array.sort¦ use?" A stable hybrid (TimSort in V8).

### Binary search on the answer and on rotated or monotonic data
#### In one line
When a yes/no check flips from false to true as the answer grows, binary search the answer itself.

#### Real-life analogy
Finding the lowest speed at which a courier delivers everything in time: try a speed, check if it works, and narrow the range.

#### How it works
- Define ¦ok(x)¦ that is monotonic: false...false true...true.
- Search ¦lo..hi¦; if ¦ok(mid)¦ then ¦hi = mid¦ else ¦lo = mid + 1¦. The answer is ¦lo¦.
- **Rotated array**: at each step one half is sorted; decide if the target lies in it.
- Complexity: O(log range × cost of ¦ok¦).

#### Example
¦¦¦js
function minCapacity(weights, days) {            // ship packages within D days
  const ok = cap => { let d = 1, cur = 0; for (const w of weights) { if (cur + w > cap) { d++; cur = 0; } cur += w; } return d <= days; };
  let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
  while (lo < hi) { const mid = (lo + hi) >> 1; if (ok(mid)) hi = mid; else lo = mid + 1; }
  return lo;
}
console.log(minCapacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)); // 15
function searchRotated(a, t) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === t) return mid;
    if (a[lo] <= a[mid]) { if (a[lo] <= t && t < a[mid]) hi = mid - 1; else lo = mid + 1; }
    else { if (a[mid] < t && t <= a[hi]) lo = mid + 1; else hi = mid - 1; }
  }
  return -1;
}
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
¦¦¦

#### Remember it
Cue: "minimum X such that...", "maximum value that still works", sorted but rotated. Skeleton: ¦while(lo<hi){mid; ok(mid)? hi=mid : lo=mid+1}¦.

#### Common mistakes
- Bounds that exclude the real answer.
- A non-monotonic ¦ok¦ function.
- Mixing ¦<¦ and ¦<=¦ loop conditions.

#### Interview angle
"Koko eating bananas, ship packages." Explain monotonicity first. Follow-up: "Complexity?" O(n log(sum)).

### Linked list patterns: reverse, merge, fast and slow pointers, cycle detection
#### In one line
Most list problems reuse four tricks: reverse with three pointers, merge with a dummy, find the middle or a cycle with fast and slow pointers.

#### Real-life analogy
A tortoise and a hare on a circular track: if there is a loop, the hare eventually laps the tortoise.

#### How it works
- **Reverse**: keep ¦prev¦, ¦cur¦, save ¦next¦, flip ¦cur.next = prev¦, advance.
- **Merge sorted lists**: compare heads, attach the smaller to a dummy tail.
- **Middle**: ¦slow¦ moves 1, ¦fast¦ moves 2; when fast ends, slow is the middle.
- **Cycle**: if fast meets slow there is a loop. Reset one pointer to the head and move both by 1 to find the cycle start.

#### Example
¦¦¦js
class N { constructor(v, n = null) { this.val = v; this.next = n; } }
const mk = a => { const d = new N(0); let c = d; for (const x of a) c = c.next = new N(x); return d.next; };
const arr = h => { const r = []; for (; h; h = h.next) r.push(h.val); return r; };
function reverse(h) { let prev = null; while (h) { const nx = h.next; h.next = prev; prev = h; h = nx; } return prev; }
function merge(a, b) {
  const d = new N(0); let t = d;
  while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }
  t.next = a || b; return d.next;
}
function hasCycle(h) { let s = h, f = h; while (f && f.next) { s = s.next; f = f.next.next; if (s === f) return true; } return false; }
console.log(arr(reverse(mk([1, 2, 3])))); // [ 3, 2, 1 ]
console.log(arr(merge(mk([1, 3, 5]), mk([2, 4])))); // [ 1, 2, 3, 4, 5 ]
const c = mk([1, 2, 3]); c.next.next.next = c.next;
console.log(hasCycle(c), hasCycle(mk([1, 2]))); // true false
¦¦¦
Time O(n), space O(1).

#### Remember it
Cue: "in place", "middle", "cycle", "k-th from end" (gap of k between two pointers).

#### Common mistakes
- Not saving ¦next¦ before re-pointing.
- ¦fast.next.next¦ without checking ¦fast.next¦.
- Forgetting ¦t.next = a || b¦ for the remainder.

#### Interview angle
"Detect a cycle in O(1) space." Floyd's algorithm. Follow-up: "Why do they meet?" The gap closes by 1 each step inside the loop.

### Monotonic stack and next-greater-element problems
#### In one line
A stack kept in increasing or decreasing order finds the next greater or smaller element for every position in O(n).

#### Real-life analogy
Waiting in a queue where a taller person behind you blocks the view of everyone shorter in front: shorter people leave the "visible" list once a taller one arrives.

#### How it works
- Scan left to right, keep a stack of **indexes** whose answer is not found yet.
- While the current value is greater than the value at the stack top, pop and record the answer for that index.
- Push the current index. Each index is pushed and popped once, so O(n).

#### Example
¦¦¦js
function dailyTemperatures(t) {
  const res = new Array(t.length).fill(0), st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[i] > t[st[st.length - 1]]) { const j = st.pop(); res[j] = i - j; }
    st.push(i);
  }
  return res;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // [ 1, 1, 4, 2, 1, 1, 0, 0 ]
¦¦¦
Trace: at i=1 (74) pops index 0, so res[0]=1. Time O(n), space O(n).

#### Remember it
Cue: "next greater/smaller", "span", "largest rectangle". Skeleton: ¦while(stack && cur > top) pop and answer; push¦.

#### Common mistakes
- Storing values when you need indexes.
- Wrong comparison direction (greater vs smaller).
- Forgetting leftover stack items (default answer).

#### Interview angle
"Why is this O(n) despite the inner while?" Each element is popped at most once. Follow-up: "Largest rectangle in a histogram?" Same stack with heights.

### Queue via stacks and stack via queues
#### In one line
You can build a queue from two stacks (and the reverse) to show you understand how each structure behaves.

#### Real-life analogy
Two piles of plates: moving the whole pile once reverses the order, so the bottom plate becomes the top.

#### How it works
- **Queue from two stacks**: ¦inStack¦ takes pushes. For ¦pop/peek¦, if ¦outStack¦ is empty move everything from ¦inStack¦ to ¦outStack¦, then pop from ¦outStack¦.
- Each element moves at most twice, so operations are amortised O(1).
- **Stack from one queue**: after pushing, rotate the queue ¦size - 1¦ times so the newest is at the front.

#### Example
¦¦¦js
class MyQueue {
  constructor() { this.inS = []; this.outS = []; }
  push(x) { this.inS.push(x); }
  _move() { if (!this.outS.length) while (this.inS.length) this.outS.push(this.inS.pop()); }
  pop() { this._move(); return this.outS.pop(); }
  peek() { this._move(); return this.outS[this.outS.length - 1]; }
}
const q = new MyQueue(); q.push(1); q.push(2); q.push(3);
console.log(q.pop(), q.peek()); // 1 2
q.push(4); console.log(q.pop(), q.pop(), q.pop()); // 2 3 4
¦¦¦

#### Remember it
Reverse twice = original order. Only refill ¦outS¦ when it is empty.

#### Common mistakes
- Refilling ¦outS¦ while it still has items (breaks order).
- Claiming each pop is O(1) worst case (it is amortised).
- Forgetting an empty check.

#### Interview angle
"Implement a queue using stacks." Explain amortised O(1). Follow-up: "Worst-case single pop?" O(n) when transferring.

### Trees: terminology, binary tree node, recursion on trees
#### In one line
A tree is a hierarchy of nodes; nearly every tree problem is "solve the left, solve the right, combine".

#### Real-life analogy
A company org chart: the CEO is the root, managers have reports, people with no reports are leaves.

#### How it works
- Terms: root, parent, child, leaf, depth (from root), height (to deepest leaf), subtree.
- Binary tree node: ¦{ val, left, right }¦. Height of a null node is 0 (or -1 by convention; state yours).
- Recursion template: ¦if (!node) return base; const L = f(node.left); const R = f(node.right); return combine(L, R, node)¦.
- Space is the recursion depth: O(height), which is O(log n) balanced and O(n) skewed.

#### Example
¦¦¦js
class T { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const root = new T(3, new T(9), new T(20, new T(15), new T(7)));
const height = n => (n ? 1 + Math.max(height(n.left), height(n.right)) : 0);
const count = n => (n ? 1 + count(n.left) + count(n.right) : 0);
const isSame = (a, b) => (!a && !b) || (!!a && !!b && a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right));
console.log(height(root), count(root), isSame(root, root)); // 3 5 true
¦¦¦
Time O(n), space O(h).

#### Remember it
Cue: any tree question. Say out loud: base case, left, right, combine.

#### Common mistakes
- Not handling ¦null¦ first.
- Using a global variable instead of returning values.
- Confusing depth and height.

#### Interview angle
"Walk me through how you approach a tree problem." Recursion with a clear return meaning. Follow-up: "Skewed tree and deep recursion?" Use iteration to avoid stack overflow.

### Tree traversals: preorder, inorder, postorder (DFS) and level order (BFS)
#### In one line
Traversals visit every node in a defined order: DFS goes deep first (pre, in, post) and BFS goes level by level.

#### Real-life analogy
Exploring a building: DFS is checking one room's whole corridor before the next; BFS is checking every room on floor 1, then floor 2.

#### How it works
- **Preorder**: node, left, right (copy a tree). **Inorder**: left, node, right (sorted order for BST). **Postorder**: left, right, node (delete or compute from children).
- **Level order** uses a queue; process ¦queue.length¦ nodes per round to separate levels.
- Iterative DFS uses an explicit stack.

#### Example
¦¦¦js
class T { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const root = new T(1, new T(2, new T(4), new T(5)), new T(3));
const pre = (n, o = []) => (n ? (o.push(n.val), pre(n.left, o), pre(n.right, o), o) : o);
const ino = (n, o = []) => (n ? (ino(n.left, o), o.push(n.val), ino(n.right, o), o) : o);
const post = (n, o = []) => (n ? (post(n.left, o), post(n.right, o), o.push(n.val), o) : o);
function levels(root) {
  if (!root) return []; const res = [], q = [root];
  while (q.length) {
    const n = q.length, lvl = [];
    for (let i = 0; i < n; i++) { const x = q.shift(); lvl.push(x.val); if (x.left) q.push(x.left); if (x.right) q.push(x.right); }
    res.push(lvl);
  }
  return res;
}
function inorderIter(root) {
  const st = [], out = []; let cur = root;
  while (cur || st.length) { while (cur) { st.push(cur); cur = cur.left; } cur = st.pop(); out.push(cur.val); cur = cur.right; }
  return out;
}
console.log(pre(root), ino(root), post(root)); // [1,2,4,5,3] [4,2,5,1,3] [4,5,2,3,1]
console.log(levels(root), inorderIter(root)); // [[1],[2,3],[4,5]] [4,2,5,1,3]
¦¦¦
Time O(n), space O(h) for DFS and O(width) for BFS.

#### Remember it
Pre = Root first, In = Root in the middle, Post = Root last. Shortest path or level info → BFS.

#### Common mistakes
- Forgetting to capture ¦queue.length¦ before the level loop.
- Mixing up the three DFS orders.
- ¦shift¦ cost on large queues.

#### Interview angle
"Inorder of a BST?" Sorted. Follow-up: "Iterative inorder?" Push left spine, pop, go right.

### Binary search trees: search, insert, validate, inorder property
#### In one line
A BST keeps smaller values on the left and larger on the right, so search, insert and delete take O(h).

#### Real-life analogy
A guessing game tree: each question ("is it smaller?") sends you left or right and removes half the options.

#### How it works
- Search: compare, go left or right until found or null.
- Insert: walk like search and attach at the null spot.
- **Inorder is sorted**; use it to check validity or find the k-th smallest.
- **Validate** by passing ¦(min, max)¦ bounds down; checking only the parent is wrong.
- Balanced: h = O(log n). Sorted inserts create a skewed O(n) tree.

#### Example
¦¦¦js
class T { constructor(v) { this.val = v; this.left = this.right = null; } }
function insert(n, v) { if (!n) return new T(v); if (v < n.val) n.left = insert(n.left, v); else n.right = insert(n.right, v); return n; }
function validate(n, lo = -Infinity, hi = Infinity) {
  if (!n) return true;
  if (n.val <= lo || n.val >= hi) return false;
  return validate(n.left, lo, n.val) && validate(n.right, n.val, hi);
}
function kthSmallest(root, k) {
  const st = []; let cur = root;
  while (cur || st.length) { while (cur) { st.push(cur); cur = cur.left; } cur = st.pop(); if (--k === 0) return cur.val; cur = cur.right; }
}
let root = null; for (const v of [5, 3, 8, 1, 4, 9]) root = insert(root, v);
console.log(validate(root), kthSmallest(root, 3)); // true 4
const bad = new T(5); bad.left = new T(3); bad.left.right = new T(6);
console.log(validate(bad)); // false
¦¦¦

#### Remember it
Cue: "sorted", "k-th", "validate". Remember min/max bounds.

#### Common mistakes
- Only comparing a node with its direct children.
- Using ¦<=¦ and ¦<¦ inconsistently for duplicates.
- Assuming a BST is balanced.

#### Interview angle
"Validate a BST." Pass bounds, or check that inorder is strictly increasing. Follow-up: "Delete a node?" Handle 0, 1 or 2 children (replace with the inorder successor).

### Lowest common ancestor, height, diameter, path sum
#### In one line
These problems return a value from each subtree and combine them, instead of storing results in globals.

#### Real-life analogy
Finding the first shared manager of two employees: walk up until their paths meet.

#### How it works
- **LCA**: if the node is null or equals p or q return it; recurse both sides; if both return non-null this node is the LCA, otherwise return the non-null side.
- **Diameter**: at each node the longest path through it is ¦leftHeight + rightHeight¦; track the best while returning the height.
- **Path sum**: subtract the node value as you go down; check at leaves.

#### Example
¦¦¦js
class T { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const n4 = new T(4), n5 = new T(5), n2 = new T(2, n4, n5), n3 = new T(3), root = new T(1, n2, n3);
function lca(n, p, q) {
  if (!n || n === p || n === q) return n;
  const L = lca(n.left, p, q), R = lca(n.right, p, q);
  return L && R ? n : L || R;
}
function diameter(root) {
  let best = 0;
  (function h(n) { if (!n) return 0; const l = h(n.left), r = h(n.right); best = Math.max(best, l + r); return 1 + Math.max(l, r); })(root);
  return best;
}
function hasPathSum(n, t) {
  if (!n) return false;
  if (!n.left && !n.right) return t === n.val;
  return hasPathSum(n.left, t - n.val) || hasPathSum(n.right, t - n.val);
}
console.log(lca(root, n4, n5).val, diameter(root), hasPathSum(root, 7)); // 2 3 true
¦¦¦
Time O(n), space O(h).

#### Remember it
"Return up what the parent needs." Diameter returns height but updates the best; LCA returns a node.

#### Common mistakes
- Counting nodes instead of edges for diameter (be consistent).
- Checking path sum at non-leaf nodes.
- Using parent pointers when recursion is enough.

#### Interview angle
"Why track the best in a variable but return height?" Different jobs: the answer may bend at a node, but the parent only needs the longest downward path.

### Heaps and priority queues: MinHeap and MaxHeap implementation
#### In one line
A heap is an array-based tree that always keeps the smallest (or largest) item on top, with O(log n) push and pop.

#### Real-life analogy
An emergency room: the most urgent patient is always seen next, no matter when they arrived.

#### How it works
- Store a complete binary tree in an array: children of ¦i¦ are ¦2i+1¦ and ¦2i+2¦; parent is ¦(i-1)>>1¦.
- **Push**: add at the end, **sift up** while smaller than the parent.
- **Pop**: take the root, move the last item to the root, **sift down** with the smaller child.
- Peek is O(1). Building from n items is O(n). JavaScript has no built-in heap, so you write one.

#### Example
¦¦¦js
class MinHeap {
  constructor(cmp = (a, b) => a - b) { this.h = []; this.cmp = cmp; }
  get size() { return this.h.length; }
  push(x) {
    const h = this.h; h.push(x); let i = h.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (this.cmp(h[i], h[p]) >= 0) break; [h[i], h[p]] = [h[p], h[i]]; i = p; }
  }
  pop() {
    const h = this.h; if (!h.length) return undefined;
    const top = h[0], last = h.pop();
    if (h.length) {
      h[0] = last; let i = 0;
      for (;;) {
        let s = i; const l = 2 * i + 1, r = l + 1;
        if (l < h.length && this.cmp(h[l], h[s]) < 0) s = l;
        if (r < h.length && this.cmp(h[r], h[s]) < 0) s = r;
        if (s === i) break; [h[i], h[s]] = [h[s], h[i]]; i = s;
      }
    }
    return top;
  }
}
const hp = new MinHeap(); [5, 2, 8, 1, 9].forEach(x => hp.push(x));
console.log(hp.pop(), hp.pop(), hp.pop()); // 1 2 5
const maxHeap = new MinHeap((a, b) => b - a); [5, 2, 8].forEach(x => maxHeap.push(x));
console.log(maxHeap.pop()); // 8
¦¦¦
Push/pop O(log n), space O(n).

#### Remember it
Cue: "k-th largest", "merge K", "schedule by priority". MaxHeap = flip the comparator.

#### Common mistakes
- Using ¦sort¦ each time (O(n log n) per query).
- Wrong child index maths.
- Forgetting the single-element pop case.

#### Interview angle
"Implement a heap." Explain sift up/down. Follow-up: "Heapify complexity?" O(n), not O(n log n).

### Top-K and merge-K patterns
#### In one line
To get the K best items, keep a heap of size K instead of sorting everything.

#### Real-life analogy
A leaderboard of the top 3: you only remember the three best so far and the weakest of them is the bar to beat.

#### How it works
- **K largest**: keep a **min-heap** of size K; if a new item is bigger than the top, replace the top. The heap holds the K largest. O(n log k).
- **Top K frequent**: count with a Map, then use a heap or **bucket sort** by frequency (O(n)).
- **Merge K sorted lists**: heap holds the current head of each list; pop the smallest and push its next.

#### Example
¦¦¦js
function topKFrequent(nums, k) {
  const cnt = new Map(); for (const x of nums) cnt.set(x, (cnt.get(x) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [v, c] of cnt) buckets[c].push(v);
  const res = [];
  for (let c = buckets.length - 1; c > 0 && res.length < k; c--) res.push(...buckets[c]);
  return res.slice(0, k);
}
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [ 1, 2 ]
function kthLargest(a, k) {                 // min-heap by sorted array for brevity
  const heap = [];
  for (const x of a) { heap.push(x); heap.sort((p, q) => p - q); if (heap.length > k) heap.shift(); }
  return heap[0];
}
console.log(kthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
¦¦¦
Bucket version: time O(n), space O(n). Use a real MinHeap for O(n log k).

#### Remember it
K largest → MIN-heap of size K. K smallest → MAX-heap. Frequencies → bucket sort.

#### Common mistakes
- Using a max-heap of all items (O(n log n)).
- Ties and order when the answer must be stable.
- Forgetting buckets need size n + 1.

#### Interview angle
"Why a min-heap for the K largest?" Its top is the weakest of the current best K, which is the one to evict. Follow-up: "Streaming data?" Same heap works online.

### Backtracking: subsets, permutations, combinations, n-queens basics
#### In one line
Build solutions step by step, undo the last choice when you hit a dead end, and try the next option.

#### Real-life analogy
Walking a maze and marking turns: at a dead end you step back to the last junction and take a different path.

#### How it works
- Pattern: **choose, explore, un-choose**.
- Keep a ¦path¦ array; when it is a full answer push a **copy** into results.
- **Prune** early (a sum already too large, a column already used).
- Complexity is exponential: subsets 2ⁿ, permutations n!.

#### Example
¦¦¦js
function subsets(nums) {
  const res = [];
  (function go(i, path) {
    if (i === nums.length) { res.push([...path]); return; }
    path.push(nums[i]); go(i + 1, path);   // choose
    path.pop(); go(i + 1, path);           // un-choose, skip
  })(0, []);
  return res;
}
console.log(subsets([1, 2, 3]).length); // 8
function permutations(nums) {
  const res = [], used = new Array(nums.length).fill(false);
  (function go(path) {
    if (path.length === nums.length) return void res.push([...path]);
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue; used[i] = true; path.push(nums[i]);
      go(path); path.pop(); used[i] = false;
    }
  })([]);
  return res;
}
console.log(permutations([1, 2, 3]).map(p => p.join('')).join()); // 123,132,213,231,312,321
¦¦¦

#### Remember it
Cue: "all combinations / arrangements / valid placements". Skeleton: ¦go(){ if done save copy; for choice: choose; go(); undo }¦.

#### Common mistakes
- Pushing ¦path¦ itself instead of a copy.
- Forgetting to undo state.
- No pruning, so the search is slower than needed.

#### Interview angle
"Complexity of subsets?" O(n · 2ⁿ) including copying. Follow-up: "Handle duplicates?" Sort and skip equal neighbours at the same level.

### Intervals: merge, insert, meeting rooms
#### In one line
Sort intervals by start, then sweep once, merging or counting overlaps.

#### Real-life analogy
A calendar: sort meetings by start time and you can see where one overlaps the next.

#### How it works
- Overlap test for sorted intervals: ¦next.start <= current.end¦.
- **Merge**: extend the current end with ¦max(end, next.end)¦ when overlapping, otherwise start a new interval.
- **Meeting rooms II**: sort starts and ends separately and sweep, or use a min-heap of end times.
- Sorting dominates: O(n log n).

#### Example
¦¦¦js
function merge(iv) {
  iv.sort((a, b) => a[0] - b[0]); const out = [iv[0].slice()];
  for (let i = 1; i < iv.length; i++) {
    const last = out[out.length - 1];
    if (iv[i][0] <= last[1]) last[1] = Math.max(last[1], iv[i][1]); else out.push(iv[i].slice());
  }
  return out;
}
console.log(JSON.stringify(merge([[1, 3], [8, 10], [2, 6], [15, 18]]))); // [[1,6],[8,10],[15,18]]
function minRooms(iv) {
  const s = iv.map(x => x[0]).sort((a, b) => a - b), e = iv.map(x => x[1]).sort((a, b) => a - b);
  let rooms = 0, best = 0, j = 0;
  for (let i = 0; i < s.length; i++) { if (s[i] >= e[j]) j++; else rooms++; best = Math.max(best, rooms); }
  return best;
}
console.log(minRooms([[0, 30], [5, 10], [15, 20]])); // 2
¦¦¦

#### Remember it
Cue: "overlap", "schedule", "merge". First action: sort by start.

#### Common mistakes
- Not sorting.
- Using ¦<¦ vs ¦<=¦ wrongly for touching intervals.
- Mutating the input intervals when you must not.

#### Interview angle
"Minimum meeting rooms." Two sorted arrays or a heap. Follow-up: "Streaming intervals?" Use a balanced tree or a heap.

### Matrix and grid problems: traversal, rotation, spiral
#### In one line
Grid problems are array problems with row and column bounds and direction arrays.

#### Real-life analogy
A chessboard: from any square you can step in four or eight directions, but never off the board.

#### How it works
- Directions: ¦const dirs = [[1,0],[-1,0],[0,1],[0,-1]]¦.
- Bounds check: ¦0 <= r < rows && 0 <= c < cols¦.
- **Rotate 90° clockwise**: transpose, then reverse each row.
- **Spiral**: keep four boundaries (top, bottom, left, right) and shrink them.
- Complexity usually O(rows × cols).

#### Example
¦¦¦js
function rotate(m) {
  const n = m.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
  m.forEach(r => r.reverse()); return m;
}
console.log(JSON.stringify(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))); // [[7,4,1],[8,5,2],[9,6,3]]
function spiral(m) {
  const res = []; let t = 0, b = m.length - 1, l = 0, r = m[0].length - 1;
  while (t <= b && l <= r) {
    for (let j = l; j <= r; j++) res.push(m[t][j]); t++;
    for (let i = t; i <= b; i++) res.push(m[i][r]); r--;
    if (t <= b) { for (let j = r; j >= l; j--) res.push(m[b][j]); b--; }
    if (l <= r) { for (let i = b; i >= t; i--) res.push(m[i][l]); l++; }
  }
  return res;
}
console.log(spiral([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).join()); // 1,2,3,6,9,8,7,4,5
¦¦¦

#### Remember it
Rotate = transpose + reverse rows. Always write the bounds check first.

#### Common mistakes
- Swapping both halves in transpose (undoing it).
- Missing the two ¦if¦ guards in spiral for thin matrices.
- Mixing up ¦row¦ and ¦col¦ order.

#### Interview angle
"Rotate in place." Transpose and reverse. Follow-up: "Counter-clockwise?" Reverse rows first, then transpose.

### Greedy algorithms: activity selection, jump game, intervals
#### In one line
A greedy algorithm makes the best local choice at each step and is correct only when that choice is provably safe.

#### Real-life analogy
Packing the earliest-ending meetings first leaves the most time for others; grabbing the biggest coin first works for standard currency but not for every coin set.

#### How it works
- Greedy needs the **greedy-choice property** and optimal substructure; prove it with an exchange argument or a counterexample search.
- **Activity selection**: sort by end time, take every activity that starts after the last chosen one ends.
- **Jump game**: track the farthest reachable index.
- If greedy fails (coin change with odd coins), use dynamic programming.

#### Example
¦¦¦js
function canJump(a) {
  let far = 0;
  for (let i = 0; i < a.length; i++) { if (i > far) return false; far = Math.max(far, i + a[i]); }
  return true;
}
console.log(canJump([2, 3, 1, 1, 4]), canJump([3, 2, 1, 0, 4])); // true false
function maxActivities(iv) {
  iv.sort((a, b) => a[1] - b[1]); let end = -Infinity, n = 0;
  for (const [s, e] of iv) if (s >= end) { n++; end = e; }
  return n;
}
console.log(maxActivities([[1, 4], [3, 5], [0, 6], [5, 7], [8, 9], [5, 9]])); // 3
¦¦¦
Time O(n) or O(n log n), space O(1).

#### Remember it
Cue: "minimum/maximum number of ...", ordering by one key. Test the idea on a small counterexample before coding.

#### Common mistakes
- Assuming greedy works without proof.
- Sorting by the wrong key (start instead of end).
- Using greedy for coin change with arbitrary coins.

#### Interview angle
"Why does sorting by end time work?" An earlier end never blocks more future meetings. Follow-up: "A case where greedy fails?" Coins [1, 3, 4], amount 6.

### Tries (prefix trees)
#### In one line
A trie stores words character by character so prefix searches take time proportional to the word length.

#### Real-life analogy
A phone's autocomplete: typing "ca" jumps straight to the branch holding "cat", "car" and "care".

#### How it works
- Each node has ¦children¦ (Map or object by character) and an ¦isEnd¦ flag.
- Insert/search/startsWith are O(L) where L is the word length, independent of how many words exist.
- Memory can be large; compress with radix trees or use a Map for sparse children.
- Autocomplete: walk to the prefix node, then DFS to collect words.

#### Example
¦¦¦js
class Trie {
  constructor() { this.root = { c: new Map(), end: false }; }
  insert(w) { let n = this.root; for (const ch of w) { if (!n.c.has(ch)) n.c.set(ch, { c: new Map(), end: false }); n = n.c.get(ch); } n.end = true; }
  _find(p) { let n = this.root; for (const ch of p) { n = n.c.get(ch); if (!n) return null; } return n; }
  search(w) { const n = this._find(w); return !!n && n.end; }
  startsWith(p) { return !!this._find(p); }
  suggest(p) {
    const n = this._find(p), out = []; if (!n) return out;
    (function dfs(x, s) { if (x.end) out.push(s); for (const [ch, nx] of x.c) dfs(nx, s + ch); })(n, p);
    return out;
  }
}
const t = new Trie(); ['car', 'care', 'cat', 'dog'].forEach(w => t.insert(w));
console.log(t.search('car'), t.search('ca'), t.startsWith('ca')); // true false true
console.log(t.suggest('car')); // [ 'car', 'care' ]
¦¦¦

#### Remember it
Cue: "prefix", "autocomplete", "dictionary of words". Always have an ¦isEnd¦ flag.

#### Common mistakes
- Forgetting ¦isEnd¦ (so "ca" looks like a word).
- Using arrays of 26 for unicode input.
- Not discussing memory.

#### Interview angle
"Design autocomplete." Trie plus top-K per node. Follow-up: "Millions of words?" Radix tree, DAWG, or a search index.

### Bit manipulation basics: &, |, ^, <<, >>, XOR tricks
#### In one line
Bit operators work directly on binary digits and give constant-time tricks for flags, parity and uniqueness.

#### Real-life analogy
A row of light switches: AND checks which are on in both rows, OR turns on any, XOR flips the ones that differ.

#### How it works
- ¦a & b¦, ¦a | b¦, ¦a ^ b¦, ¦~a¦, ¦a << n¦ (×2ⁿ), ¦a >> n¦ (÷2ⁿ), ¦a >>> n¦ (unsigned).
- JavaScript bitwise operators work on **32-bit signed integers**.
- ¦x ^ x = 0¦ and ¦x ^ 0 = x¦, so XOR cancels pairs.
- ¦n & (n - 1)¦ clears the lowest set bit; power of two means ¦n > 0 && (n & (n - 1)) === 0¦.
- Flags: set ¦|= 1 << i¦, test ¦& (1 << i)¦, clear ¦&= ~(1 << i)¦.

#### Example
¦¦¦js
const single = a => a.reduce((x, y) => x ^ y, 0);
console.log(single([4, 1, 2, 1, 2])); // 4
const isPow2 = n => n > 0 && (n & (n - 1)) === 0;
console.log(isPow2(16), isPow2(18)); // true false
function countBits(n) { let c = 0; while (n) { n &= n - 1; c++; } return c; }
console.log(countBits(13)); // 3  (1101)
let perms = 0; perms |= 1 << 2; perms |= 1 << 0;
console.log(perms.toString(2), !!(perms & (1 << 2))); // 101 true
¦¦¦
Time O(1) to O(bits).

#### Remember it
Cue: "appears once while others twice" → XOR. "Flags/subsets" → bitmask. Use ¦>>>¦ for unsigned shifts.

#### Common mistakes
- Using bit tricks on numbers above 2³¹.
- Mixing ¦&¦ and ¦&&¦.
- Operator precedence: ¦a & b === c¦ evaluates ¦b === c¦ first; add parentheses.

#### Interview angle
"Find the single number." XOR all. Follow-up: "Two single numbers?" XOR all, split by a set bit, XOR each group.

## Phase 3 · Advanced and design (Advanced)
### Graphs: adjacency list vs matrix, directed vs undirected
#### In one line
A graph is nodes (vertices) joined by edges; you store it as an adjacency list or matrix depending on how dense it is.

#### Real-life analogy
A city map: intersections are vertices, roads are edges; one-way streets make the graph directed and distances make it weighted.

#### How it works
- **Adjacency list**: ¦Map(node → [neighbours])¦, space O(V + E), best for sparse graphs (most interview problems).
- **Adjacency matrix**: ¦V × V¦ grid, space O(V²), edge check O(1), good for dense graphs.
- Undirected: add both directions. Directed: add one. Weighted: store ¦[neighbour, weight]¦.
- Build from an edge list in O(V + E).

#### Example
¦¦¦js
function buildGraph(n, edges, directed = false) {
  const g = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { g[a].push(b); if (!directed) g[b].push(a); }
  return g;
}
const g = buildGraph(4, [[0, 1], [0, 2], [1, 3]]);
console.log(JSON.stringify(g)); // [[1,2],[0,3],[0],[1]]
const inDeg = n => (edges => { const d = new Array(n).fill(0); edges.forEach(([, b]) => d[b]++); return d; });
console.log(inDeg(4)([[0, 1], [0, 2], [1, 3]])); // [ 0, 1, 1, 1 ]
¦¦¦

#### Remember it
Cue: relationships, dependencies, networks, grids as graphs. Default to an adjacency list.

#### Common mistakes
- Forgetting the reverse edge for undirected graphs.
- Using a matrix for 100k nodes.
- Not handling disconnected components.

#### Interview angle
"List or matrix?" List for sparse (O(V + E) space), matrix for dense or constant-time edge lookup. Follow-up: "Edge count of a complete graph?" V(V − 1)/2 undirected.

### Graph traversal: BFS and DFS, visited sets
#### In one line
BFS explores neighbours level by level (shortest path in unweighted graphs) and DFS goes as deep as possible first.

#### Real-life analogy
BFS is a ripple spreading on water; DFS is following one tunnel to the end before trying another.

#### How it works
- Always keep a **visited** set to avoid infinite loops in cycles.
- **BFS**: queue; mark visited when you enqueue; distance = level number.
- **DFS**: recursion or a stack.
- Both are O(V + E) time and O(V) space.

#### Example
¦¦¦js
const g = { A: ['B', 'C'], B: ['D'], C: ['D', 'E'], D: ['F'], E: ['F'], F: [] };
function bfsDist(g, s, t) {
  const dist = new Map([[s, 0]]), q = [s]; let h = 0;
  while (h < q.length) {
    const u = q[h++]; if (u === t) return dist.get(u);
    for (const v of g[u]) if (!dist.has(v)) { dist.set(v, dist.get(u) + 1); q.push(v); }
  }
  return -1;
}
function dfs(g, s, seen = new Set(), order = []) { seen.add(s); order.push(s); for (const v of g[s]) if (!seen.has(v)) dfs(g, v, seen, order); return order; }
console.log(bfsDist(g, 'A', 'F'), dfs(g, 'A').join('')); // 3 ABDFCE
¦¦¦

#### Remember it
Shortest steps / levels → BFS. Explore all / paths / cycles / components → DFS.

#### Common mistakes
- Marking visited when popping instead of pushing (duplicates in queue).
- Missing the visited check.
- Recursion depth on very large graphs.

#### Interview angle
"Shortest path in an unweighted graph." BFS. Follow-up: "Weighted?" Dijkstra.

### Connected components, grid islands and cycle detection
#### In one line
Flood fill (DFS or BFS) counts regions; tracking the current path detects cycles.

#### Real-life analogy
Pouring water on one island of a map and seeing how far it spreads: each separate wet region is one component.

#### How it works
- **Islands**: for each unvisited land cell, run DFS/BFS marking all connected land; increment the count.
- Undirected cycle: during DFS, meeting a visited node that is not the parent means a cycle.
- Directed cycle: keep a **recursion-stack** state (unvisited, visiting, done); reaching a "visiting" node is a cycle.
- Complexity O(rows × cols) or O(V + E).

#### Example
¦¦¦js
function numIslands(grid) {
  const R = grid.length, C = grid[0].length; let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== '1') return;
    grid[r][c] = '0'; sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r][c] === '1') { count++; sink(r, c); }
  return count;
}
console.log(numIslands([['1','1','0','0'],['1','0','0','1'],['0','0','1','1']].map(r => r.slice()))); // 2
function hasCycleDirected(n, edges) {
  const g = Array.from({ length: n }, () => []); edges.forEach(([a, b]) => g[a].push(b));
  const st = new Array(n).fill(0);
  const go = u => { st[u] = 1; for (const v of g[u]) { if (st[v] === 1 || (st[v] === 0 && go(v))) return true; } st[u] = 2; return false; };
  for (let i = 0; i < n; i++) if (st[i] === 0 && go(i)) return true;
  return false;
}
console.log(hasCycleDirected(3, [[0, 1], [1, 2], [2, 0]]), hasCycleDirected(3, [[0, 1], [1, 2]])); // true false
¦¦¦

#### Remember it
Cue: "number of regions", "connected", "is there a cycle". Mutating the grid saves a visited set (say so, and mention you can copy first).

#### Common mistakes
- Treating a parent edge as a cycle in undirected graphs.
- Using only two states for directed cycles.
- Forgetting diagonal vs 4-direction rules.

#### Interview angle
"Number of islands." DFS flood fill. Follow-up: "Grid is huge?" Use BFS or iterative DFS and union-find.

### Topological sort: Kahn's algorithm and DFS
#### In one line
Topological sort orders the nodes of a directed acyclic graph so every dependency comes before the thing that needs it.

#### Real-life analogy
Getting dressed: socks before shoes, shirt before jacket; a valid order respects every "before" rule.

#### How it works
- **Kahn's algorithm**: compute in-degrees, queue all nodes with in-degree 0, pop one, add it to the order, decrement neighbours' in-degrees and enqueue new zeros.
- If the order has fewer than V nodes, a **cycle** exists.
- DFS version: post-order, then reverse.
- Time O(V + E).

#### Example
¦¦¦js
function canFinish(n, prereqs) {
  const g = Array.from({ length: n }, () => []), indeg = new Array(n).fill(0);
  for (const [a, b] of prereqs) { g[b].push(a); indeg[a]++; }
  const q = []; indeg.forEach((d, i) => { if (d === 0) q.push(i); });
  const order = [];
  for (let h = 0; h < q.length; h++) {
    const u = q[h]; order.push(u);
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === n ? order : [];
}
console.log(canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]])); // [ 0, 1, 2, 3 ]
console.log(canFinish(2, [[1, 0], [0, 1]])); // []
¦¦¦

#### Remember it
Cue: "prerequisites", "build order", "dependency". Cycle ⇒ no valid order.

#### Common mistakes
- Reversing edge direction.
- Not returning/detecting the cycle case.
- Using ¦shift¦ on big queues.

#### Interview angle
"Course schedule." Kahn's algorithm, compare the count to n. Follow-up: "All valid orders?" Backtracking over zero in-degree nodes.

### Shortest paths: Dijkstra with a priority queue
#### In one line
Dijkstra finds the cheapest path from one source to all nodes in a graph with non-negative weights.

#### Real-life analogy
A GPS exploring roads: it always expands the closest unexplored junction first, so when it reaches a place it has found the cheapest route.

#### How it works
- Keep ¦dist[]¦ (start 0, others ∞) and a **min-heap** of ¦[distance, node]¦.
- Pop the smallest; skip if it is stale (larger than ¦dist[node]¦). Relax each edge: ¦dist[v] = min(dist[v], dist[u] + w)¦ and push.
- Time O((V + E) log V). Fails with **negative weights** (use Bellman-Ford).

#### Example
¦¦¦js
class MinHeap { // compact heap on [dist, node]
  constructor() { this.a = []; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a, t = a[0], l = a.pop(); if (a.length) { a[0] = l; let i = 0; for (;;) { let s = i, c = 2 * i + 1; if (c < a.length && a[c][0] < a[s][0]) s = c; if (c + 1 < a.length && a[c + 1][0] < a[s][0]) s = c + 1; if (s === i) break; [a[s], a[i]] = [a[i], a[s]]; i = s; } } return t; }
  get size() { return this.a.length; }
}
function dijkstra(g, src) {
  const dist = Object.fromEntries(Object.keys(g).map(k => [k, Infinity])); dist[src] = 0;
  const h = new MinHeap(); h.push([0, src]);
  while (h.size) {
    const [d, u] = h.pop(); if (d > dist[u]) continue;
    for (const [v, w] of g[u]) if (d + w < dist[v]) { dist[v] = d + w; h.push([dist[v], v]); }
  }
  return dist;
}
const g = { A: [['B', 4], ['C', 1]], B: [['D', 1]], C: [['B', 2], ['D', 5]], D: [] };
console.log(dijkstra(g, 'A')); // { A: 0, B: 3, C: 1, D: 4 }
¦¦¦

#### Remember it
Cue: "cheapest/fastest route", weights ≥ 0. Unweighted → BFS. Negative → Bellman-Ford.

#### Common mistakes
- Using it with negative edges.
- Not skipping stale heap entries.
- Sorting an array each iteration instead of a heap.

#### Interview angle
"Why a priority queue?" To always expand the nearest node in O(log V). Follow-up: "Complexity without a heap?" O(V²).

### Union-Find (disjoint set) with path compression and union by rank
#### In one line
Union-Find tracks which items belong to the same group and merges groups in almost constant time.

#### Real-life analogy
Friend circles: joining two circles merges them, and asking "are you in the same circle?" just compares circle leaders.

#### How it works
- ¦parent[i]¦ points to the group leader (root). ¦find¦ follows parents to the root.
- **Path compression**: re-point nodes directly to the root while finding.
- **Union by rank/size**: attach the smaller tree under the larger.
- Together: amortised O(α(n)), practically constant.
- If ¦find(a) === find(b)¦ before union, adding that edge creates a cycle.

#### Example
¦¦¦js
class DSU {
  constructor(n) { this.p = Array.from({ length: n }, (_, i) => i); this.sz = new Array(n).fill(1); this.count = n; }
  find(x) { while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; } return x; }
  union(a, b) {
    let x = this.find(a), y = this.find(b); if (x === y) return false;
    if (this.sz[x] < this.sz[y]) [x, y] = [y, x];
    this.p[y] = x; this.sz[x] += this.sz[y]; this.count--; return true;
  }
}
const d = new DSU(5); d.union(0, 1); d.union(1, 2); d.union(3, 4);
console.log(d.count, d.find(0) === d.find(2), d.union(0, 2)); // 2 true false
¦¦¦

#### Remember it
Cue: "connected?", "number of groups", "redundant edge", Kruskal's MST.

#### Common mistakes
- Forgetting to compress paths.
- Comparing ¦parent[a]¦ instead of ¦find(a)¦.
- Using it when you need to split groups (it only merges).

#### Interview angle
"Redundant connection." Union edges; the first one where roots match is redundant. Follow-up: "Complexity?" Nearly O(1) per operation.

### Dynamic programming foundations: overlapping subproblems and memoisation
#### In one line
DP solves a problem by breaking it into smaller overlapping subproblems and storing each answer so it is computed once.

#### Real-life analogy
Writing intermediate results in your notes while doing a long calculation so you never repeat the same sum.

#### How it works
- Check two things: **optimal substructure** and **overlapping subproblems**.
- Steps: define the **state**, write the **transition**, set **base cases**, choose the **order** (top-down memo or bottom-up table).
- Start with plain recursion, add a cache, then optionally convert to a table and shrink the space.
- Complexity = number of states × work per state.

#### Example
¦¦¦js
const memo = new Map();
function ways(n) {                       // paths with steps of 1 or 2
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  const v = ways(n - 1) + ways(n - 2); memo.set(n, v); return v;
}
console.log(ways(10)); // 89
function waysTable(n) {                  // bottom-up, O(1) space
  let a = 1, b = 1; for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; return b;
}
console.log(waysTable(10)); // 89
¦¦¦
Memo: O(n) time and space. Table with two variables: O(n) time, O(1) space.

#### Remember it
Cue: "count the ways", "minimum/maximum cost", "can we reach", choices at each step. Say: "state = ..., transition = ..., base = ...".

#### Common mistakes
- Using a mutable object as a memo key without stringifying.
- Wrong base case.
- Hidden state missing from the cache key.

#### Interview angle
"Recursion to DP." Show exponential recursion, then caching. Follow-up: "Top-down vs bottom-up?" Memo only computes needed states; tables avoid recursion depth.

### 1D DP: climbing stairs, house robber, coin change, longest increasing subsequence
#### In one line
In 1D DP the answer for position i depends on earlier positions, stored in a single array.

#### Real-life analogy
Climbing a staircase where you remember how many ways led to each step, so each step is just the sum of the previous few.

#### How it works
- **House robber**: ¦dp[i] = max(dp[i-1], dp[i-2] + a[i])¦.
- **Coin change (min coins)**: ¦dp[x] = min(dp[x - c] + 1)¦ over coins; ¦dp[0] = 0¦, others ∞.
- **LIS**: ¦dp[i] = 1 + max(dp[j])¦ for ¦j < i¦ with ¦a[j] < a[i]¦, O(n²); O(n log n) with binary search over tails.

#### Example
¦¦¦js
function rob(a) { let p = 0, c = 0; for (const x of a) [p, c] = [c, Math.max(c, p + x)]; return c; }
console.log(rob([2, 7, 9, 3, 1])); // 12
function coinChange(coins, amt) {
  const dp = new Array(amt + 1).fill(Infinity); dp[0] = 0;
  for (let x = 1; x <= amt; x++) for (const c of coins) if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
  return dp[amt] === Infinity ? -1 : dp[amt];
}
console.log(coinChange([1, 2, 5], 11), coinChange([2], 3)); // 3 -1
function lis(a) {
  const tails = [];
  for (const x of a) {
    let lo = 0, hi = tails.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m; }
    tails[lo] = x;
  }
  return tails.length;
}
console.log(lis([10, 9, 2, 5, 3, 7, 101, 18])); // 4
¦¦¦

#### Remember it
Say state out loud: "dp[i] means the best answer using the first i items / for amount i".

#### Common mistakes
- Initialising with 0 instead of Infinity for minimum problems.
- Returning ¦Infinity¦ instead of -1.
- Confusing ¦tails¦ with the actual subsequence.

#### Interview angle
"Coin change." Define ¦dp[x]¦, explain why greedy fails ([1,3,4], 6). Follow-up: "Count ways instead of min?" Outer loop coins, inner loop amounts.

### 2D DP: LCS, edit distance, unique paths, knapsack
#### In one line
2D DP uses a table indexed by two variables, such as positions in two strings or item and capacity.

#### Real-life analogy
Comparing two documents with a grid: each cell asks "do the next characters match, or which edit is cheapest?" and fills from top-left to bottom-right.

#### How it works
- **LCS**: ¦dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : max(dp[i-1][j], dp[i][j-1])¦.
- **Edit distance**: match = diagonal; otherwise 1 + min(insert, delete, replace).
- **Unique paths**: ¦dp[i][j] = dp[i-1][j] + dp[i][j-1]¦.
- **0/1 knapsack**: ¦dp[w] = max(dp[w], dp[w - wt] + val)¦ iterating weights **downwards**.
- Space can often drop to one row.

#### Example
¦¦¦js
function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}
console.log(lcs('abcde', 'ace')); // 3
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
}
console.log(editDistance('horse', 'ros')); // 3
function knapsack(wt, val, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < wt.length; i++) for (let w = W; w >= wt[i]; w--) dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
  return dp[W];
}
console.log(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9
¦¦¦
LCS and edit distance: O(m × n) time and space.

#### Remember it
Two strings or item + capacity → 2D table. Draw the first row/column as base cases.

#### Common mistakes
- Off-by-one between table index and string index.
- Iterating weights upward (turns 0/1 into unbounded knapsack).
- Not initialising the first row and column.

#### Interview angle
"Edit distance." Explain the three operations as three neighbouring cells. Follow-up: "Reduce space?" Keep only the previous row.

### Design problems: LRU cache, min stack, iterator, rate limiter
#### In one line
Design problems combine basic structures so each operation stays O(1) or O(log n).

#### Real-life analogy
A desk with room for five papers: when it is full, you put away the paper you have not touched for the longest time.

#### How it works
- **LRU cache**: a Map keeps insertion order; on ¦get¦ delete and re-insert to mark as recent; on ¦put¦ evict the first key when over capacity. (Interviewers may want a hash map plus doubly linked list; explain both.)
- **Min stack**: store ¦[value, minSoFar]¦ pairs.
- **Rate limiter**: sliding window with a queue of timestamps, or a token bucket.
- **Iterator**: keep internal state and expose ¦next¦/¦hasNext¦.

#### Example
¦¦¦js
class LRU {
  constructor(cap) { this.cap = cap; this.m = new Map(); }
  get(k) { if (!this.m.has(k)) return -1; const v = this.m.get(k); this.m.delete(k); this.m.set(k, v); return v; }
  put(k, v) { this.m.delete(k); this.m.set(k, v); if (this.m.size > this.cap) this.m.delete(this.m.keys().next().value); }
}
const c = new LRU(2); c.put(1, 1); c.put(2, 2); c.get(1); c.put(3, 3);
console.log(c.get(2), c.get(1), c.get(3)); // -1 1 3
class MinStack {
  constructor() { this.s = []; }
  push(x) { const m = this.s.length ? Math.min(x, this.s[this.s.length - 1][1]) : x; this.s.push([x, m]); }
  pop() { return this.s.pop()[0]; }
  min() { return this.s[this.s.length - 1][1]; }
}
const ms = new MinStack(); ms.push(3); ms.push(1); ms.push(2);
console.log(ms.min()); // 1
class RateLimiter {
  constructor(max, windowMs) { this.max = max; this.w = windowMs; this.q = []; }
  allow(now) { while (this.q.length && this.q[0] <= now - this.w) this.q.shift(); if (this.q.length < this.max) { this.q.push(now); return true; } return false; }
}
const rl = new RateLimiter(2, 1000);
console.log(rl.allow(0), rl.allow(100), rl.allow(200), rl.allow(1100)); // true true false true
¦¦¦

#### Remember it
O(1) get + ordering → hash map + linked list (or Map order). O(1) extra query → store it alongside each element.

#### Common mistakes
- Not refreshing recency on ¦get¦.
- Forgetting to update an existing key in ¦put¦.
- Ignoring thread-safety and distributed use of a rate limiter.

#### Interview angle
"Implement LRU in O(1)." Hash map + doubly linked list with head/tail sentinels. Follow-up: "Distributed rate limiter?" Redis with atomic counters or Lua scripts.

### Serialize and deserialize trees and graphs
#### In one line
Serialising turns a structure into a string or bytes that can be stored or sent and rebuilt later.

#### Real-life analogy
Packing furniture for a move with a numbered inventory so the new house can be set up exactly the same way.

#### How it works
- Trees: **preorder with null markers** (¦1,2,#,#,3,#,#¦) rebuilds uniquely.
- Level order with nulls (the LeetCode style) also works.
- Graphs: store nodes plus an edge list, or an adjacency list as JSON; handle cycles with IDs rather than nested objects.
- ¦JSON.stringify¦ fails on cycles (throws), so use IDs.
- Time O(n), space O(n).

#### Example
¦¦¦js
class T { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
function serialize(root) {
  const out = []; (function go(n) { if (!n) return out.push('#'); out.push(n.val); go(n.left); go(n.right); })(root);
  return out.join(',');
}
function deserialize(s) {
  const parts = s.split(','); let i = 0;
  return (function build() { const x = parts[i++]; if (x === '#') return null; const n = new T(+x); n.left = build(); n.right = build(); return n; })();
}
const root = new T(1, new T(2), new T(3, new T(4), new T(5)));
const s = serialize(root);
console.log(s); // 1,2,#,#,3,4,#,#,5,#,#
console.log(serialize(deserialize(s)) === s); // true
¦¦¦

#### Remember it
Always include null markers; preorder + markers is enough to be unique. Graphs: IDs, not nested objects.

#### Common mistakes
- Omitting null markers (ambiguous).
- Values containing the delimiter.
- Recursion depth on a skewed tree.

#### Interview angle
"Serialize a binary tree." Preorder with markers. Follow-up: "Large tree?" Stream it in chunks or use an iterative queue.

### JavaScript utility coding: deep clone, flatten, debounce, throttle, memoize, promise pool
#### In one line
Front-end and full-stack rounds often ask you to implement small JavaScript utilities from scratch.

#### Real-life analogy
A debounce is an elevator door that keeps waiting while people keep stepping in; a throttle is a turnstile that lets one person pass per second.

#### How it works
- **Deep clone**: handle primitives, arrays, objects, Dates, and cycles with a WeakMap (or use ¦structuredClone¦).
- **Flatten**: recursion or an explicit stack, depth parameter.
- **Debounce**: reset a timer on each call. **Throttle**: allow at most one call per interval.
- **Memoize**: cache by serialised arguments.
- **Promise pool**: run at most N tasks at a time.

#### Example
¦¦¦js
const flatten = (a, d = Infinity) => d < 1 ? a.slice() : a.reduce((r, x) => r.concat(Array.isArray(x) ? flatten(x, d - 1) : x), []);
console.log(flatten([1, [2, [3, [4]]]])); // [ 1, 2, 3, 4 ]
function deepClone(x, seen = new WeakMap()) {
  if (x === null || typeof x !== 'object') return x;
  if (seen.has(x)) return seen.get(x);
  if (x instanceof Date) return new Date(x);
  const out = Array.isArray(x) ? [] : {}; seen.set(x, out);
  for (const k of Object.keys(x)) out[k] = deepClone(x[k], seen);
  return out;
}
const o = { a: [1, { b: 2 }] }; o.self = o; const c = deepClone(o);
console.log(c !== o, c.self === c, c.a[1].b); // true true 2
function memoize(fn) { const cache = new Map(); return (...a) => { const k = JSON.stringify(a); if (!cache.has(k)) cache.set(k, fn(...a)); return cache.get(k); }; }
const slow = memoize(n => n * n); console.log(slow(4), slow(4)); // 16 16
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
async function pool(tasks, limit) {
  const res = []; let i = 0;
  const worker = async () => { while (i < tasks.length) { const idx = i++; res[idx] = await tasks[idx](); } };
  await Promise.all(Array.from({ length: limit }, worker)); return res;
}
pool([1, 2, 3, 4].map(n => () => new Promise(r => setTimeout(() => r(n * 10), 5))), 2).then(r => console.log(r)); // [ 10, 20, 30, 40 ]
¦¦¦

#### Remember it
Debounce = wait until quiet. Throttle = at most once per interval. Always mention cycles for deep clone and error handling for the pool.

#### Common mistakes
- ¦JSON.parse(JSON.stringify(x))¦ for functions, Dates, undefined or cycles.
- Losing ¦this¦ in debounce.
- Starting all promises at once in a "pool".

#### Interview angle
"Implement debounce." Closure plus timer, mention leading/trailing options. Follow-up: "Difference from throttle?" Debounce delays until activity stops; throttle caps the rate.

### Typed arrays, bitsets and memory-aware structures
#### In one line
Typed arrays store fixed-size numbers in contiguous memory, cutting memory and speeding up large numeric work.

#### Real-life analogy
A pill organiser with equal compartments is far more compact than a drawer of loose bottles.

#### How it works
- Types: ¦Uint8Array, Int32Array, Float64Array¦ and more; fixed length, one number type.
- A normal array of 1 million numbers can use several times more memory than ¦Int32Array(1e6)¦ (4 MB).
- **Bitset**: pack booleans, 32 per integer; set ¦a[i >> 5] |= 1 << (i & 31)¦.
- **Sieve of Eratosthenes** is a classic use with ¦Uint8Array¦.
- Typed arrays are also used for binary data, WebGL and file buffers.

#### Example
¦¦¦js
function sieve(n) {
  const isP = new Uint8Array(n + 1).fill(1); isP[0] = isP[1] = 0;
  for (let i = 2; i * i <= n; i++) if (isP[i]) for (let j = i * i; j <= n; j += i) isP[j] = 0;
  const out = []; for (let i = 2; i <= n; i++) if (isP[i]) out.push(i); return out;
}
console.log(sieve(30).join()); // 2,3,5,7,11,13,17,19,23,29
class Bitset {
  constructor(n) { this.w = new Uint32Array((n + 31) >> 5); }
  set(i) { this.w[i >> 5] |= 1 << (i & 31); }
  has(i) { return (this.w[i >> 5] & (1 << (i & 31))) !== 0; }
}
const b = new Bitset(100); b.set(3); b.set(64);
console.log(b.has(3), b.has(4), b.has(64)); // true false true
¦¦¦
Sieve: time O(n log log n), space O(n) bytes.

#### Remember it
Cue: millions of numbers, flags, binary data. Say "contiguous, fixed-width, cache friendly".

#### Common mistakes
- Expecting typed arrays to grow like normal arrays.
- Overflow wrap-around (¦Uint8Array¦ stores 256 as 0).
- Using them for tiny data where it adds nothing.

#### Interview angle
"Memory for 10 million boolean flags?" ¦Uint8Array¦ ≈ 10 MB, a bitset ≈ 1.25 MB. Follow-up: "Trade-off?" More bit-twiddling code for smaller memory.

### Complexity of real code: N+1 queries, nested loops over API data, pagination
#### In one line
Big-O applies to real systems: loops that call a database or API per item, or nested scans over API data, are the usual performance bugs.

#### Real-life analogy
Going to the shop once per item on your list instead of once with the whole list.

#### How it works
- **N+1 queries**: one query for the list, then one per row. Fix with a join, ¦WHERE id IN (...)¦, eager loading in Sequelize, or batching.
- **Nested loops over API data**: matching two arrays is O(n × m); build a Map by ID first for O(n + m).
- **Pagination**: ¦OFFSET¦ gets slower as the offset grows (the database still scans skipped rows); **keyset pagination** (¦WHERE id > last ORDER BY id LIMIT 20¦) stays fast.
- Always count network and I/O calls as the expensive operations.

#### Example
¦¦¦js
const users = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: 'U' + (i + 1) }));
const enrolments = [{ uid: 2, course: 'JS' }, { uid: 4, course: 'React' }, { uid: 2, course: 'Node' }];
let slowSteps = 0;
users.forEach(u => enrolments.forEach(e => { slowSteps++; }));      // O(n * m)
const byUser = new Map();
for (const e of enrolments) (byUser.get(e.uid) || byUser.set(e.uid, []).get(e.uid)).push(e.course);
const joined = users.map(u => ({ ...u, courses: byUser.get(u.id) || [] }));   // O(n + m)
console.log(slowSteps, joined[1].courses); // 15 [ 'JS', 'Node' ]
¦¦¦
Slow: O(n × m). Map join: O(n + m).

#### Remember it
"Query in a loop = smell." "Nested loop over two lists = Map." Connect to your resume: the 30-40% faster pages/APIs came from removing these.

#### Common mistakes
- Awaiting a query inside ¦forEach¦ or ¦for¦ per row.
- Using ¦OFFSET¦ for deep pages.
- Optimising code before measuring.

#### Interview angle
"How did you get 30-40% faster APIs?" Describe profiling, removing N+1 with eager loading or batched queries, adding an index, and keyset pagination, with before/after numbers. Follow-up: "How did you find the N+1?" Query logs or APM traces.

### Mock-interview routine: timed problems, talking while coding
#### In one line
Practise under interview conditions so the method becomes automatic and you stay calm and clear.

#### Real-life analogy
Athletes train in match conditions; a full dress rehearsal removes surprises on the day.

#### How it works
- **45-minute split**: 5 minutes clarify, 10 plan (brute force then better idea), 20 code, 10 test and complexity.
- Talk in short sentences: what you are doing and why.
- Practise 1 easy, 1 medium, then 1 stretch problem per session; review mistakes in a log.
- Rotate patterns: arrays/hash, two pointers/sliding window, trees, graphs, DP, design.
- Do some sessions with a friend or record yourself.

#### Example
¦¦¦js
// A tiny practice-log helper to track patterns and weak spots
const log = [
  { problem: 'Two Sum', pattern: 'hash map', minutes: 12, solved: true },
  { problem: 'Course Schedule', pattern: 'topological sort', minutes: 38, solved: false },
  { problem: 'LRU Cache', pattern: 'design', minutes: 34, solved: true },
];
const weak = [...new Set(log.filter(x => !x.solved || x.minutes > 30).map(x => x.pattern))];
console.log(weak); // [ 'topological sort', 'design' ]
¦¦¦

#### Remember it
Weekly target: 5 problems, 2 patterns revisited, 1 full mock. When stuck: restate the problem, try a tiny example, write the brute force.

#### Common mistakes
- Grinding hundreds of problems without reviewing mistakes.
- Reading solutions too early.
- Never practising out loud.

#### Interview angle
If you freeze, say: "Let me try a small example," then work through it. Interviewers want to see your reasoning and recovery, not a perfect first try.

`;

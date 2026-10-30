window.PREP_NOTES = window.PREP_NOTES || {};
window.PREP_NOTES.htmlcss = String.raw`
## Phase 1 · HTML foundations and CSS basics (Basic)
### Document structure
#### In one line
Every HTML page is a tree that starts with a doctype, a head for metadata and a body for visible content.
#### Real-life analogy
A page is like a book: the cover and publishing details (head) tell the library how to file it, and the chapters (body) are what the reader sees.
#### How it works
- ¦<!DOCTYPE html>¦ tells the browser to use **standards mode**. Without it you get quirks mode and strange box sizing.
- ¦<html lang="en">¦ is the root. The ¦lang¦ attribute drives screen-reader pronunciation and translation.
- ¦<head>¦ holds things that are not shown: ¦charset¦, ¦viewport¦, ¦title¦, CSS links, icons, Open Graph tags.
- ¦<body>¦ holds all visible content.
- The ¦viewport¦ meta tells phones to use the real device width. Without it, your responsive CSS does nothing on mobile because the browser pretends the screen is about 980px wide.
#### Example
¦¦¦html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Clinical Learning Hub</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Welcome</h1>
  <script src="app.js" defer></script>
</body>
</html>
¦¦¦
The browser reads top to bottom, builds the DOM, and shows the heading. The ¦defer¦ script runs after parsing, so it never blocks the first paint.
#### Remember it
Think **D-L-C-V-T**: Doctype, Lang, Charset, Viewport, Title.
| Line | Prevents |
|---|---|
| doctype | quirks mode |
| lang | wrong screen reader voice |
| charset | garbled characters |
| viewport | tiny desktop-sized page on phones |
| title | blank tab and poor SEO |
#### Common mistakes
- Forgetting the viewport meta, then wondering why media queries do not fire on phones.
- Putting ¦charset¦ too late in the head (it must be within the first 1024 bytes).
- Using multiple ¦<body>¦ or ¦<main>¦ elements.
#### Interview angle
**Say it:** "A valid page needs a doctype for standards mode, a language, charset and viewport meta, and a title. The viewport meta is what makes responsive CSS work on phones." **Follow-up:** *What is quirks mode?* An old compatibility mode that emulates legacy browser behaviour; the doctype avoids it.

### Semantic HTML
#### In one line
Choose elements for what the content **means**, not for how it looks.
#### Real-life analogy
Road signs have shapes and colours that mean something (stop, yield). A blank grey board with painted text works for people but not for the systems that read signs automatically. Semantic tags are the road signs of a page.
#### How it works
Semantic elements add meaning to the accessibility tree and to search engines: ¦header¦, ¦nav¦, ¦main¦, ¦section¦, ¦article¦, ¦aside¦, ¦footer¦, ¦figure¦, ¦time¦, ¦button¦. Screen reader users can jump between **landmarks** (nav, main) and **headings**. Native elements also bring free behaviour: a ¦<button>¦ is focusable and works with Enter and Space; a ¦<div>¦ does neither.
Rules of thumb:
- One ¦<main>¦ per page; one ¦<h1>¦ (generally); do not skip heading levels.
- ¦<section>¦ needs a heading; ¦<article>¦ is self-contained content (a post, a card).
- ¦<div>¦ and ¦<span>¦ are for styling hooks only when nothing semantic fits.
#### Example
¦¦¦html
<header>
  <nav aria-label="Primary"><a href="/">Home</a> <a href="/courses">Courses</a></nav>
</header>
<main>
  <article>
    <h1>Hand hygiene basics</h1>
    <p>Published <time datetime="2026-10-01">1 Oct 2026</time></p>
    <section><h2>Steps</h2><ol><li>Wet</li><li>Soap</li><li>Rinse</li></ol></section>
  </article>
  <aside>Related courses</aside>
</main>
<footer><small>© 2026</small></footer>
¦¦¦
A screen reader announces: banner, navigation, main, article, heading level 1, and so on, so users can skip straight to the content.
#### Remember it
**"Landmarks + headings + native controls."**
| Instead of | Use |
|---|---|
| div class="nav" | nav |
| div onclick | button |
| div class="title" | h1 to h6 |
| b / i for emphasis | strong / em |
#### Common mistakes
- "Div soup" with classes doing the job of tags.
- Choosing heading levels for font size instead of structure (style with CSS instead).
- Using ¦<section>¦ as a generic wrapper with no heading.
#### Interview angle
**Say it:** "Semantic HTML improves accessibility, SEO and maintainability, and gives behaviour like focus and keyboard support for free." **Follow-up:** *Why not just add ARIA to divs?* Because ARIA only changes the accessibility tree; you would need to rebuild focus and keyboard behaviour yourself.

### Text, links, images and lists
#### In one line
The core content tags: headings, paragraphs, links, images with alt text, and lists.
#### Real-life analogy
Headings are a book's chapter titles, links are cross-references ("see page 42"), alt text is a caption read aloud to someone who cannot see the picture.
#### How it works
- **Headings** ¦h1-h6¦ form an outline. Keep the order logical.
- **Links** ¦<a href>¦ navigate. Link text must make sense out of context ("View pricing", not "click here"). External links that open a new tab should use ¦rel="noopener"¦.
- **Images** need ¦alt¦. Meaningful image: describe its purpose. Decorative image: ¦alt=""¦ so screen readers skip it. Always add ¦width¦ and ¦height¦ to avoid layout shift.
- **Lists**: ¦ul¦ (unordered), ¦ol¦ (ordered), ¦dl¦ (term and definition pairs). Navigation menus are lists of links.
#### Example
¦¦¦html
<h2>Course catalogue</h2>
<ul>
  <li><a href="/courses/anatomy">Anatomy 101</a> <span>(8 lessons)</span></li>
  <li><a href="/courses/pharma">Pharmacology</a></li>
</ul>
<img src="nurse.jpg" width="640" height="360" alt="Nurse reviewing a medication chart">
<img src="divider.svg" alt="" width="200" height="8">
<dl><dt>CPD</dt><dd>Continuing professional development</dd></dl>
¦¦¦
The first image conveys information, so it has a description. The divider is decoration, so its alt is empty.
#### Remember it
- **Alt rule:** informative → describe; decorative → empty; functional (inside a link) → describe the action.
- **Link rule:** the text alone should make sense.
- **Heading rule:** do not skip levels.
#### Common mistakes
- Missing ¦alt¦ (screen readers read the file name).
- "Click here" links.
- Using ¦<br>¦ to create spacing between list items instead of CSS.
#### Interview angle
**Say it:** "I write alt text by purpose, keep heading order logical, and use descriptive link text." **Follow-up:** *What if the image is a link?* The alt should describe the destination or action, such as "Open course catalogue".

### Tables and forms
#### In one line
Tables show data in rows and columns; forms collect input, and every control needs a label.
#### Real-life analogy
A table is a spreadsheet printed on paper; a form is a paper form where each box has a printed caption telling you what to write.
#### How it works
**Tables** are for tabular data, never layout. Use ¦<caption>¦, ¦<thead>¦, ¦<tbody>¦, and ¦<th scope="col|row">¦ so screen readers announce headers with each cell.
**Forms** use ¦<form action method>¦. Each ¦<input>¦, ¦<select>¦, ¦<textarea>¦ gets a ¦<label for>¦ matching its ¦id¦ (or wraps it). ¦name¦ is what is sent to the server. A ¦<button type="submit">¦ submits; ¦type="button"¦ does not. Group radios in ¦<fieldset><legend>¦.
#### Example
¦¦¦html
<table>
  <caption>Quiz results</caption>
  <thead><tr><th scope="col">Learner</th><th scope="col">Score</th></tr></thead>
  <tbody><tr><th scope="row">Asha</th><td>92%</td></tr></tbody>
</table>

<form action="/enrol" method="post">
  <label for="name">Full name</label>
  <input id="name" name="name" required>
  <fieldset><legend>Format</legend>
    <label><input type="radio" name="fmt" value="online" checked> Online</label>
    <label><input type="radio" name="fmt" value="onsite"> On-site</label>
  </fieldset>
  <button type="submit">Enrol</button>
</form>
¦¦¦
Clicking the label focuses the input, giving a bigger target and a spoken name.
#### Remember it
**Label everything, scope your headers.**
| Need | Use |
|---|---|
| Grouped choices | fieldset + legend |
| Table title | caption |
| Header cell | th scope |
#### Common mistakes
- Placeholder instead of a label (it disappears and is not reliably read).
- Layout tables.
- A ¦<button>¦ inside a form that unintentionally submits (default type is submit).
#### Interview angle
**Say it:** "Tables are for data with header scopes and captions; every form control has a programmatically associated label." **Follow-up:** *How do you make a wide table responsive?* Wrap it in a scrollable region with a label, or reflow rows into cards on small screens.

### Input types and form validation
#### In one line
Using the right ¦type¦ and built-in validation gives better keyboards, free checks and fewer lines of JavaScript.
#### Real-life analogy
A good form is like a bank cashier window with a clear sign for each document: the right slot (type) rejects the wrong paper (validation) before it reaches the clerk.
#### How it works
Types: ¦email¦, ¦tel¦, ¦url¦, ¦number¦, ¦date¦, ¦password¦, ¦search¦, ¦checkbox¦, ¦radio¦, ¦file¦, ¦range¦. Mobile browsers show matching keyboards. Attributes: ¦required¦, ¦min¦, ¦max¦, ¦minlength¦, ¦maxlength¦, ¦pattern¦, ¦step¦, ¦autocomplete¦. The **Constraint Validation API** lets you read ¦input.validity¦, call ¦setCustomValidity()¦ and ¦form.reportValidity()¦. CSS can react with ¦:valid¦, ¦:invalid¦ and the friendlier ¦:user-invalid¦ (only after interaction). Always **re-validate on the server**; client checks are for UX only.
#### Example
¦¦¦html
<form id="f">
  <label for="e">Email</label>
  <input id="e" type="email" required autocomplete="email">
  <label for="a">Age</label>
  <input id="a" type="number" min="18" max="99">
  <button>Save</button>
</form>
<style>input:user-invalid { border-color: #dc2626; }</style>
<script>
  const e = document.getElementById('e');
  e.addEventListener('input', () => e.setCustomValidity(e.value.endsWith('@test.com') ? 'Use a real address' : ''));
</script>
¦¦¦
The browser blocks submit and shows its own message; the custom rule overrides it with ours.
#### Remember it
**Type → keyboard, attributes → rules, server → truth.**
| Attribute | Effect |
|---|---|
| required | cannot be empty |
| pattern | regex match |
| min/max | number or date range |
| autocomplete | autofill help |
#### Common mistakes
- Relying on client validation only.
- Using ¦type="number"¦ for IDs or phone numbers (use text with ¦inputmode¦).
- Removing the native error UI without providing accessible replacements.
#### Interview angle
**Say it:** "I start with native types and attributes, enhance with the Constraint Validation API for custom rules, and always validate on the server too." **Follow-up:** *Difference between :invalid and :user-invalid?* The latter waits until the user has interacted.

### CSS selectors
#### In one line
Selectors are patterns that pick which elements a rule applies to.
#### Real-life analogy
Addressing a letter: "everyone" (element), "everyone in the Smith family" (class), "unit 4B only" (id), "the person sitting next to Bob" (sibling combinator).
#### How it works
- **Basic**: ¦p¦, ¦.card¦, ¦#main¦, ¦*¦.
- **Attribute**: ¦[type="email"]¦, ¦[href^="https"]¦, ¦[data-state~="open"]¦.
- **Combinators**: descendant ¦a b¦, child ¦a > b¦, adjacent sibling ¦a + b¦, general sibling ¦a ~ b¦.
- **Pseudo-classes**: ¦:hover¦, ¦:focus-visible¦, ¦:first-child¦, ¦:nth-child(2n)¦, ¦:not()¦.
- **Pseudo-elements**: ¦::before¦, ¦::after¦, ¦::marker¦.
Browsers match selectors **right to left**, so keep them short and flat; deep chains are fragile.
#### Example
¦¦¦css
.card > h2 { margin: 0; }                 /* direct child only */
.card + .card { margin-top: 16px; }       /* a card right after a card */
a[href^="https"]::after { content: " ↗"; }
li:nth-child(odd) { background: #f1f5f9; }
input:not([type="checkbox"]) { padding: 8px; }
¦¦¦
Each rule targets exactly the elements described; no extra classes in HTML are needed.
#### Remember it
**Space = anywhere inside; > = direct child; + = next sibling; ~ = any later sibling.**
#### Common mistakes
- Over-qualifying (¦div.card ul li a¦) which hurts reuse.
- Confusing ¦.a.b¦ (both classes on one element) with ¦.a .b¦ (b inside a).
- Using ids for styling.
#### Interview angle
**Say it:** "I prefer single-class selectors for reuse and low specificity, and use combinators and pseudo-classes for state and structure." **Follow-up:** *Descendant vs child selector?* Descendant matches at any depth; child only the immediate level.

### Specificity, cascade and inheritance
#### In one line
When rules conflict, the **cascade** decides by origin, importance, specificity and source order; some properties then flow down by **inheritance**.
#### Real-life analogy
A company policy: a manager's note on the document itself (inline) beats a department memo (class), which beats a general company notice (element); if two memos tie, the **latest** wins.
#### How it works
Specificity score (inline, ids, classes/attributes/pseudo-classes, elements): ¦p¦ = 0-0-0-1, ¦.card p¦ = 0-0-1-1, ¦#nav a¦ = 0-1-0-1. Compare left to right. Ties: later rule wins. ¦!important¦ beats normal declarations. ¦@layer¦ order sits above specificity. **Inheritance**: text-related properties (¦color¦, ¦font¦, ¦line-height¦) inherit by default; box properties (¦margin¦, ¦border¦, ¦background¦) do not. Force with ¦inherit¦, ¦initial¦, ¦unset¦, ¦revert¦.
#### Example
¦¦¦html
<p class="note" id="x">Hello</p>
<style>
  p { color: red; }          /* 0-0-0-1 */
  .note { color: green; }    /* 0-0-1-0 */
  #x { color: blue; }        /* 0-1-0-0  ← wins */
  body { color: purple; }    /* inherited only if p sets nothing */
</style>
¦¦¦
The text is blue. If you delete the ¦#x¦ rule, green wins. If you delete both, red wins over the inherited purple because a direct rule beats inheritance.
#### Remember it
**Inline > ID > Class > Element, then source order.** Keep specificity low and flat; avoid ¦!important¦.
#### Common mistakes
- Fighting specificity with ¦!important¦.
- Forgetting that inheritance never beats a rule that targets the element directly.
- Thinking ¦*¦ or combinators add specificity (they add none).
#### Interview angle
**Say it:** "I keep specificity flat with single classes and use layers for ordering. When debugging I use DevTools' Styles pane to see which rule is crossed out and why." **Follow-up:** *What is the specificity of :where()?* Zero, which is why it is used in resets.

### Box model
#### In one line
Every element is a rectangular box made of content, padding, border and margin.
#### Real-life analogy
A framed picture: the picture is the content, the mat is padding, the frame is the border, and the space on the wall between frames is the margin.
#### How it works
With ¦box-sizing: content-box¦ (default), ¦width¦ applies to the content only, so padding and border make the box bigger. With ¦border-box¦, ¦width¦ includes padding and border, which is predictable. **Margin collapsing**: vertical margins of adjacent block siblings (and parent/first child in some cases) merge into the larger one; flex and grid items do not collapse. ¦outline¦ is drawn outside and takes no space. Logical shorthand: ¦margin-inline¦, ¦padding-block¦.
#### Example
¦¦¦css
*, *::before, *::after { box-sizing: border-box; }
.card { width: 300px; padding: 20px; border: 2px solid #94a3b8; margin-block: 16px; }
¦¦¦
The card is exactly 300px wide, including 20px padding each side and 2px borders. With ¦content-box¦ it would be 344px.
#### Remember it
**Margin → Border → Padding → Content (outside in).** Always reset to ¦border-box¦.
#### Common mistakes
- Not setting ¦border-box¦ and getting horizontal scrollbars.
- Expecting vertical margins between siblings to add (they collapse).
- Using margin for internal spacing that should be padding.
#### Interview angle
**Say it:** "Box model is content, padding, border, margin; I use border-box so widths include padding and border, and remember that vertical margins collapse." **Follow-up:** *When do margins not collapse?* In flex or grid containers, with padding/border between them, and for floats or absolutely positioned elements.

### Display types and normal flow
#### In one line
The ¦display¦ property decides how an element takes part in layout: block, inline, inline-block, flex, grid or not at all.
#### Real-life analogy
Block elements are paragraphs on a page (each starts on a new line); inline elements are words inside a sentence; flex/grid are tables set at a banquet where you choose how guests are arranged.
#### How it works
- **block**: full width, new line, honours width/height/margins.
- **inline**: flows with text; ignores width/height and vertical margins.
- **inline-block**: flows inline but behaves like a block inside.
- **flex / grid**: container sets layout for its children; ¦inline-flex¦ and ¦inline-grid¦ are inline versions.
- **none**: removed from layout and accessibility tree. ¦visibility:hidden¦ hides but keeps space.
- **contents**: element's box disappears, children stay.
**Normal flow**: elements are laid out in order unless positioned, floated or in flex/grid.
#### Example
¦¦¦html
<p>Text with <span class="tag">inline</span> and <span class="tag big">inline-block</span>.</p>
<style>
  .tag { background: #e0e7ff; padding: 4px 8px; width: 200px; height: 80px; } /* width/height ignored */
  .tag.big { display: inline-block; }                                          /* now honoured */
</style>
¦¦¦
The first tag stays text-sized; the second respects 200 x 80.
#### Remember it
**Block = stacks, inline = flows, inline-block = flows but has a box.**
#### Common mistakes
- Setting width/height on inline elements and wondering why nothing happens.
- Whitespace gaps between inline-blocks (use flex ¦gap¦ instead).
- Using ¦display:none¦ to hide content that should be visually hidden but screen-reader available.
#### Interview angle
**Say it:** "Block, inline and inline-block differ in line breaks and box sizing; for layout I use flex and grid." **Follow-up:** *display none vs visibility hidden vs opacity 0?* None removes it from layout; hidden keeps space but is not focusable or announced; opacity 0 is invisible but still interactive.

### Positioning
#### In one line
The ¦position¦ property lets an element leave or adjust its place in normal flow.
#### Real-life analogy
Sticky notes: relative = nudge a note from where it was stuck; absolute = place it exactly on a specific page corner; fixed = stick it to the window so it stays while you scroll; sticky = it follows you until you reach the edge of the section.
#### How it works
- **static**: default; ¦top/left¦ ignored.
- **relative**: offset from its normal place; still occupies original space; **becomes the anchor for absolute children**.
- **absolute**: out of flow; placed relative to the nearest positioned ancestor (or the page).
- **fixed**: relative to the viewport.
- **sticky**: relative until a scroll threshold, then fixed within its container; needs a ¦top/bottom¦ value and no clipping overflow on ancestors.
Use ¦inset: 0¦ as shorthand for top/right/bottom/left.
#### Example
¦¦¦html
<div class="card"><span class="badge">New</span>Course</div>
<style>
  .card { position: relative; padding: 24px; border: 1px solid #cbd5e1; }
  .badge { position: absolute; top: -8px; right: -8px; background: #4f46e5; color: #fff; padding: 2px 8px; border-radius: 99px; }
</style>
¦¦¦
The badge sits on the card's top-right corner because the card is ¦relative¦. Remove ¦position: relative¦ and the badge jumps to the page corner.
#### Remember it
**"Relative makes the anchor, absolute uses the anchor."**
| Value | Takes space? | Relative to |
|---|---|---|
| relative | yes | itself |
| absolute | no | positioned ancestor |
| fixed | no | viewport |
| sticky | yes | scroll container |
#### Common mistakes
- Forgetting ¦position: relative¦ on the parent.
- Sticky not working due to ancestor ¦overflow: hidden¦.
- Using absolute for page layout instead of flex or grid.
#### Interview angle
**Say it:** "Absolute positions against the nearest positioned ancestor, so I set relative on the container; sticky needs a threshold and no clipping ancestors." **Follow-up:** *What does fixed do inside a transformed parent?* It becomes relative to that parent, not the viewport.

### Stacking context and z-index
#### In one line
Elements are layered inside **stacking contexts**, and ¦z-index¦ only competes among siblings in the same context.
#### Real-life analogy
Folders inside a filing cabinet: page 9999 in folder A is still behind any page in folder B if folder B sits on top. The folder is the stacking context.
#### How it works
Order without z-index: backgrounds, then in-flow blocks, floats, inline content, then positioned elements in DOM order. A new stacking context is created by: the root element; ¦position¦ relative/absolute with a ¦z-index¦ other than auto; ¦position: fixed/sticky¦; ¦opacity < 1¦; ¦transform¦, ¦filter¦, ¦perspective¦; ¦isolation: isolate¦; ¦will-change¦ on some properties; and flex/grid children with a ¦z-index¦. Inside a context, children are ordered by ¦z-index¦; the whole context then takes part in its parent's stack as one unit.
#### Example
¦¦¦html
<div class="a">A<div class="child">child 9999</div></div>
<div class="b">B</div>
<style>
  .a { position: relative; z-index: 1; height: 80px; background: #c7d2fe; }
  .child { position: absolute; z-index: 9999; top: 40px; background: #fca5a5; }
  .b { position: relative; z-index: 2; margin-top: -40px; height: 80px; background: #bbf7d0; }
</style>
¦¦¦
Even with 9999, the child appears **under** B because its parent context (level 1) sits below B (level 2).
#### Remember it
**"z-index only fights within its own family."** Use tokens: ¦--z-dropdown: 100; --z-modal: 1000¦. Use ¦isolation: isolate¦ on components to contain their layers.
#### Common mistakes
- Raising z-index endlessly instead of finding the context.
- Accidentally creating contexts with ¦transform¦ or ¦opacity¦.
- Rendering modals deep in the tree (use a portal at the end of body).
#### Interview angle
**Say it:** "z-index is local to a stacking context; when it fails I inspect the ancestors for context creators and either restructure or portal the element." **Follow-up:** *Does ¦opacity: .99¦ create a context?* Yes, any value below 1.

### Units
#### In one line
CSS has absolute and relative units; modern CSS favours ¦rem¦, ¦%¦, viewport units and ¦clamp()¦ for flexible layouts.
#### Real-life analogy
Absolute units are a ruler; relative units are "twice as tall as your hand" which automatically scales if the person changes.
#### How it works
- **px**: fixed CSS pixel. Good for hairlines and shadows.
- **rem**: multiple of the root font size (usually 16px). Respects user preferences.
- **em**: multiple of the current element's font size (parent's for ¦font-size¦). Good for component-internal spacing.
- **%**: relative to the parent's value of that property.
- **vw/vh**: 1% of viewport width/height; **dvh/svh/lvh** handle mobile browser bars.
- **ch**: width of "0"; great for text measure (¦max-width: 65ch¦).
- **clamp(min, val, max)**, **min()**, **max()**: fluid values with limits.
#### Example
¦¦¦css
html { font-size: 100%; }                         /* respect user setting */
h1   { font-size: clamp(1.75rem, 1rem + 3vw, 3rem); }
.prose { max-width: 65ch; margin-inline: auto; padding-inline: 1rem; }
.hero  { min-height: 100dvh; }
.btn   { padding: .6em 1.1em; }                   /* scales with the button's font size */
¦¦¦
Heading size grows with the viewport between 28px and 48px; text lines stay readable at about 65 characters.
#### Remember it
**rem for type and layout, em inside components, px for borders, dvh for full height.**
| Need | Unit |
|---|---|
| Body text | rem |
| Hairline | px |
| Line length | ch |
| Mobile full screen | dvh |
#### Common mistakes
- Setting ¦html { font-size: 62.5% }¦ and breaking default scaling when others forget.
- Using ¦vh¦ for mobile full screens (address bar jump).
- Nesting ¦em¦ values that compound.
#### Interview angle
**Say it:** "I use rem for typography and spacing so user preferences scale everything, ch for readable line length, and clamp for fluid values." **Follow-up:** *em vs rem?* em depends on the nearest font-size, rem on the root.

### Colours and backgrounds
#### In one line
Colours can be written in several models (hex, rgb, hsl, modern oklch) and backgrounds can layer colours, images and gradients.
#### Real-life analogy
Hex is a paint code, hsl is a colour wheel with brightness slider: "same blue, but lighter" is just changing one number.
#### How it works
- **Formats**: ¦#4f46e5¦, ¦rgb(79 70 229 / 50%)¦, ¦hsl(243 75% 59%)¦, ¦oklch(...)¦, keywords, ¦currentColor¦, ¦transparent¦.
- **hsl** is friendly for themes: keep hue, change lightness for hover/dark variants.
- **Backgrounds**: ¦background-color¦, ¦background-image¦ (url or gradient), ¦background-size: cover | contain¦, ¦background-position¦, ¦background-repeat¦, multiple layers separated by commas (first layer on top).
- **Gradients**: ¦linear-gradient(to right, a, b)¦, ¦radial-gradient()¦, ¦conic-gradient()¦.
- ¦color-mix(in srgb, red 30%, white)¦ creates tints in CSS.
#### Example
¦¦¦css
:root { --brand-h: 243; }
.btn { background: hsl(var(--brand-h) 75% 59%); }
.btn:hover { background: hsl(var(--brand-h) 75% 52%); }
.hero {
  background:
    linear-gradient(rgba(15,23,42,.6), rgba(15,23,42,.6)),   /* dark overlay on top */
    url(hero.jpg) center / cover no-repeat;                  /* image below */
}
¦¦¦
The overlay keeps text readable over any photo.
#### Remember it
**"Cover fills (crops), contain fits (letterboxes)."** Always check text contrast over images.
#### Common mistakes
- Text on images with no overlay (poor contrast).
- Using ¦opacity¦ on a parent to make the background transparent (it fades the text too; use ¦rgba/hsl alpha¦).
- Hard-coding the same colour in many places instead of tokens.
#### Interview angle
**Say it:** "I use hsl or tokens so variants are one-number changes, and layered backgrounds with overlays for legibility." **Follow-up:** *opacity vs rgba?* opacity affects the whole element and children; rgba affects only that colour.

### Typography and web fonts
#### In one line
Good typography means readable sizes, line heights and line lengths, and loading fonts without layout shift.
#### Real-life analogy
Typography is road design for the eyes: lane width (line length), spacing (line height) and clear signs (contrast) keep readers moving without crashes.
#### How it works
- **Properties**: ¦font-family¦ (with fallbacks), ¦font-size¦, ¦font-weight¦, ¦line-height¦ (unitless, 1.5 for body), ¦letter-spacing¦, ¦text-align¦, ¦text-wrap: balance¦ for headings.
- **System font stack**: ¦system-ui, -apple-system, "Segoe UI", Roboto, sans-serif¦ is instant and free.
- **Web fonts**: ¦@font-face¦ with ¦woff2¦. ¦font-display: swap¦ shows fallback text immediately; ¦optional¦ avoids shifts entirely. Preload the key font. Use ¦size-adjust¦ and override descriptors on a fallback face to match metrics and avoid CLS.
- **Variable fonts** deliver many weights in one file.
- Keep line length near 45-75 characters.
#### Example
¦¦¦css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
body { font: 400 1rem/1.6 "Inter", system-ui, sans-serif; }
h1, h2 { text-wrap: balance; line-height: 1.2; }
¦¦¦
Text appears at once in the system font, swaps to Inter when loaded, and headings avoid orphans.
#### Remember it
**Size 16px+, line-height 1.5, 65ch, contrast 4.5:1, swap with matching fallback.**
#### Common mistakes
- Loading six font weights you never use.
- Unitless vs unit line-height confusion (¦line-height: 1.5px¦ is tiny).
- Blocking text rendering until the font arrives (FOIT).
#### Interview angle
**Say it:** "I use woff2 with font-display swap or optional, preload the critical font, tune fallback metrics to prevent layout shift, and keep body text 16px with 1.5 line height." **Follow-up:** *FOUT vs FOIT?* FOUT shows fallback then swaps; FOIT hides text until the font loads.

## Phase 2 · Layout, responsive and accessible (Intermediate)
### Flexbox
#### In one line
Flexbox lays out items in one dimension (a row or a column) and distributes space and alignment between them.
#### Real-life analogy
Books on a shelf: you decide the direction, how they are spaced, whether one stretches to fill the gap, and whether they align to top or bottom.
#### How it works
- Container: ¦display: flex¦, ¦flex-direction¦ (main axis), ¦flex-wrap¦, ¦gap¦.
- ¦justify-content¦ aligns on the **main** axis; ¦align-items¦ on the **cross** axis; ¦align-content¦ for multiple lines.
- Items: ¦flex: grow shrink basis¦; ¦flex: 1¦ = ¦1 1 0¦; ¦align-self¦; ¦order¦ (changes visual, not DOM order).
- Flex items have ¦min-width: auto¦, so long text or images may refuse to shrink; fix with ¦min-width: 0¦.
- ¦margin-left: auto¦ pushes an item to the far side.
#### Example
¦¦¦html
<nav class="bar"><a class="logo">Learn</a><a>Courses</a><a>About</a><button class="cta">Sign in</button></nav>
<style>
  .bar { display: flex; align-items: center; gap: 16px; padding: 12px 16px; }
  .logo { font-weight: 700; margin-right: auto; }   /* pushes the rest right */
</style>
¦¦¦
Logo on the left, links and button on the right, all vertically centred.
#### Remember it
**Main axis = justify, cross axis = align.** Row: main is horizontal; column: main is vertical.
| Goal | Code |
|---|---|
| Centre both | justify-content + align-items: center |
| Equal columns | flex: 1 |
| Space between | justify-content: space-between |
| Wrap cards | flex-wrap: wrap + gap |
#### Common mistakes
- Mixing up ¦justify¦ and ¦align¦ after changing direction.
- Forgetting ¦min-width: 0¦ for truncating text.
- Using flex for two-dimensional grids.
#### Interview angle
**Say it:** "Flexbox is one-dimensional: content drives sizes along one axis. I use it for navbars, toolbars and aligning inside components." **Follow-up:** *What does flex: 1 mean?* grow 1, shrink 1, basis 0.

### CSS Grid
#### In one line
Grid places items into rows and columns at the same time, so the layout drives the content.
#### Real-life analogy
A city map with streets: you draw the blocks first (tracks), then decide which building (item) occupies which blocks.
#### How it works
- Define tracks: ¦grid-template-columns: 240px 1fr¦, ¦repeat(3, 1fr)¦, ¦minmax(200px, 1fr)¦.
- ¦fr¦ divides remaining space. ¦gap¦ sets gutters.
- **Responsive without queries**: ¦repeat(auto-fit, minmax(240px, 1fr))¦. auto-fit collapses empty tracks, auto-fill keeps them.
- **Areas**: name regions with ¦grid-template-areas¦.
- Placement: ¦grid-column: 1 / -1¦ spans; ¦span 2¦.
- Alignment: ¦place-items¦, ¦justify-items¦, ¦align-content¦.
- **Subgrid** lets children align to the parent's tracks.
#### Example
¦¦¦html
<div class="page">
  <header>Header</header><aside>Side</aside><main>Main</main><footer>Footer</footer>
</div>
<style>
  .page { display: grid; min-height: 100dvh; gap: 12px;
    grid-template: "h h" auto "s m" 1fr "f f" auto / 220px 1fr; }
  header { grid-area: h; } aside { grid-area: s; } main { grid-area: m; } footer { grid-area: f; }
</style>
¦¦¦
Classic layout in a handful of lines; footer sticks to the bottom because the middle row is ¦1fr¦.
#### Remember it
**Grid = layout first; Flex = content first.** Auto-fit + minmax = free responsiveness.
#### Common mistakes
- ¦1fr¦ columns overflowing because of long content (use ¦minmax(0, 1fr)¦).
- Using margins for gutters instead of ¦gap¦.
- Reordering visually with areas so keyboard order no longer matches.
#### Interview angle
**Say it:** "I use grid for two-dimensional page and card layouts and flex inside items; auto-fit with minmax gives a responsive grid without media queries." **Follow-up:** *auto-fit vs auto-fill?* auto-fit collapses empty tracks so items stretch.

### Responsive design and media queries
#### In one line
Responsive design makes one codebase adapt to any screen using flexible layouts, fluid media and media queries.
#### Real-life analogy
Water takes the shape of its container; a responsive page does the same for phones, tablets and desktops.
#### How it works
- **Viewport meta** is required.
- **Mobile-first**: base styles for small screens, then ¦@media (min-width: 768px)¦ to enhance.
- Pick breakpoints where **content** breaks, not for specific devices.
- Prefer **intrinsic** tools first: ¦flex-wrap¦, ¦grid auto-fit¦, ¦clamp()¦, ¦max-width: 100%¦, ¦aspect-ratio¦.
- Media features also detect preferences: ¦prefers-color-scheme¦, ¦prefers-reduced-motion¦, ¦hover: hover¦, ¦pointer: coarse¦, ¦print¦.
- Images: ¦max-width: 100%; height: auto¦.
#### Example
¦¦¦css
.layout { display: grid; gap: 16px; }                              /* 1 column on mobile */
@media (min-width: 768px)  { .layout { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1100px) { .layout { grid-template-columns: 2fr 1fr; } }
@media (hover: hover) { .card:hover { transform: translateY(-2px); } } /* no hover effect on touch */
img { max-width: 100%; height: auto; }
¦¦¦
Two breakpoints only; hover effects are limited to devices that can hover.
#### Remember it
**Viewport + fluid + mobile-first + content breakpoints.** Test at real widths and zoom 200%.
#### Common mistakes
- Desktop-first with many ¦max-width¦ overrides.
- Fixed pixel widths on containers.
- Hover-only interactions that touch users cannot reach.
#### Interview angle
**Say it:** "I go mobile-first with min-width queries, rely on intrinsic layout for most behaviour, and add breakpoints only where the design breaks." **Follow-up:** *Which breakpoints do you pick?* Whatever the content needs; typical values around 640, 768, 1024 and 1280 are only starting points.

### Container queries and fluid layouts
#### In one line
Container queries let a component respond to the width of its **container**, not the viewport.
#### Real-life analogy
A photo in a frame adjusts how it is cropped depending on the frame size, not the size of the room.
#### How it works
Mark a wrapper: ¦container-type: inline-size¦ (optionally ¦container-name¦). Inside, use ¦@container (min-width: 480px) { ... }¦. Units ¦cqi¦ and ¦cqw¦ are relative to the container. The element that queries must be a **descendant** of the container (an element cannot query itself). Combine with fluid techniques (¦clamp¦, grid auto-fit) so components work in any slot: sidebar, modal, main column. Supported in all modern browsers.
#### Example
¦¦¦html
<div class="slot"><article class="card"><img src="c.jpg" alt="" width="120" height="90"><div><h3>Anatomy</h3><p>Intro course</p></div></article></div>
<style>
  .slot { container-type: inline-size; }
  .card { display: grid; gap: 8px; }
  @container (min-width: 420px) { .card { grid-template-columns: 120px 1fr; align-items: center; } }
  .card h3 { font-size: clamp(1rem, 4cqi, 1.5rem); }
</style>
¦¦¦
The same card stacks in a narrow sidebar and goes horizontal in the main column.
#### Remember it
**Media query = page, container query = component.** Reusable components should use container queries.
#### Common mistakes
- Forgetting ¦container-type¦ so the query never matches.
- Querying the container from itself.
- Using container-type ¦size¦ (needs fixed height) when ¦inline-size¦ is enough.
#### Interview angle
**Say it:** "For library components I use container queries so layout depends on available space, and media queries for page-level layout and user preferences." **Follow-up:** *Any downside?* The container needs containment, so it cannot size itself from its children's inline size.

### Pseudo-classes and pseudo-elements
#### In one line
Pseudo-classes select elements in a **state** (hover, focus, nth-child); pseudo-elements style a **part** of an element (::before, ::first-line).
#### Real-life analogy
Pseudo-class: "the door when it is open". Pseudo-element: "the doormat in front of the door", a virtual part you can style but is not in the HTML.
#### How it works
- **State**: ¦:hover¦, ¦:focus¦, ¦:focus-visible¦ (keyboard focus), ¦:focus-within¦, ¦:active¦, ¦:disabled¦, ¦:checked¦, ¦:user-invalid¦.
- **Structure**: ¦:first-child¦, ¦:last-child¦, ¦:nth-child(2n+1)¦, ¦:nth-of-type¦, ¦:not()¦, ¦:is()¦, ¦:where()¦, ¦:has()¦.
- **Pseudo-elements** (double colon): ¦::before¦, ¦::after¦ (need ¦content¦), ¦::placeholder¦, ¦::selection¦, ¦::marker¦, ¦::backdrop¦, ¦::first-letter¦.
- Generated content from ¦content: ""¦ is decorative and is mostly ignored by assistive tech; do not put essential text there.
#### Example
¦¦¦css
a:focus-visible { outline: 3px solid #4f46e5; outline-offset: 2px; }
.field:focus-within { box-shadow: 0 0 0 3px rgba(79,70,229,.25); }
.required::after { content: " *"; color: #dc2626; }
li:not(:last-child)::after { content: "·"; margin-inline: .5em; }
.card:has(img) { grid-template-columns: 120px 1fr; }
¦¦¦
Keyboard users see a clear focus ring; the whole field highlights when any child is focused.
#### Remember it
**One colon = state, two colons = part.** ¦:focus-visible¦ for keyboard rings.
#### Common mistakes
- Removing outlines with no replacement.
- Putting meaningful text in ¦::before¦.
- Forgetting ¦content¦ so ¦::before¦ renders nothing.
#### Interview angle
**Say it:** "Pseudo-classes target state or position, pseudo-elements create styleable parts; I use focus-visible for focus rings and has() instead of JavaScript toggles." **Follow-up:** *focus vs focus-visible?* focus-visible shows only when the browser decides a visible indicator is helpful, such as keyboard navigation.

### CSS custom properties
#### In one line
Custom properties (¦--name¦) are runtime variables that cascade, inherit and can be changed per element or with JavaScript.
#### Real-life analogy
A thermostat setting for a building: change it on a floor and all rooms on that floor follow, without rewriting each room's rules.
#### How it works
Declare ¦--brand: #4f46e5;¦ (usually on ¦:root¦), use ¦var(--brand, fallback)¦. They **inherit**, so override on any element and descendants update. They are different from preprocessor variables, which vanish at build time. Use in ¦calc()¦, ¦clamp()¦, ¦color-mix()¦. JS: ¦el.style.setProperty('--x','10px')¦ and ¦getComputedStyle(el).getPropertyValue('--x')¦. ¦@property¦ can register typed variables so they animate. Great for theming, component API (¦--btn-bg¦), and responsive tokens.
#### Example
¦¦¦css
:root { --space: 1rem; --brand: #4f46e5; --radius: 12px; }
.card { padding: var(--space); border-radius: var(--radius); border: 1px solid var(--brand); }
.card.compact { --space: .5rem; }                 /* override locally */
@media (min-width: 900px) { :root { --space: 1.5rem; } }
.btn { background: var(--btn-bg, var(--brand)); }  /* consumer can set --btn-bg */
¦¦¦
Changing one variable updates every dependent rule, including inside media queries.
#### Remember it
**Declare once, scope anywhere, fallback always.** Name by role (¦--color-surface¦), not by value (¦--blue¦) at the semantic level.
#### Common mistakes
- Undefined variable with no fallback (property becomes invalid at computed time).
- Using them in media query conditions (not allowed).
- Overusing them for values that never change.
#### Interview angle
**Say it:** "Custom properties are live, cascading values; I use them for design tokens, themes and as the customisation API of components." **Follow-up:** *Difference from SASS variables?* SASS variables compile away; custom properties exist at runtime and can change.

### Transitions and transforms
#### In one line
Transitions smoothly change a property over time when its value changes; transforms move, scale, rotate or skew an element without affecting layout.
#### Real-life analogy
A transition is a dimmer switch instead of an on/off switch; a transform is sliding a sticker across a window without moving the window frame.
#### How it works
- **transition**: ¦transition: property duration timing-function delay¦. It runs when the property value changes (hover, class toggle, state).
- **timing**: ¦ease¦, ¦ease-out¦ (entrances), ¦ease-in¦ (exits), ¦linear¦, ¦cubic-bezier()¦. Keep UI motion 150-300ms.
- **transform**: ¦translate()¦, ¦scale()¦, ¦rotate()¦, ¦skew()¦; individual properties ¦translate¦, ¦scale¦, ¦rotate¦ also exist. ¦transform-origin¦ sets the pivot.
- Transforms do **not** change layout space and run on the compositor, so they are smooth. Animating ¦width/height/top/left¦ triggers layout and can jank.
- ¦display¦ cannot be transitioned normally (use ¦opacity¦ + ¦visibility¦ or ¦@starting-style¦).
#### Example
¦¦¦css
.card { transition: transform .2s ease-out, box-shadow .2s ease-out; }
.card:hover, .card:focus-within { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,.15); }
.menu { opacity: 0; visibility: hidden; transform: translateY(-8px); transition: opacity .2s, transform .2s, visibility 0s .2s; }
.menu.open { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
¦¦¦
The card lifts on hover and keyboard focus; the menu fades in and, once hidden, becomes unfocusable.
#### Remember it
**Animate transform and opacity.** Duration 150-300ms. Always include a reduced-motion fallback.
#### Common mistakes
- ¦transition: all¦ (animates unintended properties, hurts performance).
- Transitioning ¦height: auto¦ (not animatable; use grid-template-rows trick or ¦interpolate-size¦).
- Forgetting that hover does not exist on touch.
#### Interview angle
**Say it:** "I transition transform and opacity for smooth GPU-composited motion, avoid transition: all, and disable motion under prefers-reduced-motion." **Follow-up:** *Why is translate better than left?* It does not trigger layout recalculation.

### Animations and keyframes
#### In one line
Keyframe animations run multi-step motion automatically, loops included, without needing a state change.
#### Real-life analogy
A transition is a car moving from A to B when you press the pedal; an animation is a train following a timetable of stops that runs on its own.
#### How it works
Define steps with ¦@keyframes name { from{} 50%{} to{} }¦ then apply ¦animation: name duration timing delay iteration-count direction fill-mode¦. Useful values: ¦infinite¦, ¦alternate¦, ¦forwards¦ (keep end state), ¦steps(n)¦. Control with ¦animation-play-state¦. Use for loaders, skeletons, entrance effects, attention cues. JavaScript can listen to ¦animationend¦. Newer: scroll-driven animations (¦animation-timeline¦) and view transitions. Respect ¦prefers-reduced-motion¦.
#### Example
¦¦¦css
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 24px; height: 24px; border: 3px solid #cbd5e1; border-top-color: #4f46e5; border-radius: 50%; animation: spin .8s linear infinite; }

@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } }
.reveal { animation: fade-up .5s ease-out both; }

@media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 3s; } .reveal { animation: none; } }
¦¦¦
A spinner that rotates forever and a fade-in entrance; motion is reduced for users who ask for it.
#### Remember it
**Name, duration, timing, iteration, fill.** Use ¦both¦ fill-mode for entrances (applies the first keyframe during delay).
#### Common mistakes
- Infinite, large animations that distract or trigger vestibular issues.
- Animating layout properties.
- Not providing a non-animated state for reduced motion.
#### Interview angle
**Say it:** "Transitions for state changes, keyframes for autonomous or multi-step motion; I keep to compositor properties and honour reduced motion." **Follow-up:** *Pause an animation?* Set ¦animation-play-state: paused¦.

### Accessibility basics
#### In one line
Accessibility means everyone, including keyboard and screen-reader users, can perceive, operate and understand your UI.
#### Real-life analogy
A building with stairs, a ramp and braille signs: the same entrance is usable by many different people.
#### How it works
Cover the POUR principles: **Perceivable, Operable, Understandable, Robust**. Practical checklist:
- Semantic landmarks and logical heading order.
- All functionality reachable by keyboard; visible ¦:focus-visible¦; logical tab order; **skip link**.
- Labels for every control; error text linked with ¦aria-describedby¦.
- Alt text, captions, transcripts.
- Sufficient contrast and not relying on colour only.
- Respect user preferences: reduced motion, text zoom to 200%, high contrast.
- Manage focus in SPAs: after route changes move focus to the main heading; in modals trap and restore focus.
- Test with keyboard, axe/Lighthouse and a screen reader.
#### Example
¦¦¦html
<a class="skip" href="#main">Skip to content</a>
<header>…nav…</header>
<main id="main" tabindex="-1"><h1>Dashboard</h1></main>
<style>
  .skip { position: absolute; left: -999px; }
  .skip:focus { left: 8px; top: 8px; background: #fff; padding: 8px 12px; z-index: 100; }
  :focus-visible { outline: 3px solid #4f46e5; outline-offset: 2px; }
</style>
¦¦¦
Keyboard users press Tab once to skip navigation; the target is focusable programmatically for SPA route changes.
#### Remember it
**Keyboard, labels, contrast, focus, semantics.** Automated tools catch about a third of issues; manual testing is required.
#### Common mistakes
- ¦outline: none¦ with no replacement.
- Icon-only buttons with no accessible name.
- Modals that do not trap or restore focus.
#### Interview angle
**Say it:** "I build on semantic HTML, ensure full keyboard operability and visible focus, label every control, check contrast, and test with automated tools plus a screen reader." **Follow-up:** *How do you handle focus in a SPA?* Move focus to the new page heading on navigation and announce changes with a live region when needed.

### ARIA
#### In one line
ARIA adds roles, states and properties that tell assistive technology what custom widgets are and what they are doing.
#### Real-life analogy
ARIA is a label sticker on a machine. It tells people what the machine is, but it does not make the machine work; the buttons still have to be wired up.
#### How it works
- **Roles**: ¦role="dialog"¦, ¦tablist¦, ¦alert¦, ¦menu¦.
- **States**: ¦aria-expanded¦, ¦aria-checked¦, ¦aria-selected¦, ¦aria-pressed¦, ¦aria-invalid¦, ¦aria-busy¦.
- **Properties**: ¦aria-label¦, ¦aria-labelledby¦, ¦aria-describedby¦, ¦aria-controls¦, ¦aria-live¦.
- **Rules**: (1) use native HTML if possible; (2) do not change native semantics; (3) all custom controls must be keyboard operable; (4) never hide focusable elements with ¦aria-hidden¦; (5) give interactive elements an accessible name.
- Update states with JavaScript whenever the UI changes.
#### Example
¦¦¦html
<button aria-expanded="false" aria-controls="panel" id="b">Details</button>
<div id="panel" hidden>More information…</div>
<div aria-live="polite" id="status"></div>
<script>
  const b = document.getElementById('b'), p = document.getElementById('panel');
  b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open)); p.hidden = open;
    document.getElementById('status').textContent = open ? 'Details hidden' : 'Details shown';
  });
</script>
¦¦¦
A screen reader announces "Details, button, collapsed/expanded" and the live region confirms the change.
#### Remember it
**No ARIA is better than bad ARIA.** Names: label, labelledby; relationships: describedby, controls; changes: live.
#### Common mistakes
- ¦role="button"¦ on a div without key handlers or tabindex.
- Redundant roles (¦<button role="button">¦).
- Stale states that do not update.
#### Interview angle
**Say it:** "I use native elements first and add ARIA only to expose state or names the HTML cannot, and I always implement the keyboard behaviour that goes with the role." **Follow-up:** *aria-label vs aria-labelledby?* labelledby points to visible text and overrides label; use it when a visible label exists.

### Colour contrast and WCAG basics
#### In one line
WCAG sets minimum colour contrast ratios so text and controls are readable for people with low vision or in bright light.
#### Real-life analogy
Grey text on a slightly lighter grey background is like whispering across a noisy room: technically spoken, practically unheard.
#### How it works
WCAG 2.2 AA requirements:
- Normal text: **4.5:1**. Large text (24px, or 18.66px bold): **3:1**.
- UI components and graphics (input borders, icons, focus rings): **3:1**.
- Do not use colour as the only signal (add icons, text, underlines).
- Focus indicators must be clearly visible; target size at least 24x24 CSS px (aim for 44px for touch).
- Text must be resizable to 200% and reflow at 320px width without horizontal scroll.
Check with DevTools colour picker, axe, or Stark. Test dark mode too. Use tokens so every theme is verified once.
#### Example
¦¦¦css
:root { --text: #1e293b; --muted: #475569; --bg: #ffffff; }   /* muted on white = 7.5:1 */
.error { color: #b91c1c; }                                      /* 6.5:1 on white */
.error::before { content: "⚠ "; }                              /* not colour only */
input { border: 1px solid #64748b; }                            /* 4.8:1 for the control boundary */
:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
¦¦¦
Errors are visible without relying on red, and borders meet the 3:1 non-text contrast rule.
#### Remember it
**4.5 / 3 / 3**: text, large text, components. **200% zoom.**
#### Common mistakes
- Light grey placeholder and helper text.
- Placing text over images without overlay.
- Status shown by colour only (green/red).
#### Interview angle
**Say it:** "I target WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text and UI components, never colour alone, and I verify in both themes." **Follow-up:** *What is AAA contrast?* 7:1 for normal text, 4.5:1 for large.

### Responsive images
#### In one line
Serve the right image size and format for each device and reserve space so the page does not jump.
#### Real-life analogy
Ordering a pizza: do not send a family-size box to someone who wants a slice. ¦srcset¦ lets the browser order the right size.
#### How it works
- ¦srcset¦ with width descriptors (¦800w¦) plus ¦sizes¦ (how wide the image will be displayed) lets the browser pick a file considering screen density.
- ¦<picture>¦ with ¦<source type>¦ offers modern formats (AVIF, WebP) with a JPEG fallback, or art-direction with ¦media¦.
- ¦width¦ and ¦height¦ attributes (or ¦aspect-ratio¦) reserve space → no layout shift.
- ¦loading="lazy"¦ for below-the-fold images; **never** for the LCP image. ¦decoding="async"¦ helps. ¦fetchpriority="high"¦ for the hero.
- SVG for icons and logos; compress everything.
#### Example
¦¦¦html
<picture>
  <source type="image/avif" srcset="hero-640.avif 640w, hero-1280.avif 1280w" sizes="(min-width: 900px) 50vw, 100vw">
  <source type="image/webp" srcset="hero-640.webp 640w, hero-1280.webp 1280w" sizes="(min-width: 900px) 50vw, 100vw">
  <img src="hero-640.jpg" width="1280" height="720" alt="Students in a skills lab" fetchpriority="high" style="max-width:100%;height:auto">
</picture>
¦¦¦
Phones download about 640px AVIF; desktops get the larger one. The space is reserved before loading.
#### Remember it
**srcset = which files, sizes = how big on screen, picture = which format or crop.**
#### Common mistakes
- Omitting ¦sizes¦ (the browser assumes 100vw and downloads too much).
- Lazy-loading the hero image.
- Missing ¦width/height¦, causing CLS.
#### Interview angle
**Say it:** "I provide multiple widths with sizes, modern formats via picture, explicit dimensions to prevent shift, and lazy-load everything except the LCP image." **Follow-up:** *srcset w vs x descriptors?* w with sizes for fluid layouts, x for fixed-size density variants.

### SEO and metadata
#### In one line
The head and the structure of your HTML tell search engines and social sites what the page is about and how to show it.
#### Real-life analogy
Metadata is the spine and cover blurb of a book in a library: it decides whether people pick it from the shelf.
#### How it works
- ¦<title>¦ (unique, 50-60 characters) and ¦<meta name="description">¦ (about 150 characters) feed search results.
- ¦<link rel="canonical">¦ avoids duplicate content.
- **Open Graph** and **Twitter cards** control link previews: ¦og:title¦, ¦og:description¦, ¦og:image¦.
- ¦<meta name="robots">¦, ¦sitemap.xml¦, ¦robots.txt¦ control crawling.
- **Semantic structure**: one ¦h1¦, logical headings, descriptive link text, alt text.
- **Structured data** (JSON-LD, schema.org) enables rich results.
- Performance (Core Web Vitals), mobile-friendliness and HTTPS are ranking signals.
- SPAs need server-side rendering or pre-rendering so crawlers see the content.
#### Example
¦¦¦html
<head>
  <title>Clinical Learning Hub | Nursing courses</title>
  <meta name="description" content="Self-paced clinical courses for nurses with quizzes and CPD certificates.">
  <link rel="canonical" href="https://example.com/courses">
  <meta property="og:title" content="Clinical Learning Hub">
  <meta property="og:image" content="https://example.com/og.jpg">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Course","name":"Hand hygiene","provider":{"@type":"Organization","name":"Example"}}</script>
</head>
¦¦¦
Search results and link previews now show a clear title, description and image.
#### Remember it
**Title, description, canonical, OG, JSON-LD, one h1, fast.**
#### Common mistakes
- Same title on every page.
- Client-only rendering with empty HTML for crawlers.
- Missing canonical on filtered or paginated URLs.
#### Interview angle
**Say it:** "I cover unique titles and descriptions, canonical URLs, Open Graph, structured data and semantic headings, and make sure content is rendered server-side or pre-rendered." **Follow-up:** *How do you do SEO in a React SPA?* Use SSR or static generation (for example Next.js), and manage head tags per route.

### Script loading and HTML5 APIs
#### In one line
How and when scripts load affects first paint, and HTML5 gives native widgets and APIs that replace many libraries.
#### Real-life analogy
Scripts are delivery trucks. A normal script blocks the road until it is unloaded; ¦defer¦ waits until the road is clear; ¦async¦ unloads whenever it arrives.
#### How it works
- Plain ¦<script>¦ **blocks parsing**. ¦defer¦: download in parallel, run after parsing, in order (best default). ¦async¦: run as soon as downloaded, any order (analytics). ¦type="module"¦ is deferred by default.
- Place critical CSS before scripts; avoid render-blocking third-party scripts.
- **Native elements**: ¦<dialog>¦ (modals with focus trap and Esc), ¦<details>/<summary>¦ (accordions), ¦<progress>¦, ¦<meter>¦, ¦<datalist>¦, ¦popover¦ attribute.
- **APIs**: ¦fetch¦, ¦IntersectionObserver¦ (lazy load, scroll reveals), ¦localStorage¦, ¦Clipboard¦, ¦History¦, ¦ResizeObserver¦, ¦matchMedia¦, ¦Web Share¦, ¦Page Visibility¦.
#### Example
¦¦¦html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
<details><summary>Show transcript</summary><p>…</p></details>
<dialog id="d"><p>Saved!</p><form method="dialog"><button>Close</button></form></dialog>
<script>
  const io = new IntersectionObserver((es) => es.forEach(e => e.isIntersecting && e.target.classList.add('in')));
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
</script>
¦¦¦
The page paints before scripts run; the details and dialog work with no custom JS.
#### Remember it
**defer for your code, async for independent third parties, native elements before libraries.**
#### Common mistakes
- Scripts in the head without defer.
- Using ¦async¦ for scripts that depend on each other.
- Building custom accordions or modals when native ones exist.
#### Interview angle
**Say it:** "I use defer for app scripts, async for independent third-party scripts, and prefer native dialog, details and IntersectionObserver to heavier libraries." **Follow-up:** *Async vs defer order?* defer preserves order; async does not.

## Phase 3 · Modern CSS, performance and architecture (Advanced)
### Modern selectors and nesting
#### In one line
¦:has()¦, ¦:is()¦, ¦:where()¦ and native nesting let CSS express relationships that used to need JavaScript or extra classes.
#### Real-life analogy
¦:has()¦ is a manager who changes the office rules if a certain person is present; ¦:is()¦ is a shorthand "any of these people"; nesting is an org chart written inside the department.
#### How it works
- **:has(selector)**: select an element **based on its descendants or following siblings**: ¦.card:has(img)¦, ¦form:has(:invalid)¦, ¦label:has(input:checked)¦.
- **:is(a, b)**: grouping; specificity of the most specific argument. **:where()**: same but zero specificity (ideal for resets and library defaults).
- **Native nesting**: ¦.card { padding: 1rem; & .title { font-weight: 600 } &:hover { ... } @media (...) { ... } }¦. Use ¦&¦ for the parent. No preprocessor required.
- Progressive enhancement: ¦@supports selector(:has(a)) { ... }¦.
#### Example
¦¦¦css
.field:has(input:user-invalid) { --border: #dc2626; }
.field:has(input:user-invalid) .error { display: block; }
:where(h1, h2, h3) { margin-block: 0 .5em; }       /* zero specificity default */
.card {
  padding: 1rem;
  & h3 { font-size: 1.1rem; }
  &:hover { box-shadow: 0 6px 18px rgba(0,0,0,.12); }
  @media (min-width: 768px) { padding: 1.5rem; }
}
¦¦¦
Form fields restyle themselves when invalid, with no JavaScript class toggling.
#### Remember it
**has = parent selector, where = zero specificity, & = parent in nesting.**
#### Common mistakes
- Heavy ¦:has()¦ on huge DOMs (check performance).
- Assuming nested selectors raise or lower specificity differently from flat ones.
- Not providing a fallback for older browsers where needed.
#### Interview angle
**Say it:** "has() gives conditional parent styling, where() keeps defaults overridable, and native nesting reduces repetition without a build step." **Follow-up:** *What replaces JS class toggles?* Often :has(), :checked, :focus-within and :user-invalid.

### Cascade layers
#### In one line
¦@layer¦ lets you declare the order of style groups so priority comes from layer order instead of selector specificity.
#### Real-life analogy
Transparent sheets stacked on a projector: a mark on a higher sheet always covers the ones below, no matter how thick the pen on the lower sheet was.
#### How it works
Declare order once: ¦@layer reset, tokens, base, components, utilities;¦. Put rules inside ¦@layer name { ... }¦. **Later layers beat earlier layers regardless of specificity.** Unlayered styles beat all layers. For ¦!important¦ the order reverses (earlier layers win). Third-party CSS can be imported into a low layer: ¦@import url(lib.css) layer(vendor);¦. Perfect for design systems: library components in ¦components¦, consumer overrides in ¦utilities¦ or unlayered, with no ¦!important¦.
#### Example
¦¦¦css
@layer reset, base, components, utilities;

@layer base { a { color: #4f46e5; } }
@layer components { .btn { padding: .6em 1.2em; background: #4f46e5; color: #fff; } #root .btn { background: #000; } } /* still components layer */
@layer utilities { .bg-danger { background: #dc2626; } }
¦¦¦
A ¦bg-danger¦ utility overrides ¦.btn¦ even though ¦.btn¦ appears inside a higher-specificity chain, because the utilities layer is later.
#### Remember it
**Layer order beats specificity; unlayered beats layered.**
#### Common mistakes
- Forgetting the order declaration (order is by first appearance).
- Expecting layers to affect inline styles.
- Mixing unlayered and layered CSS unintentionally.
#### Interview angle
**Say it:** "Layers give predictable override order for resets, tokens, components and utilities, so we avoid specificity wars and !important." **Follow-up:** *How do you tame a third-party stylesheet?* Import it into the lowest layer.

### Logical properties, aspect-ratio, subgrid and color-mix
#### In one line
Modern CSS features that make layouts direction-aware, ratio-based, aligned across nested grids and easier to theme.
#### Real-life analogy
Logical properties are "front/back" instead of "left/right", which stays correct even if the room is mirrored for a different language.
#### How it works
- **Logical properties**: ¦margin-inline¦, ¦padding-block¦, ¦inset-inline-start¦, ¦border-block-end¦, ¦inline-size¦ / ¦block-size¦. They flip for RTL and vertical writing modes automatically.
- **aspect-ratio**: ¦aspect-ratio: 16 / 9¦ replaces the padding-top hack and prevents layout shift.
- **subgrid**: ¦grid-template-columns: subgrid¦ makes children use the parent's tracks so card titles, text and buttons align across cards.
- **color-mix()**: ¦color-mix(in srgb, var(--brand) 20%, white)¦ for tints and states. **Relative colour syntax** and ¦oklch()¦ give perceptual control.
- ¦object-fit¦, ¦gap¦, ¦min()/max()¦, ¦clamp()¦ complete the toolkit.
#### Example
¦¦¦css
.thumb { aspect-ratio: 16 / 9; object-fit: cover; width: 100%; }
.card-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.card { display: grid; grid-template-rows: subgrid; grid-row: span 3; }   /* title, text, button align across cards */
.alert { margin-inline-start: 1rem; padding-block: .5rem; background: color-mix(in srgb, #dc2626 12%, white); }
¦¦¦
Titles, descriptions and buttons line up across all cards; the alert margin flips correctly in RTL.
#### Remember it
**inline = text direction, block = perpendicular.** ¦aspect-ratio¦ for media, ¦subgrid¦ for alignment, ¦color-mix¦ for tints.
#### Common mistakes
- Hard-coding left/right in an app that needs RTL.
- Forgetting ¦object-fit¦ with ratio boxes.
- Using subgrid without the parent defining tracks.
#### Interview angle
**Say it:** "I use logical properties for i18n, aspect-ratio to reserve space, subgrid to align content across cards, and color-mix to derive tints from tokens." **Follow-up:** *Why logical properties?* One stylesheet works for both LTR and RTL.

### Theming and dark mode with design tokens
#### In one line
Store every colour, space and radius as a token (custom property) and switch themes by swapping token values, not by rewriting components.
#### Real-life analogy
A stage with lighting presets: the actors and set stay the same, you change the light scene, and everything adapts.
#### How it works
Use three token levels: **primitive** (¦--indigo-600¦), **semantic** (¦--color-action¦, ¦--color-surface¦, ¦--color-text¦) and **component** (¦--btn-bg¦ defaulting to a semantic token). A theme is a set of semantic values under ¦:root¦, ¦[data-theme="dark"]¦ or a brand class.
- Default to the OS setting with ¦@media (prefers-color-scheme: dark)¦, allow manual override via ¦data-theme¦ saved in ¦localStorage¦.
- Apply the saved theme **before first paint** with a tiny inline script to avoid a flash.
- ¦color-scheme: light dark¦ makes native controls, scrollbars and form fields match.
- Check contrast in every theme; dark mode is not just inverted colours (use slightly desaturated accents and softer surfaces).
#### Example
¦¦¦css
:root { color-scheme: light dark; --surface: #ffffff; --text: #0f172a; --action: #4f46e5; --border: #e2e8f0; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --surface:#0f172a; --text:#e2e8f0; --action:#818cf8; --border:#334155; } }
:root[data-theme="dark"] { --surface:#0f172a; --text:#e2e8f0; --action:#818cf8; --border:#334155; }
body { background: var(--surface); color: var(--text); }
.card { border: 1px solid var(--border); }
.btn { background: var(--action); color: #fff; }
¦¦¦
¦¦¦html
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
¦¦¦
No component mentions "dark"; the whole UI switches by changing variables.
#### Remember it
**Tokens in three levels; default to system; set before paint; test contrast in both.**
#### Common mistakes
- Hard-coded colours inside components.
- Flash of the wrong theme on load.
- Pure black backgrounds and pure white text causing glare.
#### Interview angle
**Say it:** "I define semantic design tokens as custom properties, swap them per theme with prefers-color-scheme plus a data attribute, apply the saved choice before paint, and verify contrast in both modes." **Follow-up:** *Why semantic tokens?* So components say what a colour is for, not what it looks like.

### CSS architecture
#### In one line
Architecture is how you organise and scope CSS so a large team can change it safely.
#### Real-life analogy
A city plan: naming streets (BEM), giving each neighbourhood its own walls (CSS Modules), or having standard building blocks everyone reuses (utility CSS).
#### How it works
| Approach | Idea | Pros | Cons |
|---|---|---|---|
| BEM | ¦.block__element--modifier¦ naming | no tooling, explicit | verbose, global names |
| CSS Modules | file-scoped class names generated at build | zero runtime, plain CSS | needs a bundler |
| Utility CSS (Tailwind) | small single-purpose classes | fast, consistent tokens, small output | long class lists |
| CSS-in-JS | styles in JS, dynamic props | co-location, theming | runtime cost, SSR setup |
Whatever you pick: **flat specificity**, tokens as custom properties, layers (¦@layer¦) for ordering, avoid deep nesting and ¦!important¦, colocate component styles, document states and variants, lint with stylelint, and add visual regression tests.
#### Example
¦¦¦css
/* BEM */
.card { padding: 1rem; }
.card__title { font-weight: 700; }
.card--featured { border-color: #4f46e5; }

/* CSS Module: Button.module.css  →  import s from './Button.module.css'; <button className={s.primary}> */
.primary { background: var(--action); color: #fff; }
.primary:disabled { opacity: .5; }
¦¦¦
Both produce predictable, low-specificity rules; modules additionally prevent global collisions.
#### Remember it
**Scope, low specificity, tokens, one method per codebase.**
#### Common mistakes
- Mixing three methods in one project.
- Overriding component internals from outside with deep selectors.
- Giant global stylesheet with no ownership.
#### Interview angle
**Say it:** "For a React component library I prefer CSS Modules or BEM with design tokens and layers because they have no runtime cost and are themeable; I'd choose utilities if the team wants speed and has a strict token config." **Follow-up:** *Downside of CSS-in-JS?* Runtime overhead and SSR complexity, unless it is zero-runtime.

### SASS and SCSS
#### In one line
SASS is a CSS preprocessor that adds variables, nesting, mixins and modules, compiled to plain CSS.
#### Real-life analogy
A recipe with prep steps: SASS lets you prepare ingredients (variables, mixins) in advance and then serve ordinary CSS to the browser.
#### How it works
- **Variables**: ¦$brand: #4f46e5;¦ (compile-time only).
- **Nesting** with ¦&¦, **partials** (¦_tokens.scss¦) and ¦@use¦ / ¦@forward¦ (modern module system; ¦@import¦ is deprecated).
- **Mixins** and ¦@include¦ for reusable chunks, **functions**, **maps**, ¦@each¦ / ¦@for¦ loops, **placeholder selectors** ¦%name¦ with ¦@extend¦ (use sparingly).
- Maths and colour functions (¦color.adjust¦).
- Modern CSS now covers variables (custom properties), nesting and ¦color-mix¦, so SASS is mainly useful for loops, mixins and maps. Use **custom properties for runtime theming**, SASS for build-time logic.
#### Example
¦¦¦css
/* _breakpoints.scss */
$bp: (sm: 640px, md: 768px, lg: 1024px);
@mixin up($key) { @media (min-width: map-get($bp, $key)) { @content; } }

/* card.scss */
@use "breakpoints" as *;
.card {
  padding: 1rem;
  &__title { font-weight: 700; }
  @include up(md) { padding: 1.5rem; }
}
¦¦¦
Compiles to ordinary ¦.card¦, ¦.card__title¦ and a ¦@media (min-width: 768px)¦ rule.
#### Remember it
**$var = build time, --var = run time.** ¦@use¦ not ¦@import¦.
#### Common mistakes
- Nesting four or five levels deep, producing long selectors.
- Overusing ¦@extend¦.
- Using SASS variables for values that must change at runtime.
#### Interview angle
**Say it:** "I use SASS for mixins, maps and loops and use CSS custom properties for anything that changes at runtime, like themes." **Follow-up:** *@use vs @import?* @use namespaces members and loads once; @import is deprecated and global.

### Animation performance
#### In one line
Smooth animation means staying on the GPU compositor and avoiding layout and paint work on every frame.
#### Real-life analogy
Moving a transparent sticker over a printed page is easy (composite). Reprinting the page for every movement (layout/paint) is slow.
#### How it works
Browser pipeline: **Style → Layout → Paint → Composite**. Changing ¦width¦, ¦height¦, ¦top¦, ¦margin¦ triggers layout; ¦color¦, ¦background¦, ¦box-shadow¦ trigger paint; ¦transform¦ and ¦opacity¦ only composite, so they hit 60fps. Tips:
- Animate transform/opacity; use ¦translate¦ instead of ¦left¦.
- ¦will-change: transform¦ promotes a layer; use only briefly and on few elements (each layer costs memory).
- Avoid animating large blur/shadows or ¦filter¦ on huge areas.
- Use ¦contain: layout paint¦ and ¦content-visibility: auto¦ to limit work.
- Respect ¦prefers-reduced-motion¦ and keep animations short.
- Measure in DevTools Performance (look for long frames, layout thrashing) and avoid forced reflows in JS (reading layout then writing in a loop).
#### Example
¦¦¦css
.drawer { transform: translateX(-100%); transition: transform .25s ease-out; will-change: transform; }
.drawer.open { transform: none; }
.list-item { content-visibility: auto; contain-intrinsic-size: 0 72px; }
@media (prefers-reduced-motion: reduce) { * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }
¦¦¦
The drawer slides on the compositor; long lists skip rendering for off-screen items; motion is minimised for users who ask.
#### Remember it
**Transform + opacity only; will-change sparingly; measure.**
#### Common mistakes
- Setting ¦will-change¦ on everything.
- Animating box-shadow on many elements.
- Reading ¦offsetHeight¦ then writing styles repeatedly (layout thrash).
#### Interview angle
**Say it:** "I stick to transform and opacity so animation is composited, use will-change sparingly, limit rendering with content-visibility, and honour reduced motion; I verify with the Performance panel." **Follow-up:** *What triggers layout?* Changing geometry properties like width, height, margin, position offsets or reading layout values after writes.

### Core Web Vitals
#### In one line
Core Web Vitals are Google's three user-centred metrics: loading (LCP), visual stability (CLS) and responsiveness (INP).
#### Real-life analogy
A restaurant: how fast the main course arrives (LCP), whether the table keeps moving while you eat (CLS), and how quickly the waiter reacts when you call (INP).
#### How it works
| Metric | Good | Meaning | Main fixes |
|---|---|---|---|
| **LCP** | under 2.5s | when the largest visible element renders | optimise hero image (format, size, preload, fetchpriority high), fast server/CDN, critical CSS, no lazy-load on LCP |
| **CLS** | under 0.1 | unexpected layout movement | width/height or aspect-ratio, reserve space for ads/embeds, font metric overrides, no top inserts |
| **INP** | under 200ms | delay from interaction to next paint | split long tasks, debounce, avoid heavy sync work, virtualise lists, content-visibility |
Measure **lab** (Lighthouse, WebPageTest) and **field** (CrUX, RUM via web-vitals library). Field data decides ranking and real experience. Set a performance budget in CI.
#### Example
¦¦¦html
<link rel="preload" as="image" href="hero.avif" fetchpriority="high">
<img src="hero.avif" width="1200" height="630" alt="Learners" fetchpriority="high">
<script type="module">
  import { onLCP, onCLS, onINP } from 'https://unpkg.com/web-vitals@4?module';
  [onLCP, onCLS, onINP].forEach(fn => fn(m => navigator.sendBeacon('/vitals', JSON.stringify({ n: m.name, v: m.value }))));
</script>
¦¦¦
The hero is fetched early with known dimensions, and real-user metrics are sent to your backend.
#### Remember it
**LCP 2.5s, CLS 0.1, INP 200ms.** Load, Layout shift, Interaction.
#### Common mistakes
- Optimising Lighthouse only and ignoring field data.
- Lazy-loading the hero.
- Shipping huge JS bundles that block interaction.
#### Interview angle
**Say it:** "I measure with field data, then target the failing metric: the LCP element for loading, dimensions and reserved space for shifts, and long tasks for INP. I add budgets in CI to prevent regressions." **Follow-up:** *What replaced FID?* INP replaced First Input Delay in 2024.

### Critical CSS and resource hints
#### In one line
Deliver the CSS and assets needed for the first screen immediately, and load the rest later.
#### Real-life analogy
Packing for a trip: your passport and phone are in your pocket (critical); the rest of your luggage goes in the hold.
#### How it works
CSS is **render-blocking**: the browser will not paint until it has downloaded and parsed it. Strategies:
- **Inline critical CSS** (above-the-fold rules) in ¦<style>¦ in the head; load the rest asynchronously (¦media="print" onload="this.media='all'"¦ pattern or build tooling).
- Split CSS per route/component and avoid unused rules (PurgeCSS, tree-shaking).
- Minify and compress (Brotli), use HTTP/2 or 3 and long-lived caching with hashed filenames.
- **Resource hints**: ¦preload¦ (must-have current-page resources: LCP image, key font), ¦preconnect¦ (early connection to an important origin), ¦dns-prefetch¦, ¦prefetch¦ (likely next page), ¦fetchpriority¦, ¦loading="lazy"¦.
- Do not over-hint; too many compete for bandwidth.
#### Example
¦¦¦html
<head>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <style>/* critical: header, hero, typography */ body{margin:0;font:1rem/1.6 system-ui} .hero{min-height:60vh}</style>
  <link rel="stylesheet" href="/app.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/app.css"></noscript>
</head>
¦¦¦
First paint no longer waits for the full stylesheet; the font and connection are requested early.
#### Remember it
**Inline the critical, defer the rest, preload only what is needed first.**
#### Common mistakes
- Preloading everything.
- Inlining huge CSS (hurts caching).
- Forgetting ¦crossorigin¦ on font preloads (double download).
#### Interview angle
**Say it:** "I inline the minimal critical CSS, load the rest non-blocking, split by route, and use preload and preconnect for the LCP image and fonts." **Follow-up:** *preload vs prefetch?* Preload is for the current page now; prefetch is for a likely future navigation at low priority.

### Cross-browser support
#### In one line
Ship modern CSS safely by using feature detection, fallbacks and progressive enhancement rather than browser sniffing.
#### Real-life analogy
Building a house with a ramp and stairs: everyone can enter, and those with an elevator get a nicer experience.
#### How it works
- Decide **supported browsers** with a ¦browserslist¦ config and check **MDN / caniuse / Baseline** status.
- **Feature queries**: ¦@supports (display: grid)¦, ¦@supports selector(:has(a))¦, ¦@supports not (...)¦.
- **Fallback by cascade**: write the older declaration first, then the modern one; unsupported values are ignored (¦width: 90%; width: min(90%, 60rem);¦).
- **Autoprefixer** adds vendor prefixes (¦-webkit-¦) based on browserslist; do not hand-write them.
- **Reset/normalise** differences; use ¦color-scheme¦ and consistent form styles.
- Common trouble: Safari/iOS (¦100vh¦, date inputs, ¦sticky¦ with overflow, ¦gap¦ in old versions), form control zoom below 16px font, flexbox ¦min-width: auto¦ behaviour.
- Test real devices or BrowserStack; automate with Playwright across Chromium, Firefox and WebKit.
#### Example
¦¦¦css
.hero { min-height: 100vh; min-height: 100dvh; }                  /* fallback then modern */
.grid { display: flex; flex-wrap: wrap; }
@supports (display: grid) { .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); } }
.btn { background: #4f46e5; background: color-mix(in srgb, #4f46e5 90%, black); }
input, select { font-size: 16px; }                                /* prevents iOS zoom */
¦¦¦
Older browsers get a working layout; modern ones get the enhanced version.
#### Remember it
**Detect features, not browsers. Fallback first, enhance second.**
#### Common mistakes
- Browser sniffing via user agent.
- Writing prefixes by hand.
- Testing only in Chrome.
#### Interview angle
**Say it:** "I set a browserslist target, use feature queries and cascade fallbacks, let Autoprefixer handle prefixes, and run cross-browser tests including WebKit." **Follow-up:** *What is Baseline?* A label indicating a feature works across all major current browsers.

### Print styles and forced-colors mode
#### In one line
Adapt your CSS for paper and for users whose system forces a limited colour palette.
#### Real-life analogy
A website printed on paper should read like a clean document, not a screenshot full of menus, and a high-contrast mode user should still see every border and button.
#### How it works
**Print**: ¦@media print { }¦. Hide navigation, ads, buttons; use black on white, remove shadows and backgrounds, set readable font sizes (11-12pt), show URLs after links (¦a[href^="http"]::after { content: " (" attr(href) ")"; }¦), control breaks with ¦break-inside: avoid¦, ¦break-after¦, and ¦@page { margin: 2cm }¦. Certificates and invoices in a learning platform are common cases.
**Forced colors** (Windows High Contrast): ¦@media (forced-colors: active)¦; the browser overrides colours with system ones (¦CanvasText¦, ¦ButtonText¦, ¦Highlight¦). Make sure borders and focus outlines exist (backgrounds disappear), use system colour keywords where needed, avoid conveying info only via background, and use ¦forced-color-adjust¦ sparingly. Also respect ¦prefers-contrast¦ and ¦prefers-reduced-motion¦.
#### Example
¦¦¦css
@media print {
  nav, .ads, .btn, video { display: none !important; }
  body { color: #000; background: #fff; font-size: 12pt; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: .8em; }
  .certificate { break-inside: avoid; }
  @page { margin: 2cm; }
}
@media (forced-colors: active) {
  .btn { border: 1px solid ButtonText; }
  .card:focus-within { outline: 2px solid Highlight; }
}
¦¦¦
Printing a certificate yields a clean page; in high-contrast mode buttons keep visible edges.
#### Remember it
**Print: hide, simplify, break well. Forced colors: borders and outlines, not backgrounds.**
#### Common mistakes
- Relying on background colour for button shapes (vanishes in forced colors).
- Printing dark themes with black backgrounds.
- Forgetting page-break control on tables and cards.
#### Interview angle
**Say it:** "I add print styles to hide chrome and show content cleanly, and I test forced-colors mode to ensure borders, icons and focus rings remain visible." **Follow-up:** *Which other media features matter?* prefers-reduced-motion, prefers-color-scheme and prefers-contrast.

### Building design-system components
#### In one line
A design-system component is a reusable, accessible, themeable building block with clear variants and states.
#### Real-life analogy
LEGO bricks: standard connectors (API), a limited palette (tokens), and every brick fits every other brick, which is why a thousand builders can create consistent models.
#### How it works
Checklist for a good component (button, card, modal):
1. **Semantic base**: ¦<button>¦, ¦<article>¦, native ¦<dialog>¦.
2. **API**: variants (¦data-variant="primary|secondary|danger"¦), sizes, states (hover, active, focus-visible, disabled, loading), slots for icon and content.
3. **Tokens**: colours, spacing, radius, motion read from custom properties; expose component tokens (¦--btn-bg¦) for customisation.
4. **Accessibility**: keyboard, focus ring, ARIA only where needed, contrast, reduced motion, hit target 44px.
5. **Responsive**: use container queries and fluid sizing.
6. **Low specificity** and layers so consumers can override.
7. **Docs and tests**: Storybook, accessibility checks (axe), visual regression, unit tests, versioning and changelog.
In React, map props to data attributes and ARIA state.
#### Example
¦¦¦html
<button class="btn" data-variant="primary" data-size="md">Save</button>
<button class="btn" data-variant="danger" aria-busy="true">Deleting</button>
<style>
  .btn { --bg: var(--action, #4f46e5); --fg: #fff;
    display: inline-flex; align-items: center; gap: .5em; padding: .6em 1.1em; border: 1px solid transparent;
    border-radius: var(--radius, 10px); background: var(--bg); color: var(--fg); font: 600 1rem/1.2 system-ui; cursor: pointer; transition: transform .15s, filter .15s; }
  .btn:hover { filter: brightness(1.08); }
  .btn:focus-visible { outline: 3px solid color-mix(in srgb, var(--bg) 50%, white); outline-offset: 2px; }
  .btn[data-variant="danger"] { --bg: #dc2626; }
  .btn[aria-busy="true"] { opacity: .7; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
</style>
¦¦¦
One element, controlled by data attributes and tokens; no new class for each colour.
#### Remember it
**Semantic, tokens, states, accessible, documented.** Compose, do not fork.
#### Common mistakes
- Variants implemented by copying CSS.
- No focus or disabled state.
- Hard-coded colours that block theming.
#### Interview angle
**Say it:** "My components start from the right native element, take variants through data attributes, read all values from tokens, ship every state with accessibility baked in, and are covered by Storybook, axe and visual regression tests. This is how we reduced screen build time." **Follow-up:** *How do you version a library?* Semantic versioning, changelog, deprecation warnings and codemods for breaking changes.
`;

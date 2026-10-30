window.PREP = window.PREP || {};
window.PREP.htmlcss = String.raw`
@title HTML & CSS
@icon code
@tagline The base of every UI you ship. Semantic HTML, accessibility, layout with flexbox and grid, responsive design and modern CSS are asked in every frontend round.
@resume Reusable component library (~35% faster screens) | Responsive, cross-browser UI on enterprise apps | Accessibility on the Clinical Learning Hub | HTML5, CSS3 and SASS

## ROADMAP

### Phase 1 · HTML foundations and CSS basics (Basic)
- Document structure: doctype, html, head, body, charset, meta viewport :: Explain what each line of a minimal page does and why the viewport meta matters on phones.
- Semantic HTML: header, nav, main, section, article, aside, footer :: Replace a div soup with landmarks and say why it helps screen readers and SEO.
- Text, links, images and lists: headings, a, img alt, ul/ol/dl :: Know heading order, descriptive link text and when alt should be empty.
- Tables and forms: table markup, label, input, select, textarea, button :: Every control needs a label; use th scope for table headers.
- Input types and form validation: type, required, pattern, constraint validation API :: Know native validation first, then custom messages.
- CSS selectors: element, class, id, attribute, combinators :: Write child, adjacent and general sibling selectors from memory.
- Specificity, cascade and inheritance :: Calculate specificity of three selectors and explain source order and !important.
- Box model: content, padding, border, margin, box-sizing :: Always set box-sizing: border-box and understand margin collapsing.
- Display types and normal flow: block, inline, inline-block, none vs visibility :: Know which properties apply to inline elements.
- Positioning: static, relative, absolute, fixed, sticky :: Explain what each is positioned relative to.
- Stacking context and z-index :: Know what creates a stacking context and why z-index 9999 sometimes fails.
- Units: px, rem, em, %, vh/vw, dvh, clamp() :: Choose rem for type, em for component scaling, dvh for mobile full height.
- Colours and backgrounds: hex, rgb, hsl, gradients, background-size :: Use hsl for themes and know cover vs contain.
- Typography and web fonts: font-family, line-height, @font-face, font-display :: Prevent layout shift with font-display and size-adjust.

### Phase 2 · Layout, responsive and accessible (Intermediate)
- Flexbox: main and cross axis, flex-grow/shrink/basis, gap, wrap :: Centre anything and build a navbar and card row.
- CSS Grid: tracks, fr, minmax, auto-fit/auto-fill, areas, gap :: Build a responsive card grid with no media queries.
- Responsive design and media queries (mobile-first) :: Write min-width breakpoints and test at real widths.
- Container queries and fluid layouts :: Make a component respond to its container, not the viewport.
- Pseudo-classes and pseudo-elements :: Know :hover, :focus-visible, :nth-child, ::before, ::after, ::placeholder.
- CSS custom properties (variables) :: Scope variables, use fallbacks and change them with JavaScript.
- Transitions and transforms :: Animate transform and opacity only; know transform-origin.
- Animations and keyframes :: Write a skeleton loader and a spinner with @keyframes.
- Accessibility basics: landmarks, headings, alt text, focus, keyboard :: Make a page fully usable with only the keyboard.
- ARIA: roles, states and properties, and when not to use them :: First rule of ARIA: use native HTML if it exists.
- Colour contrast and WCAG basics :: Know 4.5:1 for text, 3:1 for large text and UI components.
- Responsive images: srcset, sizes, picture, loading=lazy :: Serve the right size and format and prevent layout shift.
- SEO and metadata: title, meta description, Open Graph, structured data :: Know what search engines and link previews read.
- Script loading and HTML5 APIs: async, defer, dialog, details :: Explain defer vs async and use native dialog and details.

### Phase 3 · Modern CSS, performance and architecture (Advanced)
- Modern selectors and nesting: :has, :is, :where, native nesting :: Replace JavaScript class toggles with :has.
- Cascade layers and scope: @layer :: Control cascade order without specificity wars.
- Logical properties, aspect-ratio, subgrid, color-mix :: Write direction-aware CSS and ratio boxes without hacks.
- Theming and dark mode with design tokens :: Build light/dark with custom properties and prefers-color-scheme.
- CSS architecture: BEM, utility CSS, CSS Modules, CSS-in-JS :: Compare trade-offs and defend a choice for a React team.
- SASS/SCSS essentials: variables, nesting, mixins, partials :: Know what SASS gives you that plain CSS now covers.
- Animation performance: compositor, will-change, reduced motion :: Explain layout vs paint vs composite and respect prefers-reduced-motion.
- Core Web Vitals: LCP, CLS, INP :: Name the causes and fixes for each, with numbers.
- Critical CSS, loading strategy and resource hints :: Know preload, preconnect, fetchpriority and render-blocking CSS.
- Cross-browser support: @supports, prefixes, progressive enhancement :: Ship modern CSS safely with fallbacks.
- Print styles and forced-colors mode :: Write a @media print sheet and respect high-contrast users.
- Building design-system components: button, card, modal :: Build accessible, themeable components with variants and states.

## QA

### [basic] What does the minimal valid HTML page contain, and why does each line matter?
¦¦¦html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page title</title>
</head>
<body>…</body>
</html>
¦¦¦
- ¦<!DOCTYPE html>¦ switches the browser to **standards mode** (without it you get quirks mode and odd box sizing).
- ¦lang¦ helps screen readers choose pronunciation and translators.
- ¦charset¦ prevents garbled characters. Put it in the first 1024 bytes.
- ¦viewport¦ makes mobile browsers use the device width instead of a fake 980px layout. Without it, responsive CSS does not work on phones.
- ¦<title>¦ is the tab text, search result title and the first thing a screen reader announces.

### [basic] What is semantic HTML and why does it matter?
Using elements for their meaning (¦<nav>¦, ¦<main>¦, ¦<button>¦) instead of generic ¦<div>¦/¦<span>¦ everywhere. Benefits: **accessibility** (screen readers list landmarks and headings, keyboard behaviour is built in), **SEO** (search engines understand structure), **maintainability** (the markup explains itself) and **free behaviour** (a ¦<button>¦ is focusable and works with Enter/Space; a ¦<div onclick>¦ is not).
¦¦¦html
<header><nav aria-label="Primary">…</nav></header>
<main>
  <article><h1>Course title</h1><section>…</section></article>
  <aside>Related courses</aside>
</main>
<footer>…</footer>
¦¦¦

### [basic] Block vs inline vs inline-block?
- **block**: starts on a new line, takes full available width, respects width/height/margin/padding on all sides (¦div¦, ¦p¦, ¦section¦).
- **inline**: flows within text, ignores width/height and vertical margin (¦span¦, ¦a¦, ¦strong¦).
- **inline-block**: flows inline but accepts width/height/vertical margin and padding like a block.
Modern code mostly uses ¦flex¦ and ¦grid¦ for layout, so these matter for text-level elements and for understanding whitespace gaps between inline-blocks.

### [basic] Explain the CSS box model and box-sizing.
Every element is a box: **content → padding → border → margin**. With the default ¦content-box¦, ¦width¦ sets only the content, so adding padding and border makes the element wider. With ¦border-box¦, ¦width¦ includes padding and border, which is far more predictable.
¦¦¦css
*, *::before, *::after { box-sizing: border-box; }
.card { width: 300px; padding: 20px; border: 1px solid #ccc; } /* total width stays 300px */
¦¦¦
Margins are outside the box and can **collapse** between vertically adjacent block siblings (the larger margin wins, they do not add).

### [basic] How is specificity calculated?
Think of a four-part score: **inline style, ids, classes/attributes/pseudo-classes, elements/pseudo-elements** (0-1-2-3 style). Higher left-most part wins; ties go to the rule that appears **later**. Examples: ¦p¦ = 0,0,0,1; ¦.card p¦ = 0,0,1,1; ¦#nav .item¦ = 0,1,1,0. ¦:is()¦ takes the specificity of its most specific argument, ¦:where()¦ is always zero. ¦!important¦ overrides normal rules (avoid it; use ¦@layer¦ instead). The universal selector and combinators add nothing.

### [basic] What is the difference between ¦display: none¦, ¦visibility: hidden¦ and ¦opacity: 0¦?
- ¦display: none¦: removed from layout and the accessibility tree; takes no space.
- ¦visibility: hidden¦: invisible but still takes space; hidden from assistive tech and not focusable.
- ¦opacity: 0¦: invisible but takes space, still receives clicks and keyboard focus and is still announced by screen readers.
For visually hiding text but keeping it for screen readers, use a **visually-hidden** utility (clip/1px size), not ¦display: none¦.

### [basic] ¦em¦ vs ¦rem¦ vs ¦px¦ vs ¦%¦ vs ¦vh¦: when do you use each?
- ¦rem¦: relative to the root font size. Best for font sizes and spacing, respects user font settings.
- ¦em¦: relative to the element's own font size (or parent for ¦font-size¦). Good for component-internal spacing that scales with the component's text.
- ¦px¦: fixed. Fine for borders, shadows, hairlines.
- ¦%¦: relative to the parent's property (width) or containing block.
- ¦vh/vw¦: viewport percentages. On mobile use ¦dvh¦ (dynamic viewport height) to avoid the address-bar jump.
- ¦clamp(min, preferred, max)¦ for fluid type: ¦font-size: clamp(1rem, 0.9rem + 1vw, 1.5rem)¦.

### [basic] What are the CSS position values and what is each relative to?
- ¦static¦ (default): normal flow, ignores top/left.
- ¦relative¦: normal flow, offset from its own original spot; keeps its space and becomes a containing block for absolutes.
- ¦absolute¦: removed from flow, positioned relative to the nearest **positioned ancestor** (else the initial containing block).
- ¦fixed¦: relative to the viewport, stays on scroll.
- ¦sticky¦: behaves relative until a scroll threshold (¦top: 0¦), then sticks within its parent. Fails if an ancestor has ¦overflow: hidden/auto¦.

### [basic] How do you centre a div horizontally and vertically?
Modern answer: flex or grid.
¦¦¦css
.parent { display: grid; place-items: center; min-height: 100dvh; }
/* or */
.parent { display: flex; justify-content: center; align-items: center; }
¦¦¦
For horizontal only on a block with a width: ¦margin-inline: auto¦. For absolute: ¦position:absolute; inset:0; margin:auto; width:200px; height:100px¦. Avoid old hacks (¦transform: translate(-50%,-50%)¦ is okay but unnecessary).

### [basic] What is the difference between ¦<button>¦ and ¦<a>¦, and why not use ¦<div onclick>¦?
Use ¦<a href>¦ for **navigation** and ¦<button>¦ for **actions**. Both are focusable, keyboard-operable and announced correctly. A ¦<div onclick>¦ has no role, no focus, no Enter/Space handling; to fix it you would re-implement ¦tabindex¦, ¦role¦ and key handlers, which is what the native element already does. Also, ¦<button>¦ inside a ¦<form>¦ defaults to ¦type="submit"¦; set ¦type="button"¦ for non-submit buttons.

### [intermediate] Explain Flexbox: main axis, cross axis and the key properties.
Flex lays children along a **main axis** (¦flex-direction¦: row by default) and aligns across the **cross axis**.
- Container: ¦display:flex¦, ¦flex-direction¦, ¦flex-wrap¦, ¦justify-content¦ (main axis), ¦align-items¦ (cross axis), ¦gap¦.
- Items: ¦flex: grow shrink basis¦, ¦align-self¦, ¦order¦.
¦flex: 1¦ means ¦1 1 0¦: grow, shrink, start from zero basis. ¦min-width: 0¦ on a flex child fixes text/overflow that refuses to shrink (the default ¦min-width: auto¦ prevents it). Flexbox is **one-dimensional**; use grid for rows and columns together.

### [intermediate] When do you use Grid instead of Flexbox?
Flex = one dimension (a row **or** a column) where content decides sizes. Grid = two dimensions where the **layout** decides.
¦¦¦css
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.page { display: grid; grid-template-areas: "header header" "side main" "footer footer"; grid-template-columns: 240px 1fr; }
¦¦¦
Use grid for page layouts, card galleries, dashboards. Use flex for navbars, toolbars, aligning items inside a card. They combine well (a grid of cards where each card is a flex column).

### [intermediate] ¦auto-fit¦ vs ¦auto-fill¦ in ¦repeat()¦?
Both create as many tracks as fit. With **auto-fill**, empty tracks stay (the columns keep their size even if there are few items). With **auto-fit**, empty tracks collapse to zero so the existing items stretch (with ¦1fr¦ max). For a card grid that should fill the row, use ¦auto-fit¦.

### [intermediate] What is mobile-first design and how do you write it?
Write base CSS for the smallest screen, then add complexity with ¦min-width¦ media queries. It produces simpler CSS (small devices do not download overrides), forces content prioritisation, and matches how most traffic arrives.
¦¦¦css
.layout { display: grid; gap: 16px; }                 /* mobile: one column */
@media (min-width: 768px)  { .layout { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1100px) { .layout { grid-template-columns: 2fr 1fr; } }
¦¦¦
Choose breakpoints where **content** breaks, not device names, and prefer intrinsic techniques (grid auto-fit, clamp, flex-wrap) to reduce breakpoints.

### [intermediate] Media queries vs container queries?
Media queries respond to the **viewport**. Container queries respond to the size of a **parent container**, so a component can adapt wherever it is placed (sidebar vs main area), which is ideal for reusable components.
¦¦¦css
.card-wrap { container-type: inline-size; }
@container (min-width: 480px) {
  .card { display: grid; grid-template-columns: 160px 1fr; }
}
¦¦¦
Supported in all modern browsers. Use media queries for page-level layout and user preferences (¦prefers-color-scheme¦), and container queries for component-level layout.

### [intermediate] What creates a stacking context and why does ¦z-index¦ sometimes not work?
¦z-index¦ only compares elements **within the same stacking context**. A new context is created by the root, ¦position¦ with a ¦z-index¦ value (not auto), ¦opacity < 1¦, ¦transform¦, ¦filter¦, ¦will-change¦, ¦isolation: isolate¦, ¦position: fixed/sticky¦ and flex/grid children with ¦z-index¦. A child with ¦z-index: 9999¦ cannot escape a parent context that sits below another one. Fix: restructure, move the modal to the end of ¦<body>¦ (portal in React), or use ¦isolation: isolate¦ on components to contain their z-indices. Define z-index tokens (¦--z-modal: 1000¦).

### [intermediate] What are CSS custom properties and how are they different from SASS variables?
Custom properties (¦--brand: #4f46e5;¦ used as ¦var(--brand)¦) are **runtime** values: they cascade and inherit, can be overridden per element or media query, and changed with JavaScript (¦el.style.setProperty('--x', '10px')¦). SASS variables are compiled away at build time and cannot change in the browser. Custom properties power theming and dark mode. You can supply a fallback: ¦var(--gap, 16px)¦.

### [intermediate] Which properties should you animate, and why?
Animate **¦transform¦ and ¦opacity¦** because they can run on the GPU compositor thread without recalculating layout or repainting. Animating ¦width¦, ¦height¦, ¦top/left¦, ¦margin¦ triggers **layout**, which is expensive and causes jank. Pipeline: Style → Layout → Paint → Composite; aim to stay at Composite. Use ¦will-change: transform¦ sparingly (it allocates a layer) and respect ¦@media (prefers-reduced-motion: reduce)¦.

### [intermediate] ¦transition¦ vs ¦animation¦?
A **transition** animates between two states when a property changes (hover, class toggle). An **animation** uses ¦@keyframes¦ and can run on its own, loop, have many steps and be paused. Use transitions for interaction feedback and animations for loaders, entrances and continuous effects.
¦¦¦css
.btn { transition: transform .2s ease, background-color .2s ease; }
.btn:hover { transform: translateY(-2px); }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 1s linear infinite; }
¦¦¦

### [intermediate] How do you make a page accessible with the keyboard?
Use native interactive elements; make sure **tab order follows visual order** (do not use positive ¦tabindex¦); show a clear focus style with ¦:focus-visible¦ (never ¦outline: none¦ without a replacement); provide a **skip link**; trap focus inside modals and return it on close (native ¦<dialog>¦ does this); support Esc to close; make custom widgets follow ARIA keyboard patterns (arrow keys in tabs/menus). Test by unplugging the mouse.

### [intermediate] What is ARIA and what is the first rule of ARIA?
ARIA adds roles, states and properties for assistive technology (¦role="dialog"¦, ¦aria-expanded¦, ¦aria-label¦, ¦aria-live¦). **First rule: do not use ARIA if a native element does the job.** ARIA changes only the accessibility tree, not behaviour; you must add keyboard support and manage states yourself. Wrong ARIA is worse than none. Good uses: ¦aria-label¦ for icon-only buttons, ¦aria-expanded¦ on disclosure buttons, ¦aria-live="polite"¦ for toasts, ¦aria-describedby¦ for error text.

### [intermediate] How do you build an accessible form?
Every control has a **visible ¦<label for>¦** (or wraps it), use correct ¦type¦ and ¦autocomplete¦, group radios in ¦<fieldset><legend>¦, mark required with ¦required¦ and visible text, connect error messages with ¦aria-describedby¦ and ¦aria-invalid="true"¦, announce errors (¦role="alert"¦ or focus the first error), do not rely on placeholder as a label, and keep a logical tab order. Validate on the client for UX and again on the server for security.
¦¦¦html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" required aria-describedby="email-err">
<p id="email-err" role="alert">Enter a valid email address.</p>
¦¦¦

### [intermediate] What contrast ratios does WCAG require?
WCAG 2.2 AA: **4.5:1** for normal text, **3:1** for large text (18pt or 14pt bold) and for UI components and graphics (borders of inputs, icons). AAA is 7:1. Also never convey meaning by colour alone (add icon or text), keep a visible focus indicator with 3:1 contrast, and make touch targets at least 24x24 CSS px (44px is recommended). Check with browser DevTools or axe.

### [intermediate] How do responsive images work (srcset, sizes, picture)?
¦srcset¦ lists candidate files with widths; ¦sizes¦ tells the browser how wide the image will display so it picks the best file. ¦<picture>¦ lets you swap formats (AVIF/WebP) or art-direct crops.
¦¦¦html
<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w" sizes="(min-width:1000px) 50vw, 100vw">
  <img src="hero-800.jpg" srcset="hero-800.jpg 800w, hero-1600.jpg 1600w"
       sizes="(min-width:1000px) 50vw, 100vw" width="800" height="450" alt="Learners in a clinic" loading="lazy">
</picture>
¦¦¦
Always set ¦width/height¦ (or ¦aspect-ratio¦) to reserve space and avoid CLS. Do **not** lazy-load the LCP image; give it ¦fetchpriority="high"¦.

### [intermediate] ¦async¦ vs ¦defer¦ on script tags?
Both download in parallel without blocking HTML parsing. **¦defer¦** executes after the document is parsed, in order (best default for app scripts). **¦async¦** executes as soon as it is downloaded, in any order, so use it for independent scripts (analytics). ES modules (¦type="module"¦) are deferred by default. A plain ¦<script>¦ blocks parsing.

### [advanced] How does the browser render a page (critical rendering path)?
HTML → **DOM**; CSS → **CSSOM**; combined into the **render tree**; then **layout** (geometry), **paint** (pixels) and **composite** (layers). CSS is **render-blocking** (the browser will not paint until it has CSSOM) and synchronous scripts are **parser-blocking**. Optimise by inlining critical CSS, deferring scripts, preloading key resources, reducing DOM size, and animating only compositor properties.

### [advanced] What are Core Web Vitals and how do you improve each?
- **LCP** (Largest Contentful Paint, good under 2.5s): optimise the hero image (right size/format, ¦fetchpriority="high"¦, preload, do not lazy-load), fast server/CDN, inline critical CSS, remove render-blocking resources.
- **CLS** (Cumulative Layout Shift, good under 0.1): set ¦width/height¦ or ¦aspect-ratio¦ on images/video/ads, reserve space for dynamic content, use ¦font-display¦ with matching fallback metrics, do not insert content above existing content.
- **INP** (Interaction to Next Paint, good under 200ms): break up long tasks, debounce handlers, avoid heavy synchronous work, use ¦content-visibility¦, keep the DOM small.
Measure with Lighthouse (lab) and CrUX/RUM (field).

### [advanced] What is ¦@layer¦ and why use it?
Cascade layers let you declare **layer order** so priority does not depend on selector specificity. Rules in a later layer beat earlier layers regardless of specificity (unlayered styles beat all layers).
¦¦¦css
@layer reset, tokens, base, components, utilities;
@layer components { .btn { padding: 8px 12px; } }
@layer utilities { .p-0 { padding: 0; } }  /* wins over .btn without !important */
¦¦¦
Great for taming third-party CSS (import it into a low layer) and for design systems.

### [advanced] What do ¦:has()¦, ¦:is()¦, ¦:where()¦ and native nesting give you?
- ¦:has()¦ is a **parent/relational selector**: ¦.card:has(img)¦, ¦form:has(:invalid)¦, ¦label:has(input:checked)¦ replaces many JS class toggles.
- ¦:is(a, b)¦ groups selectors (takes highest specificity); ¦:where()¦ groups with **zero** specificity (perfect for resets/defaults).
- **Nesting** works natively: ¦.card { padding: 1rem; &:hover { box-shadow: … } .title { font-weight: 600; } }¦.
All are supported in current evergreen browsers; use ¦@supports selector(:has(a))¦ for progressive enhancement.

### [advanced] How do you implement dark mode and theming properly?
Define **design tokens** as custom properties and swap them.
¦¦¦css
:root { color-scheme: light dark; --bg: #fff; --text: #0f172a; --brand: #4f46e5; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#0f172a; --text:#e2e8f0; --brand:#818cf8; } }
:root[data-theme="dark"] { --bg:#0f172a; --text:#e2e8f0; --brand:#818cf8; }
body { background: var(--bg); color: var(--text); }
¦¦¦
Respect the OS preference by default, allow a manual toggle stored in ¦localStorage¦, set the attribute **before first paint** (inline script in ¦<head>¦) to avoid a flash, and use ¦color-scheme¦ so form controls and scrollbars match.

### [advanced] Compare BEM, CSS Modules, utility CSS (Tailwind) and CSS-in-JS.
- **BEM**: naming convention (¦.card__title--active¦). No tooling, explicit, but verbose and global namespace.
- **CSS Modules**: locally scoped class names generated at build time; plain CSS, zero runtime, good with React.
- **Utility CSS**: small single-purpose classes; very fast to build and consistent with a token config, but markup gets long.
- **CSS-in-JS** (styled-components, Emotion): co-located, dynamic props; runtime cost and SSR complexity (zero-runtime options like vanilla-extract help).
Choose by team and performance needs. For a component library I prefer CSS Modules or CSS variables + a small CSS layer because they have no runtime cost and are themeable.

### [advanced] How would you structure CSS for a large app and a component library?
Use layers: ¦reset → tokens → base elements → components → utilities¦. Tokens (colour, spacing, radius, type, z-index) live in custom properties. Components own their styles (CSS Modules or BEM), take variants via data attributes or classes (¦data-variant="primary"¦), and expose customisation through custom properties (¦--btn-bg¦). Avoid deep selectors and ¦!important¦, keep specificity flat, document states (hover, focus-visible, disabled, loading), and add visual regression tests.

### [advanced] What is critical CSS and which resource hints do you use?
Critical CSS is the minimum CSS needed to render above-the-fold content, inlined in ¦<head>¦ so first paint is not blocked; the rest loads asynchronously. Hints: ¦<link rel="preload" as="font|image|style">¦ for must-have resources, ¦rel="preconnect"¦ for third-party origins (fonts, APIs), ¦dns-prefetch¦, ¦fetchpriority="high"¦ for the LCP image, ¦loading="lazy"¦ for below-the-fold images. Do not preload everything: too many hints compete for bandwidth.

### [advanced] How do you handle browser compatibility safely?
Use **progressive enhancement**: a working baseline for all browsers, enhancements for those that support them. ¦@supports (display: grid)¦ or ¦@supports selector(:has(a))¦ for feature queries; Autoprefixer (via browserslist) handles vendor prefixes; use fallbacks (¦color: #333; color: oklch(...)¦, since an unsupported declaration is ignored); check caniuse/MDN baseline; test on real Safari/iOS (frequent differences: ¦100vh¦, ¦gap¦ in old flex, date inputs, sticky). Avoid shipping polyfills for things you can degrade gracefully.

### [advanced] How do you build an accessible modal?
Prefer native ¦<dialog>¦ with ¦showModal()¦: it gives a backdrop, focus trapping, Esc to close and inert background. Provide an accessible name (¦aria-labelledby¦), move focus into the dialog (first focusable or the heading), return focus to the trigger on close, prevent background scroll, and ensure a visible close button.
¦¦¦html
<button id="open">Open</button>
<dialog id="dlg" aria-labelledby="t"><h2 id="t">Confirm</h2><p>Delete this item?</p>
  <form method="dialog"><button value="cancel">Cancel</button><button value="ok">Delete</button></form></dialog>
<script>
  document.getElementById('open').onclick = () => document.getElementById('dlg').showModal();
</script>
¦¦¦

### [advanced] What are logical properties and why do they matter?
Logical properties replace physical directions (¦left/right/top/bottom¦) with flow-relative ones (¦inline-start/end¦, ¦block-start/end¦): ¦margin-inline¦, ¦padding-block¦, ¦inset-inline-start¦, ¦border-inline-end¦. They make layouts work in **RTL** and vertical writing modes automatically, which matters for internationalised products. Example: ¦margin-inline-start: 1rem¦ is the left margin in LTR and the right in RTL.

## EXERCISES

### [basic] Convert a div soup into semantic HTML
Rewrite this markup with the correct semantic elements and one proper heading hierarchy:
¦¦¦html
<div class="top"><div class="logo">Learn</div><div class="links"><a href="/">Home</a><a href="/courses">Courses</a></div></div>
<div class="content"><div class="title">Courses</div><div class="item"><div class="name">Pharmacology</div><div>Short course</div></div></div>
<div class="bottom">© 2026</div>
¦¦¦
> Hint: Think header, nav, main, article, h1/h2 and footer. Navigation is a list of links.
--- solution ---
¦¦¦html
<header>
  <a class="logo" href="/">Learn</a>
  <nav aria-label="Primary">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/courses">Courses</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Courses</h1>
  <article>
    <h2>Pharmacology</h2>
    <p>Short course</p>
  </article>
</main>
<footer><small>© 2026</small></footer>
¦¦¦
Why: landmarks (¦header¦, ¦nav¦, ¦main¦, ¦footer¦) let screen reader users jump around, one ¦h1¦ per page with a logical ¦h2¦ below, links in a list so the count is announced.

### [basic] Predict the specificity winner
Which colour does the paragraph get, and why?
¦¦¦html
<div id="app" class="box"><p class="note">Hello</p></div>
<style>
  p { color: red; }
  .box p { color: blue; }
  .note { color: green; }
  #app p { color: orange; }
</style>
¦¦¦
> Hint: Write the (id, class, element) score for each selector.
--- solution ---
Scores: ¦p¦ = (0,0,1), ¦.box p¦ = (0,1,1), ¦.note¦ = (0,1,0), ¦#app p¦ = (1,0,1). The **orange** rule wins because it has an id. If you remove it, ¦.box p¦ (blue) beats ¦.note¦ (green) because (0,1,1) > (0,1,0). Lesson: avoid id selectors in CSS and keep specificity flat; do not reach for ¦!important¦.

### [basic] Fix the box that is wider than expected
A card is declared ¦width: 100%; padding: 24px; border: 2px solid¦ and overflows its parent. Fix it without changing the numbers.
> Hint: Which box-sizing is the default?
--- solution ---
Default ¦content-box¦ adds padding and border on top of ¦width: 100%¦ (100% + 52px). Use ¦border-box¦.
¦¦¦css
*, *::before, *::after { box-sizing: border-box; }
.card { width: 100%; padding: 24px; border: 2px solid #ccc; }
¦¦¦

### [basic] Build an accessible sign-in form
Create an email + password form with labels, a required indicator, a show-password checkbox without JavaScript tricks, and a submit button. Make it keyboard and screen-reader friendly.
> Hint: label for/id, correct input types, autocomplete values, a visible focus style.
--- solution ---
¦¦¦html
<form class="signin" novalidate>
  <h1>Sign in</h1>
  <div class="field">
    <label for="email">Email <span aria-hidden="true">*</span></label>
    <input id="email" name="email" type="email" autocomplete="username" required aria-describedby="email-hint">
    <small id="email-hint">Use your work email.</small>
  </div>
  <div class="field">
    <label for="pw">Password <span aria-hidden="true">*</span></label>
    <input id="pw" name="password" type="password" autocomplete="current-password" required minlength="8">
  </div>
  <button type="submit">Sign in</button>
</form>
<style>
  .field { display: grid; gap: 4px; margin-bottom: 16px; max-width: 360px; }
  input { padding: 10px 12px; border: 1px solid #94a3b8; border-radius: 8px; font: inherit; }
  input:focus-visible, button:focus-visible { outline: 3px solid #4f46e5; outline-offset: 2px; }
  input:user-invalid { border-color: #dc2626; }
  button { padding: 10px 18px; border: 0; border-radius: 8px; background: #4f46e5; color: #fff; font: inherit; cursor: pointer; }
</style>
¦¦¦
Notes: ¦type="email"¦ gives the right mobile keyboard, ¦autocomplete¦ enables password managers, ¦:user-invalid¦ styles errors only after the user interacts, and focus rings are never removed.

### [basic] Centre a card three ways
Centre a 320px-wide card both horizontally and vertically in the viewport using (a) flex, (b) grid, (c) absolute positioning.
> Hint: Use min-height: 100dvh on the container.
--- solution ---
¦¦¦css
/* a) flex */
.page { display: flex; justify-content: center; align-items: center; min-height: 100dvh; }
/* b) grid */
.page { display: grid; place-items: center; min-height: 100dvh; }
/* c) absolute */
.page { position: relative; min-height: 100dvh; }
.card { position: absolute; inset: 0; margin: auto; width: 320px; height: fit-content; }
¦¦¦
Prefer (b) for a single child; (a) when you also need row/column behaviour.

### [basic] Make a sticky header that does not cover anchors
Create a sticky top bar and make in-page links (¦#section¦) scroll so the heading is not hidden beneath it.
> Hint: scroll-margin-top and scroll-behavior.
--- solution ---
¦¦¦css
html { scroll-behavior: smooth; }
.topbar { position: sticky; top: 0; z-index: 50; height: 64px; background: #fff; border-bottom: 1px solid #e2e8f0; }
section[id] { scroll-margin-top: 80px; }   /* header height + gap */
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
¦¦¦

### [intermediate] Responsive card grid without media queries
Build a grid of cards that shows as many 260px+ columns as fit, stretches evenly, and has 16px gaps. Cards should be flex columns where the button is always at the bottom.
> Hint: repeat(auto-fit, minmax(...)) and margin-top: auto.
--- solution ---
¦¦¦html
<div class="cards">
  <article class="card"><h3>Course A</h3><p>Short text.</p><a class="btn" href="#">Open</a></article>
  <article class="card"><h3>Course B</h3><p>A much longer description that wraps over several lines to show equal heights.</p><a class="btn" href="#">Open</a></article>
  <article class="card"><h3>Course C</h3><p>Text.</p><a class="btn" href="#">Open</a></article>
</div>
<style>
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 16px; }
  .card { display: flex; flex-direction: column; gap: 8px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; }
  .card .btn { margin-top: auto; align-self: flex-start; }
</style>
¦¦¦
¦min(260px, 100%)¦ prevents overflow on very narrow screens; grid rows stretch cards to equal height automatically.

### [intermediate] Holy-grail layout with CSS Grid
Create header, left sidebar (240px), main (flexible), footer. On screens under 768px, stack everything.
> Hint: grid-template-areas.
--- solution ---
¦¦¦css
.layout {
  display: grid; min-height: 100dvh;
  grid-template: "header header" auto "side main" 1fr "footer footer" auto / 240px 1fr;
}
.layout > header { grid-area: header; }
.layout > aside  { grid-area: side; }
.layout > main   { grid-area: main; }
.layout > footer { grid-area: footer; }
@media (max-width: 767px) {
  .layout { grid-template: "header" auto "main" 1fr "side" auto "footer" auto / 1fr; }
}
¦¦¦
Change the area names to reorder content on mobile without touching the HTML order, but keep DOM order logical for keyboard users.

### [intermediate] Responsive navbar with an accessible mobile menu
Build a navbar that shows links in a row on desktop and collapses behind a toggle button below 768px. Keep it accessible.
> Hint: A real button with aria-expanded, and CSS that only hides the menu on small screens.
--- solution ---
¦¦¦html
<header class="bar">
  <a class="logo" href="/">Learn</a>
  <button class="toggle" aria-expanded="false" aria-controls="menu">Menu</button>
  <nav id="menu" aria-label="Primary"><a href="/">Home</a><a href="/courses">Courses</a><a href="/about">About</a></nav>
</header>
<style>
  .bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 12px 16px; }
  .toggle { padding: 8px 12px; border: 1px solid #94a3b8; border-radius: 8px; background: none; font: inherit; }
  #menu { display: none; flex-basis: 100%; flex-direction: column; gap: 8px; padding-top: 12px; }
  .toggle[aria-expanded="true"] + #menu { display: flex; }
  @media (min-width: 768px) {
    .toggle { display: none; }
    #menu { display: flex; flex-basis: auto; flex-direction: row; gap: 16px; padding: 0; }
  }
</style>
<script>
  const t = document.querySelector('.toggle');
  t.addEventListener('click', () => t.setAttribute('aria-expanded', String(t.getAttribute('aria-expanded') !== 'true')));
</script>
¦¦¦
Mobile-first: the menu is hidden by default and shown when ¦aria-expanded="true"¦ (the attribute drives both the screen reader state and the CSS). On desktop the button disappears and the menu is always visible. Add Esc to close and focus return for a polished version.

### [intermediate] Animated skeleton loader
Create a skeleton card (avatar circle + two text lines) with a shimmer animation that respects reduced motion.
> Hint: background-position animation and prefers-reduced-motion.
--- solution ---
¦¦¦html
<div class="sk" aria-busy="true" aria-label="Loading">
  <span class="sk-avatar"></span>
  <span class="sk-line"></span>
  <span class="sk-line short"></span>
</div>
<style>
  .sk { display: grid; grid-template-columns: 48px 1fr; gap: 8px 12px; max-width: 320px; }
  .sk-avatar { grid-row: span 2; width: 48px; height: 48px; border-radius: 50%; }
  .sk-line { height: 14px; border-radius: 6px; }
  .sk-line.short { width: 60%; }
  .sk > span {
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 200% 100%; animation: shimmer 1.4s linear infinite;
  }
  @keyframes shimmer { to { background-position: -200% 0; } }
  @media (prefers-reduced-motion: reduce) { .sk > span { animation: none; } }
</style>
¦¦¦

### [intermediate] Build a pure-CSS accordion and tabs behaviour with native HTML
Use ¦details¦ to create an FAQ where only one item is open at a time and the open one animates smoothly.
> Hint: the name attribute groups details elements; use ::details-content or grid-template-rows for animation.
--- solution ---
¦¦¦html
<details name="faq" open><summary>What is the refund policy?</summary><div class="a"><p>Full refund within 14 days.</p></div></details>
<details name="faq"><summary>Do I get a certificate?</summary><div class="a"><p>Yes, after the final quiz.</p></div></details>
<style>
  details { border-bottom: 1px solid #e2e8f0; }
  summary { padding: 14px 0; cursor: pointer; font-weight: 600; }
  details[open] > summary { color: #4f46e5; }
  .a { padding-bottom: 14px; animation: fade .25s ease; }
  @keyframes fade { from { opacity: 0; transform: translateY(-4px); } }
</style>
¦¦¦
Giving several ¦details¦ the same ¦name¦ makes them an exclusive accordion with no JavaScript (supported in current browsers); fall back gracefully to independent toggles elsewhere.

### [intermediate] Debug: why does ¦z-index¦ not work?
A dropdown (¦z-index: 999¦) appears under a sibling card. Find the problem.
¦¦¦html
<header style="position:relative; z-index:1; transform: translateZ(0)">
  <div class="dropdown" style="position:absolute; z-index:999">…</div>
</header>
<main style="position:relative; z-index:2">…</main>
¦¦¦
> Hint: z-index 999 is only compared inside its own stacking context.
--- solution ---
The header creates a stacking context (¦position + z-index: 1¦ and ¦transform¦). The dropdown's 999 is local to the header, and the whole header (level 1) sits **below** ¦main¦ (level 2). Fix by raising the header context above the content:
¦¦¦css
header { position: relative; z-index: 10; }
main   { position: relative; z-index: 1; }
¦¦¦
or by rendering dropdowns in a portal at the end of ¦<body>¦. Define z-index tokens (¦--z-dropdown: 100; --z-modal: 1000¦) to avoid arbitrary numbers.

### [intermediate] Debug: ¦position: sticky¦ does not stick
Why does a sticky sidebar not stick, and how do you fix it?
¦¦¦css
.wrapper { overflow: hidden; }
.sidebar { position: sticky; top: 16px; }
¦¦¦
> Hint: Sticky is relative to the nearest scrolling ancestor.
--- solution ---
An ancestor with ¦overflow: hidden/auto/scroll¦ becomes the scroll container, so sticky sticks inside it (which does not scroll). Remove the overflow on ancestors (use ¦overflow: clip¦ if you only need clipping), make sure the sticky element has a ¦top¦ value, and that its parent is taller than the sticky element (and not ¦display: flex¦ with ¦align-items: stretch¦ forcing equal height; add ¦align-self: start¦).
¦¦¦css
.wrapper { overflow: clip; }
.sidebar { position: sticky; top: 16px; align-self: start; }
¦¦¦

### [intermediate] Fluid typography and spacing with clamp
Create a type scale where ¦h1¦ goes from 2rem on 360px screens to 3.5rem on 1200px screens, and section padding scales from 16px to 64px, without media queries.
> Hint: clamp(min, preferred, max) with a vw + rem preferred value.
--- solution ---
Preferred value = slope x 100vw + intercept. For h1: slope = (56 - 32) / (1200 - 360) = 0.02857 (2.857vw); intercept = 32 - 0.02857 x 360 = 21.71px = 1.357rem. For padding: slope = (64 - 16) / 840 = 5.714vw; intercept = 16 - 20.57 = -4.57px = -0.286rem.
¦¦¦css
h1      { font-size: clamp(2rem, 1.357rem + 2.857vw, 3.5rem); }      /* 32px at 360px → 56px at 1200px */
section { padding-block: clamp(1rem, -0.286rem + 5.714vw, 4rem); }   /* 16px → 64px */
¦¦¦
Check: at 360px, 21.71px + 10.29px = 32px; at 1200px, 21.71px + 34.29px = 56px. Keep rem in the formula so browser zoom and user font settings still work, and test both extremes in DevTools.

### [advanced] Theme switcher with design tokens (light, dark, system)
Implement three modes (light, dark, system) using custom properties and a tiny script, with no flash on load and persisted choice.
> Hint: set data-theme before CSS renders; prefers-color-scheme for the system mode.
--- solution ---
¦¦¦html
<script>
  (function () {
    var saved = localStorage.getItem('theme');        // 'light' | 'dark' | null (system)
    if (saved) document.documentElement.dataset.theme = saved;
  })();
</script>
<style>
  :root { color-scheme: light dark; --bg:#fff; --text:#0f172a; --brand:#4f46e5; }
  @media (prefers-color-scheme: dark) { :root:not([data-theme]) { --bg:#0f172a; --text:#e2e8f0; --brand:#818cf8; } }
  :root[data-theme="dark"]  { --bg:#0f172a; --text:#e2e8f0; --brand:#818cf8; }
  :root[data-theme="light"] { --bg:#fff;    --text:#0f172a; --brand:#4f46e5; }
  body { background: var(--bg); color: var(--text); }
  a { color: var(--brand); }
</style>
<select id="mode" aria-label="Theme">
  <option value="">System</option><option value="light">Light</option><option value="dark">Dark</option>
</select>
<script>
  var sel = document.getElementById('mode');
  sel.value = localStorage.getItem('theme') || '';
  sel.onchange = function () {
    if (sel.value) { localStorage.setItem('theme', sel.value); document.documentElement.dataset.theme = sel.value; }
    else { localStorage.removeItem('theme'); delete document.documentElement.dataset.theme; }
  };
</script>
¦¦¦

### [advanced] Build a modal with native dialog, animated, accessible
Create a modal using ¦<dialog>¦ with backdrop, entry animation, close on Esc and backdrop click, and focus return to the trigger.
> Hint: showModal(), ::backdrop, and the click target check.
--- solution ---
¦¦¦html
<button id="open">Delete course</button>
<dialog id="dlg" aria-labelledby="dlg-title">
  <h2 id="dlg-title">Delete this course?</h2>
  <p>This cannot be undone.</p>
  <form method="dialog"><button value="cancel">Cancel</button> <button value="ok" class="danger">Delete</button></form>
</dialog>
<style>
  dialog { border: 0; border-radius: 16px; padding: 24px; width: min(420px, 92vw); box-shadow: 0 20px 60px rgba(0,0,0,.3); }
  dialog::backdrop { background: rgba(15,23,42,.55); }
  dialog[open] { animation: pop .2s ease; }
  @keyframes pop { from { opacity: 0; transform: scale(.96); } }
  .danger { background: #dc2626; color: #fff; border: 0; border-radius: 8px; padding: 8px 14px; }
  @media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
</style>
<script>
  const dlg = document.getElementById('dlg'), openBtn = document.getElementById('open');
  openBtn.addEventListener('click', () => dlg.showModal());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close('cancel'); });   // backdrop click
  dlg.addEventListener('close', () => openBtn.focus());                                  // focus returns
</script>
¦¦¦
Esc closes by default; the browser traps focus and makes the rest of the page inert.

### [advanced] Design a reusable button component with variants and states
Create a ¦.btn¦ with ¦primary¦, ¦secondary¦ and ¦danger¦ variants, sizes, hover/active/focus-visible/disabled/loading states, themeable through custom properties.
> Hint: Keep specificity flat and expose --btn-* variables.
--- solution ---
¦¦¦css
.btn {
  --btn-bg: var(--brand, #4f46e5); --btn-fg: #fff; --btn-pad: .6em 1.1em;
  display: inline-flex; align-items: center; justify-content: center; gap: .5em;
  padding: var(--btn-pad); border: 1px solid transparent; border-radius: 10px;
  background: var(--btn-bg); color: var(--btn-fg); font: 600 1rem/1.2 inherit; cursor: pointer;
  transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
}
.btn:hover  { filter: brightness(1.08); transform: translateY(-1px); }
.btn:active { transform: none; filter: brightness(.95); }
.btn:focus-visible { outline: 3px solid color-mix(in srgb, var(--btn-bg) 50%, white); outline-offset: 2px; }
.btn[data-variant="secondary"] { --btn-bg: transparent; --btn-fg: var(--brand, #4f46e5); border-color: currentColor; }
.btn[data-variant="danger"]    { --btn-bg: #dc2626; }
.btn[data-size="sm"] { --btn-pad: .35em .7em; font-size: .875rem; }
.btn[disabled], .btn[aria-disabled="true"] { opacity: .5; cursor: not-allowed; transform: none; filter: none; }
.btn[aria-busy="true"]::after { content: ""; width: 1em; height: 1em; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } .btn[aria-busy="true"]::after { animation-duration: 2s; } }
¦¦¦
In React, map props to data attributes (¦variant¦, ¦size¦) and set ¦aria-busy¦/¦disabled¦. Consumers can theme by overriding ¦--btn-bg¦ without touching selectors.

### [advanced] Fix layout shift (CLS) on an article page
An article page jumps when the hero image, a web font and an ad slot load. List the exact CSS/HTML fixes.
> Hint: Reserve space for every late-loading item.
--- solution ---
¦¦¦html
<img src="hero.jpg" width="1200" height="630" alt="…" fetchpriority="high" style="width:100%;height:auto">
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<div class="ad" style="min-height:250px"></div>
¦¦¦
¦¦¦css
@font-face { font-family: "Inter"; src: url(/fonts/inter.woff2) format("woff2"); font-display: swap; }
@font-face { font-family: "Inter Fallback"; src: local("Arial"); size-adjust: 107%; ascent-override: 90%; descent-override: 22%; }
body { font-family: "Inter", "Inter Fallback", sans-serif; }
.ad { aspect-ratio: 300 / 250; }               /* reserve the slot */
.embed { aspect-ratio: 16 / 9; width: 100%; }  /* video/iframe */
¦¦¦
Rules: always give images ¦width/height¦ (or ¦aspect-ratio¦), reserve space for ads and embeds, match fallback font metrics, never inject content above what the user is reading, and animate with ¦transform¦ rather than layout properties. Verify with the Layout Shift regions in DevTools Performance panel.

### [advanced] Container-query-driven card
Build a card that is vertical in narrow containers and horizontal (image left) when its container is at least 480px wide, regardless of viewport.
> Hint: container-type: inline-size on the wrapper, @container on the card.
--- solution ---
¦¦¦html
<div class="slot"><article class="card"><img src="c.jpg" alt="" width="160" height="120"><div><h3>Anatomy 101</h3><p>Learn the basics.</p></div></article></div>
<style>
  .slot { container-type: inline-size; }
  .card { display: grid; gap: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; }
  .card img { width: 100%; height: auto; border-radius: 8px; }
  @container (min-width: 480px) {
    .card { grid-template-columns: 160px 1fr; align-items: center; }
  }
</style>
¦¦¦
Put the card in a narrow sidebar and a wide main area: it adapts to each. Note that you query a **parent**, never the element itself.

## SCENARIOS

### How would you make the Clinical Learning Hub accessible to keyboard and screen reader users?
Start with an audit: automated (axe, Lighthouse) plus manual keyboard and screen reader passes (NVDA/VoiceOver) on the main journeys (login, course player, quiz, certificate). Fix by priority: landmarks and heading order, labels and error messages on forms, focus management in modals and route changes (move focus to the new page heading in the SPA), visible focus styles, contrast, captions and transcripts for video, and reduced-motion support. Put checks in the pipeline (eslint-plugin-jsx-a11y, axe in component tests, Storybook a11y addon) so regressions are caught, and add acceptance criteria for accessibility in every story. Mention WCAG 2.2 AA as the target and how you tracked it.

### Your reusable component library has to support light, dark and client-specific brand themes. How do you design the styling layer?
Use design tokens as custom properties at three levels: **primitive** (¦--blue-600¦), **semantic** (¦--color-action¦, ¦--color-surface¦) and **component** (¦--btn-bg¦ defaulting to a semantic token). Themes are just sets of semantic token values switched by ¦data-theme¦ or a brand class. Components never hardcode colours. Ship CSS with ¦@layer¦ so consumers can override without specificity battles, use CSS Modules or BEM for scope, document states, and add visual regression tests (Chromatic/Playwright) per theme. This is how a component library can cut screen build time (your ~35% faster screens claim) while staying consistent.

### A page scores poorly on Core Web Vitals. Walk through your investigation and fixes.
Reproduce with Lighthouse and confirm with field data (CrUX/RUM) to see which metric fails. **LCP**: identify the LCP element in DevTools; if it is a hero image, resize/compress, serve AVIF/WebP, add ¦fetchpriority="high"¦ and preload it, remove ¦loading="lazy"¦ from it, and inline critical CSS. **CLS**: add dimensions or ¦aspect-ratio¦, reserve ad/embed space, fix font swap shifts. **INP**: profile long tasks, split heavy handlers, debounce input, virtualise long lists. Re-measure after each change, set performance budgets in CI (Lighthouse CI), and report the improvement with before/after numbers.

### Design a responsive layout for a data-heavy dashboard that must work on mobile.
Mobile-first grid: one column of cards on small screens, ¦repeat(auto-fit, minmax(…))¦ as space grows, container queries so widgets adapt to their slot. Tables: horizontal scroll inside a ¦role="region" tabindex="0"¦ wrapper with a caption, or transform rows into stacked cards at small widths. Charts: SVG/canvas with ¦aspect-ratio¦ and a resize observer. Use ¦dvh¦ and safe-area insets on mobile, touch targets of 44px, avoid hover-only interactions, and test on real devices. Prioritise content: the most important KPIs come first in DOM order.

### A layout looks perfect in Chrome but breaks in Safari on iPhone. How do you debug it?
Reproduce on a real device or BrowserStack, use Safari Web Inspector remote debugging. Common causes: ¦100vh¦ including the address bar (use ¦dvh¦/¦svh¦), ¦position: sticky¦ blocked by ancestor overflow, flex items not shrinking (add ¦min-width: 0¦), missing ¦-webkit-¦ prefixes for older features (let Autoprefixer handle it via browserslist), ¦gap¦ or ¦aspect-ratio¦ in older versions, date input rendering, form control zoom on focus (font-size below 16px), and ¦backdrop-filter¦. Fix with feature queries and progressive enhancement, add the browser to the test matrix, and write down the finding in the team's browser-compat notes.

### The team argues about Tailwind vs CSS Modules vs styled-components for a new React product. What do you recommend?
Give criteria first: team skills, performance, theming, design-system needs, SSR, bundle size, long-term maintainability. Tailwind: fastest to build and consistent, but long class strings and needs discipline for components. CSS Modules: zero runtime, simple, standard CSS, great for a library. Styled-components/Emotion: dynamic styling and co-location but runtime overhead and SSR considerations. For a lead-level answer: pick one primary approach, define tokens as CSS variables so they work with any, enforce through lint rules and a documented guideline, run a one-week spike on a real screen to compare, and record the decision in an ADR. Avoid mixing three approaches in one codebase.
`;

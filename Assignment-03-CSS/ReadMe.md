## Answers to Final Questions - FAVE Xavier

### 1. Why are we using `clamp()` instead of media queries?

We use `clamp()` because it makes the text size adapt smoothly to the screen size. Instead of jumping between sizes at specific breakpoints like with media queries, the size changes progressively thanks to `vw`.

It’s also much cleaner, since everything is done in one line instead of writing multiple media queries.

---

### 2. Why did we use `minmax()` instead of fixed columns?

Using `minmax()` with `auto-fit` lets the browser handle the layout automatically. It creates as many columns as possible depending on the available space.

Also, it prevents layout issues on small screens. With fixed widths, elements could overflow, while `minmax()` keeps everything responsive.

---

### 3. Why is it important to implement a mobile-first website?

Mobile-first is easier to manage because you start with a simple layout (usually one column), then you add complexity for bigger screens.

It’s also better for performance, since you avoid writing unnecessary CSS that would later need to be overridden for mobile.

---

### 4. What happens if we remove the variables defined at the beginning?

If we remove the variables in `:root`, all the styles using `var()` won’t work anymore. So the website would lose its colors, spacing, etc...

It would also make the code much harder to maintain, because we would need to rewrite every value manually. And dark mode would stop working, since it depends on those variables.
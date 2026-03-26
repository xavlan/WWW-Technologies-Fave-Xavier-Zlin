## Answers to Final Questions - FAVE Xavier

### 1. Why are we using `clamp()` instead of media queries?

- **Fluidity:**  
  `clamp()` allows typography to scale smoothly and continuously based on screen size (using the `vw` unit).

- **Cleaner Code:**  
  With media queries, text jumps between fixed sizes at specific breakpoints, requiring multiple blocks of code.  
  `clamp()` handles minimum, preferred, and maximum sizes in a single line.

---

### 2. Why did we use `minmax()` instead of fixed columns?

- **Automatic Adaptability:**  
  Using `repeat(auto-fit, minmax(250px, 1fr))` lets the browser automatically calculate how many columns fit in a row.  
  The `1fr` ensures columns expand evenly to fill available space.

- **Prevents Layout Breaking:**  
  Fixed widths (e.g., `300px`) can overflow on smaller screens.  
  `minmax()` ensures the layout stays responsive on all devices.

---

### 3. Why is it important to implement a mobile-first website?

- **Code Simplicity:**  
  Mobile layouts are simpler (often a single column).  
  It's easier to build from small screens up using `min-width` media queries.

- **Performance:**  
  Desktop-first approaches require writing complex styles, then overriding them for mobile.  
  Mobile-first keeps CSS lighter and improves loading performance on smaller devices.

---

### 4. What happens if we remove the variables defined at the beginning?

- **Loss of Design System:**  
  Removing the `:root` variables breaks all `var(--...)` usages.  
  The browser ignores these properties → loss of colors, spacing, and styling.

- **Difficult Maintenance:**  
  You would need to hardcode every value manually across the CSS.  
  Dark Mode would also stop working, since it relies on overriding these variables.
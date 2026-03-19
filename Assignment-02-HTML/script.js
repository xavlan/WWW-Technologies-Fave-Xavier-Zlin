// --- Part 1: Accessible Modal Dialog ---
let lastFocusedElement = null;

const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");

openModalButton.addEventListener("click", () => {
  lastFocusedElement = document.activeElement || null;
  modal.setAttribute("aria-hidden", "false");
  const firstFocusable = modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
  if(firstFocusable) firstFocusable.focus();
});

closeModalButton.addEventListener("click", () => {
  modal.setAttribute("aria-hidden", "true");
  if(lastFocusedElement) lastFocusedElement.focus();
});

// Trap focus inside modal
modal.addEventListener("keydown", (e) => {
  if(e.key === "Tab") {
    const focusable = Array.from(modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"));
    if(focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length -1];
    if(e.shiftKey) { // shift+tab
      if(document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // tab
      if(document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  } else if(e.key === "Escape") {
    closeModalButton.click();
  }
});

// --- Part 2: Accessible Accordion ---
document.querySelectorAll(".accordion button").forEach(btn => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    const content = document.getElementById(btn.getAttribute("aria-controls"));
    if (content) content.hidden = expanded; // toggle hidden
  });
});

// --- Part 3: Accessible Tabs ---
const tabs = document.querySelectorAll('.tabs [role="tab"]');
const panels = document.querySelectorAll('.tabs [role="tabpanel"]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
    panels.forEach(p => p.hidden = true);
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if(panel) panel.hidden = false;
    tab.focus();
  });
});

// --- Part 4: Accessible Dropdown Menu ---
const menuBtn = document.getElementById("menuButton");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", !expanded);
  menu.hidden = expanded;
});

document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== menuBtn) {
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// TASK SOLUTION: Close the menu using the Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    if (expanded) {
      menu.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.focus(); // Returns focus to the button, highly recommended for accessibility!
    }
  }
});
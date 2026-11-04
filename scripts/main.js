/**
 * AI Skunkworks — site behavior
 */

/* ——— Mobile nav hamburger ——— */
(function () {
  "use strict";

  var toggle = document.querySelector(".site-sticky-nav__toggle");
  var menu = document.getElementById("site-mobile-menu");
  var closeBtn = document.querySelector(".site-mobile-menu__close");
  if (!toggle || !menu) return;

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggle.focus();
  }

  toggle.addEventListener("click", function () {
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) {
      closeMenu();
    }
  });
})();

/* ——— Crew page table of contents ——— */
(function () {
  var tocLinks = document.querySelectorAll(".crew-toc a[href^='#']");
  if (!tocLinks.length) return;

  tocLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      var stickyOffset =
        (document.querySelector(".site-sticky-nav")?.offsetHeight || 0) +
        24;

      var targetY = target.getBoundingClientRect().top + window.scrollY - stickyOffset;

      var prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: targetY,
        behavior: prefersReduce ? "auto" : "smooth",
      });

      history.replaceState(null, "", "#" + targetId);
    });
  });
})();

/* ——— Year archives accordion ——— */
(function () {
  "use strict";

  /* Legacy button accordion (if any remain) */
  document.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var panelId = trigger.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      var expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", expanded ? "false" : "true");
      panel.hidden = expanded;
    });
  });

  /* Expand / Collapse All for <details class="crew-year"> */
  var yearRoot = document.querySelector(".crew-years");
  if (!yearRoot) return;

  document.querySelectorAll('[data-action="expand-all"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      yearRoot.querySelectorAll(".crew-year").forEach(function (el) {
        el.open = true;
      });
    });
  });

  document.querySelectorAll('[data-action="collapse-all"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      yearRoot.querySelectorAll(".crew-year").forEach(function (el) {
        el.open = false;
      });
    });
  });
})();

/* ——— Command tenure strip ——— */
(function () {
  "use strict";

  var root = document.querySelector("[data-lead-cloud]");
  if (!root) return;

  var pills = Array.prototype.slice.call(root.querySelectorAll("[data-lead-orb]"));
  var panels = Array.prototype.slice.call(root.querySelectorAll("[data-tenure-panel]"));

  function setExpanded(panelId, expanded) {
    pills.forEach(function (pill) {
      if (pill.getAttribute("aria-controls") === panelId) {
        pill.setAttribute("aria-expanded", expanded ? "true" : "false");
      }
    });
  }

  function closeAll(exceptId) {
    pills.forEach(function (pill) {
      var panelId = pill.getAttribute("aria-controls");
      if (exceptId && panelId === exceptId) return;
      pill.setAttribute("aria-expanded", "false");
    });

    panels.forEach(function (panel) {
      if (exceptId && panel.id === exceptId) return;
      panel.hidden = true;
    });

    if (!exceptId) root.classList.remove("is-open");
  }

  function openPanel(pill) {
    var panelId = pill.getAttribute("aria-controls");
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    var alreadyOpen = pill.getAttribute("aria-expanded") === "true";
    closeAll();

    if (alreadyOpen) {
      root.classList.remove("is-open");
      return;
    }

    setExpanded(panelId, true);
    panel.hidden = false;
    root.classList.add("is-open");
  }

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      openPanel(pill);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!root.classList.contains("is-open")) return;
    closeAll();
  });
})();

/* ——— Light / dark theme toggle ———
 * The initial theme is set by a tiny inline script in each page's <head> (no flash).
 * Choice is remembered per browser; with no saved choice we follow the OS setting.
 */
(function () {
  "use strict";

  var KEY = "skunkworks-theme";
  var root = document.documentElement;
  var buttons = document.querySelectorAll("[data-theme-toggle]");
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function saved() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function sync() {
    var dark = root.dataset.theme === "dark";
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      var label = btn.querySelector(".theme-toggle__text");
      if (label) label.textContent = dark ? "Dark" : "Light";
    });
  }

  function apply(theme, persist) {
    root.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {
        /* storage blocked: the toggle still works for this page */
      }
    }
    sync();
  }

  if (!root.dataset.theme) apply(saved() || (media.matches ? "dark" : "light"), false);
  sync();

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  });

  media.addEventListener("change", function (e) {
    if (!saved()) apply(e.matches ? "dark" : "light", false);
  });
})();

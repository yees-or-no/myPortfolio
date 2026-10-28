(() => {
  const root = document.documentElement;
  const overlay = document.querySelector(".transition");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const closeMs = 650;

  /*  Arrive: doors open on the new floor  */
  if (root.classList.contains("arriving")) {
    try { sessionStorage.removeItem("lift-arriving"); } catch (e) {}
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("arriving"))
    );
  }

  /*  Leave: doors close, then navigate  */
  function go(url) {
    if (reduceMotion || !overlay) {
      window.location.href = url;
      return;
    }
    try { sessionStorage.setItem("lift-arriving", "1"); } catch (e) {}
    overlay.classList.add("isClosing");
    window.setTimeout(() => { window.location.href = url; }, closeMs);
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-lift]");
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = link.getAttribute("href");
    if (!href || link.target === "_blank") return;
    if (link.pathname === window.location.pathname) return;
    e.preventDefault();
    go(href);
  });

  // Back/forward cache: make sure the doors are open again
  window.addEventListener("pageshow", (e) => {
    if (e.persisted && overlay) overlay.classList.remove("isClosing");
  });

  /*  Home: lift doors + up button  */
  const doors = document.getElementById("doors");
  if (doors) {
    doors.addEventListener("click", () => doors.classList.toggle("isOpen"));
  }

  const up = document.getElementById("btnUp");
  if (up) {
    up.addEventListener("click", () => {
      if (doors) doors.classList.add("isOpen");
      window.setTimeout(() => go(up.dataset.target || "about.html"), reduceMotion ? 0 : 900);
    });
  }

  /*  Projects: number toggles the project image  */
  const projects = Array.from(document.querySelectorAll(".project"));
  projects.forEach((project) => {
    const btn = project.querySelector(".projectNum");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const willOpen = !project.classList.contains("isActive");
      // one project open at a time; remove this loop to allow several
      projects.forEach((p) => {
        p.classList.remove("isActive");
        p.querySelector(".projectNum").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        project.classList.add("isActive");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
})();

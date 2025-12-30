
  const orbToggle = document.querySelector(".mobile-orb-toggle");
  const orbitMenu = document.querySelector(".mobile-orbit-menu");
  const centralToggle = document.querySelector(".central-toggle");

  orbToggle.addEventListener("click", () => {
    orbToggle.classList.toggle("active");
    orbitMenu.classList.toggle("active");
  });

  if (centralToggle) {
    centralToggle.addEventListener("click", () => {
      document.querySelectorAll(".orbit").forEach((orbit) => {
        const isRunning = orbit.style.animationPlayState === "running";
        orbit.style.animationPlayState = isRunning ? "paused" : "running";
      });
    });
  }

  // Tooltip functionality
  document.querySelectorAll("[data-tooltip]").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltip = this.getAttribute("data-tooltip");
      // Tooltip is handled by CSS
    });
  });


document.addEventListener("DOMContentLoaded", function () {
  function isMobileScreen() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function initializeMobileNavbar() {
    const navbar = document.getElementById("navbar");

    if (!navbar) {
      console.error("Navbar not found! Check if the ID is correct.");
      return;
    }

    let selectedChapter = document.getElementById("selected-chapter");
    let allChapters = Array.from(navbar.querySelectorAll("em"));

    // Preserve original chapter order
    let originalOrder = [...allChapters];

    function toggleChapters(add) {
      if (add) {
        navbar.classList.add("expanded");
      } else {
        navbar.classList.toggle("expanded");
      }

      // Rotate the arrow if the menu is expanded
      let arrow = selectedChapter.querySelector(".arrow-icon");
      if (arrow) {
        if (navbar.classList.contains("expanded")) {
          arrow.style.transform = "rotate(180deg)";
        } else {
          arrow.style.transform = "rotate(0deg)";
        }
      }
    }

    function addArrowToSelected() {
      // Remove previous arrows
      allChapters.forEach(chapter => {
        let arrowSpan = chapter.querySelector(".arrow-icon");
        if (arrowSpan) arrowSpan.remove();
      });

      // Create new arrow
      let arrow = document.createElement("span");
      arrow.classList.add("arrow-icon");
      arrow.innerHTML = "▼";
      arrow.style.position = "relative";
      arrow.style.top = "12px";
      arrow.style.fontSize = "x-large";
      arrow.style.display = "inline-block"; // Ensure rotation works
      arrow.style.transition = "transform 0.3s ease"; // Smooth rotation
      arrow.style.color="white"

      selectedChapter.appendChild(arrow);
    }

    function handleSelection(event) {
      event.preventDefault();
      const targetId = this.querySelector("a").getAttribute("href");

      if (this === selectedChapter) {
        if (selectedChapter.textContent.includes("Abstract")) {
          toggleChapters(true);
        } else {
          toggleChapters(false);
        }
        return;
      }

      // Remove ID from previous selection
      selectedChapter.id = "";

      // Set new selected chapter
      this.id = "selected-chapter";
      selectedChapter = this;

      // Reorder navbar while keeping original order
      navbar.innerHTML = "";
      navbar.appendChild(selectedChapter);

      originalOrder.forEach(chapter => {
        if (chapter !== selectedChapter) {
          navbar.appendChild(chapter);
        }
      });

      // Add arrow near the selected chapter
      addArrowToSelected();

      // Collapse menu
      navbar.classList.remove("expanded");

      // Scroll to the corresponding section
      document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
    }

    // Ensure the first chapter can toggle the menu when clicked
    if (selectedChapter) {
      selectedChapter.addEventListener("click", function (event) {
        if (navbar.classList.contains("expanded")) {
          navbar.classList.remove("expanded");
        } else {
          toggleChapters();
        }
      });
    }

    allChapters.forEach(chapter => {
      chapter.addEventListener("click", handleSelection);
    });

    // **Update active chapter on scroll**
    function updateActiveChapter() {
      let currentChapter = selectedChapter;
      let sections = allChapters.map(chapter => {
        const link = chapter.querySelector("a");
        return document.querySelector(link.getAttribute("href"));
      });

      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top < window.innerHeight / 2) {
          currentChapter = allChapters[index];
        }
      });

      if (currentChapter !== selectedChapter) {
        selectedChapter.id = "";
        currentChapter.id = "selected-chapter";
        selectedChapter = currentChapter;

        // Reorder navbar while maintaining original order
        navbar.innerHTML = "";
        navbar.appendChild(selectedChapter);
        originalOrder.forEach(chapter => {
          if (chapter !== selectedChapter) {
            navbar.appendChild(chapter);
          }
        });

        // Add arrow near the selected chapter
        addArrowToSelected();
      }
    }

    window.addEventListener("scroll", updateActiveChapter);

    // Add arrow to initially selected chapter
    addArrowToSelected();
  }

  if (isMobileScreen()) {
    initializeMobileNavbar();
  }

  window.matchMedia("(max-width: 760px)").addEventListener("change", function (e) {
    if (e.matches) {
      initializeMobileNavbar();
    } else {
      window.location.reload();
    }
  });
});

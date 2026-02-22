const researchRoot = document.getElementById("research-root");

if (researchRoot) {
  // links
  const links = Array.from(
    researchRoot.querySelectorAll<HTMLAnchorElement>("[data-research-link]")
  );
  //secciones
  const sections = Array.from(
    researchRoot.querySelectorAll<HTMLElement>("[data-research-section]")
  );
  const progressFill = document.getElementById("research-progress-fill");
  const summary = document.getElementById("research-summary");
  const scrollStatus = document.getElementById("research-scroll");

  const updateSummary = (): void => {
    const reviewed = sections.filter(section => section.classList.contains("is-reviewed")).length;
    if (summary) {
      summary.textContent = `${reviewed} de ${sections.length} conceptos revisados`;
    }

    if (progressFill) {
      const progress = sections.length === 0 ? 0 : Math.round((reviewed / sections.length) * 100);
      progressFill.style.width = `${progress}%`;
    }
  };

  const setActiveSection = (sectionId: string): void => {
    links.forEach(link => {
      const target = link.dataset.researchLink;
      link.classList.toggle("is-active", target === sectionId);
    });

    const activeSection = sections.find(section => section.id === sectionId);
    if (scrollStatus && activeSection) {
      const title = activeSection.dataset.conceptTitle ?? sectionId;
      scrollStatus.textContent = `Seccion activa: ${title}`;
    }
  };

  // Intersection Observer para detectar la sección activa
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = (entry.target as HTMLElement).id;
        if (id) setActiveSection(id);
      });
    },
    {
      threshold: 0.45
    }
  );

  sections.forEach(section => observer.observe(section));

  researchRoot.addEventListener("click", event => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const toggleButton = target.closest<HTMLButtonElement>("[data-action='toggle-reviewed']");
    if (!toggleButton) return;

    const section = toggleButton.closest<HTMLElement>("[data-research-section]");
    if (!section) return;

    const reviewed = section.classList.toggle("is-reviewed");
    toggleButton.textContent = reviewed ? "Marcar pendiente" : "Marcar revisado";
    updateSummary();
  });

  updateSummary();
  if (sections[0]) setActiveSection(sections[0].id);
}

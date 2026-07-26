"use strict";

const body = document.body;
const rootPath = body.dataset.root || ".";
const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const dropdowns = [...document.querySelectorAll(".dropdown")];
const dropdownToggles = [...document.querySelectorAll(".dropdown-toggle")];
const searchButton = document.getElementById("search-button");
const searchOverlay = document.getElementById("search-overlay");
const searchClose = document.getElementById("search-close");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const contrastButton = document.getElementById("contrast-button");
const languageLabel = document.getElementById("language-label");
const languageOptions = [...document.querySelectorAll(".language-option")];
const toast = document.getElementById("toast");

const pages = [
  ["Inicio", "Página principal, noticias y contacto", "index.html"],
  ["Noticias", "Comunicados y actividades municipales", "paginas/noticias.html"],
  ["Galería", "Fotografías de eventos y obras", "paginas/galeria.html"],
  ["Videos", "Contenido audiovisual", "paginas/videos.html"],
  ["Acerca de", "Información institucional", "paginas/acerca-de.html"],
  ["Organigrama", "Estructura del Ayuntamiento", "paginas/organigrama.html"],
  ["Cabildo", "Integrantes del Cabildo", "paginas/cabildo.html"],
  ["Directorio", "Contactos de áreas municipales", "paginas/directorio.html"],
  ["Dependencias", "Áreas administrativas", "paginas/dependencias.html"],
  ["Obligaciones comunes", "Transparencia y documentos públicos", "paginas/obligaciones-comunes.html"],
  ["Obligaciones específicas", "Transparencia municipal", "paginas/obligaciones-especificas.html"],
  ["Obras públicas", "Proyectos y avances de infraestructura", "paginas/obras-publicas.html"],
  ["Evaluación de fondos federales", "Informes y evaluaciones", "paginas/fondos-federales.html"],
  ["Información financiera", "Presupuestos y estados financieros", "paginas/informacion-financiera.html"],
  ["Cuenta pública", "Documentos de cuenta pública", "paginas/cuenta-publica.html"],
  ["Licitaciones", "Convocatorias y fallos", "paginas/licitaciones.html"]
];

function resolvePath(path) {
  return `${rootPath}/${path}`.replace("/./", "/");
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 25 || body.classList.contains("force-scrolled") || body.dataset.page !== "inicio");
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

function closeDropdowns(except = null) {
  dropdowns.forEach(dropdown => {
    if (dropdown === except) return;
    dropdown.classList.remove("active");
    dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
}

function closeMenu() {
  mainNav?.classList.remove("active");
  menuToggle?.classList.remove("active");
  menuToggle?.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
  closeDropdowns();
}

menuToggle?.addEventListener("click", () => {
  const opening = !mainNav.classList.contains("active");
  mainNav.classList.toggle("active", opening);
  menuToggle.classList.toggle("active", opening);
  menuToggle.setAttribute("aria-expanded", String(opening));
  body.classList.toggle("menu-open", opening);
});

dropdownToggles.forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation();
    const dropdown = button.closest(".dropdown");
    const opening = !dropdown.classList.contains("active");
    closeDropdowns(dropdown);
    dropdown.classList.toggle("active", opening);
    button.setAttribute("aria-expanded", String(opening));
  });
});

document.addEventListener("click", event => {
  if (!event.target.closest(".dropdown")) closeDropdowns();
  if (
    window.innerWidth <= 1060 &&
    mainNav?.classList.contains("active") &&
    !event.target.closest("#main-nav") &&
    !event.target.closest("#menu-toggle")
  ) closeMenu();
});

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1060) closeMenu();
  });
});

function openSearch() {
  searchOverlay?.classList.add("active");
  searchOverlay?.setAttribute("aria-hidden", "false");
  body.classList.add("search-open");
  setTimeout(() => searchInput?.focus(), 180);
}

function closeSearch() {
  searchOverlay?.classList.remove("active");
  searchOverlay?.setAttribute("aria-hidden", "true");
  body.classList.remove("search-open");
}

searchButton?.addEventListener("click", openSearch);
searchClose?.addEventListener("click", closeSearch);
searchOverlay?.addEventListener("click", event => {
  if (event.target === searchOverlay) closeSearch();
});

searchForm?.addEventListener("submit", event => {
  event.preventDefault();
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  if (query.length < 2) {
    searchResults.innerHTML = '<p class="search-empty">Escribe por lo menos dos caracteres.</p>';
    return;
  }
  const matches = pages.filter(([title, description]) =>
    `${title} ${description}`.toLocaleLowerCase("es").includes(query)
  );
  searchResults.innerHTML = matches.length
    ? matches.map(([title, description, path]) =>
        `<a class="search-result" href="${resolvePath(path)}"><strong>${title}</strong><small>${description}</small></a>`
      ).join("")
    : '<p class="search-empty">No se encontraron coincidencias.</p>';
});

const savedContrast = localStorage.getItem("chalma-high-contrast") === "true";
body.classList.toggle("high-contrast", savedContrast);
contrastButton?.addEventListener("click", () => {
  body.classList.toggle("high-contrast");
  localStorage.setItem("chalma-high-contrast", String(body.classList.contains("high-contrast")));
});

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

const savedLanguage = localStorage.getItem("chalma-language");
const savedLangCode = localStorage.getItem("chalma-language-code");
if (savedLanguage && languageLabel) languageLabel.textContent = savedLanguage;
if (savedLangCode) document.documentElement.lang = savedLangCode;

languageOptions.forEach(option => {
  option.addEventListener("click", () => {
    const language = option.dataset.language;
    const code = option.dataset.lang;
    languageLabel.textContent = language;
    document.documentElement.lang = code;
    localStorage.setItem("chalma-language", language);
    localStorage.setItem("chalma-language-code", code);
    closeDropdowns();
    showToast(`Idioma seleccionado: ${language}. Las traducciones se agregarán cuando compartas los textos.`);
  });
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeDropdowns();
  closeMenu();
  closeSearch();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1060) closeMenu();
});

document.querySelectorAll('[aria-disabled="true"]').forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showToast("Este enlace está preparado, pero todavía falta cargar el documento o contenido oficial.");
  });
});

const year = document.getElementById("current-year");
if (year) year.textContent = new Date().getFullYear();

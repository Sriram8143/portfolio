/* Centralized portfolio data */
const portfolio = {
    name: 'BETHA SRI RAM',
    initials: 'SR',
    role: 'Computer Science Student',
    email: 'srirambetha28@gmail.com',
    github: 'https://github.com/srirambetha',
    linkedin: 'https://www.linkedin.com/in/srirambetha',
    availability: { internships: true, fullTime: true, remote: true },
    skills: {
        languages: ['JavaScript', 'Python', 'Java', 'C++', 'SQL'],
        frontend: ['HTML', 'CSS', 'Tailwind', 'Vanilla JS'],
        backend: ['Node.js', 'Express', 'REST APIs']
    },
    projects: [
        { id: 1, title: '[PROJECT 1 NAME]', slug: 'project-1', oneLiner: '[ADD ONE-LINER]', problem: '[ADD REAL PROJECT DESCRIPTION]', solution: '[ADD SOLUTION SUMMARY]', tech: ['JavaScript', 'Tailwind', 'HTML'] },
        { id: 2, title: '[PROJECT 2 NAME]', slug: 'project-2', oneLiner: '[ADD ONE-LINER]', problem: '[ADD REAL PROJECT DESCRIPTION]', solution: '[ADD SOLUTION SUMMARY]', tech: ['Python', 'Flask'] }
    ],
    experience: [],
    education: [],
    certifications: [],
    hackathons: [],
    currentlyBuilding: [],
    learningLab: []
};

/* Utility helpers */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
    // Year
    const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Apply initials and name
    $$('a[aria-label="Home"]').forEach(el => { el.querySelector('div:nth-child(1)').textContent = portfolio.initials; el.querySelector('div:nth-child(2) div:nth-child(2)').textContent = portfolio.name });

    // Theme
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
    $('#theme-toggle').addEventListener('click', () => { const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(next); });

    // Recruiter mode
    const recruiterBtn = $('#recruiter-toggle');
    const recruiterPref = localStorage.getItem('recruiterMode') === 'true';
    setRecruiterMode(recruiterPref);
    recruiterBtn.addEventListener('click', () => { setRecruiterMode(!document.body.classList.contains('recruiter')) });

    // Mobile menu
    const mobileBtn = $('#mobile-menu-button');
    mobileBtn.addEventListener('click', toggleMobileMenu);

    // Case study modal
    $$('[data-case-study]').forEach(btn => btn.addEventListener('click', openCaseStudy));

    // Command palette
    setupCommandPalette();

    // Cursor
    setupCustomCursor();

    // Intersection reveal
    setupRevealObserver();

    // Back to top
    setupBackToTop();

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCommandPalette(); } });
});

function setTheme(t) { document.body.dataset.theme = t; localStorage.setItem('theme', t); const btn = $('#theme-toggle'); btn.textContent = t === 'dark' ? '☼' : '☾'; document.documentElement.style.setProperty('--bg', t === 'dark' ? '#0b0f14' : '#f7fafc'); document.documentElement.style.setProperty('--surface', t === 'dark' ? '#0f1720' : '#ffffff'); }

function setRecruiterMode(enabled) { if (enabled) { document.body.classList.add('recruiter'); localStorage.setItem('recruiterMode', 'true'); $('#recruiter-toggle').classList.add('opacity-100'); $('#recruiter-toggle').textContent = 'RECRUITER MODE (ON)'; } else { document.body.classList.remove('recruiter'); localStorage.setItem('recruiterMode', 'false'); $('#recruiter-toggle').classList.remove('opacity-100'); $('#recruiter-toggle').textContent = 'RECRUITER MODE'; } }

function toggleMobileMenu() { let nav = document.querySelector('nav'); if (nav.style.display === 'block') { nav.style.display = ''; } else { nav.style.display = 'block'; nav.classList.add('absolute', 'left-0', 'top-16', 'w-full', 'bg-[color:var(--surface)]', 'p-4'); } }

/* Case study modal */
function openCaseStudy(e) {
    const id = parseInt(e.currentTarget.dataset.project, 10); const p = portfolio.projects.find(x => x.id === id); if (!p) return; const modal = document.createElement('div'); modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-6'; modal.innerHTML = `
  <div class="max-w-3xl w-full glass p-6 rounded-lg">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-xl font-semibold">${p.title}</h3>
        <div class="text-sm text-gray-400 mt-1">${p.oneLiner}</div>
      </div>
      <button class="text-gray-300" id="modal-close">✕</button>
    </div>
    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 class="text-sm font-semibold">01 — THE PROBLEM</h4>
        <p class="text-sm text-gray-300 mt-2">${p.problem}</p>
        <h4 class="text-sm font-semibold mt-3">02 — THE IDEA</h4>
        <p class="text-sm text-gray-300 mt-2">${p.solution}</p>
      </div>
      <div>
        <h4 class="text-sm font-semibold">ARCHITECTURE</h4>
        <pre class="text-xs terminal mt-2 p-3 bg-black/20 rounded">USER → FRONTEND → API → AUTH → BUSINESS LOGIC → DATABASE</pre>
      </div>
    </div>
    <div class="mt-4 flex gap-2">
      <a class="px-3 py-1 rounded bg-[color:var(--accent)] text-black" href="#">LIVE DEMO</a>
      <a class="px-3 py-1 rounded border border-gray-700" href="#">GITHUB</a>
    </div>
  </div>
`;
    modal.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(modal); });
    document.body.appendChild(modal);
    $('#modal-close', modal).addEventListener('click', () => closeModal(modal));
}
function closeModal(modal) { modal.remove(); }

/* Command palette */
let paletteEl;
function setupCommandPalette() {
    paletteEl = document.createElement('div'); paletteEl.className = 'fixed inset-0 z-50 flex items-start justify-center p-6'; paletteEl.style.display = 'none'; paletteEl.innerHTML = `
  <div class="w-full max-w-xl glass p-4 rounded">
    <input id="palette-input" aria-label="Command palette" placeholder="Search portfolio... (About, Skills, Projects, Contact)" class="w-full p-3 bg-transparent border border-gray-700 rounded focus-ring" />
    <ul id="palette-list" class="mt-2 text-sm text-gray-300"></ul>
  </div>
`;
    document.body.appendChild(paletteEl);
    const input = $('#palette-input', paletteEl);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { runPaletteCommand(input.value); closePalette(); } if (e.key === 'Escape') { closePalette(); } });
}
function openCommandPalette() { paletteEl.style.display = 'flex'; const input = $('#palette-input', paletteEl); input.value = ''; input.focus(); }
function closePalette() { paletteEl.style.display = 'none'; }
function runPaletteCommand(q) { q = q.toLowerCase(); if (q.includes('about')) document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); else if (q.includes('skills')) document.getElementById('skills').scrollIntoView({ behavior: 'smooth' }); else if (q.includes('projects')) document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }); else if (q.includes('contact')) document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); else if (q.includes('toggle theme')) $('#theme-toggle').click(); }

/* Custom cursor */
function setupCustomCursor() {
    const dot = document.getElementById('cursor-dot'); if (!dot) return; if ('ontouchstart' in window) { dot.style.display = 'none'; return; }
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, dx = mx, dy = my;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px)`; });
    // expand on hover
    $$('a,button').forEach(el => { el.addEventListener('mouseenter', () => { dot.style.width = '20px'; dot.style.height = '20px'; }); el.addEventListener('mouseleave', () => { dot.style.width = '10px'; dot.style.height = '10px'; }); });
}

/* Reveal on scroll */
function setupRevealObserver() {
    const io = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('opacity-100', 'translate-y-0'); }); }, { threshold: 0.12 });
    $$('section, article, .glass').forEach(el => { el.classList.add('opacity-0', 'translate-y-6', 'transition', 'duration-700'); io.observe(el); });
}

/* Back to top */
function setupBackToTop() {
    const btn = document.createElement('button'); btn.className = 'fixed right-6 bottom-6 p-3 rounded-full glass hidden focus-ring'; btn.id = 'back-to-top'; btn.innerText = '↑'; btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); document.body.appendChild(btn);
    window.addEventListener('scroll', () => { if (window.scrollY > 400) btn.classList.remove('hidden'); else btn.classList.add('hidden'); });
}

/* Optional: GitHub fetch (only if username provided) */
async function fetchGitHub() {
    if (!portfolio.github) return; try {
        const user = portfolio.github.replace('https://github.com/', '').replace('/', ''); const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=6`); const repos = await res.json(); // render briefly
        const container = document.createElement('div'); container.className = 'mt-4'; repos.slice(0, 6).forEach(r => { const a = document.createElement('a'); a.href = r.html_url; a.textContent = r.name; a.className = 'block text-sm text-gray-300'; container.appendChild(a); }); document.getElementById('dynamic-sections').appendChild(container);
    } catch (e) { console.error('GitHub fetch failed', e); }
}

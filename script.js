// theme toggle
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('star-theme') || 'dark';
html.setAttribute('data-theme', saved);

toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('star-theme', next);
});

// sticky nav shadow
const nav = document.getElementById('nav');

// hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// scroll reveal
const reveals = document.querySelectorAll('.glass-card, .section-header, .hero-content, .hero-visual, .step-arrow');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }});
}, { threshold: 0.15 });
reveals.forEach(el => { el.classList.add('reveal'); revealObs.observe(el); });

// counter animation
const counters = document.querySelectorAll('[data-target]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const dur = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObs.observe(el));

// card tilt on hover (subtle, professional)
const reducedTilt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedTilt) {
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// particles (canvas-based, much lighter than 30 DOM elements)
const pc = document.getElementById('particles');
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;width:100%;height:100%';
pc.replaceWith(canvas);
const ctx = canvas.getContext('2d');
const dots = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  for (let i = 0; i < 25; i++) {
    dots.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 0.5 + Math.random() * 1.5, speed: 0.2 + Math.random() * 0.5, opacity: 0.15 + Math.random() * 0.25 });
  }
  const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-500').trim() || '#6366f1';
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const d of dots) {
      d.y -= d.speed;
      if (d.y < -10) { d.y = canvas.height + 10; d.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = brandColor;
      ctx.globalAlpha = d.opacity;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// scroll spy with glow glider
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const glider = document.getElementById('navGlider');

function moveGlider(link) {
  if (!link || !glider) return;
  const r = link.getBoundingClientRect();
  const pr = link.parentElement.getBoundingClientRect();
  glider.style.left = (r.left - pr.left) + 'px';
  glider.style.width = r.width + 'px';
  glider.classList.add('visible');
}

window.addEventListener('scroll', () => {
  let current = '';
  const atBottom = (window.scrollY + window.innerHeight) >= (document.body.scrollHeight - 50);
  if (atBottom) {
    current = sections[sections.length - 1].id;
  } else {
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  }
  navLinkEls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  const active = document.querySelector('.nav-link.active');
  if (active) moveGlider(active); else glider.classList.remove('visible');
});

navLinkEls.forEach(l => {
  l.addEventListener('mouseenter', () => moveGlider(l));
  l.addEventListener('mouseleave', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) moveGlider(active); else glider.classList.remove('visible');
  });
});

// subtle tilt for feature cards (replaces vanilla-tilt, lighter)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 4;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -4;
      el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.01)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });
}

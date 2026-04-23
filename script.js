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

// card tilt on hover
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// particles
const pc = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const d = document.createElement('div');
  d.className = 'particle';
  d.style.left = Math.random() * 100 + '%';
  d.style.animationDuration = 8 + Math.random() * 12 + 's';
  d.style.animationDelay = Math.random() * 10 + 's';
  d.style.width = d.style.height = 1 + Math.random() * 2 + 'px';
  d.style.opacity = 0.15 + Math.random() * 0.25;
  pc.appendChild(d);
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

// vanilla tilt for feature cards (compact)
// credit: micku7zu/vanilla-tilt.js, MIT
(function(){function t(e,s={}){if(!(e instanceof Node))return;let o=Object.assign({reverse:!1,max:12,perspective:1e3,easing:"cubic-bezier(.03,.98,.52,.99)",scale:1,speed:300,glare:!1,"max-glare":1,reset:!0},s);for(let k in o)if(e.hasAttribute("data-tilt-"+k)){let v=e.getAttribute("data-tilt-"+k);try{o[k]=JSON.parse(v)}catch(_){o[k]=v}}let w=null,h=null,l=null,r=null,gw=null,ge=null;function pos(){let b=e.getBoundingClientRect();w=e.offsetWidth;h=e.offsetHeight;l=b.left;r=b.top}function upd(ev){let x=(ev.clientX-l)/w,y=(ev.clientY-r)/h;x=Math.min(Math.max(x,0),1);y=Math.min(Math.max(y,0),1);let tX=((o.reverse?-1:1)*(o.max-x*o.max*2)).toFixed(2),tY=((o.reverse?-1:1)*(y*o.max*2-o.max)).toFixed(2);e.style.transform=`perspective(${o.perspective}px) rotateX(${tY}deg) rotateY(${tX}deg) scale3d(${o.scale},${o.scale},${o.scale})`;if(ge){let a=Math.atan2(ev.clientX-(l+w/2),-(ev.clientY-(r+h/2)))*(180/Math.PI);ge.style.transform=`rotate(${a}deg) translate(-50%,-50%)`;ge.style.opacity=`${y*o["max-glare"]}`}}function rst(){e.style.transform=`perspective(${o.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;if(ge){ge.style.transform="rotate(180deg) translate(-50%,-50%)";ge.style.opacity="0"}}if(o.glare){gw=document.createElement("div");ge=document.createElement("div");gw.appendChild(ge);e.appendChild(gw);Object.assign(gw.style,{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",overflow:"hidden",pointerEvents:"none",borderRadius:"inherit"});Object.assign(ge.style,{position:"absolute",top:"50%",left:"50%",pointerEvents:"none",backgroundImage:"linear-gradient(0deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%)",width:w*2+"px",height:w*2+"px",transform:"rotate(180deg) translate(-50%,-50%)",transformOrigin:"0% 0%",opacity:"0"})}e.addEventListener("mouseenter",()=>{pos();e.style.transition=o.speed+"ms "+o.easing;if(ge)ge.style.transition=`opacity ${o.speed}ms ${o.easing}`});e.addEventListener("mousemove",upd);e.addEventListener("mouseleave",()=>{e.style.transition=o.speed+"ms "+o.easing;if(o.reset)requestAnimationFrame(rst)})}document.querySelectorAll("[data-tilt]").forEach(e=>t(e))})();

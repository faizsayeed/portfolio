document.addEventListener("DOMContentLoaded", () => {
  const roles = ["Data Analyst", "Web Developer", "Programmer", "Designer"];
  const el = document.getElementById("typewriter");

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    let current = roles[roleIndex];

    if (!deleting) {
      // typing effect
      el.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(type, 1000); // pause before deleting
        return;
      }
    } else {
      // deleting effect
      el.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(type, deleting ? 60 : 100); // speed
  }

  type();
});


// Reveal About section animation on scroll
document.addEventListener("DOMContentLoaded", () => {
  const aboutContainer = document.querySelector(".about-container");

  function revealAbout() {
    const rect = aboutContainer.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      aboutContainer.classList.add("show");
      window.removeEventListener("scroll", revealAbout);
    }
  }

  window.addEventListener("scroll", revealAbout);
  revealAbout();
});

function animateCounter(id) {
  const el = document.getElementById(id);
  const target = parseInt(el.getAttribute("data-target"));
  let val = 0;
  const speed = target / 40;

  function update() {
    if (val < target) {
      val += speed;
      el.textContent = Math.floor(val);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  update();
}

// Sticky-on-scroll navbar (append to script.js)
// - adds .fixed to .navbar when page scroll passes the navbar position
// - inserts a placeholder element with matching height to avoid layout jump

(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // create placeholder directly after navbar
  const placeholder = document.createElement('div');
  placeholder.className = 'navbar-placeholder';
  navbar.parentNode.insertBefore(placeholder, navbar.nextSibling);

  // compute initial offset and height
  let navOffsetTop = navbar.getBoundingClientRect().top + window.scrollY;
  let navHeight = navbar.offsetHeight;
  placeholder.style.height = navHeight + 'px';
  placeholder.style.display = 'none'; // keep hidden initially
  placeholder.style.pointerEvents = 'none';

  // store navbar height as CSS variable so CSS can use it
  document.documentElement.style.setProperty('--navbar-height', navHeight + 'px');

  function onScroll() {
    if (window.scrollY >= navOffsetTop + 5) { // +5 for tiny tolerance
      if (!navbar.classList.contains('fixed')) {
        navbar.classList.add('fixed');
        placeholder.classList.add('active');
      }
    } else {
      if (navbar.classList.contains('fixed')) {
        navbar.classList.remove('fixed');
        placeholder.classList.remove('active');
      }
    }
  }

  // update offsets on resize (important for responsive)
  function onResize() {
    navOffsetTop = navbar.getBoundingClientRect().top + window.scrollY;
    navHeight = navbar.offsetHeight;
    placeholder.style.height = navHeight + 'px';
    document.documentElement.style.setProperty('--navbar-height', navHeight + 'px');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  // run once to set initial state
  onScroll();
})();

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounter("pCount");
      animateCounter("techCount");
      animateCounter("qsCount");
      animateCounter("yearsCount");
    }
  }, { threshold: 0.4 });

  observer.observe(document.querySelector(".about-right-box"));
});


// --------- Animated count-up, sparkline draw, and progress fill ----------
function animateCountById(el, target, duration = 1100) {
  const start = 0;
  const end = parseInt(target, 10);
  const range = end - start;
  let startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const current = Math.floor(progress * range + start);
    el.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = end;
    }
  }
  requestAnimationFrame(step);
}

function revealAndAnimateRightBox() {
  const box = document.querySelector('.about-right-box.upgraded');
  if (!box) return;
  const rect = box.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    // animate tiles
    const tiles = box.querySelectorAll('.tile');
    tiles.forEach(tile => {
      const valueEl = tile.querySelector('.tile-value');
      const target = valueEl.dataset.target;
      animateCountById(valueEl, target, 1000);

      // sparkline animation
      const poly = tile.querySelector('.sparkline polyline');
      if (poly) {
        const total = poly.getTotalLength();
        poly.style.strokeDasharray = total;
        poly.style.strokeDashoffset = total;
        setTimeout(() => {
          poly.style.strokeDashoffset = 0;
        }, 200);
      }

      // progress bar
      const bar = tile.querySelector('.progress-fill');
      if (bar) {
        const pct = tile.dataset.progress || 60;
        setTimeout(() => {
          bar.style.width = pct + "%";
        }, 200);
      }
    });

    window.removeEventListener('scroll', revealAndAnimateRightBox);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  revealAndAnimateRightBox();
  window.addEventListener('scroll', revealAndAnimateRightBox);
});

// Interactive behavior for the radial + bars skills (click -> detail)
(function () {
  const SKILLS = {
  web: {
    title: "Web Development",
    percent: 70,
    desc: "Frontend and backend development with modern tools.",
    tools: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"]
  },

  datasci: {
    title: "Data Science",
    percent: 80,
    desc: "Data analysis, data cleaning, EDA, and machine learning basics.",
    tools: ["Python", "Pandas", "NumPy", "SQL", "Power BI", "ML Basics", "Data Wrangling"]
  },

  design: {
    title: "Design & UI",
    percent: 60,
    desc: "Visual design fundamentals and modern UI workflows.",
    tools: ["Canva", "Figma Basics", "Color Theory", "Logo Design", "UI Layouts"]
  },

  gamedev: {
    title: "Game Development",
    percent: 40,
    desc: "Creating simple games and understanding game engines.",
    tools: ["Unity", "C# Basics", "Sprite Animation", "Game UI", "Game Physics Basics"]
  }
};


  // helpers
  const radials = document.querySelectorAll('.radial');
  const bars = document.querySelectorAll('.bar-row');
  const detailCard = document.getElementById('skillDetail');
  const detailTitle = detailCard.querySelector('.detail-title');
  const detailDesc = detailCard.querySelector('.detail-desc');
  const toolsList = detailCard.querySelector('.tools-list');
  const detailPercentNum = detailCard.querySelector('.detail-percent-num');
  const detailFg = detailCard.querySelector('.detail-radial .radial-fg');

  // initialize radial SVG stroke lengths for all charts
  function prepareRadials() {
    document.querySelectorAll('.radial-chart .radial-fg').forEach(circle => {
      const r = circle.getAttribute('r') || 40;
      const circumference = 2 * Math.PI * r;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference; // hidden initially
    });
    // detail radial too
    if (detailFg) {
      const r = detailFg.getAttribute('r') || 40;
      const circumference = 2 * Math.PI * r;
      detailFg.style.strokeDasharray = `${circumference} ${circumference}`;
      detailFg.style.strokeDashoffset = circumference;
    }
  }

  // animate radial fill and percent inside an element
  function animateRadialAndNumber(circleEl, numberEl, percent, duration = 1200) {
  const r = circleEl.getAttribute('r') || 40;
  const circumference = 2 * Math.PI * r;

  // setup
  circleEl.style.strokeDasharray = `${circumference} ${circumference}`;
  circleEl.style.strokeDashoffset = circumference;

  // stroke animation
  requestAnimationFrame(() => {
    circleEl.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(.2,.9,.2,1)`;
    const offset = circumference - (percent / 100) * circumference;
    circleEl.style.strokeDashoffset = offset;
  });

  // number animation
  const start = 0;
  const end = percent;
  const startTime = performance.now();

  function update(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const cur = Math.floor(start + (end - start) * eased);
    numberEl.textContent = cur + "%";
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}


  // animate bar fill and value
  function animateBarFill(barRow, percent) {
    const fill = barRow.querySelector('.bar-fill');
    const val = barRow.querySelector('.bar-value');
    if (!fill) return;
    setTimeout(() => fill.style.width = percent + '%', 80);
    // numeric animation
    const start = 0;
    const dur = 900;
    const s = performance.now();
    (function tick(now) {
      const t = Math.min((now - s) / dur, 1);
      const cur = Math.floor(t * percent);
      val.textContent = cur + '%';
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  // when a skill is selected (key: excel/sql/...)
  function selectSkill(key) {
    if (!SKILLS[key]) return;
    const data = SKILLS[key];

    // mark active states
    radials.forEach(r => r.classList.toggle('active', r.dataset.key === key));
    bars.forEach(b => b.classList.toggle('active', b.dataset.key === key));

    // update detail texts
    detailTitle.textContent = data.title;
    detailDesc.textContent = data.desc;

    // populate tools
    toolsList.innerHTML = '';
    data.tools.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      toolsList.appendChild(li);
    });

    // animate detail radial + number
    const detailCircle = detailCard.querySelector('.detail-radial .radial-fg');
    animateRadialAndNumber(detailCircle, detailPercentNum, data.percent, 1000);

    // scroll detail into view a bit on mobile if needed
    detailCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // click/keyboard handlers
  function attachHandlers() {
    // radials
    radials.forEach(r => {
      r.addEventListener('click', () => {
        const key = r.dataset.key;
        const percent = parseInt(r.dataset.percent,10) || 0;
        // animate that radial's own chart too
        const circle = r.querySelector('.radial-fg');
        const numberEl = r.querySelector('.radial-value');
        animateRadialAndNumber(circle, numberEl, percent, 900);
        // also set detail panel
        selectSkill(key);
      });
      r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); r.click(); } });
    });

    // bars
    bars.forEach(b => {
      b.addEventListener('click', () => {
        const key = b.dataset.key;
        const percent = parseInt(b.dataset.percent,10) || 0;
        animateBarFill(b, percent);
        selectSkill(key);
      });
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } });
    });
  }

  // on scroll: when section appears, animate all radials & bars softly
 // === Animate all skills fully when section first enters view ===
function animateOnView() {
  const section = document.querySelector('.interactive-radial');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {

    // Animate radial circles 0 → full %
    document.querySelectorAll('.radial').forEach(r => {
      if (r.classList.contains('animated')) return; // only once

      const percent = parseInt(r.dataset.percent, 10) || 0;
      const circle = r.querySelector('.radial-fg');
      const numberEl = r.querySelector('.radial-value');

      animateRadialAndNumber(circle, numberEl, percent, 1200);
      r.classList.add('animated');
    });

    // Animate bars 0 → full %
    document.querySelectorAll('.bar-row').forEach(b => {
      if (b.classList.contains('animated')) return;

      const pct = parseInt(b.dataset.percent, 10) || 0;
      const fill = b.querySelector('.bar-fill');
      const val = b.querySelector('.bar-value');

      fill.style.width = '0%';
      setTimeout(() => fill.style.width = pct + '%', 80);

      // number animation
      let start = 0;
      let duration = 1000;
      const s = performance.now();
      (function tick(now) {
        const t = Math.min((now - s) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = Math.floor(eased * pct);
        val.textContent = cur + "%";
        if (t < 1) requestAnimationFrame(tick);
      })(performance.now());

      b.classList.add('animated');
    });

    // Preload detail panel with the first skill (no animation)
    const first = document.querySelector('.radial')?.dataset.key;
    if (first) selectSkill(first);

    window.removeEventListener('scroll', animateOnView);
  }
}


  // initialize
  prepareRadials();
  attachHandlers();
  document.addEventListener('DOMContentLoaded', animateOnView);
  window.addEventListener('scroll', animateOnView, { passive: true });
})();


/* WOSOL Cinematic Scroll — promo-film animations */
(function () {
  'use strict';

  const isDesktop = window.matchMedia('(min-width: 901px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll reveal via IntersectionObserver ── */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.cin-frame').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── 2. Parallax (desktop + no reduced-motion only) ── */
  if (isDesktop && !reducedMotion) {
    var scenes = Array.from(document.querySelectorAll('.cin-scene'));

    function updateParallax() {
      var vh = window.innerHeight;
      scenes.forEach(function (scene) {
        var rect = scene.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - vh / 2;
        var pct = Math.max(-1, Math.min(1, center / vh));
        var img = scene.querySelector('.cin-img');
        if (img) {
          img.style.transform = 'translateY(' + (pct * 5).toFixed(2) + '%) scale(1.06)';
        }
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ── 3. Scene progress sidebar — active dot ── */
  var dots = document.querySelectorAll('.cin-dot[data-target]');
  if (dots.length) {
    var progressObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var dot = document.querySelector('.cin-dot[data-target="' + entry.target.id + '"]');
          if (dot) {
            dot.classList.toggle('is-active', entry.isIntersecting);
          }
        });
      },
      { threshold: 0.35 }
    );

    document.querySelectorAll('.cin-scene[id]').forEach(function (scene) {
      progressObserver.observe(scene);
    });
  }

  /* ── 4. Opening sequence fade-in on load ── */
  var opening = document.querySelector('.cin-opening');
  if (opening) {
    opening.style.opacity = '0';
    opening.style.transform = 'translateY(28px)';
    opening.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        opening.style.opacity = '1';
        opening.style.transform = 'translateY(0)';
      });
    });
  }
}());

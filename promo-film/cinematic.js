/* WOSOL Cinematic Scroll — promo-film animations */
(function () {
  'use strict';

  var isDesktop = window.matchMedia('(min-width: 1061px)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll reveal: scene-frame and scene-copy ── */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.scene-frame, .scene-copy').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── 2. Subtle scale parallax (desktop only, no translateY — images are full height) ── */
  if (isDesktop && !reducedMotion) {
    var scenes = Array.from(document.querySelectorAll('.cinematic-scene'));

    function updateParallax() {
      var vh = window.innerHeight;
      scenes.forEach(function (scene) {
        var rect = scene.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - vh / 2;
        var pct = Math.abs(Math.max(-1, Math.min(1, center / vh)));
        var img = scene.querySelector('.scene-image-parallax img');
        if (img) {
          var scale = 1 + pct * 0.02;
          img.style.transform = 'scale(' + scale.toFixed(3) + ')';
        }
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ── 3. Scene progress fill ── */
  var progressFill = document.querySelector('.scene-progress-fill');
  var spine = document.querySelector('.story-spine');

  if (progressFill && spine) {
    function updateProgressFill() {
      var rect = spine.getBoundingClientRect();
      var total = spine.offsetHeight - window.innerHeight;
      var scrolled = -rect.top;
      var pct = Math.max(0, Math.min(1, scrolled / total));
      progressFill.style.transform = 'scaleY(' + pct + ')';
    }
    window.addEventListener('scroll', updateProgressFill, { passive: true });
    updateProgressFill();
  }

  /* ── 4. Scene progress sidebar — active dot ── */
  var dots = document.querySelectorAll('.scene-progress-dot[data-target]');
  if (dots.length) {
    var dotObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var dot = document.querySelector('.scene-progress-dot[data-target="' + entry.target.id + '"]');
          if (dot) {
            dot.classList.toggle('is-active', entry.isIntersecting);
          }
        });
      },
      { threshold: 0.35 }
    );

    document.querySelectorAll('.cinematic-scene[id]').forEach(function (scene) {
      dotObserver.observe(scene);
    });
  }

  /* ── 5. Opening sequence fade-in on load ── */
  var opening = document.querySelector('.opening-sequence');
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

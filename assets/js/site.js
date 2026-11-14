/* Small replacement for the WordPress/Astra/Elementor scripts the live site uses.
   Handles: mobile/desktop header switch, mobile menu toggle, lazy-loaded
   backgrounds, and the AddToAny share icons. */
(function () {
  var body = document.body;

  // Astra switches the header layout by adding classes to <body> at 921px.
  function setBreakpoint() {
    var mobile = window.innerWidth <= 921;
    body.classList.toggle('ast-header-break-point', mobile);
    body.classList.toggle('ast-desktop', !mobile);
    if (!mobile) closeMenu();
  }

  // Mobile "Menu" button.
  var content = document.querySelector('#ast-mobile-header .ast-mobile-header-content');
  var toggle = document.querySelector('#ast-mobile-header .menu-toggle');
  function closeMenu() {
    if (!toggle || !content) return;
    toggle.classList.remove('toggled');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('ast-main-header-nav-open');
    content.style.display = 'none';
  }
  if (toggle && content) {
    content.style.display = 'none';
    toggle.addEventListener('click', function () {
      var open = !toggle.classList.contains('toggled');
      toggle.classList.toggle('toggled', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.classList.toggle('ast-main-header-nav-open', open);
      content.style.display = open ? 'block' : 'none';
    });
  }

  setBreakpoint();
  window.addEventListener('resize', setBreakpoint);

  // Elementor hides section background images until its lazy-load script runs.
  document.querySelectorAll('.e-con.e-parent').forEach(function (el) {
    el.classList.add('e-lazyloaded');
  });

  // AddToAny normally injects its icons with a script from addtoany.com.
  var icons = {
    email: ['fas fa-envelope', '#888990'],
    facebook: ['fab fa-facebook-f', '#0866FF'],
    x: ['fab fa-x-twitter', '#1a1a1a'],
    linkedin: ['fab fa-linkedin-in', '#007BB5']
  };
  document.querySelectorAll('.a2a_kit a').forEach(function (a) {
    var key = Object.keys(icons).find(function (k) { return a.classList.contains('a2a_button_' + k); });
    var spec = key ? icons[key] : ['fas fa-plus', '#0166FF'];
    a.innerHTML = '<span class="local-a2a-icon" style="background:' + spec[1] + '"><i class="' + spec[0] + '"></i></span>';
  });
})();

/* Photo gallery: click a photo to see it larger; arrows / Esc to navigate. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.joc-gallery-item'));
  if (!links.length) return;
  var box = document.createElement('div');
  box.className = 'joc-lightbox';
  box.innerHTML = '<img alt=""><div class="joc-lb-caption"></div>' +
    '<button class="joc-lb-close" aria-label="Close">&times;</button>' +
    '<button class="joc-lb-prev" aria-label="Previous">&#8249;</button>' +
    '<button class="joc-lb-next" aria-label="Next">&#8250;</button>';
  document.body.appendChild(box);
  var img = box.querySelector('img'), cap = box.querySelector('.joc-lb-caption'), cur = 0;
  function show(i) {
    cur = (i + links.length) % links.length;
    var a = links[cur], alt = a.querySelector('img').alt;
    img.src = a.href; img.alt = alt;
    cap.textContent = alt + '  (' + (cur + 1) + ' of ' + links.length + ')';
    box.classList.add('open');
  }
  function close() { box.classList.remove('open'); }
  links.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); show(i); }); });
  box.querySelector('.joc-lb-close').onclick = close;
  box.querySelector('.joc-lb-prev').onclick = function (e) { e.stopPropagation(); show(cur - 1); };
  box.querySelector('.joc-lb-next').onclick = function (e) { e.stopPropagation(); show(cur + 1); };
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
})();

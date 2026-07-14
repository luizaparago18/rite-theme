document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-mobile-nav-toggle]');
  var nav = document.querySelector('.site-header__nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }
});

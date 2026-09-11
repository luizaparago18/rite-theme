document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-mobile-nav-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu automaticamente ao clicar em qualquer link dele
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // ---------- Carrossel do Hero ----------
  var carousels = document.querySelectorAll('[data-hero-carousel]');
  carousels.forEach(function (carousel) {
    var slides = carousel.querySelectorAll('[data-hero-slide]');
    var dots = carousel.querySelectorAll('[data-hero-dot]');
    var prevBtn = carousel.querySelector('[data-hero-prev]');
    var nextBtn = carousel.querySelector('[data-hero-next]');
    if (slides.length < 2) return;

    var current = 0;
    var autoplayDelay = parseInt(carousel.getAttribute('data-hero-autoplay'), 10) || 0;
    var timer = null;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      if (!autoplayDelay || reducedMotion) return;
      stopAutoplay();
      timer = setInterval(next, autoplayDelay);
    }
    function stopAutoplay() { if (timer) clearInterval(timer); }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Arrastar com o dedo (swipe) — principal forma de navegar no celular, já que as setas ficam ocultas ali
    var touchStartX = 0;
    var touchEndX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) { next(); } else { prev(); }
      }
      startAutoplay();
    }, { passive: true });

    startAutoplay();
  });

  // ---------- Galeria de produto (fotos + vídeos) ----------
  var galleries = document.querySelectorAll('[data-pdp-gallery]');
  galleries.forEach(function (gallery) {
    var slides = gallery.querySelectorAll('[data-pdp-slide]');
    var prevBtn = gallery.querySelector('[data-pdp-prev]');
    var nextBtn = gallery.querySelector('[data-pdp-next]');
    var counter = gallery.querySelector('[data-pdp-counter]');
    var thumbsWrap = gallery.parentElement.querySelector('[data-pdp-thumbs]');
    var thumbs = thumbsWrap ? thumbsWrap.querySelectorAll('[data-pdp-thumb]') : [];
    if (slides.length < 2) return;

    var current = 0;

    function goTo(index) {
      var video = slides[current].querySelector('video');
      if (video) video.pause();

      slides[current].classList.remove('is-active');
      if (thumbs[current]) thumbs[current].classList.remove('is-active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      if (thumbs[current]) thumbs[current].classList.add('is-active');
      if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () { goTo(i); });
    });

    // Arrastar com o dedo, útil quando tem muitas mídias (até 15)
    var touchStartX = 0;
    gallery.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    gallery.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
    }, { passive: true });
  });

  // ---------- Vídeos "veja na prática" — clique expande em tela cheia ----------
  // ---------- Vídeos "veja na prática" — setas de navegação ----------
  var ugcCarousels = document.querySelectorAll('[data-pdp-ugc-carousel]');
  ugcCarousels.forEach(function (carousel) {
    var track = carousel.querySelector('[data-pdp-ugc-track]');
    var prevBtn = carousel.querySelector('[data-pdp-ugc-prev]');
    var nextBtn = carousel.querySelector('[data-pdp-ugc-next]');
    if (!track) return;

    function scrollByItems() {
      var item = track.querySelector('.pdp-video-item');
      if (!item) return 300;
      var style = getComputedStyle(track);
      var gap = parseFloat(style.gap) || 10;
      return item.offsetWidth + gap;
    }

    if (nextBtn) nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: scrollByItems() * 2, behavior: 'smooth' });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -scrollByItems() * 2, behavior: 'smooth' });
    });
  });

  var ugcVideoWraps = document.querySelectorAll('[data-pdp-ugc-video]');
  ugcVideoWraps.forEach(function (wrap) {
    var video = wrap.querySelector('video');
    if (!video) return;

    wrap.addEventListener('click', function () {
      video.muted = false;
      video.controls = true;
      if (video.requestFullscreen) { video.requestFullscreen(); }
      else if (video.webkitEnterFullscreen) { video.webkitEnterFullscreen(); } // iOS Safari
      else if (video.webkitRequestFullscreen) { video.webkitRequestFullscreen(); }
    });

    function restoreThumbnailState() {
      var isFullscreen = document.fullscreenElement === video || document.webkitFullscreenElement === video;
      if (!isFullscreen) {
        video.muted = true;
        video.controls = false;
        video.play();
      }
    }
    document.addEventListener('fullscreenchange', restoreThumbnailState);
    document.addEventListener('webkitfullscreenchange', restoreThumbnailState);
    video.addEventListener('webkitendfullscreen', function () {
      video.muted = true;
      video.controls = false;
      video.play();
    });
  });
});

// ---------- Seleção de variante da PDP (novo layout: título > preço > compra > UGC > accordions) ----------
// Depende de window.riteProductVariants, definido inline pela seção main-product-rite.liquid
// com {{ product.variants | json }}. Não interfere em nada do bloco acima.
document.addEventListener('DOMContentLoaded', function () {
  var forms = document.querySelectorAll('[data-rite-product-form]');

  forms.forEach(function (form) {
    var selects = form.querySelectorAll('[data-option-index]');
    if (!selects.length) return;

    var variantIdInput = form.querySelector('[data-variant-id]');
    var buyButton = form.querySelector('[name="add"]');
    var buyButtonText = form.querySelector('[data-buy-button-text]');
    var productVariants = window.riteProductVariants || [];

    function getSelectedOptions() {
      var options = [];
      selects.forEach(function (select) {
        var index = parseInt(select.getAttribute('data-option-index'), 10);
        options[index] = select.value;
      });
      return options;
    }

    function findMatchingVariant(selectedOptions) {
      return productVariants.find(function (variant) {
        return variant.options.every(function (value, i) {
          return value === selectedOptions[i];
        });
      });
    }

    selects.forEach(function (select) {
      select.addEventListener('change', function () {
        var match = findMatchingVariant(getSelectedOptions());
        if (!match) return;

        if (variantIdInput) variantIdInput.value = match.id;
        if (buyButton) buyButton.disabled = !match.available;
        if (buyButtonText) {
          buyButtonText.textContent = match.available ? 'Adicionar ao carrinho' : 'Esgotado';
        }
      });
    });
  });
});

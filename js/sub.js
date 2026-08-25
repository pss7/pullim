$(function () {

  /* 새로고침 시 최상단 이동 */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const Lenis = window.Lenis;

  gsap.registerPlugin(ScrollTrigger);

  /* 부드러운 스크롤 */
  const lenis = new Lenis({
    lerp: 0.045,
    smoothWheel: true,
    wheelMultiplier: 0.75,
    syncTouch: false,
    respectReducedMotion: false
  });

  window.lenis = lenis;

  lenis.on(
    'scroll',
    ScrollTrigger.update
  );

  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  /* AOS */
  AOS.init({
    duration: 1500,
    easing: 'ease-out-cubic',
    once: true
  });

  /* 상단 타이틀 로드 모션 */
  const $subTopBox = $('.subTopBox');

  $subTopBox.removeClass('active');

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      $subTopBox.addClass('active');
    });
  });

  /* 위치 다시 계산 */
  function refreshMotion() {
    lenis.resize();
    AOS.refresh();
    ScrollTrigger.refresh();
  }

  requestAnimationFrame(
    refreshMotion
  );

  if (
    document.readyState !==
    'complete'
  ) {
    $(window).one(
      'load',
      refreshMotion
    );
  }

});
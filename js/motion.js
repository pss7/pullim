$(function () {

  /* 페이지 새로고침 시 최상단 이동 */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);

  /* 라이브러리 연결 */
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

  /* Lenis와 ScrollTrigger 연결 */
  lenis.on('scroll', ScrollTrigger.update);

  /* GSAP 프레임에서 Lenis 실행 */
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });

  /* 프레임 지연 보정 해제 */
  gsap.ticker.lagSmoothing(0);

  /* 소개페이지 두 번째 섹션 올리기 */
  const $aboutTopBox = $('.aboutWrap .subTopBox');

  if ($aboutTopBox.length) {
    ScrollTrigger.create({
      id: 'about-top-reveal',
      trigger: $aboutTopBox.get(0),
      start: 'top top',

      end: function () {
        return '+=' + $aboutTopBox.outerHeight();
      },

      pin: $aboutTopBox.get(0),
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true
    });
  }

  /* 한 줄씩 올라오는 텍스트 */
  $('.scrollRevealGroup').each(function () {
    const $group = $(this);

    const texts = $group
      .find('.scrollRevealText')
      .toArray();

    if (!texts.length) {
      return;
    }

    gsap.set(texts, {
      yPercent: 120,
      visibility: 'visible'
    });

    ScrollTrigger.create({
      trigger: $group.get(0),
      start: 'top 90%',
      once: true,

      onEnter: function () {
        gsap.to(texts, {
          yPercent: 0,
          duration: 1.5,
          stagger: 0.07,
          ease: 'power4.out',
          overwrite: 'auto',
          force3D: true
        });
      }
    });
  });

  /* AOS 초기화 */
  AOS.init({
    duration: 1500,
    easing: 'ease-out-cubic',
    once: true
  });

  /* 서브 상단 로드 모션 */
  const $subTopBox = $('.subTopBox');

  if ($subTopBox.length) {
    $subTopBox.removeClass('active');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        $subTopBox.addClass('active');
      });
    });
  }

  /* 이미지 로드 후 위치 계산 */
  $(window).on('load', function () {
    AOS.refresh();
    ScrollTrigger.refresh();
  });

});
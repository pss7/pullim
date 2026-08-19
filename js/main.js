$(function () {

  // Lenis
  history.scrollRestoration = 'manual';

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);


  // 비주얼 영역
  const visualVideo = document.querySelector(
    '#visualWrap .visualVideoBox img'
  );

  const visualTexts = document.querySelectorAll(
    '#visualWrap .visualText'
  );


  // 로드
  $(window).on('load', function () {

    // 스크롤 위치 초기화
    lenis.scrollTo(0, {
      immediate: true
    });

    // 비디오 진입
    const $video = $('#visualWrap .visualVideoBox img');

    $video.addClass('active');

    // 진입 모션 종료 후 스크롤 모션
    setTimeout(function () {

      $video.addClass('scrollMotion');

    }, 1300);

  });


  // 비주얼 스크롤
  lenis.on('scroll', function ({ scroll }) {

    const visualHeight = window.innerHeight;

    // 스크롤 진행도
    let progress = scroll / visualHeight;

    progress = Math.max(0, Math.min(progress, 1));


    // 비디오 효과
    const videoScale =
      1 - (progress * 0.3);

    visualVideo.style.transform =
      `scale(${videoScale})`;

    // 텍스트 01
    setVisualText(
      visualTexts[0],
      progress,
      0.05,
      0.25
    );

    // 텍스트 02
    setVisualText(
      visualTexts[1],
      progress,
      0.30,
      0.50
    );

    // 텍스트 03
    setVisualText(
      visualTexts[2],
      progress,
      0.55,
      0.75
    );

  });


  // 텍스트 스크롤 효과
  function setVisualText(element, progress, start, end) {

    // 텍스트 진행도
    let textProgress =
      (progress - start) / (end - start);

    textProgress =
      Math.max(0, Math.min(textProgress, 1));

    // 아래에서 위로 이동
    const translateY =
      100 * (1 - textProgress);

    // 투명도
    const opacity = textProgress;

    // 적용
    element.style.transform =
      `translateY(${translateY}px)`;

    element.style.opacity =
      opacity;

    element.style.visibility =
      textProgress > 0 ? 'visible' : 'hidden';

  }














  // 스크롤 시 해당 영역 active 클래스 적용
  $(window).scroll(function () {

    const scrollPos = $(window).scrollTop();
    const windowHeight = $(window).height();

    $('.sectionWrap').each(function () {

      const $this = $(this);

      if ($this.hasClass('active')) {
        return;
      }

      const elementOffset = $this.offset().top;

      if (scrollPos + windowHeight * 0.6 > elementOffset) {
        $this.addClass('active');
      }

    });

  });



});
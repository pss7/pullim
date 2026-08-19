$(function () {

  // Lenis
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // 요소
  const $visual = $('#visualWrap');
  const $image = $('#visualWrap .visualVideoBox img');
  const $texts = $('#visualWrap .visualText');
  const $about = $('#aboutWrap');

  // 상태
  let step = 0;
  let lastScroll = 0;
  let imageDone = false;
  let textDone = false;
  let aboutStart = 0;

  // 초기 설정
  $(window).on('load', function () {

    lenis.scrollTo(0, { immediate: true });

    $image.css({
      transition: 'none',
      opacity: 1
    });

    $texts.css({
      transition: 'none',
      opacity: 0,
      visibility: 'hidden',
      transform: 'translate3d(0, 100px, 0)'
    });

    $about.css({
      transition: 'none',
      opacity: 0
    }).removeClass('show');

    $image.addClass('active');

    setTimeout(function () {
      $image.addClass('scrollMotion');
    }, 1300);

    lastScroll = lenis.scroll;
  });

  // 스크롤
  lenis.on('scroll', function ({ scroll }) {

    const visualProgress = progress(
      scroll,
      $visual.offset().top,
      $visual.outerHeight() - window.innerHeight
    );

    const down = scroll > lastScroll;
    const up = scroll < lastScroll;

    // 비주얼
    if (step === 0) {
      visualMotion(visualProgress);
    }

    // 아래로 스크롤
    if (down) {

      if (step === 0 && visualProgress >= 0.6) {
        imageOut();
      }

      else if (step === 1 && imageDone) {
        textOut();
      }

      else if (step === 2 && textDone) {
        aboutIn();
      }
    }

    // 위로 스크롤
    if (up) {

      // ABOUT → TEXT
      if (step === 3) {

        aboutMotion(scroll);

        // ABOUT 시작점까지 올라오면 TEXT 복귀
        if (scroll <= aboutStart) {
          aboutOut();
          step = 2;
          textIn();
        }
      }

      // TEXT → IMAGE
      else if (step === 2) {
        textIn();
      }

      // IMAGE → 기본 비주얼
      else if (step === 1 && visualProgress < 0.6) {
        imageIn();
      }
    }

    // ABOUT 스크롤
    if (step === 3) {
      aboutMotion(scroll);
    }


    lastScroll = scroll;
  });

  // 진행률 계산
  function progress(scroll, start, distance) {
    return Math.max(
      0,
      Math.min((scroll - start) / distance, 1)
    );
  }

  // 비주얼 모션
  function visualMotion(progress) {

    let p = progress / 0.6;
    p = Math.max(0, Math.min(p, 1));

    // 이미지
    $image.css({
      transition: 'none',
      transform: `scale(${1 - p * 0.3})`,
      opacity: 1
    });

    // 텍스트
    $texts.each(function (i) {

      const start = [0.05, 0.30, 0.55][i];
      const end = [0.25, 0.50, 0.75][i];

      let textP = (p - start) / (end - start);
      textP = Math.max(0, Math.min(textP, 1));

      $(this).css({
        transition: 'none',
        transform: `translateY(${100 * (1 - textP)}px)`,
        opacity: textP,
        visibility: textP > 0 ? 'visible' : 'hidden'
      });
    });
  }

  // 이미지 사라짐
  function imageOut() {

    if (step !== 0) return;

    step = 1;
    imageDone = false;

    $image.css({
      transition: 'opacity 0.7s ease',
      opacity: 0
    });

    setTimeout(function () {
      imageDone = true;
    }, 700);
  }

  // 이미지 다시 등장
  function imageIn() {

    step = 0;
    imageDone = false;

    $image.css({
      transition: 'opacity 0.7s ease',
      opacity: 1
    });
  }

  // 텍스트 아래로 떨어짐
  function textOut() {

    if (step !== 1) return;

    step = 2;
    textDone = false;

    const move = [
      '-70px, 900px',
      '110px, 1050px',
      '-130px, 1250px'
    ];

    const rotate = [10, -13, 16];

    $texts.each(function (i) {

      $(this).css({
        visibility: 'visible',
        transition: 'transform 0.65s cubic-bezier(.72,0,.18,1), opacity 0.4s ease',
        transform: `translate3d(${move[i]},0) rotate(${rotate[i]}deg)`,
        opacity: 0
      });
    });

    setTimeout(function () {
      textDone = true;
    }, 750);
  }

  // 텍스트 원위치
  function textIn() {

    if (step < 2) return;

    step = 1;
    textDone = false;

    $texts.css({
      visibility: 'visible',
      transition: 'transform 0.65s cubic-bezier(.22,1,.36,1), opacity 0.4s ease',
      transform: 'translate3d(0,0,0) rotate(0deg)',
      opacity: 1
    });
  }

  // ABOUT 등장
  function aboutIn() {

    if (step !== 2 || !textDone) return;

    step = 3;
    aboutStart = lenis.scroll;

    $about
      .addClass('show')
      .css({
        transition: 'opacity 1.2s cubic-bezier(.22,1,.36,1)',
        opacity: 1
      });
  }

  // ABOUT 사라짐
  function aboutOut() {

    $about.css({
      transition: 'opacity 0.7s ease',
      opacity: 0
    });

    setTimeout(function () {
      $about.removeClass('show');
    }, 700);
  }

  // ABOUT 스크롤
  function aboutMotion(scroll) {

    let p = (scroll - aboutStart) / 800;
    p = Math.max(0, Math.min(p, 1));

    const move = 1 - p;

    $about.find('.aboutTitleBox h2 strong:nth-child(1)')
      .css('transform', `translateX(${-window.innerWidth * move}px)`);

    $about.find('.aboutTitleBox h2 strong:nth-child(3)')
      .css('transform', `translateX(${window.innerWidth * move}px)`);

    $about.find('.aboutTitleBox > span')
      .css('transform', `translateY(${-100 * move}px)`);

    $about.find('.aboutViewLink')
      .css('transform', `translateY(${120 * move}px)`);

    $about.find('.aboutContent01')
      .css('transform', `translateY(${180 * move}px)`);

    $about.find('.aboutContent02')
      .css('transform', `translateY(${260 * move}px)`);
  }

});
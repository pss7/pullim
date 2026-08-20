$(function () {

  /* =========================================================
     새로고침 상단
  ========================================================= */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);





















  /* =========================================================
     LENIS
  ========================================================= */

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    autoRaf: true
  });


  /* =========================================================
     ELEMENT
  ========================================================= */

  const $visual = $('#visualWrap');
  const $aboutSection = $('#aboutSection');
  const $about = $('#aboutWrap');
  const $project = $('#projectWrap');
  const $company = $('#companyInfoWrap');
  const $contact = $('#contactWrap');


  const $aboutTitle = $about.find('.aboutTitleBox');
  const $aboutTitleLabel = $about.find('.aboutTitleBox > span');
  const $aboutTitleStrong = $about.find('.aboutTitleBox h2 strong');
  const $aboutView = $about.find('.aboutViewLink');

  const $aboutText01 = $about.find('.aboutText01');
  const $aboutText02 = $about.find('.aboutText02');


  const $projectTitle = $project.find('.projectTitleBox');
  const $projectList = $project.find('.projectList');


  const $companyVisualContent =
    $company.find('.companyVisualContentBox');


  const $contactTitle =
    $contact.find('.contactTitleBox h2');


  /* =========================================================
     초기값
  ========================================================= */

  /* ---------------------------------------------------------
     ABOUT
  --------------------------------------------------------- */

  $about.css({
    opacity: 0,
    visibility: 'hidden'
  });


  /*
   * [ WHO WE ARE ]
   */
  $aboutTitleLabel.css({
    opacity: 0,
    transform: 'translate3d(0, 40px, 0)'
  });


  /*
   * A NEW STANDARD
   * 왼쪽에서 시작
   */
  $aboutTitleStrong.eq(0).css({
    opacity: 0,
    transform: 'translate3d(-180px, 0, 0)'
  });


  /*
   * IN ADTECH
   * 오른쪽에서 시작
   */
  $aboutTitleStrong.eq(1).css({
    opacity: 0,
    transform: 'translate3d(180px, 0, 0)'
  });


  /*
   * Detail view
   */
  $aboutView.css({
    opacity: 0,
    transform: 'translate3d(0, 40px, 0)'
  });


  /*
   * ABOUT TEXT
   * 아래에서 시작
   */
  $aboutText01.css({
    opacity: 0,
    transform: 'translate3d(0, 180px, 0)'
  });


  $aboutText02.css({
    opacity: 0,
    transform: 'translate3d(0, 180px, 0)'
  });


  /* ---------------------------------------------------------
     PROJECT
  --------------------------------------------------------- */

  $projectList.css({
    opacity: 0,
    transform: 'translate3d(300px, 0, 0)'
  });


  /* ---------------------------------------------------------
     COMPANY
  --------------------------------------------------------- */

  $companyVisualContent.css({
    opacity: 0,
    transform: 'translate3d(0, 350px, 0)'
  });


  /* ---------------------------------------------------------
     CONTACT
  --------------------------------------------------------- */

  $contactTitle.css({
    transform: 'scale(0.35)',
    transformOrigin: 'left center'
  });


  /* =========================================================
     LENIS SCROLL
  ========================================================= */

  lenis.on('scroll', ({ scroll }) => {

    const vh = window.innerHeight;

    /* =====================================================
       01. VISUAL
    ===================================================== */

    const visualTop = $visual.offset().top;
    const visualHeight = $visual.outerHeight();

    const visualStart = visualTop;
    const visualEnd = visualTop + visualHeight;


    /* =====================================================
       VISUAL 전체 진행률
    ===================================================== */

    let visualProgress =
      (scroll - visualStart) /
      (visualEnd - visualStart);

    visualProgress = Math.max(
      0,
      Math.min(1, visualProgress)
    );


    /* =====================================================
       IMAGE
    ===================================================== */

    /*
     * 처음
     * 30vw × 64vw
     *
     * 스크롤
     * ↓
     *
     * 최종
     * 15vw × 32vw
     */

    let imageProgress =
      visualProgress / 0.75;

    imageProgress = Math.max(
      0,
      Math.min(1, imageProgress)
    );

    const imageEase =
      1 - Math.pow(1 - imageProgress, 3);

    /* =====================================================
   VISUAL TEXT 01
   BUILDING
===================================================== */

    let visual01Progress =
      visualProgress / 0.25;

    visual01Progress = Math.max(
      0,
      Math.min(1, visual01Progress)
    );

    const visual01Ease =
      1 - Math.pow(1 - visual01Progress, 3);


    /*
     * 아래에서 올라옴
     */
    const visual01Y =
      120 - (120 * visual01Ease);


    /*
     * 처음 크게 → 원래 크기
     */
    const visual01Scale =
      1.25 - (0.25 * visual01Ease);


    $visual.find('.visualText01').css({
      opacity: visual01Ease,
      transform:
        `translate3d(0, ${visual01Y}px, 0) scale(${visual01Scale})`
    });


    /* =====================================================
       VISUAL TEXT 02
       BETTER / FUTURE
    ===================================================== */

    let visual02Progress =
      (visualProgress - 0.25) / 0.25;

    visual02Progress = Math.max(
      0,
      Math.min(1, visual02Progress)
    );

    const visual02Ease =
      1 - Math.pow(1 - visual02Progress, 3);


    const visual02Y =
      120 - (120 * visual02Ease);


    const visual02Scale =
      1.15 - (0.15 * visual02Ease);


    $visual.find('.visualText02').css({
      opacity: visual02Ease,
      transform:
        `translate3d(0, ${visual02Y}px, 0) scale(${visual02Scale})`
    });

    /* =====================================================
       VISUAL TEXT 03
       WITH / ADTECH
    ===================================================== */

    let visual03Progress =
      (visualProgress - 0.50) / 0.25;

    visual03Progress = Math.max(
      0,
      Math.min(1, visual03Progress)
    );

    const visual03Ease =
      1 - Math.pow(1 - visual03Progress, 3);


    const visual03Y =
      120 - (120 * visual03Ease);


    const visual03Scale =
      1.15 - (0.15 * visual03Ease);


    $visual.find('.visualText03').css({
      opacity: visual03Ease,
      transform:
        `translate3d(0, ${visual03Y}px, 0) scale(${visual03Scale})`
    });

    /* =====================================================
       VISUAL VIDEO
       80% → 최종 크기
    ===================================================== */

    const $video = $visual.find('.visualVideoBox video');

    const videoStyle = getComputedStyle($video[0]);

    const endWidth = parseFloat(
      videoStyle.getPropertyValue('--video-end-width')
    );

    const endHeight = parseFloat(
      videoStyle.getPropertyValue('--video-end-height')
    );


    /*
     * 시작 크기
     * 부모 영역의 80%
     */

    const startWidth =
      $video.parent().width() * 0.8;

    const startHeight =
      $video.parent().height() * 0.8;


    /*
     * 진행률
     */

    const videoProgress = imageEase;


    /*
     * 최종 크기
     */

    const videoWidth =
      startWidth +
      (
        (endWidth / 100) * window.innerWidth -
        startWidth
      ) * videoProgress;

    const videoHeight =
      startHeight +
      (
        (endHeight / 100) * window.innerWidth -
        startHeight
      ) * videoProgress;


    /*
     * 실제 적용
     */

    $video.css({
      width: `${videoWidth}px`,
      height: `${videoHeight}px`
    });

    /* =====================================================
   02. ABOUT
===================================================== */

    const aboutTop = $aboutSection.offset().top;

    /*
     * #aboutSection = 200vh
     *
     * About이 화면에 들어오는 순간
     * sticky가 시작됨
     *
     * 0 ~ 200vh
     * → About 내부 스크롤 애니메이션
     *
     * 200vh가 끝나야
     * → 다음 Section으로 이동
     */

    const aboutStart = aboutTop;
    const aboutEnd = aboutTop + (vh * 2);


    /* =====================================================
       ABOUT 이전
    ===================================================== */

    if (scroll < aboutStart) {

      $about.css({
        opacity: 0,
        visibility: 'hidden'
      });


      /* WHO WE ARE */

      $aboutTitleLabel.css({
        opacity: 0,
        transform: 'translate3d(0, 40px, 0)'
      });


      /* A NEW STANDARD */

      $aboutTitleStrong.eq(0).css({
        opacity: 0,
        transform: 'translate3d(-180px, 0, 0)'
      });


      /* IN ADTECH */

      $aboutTitleStrong.eq(1).css({
        opacity: 0,
        transform: 'translate3d(180px, 0, 0)'
      });


      /* DETAIL */

      $aboutView.css({
        opacity: 0,
        transform: 'translate3d(0, 40px, 0)'
      });


      /* TEXT 01 */

      $aboutText01.css({
        opacity: 0,
        transform: 'translate3d(0, 180px, 0)'
      });


      /* TEXT 02 */

      $aboutText02.css({
        opacity: 0,
        transform: 'translate3d(0, 180px, 0)'
      });

    }


    /* =====================================================
       ABOUT
    ===================================================== */

    else if (
      scroll >= aboutStart &&
      scroll < aboutEnd
    ) {

      /*
       * About은 진입하자마자
       * 바로 페이드인
       */

      $about.css({
        opacity: 1,
        visibility: 'visible'
      });


      /*
       * About 전체 진행률
       *
       * 0 = About 진입
       * 1 = About 영역 종료
       */

      let aboutProgress =
        (scroll - aboutStart) /
        (aboutEnd - aboutStart);


      aboutProgress = Math.max(
        0,
        Math.min(1, aboutProgress)
      );


      /* =================================================
         01. WHO WE ARE
      ================================================= */

      let labelProgress =
        aboutProgress / 0.15;

      labelProgress = Math.max(
        0,
        Math.min(1, labelProgress)
      );


      const labelEase =
        1 - Math.pow(1 - labelProgress, 3);


      $aboutTitleLabel.css({
        opacity: labelEase,
        transform:
          `translate3d(0, ${40 - (40 * labelEase)}px, 0)`
      });


      /* =================================================
         02. TITLE
      ================================================= */

      let titleProgress =
        (aboutProgress - 0.08) / 0.32;

      titleProgress = Math.max(
        0,
        Math.min(1, titleProgress)
      );


      const titleEase =
        1 - Math.pow(1 - titleProgress, 3);


      /*
       * A NEW STANDARD
       * 왼쪽 → 원위치
       */

      const titleLeftX =
        -180 + (180 * titleEase);


      $aboutTitleStrong.eq(0).css({
        opacity: titleEase,
        transform:
          `translate3d(${titleLeftX}px, 0, 0)`
      });


      /*
       * IN ADTECH
       * 오른쪽 → 원위치
       */

      const titleRightX =
        180 - (180 * titleEase);


      $aboutTitleStrong.eq(1).css({
        opacity: titleEase,
        transform:
          `translate3d(${titleRightX}px, 0, 0)`
      });


      /* =================================================
         03. DETAIL VIEW
      ================================================= */

      let viewProgress =
        (aboutProgress - 0.30) / 0.20;

      viewProgress = Math.max(
        0,
        Math.min(1, viewProgress)
      );


      const viewEase =
        1 - Math.pow(1 - viewProgress, 3);


      $aboutView.css({
        opacity: viewEase,
        transform:
          `translate3d(0, ${40 - (40 * viewEase)}px, 0)`
      });


      /* =================================================
         04. TEXT 01
      ================================================= */

      let text01Progress =
        (aboutProgress - 0.45) / 0.20;

      text01Progress = Math.max(
        0,
        Math.min(1, text01Progress)
      );


      const text01Ease =
        1 - Math.pow(1 - text01Progress, 3);


      const text01Y =
        180 - (180 * text01Ease);


      $aboutText01.css({
        opacity: text01Ease,
        transform:
          `translate3d(0, ${text01Y}px, 0)`
      });


      /* =================================================
         05. TEXT 02
      ================================================= */

      let text02Progress =
        (aboutProgress - 0.65) / 0.25;

      text02Progress = Math.max(
        0,
        Math.min(1, text02Progress)
      );


      const text02Ease =
        1 - Math.pow(1 - text02Progress, 3);


      const text02Y =
        180 - (180 * text02Ease);


      $aboutText02.css({
        opacity: text02Ease,
        transform:
          `translate3d(0, ${text02Y}px, 0)`
      });

    }


    /* =====================================================
       ABOUT 종료
    ===================================================== */

    else {

      /*
       * 여기까지 왔다는 것은
       *
       * #aboutSection의 200vh가
       * 전부 지나갔다는 뜻
       *
       * 따라서 About 내부 요소는
       * 최종 위치에 고정
       */

      $about.css({
        opacity: 1,
        visibility: 'visible'
      });


      $aboutTitleLabel.css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });


      $aboutTitleStrong.eq(0).css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });


      $aboutTitleStrong.eq(1).css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });


      $aboutView.css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });


      $aboutText01.css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });


      $aboutText02.css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });

    }

    /* =====================================================
       03. PROJECT
    ===================================================== */

    const projectTop =
      $project.offset().top;


    /*
     * Project 진입 애니메이션 구간
     */

    const projectStart =
      projectTop - vh * 0.7;


    const projectEnd =
      projectTop + vh * 0.3;


    /* =====================================================
       Project 진입 전
    ===================================================== */

    if (scroll < projectStart) {

      $projectTitle.css({
        opacity: 0,
        transform: 'translate3d(-500px, 0, 0)'
      });


      $projectList.css({
        opacity: 0,
        transform: 'translate3d(500px, 0, 0)'
      });

    }


    /* =====================================================
       Project 진입
    ===================================================== */

    else if (
      scroll >= projectStart &&
      scroll < projectEnd
    ) {

      let progress =
        (scroll - projectStart) /
        (projectEnd - projectStart);


      progress = Math.max(
        0,
        Math.min(1, progress)
      );


      const ease =
        1 - Math.pow(1 - progress, 3);


      /*
       * 제목
       * 왼쪽 → 원위치
       */

      const titleX =
        -300 + (300 * ease);


      $projectTitle.css({
        opacity: ease,
        transform:
          `translate3d(${titleX}px, 0, 0)`
      });


      /*
       * 프로젝트 목록
       * 오른쪽 → 원위치
       */

      const listX =
        300 - (300 * ease);


      $projectList.css({
        opacity: ease,
        transform:
          `translate3d(${listX}px, 0, 0)`
      });

    }


    /* =====================================================
       Project 완료
    ===================================================== */

    else {

      $projectTitle.css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });


      $projectList.css({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      });

    }


    /* =====================================================
       04. COMPANY
    ===================================================== */

    const companyTop =
      $company.offset().top;


    const companyStart =
      companyTop - vh * 0.8;


    const companyEnd =
      companyTop;


    /* =====================================================
       Company 진입 전
    ===================================================== */

    if (scroll < companyStart) {

      $companyVisualContent.css({
        opacity: 0,
        transform:
          'translate3d(0, 250px, 0)'
      });

    }


    /* =====================================================
       Company 진입
    ===================================================== */

    else if (
      scroll >= companyStart &&
      scroll < companyEnd
    ) {

      let progress =
        (scroll - companyStart) /
        (companyEnd - companyStart);


      progress = Math.max(
        0,
        Math.min(1, progress)
      );


      const ease =
        1 - Math.pow(1 - progress, 3);


      const contentY =
        250 - (250 * ease);


      $companyVisualContent.css({
        opacity: ease,
        transform:
          `translate3d(0, ${contentY}px, 0)`
      });

    }


    /* =====================================================
       Company 완료
    ===================================================== */

    else {

      $companyVisualContent.css({
        opacity: 1,
        transform:
          'translate3d(0, 0, 0)'
      });

    }


    /* =====================================================
       05. CONTACT
    ===================================================== */

    const contactTop =
      $contact.offset().top;


    const contactStart =
      contactTop - vh;


    const contactEnd =
      contactTop;


    let contactProgress =
      (scroll - contactStart) /
      (contactEnd - contactStart);


    contactProgress = Math.max(
      0,
      Math.min(1, contactProgress)
    );


    const contactScale =
      0.35 +
      (1 - 0.35) * contactProgress;


    $contactTitle.css(
      'transform',
      `scale(${contactScale})`
    );


    /* =====================================================
       Contact 이전
    ===================================================== */

    if (scroll < contactStart) {

      $contactTitle.css(
        'transform',
        'scale(0.35)'
      );

    }


    /* =====================================================
       Contact 도착 이후
    ===================================================== */

    if (scroll >= contactEnd) {

      $contactTitle.css(
        'transform',
        'scale(1)'
      );

    }

  });

});
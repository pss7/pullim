$(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    autoRaf: true
  });


  /* =========================
     VISUAL
  ========================= */

  const visualWrap =
    document.querySelector('#visualWrap');

  const visualBox =
    document.querySelector('#visualWrap .visualBox');

  const popupContentBox =
    document.querySelector('#popupContentBox');

  const proposalDownloadBtn =
    document.querySelector('.proposalDownloadBtn');

  let visualStep = 0;
  let visualAnimating = false;

  setTimeout(function () {
    if (visualBox) {
      visualBox.classList.add('active');
    }
  }, 100);


  /* =========================
     PROJECT
  ========================= */

  const projectWrap =
    document.querySelector('#projectWrap');

  const projectContainer =
    projectWrap
      ? projectWrap.querySelector('.container')
      : null;

  const projectList =
    document.querySelector(
      '#projectWrap .projectList'
    );

  const projectItems = Array.from(
    document.querySelectorAll(
      '#projectWrap .projectList li'
    )
  );

  const PROJECT_BREAKPOINT = 768;
  const PROJECT_DURATION = 800;
  const PROJECT_STEP_HEIGHT = 700;

  const CARD_WIDTH = 600;
  const PREV_WIDTH = 300;
  const CARD_VISIBLE = 60;
  const RIGHT_GAP = 60;

  let projectStep = -1;
  let projectAnimating = false;
  let projectMode = false;
  let projectLeaving = false;
  let lastCardReady = false;
  let projectExitRequested = false;
  let projectFreeScroll = false;


  function isProjectDesktop() {
    return window.innerWidth > PROJECT_BREAKPOINT;
  }


  function resetProjectInlineStyles() {
    projectItems.forEach(function (item) {
      item.classList.remove(
        'current',
        'prev'
      );

      item.style.removeProperty('width');
      item.style.removeProperty('transform');
      item.style.removeProperty('z-index');
    });
  }


  function setProjectHeight() {
    if (!projectWrap) {
      return;
    }

    if (
      !isProjectDesktop() ||
      projectItems.length === 0
    ) {
      projectWrap.style.removeProperty(
        'height'
      );

      return;
    }

    const stepCount =
      Math.max(
        projectItems.length - 1,
        0
      );

    projectWrap.style.height =
      window.innerHeight +
      stepCount * PROJECT_STEP_HEIGHT +
      'px';

    if (typeof lenis.resize === 'function') {
      lenis.resize();
    }
  }


  function updateProject() {
    if (
      !projectList ||
      !isProjectDesktop()
    ) {
      return;
    }

    const listWidth =
      projectList.clientWidth;

    const cardWidth =
      Math.min(
        CARD_WIDTH,
        Math.max(
          listWidth - RIGHT_GAP,
          0
        )
      );

    const currentX =
      Math.max(
        listWidth -
          cardWidth -
          RIGHT_GAP,
        0
      );

    projectItems.forEach(function (item, index) {
      /* 아직 등장하지 않은 카드 */
      if (index > projectStep) {
        item.classList.remove(
          'current',
          'prev'
        );

        item.style.width =
          cardWidth + 'px';

        item.style.transform =
          `translate3d(${listWidth}px, 0, 0)`;

        item.style.zIndex = '1';

        return;
      }

      /* 현재 카드 */
      if (index === projectStep) {
        item.classList.remove('prev');
        item.classList.add('current');

        item.style.width =
          cardWidth + 'px';

        item.style.transform =
          `translate3d(${currentX}px, 0, 0)`;

        item.style.zIndex = '100';

        return;
      }

      /* 이전 카드 */
      item.classList.remove('current');
      item.classList.add('prev');

      item.style.width =
        Math.min(
          PREV_WIDTH,
          cardWidth
        ) + 'px';

      item.style.transform =
        `translate3d(${index * CARD_VISIBLE}px, 0, 0)`;

      item.style.zIndex =
        String(index + 10);
    });
  }


  function isProjectPinned() {
    if (
      !projectWrap ||
      !isProjectDesktop() ||
      projectItems.length === 0
    ) {
      return false;
    }

    const rect =
      projectWrap.getBoundingClientRect();

    return (
      rect.top <= 1 &&
      rect.bottom >=
        window.innerHeight - 1
    );
  }


function enterProject() {
  if (projectMode || projectLeaving) {
    return;
  }

  projectMode = true;

  lastCardReady =
    projectStep === projectItems.length - 1;

  projectExitRequested = false;

  lenis.stop();
}


  function exitProject() {
    projectMode = false;
    projectAnimating = false;
    lastCardReady = false;
    projectExitRequested = false;
    projectFreeScroll = false;

    lenis.start();
  }


  function releaseProjectToNext() {
    if (
      projectLeaving ||
      !projectWrap
    ) {
      return;
    }

    projectLeaving = true;
    projectMode = false;
    lastCardReady = false;
    projectExitRequested = false;
    projectFreeScroll = true;

    /*
     * 프로젝트 하단까지 카드 전환으로
     * 이미 이동했으므로 Lenis만 재시작
     */
    lenis.start();

    projectLeaving = false;
  }


  /*
   * 카드 이동과 실제 페이지 스크롤을 함께 처리
   */
  function moveProjectPage(direction, done) {
    const rect =
      projectWrap.getBoundingClientRect();

    const currentY =
      window.scrollY;

    const minY =
      currentY + rect.top;

    const maxY =
      currentY +
      rect.bottom -
      window.innerHeight;

    const targetY =
      Math.max(
        minY,
        Math.min(
          maxY,
          currentY +
            direction *
              PROJECT_STEP_HEIGHT
        )
      );

    lenis.start();

    lenis.scrollTo(targetY, {
      duration:
        PROJECT_DURATION / 1000,
      immediate: false,
      force: true,
      lock: true,

      onComplete: function () {
        lenis.stop();

        if (typeof done === 'function') {
          done();
        }
      }
    });
  }


  function projectNext() {
    if (
      projectAnimating ||
      projectStep >=
        projectItems.length - 1
    ) {
      return false;
    }

    projectAnimating = true;
    lastCardReady = false;
    projectExitRequested = false;

    projectStep++;

    updateProject();

    moveProjectPage(1, function () {
      projectAnimating = false;

      lastCardReady =
        projectStep ===
        projectItems.length - 1;

      /*
       * 마지막 카드 이동 중
       * 추가 휠이 들어왔을 때
       */
      if (
        lastCardReady &&
        projectExitRequested
      ) {
        setTimeout(
          releaseProjectToNext,
          100
        );
      }
    });

    return true;
  }


  function projectPrev() {
    if (
      projectAnimating ||
      projectStep <= -1
    ) {
      return false;
    }

    projectAnimating = true;
    lastCardReady = false;
    projectExitRequested = false;

    projectStep--;

    updateProject();

    moveProjectPage(-1, function () {
      projectAnimating = false;
    });

    return true;
  }


  function handleProjectWheel(e) {
    /*
     * 프로젝트가 끝난 뒤 일반 스크롤
     */
    if (projectFreeScroll) {
      const projectRect =
        projectWrap.getBoundingClientRect();

      /*
       * 회사소개에서 위로 올라와
       * 프로젝트에 재진입
       */
if (
  e.deltaY < 0 &&
  projectRect.bottom > window.innerHeight - 1
) {
 if (projectFreeScroll) {
  projectFreeScroll = false;
  projectMode = false;
  projectLeaving = false;
  lastCardReady = false;
  projectExitRequested = false;

  lenis.start();

  return false;
}
}

      /*
       * 프로젝트를 완전히 벗어남
       */
      else if (
        e.deltaY > 0 &&
        projectRect.bottom <=
          window.innerHeight - 1
      ) {
        projectFreeScroll = false;
projectMode = false;

  lenis.start();
        /*
         * 현재 wheel은 Lenis에 전달
         */
        return false;
      }

      /*
       * 일반 Lenis 스크롤
       */
      else {
        if (e.deltaY > 0) {
    lenis.start();
  }

        return false;
      }
    }

    if (
      !projectMode &&
      !isProjectPinned()
    ) {
      return false;
    }

    /*
     * 마지막 카드 이후
     */
    if (
      e.deltaY > 0 &&
      projectStep ===
        projectItems.length - 1 &&
      lastCardReady
    ) {
      e.preventDefault();

      releaseProjectToNext();

      return true;
    }

    e.preventDefault();

    if (projectLeaving) {
      return true;
    }

    /*
     * 애니메이션 중 추가 휠 예약
     */
    if (projectAnimating) {
      if (
        e.deltaY > 0 &&
        projectStep ===
          projectItems.length - 1
      ) {
        projectExitRequested = true;
      }

      return true;
    }

    if (!projectMode) {
      enterProject();
    }

    /* 아래로 스크롤 */
    if (e.deltaY > 0) {
      if (
        projectStep <
        projectItems.length - 1
      ) {
        projectNext();
      }

      return true;
    }

    /* 위로 스크롤 */
    if (e.deltaY < 0) {
      if (projectStep >= 0) {
        projectPrev();
      } else {
        exitProject();
      }

      return true;
    }

    return true;
  }


  function setupMobileProject() {
    projectItems.forEach(function (item) {
      item.addEventListener(
        'click',
        function () {
          if (isProjectDesktop()) {
            return;
          }

          const willOpen =
            !item.classList.contains(
              'active'
            );

          projectItems.forEach(
            function (otherItem) {
              otherItem.classList.remove(
                'active'
              );
            }
          );

          item.classList.toggle(
            'active',
            willOpen
          );
        }
      );
    });
  }


  function refreshProjectLayout() {
    if (!projectWrap) {
      return;
    }

    if (isProjectDesktop()) {
      if (projectContainer) {
        projectContainer.style.height =
          '100%';
      }

      projectItems.forEach(function (item) {
        item.classList.remove('active');
      });

      setProjectHeight();
      updateProject();

      return;
    }

    if (projectMode) {
      exitProject();
    }

    projectStep = -1;
    projectFreeScroll = false;

    projectWrap.style.removeProperty(
      'height'
    );

    if (projectContainer) {
      projectContainer.style.removeProperty(
        'height'
      );
    }

    resetProjectInlineStyles();
  }

  setupMobileProject();
  refreshProjectLayout();


  /* =========================
     COMPANY INFORMATION
  ========================= */

  const companyInfoWrap =
    document.querySelector(
      '#companyInfoWrap'
    );

  const companyNumbers =
    document.querySelectorAll(
      '#companyInfoWrap .companyInfoNumber strong'
    );

  const companyImages =
    document.querySelectorAll(
      '#companyInfoWrap .companyImgBox img'
    );

  let companyCountStarted = false;
  let companyImageIndex = 0;


  if (companyImages.length > 0) {
    companyImages.forEach(function (image, index) {
      image.classList.toggle(
        'active',
        index === 0
      );
    });
  }


  function startCompanyCount() {
    if (
      companyCountStarted ||
      companyNumbers.length === 0
    ) {
      return;
    }

    companyCountStarted = true;

    companyNumbers.forEach(function (number) {
      const target =
        Number(number.dataset.target);

      const duration = 1500;
      const startTime =
        performance.now();

      function count(currentTime) {
        const progress =
          Math.min(
            (currentTime - startTime) /
              duration,
            1
          );

        const ease =
          1 - Math.pow(1 - progress, 3);

        const value =
          Math.floor(target * ease);

        number.textContent =
          value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(count);
        } else {
          number.textContent =
            target.toLocaleString();
        }
      }

      requestAnimationFrame(count);
    });
  }


  function updateCompanyImage(progress) {
    if (companyImages.length === 0) {
      return;
    }

    let nextIndex = 0;

    if (progress < 0.33) {
      nextIndex = 0;
    } else if (progress < 0.66) {
      nextIndex = 1;
    } else {
      nextIndex = 2;
    }

    if (!companyImages[nextIndex]) {
      return;
    }

    if (companyImageIndex === nextIndex) {
      return;
    }

    companyImageIndex = nextIndex;

    companyImages.forEach(function (image, index) {
      image.classList.toggle(
        'active',
        index === companyImageIndex
      );
    });
  }


  function updateCompanyScroll() {
    if (!companyInfoWrap) {
      return;
    }

    const rect =
      companyInfoWrap.getBoundingClientRect();

    const companyActive =
      rect.top < window.innerHeight &&
      rect.bottom > 0;

    if (!companyActive) {
      return;
    }

    startCompanyCount();

    const scrollHeight =
      companyInfoWrap.offsetHeight -
      window.innerHeight;

    let progress = 0;

    if (scrollHeight > 0) {
      progress =
        (-rect.top) / scrollHeight;
    }

    progress =
      Math.max(
        0,
        Math.min(1, progress)
      );

    updateCompanyImage(progress);
  }


  /* =========================
     WHEEL
  ========================= */

  window.addEventListener(
    'wheel',
    function (e) {
      /*
       * 프로젝트 우선 처리
       */
      if (handleProjectWheel(e)) {
        return;
      }

      /*
       * VISUAL
       */
      if (
        !visualWrap ||
        !visualBox
      ) {
        return;
      }

      const visualRect =
        visualWrap.getBoundingClientRect();

      const visualActive =
        visualRect.top <= 0 &&
        visualRect.bottom >=
          window.innerHeight;

      if (!visualActive) {
        return;
      }

      e.preventDefault();

      if (visualAnimating) {
        return;
      }

      /* 아래 방향 */
      if (e.deltaY > 0) {
        /* STEP 0 → STEP 1 */
        if (visualStep === 0) {
          visualAnimating = true;

          lenis.stop();
          visualStep = 1;

          visualBox.classList.add(
            'step01'
          );

          if (popupContentBox) {
            popupContentBox.classList.add(
              'active'
            );
          }

          if (proposalDownloadBtn) {
            proposalDownloadBtn.classList.add(
              'active'
            );
          }

          setTimeout(function () {
            visualAnimating = false;
          }, 600);

          return;
        }

        /* STEP 1 → STEP 2 */
        if (visualStep === 1) {
          visualAnimating = true;

          lenis.stop();
          visualStep = 2;

          visualBox.classList.add(
            'step02'
          );

          visualWrap.classList.add(
            'step02'
          );

          setTimeout(function () {
            visualAnimating = false;
          }, 600);

          return;
        }

        /* STEP 2 → 다음 영역 */
        if (visualStep === 2) {
          lenis.start();
          return;
        }
      }

      /* 위 방향 */
      if (e.deltaY < 0) {
        /* STEP 2 → STEP 1 */
        if (visualStep === 2) {
          visualAnimating = true;

          lenis.stop();
          visualStep = 1;

          visualBox.classList.remove(
            'step02'
          );

          visualWrap.classList.remove(
            'step02'
          );

          setTimeout(function () {
            visualAnimating = false;
          }, 600);

          return;
        }

        /* STEP 1 → STEP 0 */
        if (visualStep === 1) {
          visualAnimating = true;

          lenis.stop();
          visualStep = 0;

          visualBox.classList.remove(
            'step01'
          );

          if (popupContentBox) {
            popupContentBox.classList.remove(
              'active'
            );
          }

          if (proposalDownloadBtn) {
            proposalDownloadBtn.classList.remove(
              'active'
            );
          }

          setTimeout(function () {
            visualAnimating = false;
          }, 600);

          return;
        }

        /* STEP 0 → 이전 영역 */
        if (visualStep === 0) {
          lenis.start();
          return;
        }
      }
    },
    {
      passive: false
    }
  );


  /* =========================
     RESIZE
  ========================= */

  let projectResizeTimer;

  window.addEventListener(
    'resize',
    function () {
      clearTimeout(projectResizeTimer);

      projectResizeTimer =
        setTimeout(
          refreshProjectLayout,
          120
        );
    }
  );


  /* =========================
     LENIS SCROLL
  ========================= */

  lenis.on('scroll', function () {
    updateCompanyScroll();
  });
});
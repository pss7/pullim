$(function () {
  /* 페이지 새로고침 시 최상단 이동 */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);


  /* Lenis 초기화 */
  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    autoRaf: true
  });


  /* 비주얼 요소 */
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


  /* 비주얼 첫 등장 */
  setTimeout(function () {
    if (visualBox) {
      visualBox.classList.add('active');
    }
  }, 100);


  /* 프로젝트 요소 */
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


  /* 프로젝트 설정 */
  const PROJECT_BREAKPOINT = 768;
  const PROJECT_DURATION = 800;
  const PROJECT_STEP_HEIGHT = 700;

  const CARD_WIDTH = 600;
  const PREV_WIDTH = 300;
  const CARD_VISIBLE = 60;
  const RIGHT_GAP = 60;


  /* 프로젝트 상태 */
  let projectStep = -1;
  let projectMode = false;
  let projectAnimating = false;
  let projectLeaving = false;
  let lastCardReady = false;
  let projectExitRequested = false;


  /* 데스크톱 프로젝트 확인 */
  function isProjectDesktop() {
    return window.innerWidth > PROJECT_BREAKPOINT;
  }


  /* 프로젝트 카드 스타일 초기화 */
  function resetProjectStyles() {
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


  /* 프로젝트 영역 높이 설정 */
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

    if (
      typeof lenis.resize === 'function'
    ) {
      lenis.resize();
    }
  }


  /* 프로젝트 카드 위치 변경 */
  function updateProjectCards() {
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
      /* 아직 나오지 않은 카드 */
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


  /* 프로젝트 영역이 화면에 고정됐는지 확인 */
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


  /* 프로젝트 진입 */
  function enterProject() {
    if (
      projectMode ||
      projectLeaving
    ) {
      return;
    }

    projectMode = true;
    projectExitRequested = false;

    /*
     * 마지막 카드 위치에서
     * 다시 프로젝트에 진입할 수 있도록 처리
     */
    lastCardReady =
      projectStep ===
      projectItems.length - 1;

    lenis.stop();
  }


  /* 프로젝트 종료 */
  function exitProject() {
    projectMode = false;
    projectAnimating = false;
    lastCardReady = false;
    projectExitRequested = false;

    lenis.start();
  }


  /* 프로젝트에서 다음 영역으로 이동 */
  function releaseProject() {
    projectLeaving = true;
    projectMode = false;
    lastCardReady = false;
    projectExitRequested = false;

    lenis.start();

    setTimeout(function () {
      projectLeaving = false;
    }, 300);
  }


  /* 카드 이동과 페이지 스크롤을 함께 처리 */
  function moveProjectPage(
    direction,
    complete
  ) {
    const rect =
      projectWrap.getBoundingClientRect();

    const currentY =
      window.scrollY;

    const minimumY =
      currentY + rect.top;

    const maximumY =
      currentY +
      rect.bottom -
      window.innerHeight;

    const targetY =
      Math.max(
        minimumY,
        Math.min(
          maximumY,
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

        if (
          typeof complete ===
          'function'
        ) {
          complete();
        }
      }
    });
  }


  /* 다음 카드 표시 */
  function showNextProject() {
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

    updateProjectCards();

    moveProjectPage(1, function () {
      projectAnimating = false;

      lastCardReady =
        projectStep ===
        projectItems.length - 1;

      if (
        lastCardReady &&
        projectExitRequested
      ) {
        setTimeout(
          releaseProject,
          100
        );
      }
    });

    return true;
  }


  /* 이전 카드 표시 */
  function showPreviousProject() {
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

    updateProjectCards();

    moveProjectPage(-1, function () {
      projectAnimating = false;
    });

    return true;
  }


  /* 프로젝트 휠 제어 */
  function handleProjectWheel(e) {
    if (
      !projectMode &&
      !isProjectPinned()
    ) {
      return false;
    }

    /*
     * 프로젝트 영역에 처음 들어왔을 때
     * 프로젝트 모드를 시작합니다.
     */
    if (!projectMode) {
      enterProject();
    }

    /*
     * 마지막 카드 이후에는
     * 페이지 일반 스크롤을 다시 시작합니다.
     */
    if (
      e.deltaY > 0 &&
      projectStep ===
        projectItems.length - 1 &&
      lastCardReady
    ) {
      e.preventDefault();

      releaseProject();

      return true;
    }

    /*
     * 카드 애니메이션 중에는
     * 페이지 스크롤을 잠시 막습니다.
     */
    if (projectAnimating) {
      e.preventDefault();

      if (
        e.deltaY > 0 &&
        projectStep ===
          projectItems.length - 1
      ) {
        projectExitRequested = true;
      }

      return true;
    }

    /*
     * 아래로 스크롤
     */
    if (e.deltaY > 0) {
      e.preventDefault();

      showNextProject();

      return true;
    }

    /*
     * 위로 스크롤
     */
    if (e.deltaY < 0) {
      if (projectStep >= 0) {
        e.preventDefault();

        showPreviousProject();

        return true;
      }

      /*
       * 첫 카드 이전에는
       * Lenis 일반 스크롤로 전환합니다.
       */
      exitProject();

      return false;
    }

    return true;
  }


  /* 모바일 프로젝트 클릭 */
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


  /* 프로젝트 반응형 초기화 */
  function refreshProjectLayout() {
    if (!projectWrap) {
      return;
    }

    if (isProjectDesktop()) {
      if (projectContainer) {
        projectContainer.style.height =
          '100%';
      }

      setProjectHeight();
      updateProjectCards();

      return;
    }

    if (projectMode) {
      exitProject();
    }

    projectStep = -1;

    projectWrap.style.removeProperty(
      'height'
    );

    if (projectContainer) {
      projectContainer.style.removeProperty(
        'height'
      );
    }

    resetProjectStyles();
  }

  setupMobileProject();
  refreshProjectLayout();


  /* 회사 정보 요소 */
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


  /* 회사 이미지 초기화 */
  companyImages.forEach(function (image, index) {
    image.classList.toggle(
      'active',
      index === 0
    );
  });


  /* 회사 숫자 카운트 */
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

        number.textContent =
          Math.floor(
            target * ease
          ).toLocaleString();

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


  /* 회사 이미지 변경 */
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


  /* 회사 정보 스크롤 처리 */
  function updateCompanyScroll() {
    if (!companyInfoWrap) {
      return;
    }

    const rect =
      companyInfoWrap.getBoundingClientRect();

    const isVisible =
      rect.top < window.innerHeight &&
      rect.bottom > 0;

    if (!isVisible) {
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


  /* 휠 이벤트 */
  window.addEventListener(
    'wheel',
    function (e) {
      /*
       * 프로젝트를 먼저 처리합니다.
       */
      if (handleProjectWheel(e)) {
        return;
      }

      /*
       * 비주얼 영역 확인
       */
      if (
        !visualWrap ||
        !visualBox
      ) {
        return;
      }

      const rect =
        visualWrap.getBoundingClientRect();

      const isVisible =
        rect.top <= 0 &&
        rect.bottom >=
          window.innerHeight;

      if (!isVisible) {
        return;
      }

      e.preventDefault();

      if (visualAnimating) {
        return;
      }

      /*
       * 비주얼 아래 방향
       */
      if (e.deltaY > 0) {
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

        if (visualStep === 2) {
          lenis.start();
          return;
        }
      }

      /*
       * 비주얼 위 방향
       */
      if (e.deltaY < 0) {
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

        if (visualStep === 0) {
          lenis.start();
        }
      }
    },
    {
      passive: false
    }
  );


  /* 화면 크기 변경 */
  let resizeTimer;

  window.addEventListener(
    'resize',
    function () {
      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(
          refreshProjectLayout,
          120
        );
    }
  );


  /* Lenis 스크롤 이벤트 */
  lenis.on(
    'scroll',
    function () {
      updateCompanyScroll();
    }
  );
});
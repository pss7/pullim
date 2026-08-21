$(function () {
  /* 페이지 새로고침 시 최상단 이동 */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);

  /* 라이브러리 연결 */
  const gsap = window.gsap;

  const ScrollTrigger =
    window.ScrollTrigger;

  gsap.registerPlugin(
    ScrollTrigger
  );

  /* Lenis 초기화 */
  const lenis = new window.Lenis({
    /*
     * 낮을수록 스크롤이 화면을 천천히 따라옵니다.
     * 0.045는 효과가 확실하게 느껴지는 값입니다.
     */
    lerp: 0.045,

    /* PC 마우스 휠 부드럽게 처리 */
    smoothWheel: true,

    /* 휠 이동 거리 조절 */
    wheelMultiplier: 0.75,

    /* 세로 스크롤 */
    orientation: 'vertical',

    gestureOrientation: 'vertical',

    /* 모바일은 기본 터치 스크롤 */
    syncTouch: false,

    /*
     * PC 설정 때문에 Lenis 효과가 꺼지는 것을 방지합니다.
     * 효과 확인을 위해 false로 설정합니다.
     */
    respectReducedMotion: false
  });


  /* 개발자도구에서 Lenis 상태를 확인할 수 있게 등록 */
  window.lenis = lenis;


  /* Lenis와 ScrollTrigger 연결 */
  lenis.on(
    'scroll',
    ScrollTrigger.update
  );


  /* GSAP 프레임으로 Lenis 실행 */
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });


  /* 프레임 지연 보정 해제 */
  gsap.ticker.lagSmoothing(0);


  /* Lenis와 ScrollTrigger 연결 */
  lenis.on(
    'scroll',
    ScrollTrigger.update
  );


  /* GSAP 프레임으로 Lenis 실행 */
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);


  /* 비주얼 요소 */
  const visualWrap =
    document.querySelector(
      '#visualWrap'
    );

  const visualBox =
    document.querySelector(
      '#visualWrap .visualBox'
    );

  const popupContentBox =
    document.querySelector(
      '#popupContentBox'
    );

  const proposalDownloadBtn =
    document.querySelector(
      '.proposalDownloadBtn'
    );

  const aboutWrap =
    document.querySelector(
      '#aboutWrap'
    );

  let visualStep = -1;


  /* 비주얼 단계 적용 */
  function applyVisualStep(nextStep) {
    if (
      !visualWrap ||
      !visualBox ||
      visualStep === nextStep
    ) {
      return;
    }

    visualStep = nextStep;

    visualBox.classList.toggle(
      'step01',
      visualStep >= 1
    );

    visualBox.classList.toggle(
      'step02',
      visualStep >= 2
    );

    visualWrap.classList.toggle(
      'step02',
      visualStep >= 2
    );

    if (popupContentBox) {
      popupContentBox.classList.toggle(
        'active',
        visualStep >= 1
      );
    }

    if (proposalDownloadBtn) {
      proposalDownloadBtn.classList.toggle(
        'active',
        visualStep >= 1
      );
    }
  }


  /* 비주얼 진행률을 단계로 변환 */
  function updateVisualStep(progress) {
    if (progress < 1 / 6) {
      applyVisualStep(0);

      return;
    }

    if (progress < 1 / 2) {
      applyVisualStep(1);

      return;
    }

    applyVisualStep(2);
  }


  /* 비주얼 첫 등장 */
  if (visualBox) {
    setTimeout(function () {
      visualBox.classList.add(
        'active'
      );
    }, 100);
  }


  /* 비주얼 고정 및 단계 전환 */
  if (visualWrap && visualBox) {
    /*
     * 기존 sticky와 ScrollTrigger pin이
     * 겹치지 않도록 설정합니다.
     */
    visualWrap.style.height =
      'auto';

    visualWrap.style.position =
      'relative';

    visualWrap.style.zIndex =
      '1';

    visualBox.style.position =
      'relative';

    visualBox.style.top =
      'auto';


    /*
     * 소개 영역을 한 화면 위로 당깁니다.
     *
     * 비주얼 마지막 스크롤 구간에서
     * 소개 영역이 아래에서부터 올라옵니다.
     */
    if (aboutWrap) {
      aboutWrap.style.position =
        'relative';

      aboutWrap.style.zIndex =
        '2';

      aboutWrap.style.marginTop =
        '-100vh';
    }

    applyVisualStep(0);


    /* 비주얼 ScrollTrigger */
    ScrollTrigger.create({
      id: 'visual-motion',

      trigger: visualWrap,

      start: 'top top',

      /*
       * 0 ~ 1/3: 첫 번째 단계
       * 1/3 ~ 2/3: 두 번째 단계
       * 2/3 ~ 1: 소개 영역 전환
       */
      end: function () {
        return (
          '+=' +
          window.innerHeight * 3
        );
      },

      pin: visualBox,

      pinSpacing: true,

      anticipatePin: 1,

      invalidateOnRefresh: true,

      snap: {
        snapTo: function (
          value,
          self
        ) {
          const handoffStart =
            2 / 3;


          /*
           * 소개 영역이 올라오는 구간에서는
           * 스냅하지 않습니다.
           *
           * 사용자가 스크롤한 거리만큼
           * 소개 영역이 조금씩 올라옵니다.
           */
          if (value > handoffStart) {
            return value;
          }


          /*
           * 비주얼 모션 구간에서만
           * 단계별 스냅을 적용합니다.
           */
          const directionalSnap =
            ScrollTrigger.snapDirectional([
              0,
              1 / 3,
              2 / 3
            ]);

          return directionalSnap(
            value,
            self.direction
          );
        },

        duration: {
          min: 0.2,
          max: 0.55
        },

        delay: 0.08,

        ease: 'power1.inOut'
      },

      onUpdate: function (self) {
        updateVisualStep(
          self.progress
        );
      },

      onRefresh: function (self) {
        updateVisualStep(
          self.progress
        );
      }
    });
  }


  /* 프로젝트 요소 */
  const projectWrap =
    document.querySelector(
      '#projectWrap'
    );

  const projectContainer =
    projectWrap
      ? projectWrap.querySelector(
        '.container'
      )
      : null;

  const projectBox =
    document.querySelector(
      '#projectWrap .projectBox'
    );

  const projectList =
    document.querySelector(
      '#projectWrap .projectList'
    );

  const projectItems =
    gsap.utils.toArray(
      '#projectWrap .projectList li'
    );

  const companyInfoWrap =
    document.querySelector(
      '#companyInfoWrap'
    );


  /* 프로젝트 설정 */
  const PROJECT_DISTANCE = 700;
  const CARD_WIDTH = 600;
  const PREVIOUS_WIDTH = 300;
  const CARD_VISIBLE = 60;
  const RIGHT_GAP = 60;


  /* 프로젝트 목록 너비 */
  function getProjectListWidth() {
    if (!projectList) {
      return 0;
    }

    return projectList.clientWidth;
  }


  /* 현재 프로젝트 카드 너비 */
  function getProjectCardWidth() {
    return Math.min(
      CARD_WIDTH,
      Math.max(
        getProjectListWidth() -
        RIGHT_GAP,
        0
      )
    );
  }


  /* 현재 카드의 오른쪽 위치 */
  function getProjectCurrentX() {
    return Math.max(
      getProjectListWidth() -
      getProjectCardWidth() -
      RIGHT_GAP,
      0
    );
  }


  /* 프로젝트 반응형 관리 */
  const projectMedia =
    gsap.matchMedia();


  /* 데스크톱 프로젝트 */
  projectMedia.add(
    '(min-width: 769px)',
    function () {
      if (
        !projectWrap ||
        !projectBox ||
        !projectList ||
        projectItems.length === 0
      ) {
        return;
      }

      projectWrap.style.removeProperty(
        'height'
      );

      /*
       * CSS sticky와 ScrollTrigger pin이
       * 겹치지 않도록 설정합니다.
       */
      projectBox.style.position =
        'relative';

      if (projectContainer) {
        projectContainer.style.height =
          'auto';
      }

      projectList.style.removeProperty(
        'display'
      );

      projectList.style.removeProperty(
        'flex-direction'
      );


      /* 데스크톱 카드 초기 스타일 */
      projectItems.forEach(
        function (item, index) {
          item.classList.remove(
            'active',
            'current',
            'prev'
          );

          item.style.position =
            'absolute';

          item.style.top =
            '0';

          item.style.left =
            '0';

          /*
           * CSS transition과
           * GSAP scrub 충돌을 방지합니다.
           */
          item.style.transition =
            'none';

          item.style.zIndex =
            String(index + 10);
        }
      );


      /* 카드 초기 위치 */
      function setProjectStart() {
        gsap.set(projectItems, {
          x: function () {
            return getProjectListWidth();
          },

          width: function () {
            return getProjectCardWidth();
          }
        });
      }

      setProjectStart();


      /* 프로젝트 카드 타임라인 */
      const projectTimeline =
        gsap.timeline({
          defaults: {
            duration: 1,
            ease: 'none'
          }
        });


      projectItems.forEach(
        function (item, index) {
          const timelinePosition =
            index;


          /* 이전 카드를 왼쪽에 누적 */
          if (index > 0) {
            projectTimeline.to(
              projectItems[index - 1],
              {
                x:
                  (index - 1) *
                  CARD_VISIBLE,

                width: function () {
                  return Math.min(
                    PREVIOUS_WIDTH,
                    getProjectCardWidth()
                  );
                }
              },
              timelinePosition
            );
          }


          /* 현재 카드를 오른쪽으로 이동 */
          projectTimeline.to(
            item,
            {
              x: function () {
                return getProjectCurrentX();
              },

              width: function () {
                return getProjectCardWidth();
              }
            },
            timelinePosition
          );
        }
      );


      /* 프로젝트 고정 및 카드 스크롤 */
      const projectTrigger =
        ScrollTrigger.create({
          id: 'project-motion',

          trigger: projectWrap,

          start: 'top top',

          end: function () {
            return (
              '+=' +
              projectItems.length *
              PROJECT_DISTANCE
            );
          },

          animation:
            projectTimeline,

          pin: projectBox,

          pinSpacing: true,

          anticipatePin: 1,

          scrub: 0.8,

          invalidateOnRefresh: true,

          snap: {
            snapTo:
              1 /
              projectItems.length,

            duration: {
              min: 0.2,
              max: 0.55
            },

            delay: 0.08,

            directional: true,

            ease: 'power1.inOut'
          },

          onRefreshInit:
            setProjectStart
        });


      /* 데스크톱 해제 시 스타일 정리 */
      return function () {
        projectTrigger.kill();
        projectTimeline.kill();

        projectBox.style.removeProperty(
          'position'
        );

        if (projectContainer) {
          projectContainer.style.removeProperty(
            'height'
          );
        }

        projectItems.forEach(
          function (item) {
            item.style.removeProperty(
              'position'
            );

            item.style.removeProperty(
              'top'
            );

            item.style.removeProperty(
              'left'
            );

            item.style.removeProperty(
              'transition'
            );

            item.style.removeProperty(
              'width'
            );

            item.style.removeProperty(
              'transform'
            );

            item.style.removeProperty(
              'z-index'
            );
          }
        );
      };
    }
  );


  /* 모바일 프로젝트 */
  projectMedia.add(
    '(max-width: 768px)',
    function () {
      if (
        !projectWrap ||
        !projectBox ||
        !projectList
      ) {
        return;
      }

      projectWrap.style.height =
        'auto';

      projectBox.style.position =
        'relative';

      if (projectContainer) {
        projectContainer.style.height =
          'auto';
      }

      projectList.style.display =
        'flex';

      projectList.style.flexDirection =
        'column';

      projectList.style.height =
        'auto';


      /* 모바일 카드 클릭 함수 목록 */
      const mobileClickHandlers = [];


      projectItems.forEach(
        function (item) {
          item.classList.remove(
            'current',
            'prev'
          );

          item.style.position =
            'relative';

          item.style.top =
            'auto';

          item.style.left =
            'auto';

          item.style.width =
            '100%';

          item.style.transform =
            'none';

          item.style.zIndex =
            'auto';


          /* 모바일 프로젝트 카드 클릭 */
          const clickHandler =
            function () {
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

              if (willOpen) {
                item.classList.add(
                  'active'
                );
              }


              /* 카드 높이 변경 후 재계산 */
              requestAnimationFrame(
                function () {
                  lenis.resize();

                  ScrollTrigger.refresh();
                }
              );
            };


          mobileClickHandlers.push({
            item: item,
            handler: clickHandler
          });

          item.addEventListener(
            'click',
            clickHandler
          );
        }
      );


      /* 모바일 해제 시 이벤트 정리 */
      return function () {
        mobileClickHandlers.forEach(
          function (data) {
            data.item.removeEventListener(
              'click',
              data.handler
            );
          }
        );

        projectWrap.style.removeProperty(
          'height'
        );

        projectBox.style.removeProperty(
          'position'
        );

        projectList.style.removeProperty(
          'display'
        );

        projectList.style.removeProperty(
          'flex-direction'
        );

        projectList.style.removeProperty(
          'height'
        );

        projectItems.forEach(
          function (item) {
            item.classList.remove(
              'active'
            );

            item.style.removeProperty(
              'position'
            );

            item.style.removeProperty(
              'top'
            );

            item.style.removeProperty(
              'left'
            );

            item.style.removeProperty(
              'width'
            );

            item.style.removeProperty(
              'transform'
            );

            item.style.removeProperty(
              'z-index'
            );
          }
        );
      };
    }
  );


  /* 회사 정보 요소 */
  const companyNumbers =
    document.querySelectorAll(
      '#companyInfoWrap .companyInfoNumber strong'
    );

  const companyImages =
    document.querySelectorAll(
      '#companyInfoWrap .companyImgBox img'
    );

  let companyCountStarted = false;
  let companyImageIndex = -1;


  /* 회사 이미지 변경 */
  function updateCompanyImage(progress) {
    if (companyImages.length === 0) {
      return;
    }

    const nextIndex =
      Math.min(
        companyImages.length - 1,

        Math.floor(
          progress *
          companyImages.length
        )
      );

    if (
      companyImageIndex ===
      nextIndex
    ) {
      return;
    }

    companyImageIndex =
      nextIndex;

    companyImages.forEach(
      function (image, index) {
        image.classList.toggle(
          'active',
          index === companyImageIndex
        );
      }
    );
  }


  /* 회사 숫자 카운트 */
  function startCompanyCount() {
    if (
      companyCountStarted ||
      companyNumbers.length === 0
    ) {
      return;
    }

    companyCountStarted = true;

    companyNumbers.forEach(
      function (number) {
        const target =
          Number(
            number.dataset.target
          );

        const value = {
          current: 0
        };

        gsap.to(value, {
          current: target,

          duration: 1.5,

          ease: 'power3.out',

          onUpdate: function () {
            number.textContent =
              Math.floor(
                value.current
              ).toLocaleString();
          },

          onComplete: function () {
            number.textContent =
              target.toLocaleString();
          }
        });
      }
    );
  }


  /* 회사 정보 스크롤 */
  if (companyInfoWrap) {
    updateCompanyImage(0);


    /* 회사 숫자 카운트 실행 */
    ScrollTrigger.create({
      id: 'company-count',

      trigger: companyInfoWrap,

      start: 'top 80%',

      once: true,

      onEnter: startCompanyCount
    });


    /* 스크롤 진행률에 따라 이미지 변경 */
    ScrollTrigger.create({
      id: 'company-images',

      trigger: companyInfoWrap,

      start: 'top top',

      end: 'bottom bottom',

      onUpdate: function (self) {
        updateCompanyImage(
          self.progress
        );
      },

      onRefresh: function (self) {
        updateCompanyImage(
          self.progress
        );
      }
    });
  }


  /* 스크롤 위치 재계산 */
  function refreshMotion() {
    lenis.resize();

    ScrollTrigger.refresh();
  }


  /* 이미지 로드 후 재계산 */
  window.addEventListener(
    'load',
    refreshMotion,
    { once: true }
  );


  /* 폰트 로드 후 재계산 */
  if (document.fonts) {
    document.fonts.ready.then(
      refreshMotion
    );
  }


  /* 화면 크기 변경 후 재계산 */
  let resizeTimer;

  window.addEventListener(
    'resize',
    function () {
      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(
          refreshMotion,
          150
        );
    }
  );


  /* 초기 스크롤 위치 계산 */
  requestAnimationFrame(
    refreshMotion
  );
});
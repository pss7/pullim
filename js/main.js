jQuery(function ($) {

  /* 페이지 새로고침 시 최상단 이동 */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);


  /* 라이브러리 연결 */
  const gsap =
    window.gsap;

  const ScrollTrigger =
    window.ScrollTrigger;

  gsap.registerPlugin(
    ScrollTrigger
  );


  /* Lenis 초기화 */
  const lenis =
    new window.Lenis({
      /* 낮을수록 스크롤이 천천히 따라옵니다. */
      lerp: 0.045,

      /* PC 마우스 휠 부드럽게 처리 */
      smoothWheel: true,

      /* 휠 이동 거리 조절 */
      wheelMultiplier: 0.75,

      /* 세로 방향 스크롤 */
      orientation: 'vertical',
      gestureOrientation: 'vertical',

      /* 모바일은 기본 터치 스크롤 */
      syncTouch: false,

      /* 모션 효과 유지 */
      respectReducedMotion: false
    });


  /* 개발자 도구에서 Lenis 확인 */
  window.lenis =
    lenis;


  /* Lenis와 ScrollTrigger 연결 */
  lenis.on(
    'scroll',
    ScrollTrigger.update
  );


  /* GSAP 프레임에서 Lenis 실행 */
  gsap.ticker.add(
    function (time) {
      lenis.raf(
        time * 1000
      );
    }
  );


  /* 프레임 지연 보정 해제 */
  gsap.ticker.lagSmoothing(0);


  /* 비주얼 영역 */
  function initVisualMotion() {
    const $visualWrap =
      $('#visualWrap');

    const $visualBox =
      $visualWrap.find(
        '.visualBox'
      );

    const $popupContentBox =
      $('#popupContentBox');

    const $proposalDownloadBtn =
      $('.proposalDownloadBtn');

    const $aboutWrap =
      $('#aboutWrap');


    /* 필요한 요소가 없으면 실행하지 않습니다. */
    if (
      !$visualWrap.length ||
      !$visualBox.length
    ) {
      return;
    }


    let visualStep = -1;


    /* 비주얼 스크롤 단계 적용 */
    function applyVisualStep(
      nextStep
    ) {
      if (
        visualStep === nextStep
      ) {
        return;
      }


      visualStep =
        nextStep;


      /* 첫 번째 스크롤 단계 */
      $visualBox.toggleClass(
        'step01',
        visualStep >= 1
      );


      /* 두 번째 스크롤 단계 */
      $visualBox.toggleClass(
        'step02',
        visualStep >= 2
      );


      $visualWrap.toggleClass(
        'step02',
        visualStep >= 2
      );
    }


    /* 스크롤 진행률을 단계로 변환 */
    function updateVisualStep(
      progress
    ) {
      /* 첫 화면 */
      if (
        progress < 1 / 6
      ) {
        applyVisualStep(0);

        return;
      }


      /* 첫 번째 스크롤 */
      if (
        progress < 1 / 2
      ) {
        applyVisualStep(1);

        return;
      }

      /* 두 번째 스크롤 */
      applyVisualStep(2);
    }

    /*
     * 첫 화면의 초기 상태를
     * 확실하게 적용합니다.
     */
    $visualBox.removeClass(
      'active'
    );

    $popupContentBox.removeClass(
      'active'
    );

    $proposalDownloadBtn.removeClass(
      'active'
    );

    /*
    * 비주얼 초기 상태
    */
    $visualBox.removeClass(
      'active step01 step02'
    );

    $visualWrap.removeClass(
      'step02'
    );

    $popupContentBox.removeClass(
      'active'
    );

    $proposalDownloadBtn.removeClass(
      'active'
    );


    /*
     * 브라우저가 초기 위치를
     * 먼저 계산하도록 강제합니다.
     */
    $visualBox
      .get(0)
      .offsetHeight;


    /*
     * 초기 위치가 그려진 다음
     * 본래 위치로 이동시킵니다.
     */
    setTimeout(
      function () {
        $visualBox.addClass(
          'active'
        );

        $popupContentBox.addClass(
          'active'
        );

        $proposalDownloadBtn.addClass(
          'active'
        );
      },
      150
    );

    /*
     * CSS sticky와 ScrollTrigger pin이
     * 겹치지 않도록 설정합니다.
     */
    $visualWrap.css({
      height:
        'auto',

      position:
        'relative',

      zIndex:
        1
    });


    $visualBox.css({
      position:
        'relative',

      top:
        'auto'
    });


    /*
     * 비주얼 마지막 스크롤 구간에서
     * 소개 영역이 아래에서 올라옵니다.
     */
    if (
      $aboutWrap.length
    ) {
      $aboutWrap.css({
        position:
          'relative',

        zIndex:
          2,

        marginTop:
          '-100vh'
      });
    }


    /* 첫 화면 상태 */
    applyVisualStep(0);


    /* 비주얼 단계 스냅 위치 */
    const visualSnap =
      ScrollTrigger.snapDirectional([
        0,
        1 / 3,
        2 / 3
      ]);


    /* 비주얼 스크롤 모션 */
    ScrollTrigger.create({
      id:
        'visual-motion',

      trigger:
        $visualWrap.get(0),

      start:
        'top top',


      /*
       * 세 화면 높이만큼
       * 비주얼 모션을 진행합니다.
       */
      end:
        function () {
          return (
            '+=' +
            window.innerHeight * 3
          );
        },


      /* 비주얼 화면 고정 */
      pin:
        $visualBox.get(0),

      pinSpacing:
        true,

      anticipatePin:
        1,

      invalidateOnRefresh:
        true,


      /* 단계별 스냅 */
      snap: {
        snapTo:
          function (
            value,
            self
          ) {
            const handoffStart =
              2 / 3;


            /*
             * 소개 영역이 올라오는 구간에서는
             * 스냅하지 않습니다.
             */
            if (
              value >
              handoffStart
            ) {
              return value;
            }


            return visualSnap(
              value,
              self.direction
            );
          },


        duration: {
          min:
            0.2,

          max:
            0.55
        },


        delay:
          0.08,

        ease:
          'power1.inOut'
      },


      /* 스크롤할 때 단계 변경 */
      onUpdate:
        function (self) {
          updateVisualStep(
            self.progress
          );
        },


      /* 화면 크기 재계산 후 단계 복구 */
      onRefresh:
        function (self) {
          updateVisualStep(
            self.progress
          );
        }
    });
  }


  /* 프로젝트 영역 */
  function initProjectMotion() {
    const $projectWrap =
      $('#projectWrap');

    const $projectContainer =
      $projectWrap.find(
        '.container'
      );

    const $projectBox =
      $projectWrap.find(
        '.projectBox'
      );

    const $projectList =
      $projectWrap.find(
        '.projectList'
      );

    const $projectItems =
      $projectList.find('li');


    /*
     * GSAP에서 사용할 수 있도록
     * jQuery 목록을 DOM 배열로 변환합니다.
     */
    const projectItems =
      $projectItems.toArray();


    /* 필요한 요소가 없으면 실행하지 않습니다. */
    if (
      !$projectWrap.length ||
      !$projectBox.length ||
      !$projectList.length ||
      !projectItems.length
    ) {
      return;
    }


    /* 프로젝트 모션 설정 */
    const PROJECT_DISTANCE =
      700;

    const CARD_WIDTH =
      600;

    const PREVIOUS_WIDTH =
      300;

    const CARD_VISIBLE =
      60;

    const RIGHT_GAP =
      60;


    /* 프로젝트 목록 너비 */
    function getProjectListWidth() {
      return $projectList
        .get(0)
        .clientWidth;
    }


    /* 현재 화면에 맞는 카드 너비 */
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


    /* PC 프로젝트 카드 모션 */
    projectMedia.add(
      '(min-width: 769px)',

      function () {
        $projectWrap.css(
          'height',
          ''
        );


        $projectBox.css(
          'position',
          'relative'
        );


        $projectContainer.css(
          'height',
          'auto'
        );


        $projectList.css({
          display: '',
          flexDirection: '',
          height: ''
        });


        /* PC 프로젝트 카드 초기 스타일 */
        $projectItems.each(
          function (index) {
            $(this)
              .removeClass(
                'active current prev'
              )
              .css({
                position:
                  'absolute',

                top:
                  0,

                left:
                  0,

                /*
                 * CSS transition과
                 * GSAP 충돌 방지
                 */
                transition:
                  'none',

                zIndex:
                  index + 10
              });
          }
        );


        /*
         * 모든 카드를 화면 오른쪽
         * 바깥에 배치합니다.
         */
        function setProjectStart() {
          gsap.set(
            projectItems,
            {
              x:
                function () {
                  return (
                    getProjectListWidth()
                  );
                },


              width:
                function () {
                  return (
                    getProjectCardWidth()
                  );
                }
            }
          );
        }


        setProjectStart();


        /* 프로젝트 카드 타임라인 */
        const projectTimeline =
          gsap.timeline({
            defaults: {
              duration:
                1,

              ease:
                'none'
            }
          });


        projectItems.forEach(
          function (
            item,
            index
          ) {
            const timelinePosition =
              index;


            /*
             * 이전 카드를 왼쪽에
             * 겹쳐서 쌓습니다.
             */
            if (
              index > 0
            ) {
              projectTimeline.to(
                projectItems[
                index - 1
                ],

                {
                  x:
                    (index - 1) *
                    CARD_VISIBLE,


                  width:
                    function () {
                      return Math.min(
                        PREVIOUS_WIDTH,
                        getProjectCardWidth()
                      );
                    }
                },

                timelinePosition
              );
            }


            /*
             * 현재 카드를 오른쪽으로
             * 이동시킵니다.
             */
            projectTimeline.to(
              item,

              {
                x:
                  function () {
                    return (
                      getProjectCurrentX()
                    );
                  },


                width:
                  function () {
                    return (
                      getProjectCardWidth()
                    );
                  }
              },

              timelinePosition
            );
          }
        );


        /* 프로젝트 스크롤 모션 */
        const projectTrigger =
          ScrollTrigger.create({
            id:
              'project-motion',

            trigger:
              $projectWrap.get(0),

            start:
              'top top',


            end:
              function () {
                return (
                  '+=' +
                  projectItems.length *
                  PROJECT_DISTANCE
                );
              },


            animation:
              projectTimeline,

            pin:
              $projectBox.get(0),

            pinSpacing:
              true,

            anticipatePin:
              1,

            scrub:
              0.8,

            invalidateOnRefresh:
              true,


            snap: {
              snapTo:
                1 /
                projectItems.length,


              duration: {
                min:
                  0.2,

                max:
                  0.55
              },


              delay:
                0.08,

              directional:
                true,

              ease:
                'power1.inOut'
            },


            onRefreshInit:
              setProjectStart
          });


        /*
         * PC 구간이 끝날 때
         * 적용한 상태를 정리합니다.
         */
        return function () {
          projectTrigger.kill();
          projectTimeline.kill();


          $projectBox.css(
            'position',
            ''
          );


          $projectContainer.css(
            'height',
            ''
          );


          $projectItems.css({
            position: '',
            top: '',
            left: '',
            transition: '',
            width: '',
            transform: '',
            zIndex: ''
          });
        };
      }
    );


    /* 모바일 프로젝트 아코디언 */
    projectMedia.add(
      '(max-width: 768px)',

      function () {
        $projectWrap.css(
          'height',
          'auto'
        );


        $projectBox.css(
          'position',
          'relative'
        );


        $projectContainer.css(
          'height',
          'auto'
        );


        $projectList.css({
          display:
            'flex',

          flexDirection:
            'column',

          height:
            'auto'
        });


        /* 모바일 카드 초기 상태 */
        $projectItems
          .removeClass(
            'current prev'
          )
          .css({
            position:
              'relative',

            top:
              'auto',

            left:
              'auto',

            width:
              '100%',

            transform:
              'none',

            zIndex:
              'auto'
          });


        /*
         * 기존 모바일 클릭 이벤트를
         * 제거한 후 다시 등록합니다.
         */
        $projectItems
          .off(
            'click.projectMobile'
          )
          .on(
            'click.projectMobile',

            function () {
              const $currentItem =
                $(this);


              const willOpen =
                !$currentItem.hasClass(
                  'active'
                );


              $projectItems.removeClass(
                'active'
              );


              if (
                willOpen
              ) {
                $currentItem.addClass(
                  'active'
                );
              }


              /*
               * 카드 높이가 바뀐 후
               * 스크롤 위치를 재계산합니다.
               */
              requestAnimationFrame(
                refreshMotion
              );
            }
          );


        /*
         * 모바일 구간이 끝날 때
         * 이벤트와 스타일을 정리합니다.
         */
        return function () {
          $projectItems
            .off(
              'click.projectMobile'
            )
            .removeClass(
              'active'
            )
            .css({
              position: '',
              top: '',
              left: '',
              width: '',
              transform: '',
              zIndex: ''
            });


          $projectWrap.css(
            'height',
            ''
          );


          $projectBox.css(
            'position',
            ''
          );


          $projectContainer.css(
            'height',
            ''
          );


          $projectList.css({
            display: '',
            flexDirection: '',
            height: ''
          });
        };
      }
    );
  }


  /* 회사 정보 영역 */
  function initCompanyMotion() {
    const $companyInfoWrap =
      $('#companyInfoWrap');


    const $companyNumbers =
      $companyInfoWrap.find(
        '.companyInfoNumber strong'
      );


    const $companyImages =
      $companyInfoWrap.find(
        '.companyImgBox img'
      );


    /* 회사 영역이 없으면 실행하지 않습니다. */
    if (
      !$companyInfoWrap.length
    ) {
      return;
    }


    let companyCountStarted =
      false;

    let companyImageIndex =
      -1;


    /* 회사 이미지 변경 */
    function updateCompanyImage(
      progress
    ) {
      if (
        !$companyImages.length
      ) {
        return;
      }


      const nextIndex =
        Math.min(
          $companyImages.length - 1,

          Math.floor(
            progress *
            $companyImages.length
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


      $companyImages.each(
        function (index) {
          $(this).toggleClass(
            'active',

            index ===
            companyImageIndex
          );
        }
      );
    }


    /* 회사 숫자 카운트 */
    function startCompanyCount() {
      if (
        companyCountStarted ||
        !$companyNumbers.length
      ) {
        return;
      }


      companyCountStarted =
        true;


      $companyNumbers.each(
        function () {
          const $number =
            $(this);


          const target =
            Number(
              $number.attr(
                'data-target'
              )
            );


          /* 숫자가 아니면 실행하지 않습니다. */
          if (
            !Number.isFinite(
              target
            )
          ) {
            return;
          }


          const value = {
            current:
              0
          };


          gsap.to(
            value,
            {
              current:
                target,

              duration:
                1.5,

              ease:
                'power3.out',


              onUpdate:
                function () {
                  $number.text(
                    Math.floor(
                      value.current
                    ).toLocaleString()
                  );
                },


              onComplete:
                function () {
                  $number.text(
                    target.toLocaleString()
                  );
                }
            }
          );
        }
      );
    }


    /* 첫 번째 이미지 표시 */
    updateCompanyImage(0);


    /* 회사 숫자 카운트 실행 */
    ScrollTrigger.create({
      id:
        'company-count',

      trigger:
        $companyInfoWrap.get(0),

      start:
        'top 80%',

      once:
        true,

      onEnter:
        startCompanyCount
    });


    /* 스크롤 진행률에 따라 이미지 변경 */
    ScrollTrigger.create({
      id:
        'company-images',

      trigger:
        $companyInfoWrap.get(0),

      start:
        'top top',

      end:
        'bottom bottom',


      onUpdate:
        function (self) {
          updateCompanyImage(
            self.progress
          );
        },


      onRefresh:
        function (self) {
          updateCompanyImage(
            self.progress
          );
        }
    });
  }


  /* 문의 영역 프로젝트 타원선 */
  function initContactProjectLine() {
    const $projectText =
      $(
        '#contactWrap .contactProjectText'
      );


    const $projectLine =
      $projectText.find(
        '.contactProjectLine'
      );


    const $projectPath =
      $projectLine
        .find('path')
        .first();


    /* 필요한 요소가 없으면 실행하지 않습니다. */
    if (
      !$projectText.length ||
      !$projectLine.length ||
      !$projectPath.length
    ) {
      return;
    }


    /*
     * getTotalLength는 jQuery 기능이 아니라
     * SVG DOM 기능이므로 실제 요소를 꺼냅니다.
     */
    const projectPath =
      $projectPath.get(0);


    /* SVG 경로 실제 길이 */
    const pathLength =
      projectPath.getTotalLength();


    /* SVG 초기 상태 */
    gsap.set(
      $projectLine.get(0),
      {
        visibility:
          'hidden'
      }
    );


    /* 선이 보이지 않는 초기 상태 */
    gsap.set(
      projectPath,
      {
        strokeDasharray:
          pathLength +
          ' ' +
          pathLength,

        strokeDashoffset:
          pathLength
      }
    );


    /*
     * 프로젝트 문구가 화면에 들어오면
     * 타원선을 그립니다.
     */
    ScrollTrigger.create({
      id:
        'contact-project-line',

      trigger:
        $projectText.get(0),

      start:
        'top 80%',

      once:
        true,


      onEnter:
        function () {
          $projectLine.css(
            'visibility',
            'visible'
          );


          gsap.fromTo(
            projectPath,

            {
              strokeDashoffset:
                pathLength
            },

            {
              strokeDashoffset:
                0,

              duration:
                0.7,

              ease:
                'none'
            }
          );
        }
    });
  }

  /* 한 줄씩 올라오는 텍스트 */
  function initScrollTextReveal() {
    const $groups =
      $('.scrollRevealGroup');


    /* 적용할 그룹이 없으면 실행하지 않습니다. */
    if (
      !$groups.length
    ) {
      return;
    }


    $groups.each(
      function () {
        const $group =
          $(this);


        const $texts =
          $group.find(
            '.scrollRevealText'
          );


        /* 움직일 텍스트가 없으면 실행하지 않습니다. */
        if (
          !$texts.length
        ) {
          return;
        }


        const texts =
          $texts.toArray();


        /*
         * GSAP에서만 위치를 설정합니다.
         *
         * 위치를 먼저 아래로 내린 후
         * 텍스트를 표시합니다.
         */
        gsap.set(
          texts,
          {
            yPercent:
              120,

            visibility:
              'visible'
          }
        );


        /* 스크롤 위치 감지 */
        ScrollTrigger.create({
          trigger:
            $group.get(0),

          start:
            'top 90%',

          once:
            true,


          onEnter:
            function () {
              gsap.to(
                texts,
                {
                  yPercent:
                    0,

                  duration:
                    1.5,

                  stagger:
                    0.07,

                  ease:
                    'power4.out',

                  overwrite:
                    'auto',

                  force3D:
                    true
                }
              );
            }
        });
      }
    );
  }

  /* 스크롤 위치 재계산 */
  function refreshMotion() {
    lenis.resize();

    ScrollTrigger.refresh();
  }


  /* 각 영역 기능 실행 */
  initVisualMotion();
  initProjectMotion();
  initCompanyMotion();
  initContactProjectLine();
  initScrollTextReveal();


  /* 이미지 로드 후 재계산 */
  if (
    document.readyState ===
    'complete'
  ) {
    requestAnimationFrame(
      refreshMotion
    );
  } else {
    $(window).one(
      'load.motionRefresh',
      refreshMotion
    );
  }


  /* 웹폰트 로드 후 재계산 */
  if (
    document.fonts
  ) {
    document.fonts.ready.then(
      refreshMotion
    );
  }


  /* 화면 크기 변경 후 재계산 */
  let resizeTimer;


  $(window).on(
    'resize.motionRefresh',

    function () {
      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          refreshMotion,
          150
        );
    }
  );


  /* 첫 화면 위치 계산 */
  requestAnimationFrame(
    refreshMotion
  );
});
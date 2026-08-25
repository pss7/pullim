$(function () {

  const gsap = window.gsap;
  const ScrollTrigger =
    window.ScrollTrigger;

  const SELECTOR = {
    sloganBox:
      '.serviceBrandSloganBox',

    sloganLine:
      '.serviceBrandSloganLine',

    popup:
      '#servicePopupWrap',

    popupImage:
      '.servicePopupImage',

    popupOpenButton:
      '.servicePopupOpenBtn',

    popupCloseButton:
      '.servicePopupCloseBtn',

    sourceImage:
      '.serviceImgBox img',

    popupContent: [
      '.servicePopupKeyword',
      '.servicePopupImgBox > p',
      '.servicePopupTextBox',
      '.servicePopupCloseBtn'
    ].join(',')
  };

  const EVENT_NAMESPACE =
    '.servicePopup';

  const SLOGAN_BACKGROUND_EMPTY =
    '0% 100%, 100% 100%';

  const SLOGAN_BACKGROUND_FULL =
    '100% 100%, 100% 100%';

  /* 서비스 슬로건 색상 채우기 */
  function initServiceSloganFill() {
    const $sloganBoxes = $(
      SELECTOR.sloganBox
    );

    if (!$sloganBoxes.length) {
      return;
    }

    if (
      !gsap ||
      !ScrollTrigger
    ) {
      console.warn(
        '서비스 슬로건 기능에는 GSAP과 ScrollTrigger가 필요합니다.'
      );

      return;
    }

    gsap.registerPlugin(
      ScrollTrigger
    );

    $sloganBoxes.each(
      function (boxIndex) {
        const $sloganBox =
          $(this);

        const lines = $sloganBox
          .find(
            SELECTOR.sloganLine
          )
          .toArray();

        if (!lines.length) {
          return;
        }

        const triggerId =
          `service-slogan-fill-${boxIndex}`;

        const previousTrigger =
          ScrollTrigger.getById(
            triggerId
          );

        const holdState = {
          progress: 0
        };

        /* 기존 트리거 중복 방지 */
        if (previousTrigger) {
          previousTrigger.kill();
        }

        /* 슬로건 초기 상태 */
        gsap.set(lines, {
          backgroundSize:
            SLOGAN_BACKGROUND_EMPTY
        });

        const sloganTimeline =
          gsap.timeline({
            defaults: {
              ease: 'none'
            }
          });

        /* 한 줄씩 색상 채우기 */
        lines.forEach(
          function (line) {
            sloganTimeline.to(
              line,
              {
                backgroundSize:
                  SLOGAN_BACKGROUND_FULL,

                duration: 1
              }
            );
          }
        );

        /* 완성 상태 유지 구간 */
        sloganTimeline.to(
          holdState,
          {
            progress: 1,
            duration: 0.9
          }
        );

        ScrollTrigger.create({
          id: triggerId,
          trigger:
            $sloganBox.get(0),

          start: 'top bottom',

          end: function () {
            const sloganTop =
              $sloganBox.offset().top;

            const sloganHeight =
              $sloganBox.outerHeight();

            const startPosition =
              sloganTop -
              window.innerHeight;

            const desiredEnd =
              sloganTop +
              sloganHeight -
              window.innerHeight *
                0.35;

            const maximumScroll =
              ScrollTrigger.maxScroll(
                window
              ) - 1;

            return Math.max(
              startPosition + 1,
              Math.min(
                desiredEnd,
                maximumScroll
              )
            );
          },

          animation:
            sloganTimeline,

          scrub: 0.7,
          invalidateOnRefresh: true
        });
      }
    );
  }

  /* 서비스 팝업 */
  function initServicePopup() {
    const $popup = $(
      SELECTOR.popup
    );

    if (!$popup.length) {
      return;
    }

    if (!gsap) {
      console.warn(
        '서비스 팝업 기능에는 GSAP이 필요합니다.'
      );

      return;
    }

    const $body = $('body');
    const $document = $(document);

    const $openButtons = $(
      SELECTOR.popupOpenButton
    );

    const $closeButton =
      $popup.find(
        SELECTOR.popupCloseButton
      );

    const $popupContents =
      $popup.find(
        SELECTOR.popupContent
      );

    const popupImage = $popup
      .find(
        SELECTOR.popupImage
      )
      .get(0);

    if (!popupImage) {
      return;
    }

    const state = {
      sourceImage: null,
      sourceVisibility: '',
      transitionImage: null,
      isAnimating: false,
      isOpen: false
    };

    /* Lenis 스크롤 제어 */
    function controlSmoothScroll(
      action
    ) {
      const lenis =
        window.lenis;

      if (
        lenis &&
        typeof lenis[action] ===
          'function'
      ) {
        lenis[action]();
      }
    }

    /* 전환용 복제 이미지 생성 */
    function createTransitionImage(
      image,
      rect
    ) {
      const clonedImage =
        image.cloneNode(true);

      const imageStyle =
        window.getComputedStyle(
          image
        );

      clonedImage.removeAttribute(
        'id'
      );

      clonedImage.classList.add(
        'servicePopupTransitionImage'
      );

      document.body.appendChild(
        clonedImage
      );

      gsap.set(
        clonedImage,
        {
          display: 'block',
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          margin: 0,

          objectFit:
            imageStyle.objectFit ===
            'fill'
              ? 'cover'
              : imageStyle.objectFit,

          pointerEvents: 'none',
          zIndex: 100000,
          autoAlpha: 1,
          transformOrigin:
            'center center'
        }
      );

      return clonedImage;
    }

    /* 복제 이미지 제거 */
    function removeTransitionImage() {
      if (
        !state.transitionImage
      ) {
        return;
      }

      gsap.killTweensOf(
        state.transitionImage
      );

      state.transitionImage.remove();

      state.transitionImage =
        null;
    }

    /* 팝업 상태 초기화 */
    function resetPopupState() {
      state.sourceImage = null;
      state.sourceVisibility = '';
      state.isAnimating = false;
      state.isOpen = false;
    }

    /* 서비스 팝업 열기 */
    function openServicePopup(
      event
    ) {
      event.preventDefault();

      if (
        state.isAnimating ||
        state.isOpen
      ) {
        return;
      }

      const sourceImage = $(this)
        .find(
          SELECTOR.sourceImage
        )
        .get(0);

      if (!sourceImage) {
        return;
      }

      state.isAnimating = true;
      state.sourceImage =
        sourceImage;

      state.sourceVisibility =
        sourceImage.style.visibility;

      const sourceRect =
        sourceImage
          .getBoundingClientRect();

      state.transitionImage =
        createTransitionImage(
          sourceImage,
          sourceRect
        );

      sourceImage.style.visibility =
        'hidden';

      $popup
        .css({
          display: 'flex',
          visibility: 'visible'
        })
        .attr(
          'aria-hidden',
          'false'
        );

      $body.addClass(
        'servicePopupOpen'
      );

      controlSmoothScroll(
        'stop'
      );

      const popupImageRect =
        popupImage
          .getBoundingClientRect();

      gsap.set(
        popupImage,
        {
          autoAlpha: 0
        }
      );

      gsap.set(
        $popupContents,
        {
          autoAlpha: 0,
          y: 30
        }
      );

      gsap.set(
        $popup,
        {
          backgroundColor:
            'rgba(245, 245, 245, 0)'
        }
      );

      const openTimeline =
        gsap.timeline({
          onComplete:
            function () {
              removeTransitionImage();

              state.isAnimating =
                false;

              state.isOpen =
                true;

              $closeButton.trigger(
                'focus'
              );
            }
        });

      /* 목록 이미지에서 팝업 이미지로 확대 */
      openTimeline.to(
        state.transitionImage,
        {
          top:
            popupImageRect.top,

          left:
            popupImageRect.left,

          width:
            popupImageRect.width,

          height:
            popupImageRect.height,

          duration: 1.35,
          ease: 'power4.inOut',
          force3D: true,
          overwrite: 'auto'
        },
        0
      );

      /* 팝업 배경 표시 */
      openTimeline.to(
        $popup,
        {
          backgroundColor:
            '#F5F5F5',

          duration: 0.6,
          ease: 'power2.out'
        },
        0
      );

      /* 팝업 텍스트 표시 */
      openTimeline.to(
        $popupContents,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out'
        },
        0.45
      );

      /* 복제 이미지 숨기기 */
      openTimeline.to(
        state.transitionImage,
        {
          autoAlpha: 0,
          duration: 0.25,
          ease: 'none'
        },
        1.1
      );

      /* 실제 팝업 이미지 표시 */
      openTimeline.to(
        popupImage,
        {
          autoAlpha: 1,
          duration: 0.25,
          ease: 'none'
        },
        1.1
      );
    }

    /* 서비스 팝업 닫기 */
    function closeServicePopup() {
      if (
        state.isAnimating ||
        !state.isOpen ||
        !state.sourceImage
      ) {
        return;
      }

      state.isAnimating = true;

      const popupImageRect =
        popupImage
          .getBoundingClientRect();

      const sourceRect =
        state.sourceImage
          .getBoundingClientRect();

      state.transitionImage =
        createTransitionImage(
          popupImage,
          popupImageRect
        );

      gsap.set(
        popupImage,
        {
          autoAlpha: 0
        }
      );

      const closeTimeline =
        gsap.timeline({
          onComplete:
            function () {
              removeTransitionImage();

              state.sourceImage
                .style.visibility =
                state.sourceVisibility;

              $popup
                .css({
                  display: 'none',
                  visibility: 'hidden'
                })
                .attr(
                  'aria-hidden',
                  'true'
                );

              gsap.set(
                popupImage,
                {
                  clearProps:
                    'opacity,visibility'
                }
              );

              gsap.set(
                $popupContents,
                {
                  clearProps:
                    'opacity,visibility,transform'
                }
              );

              gsap.set(
                $popup,
                {
                  clearProps:
                    'backgroundColor'
                }
              );

              $body.removeClass(
                'servicePopupOpen'
              );

              controlSmoothScroll(
                'start'
              );

              const $sourceButton =
                $(
                  state.sourceImage
                ).closest(
                  SELECTOR
                    .popupOpenButton
                );

              resetPopupState();

              $sourceButton.trigger(
                'focus'
              );
            }
        });

      /* 팝업 텍스트 숨기기 */
      closeTimeline.to(
        $popupContents,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.35,
          stagger: 0.03,
          ease: 'power2.in'
        },
        0
      );

      /* 팝업 이미지에서 목록 이미지로 축소 */
      closeTimeline.to(
        state.transitionImage,
        {
          top:
            sourceRect.top,

          left:
            sourceRect.left,

          width:
            sourceRect.width,

          height:
            sourceRect.height,

          duration: 1.2,
          ease: 'power4.inOut',
          force3D: true,
          overwrite: 'auto'
        },
        0
      );

      /* 팝업 배경 숨기기 */
      closeTimeline.to(
        $popup,
        {
          backgroundColor:
            'rgba(245, 245, 245, 0)',

          duration: 0.7,
          ease: 'power2.inOut'
        },
        0.25
      );

      /* 목록 원본 이미지 표시 */
      closeTimeline.set(
        state.sourceImage,
        {
          visibility: 'visible'
        },
        1.05
      );

      /* 복제 이미지 숨기기 */
      closeTimeline.to(
        state.transitionImage,
        {
          autoAlpha: 0,
          duration: 0.15,
          ease: 'none'
        },
        1.05
      );
    }

    /* 팝업 열기 이벤트 */
    $openButtons
      .off(
        EVENT_NAMESPACE
      )
      .on(
        `click${EVENT_NAMESPACE}`,
        openServicePopup
      );

    /* 팝업 닫기 이벤트 */
    $closeButton
      .off(
        EVENT_NAMESPACE
      )
      .on(
        `click${EVENT_NAMESPACE}`,
        closeServicePopup
      );

    /* ESC 키 팝업 닫기 */
    $document
      .off(
        `keydown${EVENT_NAMESPACE}`
      )
      .on(
        `keydown${EVENT_NAMESPACE}`,
        function (event) {
          if (
            event.key ===
            'Escape'
          ) {
            closeServicePopup();
          }
        }
      );
  }

  /* ScrollTrigger 위치 다시 계산 */
  function refreshScrollTrigger() {
    if (
      gsap &&
      ScrollTrigger
    ) {
      ScrollTrigger.refresh();
    }
  }

  /* 서비스 기능 실행 */
  initServiceSloganFill();
  initServicePopup();

  /* 첫 화면 위치 계산 */
  requestAnimationFrame(
    refreshScrollTrigger
  );

  /* 웹폰트 로드 후 위치 계산 */
  if (document.fonts) {
    document.fonts.ready.then(
      refreshScrollTrigger
    );
  }

});
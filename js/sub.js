$(function () {

  const gsap =
    window.gsap;

  const ScrollTrigger =
    window.ScrollTrigger;


  gsap.registerPlugin(
    ScrollTrigger
  );

  /*
   * 서비스 슬로건
   * 한 줄씩 색상 채우기
   */
  function initServiceSloganFill() {
    const $sloganBoxes =
      $('.serviceBrandSloganBox');


    if (
      !$sloganBoxes.length
    ) {
      return;
    }


    $sloganBoxes.each(
      function (
        boxIndex
      ) {
        const $sloganBox =
          $(this);


        const $lines =
          $sloganBox.find(
            '.serviceBrandSloganLine'
          );


        if (
          !$lines.length
        ) {
          return;
        }


        const lines =
          $lines.toArray();


        /* 초기 상태 */
        gsap.set(
          lines,
          {
            backgroundSize:
              '0% 100%, 100% 100%'
          }
        );


        /*
         * 마지막 완성 상태를 유지하기 위한
         * 빈 진행 객체
         */
        const holdState = {
          progress:
            0
        };


        /* 한 줄씩 채우는 타임라인 */
        const sloganTimeline =
          gsap.timeline({
            defaults: {
              ease:
                'none'
            }
          });


        lines.forEach(
          function (line) {
            sloganTimeline.to(
              line,
              {
                backgroundSize:
                  '100% 100%, 100% 100%',

                duration:
                  1
              }
            );
          }
        );


        /*
         * 전체 스크롤이 끝나기 전에
         * 채우기를 완료하고 상태 유지
         */
        sloganTimeline.to(
          holdState,
          {
            progress:
              1,

            duration:
              0.9,

            ease:
              'none'
          }
        );


        ScrollTrigger.create({
          id:
            'service-slogan-fill-' +
            boxIndex,

          trigger:
            $sloganBox.get(0),

          start:
            'top bottom',

          end:
            function () {
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

          scrub:
            0.7,

          invalidateOnRefresh:
            true
        });
      }
    );
  }


  /*
   * 서비스 팝업
   */
  function initServicePopup() {
    const $popup =
      $('#servicePopupWrap');


    if (
      !$popup.length
    ) {
      return;
    }


    const popupImage =
      $popup.find(
        '.servicePopupImage'
      ).get(0);


    const $popupCloseBtn =
      $popup.find(
        '.servicePopupCloseBtn'
      );


    const $popupContents =
      $popup.find(
        [
          '.servicePopupKeyword',
          '.servicePopupImgBox > p',
          '.servicePopupTextBox',
          '.servicePopupCloseBtn'
        ].join(',')
      );


    let activeSourceImage =
      null;

    let originalSourceVisibility =
      '';

    let transitionImage =
      null;

    let isPopupAnimating =
      false;

    let isPopupOpen =
      false;


    /*
     * 전환에 사용할 복제 이미지 생성
     */
    function createTransitionImage(
      image,
      rect
    ) {
      const clonedImage =
        image.cloneNode(true);


      clonedImage.removeAttribute(
        'id'
      );


      clonedImage.classList.add(
        'servicePopupTransitionImage'
      );


      document.body.appendChild(
        clonedImage
      );


      const imageStyle =
        window.getComputedStyle(
          image
        );


      gsap.set(
        clonedImage,
        {
          position:
            'fixed',

          top:
            rect.top,

          left:
            rect.left,

          width:
            rect.width,

          height:
            rect.height,

          margin:
            0,

          objectFit:
            imageStyle.objectFit ===
            'fill'
              ? 'cover'
              : imageStyle.objectFit,

          pointerEvents:
            'none',

          zIndex:
            100000,

          autoAlpha:
            1,

          transformOrigin:
            'center center'
        }
      );


      return clonedImage;
    }


    /* 전환 이미지 제거 */
    function removeTransitionImage() {
      if (
        !transitionImage
      ) {
        return;
      }


      gsap.killTweensOf(
        transitionImage
      );


      transitionImage.remove();


      transitionImage =
        null;
    }


    /* 팝업 열기 */
    function openServicePopup(
      event
    ) {
      event.preventDefault();


      if (
        isPopupAnimating ||
        isPopupOpen ||
        !popupImage
      ) {
        return;
      }


      activeSourceImage =
        $(this)
          .find(
            '.serviceImgBox img'
          )
          .get(0);


      if (
        !activeSourceImage
      ) {
        return;
      }


      isPopupAnimating =
        true;


      originalSourceVisibility =
        activeSourceImage.style.visibility;


      /* 목록 이미지 위치 */
      const sourceRect =
        activeSourceImage
          .getBoundingClientRect();


      /* 목록 이미지 복제 */
      transitionImage =
        createTransitionImage(
          activeSourceImage,
          sourceRect
        );


      /*
       * 목록 원본 이미지는 레이아웃을
       * 유지하면서 화면에서만 숨김
       */
      activeSourceImage.style.visibility =
        'hidden';


      /* 팝업 표시 */
      $popup.css({
        display:
          'flex',

        visibility:
          'visible'
      });


      $popup.attr(
        'aria-hidden',
        'false'
      );


      $('body').addClass(
        'servicePopupOpen'
      );


      /* Lenis 스크롤 정지 */
      if (
        window.lenis &&
        typeof window.lenis.stop ===
          'function'
      ) {
        window.lenis.stop();
      }


      /* 팝업 이미지 위치 */
      const popupImageRect =
        popupImage.getBoundingClientRect();


      /* 실제 팝업 이미지 숨김 */
      gsap.set(
        popupImage,
        {
          autoAlpha:
            0
        }
      );


      /* 팝업 문구 초기 상태 */
      gsap.set(
        $popupContents,
        {
          autoAlpha:
            0,

          y:
            30
        }
      );


      /* 팝업 배경 초기 상태 */
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


              isPopupAnimating =
                false;

              isPopupOpen =
                true;
            }
        });


      /*
       * 목록 이미지 크기에서
       * 팝업 이미지 크기로 확대
       */
      openTimeline.to(
        transitionImage,
        {
          top:
            popupImageRect.top,

          left:
            popupImageRect.left,

          width:
            popupImageRect.width,

          height:
            popupImageRect.height,

          duration:
            1.35,

          ease:
            'power4.inOut',

          force3D:
            true,

          overwrite:
            'auto'
        },

        0
      );


      /* 팝업 배경 표시 */
      openTimeline.to(
        $popup,
        {
          backgroundColor:
            '#F5F5F5',

          duration:
            0.6,

          ease:
            'power2.out'
        },

        0
      );


      /* 팝업 문구 표시 */
      openTimeline.to(
        $popupContents,
        {
          autoAlpha:
            1,

          y:
            0,

          duration:
            0.7,

          stagger:
            0.06,

          ease:
            'power3.out'
        },

        0.45
      );


      /*
       * 확대 완료 시점에
       * 복제 이미지를 팝업 이미지로 교체
       */
      openTimeline.to(
        transitionImage,
        {
          autoAlpha:
            0,

          duration:
            0.25,

          ease:
            'none'
        },

        1.1
      );


      openTimeline.to(
        popupImage,
        {
          autoAlpha:
            1,

          duration:
            0.25,

          ease:
            'none'
        },

        1.1
      );
    }


    /* 팝업 닫기 */
    function closeServicePopup() {
      if (
        isPopupAnimating ||
        !isPopupOpen ||
        !activeSourceImage ||
        !popupImage
      ) {
        return;
      }


      isPopupAnimating =
        true;


      /* 팝업 이미지 위치 */
      const popupImageRect =
        popupImage.getBoundingClientRect();


      /* 목록 이미지 위치 */
      const sourceRect =
        activeSourceImage
          .getBoundingClientRect();


      /*
       * 팝업 이미지를 복제해서
       * 목록 이미지 위치로 축소
       */
      transitionImage =
        createTransitionImage(
          popupImage,
          popupImageRect
        );


      /* 실제 팝업 이미지 숨김 */
      gsap.set(
        popupImage,
        {
          autoAlpha:
            0
        }
      );


      const closeTimeline =
        gsap.timeline({
          onComplete:
            function () {
              removeTransitionImage();


              /* 목록 이미지 복원 */
              activeSourceImage.style.visibility =
                originalSourceVisibility;


              /* 팝업 숨김 */
              $popup.css({
                display:
                  'none',

                visibility:
                  'hidden'
              });


              $popup.attr(
                'aria-hidden',
                'true'
              );


              /* GSAP 인라인 스타일 초기화 */
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


              $('body').removeClass(
                'servicePopupOpen'
              );


              /* Lenis 재시작 */
              if (
                window.lenis &&
                typeof window.lenis.start ===
                  'function'
              ) {
                window.lenis.start();
              }


              /* 상태 초기화 */
              activeSourceImage =
                null;

              originalSourceVisibility =
                '';

              isPopupAnimating =
                false;

              isPopupOpen =
                false;
            }
        });


      /* 팝업 문구 숨김 */
      closeTimeline.to(
        $popupContents,
        {
          autoAlpha:
            0,

          y:
            20,

          duration:
            0.35,

          stagger:
            0.03,

          ease:
            'power2.in'
        },

        0
      );


      /*
       * 팝업 이미지 크기에서
       * 목록 이미지 크기로 축소
       */
      closeTimeline.to(
        transitionImage,
        {
          top:
            sourceRect.top,

          left:
            sourceRect.left,

          width:
            sourceRect.width,

          height:
            sourceRect.height,

          duration:
            1.2,

          ease:
            'power4.inOut',

          force3D:
            true,

          overwrite:
            'auto'
        },

        0
      );


      /* 팝업 배경 제거 */
      closeTimeline.to(
        $popup,
        {
          backgroundColor:
            'rgba(245, 245, 245, 0)',

          duration:
            0.7,

          ease:
            'power2.inOut'
        },

        0.25
      );


      /*
       * 축소 완료 직전에
       * 목록 원본 이미지 표시
       */
      closeTimeline.set(
        activeSourceImage,
        {
          visibility:
            'visible'
        },

        1.05
      );


      /* 복제 이미지 숨김 */
      closeTimeline.to(
        transitionImage,
        {
          autoAlpha:
            0,

          duration:
            0.15,

          ease:
            'none'
        },

        1.05
      );
    }


    /* 서비스 목록 클릭 */
    $('.servicePopupOpenBtn').on(
      'click.servicePopup',
      openServicePopup
    );


    /* 닫기 버튼 */
    $popupCloseBtn.on(
      'click.servicePopup',
      closeServicePopup
    );


    /* ESC로 팝업 닫기 */
    $(document).on(
      'keydown.servicePopup',

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


  /* 기능 실행 */
  initServiceSloganFill();
  initServicePopup();


  /* 초기 위치 다시 계산 */
  requestAnimationFrame(
    function () {
      ScrollTrigger.refresh();
    }
  );


  /* 웹폰트 로드 후 다시 계산 */
  if (
    document.fonts
  ) {
    document.fonts.ready.then(
      function () {
        ScrollTrigger.refresh();
      }
    );
  }
});
$(function () {
  if (
    !window.gsap ||
    !window.ScrollTrigger
  ) {
    console.error(
      'GSAP과 ScrollTrigger를 먼저 불러와야 합니다.'
    );

    return;
  }


  const gsap =
    window.gsap;

  const ScrollTrigger =
    window.ScrollTrigger;


  gsap.registerPlugin(
    ScrollTrigger
  );


  /* 서비스 슬로건 한 줄씩 채우기 */
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
         * 타임라인 뒤쪽에 빈 구간을 추가하기 위한
         * 내부 상태 객체입니다.
         */
        const holdState = {
          progress:
            0
        };


        const sloganTimeline =
          gsap.timeline({
            defaults: {
              ease:
                'none'
            }
          });


        /*
         * 첫 번째 줄과 두 번째 줄을
         * 순서대로 채웁니다.
         */
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
         * 색상 채우기가 끝난 뒤 빈 진행 구간입니다.
         *
         * 전체 스크롤이 끝나기 전에 색상 채우기를
         * 완료하기 위해 사용합니다.
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


          /*
           * 슬로건이 화면 아래쪽으로
           * 들어오기 시작할 때 실행합니다.
           */
          start:
            'top bottom',


          /*
           * 자연스러운 종료 위치와 페이지 최대
           * 스크롤 중 먼저 도달하는 위치를 사용합니다.
           */
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


          /* 부드럽게 따라오는 속도 */
          scrub:
            0.7,


          invalidateOnRefresh:
            true
        });
      }
    );
  }


  /* 기능 실행 */
  initServiceSloganFill();


  requestAnimationFrame(
    function () {
      ScrollTrigger.refresh();
    }
  );
});
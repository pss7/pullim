$(function () {


  /* ==================================================
     새로고침 시 상단
  ================================================== */

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.scrollTo(0, 0);



  /* ==================================================
     LENIS
  ================================================== */

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    autoRaf: true
  });



  /* ==================================================
     VISUAL
  ================================================== */

  const visualWrap =
    document.querySelector('#visualWrap');

  const visualBox =
    document.querySelector('#visualWrap .visualBox');

  const popupContentBox = document.querySelector('#popupContentBox');

  let visualStep = 0;

  let visualAnimating = false;



  /* ==================================================
     VISUAL 최초 등장
  ================================================== */

  setTimeout(function () {

    if (visualBox) {
      visualBox.classList.add('active');
    }

  }, 100);



  /* ==================================================
     COMPANY INFORMATION
  ================================================== */

  const companyInfoWrap =
    document.querySelector('#companyInfoWrap');

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



  /* ==================================================
     COMPANY IMAGE 초기화
  ================================================== */

  if (companyImages.length > 0) {

    companyImages.forEach(function (image, index) {

      image.classList.toggle(
        'active',
        index === 0
      );

    });

  }



  /* ==================================================
     COMPANY NUMBER COUNT
  ================================================== */

  function startCompanyCount() {

    if (companyCountStarted) {
      return;
    }


    if (companyNumbers.length === 0) {
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
            (currentTime - startTime) / duration,
            1
          );


        /*
         * easeOut
         */

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



  /* ==================================================
     COMPANY IMAGE 변경
  ================================================== */

  function updateCompanyImage(progress) {

    if (companyImages.length === 0) {
      return;
    }


    let nextIndex = 0;


    /*
     * 0 ~ 33%
     * IMG 01
     */

    if (progress < 0.33) {

      nextIndex = 0;

    }


    /*
     * 33 ~ 66%
     * IMG 02
     */

    else if (progress < 0.66) {

      nextIndex = 1;

    }


    /*
     * 66 ~ 100%
     * IMG 03
     */

    else {

      nextIndex = 2;

    }


    /*
     * 이미지가 없으면 종료
     */

    if (!companyImages[nextIndex]) {
      return;
    }


    /*
     * 같은 이미지면 실행하지 않음
     */

    if (companyImageIndex === nextIndex) {
      return;
    }


    companyImageIndex =
      nextIndex;


    companyImages.forEach(function (image, index) {

      image.classList.toggle(
        'active',
        index === companyImageIndex
      );

    });

  }



  /* ==================================================
     COMPANY SCROLL 진행률
  ================================================== */

  function updateCompanyScroll() {

    if (!companyInfoWrap) {
      return;
    }


    const rect =
      companyInfoWrap.getBoundingClientRect();


    /*
     * 회사정보 영역이 화면에 들어왔는지
     */

    const companyActive =
      rect.top < window.innerHeight &&
      rect.bottom > 0;


    if (!companyActive) {
      return;
    }


    /* ==================================================
       숫자 카운팅
    ================================================== */

    startCompanyCount();


    /* ==================================================
       회사정보 전체 스크롤 진행률
    ================================================== */

    const scrollHeight =
      companyInfoWrap.offsetHeight -
      window.innerHeight;


    /*
     * 진행률 계산
     */

    let progress = 0;


    if (scrollHeight > 0) {

      progress =
        (-rect.top) /
        scrollHeight;

    }


    /*
     * 0 ~ 1 제한
     */

    progress =
      Math.max(
        0,
        Math.min(
          1,
          progress
        )
      );


    /* ==================================================
       이미지 변경
    ================================================== */

    updateCompanyImage(progress);

  }



  /* ==================================================
     WHEEL
  ================================================== */

  window.addEventListener(
    'wheel',
    function (e) {


      /* ==================================================
         VISUAL
      ================================================== */

      if (!visualWrap || !visualBox) {
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



      /*
       * Visual 기본 wheel 차단
       */

      e.preventDefault();



      /* ==================================================
         VISUAL 애니메이션 중
      ================================================== */

      if (visualAnimating) {
        return;
      }



      /* ==================================================
         DOWN
      ================================================== */

      if (e.deltaY > 0) {


        /* --------------------------------------
           STEP 0 → STEP 1
        -------------------------------------- */

        if (visualStep === 0) {

          visualAnimating = true;

          lenis.stop();

          visualStep = 1;

          visualBox.classList.add('step01');

          /* 팝업 등장 */
          if (popupContentBox) {
            popupContentBox.classList.add('active');
          }

          setTimeout(function () {

            visualAnimating = false;

          }, 600);

          return;
        }


        /* --------------------------------------
           STEP 1 → STEP 2
        -------------------------------------- */

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



        /* --------------------------------------
           STEP 2 → 다음 SECTION
        -------------------------------------- */

        if (visualStep === 2) {

          /*
           * Visual 제어 종료
           */

          lenis.start();

          return;

        }

      }



      /* ==================================================
         UP
      ================================================== */

      if (e.deltaY < 0) {


        /* --------------------------------------
           STEP 2 → STEP 1
        -------------------------------------- */

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

        /* --------------------------------------
           STEP 1 → STEP 0
        -------------------------------------- */

        if (visualStep === 1) {

          visualAnimating = true;

          lenis.stop();

          visualStep = 0;

          visualBox.classList.remove('step01');

          /* 팝업 숨김 */
          if (popupContentBox) {
            popupContentBox.classList.remove('active');
          }

          setTimeout(function () {

            visualAnimating = false;

          }, 600);

          return;
        }



        /* --------------------------------------
           STEP 0 → 이전 SECTION
        -------------------------------------- */

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



  /* ==================================================
     LENIS SCROLL
  ================================================== */

  lenis.on('scroll', function (e) {


    /* ==================================================
       COMPANY INFORMATION
    ================================================== */

    updateCompanyScroll();


  });


});
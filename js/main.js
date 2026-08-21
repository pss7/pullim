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
        autoRaf: true
    });


    /* ==================================================
       ELEMENT
    ================================================== */

    const visualWrap = document.querySelector('#visualWrap');
    const visualBox = document.querySelector('#visualWrap .visualBox');


    /* ==================================================
       STEP

       0 = 최초
       1 = 첫 번째 스크롤
       2 = 두 번째 스크롤
    ================================================== */

    let visualStep = 0;

    let wheelLock = false;


    /* ==================================================
       페이지 진입
    ================================================== */

    setTimeout(function () {

        visualBox.classList.add('active');

    }, 100);


    /* ==================================================
       WHEEL
    ================================================== */

    window.addEventListener('wheel', function (e) {

        /* 너무 빠르게 들어오는 wheel 이벤트 방지 */
        if (wheelLock) {
            return;
        }

        wheelLock = true;

        setTimeout(function () {
            wheelLock = false;
        }, 500);


        /* ==================================================
           아래로 스크롤
        ================================================== */

        if (e.deltaY > 0) {


            /* ------------------------------------------
               1번째 스크롤
               ------------------------------------------ */

            if (visualStep === 0) {

                visualStep = 1;

                visualBox.classList.add('step01');

                return;
            }


            /* ------------------------------------------
               2번째 스크롤
               
               텍스트 떨어짐
               비디오 영역 올라감
               ABOUT은 기존 스크롤로 올라옴
               ------------------------------------------ */

            if (visualStep === 1) {

                visualStep = 2;

                visualBox.classList.add('step02');

                visualWrap.classList.add('step02');

                return;
            }

        }


        /* ==================================================
           위로 스크롤
        ================================================== */

        if (e.deltaY < 0) {


            /* ------------------------------------------
               STEP02 → STEP01
               ------------------------------------------ */

            if (visualStep === 2) {

                visualStep = 1;

                visualBox.classList.remove('step02');

                visualWrap.classList.remove('step02');

                return;
            }


            /* ------------------------------------------
               STEP01 → 초기
               ------------------------------------------ */

            if (visualStep === 1) {

                visualStep = 0;

                visualBox.classList.remove('step01');

                return;
            }

        }

    }, {
        passive: true
    });


    /* ==================================================
       LENIS SCROLL
       
       여기서는 STEP을 판단하지 않는다.
       실제 페이지 스크롤만 Lenis가 담당한다.
    ================================================== */

    lenis.on('scroll', function () {

        // STEP 제어는 wheel 이벤트에서 처리

    });

});
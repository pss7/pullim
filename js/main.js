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



            /* ==========================================
               Visual 애니메이션 중
            ========================================== */

            if (visualAnimating) {

                return;

            }



            /* ==========================================
               DOWN
            ========================================== */

            if (e.deltaY > 0) {


                /* --------------------------------------
                   STEP 0 → STEP 1
                -------------------------------------- */

                if (visualStep === 0) {

                    visualAnimating = true;

                    lenis.stop();


                    visualStep = 1;


                    visualBox.classList.add(
                        'step01'
                    );


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


                    visualBox.classList.remove(
                        'step01'
                    );


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

    lenis.on('scroll', function () {

        /*
         * 일반 영역
         * → Lenis
         *
         * Visual
         * → STEP
         */

    });


});
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
        document.querySelector(
            '#visualWrap .visualBox'
        );


    let visualStep = 0;

    /*
     * Visual 애니메이션 중
     */
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
       PROJECT
    ================================================== */

    const projectWrap =
        document.querySelector('#projectWrap');

    const projectBox =
        document.querySelector(
            '#projectWrap .projectBox'
        );

    const projectList =
        document.querySelector(
            '#projectWrap .projectList'
        );

    const projectItems =
        document.querySelectorAll(
            '#projectWrap .projectList li'
        );



    /* ==================================================
       PROJECT 설정
    ================================================== */

    const CARD_WIDTH = 600;

    /*
     * 이전 카드 크기
     */
    const PREV_WIDTH = 300;

    /*
     * 이전 카드가 보이는 영역
     */
    const CARD_VISIBLE = 60;

    /*
     * 현재 카드 오른쪽 여백
     */
    const RIGHT_GAP = 60;

    /*
     * 카드 애니메이션 시간
     */
    const PROJECT_DURATION = 800;

    /*
     * 카드 하나당 스크롤 구간
     */
    const PROJECT_STEP_HEIGHT = 700;



    /* ==================================================
       PROJECT 상태
    ================================================== */

    /*
     * -1 = 프로젝트 진입 전
     *
     * 0 = CARD 01
     * 1 = CARD 02
     * ...
     */
    let projectStep = -1;


    /*
     * 카드 애니메이션 중
     */
    let projectAnimating = false;


    /*
     * PROJECT가 화면을 제어 중인지
     */
    let projectMode = false;


    /*
     * 마지막 카드가 화면에 도착했는지
     */
    let lastCardReady = false;



    /* ==================================================
       PROJECT 높이 자동 계산
    ================================================== */

    function setProjectHeight() {

        if (!projectWrap) {
            return;
        }


        const cardCount =
            projectItems.length;


        /*
         * 카드 전환 횟수
         */
        const stepCount =
            Math.max(cardCount - 1, 1);


        /*
         * 1화면 + 카드 전환 거리
         */
        const projectHeight =
            window.innerHeight +
            (
                stepCount *
                PROJECT_STEP_HEIGHT
            );


        projectWrap.style.height =
            projectHeight + 'px';

    }



    /* ==================================================
       PROJECT 카드 위치
    ================================================== */

    function updateProject() {

        if (!projectList) {
            return;
        }


        const listWidth =
            projectList.clientWidth;


        /*
         * 현재 카드 위치
         *
         * 오른쪽 60px
         */
        const currentX =
            listWidth -
            CARD_WIDTH -
            RIGHT_GAP;



        projectItems.forEach(function (item, index) {


            /* ==================================================
               아직 등장하지 않은 카드
            ================================================== */

            if (index > projectStep) {

                item.classList.remove('current');
                item.classList.remove('prev');


                item.style.width =
                    CARD_WIDTH + 'px';


                item.style.transform =
                    `translateX(${listWidth}px)`;


                item.style.zIndex = 1;


                return;

            }



            /* ==================================================
               현재 카드
            ================================================== */

            if (index === projectStep) {

                item.classList.remove('prev');

                item.classList.add('current');


                item.style.width =
                    CARD_WIDTH + 'px';


                item.style.transform =
                    `translateX(${currentX}px)`;


                item.style.zIndex = 100;


                return;

            }



            /* ==================================================
               이전 카드
            ================================================== */

            item.classList.remove('current');

            item.classList.add('prev');


            item.style.width =
                PREV_WIDTH + 'px';


            /*
             * CARD 01 → 0px
             * CARD 02 → 60px
             * CARD 03 → 120px
             */
            const leftX =
                index * CARD_VISIBLE;


            item.style.transform =
                `translateX(${leftX}px)`;


            /*
             * 뒤 카드가 위
             */
            item.style.zIndex =
                index + 10;

        });

    }



    /* ==================================================
       PROJECT 초기화
    ================================================== */

    if (projectItems.length > 0) {

        setProjectHeight();

        updateProject();

    }



    /* ==================================================
       PROJECT 진입
    ================================================== */

    function enterProject() {

        if (projectMode) {
            return;
        }


        projectMode = true;

        lastCardReady = false;


        /*
         * PROJECT가 시작되면
         * Lenis가 페이지를 움직이지 못하게 함
         */
        lenis.stop();

    }



    /* ==================================================
       PROJECT 종료
    ================================================== */

    function exitProject() {

        projectMode = false;

        lastCardReady = false;

        lenis.start();

    }



    /* ==================================================
       PROJECT 다음 카드
    ================================================== */

    function projectNext() {

        /*
         * 애니메이션 중이면
         * 절대 다시 실행하지 않음
         */
        if (projectAnimating) {
            return false;
        }


        /*
         * 이미 마지막 카드
         */
        if (
            projectStep >=
            projectItems.length - 1
        ) {

            return false;

        }


        /*
         * 애니메이션 시작
         */
        projectAnimating = true;


        /*
         * 다음 카드
         */
        projectStep++;


        /*
         * 카드 위치 변경
         */
        updateProject();



        /*
         * 마지막 카드인지 체크
         *
         * ★ 여기서는
         * 마지막 카드로 변경만 한다.
         *
         * 다음 섹션으로 절대 이동하지 않는다.
         */
        if (
            projectStep ===
            projectItems.length - 1
        ) {

            lastCardReady = true;

        }



        /*
         * CSS transition 완료 대기
         */
        setTimeout(function () {

            projectAnimating = false;

        }, PROJECT_DURATION);


        return true;

    }



    /* ==================================================
       PROJECT 이전 카드
    ================================================== */

    function projectPrev() {

        /*
         * 애니메이션 중
         */
        if (projectAnimating) {
            return false;
        }


        /*
         * 첫 번째 카드보다 위
         */
        if (projectStep <= -1) {
            return false;
        }


        /*
         * 애니메이션 시작
         */
        projectAnimating = true;


        /*
         * 이전 카드
         */
        projectStep--;


        /*
         * 마지막 카드 상태 해제
         */
        lastCardReady = false;


        /*
         * 위치 변경
         */
        updateProject();



        setTimeout(function () {

            projectAnimating = false;

        }, PROJECT_DURATION);


        return true;

    }



    /* ==================================================
       PROJECT 활성화 확인
    ================================================== */

    function isProjectInViewport() {

        if (!projectWrap) {
            return false;
        }


        const rect =
            projectWrap.getBoundingClientRect();


        return (
            rect.top <= 1 &&
            rect.bottom > window.innerHeight
        );

    }



    /* ==================================================
       PROJECT → COMPANY
    ================================================== */

    function moveToNextSection() {

        const companyInfoWrap =
            document.querySelector(
                '#companyInfoWrap'
            );


        if (!companyInfoWrap) {
            return;
        }



        /*
         * PROJECT 제어 종료
         */
        projectMode = false;

        lastCardReady = false;


        /*
         * Lenis 복구
         */
        lenis.start();



        /*
         * COMPANY 실제 문서 위치
         */
        const companyTop =
            companyInfoWrap.getBoundingClientRect().top +
            window.scrollY;



        /*
         * 다음 섹션으로 이동
         */
        requestAnimationFrame(function () {

            lenis.scrollTo(
                companyTop,
                {
                    duration: 0.8,
                    immediate: false
                }
            );

        });

    }



    /* ==================================================
       RESIZE
    ================================================== */

    window.addEventListener(
        'resize',
        function () {

            setProjectHeight();

            updateProject();

        }
    );



    /* ==================================================
       WHEEL
    ================================================== */

    window.addEventListener(
        'wheel',
        function (e) {


            /* ==================================================
               PROJECT MODE
               
               ★ 한번 진입하면
               isProjectActive()가 잠깐 false가 되어도
               Lenis가 다시 움직이지 않도록
               projectMode를 우선한다.
            ================================================== */

            if (
                projectMode ||
                isProjectInViewport()
            ) {


                /*
                 * PROJECT 진입
                 */
                if (!projectMode) {

                    enterProject();

                }



                /*
                 * ★ 핵심
                 *
                 * PROJECT에서는
                 * Lenis 기본 wheel을
                 * 항상 차단한다.
                 */
                e.preventDefault();



                /* ==================================================
                   애니메이션 중
                ================================================== */

                if (projectAnimating) {

                    return;

                }



                /* ==================================================
                   아래로
                ================================================== */

                if (e.deltaY > 0) {


                    /* ------------------------------------------
                       아직 마지막 카드가 아님
                    ------------------------------------------ */

                    if (
                        projectStep <
                        projectItems.length - 1
                    ) {

                        projectNext();

                        return;

                    }



                    /* ------------------------------------------
                       마지막 카드
                       
                       ★ 마지막 카드가 방금 등장한 상태
                       ★ 여기서는 아무것도 하지 않는다.
                       
                       이미 마지막 카드가 화면에 있으므로
                       "다음 휠"을 기다린다.
                    ------------------------------------------ */

                    if (lastCardReady) {

                        /*
                         * 마지막 카드 애니메이션이
                         * 완전히 끝났는지 다시 확인
                         */
                        if (projectAnimating) {
                            return;
                        }


                        /*
                         * 이제서야 다음 섹션
                         */
                        moveToNextSection();

                        return;

                    }


                    return;

                }



                /* ==================================================
                   위로
                ================================================== */

                if (e.deltaY < 0) {


                    /*
                     * 카드가 있으면 이전 카드
                     */
                    if (projectStep >= 0) {

                        projectPrev();

                        return;

                    }



                    /*
                     * CARD 01보다 더 위
                     *
                     * PROJECT 제어 종료
                     */
                    exitProject();

                    return;

                }


                return;

            }



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
                visualRect.bottom >= window.innerHeight;



            if (!visualActive) {
                return;
            }



            /*
             * VISUAL에서는
             * Lenis 기본 스크롤 차단
             */
            e.preventDefault();



            /* ==================================================
               VISUAL 애니메이션 중
            ================================================== */

            if (visualAnimating) {

                return;

            }



            /* ==================================================
               아래
            ================================================== */

            if (e.deltaY > 0) {


                /* ------------------------------------------
                   STEP 0 → STEP 1
                ------------------------------------------ */

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



                /* ------------------------------------------
                   STEP 1 → STEP 2
                ------------------------------------------ */

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



                /*
                 * STEP 2 이후
                 *
                 * 이제 Visual 제어 종료
                 */
                lenis.start();

                return;

            }



            /* ==================================================
               위
            ================================================== */

            if (e.deltaY < 0) {


                /* ------------------------------------------
                   STEP 2 → STEP 1
                ------------------------------------------ */

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



                /* ------------------------------------------
                   STEP 1 → STEP 0
                ------------------------------------------ */

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



                /*
                 * STEP 0
                 *
                 * Visual 위로 빠져나감
                 */
                lenis.start();

                return;

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
         * → STEP 방식
         *
         * Project
         * → 카드 STEP 방식
         */

    });


});
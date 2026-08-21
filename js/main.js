$(function () {

    /* 새로고침 시 상단 */
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);


    /* LENIS */
    const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        autoRaf: true
    });


    /* VISUAL */
    const visualWrap = document.querySelector('#visualWrap');
    const visualBox = document.querySelector('#visualWrap .visualBox');


    /* =========================
       페이지 진입
       텍스트 등장
    ========================= */

    setTimeout(function () {

        visualBox.classList.add('active');

    }, 100);


    /* =========================
       스크롤
    ========================= */

    lenis.on('scroll', function () {

        const scrollTop = lenis.scroll;

        const visualTop = visualWrap.offsetTop;


        /*
         * visualWrap에 진입한 순간
         */
        const progress = scrollTop - visualTop;


        /*
         * visualWrap 시작점에서
         * 조금만 스크롤하면 step01
         */
        if (progress > 50) {

            visualBox.classList.add('step01');

        } else {

            visualBox.classList.remove('step01');

        }

    });

});
$(function () {

    /* =========================================================
       새로고침 시 항상 상단
    ========================================================= */

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);


    /* =========================================================
       LENIS
    ========================================================= */

    const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        autoRaf: true
    });


    /* =========================================================
       ELEMENT
    ========================================================= */

    const $visual = $('#visualWrap');
    const $aboutSection = $('#aboutSection');
    const $about = $('#aboutWrap');
    const $project = $('#projectWrap');
    const $company = $('#companyInfoWrap');
    const $contact = $('#contactWrap');


    /* =========================================================
       ABOUT ELEMENT
    ========================================================= */

    const $aboutTitleLabel =
        $about.find('.aboutTitleBox > span');

    const $aboutTitleStrong =
        $about.find('.aboutTitleBox h2 strong');

    const $aboutView =
        $about.find('.aboutViewLink');

    const $aboutText01 =
        $about.find('.aboutText01');

    const $aboutText02 =
        $about.find('.aboutText02');


    /* =========================================================
       PROJECT
    ========================================================= */

    const $projectTitle =
        $project.find('.projectTitleBox');

    const $projectList =
        $project.find('.projectList');


    /* =========================================================
       COMPANY
    ========================================================= */

    const $companyVisualContent =
        $company.find('.companyVisualContentBox');


    /* =========================================================
       CONTACT
    ========================================================= */

    const $contactTitle =
        $contact.find('.contactTitleBox h2');


    /* =========================================================
       ABOUT 초기값
    ========================================================= */

    /*
     * About 자체는 처음부터 보여준다.
     *
     * 배경이 Visual 다음 영역을 자연스럽게 채우도록
     * opacity를 사용하지 않는다.
     */

    $about.css({
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto'
    });


    /*
     * WHO WE ARE
     */

    $aboutTitleLabel.css({
        transform:
            'translate3d(0, 40px, 0)'
    });


    /*
     * A NEW STANDARD
     *
     * 처음부터 왼쪽
     */

    $aboutTitleStrong.eq(0).css({
        transform:
            'translate3d(-500px, 0, 0)'
    });


    /*
     * IN ADTECH
     *
     * 처음부터 오른쪽
     */

    $aboutTitleStrong.eq(1).css({
        transform:
            'translate3d(500px, 0, 0)'
    });


    /*
     * DETAIL VIEW
     */

    $aboutView.css({
        transform:
            'translate3d(0, 40px, 0)'
    });


    /*
     * TEXT
     */

    $aboutText01.css({
        opacity: 0,
        transform:
            'translate3d(0, 180px, 0)'
    });

    $aboutText02.css({
        opacity: 0,
        transform:
            'translate3d(0, 180px, 0)'
    });


    /* =========================================================
       PROJECT 초기값
    ========================================================= */

    $projectList.css({
        opacity: 0,
        transform:
            'translate3d(300px, 0, 0)'
    });


    /* =========================================================
       COMPANY 초기값
    ========================================================= */

    $companyVisualContent.css({
        opacity: 0,
        transform:
            'translate3d(0, 350px, 0)'
    });


    /* =========================================================
       CONTACT 초기값
    ========================================================= */

    $contactTitle.css({
        transform:
            'scale(0.35)',
        transformOrigin:
            'left center'
    });


    /* =========================================================
       LENIS SCROLL
    ========================================================= */

    lenis.on('scroll', ({ scroll }) => {

        const vh =
            window.innerHeight;


        /* =====================================================
           01. VISUAL
        ===================================================== */

        const visualTop =
            $visual.offset().top;

        const visualHeight =
            $visual.outerHeight();

        const visualStart =
            visualTop;

        const visualEnd =
            visualTop +
            visualHeight;


        /* =====================================================
           VISUAL 전체 진행률
        ===================================================== */

        let visualProgress =
            (scroll - visualStart) /
            (visualEnd - visualStart);

        visualProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    visualProgress
                )
            );


        /* =====================================================
           VISUAL IMAGE
           80% → 최종 크기
        ===================================================== */

        let imageProgress =
            visualProgress / 0.75;

        imageProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    imageProgress
                )
            );


        const imageEase =
            1 -
            Math.pow(
                1 - imageProgress,
                3
            );


        /* =====================================================
           VISUAL TEXT 01
        ===================================================== */

        let visual01Progress =
            visualProgress / 0.25;

        visual01Progress =
            Math.max(
                0,
                Math.min(
                    1,
                    visual01Progress
                )
            );


        const visual01Ease =
            1 -
            Math.pow(
                1 - visual01Progress,
                3
            );


        const visual01Y =
            120 -
            (120 * visual01Ease);


        const visual01Scale =
            1.25 -
            (0.25 * visual01Ease);


        $visual.find('.visualText01').css({
            opacity:
                visual01Ease,

            transform:
                `translate3d(
                    0,
                    ${visual01Y}px,
                    0
                )
                scale(${visual01Scale})`
        });


        /* =====================================================
           VISUAL TEXT 02
        ===================================================== */

        let visual02Progress =
            (visualProgress - 0.25) / 0.25;

        visual02Progress =
            Math.max(
                0,
                Math.min(
                    1,
                    visual02Progress
                )
            );


        const visual02Ease =
            1 -
            Math.pow(
                1 - visual02Progress,
                3
            );


        const visual02Y =
            120 -
            (120 * visual02Ease);


        const visual02Scale =
            1.15 -
            (0.15 * visual02Ease);


        $visual.find('.visualText02').css({
            opacity:
                visual02Ease,

            transform:
                `translate3d(
                    0,
                    ${visual02Y}px,
                    0
                )
                scale(${visual02Scale})`
        });


        /* =====================================================
           VISUAL TEXT 03
        ===================================================== */

        let visual03Progress =
            (visualProgress - 0.50) / 0.25;

        visual03Progress =
            Math.max(
                0,
                Math.min(
                    1,
                    visual03Progress
                )
            );


        const visual03Ease =
            1 -
            Math.pow(
                1 - visual03Progress,
                3
            );


        const visual03Y =
            120 -
            (120 * visual03Ease);


        const visual03Scale =
            1.15 -
            (0.15 * visual03Ease);


        $visual.find('.visualText03').css({
            opacity:
                visual03Ease,

            transform:
                `translate3d(
                    0,
                    ${visual03Y}px,
                    0
                )
                scale(${visual03Scale})`
        });


        /* =====================================================
           VISUAL VIDEO
           80% → 최종 크기
        ===================================================== */

        const $video =
            $visual.find(
                '.visualVideoBox video'
            );


        if ($video.length) {

            const videoStyle =
                getComputedStyle(
                    $video[0]
                );


            const endWidth =
                parseFloat(
                    videoStyle.getPropertyValue(
                        '--video-end-width'
                    )
                );


            const endHeight =
                parseFloat(
                    videoStyle.getPropertyValue(
                        '--video-end-height'
                    )
                );


            const startWidth =
                $video.parent().width() *
                0.8;


            const startHeight =
                $video.parent().height() *
                0.8;


            const videoProgress =
                imageEase;


            const videoWidth =
                startWidth +
                (
                    (
                        endWidth / 100
                    ) *
                    window.innerWidth -
                    startWidth
                ) *
                videoProgress;


            const videoHeight =
                startHeight +
                (
                    (
                        endHeight / 100
                    ) *
                    window.innerWidth -
                    startHeight
                ) *
                videoProgress;


            $video.css({
                width:
                    `${videoWidth}px`,

                height:
                    `${videoHeight}px`
            });

        }


        /* =====================================================
           02. ABOUT
        ===================================================== */

        const aboutTop =
            $aboutSection.offset().top;

        const aboutHeight =
            $aboutSection.outerHeight();

        const aboutStart =
            aboutTop;

        const aboutEnd =
            aboutTop +
            aboutHeight;


        /* =====================================================
           VISUAL → ABOUT
           
           ★ 핵심 구간
           
           Visual 끝
           ↓
           About으로 이동하는 동안
           ↓
           양옆 → 중앙
        ===================================================== */

        const aboutMoveStart =
            visualEnd;


        /*
         * 이동 거리를 80vh로 설정
         *
         * 너무 짧으면 딱 붙는 느낌
         */

        const aboutMoveEnd =
            visualEnd +
            (vh * 0.8);


        /* =====================================================
           ABOUT TITLE
        ===================================================== */


        /*
         * ① Visual 진행 중
         *
         * 처음부터 양옆에 있음
         */

        if (scroll < aboutMoveStart) {

            $aboutTitleStrong.eq(0).css({
                transform:
                    'translate3d(-500px, 0, 0)'
            });


            $aboutTitleStrong.eq(1).css({
                transform:
                    'translate3d(500px, 0, 0)'
            });

        }


        /*
         * ② Visual 종료 후
         *
         * 양옆 → 중앙
         */

        else if (
            scroll >= aboutMoveStart &&
            scroll < aboutMoveEnd
        ) {

            let aboutTitleProgress =
                (
                    scroll -
                    aboutMoveStart
                ) /
                (
                    aboutMoveEnd -
                    aboutMoveStart
                );


            aboutTitleProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        aboutTitleProgress
                    )
                );


            const aboutTitleEase =
                1 -
                Math.pow(
                    1 -
                    aboutTitleProgress,
                    3
                );


            /*
             * 왼쪽
             */

            const leftX =
                -500 +
                (
                    500 *
                    aboutTitleEase
                );


            $aboutTitleStrong.eq(0).css({
                transform:
                    `translate3d(
                        ${leftX}px,
                        0,
                        0
                    )`
            });


            /*
             * 오른쪽
             */

            const rightX =
                500 -
                (
                    500 *
                    aboutTitleEase
                );


            $aboutTitleStrong.eq(1).css({
                transform:
                    `translate3d(
                        ${rightX}px,
                        0,
                        0
                    )`
            });

        }


        /*
         * ③ About 도착
         *
         * 중앙에서 유지
         */

        else {

            $aboutTitleStrong.eq(0).css({
                transform:
                    'translate3d(0, 0, 0)'
            });


            $aboutTitleStrong.eq(1).css({
                transform:
                    'translate3d(0, 0, 0)'
            });

        }


        /* =====================================================
           ABOUT 내부 스크롤
        ===================================================== */

        if (
            scroll >= aboutStart &&
            scroll < aboutEnd
        ) {

            let aboutProgress =
                (
                    scroll -
                    aboutStart
                ) /
                (
                    aboutEnd -
                    aboutStart
                );


            aboutProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        aboutProgress
                    )
                );


            /* =================================================
               WHO WE ARE
            ================================================= */

            let labelProgress =
                aboutProgress /
                0.15;


            labelProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        labelProgress
                    )
                );


            const labelEase =
                1 -
                Math.pow(
                    1 -
                    labelProgress,
                    3
                );


            $aboutTitleLabel.css({
                transform:
                    `translate3d(
                        0,
                        ${
                            40 -
                            (
                                40 *
                                labelEase
                            )
                        }px,
                        0
                    )`
            });


            /* =================================================
               DETAIL VIEW
            ================================================= */

            let viewProgress =
                (
                    aboutProgress -
                    0.30
                ) /
                0.20;


            viewProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        viewProgress
                    )
                );


            const viewEase =
                1 -
                Math.pow(
                    1 -
                    viewProgress,
                    3
                );


            $aboutView.css({
                transform:
                    `translate3d(
                        0,
                        ${
                            40 -
                            (
                                40 *
                                viewEase
                            )
                        }px,
                        0
                    )`
            });


            /* =================================================
               TEXT 01
            ================================================= */

            let text01Progress =
                (
                    aboutProgress -
                    0.45
                ) /
                0.20;


            text01Progress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        text01Progress
                    )
                );


            const text01Ease =
                1 -
                Math.pow(
                    1 -
                    text01Progress,
                    3
                );


            const text01Y =
                180 -
                (
                    180 *
                    text01Ease
                );


            $aboutText01.css({
                opacity:
                    text01Ease,

                transform:
                    `translate3d(
                        0,
                        ${text01Y}px,
                        0
                    )`
            });


            /* =================================================
               TEXT 02
            ================================================= */

            let text02Progress =
                (
                    aboutProgress -
                    0.65
                ) /
                0.25;


            text02Progress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        text02Progress
                    )
                );


            const text02Ease =
                1 -
                Math.pow(
                    1 -
                    text02Progress,
                    3
                );


            const text02Y =
                180 -
                (
                    180 *
                    text02Ease
                );


            $aboutText02.css({
                opacity:
                    text02Ease,

                transform:
                    `translate3d(
                        0,
                        ${text02Y}px,
                        0
                    )`
            });

        }


        /* =====================================================
           03. PROJECT
        ===================================================== */

        const projectTop =
            $project.offset().top;


        const projectStart =
            projectTop -
            vh * 0.7;


        const projectEnd =
            projectTop +
            vh * 0.3;


        if (scroll < projectStart) {

            $projectTitle.css({
                opacity: 0,
                transform:
                    'translate3d(-500px, 0, 0)'
            });


            $projectList.css({
                opacity: 0,
                transform:
                    'translate3d(500px, 0, 0)'
            });

        }


        else if (
            scroll >= projectStart &&
            scroll < projectEnd
        ) {

            let progress =
                (
                    scroll -
                    projectStart
                ) /
                (
                    projectEnd -
                    projectStart
                );


            progress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        progress
                    )
                );


            const ease =
                1 -
                Math.pow(
                    1 -
                    progress,
                    3
                );


            const titleX =
                -300 +
                (
                    300 *
                    ease
                );


            $projectTitle.css({
                opacity: ease,
                transform:
                    `translate3d(
                        ${titleX}px,
                        0,
                        0
                    )`
            });


            const listX =
                300 -
                (
                    300 *
                    ease
                );


            $projectList.css({
                opacity: ease,
                transform:
                    `translate3d(
                        ${listX}px,
                        0,
                        0
                    )`
            });

        }


        else {

            $projectTitle.css({
                opacity: 1,
                transform:
                    'translate3d(0, 0, 0)'
            });


            $projectList.css({
                opacity: 1,
                transform:
                    'translate3d(0, 0, 0)'
            });

        }


        /* =====================================================
           04. COMPANY
        ===================================================== */

        const companyTop =
            $company.offset().top;


        const companyStart =
            companyTop -
            vh * 0.8;


        const companyEnd =
            companyTop;


        if (scroll < companyStart) {

            $companyVisualContent.css({
                opacity: 0,
                transform:
                    'translate3d(0, 250px, 0)'
            });

        }


        else if (
            scroll >= companyStart &&
            scroll < companyEnd
        ) {

            let progress =
                (
                    scroll -
                    companyStart
                ) /
                (
                    companyEnd -
                    companyStart
                );


            progress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        progress
                    )
                );


            const ease =
                1 -
                Math.pow(
                    1 -
                    progress,
                    3
                );


            const contentY =
                250 -
                (
                    250 *
                    ease
                );


            $companyVisualContent.css({
                opacity: ease,
                transform:
                    `translate3d(
                        0,
                        ${contentY}px,
                        0
                    )`
            });

        }


        else {

            $companyVisualContent.css({
                opacity: 1,
                transform:
                    'translate3d(0, 0, 0)'
            });

        }


        /* =====================================================
           05. CONTACT
        ===================================================== */

        const contactTop =
            $contact.offset().top;


        const contactStart =
            contactTop -
            vh;


        const contactEnd =
            contactTop;


        let contactProgress =
            (
                scroll -
                contactStart
            ) /
            (
                contactEnd -
                contactStart
            );


        contactProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    contactProgress
                )
            );


        const contactScale =
            0.35 +
            (
                1 -
                0.35
            ) *
            contactProgress;


        $contactTitle.css(
            'transform',
            `scale(${contactScale})`
        );


        if (scroll < contactStart) {

            $contactTitle.css(
                'transform',
                'scale(0.35)'
            );

        }


        if (scroll >= contactEnd) {

            $contactTitle.css(
                'transform',
                'scale(1)'
            );

        }

    });


    /* =========================================================
       LOAD
    ========================================================= */

    $(window).on('load', function () {

        $('#visualWrap').addClass('active');


        setTimeout(function () {

            lenis.scrollTo(0, {
                immediate: true
            });

            window.scrollTo(0, 0);

        }, 50);

    });

});
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
       ABOUT 초기 위치
       
       ★ opacity 사용 안 함
       ★ transform만 사용
       
       h2와 완전히 같은 방식
    ========================================================= */

    $aboutTitleLabel.css({
        transform: 'translate3d(-500px, 0, 0)'
    });

    $aboutView.css({
        transform: 'translate3d(500px, 0, 0)'
    });

    $aboutText01.css({
        transform: 'translate3d(-500px, 0, 0)'
    });

    $aboutText02.css({
        transform: 'translate3d(500px, 0, 0)'
    });


    /* =========================================================
       PROJECT 초기값
    ========================================================= */

    $projectTitle.css({
        opacity: 0,
        transform: 'translate3d(-500px, 0, 0)'
    });

    $projectList.css({
        opacity: 0,
        transform: 'translate3d(500px, 0, 0)'
    });


    /* =========================================================
       COMPANY 초기값
    ========================================================= */

    $companyVisualContent.css({
        opacity: 0,
        transform: 'translate3d(0, 350px, 0)'
    });


    /* =========================================================
       CONTACT 초기값
    ========================================================= */

    $contactTitle.css({
        transform: 'scale(0.35)',
        transformOrigin: 'left center'
    });


    /* =========================================================
       LENIS SCROLL
    ========================================================= */

    lenis.on('scroll', ({ scroll }) => {

        const vh = window.innerHeight;


        /* =====================================================
           01. VISUAL
        ===================================================== */

        const visualTop =
            $visual.offset().top;

        const visualHeight =
            $visual.outerHeight();

        let visualProgress =
            (scroll - visualTop) / visualHeight;

        visualProgress = Math.max(
            0,
            Math.min(1, visualProgress)
        );


        /* =====================================================
           VISUAL IMAGE
        ===================================================== */

        let imageProgress =
            visualProgress / 0.75;

        imageProgress = Math.max(
            0,
            Math.min(1, imageProgress)
        );

        const imageEase =
            1 - Math.pow(1 - imageProgress, 3);


        /* =====================================================
           VISUAL TEXT 01
        ===================================================== */

        let visual01Progress =
            visualProgress / 0.25;

        visual01Progress = Math.max(
            0,
            Math.min(1, visual01Progress)
        );

        const visual01Ease =
            1 - Math.pow(1 - visual01Progress, 3);

        const visual01Y =
            120 - (120 * visual01Ease);

        const visual01Scale =
            1.25 - (0.25 * visual01Ease);

        $visual.find('.visualText01').css({
            opacity: visual01Ease,
            transform:
                `translate3d(0, ${visual01Y}px, 0) scale(${visual01Scale})`
        });


        /* =====================================================
           VISUAL TEXT 02
        ===================================================== */

        let visual02Progress =
            (visualProgress - 0.25) / 0.25;

        visual02Progress = Math.max(
            0,
            Math.min(1, visual02Progress)
        );

        const visual02Ease =
            1 - Math.pow(1 - visual02Progress, 3);

        const visual02Y =
            120 - (120 * visual02Ease);

        const visual02Scale =
            1.15 - (0.15 * visual02Ease);

        $visual.find('.visualText02').css({
            opacity: visual02Ease,
            transform:
                `translate3d(0, ${visual02Y}px, 0) scale(${visual02Scale})`
        });


        /* =====================================================
           VISUAL TEXT 03
        ===================================================== */

        let visual03Progress =
            (visualProgress - 0.50) / 0.25;

        visual03Progress = Math.max(
            0,
            Math.min(1, visual03Progress)
        );

        const visual03Ease =
            1 - Math.pow(1 - visual03Progress, 3);

        const visual03Y =
            120 - (120 * visual03Ease);

        const visual03Scale =
            1.15 - (0.15 * visual03Ease);

        $visual.find('.visualText03').css({
            opacity: visual03Ease,
            transform:
                `translate3d(0, ${visual03Y}px, 0) scale(${visual03Scale})`
        });


        /* =====================================================
           VISUAL VIDEO
        ===================================================== */

        const $video =
            $visual.find('.visualVideoBox video');

        if ($video.length) {

            const videoStyle =
                getComputedStyle($video[0]);

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
                $video.parent().width() * 0.8;

            const startHeight =
                $video.parent().height() * 0.8;

            const videoWidth =
                startWidth +
                (
                    (endWidth / 100) *
                    window.innerWidth -
                    startWidth
                ) *
                imageEase;

            const videoHeight =
                startHeight +
                (
                    (endHeight / 100) *
                    window.innerWidth -
                    startHeight
                ) *
                imageEase;

            $video.css({
                width: `${videoWidth}px`,
                height: `${videoHeight}px`
            });
        }


        /* =====================================================
           02. ABOUT
           
           ★ 핵심
           
           ABOUT 영역에 도착하기 전에
           이미 양옆에서 움직이기 시작한다.
           
           h2와 완전히 동일한 방식
        ===================================================== */

        const aboutTop =
            $about.offset().top;


        /*
         * ABOUT 시작 전에 미리 움직이기
         *
         * 숫자가 작을수록
         * ABOUT에 가까워진 뒤 움직임
         *
         * 숫자가 클수록
         * 멀리서부터 움직임
         *
         * 현재 0.7vh
         */

        const aboutMoveStart =
            aboutTop - (vh * 0.7);


        /*
         * ABOUT 위치에 도착하면
         * 정확히 0px
         */

        const aboutMoveEnd =
            aboutTop;


        /*
         * 진행률
         */

        let aboutProgress =
            (scroll - aboutMoveStart) /
            (aboutMoveEnd - aboutMoveStart);

        aboutProgress = Math.max(
            0,
            Math.min(1, aboutProgress)
        );


        /*
         * easing
         */

        const aboutEase =
            1 - Math.pow(
                1 - aboutProgress,
                3
            );


        /* =====================================================
           WHO WE ARE
           
           -500 → 0
        ===================================================== */

        const labelX =
            -500 +
            (500 * aboutEase);

        $aboutTitleLabel.css({
            transform:
                `translate3d(${labelX}px, 0, 0)`
        });


        /* =====================================================
           H2
           
           첫 번째
           -500 → 0
           
           두 번째
           500 → 0
        ===================================================== */

        const titleLeftX =
            -500 +
            (500 * aboutEase);

        const titleRightX =
            500 -
            (500 * aboutEase);


        $aboutTitleStrong.eq(0).css({
            transform:
                `translate3d(${titleLeftX}px, 0, 0)`
        });


        $aboutTitleStrong.eq(1).css({
            transform:
                `translate3d(${titleRightX}px, 0, 0)`
        });


        /* =====================================================
           DETAIL VIEW
           
           500 → 0
        ===================================================== */

        const viewX =
            500 -
            (500 * aboutEase);

        $aboutView.css({
            transform:
                `translate3d(${viewX}px, 0, 0)`
        });


        /* =====================================================
           TEXT 01
           
           -500 → 0
        ===================================================== */

        const text01X =
            -500 +
            (500 * aboutEase);

        $aboutText01.css({
            transform:
                `translate3d(${text01X}px, 0, 0)`
        });


        /* =====================================================
           TEXT 02
           
           500 → 0
        ===================================================== */

        const text02X =
            500 -
            (500 * aboutEase);

        $aboutText02.css({
            transform:
                `translate3d(${text02X}px, 0, 0)`
        });


        /* =====================================================
           ABOUT 이후에는 모두 0
        ===================================================== */

        if (scroll >= aboutMoveEnd) {

            $aboutTitleLabel.css({
                transform:
                    'translate3d(0, 0, 0)'
            });

            $aboutTitleStrong.eq(0).css({
                transform:
                    'translate3d(0, 0, 0)'
            });

            $aboutTitleStrong.eq(1).css({
                transform:
                    'translate3d(0, 0, 0)'
            });

            $aboutView.css({
                transform:
                    'translate3d(0, 0, 0)'
            });

            $aboutText01.css({
                transform:
                    'translate3d(0, 0, 0)'
            });

            $aboutText02.css({
                transform:
                    'translate3d(0, 0, 0)'
            });
        }


        /* =====================================================
           03. PROJECT
        ===================================================== */

        const projectTop =
            $project.offset().top;

        const projectStart =
            projectTop - vh * 0.7;

        const projectEnd =
            projectTop + vh * 0.3;


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
                (scroll - projectStart) /
                (projectEnd - projectStart);

            progress = Math.max(
                0,
                Math.min(1, progress)
            );

            const ease =
                1 - Math.pow(
                    1 - progress,
                    3
                );

            const titleX =
                -500 +
                (500 * ease);

            const listX =
                500 -
                (500 * ease);

            $projectTitle.css({
                opacity: ease,
                transform:
                    `translate3d(${titleX}px, 0, 0)`
            });

            $projectList.css({
                opacity: ease,
                transform:
                    `translate3d(${listX}px, 0, 0)`
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
            companyTop - vh * 0.8;

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
                (scroll - companyStart) /
                (companyEnd - companyStart);

            progress = Math.max(
                0,
                Math.min(1, progress)
            );

            const ease =
                1 - Math.pow(
                    1 - progress,
                    3
                );

            const contentY =
                250 -
                (250 * ease);

            $companyVisualContent.css({
                opacity: ease,
                transform:
                    `translate3d(0, ${contentY}px, 0)`
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
            contactTop - vh;

        const contactEnd =
            contactTop;


        let contactProgress =
            (scroll - contactStart) /
            (contactEnd - contactStart);

        contactProgress = Math.max(
            0,
            Math.min(1, contactProgress)
        );


        const contactScale =
            0.35 +
            (1 - 0.35) *
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
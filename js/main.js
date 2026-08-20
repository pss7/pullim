$(function () {


    /* =========================================================
       새로고침 시 상단
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

    const $companyNumber =
        $company.find('.companyInfoNumber strong');



    /* =========================================================
       ABOUT
    ========================================================= */

    const $aboutLabel =
        $about.find('.aboutTitleBox > span');

    const $aboutTitle =
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

    const $companyContent =
        $company.find('.companyVisualContentBox');


    /*
        회사 숫자 카운팅 실행 여부

        false
        → 아직 실행 안 됨

        true
        → 한 번 실행됨
    */

    let companyNumberStarted = false;



    /* =========================================================
       COMPANY NUMBER COUNTING
    ========================================================= */

    function startCompanyNumberCount() {

        if (companyNumberStarted) {
            return;
        }

        companyNumberStarted = true;


        $companyNumber.each(function () {

            const $number = $(this);

            const target =
                Number($number.attr('data-target'));

            const duration = 1800;

            const startTime =
                performance.now();


            function count(currentTime) {

                const elapsed =
                    currentTime - startTime;

                let progress =
                    elapsed / duration;

                progress =
                    Math.min(progress, 1);


                /*
                    easeOutCubic

                    처음에는 빠르게 올라가고
                    마지막에는 천천히 멈춤
                */

                const ease =
                    1 - Math.pow(1 - progress, 3);


                const currentNumber =
                    Math.floor(target * ease);


                $number.text(
                    currentNumber.toLocaleString()
                );


                if (progress < 1) {

                    requestAnimationFrame(count);

                } else {

                    /*
                        마지막 숫자는
                        정확한 target 값으로 고정
                    */

                    $number.text(
                        target.toLocaleString()
                    );

                }

            }


            requestAnimationFrame(count);

        });

    }



    /* =========================================================
       CONTACT
    ========================================================= */

    const $contactTitle =
        $contact.find('.contactTitleBox h2');



    /* =========================================================
       ABOUT 초기값
    ========================================================= */

    $aboutLabel.css({
        opacity: 0,
        transform: 'translate3d(0, 300px, 0)'
    });


    $aboutView.css({
        opacity: 0,
        transform: 'translate3d(0, 300px, 0)'
    });


    $aboutText01.css({
        opacity: 0,
        transform: 'translate3d(0, 350px, 0)'
    });


    $aboutText02.css({
        opacity: 0,
        transform: 'translate3d(0, 350px, 0)'
    });



    /* =========================================================
       ABOUT H2 초기값
    ========================================================= */

    $aboutTitle.eq(0).css({
        opacity: 0,
        transform: 'translate3d(-500px, 0, 0) scale(0.35)'
    });


    $aboutTitle.eq(1).css({
        opacity: 0,
        transform: 'translate3d(500px, 0, 0) scale(0.35)'
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

    $companyContent.css({
        opacity: 0,
        transform: 'translate3d(0, 350px, 0)'
    });



    /* =========================================================
       COMPANY NUMBER 초기값
    ========================================================= */

    $companyNumber.each(function () {

        $(this).text('0');

    });



    /* =========================================================
       CONTACT 초기값
    ========================================================= */

    $contactTitle.css({
        transform: 'scale(0.35)',
        transformOrigin: 'left center'
    });



    /* =========================================================
       SCROLL
    ========================================================= */

    lenis.on('scroll', ({ scroll }) => {


        const vh =
            window.innerHeight;



        /* =====================================================
           VISUAL
        ===================================================== */

        const visualTop =
            $visual.offset().top;


        const visualHeight =
            $visual.outerHeight();


        let visualProgress =
            (scroll - visualTop) / visualHeight;


        visualProgress =
            Math.max(
                0,
                Math.min(1, visualProgress)
            );



        /* =====================================================
           VISUAL IMAGE
        ===================================================== */

        let imageProgress =
            visualProgress / 0.75;


        imageProgress =
            Math.max(
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


        visual01Progress =
            Math.max(
                0,
                Math.min(1, visual01Progress)
            );


        const visual01Ease =
            1 - Math.pow(1 - visual01Progress, 3);


        $visual.find('.visualText01').css({

            opacity: visual01Ease,

            transform: `
                translate3d(
                    0,
                    ${120 - (120 * visual01Ease)}px,
                    0
                )
                scale(${1.25 - (0.25 * visual01Ease)})
            `

        });



        /* =====================================================
           VISUAL TEXT 02
        ===================================================== */

        let visual02Progress =
            (visualProgress - 0.25) / 0.25;


        visual02Progress =
            Math.max(
                0,
                Math.min(1, visual02Progress)
            );


        const visual02Ease =
            1 - Math.pow(1 - visual02Progress, 3);


        $visual.find('.visualText02').css({

            opacity: visual02Ease,

            transform: `
                translate3d(
                    0,
                    ${120 - (120 * visual02Ease)}px,
                    0
                )
                scale(${1.15 - (0.15 * visual02Ease)})
            `

        });



        /* =====================================================
           VISUAL TEXT 03
        ===================================================== */

        let visual03Progress =
            (visualProgress - 0.50) / 0.25;


        visual03Progress =
            Math.max(
                0,
                Math.min(1, visual03Progress)
            );


        const visual03Ease =
            1 - Math.pow(1 - visual03Progress, 3);


        $visual.find('.visualText03').css({

            opacity: visual03Ease,

            transform: `
                translate3d(
                    0,
                    ${120 - (120 * visual03Ease)}px,
                    0
                )
                scale(${1.15 - (0.15 * visual03Ease)})
            `

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
                    (endWidth / 100) * window.innerWidth -
                    startWidth
                ) * imageEase;


            const videoHeight =
                startHeight +
                (
                    (endHeight / 100) * window.innerWidth -
                    startHeight
                ) * imageEase;


            $video.css({

                width: `${videoWidth}px`,

                height: `${videoHeight}px`

            });

        }



        /* =====================================================
           ABOUT
        ===================================================== */

        const aboutTop =
            $about.offset().top;


        const aboutStart =
            aboutTop - (vh * 0.7);


        const aboutEnd =
            aboutTop;


        let aboutProgress =
            (scroll - aboutStart) /
            (aboutEnd - aboutStart);


        aboutProgress =
            Math.max(
                0,
                Math.min(1, aboutProgress)
            );


        const aboutEase =
            1 - Math.pow(1 - aboutProgress, 3);



        /* =====================================================
           ABOUT H2
        ===================================================== */

        const titleLeftX =
            -500 + (500 * aboutEase);


        const titleRightX =
            500 - (500 * aboutEase);


        const titleScale =
            0.35 + (0.65 * aboutEase);


        $aboutTitle.eq(0).css({

            opacity: aboutEase,

            transform: `
                translate3d(
                    ${titleLeftX}px,
                    0,
                    0
                )
                scale(${titleScale})
            `

        });


        $aboutTitle.eq(1).css({

            opacity: aboutEase,

            transform: `
                translate3d(
                    ${titleRightX}px,
                    0,
                    0
                )
                scale(${titleScale})
            `

        });



        /* =====================================================
           ABOUT WHO WE ARE
        ===================================================== */

        let labelProgress =
            aboutProgress / 0.35;


        labelProgress =
            Math.max(
                0,
                Math.min(1, labelProgress)
            );


        const labelEase =
            1 - Math.pow(1 - labelProgress, 3);


        const labelY =
            300 - (300 * labelEase);


        $aboutLabel.css({

            opacity: labelEase,

            transform: `
                translate3d(
                    0,
                    ${labelY}px,
                    0
                )
            `

        });



        /* =====================================================
           ABOUT DETAIL VIEW
        ===================================================== */

        let viewProgress =
            (aboutProgress - 0.15) / 0.35;


        viewProgress =
            Math.max(
                0,
                Math.min(1, viewProgress)
            );


        const viewEase =
            1 - Math.pow(1 - viewProgress, 3);


        const viewY =
            300 - (300 * viewEase);


        $aboutView.css({

            opacity: viewEase,

            transform: `
                translate3d(
                    0,
                    ${viewY}px,
                    0
                )
            `

        });



        /* =====================================================
           ABOUT TEXT 01
        ===================================================== */

        let text01Progress =
            (aboutProgress - 0.30) / 0.40;


        text01Progress =
            Math.max(
                0,
                Math.min(1, text01Progress)
            );


        const text01Ease =
            1 - Math.pow(1 - text01Progress, 3);


        const text01Y =
            350 - (350 * text01Ease);


        $aboutText01.css({

            opacity: text01Ease,

            transform: `
                translate3d(
                    0,
                    ${text01Y}px,
                    0
                )
            `

        });



        /* =====================================================
           ABOUT TEXT 02
        ===================================================== */

        let text02Progress =
            (aboutProgress - 0.50) / 0.40;


        text02Progress =
            Math.max(
                0,
                Math.min(1, text02Progress)
            );


        const text02Ease =
            1 - Math.pow(1 - text02Progress, 3);


        const text02Y =
            350 - (350 * text02Ease);


        $aboutText02.css({

            opacity: text02Ease,

            transform: `
                translate3d(
                    0,
                    ${text02Y}px,
                    0
                )
            `

        });



        /* =====================================================
           ABOUT 도착 후 최종 상태
        ===================================================== */

        if (scroll >= aboutEnd) {

            $aboutLabel.css({

                opacity: 1,

                transform:
                    'translate3d(0, 0, 0)'

            });


            $aboutTitle.eq(0).css({

                opacity: 1,

                transform:
                    'translate3d(0, 0, 0) scale(1)'

            });


            $aboutTitle.eq(1).css({

                opacity: 1,

                transform:
                    'translate3d(0, 0, 0) scale(1)'

            });


            $aboutView.css({

                opacity: 1,

                transform:
                    'translate3d(0, 0, 0)'

            });


            $aboutText01.css({

                opacity: 1,

                transform:
                    'translate3d(0, 0, 0)'

            });


            $aboutText02.css({

                opacity: 1,

                transform:
                    'translate3d(0, 0, 0)'

            });

        }



        /* =====================================================
           PROJECT
        ===================================================== */

        const projectTop =
            $project.offset().top;


        const projectStart =
            projectTop - (vh * 0.7);


        const projectEnd =
            projectTop + (vh * 0.3);


        let projectProgress =
            (scroll - projectStart) /
            (projectEnd - projectStart);


        projectProgress =
            Math.max(
                0,
                Math.min(1, projectProgress)
            );


        const projectEase =
            1 - Math.pow(1 - projectProgress, 3);


        $projectTitle.css({

            opacity: projectEase,

            transform: `
                translate3d(
                    ${-500 + (500 * projectEase)}px,
                    0,
                    0
                )
            `

        });


        $projectList.css({

            opacity: projectEase,

            transform: `
                translate3d(
                    ${500 - (500 * projectEase)}px,
                    0,
                    0
                )
            `

        });



        /* =====================================================
           COMPANY
        ===================================================== */

        const companyTop =
            $company.offset().top;


        const companyStart =
            companyTop - (vh * 0.8);


        const companyEnd =
            companyTop;


        let companyProgress =
            (scroll - companyStart) /
            (companyEnd - companyStart);


        companyProgress =
            Math.max(
                0,
                Math.min(1, companyProgress)
            );


        const companyEase =
            1 - Math.pow(1 - companyProgress, 3);


        const companyY =
            250 - (250 * companyEase);


        $companyContent.css({

            opacity: companyEase,

            transform: `
                translate3d(
                    0,
                    ${companyY}px,
                    0
                )
            `

        });



        /* =====================================================
           COMPANY NUMBER COUNTING
        ===================================================== */

        /*
            회사 영역이 화면에 들어오기 시작하면
            숫자 카운팅 시작

            0.15 정도부터 시작해서
            회사 콘텐츠 등장과 자연스럽게 겹치도록 설정
        */

        if (
            companyProgress >= 0.15 &&
            !companyNumberStarted
        ) {

            startCompanyNumberCount();

        }



        /* =====================================================
           COMPANY 도착 후 최종 상태
        ===================================================== */

        if (scroll >= companyEnd) {

            $companyContent.css({

                opacity: 1,

                transform:
                    'translate3d(0, 0, 0)'

            });

        }



        /* =====================================================
           CONTACT
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


        contactProgress =
            Math.max(
                0,
                Math.min(1, contactProgress)
            );


        const contactScale =
            0.35 +
            (0.65 * contactProgress);


        $contactTitle.css({

            transform:
                `scale(${contactScale})`

        });

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
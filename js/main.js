$(function () {

    const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        autoRaf: true
    });

    lenis.on('scroll', ({ scroll }) => {

        const project = document.querySelector('#projectWrap');

        if (!project) return;

        const rect = project.getBoundingClientRect();
        const vh = window.innerHeight;


        /*
         * Project가 화면 아래에서 들어오기 시작
         *
         * rect.top = vh
         * → progress 0
         *
         * rect.top = 0
         * → progress 1
         */

        let progress = (vh - rect.top) / vh;

        progress = Math.max(0, Math.min(1, progress));


        /*
         * 제목
         * -500px → 0
         */

        const titleX = -500 + (500 * progress);


        /*
         * 프로젝트
         * 500px → 0
         */

        const listX = 500 - (500 * progress);


        const title = project.querySelector('.projectTitleBox');
        const list = project.querySelector('.projectList');


        title.style.transform =
            `translate3d(${titleX}px, 0, 0)`;

        list.style.transform =
            `translate3d(${listX}px, 0, 0)`;


        /*
         * opacity
         */

        title.style.opacity = progress;
        list.style.opacity = progress;

    });

});
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

});
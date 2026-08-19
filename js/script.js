$(function () {

  // 공통 - 드롭다운
  $('.toggleBtn').click(function (e) {
    e.stopPropagation();

    $(this).parent().toggleClass('active');

    if ($(this).parent().hasClass('active')) {
      $(this).attr('aria-expanded', 'true');
    } else {
      $(this).attr('aria-expanded', 'false');
    }
  });

  // 모바일 메뉴 닫기
  $('#mobileMenuWrap .mobileMenuCloseBtn').click(function () {
    $('#mobileMenuWrap').removeClass('active');
    $('#mobileMenuWrap .mobileMenuBtn')
      .attr('aria-expanded', 'false');
  });

    //팝업
  $('#popupContentBox .slick').slick({
    autoplay: true,
    arrows: true,
    dots: false,
    accessibility: false,
    draggable: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    zIndex: 1000,
    pauseOnHover: false,
    autoplaySpeed: 5000,
    speed: 1500,
    prevArrow: $('#popupContentBox .popupPrevBtn'),
    nextArrow: $('#popupContentBox .popupNextBtn'),
  });











  //헤더 스크롤
  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $('#headerWrap').addClass('scroll');
    } else {
      $('#headerWrap').removeClass('scroll');
    }
  })

});


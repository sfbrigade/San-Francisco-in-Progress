$(document).ready(function(){
  resizeLanding();

    (function(){
      $('.carousel').carousel({
        interval: 3000
      });
  });

});


function resizeLanding() {
  $(window).resize(function(){
    $(".background-image").height($(window).height())
  }).resize();
}

//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
        $("span#logo").removeClass("large");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $("span#logo").addClass("large");
    }
});



// jQuery for page scrolling feature
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

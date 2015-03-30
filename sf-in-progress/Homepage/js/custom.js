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
    $("#intro").height($(window).height())
  }).resize();
}



// jQuery for page scrolling feature - requires jQuery Easing plugin
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

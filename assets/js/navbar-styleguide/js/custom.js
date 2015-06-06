

$(document).ready(function(){
  resizeLanding();

        //init scrollreveal



         window.sr = new scrollReveal();s

        // Init Skrollr
        var s = skrollr.init({
            forceHeight:false
        });

        s.refresh($('.imgSlide'));


});





//Resize slideshow images on page ReLoad / reload
function resizeLanding() {
  $(window).resize(function(){
    $("section").height($(window).height())
  }).resize();
}

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($("#home-navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});



//jQuery for page scrolling feature
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

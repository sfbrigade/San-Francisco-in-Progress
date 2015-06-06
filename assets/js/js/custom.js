
$(document).ready(function(){
  resizeLanding();
  adjustWindow();

  enquire.register("screen and (min-width : 768px)", initAdjustWindow(), false);
  // window.sr = new scrollReveal();


});


function adjustWindow(){

    //Get window size
    winH = $(window).height();
    winW = $(window).width();

    //keep minimun height 550
    if(winH <= 550){
        winH = 550;
    }

    //init skrollar tables 768 and up
    if(winW>= 768){

        var s = skrollr.init({
            forceHeight:false
        });

        // Resize our slides
        $('.imgSlide').height(winH);

        s.refresh($('.imgSlide'));

    }else {

        // Init Skrollr
        var s = skrollr.init();
        s.destroy();
    }

    // Check for touch
    if(Modernizr.touch) {

        // Init Skrollr
        var s = skrollr.init();
        s.destroy();
    }

}

function initAdjustWindow() {
    return {
        match : function() {
            adjustWindow();
        },
        unmatch : function() {
            adjustWindow();
        }
    };
}





//Resize landing image  on page ReLoad / reload
function resizeLanding() {
  $(window).resize(function(){
    $("#slide-1").height($(window).height())
  }).resize();
}

//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($("#header-navbar").offset().top > 50) {
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

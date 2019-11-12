$(document).ready(function () {
    let navWidth = $(".nav .left").width() * 2,
        menuOpened = false,
        philosophy = $("#philosophy"),
        secSlider = $("#slider-two"),
        chief = $("#chief"),
        contacts = $("#contacts-add"),
        main = $("main"),
        mainScroll = null,
        vertical = false;

    function mobCheck() {
        if($(window).width() > 640) {
            vertical = false;
        } else {
            vertical = true;
        }
    }

    function reinitPS() {
        if(vertical) {
            if(mainScroll) {
                mainScroll.destroy();
                mainScroll = null;
            }
        } else if(!mainScroll) {
            mainScroll = new PerfectScrollbar('main', {
                suppressScrollY: true,
                useBothWheelAxes: true
            });
        }
    }

    function toggleMenu() {
        $("body").toggleClass("menu-opened");

        if (menuOpened) {
            $(main).css({ "transform": "scale(1)", "-webkit-transform": "scale(1)"});
        } else {
            let mainWidthFrom = $(main).width(),
                mainWidthTo = mainWidthFrom - navWidth,
                per = mainWidthTo / mainWidthFrom;

            $(main).css({ "transform": "scale(" + per + ")", "-webkit-transform": "scale(" + per + ")"});
        }

        menuOpened = !menuOpened;
    }

    mobCheck();
    reinitPS();

    $(main).css("transform", "scale(1)");

    $("#first-screen .slider").slick({
        arrows: false,
        dots: true,
        appendDots: "#first-screen",
        autoplay: true,
        autoplaySpeed: 3600,
        pauseOnFocus: false,
        pauseOnHover: false,
        variableWidth: true,
        draggable: false,
        swipe: false
    });

    $("#slider-two .slider").slick({
        arrows: false,
        dots: true,
        appendDots: "#slider-two",
        autoplay: true,
        autoplaySpeed: 3600,
        pauseOnFocus: false,
        pauseOnHover: false,
        variableWidth: true,
        draggable: false,
        swipe: false
    });

    $(".slick-dots li").append('<svg version="1.1" id="circle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 17 17"><g stroke-width="1"><circle class="circle" cx="8.5" cy="8.5" r="8" fill="none" stroke="#ffffff" /></g></svg>');

    //Resize
    $(window).on("resize", function () {
        navWidth = $(".nav .left").width()*2;
        mobCheck();
        reinitPS();
    });

    const cetPS = new PerfectScrollbar('.categories', {
        suppressScrollY: true,
        useBothWheelAxes: true
    });

    //Open menu animation
    $(".nav li a").on('click', toggleMenu);
    $(".open-menu").on("click", toggleMenu);
    $(".mob-nav a").on("click", toggleMenu);

    //Scroll
    let tChanging = $(".theme-changing");

    $(main).on('scroll', function () {
        if(vertical) {
            $(tChanging).each(function () {
                let top = $(this).offset().top+$(this).height();

                if (top > $(philosophy).offset().top) {
                    $(this).addClass('black');
                } else {
                    $(this).removeClass('black');
                }

                if (top > $(secSlider).offset().top) {
                    $(this).removeClass('black');
                }

                if (top > $(chief).offset().top) {
                    $(this).addClass("black");
                }

                if (top > $(contacts).offset().top) {
                    $(this).removeClass("black");
                }
            });
        } else {
            $(tChanging).each(function () {
                let left = $(this).offset().left+$(this).width();

                if (left > $(philosophy).offset().left) {
                    $(this).addClass('black');
                } else {
                    $(this).removeClass('black');
                }

                if (left > $(secSlider).offset().left) {
                    $(this).removeClass('black');
                }

                if (left > $(chief).offset().left) {
                    $(this).addClass("black");
                }

                if (left > $(contacts).offset().left) {
                    $(this).removeClass("black");
                }
            });
        }
    });

    //Navigation hover
    let prevScroll = 0,
        links = $(".nav li a");

    $(links).on("mouseover", function () {
        let href = $(this).attr("href");
        prevScroll = $(main).scrollLeft();

        $(main).scrollLeft(document.querySelector(href).offsetLeft);
    });

    $(links).on("mouseout", function () {
        $(main).scrollLeft(prevScroll);
    });

    $('.swipe-to-next').on("click", function () {
        let nextSec = $(this).parents('section').next();
        if(vertical) {
            $(main).animate({
                scrollTop: $(nextSec).offset().top
            }, 500);
        } else {
            $(main).animate({
                scrollLeft: $(nextSec).offset().left
            }, 500);
        }
    });

    $(links).on("click", function () {
        prevScroll = $(main).scrollLeft();
    });
});

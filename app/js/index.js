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

    function openPopup(id) {
        $('#'+id).addClass('shown');
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

    $(".map iframe").attr("src", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d862.007839245216!2d2.2975583802191553!3d48.87397606029203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fea4ba8872f%3A0xe9b7b4b4f4024772!2zNiBSdWUgQXJzw6huZSBIb3Vzc2F5ZSwgNzUwMDggUGFyaXMsINCk0YDQsNC90YbQuNGP!5e0!3m2!1sru!2sru!4v1573306475072!5m2!1sru!2sru");

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

    $('button.reservation').on('click', function () {
       openPopup('reservation');
    });

    $('.popup .close-popup').on('click', function () {
        $(this).parent('.popup').removeClass('shown');
    });

    $('.popup form input, .popup form textarea').on('focus', function () {
        $(this).parent().addClass('triggered');
    });

    $('.popup form input, .popup form textarea').on('blur', function () {
        if($(this).val().length == 0) {
            $(this).parent().removeClass('triggered');
        }
    });
    
    $("button.cert").on('click', function() {
       openPopup('cert');
    });

    $("#cert input.cert-field").on('input', function () {
        let t = $(this).data('cert'),
            f = $('#cert-'+t);

        if($(this).val().length > 0) {
            $(f).html((t == "amount") ? $(this).val()+"€" : $(this).val());
        } else {
            $(f).html("&nbsp;");
        }
    });

    //Validation
    let certForm = $('#cert form').validate();

    $(".next-form").on("click", function(e) {
        let res = true;
        $('#cert .first-form input').each(function () {
            if(res == true) {
                res = certForm.element($(this));
            } else {
                certForm.element($(this));
            }
        });
        if(res) {
            $('#cert').addClass('second-slide');
        }
        e.preventDefault();
    });

    $("#cert .back").on('click', function (e) {
        $('#cert').removeClass('second-slide');
        e.preventDefault();
    });

    $("#menu .categories .category").on('click', function() {
        let cat = $(this).data('menu');
        $("#menu .categories .category").removeClass('active');
        $("#menu .menu-item").removeClass('shown');
        $("#menu #menu-"+cat).addClass('shown');
        $(this).addClass('active');
    });
});

$(document).ready(function () {
    let navWidth = $(".nav .left").width() * 2,
        menuOpened = false,
        contacts = $("#contacts-add"),
        priv = $("#privacy"),
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

    //Resize
    $(window).on("resize", function () {
        navWidth = $(".nav .left").width()*2;
        mobCheck();
        reinitPS();
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

                if (top > $(priv).offset().top) {
                    $(this).addClass('black');
                } else {
                    $(this).removeClass('black');
                }

                if (top > $(contacts).offset().top) {
                    $(this).removeClass("black");
                }
            });
        } else {
            $(tChanging).each(function () {
                let left = $(this).offset().left+$(this).width();

                if (left > $(priv).offset().left) {
                    $(this).addClass('black');
                } else {
                    $(this).removeClass('black');
                }

                if (left > $(contacts).offset().left) {
                    $(this).removeClass("black");
                }
            });
        }
    });

    //Navigation hover

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
    $("#reservation form").validate();
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

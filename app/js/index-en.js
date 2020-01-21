if(localStorage.getItem('cookie-agree') != "1") {
    document.querySelector('.cookie-policy').classList.add('shown');
}

function openMesBox(title, text) {
    let mesBox = document.querySelector('.message-box'),
        mesBoxTitle = document.querySelector('.message-box .head .text'),
        mesBoxText = document.querySelector('.message-box .body');
    mesBoxText.innerHTML = text;
    mesBoxTitle.innerHTML = title;
    mesBox.classList.add("shown");
}

function closeMesBox() {
    let mesBox = document.querySelector('.message-box');
    mesBox.classList.remove('shown');
}

function resetCertForm() {
    let cert = document.querySelector('#cert'),
        certValues = cert.querySelectorAll('.certificate .text'),
        certInputs = cert.querySelectorAll("input");

    cert.classList.remove('second-slide');
    cert.classList.remove('shown');
    cert.classList.remove('third-slide');

    for(let c of certInputs) {
        c.value = "";
    }

    for(let c of certValues) {
        c.innerHTML = "&nbsp;";
    }
}

let ppInit = () => {
    document.querySelector(".third-form .fields").innerHTML = "";
    paypal.Buttons({
        createOrder: function(data, actions) {
            let amount = document.querySelector('input[data-cert=amount]').value;
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toString(),
                        currency_code: 'EUR'
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            // This function captures the funds from the transaction.
            openMesBox("The payment has been processed","The certificate will be sent out soon");
            resetCertForm();
            return actions.order.capture().then(function(details) {
                let fd = new FormData();
                fd.append('orderID', data.orderID);
                fd.append('action', 'check-order');
                fd.append('receiverName', document.querySelector('#cert [data-cert=to]').value);
                fd.append('senderName', document.querySelector('#cert [data-cert=from]').value);
                fd.append('sender', document.querySelector('#cert [name=your-name]').value);
                fd.append('senderEmail', document.querySelector('#cert [name=your-email]').value);
                fd.append('receiverEmail', document.querySelector('#cert [name=email-to]').value);
                return fetch(API, {
                    method: 'post',
                    body: fd
                });
            });
        }
    }).render('#cert .third-form .fields');
};

$(document).ready(function () {
    let navWidth = $(".nav .left").width() * 2,
        menuOpened = false,
        philosophy = $("#philosophy"),
        secSlider = $("#slider-two"),
        chief = $("#chief"),
        contacts = $("#contacts-add"),
        main = $("main"),
        mainScroll = null,
        vertical = false,
        API = "/wp-admin/admin-ajax.php";

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

    function showOnScroll(els, spot, c) {
        spot = spot/100;
        let showOnLeft = $(window).width()*spot,
            isBinded = false;

        c = c || 'shown';

        $(els).sort(function (a, b) {
            return $(a).offset().left-$(b).offset().left;
        });

        let checkScroll = () => {
            while(els.length != 0 && $($(els)[0]).offset().left < showOnLeft) {
                $($(els)[0]).removeClass(c);
                els = $(els).slice(1);
            }
        }

        $(main).bind('scroll', checkScroll);
        isBinded = true;

        $(main).scroll();

        $(window).on('resize', function () {
            showOnLeft = $(window).width()*spot;
            if(vertical) {
                $(main).unbind('scroll', checkScroll);
                isBinded = false;
            } else if(!isBinded) {
                $(main).bind('scroll', checkScroll);
                isBinded = true;
            }
        })
    }

    $('.message-box .shadow, .message-box .close-mes-box').on('click', closeMesBox);

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

    $("#menu .items").each(function () {
        new PerfectScrollbar(this);
    });

    showOnScroll(".section-title-block, .sos-photo, #menu .cards, .press-item, .map-wrapper, #contacts .contacts, .wins, #contacts-add, .photo-desc", 80, 'hide');

    $('#menu .cards').each(function() {
        let cards = $(this).find('.card');
        $(cards).each(function(i) {
            $(this).css("transition-delay", (i*0.2)+"s");
        })
    });

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

    $('input[name=date]').datepicker({
        minDate: 0,
        maxDate: "+12M",
        dateFormat: 'dd/mm/yy',
    });

    $(links).on("mouseover", function () {
        let anchor = $(this).attr("href").indexOf('#');
        let href = $(this).attr("href").slice(anchor);
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
        let p = $(this).parent('.popup');
        $(p).removeClass('shown');
        $(p).find("input, textarea").each(function () {
            $(this).val("");
            $(this).blur();
        });
    });

    $('.popup form input, .popup form textarea').on('focus', function () {
        $(this).parent().addClass('triggered');
    });

    $('.popup form input:not([name=date]), .popup form textarea').on('blur', function () {
        if($(this).val().length == 0) {
            $(this).parent().removeClass('triggered');
        }
    });

    $('.popup form input[name=date]').on('change', function () {
        if($(this).val().length === 0) {
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
            $(f).html((t == "amount") ? $(this).val()+"€": $(this).val());
        } else {
            $(f).html("&nbsp;");
        }
    });

    //Validation
    let resForm = $("#reservation form").validate();

    $("#reservation form").on('submit', function (e) {
        e.preventDefault();
        if(resForm.form()) {
            let data = new FormData(this);
            data.append('action', 'reservation');
            $.ajax({
                url: API,
                method: "post",
                data: data,
                processData: false,
                contentType: false,
                success: (res)=>{
                    if(res == '1') {
                        $("#reservation").removeClass("shown");
                        openMesBox('Thanks', "Thanks a million");
                    } else {
                        openMesBox('Error', "Something went wrong. Please try again later.");
                    }
                }
            })
        }
    });

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
        let cert = $("#cert");
        if($(cert).hasClass('second-slide')) {
            $(cert).removeClass('second-slide');
        } else {
            ppInit();
            $(cert).removeClass('third-slide');
            $(cert).addClass('second-slide');
        }
        e.preventDefault();
    });

    $("#cert .to-pay").on('click', function (e) {
        let res = true;
        $('#cert .second-form input').each(function () {
            if(res == true) {
                res = certForm.element($(this));
            } else {
                certForm.element($(this));
            }
        });
        if(res) {
            $('#cert').removeClass('second-slide');
            $('#cert').addClass('third-slide');
        }
        e.preventDefault();
    });

    $("#menu .categories .category").on('click', function() {
        let cat = $(this).data('menu');
        $("#menu .categories .category").removeClass('active');
        $("#menu .menu-item").removeClass('shown');
        $("#menu #menu-"+cat).addClass('shown');
        $(this).addClass('active');
    });

    document.querySelector('.cookie-policy .agree').addEventListener('click', () => {
        localStorage.setItem('cookie-agree', "1");
        document.querySelector('.cookie-policy').classList.remove('shown');
    });
});

window.addEventListener('load', ()=>{
    document.querySelector("body").classList.remove("preloader-opened");
    setTimeout(()=>{
        document.querySelector(".map iframe").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.185593639847!2d2.2961792158602865!3d48.87373840757964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fea4bb88ac7:0x8dcaef984736d93e!2sEdern!5e0!3m2!1sfr!2sfr!4v1576352306700!5m2!1sfr!2sfr";
    }, 1000);
    //Lazy loading
    let llImages = document.querySelectorAll("img[data-lazy]");
    for(let image of llImages) {
        image.src = image.dataset.lazy;
    }
});

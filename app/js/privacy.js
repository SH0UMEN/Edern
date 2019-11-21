let ppInit;

$(document).ready(function () {
    let navWidth = $(".nav .left").width() * 2,
        menuOpened = false,
        contacts = $("#contacts-add"),
        priv = $("#privacy"),
        main = $("main"),
        mainScroll = null,
        vertical = false,
        mesBox = $('.message-box'),
        mesBoxTitle = $(mesBox).find('.head .text'),
        mesBoxText = $(mesBox).find('.body'),
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

    function openMesBox(title, text) {
        $(mesBoxText).html(text);
        $(mesBoxTitle).html(title);
        $(mesBox).addClass("shown");
    }

    function closeMesBox() {
        $(mesBox).removeClass('shown');
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

        if(!vertical) {
            $(main).bind('scroll', checkScroll);
            isBinded = true;
        }

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

    function resetCertForm() {
        $("#cert input").val("");
        $('#cert').removeClass('second-slide third-slide shown');
        $('#cert .certificate .text').html("&nbsp;");
    }

    ppInit = () => {
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
                openMesBox("Paiement traité","Le certificat sera envoyé bientôt");
                resetCertForm();
                return actions.order.capture().then(function(details) {
                    let fd = new FormData();
                    fd.append('orderID', data.orderID);
                    fd.append('action', 'check-order');
                    fd.append('receiverName', $('#cert [data-cert=to]').val());
                    fd.append('senderName', $('#cert [data-cert=from]').val());
                    fd.append('sender', $('#cert [name=your-name]').val());
                    fd.append('senderEmail', $('#cert [name=your-email]').val());
                    fd.append('receiverEmail', $('#cert [name=email-to]').val());
                    return fetch(API, {
                        method: 'post',
                        body: fd
                    });
                });
            }
        }).render('#cert .third-form .fields');
    }

    $('.message-box .shadow, .message-box .close-mes-box').on('click', closeMesBox);

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

    showOnScroll(".section-title-block, .sos-photo, #menu .cards, .press-item, .map-wrapper, #contacts .contacts, .wins, #contacts-add", 80, 'hide');

    $('#menu .cards').each(function() {
        let cards = $(this).find('.card');
        $(cards).each(function(i) {
            $(this).css("transition-delay", (i*0.2)+"s");
        })
    });

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
                        openMesBox('Error', "Something went wrong. Please try again late");
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
});

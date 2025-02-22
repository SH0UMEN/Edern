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
            openMesBox("Paiement traité","Le certificat sera envoyé bientôt");
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
        contacts = $("#contacts-add"),
        priv = $("#privacy"),
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

    $('input[name=date]').datepicker({
        minDate: 0,
        maxDate: "+12M",
        dateFormat: 'dd/mm/yy',
    });

    function openPopup(id) {
        $('#'+id).addClass('shown');
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

    let tChanging = $(".theme-changing");
    $(tChanging).addClass("black");

    $('.message-box .shadow, .message-box .close-mes-box').on('click', closeMesBox);

    //Lazy loading
    let llImages = document.querySelectorAll("img[data-lazy]");
    for(let image of llImages) {
        image.src = image.dataset.lazy;
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
                        openMesBox('Merci', "Un million de mercis");
                    } else {
                        openMesBox('Erreur', "Quelque chose s’est mal passé. Merci de réessayer ultérieurement.");
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

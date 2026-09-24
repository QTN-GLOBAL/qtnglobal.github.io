/* =========================================================
   QTN GLOBAL — HOME HERO SLIDER
   5 BANNER
   images/banner/1.jpg -> 5.jpg
========================================================= */

(function () {

    const bannerImages = [
        "images/banner/1.jpg",
        "images/banner/2.jpg",
        "images/banner/3.jpg",
        "images/banner/4.jpg",
        "images/banner/5.jpg"
    ];

    let currentSlide = 0;
    let slideTimer = null;

    function initHeroSlider() {

        const track = document.getElementById("slider-track");
        const dots = document.getElementById("slider-dots");

        if (!track) {
            return;
        }

        /* XÓA NỘI DUNG CŨ */
        track.innerHTML = "";

        if (dots) {
            dots.innerHTML = "";
        }

        /* =================================================
           TẠO 5 BANNER
        ================================================= */

        bannerImages.forEach(function (src, index) {

            const img = document.createElement("img");

            img.src = src;
            img.alt = "QTN GLOBAL Banner " + (index + 1);

            img.className =
                index === 0
                    ? "active"
                    : "";

            img.loading =
                index === 0
                    ? "eager"
                    : "lazy";

            track.appendChild(img);


            /* =============================================
               TẠO NÚT CHẤM
            ============================================= */

            if (dots) {

                const dot =
                    document.createElement("button");

                dot.type = "button";

                dot.setAttribute(
                    "aria-label",
                    "Xem banner " + (index + 1)
                );

                if (index === 0) {
                    dot.classList.add("active");
                }

                dot.addEventListener(
                    "click",
                    function () {

                        showSlide(index);

                        restartTimer();

                    }
                );

                dots.appendChild(dot);

            }

        });


        /* =================================================
           HIỂN THỊ SLIDE
        ================================================= */

        function showSlide(index) {

            const slides =
                track.querySelectorAll("img");

            const dotButtons =
                dots
                    ? dots.querySelectorAll("button")
                    : [];


            if (!slides.length) {
                return;
            }


            /* Xử lý vòng lặp */

            if (index < 0) {
                index = slides.length - 1;
            }

            if (index >= slides.length) {
                index = 0;
            }


            currentSlide = index;


            /* Ẩn tất cả */

            slides.forEach(function (slide) {

                slide.classList.remove("active");

            });


            /* Hiện slide hiện tại */

            slides[currentSlide]
                .classList.add("active");


            /* Cập nhật dots */

            dotButtons.forEach(function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === currentSlide
                );

            });

        }


        /* =================================================
           SLIDE TIẾP THEO
        ================================================= */

        function nextSlide() {

            showSlide(currentSlide + 1);

        }


        /* =================================================
           TỰ ĐỘNG CHUYỂN 5 GIÂY
        ================================================= */

        function startTimer() {

            clearInterval(slideTimer);

            slideTimer =
                setInterval(
                    nextSlide,
                    5000
                );

        }


        /* =================================================
           KHỞI ĐỘNG LẠI TIMER
        ================================================= */

        function restartTimer() {

            clearInterval(slideTimer);

            startTimer();

        }


        /* =================================================
           PAUSE KHI RÊ CHUỘT
        ================================================= */

        const slider =
            track.closest(".banner-slider");

        if (slider) {

            slider.addEventListener(
                "mouseenter",
                function () {

                    clearInterval(slideTimer);

                }
            );

            slider.addEventListener(
                "mouseleave",
                function () {

                    startTimer();

                }
            );

        }


        /* =================================================
           BẮT ĐẦU
        ================================================= */

        showSlide(0);

        startTimer();

    }


    /* =====================================================
       CHỜ DOM
    ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initHeroSlider
        );

    } else {

        initHeroSlider();

    }

})();
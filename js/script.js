document.querySelectorAll(".mySwiper").forEach((swiperContainer) => {

    new Swiper(swiperContainer, {

        slidesPerView: 5,
        spaceBetween: 20,
        loop: true,

        grabCursor: true,

    });

});
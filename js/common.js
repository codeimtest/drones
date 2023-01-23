$('.toggle-button').click(function(){
	$(this).toggleClass('active')
	$('header').toggleClass('active')
	$('.toggle-widget').toggleClass('active')
})
var swiper = new Swiper(".product-carousel", {
	slidesPerView: 1.2,
	watchOverflow: true,
  spaceBetween: 16,
	loop: false,
	breakpoints: {
		576: {
			slidesPerView: 2.2,
			spaceBetween: 16,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 42,
		},
	}
});
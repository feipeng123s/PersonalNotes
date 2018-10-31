var mySwiper = new Swiper('.swiper-container',{
	//direction:'vertical',
	loop:true,
	autoplay: true,
	
	pagination:{
		el:'.swiper-pagination',
	},
	
	navigation:{
		prevEl:'.swiper-button-prev',
		nextEl:'.swiper-button-next',
	},
});
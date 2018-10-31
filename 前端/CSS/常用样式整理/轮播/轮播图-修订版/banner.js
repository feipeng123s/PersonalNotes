let wrapperEl = document.querySelector(".banner-container .banner-wrapper");
let sliders = wrapperEl.children;
let sliderWidth = sliders[0].offsetWidth;
let pagination = document.querySelector(".banner-container .banner-pagination");

//初始化导航圆点
for(let i = 0; i < sliders.length; i++){
    let span = document.createElement("span");
    pagination.appendChild(span);
}

//初始化滑动内容
wrapperEl.style = `width: ${sliderWidth*sliders.length}px;`;
for(let index in sliders){
    sliders[index].style=`width: 1000px; position: relative; left: ${-sliderWidth*index}px; 
        transition: opacity 500ms ease-in-out; opacity: 0; z-index: 0;`;
}
sliders[0].style.opacity = 1;
sliders[0].style.zIndex = 1;
sliders[0].className = "banner-slide slide-current";
sliders[sliders.length - 1].className = "banner-slide slide-prev";
sliders[1].className = "banner-slide slide-next";
pagination.children[0].className = "active";
pagination.children[1].className = "next";
pagination.children[sliders.length - 1].className = "prev";

function slidePrev(){
    let prevSlider = wrapperEl.querySelector(".slide-prev");
    let currentSlider = wrapperEl.querySelector(".slide-current");
    let nextSlider = wrapperEl.querySelector(".slide-next");

    currentSlider.style.opacity = 0;
    currentSlider.style.zIndex = 0;
    prevSlider.style.opacity = 1;
    prevSlider.style.zIndex = 1;

    nextSlider.className = "banner-slide";
    prevSlider.className = "banner-slide slide-current";
    currentSlider.className = "banner-slide slide-next";

    let prevSliderPrev = prevSlider.previousElementSibling;
    if(prevSliderPrev != null){
        prevSliderPrev.className = "banner-slide slide-prev";
    }else{
        sliders[sliders.length - 1].className = "banner-slide slide-prev";
    }
}

function slideNext(){
    let prevSlider = wrapperEl.querySelector(".slide-prev");
    let currentSlider = wrapperEl.querySelector(".slide-current");
    let nextSlider = wrapperEl.querySelector(".slide-next");

    currentSlider.style.opacity = 0;
    currentSlider.style.zIndex = 0;
    nextSlider.style.opacity = 1;
    nextSlider.style.zIndex = 1;

    prevSlider.className = "banner-slide";
    currentSlider.className = "banner-slide slide-prev";
    nextSlider.className = "banner-slide slide-current";

    let nextSliderNext = nextSlider.nextElementSibling;
    console.log(nextSliderNext);
    if(nextSliderNext != null){
        nextSliderNext.className = "banner-slide slide-next";
    }else{
        sliders[0].className = "banner-slide slide-next";
    }
}

let prevBtn = document.getElementsByClassName("banner-button-prev")[0];
let nextBtn = document.getElementsByClassName("banner-button-next")[0];
prevBtn.onclick = function(){
    slidePrev();
}
nextBtn.onclick = function(){
    slideNext();
}

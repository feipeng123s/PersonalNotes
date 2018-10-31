let wrapperEl = document.getElementsByClassName("banner-wrapper")[0];
let wrapperChildren = wrapperEl.children;
let childrenWidth = wrapperChildren[0].offsetWidth;
let pagnationEl = document.getElementsByClassName("banner-pagination")[0];
let paginationLi = pagnationEl.children;

init();
//监听前后按钮
let prevBtn = document.getElementsByClassName("banner-btn-prev")[0];
let nextBtn = document.getElementsByClassName("banner-btn-next")[0];
prevBtn.onclick = function(){
    prev();
};
nextBtn.onclick = function(){
    next();
};

function init(){
    
    wrapperEl.style.width = `${childrenWidth*wrapperChildren.length}px`;

    for(let i=0; i < wrapperChildren.length; i++){
        wrapperChildren[i].style=`width: 1000px; float: left; position: relative; left: -${childrenWidth*i}px; transition: opacity 500ms ease-in-out; opacity: 0; z-index: 0;`;
    }
    wrapperChildren[0].style.opacity=1;
    wrapperChildren[0].style.zIndex=1;
    wrapperChildren[0].className="banner-slider slider-current";
    wrapperChildren[wrapperChildren.length-1].className="banner-slider slider-prev";
    wrapperChildren[1].className="banner-slider slider-next";


    //初始化导航圆点
    for(let i=0; i < wrapperChildren.length; i++){
        pagnationEl.appendChild(document.createElement("li"));
    }
    pagnationEl.children[0].className="active";
}


let timer=null;
let key=0;
let circle=0;
//timer=setInterval(next,4000);

//向左切换图片
function prev(){
    circle--;
    if(circle < 0){
        circle = paginationLi.length-1;
    }
    changePagination();

    let prevLi = wrapperEl.getElementsByClassName("slider-prev")[0];
    let nextLi = wrapperEl.getElementsByClassName("slider-next")[0];
    let currentLi = wrapperEl.getElementsByClassName("slider-current")[0];
    currentLi.style.opacity=0;
    currentLi.style.zIndex=0;
    prevLi.style.opacity=1;
    prevLi.style.zIndex=1;
    nextLi.className="banner-slider";
    currentLi.className="banner-slider slider-next";
    prevLi.className="banner-slider slider-current";

    if(circle==0){
        wrapperChildren[paginationLi.length-1].className="banner-slider slider-prev";
    }else{
        prevLi.previousElementSibling.className="banner-slider slider-prev";
    }
}

//向右切换图片
function next(){
    circle++;
    if(circle > paginationLi.length-1){
        circle=0;
    }
    changePagination();

    let prevLi = wrapperEl.getElementsByClassName("slider-prev")[0];
    let nextLi = wrapperEl.getElementsByClassName("slider-next")[0];
    let currentLi = wrapperEl.getElementsByClassName("slider-current")[0];
    currentLi.style.opacity=0;
    currentLi.style.zIndex=0;
    nextLi.style.opacity=1;
    nextLi.style.zIndex=1;
    prevLi.className="banner-slider";
    currentLi.className="banner-slider slider-prev";
    nextLi.className="banner-slider slider-current";
    
    if(circle==paginationLi.length-1){
        wrapperChildren[0].className="banner-slider slider-next";
    }else{
        nextLi.nextElementSibling.className="banner-slider slider-next";
    }
}

//执行滑动动画
function slide(obj,target,speed){
    obj.style=`width:${childrenWidth*wrapperChildren.length}px;transform:translate3d(${target}px,0px,0px);transition-duration:500ms;`;
}

//变更导航圆点样式
function changePagination(){
    let paginationLi = pagnationEl.children;
    
    //pagnationEl.getElementsByClassName("active")[0].className="";
    pagnationEl.querySelector(".active").className="";
    paginationLi[circle].className = "active";
}

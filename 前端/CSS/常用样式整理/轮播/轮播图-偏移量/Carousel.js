let wrapperEl = document.getElementsByClassName("banner-wrapper")[0];
let wrapperChildren = wrapperEl.children;
let childrenWidth = wrapperChildren[0].offsetWidth;
let pagnationEl = document.getElementsByClassName("banner-pagination")[0];

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
    //初始化轮播图
    //1)克隆第一个元素
    wrapperEl.appendChild(wrapperChildren[0].cloneNode(true));
    //2)设置容纳所有图片的wrapper的宽度
    wrapperEl.style.width = `${childrenWidth*wrapperChildren.length}px`;


    //初始化导航圆点
    for(let i=0; i < wrapperChildren.length-1; i++){
        pagnationEl.appendChild(document.createElement("li"));
    }
    pagnationEl.children[0].className="active";
}


let timer=null;
let key=0;
let circle=0;
timer=setInterval(next,4000);

//向左切换图片
function prev(){
    key--;
    //到达左边界，立马由第一张图切换到第五张图(由第一张图克隆而来，因此在视觉上不会看到任何滑动效果)
    if(key < 0){
        wrapperEl.style.left = `${-(wrapperChildren.length-1)*childrenWidth}px`;
        key = wrapperChildren.length - 2;
    }
    //再由第五张图向第四张图滑动（显示滑动效果）
    slide(wrapperEl,-key*childrenWidth,50);

    circle--;
    changePagination();
}

//向右切换图片
function next(){
    key++;
    //到达右边界，立马由第五张图切换到第一张图
    if(key > wrapperChildren.length-1){
        wrapperEl.style=`width:${childrenWidth*wrapperChildren.length}px;transform:translate3d(0px,0px,0px);transition-duration:0ms;`;
        //wrapperEl.style.left = 0;
        key = 1;
    }
    //再由第一张图向第二张图滑动
    slide(wrapperEl,-key*childrenWidth,50);

    circle++;
    changePagination();
}

//执行滑动动画
function slide(obj,target,speed){
    //clearInterval(obj.timer);
    //整数向右偏移，负数向左偏移
    let direction = obj.offsetLeft < target ? 1 : -1;

    obj.style=`width:${childrenWidth*wrapperChildren.length}px;transform:translate3d(${target}px,0px,0px);transition-duration:500ms;`;
    console.log(obj.offsetLeft);
    // obj.timer = setInterval(function(){
    //     if(Math.abs(obj.offsetLeft - target) < Math.abs(speed)){
    //         clearInterval(obj.timer);
    //         obj.style.left = `${target}px`;
    //     }else{
    //         obj.style.left = `${obj.offsetLeft + direction*speed}px`;
    //     }
    // },10);
}

//变更导航圆点样式
function changePagination(){
    let paginationLi = pagnationEl.children;
    if(circle > paginationLi.length-1){
        circle=0;
    }
    if(circle < 0){
        circle = paginationLi.length-1;
    }
    
    //pagnationEl.getElementsByClassName("active")[0].className="";
    pagnationEl.querySelector(".active").className="";
    paginationLi[circle].className = "active";
}

//监听导航圆点点击事件
for(let i=0; i < pagnationEl.children.length; i++){
    pagnationEl.children[i].onclick = function(){
        slide(wrapperEl,-i*childrenWidth,50);
        circle = i;
        changePagination();
    }
}
// for (var j = 0; j < pagnationEl.children.length; j++) {
//     (function(j){
//         pagnationEl.children[j].onclick = function(){
//             console.log(`点击了第${j+1}个导航按钮`);
//         }
//     })(j);
// }

//鼠标悬停时停止自动轮播
wrapperEl.onmouseover = function(){
    console.log("鼠标悬停");
    clearInterval(timer);
}
//鼠标离开时开始自动轮播
wrapperEl.onmouseout = function(){
    console.log("鼠标离开");
    timer = setInterval(next,4000);
}
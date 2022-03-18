
// Scroll function
// let prevScroll = window.scrollY;
// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {
//   const stickTop = 60;
//   let curScroll = window.scrollY;
//   const header = document.getElementsByTagName('header')[0]
//   const height = parseInt(getComputedStyle(header).height)
//   console.log(height)
//   if (curScroll <= height){
//     header.classList.remove('scroll-show');
//     header.classList.remove('scroll-hide');
//   } else {
//     if (curScroll > prevScroll) {
//       header.classList.remove('scroll-show');
//       header.classList.add('scroll-hide');
//     } else{
//       header.classList.remove('scroll-hide');
//       header.classList.add('scroll-show');
//     }
//   }
//   prevScroll = curScroll;
// }

let ps = window.scrollY;
let header = document.getElementById('header');
const header_next = document.querySelector('#header + *');
const h = parseInt(getComputedStyle(header).height)
window.onscroll = () => {
  let cs = window.scrollY;
  if (cs > h){
    header.classList.add('sticky');
    header_next.style = `margin-top: ${h}px;`
  }
  if (cs < 1) {
    header.classList.remove('sticky');
    header_next.style = `margin-top: 0;`
  }
  if (cs <= ps) {
    header.style = 'top: 0;'
  } else {
    header.style = `top: -${h}px;`
  }
  ps = cs;
};
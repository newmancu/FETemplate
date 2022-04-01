const options = {
  activeOne: true
}
const accordions = document.getElementsByClassName('accordion');


function clearActive(startPoint, b1) {
  const aList = [...startPoint.getElementsByClassName('active')]
  for (var i=0; i < aList.length; ++i) {
    if (aList[i] !== b1)
      aList[i].classList.remove('active')
  }
}

for (const accordion of accordions) {
  for (const acc_container of accordion.getElementsByClassName('accordion__container')) {
    const title = acc_container.getElementsByClassName('accordion__title')[0]
    title.addEventListener('click', function (ev) {
      if (options.activeOne) {
        clearActive(accordion, acc_container)
      }
      acc_container.classList.toggle('active')

    })
  }
}
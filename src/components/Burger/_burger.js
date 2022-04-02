const burger_menu = document.getElementById('hamburger-menu');
const menu = document.getElementById('menu__burger');
const OM = 'open-menu'
let prev = false
burger_menu.addEventListener('click', (ev) => {
  
  if (prev) {
    burger_menu.classList.remove(OM)
    menu.classList.remove(OM)
    document.body.classList.remove(OM)
    prev = false
  } else {
    burger_menu.classList.add(OM)
    menu.classList.add(OM)
    document.body.classList.add(OM)
    prev = true
  }
})
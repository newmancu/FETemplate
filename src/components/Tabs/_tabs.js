for (const tab of document.getElementsByClassName('tab')) {
  const tab_navbar = tab.getElementsByClassName('tab__navbar')[0]
  const tab_contents = tab.getElementsByClassName('tab-content')

  for (const content of tab_contents) {
    const title = content.getElementsByClassName('tab-content__title')[0].textContent
    const child = document.createElement("li")
    child.innerHTML = `
    <h3>${title}</h3>
    `

    const clearActive = root => {
      const aList = [...root.getElementsByClassName('active')]
      for (const a of aList) {
        a.classList.remove('active')
      }
    }

    child.addEventListener('click', function (ev) {
      clearActive(tab)
      this.classList.add('active')
      content.classList.add('active')
    })
    tab_navbar.appendChild(child)
  }

}
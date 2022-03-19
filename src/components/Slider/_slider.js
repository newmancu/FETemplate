const numOfActiveSlides = 2

function addNavigation(slider) {
  const nav = slider.slider.getElementsByClassName('slider__navigation')[0]
  const left = nav.getElementsByClassName('navigation__left')[0]
  const right = nav.getElementsByClassName('navigation__right')[0]

  left.addEventListener('click', function (ev) {
    const prev = slider.cur
    slider.cur = (slider.max + slider.cur - 1) % slider.max
    slider.slides[slider.cur].classList.toggle('active')
    slider.slides[prev].classList.add('slide-left__animation')
    slider.slides[prev].onanimationend = () => {
      slider.slides[prev].classList.toggle('active')
      slider.slides[prev].classList.remove('slide-left__animation')
    }
  })
  right.addEventListener('click', function (ev) {
    const prev = slider.cur
    slider.cur = (slider.max + slider.cur + 1) % slider.max
    slider.slides[slider.cur].classList.toggle('active')
    slider.slides[prev].classList.add('slide-right__animation')
    slider.slides[prev].onanimationend = () => {
      slider.slides[prev].classList.toggle('active')
      slider.slides[prev].classList.remove('slide-right__animation')
    }
  })
}

const sliders = document.getElementsByClassName('slider')
for (const slider of sliders) {
  const slides = [...slider.getElementsByClassName('slider__item')]
  const fullSlider = {
    slider,
    cur: 0,
    slides: slides,
    max: slides.length
  }

  fullSlider.slides[fullSlider.cur].classList.toggle('active')
  addNavigation(fullSlider)


}
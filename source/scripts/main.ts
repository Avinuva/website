import imagesLoaded from 'imagesloaded'
import Slideshow from './modules/Slideshow'

imagesLoaded(document.querySelectorAll('img'), () => {
  document.body.classList.remove('loading')
  new Slideshow(document.querySelector('.skills'))
})

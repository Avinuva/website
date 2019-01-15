import anime from 'animejs'
import SkillsSlideshow from './modules/SkillsSlideshow'
import { debounce } from './modules/helpers'
window.onload = function() {
  new SkillsSlideshow(document.querySelector('.hero > .skills'))
  document.querySelectorAll('[data-parallax]').forEach($el => {
    let timeline = anime.timeline({ autoplay: false })
    let properties = JSON.parse(($el as HTMLElement).dataset.parallax)
    properties.targets = $el
    properties.easing = properties.easing || 'linear'
    timeline.add(properties)
    function setup() {
      requestAnimationFrame(() => {
        const rect = $el.getBoundingClientRect()
        const wHeight = window.innerHeight
        if (rect.top < wHeight && rect.bottom > 0) {
          timeline.seek(timeline.duration * ((wHeight - rect.top) / (wHeight + rect.height)))
        } else {
          if (rect.top >= wHeight) {
            timeline.seek(0)
          } else if (rect.bottom <= 0) {
            timeline.seek(timeline.duration)
          }
        }
      })
    }
    window.addEventListener('resize', setup)
    // window.addEventListener('scroll', setup)
    setup()
  })
}

// 	var parallaxSetup = function () {
// 		var bound = $this[0].getBoundingClientRect();
// 		var wHeight = $(window).height();
// 		if (bound.top < wHeight && bound.bottom > 0) {
// 			animetl.seek(animetl.duration * ( (wHeight - bound.top) / (wHeight + bound.height) ).toFixed(3));
// 		} else {
// 			if (bound.top >= wHeight) {
// 				animetl.seek(0);
// 			} else if (bound.bottom <= 0) {
// 				animetl.seek(animetl.duration)
// 			}
// 		}
// 	};

// 	$(window).on("resize scroll", throttle(parallaxSetup, 50));
// 	setTimeout(parallaxSetup, 50);
// });

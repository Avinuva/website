import charming from 'charming'
import anime from 'animejs'
import Direction from './Direction'
type DOM = {
  el: HTMLElement
  title: HTMLElement
  titleLetters: NodeListOf<HTMLElement>
  description: HTMLElement
  cover: HTMLElement
  expander: HTMLElement
  projects: {
    wrapper: HTMLElement
    items: HTMLElement[]
  }
}
const settings = {
  title: { duration: 700, delay: 200, easing: 'cubicBezier(0.8, 0, 0.2, 1)' },
  description: { duration: 900, delay: 400, easing: 'easeOutExpo' },
  projects: { duration: 300, delay: 0, easing: 'cubicBezier(0.8, 0, 0.2, 1)' },
  cover: { duration: 900, delay: 0, easing: 'cubicBezier(0.8, 0, 0.2, 1)' },
}

export default class {
  DOM = {} as DOM
  isHidden: Boolean = false
  direction: Direction
  constructor(el: HTMLElement) {
    this.DOM.el = el
    this.DOM.title = el.querySelector('.skill-title')
    charming(this.DOM.title)
    this.DOM.titleLetters = this.DOM.title.querySelectorAll('span')
    this.DOM.description = el.querySelector('.skill-description')
    this.DOM.cover = el.querySelector('.skill-cover img')
    this.DOM.expander = el.querySelector('.skill-expander')
    this.DOM.projects = {
      wrapper: el.querySelector('.skill-projects'),
      items: Array.from(el.querySelectorAll('.skill-projects > li')),
    }
  }
  show(dir: Direction) {
    this.isHidden = false
    return this.toggle(dir)
  }
  hide(dir: Direction) {
    this.isHidden = true
    return this.toggle(dir)
  }
  toggle(dir: Direction) {
    this.direction = dir
    return Promise.all([
      this.toggleTitle(),
      this.toggleDescription(),
      this.toggleProjects(),
      this.toggleCover(),
    ])
  }
  toggleTitle() {
    anime.remove(this.DOM.titleLetters)
    return anime({
      targets: this.DOM.titleLetters,
      duration: settings.title.duration,
      delay: (_, index) => index * 30 + settings.title.delay,
      easing: settings.title.easing,
      translateY: this.isHidden
        ? [0, this.direction === 'next' ? '-100%' : '100%']
        : [this.direction === 'next' ? '100%' : '-100%', 0],
      opacity: {
        value: this.isHidden ? 0 : 1,
        duration: 1,
        delay: () =>
          this.isHidden
            ? settings.title.duration + settings.title.delay
            : settings.title.delay,
      },
    }).finished
  }
  toggleDescription() {
    anime.remove(this.DOM.description)
    return anime({
      targets: this.DOM.description,
      duration: settings.description.duration,
      delay: !this.isHidden
        ? settings.description.duration * 0.5 + settings.description.delay
        : settings.description.delay,
      easing: settings.description.easing,
      translateY: this.isHidden
        ? [0, this.direction === 'next' ? '-10%' : '10%']
        : [this.direction === 'next' ? '20%' : '-20%', 0],
      opacity: this.isHidden ? 0 : 1,
    }).finished
  }

  toggleProjects() {
    anime.remove(this.DOM.projects.items)
    anime.remove(this.DOM.projects.wrapper)
    return Promise.all([
      anime({
        targets: this.DOM.projects.items,
        duration: settings.projects.duration,
        delay: (_, index) => {
          return !this.isHidden
            ? index * 40 +
                settings.projects.duration * 0.5 +
                settings.projects.delay
            : index * 40 + settings.projects.delay
        },
        easing: settings.projects.easing,
        translateY: this.isHidden
          ? [0, this.direction === 'next' ? -20 : 20]
          : [this.direction === 'next' ? +20 : -20, 0],
        opacity: this.isHidden ? 0 : 1,
      }).finished,
      anime({
        targets: this.DOM.projects.wrapper,
        duration: 0,
        delay: 500,
        easing: settings.projects.easing,
        opacity: this.isHidden ? 0 : 1,
      }).finished
    ])
  }
  toggleCover() {
    this.DOM.cover.style.transformOrigin = !this.isHidden
      ? `50% ${this.direction === 'next' ? 0 : 100}%`
      : `50% 50%`
    anime.remove(this.DOM.cover)
    return anime({
      targets: this.DOM.cover,
      duration: settings.cover.duration,
      delay: settings.cover.delay,
      easing: settings.cover.easing,
      translateY: this.isHidden
        ? ['0%', this.direction === 'next' ? '-100%' : '100%']
        : [this.direction === 'next' ? '100%' : '-100%', '0%'],
      scale: !this.isHidden ? [1.8, 1] : 1,
      opacity: {
        value: this.isHidden ? 0 : 1,
        duration: 1,
        delay: this.isHidden
          ? settings.cover.duration + settings.cover.delay
          : settings.cover.delay,
      },
    }).finished
  }
}

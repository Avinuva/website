import charming from 'charming'
import anime from 'animejs'

export default class {
  private $el: Element
  private $titleLetters: NodeListOf<HTMLSpanElement>
  private isHidden = false
  private $cover: HTMLElement
  constructor(el: Element) {
    this.$el = el
    this.$cover = el.querySelector('.cover img')

    let title = el.querySelector('.title')
    charming(title)
    this.$titleLetters = title.querySelectorAll('span')
  }

  show(n: number) {
    this.isHidden = false
    return this.toggle(n).then(() => {
      this.$el.classList.add('current')
    })
  }

  hide(n: number) {
    this.isHidden = true
    return this.toggle(n).then(() => {
      this.$el.classList.remove('current')
    })
  }

  private toggle(n: number) {
    return Promise.all([this.toggleTitle(n), this.toggleCover(n)])
  }

  private toggleTitle(n: number) {
    anime.remove(this.$titleLetters)
    return anime({
      targets: this.$titleLetters,
      duration: 700,
      delay: anime.stagger(30, { start: 200 }),
      easing: 'cubicBezier(0.8, 0, 0.2, 1)',
      translateY: this.isHidden ? [0, n > 0 ? '-100%' : '100%'] : [n > 0 ? '100%' : '-100%', 0],
      opacity: {
        value: this.isHidden ? 0 : 1,
        duration: 1,
        delay: this.isHidden ? 900 : 200,
      },
    }).finished
  }

  private toggleCover(n: number) {
    this.$cover.style.transformOrigin = !this.isHidden ? `50% ${n > 0 ? 0 : 100}%` : `50% 50%`
    anime.remove(this.$cover)
    return anime({
      targets: this.$cover,
      duration: 900,
      delay: 0,
      easing: 'cubicBezier(0.8, 0, 0.2, 1)',
      translateY: this.isHidden ? [0, n > 0 ? '-100%' : '100%'] : [n > 0 ? '100%' : '-100%', 0],
      opacity: {
        value: this.isHidden ? 0 : 1,
        duration: 1,
        delay: this.isHidden ? 900 : 0
      }
    })
  }
}

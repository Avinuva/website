import anime from 'animejs'
import Entry from './entry'

export default class {
  $el: Element
  $pagination: any
  entries: Entry[]
  isAnimating: boolean = false
  currentPos = 0
  currentEntry: Entry
  constructor(el: Element) {
    this.$el = el
    this.$pagination = el.querySelector('.index .inner')
    this.entries = Array.from(el.querySelectorAll('.skill'), e => new Entry(e))
    el.querySelector('.index .total').innerHTML = `0${this.entries.length}`
    this.currentEntry = this.entries[this.currentPos]
    this.setupEvents()
  }

  setupEvents() {
    this.$el.querySelector('.nav .next').addEventListener('click', () => {
      this.navigate(1)
    })
    this.$el.querySelector('.nav .prev').addEventListener('click', () => {
      this.navigate(-1)
    })
  }

  navigate(n: number) {
    if (this.isAnimating) return
    this.isAnimating = true
    this.currentPos += n
    if (this.currentPos < 0) {
      this.currentPos = this.entries.length - 1
    } else if (this.currentPos > this.entries.length - 1) {
      this.currentPos = 0
    }
    const entry = this.entries[this.currentPos]
    Promise.all([
      this.updatePagination(n),
      this.currentEntry.hide(n),
      entry.show(n),
    ]).then(() => {
      // this.currentEntry.$el.classList.remove('current')
      this.currentEntry = entry
      // this.currentEntry.$el.classList.add('current')
      this.isAnimating = false
    })
  }

  updatePagination(n: number) {
    anime.remove(this.$pagination)
    let halfway = false
    return anime({
      targets: this.$pagination,
      duration: 300,
      easing: 'easeInOutQuad',
      translateY: [
        { value: n > 0 ? '-100%' : '100%', delay: 400 },
        { value: [n > 0 ? '100%' : '-100%', '0%'], delay: 300 },
      ],
      opacity: [{ value: 0, delay: 400 }, { value: [0, 1], delay: 300 }],
      update: anime => {
        if (anime.progress >= 50 && !halfway) {
          halfway = true
          this.$pagination.innerHTML = `0${this.currentPos + 1}`
        }
      },
    }).finished
  }
}

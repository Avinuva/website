import Entry from './Entry'
import Direction from './Direction'
import anime from 'animejs'

type DOM = {
  el: HTMLElement
  navigation: Navigation
  pagination: HTMLElement
}
type Navigation = {
  wraper: HTMLElement
  prev: HTMLElement
  next: HTMLElement
}

const settings = {
  pagination: { duration: 300, delay: 400, easing: 'easeInOutQuad' },
}

export default class {
  DOM = {} as DOM
  entries: Entry[]
  currentPos: number
  currentEntry: Entry
  isEntriesAnimating: boolean
  direction: string
  constructor(el: HTMLElement) {
    this.DOM.el = el
    this.DOM.navigation = {} as Navigation
    this.DOM.navigation.wraper = el.querySelector('.nav')
    this.DOM.navigation.prev = this.DOM.navigation.wraper.querySelector('.prev')
    this.DOM.navigation.next = this.DOM.navigation.wraper.querySelector('.next')
    this.DOM.pagination = el.querySelector('.index .index-inner')
    this.entries = Array.from(
      el.querySelectorAll('.skill'),
      e => new Entry(e as HTMLElement)
    )
    el.querySelector('.index .index-total').innerHTML = `0${
      this.entries.length
    }`
    this.currentPos = 0
    this.currentEntry = this.entries[0]
    this.events()
  }

  events() {
    this.DOM.navigation.prev.addEventListener('click', () => {
      this.navigate('prev')
    })
    this.DOM.navigation.next.addEventListener('click', () => {
      this.navigate('next')
    })
  }

  navigate(dir: Direction) {
    if (this.isEntriesAnimating) return
    this.isEntriesAnimating = true
    this.direction = dir
    this.currentPos =
      this.direction === 'next'
        ? this.currentPos < this.entries.length - 1
          ? this.currentPos + 1
          : 0
        : this.currentPos > 0
        ? this.currentPos - 1
        : this.entries.length - 1
    this.update(this.entries[this.currentPos], dir)
  }

  update(entry: Entry, dir: Direction) {
    Promise.all([
      entry.show(dir),
      this.currentEntry.hide(dir),
      this.updatePagination(dir),
    ]).then(() => {
      this.isEntriesAnimating = false
      this.currentEntry.DOM.el.classList.remove('current')
      entry.DOM.el.classList.add('current')
      this.currentEntry = entry
    })
  }
  updatePagination(dir: Direction) {
    anime.remove(this.DOM.pagination)
    let halfway = false
    return anime({
      targets: this.DOM.pagination,
      duration: settings.pagination.duration,
      easing: settings.pagination.easing,
      translateY: [
        {
          value: dir === 'next' ? '-100%' : '100%',
          delay: settings.pagination.delay,
        },
        {
          value: [dir === 'next' ? '100%' : '-100%', '0%'],
          delay: settings.pagination.duration,
        },
      ],
      opacity: [
        { value: 0, delay: settings.pagination.delay },
        { value: [0, 1], delay: settings.pagination.duration },
      ],
      update: anime => {
        if (anime.progress >= 50 && !halfway) {
          halfway = true
          this.DOM.pagination.innerHTML = `0${this.currentPos + 1}`
        }
      },
    }).finished
  }
}

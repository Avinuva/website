export const debounce = (fn, time) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn.apply(this, args), time)
    }
}

export const throttle = (fn, time) => {

}

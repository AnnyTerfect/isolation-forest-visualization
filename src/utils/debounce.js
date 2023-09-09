// debounce hook in vue

export default function useDebounce() {
  const debounce = (fn, delay) => {
    let timer = null
    return function () {
      const context = this
      const args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }

  return debounce
}

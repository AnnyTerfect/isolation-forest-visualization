// debounce hook in vue

export default function useDebounce() {
  const debounce = (fn, delay) => {
    let timer = null;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  };

  return debounce;
}
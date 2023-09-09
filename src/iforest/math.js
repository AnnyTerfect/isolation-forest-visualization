function cumsum(arr) {
  let sum = 0
  return arr.map(x => sum += x)
}

export { cumsum }

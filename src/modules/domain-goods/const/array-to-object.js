export const ArrayToObject = data => {
  const res = {}
  for (const item of data) {
    res[item.value] = item
  }
  return res
}

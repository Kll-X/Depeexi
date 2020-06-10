export const perm2DArray = (arr2D = []) => {
  if (!arr2D.length) return arr2D
  arr2D = arr2D.filter(info => info.length)
  if (arr2D.length < 2) {
    return arr2D[0] ? arr2D[0].map(info => [info]) : []
  }
  const comp2Arr = (firstArr = [], endArr = []) => {
    if (firstArr.length == 0) return endArr
    if (endArr.length === 0) return firstArr

    let tempArr = []
    firstArr.forEach(info => {
      endArr.forEach(inner => {
        if (Object.prototype.toString.call(info) !== '[object Array]') {
          info = [info]
        }
        if (Object.prototype.toString.call(inner) !== '[object Array]') {
          inner = [inner]
        }
        tempArr.push(info.concat(inner))
      })
    })
    return tempArr
  }
  let targetArr = []
  for (let i = 0; i < arr2D.length; i++) {
    targetArr = comp2Arr(targetArr, arr2D[i])
  }
  return targetArr
}

// 在target的所有对象中增加目标属性
// 删除target中所有的目标属性
// props 增加的对象, delprops 要删除的对象key值数组
export const addProps = (target, props = {}, delProps = []) => {
  const toString = Object.prototype.toString
  const ArrString = '[object Array]'
  const ObjString = '[object Object]'
  if (toString.call(target) === ObjString) {
    Object.assign(target, props)
    for (const name of delProps) {
      delete target[name]
    }
    for (const item in target) {
      addProps(target[item], props, delProps)
    }
  }
  if (toString.call(target) === ArrString) {
    for (const item in target) {
      addProps(target[item], props, delProps)
    }
  }
  return target
}

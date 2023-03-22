export function randomExtend(minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(String(Math.random() * minNum + 1), 10)
  } else {
    return parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10)
  }
}

export function debounce(delay, callback) {
  let lastTime

  return function () {
    clearTimeout(lastTime)

    // const [that, args] = [this, arguments]

    lastTime = setTimeout(() => {
      // callback.apply(that, args)
      callback()
    }, delay)
  }
}

export function observerDomResize(dom, callback) {
  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  const observer = new MutationObserver(callback)

  observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })

  return observer
}

export function getPointDistance(pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0])

  const minusY = Math.abs(pointOne[1] - pointTwo[1])

  return Math.sqrt(minusX * minusX + minusY * minusY)
}

export function uuid(hasHyphen) {
  return (
    hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'
  ).replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 深度克隆
 * @description Clone an object or array
 * @param {Object|Array} object Cloned object
 * @param {Boolean} recursion   Whether to use recursive cloning
 * @return {Object|Array} Clone object
 */
export function deepClone(object, recursion = false) {
  if (!object) return object

  const { parse, stringify } = JSON

  if (!recursion) return parse(stringify(object))

  const clonedObj = object instanceof Array ? [] : {}

  if (object && typeof object === 'object') {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        if (object[key] && typeof object[key] === 'object') {
          clonedObj[key] = deepClone(object[key], true)
        } else {
          clonedObj[key] = object[key]
        }
      }
    }
  }

  return clonedObj
}

/**
 * 深度合并
 * @param target
 * @param merged
 * @returns
 */
export function deepMerge(target, merged) {
  for (var key in merged) {
    if (target[key] && typeof target[key] === 'object') {
      deepMerge(target[key], merged[key])
      continue
    }

    if (typeof merged[key] === 'object') {
      target[key] = deepClone(merged[key], true)
      continue
    }

    target[key] = merged[key]
  }

  return target
}

import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { debounce, observerDomResize } from './index'

export function useAutoresize() {
  // const dom = ref('')
  const width = ref(0)
  const height = ref(0)
  const debounceInitWHFun = ref()
  let domObserver: any

  let dom: any
  let afterAutoResizeMixinInit: any
  let onResize: any

  onMounted(() => {
    // autoResizeMixinInit()
  })

  onBeforeUnmount(() => {
    unbindDomResizeCallback()
  })

  const autoResizeMixinInit = async (dom1: any, afterAutoResizeMixinInit1: any, onResize1: any) => {
    // const { initWH, getDebounceInitWHFun, bindDomResizeCallback, afterAutoResizeMixinInit } = this

    dom = dom1
    afterAutoResizeMixinInit = afterAutoResizeMixinInit1
    onResize = onResize1

    await initWH(false)

    getDebounceInitWHFun()

    bindDomResizeCallback()

    if (typeof afterAutoResizeMixinInit === 'function') afterAutoResizeMixinInit()
  }
  const initWH = (resize = true) => {
    // const { $nextTick, $refs, ref, onResize } = this

    return new Promise((resolve) => {
      nextTick(() => {
        const dom1 = dom

        width.value = dom1 ? dom1.clientWidth : 0
        height.value = dom1 ? dom1.clientHeight : 0

        if (!dom1) {
          console.warn('DataV: Failed to get dom node, component rendering may be abnormal!')
        } else if (!width.value || !height.value) {
          console.warn('DataV: Component width or height is 0px, rendering abnormality may occur!')
        }

        if (typeof onResize === 'function' && resize) onResize()

        resolve({})
      })
    })
  }
  const getDebounceInitWHFun = () => {
    debounceInitWHFun.value = debounce(100, initWH)
  }
  const bindDomResizeCallback = () => {
    domObserver = observerDomResize(dom, debounceInitWHFun.value)

    window.addEventListener('resize', debounceInitWHFun.value)
  }
  const unbindDomResizeCallback = () => {
    if (!domObserver) return

    domObserver.disconnect()
    domObserver.takeRecords()
    domObserver = null

    window.removeEventListener('resize', debounceInitWHFun.value)
  }

  return new Promise((resolve) => {
    resolve({ autoResizeMixinInit })
  })
}

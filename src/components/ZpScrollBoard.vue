<template>
  <div class="zp-scroll-board" :ref="iref">
    <div
      class="header"
      v-if="header.length && mergedConfig"
      :style="`background-color: ${mergedConfig.headerBGC};`"
    >
      <div
        class="header-item"
        v-for="(headerItem, i) in header"
        :key="`${headerItem}${i}`"
        :style="`
          color: ${mergedConfig.headerColor};
          height: ${mergedConfig.headerHeight}px;
          line-height: ${mergedConfig.headerHeight}px;
          width: ${widths[i]}px;
        `"
        :align="aligns[i]"
        v-html="headerItem"
      />
    </div>

    <div
      v-if="mergedConfig"
      class="rows"
      :style="`height: ${height - (header.length ? mergedConfig.headerHeight : 0)}px;`"
    >
      <div
        class="row-item"
        v-for="(row, ri) in rows"
        :key="`${row.toString()}${row.scroll}`"
        :style="`
          color: ${mergedConfig.rowColor};
          height: ${heights[ri]}px;
          line-height: ${heights[ri]}px;
          background-color: ${mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']};
        `"
      >
        <div
          class="ceil"
          v-for="(ceil, ci) in row.ceils"
          :key="`${ceil}${ri}${ci}`"
          :style="`width: ${widths[ci]}px;`"
          :align="aligns[ci]"
          v-html="ceil"
          @click="emitEvent('click', ri, ci, row, ceil)"
          @mouseenter="handleHover(true, ri, ci, row, ceil)"
          @mouseleave="handleHover(false, ri, ci, row, ceil)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { deepClone, deepMerge } from '../util'
const instance: any = getCurrentInstance()
const emit = defineEmits(['click', 'mouseover'])

const props = defineProps({
  config: {
    type: Object,
    default: () => {}
  },
  dev: {
    type: Boolean,
    default: false
  }
})

const iref = 'scroll-board'
const defaultConfig = {
  /**
   * @description Board header
   * @type {Array<String>}
   * @default header = []
   * @example header = ['column1', 'column2', 'column3']
   */
  header: [],
  /**
   * @description Board data
   * @type {Array<Array>}
   * @default data = []
   */
  data: [],
  /**
   * @description Row num
   * @type {Number}
   * @default rowNum = 5
   */
  rowNum: 5,
  /**
   *
   */
  headerColor: '#FFF',
  /**
   * @description Header background color
   * @type {String}
   * @default headerBGC = '#00BAFF'
   */
  headerBGC: '#00BAFF',
  /**
   * @description Odd row background color
   * @type {String}
   * @default oddRowBGC = '#003B51'
   */
  oddRowBGC: '#003B51',
  /**
   * @description Even row background color
   * @type {String}
   * @default evenRowBGC = '#003B51'
   */
  evenRowBGC: '#0A2732',
  /**
   *
   */
  rowColor: '#FFF',
  /**
   * @description Scroll wait time
   * @type {Number}
   * @default waitTime = 2000
   */
  waitTime: 2000,
  /**
   * @description Header height
   * @type {Number}
   * @default headerHeight = 35
   */
  headerHeight: 35,
  /**
   * @description Column width
   * @type {Array<Number>}
   * @default columnWidth = []
   */
  columnWidth: [],
  /**
   * @description Column align
   * @type {Array<String>}
   * @default align = []
   * @example align = ['left', 'center', 'right']
   */
  align: [],
  /**
   * @description Show index
   * @type {Boolean}
   * @default index = false
   */
  index: false,
  /**
   * @description index Header
   * @type {String}
   * @default indexHeader = '#'
   */
  indexHeader: '#',
  /**
   * @description Carousel type
   * @type {String}
   * @default carousel = 'single'
   * @example carousel = 'single' | 'page'
   */
  carousel: 'single',
  /**
   * @description Pause scroll when mouse hovered
   * @type {Boolean}
   * @default hoverPause = true
   * @example hoverPause = true | false
   */
  hoverPause: true
}
const width: any = ref(0)
const height: any = ref(0)
const mergedConfig: any = ref()
const header: any = ref([])
const rowsData: any = ref([])
const rows: any = ref([])
const widths: any = ref([])
const heights: any = ref([])
const avgHeight: any = ref(0)
const aligns: any = ref([])
const animationIndex: any = ref(0)
const animationHandler: any = ref('')
const updater: any = ref(0)
const needCalc: any = ref(false)
watch(
  () => props.config,
  () => {
    stopAnimation()
    animationIndex.value = 0
    calcData()
  }
)
onMounted(() => {
  calcData()
})
onUnmounted(() => {
  stopAnimation()
})
const handleHover = (enter: any, ri: any, ci: any, row: any, ceil: any) => {
  if (enter) emitEvent('mouseover', ri, ci, row, ceil)
  if (!mergedConfig.hoverPause) return

  if (enter) {
    stopAnimation()
  } else {
    animation(true)
  }
}
const calcData = () => {
  const { clientWidth, clientHeight } = instance?.refs[iref]
  width.value = clientWidth
  height.value = clientHeight

  mergeConfig()
  calcHeaderData()
  calcRowsData()
  calcWidths()
  calcHeights()
  calcAligns()
  animation(true)
}
const mergeConfig = () => {
  let { config } = props
  mergedConfig.value = deepMerge(deepClone(defaultConfig, true), config || {})
}
const calcHeaderData = () => {
  let { index, indexHeader } = mergedConfig.value
  if (!mergedConfig.value.header.length) {
    header.value = []
    return
  }
  let _header = [...mergedConfig.value.header]
  if (index) _header.unshift(indexHeader)
  header.value = _header
}
const calcRowsData = () => {
  let { data, index, headerBGC, rowNum } = mergedConfig.value
  if (index) {
    data = data.map((row: any, i: any) => {
      row = [...row]
      const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`
      row.unshift(indexTag)
      return row
    })
  }
  data = data.map((ceils: any, i: any) => ({ ceils, rowIndex: i }))
  const rowLength = data.length
  if (rowLength > rowNum && rowLength < 2 * rowNum) {
    data = [...data, ...data]
  }
  data = data.map((d: any, i: any) => ({ ...d, scroll: i }))
  rowsData.value = data
  rows.value = data
}
const calcWidths = () => {
  const { columnWidth, header } = mergedConfig.value
  const usedWidth = columnWidth.reduce((all: any, w: any) => all + w, 0)
  let columnNum = 0
  if (rowsData[0]) {
    columnNum = rowsData[0].ceils.length
  } else if (header.length) {
    columnNum = header.length
  }
  const avgWidth = (width.value - usedWidth) / (columnNum - columnWidth.length)
  const _widths = new Array(columnNum).fill(avgWidth)
  widths.value = deepMerge(_widths, columnWidth)
}
const calcHeights = (onresize = false) => {
  const { headerHeight, rowNum, data } = mergedConfig.value
  let allHeight = height.value
  if (header.length) allHeight -= headerHeight
  const _avgHeight = allHeight / rowNum
  avgHeight.value = _avgHeight

  if (!onresize) heights.value = new Array(data.length).fill(_avgHeight)
}
const calcAligns = () => {
  const columnNum = header.value
  let _aligns = new Array(columnNum).fill('left')
  const { align } = mergedConfig.value
  aligns.value = deepMerge(_aligns, align)
}
const animation = async (start = false) => {
  if (needCalc.value) {
    calcRowsData()
    calcHeights()
    needCalc.value = false
  }

  const _updater = updater.value
  let _animationIndex = animationIndex.value

  const { waitTime, carousel, rowNum } = mergedConfig.value

  const rowLength = rowsData.value.length

  if (rowNum >= rowLength) return

  if (start) {
    await new Promise((resolve) => setTimeout(resolve, waitTime))
    if (_updater !== updater.value) return
  }

  const animationNum = carousel === 'single' ? 1 : rowNum

  let _rows = rowsData.value.slice(animationIndex.value)
  _rows.push(...rowsData.value.slice(0, animationIndex.value))

  rows.value = _rows.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1)
  heights.value = new Array(rowLength).fill(avgHeight.value)

  await new Promise((resolve) => setTimeout(resolve, 300))
  if (_updater !== updater.value) return

  heights.value.splice(0, animationNum, ...new Array(animationNum).fill(0))

  _animationIndex += animationNum

  const back = _animationIndex - rowLength
  if (back >= 0) _animationIndex = back

  animationIndex.value = _animationIndex
  animationHandler.value = setTimeout(animation, waitTime - 300)
}
const stopAnimation = () => {
  updater.value = (updater.value + 1) % 999999
  if (!animationHandler.value) return
  clearTimeout(animationHandler.value)
}
const emitEvent = (type: any, ri: any, ci: any, row: any, ceil: any) => {
  const { ceils, rowIndex } = row
  emit(type, {
    row: ceils,
    ceil,
    rowIndex,
    columnIndex: ci
  })
}
const updateRows = (rows: any, _animationIndex: any) => {
  mergedConfig.value = {
    ...mergedConfig.value,
    data: [...rows]
  }

  needCalc.value = true

  if (typeof _animationIndex === 'number') animationIndex.value = _animationIndex
  if (!animationHandler.value) animation(true)
}
</script>

<style lang="scss" scoped>
.zp-scroll-board {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;

  .text {
    padding: 0 10px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header {
    display: flex;
    flex-direction: row;
    font-size: 15px;

    .header-item {
      .text {
      }
      transition: all 0.3s;
    }
  }

  .rows {
    overflow: hidden;

    .row-item {
      display: flex;
      font-size: 14px;
      transition: all 0.3s;
      overflow: hidden;
    }

    .ceil {
      .text {
      }
    }

    .index {
      border-radius: 3px;
      padding: 0px 3px;
    }
  }
}
</style>

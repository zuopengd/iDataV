<template>
  <div class="zp-flyline-chart-enhanced" :ref="iref" :style="style" @click="consoleClickPos">
    <svg v-if="flylines.length" :width="width" :height="height">
      <defs>
        <radialGradient :id="flylineGradientId" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>

        <radialGradient :id="haloGradientId" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="100%" stop-color="#fff" stop-opacity="1" />
        </radialGradient>
      </defs>

      <!-- points -->
      <g v-for="point in flylinePoints" :key="point.key + Math.random()">
        <defs>
          <circle
            v-if="point.halo.show"
            :id="`halo${unique}${point.key}`"
            :cx="point.coordinate[0]"
            :cy="point.coordinate[1]"
          >
            <animate
              attributeName="r"
              :values="`1;${point.halo.radius}`"
              :dur="`${point.halo.time}s`"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              :dur="`${point.halo.time}s`"
              repeatCount="indefinite"
            />
          </circle>
        </defs>

        <!-- halo gradient mask -->
        <mask :id="`mask${unique}${point.key}`">
          <use
            v-if="point.halo.show"
            :xlink:href="`#halo${unique}${point.key}`"
            :fill="`url(#${haloGradientId})`"
          />
        </mask>

        <!-- point halo -->
        <use
          v-if="point.halo.show"
          :xlink:href="`#halo${unique}${point.key}`"
          :fill="point.halo.color"
          :mask="`url(#mask${unique}${point.key})`"
        />

        <!-- point icon -->
        <image
          v-if="point.icon.show"
          :xlink:href="point.icon.src"
          :width="point.icon.width"
          :height="point.icon.height"
          :x="point.icon.x"
          :y="point.icon.y"
        />

        <!-- point text -->
        <text
          v-if="point.text.show"
          :style="`fontSize:${point.text.fontSize}px;color:${point.text.color}`"
          :fill="point.text.color"
          :x="point.text.x"
          :y="point.text.y"
        >
          {{ point.name }}
        </text>
      </g>

      <!-- flylines -->
      <g v-for="(line, i) in flylines" :key="line.key + Math.random()">
        <defs>
          <path :id="line.key" :ref="line.key" :d="line.d" fill="transparent" />
        </defs>

        <!-- orbit line -->
        <use :xlink:href="`#${line.key}`" :stroke-width="line.width" :stroke="line.orbitColor" />

        <!-- fly line gradient mask -->
        <mask :id="`mask${unique}${line.key}`">
          <circle cx="0" cy="0" :r="line.radius" :fill="`url(#${flylineGradientId})`">
            <animateMotion :dur="line.time" :path="line.d" rotate="auto" repeatCount="indefinite" />
          </circle>
        </mask>

        <!-- fly line -->
        <use
          v-if="flylineLengths[i]"
          :xlink:href="`#${line.key}`"
          :stroke-width="line.width"
          :stroke="line.color"
          :mask="`url(#mask${unique}${line.key})`"
        >
          <animate
            attributeName="stroke-dasharray"
            :from="`0, ${flylineLengths[i]}`"
            :to="`${flylineLengths[i]}, 0`"
            :dur="line.time"
            repeatCount="indefinite"
          />
        </use>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, getCurrentInstance, nextTick } from 'vue'
import { uuid, deepClone, deepMerge, randomExtend, getPointDistance } from '../util'

const instance: any = getCurrentInstance()

const props = defineProps({
  config: {
    type: Object,
    default: () => {}
  },
  width: {
    type: Number,
    default: 500
  },
  height: {
    type: Number,
    default: 400
  },
  dev: {
    type: Boolean,
    default: false
  }
})

const id = uuid(false)
const iref = 'dv-flyline-chart-enhanced'
const unique = Math.random()
const flylineGradientId = ref(`flyline-gradient-id-${id}`)
const haloGradientId = ref(`halo-gradient-id-${id}`)
const defaultConfig = {
  /**
   * @description Flyline chart points
   * @type {Point[]}
   * @default points = []
   */
  points: [],
  /**
   * @description Lines
   * @type {Flyline[]}
   * @default lines = []
   */
  lines: [],
  /**
   * @description Global halo configuration
   * @type {Halo}
   */
  halo: {
    /**
     * @description Whether to show halo
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description Halo animation duration (1s = 10)
     * @type {[number, number]}
     */
    duration: [20, 30],
    /**
     * @description Halo color
     * @type {String}
     * @default color = '#fb7293'
     */
    color: '#fb7293',
    /**
     * @description Halo radius
     * @type {Number}
     * @default radius = 120
     */
    radius: 120
  },
  /**
   * @description Global text configuration
   * @type {Text}
   */
  text: {
    /**
     * @description Whether to show text
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description Text offset
     * @type {[number, number]}
     * @default offset = [0, 15]
     */
    offset: [0, 15],
    /**
     * @description Text color
     * @type {String}
     * @default color = '#ffdb5c'
     */
    color: '#ffdb5c',
    /**
     * @description Text font size
     * @type {Number}
     * @default fontSize = 12
     */
    fontSize: 12
  },
  /**
   * @description Global icon configuration
   * @type {Icon}
   */
  icon: {
    /**
     * @description Whether to show icon
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description Icon src
     * @type {String}
     * @default src = ''
     */
    src: '',
    /**
     * @description Icon width
     * @type {Number}
     * @default width = 15
     */
    width: 15,
    /**
     * @description Icon height
     * @type {Number}
     * @default width = 15
     */
    height: 15
  },
  /**
   * @description Global line configuration
   * @type {Line}
   */
  line: {
    /**
     * @description Line width
     * @type {Number}
     * @default width = 1
     */
    width: 1,
    /**
     * @description Flyline color
     * @type {String}
     * @default color = '#ffde93'
     */
    color: '#ffde93',
    /**
     * @description Orbit color
     * @type {String}
     * @default orbitColor = 'rgba(103, 224, 227, .2)'
     */
    orbitColor: 'rgba(103, 224, 227, .2)',
    /**
     * @description Flyline animation duration
     * @type {[number, number]}
     * @default duration = [20, 30]
     */
    duration: [20, 30],
    /**
     * @description Flyline radius
     * @type {Number}
     * @default radius = 100
     */
    radius: 100
  },
  /**
   * @description Back ground image url
   * @type {String}
   * @default bgImgSrc = ''
   */
  bgImgSrc: '',
  /**
   * @description K value
   * @type {Number}
   * @default k = -0.5
   * @example k = -1 ~ 1
   */
  k: -0.5,
  /**
   * @description Flyline curvature
   * @type {Number}
   * @default curvature = 5
   */
  curvature: 5,
  /**
   * @description Relative points position
   * @type {Boolean}
   * @default relative = true
   */
  relative: true
}
const flylines: any = ref([])
const flylineLengths: any = ref([])
const flylinePoints: any = ref([])
const mergedConfig: any = ref()

const style = computed(() => {
  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundImage: `url(${mergedConfig.value ? mergedConfig.value.bgImgSrc : ''})`
  }
})

watch(
  () => props.config,
  () => {
    calcData()
  }
)

onMounted(() => {
  calcData()
})

const calcData = async () => {
  mergeConfig()
  calcflylinePoints()
  calcLinePaths()
  await calcLineLengths()
}

const mergeConfig = () => {
  const _mergedConfig = deepMerge(deepClone(defaultConfig, true), props.config || {})

  const { points, lines, halo, text, icon, line } = _mergedConfig

  _mergedConfig.points = points.map((item: any) => {
    item.halo = deepMerge(deepClone(halo, true), item.halo || {})
    item.text = deepMerge(deepClone(text, true), item.text || {})
    item.icon = deepMerge(deepClone(icon, true), item.icon || {})

    return item
  })

  _mergedConfig.lines = lines.map((item: any) => {
    return deepMerge(deepClone(line, true), item)
  })

  mergedConfig.value = _mergedConfig
}

const calcflylinePoints = () => {
  const { relative, points } = mergedConfig.value
  const { width, height } = props

  flylinePoints.value = points.map((item: any, i: any) => {
    const {
      coordinate: [x, y],
      halo,
      icon,
      text
    } = item

    if (relative) item.coordinate = [x * width, y * height]

    item.halo.time = randomExtend(halo.duration[0], halo.duration[1]) / 10

    const { width: iw, height: ih } = icon
    item.icon.x = item.coordinate[0] - iw / 2
    item.icon.y = item.coordinate[1] - ih / 2

    const [ox, oy] = text.offset
    item.text.x = item.coordinate[0] + ox
    item.text.y = item.coordinate[1] + oy

    item.key = `${item.coordinate.toString()}${i}`

    return item
  })
}
const calcLinePaths = () => {
  const { points, lines } = mergedConfig.value

  flylines.value = lines.map((item: any) => {
    const { source, target, duration } = item

    const sourcePoint = points.find((it: any) => it.name === source).coordinate
    const targetPoint = points.find((it: any) => it.name === target).coordinate

    const path = getPath(sourcePoint, targetPoint).map((item: any) =>
      item.map((v: any) => parseFloat(v.toFixed(10)))
    )
    const d = `M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`
    const key = `path${path.toString()}`

    const time = randomExtend(duration[0], duration[1]) / 10

    return { ...item, path, key, d, time }
  })
}
const getPath = (start: any, end: any) => {
  const controlPoint = getControlPoint(start, end)

  return [start, controlPoint, end]
}
const getControlPoint = (start: any, end: any) => {
  const [sx, sy] = start,
    [ex, ey] = end

  const { curvature, k } = mergedConfig.value

  const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2]

  const distance = getPointDistance([sx, sy], [ex, ey])

  const targetLength = distance / curvature
  const disDived = targetLength / 2

  let [dx, dy] = [mx, my]

  do {
    dx += disDived
    dy = getKLinePointByx(k, [mx, my], dx)[1]
  } while (getPointDistance([mx, my], [dx, dy]) < targetLength)

  return [dx, dy]
}
const getKLinePointByx = (k: any, data: any, x: any) => {
  const [lx, ly] = data
  const y = ly - k * lx + k * x

  return [x, y]
}
const calcLineLengths = async () => {
  await nextTick()

  flylineLengths.value = flylines.value.map((item: any) => {
    const { key } = item
    return instance.refs[key][0].getTotalLength()
  })
}
const consoleClickPos = (e: any) => {
  const { offsetX, offsetY } = e
  const { width, height, dev } = props

  if (!dev) return

  const relativeX = (offsetX / width).toFixed(2)
  const relativeY = (offsetY / height).toFixed(2)

  console.warn(
    `dv-flyline-chart-enhanced DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`
  )
}
</script>

<style lang="scss" scoped>
.zp-flyline-chart-enhanced {
  display: flex;
  flex-direction: column;
  background-size: 100% 100%;

  text {
    text-anchor: middle;
    dominant-baseline: middle;
  }
}
</style>

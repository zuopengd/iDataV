import ZpBorderBox100 from './ZpBorderBox100.vue'
import ZpCharts from './ZpCharts.vue'
import ZpDigitalFlop from './ZpDigitalFlop.vue'
import ZpDigitalFlopEnhanced from './ZpDigitalFlopEnhanced.vue'
import ZpFlylineChartEnhanced from './ZpFlylineChartEnhanced.vue'
import ZpFullScreenContainer from './ZpFullScreenContainer.vue'
import ZpScrollBoard from './ZpScrollBoard.vue'

export default {
  install(app: any) {
    app.component('zp-full-screen-container', ZpFullScreenContainer)

    app.component('zp-border-box-100', ZpBorderBox100)
    app.component('zp-charts', ZpCharts)
    app.component('zp-digital-flop', ZpDigitalFlop)
    app.component('zp-digital-flop-enhanced', ZpDigitalFlopEnhanced)
    app.component('zp-flyline-chart-enhanced', ZpFlylineChartEnhanced)
    app.component('zp-scroll-board', ZpScrollBoard)
  }
}

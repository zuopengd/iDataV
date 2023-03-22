import type { App } from 'vue'
import components from './src/components'

export default {
  install(app: App) {
    app.use(components)
  }
}

/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'

export function registerPlugins (app) {
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
      }
    }
  })

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueQueryPlugin, { queryClient })
}

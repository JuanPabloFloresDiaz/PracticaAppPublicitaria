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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export function registerPlugins(app) {

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
    .component('QuillEditor', QuillEditor)
}

/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Colores basados en el logo morado de Publicate
const customTheme = {
  light: {
    colors: {
      primary: '#7C3AED', // Morado principal del logo
      'primary-darken-1': '#6D28D9',
      'primary-lighten-1': '#8B5CF6',
      secondary: '#EC4899', // Rosa complementario
      'secondary-darken-1': '#DB2777',
      accent: '#F59E0B', // Amarillo/naranja para acentos
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
      success: '#10B981',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      'surface-variant': '#F3F4F6',
      'on-surface': '#1F2937',
      'on-surface-variant': '#6B7280',
      'surface-bright': '#FFFFFF',
      'surface-light': '#F9FAFB',
      'surface-container': '#F3F4F6',
      'surface-container-high': '#E5E7EB',
      'surface-container-highest': '#D1D5DB'
    }
  },
  dark: {
    colors: {
      primary: '#8B5CF6', // Morado más claro para tema oscuro
      'primary-darken-1': '#7C3AED',
      'primary-lighten-1': '#A78BFA',
      secondary: '#F472B6', // Rosa más claro
      'secondary-darken-1': '#EC4899',
      accent: '#FBBF24',
      error: '#F87171',
      warning: '#FBBF24',
      info: '#60A5FA',
      success: '#34D399',
      background: '#0F172A',
      surface: '#1E293B',
      'surface-variant': '#334155',
      'on-surface': '#F1F5F9',
      'on-surface-variant': '#CBD5E1',
      'surface-bright': '#334155',
      'surface-light': '#1E293B',
      'surface-container': '#334155',
      'surface-container-high': '#475569',
      'surface-container-highest': '#64748B'
    }
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: customTheme,
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 5,
      darken: 5
    }
  },
  defaults: {
    VCard: {
      elevation: 2,
      rounded: 'lg'
    },
    VBtn: {
      rounded: 'lg',
      style: 'text-transform: none; font-weight: 500;'
    },
    VChip: {
      rounded: 'lg'
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'lg'
    },
    VSelect: {
      variant: 'outlined',
      rounded: 'lg'
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 'lg'
    },
    VAutocomplete: {
      variant: 'outlined',
      rounded: 'lg'
    },
    VCombobox: {
      variant: 'outlined',
      rounded: 'lg'
    }
  }
})

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :color="$vuetify.theme.current.dark ? 'surface-container' : 'surface-light'"
      width="280"
    >
      <!-- Header del drawer con logo -->
      <v-card 
        :color="$vuetify.theme.current.dark ? 'surface-container-high' : 'surface-bright'"
        class="ma-2 mb-4 text-center"
        elevation="1"
      >
        <v-card-text class="pa-4">
          <v-avatar size="60" class="mb-3" color="primary-lighten-1">
            <v-img src="@/assets/publicate.avif" alt="Publicate Logo" />
          </v-avatar>
          <div class="text-h6 font-weight-bold text-primary mb-1">Publicate</div>
          <div class="text-caption text-on-surface-variant">Panel de Control</div>
        </v-card-text>
      </v-card>
      
      <!-- Navigation items -->
      <v-list density="comfortable" nav class="pa-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          :to="{ name: '/' }"
          rounded="xl"
          class="mb-2 mx-2"
          color="primary"
        />
        
        <v-list-item
          prepend-icon="mdi-bullhorn"
          title="Campañas"
          value="campaigns"
          :to="{ name: '/Campaigns' }"
          rounded="xl"
          class="mb-2 mx-2"
          color="primary"
        />
        
        <v-list-item
          prepend-icon="mdi-newspaper"
          title="Noticias"
          value="news"
          :to="{ name: '/News' }"
          rounded="xl"
          class="mb-2 mx-2"
          color="primary"
        />
      </v-list>
      
      <!-- Footer del drawer -->
      <template #append>
        <v-divider class="mx-4 mb-4" color="primary" opacity="0.3" />
        <div class="pa-4 text-center">
          <v-chip 
            size="small" 
            color="primary" 
            variant="tonal"
            prepend-icon="mdi-information"
          >
            Versión 1.0.0
          </v-chip>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      elevation="2"
      :color="$vuetify.theme.current.dark ? 'surface-container-high' : 'surface'"
      height="70"
    >
      <v-btn 
        @click="drawer = !drawer" 
        icon="mdi-menu"
        variant="text"
        color="primary"
        class="mr-2"
      />
      
      <v-toolbar-title class="d-flex align-center">
        <div>
          <div class="text-primary font-weight-bold text-h5">Publicate</div>
          <div class="text-caption text-on-surface-variant">Sistema de Gestión de campañas publicitarias</div>
        </div>
      </v-toolbar-title>
      
      <v-spacer />
      
      <!-- Botones de acción -->
      <div class="d-flex align-center ga-2">
        <v-btn 
          icon="mdi-bell-outline" 
          variant="text"
          color="on-surface-variant"
        />
        
        <v-btn 
          icon="mdi-theme-light-dark" 
          @click="toggleTheme"
          variant="text"
          color="primary"
        />
        
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
            >
              <v-avatar size="32" color="primary">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card min-width="200">
            <v-list>
              <v-list-item 
                prepend-icon="mdi-account-circle"
                title="Mi Perfil"
              />
              <v-list-item 
                prepend-icon="mdi-cog"
                title="Configuración"
              />
              <v-divider />
              <v-list-item 
                prepend-icon="mdi-logout"
                title="Cerrar Sesión"
              />
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main :style="{ 
      background: $vuetify.theme.current.dark 
        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(30, 41, 59, 1) 100%)' 
        : 'linear-gradient(135deg, rgba(124, 58, 237, 0.02) 0%, rgba(250, 250, 250, 1) 100%)'
    }">
      <v-container fluid class="pa-6">
        <RouterView />
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import AppFooter from '@/components/AppFooter.vue'

const drawer = ref(true)
const theme = useTheme()

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <div class="news-detail-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <v-container class="fill-height d-flex align-center justify-center">
        <div class="text-center">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="mt-4 text-h6">Cargando noticia...</p>
        </div>
      </v-container>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-container class="fill-height d-flex align-center justify-center">
        <div class="text-center">
          <v-avatar size="100" color="error" class="mb-4">
            <v-icon color="white" size="50">mdi-alert-circle</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold mb-2">Error al cargar la noticia</h1>
          <p class="text-body-1 text-on-surface-variant mb-6">
            No se pudo encontrar la noticia solicitada
          </p>
          <div class="d-flex justify-center ga-3">
            <v-btn color="primary" variant="flat" @click="refetch">
              <v-icon start>mdi-refresh</v-icon>
              Reintentar
            </v-btn>
            <v-btn variant="outlined" @click="goBack">
              <v-icon start>mdi-arrow-left</v-icon>
              Volver
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Content -->
    <div v-else-if="newsData" class="news-content">
      <!-- Hero Section -->
      <div v-if="newsData.hero_image" class="hero-section">
        <v-img
          :src="newsData.hero_image"
          height="60rem"
          cover
          class="hero-image"
        >
          <template v-slot:error>
            <div class="d-flex align-center justify-center fill-height bg-surface-variant">
              <v-icon color="on-surface-variant" size="64">mdi-image-broken-variant</v-icon>
            </div>
          </template>
          
          <!-- Hero Overlay -->
          <div class="hero-overlay d-flex flex-column">
            <!-- Navigation Bar -->
            <div class="hero-nav pa-6">
              <div class="d-flex justify-space-between align-center">
                <v-btn
                  icon="mdi-arrow-left"
                  variant="elevated"
                  color="surface"
                  @click="goBack"
                />
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-pencil"
                    variant="elevated"
                    color="primary"
                    @click="editNews"
                  />
                  <v-btn
                    icon="mdi-delete"
                    variant="elevated"
                    color="error"
                    @click="deleteNews"
                  />
                </div>
              </div>
            </div>
            
            <!-- Hero Content -->
            <v-spacer />
            <div class="hero-content pa-8">
              <v-container max-width="1200">
                <div class="text-center text-white">
                  <v-chip
                    :color="newsData.is_public ? 'success' : 'warning'"
                    variant="flat"
                    size="large"
                    :prepend-icon="newsData.is_public ? 'mdi-earth' : 'mdi-lock'"
                    class="mb-4"
                  >
                    {{ newsData.is_public ? 'Público' : 'Privado' }}
                  </v-chip>
                  
                  <h1 class="text-h2 font-weight-bold mb-4">
                    {{ newsData.title }}
                  </h1>
                  
                  <p v-if="newsData.subtitle" class="text-h5 mb-6 font-weight-light">
                    {{ newsData.subtitle }}
                  </p>
                  
                  <div class="d-flex justify-center flex-wrap ga-3 mb-4">
                    <v-chip
                      color="primary"
                      variant="flat"
                      prepend-icon="mdi-bullhorn"
                      size="large"
                    >
                      {{ newsData.campaign?.name || 'Sin campaña' }}
                    </v-chip>
                    
                    <v-chip
                      v-if="newsData.author"
                      color="info"
                      variant="flat"
                      prepend-icon="mdi-account"
                      size="large"
                    >
                      {{ newsData.author }}
                    </v-chip>
                    
                    <v-chip
                      color="surface"
                      variant="flat"
                      prepend-icon="mdi-calendar"
                      size="large"
                    >
                      {{ formatDate(newsData.created_at) }}
                    </v-chip>
                  </div>
                </div>
              </v-container>
            </div>
          </div>
        </v-img>
      </div>

      <!-- Navigation Bar (cuando no hay hero image) -->
      <div v-else>
        <v-card 
          class="top-nav"
          :color="$vuetify.theme.current.dark ? 'surface-container' : 'surface'"
          elevation="1"
        >
          <v-card-text class="pa-4">
            <v-container max-width="1200">
              <div class="d-flex justify-space-between align-center">
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-arrow-left"
                  @click="goBack"
                  color="primary"
                >
                  Volver
                </v-btn>
                <div class="d-flex ga-2">
                  <v-btn
                    variant="outlined"
                    prepend-icon="mdi-pencil"
                    color="primary"
                    @click="editNews"
                  >
                    Editar
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    prepend-icon="mdi-delete"
                    color="error"
                    @click="deleteNews"
                  >
                    Eliminar
                  </v-btn>
                </div>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <v-container max-width="1200" class="py-8">
          <!-- Header (cuando no hay hero image) -->
          <div v-if="!newsData.hero_image" class="content-header mb-8">
            <v-card 
              :color="$vuetify.theme.current.dark ? 'surface-container-high' : 'surface-bright'"
              elevation="2"
              class="text-center mb-6"
            >
              <v-card-text class="pa-8">
                <v-chip
                  :color="newsData.is_public ? 'success' : 'warning'"
                  variant="flat"
                  size="large"
                  :prepend-icon="newsData.is_public ? 'mdi-earth' : 'mdi-lock'"
                  class="mb-4"
                >
                  {{ newsData.is_public ? 'Público' : 'Privado' }}
                </v-chip>
                
                <h1 class="text-h2 font-weight-bold text-primary mb-4">
                  {{ newsData.title }}
                </h1>
                
                <p v-if="newsData.subtitle" class="text-h5 text-on-surface-variant mb-6">
                  {{ newsData.subtitle }}
                </p>
                
                <div class="d-flex justify-center flex-wrap ga-3">
                  <v-chip
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-bullhorn"
                    size="large"
                  >
                    {{ newsData.campaign?.name || 'Sin campaña' }}
                  </v-chip>
                  
                  <v-chip
                    v-if="newsData.author"
                    color="info"
                    variant="outlined"
                    prepend-icon="mdi-account"
                    size="large"
                  >
                    {{ newsData.author }}
                  </v-chip>
                  
                  <v-chip
                    color="surface-variant"
                    variant="outlined"
                    prepend-icon="mdi-calendar"
                    size="large"
                  >
                    {{ formatDate(newsData.created_at) }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-row>
            <!-- Main Article Content -->
            <v-col cols="12" lg="8">
              <!-- Thumbnail (cuando no hay hero image) -->
              <div v-if="newsData.thumbnail && !newsData.hero_image" class="mb-8">
                <v-card elevation="4" class="overflow-hidden">
                  <v-img
                    :src="newsData.thumbnail"
                    max-height="400"
                    cover
                  >
                    <template v-slot:error>
                      <div class="d-flex align-center justify-center fill-height bg-surface-variant">
                        <v-icon color="on-surface-variant" size="48">mdi-image-broken-variant</v-icon>
                      </div>
                    </template>
                  </v-img>
                </v-card>
              </div>

              <!-- Tags Section -->
              <div v-if="newsData.tags && Array.isArray(newsData.tags) && newsData.tags.length > 0" class="mb-6">
                <v-card 
                  variant="tonal" 
                  color="primary"
                  elevation="1"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center mb-3">
                      <v-avatar size="28" color="primary" class="mr-3">
                        <v-icon color="white" size="16">mdi-tag</v-icon>
                      </v-avatar>
                      <span class="text-h6 font-weight-bold text-primary">Etiquetas</span>
                    </div>
                    <div class="d-flex flex-wrap ga-2">
                      <v-chip
                        v-for="(tag, index) in newsData.tags"
                        :key="index"
                        size="default"
                        variant="outlined"
                        color="primary"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Article Content -->
              <v-card elevation="2" class="mb-6">
                <v-card-title class="pa-6 pb-4">
                  <div class="d-flex align-center">
                    <v-avatar size="40" color="primary" class="mr-4">
                      <v-icon color="white" size="20">mdi-text</v-icon>
                    </v-avatar>
                    <h2 class="text-h4 font-weight-bold text-primary">
                      Contenido del artículo
                    </h2>
                  </div>
                </v-card-title>
                
                <v-divider />
                
                <v-card-text class="pa-6">
                  <div 
                    class="rich-text-content"
                    v-html="newsData.content"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sidebar -->
            <v-col cols="12" lg="4">
              <!-- Article Info -->
              <v-card elevation="2" class="mb-6 sticky-sidebar">
                <v-card-title class="pa-4">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="info" class="mr-3">
                      <v-icon color="white" size="16">mdi-information</v-icon>
                    </v-avatar>
                    <span class="text-h6 font-weight-bold">Información del artículo</span>
                  </div>
                </v-card-title>
                
                <v-divider />
                
                <v-card-text class="pa-4">
                  <v-list density="compact" class="bg-transparent">
                    <v-list-item class="px-0 mb-2">
                      <v-list-item-title class="text-caption text-on-surface-variant mb-1">
                        ID del artículo
                      </v-list-item-title>
                      <v-list-item-subtitle class="font-family-monospace text-body-2">
                        {{ newsData.id }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item class="px-0 mb-2">
                      <v-list-item-title class="text-caption text-on-surface-variant mb-1">
                        Fecha de creación
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-body-2">
                        {{ formatFullDate(newsData.created_at) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item 
                      v-if="newsData.updated_at !== newsData.created_at" 
                      class="px-0 mb-2"
                    >
                      <v-list-item-title class="text-caption text-on-surface-variant mb-1">
                        Última actualización
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-body-2">
                        {{ formatFullDate(newsData.updated_at) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item class="px-0 mb-2">
                      <v-list-item-title class="text-caption text-on-surface-variant mb-1">
                        Longitud del contenido
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-body-2">
                        {{ contentLength }} caracteres
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item v-if="newsData.thumbnail" class="px-0 mb-2">
                      <v-list-item-title class="text-caption text-on-surface-variant mb-1">
                        Imagen miniatura
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <a 
                          :href="newsData.thumbnail" 
                          target="_blank" 
                          class="text-primary text-decoration-none text-body-2"
                        >
                          Ver imagen completa
                          <v-icon size="14" class="ml-1">mdi-open-in-new</v-icon>
                        </a>
                      </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item v-if="newsData.hero_image" class="px-0">
                      <v-list-item-title class="text-caption text-on-surface-variant mb-1">
                        Imagen principal
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <a 
                          :href="newsData.hero_image" 
                          target="_blank" 
                          class="text-primary text-decoration-none text-body-2"
                        >
                          Ver imagen completa
                          <v-icon size="14" class="ml-1">mdi-open-in-new</v-icon>
                        </a>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>

              <!-- Campaign Info - CORREGIDO AQUÍ -->
              <v-card v-if="newsData.campaign" elevation="2" class="mb-6">
                <v-card-title class="pa-4">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="primary" class="mr-3">
                      <v-icon color="white" size="16">mdi-bullhorn</v-icon>
                    </v-avatar>
                    <span class="text-h6 font-weight-bold">Campaña relacionada</span>
                  </div>
                </v-card-title>
                
                <v-divider />
                
                <v-card-text class="pa-4">
                  <div class="text-center mb-4">
                    <v-avatar size="48" color="primary-lighten-1" class="mb-3">
                      <v-icon color="white" size="24">mdi-bullhorn</v-icon>
                    </v-avatar>
                    <h3 class="text-h6 font-weight-bold text-primary mb-2">
                      {{ newsData.campaign.name }}
                    </h3>
                  </div>
                  
                  <!-- AQUÍ ESTÁ LA CORRECCIÓN: Usar v-html en lugar de {{ }} -->
                  <div v-if="newsData.campaign.description" class="mb-4">
                    <div class="text-caption text-on-surface-variant mb-2">
                      <v-icon size="14" class="mr-1">mdi-text-box</v-icon>
                      Descripción:
                    </div>
                    <v-card 
                      variant="tonal" 
                      color="primary"
                      class="mb-3"
                    >
                      <v-card-text class="pa-3">
                        <div 
                          class="campaign-description-content text-body-2"
                          v-html="newsData.campaign.description"
                        />
                      </v-card-text>
                    </v-card>
                  </div>
                  
                  <!-- Información adicional de la campaña -->
                  <div class="mb-4">
                    <v-list density="compact" class="bg-transparent">
                      <v-list-item v-if="newsData.campaign.budget" class="px-0">
                        <v-list-item-title class="text-caption text-on-surface-variant">
                          Presupuesto
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <v-chip 
                            color="success" 
                            variant="tonal" 
                            size="small"
                            prepend-icon="mdi-currency-usd"
                          >
                            ${{ formatCurrency(newsData.campaign.budget) }}
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item v-if="newsData.campaign.start_date" class="px-0">
                        <v-list-item-title class="text-caption text-on-surface-variant">
                          Fecha de inicio
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-body-2">
                          {{ formatDate(newsData.campaign.start_date) }}
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item v-if="newsData.campaign.end_date" class="px-0">
                        <v-list-item-title class="text-caption text-on-surface-variant">
                          Fecha de finalización
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-body-2">
                          {{ formatDate(newsData.campaign.end_date) }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                  
                  <div class="text-center">
                    <v-btn
                      variant="outlined"
                      color="primary"
                      prepend-icon="mdi-open-in-new"
                      size="small"
                      @click="viewCampaign"
                    >
                      Ver campaña completa
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Actions -->
              <v-card elevation="2">
                <v-card-title class="pa-4">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="warning" class="mr-3">
                      <v-icon color="white" size="16">mdi-cog</v-icon>
                    </v-avatar>
                    <span class="text-h6 font-weight-bold">Acciones</span>
                  </div>
                </v-card-title>
                
                <v-divider />
                
                <v-card-text class="pa-4">
                  <div class="d-flex flex-column ga-3">
                    <v-btn
                      variant="outlined"
                      color="primary"
                      prepend-icon="mdi-pencil"
                      @click="editNews"
                      block
                    >
                      Editar noticia
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      color="error"
                      prepend-icon="mdi-delete"
                      @click="deleteNews"
                      block
                    >
                      Eliminar noticia
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      color="info"
                      prepend-icon="mdi-share"
                      @click="shareNews"
                      block
                    >
                      Compartir
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getCampaignNewsById } from '@/services/campaigns_news.service'
import { fireToast } from '@/plugins/sweetalert2'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const newsId = computed(() => route.params.id)

// Query para obtener la noticia
const {
  data: newsData,
  isLoading,
  error,
  refetch
} = useQuery({
  queryKey: ['campaign-news-detail', newsId],
  queryFn: () => getCampaignNewsById(newsId.value),
  enabled: computed(() => !!newsId.value)
})

// Computed
const contentLength = computed(() => {
  if (!newsData.value?.content) return 0
  // Remover tags HTML para contar solo el texto
  const textContent = newsData.value.content.replace(/<[^>]*>/g, '')
  return textContent.length
})

// Methods
const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const formatFullDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY [a las] HH:mm:ss')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES').format(amount)
}

const goBack = () => {
  // Si hay un historial previo, volver atrás
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    // Si no, ir al dashboard o a la lista de noticias
    router.push('/news')
  }
}

const editNews = () => {
  // Navegar a la página de edición de noticias con el ID
  router.push({ 
    path: '/news',
    query: { edit: newsData.value.id }
  })
}

const deleteNews = () => {
  // Navegar a la página de gestión con confirmación de eliminación
  router.push({ 
    path: '/news',
    query: { delete: newsData.value.id }
  })
}

const viewCampaign = () => {
  // Navegar a los detalles de la campaña
  router.push({ 
    name: 'CampaignsDetail',
    query: { id: newsData.value.campaign.id }
  })
}

const shareNews = async () => {
  const url = window.location.href
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: newsData.value.title,
        text: newsData.value.subtitle || 'Mira esta noticia',
        url: url
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        fallbackShare(url)
      }
    }
  } else {
    fallbackShare(url)
  }
}

const fallbackShare = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    fireToast({
      icon: 'success',
      title: 'Enlace copiado al portapapeles'
    })
  } catch (error) {
    fireToast({
      icon: 'info',
      title: 'Enlace: ' + url
    })
  }
}

// Meta tags para SEO
onMounted(() => {
  if (newsData.value) {
    document.title = `${newsData.value.title} - Publicate`
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', newsData.value.subtitle || 'Noticia de campaña publicitaria')
    }
  }
})
</script>

<style scoped>
.news-detail-page {
  min-height: 100vh;
}

.loading-container,
.error-container {
  min-height: 100vh;
}

.hero-section {
  position: relative;
  height: 60rem;
  min-height: 500px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

.hero-nav {
  flex-shrink: 0;
}

.hero-content {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
}

.sticky-sidebar {
  position: sticky;
  top: 24px;
}

/* Estilos para contenido de texto enriquecido del artículo */
:deep(.rich-text-content) {
  line-height: 1.8;
  font-size: 18px;
  color: rgb(var(--v-theme-on-surface));
}

:deep(.rich-text-content p) {
  margin-bottom: 20px;
}

:deep(.rich-text-content p:last-child) {
  margin-bottom: 0;
}

:deep(.rich-text-content h1),
:deep(.rich-text-content h2),
:deep(.rich-text-content h3),
:deep(.rich-text-content h4),
:deep(.rich-text-content h5),
:deep(.rich-text-content h6) {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
  margin-top: 32px;
  font-weight: 600;
  line-height: 1.3;
}

:deep(.rich-text-content h1:first-child),
:deep(.rich-text-content h2:first-child),
:deep(.rich-text-content h3:first-child) {
  margin-top: 0;
}

:deep(.rich-text-content h1) { font-size: 2.2em; }
:deep(.rich-text-content h2) { font-size: 1.9em; }
:deep(.rich-text-content h3) { font-size: 1.6em; }
:deep(.rich-text-content h4) { font-size: 1.3em; }

:deep(.rich-text-content strong) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

:deep(.rich-text-content em) {
  font-style: italic;
  color: rgb(var(--v-theme-on-surface-variant));
}

:deep(.rich-text-content img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 24px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.rich-text-content a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  word-break: break-word;
  transition: color 0.2s ease;
}

:deep(.rich-text-content a:hover) {
  text-decoration: none;
  color: rgb(var(--v-theme-primary-darken-1));
}

:deep(.rich-text-content ul),
:deep(.rich-text-content ol) {
  padding-left: 32px;
  margin-bottom: 20px;
}

:deep(.rich-text-content li) {
  margin-bottom: 8px;
  line-height: 1.7;
}

:deep(.rich-text-content blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding: 20px 24px;
  margin: 24px 0;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 0 12px 12px 0;
  font-style: italic;
  position: relative;
  font-size: 1.1em;
}

:deep(.rich-text-content blockquote::before) {
  content: '"';
  font-size: 4em;
  color: rgba(var(--v-theme-primary), 0.2);
  position: absolute;
  top: -10px;
  left: 15px;
  font-family: serif;
  line-height: 1;
}

:deep(.rich-text-content code) {
  background: rgba(var(--v-theme-surface-variant), 0.6);
  padding: 3px 8px;
  border-radius: 6px;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.9em;
  color: rgb(var(--v-theme-primary));
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
}

:deep(.rich-text-content pre) {
  background: rgba(var(--v-theme-surface-variant), 0.4);
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 24px 0;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.rich-text-content pre code) {
  background: none;
  padding: 0;
  border: none;
}

:deep(.rich-text-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.rich-text-content th),
:deep(.rich-text-content td) {
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  padding: 16px;
  text-align: left;
}

:deep(.rich-text-content th) {
  background: rgba(var(--v-theme-primary), 0.1);
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

:deep(.rich-text-content tr:nth-child(even)) {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

/* Estilos específicos para la descripción de la campaña */
:deep(.campaign-description-content) {
  line-height: 1.6;
  font-size: 14px;
}

:deep(.campaign-description-content p) {
  margin-bottom: 12px;
}

:deep(.campaign-description-content p:last-child) {
  margin-bottom: 0;
}

:deep(.campaign-description-content strong) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

:deep(.campaign-description-content em) {
  font-style: italic;
  color: rgb(var(--v-theme-on-surface-variant));
}

:deep(.campaign-description-content img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.campaign-description-content a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  word-break: break-word;
}

:deep(.campaign-description-content ul),
:deep(.campaign-description-content ol) {
  padding-left: 20px;
  margin-bottom: 12px;
}

:deep(.campaign-description-content li) {
  margin-bottom: 4px;
  line-height: 1.5;
}

:deep(.campaign-description-content h1),
:deep(.campaign-description-content h2),
:deep(.campaign-description-content h3) {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
  margin-top: 12px;
  font-weight: 600;
}

:deep(.campaign-description-content h1) { font-size: 1.2em; }
:deep(.campaign-description-content h2) { font-size: 1.1em; }
:deep(.campaign-description-content h3) { font-size: 1.05em; }

@media (max-width: 960px) {
  .hero-section {
    height: 50vh;
    min-height: 400px;
  }
  
  .hero-content {
    padding: 24px !important;
  }
  
  .hero-content h1 {
    font-size: 2rem !important;
  }
  
  .hero-content p {
    font-size: 1.2rem !important;
  }
  
  .sticky-sidebar {
    position: static;
  }
  
  :deep(.rich-text-content) {
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .hero-content h1 {
    font-size: 1.75rem !important;
  }
  
  .hero-content p {
    font-size: 1.1rem !important;
  }
  
  :deep(.rich-text-content h1) { font-size: 1.8em; }
  :deep(.rich-text-content h2) { font-size: 1.6em; }
  :deep(.rich-text-content h3) { font-size: 1.4em; }
}
</style>
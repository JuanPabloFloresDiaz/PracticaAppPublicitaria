<template>
  <v-container class="fill-height dashboard-container" max-width="1400">
    <div class="w-100">
      <!-- Header mejorado -->
      <v-card 
        :color="$vuetify.theme.current.dark ? 'surface-container-high' : 'surface-bright'"
        class="mb-8"
        elevation="2"
      >
        <v-card-text class="pa-6 text-center">
          <div class="d-flex align-center justify-center mb-4">
            <v-avatar size="80" class="mr-4">
              <v-img src="@/assets/publicate.avif" alt="Publicate Logo" />
            </v-avatar>
            <div>
              <div class="text-h4 font-weight-bold text-primary mb-1">
                Bienvenido a Publicate
              </div>
              <p class="text-h6 text-on-surface-variant">
                Dashboard de Gestión de Campañas
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Campaign Selector mejorado -->
      <v-card 
        class="mb-6" 
        elevation="1"
        :color="$vuetify.theme.current.dark ? 'surface-container' : 'surface'"
      >
        <v-card-text class="pa-6">
          <div class="text-center mb-4">
            <v-icon color="primary" size="32" class="mb-2">mdi-target</v-icon>
            <h3 class="text-h5 font-weight-bold text-primary">
              Selecciona una campaña para ver sus noticias
            </h3>
          </div>
          
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-select
                v-model="selectedCampaignId"
                :items="campaignOptions"
                :loading="campaignsLoading"
                label="Seleccionar Campaña"
                item-title="name"
                item-value="id"
                prepend-inner-icon="mdi-bullhorn"
                variant="outlined"
                clearable
                color="primary"
                @update:model-value="handleCampaignChange"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-avatar size="32" color="primary-lighten-1">
                        <v-icon color="white" size="16">mdi-bullhorn</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                      {{ item.raw.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip 
                        v-if="item.raw.budget" 
                        size="x-small" 
                        color="success" 
                        variant="tonal"
                      >
                        ${{ formatCurrency(item.raw.budget) }}
                      </v-chip>
                      <span v-else class="text-on-surface-variant">Sin presupuesto</span>
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- News Section -->
      <div v-if="selectedCampaignId">
        <!-- Header de noticias -->
        <v-card 
          class="mb-6"
          elevation="1"
          :color="$vuetify.theme.current.dark ? 'surface-container' : 'surface'"
        >
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-avatar size="40" color="primary-lighten-1" class="mr-3">
                  <v-icon color="white" size="20">mdi-newspaper</v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h5 font-weight-bold text-primary">
                    Noticias de la Campaña
                  </h2>
                  <p class="text-body-2 text-on-surface-variant">
                    {{ selectedCampaignName }}
                  </p>
                </div>
              </div>
              <v-chip
                :color="newsData?.length > 0 ? 'success' : 'surface-variant'"
                variant="tonal"
                prepend-icon="mdi-newspaper"
                size="default"
              >
                {{ newsData?.length || 0 }} noticias
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Loading State -->
        <v-card v-if="newsLoading" class="text-center py-12" elevation="1">
          <v-card-text>
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-h6">Cargando noticias...</p>
          </v-card-text>
        </v-card>

        <!-- Error State -->
        <v-card v-else-if="newsError" class="text-center py-12" elevation="1">
          <v-card-text>
            <v-avatar size="80" color="error" class="mb-4">
              <v-icon color="white" size="40">mdi-alert-circle</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">Error al cargar las noticias</h3>
            <p class="text-body-1 text-on-surface-variant">
              Intenta recargar la página o selecciona otra campaña
            </p>
          </v-card-text>
        </v-card>

        <!-- Empty State -->
        <v-card v-else-if="!newsData?.length" class="text-center py-12" elevation="1">
          <v-card-text>
            <v-avatar size="80" color="primary-lighten-1" class="mb-4">
              <v-icon color="white" size="40">mdi-newspaper-variant-outline</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">No hay noticias disponibles</h3>
            <p class="text-body-1 text-on-surface-variant mb-4">
              Esta campaña aún no tiene noticias publicadas
            </p>
            <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus">
              Crear primera noticia
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- News Grid -->
        <div v-else>
          <v-row>
            <v-col 
              v-for="item in newsData" 
              :key="item.id"
              cols="12"
              lg="6"
            >
              <v-card 
                elevation="2" 
                class="news-card h-100"
                :color="$vuetify.theme.current.dark ? 'surface-container' : 'surface'"
                @click="viewNewsDetail(item)"
                style="cursor: pointer;"
              >
                <!-- Header de la noticia -->
                <v-card-title class="pa-4 pb-2">
                  <div class="d-flex justify-space-between align-start w-100">
                    <div class="flex-grow-1 mr-3">
                      <h3 class="text-h6 font-weight-bold text-primary line-clamp-2">
                        {{ item.title }}
                      </h3>
                      <p v-if="item.subtitle" class="text-body-2 text-on-surface-variant mt-1 line-clamp-1">
                        {{ item.subtitle }}
                      </p>
                    </div>
                    <v-chip
                      :color="item.is_public ? 'success' : 'warning'"
                      size="small"
                      variant="flat"
                      :prepend-icon="item.is_public ? 'mdi-earth' : 'mdi-lock'"
                    >
                      {{ item.is_public ? 'Público' : 'Privado' }}
                    </v-chip>
                  </div>
                </v-card-title>

                <!-- Imagen si existe -->
                <div v-if="item.thumbnail" class="px-4">
                  <v-img
                    :src="item.thumbnail"
                    height="400"
                    cover
                    class="rounded-lg"
                  >
                    <template #error>
                      <div class="d-flex align-center justify-center fill-height bg-surface-variant">
                        <v-icon color="on-surface-variant" size="48">mdi-image-broken-variant</v-icon>
                      </div>
                    </template>
                  </v-img>
                </div>

                <!-- Contenido -->
                <v-card-text class="pa-4">
                  <!-- Contenido HTML renderizado -->
                  <div 
                    class="rich-text-content text-body-2 mb-4"
                    v-html="item.content"
                  />
                  
                  <!-- Tags si existen -->
                  <div v-if="item.tags && Array.isArray(item.tags) && item.tags.length > 0" class="mb-4">
                    <div class="text-caption text-on-surface-variant mb-2">
                      <v-icon size="14" class="mr-1">mdi-tag</v-icon>
                      Etiquetas:
                    </div>
                    <div class="d-flex flex-wrap ga-1">
                      <v-chip
                        v-for="(tag, index) in item.tags.slice(0, 3)"
                        :key="index"
                        size="x-small"
                        variant="outlined"
                        color="primary"
                      >
                        {{ tag }}
                      </v-chip>
                      <v-chip
                        v-if="item.tags.length > 3"
                        size="x-small"
                        variant="outlined"
                        color="grey"
                      >
                        +{{ item.tags.length - 3 }}
                      </v-chip>
                    </div>
                  </div>
                  
                  <!-- Footer de la noticia -->
                  <v-divider class="mb-3" />
                  <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                      <v-avatar size="24" color="primary-lighten-1" class="mr-2">
                        <v-icon color="white" size="12">mdi-account</v-icon>
                      </v-avatar>
                      <span class="text-caption text-on-surface-variant">
                        {{ item.author || 'Sin autor' }}
                      </span>
                    </div>
                    <v-chip 
                      size="x-small" 
                      variant="outlined"
                      prepend-icon="mdi-calendar"
                    >
                      {{ formatDate(item.created_at) }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- Welcome State mejorado -->
      <div v-else>
        <!-- Estadísticas generales -->
        <v-row class="mb-6">
          <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
            <v-card 
              variant="tonal" 
              :color="stat.color"
              class="text-center h-100"
              elevation="1"
            >
              <v-card-text class="pa-6">
                <v-icon :color="stat.color" size="48" class="mb-3">
                  {{ stat.icon }}
                </v-icon>
                <div class="text-h4 font-weight-bold mb-1">{{ stat.value }}</div>
                <div class="text-body-1 font-weight-medium">{{ stat.title }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Call to action -->
        <v-card 
          variant="tonal" 
          color="primary"
          class="text-center"
          elevation="2"
        >
          <v-card-text class="pa-8">
            <v-avatar size="100" color="primary" class="mb-4">
              <v-icon color="white" size="50">mdi-chart-line</v-icon>
            </v-avatar>
            <h3 class="text-h4 font-weight-bold text-primary mb-2">
              Dashboard de Campañas
            </h3>
            <p class="text-h6 text-on-surface-variant mb-6">
              Selecciona una campaña arriba para ver sus noticias y estadísticas detalladas
            </p>
            <v-btn 
              color="primary" 
              variant="flat" 
              size="large"
              prepend-icon="mdi-arrow-up"
            >
              Seleccionar Campaña
            </v-btn>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getAllCampaigns, getCampaignNewsByCampaignId } from '@/services/campaigns.service'
import { getAllCampaignNews } from '@/services/campaigns_news.service'
import dayjs from 'dayjs'

const router = useRouter()
const selectedCampaignId = ref(null)

// Query para obtener todas las campañas
const {
  data: campaigns,
  isLoading: campaignsLoading,
  error: campaignsError
} = useQuery({
  queryKey: ['campaigns'],
  queryFn: getAllCampaigns
})

// Query para estadísticas generales
const {
  data: allNews
} = useQuery({
  queryKey: ['all-news'],
  queryFn: getAllCampaignNews
})

// Query para obtener noticias de la campaña seleccionada
const {
  data: newsData,
  isLoading: newsLoading,
  error: newsError,
  refetch: refetchNews
} = useQuery({
  queryKey: ['campaign-news', selectedCampaignId],
  queryFn: () => getCampaignNewsByCampaignId(selectedCampaignId.value),
  enabled: computed(() => !!selectedCampaignId.value)
})

// Opciones para el selector de campañas
const campaignOptions = computed(() => {
  return campaigns.value || []
})

// Nombre de la campaña seleccionada
const selectedCampaignName = computed(() => {
  if (!selectedCampaignId.value || !campaigns.value) return ''
  const campaign = campaigns.value.find(c => c.id === selectedCampaignId.value)
  return campaign?.name || ''
})

// Estadísticas generales
const stats = computed(() => [
  {
    title: 'Total Campañas',
    value: campaigns.value?.length || 0,
    icon: 'mdi-bullhorn',
    color: 'primary'
  },
  {
    title: 'Total Noticias',
    value: allNews.value?.length || 0,
    icon: 'mdi-newspaper',
    color: 'success'
  },
  {
    title: 'Noticias Públicas',
    value: allNews.value?.filter(news => news.is_public).length || 0,
    icon: 'mdi-earth',
    color: 'info'
  },
  {
    title: 'Noticias Privadas',
    value: allNews.value?.filter(news => !news.is_public).length || 0,
    icon: 'mdi-lock',
    color: 'warning'
  }
])

// Methods
const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES').format(amount)
}

const handleCampaignChange = (campaignId) => {
  selectedCampaignId.value = campaignId
  if (campaignId) {
    refetchNews()
  }
}

const viewNewsDetail = (newsItem) => {
  // Navegar a la página de detalle
  router.push(`/NewsDetail/${newsItem.id}`)
}

const handleEditNews = (newsItem) => {
  // Navegar a la página de gestión de noticias con el ID para editar
  router.push({ 
    name: 'news',
    query: { edit: newsItem.id }
  })
}

const handleDeleteNews = (newsItem) => {
  // Navegar a la página de gestión de noticias con confirmación de eliminación
  router.push({ 
    name: 'news',
    query: { delete: newsItem.id }
  })
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.news-card {
  transition: transform 0.2s ease-in-out;
}

.news-card:hover {
  transform: translateY(-2px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilos para contenido de texto enriquecido */
:deep(.rich-text-content) {
  line-height: 1.6;
  max-height: 120px;
  overflow: hidden;
  position: relative;
}

:deep(.rich-text-content p) {
  margin-bottom: 8px;
}

:deep(.rich-text-content strong) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

:deep(.rich-text-content img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 4px 0;
}

:deep(.rich-text-content a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  word-break: break-all;
}

:deep(.rich-text-content ul),
:deep(.rich-text-content ol) {
  padding-left: 16px;
  margin-bottom: 8px;
}

:deep(.rich-text-content li) {
  margin-bottom: 2px;
}

:deep(.rich-text-content h1),
:deep(.rich-text-content h2),
:deep(.rich-text-content h3) {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 4px;
  margin-top: 8px;
}

:deep(.rich-text-content blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding-left: 12px;
  margin: 8px 0;
  font-style: italic;
  background: rgba(var(--v-theme-primary), 0.05);
  padding: 8px 12px;
  border-radius: 0 8px 8px 0;
}
</style>

<template>
  <v-container class="fill-height" max-width="1200">
    <div class="w-100">
      <!-- Header -->
      <div class="mb-8 text-center">
        <div class="text-h5 font-weight-bold mb-n1">Bienvenido a</div>
        <img src="@/assets/Publicate.avif" alt="Publicate Logo" style="height: 200px;" />
        <p class="text-body-1 mt-4">Selecciona una campaña para ver sus noticias</p>
      </div>

      <!-- Campaign Selector -->
      <v-row class="mb-6">
        <v-col cols="12" md="6" offset-md="3">
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
            @update:model-value="handleCampaignChange"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon color="primary">mdi-bullhorn</v-icon>
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>${{ item.raw.budget }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <!-- News Cards -->
      <div v-if="selectedCampaignId">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h4 font-weight-bold">
            Noticias de la Campaña
          </h2>
          <v-chip
            :color="newsData?.length > 0 ? 'success' : 'grey'"
            variant="flat"
          >
            {{ newsData?.length || 0 }} noticias
          </v-chip>
        </div>

        <div v-if="newsLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="mt-4">Cargando noticias...</p>
        </div>

        <div v-else-if="newsError" class="text-center py-8">
          <v-icon color="error" size="64">mdi-alert-circle</v-icon>
          <p class="mt-4 text-error">Error al cargar las noticias</p>
        </div>

        <div v-else-if="!newsData?.length" class="text-center py-8">
          <v-icon color="grey" size="64">mdi-newspaper-variant-outline</v-icon>
          <p class="mt-4 text-grey">No hay noticias para esta campaña</p>
        </div>

        <div v-else>
          <v-virtual-scroll
            :items="newsData"
            :item-height="200"
            height="600"
          >
            <template #default="{ item }">
              <v-card
                class="ma-2"
                elevation="2"
                :ripple="false"
              >
                <v-row no-gutters>
                  <v-col cols="4" v-if="item.thumbnail">
                    <v-img
                      :src="item.thumbnail"
                      height="200"
                      cover
                      class="rounded-s"
                    >
                      <template #error>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-icon color="grey">mdi-image-broken-variant</v-icon>
                        </div>
                      </template>
                    </v-img>
                  </v-col>
                  <v-col :cols="item.thumbnail ? 8 : 12">
                    <v-card-text class="pa-4">
                      <div class="d-flex justify-space-between align-start mb-2">
                        <h3 class="text-h6 font-weight-bold line-clamp-2">
                          {{ item.title }}
                        </h3>
                        <v-chip
                          :color="item.is_public ? 'success' : 'warning'"
                          size="small"
                          variant="flat"
                        >
                          {{ item.is_public ? 'Público' : 'Privado' }}
                        </v-chip>
                      </div>
                      
                      <p v-if="item.subtitle" class="text-body-2 text-grey-darken-1 mb-3 line-clamp-2">
                        {{ item.subtitle }}
                      </p>
                      
                      <p class="text-body-2 line-clamp-3 mb-3">
                        {{ item.content }}
                      </p>
                      
                      <div class="d-flex justify-space-between align-center">
                        <div class="text-caption text-grey">
                          <v-icon size="small" class="mr-1">mdi-account</v-icon>
                          {{ item.author || 'Sin autor' }}
                        </div>
                        <div class="text-caption text-grey">
                          <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                          {{ formatDate(item.created_at) }}
                        </div>
                      </div>
                      
                      <div v-if="item.tags && Object.keys(item.tags).length" class="mt-2">
                        <v-chip
                          v-for="(value, key) in item.tags"
                          :key="key"
                          size="x-small"
                          class="mr-1"
                          variant="outlined"
                        >
                          {{ key }}: {{ value }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </template>
          </v-virtual-scroll>
        </div>
      </div>

      <!-- Welcome State -->
      <div v-else class="text-center py-12">
        <v-icon color="primary" size="128">mdi-chart-line</v-icon>
        <h3 class="text-h4 font-weight-bold mt-4 mb-2">
          Dashboard de Campañas
        </h3>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Selecciona una campaña arriba para ver sus noticias y estadísticas
        </p>
        
        <v-row class="mt-8">
          <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
            <v-card class="text-center pa-4" variant="outlined">
              <v-icon :color="stat.color" size="48" class="mb-2">
                {{ stat.icon }}
              </v-icon>
              <h4 class="text-h5 font-weight-bold">{{ stat.value }}</h4>
              <p class="text-body-2 text-grey">{{ stat.title }}</p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getAllCampaigns, getCampaignNewsByCampaignId } from '@/services/campaigns.service'
import { getAllCampaignNews } from '@/services/campaigns_news.service'
import dayjs from 'dayjs'

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

// Query para estadísticas generales
const {
  data: allNews
} = useQuery({
  queryKey: ['all-news'],
  queryFn: getAllCampaignNews
})

// Opciones para el selector de campañas
const campaignOptions = computed(() => {
  return campaigns.value || []
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

// Formatear fecha
const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}

// Manejar cambio de campaña
const handleCampaignChange = (campaignId) => {
  selectedCampaignId.value = campaignId
  if (campaignId) {
    refetchNews()
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

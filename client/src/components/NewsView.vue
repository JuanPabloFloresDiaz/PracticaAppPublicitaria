<template>
  <div class="news-view">
    <!-- Header mejorado -->
    <v-card 
      :color="$vuetify.theme.current.dark ? 'surface-container-high' : 'surface-bright'"
      class="mb-6"
      elevation="2"
    >
      <v-card-text class="pa-6">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-avatar size="56" color="primary-lighten-1" class="mr-4">
              <v-icon color="white" size="28">mdi-newspaper</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h3 font-weight-bold text-primary mb-1">
                Gestión de Noticias
              </h1>
              <p class="text-h6 text-on-surface-variant">
                Administra todas las noticias de campañas
              </p>
            </div>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="createDialog = true"
            size="large"
            elevation="2"
          >
            Nueva Noticia
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Search and Filters mejorado -->
    <v-card 
      class="mb-6" 
      elevation="1"
      :color="$vuetify.theme.current.dark ? 'surface-container' : 'surface'"
    >
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="globalFilter"
              prepend-inner-icon="mdi-magnify"
              label="Buscar noticias..."
              variant="outlined"
              clearable
              hide-details
              color="primary"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Filtrar por estado"
              variant="outlined"
              clearable
              hide-details
              color="primary"
              prepend-inner-icon="mdi-filter"
            />
          </v-col>
          <v-col cols="12" md="5">
            <div class="d-flex align-center justify-end ga-3">
              <v-chip 
                color="success" 
                variant="tonal"
                prepend-icon="mdi-earth"
                size="default"
              >
                Públicas: {{ publicNewsCount }}
              </v-chip>
              <v-chip 
                color="warning" 
                variant="tonal"
                prepend-icon="mdi-lock"
                size="default"
              >
                Privadas: {{ privateNewsCount }}
              </v-chip>
              <v-btn
                icon="mdi-refresh"
                variant="tonal"
                color="primary"
                @click="refetch"
                :loading="isLoading"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Estadísticas rápidas -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card 
          variant="tonal" 
          color="primary"
          class="text-center"
        >
          <v-card-text class="pa-4">
            <v-icon size="32" class="mb-2">mdi-newspaper</v-icon>
            <div class="text-h5 font-weight-bold">{{ news?.length || 0 }}</div>
            <div class="text-body-2">Total Noticias</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card 
          variant="tonal" 
          color="success"
          class="text-center"
        >
          <v-card-text class="pa-4">
            <v-icon size="32" class="mb-2">mdi-earth</v-icon>
            <div class="text-h5 font-weight-bold">{{ publicNewsCount }}</div>
            <div class="text-body-2">Públicas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card 
          variant="tonal" 
          color="warning"
          class="text-center"
        >
          <v-card-text class="pa-4">
            <v-icon size="32" class="mb-2">mdi-lock</v-icon>
            <div class="text-h5 font-weight-bold">{{ privateNewsCount }}</div>
            <div class="text-body-2">Privadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card 
          variant="tonal" 
          color="info"
          class="text-center"
        >
          <v-card-text class="pa-4">
            <v-icon size="32" class="mb-2">mdi-calendar-today</v-icon>
            <div class="text-h5 font-weight-bold">{{ todayNewsCount }}</div>
            <div class="text-body-2">Hoy</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table mejorada -->
    <v-card elevation="2">
      <v-card-title class="pa-6 d-flex align-center">
        <v-avatar size="32" color="primary-lighten-1" class="mr-3">
          <v-icon color="white" size="18">mdi-format-list-bulleted</v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-bold">Lista de Noticias</span>
        <v-spacer />
        <v-chip 
          color="primary" 
          variant="tonal"
          prepend-icon="mdi-newspaper"
        >
          {{ filteredNews.length }} noticias
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-data-table
        :headers="headers"
        :items="filteredNews"
        :loading="isLoading"
        :search="globalFilter"
        class="elevation-0"
        item-value="id"
      >
        <template v-slot:[`item.title`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="48" class="mr-3">
              <v-img
                v-if="item.thumbnail"
                :src="item.thumbnail"
                :alt="item.title"
              >
                <template v-slot:error>
                  <div class="d-flex align-center justify-center fill-height bg-primary-lighten-1">
                    <v-icon color="white" size="24">mdi-newspaper</v-icon>
                  </div>
                </template>
              </v-img>
              <div v-else class="d-flex align-center justify-center fill-height bg-primary-lighten-1">
                <v-icon color="white" size="24">mdi-newspaper</v-icon>
              </div>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-1 font-weight-bold text-primary line-clamp-1">
                {{ item.title }}
              </div>
              <div class="text-caption text-on-surface-variant line-clamp-1" v-if="item.subtitle">
                {{ item.subtitle }}
              </div>
            </div>
          </div>
        </template>

        <template v-slot:[`item.campaign`]="{ item }">
          <v-chip
            color="primary"
            variant="tonal"
            size="default"
            prepend-icon="mdi-bullhorn"
          >
            {{ item.campaign?.name || 'Sin campaña' }}
          </v-chip>
        </template>

        <template v-slot:[`item.is_public`]="{ item }">
          <v-chip
            :color="item.is_public ? 'success' : 'warning'"
            variant="flat"
            size="default"
            :prepend-icon="item.is_public ? 'mdi-earth' : 'mdi-lock'"
          >
            {{ item.is_public ? 'Público' : 'Privado' }}
          </v-chip>
        </template>

        <template v-slot:[`item.author`]="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="24" color="primary-lighten-1" class="mr-2">
              <v-icon color="white" size="12">mdi-account</v-icon>
            </v-avatar>
            <span class="text-body-2">{{ item.author || 'Sin autor' }}</span>
          </div>
        </template>

        <template v-slot:[`item.tags`]="{ item }">
          <div v-if="item.tags && Array.isArray(item.tags) && item.tags.length > 0">
            <v-chip
              v-for="(tag, index) in item.tags.slice(0, 2)"
              :key="index"
              size="small"
              class="mr-1 mb-1"
              variant="outlined"
              color="primary"
            >
              {{ tag }}
            </v-chip>
            <v-chip
              v-if="item.tags.length > 2"
              size="small"
              variant="tonal"
              color="surface-variant"
            >
              +{{ item.tags.length - 2 }}
            </v-chip>
          </div>
          <v-chip 
            v-else 
            size="small" 
            variant="outlined" 
            color="surface-variant"
            prepend-icon="mdi-tag-off"
          >
            Sin tags
          </v-chip>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <v-chip 
            size="small" 
            variant="outlined"
            prepend-icon="mdi-calendar"
          >
            {{ formatDate(item.created_at) }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex align-center ga-1">
            <v-btn
              icon="mdi-eye"
              variant="text"
              size="small"
              color="info"
              @click="viewItem(item)"
            />
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="editItem(item)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="deleteItem(item)"
            />
          </div>
        </template>

        <template #loading>
          <v-skeleton-loader type="table-tbody" />
        </template>

        <template #no-data>
          <div class="text-center py-12">
            <v-avatar size="100" color="primary-lighten-1" class="mb-4">
              <v-icon size="50" color="white">mdi-newspaper-variant-outline</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">No hay noticias disponibles</h3>
            <p class="text-body-1 text-on-surface-variant mb-6">
              Comienza creando tu primera noticia
            </p>
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              @click="createDialog = true"
              size="large"
            >
              Crear primera noticia
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modales -->
    <CreateModalNews
      v-model="createDialog"
      @created="handleCreated"
    />

    <UpdateModalNews
      v-model="updateDialog"
      :item="selectedItem"
      @updated="handleUpdated"
    />

    <DeleteModal
      v-model="deleteDialog"
      :item-name="selectedItem?.title"
      entity-name="noticia"
      @confirmed="handleDelete"
      @cancelled="handleDeleteCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import { getAllCampaignNews, removeCampaignNews } from '@/services/campaigns_news.service'
import CreateModalNews from '@/components/Modals/Create/CreateModalNews.vue'
import UpdateModalNews from '@/components/Modals/Update/UpdateModalNews.vue'
import DeleteModal from '@/components/Modals/Delete/DeleteModal.vue'
import { fireToast } from '@/plugins/sweetalert2'
import dayjs from 'dayjs'

const queryClient = useQueryClient()
const router = useRouter()
const route = useRoute()

// State
const globalFilter = ref('')
const statusFilter = ref(null)
const createDialog = ref(false)
const updateDialog = ref(false)
const deleteDialog = ref(false)
const selectedItem = ref(null)

// Query
const {
  data: news,
  isLoading,
  error,
  refetch
} = useQuery({
  queryKey: ['campaign-news'],
  queryFn: getAllCampaignNews
})

// Mutación para eliminar
const deleteMutation = useMutation({
  mutationFn: removeCampaignNews,
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Noticia eliminada correctamente'
    })
    queryClient.invalidateQueries(['campaign-news'])
  },
  onError: (err) => {
    console.error('Error eliminando noticia:', err)
    fireToast({
      icon: 'error',
      title: 'Error al eliminar la noticia'
    })
  }
})

// Table headers
const headers = [
  {
    title: 'Noticia',
    key: 'title',
    sortable: true,
    width: '25%'
  },
  {
    title: 'Campaña',
    key: 'campaign',
    sortable: false
  },
  {
    title: 'Estado',
    key: 'is_public',
    sortable: true
  },
  {
    title: 'Autor',
    key: 'author',
    sortable: true
  },
  {
    title: 'Tags',
    key: 'tags',
    sortable: false
  },
  {
    title: 'Creada',
    key: 'created_at',
    sortable: true
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
    align: 'center'
  }
]

// Filter options
const statusOptions = [
  { title: 'Todas', value: null },
  { title: 'Públicas', value: true },
  { title: 'Privadas', value: false }
]

// Computed
const filteredNews = computed(() => {
  if (!news.value) return []
  
  let filtered = [...news.value]
  
  if (statusFilter.value !== null) {
    filtered = filtered.filter(item => item.is_public === statusFilter.value)
  }
  
  return filtered
})

const publicNewsCount = computed(() => {
  return news.value?.filter(item => item.is_public).length || 0
})

const privateNewsCount = computed(() => {
  return news.value?.filter(item => !item.is_public).length || 0
})

const todayNewsCount = computed(() => {
  if (!news.value) return 0
  const today = dayjs().format('YYYY-MM-DD')
  return news.value.filter(item => 
    dayjs(item.created_at).format('YYYY-MM-DD') === today
  ).length
})

// Methods
const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}

const editItem = (item) => {
  selectedItem.value = item
  updateDialog.value = true
}

const deleteItem = (item) => {
  selectedItem.value = item
  deleteDialog.value = true
}

const viewItem = (item) => {
  // Navegar a la página de detalle
  router.push(`/NewsDetail/${item.id}`)
}

const handleCreated = () => {
  createDialog.value = false
  queryClient.invalidateQueries(['campaign-news'])
}

const handleUpdated = () => {
  updateDialog.value = false
  selectedItem.value = null
  queryClient.invalidateQueries(['campaign-news'])
  // Limpiar query parameters
  router.replace({ query: {} })
}

const handleDelete = async () => {
  try {
    await deleteMutation.mutateAsync(selectedItem.value.id)
    deleteDialog.value = false
    selectedItem.value = null
    // Limpiar query parameters
    router.replace({ query: {} })
  } catch (error) {
    console.error('Error al eliminar noticia:', error)
  }
}

const handleDeleteCancel = () => {
  fireToast({
    title: 'Eliminación cancelada'
  })
  deleteDialog.value = false
  selectedItem.value = null
  // Limpiar query parameters
  router.replace({ query: {} })
}

// Manejar query parameters para edición y eliminación
const handleQueryParams = () => {
  const editId = route.query.edit
  const deleteId = route.query.delete
  
  if (editId && news.value) {
    const item = news.value.find(n => n.id === editId)
    if (item) {
      selectedItem.value = item
      updateDialog.value = true
    }
  }
  
  if (deleteId && news.value) {
    const item = news.value.find(n => n.id === deleteId)
    if (item) {
      selectedItem.value = item
      deleteDialog.value = true
    }
  }
}

// Watch para cambios en la query y en los datos
watch(() => route.query, handleQueryParams)
watch(news, handleQueryParams)

// Ejecutar al montar el componente
onMounted(() => {
  if (news.value) {
    handleQueryParams()
  }
})
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
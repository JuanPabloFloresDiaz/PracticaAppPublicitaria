<template>
  <div class="campaigns-view">
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
              <v-icon color="white" size="28">mdi-bullhorn</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h3 font-weight-bold text-primary mb-1">
                Gestión de Campañas
              </h1>
              <p class="text-h6 text-on-surface-variant">
                Administra todas las campañas publicitarias
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
            Nueva Campaña
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
          <v-col cols="12" md="8">
            <v-text-field
              v-model="globalFilter"
              prepend-inner-icon="mdi-magnify"
              label="Buscar campañas..."
              variant="outlined"
              clearable
              hide-details
              color="primary"
            />
          </v-col>
          <v-col cols="12" md="4">
            <div class="d-flex align-center justify-end ga-3">
              <v-chip 
                color="primary" 
                variant="tonal"
                prepend-icon="mdi-chart-line"
                size="default"
              >
                Total: {{ campaigns?.length || 0 }}
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
          color="success"
          class="text-center"
        >
          <v-card-text class="pa-4">
            <v-icon size="32" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h5 font-weight-bold">{{ activeCampaigns }}</div>
            <div class="text-body-2">Activas</div>
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
            <v-icon size="32" class="mb-2">mdi-clock-outline</v-icon>
            <div class="text-h5 font-weight-bold">{{ scheduledCampaigns }}</div>
            <div class="text-body-2">Programadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card 
          variant="tonal" 
          color="error"
          class="text-center"
        >
          <v-card-text class="pa-4">
            <v-icon size="32" class="mb-2">mdi-stop-circle</v-icon>
            <div class="text-h5 font-weight-bold">{{ finishedCampaigns }}</div>
            <div class="text-body-2">Finalizadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card 
          variant="tonal" 
          color="primary"
          class="text-center"
        >
          <v-card-text class="pa-4">
            <v-icon size="32" class="mb-2">mdi-currency-usd</v-icon>
            <div class="text-h5 font-weight-bold">${{ totalBudget }}</div>
            <div class="text-body-2">Presupuesto Total</div>
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
        <span class="text-h6 font-weight-bold">Lista de Campañas</span>
        <v-spacer />
        <v-chip 
          color="primary" 
          variant="tonal"
          prepend-icon="mdi-bullhorn"
        >
          {{ filteredCampaigns.length }} campañas
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-data-table
        :headers="headers"
        :items="filteredCampaigns"
        :loading="isLoading"
        :search="globalFilter"
        class="elevation-0"
        item-value="id"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" color="primary-lighten-1" class="mr-3">
              <v-icon color="white" size="20">mdi-bullhorn</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold text-primary">
                {{ item.name }}
              </div>
              <div 
                v-if="item.description" 
                class="text-caption text-on-surface-variant"
                style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
              >
                {{ stripHtml(item.description) }}
              </div>
            </div>
          </div>
        </template>

        <template v-slot:[`item.budget`]="{ item }">
          <v-chip
            v-if="item.budget"
            color="success"
            variant="tonal"
            prepend-icon="mdi-currency-usd"
            size="default"
          >
            ${{ formatCurrency(item.budget) }}
          </v-chip>
          <v-chip 
            v-else 
            color="surface-variant" 
            variant="outlined" 
            size="small"
            prepend-icon="mdi-help-circle"
          >
            Sin presupuesto
          </v-chip>
        </template>

        <template v-slot:[`item.dates`]="{ item }">
          <div class="d-flex flex-column ga-1">
            <v-chip
              v-if="item.start_date"
              color="info"
              variant="tonal"
              size="small"
              prepend-icon="mdi-calendar-start"
            >
              {{ formatDate(item.start_date) }}
            </v-chip>
            <v-chip
              v-if="item.end_date"
              color="warning"
              variant="tonal"
              size="small"
              prepend-icon="mdi-calendar-end"
            >
              {{ formatDate(item.end_date) }}
            </v-chip>
            <v-chip
              v-if="!item.start_date && !item.end_date"
              color="surface-variant"
              variant="outlined"
              size="small"
              prepend-icon="mdi-calendar-remove"
            >
              Sin fechas
            </v-chip>
          </div>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="getStatusColor(item)"
            variant="flat"
            :prepend-icon="getStatusIcon(item)"
            size="default"
          >
            {{ getStatusText(item) }}
          </v-chip>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <v-chip 
            size="small" 
            variant="outlined"
            prepend-icon="mdi-calendar-plus"
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
              @click="viewDetails(item)"
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
              <v-icon size="50" color="white">mdi-bullhorn-outline</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">No hay campañas disponibles</h3>
            <p class="text-body-1 text-on-surface-variant mb-6">
              Comienza creando tu primera campaña publicitaria
            </p>
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              @click="createDialog = true"
              size="large"
            >
              Crear primera campaña
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modales (sin cambios) -->
    <CreateModalCampaigns
      v-model="createDialog"
      @created="handleCreated"
    />

    <UpdateModalCampaigns
      v-model="updateDialog"
      :item="selectedItem"
      @updated="handleUpdated"
    />

    <DeleteModal
      v-model="deleteDialog"
      :item-name="selectedItem?.name"
      entity-name="campaña"
      @confirmed="handleDelete"
      @cancelled="handleDeleteCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { getAllCampaigns, removeCampaign } from '@/services/campaigns.service'
import CreateModalCampaigns from '@/components/Modals/Create/CreateModalCampaigns.vue'
import UpdateModalCampaigns from '@/components/Modals/Update/UpdateModalCampaigns.vue'
import DeleteModal from '@/components/Modals/Delete/DeleteModal.vue'
import { fireToast } from '@/plugins/sweetalert2'
import dayjs from 'dayjs'

const router = useRouter()
const queryClient = useQueryClient()

// State
const globalFilter = ref('')
const createDialog = ref(false)
const updateDialog = ref(false)
const deleteDialog = ref(false)
const selectedItem = ref(null)

// Query
const {
  data: campaigns,
  isLoading,
  error,
  refetch
} = useQuery({
  queryKey: ['campaigns'],
  queryFn: getAllCampaigns
})

// Table headers
const headers = [
  {
    title: 'Campaña',
    key: 'name',
    sortable: true,
    width: '30%'
  },
  {
    title: 'Presupuesto',
    key: 'budget',
    sortable: true,
    width: '15%'
  },
  {
    title: 'Fechas',
    key: 'dates',
    sortable: false,
    width: '20%'
  },
  {
    title: 'Estado',
    key: 'status',
    sortable: false,
    width: '15%'
  },
  {
    title: 'Creada',
    key: 'created_at',
    sortable: true,
    width: '10%'
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
    align: 'center',
    width: '10%'
  }
]

// Computed
const filteredCampaigns = computed(() => {
  if (!campaigns.value) return []
  return campaigns.value
})

// Estadísticas computadas
const activeCampaigns = computed(() => {
  if (!campaigns.value) return 0
  return campaigns.value.filter(campaign => {
    const now = dayjs()
    const startDate = dayjs(campaign.start_date)
    const endDate = dayjs(campaign.end_date)
    return campaign.start_date && campaign.end_date && 
           now.isAfter(startDate) && now.isBefore(endDate)
  }).length
})

const scheduledCampaigns = computed(() => {
  if (!campaigns.value) return 0
  return campaigns.value.filter(campaign => {
    const now = dayjs()
    const startDate = dayjs(campaign.start_date)
    return campaign.start_date && now.isBefore(startDate)
  }).length
})

const finishedCampaigns = computed(() => {
  if (!campaigns.value) return 0
  return campaigns.value.filter(campaign => {
    const now = dayjs()
    const endDate = dayjs(campaign.end_date)
    return campaign.end_date && now.isAfter(endDate)
  }).length
})

const totalBudget = computed(() => {
  if (!campaigns.value) return '0'
  const total = campaigns.value.reduce((sum, campaign) => {
    return sum + (campaign.budget || 0)
  }, 0)
  return formatCurrency(total)
})

// Methods
const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES').format(amount)
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').substring(0, 50)
}

const getStatusColor = (item) => {
  const now = dayjs()
  const startDate = dayjs(item.start_date)
  const endDate = dayjs(item.end_date)

  if (!item.start_date && !item.end_date) return 'surface-variant'
  if (now.isBefore(startDate)) return 'info'
  if (now.isAfter(endDate)) return 'error'
  return 'success'
}

const getStatusIcon = (item) => {
  const now = dayjs()
  const startDate = dayjs(item.start_date)
  const endDate = dayjs(item.end_date)

  if (!item.start_date && !item.end_date) return 'mdi-help-circle'
  if (now.isBefore(startDate)) return 'mdi-clock-outline'
  if (now.isAfter(endDate)) return 'mdi-check-circle'
  return 'mdi-play-circle'
}

const getStatusText = (item) => {
  const now = dayjs()
  const startDate = dayjs(item.start_date)
  const endDate = dayjs(item.end_date)

  if (!item.start_date && !item.end_date) return 'Sin fechas'
  if (now.isBefore(startDate)) return 'Programada'
  if (now.isAfter(endDate)) return 'Finalizada'
  return 'Activa'
}

const viewDetails = (item) => {
  router.push({ name: '/CampaignsDetail', query: { id: item.id } })
}

const editItem = (item) => {
  selectedItem.value = item
  updateDialog.value = true
}

const deleteItem = (item) => {
  selectedItem.value = item
  deleteDialog.value = true
}

const handleCreated = () => {
  createDialog.value = false
  queryClient.invalidateQueries(['campaigns'])
  refetch()
}

const handleUpdated = () => {
  updateDialog.value = false
  selectedItem.value = null
  queryClient.invalidateQueries(['campaigns'])
  refetch()
}

const handleDelete = async () => {
  try {
    await removeCampaign(selectedItem.value.id)
    fireToast({ 
      icon: 'success', 
      title: 'Campaña eliminada exitosamente' 
    })
    deleteDialog.value = false
    selectedItem.value = null
    queryClient.invalidateQueries(['campaigns'])
    refetch()
  } catch (error) {
    console.error('Error al eliminar campaña:', error)
    fireToast({ 
      icon: 'error', 
      title: 'Error al eliminar la campaña' 
    })
  }
}

const handleDeleteCancel = () => {
  fireToast({ 
    icon: 'info', 
    title: 'Eliminación cancelada' 
  })
  deleteDialog.value = false
  selectedItem.value = null
}
</script>

<style scoped>
.campaigns-view {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

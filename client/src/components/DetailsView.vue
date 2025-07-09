<template>
  <div class="details-view">
    <!-- Header mejorado -->
    <v-card 
      :color="$vuetify.theme.current.dark ? 'surface-container-high' : 'surface-bright'"
      class="mb-6"
      elevation="1"
    >
      <v-card-text class="pa-6">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-arrow-left"
              variant="tonal"
              color="primary"
              @click="goBack"
              class="mr-4"
              size="large"
            />
            <div>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" size="32" class="mr-3">mdi-bullhorn</v-icon>
                <h1 class="text-h4 font-weight-bold text-primary">Detalles de Campaña</h1>
              </div>
              <p class="text-h6 text-on-surface-variant">
                {{ campaign?.name || 'Cargando...' }}
              </p>
            </div>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="createDialog = true"
            :disabled="!campaignId"
            size="large"
            elevation="2"
          >
            Nuevo Detalle
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Campaign Info Card mejorada -->
    <v-card 
      v-if="campaign" 
      class="mb-6"
      elevation="2"
      :color="$vuetify.theme.current.dark ? 'surface-container' : 'surface'"
    >
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" lg="8">
            <!-- Título de la campaña -->
            <div class="d-flex align-center mb-4">
              <v-avatar size="48" color="primary-lighten-1" class="mr-4">
                <v-icon color="white" size="24">mdi-bullhorn</v-icon>
              </v-avatar>
              <div>
                <h2 class="text-h5 font-weight-bold text-primary mb-1">
                  {{ campaign.name }}
                </h2>
                <v-chip 
                  :color="getStatusColor(campaign)"
                  variant="flat"
                  size="small"
                  :prepend-icon="getStatusIcon(campaign)"
                >
                  {{ getStatusText(campaign) }}
                </v-chip>
              </div>
            </div>

            <!-- Descripción con HTML renderizado -->
            <v-card 
              v-if="campaign.description" 
              variant="tonal"
              color="primary"
              class="mb-4"
            >
              <v-card-text class="pa-4">
                <div class="text-subtitle-2 font-weight-bold text-primary mb-2">
                  <v-icon size="20" class="mr-2">mdi-text-box</v-icon>
                  Descripción
                </div>
                <div 
                  class="rich-text-content text-body-1"
                  v-html="campaign.description"
                />
              </v-card-text>
            </v-card>

            <!-- Chips de información -->
            <div class="d-flex flex-wrap ga-2">
              <v-chip 
                v-if="campaign.budget" 
                color="success" 
                variant="tonal"
                prepend-icon="mdi-currency-usd"
                size="default"
              >
                ${{ formatCurrency(campaign.budget) }}
              </v-chip>
              <v-chip 
                v-if="campaign.start_date" 
                color="info" 
                variant="tonal"
                prepend-icon="mdi-calendar-start"
                size="default"
              >
                Inicio: {{ formatDate(campaign.start_date) }}
              </v-chip>
              <v-chip 
                v-if="campaign.end_date" 
                color="warning" 
                variant="tonal"
                prepend-icon="mdi-calendar-end"
                size="default"
              >
                Fin: {{ formatDate(campaign.end_date) }}
              </v-chip>
            </div>
          </v-col>
          
          <!-- Estadísticas laterales -->
          <v-col cols="12" lg="4">
            <v-card 
              variant="outlined" 
              color="primary"
              class="text-center"
            >
              <v-card-text class="pa-4">
                <v-icon size="48" color="primary" class="mb-2">mdi-chart-line</v-icon>
                <div class="text-h4 font-weight-bold text-primary mb-1">
                  {{ details?.length || 0 }}
                </div>
                <div class="text-body-2 text-on-surface-variant">
                  Detalles registrados
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Campaign Details Table mejorada -->
    <v-card elevation="2">
      <v-card-title class="pa-6 d-flex align-center">
        <v-avatar size="32" color="primary-lighten-1" class="mr-3">
          <v-icon color="white" size="18">mdi-information</v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-bold">Detalles de la Campaña</span>
        <v-spacer />
        <v-chip 
          color="primary" 
          variant="tonal"
          prepend-icon="mdi-format-list-numbered"
        >
          {{ details?.length || 0 }} detalles
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-data-table
        :headers="headers"
        :items="details || []"
        :loading="detailsLoading"
        class="elevation-0"
        item-value="id"
      >
        <template v-slot:[`item.description`]="{ item }">
          <div class="py-3">
            <!-- Descripción principal con HTML renderizado -->
            <v-card 
              variant="tonal" 
              color="on-surface-variant"
              class="mb-2"
            >
              <v-card-text class="pa-3">
                <div 
                  class="rich-text-content text-body-2"
                  v-html="item.description"
                />
              </v-card-text>
            </v-card>
            
            <!-- Información extra si existe -->
            <div 
              v-if="item.extra_info" 
              class="text-caption text-on-surface-variant"
            >
              <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>
              {{ item.extra_info }}
            </div>
          </div>
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

        <template v-slot:loading>
          <v-skeleton-loader type="table-tbody" />
        </template>

        <template v-slot:no-data>
          <div class="text-center py-12">
            <v-avatar size="80" color="primary-lighten-1" class="mb-4">
              <v-icon size="40" color="white">mdi-information-outline</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-2">No hay detalles para esta campaña</h3>
            <p class="text-body-2 text-on-surface-variant mb-6">
              Comienza agregando el primer detalle a esta campaña
            </p>
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              @click="createDialog = true"
              :disabled="!campaignId"
              size="large"
            >
              Agregar primer detalle
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modales (sin cambios) -->
    <CreateModalCampaignsDetail
      v-model="createDialog"
      :campaign-id="campaignId"
      @created="handleCreated"
    />

    <UpdateModalCampaignsDetail
      v-model="updateDialog"
      :item="selectedItem"
      @updated="handleUpdated"
    />

    <DeleteModal
      v-model="deleteDialog"
      :item-name="`Detalle: ${selectedItem?.description?.replace(/<[^>]*>/g, '').substring(0, 50)}...`"
      entity-name="detalle"
      @confirmed="handleDelete"
      @cancelled="handleDeleteCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getCampaignById, getCampaignDetailsByCampaignId } from '@/services/campaigns.service'
import { removeCampaignDetail } from '@/services/campaigns_details.service'
import CreateModalCampaignsDetail from '@/components/Modals/Create/CreateModalCampaignsDetail.vue'
import UpdateModalCampaignsDetail from '@/components/Modals/Update/UpdateModalCampaignsDetail.vue'
import DeleteModal from '@/components/Modals/Delete/DeleteModal.vue'
import { fireToast } from '@/plugins/sweetalert2'
import dayjs from 'dayjs'

const route = useRoute()
const queryClient = useQueryClient()

// State
const createDialog = ref(false)
const updateDialog = ref(false)
const deleteDialog = ref(false)
const selectedItem = ref(null)

// Get campaign ID from route query
const campaignId = computed(() => route.query.id)

// Methods
const goBack = () => {
  window.history.back()
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES').format(amount)
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
  queryClient.invalidateQueries(['campaign-details'])
  refetchDetails()
}

const handleUpdated = () => {
  updateDialog.value = false
  selectedItem.value = null
  queryClient.invalidateQueries(['campaign-details'])
  refetchDetails()
}

const handleDelete = async () => {
  try {
    await removeCampaignDetail(selectedItem.value.id)
    fireToast({ 
      icon: 'success', 
      title: 'Detalle eliminado exitosamente' 
    })
    deleteDialog.value = false
    selectedItem.value = null
    queryClient.invalidateQueries(['campaign-details'])
    refetchDetails()
  } catch (error) {
    console.error('Error al eliminar detalle:', error)
    fireToast({ 
      icon: 'error', 
      title: 'Error al eliminar el detalle' 
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

// Query for campaign
const {
  data: campaign,
  isLoading: campaignLoading
} = useQuery({
  queryKey: ['campaign', campaignId],
  queryFn: () => getCampaignById(campaignId.value),
  enabled: computed(() => !!campaignId.value)
})

// Query for campaign details
const {
  data: details,
  isLoading: detailsLoading,
  refetch: refetchDetails
} = useQuery({
  queryKey: ['campaign-details', campaignId],
  queryFn: () => getCampaignDetailsByCampaignId(campaignId.value),
  enabled: computed(() => !!campaignId.value)
})

// Table headers
const headers = [
  {
    title: 'Descripción',
    key: 'description',
    sortable: false,
    width: '65%'
  },
  {
    title: 'Fecha de Creación',
    key: 'created_at',
    sortable: true,
    width: '20%'
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
    align: 'center',
    width: '15%'
  }
]
</script>

<style scoped>
.details-view {
  max-width: 1400px;
  margin: 0 auto;
}

/* Estilos para contenido de texto enriquecido */
:deep(.rich-text-content) {
  line-height: 1.6;
}

:deep(.rich-text-content p) {
  margin-bottom: 12px;
}

:deep(.rich-text-content strong) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

:deep(.rich-text-content img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.rich-text-content ul),
:deep(.rich-text-content ol) {
  padding-left: 20px;
  margin-bottom: 12px;
}

:deep(.rich-text-content li) {
  margin-bottom: 4px;
}

:deep(.rich-text-content h1),
:deep(.rich-text-content h2),
:deep(.rich-text-content h3) {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
  margin-top: 16px;
}

:deep(.rich-text-content a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

:deep(.rich-text-content blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding-left: 16px;
  margin: 16px 0;
  font-style: italic;
  background: rgba(var(--v-theme-primary), 0.05);
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
}
</style>

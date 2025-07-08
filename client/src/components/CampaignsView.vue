<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Gestión de Campañas</h1>
        <p class="text-body-1 text-grey-darken-1">Administra todas las campañas publicitarias</p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="createDialog = true"
      >
        Nueva Campaña
      </v-btn>
    </div>

    <!-- Search and Filters -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="globalFilter"
          prepend-inner-icon="mdi-magnify"
          label="Buscar campañas..."
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" md="6">
        <div class="d-flex align-center justify-end">
          <v-chip class="mr-2" color="primary" variant="outlined">
            Total: {{ campaigns?.length || 0 }}
          </v-chip>
          <v-btn
            icon="mdi-refresh"
            variant="outlined"
            @click="refetch"
            :loading="isLoading"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredCampaigns"
        :loading="isLoading"
        :search="globalFilter"
        class="elevation-1"
        item-value="id"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-bullhorn</v-icon>
            <div>
              <div class="font-weight-bold">{{ item.name }}</div>
            </div>
          </div>
        </template>

        <template v-slot:[`item.budget`]="{ item }">
          <v-chip
            v-if="item.budget"
            color="success"
            variant="outlined"
            size="small"
          >
            ${{ formatCurrency(item.budget) }}
          </v-chip>
          <span v-else class="text-grey">Sin presupuesto</span>
        </template>

        <template v-slot:[`item.dates`]="{ item }">
          <div>
            <div v-if="item.start_date" class="text-caption">
              <v-icon size="small" class="mr-1">mdi-calendar-start</v-icon>
              {{ formatDate(item.start_date) }}
            </div>
            <div v-if="item.end_date" class="text-caption">
              <v-icon size="small" class="mr-1">mdi-calendar-end</v-icon>
              {{ formatDate(item.end_date) }}
            </div>
          </div>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="getStatusColor(item)"
            variant="flat"
            size="small"
          >
            {{ getStatusText(item) }}
          </v-chip>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <div class="text-caption">
            {{ formatDate(item.created_at) }}
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex align-center">
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
          <div class="text-center py-8">
            <v-icon size="64" color="grey">mdi-bullhorn-outline</v-icon>
            <p class="mt-4 text-grey">No hay campañas disponibles</p>
            <v-btn
              color="primary"
              variant="outlined"
              @click="createDialog = true"
            >
              Crear primera campaña
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create Modal -->
    <CreateModalCampaigns
      v-model="createDialog"
      @created="handleCreated"
    />

    <!-- Update Modal -->
    <UpdateModalCampaigns
      v-model="updateDialog"
      :item="selectedItem"
      @updated="handleUpdated"
    />

    <!-- Delete Modal -->
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
    sortable: true
  },
  {
    title: 'Presupuesto',
    key: 'budget',
    sortable: true
  },
  {
    title: 'Fechas',
    key: 'dates',
    sortable: false
  },
  {
    title: 'Estado',
    key: 'status',
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

// Computed
const filteredCampaigns = computed(() => {
  if (!campaigns.value) return []
  return campaigns.value
})

// Methods
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

  if (!item.start_date && !item.end_date) return 'grey'
  if (now.isBefore(startDate)) return 'info'
  if (now.isAfter(endDate)) return 'error'
  return 'success'
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
.v-data-table {
  border-radius: 8px;
}
</style>
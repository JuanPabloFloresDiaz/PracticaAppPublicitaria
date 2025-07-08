<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
        Confirmar Eliminación
      </v-card-title>

      <v-card-text class="py-6">
        <div class="text-center">
          <v-icon
            color="error"
            size="64"
            class="mb-4"
          >
            mdi-delete-alert
          </v-icon>
          <p class="text-h6 mb-4">
            ¿Estás seguro de que quieres eliminar {{ entityName }}?
          </p>
          <v-chip
            color="error"
            variant="outlined"
            class="mb-4"
          >
            {{ itemName }}
          </v-chip>
          <p class="text-body-2 text-grey-darken-1">
            Esta acción no se puede deshacer. {{ entityName.charAt(0).toUpperCase() + entityName.slice(1) }} será eliminada permanentemente.
          </p>
        </div>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="handleCancel"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="handleConfirm"
          :loading="loading"
        >
          Eliminar {{ entityName }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  itemName: {
    type: String,
    required: true
  },
  entityName: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'confirmed',
  'cancelled'
])

// State
const loading = ref(false)

// Methods
const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancelled')
}

const handleConfirm = async () => {
  loading.value = true
  try {
    emit('confirmed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card-title {
  background-color: rgba(255, 0, 0, 0.05);
  border-bottom: 1px solid rgba(255, 0, 0, 0.1);
}
</style>
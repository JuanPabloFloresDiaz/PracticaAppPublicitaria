<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-pencil</v-icon>
        Editar Detalle de Campaña
      </v-card-title>

      <v-card-text class="py-6">
        <form @submit.prevent="handleSubmit">
          <v-row>
            <!-- Descripción -->
            <v-col cols="12" class="mb-5">
              <Field name="description" :form="form">
                <template #default="{ field }">
                  <label class="">Descripción *</label>
                  <quill-editor
                    :content="field.state.value"
                    @update:content="field.handleChange"
                    @blur="field.handleBlur"
                    content-type="html"
                    theme="snow"
                    placeholder="Ingrese la descripción del detalle..."
                    :toolbar="[
                      ['bold', 'italic', 'underline'],
                      ['link'],
                      [{ list: 'ordered' }, { list: 'bullet' }]
                    ]"
                    style="margin-top: 8px; margin-bottom: 8px;"
                  />
                  <div
                    v-if="form.getFieldMeta('description')?.errors.length"
                    class="v-messages v-messages--active"
                  >
                    <div
                      v-for="(err, i) in form.getFieldMeta('description').errors"
                      :key="i"
                      class="v-messages__message text-error"
                    >
                      {{ err }}
                    </div>
                  </div>
                </template>
              </Field>
            </v-col>

            <!-- Información Adicional -->
            <v-col cols="12">
              <Field name="extra_info" :form="form">
                <template #default="{ field }">
                  <v-textarea
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('extra_info')?.errors || []"
                    label="Información adicional *"
                    variant="outlined"
                    prepend-inner-icon="mdi-information-outline"
                    rows="4"
                    required
                  />
                </template>
              </Field>
            </v-col>
          </v-row>
        </form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="handleCancel"
          :disabled="updateMutation.isPending.value"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="updateMutation.isPending.value"
        >
          Actualizar Detalle
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch } from 'vue'
import { useForm, Field } from '@tanstack/vue-form'
import { useMutation } from '@tanstack/vue-query'
import { updateCampaignDetail } from '@/services/campaigns_details.service'
import { fireToast } from '@/plugins/sweetalert2' // Asumiendo que tienes fireToast
import { z } from 'zod'
// NO IMPORTAR QuillEditor aquí, ya está registrado globalmente en plugins/index.js
// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/quill.snow.css'

// Props que el modal recibe
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null // El objeto de detalle de campaña a editar
  }
})

// Eventos que el modal puede emitir
const emit = defineEmits([
  'update:modelValue', // Para controlar la visibilidad del modal
  'updated' // Para notificar que un detalle ha sido actualizado
])

// Variable para almacenar los datos originales del item para comparar cambios
let originalData = null

// Función de utilidad para clonar objetos profundamente
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// Función de utilidad para obtener solo las propiedades que cambiaron
const getChangedProperties = (original, current) => {
  const changes = {}
  let hasChanges = false

  for (const key in current) {
    if (Object.prototype.hasOwnProperty.call(original, key) && typeof current[key] !== 'function') {
      let originalValue = original[key];
      let currentValue = current[key];

      // --- Normalización para comparación consistente ---
      // Convertir null/undefined a cadena vacía para campos de texto
      if (originalValue === null || originalValue === undefined) originalValue = '';
      if (currentValue === null || currentValue === undefined) currentValue = '';

      // Manejo especial para la descripción de Quill Editor
      // Si el valor es "<p><br></p>", se considera vacío para la comparación
      if (key === 'description') {
        if (originalValue === '<p><br></p>') originalValue = '';
        if (currentValue === '<p><br></p>') currentValue = '';
      }
      // --- Fin Normalización ---

      if (originalValue !== currentValue) {
        changes[key] = current[key]
        hasChanges = true
      }
    }
  }
  return hasChanges ? changes : null
}

// Esquema de validación con Zod
const detailSchema = z.object({
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  extra_info: z.string().min(10, 'La información adicional debe tener al menos 10 caracteres'),
})

// Configuración del formulario con TanStack Form
const form = useForm({
  defaultValues: {
    description: '',
    extra_info: ''
  },
  validators: {
    onSubmitAsync: async ({ value }) => {
      // Normalizar la descripción si es el HTML vacío de Quill
      const cleanDescription = (value.description === '<p><br></p>' || value.description === '') ? '' : value.description;

      const parsed = detailSchema.safeParse({
        description: cleanDescription,
        extra_info: value.extra_info
      });

      if (!parsed.success) {
        const errors = {}
        parsed.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message
        })
        return { fields: errors }
      }
      return null
    },
  },
  onSubmit: async ({ value }) => {
    if (!props.item) return // No proceder si no hay item

    // Limpiar datos vacíos antes de enviar
    const cleanData = { ...value };
    if (cleanData.description === '<p><br></p>' || cleanData.description === '') {
      cleanData.description = '';
    }

    // Obtener solo los campos que cambiaron comparando con los datos originales
    const changes = getChangedProperties(originalData, cleanData)

    if (!changes) {
      // Si no hay cambios detectados, mostrar mensaje con SweetAlert2
      fireToast({
        icon: 'info',
        title: 'No se han detectado cambios para actualizar'
      })
      emit('updated') // Emitir updated para que se cierre el modal
      return
    }

    // Ejecutar la mutación con el ID del item y solo los datos que cambiaron
    await updateMutation.mutateAsync({
      id: props.item.id,
      data: changes
    })
  }
})

// Configuración de la mutación para actualizar el detalle de campaña
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => updateCampaignDetail(id, data), // Llama al servicio de actualización
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Detalle de campaña actualizado correctamente'
    })
    emit('updated') // Emite el evento 'updated' para que la vista padre sepa que se actualizó
    resetForm() // Reinicia el formulario
  },
  onError: (error) => {
    console.error('Error al actualizar detalle de campaña:', error)
    fireToast({
      icon: 'error',
      title: 'Error al actualizar el detalle de campaña'
    })
  }
})

// Métodos para manejar la UI del modal
const handleCancel = () => {
  resetForm() // Reinicia el formulario
  emit('update:modelValue', false) // Cierra el modal
}

const handleSubmit = () => {
  form.handleSubmit() // Dispara el proceso de envío del formulario
}

const resetForm = () => {
  form.reset() // Reinicia los valores del formulario a sus valores por defecto
  originalData = null // Limpia los datos originales
}

// Función para cargar los datos del item recibido en el formulario
const loadItemData = (item) => {
  if (!item) return

  const initialValues = {
    description: item.description || '',
    extra_info: item.extra_info || ''
  };

  // Normalizar la descripción si es el HTML vacío de Quill
  if (initialValues.description === '<p><br></p>') {
    initialValues.description = '';
  }

  // Guardar una copia profunda de estos valores NORMALIZADOS como datos originales
  originalData = deepClone(initialValues);

  // Cargar datos en el formulario usando setTimeout para asegurar que el DOM esté listo
  setTimeout(() => {
    form.setFieldValue('description', initialValues.description)
    form.setFieldValue('extra_info', initialValues.extra_info)
  }, 100)

  console.log('Form values loaded:', initialValues);
  console.log('Original data for comparison:', originalData);
}

// Observador para cuando la prop 'item' cambie y el modal esté abierto
watch(() => props.item, (newItem) => {
  if (newItem && props.modelValue) {
    loadItemData(newItem) // Carga los datos si el item cambia y el modal está visible
  }
}, { immediate: true }) // Ejecuta el watcher inmediatamente si ya hay un item al montar

// Observador para cuando el modal se abre o se cierra
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.item) {
    loadItemData(props.item) // Si se abre y hay un item, carga los datos
  } else if (!newValue) {
    resetForm() // Si se cierra, reinicia el formulario
  }
})
</script>

<style scoped>
.v-card-title {
  background-color: rgba(25, 118, 210, 0.05); /* Puedes ajustar el color si Campaigns usa otro */
  border-bottom: 1px solid rgba(25, 118, 210, 0.1); /* Puedes ajustar el color */
}

.error--text {
  color: #b00020; /* Color de error de Vuetify */
}

/* Estilos para Quill Editor */
:deep(.ql-editor) {
  min-height: 120px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-top: none;
  border-radius: 0 0 4px 4px;
}

:deep(.ql-toolbar) {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  background-color: #f5f5f5;
}

:deep(.ql-container) {
  font-family: 'Roboto', sans-serif;
}

:deep(.ql-editor.ql-blank::before) {
  color: rgba(0, 0, 0, 0.6);
  font-style: normal;
}

.v-label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  margin-bottom: 4px;
  display: block;
}

.text-error {
  color: #b00020;
  font-size: 12px;
}
</style>

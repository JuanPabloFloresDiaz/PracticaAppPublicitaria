<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-pencil</v-icon>
        Editar Noticia
      </v-card-title>

      <v-card-text class="py-6">
        <form @submit.prevent="handleSubmit">
          <v-row>
            <!-- Campaña -->
            <v-col cols="12">
              <Field name="campaign_id" :form="form">
                <template #default="{ field }">
                  <v-select
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('campaign_id')?.errors || []"
                    :items="campaignOptions"
                    :loading="campaignsLoading"
                    label="Campaña *"
                    variant="outlined"
                    item-title="name"
                    item-value="id"
                    prepend-inner-icon="mdi-bullhorn"
                    required
                  />
                </template>
              </Field>
            </v-col>

            <!-- Título -->
            <v-col cols="12">
              <Field name="title" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('title')?.errors || []"
                    label="Título *"
                    variant="outlined"
                    prepend-inner-icon="mdi-format-title"
                    required
                  />
                </template>
              </Field>
            </v-col>

            <!-- Subtítulo -->
            <v-col cols="12">
              <Field name="subtitle" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('subtitle')?.errors || []"
                    label="Subtítulo"
                    variant="outlined"
                    prepend-inner-icon="mdi-format-header-2"
                  />
                </template>
              </Field>
            </v-col>

            <!-- URLs de imágenes -->
            <v-col cols="12" md="6">
              <Field name="thumbnail" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('thumbnail')?.errors || []"
                    label="URL de imagen miniatura"
                    variant="outlined"
                    prepend-inner-icon="mdi-image"
                    type="url"
                  />
                </template>
              </Field>
            </v-col>

            <v-col cols="12" md="6">
              <Field name="hero_image" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('hero_image')?.errors || []"
                    label="URL de imagen principal"
                    variant="outlined"
                    prepend-inner-icon="mdi-image-size-select-large"
                    type="url"
                  />
                </template>
              </Field>
            </v-col>

            <!-- Autor y estado público -->
            <v-col cols="12" md="6">
              <Field name="author" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('author')?.errors || []"
                    label="Autor"
                    variant="outlined"
                    prepend-inner-icon="mdi-account-edit"
                  />
                </template>
              </Field>
            </v-col>

            <v-col cols="12" md="6">
              <Field name="is_public" :form="form">
                <template #default="{ field }">
                  <v-switch
                    :model-value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    label="¿Noticia pública?"
                    color="success"
                    inset
                  />
                </template>
              </Field>
            </v-col>

            <!-- Contenido con Quill Editor -->
            <v-col cols="12" class="mb-5">
              <Field name="content" :form="form">
                <template #default="{ field }">
                  <label class="">Contenido *</label>
                  <quill-editor
                    :content="field.state.value"
                    @update:content="field.handleChange"
                    @blur="field.handleBlur"
                    content-type="html"
                    theme="snow"
                    placeholder="Escribe el contenido de la noticia..."
                    :toolbar="[
                      ['bold', 'italic', 'underline'],
                      ['link'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['image'],
                      ['video'],
                    ]"
                    style="margin-top: 8px; margin-bottom: 8px;"
                  />
                  <div
                    v-if="form.getFieldMeta('content')?.errors.length"
                    class="v-messages v-messages--active"
                  >
                    <div
                      v-for="(err, i) in form.getFieldMeta('content').errors"
                      :key="i"
                      class="v-messages__message text-error"
                    >
                      {{ err }}
                    </div>
                  </div>
                </template>
              </Field>
            </v-col>

            <!-- Tags con v-combobox -->
            <v-col cols="12">
              <Field name="tags" :form="form">
                <template #default="{ field }">
                  <v-combobox
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :items="predefinedTags"
                    label="Tags"
                    variant="outlined"
                    prepend-inner-icon="mdi-tag-multiple"
                    multiple
                    chips
                    closable-chips
                    hint="Selecciona o escribe tags personalizados"
                    persistent-hint
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
          Actualizar Noticia
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch, computed } from 'vue'
import { useForm, Field } from '@tanstack/vue-form'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { updateCampaignNews } from '@/services/campaigns_news.service'
import { getAllCampaigns } from '@/services/campaigns.service'
import { fireToast } from '@/plugins/sweetalert2'
import { z } from 'zod'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'updated'
])

// Variable para almacenar los datos originales del item para comparar cambios
let originalData = null

// Tags predefinidos para noticias
const predefinedTags = [
  'Entretenimiento',
  'Informativo',
  'Negocios',
  'Empleo',
  'Tecnología',
  'Salud',
  'Educación',
  'Deportes',
  'Política',
  'Cultura',
  'Ciencia',
  'Turismo',
  'Gastronomía',
  'Moda',
  'Finanzas',
  'Actualidad',
  'Promocional',
  'Evento',
  'Lanzamiento',
  'Oferta'
]

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
      const originalValue = original[key] === null || original[key] === undefined ? '' : original[key]
      const currentValue = current[key] === null || current[key] === undefined ? '' : current[key]

      // Comparación específica para arrays (tags)
      if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
        if (JSON.stringify(originalValue.sort()) !== JSON.stringify(currentValue.sort())) {
          changes[key] = currentValue
          hasChanges = true
        }
      } else if (String(originalValue) !== String(currentValue)) {
        changes[key] = currentValue
        hasChanges = true
      }
    }
  }

  return hasChanges ? changes : null
}

// Función para validar URLs
const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Query para obtener todas las campañas
const {
  data: campaigns,
  isLoading: campaignsLoading
} = useQuery({
  queryKey: ['campaigns'],
  queryFn: getAllCampaigns
})

// Opciones para el v-select de campañas
const campaignOptions = computed(() => campaigns.value || [])

// Esquema de validación con Zod
const newsSchema = z.object({
  campaign_id: z.string().min(1, 'La campaña es requerida'),
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(255, 'El título no puede superar los 255 caracteres'),
  subtitle: z.string().max(500, 'El subtítulo no puede superar los 500 caracteres').optional().or(z.literal('')),
  thumbnail: z.string().refine(val => !val || isValidUrl(val), 'Debe ser una URL válida').optional().or(z.literal('')),
  hero_image: z.string().refine(val => !val || isValidUrl(val), 'Debe ser una URL válida').optional().or(z.literal('')),
  is_public: z.boolean(),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
  author: z.string().max(255, 'El autor no puede superar los 255 caracteres').optional().or(z.literal('')),
  tags: z.array(z.string()).max(10, 'No puedes agregar más de 10 tags').optional()
})

// Configuración del formulario con TanStack Form
const form = useForm({
  defaultValues: {
    campaign_id: '',
    title: '',
    subtitle: '',
    thumbnail: '',
    hero_image: '',
    is_public: false,
    content: '',
    author: '',
    tags: []
  },
  validators: {
    onSubmitAsync: async ({ value }) => {
      return null
    },
  },
  onSubmit: async ({ value }) => {
    if (!props.item) return

    // Limpiar datos vacíos antes de enviar
    const cleanData = {}
    Object.keys(value).forEach(key => {
      const v = value[key]
      if (v !== '' && v != null) {
        if (key === 'tags' && Array.isArray(v) && v.length === 0) {
          return
        }
        if (key === 'content' && (v === '<p><br></p>' || v === '')) {
          cleanData[key] = ''
        } else {
          cleanData[key] = v
        }
      }
    })

    // Obtener solo los campos que cambiaron comparando con los datos originales
    const changes = getChangedProperties(originalData, cleanData)
    
    if (!changes) {
      fireToast({
        icon: 'info',
        title: 'No se detectaron cambios',
        text: 'Los datos ingresados son idénticos a los actuales'
      })
      return
    }

    // Ejecutar la mutación con el ID del item y solo los datos que cambiaron
    await updateMutation.mutateAsync({
      id: props.item.id,
      data: changes
    })
  }
})

// Mutación para actualizar la noticia
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => updateCampaignNews(id, data),
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Noticia actualizada correctamente'
    })
    emit('updated')
    resetForm()
  },
  onError: (error) => {
    console.error('Error al actualizar noticia:', error)
    fireToast({
      icon: 'error',
      title: 'Error al actualizar la noticia'
    })
  }
})

// Métodos para manejar la UI del modal
const handleCancel = () => {
  resetForm()
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  form.handleSubmit()
}

const resetForm = () => {
  form.reset()
  originalData = null
}

// Función para cargar los datos del item recibido en el formulario
const loadItemData = (item) => {
  if (!item) return

  // Normalizar tags - asegurar que sea un array
  const tags = Array.isArray(item.tags) ? item.tags : 
               (typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : [])

  originalData = deepClone({
    campaign_id: String(item.campaign_id || ''),
    title: item.title || '',
    subtitle: item.subtitle || '',
    thumbnail: item.thumbnail || '',
    hero_image: item.hero_image || '',
    is_public: Boolean(item.is_public),
    content: item.content || '',
    author: item.author || '',
    tags
  })

  // Cargar datos en el formulario usando setTimeout para asegurar que el DOM esté listo
  setTimeout(() => {
    form.setFieldValue('campaign_id', originalData.campaign_id)
    form.setFieldValue('title', originalData.title)
    form.setFieldValue('subtitle', originalData.subtitle)
    form.setFieldValue('thumbnail', originalData.thumbnail)
    form.setFieldValue('hero_image', originalData.hero_image)
    form.setFieldValue('is_public', originalData.is_public)
    form.setFieldValue('content', originalData.content)
    form.setFieldValue('author', originalData.author)
    form.setFieldValue('tags', originalData.tags)
  }, 100)
}

// Watchers para cargar datos y resetear el formulario
watch(() => props.item, (newItem) => {
  if (newItem && props.modelValue) {
    loadItemData(newItem)
  }
}, { immediate: true })

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.item) {
    loadItemData(props.item)
  } else if (!newValue) {
    resetForm()
  }
})
</script>

<style scoped>
.v-card-title {
  background-color: rgba(25, 118, 210, 0.05);
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
}

.error--text {
  color: #EF4444;
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
  color: #EF4444;
  font-size: 12px;
}
</style>

<style scoped>
.v-card-title {
  background-color: rgba(25, 118, 210, 0.05);
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
}
</style>

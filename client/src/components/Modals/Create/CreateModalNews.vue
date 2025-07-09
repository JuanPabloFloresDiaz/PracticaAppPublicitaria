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
        <v-icon color="primary" class="mr-2">mdi-newspaper-plus</v-icon>
        Nueva Noticia
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
                      ['image']
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
          :disabled="createMutation.isPending.value"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="createMutation.isPending.value"
        >
          Crear Noticia
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch, computed } from 'vue'
import { useForm, Field } from '@tanstack/vue-form'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { createCampaignNews } from '@/services/campaigns_news.service'
import { getAllCampaigns } from '@/services/campaigns.service'
import { fireToast } from '@/plugins/sweetalert2'
import { z } from 'zod'

// Props & emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'created'])

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

// Query para campañas
const {
  data: campaigns,
  isLoading: campaignsLoading
} = useQuery({
  queryKey: ['campaigns'],
  queryFn: getAllCampaigns
})

const campaignOptions = computed(() => campaigns.value || [])

// Función para validar URLs
const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

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

// Configuración del formulario
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
      // Filtrar campos vacíos
      const cleanData = {}
      Object.keys(value).forEach((key) => {
        const v = value[key]
        if (v !== '' && v != null) {
          if (key === 'tags' && Array.isArray(v) && v.length === 0) {
            return // No incluir array de tags vacío
          }
          cleanData[key] = v
        }
      })

      // Normalizar contenido de Quill Editor
      if (cleanData.content === '<p><br></p>' || cleanData.content === '') {
        cleanData.content = ''
      }

      // Validación Zod
      const parsed = newsSchema.safeParse(cleanData)
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

    await createMutation.mutateAsync(cleanData)
  }
})

// Configuración de la mutación
const createMutation = useMutation({
  mutationFn: createCampaignNews,
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Noticia creada correctamente'
    })
    emit('created')
    form.reset()
  },
  onError: (err) => {
    console.error('Error creando noticia:', err)
    fireToast({
      icon: 'error',
      title: 'Error al crear la noticia'
    })
  },
})

// Handlers
const handleSubmit = () => form.handleSubmit()
const handleCancel = () => {
  form.reset()
  emit('update:modelValue', false)
}

// Resetear al cerrar
watch(() => props.modelValue, (open) => {
  if (!open) form.reset()
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
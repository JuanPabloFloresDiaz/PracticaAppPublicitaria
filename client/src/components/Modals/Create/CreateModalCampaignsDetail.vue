<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-information-plus</v-icon>
        Nuevo Detalle de Campaña
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
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['image'],
                      ['video'],
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
          Crear Detalle
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch } from 'vue'
import { useForm, Field } from '@tanstack/vue-form'
import { useMutation } from '@tanstack/vue-query'
import { createCampaignDetail } from '@/services/campaigns_details.service'
import { fireToast } from '@/plugins/sweetalert2' // Asumiendo que tienes fireToast
import { z } from 'zod'
// NO IMPORTAR QuillEditor aquí, ya está registrado globalmente en plugins/index.js
// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/quill.snow.css'

// Props y emits
const props = defineProps({
  modelValue: Boolean,
  campaignId: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue','created'])

// Esquema de validación con Zod
const detailSchema = z.object({
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  extra_info: z.string().min(10, 'La información adicional debe tener al menos 10 caracteres'),
})

// Configuramos el form
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
    // Normalizar la descripción si es el HTML vacío de Quill antes de enviar
    const payload = {
      ...value,
      description: (value.description === '<p><br></p>' || value.description === '') ? '' : value.description,
      campaign_id: props.campaignId
    };

    await createMutation.mutateAsync(payload)
  }
})

// Mutation
const createMutation = useMutation({
  mutationFn: createCampaignDetail,
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Detalle de campaña creado correctamente'
    })
    emit('created')
    form.reset()
  },
  onError: (err) => {
    console.error('Error creando detalle de campaña:', err)
    fireToast({
      icon: 'error',
      title: 'Error al crear el detalle de campaña'
    })
  }
})

// Handlers
const handleSubmit = () => form.handleSubmit()
const handleCancel = () => {
  form.reset()
  emit('update:modelValue', false)
}

// Reseteo al cerrar
watch(() => props.modelValue, val => {
  if (!val) form.reset()
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

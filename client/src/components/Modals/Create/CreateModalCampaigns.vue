<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600"
    persistent>
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-bullhorn-outline</v-icon>
        Nueva Campaña
      </v-card-title>

      <v-card-text class="py-6">
        <form @submit.prevent="handleSubmit">
          <v-row>

            <!-- Nombre -->
            <v-col cols="12">
              <Field name="name" :form="form">
                <template #default="{ field }">
                  <v-text-field :value="field.state.value" @update:model-value="field.handleChange"
                    @blur="field.handleBlur" :error-messages="form.getFieldMeta('name')?.errors || []"
                    label="Nombre de la campaña *" variant="outlined" prepend-inner-icon="mdi-bullhorn" required />
                </template>
              </Field>
            </v-col>

            <v-col cols="12" class="mb-5">
              <Field name="description" :form="form">
                <template #default="{ field }">
                  <label class="">Descripción</label>
                  <quill-editor
                    :content="field.state.value"
                    @update:content="field.handleChange"
                    @blur="field.handleBlur"
                    content-type="html"
                    theme="snow"
                    placeholder="Ingrese la descripción de la campaña..."
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

            <v-col cols="12" md="6" class="mt-5">
              <Field name="start_date" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('start_date')?.errors || []"
                    label="Fecha de inicio"
                    type="date"
                    variant="outlined"
                    prepend-inner-icon="mdi-calendar-start"
                  />
                </template>
              </Field>
            </v-col>

            <v-col cols="12" md="6" class="mt-5">
              <Field name="end_date" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('end_date')?.errors || []"
                    label="Fecha de fin"
                    type="date"
                    variant="outlined"
                    prepend-inner-icon="mdi-calendar-end"
                  />
                </template>
              </Field>
            </v-col>

            <!-- Presupuesto -->
            <v-col cols="12">
              <Field name="budget" :form="form">
                <template #default="{ field }">
                  <v-text-field :value="field.state.value" @update:model-value="field.handleChange"
                    @blur="field.handleBlur" :error-messages="form.getFieldMeta('budget')?.errors || []"
                    label="Presupuesto" type="number" step="0.01" min="0" variant="outlined"
                    prepend-inner-icon="mdi-currency-usd" prefix="$" />
                </template>
              </Field>
            </v-col>

          </v-row>
        </form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn variant="outlined" @click="handleCancel" :disabled="createMutation.isPending.value">
          Cancelar
        </v-btn>
        <v-btn color="primary" variant="flat" @click="handleSubmit" :loading="createMutation.isPending.value">
          Crear Campaña
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch } from 'vue'
import { useForm, Field } from '@tanstack/vue-form'
import { useMutation } from '@tanstack/vue-query'
import { createCampaign } from '@/services/campaigns.service'
import { fireToast } from '@/plugins/sweetalert2'
import { z } from 'zod'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)

// Props & emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'created'])

const campaignSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  budget: z.preprocess(
    val => (val ? parseFloat(val) : null),
    z.number().nonnegative('El presupuesto debe ser positivo').nullable()
  ),
  start_date: z.string().nonempty('Fecha de inicio requerida'),
  end_date: z.string().optional(),
})

const form = useForm({
  defaultValues: {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: null,
  },
  validators: {
    onSubmitAsync: async ({ value }) => {
      // 1) Filtrar campos vacíos
      const cleanData = {}
      Object.keys(value).forEach((key) => {
        const v = value[key]
        if (v !== '' && v != null) cleanData[key] = v
      })

      // 2) Validación Zod
      const parsed = campaignSchema.safeParse(cleanData)
      if (!parsed.success) {
        const errors = {}
        parsed.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message
        })
        return { fields: errors }
      }

      // 3) Validación de fechas
      if (
        cleanData.start_date &&
        cleanData.end_date &&
        !dayjs(cleanData.end_date).isSameOrAfter(cleanData.start_date, 'day')
      ) {
        return {
          fields: {
            end_date: 'La fecha de fin debe ser posterior a la de inicio',
          },
        }
      }

      // Si todo OK, no devolver errores
      return null
    },
  },
  onSubmit: async ({ value }) => {
    const cleanData = {}
    Object.keys(value).forEach((key) => {
      const v = value[key]
      if (v !== '' && v != null) cleanData[key] = v
    })
    await createMutation.mutateAsync(cleanData)
  },
})

// -------------------------------
// Configura la mutación
// -------------------------------
const createMutation = useMutation({
  mutationFn: createCampaign,
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Campaña creada correctamente'
    })
    emit('created')
    form.reset()
  },
  onError: (err) => {
    console.error('Error creando campaña:', err)
    fireToast({
      icon: 'error',
      title: 'Error al crear la campaña'
    })
  },
})

// -------------------------------
// Handlers
// -------------------------------
const handleSubmit = () => form.handleSubmit()
const handleCancel = () => {
  form.reset()
  emit('update:modelValue', false)
}

// Resetea al cerrar
watch(() => props.modelValue, (open) => {
  if (!open) form.reset()
})
</script>

<style scoped>
.v-card-title {
  background-color: rgba(124, 58, 237, 0.05);
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
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

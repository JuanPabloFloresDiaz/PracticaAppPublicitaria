<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
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
                  <v-text-field
                    :value="field.state.value"
                    @update:modelValue="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('name')?.errors || []"
                    label="Nombre de la campaña *"
                    variant="outlined"
                    prepend-inner-icon="mdi-bullhorn"
                    required
                  />
                </template>
              </Field>
            </v-col>

            <!-- Descripción -->
            <v-col cols="12">
              <Field name="description" :form="form">
                <template #default="{ field }">
                  <v-textarea
                    :value="field.state.value"
                    @update:modelValue="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('description')?.errors || []"
                    label="Descripción"
                    variant="outlined"
                    prepend-inner-icon="mdi-text"
                    rows="3"
                  />
                </template>
              </Field>
            </v-col>

            <!-- Fecha de inicio -->
            <v-col cols="12" md="6">
              <Field name="start_date" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:modelValue="field.handleChange"
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

            <!-- Fecha de fin -->
            <v-col cols="12" md="6">
              <Field name="end_date" :form="form">
                <template #default="{ field }">
                  <v-text-field
                    :value="field.state.value"
                    @update:modelValue="field.handleChange"
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
                  <v-text-field
                    :value="field.state.value"
                    @update:modelValue="field.handleChange"
                    @blur="field.handleBlur"
                    :error-messages="form.getFieldMeta('budget')?.errors || []"
                    label="Presupuesto"
                    type="number"
                    step="0.01"
                    min="0"
                    variant="outlined"
                    prepend-inner-icon="mdi-currency-usd"
                    prefix="$"
                  />
                </template>
              </Field>
            </v-col>
          </v-row>
        </form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer/>
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

// Props & emits
const props = defineProps({ modelValue: Boolean })
const emit  = defineEmits(['update:modelValue','created'])

// 1) Inicializar useForm con destructuración de { value }
const form = useForm({
  defaultValues: {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: null
  },
  onSubmit: async ({ value }) => {
    // filtra vacíos
    const payload = Object.fromEntries(
      Object.entries(value)
            .filter(([_, v]) => v != null && v !== '')
    )
    await createMutation.mutateAsync(payload)
  }
})

// 2) Configurar la mutación
const createMutation = useMutation({
  mutationFn: createCampaign,
  onSuccess: () => {
    emit('created')
    form.reset()
  },
  onError: err => console.error('Error creando campaña:', err)
})

// 3) Handlers
const handleSubmit = () => form.handleSubmit()
const handleCancel = () => {
  form.reset()
  emit('update:modelValue', false)
}

// 4) Limpiar al cerrar
watch(() => props.modelValue, open => {
  if (!open) form.reset()
})
</script>

<style scoped>
.v-card-title {
  background-color: rgba(25, 118, 210, 0.05);
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
}
</style>

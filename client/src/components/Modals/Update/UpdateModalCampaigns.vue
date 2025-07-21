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
        Editar Campaña
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
                    @update:model-value="field.handleChange"
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

            <!-- Fecha de inicio -->
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

            <!-- Fecha de fin -->
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
                  <v-text-field
                    :value="field.state.value"
                    @update:model-value="field.handleChange"
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
          @click="form.handleSubmit()"
          :loading="updateMutation.isPending.value"
        >
          Actualizar Campaña
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch, reactive } from 'vue'
import { useForm, Field } from '@tanstack/vue-form'
import { useMutation } from '@tanstack/vue-query'
import { updateCampaign } from '@/services/campaigns.service'
import { fireToast } from '@/plugins/sweetalert2'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, numeric, minValue, helpers } from '@vuelidate/validators'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)

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

let originalData = null

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const getChangedProperties = (original, current) => {
  const changes = {}
  let hasChanges = false

  for (const key in current) {
    if (Object.prototype.hasOwnProperty.call(original, key)) {
      let originalValue = original[key]
      let currentValue = current[key]
      
      if (originalValue === null || originalValue === undefined) {
        originalValue = ''
      }
      if (currentValue === null || currentValue === undefined) {
        currentValue = ''
      }
      
      if (typeof originalValue === 'number') {
        originalValue = originalValue.toString()
      }
      if (typeof currentValue === 'number') {
        currentValue = currentValue.toString()
      }
      
      if (originalValue !== currentValue) {
        changes[key] = current[key]
        hasChanges = true
      }
    }
  }
  
  return hasChanges ? changes : null
}

const nonNegative = (value) => value === null || value >= 0;

const dateAfterOrEqual = (comparisonField) => helpers.withMessage(
  ({ $params }) => `La fecha de fin debe ser posterior o igual a la de inicio`,
  (value, siblings) => {
    if (!value || !siblings[comparisonField]) return true;
    return dayjs(value).isSameOrAfter(dayjs(siblings[comparisonField]), 'day');
  }
);

// Datos del formulario
const formData = reactive({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  budget: null
});

// Reglas de validación
const rules = {
  name: {
    required: helpers.withMessage('El nombre es requerido', required),
    minLength: helpers.withMessage('El nombre debe tener al menos 3 caracteres', minLength(3))
  },
  description: {}, 
  budget: {
    numeric: helpers.withMessage('El presupuesto debe ser un número', numeric),
    nonNegative: helpers.withMessage('El presupuesto debe ser positivo', nonNegative)
  },
  start_date: {
    required: helpers.withMessage('Fecha de inicio requerida', required)
  },
  end_date: {
    dateAfterOrEqual: dateAfterOrEqual('start_date') 
  }
};

const $v = useVuelidate(rules, formData);

const form = useForm({
  defaultValues: {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: null
  },
  validators: {
    onSubmitAsync: async ({ value }) => {
      // Normalizar contenido de Quill Editor para la validación
      if (value.description === '<p><br></p>' || value.description === '') {
        formData.description = '';
      } else {
        formData.description = value.description;
      }

      formData.name = value.name;
      formData.start_date = value.start_date;
      formData.end_date = value.end_date;
      formData.budget = value.budget;

      const isValid = await $v.value.$validate();

      if (!isValid) {
        const errors = {};
        for (const field in $v.value.$errors) {
          if ($v.value.$errors[field].length > 0) {
            errors[field] = $v.value.$errors[field][0].$message;
          }
        }
        return { fields: errors };
      }

      return null
    },
  },
  onSubmit: async ({ value }) => {
    if (!props.item) return

    const cleanData = {}
    Object.keys(value).forEach(key => {
      const v = value[key]
      if (key === 'description' && (v === '<p><br></p>' || v === '<p></p>' || v === '')) {
        cleanData[key] = ''
      } else if (v !== '' && v != null) {
        cleanData[key] = v
      }
    })

    const changes = getChangedProperties(originalData, cleanData)
    
    if (!changes) {
      fireToast({
        icon: 'info',
        title: 'No se han detectado cambios para actualizar'
      })
      emit('updated') 
      return
    }

    await updateMutation.mutateAsync({
      id: props.item.id,
      data: changes
    })
  }
})

watch(form.values, (newValues) => {
  Object.assign(formData, newValues);
}, { deep: true });

// Mutación para actualizar la campaña
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => updateCampaign(id, data),
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Campaña actualizada correctamente'
    })
    emit('updated') 
    resetForm() 
  },
  onError: (error) => {
    console.error('Error al actualizar campaña:', error)
    fireToast({
      icon: 'error',
      title: 'Error al actualizar la campaña'
    })
  }
})

const handleCancel = () => {
  resetForm() 
  emit('update:modelValue', false) 
}

const handleSubmit = async () => {
  $v.value.$touch(); 
  if ($v.value.$invalid) {
    fireToast({ icon: 'error', title: 'Favor revisar los datos ingresados' });
    return; 
  }
  await form.handleSubmit();
}

const resetForm = () => {
  form.reset()
  originalData = null
  $v.value.$reset();
}

// Función para cargar los datos del item recibido en el formulario
const loadItemData = (item) => {
  if (!item) return

  const initialValues = {
    name: item.name || '',
    description: item.description || '',
    start_date: item.start_date ? dayjs(item.start_date).format('YYYY-MM-DD') : '',
    end_date: item.end_date ? dayjs(item.end_date).format('YYYY-MM-DD') : '',
    budget: item.budget || null
  };

  originalData = deepClone(initialValues)

  // Cargar datos en el formulario usando setTimeout para asegurar que el DOM esté listo
  setTimeout(() => {
    form.setFieldValue('name', originalData.name)
    form.setFieldValue('description', originalData.description)
    form.setFieldValue('start_date', originalData.start_date)
    form.setFieldValue('end_date', originalData.end_date)
    form.setFieldValue('budget', originalData.budget)
    // Sincronizar formData con los valores cargados
    Object.assign(formData, originalData);
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

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
          Actualizar Detalle
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch, reactive } from 'vue'
import { useForm, Field } from '@tanstack/vue-form'
import { useMutation } from '@tanstack/vue-query'
import { updateCampaignDetail } from '@/services/campaigns_details.service'
import { fireToast } from '@/plugins/sweetalert2'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'

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

// Función de utilidad para obtener solo las propiedades que cambiaron
const getChangedProperties = (original, current) => {
  const changes = {}
  let hasChanges = false

  for (const key in current) {
    if (Object.prototype.hasOwnProperty.call(original, key) && typeof current[key] !== 'function') {
      let originalValue = original[key];
      let currentValue = current[key];

      // --- Normalización para comparación consistente ---
      if (originalValue === null || originalValue === undefined) originalValue = '';
      if (currentValue === null || currentValue === undefined) currentValue = '';
      if (key === 'description') {
        if (originalValue === '<p><br></p>') originalValue = '';
        if (currentValue === '<p><br></p>') currentValue = '';
      }

      if (originalValue !== currentValue) {
        changes[key] = current[key]
        hasChanges = true
      }
    }
  }
  return hasChanges ? changes : null
}

// Datos del formulario
const formData = reactive({
  description: '',
  extra_info: ''
});

// Reglas de validación
const rules = {
  description: {
    required: helpers.withMessage('La descripción es requerida', required),
    minLength: helpers.withMessage('La descripción debe tener al menos 10 caracteres', minLength(10))
  },
  extra_info: {
    required: helpers.withMessage('La información adicional es requerida', required),
    minLength: helpers.withMessage('La información adicional debe tener al menos 10 caracteres', minLength(10))
  }
};

// Inicializar
const $v = useVuelidate(rules, formData);

const form = useForm({
  defaultValues: {
    description: '',
    extra_info: ''
  },
  validators: {
    onSubmitAsync: async ({ value }) => {
      if (value.description === '<p><br></p>' || value.description === '') {
        formData.description = ''; 
      } else {
        formData.description = value.description;
      }

      formData.extra_info = value.extra_info;

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
    const cleanData = { ...value };
    if (cleanData.description === '<p><br></p>' || cleanData.description === '') {
      cleanData.description = '';
    }

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

const updateMutation = useMutation({
  mutationFn: ({ id, data }) => updateCampaignDetail(id, data),
  onSuccess: () => {
    fireToast({
      icon: 'success',
      title: 'Detalle de campaña actualizado correctamente'
    })
    emit('updated') 
    resetForm() 
  },
  onError: (error) => {
    console.error('Error al actualizar detalle de campaña:', error)
    fireToast({
      icon: 'error',
      title: 'Error al actualizar el detalle de campaña'
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

const loadItemData = (item) => {
  if (!item) return

  const initialValues = {
    description: item.description || '',
    extra_info: item.extra_info || ''
  };

  if (initialValues.description === '<p><br></p>') {
    initialValues.description = '';
  }

  originalData = deepClone(initialValues);

  setTimeout(() => {
    form.setFieldValue('description', initialValues.description)
    form.setFieldValue('extra_info', initialValues.extra_info)
    Object.assign(formData, initialValues);
  }, 100)

  console.log('Form values loaded:', initialValues);
  console.log('Original data for comparison:', originalData);
}

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
  color: #b00020; 
}

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

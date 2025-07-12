<template>
  <section id="contacto" class="py-16 bg-gray-900 text-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">Contáctanos</h2>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
          ¿Listo para transformar tu estrategia publicitaria? Ponte en contacto con nosotros 
          y descubre cómo podemos ayudarte a alcanzar tus objetivos.
        </p>
      </div>
      
      <div class="max-w-6xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div>
            <h3 class="text-2xl font-bold mb-8">Información de Contacto</h3>
            
            <!-- Contact Details -->
            <div class="space-y-6 mb-8">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:map-pin" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">Dirección</h4>
                  <p class="text-gray-300">
                    Calle de la Innovación, 123<br>
                    28001 Madrid, España
                  </p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:phone" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">Teléfono</h4>
                  <p class="text-gray-300">+34 91 123 45 67</p>
                  <p class="text-gray-300">+34 600 123 456</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:envelope" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">Email</h4>
                  <p class="text-gray-300">info@publicate.com</p>
                  <p class="text-gray-300">soporte@publicate.com</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:clock" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">Horario de Atención</h4>
                  <p class="text-gray-300">Lunes - Viernes: 9:00 - 18:00</p>
                  <p class="text-gray-300">Sábados: 10:00 - 14:00</p>
                </div>
              </div>
            </div>
            
            <!-- Social Media -->
            <div>
              <h4 class="text-lg font-semibold mb-4">Síguenos en Redes Sociales</h4>
              <div class="flex space-x-4">
                <a 
                  href="https://linkedin.com/company/publicate" 
                  target="_blank"
                  class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                >
                  <Icon name="heroicons:link" class="w-6 h-6 text-white" />
                </a>
                <a 
                  href="https://twitter.com/publicate" 
                  target="_blank"
                  class="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
                >
                  <Icon name="heroicons:at-symbol" class="w-6 h-6 text-white" />
                </a>
                <a 
                  href="https://facebook.com/publicate" 
                  target="_blank"
                  class="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors duration-200"
                >
                  <Icon name="heroicons:hashtag" class="w-6 h-6 text-white" />
                </a>
                <a 
                  href="https://instagram.com/publicate" 
                  target="_blank"
                  class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  <Icon name="heroicons:camera" class="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div>
            <h3 class="text-2xl font-bold mb-8">Envíanos un Mensaje</h3>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Name and Email Row -->
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <!-- Company and Phone Row -->
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label for="company" class="block text-sm font-medium text-gray-300 mb-2">
                    Empresa
                  </label>
                  <input
                    id="company"
                    v-model="form.company"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white"
                    placeholder="+34 123 456 789"
                  />
                </div>
              </div>
              
              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  v-model="form.subject"
                  required
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta General</option>
                  <option value="demo">Solicitar Demo</option>
                  <option value="presupuesto">Solicitar Presupuesto</option>
                  <option value="soporte">Soporte Técnico</option>
                  <option value="partnership">Alianzas y Partnerships</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              
              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white resize-none"
                  placeholder="Cuéntanos sobre tu proyecto o consulta..."
                ></textarea>
              </div>
              
              <!-- Privacy Checkbox -->
              <div class="flex items-start space-x-3">
                <input
                  id="privacy"
                  v-model="form.acceptsPrivacy"
                  type="checkbox"
                  required
                  class="mt-1 w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                />
                <label for="privacy" class="text-sm text-gray-300">
                  Acepto la 
                  <a href="#" class="text-purple-400 hover:text-purple-300 underline">
                    política de privacidad
                  </a> 
                  y el tratamiento de mis datos personales *
                </label>
              </div>
              
              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <span v-if="!isSubmitting">Enviar Mensaje</span>
                <span v-else class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const form = ref({
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  acceptsPrivacy: false
})

const isSubmitting = ref(false)

const submitForm = async () => {
  if (!form.value.acceptsPrivacy) {
    alert('Debes aceptar la política de privacidad para continuar.')
    return
  }
  
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success message
    alert('¡Mensaje enviado correctamente! Te contactaremos pronto.')
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      acceptsPrivacy: false
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Error al enviar el mensaje. Por favor, inténtalo más tarde.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Form styling improvements */
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9333ea;
}

/* Social media hover effects */
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-blue-500:hover {
  background-color: #3b82f6;
}

.hover\:bg-blue-900:hover {
  background-color: #1e3a8a;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .grid.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .grid.lg\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-3 mb-6">
            <img 
              src="~/assets/publicate.avif" 
              alt="Publicate Logo" 
              class="h-10 w-auto"
            />
            <span class="text-2xl font-bold text-white">Publicate</span>
          </div>
          
          <p class="text-gray-300 mb-6 max-w-md">
            Plataforma integral para la gestión y seguimiento de campañas publicitarias digitales. 
            Transformamos la forma en que las empresas conectan con su audiencia.
          </p>
          
          <!-- Social Media Links -->
          <div class="flex space-x-4">
            <a 
              href="https://linkedin.com/company/publicate" 
              target="_blank"
              class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Icon name="heroicons:link" class="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/publicate" 
              target="_blank"
              class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              aria-label="Twitter"
            >
              <Icon name="heroicons:at-symbol" class="w-5 h-5" />
            </a>
            <a 
              href="https://facebook.com/publicate" 
              target="_blank"
              class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              aria-label="Facebook"
            >
              <Icon name="heroicons:hashtag" class="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/publicate" 
              target="_blank"
              class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Icon name="heroicons:camera" class="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li>
              <button 
                @click="scrollToSection('inicio')"
                class="text-gray-300 hover:text-purple-400 transition-colors duration-200"
              >
                Inicio
              </button>
            </li>
            <li>
              <button 
                @click="scrollToSection('oferta')"
                class="text-gray-300 hover:text-purple-400 transition-colors duration-200"
              >
                Servicios
              </button>
            </li>
            <li>
              <button 
                @click="scrollToSection('campanas')"
                class="text-gray-300 hover:text-purple-400 transition-colors duration-200"
              >
                Campañas
              </button>
            </li>
            <li>
              <button 
                @click="scrollToSection('noticias')"
                class="text-gray-300 hover:text-purple-400 transition-colors duration-200"
              >
                Noticias
              </button>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Blog
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Contacto</h3>
          <div class="space-y-3">
            <div class="flex items-start space-x-3">
              <Icon name="heroicons:map-pin" class="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div class="text-gray-300 text-sm">
                <p>Calle de la Innovación, 123</p>
                <p>28001 Madrid, España</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <Icon name="heroicons:phone" class="w-5 h-5 text-purple-400 flex-shrink-0" />
              <a 
                href="tel:+34911234567" 
                class="text-gray-300 text-sm hover:text-purple-400 transition-colors duration-200"
              >
                +34 91 123 45 67
              </a>
            </div>
            
            <div class="flex items-center space-x-3">
              <Icon name="heroicons:envelope" class="w-5 h-5 text-purple-400 flex-shrink-0" />
              <a 
                href="mailto:info@publicate.com" 
                class="text-gray-300 text-sm hover:text-purple-400 transition-colors duration-200"
              >
                info@publicate.com
              </a>
            </div>
            
            <div class="flex items-start space-x-3">
              <Icon name="heroicons:clock" class="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div class="text-gray-300 text-sm">
                <p>Lun - Vie: 9:00 - 18:00</p>
                <p>Sáb: 10:00 - 14:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Newsletter Subscription -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="max-w-md mx-auto text-center">
          <h3 class="text-lg font-semibold mb-4">Suscríbete a Nuestro Newsletter</h3>
          <form @submit.prevent="subscribeNewsletter" class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="email"
              type="email"
              placeholder="Tu correo electrónico"
              required
              class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              :disabled="isSubscribing"
              class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              {{ isSubscribing ? 'Enviando...' : 'Suscribirse' }}
            </button>
          </form>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            © {{ currentYear }} Publicate. Todos los derechos reservados.
          </div>
          
          <div class="flex space-x-6 text-sm">
            <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors duration-200">
              Política de Privacidad
            </a>
            <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors duration-200">
              Términos de Servicio
            </a>
            <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors duration-200">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const email = ref('')
const isSubscribing = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const subscribeNewsletter = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.')
    email.value = ''
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    alert('Error al suscribirse. Por favor, inténtalo más tarde.')
  } finally {
    isSubscribing.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions */
button,
a {
  transition: color 0.2s ease-in-out;
}

/* Input focus styles */
input:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Social media hover effects */
.hover\:bg-purple-600:hover {
  background-color: #9333ea;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .grid.md\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .flex.md\:flex-row {
    flex-direction: column;
  }
  
  .flex.sm\:flex-row {
    flex-direction: column;
  }
}

@media (min-width: 768px) {
  .grid.md\:grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Newsletter form responsive */
@media (max-width: 639px) {
  .flex.sm\:flex-row {
    flex-direction: column;
  }
}

@media (min-width: 640px) {
  .flex.sm\:flex-row {
    flex-direction: row;
  }
}
</style>

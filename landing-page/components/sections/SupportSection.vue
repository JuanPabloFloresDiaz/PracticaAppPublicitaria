<template>
  <section id="apoyanos" class="py-16 bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-pattern"></div>
    </div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Icon -->
        <div class="mb-8">
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="heroicons:heart" class="w-10 h-10 text-white" />
          </div>
        </div>
        
        <!-- Main Content -->
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          ¡Apóyanos en Nuestro Crecimiento!
        </h2>
        
        <p class="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
          Únete a nuestra comunidad y ayúdanos a revolucionar el mundo de la publicidad digital. 
          Tu apoyo es fundamental para seguir innovando y creando soluciones que transformen el mercado.
        </p>
        
        <!-- Support Options -->
        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <!-- Share -->
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
            <Icon name="heroicons:share" class="w-8 h-8 text-white mx-auto mb-4" />
            <h3 class="text-lg font-bold mb-2">Comparte</h3>
            <p class="text-purple-100 text-sm">
              Ayúdanos a llegar a más personas compartiendo nuestra plataforma
            </p>
          </div>
          
          <!-- Follow -->
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
            <Icon name="heroicons:user-plus" class="w-8 h-8 text-white mx-auto mb-4" />
            <h3 class="text-lg font-bold mb-2">Síguenos</h3>
            <p class="text-purple-100 text-sm">
              Mantente al día con nuestras novedades en redes sociales
            </p>
          </div>
          
          <!-- Feedback -->
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
            <Icon name="heroicons:chat-bubble-left-right" class="w-8 h-8 text-white mx-auto mb-4" />
            <h3 class="text-lg font-bold mb-2">Feedback</h3>
            <p class="text-purple-100 text-sm">
              Comparte tus ideas para ayudarnos a mejorar continuamente
            </p>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="scrollToSection('contacto')"
            class="bg-white text-purple-800 hover:bg-purple-100 font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Contáctanos
          </button>
          
          <button 
            @click="shareOnSocial"
            class="border-2 border-white text-white hover:bg-white hover:text-purple-800 font-bold py-4 px-8 rounded-lg transition-all duration-300"
          >
            Compartir en Redes
          </button>
        </div>
        
        <!-- Social Stats (Optional) -->
        <div class="mt-12 pt-8 border-t border-white/20">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div class="text-3xl font-bold text-white mb-1">500+</div>
              <div class="text-purple-200 text-sm">Campañas Exitosas</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white mb-1">50+</div>
              <div class="text-purple-200 text-sm">Clientes Satisfechos</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white mb-1">95%</div>
              <div class="text-purple-200 text-sm">Tasa de Éxito</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white mb-1">24/7</div>
              <div class="text-purple-200 text-sm">Soporte Disponible</div>
            </div>
          </div>
        </div>
        
        <!-- Newsletter Signup -->
        <div class="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h3 class="text-2xl font-bold mb-4">Suscríbete a Nuestro Newsletter</h3>
          <p class="text-purple-100 mb-6">
            Recibe las últimas noticias, consejos y actualizaciones directamente en tu correo
          </p>
          <form @submit.prevent="subscribeNewsletter" class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              v-model="email"
              type="email"
              placeholder="Tu correo electrónico"
              required
              class="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              :disabled="isSubscribing"
              class="bg-white text-purple-800 hover:bg-purple-100 font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {{ isSubscribing ? 'Suscribiendo...' : 'Suscribirse' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const email = ref('')
const isSubscribing = ref(false)

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const shareOnSocial = () => {
  const url = window.location.href
  const text = 'Descubre Publicate - La plataforma integral para gestión publicitaria digital'
  
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: 'Publicate - Publicidad Digital',
      text: text,
      url: url
    }).catch(console.error)
  } else {
    // Fallback to Twitter share
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }
}

const subscribeNewsletter = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  
  try {
    // Here you would implement the actual newsletter subscription
    // For now, we'll simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    alert('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.')
    email.value = ''
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    alert('Error al suscribirse. Por favor, inténtalo más tarde.')
  } finally {
    isSubscribing.value = false
  }
}

// Animate stats on scroll (optional)
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up')
      }
    })
  })
  
  const statElements = document.querySelectorAll('#apoyanos .text-3xl')
  statElements.forEach(el => observer.observe(el))
})
</script>

<style scoped>
/* Background pattern */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Custom backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Animation for stats */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Input focus styles */
input:focus {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Responsive text sizes */
@media (max-width: 767px) {
  .text-4xl.md\:text-5xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  
  .text-xl.md\:text-2xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
</style>

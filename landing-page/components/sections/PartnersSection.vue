<template>
  <section id="alianzas" class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Nuestras Alianzas</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Forjamos alianzas estratégicas con instituciones educativas, financieras líderes y empresas lideres del sector,
          impulsando el talento y la innovación en el sector publicitario.
        </p>
      </div>

      <!-- Partners Carousel -->
      <div class="relative max-w-6xl mx-auto">
        <!-- Carousel Container -->
        <div class="overflow-hidden">
          <div class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }">
            <!-- Partner Logo Slides -->
            <div v-for="(partner, index) in partners" :key="index" class="flex-shrink-0"
              :style="{ width: `${slideWidth}%` }">
              <div
                class="bg-white rounded-lg shadow-md py-8 px-4 flex flex-col items-center justify-center h-48 hover:shadow-lg transition-shadow duration-300 group">
                <img :src="partner.logo" :alt="partner.name"
                  class="max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                <span class="mt-4 text-gray-700 text-base font-medium text-center">{{ partner.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Controls -->
        <button @click="prevSlide"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
          :disabled="currentSlide === 0" :class="{ 'opacity-50 cursor-not-allowed': currentSlide === 0 }">
          <Icon name="heroicons:chevron-left" class="w-6 h-6 text-gray-600" />
        </button>

        <button @click="nextSlide"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
          :disabled="currentSlide >= maxSlides" :class="{ 'opacity-50 cursor-not-allowed': currentSlide >= maxSlides }">
          <Icon name="heroicons:chevron-right" class="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <!-- Partnership Benefits -->
      <div class="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:star" class="w-8 h-8 text-purple-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Tecnología Premium</h3>
          <p class="text-gray-600">
            Acceso a las mejores herramientas y plataformas del mercado publicitario
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:shield-check" class="w-8 h-8 text-purple-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Confianza y Seguridad</h3>
          <p class="text-gray-600">
            Partners certificados que garantizan la seguridad y efectividad de las campañas
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:chart-bar-square" class="w-8 h-8 text-purple-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Resultados Optimizados</h3>
          <p class="text-gray-600">
            Combinamos lo mejor de cada plataforma para maximizar tu ROI
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Partners data - You can move this to an API or external data source
const partners = ref([
  {
    name: 'Instituto Técnico Ricaldone',
    logo: '/logos/logo rical.avif'
  },
  {
    name: 'Universidad Francisco Gavidia',
    logo: '/logos/ufg.avif'
  },
  {
    name: 'Universidad Dr Andres Bello',
    logo: '/logos/unab.avif'
  },
  {
    name: 'Banco Davivienda',
    logo: '/logos/davivienda.avif'
  },
  {
    name: 'Banco Cuscatlan',
    logo: '/logos/cuscatlan.avif'
  },
  {
    name: 'Niu',
    logo: '/logos/niu.avif'
  },
  {
    name: 'CatMedia',
    logo: '/logos/catmedia.avif'
  },
  {
    name: 'Protocolo360',
    logo: '/logos/protocolo360.avif'
  },
  {
    name: 'EMKT Company',
    logo: '/logos/emkt.avif'
  },
])

// Carousel state
const currentSlide = ref(0)
const slidesToShow = ref(5) // Default for large screens

// Responsive configuration
onMounted(() => {
  const updateSlidesToShow = () => {
    if (window.innerWidth < 640) {
      slidesToShow.value = 2
    } else if (window.innerWidth < 768) {
      slidesToShow.value = 3
    } else if (window.innerWidth < 1024) {
      slidesToShow.value = 4
    } else {
      slidesToShow.value = 5
    }
  }

  updateSlidesToShow()
  window.addEventListener('resize', updateSlidesToShow)

  onUnmounted(() => {
    window.removeEventListener('resize', updateSlidesToShow)
  })
})

// Computed properties
const slideWidth = computed(() => {
  // Calcula el porcentaje de ancho para cada slide visible
  return 100 / slidesToShow.value
})

const maxSlides = computed(() => {
  if (partners.value.length === 0) return 0;
  return Math.ceil(partners.value.length / slidesToShow.value) - 1;
})

// Carousel methods
const nextSlide = () => {
  if (currentSlide.value < maxSlides.value) {
    currentSlide.value++
  } else {
    currentSlide.value = 0 // Loop back to start
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = maxSlides.value // Loop to end
  }
}

// Auto-play carousel
let autoPlayInterval = null

onMounted(() => {
  // Start auto-play only if there are enough partners to slide
  if (partners.value.length > slidesToShow.value) {
    autoPlayInterval = setInterval(() => {
      nextSlide()
    }, 3000) // Change slide every 3 seconds
  }
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})

// Pause auto-play on hover
const pauseAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
}

const resumeAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  // Resume auto-play only if there are enough partners to slide
  if (partners.value.length > slidesToShow.value) {
    autoPlayInterval = setInterval(() => {
      nextSlide()
    }, 3000)
  }
}
</script>

<style scoped>
/* Grayscale filter for partner logos */
.filter.grayscale {
  filter: grayscale(100%);
}

.group:hover .group-hover\:grayscale-0 {
  filter: grayscale(0%);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Carousel hover effects */
.carousel-container:hover .carousel-button {
  opacity: 1;
}

.carousel-button {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 639px) {
  .grid.md\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .grid.md\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .grid.md\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

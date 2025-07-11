<template>
  <section id="campanas" class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Nuestras Campañas</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre las campañas publicitarias más exitosas que hemos gestionado 
          y los resultados extraordinarios que hemos logrado para nuestros clientes.
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">Error al cargar las campañas: {{ error.message }}</p>
        <button 
          @click="execute()"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
      
      <!-- Campaigns Carousel -->
      <div v-else-if="campaigns && campaigns.length > 0" class="relative">
        <!-- Carousel Container -->
        <div class="overflow-hidden relative">
          <div 
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }"
          >
            <div 
              v-for="campaign in campaigns" 
              :key="campaign.id"
              class="campaign-slide flex-shrink-0 px-4"
              :style="{ width: `${100 / slidesToShow}%` }"
            >
              <!-- Campaign Card -->
              <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <!-- Campaign Image -->
                <div class="relative h-48 overflow-hidden">
                  <!-- Imagen extraída del contenido o gradiente por defecto -->
                  <div 
                    v-if="getImageFromContent(campaign.description)"
                    class="absolute inset-0"
                  >
                    <img 
                      :src="getImageFromContent(campaign.description)"
                      :alt="campaign.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      @error="handleImageError"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div 
                    v-else 
                    class="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600"
                  >
                    <div class="absolute inset-0 flex items-center justify-center">
                      <Icon name="heroicons:megaphone" class="w-16 h-16 text-white opacity-50" />
                    </div>
                  </div>
                  
                  <!-- Status Badge -->
                  <div class="absolute top-4 right-4">
                    <span 
                      class="px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                      :class="getStatusClass(campaign.status)"
                    >
                      {{ getStatusText(campaign.status) }}
                    </span>
                  </div>
                </div>
                
                <!-- Campaign Content -->
                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {{ campaign.name }}
                  </h3>
                  
                  <!-- Descripción extraída del HTML -->
                  <div class="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {{ getTextFromContent(campaign.description) }}
                  </div>
                  
                  <!-- Campaign Stats -->
                  <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center p-3 bg-purple-50 rounded-lg">
                      <div class="text-lg font-bold text-purple-600">
                        {{ formatBudget(campaign.budget) }}
                      </div>
                      <div class="text-xs text-gray-500">Presupuesto</div>
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded-lg">
                      <div class="text-lg font-bold text-green-600">
                        {{ formatDate(campaign.start_date) }}
                      </div>
                      <div class="text-xs text-gray-500">Inicio</div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="flex space-x-2">
                    <button 
                      @click="viewCampaignDetail(campaign.id)"
                      class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Ver Detalle
                    </button>
                    <button 
                      @click="viewCampaignNews(campaign.id)"
                      class="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Noticias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Carousel Controls -->
        <button 
          @click="prevSlide"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white"
          :disabled="currentSlide === 0"
          :class="{ 'opacity-50 cursor-not-allowed': currentSlide === 0 }"
        >
          <Icon name="heroicons:chevron-left" class="w-5 h-5 text-gray-600" />
        </button>
        
        <button 
          @click="nextSlide"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white"
          :disabled="currentSlide >= maxSlides"
          :class="{ 'opacity-50 cursor-not-allowed': currentSlide >= maxSlides }"
        >
          <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-600" />
        </button>
        
        <!-- Carousel Indicators -->
        <div class="flex justify-center mt-8 space-x-2">
          <button
            v-for="(slide, index) in Math.ceil(campaigns.length / slidesToShow)"
            :key="index"
            @click="currentSlide = index"
            class="w-3 h-3 rounded-full transition-all duration-200"
            :class="currentSlide === index ? 'bg-purple-600 w-8' : 'bg-gray-300 hover:bg-gray-400'"
          />
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:folder-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No hay campañas disponibles en este momento</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getAllCampaigns } from '~/services/campaigns.service.js'
import { extractFirstImage, extractTextFromHtml } from '../../utils/contentUtils'

// Fetch campaigns data
const { data: campaigns, pending, error, execute } = await getAllCampaigns()

// Carousel state
const currentSlide = ref(0)
const slidesToShow = ref(3)

// Responsive slides
onMounted(() => {
  const updateSlidesToShow = () => {
    if (window.innerWidth < 768) {
      slidesToShow.value = 1
    } else if (window.innerWidth < 1024) {
      slidesToShow.value = 2
    } else {
      slidesToShow.value = 3
    }
  }
  
  updateSlidesToShow()
  window.addEventListener('resize', updateSlidesToShow)
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateSlidesToShow)
  })
})

// Computed properties
const maxSlides = computed(() => {
  if (!campaigns.value || campaigns.value.length === 0) return 0
  return Math.max(0, Math.ceil(campaigns.value.length / slidesToShow.value) - 1)
})

// Carousel methods
const nextSlide = () => {
  if (currentSlide.value < maxSlides.value) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

// Content extraction methods
const getImageFromContent = (htmlContent) => {
  return extractFirstImage(htmlContent)
}

const getTextFromContent = (htmlContent) => {
  return extractTextFromHtml(htmlContent, 120)
}

const handleImageError = (event) => {
  // Si la imagen falla al cargar, ocultar el elemento
  event.target.style.display = 'none'
}

// Helper methods
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'activo':
      return 'bg-green-500/90 text-white'
    case 'paused':
    case 'pausado':
      return 'bg-yellow-500/90 text-white'
    case 'completed':
    case 'completado':
      return 'bg-blue-500/90 text-white'
    case 'draft':
    case 'borrador':
      return 'bg-gray-500/90 text-white'
    default:
      return 'bg-gray-500/90 text-white'
  }
}

const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'Activo'
    case 'paused':
      return 'Pausado'
    case 'completed':
      return 'Completado'
    case 'draft':
      return 'Borrador'
    default:
      return status || 'Desconocido'
  }
}

const formatBudget = (budget) => {
  if (!budget) return 'N/A'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(budget)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

// Navigation methods
const viewCampaignDetail = (campaignId) => {
  console.log('Ver detalle de campaña:', campaignId)
  // navigateTo(`/campaigns/${campaignId}`)
}

const viewCampaignNews = (campaignId) => {
  console.log('Ver noticias de campaña:', campaignId)
  // navigateTo(`/campaigns/${campaignId}/news`)
}

// Auto-play carousel
let autoPlayInterval = null

onMounted(() => {
  if (campaigns.value && campaigns.value.length > slidesToShow.value) {
    autoPlayInterval = setInterval(() => {
      if (currentSlide.value >= maxSlides.value) {
        currentSlide.value = 0
      } else {
        nextSlide()
      }
    }, 5000)
  }
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.campaign-slide {
  transition: transform 0.3s ease;
}

.campaign-slide:hover {
  transform: translateY(-5px);
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .campaign-slide {
    width: 100% !important;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .campaign-slide {
    width: 50% !important;
  }
}

@media (min-width: 1024px) {
  .campaign-slide {
    width: 33.333% !important;
  }
}
</style>

<template>
  <section id="noticias" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Últimas Noticias</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Mantente al día con las últimas tendencias en publicidad digital, 
          casos de éxito y novedades del sector.
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p class="text-red-600 mb-4 text-lg">Error al cargar las noticias: {{ error.message }}</p>
        <button 
          @click="execute()"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
      
      <!-- News Grid -->
      <div v-else-if="filteredNews && filteredNews.length > 0">
        <!-- News Grid (2x2) -->
        <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
          <NewsCard
            v-for="newsItem in displayedNews"
            :key="newsItem.id"
            :news="newsItem"
            @read-more="handleReadMore"
          />
        </div>
        
        <!-- Load More Button -->
        <div v-if="filteredNews.length > displayedNews.length" class="text-center">
          <button
            @click="loadMore"
            class="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Más Noticias
            <Icon name="heroicons:arrow-down" class="w-4 h-4 ml-2 inline" />
          </button>
        </div>
        
        <!-- View All News Button -->
        <div v-else class="text-center">
          <button
            @click="viewAllNews"
            class="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver Todas las Noticias
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2 inline" />
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:newspaper" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No hay noticias disponibles en este momento</p>
        <p class="text-gray-400 text-sm mt-2">Vuelve pronto para ver las últimas novedades</p>
      </div>
      
      <!-- News Categories Filter -->
      <div v-if="categories.length > 1" class="flex justify-center mt-8">
        <div class="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-lg">
          <button
            @click="selectedCategory = null"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="selectedCategory === null 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'"
          >
            Todas
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="selectedCategory === category 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { getPublicCampaignNews } from '~/services/campaigns_news.service.js'
import NewsCard from '../components/NewsCard.vue'

// Fetch news data - only public news for landing
const { data: allNews, pending, error, execute } = await getPublicCampaignNews()

// State for pagination and filtering
const itemsPerPage = 4
const currentPage = ref(1)
const selectedCategory = ref(null)

// Computed properties
const categories = computed(() => {
  if (!allNews.value) return []
  const cats = allNews.value
    .map(news => news.category)
    .filter(Boolean)
    .filter((cat, index, arr) => arr.indexOf(cat) === index)
  return cats
})

const filteredNews = computed(() => {
  if (!allNews.value) return []
  
  let filtered = allNews.value
  
  // Filter by category if selected
  if (selectedCategory.value) {
    filtered = filtered.filter(news => news.category === selectedCategory.value)
  }
  
  // Filter only public news
  filtered = filtered.filter(news => news.is_public !== false)
  
  // Sort by date (most recent first)
  filtered.sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || 0)
    const dateB = new Date(b.published_at || b.created_at || 0)
    return dateB - dateA
  })
  
  return filtered
})

const displayedNews = computed(() => {
  const endIndex = currentPage.value * itemsPerPage
  return filteredNews.value.slice(0, endIndex)
})

// Methods
const loadMore = () => {
  currentPage.value++
}

const handleReadMore = (newsItem) => {
  console.log('Leer más:', newsItem.title)
  // navigateTo(`/news/${newsItem.id}`)
}

const viewAllNews = () => {
  console.log('Ver todas las noticias')
  // navigateTo('/news')
}

// Watch for category changes to reset pagination
watch(selectedCategory, () => {
  currentPage.value = 1
})

// Auto-refresh news every 5 minutes
let refreshInterval = null

onMounted(() => {
  refreshInterval = setInterval(() => {
    execute() 
  }, 300000) // 5 minutes
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Grid responsive adjustments */
@media (max-width: 767px) {
  .grid.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .grid.md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

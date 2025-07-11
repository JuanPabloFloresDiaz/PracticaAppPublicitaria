<template>
  <section id="oferta" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Nuestra Oferta</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Te ofrecemos servicios integrales de publicidad digital con tecnología de vanguardia 
          y estrategias personalizadas para maximizar el alcance de tu marca.
        </p>
      </div>
      
      <!-- Services Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Service 1: Digital Strategy -->
        <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
          <div class="mb-6">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:chart-bar" class="w-10 h-10 text-purple-600" />
            </div>
            <img 
              src="../../assets/photo-one.avif" 
              alt="Estrategia Digital" 
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Estrategia Digital</h3>
          <p class="text-gray-600 mb-6">
            Desarrollamos estrategias publicitarias personalizadas basadas en análisis de datos 
            y tendencias del mercado para maximizar tu ROI.
          </p>
          <ul class="text-left text-gray-600 space-y-2">
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Análisis de mercado
            </li>
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Segmentación de audiencia
            </li>
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Optimización continua
            </li>
          </ul>
        </div>
        
        <!-- Service 2: Campaign Management -->
        <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
          <div class="mb-6">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:megaphone" class="w-10 h-10 text-purple-600" />
            </div>
            <img 
              src="../../assets/photo-two.avif" 
              alt="Gestión de Campañas" 
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Gestión de Campañas</h3>
          <p class="text-gray-600 mb-6">
            Administramos tus campañas publicitarias en múltiples plataformas con 
            seguimiento en tiempo real y optimización automática.
          </p>
          <ul class="text-left text-gray-600 space-y-2">
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Gestión multiplataforma
            </li>
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Monitoreo 24/7
            </li>
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Ajustes automáticos
            </li>
          </ul>
        </div>
        
        <!-- Service 3: Analytics & Reporting -->
        <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
          <div class="mb-6">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:presentation-chart-line" class="w-10 h-10 text-purple-600" />
            </div>
            <img 
              src="../../assets/photo-tree.avif" 
              alt="Análisis y Reportes" 
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Análisis y Reportes</h3>
          <p class="text-gray-600 mb-6">
            Obten insights detallados sobre el rendimiento de tus campañas con 
            reportes personalizados y métricas avanzadas.
          </p>
          <ul class="text-left text-gray-600 space-y-2">
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Dashboard en tiempo real
            </li>
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              Reportes personalizados
            </li>
            <li class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              KPIs avanzados
            </li>
          </ul>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div class="text-center mt-12">
        <button 
          @click="scrollToSection('contacto')"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Solicita una Consultoría Gratis
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.hover\:shadow-xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>

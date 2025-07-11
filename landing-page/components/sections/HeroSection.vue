<template>
  <section id="inicio" class="hero-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white overflow-hidden">
    <!-- Background Image Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    
    <!-- Content -->
    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <h1 class="text-3xl font-extrabold sm:text-5xl mb-6">
        <span
          class="typewrite"
          data-period="5000"
          data-type='[ "Gestión publicitaria profesional. ", "Campañas efectivas y medibles. ", "Publicidad digital innovadora. ", "El futuro de la publicidad está aquí. " ]'
        >
          <span class="wrap"></span>
        </span>
      </h1>
      
      <p class="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
        Plataforma integral para la gestión y seguimiento de campañas publicitarias digitales
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="scrollToSection('campanas')"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Ver Campañas
        </button>
        <button 
          @click="scrollToSection('oferta')"
          class="border-2 border-white text-white hover:bg-white hover:text-purple-800 font-bold py-3 px-8 rounded-lg transition-all duration-300"
        >
          Conocer Más
        </button>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <Icon name="heroicons:chevron-down" class="w-6 h-6 text-white" />
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

onMounted(() => {
  // Typewriter effect
  const typewriter = document.querySelector('.typewrite');
  if (typewriter) {
    const toRotate = JSON.parse(typewriter.getAttribute('data-type'));
    const period = parseInt(typewriter.getAttribute('data-period'), 10) || 2000;
    let loopNum = 0;
    let txt = '';
    let isDeleting = false;

    const tick = () => {
      const i = loopNum % toRotate.length;
      const fullTxt = toRotate[i];

      if (isDeleting) {
        txt = fullTxt.substring(0, txt.length - 1);
      } else {
        txt = fullTxt.substring(0, txt.length + 1);
      }

      typewriter.innerHTML = '<span class="wrap">' + txt + '</span>';

      let delta = 200 - Math.random() * 100;

      if (isDeleting) { delta /= 2; }

      if (!isDeleting && txt === fullTxt) {
        delta = period;
        isDeleting = true;
      } else if (isDeleting && txt === '') {
        isDeleting = false;
        loopNum++;
        delta = 500;
      }

      setTimeout(tick, delta);
    };

    tick();
  }
});
</script>

<style scoped>
.hero-section {
  background-image: url("../../assets/hero-1.webp");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.typewrite > .wrap {
  border-right: 0.08em solid #fff;
  animation: blink-caret 0.75s step-end infinite;
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #fff; }
}
</style>

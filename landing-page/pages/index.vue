    <template>
      <div class="min-h-screen">
        <!-- Header with Navigation -->
        <Header />

        <!-- Main Content -->
        <main>
          <!-- Hero Section -->
          <HeroSection />

          <!-- Offer Section -->
          <OfferSection />

          <!-- Campaigns Section -->
          <CampaignsSection />

          <!-- News Section -->
          <NewsSection />

          <!-- Partners/Alliances Section -->
          <PartnersSection />

          <!-- Support Section -->
          <SupportSection />

          <!-- Contact Section -->
          <ContactSection />
        </main>

        <!-- Footer -->
        <Footer />
      </div>
    </template>

<script setup>
// Import all section components
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import HeroSection from '~/components/sections/HeroSection.vue'
import OfferSection from '~/components/sections/OfferSection.vue'
import CampaignsSection from '~/components/sections/CampaignsSection.vue'
import NewsSection from '~/components/sections/NewsSection.vue'
import PartnersSection from '~/components/sections/PartnersSection.vue'
import SupportSection from '~/components/sections/SupportSection.vue'
import ContactSection from '~/components/sections/ContactSection.vue'

// Page SEO meta
useSeoMeta({
  title: 'Publicate - Plataforma Integral de Publicidad Digital',
  ogTitle: 'Publicate - Plataforma Integral de Publicidad Digital',
  description: 'Gestión profesional de campañas publicitarias digitales. Maximiza tu ROI con nuestra plataforma integral de publicidad y marketing digital.',
  ogDescription: 'Gestión profesional de campañas publicitarias digitales. Maximiza tu ROI con nuestra plataforma integral de publicidad y marketing digital.',
  ogImage: '/favicon.svg',
  twitterCard: 'summary_large_image',
  keywords: 'publicidad digital, marketing digital, campañas publicitarias, gestión publicitaria, ROI, plataforma publicitaria'
})

// JSON-LD Structured Data for SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Publicate',
        url: 'https://publicate.com',
        logo: '/favicon.svg',
        description: 'Plataforma integral para la gestión y seguimiento de campañas publicitarias digitales',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+503 6029-4296',
          contactType: 'Customer Service',
          email: 'info@publicate.com'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Calle de la Innovación, 123',
          addressLocality: 'Madrid',
          postalCode: '28001',
          addressCountry: 'ES'
        },
        sameAs: [
          'https://linkedin.com/company/publicate',
          'https://twitter.com/publicate',
          'https://facebook.com/publicate',
          'https://instagram.com/publicate'
        ]
      })
    }
  ]
})

// Smooth scroll behavior for the entire page
onMounted(() => {
  // Add smooth scrolling to html element
  document.documentElement.style.scrollBehavior = 'smooth'

  // Animate elements on scroll (optional)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in')
      }
    })
  }, observerOptions)

  // Observe all sections
  const sections = document.querySelectorAll('section')
  sections.forEach(section => observer.observe(section))
})
</script>

<style>
/* Global styles for smooth animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for the page */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #9333ea;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}

/* Improve readability */
body {
  line-height: 1.6;
  color: #374151;
}

/* Focus styles for accessibility */
button:focus,
a:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #9333ea;
  outline-offset: 2px;
}

/* Preload critical fonts */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
}
</style>

<style scoped>
h1 {
  color: #333;
}
</style>

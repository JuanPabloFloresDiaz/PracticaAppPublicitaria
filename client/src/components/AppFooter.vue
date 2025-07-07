<template>
  <v-footer app height="40" class="d-flex align-center justify-center">
    <a v-for="item in items" :key="item.title" class="d-inline-block mx-2 social-link" :href="item.href"
      rel="noopener noreferrer" target="_blank" :title="item.title">
      <v-icon :icon="item.icon" :size="24" />
    </a>
    <div class="text-caption text-disabled" style="position: absolute; right: 16px;">
      &copy; {{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Publicate</span>
      — Hecho con ❤️ para un proyecto de práctica.
    </div>
  </v-footer>
</template>

<script setup>
const items = [
  {
    title: 'Repositorio de esta App en GitHub',
    icon: `mdi-github`,
    href: 'https://github.com/JuanPabloFloresDiaz/PracticaAppPublicitaria',
  },
  {
    title: 'Mi perfil de LinkedIn',
    icon: `mdi-linkedin`,
    href: 'https://www.linkedin.com/in/juan-pablo-flores-d%C3%ADaz-5271b533a/',
  },
  {
    title: 'Vuetify Documentation',
    icon: `$vuetify`,
    href: 'https://vuetifyjs.com/',
  },
  {
    title: 'Vuetify GitHub',
    icon: `mdi-github`,
    href: 'https://github.com/vuetifyjs/vuetify',
  },
];
</script>

<style scoped lang="sass">
  // Estilos para los enlaces sociales y sus iconos
  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1) // Color azul de ejemplo al pasar el ratón
</style>

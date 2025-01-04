export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'elevenlabs-convai',
    },
  },

  compatibilityDate: '2024-12-24',

  // Configurarea head pentru favicon și alte meta-informații
  app: {
    head: {
      title: 'Citiri de Tarot', // Titlul aplicației
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Aplicație pentru citiri de tarot' },
      ],
      link: [
        // Adaugă favicon-ul SVG
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // (opțional) fallback pentru browsere vechi
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '32x32' },
      ],
    },
  },
});

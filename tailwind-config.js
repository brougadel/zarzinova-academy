/* Configuration Tailwind (CDN) partagée par toutes les pages — charte tirée du logo Zarzinova :
   bleu ciel #87CEEB (lettres), or #D6CC74 (devise), trait noir (ampoule), Space Mono (esprit de la typo du logo). */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins','system-ui','sans-serif'], brand: ['"Space Mono"','ui-monospace','monospace'], ar: ['Cairo','Tahoma','sans-serif'] },
      colors: {
        bg:'var(--bg)', ink:'var(--ink)', soft:'var(--soft)', card:'var(--card)', line:'var(--line)', mist:'var(--mist)',
        sky:'#87ceeb', skydeep:'var(--skydeep)', indigo:'var(--indigo)', night:'#141b45', emerald:'var(--emerald)', gold:'#d6cc74', goldtext:'var(--goldtext)'
      },
      maxWidth: { site:'1240px' }
    }
  }
};

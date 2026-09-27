/**
 * Diccionario de chrome en español (es) — cadenas de interfaz para Ptah Tours.
 * Traducción automática; refleja en.ts por índice (mismas claves, mismas
 * longitudes de array). Solo cambian los valores de texto; la estructura es idéntica.
 */
import type { Dictionary } from "./en";

export const es = {
  common: {
    home: "inicio",
    openInNewTab: "se abre en una pestaña nueva",
  },
  skip: {
    toContent: "Saltar al contenido principal",
  },
  header: {
    quickLinksAria: "Enlaces rápidos",
    primaryAria: "Principal",
    mobileNavAria: "Sitio (móvil)",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    trackBooking: "Sigue tu reserva",
    viewBookmarks: "Ver tus favoritos",
  },
  search: {
    triggerAria: "Buscar",
    dialogAria: "Buscar en Ptah Tours",
    closeAria: "Cerrar búsqueda",
    inputAria: "Buscar viajes, destinos e historias",
    placeholder: "Pirámides, crucero por el Nilo, Alejandría…",
    popular: "Búsquedas populares",
  },
  bookmarks: {
    title: "Ver tus favoritos",
    one: "Tienes 1 favorito",
    other: "Tienes {count} favoritos",
  },
  nav: {
    quickLinks: ["Eventos y festivales", "Cuándo visitar", "Reserva tu eVisa", "Mi cuenta"],
    directLinks: ["Destinos", "Ideas de viaje", "Galería"],
    buildTrip: "Planifica mi viaje",
    popularSearches: [
      "Pirámides de Guiza",
      "Crucero por el Nilo",
      "Globo aerostático en Luxor",
      "Esnórquel en Ras Mohamed",
      "Tour privado por El Cairo",
      "Navidad en Egipto",
    ],
    sections: [
      {
        title: "Sobre Egipto",
        columns: [
          { heading: "Destinos", links: ["El Cairo", "Luxor", "Asuán", "Alejandría", "Hurgada", "Sharm el-Sheij"] },
          { heading: "Conoce el territorio", links: ["Historia y patrimonio", "Estaciones y clima", "El Nilo", "Desiertos y oasis", "Arrecifes del mar Rojo"] },
          { heading: "Información útil", links: ["Viajes responsables", "Accesibilidad", "Seguridad y asistencia", "Historias y diario"] },
        ],
        imageCtas: [
          { label: "Destino en profundidad", heading: "La antigua Tebas" },
          { label: "Litorales", heading: "Descubre el mar Rojo" },
          { label: "Desde el terreno", heading: "Lee el diario" },
        ],
      },
      {
        title: "Planifica tu viaje",
        columns: [
          { heading: "Cómo llegar", links: ["Vuelos a Egipto", "Visados y entrada", "Días de llegada, resueltos", "Cómo moverse"] },
          { heading: "Decidir", links: ["Cuándo visitar", "Cuántos días", "Presupuesto y propinas", "Viajar con niños"] },
          { heading: "Nuestra promesa", links: ["Cómo funcionan los viajes de Ptah", "Viajes responsables", "Opiniones y acreditación", "Contacta con el equipo"] },
        ],
        imageCtas: [
          { label: "Consulta gratuita", heading: "Habla con un egiptólogo" },
          { label: "Explorar", heading: "Todos los tours de Ptah Tours" },
          { label: "Inspiración", heading: "Encuentra ideas de viaje" },
        ],
      },
      {
        title: "Tours",
        columns: [
          { heading: "Por estilo", links: ["Egipto clásico", "Cruceros por el Nilo", "Mar Rojo y playa", "Aventuras en el desierto"] },
          { heading: "Por duración", links: ["Tours de un día", "Viajes de 2 a 4 días", "Viajes de 5 a 9 días", "Expediciones de más de 10 días"] },
          { heading: "Especiales", links: ["Privados y a medida", "Viajes en familia", "Lunas de miel", "Salidas de última hora"] },
        ],
        imageCtas: [
          { label: "Viaje emblemático", heading: "Egipto clásico, 8 días" },
          { label: "En el río", heading: "Colección de cruceros por el Nilo" },
          { label: "Bajo el agua", heading: "Viajes de buceo y esnórquel" },
        ],
      },
    ],
  },
  footer: {
    newsletterAria: "Mantente conectado",
    columnsAria: "Pie de página",
    followAria: "Sigue a {siteName}",
    newsletter: {
      heading: "¡Suscríbete!",
      blurb: "Ideas de viaje, salidas de temporada y alguna que otra crónica del desierto: unas pocas veces al mes, sin spam.",
      ctaLabel: "Suscríbete a nuestro boletín electrónico",
    },
    columns: [
      { heading: "Ptah Tours", links: ["Sobre nosotros", "Nuestros egiptólogos", "Empleo", "Prensa y medios", "Contáctanos"] },
      { heading: "Viaja con nosotros", links: ["Todos los tours", "Ideas de viaje", "Cruceros por el Nilo", "Viajes privados", "Viajes responsables", "Galería de fotos"] },
      { heading: "Ayuda e información", links: ["Cuándo visitar", "Visados y entrada", "Sigue mi reserva", "Salud y seguridad", "Preguntas frecuentes"] },
    ],
    badgeHeading: "Avalado por",
    badgeSubs: ["Miembro 2026", "Socio"],
    partnersHeading: "Socios de viaje",
    partnerTaglines: ["Aerolínea oficial asociada", "Agente acreditado", "Autoridad de Turismo de Egipto"],
    legalLinks: ["Política de privacidad", "Términos y condiciones", "Política de cookies"],
    copyrightLine: "© {year} Ptah Tours. Todos los derechos reservados.",
    acknowledgement:
      "Ptah Tours tiene su sede en El Cairo y opera por todo Egipto: el valle del Nilo, el Delta, el Sinaí y el Desierto Occidental. Viajamos con egiptólogos titulados, pagamos de forma justa a nuestros equipos y planificamos cada itinerario para dar a las comunidades y a los sitios patrimoniales de Egipto más de lo que tomamos de ellos.",
  },
  cookie: {
    regionAria: "Consentimiento de cookies",
    heading: "Valoramos tu privacidad",
    copy: "Usamos cookies para mejorar tu experiencia de navegación, ofrecer contenido personalizado y analizar nuestro tráfico. Al hacer clic en Aceptar todo, aceptas nuestro uso de cookies. Puedes cambiar de opinión en cualquier momento desde el pie de página.",
    manageHeading: "Gestiona tus preferencias de cookies",
    acceptAll: "Aceptar todo",
    manage: "Gestionar",
    rejectAll: "Rechazar todo",
    saveChoices: "Guardar mis preferencias",
    necessaryName: "Estrictamente necesarias",
    necessaryDesc: "Necesarias para la seguridad, el almacenamiento del consentimiento y los procesos básicos de reserva. Siempre activas.",
    categories: [
      { name: "Preferencias", description: "Recuerdan opciones como el idioma, la moneda y tus viajes guardados en favoritos." },
      { name: "Analíticas", description: "Estadísticas anónimas que nos ayudan a entender qué viajes y páginas prefieren los viajeros." },
      { name: "Marketing", description: "Miden nuestras campañas y muestran contenido más relevante de Ptah Tours en otros sitios." },
    ],
    manageButtonLong: "Gestionar sus ",
    manageButtonShort: "Cookies",
  },
} satisfies Dictionary;

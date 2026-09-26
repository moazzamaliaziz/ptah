import type { Locale } from "@/i18n/config";

/**
 * Self-contained copy for the PWA install and update prompts (spec §3, D3),
 * localized for all six supported locales. Kept separate from the public-site
 * dictionary so the PWA UI has complete translations regardless of the wider
 * i18n copy rollout. Client components receive only the plain strings they need.
 */
export interface PwaStrings {
  install: {
    title: string;
    body: string;
    action: string;
    dismiss: string;
    /** iOS/iPadOS Safari has no beforeinstallprompt — show manual steps. */
    iosHint: string;
  };
  update: {
    body: string;
    action: string;
    dismiss: string;
  };
}

const STRINGS: Record<Locale, PwaStrings> = {
  en: {
    install: {
      title: "Install Ptah Tours",
      body: "Add our app to your home screen for a faster, full-screen experience.",
      action: "Install",
      dismiss: "Not now",
      iosHint: "To install: tap the Share button, then “Add to Home Screen”.",
    },
    update: { body: "A new version is available.", action: "Refresh", dismiss: "Dismiss" },
  },
  ar: {
    install: {
      title: "ثبّت تطبيق بتاح تورز",
      body: "أضف تطبيقنا إلى شاشتك الرئيسية لتجربة أسرع وبملء الشاشة.",
      action: "تثبيت",
      dismiss: "ليس الآن",
      iosHint: "للتثبيت: اضغط زر المشاركة، ثم «أضف إلى الشاشة الرئيسية».",
    },
    update: {
      body: "يتوفّر إصدار جديد.",
      action: "تحديث",
      dismiss: "إغلاق",
    },
  },
  fr: {
    install: {
      title: "Installer Ptah Tours",
      body: "Ajoutez notre application à votre écran d’accueil pour une expérience plus rapide et en plein écran.",
      action: "Installer",
      dismiss: "Plus tard",
      iosHint: "Pour installer : appuyez sur le bouton Partager, puis « Sur l’écran d’accueil ».",
    },
    update: { body: "Une nouvelle version est disponible.", action: "Actualiser", dismiss: "Fermer" },
  },
  de: {
    install: {
      title: "Ptah Tours installieren",
      body: "Fügen Sie unsere App zu Ihrem Startbildschirm hinzu – für ein schnelleres Vollbild-Erlebnis.",
      action: "Installieren",
      dismiss: "Später",
      iosHint: "Zum Installieren: auf „Teilen“ tippen, dann „Zum Home-Bildschirm“.",
    },
    update: { body: "Eine neue Version ist verfügbar.", action: "Aktualisieren", dismiss: "Schließen" },
  },
  es: {
    install: {
      title: "Instalar Ptah Tours",
      body: "Añade nuestra app a tu pantalla de inicio para una experiencia más rápida y a pantalla completa.",
      action: "Instalar",
      dismiss: "Ahora no",
      iosHint: "Para instalar: toca el botón Compartir y luego «Añadir a pantalla de inicio».",
    },
    update: { body: "Hay una nueva versión disponible.", action: "Actualizar", dismiss: "Cerrar" },
  },
  it: {
    install: {
      title: "Installa Ptah Tours",
      body: "Aggiungi la nostra app alla schermata Home per un’esperienza più veloce e a schermo intero.",
      action: "Installa",
      dismiss: "Non ora",
      iosHint: "Per installare: tocca il pulsante Condividi, poi «Aggiungi a Home».",
    },
    update: { body: "È disponibile una nuova versione.", action: "Aggiorna", dismiss: "Chiudi" },
  },
};

export function getPwaStrings(locale: Locale): PwaStrings {
  return STRINGS[locale] ?? STRINGS.en;
}

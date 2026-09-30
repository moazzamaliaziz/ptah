/**
 * Russian PWA install/update strings — mirrors the PwaStrings shape in
 * src/i18n/pwa.ts. iosHint uses « » guillemets (inner label „…" ) per the
 * Russian brief. Brand rendered as Птах Турс in prose.
 */
import type { PwaStrings } from "@/i18n/pwa";

export const pwaRu: PwaStrings = {
  install: {
    title: "Установить Птах Турс",
    body: "Добавьте наше приложение на главный экран для более быстрой работы в полноэкранном режиме.",
    action: "Установить",
    short: "Установить приложение",
    dismiss: "Не сейчас",
    iosHint: "Чтобы установить, нажмите кнопку «Поделиться», затем «На экран „Домой“».",
  },
  update: {
    body: "Доступна новая версия.",
    action: "Обновить",
    dismiss: "Закрыть",
  },
};

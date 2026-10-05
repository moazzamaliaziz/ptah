/**
 * Centralized admin-UI dictionary (Wave 5) — English + Arabic.
 *
 * This is the BARREL: it composes one focused module per area (see
 * `./dictionaries/*`) into a single `AdminDict`. Typing `en` and `ar` against
 * `AdminDict` forces every key to exist in BOTH languages, so a missing Arabic
 * string is a compile error, not a silent English fallback. Each module is
 * itself typed the same way, so completeness is enforced slice-by-slice too.
 *
 * Pure/dependency-free so both the server layout and the client-free switcher
 * can import it. Interpolated/counted phrases are small functions so call sites
 * stay tidy and each language controls its own word order.
 */
import type { AdminLocale } from "./config";
import { navEn, navAr, chromeEn, chromeAr, type NavDict, type ChromeDict } from "./dictionaries/chrome";
import { statusEn, statusAr, type StatusDict } from "./dictionaries/status";
import { commonEn, commonAr, type CommonDict } from "./dictionaries/common";
import { dashboardEn, dashboardAr, type DashboardDict } from "./dictionaries/dashboard";
import { ordersEn, ordersAr, type OrdersDict } from "./dictionaries/orders";
import { reportsEn, reportsAr, type ReportsDict, type ReportsChartsDict, type ReportsCsvDict } from "./dictionaries/reports";
import { enquiriesEn, enquiriesAr, type EnquiriesDict } from "./dictionaries/enquiries";
import { couponsEn, couponsAr, type CouponsDict, type CouponFormDict } from "./dictionaries/coupons";
import { authEn, authAr, type AuthDict } from "./dictionaries/auth";
import { errorsEn, errorsAr, type ErrorsDict } from "./dictionaries/errors";
import { contentEn, contentAr, type ContentDict, type ContentEditorLabels } from "./dictionaries/content";
import { destinationsEn, destinationsAr, type DestinationsDict, type DestinationFormDict } from "./dictionaries/destinations";
import { eventsEn, eventsAr, type EventsDict, type EventFormFieldsDict } from "./dictionaries/events";
import { toursEn, toursAr, type ToursDict, type TourFormFieldsDict, type FaqEditorDict, type ItinerarySectionDict, type DeparturesSectionDict } from "./dictionaries/tours";
import { tripIdeasEn, tripIdeasAr, type TripIdeasDict, type TripIdeaFormFieldsDict } from "./dictionaries/trip-ideas";
import { widgetsEn, widgetsAr, type WidgetsDict, type WidgetEditorDict } from "./dictionaries/widgets";
import { translationsEn, translationsAr, type TranslationsDict, type TranslationEditorDict } from "./dictionaries/translations";
import { mediaEn, mediaAr, mediaPickerEn, mediaPickerAr, type MediaDict, type MediaUploadDict, type MediaPickerDict } from "./dictionaries/media";
import { brandingEn, brandingAr, type BrandingDict, type BrandingEditorDict, type SocialsEditorDict } from "./dictionaries/branding";
import { integrationsEn, integrationsAr, type IntegrationsDict, type PaypalTestDict } from "./dictionaries/integrations";
import { togglesEn, togglesAr, type TogglesDict } from "./dictionaries/toggles";
import { paymentsEn, paymentsAr, type PaymentsDict, type PaymentsEditorDict } from "./dictionaries/payments";

export interface AdminDict {
  nav: NavDict;
  chrome: ChromeDict;
  status: StatusDict;
  common: CommonDict;
  dashboard: DashboardDict;
  orders: OrdersDict;
  reports: ReportsDict;
  enquiries: EnquiriesDict;
  coupons: CouponsDict;
  auth: AuthDict;
  errors: ErrorsDict;
  content: ContentDict;
  destinations: DestinationsDict;
  events: EventsDict;
  tours: ToursDict;
  tripIdeas: TripIdeasDict;
  widgets: WidgetsDict;
  translations: TranslationsDict;
  media: MediaDict;
  mediaPicker: MediaPickerDict;
  branding: BrandingDict;
  integrations: IntegrationsDict;
  toggles: TogglesDict;
  payments: PaymentsDict;
}

// Re-export the slice types so client islands can type a narrow prop
// (e.g. `dict: DashboardDict`) without importing the whole barrel graph.
export type { NavDict, ChromeDict, StatusDict, CommonDict, DashboardDict, OrdersDict, ReportsDict, ReportsChartsDict, ReportsCsvDict, EnquiriesDict, CouponsDict, CouponFormDict, AuthDict, ErrorsDict, ContentDict, ContentEditorLabels, DestinationsDict, DestinationFormDict, EventsDict, EventFormFieldsDict, ToursDict, TourFormFieldsDict, FaqEditorDict, ItinerarySectionDict, DeparturesSectionDict, TripIdeasDict, TripIdeaFormFieldsDict, WidgetsDict, WidgetEditorDict, TranslationsDict, TranslationEditorDict, MediaDict, MediaUploadDict, MediaPickerDict, BrandingDict, BrandingEditorDict, SocialsEditorDict, IntegrationsDict, PaypalTestDict, TogglesDict, PaymentsDict, PaymentsEditorDict };

const en: AdminDict = {
  nav: navEn,
  chrome: chromeEn,
  status: statusEn,
  common: commonEn,
  dashboard: dashboardEn,
  orders: ordersEn,
  reports: reportsEn,
  enquiries: enquiriesEn,
  coupons: couponsEn,
  auth: authEn,
  errors: errorsEn,
  content: contentEn,
  destinations: destinationsEn,
  events: eventsEn,
  tours: toursEn,
  tripIdeas: tripIdeasEn,
  widgets: widgetsEn,
  translations: translationsEn,
  media: mediaEn,
  mediaPicker: mediaPickerEn,
  branding: brandingEn,
  integrations: integrationsEn,
  toggles: togglesEn,
  payments: paymentsEn,
};

const ar: AdminDict = {
  nav: navAr,
  chrome: chromeAr,
  status: statusAr,
  common: commonAr,
  dashboard: dashboardAr,
  orders: ordersAr,
  reports: reportsAr,
  enquiries: enquiriesAr,
  coupons: couponsAr,
  auth: authAr,
  errors: errorsAr,
  content: contentAr,
  destinations: destinationsAr,
  events: eventsAr,
  tours: toursAr,
  tripIdeas: tripIdeasAr,
  widgets: widgetsAr,
  translations: translationsAr,
  media: mediaAr,
  mediaPicker: mediaPickerAr,
  branding: brandingAr,
  integrations: integrationsAr,
  toggles: togglesAr,
  payments: paymentsAr,
};

export const adminDictionaries: Record<AdminLocale, AdminDict> = { en, ar };

/** The full dictionary for a locale. Server components read it and pass the
 *  needed strings (or a slice) down to any client islands. */
export function getAdminDict(locale: AdminLocale): AdminDict {
  return adminDictionaries[locale];
}

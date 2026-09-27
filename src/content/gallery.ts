/**
 * Real-customer trip photography (the "Real travelers, real moments" landing
 * carousel, the About photo band, and the /gallery masonry).
 *
 * These are genuine guest + destination photos supplied by the client, batch-
 * optimized into /public/assets/gallery/**.webp by scripts/optimize-gallery.mjs
 * (which also emits the exact width/height baked in below). This is a STATIC
 * content module read directly by the components — it deliberately bypasses the
 * zod-validated CMS override pipeline in src/server/content.ts (that pipeline is
 * scoped to the 7 editable landing sections; adding photos there would need a
 * new schema + admin surface, which is out of scope here).
 *
 * Category IDs are stable/opaque; their human labels are localized per-locale in
 * the page dictionaries (enPages.gallery.filters + mirrors). Alt text is written
 * per photo (accessibility) and stays English — descriptive, never invented
 * names.
 */

export type GalleryCategory =
  | "guests"
  | "temples"
  | "sinai-desert"
  | "nile-nubia";

export interface GalleryPhoto {
  /** Path under /public — e.g. "/assets/gallery/guests-01.webp". */
  src: string;
  /** Descriptive English alt text (required; no "image of" prefix). */
  alt: string;
  category: GalleryCategory;
  /** Intrinsic pixel dimensions of the optimized WebP (from gallery-dims.json). */
  width: number;
  height: number;
  /** Hand-picked hero shots surfaced in the landing carousel + About band. */
  featured?: boolean;
}

/** Tab order on /gallery (an implicit "All" tab is prepended by the grid). */
export const galleryCategoryOrder: GalleryCategory[] = [
  "guests",
  "temples",
  "sinai-desert",
  "nile-nubia",
];

// DATA: populated from the photo catalog + gallery-dims.json (see script).
export const galleryPhotos: GalleryPhoto[] = [
  { src: "/assets/gallery/guests-01.webp", alt: "Four travelers sharing drinks and a meal at a desert Bedouin-style camp", category: "guests", width: 1600, height: 900, featured: true },
  { src: "/assets/gallery/temples-01.webp", alt: "Carved columns of the Great Hypostyle Hall at Karnak Temple, Luxor", category: "temples", width: 960, height: 1280 },
  { src: "/assets/gallery/nile-nubia-01.webp", alt: "Brightly painted Nubian village houses near Aswan", category: "nile-nubia", width: 929, height: 1210 },
  { src: "/assets/gallery/sinai-desert-01.webp", alt: "The narrow sandstone walls of the Colored Canyon in Sinai", category: "sinai-desert", width: 1600, height: 1200 },
  { src: "/assets/gallery/guests-02.webp", alt: "An Egyptian guide explaining ancient wall reliefs to a traveler at a Luxor temple", category: "guests", width: 1200, height: 1600 },
  { src: "/assets/gallery/temples-02.webp", alt: "The Sharm El-Sheikh Museum exterior with pharaonic statues and an Egyptian flag", category: "temples", width: 1200, height: 630 },
  { src: "/assets/gallery/nile-nubia-02.webp", alt: "A Nubian cafe terrace overlooking the Nile with rowboats near Aswan", category: "nile-nubia", width: 1080, height: 1031 },
  { src: "/assets/gallery/sinai-desert-02.webp", alt: "A Bedouin desert camp with a lit tent and floor cushions around a carpet at dusk", category: "sinai-desert", width: 1000, height: 500 },
  { src: "/assets/gallery/guests-03.webp", alt: "A tour group taking a selfie in front of the Temple of Hatshepsut, Luxor", category: "guests", width: 1280, height: 960 },
  { src: "/assets/gallery/temples-03.webp", alt: "A painted ancient Egyptian ceiling relief with a bull and star symbols", category: "temples", width: 640, height: 429 },
  { src: "/assets/gallery/nile-nubia-03.webp", alt: "Colorful Nubian village houses on a hillside at sunset near Aswan", category: "nile-nubia", width: 1013, height: 1204 },
  { src: "/assets/gallery/sinai-desert-03.webp", alt: "Tourists gathered around a campfire at a Bedouin desert camp at dusk", category: "sinai-desert", width: 499, height: 375 },
  { src: "/assets/gallery/guests-04.webp", alt: "A traveler posing before the colossal Ramesses II statue at the Grand Egyptian Museum", category: "guests", width: 1200, height: 1600 },
  { src: "/assets/gallery/temples-04.webp", alt: "Colorful painted reliefs on the walls and ceiling of an ancient Egyptian temple", category: "temples", width: 720, height: 480 },
  { src: "/assets/gallery/nile-nubia-04.webp", alt: "A felucca with a turquoise sail on the Nile", category: "nile-nubia", width: 1242, height: 932 },
  { src: "/assets/gallery/guests-05.webp", alt: "A family posing with their Egyptian guide in front of Luxor Temple", category: "guests", width: 1200, height: 1600, featured: true },
  { src: "/assets/gallery/temples-05.webp", alt: "A painted blue relief of a solar barque and deities in an ancient temple", category: "temples", width: 720, height: 537 },
  { src: "/assets/gallery/nile-nubia-05.webp", alt: "A blue-painted Nubian-style village house with decorated steps at dusk", category: "nile-nubia", width: 1080, height: 969 },
  { src: "/assets/gallery/guests-06.webp", alt: "A traveler at King Khufu's solar boat exhibit, Grand Egyptian Museum", category: "guests", width: 1280, height: 960 },
  { src: "/assets/gallery/temples-06.webp", alt: "A painted blue relief of a winged creature and two deities in an ancient temple", category: "temples", width: 697, height: 604 },
  { src: "/assets/gallery/nile-nubia-06.webp", alt: "A decorated Nubian-style guest house entrance framed by a leafy tree", category: "nile-nubia", width: 1080, height: 1156 },
  { src: "/assets/gallery/guests-07.webp", alt: "A large tour group in front of the Temple of Hatshepsut, Luxor", category: "guests", width: 1280, height: 960, featured: true },
  { src: "/assets/gallery/temples-07.webp", alt: "Visitors viewing carved reliefs on a temple wall at Medinet Habu, Luxor", category: "temples", width: 1024, height: 768 },
  { src: "/assets/gallery/guests-08.webp", alt: "Two travelers posing with their guide beside carved temple reliefs in Luxor", category: "guests", width: 1200, height: 1600 },
  { src: "/assets/gallery/temples-08.webp", alt: "A painted blue relief with a sphinx, falcon and serpent in an ancient temple", category: "temples", width: 720, height: 435 },
  { src: "/assets/gallery/guests-09.webp", alt: "Smiling travelers taking a selfie with their guide among Karnak's columns", category: "guests", width: 1242, height: 932, featured: true },
  { src: "/assets/gallery/temples-09.webp", alt: "The ornate painted ceiling and Hathor columns of the Temple of Hathor at Dendera", category: "temples", width: 720, height: 480 },
  { src: "/assets/gallery/guests-10.webp", alt: "Travelers relaxing on a Nile felucca at sunset", category: "guests", width: 723, height: 960 },
  { src: "/assets/gallery/temples-10.webp", alt: "Towering Hathor-headed columns inside the Temple of Hathor at Dendera", category: "temples", width: 655, height: 924 },
  { src: "/assets/gallery/guests-11.webp", alt: "A traveler and guide posing by carved battle reliefs at Medinet Habu, Luxor", category: "guests", width: 1200, height: 1600 },
  { src: "/assets/gallery/temples-11.webp", alt: "A painted blue relief of deities around a solar barque, Dendera Temple ceiling", category: "temples", width: 720, height: 480 },
  { src: "/assets/gallery/guests-12.webp", alt: "Four travelers smiling for a sunny selfie at a Luxor temple", category: "guests", width: 1024, height: 768, featured: true },
  { src: "/assets/gallery/temples-12.webp", alt: "A couple posing between the Colossi of Memnon under a clear blue sky, Luxor", category: "temples", width: 1024, height: 768, featured: true },
  { src: "/assets/gallery/guests-13.webp", alt: "Travelers posing with their Egyptian guide outside a museum entrance", category: "guests", width: 1242, height: 932 },
  { src: "/assets/gallery/temples-13.webp", alt: "A painted relief of falcon-headed figures on a blue temple wall, Dendera", category: "temples", width: 720, height: 398 },
  { src: "/assets/gallery/guests-14.webp", alt: "A family taking a selfie in front of the Temple of Hatshepsut, Luxor", category: "guests", width: 1242, height: 932, featured: true },
  { src: "/assets/gallery/temples-14.webp", alt: "Vividly painted columns and ceiling of the hypostyle hall at Dendera Temple", category: "temples", width: 720, height: 856 },
  { src: "/assets/gallery/guests-15.webp", alt: "Two travelers and a local guide smiling for a selfie at a temple at sunset", category: "guests", width: 1242, height: 932, featured: true },
  { src: "/assets/gallery/temples-15.webp", alt: "A painted relief of a goddess raising the star-filled sky, Dendera Temple", category: "temples", width: 480, height: 465 },
  { src: "/assets/gallery/guests-16.webp", alt: "Two travelers seated on the bow of a traditional boat on the Nile", category: "guests", width: 720, height: 1280, featured: true },
  { src: "/assets/gallery/temples-16.webp", alt: "A painted astronomical relief with a hippopotamus goddess and animals, Dendera Temple", category: "temples", width: 657, height: 960 },
  { src: "/assets/gallery/guests-17.webp", alt: "Tourists admiring the giant columns of the Great Hypostyle Hall at Karnak, Luxor", category: "guests", width: 720, height: 960, featured: true },
  { src: "/assets/gallery/temples-17.webp", alt: "A painted relief of the sky goddess lifting a winged scarab and stars, Dendera", category: "temples", width: 720, height: 686 },
  { src: "/assets/gallery/guests-18.webp", alt: "Tourists walking past a colossal pharaoh statue at Karnak Temple, Luxor", category: "guests", width: 960, height: 1280 },
  { src: "/assets/gallery/temples-18.webp", alt: "Rows of painted figures and hieroglyphs on a blue temple ceiling, Dendera", category: "temples", width: 720, height: 480 },
  { src: "/assets/gallery/temples-19.webp", alt: "The avenue of ram-headed sphinxes leading to the first pylon of Karnak Temple, Luxor", category: "temples", width: 960, height: 1280 },
  { src: "/assets/gallery/temples-20.webp", alt: "The terraced Temple of Hatshepsut beneath desert cliffs at Deir el-Bahari, Luxor", category: "temples", width: 960, height: 1280 },
  { src: "/assets/gallery/temples-21.webp", alt: "Tourists on the ram-sphinx avenue leading to Karnak Temple's first pylon, Luxor", category: "temples", width: 1280, height: 960 },
];

/** Featured subset, in gallery order, for the landing carousel + About band. */
export const featuredPhotos: GalleryPhoto[] = galleryPhotos.filter((p) => p.featured);

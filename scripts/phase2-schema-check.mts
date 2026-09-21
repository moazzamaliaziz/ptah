/**
 * Phase 2 audit — verify the tightened landing schemas (safeUrl href guard):
 *   1. every SSOT default section still parses (no regression), and
 *   2. a javascript:/protocol-relative href is now rejected (fix works).
 *
 * Run: npx tsx scripts/phase2-schema-check.mts
 */
import { landingSchemas } from "../src/content/landing-schema";
import {
  fiftyCtas, heroSlides, inspiredTabs, kbygItems, planCta, stories, tourTypes,
} from "../src/content/landing";

let fail = 0;
const ok = (name: string, cond: boolean) => {
  console.log(`${cond ? "✓" : "✗"} ${name}`);
  if (!cond) fail++;
};

// 1. Defaults must all validate against their schemas.
ok("hero default parses", landingSchemas.hero.safeParse(heroSlides).success);
ok("getInspired default parses", landingSchemas.getInspired.safeParse(inspiredTabs).success);
ok("planCta default parses", landingSchemas.planCta.safeParse(planCta).success);
ok("fiftyCtas default parses", landingSchemas.fiftyCtas.safeParse(fiftyCtas).success);
ok("kbyg default parses", landingSchemas.kbyg.safeParse(kbygItems).success);
ok("tourTypes default parses", landingSchemas.tourTypes.safeParse(tourTypes).success);
ok("stories default parses", landingSchemas.stories.safeParse(stories).success);

// 2. A javascript: href in a tourType must now be REJECTED.
const evilTourTypes = JSON.parse(JSON.stringify(tourTypes));
evilTourTypes[0].href = "javascript:alert(document.cookie)";
ok("javascript: href rejected", !landingSchemas.tourTypes.safeParse(evilTourTypes).success);

// 3. Protocol-relative //evil.com must be rejected.
const evil2 = JSON.parse(JSON.stringify(tourTypes));
evil2[0].href = "//evil.example.com/phish";
ok("protocol-relative // href rejected", !landingSchemas.tourTypes.safeParse(evil2).success);

// 4. A legitimate relative href still passes.
const good = JSON.parse(JSON.stringify(tourTypes));
good[0].href = "/tours?type=classic#top";
ok("relative href still accepted", landingSchemas.tourTypes.safeParse(good).success);

console.log(fail === 0 ? "\nALL SCHEMA CHECKS PASSED" : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);

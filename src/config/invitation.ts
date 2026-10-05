/**
 * ─────────────────────────────────────────────────────────────────────────
 *  INVITATION CONFIGURATION — the only file you need to edit.
 * ─────────────────────────────────────────────────────────────────────────
 *  Every name, date, place, photo and link on the website comes from here.
 *  Search for "REPLACE" to find each value that still needs your details.
 *
 *  Photos go in /public/images (see /public/images/README.md).
 *  A missing photo shows an elegant placeholder instead of breaking the page.
 */

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export const invitation = {
  bride: {
    name: "Kavita",
    image: "/images/bride.jpg", // REPLACE — portrait photo
    parents: "Mr. Harbans Kumar Jhatwal & Mrs. Birma Devi",
    familyName: "Jhatwal Family",
    relation: "Daughter of", // shown above the parents' names
  },

  groom: {
    name: "Sahil",
    image: "/images/groom.jpg", // REPLACE
    parents: "Mr. Mohan Lal Khatiwal & Mrs. Radha Devi",
    familyName: "Khatiwal Family",
    relation: "Son of",
  },

  event: {
    title: "Engagement Ceremony",
    date: "2026-10-31", // YYYY-MM-DD
    time: "10:00", // 24-hour HH:MM, local time at the venue
    timezoneOffset: "+05:30", // India Standard Time; keeps the countdown correct for guests abroad
    durationHours: 4, // used for the calendar entry
    venue: "Our Residence",
    address: "Village Killianwali",
    city: "Fazilka, Punjab",
    pincode: "", // REPLACE — 6-digit PIN code, shown after the city
    /** Google Maps link. A link with ?query=… (like this one) also drives directions and the live map.
     *  Leave empty to search Google Maps for venue + address automatically. */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=30.140444,74.115500",
    /** Live Google map in the venue section when viewed as a website. The shareable HTML file
     *  always shows the drawn map card instead (Google's map can't load inside a local file). */
    showLiveMap: true,
    description:
      "With the blessings of our families, we warmly invite you to celebrate the engagement ceremony.",
  },

  hero: {
    image: "/images/hero.jpg", // the couple together
    /** Part of the photo kept in view inside the arch: "50% 0%" keeps the top so heads aren't cut. */
    imagePosition: "50% 0%",
  },

  music: {
    enabled: true,
    /** Audio file in /public/music (MP3 or M4A). The music button appears once the file exists. */
    url: "/music/background.mp3", // REPLACE — e.g. the Falak Tak violin instrumental
    title: "Falak Tak · Violin", // read by screen readers
    /** Start the music when the guest taps "Open Invitation" (never on page load). */
    autoplayOnOpen: true,
  },

  effects: {
    petals: true, // falling flower petals (a shower on opening and at the closing blessing)
    ambientPetals: 8, // petals gently drifting while reading (0 = only the showers)
  },

  /** Optional extra photos. Empty = the gallery section (and its menu entry) is hidden.
   *  Add e.g. { src: "/images/gallery-1.jpg", alt: "Describe the photo" } to bring it back. */
  gallery: [] as GalleryImage[],

  site: {
    /** The public address once deployed, e.g. "https://our-engagement.netlify.app".
     *  Used for link previews on WhatsApp and for the share button. */
    url: "", // REPLACE after deploying
    /** 1200×630 JPG/PNG shown when the link is shared on WhatsApp. */
    ogImage: "/images/og-cover.jpg", // REPLACE
  },

  text: {
    invocation: "॥ श्री गणेशाय नमः ॥",
    blessingHindi: "शुभारंभ मंगलमय हो",
    blessingEnglish:
      "May this beautiful beginning be filled with happiness, prosperity and endless blessings.",
    tagline: "Two families, one beautiful beginning.",
    footerNote: "Made with love for our families",
  },
};

export type Invitation = typeof invitation;

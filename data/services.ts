export type ServiceCategoryKey =
  | "haircuts"
  | "colour"
  | "foils"
  | "perm"
  | "other";

export interface ServiceCategory {
  key: ServiceCategoryKey;
  name: string;
  badge: string;
  description: string;
  count: number;
}

export interface SalonService {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  priceFormatted: string;
  duration: string;
  description: string;
  image: string;
  tiltDesktop: string;
  popular?: boolean;
  category: ServiceCategoryKey;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: "haircuts",
    name: "HAIRCUTS",
    badge: "01",
    description: "Precision clipper cuts, fades, scissor craft & beard architecture",
    count: 6,
  },
  {
    key: "colour",
    name: "COLOUR",
    badge: "02",
    description: "Multi-dimensional depth, root touch-ups & ammonia-free brilliance",
    count: 3,
  },
  {
    key: "foils",
    name: "FOILS",
    badge: "03",
    description: "Handcrafted blonde lift, sun-kissed placement & seamless balayage",
    count: 3,
  },
  {
    key: "perm",
    name: "PERM",
    badge: "04",
    description: "Effortless body, textured curls & long-lasting dimensional wave care",
    count: 3,
  },
  {
    key: "other",
    name: "OTHER SERVICES",
    badge: "05",
    description: "Bridal upstyles, steam treatments, brow design & Japanese straightening",
    count: 5,
  },
];

export const SALON_SERVICES: SalonService[] = [
  // ==================== 1. HAIRCUTS (6 ITEMS) ====================
  {
    id: "mens-haircut",
    name: "Men's Haircut",
    subtitle: "Classic & Modern Fades",
    price: 20,
    priceFormatted: "$20",
    duration: "30-45 mins",
    description:
      "Precision scissor and clipper cut tailored to your facial architecture and personal style. Includes hot towel finish.",
    image: "/images/haircut.jpg",
    tiltDesktop: "-2deg",
    popular: true,
    category: "haircuts",
  },
  {
    id: "flat-top-cut",
    name: "Flat Top Cut",
    subtitle: "Precision Level Geometry",
    price: 25,
    priceFormatted: "$25",
    duration: "35 mins",
    description:
      "Sharp, perfectly level flat top sculpted with specialized clipper-over-comb technique and razor-sharp box edges.",
    image: "/images/flat-top.jpg",
    tiltDesktop: "1.5deg",
    category: "haircuts",
  },
  {
    id: "zero-fade-cut",
    name: "Zero Fade Cut",
    subtitle: "Seamless Skin Fade",
    price: 20,
    priceFormatted: "$20",
    duration: "35 mins",
    description:
      "Ultra-clean zero to skin transition, textured crop or pompadour top, and foil shaver neck taper.",
    image: "/images/zero-fade.jpg",
    tiltDesktop: "-1.5deg",
    popular: true,
    category: "haircuts",
  },
  {
    id: "beard",
    name: "Beard",
    subtitle: "Shape, Edge & Hot Towel",
    price: 15,
    priceFormatted: "$15",
    duration: "25 mins",
    description:
      "Sculpted beard grooming with razor edge finish, organic beard conditioning oil, and invigorating mint hot towel.",
    image: "/images/beard-trim.jpg",
    tiltDesktop: "2deg",
    category: "haircuts",
  },
  {
    id: "ladies-haircut",
    name: "Ladies' Haircut",
    subtitle: "Bespoke Layers & Finish",
    price: 25,
    priceFormatted: "From $25",
    duration: "45 mins",
    description:
      "Consultation, precision shear sculpting, face-framing layers, split-end refinement, and complimentary light style.",
    image: "/images/ladies-haircut.jpg",
    tiltDesktop: "-1.2deg",
    category: "haircuts",
  },
  {
    id: "wash-cut-blowdry",
    name: "Wash, Cut & Blowdry",
    subtitle: "Full Signature Transformation",
    price: 50,
    priceFormatted: "From $50",
    duration: "60 mins",
    description:
      "Deep cleansing scalp wash with aromatic botanicals, precision artisan haircut, and runway-ready bouncy blowdry.",
    image: "/images/wash-blowdry.jpg",
    tiltDesktop: "1.8deg",
    category: "haircuts",
  },

  // ==================== 2. COLOUR (3 ITEMS) ====================
  {
    id: "root-touchup",
    name: "Root Touch-Up Colour",
    subtitle: "Seamless Regrowth Blend",
    price: 50,
    priceFormatted: "From $50",
    duration: "60 mins",
    description:
      "Targeted regrowth coverage perfectly matched to your base shade with nourishing gloss protection.",
    image: "/images/root-touchup.jpg",
    tiltDesktop: "-2deg",
    category: "colour",
  },
  {
    id: "full-colour",
    name: "Full Colour",
    subtitle: "Rich Gloss & Multi-Tone Depth",
    price: 60,
    priceFormatted: "From $60",
    duration: "90 mins",
    description:
      "All-over radiant color transformation with ammonia-free conditioning formula, illuminating shine shield.",
    image: "/images/hair-colour.jpg",
    tiltDesktop: "1.5deg",
    popular: true,
    category: "colour",
  },
  {
    id: "mens-haircut-colour",
    name: "Men's Haircut + Colour",
    subtitle: "Complete Grooming Package",
    price: 50,
    priceFormatted: "$50",
    duration: "60 mins",
    description:
      "Signature fade or scissor haircut paired with natural grey camouflage or custom matte tone finish.",
    image: "/images/mens-colour.jpg",
    tiltDesktop: "-1.5deg",
    category: "colour",
  },

  // ==================== 3. FOILS (3 ITEMS) ====================
  {
    id: "half-head-foils",
    name: "Half Head Foils",
    subtitle: "Crown & Framing Dimension",
    price: 100,
    priceFormatted: "From $100",
    duration: "75 mins",
    description:
      "Precision foil weaving across crown and hairline for subtle illumination and luminous natural contrast.",
    image: "/images/foils.jpg",
    tiltDesktop: "-2deg",
    category: "foils",
  },
  {
    id: "full-head-foils",
    name: "Full Head Foils",
    subtitle: "Maximum Blonde & Radiance",
    price: 130,
    priceFormatted: "From $130",
    duration: "120 mins",
    description:
      "Full head high-density foil placement for maximum lift, icy platinums, golden babylights, or honey ribbons.",
    image: "/images/foils-full.jpg",
    tiltDesktop: "1.5deg",
    category: "foils",
  },
  {
    id: "balayage",
    name: "Balayage",
    subtitle: "Handcrafted Sun-Kissed Gradient",
    price: 150,
    priceFormatted: "From $150",
    duration: "150 mins",
    description:
      "Artisan freehand painted highlights transitioning smoothly from dark roots to molten shimmering ends.",
    image: "/images/balayage.jpg",
    tiltDesktop: "-1deg",
    popular: true,
    category: "foils",
  },

  // ==================== 4. PERM (3 ITEMS) ====================
  {
    id: "perm-short",
    name: "Short Hair Perm",
    subtitle: "Volume, Texture & Root Lift",
    price: 80,
    priceFormatted: "$80",
    duration: "90 mins",
    description:
      "Custom textured wave system designed for shorter crops, adding effortless daily volume and natural movement.",
    image: "/images/perm.jpg",
    tiltDesktop: "-2deg",
    category: "perm",
  },
  {
    id: "perm-medium",
    name: "Medium Hair Perm",
    subtitle: "Defined Curls & Natural Body",
    price: 100,
    priceFormatted: "$100",
    duration: "110 mins",
    description:
      "Shoulder-length curl restructuring with protective keratin conditioning for bouncy, spring-loaded ringlets.",
    image: "/images/perm-medium.jpg",
    tiltDesktop: "1.6deg",
    category: "perm",
  },
  {
    id: "perm-long",
    name: "Long Hair Perm",
    subtitle: "Cascading Beach Waves",
    price: 150,
    priceFormatted: "$150",
    duration: "130 mins",
    description:
      "Glamorous spiral curls or soft cascading mermaid waves treated with bond-building restorative complexes.",
    image: "/images/perm-long.jpg",
    tiltDesktop: "-1.5deg",
    popular: true,
    category: "perm",
  },

  // ==================== 5. OTHER SERVICES (5 ITEMS) ====================
  {
    id: "upstyle",
    name: "Upstyle",
    subtitle: "Bridal & Red-Carpet Glamour",
    price: 50,
    priceFormatted: "From $50",
    duration: "60 mins",
    description:
      "Sculptural chignon, intricate bohemian braids, or Hollywood waves prepared for weddings, formals, and special galas.",
    image: "/images/upstyle.jpg",
    tiltDesktop: "-2deg",
    category: "other",
  },
  {
    id: "eyebrow-trim",
    name: "Eyebrow Trim",
    subtitle: "Clean Edge & Facial Symmetry",
    price: 15,
    priceFormatted: "$15",
    duration: "15 mins",
    description:
      "Precision brow mapping, feather trimming, and clean razor outline for effortless facial symmetry.",
    image: "/images/eyebrow.jpg",
    tiltDesktop: "1.5deg",
    category: "other",
  },
  {
    id: "steam-treatment",
    name: "Steam Treatment",
    subtitle: "Scalp Detox & Deep Infusion",
    price: 50,
    priceFormatted: "$50",
    duration: "40 mins",
    description:
      "Micro-mist warm ozone vapor therapy that opens hair cuticles to deeply infuse organic keratin and scalp oils.",
    image: "/images/steam-treatment.jpg",
    tiltDesktop: "-1.5deg",
    category: "other",
  },
  {
    id: "keratin-treatment",
    name: "Keratin Treatment",
    subtitle: "Frizz Elimination & Mirror Gloss",
    price: 120,
    priceFormatted: "From $120",
    duration: "120 mins",
    description:
      "Formaldehyde-free Brazilian smoothing treatment locking in liquid keratin for 3-5 months of frizz-free glass hair.",
    image: "/images/keratin.jpg",
    tiltDesktop: "2deg",
    popular: true,
    category: "other",
  },
  {
    id: "japanese-straightening",
    name: "Japanese Permanent Straightening",
    subtitle: "Ultra-Sleek Glass Hair Rebonding",
    price: 180,
    priceFormatted: "From $180",
    duration: "180 mins",
    description:
      "Permanent thermal ionic rebonding creating silk-smooth, pin-straight glossy hair impervious to humidity.",
    image: "/images/straightening.jpg",
    tiltDesktop: "-1deg",
    category: "other",
  },
];

export interface Stylist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
}

export const STYLISTS: Stylist[] = [
  {
    id: "elena",
    name: "Elena Vance",
    role: "Creative Director & Master Stylist",
    specialty: "Precision Cuts & Balayage",
    experience: "12+ Years Experience",
  },
  {
    id: "marcus",
    name: "Marcus Stone",
    role: "Senior Barber & Grooming Specialist",
    specialty: "Classic Fades & Beard Sculpting",
    experience: "9+ Years Experience",
  },
  {
    id: "aria",
    name: "Aria Lin",
    role: "Master Colorist",
    specialty: "Vibrant Colors & Tone Correction",
    experience: "8+ Years Experience",
  },
  {
    id: "any",
    name: "First Available Master Stylist",
    role: "Salon Artisan",
    specialty: "Full Comprehensive Care",
    experience: "Riverstone Certified",
  },
];

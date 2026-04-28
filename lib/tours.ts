export interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  description: string;
  highlights: string[];
}

export const tours: Tour[] = [
  {
    id: "tour-001",
    name: "5 Days in Singapore",
    location: "Singapore",
    duration: "5 days",
    price: 1299,
    image: "https://picsum.photos/seed/singapore/800/500",
    description: "Discover the Lion City's perfect blend of futuristic architecture, lush gardens, and world-class cuisine.",
    highlights: ["Gardens by the Bay", "Sentosa Island", "Marina Bay Sands skybar", "Hawker centre food tour", "Little India & Chinatown"],
  },
  {
    id: "tour-002",
    name: "7 Days in Bali",
    location: "Bali, Indonesia",
    duration: "7 days",
    price: 1599,
    image: "https://picsum.photos/seed/bali/800/500",
    description: "Immerse yourself in Bali's spiritual culture, emerald rice terraces, and world-class surf breaks.",
    highlights: ["Ubud Monkey Forest", "Tegallalang rice terraces", "Tanah Lot sunset", "Seminyak beach clubs", "Traditional cooking class"],
  },
  {
    id: "tour-003",
    name: "10 Days Thailand Adventure",
    location: "Bangkok & Chiang Mai, Thailand",
    duration: "10 days",
    price: 2199,
    image: "https://picsum.photos/seed/bangkok/800/500",
    description: "From Bangkok's golden temples to Chiang Mai's misty mountains and ethical elephant sanctuaries.",
    highlights: ["Grand Palace & Wat Pho", "Chiang Mai Night Bazaar", "Elephant Nature Park", "Floating markets", "Thai cooking school"],
  },
  {
    id: "tour-004",
    name: "8 Days Vietnam Explorer",
    location: "Hanoi & Hội An, Vietnam",
    duration: "8 days",
    price: 1899,
    image: "https://picsum.photos/seed/vietnam/800/500",
    description: "Cruise Ha Long Bay's limestone karsts, wander Hội An's lantern-lit ancient town, and savour pho at dawn in Hanoi.",
    highlights: ["Ha Long Bay overnight cruise", "Hội An lantern festival", "Hanoi Old Quarter", "War history museums", "Banh mi & pho food tour"],
  },
  {
    id: "tour-005",
    name: "6 Days Palawan, Philippines",
    location: "Palawan, Philippines",
    duration: "6 days",
    price: 1749,
    image: "https://picsum.photos/seed/palawan/800/500",
    description: "Island-hop through El Nido's turquoise lagoons and explore the UNESCO-listed Puerto Princesa Underground River.",
    highlights: ["El Nido island hopping", "Underground River UNESCO site", "Kayaking through lagoons", "Snorkelling coral gardens", "Fresh seafood barbecue nights"],
  },
  {
    id: "tour-006",
    name: "5 Days Kuala Lumpur & Penang",
    location: "Malaysia",
    duration: "5 days",
    price: 999,
    image: "https://picsum.photos/seed/kualalumpur/800/500",
    description: "Scale the Petronas Towers, hunt street art in Penang's George Town, and eat your way through Malaysia's best hawker stalls.",
    highlights: ["Petronas Twin Towers", "Batu Caves", "Penang street art trail", "George Town heritage walk", "Nasi lemak & laksa food tour"],
  },
  {
    id: "tour-007",
    name: "9 Days Cambodia & Laos",
    location: "Siem Reap & Luang Prabang",
    duration: "9 days",
    price: 2099,
    image: "https://picsum.photos/seed/angkorwat/800/500",
    description: "Watch sunrise over Angkor Wat, cruise the Mekong River, and witness the sacred alms-giving ceremony in Luang Prabang.",
    highlights: ["Angkor Wat sunrise", "Bayon Temple faces", "Mekong River cruise", "Luang Prabang alms ceremony", "Kuang Si waterfall"],
  },
  {
    id: "tour-008",
    name: "7 Days Phuket & Krabi",
    location: "Southern Thailand",
    duration: "7 days",
    price: 1849,
    image: "https://picsum.photos/seed/phuket/800/500",
    description: "Sail among Phi Phi's dramatic cliffs, rock climb Krabi's karst towers, and unwind on the Andaman's finest beaches.",
    highlights: ["Phi Phi Islands day trip", "James Bond Island", "Rock climbing in Krabi", "Mangrove kayaking", "Beachfront Thai massage"],
  },
  {
    id: "tour-009",
    name: "6 Days Ho Chi Minh & Mekong",
    location: "Ho Chi Minh City, Vietnam",
    duration: "6 days",
    price: 1199,
    image: "https://picsum.photos/seed/hochiminhcity/800/500",
    description: "Explore Cu Chi tunnels, navigate the Mekong Delta's floating markets, and soak up the energy of Vietnam's buzzing southern capital.",
    highlights: ["Cu Chi tunnels", "Mekong Delta floating markets", "War Remnants Museum", "Ben Thanh Market", "Motorbike street food tour"],
  },
  {
    id: "tour-010",
    name: "12 Days SEA Highlights",
    location: "Singapore · Bali · Bangkok · Vietnam",
    duration: "12 days",
    price: 3499,
    image: "https://picsum.photos/seed/southeastasia/800/500",
    description: "The ultimate Southeast Asia sampler — iconic cities, tropical islands, ancient temples, and unforgettable food across four countries.",
    highlights: ["Marina Bay Sands rooftop", "Bali rice terraces", "Grand Palace Bangkok", "Ha Long Bay cruise", "Business class inter-city flights"],
  },
];

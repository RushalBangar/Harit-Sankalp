export const DEFAULT_PLANTS = [
  {
    id: "neem_01",
    name: "Neem (Azadirachta indica)",
    category: "Medicinal / Shade",
    description: "Highly durable evergreen tree known for its air-purifying, medicinal properties, and extensive cooling shade. Perfect for parks and backyards.",
    difficulty: "Easy",
    waterNeeded: "Low",
    growthRate: "Fast",
    co2Absorption: "High (Approx 20kg/year)",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "banyan_02",
    name: "Banyan (Ficus benghalensis)",
    category: "Ecological / Sacred",
    description: "The national tree of India. Known for its massive canopy and aerial roots, it acts as a primary hub for local bird and insect life.",
    difficulty: "Medium",
    waterNeeded: "Moderate",
    growthRate: "Slow",
    co2Absorption: "Very High (Approx 35kg/year)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "mango_03",
    name: "Mango Tree (Mangifera indica)",
    category: "Fruit-bearing / Canopy",
    description: "A popular tropical fruit-bearing tree that provides deep shade, delicious summer harvest, and helps stabilize soil composition.",
    difficulty: "Medium",
    waterNeeded: "Moderate",
    growthRate: "Medium",
    co2Absorption: "Moderate (Approx 15kg/year)",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "gulmohar_04",
    name: "Gulmohar (Delonix regia)",
    category: "Ornamental / Flowering",
    description: "Famous for its flamboyant display of orange-red flowers. It is an excellent ornamental shade tree that flourishes in tropical climates.",
    difficulty: "Easy",
    waterNeeded: "Low",
    growthRate: "Very Fast",
    co2Absorption: "Moderate (Approx 12kg/year)",
    image: "https://images.unsplash.com/photo-1627914561081-30cb1c36141a?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "peepal_05",
    name: "Peepal (Ficus religiosa)",
    category: "Ecological / Oxygen",
    description: "Releasing oxygen 24 hours a day, Peepal is highly valued for its ecological benefits and spiritual significance. Extremely resilient.",
    difficulty: "Easy",
    waterNeeded: "Low",
    growthRate: "Fast",
    co2Absorption: "Very High (Approx 30kg/year)",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=80"
  }
];

export const DEFAULT_PICKUP_POINTS = [
  {
    id: "pickup_east",
    name: "Government Nursery - East Zone",
    address: "Near Panchayat Office, East Sector",
    contact: "+91 98765 43210",
    stock: {
      neem_01: 45,
      banyan_02: 12,
      mango_03: 30,
      gulmohar_04: 50,
      peepal_05: 25
    }
  },
  {
    id: "pickup_central",
    name: "Harit Forest Depot - Central Hub",
    address: "Opposite Town Hall, Main Market",
    contact: "+91 98765 43211",
    stock: {
      neem_01: 80,
      banyan_02: 25,
      mango_03: 60,
      gulmohar_04: 40,
      peepal_05: 50
    }
  },
  {
    id: "pickup_west",
    name: "Community Botanical Center - West",
    address: "Green Belt Road, Sector 12",
    contact: "+91 98765 43212",
    stock: {
      neem_01: 20,
      banyan_02: 5,
      mango_03: 15,
      gulmohar_04: 30,
      peepal_05: 10
    }
  }
];

export const DEFAULT_BUSINESSES = [
  {
    id: "biz_cafe_green",
    name: "The Green Bean Café",
    category: "Café & Bakery",
    address: "Eco-Park Boulevard",
    discount: "15% OFF on total bill",
    minPlantRequired: 1,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "biz_spice_garden",
    name: "Spice Garden Restaurant",
    category: "Fine Dining",
    address: "Gourmet Street, Ward 5",
    discount: "20% OFF on Buffet",
    minPlantRequired: 2,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "biz_eco_resort",
    name: "Nature Stay Eco Resort",
    category: "Hotel & Resort",
    address: "Hills & Valley Bypass",
    discount: "10% OFF on Room Bookings",
    minPlantRequired: 3,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80"
  }
];

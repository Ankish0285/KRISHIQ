export const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

export const CROP_IMAGES = {
  Tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  Potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  Onion: "https://images.unsplash.com/photo-1508747703725-619778acdf10?auto=format&fit=crop&w=800&q=80",
  Wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  Rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  Mustard: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
  Cotton: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
  Maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  Peas: "https://images.unsplash.com/photo-1597362925123-77877d6f1f29?auto=format&fit=crop&w=800&q=80",
  Chilli: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&w=800&q=80",
};

export const CROPS = Object.keys(CROP_IMAGES);
export const LOCATIONS = ["Jaipur", "Kota", "Ajmer", "Alwar", "Delhi", "Gurugram", "Udaipur", "Jodhpur"];
export const CATEGORIES = ["Vegetables", "Grains", "Spices", "Cash Crops", "Pulses"];
export const QUALITIES = ["A Grade", "B Grade", "Export Grade", "Organic"];

export const DEMO_USERS = [
  {
    id: "u-farmer",
    name: "Ramesh Singh",
    email: "farmer@krishiq.in",
    mobile: "9876543210",
    password: "demo123",
    role: "farmer",
    location: "Jaipur",
    organization: "Singh Farms",
  },
  {
    id: "u-buyer",
    name: "Ananya Mehta",
    email: "buyer@krishiq.in",
    mobile: "9876543211",
    password: "demo123",
    role: "buyer",
    location: "Delhi",
    organization: "FreshMart Pvt Ltd",
  },
  {
    id: "u-fpo",
    name: "Kota Agri FPO",
    email: "fpo@krishiq.in",
    mobile: "9876543212",
    password: "demo123",
    role: "fpo",
    location: "Kota",
    organization: "Kota Farmer Producer Company",
  },
  {
    id: "u-admin",
    name: "KRISHIQ Admin",
    email: "admin@krishiq.in",
    mobile: "9876543213",
    password: "demo123",
    role: "admin",
    location: "Jaipur",
    organization: "KRISHIQ",
  },
];

export const PRODUCTS = [
  { id: "p1", cropName: "Tomato", category: "Vegetables", farmer: "Ramesh Singh", fpo: "Jaipur Fresh FPO", location: "Jaipur", quantity: 850, unit: "kg", price: 28, quality: "A Grade", harvestDate: "2026-09-08", demandScore: 92, match: 94, delivery: "24 hrs", status: "Listed", description: "Field-fresh hybrid tomatoes with high lycopene and consistent sizing for retail packs." },
  { id: "p2", cropName: "Onion", category: "Vegetables", farmer: "Meena Devi", fpo: "Kota Agri FPO", location: "Kota", quantity: 2200, unit: "kg", price: 22, quality: "Export Grade", harvestDate: "2026-09-06", demandScore: 88, match: 91, delivery: "36 hrs", status: "Listed", description: "Cured red onions with long shelf life, suitable for bulk procurement and cold storage." },
  { id: "p3", cropName: "Potato", category: "Vegetables", farmer: "Ajay Yadav", fpo: "Ajmer Growers", location: "Ajmer", quantity: 1800, unit: "kg", price: 20, quality: "A Grade", harvestDate: "2026-09-10", demandScore: 86, match: 89, delivery: "48 hrs", status: "Listed", description: "Processing-grade potatoes with low sugar content for chips and bulk kitchen supply." },
  { id: "p4", cropName: "Wheat", category: "Grains", farmer: "Harpreet Kaur", fpo: "Alwar Grain FPO", location: "Alwar", quantity: 5400, unit: "kg", price: 26, quality: "A Grade", harvestDate: "2026-09-18", demandScore: 81, match: 84, delivery: "3 days", status: "Listed", description: "Sharbati-style wheat lots with strong gluten, cleaned and moisture-tested." },
  { id: "p5", cropName: "Rice", category: "Grains", farmer: "Suresh Pal", fpo: "Jaipur Fresh FPO", location: "Jaipur", quantity: 3100, unit: "kg", price: 42, quality: "Export Grade", harvestDate: "2026-09-12", demandScore: 79, match: 87, delivery: "48 hrs", status: "Listed", description: "Premium non-basmati rice with uniform grain length for institutional buyers." },
  { id: "p6", cropName: "Mustard", category: "Cash Crops", farmer: "Lalit Sharma", fpo: "Kota Agri FPO", location: "Kota", quantity: 900, unit: "kg", price: 58, quality: "A Grade", harvestDate: "2026-09-20", demandScore: 74, match: 82, delivery: "3 days", status: "Listed", description: "Oilseed mustard with high oil recovery, aggregated from FPO member farms." },
  { id: "p7", cropName: "Cotton", category: "Cash Crops", farmer: "Imran Khan", fpo: "Jodhpur Fibre FPO", location: "Jodhpur", quantity: 1500, unit: "kg", price: 72, quality: "B Grade", harvestDate: "2026-09-22", demandScore: 71, match: 78, delivery: "4 days", status: "Listed", description: "Medium staple cotton suitable for ginning partners and textile mills." },
  { id: "p8", cropName: "Maize", category: "Grains", farmer: "Pooja Choudhary", fpo: "Udaipur Grow FPO", location: "Udaipur", quantity: 2700, unit: "kg", price: 21, quality: "A Grade", harvestDate: "2026-09-09", demandScore: 83, match: 90, delivery: "36 hrs", status: "Listed", description: "Feed-grade maize with certified moisture under 14% for poultry and starch buyers." },
  { id: "p9", cropName: "Peas", category: "Vegetables", farmer: "Ramesh Singh", fpo: "Jaipur Fresh FPO", location: "Jaipur", quantity: 420, unit: "kg", price: 46, quality: "Organic", harvestDate: "2026-09-07", demandScore: 77, match: 85, delivery: "24 hrs", status: "Listed", description: "Garden peas harvested at peak sweetness, ideal for QSR and frozen processors." },
  { id: "p10", cropName: "Chilli", category: "Spices", farmer: "Kavita Jain", fpo: "Ajmer Growers", location: "Ajmer", quantity: 380, unit: "kg", price: 95, quality: "Export Grade", harvestDate: "2026-09-11", demandScore: 90, match: 93, delivery: "36 hrs", status: "Listed", description: "High-pungency red chilli lots with consistent colour value for spice exporters." },
].map((p) => ({ ...p, image: CROP_IMAGES[p.cropName] }));

export const ORDERS = [
  { id: "ORD-2401", crop: "Tomato", buyer: "FreshMart Pvt Ltd", farmer: "Ramesh Singh", qty: 500, price: 28, value: 14000, status: "In Transit", location: "Jaipur → Delhi", placedOn: "2026-09-01", eta: "2026-09-05", driver: "Vikas Rathore", vehicle: "RJ-14-AB-2291", currentLocation: "Dausa Highway", distance: "187 km" },
  { id: "ORD-2402", crop: "Onion", buyer: "GreenBasket", farmer: "Meena Devi", qty: 1200, price: 22, value: 26400, status: "Confirmed", location: "Kota → Gurugram", placedOn: "2026-09-02", eta: "2026-09-06", driver: "Sanjay Meena", vehicle: "RJ-20-CD-1188", currentLocation: "Kota Warehouse", distance: "412 km" },
  { id: "ORD-2403", crop: "Potato", buyer: "Hotel Sahib", farmer: "Ajay Yadav", qty: 800, price: 20, value: 16000, status: "Harvest Ready", location: "Ajmer → Jaipur", placedOn: "2026-08-30", eta: "2026-09-04", driver: "Pending assignment", vehicle: "TBD", currentLocation: "Ajmer Farm Gate", distance: "132 km" },
  { id: "ORD-2404", crop: "Maize", buyer: "NutriFeed Ltd", farmer: "Pooja Choudhary", qty: 2000, price: 21, value: 42000, status: "Delivered", location: "Udaipur → Delhi", placedOn: "2026-08-22", eta: "2026-08-26", driver: "Arun Joshi", vehicle: "RJ-27-EF-4410", currentLocation: "Okhla Mandi", distance: "0 km" },
  { id: "ORD-2405", crop: "Chilli", buyer: "SpiceVault", farmer: "Kavita Jain", qty: 200, price: 95, value: 19000, status: "Pickup Scheduled", location: "Ajmer → Delhi", placedOn: "2026-09-03", eta: "2026-09-06", driver: "Imran Qureshi", vehicle: "RJ-01-GH-9090", currentLocation: "Ajmer Collection Hub", distance: "392 km" },
  { id: "ORD-2406", crop: "Wheat", buyer: "GrainHouse", farmer: "Harpreet Kaur", qty: 3000, price: 26, value: 78000, status: "Order Placed", location: "Alwar → Gurugram", placedOn: "2026-09-03", eta: "2026-09-08", driver: "Pending assignment", vehicle: "TBD", currentLocation: "Alwar FPO Yard", distance: "158 km" },
  { id: "ORD-2407", crop: "Rice", buyer: "FreshMart Pvt Ltd", farmer: "Suresh Pal", qty: 900, price: 42, value: 37800, status: "Cancelled", location: "Jaipur → Delhi", placedOn: "2026-08-18", eta: "2026-08-21", driver: "-", vehicle: "-", currentLocation: "-", distance: "-" },
];

export const ORDER_STEPS = ["Order Placed", "Confirmed", "Harvest Ready", "Pickup Scheduled", "In Transit", "Delivered"];

export const FPO_FARMERS = [
  { id: "f1", name: "Ramesh Singh", location: "Jaipur", crop: "Tomato", quantity: 850, status: "Active", contact: "9876543210" },
  { id: "f2", name: "Meena Devi", location: "Kota", crop: "Onion", quantity: 2200, status: "Active", contact: "9829011122" },
  { id: "f3", name: "Ajay Yadav", location: "Ajmer", crop: "Potato", quantity: 1800, status: "Active", contact: "9414012345" },
  { id: "f4", name: "Harpreet Kaur", location: "Alwar", crop: "Wheat", quantity: 5400, status: "Onboarded", contact: "9988776655" },
  { id: "f5", name: "Kavita Jain", location: "Ajmer", crop: "Chilli", quantity: 380, status: "Active", contact: "9797979797" },
  { id: "f6", name: "Lalit Sharma", location: "Kota", crop: "Mustard", quantity: 900, status: "Inactive", contact: "9123456780" },
];

export const FPO_INVENTORY = [
  { crop: "Tomato", quantity: 2500, price: 26, demand: "High Demand" },
  { crop: "Onion", quantity: 4200, price: 22, demand: "Medium Demand" },
  { crop: "Potato", quantity: 3000, price: 20, demand: "High Demand" },
  { crop: "Wheat", quantity: 5400, price: 26, demand: "Stable" },
  { crop: "Maize", quantity: 2700, price: 21, demand: "High Demand" },
  { crop: "Chilli", quantity: 380, price: 95, demand: "High Demand" },
];

export const BULK_ORDERS = [
  { id: "B-101", buyer: "FreshMart Pvt Ltd", crop: "Tomato", qty: 5000, maxPrice: 30, delivery: "48 hours", match: 94, status: "Open" },
  { id: "B-102", buyer: "GreenBasket", crop: "Onion", qty: 8000, maxPrice: 24, delivery: "72 hours", match: 89, status: "Negotiating" },
  { id: "B-103", buyer: "NutriFeed Ltd", crop: "Maize", qty: 12000, maxPrice: 22, delivery: "5 days", match: 91, status: "Open" },
  { id: "B-104", buyer: "SpiceVault", crop: "Chilli", qty: 600, maxPrice: 98, delivery: "36 hours", match: 86, status: "Matched" },
];

export const ADMIN_FARMERS = [
  { id: "af1", name: "Ramesh Singh", location: "Jaipur", produce: "Tomato, Peas", status: "Verified", joined: "Jan 2026" },
  { id: "af2", name: "Meena Devi", location: "Kota", produce: "Onion", status: "Verified", joined: "Feb 2026" },
  { id: "af3", name: "Ajay Yadav", location: "Ajmer", produce: "Potato", status: "Pending", joined: "Mar 2026" },
  { id: "af4", name: "Harpreet Kaur", location: "Alwar", produce: "Wheat", status: "Verified", joined: "Nov 2025" },
  { id: "af5", name: "Imran Khan", location: "Jodhpur", produce: "Cotton", status: "Suspended", joined: "Apr 2026" },
];

export const ADMIN_BUYERS = [
  { id: "ab1", name: "Ananya Mehta", business: "FreshMart Pvt Ltd", location: "Delhi", orders: 38, status: "Active" },
  { id: "ab2", name: "Rohit Kapoor", business: "GreenBasket", location: "Gurugram", orders: 22, status: "Active" },
  { id: "ab3", name: "Neha Bansal", business: "Hotel Sahib", location: "Jaipur", orders: 9, status: "Active" },
  { id: "ab4", name: "Farhan Ali", business: "SpiceVault", location: "Delhi", orders: 14, status: "Review" },
];

export const DEMAND_SERIES = {
  Tomato: [62, 68, 71, 75, 80, 86, 92, 97],
  Onion: [70, 72, 69, 74, 78, 81, 84, 88],
  Potato: [58, 60, 64, 67, 70, 76, 82, 85],
  Wheat: [50, 52, 54, 55, 57, 59, 61, 63],
  Rice: [66, 65, 67, 70, 72, 74, 76, 78],
  Mustard: [40, 42, 45, 48, 51, 53, 55, 58],
  Cotton: [44, 46, 47, 49, 50, 52, 54, 56],
  Maize: [55, 58, 61, 65, 70, 74, 79, 83],
  Peas: [48, 52, 54, 57, 60, 63, 66, 70],
  Chilli: [72, 75, 78, 81, 84, 88, 91, 95],
};

export const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export const EARNINGS_MONTHLY = [
  { month: "Mar", earnings: 42000 },
  { month: "Apr", earnings: 51000 },
  { month: "May", earnings: 47000 },
  { month: "Jun", earnings: 62000 },
  { month: "Jul", earnings: 71000 },
  { month: "Aug", earnings: 68000 },
  { month: "Sep", earnings: 54000 },
];

export const ADMIN_CHARTS = {
  orders: [
    { month: "Mar", orders: 120 },
    { month: "Apr", orders: 148 },
    { month: "May", orders: 171 },
    { month: "Jun", orders: 210 },
    { month: "Jul", orders: 246 },
    { month: "Aug", orders: 268 },
    { month: "Sep", orders: 198 },
  ],
  revenue: [
    { month: "Mar", gmv: 18 },
    { month: "Apr", gmv: 22 },
    { month: "May", gmv: 25 },
    { month: "Jun", gmv: 31 },
    { month: "Jul", gmv: 36 },
    { month: "Aug", gmv: 41 },
    { month: "Sep", gmv: 29 },
  ],
  users: [
    { month: "Mar", farmers: 6200, buyers: 210 },
    { month: "Apr", farmers: 7100, buyers: 248 },
    { month: "May", farmers: 7900, buyers: 290 },
    { month: "Jun", farmers: 8600, buyers: 340 },
    { month: "Jul", farmers: 9300, buyers: 390 },
    { month: "Aug", farmers: 9800, buyers: 450 },
    { month: "Sep", farmers: 10240, buyers: 512 },
  ],
  crops: [
    { crop: "Tomato", demand: 92 },
    { crop: "Chilli", demand: 90 },
    { crop: "Onion", demand: 88 },
    { crop: "Potato", demand: 86 },
    { crop: "Maize", demand: 83 },
    { crop: "Wheat", demand: 81 },
  ],
};

export const VEHICLES = [
  { id: "V-11", vehicle: "RJ-14-AB-2291", driver: "Vikas Rathore", route: "Jaipur → Delhi", status: "In Transit", load: "82%" },
  { id: "V-12", vehicle: "RJ-20-CD-1188", driver: "Sanjay Meena", route: "Kota → Gurugram", status: "Loading", load: "64%" },
  { id: "V-13", vehicle: "RJ-27-EF-4410", driver: "Arun Joshi", route: "Udaipur → Delhi", status: "Delivered", load: "0%" },
  { id: "V-14", vehicle: "RJ-01-GH-9090", driver: "Imran Qureshi", route: "Ajmer → Delhi", status: "Delayed", load: "71%" },
];

export const ROUTE_PLAN = {
  stops: [
    { label: "Pickup", name: "Farmer A — Ramesh Singh", place: "Jaipur" },
    { label: "Pickup", name: "Farmer B — Meena Devi", place: "Kota Hub" },
    { label: "Pickup", name: "FPO Warehouse", place: "Jaipur Fresh FPO" },
    { label: "Destination", name: "Buyer — FreshMart Pvt Ltd", place: "Okhla, Delhi" },
  ],
  distance: "428 km",
  eta: "9 hrs 20 min",
  fuel: "₹4,860",
  capacity: "6.2 / 8.0 tonnes",
  saved: { distance: "18%", fuel: "14%", time: "22%" },
};

export const NOTIFICATIONS = [
  { id: 1, title: "Tomato demand up 18%", text: "AI forecast recommends listing extra 200 kg this week.", time: "12 min ago" },
  { id: 2, title: "Order ORD-2401 in transit", text: "Vehicle RJ-14-AB-2291 crossed Dausa.", time: "1 hr ago" },
  { id: 3, title: "Buyer match found", text: "FreshMart is requesting 500 kg tomatoes near your farm.", time: "3 hr ago" },
];

export const SUPPLIER_RECS = [
  { id: "s1", name: "Ramesh Singh", org: "Jaipur Fresh FPO", match: 92, qty: 500, price: 26, distance: 12, crop: "Tomato", location: "Jaipur" },
  { id: "s2", name: "Meena Devi", org: "Kota Agri FPO", match: 89, qty: 300, price: 27, distance: 18, crop: "Tomato", location: "Kota" },
  { id: "s3", name: "Ajay Yadav", org: "Ajmer Growers", match: 84, qty: 400, price: 25, distance: 25, crop: "Tomato", location: "Ajmer" },
];

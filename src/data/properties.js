import { Home, Layers, Ruler, Car, Maximize2, Calendar, Check, School, Bus, ShoppingBag, Coffee, Dumbbell, Droplet, Shield, Trees } from 'lucide-react';
import React from 'react';

// Helper function to create spec objects
const createSpec = (icon, label, value) => ({ icon, label, value });

// Comprehensive property database
const propertyDatabase = {
  1: {
    id: 1,
    title: "Skyline Residency",
    tagline: "Luxury 3BHK Premium Apartments",
    developer: "Skyline Developers",
    location: "Banjara Hills, Hyderabad",
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana 500034",
    price: "₹1.2 Cr",
    pricePerSqFt: "₹6,486/sq.ft",
    emi: "EMI starts at ₹57,800",
    type: "Residential Apartment",
    status: "Ready to Move",
    possession: "Immediate",
    furnishing: "Semi-Furnished",
    bhk: "3 BHK",
    area: "1850 sqft",
    tag: "Ready to Move",
    description: "Skyline Residency offers premium 3 BHK apartments in the heart of Banjara Hills. Designed for modern urban living, these residences combine luxury, comfort, and convenience with stunning city views. Every detail has been meticulously planned to offer a lifestyle of elegance and sophistication.",
    nearbyPlaces: [
      { category: "School", icon: "School", name: "Delhi Public School", distance: "1.2 km" },
      { category: "Hospital", icon: "Hospital", name: "Apollo Hospitals", distance: "2.5 km" },
      { category: "Mall", icon: "ShoppingBag", name: "GVK One Mall", distance: "3.0 km" },
      { category: "Metro", icon: "Bus", name: "Banjara Hills Metro", distance: "1.8 km" },
      { category: "Restaurant", icon: "Coffee", name: "Jubilee Hills Restaurants", distance: "2.2 km" },
      { category: "Park", icon: "Trees", name: "Lumbini Park", distance: "4.5 km" }
    ],
    projectOverview: {
      projectUnits: "256 Units",
      areaUnit: "sq.ft",
      projectArea: "5.2 Acres",
      sizes: "1850 - 2400 sq.ft",
      projectSize: "256 Apartments",
      launchDate: "Jan 2022",
      avgPrice: "₹6,486/sq.ft",
      possessionStarts: "Immediate",
      configuration: "3 & 4 BHK Apartments",
      reraId: "P02400004567",
      reraUrl: "https://hrera.in/PublicDashboard"
    },
    brochureUrl: "#",
    brochureImages: [
      "https://images.unsplash.com/photo-1628100787114-1188339c9f28?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
    ],
    unitTypes: [
      {
        type: "3 BHK",
        priceRange: "₹1.2 Cr - ₹1.4 Cr",
        variants: [
          { size: "1850 sq.ft", price: "₹1.20 Cr", pricePerSqFt: "₹6,486", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=800&q=80" },
          { size: "1900 sq.ft", price: "₹1.25 Cr", pricePerSqFt: "₹6,579", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" }
        ]
      },
      {
        type: "4 BHK",
        priceRange: "₹1.8 Cr - ₹2.2 Cr",
        variants: [
          { size: "2400 sq.ft", price: "₹1.80 Cr", pricePerSqFt: "₹7,500", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [
        { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80", caption: "Exterior View" },
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", caption: "Living Room" },
        { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", caption: "Bedroom" },
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", caption: "Kitchen" },
        { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", caption: "Bathroom" }
      ],
      videos: [
        { url: "#", thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80", caption: "Project Walkthrough" }
      ],
      totalMedia: 15
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "3 BHK" },
      { icon: React.createElement(Layers, { size: 20 }), label: "Bathrooms", value: "3" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "1850 sq.ft" },
      { icon: React.createElement(Car, { size: 20 }), label: "Parking", value: "2 Covered" },
      { icon: React.createElement(Maximize2, { size: 20 }), label: "Facing", value: "North/East" },
      { icon: React.createElement(Calendar, { size: 20 }), label: "Possession", value: "Immediate" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(School, { size: 20 })), name: "Schools Nearby" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Bus, { size: 20 })), name: "Public Transport" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(ShoppingBag, { size: 20 })), name: "Shopping Mall" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Coffee, { size: 20 })), name: "Cafes & Dining" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Droplet, { size: 20 })), name: "Swimming Pool" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Dumbbell, { size: 20 })), name: "Gymnasium" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Shield, { size: 20 })), name: "24/7 Security" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Trees, { size: 20 })), name: "Garden Area" }
    ]
  },
  2: {
    id: 2,
    title: "Green Valley Villas",
    tagline: "Spacious 4BHK Luxury Villas",
    developer: "Green Valley Constructions",
    location: "Whitefield, Bangalore",
    address: "ITPL Main Road, Whitefield, Bangalore, Karnataka 560066",
    price: "₹2.5 Cr",
    pricePerSqFt: "₹7,812/sq.ft",
    emi: "EMI starts at ₹1,20,500",
    type: "Independent Villa",
    status: "Under Construction",
    possession: "Dec, 2026",
    furnishing: "Unfurnished",
    bhk: "4 BHK",
    area: "3200 sqft",
    tag: "Under Construction",
    description: "Green Valley Villas presents an exclusive collection of 4 BHK luxury villas in Whitefield. Surrounded by lush greenery, these villas offer spacious living areas, private gardens, and world-class amenities. Perfect for families seeking a serene yet connected lifestyle.",
    nearbyPlaces: [
      { category: "School", icon: "School", name: "Greenwood High", distance: "2.0 km" },
      { category: "Hospital", icon: "Hospital", name: "Manipal Hospital", distance: "3.5 km" },
      { category: "Mall", icon: "ShoppingBag", name: "Phoenix Marketcity", distance: "4.0 km" },
      { category: "IT Park", icon: "Bus", name: "ITPL", distance: "1.5 km" }
    ],
    projectOverview: {
      projectUnits: "120 Villas",
      areaUnit: "sq.ft",
      projectArea: "15 Acres",
      sizes: "3200 - 4500 sq.ft",
      projectSize: "120 Units",
      launchDate: "Mar 2023",
      avgPrice: "₹7,812/sq.ft",
      possessionStarts: "Dec 2026",
      configuration: "4 & 5 BHK Villas",
      reraId: "PRM/KA/RERA/1251/446",
      reraUrl: "#"
    },
    brochureUrl: "#",
    brochureImages: [
      "https://images.unsplash.com/photo-1628100787114-1188339c9f28?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80"
    ],
    unitTypes: [
      {
        type: "4 BHK Villa",
        priceRange: "₹2.5 Cr - ₹3.0 Cr",
        variants: [
          { size: "3200 sq.ft", price: "₹2.50 Cr", pricePerSqFt: "₹7,812", reraId: "PRM/KA", floorPlan: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", caption: "Villa Exterior" },
        { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", caption: "Master Bedroom" },
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", caption: "Modern Kitchen" },
        { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", caption: "Pool Area" }
      ],
      videos: [],
      totalMedia: 8
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "4 BHK" },
      { icon: React.createElement(Layers, { size: 20 }), label: "Bathrooms", value: "4" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "3200 sq.ft" },
      { icon: React.createElement(Car, { size: 20 }), label: "Parking", value: "3 Covered" },
      { icon: React.createElement(Maximize2, { size: 20 }), label: "Facing", value: "East" },
      { icon: React.createElement(Calendar, { size: 20 }), label: "Possession", value: "Dec 2026" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(School, { size: 20 })), name: "International Schools" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Bus, { size: 20 })), name: "Metro Connectivity" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Droplet, { size: 20 })), name: "Swimming Pool" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Shield, { size: 20 })), name: "Gated Community" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Trees, { size: 20 })), name: "Landscaped Gardens" }
    ]
  },
  3: {
    id: 3,
    title: "Ocean View Apartments",
    tagline: "Sea Facing 2BHK Premium Homes",
    developer: "Coastal Realty",
    location: "Worli, Mumbai",
    address: "Sea Face Road, Worli, Mumbai, Maharashtra 400030",
    price: "₹85 Lac",
    pricePerSqFt: "₹6,800/sq.ft",
    emi: "EMI starts at ₹42,000",
    type: "Residential Apartment",
    status: "Ready to Move",
    possession: "Immediate",
    furnishing: "Furnished",
    bhk: "2 BHK",
    area: "1250 sqft",
    tag: "Ready to Move",
    description: "Enjoy breathtaking sea views from every room in Ocean View Apartments. Located in the premium Works neighborhood, these 2 BHK homes offer the perfect blend of serenity and city life.",
    nearbyPlaces: [
      { category: "Mall", icon: "ShoppingBag", name: "High Street Phoenix", distance: "2 km" },
      { category: "Park", icon: "Trees", name: "Shivaji Park", distance: "3 km" }
    ],
    projectOverview: {
      projectUnits: "150 Units",
      areaUnit: "sq.ft",
      projectArea: "2 Acres",
      sizes: "1200 - 1400 sq.ft",
      projectSize: "150 Apartments",
      launchDate: "Feb 2020",
      avgPrice: "₹6,800/sq.ft",
      possessionStarts: "Immediate",
      configuration: "2 BHK",
      reraId: "P51900001234",
      reraUrl: "#"
    },
    brochureUrl: "#",
    brochureImages: ["https://images.unsplash.com/photo-1628100787114-1188339c9f28?auto=format&fit=crop&w=400&q=80"],
    unitTypes: [
      {
        type: "2 BHK",
        priceRange: "₹85 Lac - ₹95 Lac",
        variants: [
          { size: "1250 sq.ft", price: "₹85 Lac", pricePerSqFt: "₹6,800", reraId: "P51900", floorPlan: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", caption: "Ocean View" },
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", caption: "Living Area" }
      ],
      videos: [],
      totalMedia: 5
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "2 BHK" },
      { icon: React.createElement(Layers, { size: 20 }), label: "Bathrooms", value: "2" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "1250 sq.ft" },
      { icon: React.createElement(Car, { size: 20 }), label: "Parking", value: "1 Covered" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Shield, { size: 20 })), name: "Sea Facing Deck" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Coffee, { size: 20 })), name: "Rooftop Cafe" }
    ]
  },
  4: {
    id: 4,
    title: "Palm Grove Estates",
    tagline: "Ultra Luxury Penthouses",
    developer: "Palm Group",
    location: "Sector 45, Gurgaon",
    address: "Sector 45 Main Road, Gurgaon, Haryana",
    price: "₹1.8 Cr",
    pricePerSqFt: "₹8,571/sq.ft",
    emi: "EMI starts at ₹95,000",
    type: "Penthouse",
    status: "Ready to Move",
    possession: "Immediate",
    furnishing: "Luxury Furnished",
    bhk: "3 BHK",
    area: "2100 sqft",
    tag: "Ready to Move",
    description: "Experience the height of luxury at Palm Grove Estates. These exclusive penthouses offer panoramic views, private terraces, and automated smart features.",
    nearbyPlaces: [
      { category: "Metro", icon: "Bus", name: "Huda City Centre", distance: "2 km" }
    ],
    projectOverview: {
      projectUnits: "50 Penthouses",
      areaUnit: "sq.ft",
      projectArea: "5 Acres",
      sizes: "2100 - 3500 sq.ft",
      projectSize: "50 Units",
      launchDate: "Jun 2021",
      avgPrice: "₹8,571/sq.ft",
      possessionStarts: "Immediate",
      configuration: "3 & 4 BHK",
      reraId: "HRERA-456",
      reraUrl: "#"
    },
    brochureUrl: "#",
    brochureImages: ["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80"],
    unitTypes: [
      {
        type: "3 BHK Penthouse",
        priceRange: "₹1.8 Cr",
        variants: [
          { size: "2100 sq.ft", price: "₹1.8 Cr", pricePerSqFt: "₹8,571", reraId: "HRERA", floorPlan: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [
        { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", caption: "Terrace View" }
      ],
      totalMedia: 2
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "3 BHK" },
      { icon: React.createElement(Layers, { size: 20 }), label: "Bathrooms", value: "3" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "2100 sq.ft" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Shield, { size: 20 })), name: "Private Elevator" }
    ]
  },
  5: {
    id: 5,
    title: "Urban Elite Heights",
    tagline: "Modern investment apartments",
    developer: "Urban Infra",
    location: "Gachibowli, Hyderabad",
    address: "Financial District, Hyderabad",
    price: "₹65 Lac",
    pricePerSqFt: "₹5,909/sq.ft",
    emi: "EMI starts at ₹35,000",
    type: "Flat",
    status: "Under Construction",
    possession: "2025",
    furnishing: "Unfurnished",
    bhk: "2 BHK",
    area: "1100 sqft",
    tag: "Investment Special",
    description: "Located in the heart of the Financial District, Urban Elite Heights is perfect for IT professionals and investors.",
    nearbyPlaces: [],
    projectOverview: {
      projectUnits: "500 Units",
      areaUnit: "sq.ft",
      projectArea: "10 Acres",
      sizes: "1100 - 1500 sq.ft",
      projectSize: "500 Units",
      launchDate: "2023",
      avgPrice: "₹5,909/sq.ft",
      possessionStarts: "2025",
      configuration: "2 BHK",
      reraId: "TS-RERA-999",
      reraUrl: "#"
    },
    brochureUrl: "#",
    brochureImages: [],
    unitTypes: [
      {
        type: "2 BHK",
        priceRange: "₹65 Lac",
        variants: [
          { size: "1100 sq.ft", price: "₹65 Lac", pricePerSqFt: "₹5,909", reraId: "TS-999", floorPlan: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", caption: "Exterior" }],
      totalMedia: 1
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "2 BHK" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "1100 sq.ft" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Dumbbell, { size: 20 })), name: "Gym" }
    ]
  },
  6: {
    id: 6,
    title: "Rosewood Gardens",
    tagline: "Eco-friendly living",
    developer: "Rosewood Developers",
    location: "Electronic City, Bangalore",
    address: "Electronic City Phase 1, Bangalore",
    price: "₹95 Lac",
    pricePerSqFt: "₹5,937/sq.ft",
    emi: "EMI starts at ₹48,000",
    type: "Flat",
    status: "Ready to Move",
    possession: "Immediate",
    furnishing: "Semi-Furnished",
    bhk: "3 BHK",
    area: "1600 sqft",
    tag: "Limited Time Offer",
    description: "Surrounded by rose gardens and open spaces, this project offers a breath of fresh air.",
    nearbyPlaces: [],
    projectOverview: {
      projectUnits: "200 Units",
      areaUnit: "sq.ft",
      projectArea: "6 Acres",
      sizes: "1600 sq.ft",
      projectSize: "200 Units",
      launchDate: "2019",
      avgPrice: "₹5,937/sq.ft",
      possessionStarts: "Immediate",
      configuration: "3 BHK",
      reraId: "KA-RERA-777",
      reraUrl: "#"
    },
    brochureUrl: "#",
    brochureImages: [],
    unitTypes: [
      {
        type: "3 BHK",
        priceRange: "₹95 Lac",
        variants: [
          { size: "1600 sq.ft", price: "₹95 Lac", pricePerSqFt: "₹5,937", reraId: "KA-777", floorPlan: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [{ url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", caption: "Garden View" }],
      totalMedia: 1
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "3 BHK" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "1600 sq.ft" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Trees, { size: 20 })), name: "Rose Garden" }
    ]
  },
  7: {
    id: 7,
    title: "Highland Meadows",
    tagline: "Weekend Gateway Villas",
    developer: "Highland Spaces",
    location: "Lonavala, Pune",
    address: "Tungarli, Lonavala",
    price: "₹1.5 Cr",
    pricePerSqFt: "₹6,250/sq.ft",
    emi: "EMI starts at ₹80,000",
    type: "Villa",
    status: "Ready to Move",
    possession: "Immediate",
    furnishing: "Furnished",
    bhk: "3 BHK",
    area: "2400 sqft",
    tag: "Best Value",
    description: "Your perfect weekend home in the hills of Lonavala.",
    nearbyPlaces: [],
    projectOverview: {
      projectUnits: "40 Villas",
      areaUnit: "sq.ft",
      projectArea: "8 Acres",
      sizes: "2400 sq.ft",
      projectSize: "40 Units",
      launchDate: "2021",
      avgPrice: "₹6,250/sq.ft",
      possessionStarts: "Immediate",
      configuration: "3 BHK Villa",
      reraId: "MAHA-RERA-555",
      reraUrl: "#"
    },
    brochureUrl: "#",
    brochureImages: [],
    unitTypes: [
      {
        type: "3 BHK Villa",
        priceRange: "₹1.5 Cr",
        variants: [
          { size: "2400 sq.ft", price: "₹1.5 Cr", pricePerSqFt: "₹6,250", reraId: "MH-555", floorPlan: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [{ url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", caption: "Villa Front" }],
      totalMedia: 1
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "3 BHK" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "2400 sq.ft" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Droplet, { size: 20 })), name: "Plunge Pool" }
    ]
  },
  8: {
    id: 8,
    title: "Sunrise Residency",
    tagline: "Compact Affordable Homes",
    developer: "Sunrise Builders",
    location: "Navi Mumbai",
    address: "Kharghar, Navi Mumbai",
    price: "₹35 Lac",
    pricePerSqFt: "₹5,384/sq.ft",
    emi: "EMI starts at ₹20,000",
    type: "Studio",
    status: "Ready to Move",
    possession: "Immediate",
    furnishing: "Unfurnished",
    bhk: "1 BHK",
    area: "650 sqft",
    tag: "Lowest Price",
    description: "Affordable starter homes for young professionals.",
    nearbyPlaces: [],
    projectOverview: {
      projectUnits: "300 Units",
      areaUnit: "sq.ft",
      projectArea: "2 Acres",
      sizes: "650 sq.ft",
      projectSize: "300 Units",
      launchDate: "2018",
      avgPrice: "₹5,384/sq.ft",
      possessionStarts: "Immediate",
      configuration: "1 BHK",
      reraId: "MAHA-RERA-111",
      reraUrl: "#"
    },
    brochureUrl: "#",
    brochureImages: [],
    unitTypes: [
      {
        type: "1 BHK",
        priceRange: "₹35 Lac",
        variants: [
          { size: "650 sq.ft", price: "₹35 Lac", pricePerSqFt: "₹5,384", reraId: "MH-111", floorPlan: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],
    mediaGallery: {
      photos: [{ url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", caption: "External" }],
      totalMedia: 1
    },
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "1 BHK" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "650 sq.ft" }
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(ShoppingBag, { size: 20 })), name: "Market Nearby" }
    ]
  }
};

// Export card-view data for listings
export const builderProperties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Skyline Residency",
    bhk: "3 BHK",
    type: "Flat",
    price: "₹1.2 Cr",
    area: "1850 sqft",
    location: "Banjara Hills, Hyderabad",
    tag: "Ready to Move"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Green Valley Villas",
    bhk: "4 BHK",
    type: "Villa",
    price: "₹2.5 Cr",
    area: "3200 sqft",
    location: "Whitefield, Bangalore",
    tag: "Under Construction"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Ocean View Apartments",
    bhk: "2 BHK",
    type: "Flat",
    price: "₹85 Lac",
    area: "1250 sqft",
    location: "Worli, Mumbai",
    tag: "Ready to Move"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Palm Grove Estates",
    bhk: "3 BHK",
    type: "Penthouse",
    price: "₹1.8 Cr",
    area: "2100 sqft",
    location: "Sector 45, Gurgaon",
    tag: "Ready to Move"
  }
];

export const bestDeals = [
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Urban Elite Heights",
    bhk: "2 BHK",
    type: "Flat",
    price: "₹65 Lac",
    area: "1100 sqft",
    location: "Gachibowli, Hyderabad",
    tag: "Investment Special"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Rosewood Gardens",
    bhk: "3 BHK",
    type: "Flat",
    price: "₹95 Lac",
    area: "1600 sqft",
    location: "Electronic City, Bangalore",
    tag: "Limited Time Offer"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Highland Meadows",
    bhk: "3 BHK",
    type: "Villa",
    price: "₹1.5 Cr",
    area: "2400 sqft",
    location: "Lonavala, Pune",
    tag: "Best Value"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    name: "Sunrise Residency",
    bhk: "1 BHK",
    type: "Studio",
    price: "₹35 Lac",
    area: "650 sqft",
    location: "Navi Mumbai",
    tag: "Lowest Price"
  }
];

// Function to get property details by ID
export const getPropertyById = (id) => {
  return propertyDatabase[id] || null;
};

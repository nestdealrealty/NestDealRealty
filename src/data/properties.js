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

    // NEW: Nearby Places
    nearbyPlaces: [
      { category: "School", icon: "School", name: "Delhi Public School", distance: "1.2 km" },
      { category: "Hospital", icon: "Hospital", name: "Apollo Hospitals", distance: "2.5 km" },
      { category: "Mall", icon: "ShoppingBag", name: "GVK One Mall", distance: "3.0 km" },
      { category: "Metro", icon: "Bus", name: "Banjara Hills Metro", distance: "1.8 km" },
      { category: "Restaurant", icon: "Coffee", name: "Jubilee Hills Restaurants", distance: "2.2 km" },
      { category: "Park", icon: "Trees", name: "Lumbini Park", distance: "4.5 km" }
    ],

    // NEW: Project Overview
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

    // NEW: Floor Plans & Pricing
    unitTypes: [
      {
        type: "3 BHK",
        priceRange: "₹1.2 Cr - ₹1.4 Cr",
        variants: [
          { size: "1850 sq.ft", price: "₹1.20 Cr", pricePerSqFt: "₹6,486", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=800&q=80" },
          { size: "1900 sq.ft", price: "₹1.25 Cr", pricePerSqFt: "₹6,579", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" },
          { size: "2100 sq.ft", price: "₹1.40 Cr", pricePerSqFt: "₹6,667", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" }
        ]
      },
      {
        type: "4 BHK",
        priceRange: "₹1.8 Cr - ₹2.2 Cr",
        variants: [
          { size: "2400 sq.ft", price: "₹1.80 Cr", pricePerSqFt: "₹7,500", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80" },
          { size: "2600 sq.ft", price: "₹2.00 Cr", pricePerSqFt: "₹7,692", reraId: "P02400004567", floorPlan: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" }
        ]
      }
    ],

    // NEW: Media Gallery (Photos & Videos)
    mediaGallery: {
      photos: [
        { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80", caption: "Exterior View" },
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", caption: "Living Room" },
        { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", caption: "Bedroom" },
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", caption: "Kitchen" },
        { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", caption: "Bathroom" },
        { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80", caption: "Balcony View" },
        { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", caption: "Lobby" },
        { url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80", caption: "Amenities" }
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
    highlights: [
      "Premium Vitrified Flooring",
      "Modular Kitchen with Chimney",
      "High-Speed Elevators",
      "24/7 Security with CCTV",
      "Earthquake Resistant Structure"
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
    ],
    gallery: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"
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
    specs: [
      { icon: React.createElement(Home, { size: 20 }), label: "Bedrooms", value: "4 BHK" },
      { icon: React.createElement(Layers, { size: 20 }), label: "Bathrooms", value: "4" },
      { icon: React.createElement(Ruler, { size: 20 }), label: "Area", value: "3200 sq.ft" },
      { icon: React.createElement(Car, { size: 20 }), label: "Parking", value: "3 Covered" },
      { icon: React.createElement(Maximize2, { size: 20 }), label: "Facing", value: "East" },
      { icon: React.createElement(Calendar, { size: 20 }), label: "Possession", value: "Dec 2026" }
    ],
    highlights: [
      "Private Garden & Terrace",
      "Smart Home Automation",
      "Premium Imported Fixtures",
      "Rainwater Harvesting System",
      "Solar Power Backup"
    ],
    amenities: [
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(School, { size: 20 })), name: "International Schools" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Bus, { size: 20 })), name: "Metro Connectivity" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(ShoppingBag, { size: 20 })), name: "Shopping Complex" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Coffee, { size: 20 })), name: "Clubhouse" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Droplet, { size: 20 })), name: "Swimming Pool" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Dumbbell, { size: 20 })), name: "Fitness Center" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Shield, { size: 20 })), name: "Gated Community" },
      { icon: React.createElement('div', { className: 'amenity-icon-box' }, React.createElement(Trees, { size: 20 })), name: "Landscaped Gardens" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  // Add more properties with similar structure...
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

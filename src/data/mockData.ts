import { Property, City, PortfolioData, PortfolioInvestment } from '../types';

export type MyProperty = {
  id: number;
  name: string;
  location: string;
  status: string;
  value: string;
  tokens: number;
  invested: string;
  image: string;
};

export const PROPERTY_CATEGORIES = ['Commercial', 'Holiday Homes', 'Residential', 'Land Parcels'] as const;
export type PropertyCategory = typeof PROPERTY_CATEGORIES[number];

export const properties: Property[] = [
  {
    id: '1',
    title: 'The Lake View Park',
    location: 'Financial District, Hyderabad',
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    expectedYield: 26.4,
    totalTokens: 5000,
    tokensLeft: 3400,
    percentInvested: 32,
    lockInPeriod: '1 year',
    investorCount: 19,
    rating: 4.6,
    isPreLeased: true,
    pricePerToken: 5000,
    totalValue: 25000000,
    type: 'Holiday Homes'
  },
  {
    id: '2',
    title: 'Metro Business Center',
    location: 'Whitefield, Bangalore',
    image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    expectedYield: 24.8,
    totalTokens: 4500,
    tokensLeft: 2475,
    percentInvested: 45,
    lockInPeriod: '1 year',
    investorCount: 23,
    rating: 4.8,
    isPreLeased: true,
    pricePerToken: 6000,
    totalValue: 27000000,
    tenant: 'Amazon',
    leaseYears: 7,
    type: 'Residential'
  },
  {
    id: '3',
    title: 'Tech Square',
    location: 'Bandra Kurla Complex, Mumbai',
    image: 'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    expectedYield: 28.2,
    totalTokens: 6000,
    tokensLeft: 4920,
    percentInvested: 18,
    lockInPeriod: '1 year',
    investorCount: 12,
    rating: 4.5,
    isPreLeased: true,
    pricePerToken: 7500,
    totalValue: 45000000,
    tenant: 'Microsoft',
    leaseYears: 10,
    type: 'Commercial'
  },

  {
    id: '4',
    title: 'zucis Square',
    location: 'Bandra Kurla Complex, goa',
    image: 'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    expectedYield: 28.2,
    totalTokens: 6000,
    tokensLeft: 4920,
    percentInvested: 18,
    lockInPeriod: '1 year',
    investorCount: 12,
    rating: 4.5,
    isPreLeased: true,
    pricePerToken: 7500,
    totalValue: 45000000,
    tenant: 'Microsoft',
    leaseYears: 10,
    type: 'Land Parcels'
  },
 
];

export const cities: City[] = [
  {
    id: 'bangalore',
    name: 'Bangalore',
    image: 'https://images.pexels.com/photos/4356144/pexels-photo-4356144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    projectCount: 30,
    returns: 24.6
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    image: 'https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    projectCount: 28,
    returns: 26.2
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    image: 'https://images.pexels.com/photos/3673353/pexels-photo-3673353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    projectCount: 25,
    returns: 26.4
  },
  {
    id: 'delhi',
    name: 'Delhi',
    image: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    projectCount: 22,
    returns: 23.5
  }
];

export const portfolioData: PortfolioData = {
  properties: 15,
  totalValue: "45.2 Cr",
  avgReturn: 12.8,
  occupancy: 94,
  topPerformingProperties: [
    {
      name: "Tech Park Hyderabad",
      type: "Commercial",
      occupancy: 96,
      area: "25,000 sq.ft",
      roi: 15.2
    },
    {
      name: "Retail Complex Bangalore",
      type: "Retail",
      occupancy: 94,
      area: "15,000 sq.ft",
      roi: 12.5
    },
    {
      name: "Office Tower Mumbai",
      type: "Office",
      occupancy: 92,
      area: "22,000 sq.ft",
      roi: 14.5
    }
  ]
};

export const portfolioInvestments: PortfolioInvestment[] = [
  {
    property: "The Lake View Park",
    image: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    type: "Commercial",
    location: "Hyderabad",
    amount: 500000,
    tokens: 100,
    returns: 26.4,
    status: "Active"
  },
  {
    property: "Metro Business Center",
    image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    type: "Commercial",
    location: "Bangalore",
    amount: 420000,
    tokens: 70,
    returns: 24.8,
    status: "Active"
  },
  {
    property: "Tech Square",
    image: "https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    type: "Office",
    location: "Mumbai",
    amount: 375000,
    tokens: 50,
    returns: 28.2,
    status: "Active"
  }
];

export const myProperties = [
  {
    id: 1,
    name: "Lake View Apartment",
    location: "Bangalore",
    status: "Active",
    value: "₹1,20,00,000",
    tokens: 5000,
    invested: "₹80,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Sunset Villa",
    location: "Mumbai",
    status: "Sold",
    value: "₹2,50,00,000",
    tokens: 8000,
    invested: "₹2,50,00,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Green Acres",
    location: "Hyderabad",
    status: "Pending",
    value: "₹90,00,000",
    tokens: 3000,
    invested: "₹60,00,000",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Skyline Towers",
    location: "Delhi",
    status: "Active",
    value: "₹1,80,00,000",
    tokens: 6000,
    invested: "₹1,20,00,000",
    image: "https://images.unsplash.com/photo-1628745278470-4b9f23b68629?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Ocean Breeze Villa",
    location: "Chennai",
    status: "Pending",
    value: "₹1,50,00,000",
    tokens: 4500,
    invested: "₹90,00,000",
    image: "https://images.unsplash.com/photo-1613977257592-6205e7e5a3f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Pinewood Cottage",
    location: "Pune",
    status: "Sold",
    value: "₹1,10,00,000",
    tokens: 3500,
    invested: "₹1,10,00,000",
    image: "https://images.unsplash.com/photo-1600585152915-18a540459b3d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Mountain Retreat",
    location: "Shimla",
    status: "Active",
    value: "₹1,40,00,000",
    tokens: 5500,
    invested: "₹95,00,000",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Urban Loft",
    location: "Kolkata",
    status: "Sold",
    value: "₹1,25,00,000",
    tokens: 4000,
    invested: "₹1,25,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Palm Grove Bungalow",
    location: "Goa",
    status: "Pending",
    value: "₹2,00,00,000",
    tokens: 7000,
    invested: "₹1,50,00,000",
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Cityscape Penthouse",
    location: "Ahmedabad",
    status: "Active",
    value: "₹2,30,00,000",
    tokens: 8500,
    invested: "₹1,80,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Riverside Mansion",
    location: "Jaipur",
    status: "Sold",
    value: "₹3,00,00,000",
    tokens: 10000,
    invested: "₹3,00,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Golden Horizon",
    location: "Kochi",
    status: "Pending",
    value: "₹1,70,00,000",
    tokens: 5200,
    invested: "₹1,10,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 13,
    name: "Silver Oaks",
    location: "Noida",
    status: "Active",
    value: "₹1,60,00,000",
    tokens: 5800,
    invested: "₹1,00,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    name: "Emerald Heights",
    location: "Gurgaon",
    status: "Sold",
    value: "₹2,80,00,000",
    tokens: 9000,
    invested: "₹2,80,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 15,
    name: "Blue Haven",
    location: "Bhubaneswar",
    status: "Pending",
    value: "₹1,30,00,000",
    tokens: 4200,
    invested: "₹85,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 16,
    name: "Sunlit Meadows",
    location: "Lucknow",
    status: "Active",
    value: "₹1,90,00,000",
    tokens: 6500,
    invested: "₹1,40,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 17,
    name: "Crystal Palace",
    location: "Indore",
    status: "Sold",
    value: "₹2,20,00,000",
    tokens: 7500,
    invested: "₹2,20,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 18,
    name: "Twilight Gardens",
    location: "Nagpur",
    status: "Pending",
    value: "₹1,45,00,000",
    tokens: 4800,
    invested: "₹95,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  }
];


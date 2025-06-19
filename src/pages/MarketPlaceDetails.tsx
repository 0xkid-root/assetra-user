import { useState, useMemo } from 'react';
import { Search, ArrowRight, ChevronDown } from 'lucide-react';

// Comprehensive mock data with working images
const properties = [
  // Commercial Properties
  {
    id: '1',
    title: 'Tech Square Commercial Complex',
    location: 'Bandra Kurla Complex, Mumbai',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
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
    type: 'Commercial',
    city: 'Mumbai'
  },
  {
    id: '2',
    title: 'Metro Business Center',
    location: 'Whitefield, Bangalore',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
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
    type: 'Commercial',
    city: 'Bangalore'
  },
  {
    id: '3',
    title: 'Corporate Plaza',
    location: 'Cyber City, Gurgaon',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    expectedYield: 26.5,
    totalTokens: 5500,
    tokensLeft: 3850,
    percentInvested: 30,
    lockInPeriod: '18 months',
    investorCount: 18,
    rating: 4.6,
    isPreLeased: true,
    pricePerToken: 6800,
    totalValue: 37400000,
    tenant: 'Google',
    leaseYears: 12,
    type: 'Commercial',
    city: 'Delhi'
  },
  {
    id: '4',
    title: 'Financial District Tower',
    location: 'Financial District, Hyderabad',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
    expectedYield: 25.1,
    totalTokens: 7000,
    tokensLeft: 5600,
    percentInvested: 20,
    lockInPeriod: '2 years',
    investorCount: 15,
    rating: 4.4,
    isPreLeased: false,
    pricePerToken: 5800,
    totalValue: 40600000,
    type: 'Commercial',
    city: 'Hyderabad'
  },

  // Residential Properties
  {
    id: '5',
    title: 'Skyline Residences',
    location: 'Powai, Mumbai',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    expectedYield: 22.3,
    totalTokens: 4000,
    tokensLeft: 2800,
    percentInvested: 30,
    lockInPeriod: '3 years',
    investorCount: 28,
    rating: 4.7,
    isPreLeased: false,
    pricePerToken: 4200,
    totalValue: 16800000,
    type: 'Residential',
    city: 'Mumbai'
  },
  {
    id: '6',
    title: 'Garden View Apartments',
    location: 'Koramangala, Bangalore',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    expectedYield: 21.8,
    totalTokens: 3500,
    tokensLeft: 2100,
    percentInvested: 40,
    lockInPeriod: '2 years',
    investorCount: 22,
    rating: 4.5,
    isPreLeased: false,
    pricePerToken: 3800,
    totalValue: 13300000,
    type: 'Residential',
    city: 'Bangalore'
  },
  {
    id: '7',
    title: 'Urban Heights',
    location: 'Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    expectedYield: 23.4,
    totalTokens: 4800,
    tokensLeft: 3360,
    percentInvested: 30,
    lockInPeriod: '2.5 years',
    investorCount: 19,
    rating: 4.6,
    isPreLeased: false,
    pricePerToken: 4500,
    totalValue: 21600000,
    type: 'Residential',
    city: 'Hyderabad'
  },
  {
    id: '8',
    title: 'Premium Villa Complex',
    location: 'Sector 50, Gurgaon',
    image: 'https://images.unsplash.com/photo-1613977257592-6205e7e5a3f1?w=800&q=80',
    expectedYield: 24.7,
    totalTokens: 6200,
    tokensLeft: 4340,
    percentInvested: 30,
    lockInPeriod: '3 years',
    investorCount: 31,
    rating: 4.8,
    isPreLeased: false,
    pricePerToken: 5200,
    totalValue: 32240000,
    type: 'Residential',
    city: 'Delhi'
  },

  // Holiday Homes
  {
    id: '9',
    title: 'The Lake View Resort',
    location: 'Lonavala, Maharashtra',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
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
    type: 'Holiday Homes',
    city: 'Maharashtra'
  },
  {
    id: '10',
    title: 'Beachfront Villas',
    location: 'Candolim, Goa',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    expectedYield: 29.1,
    totalTokens: 4200,
    tokensLeft: 2940,
    percentInvested: 30,
    lockInPeriod: '18 months',
    investorCount: 25,
    rating: 4.9,
    isPreLeased: false,
    pricePerToken: 6200,
    totalValue: 26040000,
    type: 'Holiday Homes',
    city: 'Goa'
  },
  {
    id: '11',
    title: 'Mountain Retreat',
    location: 'Manali, Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    expectedYield: 27.8,
    totalTokens: 3800,
    tokensLeft: 2660,
    percentInvested: 30,
    lockInPeriod: '2 years',
    investorCount: 16,
    rating: 4.7,
    isPreLeased: false,
    pricePerToken: 4800,
    totalValue: 18240000,
    type: 'Holiday Homes',
    city: 'Himachal Pradesh'
  },
  {
    id: '12',
    title: 'Heritage Palace Resort',
    location: 'Udaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    expectedYield: 31.2,
    totalTokens: 7500,
    tokensLeft: 5250,
    percentInvested: 30,
    lockInPeriod: '2 years',
    investorCount: 42,
    rating: 4.8,
    isPreLeased: true,
    pricePerToken: 7200,
    totalValue: 54000000,
    tenant: 'Taj Hotels',
    leaseYears: 15,
    type: 'Holiday Homes',
    city: 'Rajasthan'
  },

  // Industrial Properties
  {
    id: '13',
    title: 'Tech Manufacturing Hub',
    location: 'Electronic City, Bangalore',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80',
    expectedYield: 22.5,
    totalTokens: 3500,
    tokensLeft: 2100,
    percentInvested: 40,
    lockInPeriod: '2 years',
    investorCount: 15,
    rating: 4.3,
    isPreLeased: false,
    pricePerToken: 4500,
    totalValue: 15750000,
    type: 'Industrial',
    city: 'Bangalore'
  },
  {
    id: '14',
    title: 'Logistics Park',
    location: 'Bhiwandi, Mumbai',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310c?w=800&q=80',
    expectedYield: 20.8,
    totalTokens: 5200,
    tokensLeft: 3640,
    percentInvested: 30,
    lockInPeriod: '3 years',
    investorCount: 18,
    rating: 4.2,
    isPreLeased: true,
    pricePerToken: 3200,
    totalValue: 16640000,
    tenant: 'Flipkart',
    leaseYears: 8,
    type: 'Industrial',
    city: 'Mumbai'
  },
  {
    id: '15',
    title: 'Auto Components Factory',
    location: 'Aurangabad, Maharashtra',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    expectedYield: 19.5,
    totalTokens: 4600,
    tokensLeft: 3220,
    percentInvested: 30,
    lockInPeriod: '4 years',
    investorCount: 12,
    rating: 4.1,
    isPreLeased: true,
    pricePerToken: 2800,
    totalValue: 12880000,
    tenant: 'Mahindra',
    leaseYears: 12,
    type: 'Industrial',
    city: 'Maharashtra'
  },

  // Land Parcels
  {
    id: '16',
    title: 'Prime Development Land',
    location: 'Sector 89, Gurgaon',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    expectedYield: 35.2,
    totalTokens: 8000,
    tokensLeft: 5600,
    percentInvested: 30,
    lockInPeriod: '5 years',
    investorCount: 35,
    rating: 4.4,
    isPreLeased: false,
    pricePerToken: 8500,
    totalValue: 68000000,
    type: 'Land Parcels',
    city: 'Delhi'
  },
  {
    id: '17',
    title: 'IT Corridor Land',
    location: 'ORR, Hyderabad',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    expectedYield: 32.8,
    totalTokens: 6500,
    tokensLeft: 4550,
    percentInvested: 30,
    lockInPeriod: '4 years',
    investorCount: 28,
    rating: 4.6,
    isPreLeased: false,
    pricePerToken: 7200,
    totalValue: 46800000,
    type: 'Land Parcels',
    city: 'Hyderabad'
  },
  {
    id: '18',
    title: 'Metro Station Adjacent Plot',
    location: 'Navi Mumbai',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    expectedYield: 38.5,
    totalTokens: 9200,
    tokensLeft: 6440,
    percentInvested: 30,
    lockInPeriod: '6 years',
    investorCount: 45,
    rating: 4.7,
    isPreLeased: false,
    pricePerToken: 9800,
    totalValue: 90160000,
    type: 'Land Parcels',
    city: 'Mumbai'
  },

  // Agricultural Land
  {
    id: '19',
    title: 'Organic Farmland',
    location: 'Nashik, Maharashtra',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
    expectedYield: 18.7,
    totalTokens: 2500,
    tokensLeft: 1800,
    percentInvested: 28,
    lockInPeriod: '3 years',
    investorCount: 8,
    rating: 4.1,
    isPreLeased: false,
    pricePerToken: 3000,
    totalValue: 7500000,
    type: 'Agricultural Land',
    city: 'Maharashtra'
  },
  {
    id: '20',
    title: 'Vineyard Estate',
    location: 'Bangalore Hills',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    expectedYield: 21.3,
    totalTokens: 3200,
    tokensLeft: 2240,
    percentInvested: 30,
    lockInPeriod: '4 years',
    investorCount: 12,
    rating: 4.3,
    isPreLeased: false,
    pricePerToken: 4200,
    totalValue: 13440000,
    type: 'Agricultural Land',
    city: 'Bangalore'
  },
  {
    id: '21',
    title: 'Spice Plantations',
    location: 'Kerala Backwaters',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    expectedYield: 19.8,
    totalTokens: 2800,
    tokensLeft: 1960,
    percentInvested: 30,
    lockInPeriod: '5 years',
    investorCount: 9,
    rating: 4.2,
    isPreLeased: false,
    pricePerToken: 3500,
    totalValue: 9800000,
    type: 'Agricultural Land',
    city: 'Kerala'
  },

  // Hospitality Properties
  {
    id: '22',
    title: 'Grand Luxury Hotel',
    location: 'Marine Drive, Mumbai',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    expectedYield: 30.1,
    totalTokens: 8000,
    tokensLeft: 6400,
    percentInvested: 20,
    lockInPeriod: '2 years',
    investorCount: 25,
    rating: 4.9,
    isPreLeased: true,
    pricePerToken: 8500,
    totalValue: 68000000,
    tenant: 'Marriott',
    leaseYears: 15,
    type: 'Hospitality',
    city: 'Mumbai'
  },
  {
    id: '23',
    title: 'Business Hotel',
    location: 'MG Road, Bangalore',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    expectedYield: 27.4,
    totalTokens: 5800,
    tokensLeft: 4060,
    percentInvested: 30,
    lockInPeriod: '18 months',
    investorCount: 22,
    rating: 4.6,
    isPreLeased: true,
    pricePerToken: 6800,
    totalValue: 39440000,
    tenant: 'Hilton',
    leaseYears: 12,
    type: 'Hospitality',
    city: 'Bangalore'
  },
  {
    id: '24',
    title: 'Heritage Hotel',
    location: 'Connaught Place, Delhi',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103-dd0c7?w=800&q=80',
    expectedYield: 28.9,
    totalTokens: 6800,
    tokensLeft: 4760,
    percentInvested: 30,
    lockInPeriod: '2 years',
    investorCount: 31,
    rating: 4.8,
    isPreLeased: true,
    pricePerToken: 7500,
    totalValue: 51000000,
    tenant: 'ITC Hotels',
    leaseYears: 20,
    type: 'Hospitality',
    city: 'Delhi'
  },
  {
    id: '25',
    title: 'Beach Resort',
    location: 'Baga Beach, Goa',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    expectedYield: 32.5,
    totalTokens: 7200,
    tokensLeft: 5040,
    percentInvested: 30,
    lockInPeriod: '3 years',
    investorCount: 38,
    rating: 4.7,
    isPreLeased: false,
    pricePerToken: 8200,
    totalValue: 59040000,
    type: 'Hospitality',
    city: 'Goa'
  }
];

const cities = [
  {
    id: 'bangalore',
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80',
    projectCount: 30,
    returns: 24.6
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    projectCount: 28,
    returns: 26.2
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
    projectCount: 25,
    returns: 26.4
  },
  {
    id: 'delhi',
    name: 'Delhi',
    image: 'https://www.themaharajaexpress.org/blog/wp-content/uploads/2018/10/Lotus-Temple-Delhi-1024x783.jpg',
    projectCount: 22,
    returns: 23.5
  },
  {
    id: 'goa',
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    projectCount: 15,
    returns: 29.8
  },
  {
    id: 'kerala',
    name: 'Kerala',
    image: 'https://ihplb.b-cdn.net/wp-content/uploads/2021/09/kerala-in-october-kollam.jpg',
    projectCount: 12,
    returns: 20.5
  }
];

// Property type definition
interface Property {
  id: string;
  title: string;
  location: string;
  image: string;
  expectedYield: number;
  totalTokens: number;
  tokensLeft: number;
  percentInvested: number;
  lockInPeriod: string;
  investorCount: number;
  rating: number;
  isPreLeased: boolean;
  pricePerToken: number;
  totalValue: number;
  tenant?: string;
  leaseYears?: number;
  type: string;
  city: string;
}

// City type definition
interface City {
  id: string;
  name: string;
  image: string;
  projectCount: number;
  returns: number;
}

// PropertyCard Component
const PropertyCard = ({ property }: { property: Property }) => {
  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            {property.expectedYield}% Returns
          </span>
        </div>
        {property.isPreLeased && (
          <div className="absolute top-3 right-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Pre-leased
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
            {property.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{property.title}</h3>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{property.location}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-sm font-medium">{formatCurrency(property.totalValue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Price/Token</p>
            <p className="text-sm font-medium">₹{property.pricePerToken.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Funded: {property.percentInvested}%</span>
            <span>{property.tokensLeft.toLocaleString()} tokens left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${property.percentInvested}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-600 mb-4">
          <span>{property.investorCount} investors</span>
          <span>Lock-in: {property.lockInPeriod}</span>
        </div>
        
        {property.tenant && (
          <div className="mb-3 p-2 bg-blue-50 rounded">
            <p className="text-xs text-blue-700">
              <strong>Tenant:</strong> {property.tenant} ({property.leaseYears} years)
            </p>
          </div>
        )}
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Invest Now
        </button>
      </div>
    </div>
  );
};

// CityCard Component
const CityCard = ({ city }: { city: City }) => (
  <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
    <img
      src={city.image}
      alt={city.name}
      className="w-full h-32 object-cover"
      loading="lazy"
      onError={e => {
        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
      }}
    />
    <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-4 pointer-events-none">
      <h3 className="text-white text-lg font-semibold">{city.name}</h3>
      <p className="text-white text-sm">{city.projectCount} Projects</p>
      <p className="text-green-300 text-sm">{city.returns}% Avg. Returns</p>
    </div>
  </div>
);

// MarketPlaceDetails Component
const MarketPlaceDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('Active Assets');
  const [sortBy, setSortBy] = useState('High Returns');
  const [pageSize, setPageSize] = useState(12); // For pagination

  // Calculate category counts dynamically
  const categories = useMemo(() => {
    const categoryTypes = ['Commercial', 'Holiday Homes', 'Residential', 'Land Parcels', 'Industrial', 'Agricultural Land', 'Hospitality'];
    
    return [
      { id: 'all', name: 'All', count: properties.length },
      ...categoryTypes.map(type => ({
        id: type.toLowerCase().replace(' ', '-'),
        name: type,
        count: properties.filter(p => p.type === type).length
      }))
    ];
  }, []);

  // Filter properties based on selected criteria
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Category filter
      const categoryMatch = selectedCategory === 'All' || property.type === selectedCategory;
      
      // City filter
      const cityMatch = selectedCity === 'All' || property.city === selectedCity;
      
      // Search query filter
      const searchMatch = searchQuery === '' || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      let statusMatch = true;
      if (selectedFilter === 'Active Assets') {
        statusMatch = property.tokensLeft > 0;
      } else if (selectedFilter === 'Funded Assets') {
        statusMatch = property.percentInvested >= 80;
      } else if (selectedFilter === 'New Arrivals') {
        statusMatch = property.percentInvested < 30;
      }
      
      return categoryMatch && cityMatch && searchMatch && statusMatch;
    });

    // Sort properties
    if (sortBy === 'High Returns') {
      filtered.sort((a, b) => b.expectedYield - a.expectedYield);
    } else if (sortBy === 'Low Risk') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Recently Added') {
      filtered.sort((a, b) => a.percentInvested - b.percentInvested);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedCity, selectedFilter, sortBy]);

  // Paginated properties
  const displayedProperties = filteredProperties.slice(0, pageSize);

  // City options for dropdown
  const cityOptions = ['All', ...Array.from(new Set(properties.map(p => p.city))).sort()];

  // Filter options
  const filterOptions = ['Active Assets', 'Funded Assets', 'New Arrivals'];
  const sortOptions = ['High Returns', 'Low Risk', 'Recently Added'];

  // Load more properties
  const handleLoadMore = () => {
    setPageSize(prev => prev + 12);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Marketplace</h1>
        <p className="text-gray-600">Discover and invest in premium real estate opportunities across India</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            placeholder="Search by property name, location, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors text-sm ${
                  selectedCategory === category.name
                    ? 'bg-blue-100 border-blue-600 text-blue-700 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="font-medium">{category.name}</span>
                <span className="ml-2 text-xs bg-gray-200 rounded-full px-2 py-1">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* City and Sort Dropdowns */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* City Dropdown */}
          <div className="relative w-full md:w-1/3">
            <select
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full md:w-1/3">
            <select
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-2 w-2 text-gray w400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full md:w-1/3">
            <select
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Trending Cities Section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Cities</h2>
          <a href="#" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>

      {/* Trending Properties Section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Properties</h2>
          <a href="#" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProperties.length > 0 ? (
            displayedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">No properties found matching your criteria.</p>
          )}
        </div>
      </div>

      {/* Pre-Leased Properties Section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pre-Leased Properties</h2>
          <a href="#" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.filter(p => p.isPreLeased).slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {pageSize < filteredProperties.length && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketPlaceDetails;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { properties, cities } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Commercial');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [selectedFilter, setSelectedFilter] = useState('Active Assets');

  const categories = [
    { id: 'commercial', name: 'Commercial', count: 12 },
    { id: 'holiday', name: 'Holiday Homes', count: 8 },
    { id: 'residential', name: 'Residential', count: 15 },
    { id: 'land', name: 'Land Parcels', count: 6 },
  ];

  const trendingProperties = properties.slice(0, 3);
  const preLeasedProperties = properties.filter((p) => p.isPreLeased).slice(0, 3);

  return (
    <div className="w-full">
      {/* Search and Filter */}
      <div className="mb-8 w-full">
        <div className='flex flex-col mb-3'>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600 mt-1 text-sm">Welcome To the Real Estate DApp!</p>
      </div>

        <div className="relative mb-6 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6 w-full">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center px-4 py-2 rounded-lg ${
                selectedCategory === category.name
                  ? 'bg-primary-100 border-b-2 border-primary-600 text-primary-700'
                  : 'bg-white text-gray-700'
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span>{category.name}</span>
              {category.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full bg-gray-100">
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Assets */}
      <div className="mb-12 w-full">
        <div className="flex justify-between items-center mb-4 w-full">
          <h2 className="text-xl font-semibold">Trending Assets</h2>
          <Link to="/properties" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="flex justify-between items-center mb-4 w-full">
          <div className="flex space-x-2">
            <div className="relative inline-block">
              <select
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
                <option>Delhi</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown />
              </div>
            </div>

            <div className="relative inline-block">
              <select
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option>Active Assets</option>
                <option>Funded Assets</option>
                <option>New Arrivals</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown />
              </div>
            </div>
          </div>

          <div className="relative inline-block">
            <select
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              <option>High returns</option>
              <option>Low risk</option>
              <option>Recently added</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {trendingProperties.map((property) => (
            <div key={property.id} className="w-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {/* Pre-leased Assets */}
      <div className="mb-12 w-full">
        <div className="flex justify-between items-center mb-4 w-full">
          <h2 className="text-xl font-semibold">Pre-leased Assets</h2>
          <Link to="/pre-leased" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {preLeasedProperties.map((property) => (
            <div key={property.id} className="w-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {/* KYC Banner */}
   {/* Enhanced KYC Banner */}
   <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-8 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Complete Your KYC Verification</h3>
                <p className="text-orange-100">Unlock premium investments and higher limits</p>
                <div className="flex items-center mt-2 space-x-4 text-sm">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                    Identity Verified
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full mr-2"></span>
                    Bank Details Pending
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Complete KYC
              </button>
              <p className="text-orange-100 text-sm mt-2">2 minutes remaining</p>
            </div>
          </div>
        </div>

      {/* Explore Nearby Cities */}
      <div className="mb-12 w-full">
        <h2 className="text-xl font-semibold mb-4">Explore Nearby Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {cities.map((city) => (
            <Link
              to={`/cities/${city.id}`}
              key={city.id}
              className="relative rounded-lg overflow-hidden h-48 w-full"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-semibold truncate">{city.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-white/20 rounded-full px-2 py-1 truncate">
                    {city.projectCount}+ Projects
                  </span>
                  <span className="text-xs ml-2 truncate">Top Returns: {city.returns}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Dashboard;
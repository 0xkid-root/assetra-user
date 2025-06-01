import React, { useState } from 'react';
import { myProperties, type MyProperty } from '../data/mockData';

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  Sold: 'bg-gray-100 text-gray-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

const MyProperties: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter properties based on search query
  const filteredProperties = myProperties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination details
  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Handle page navigation
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="flex items-center gap-2 bg-primary-600 text-white py-2 px-5 rounded-lg hover:bg-primary-700 transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            List New Property
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProperties.map((property: MyProperty) => (
          <div key={property.id} className="bg-white rounded-lg shadow p-6 flex flex-col">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">{property.name}</h2>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  statusColors[property.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {property.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">{property.location}</div>
            <div className="flex justify-between text-sm mb-3">
              <span>
                Value: <span className="font-medium">{property.value}</span>
              </span>
              <span>
                Tokens: <span className="font-medium">{property.tokens}</span>
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Invested: <span className="font-medium">{property.invested}</span>
            </div>
            <button className="mt-auto bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`py-2 px-4 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            } transition`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`py-2 px-4 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            } transition`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
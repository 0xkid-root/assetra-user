import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Share2, PlayCircle, Info } from 'lucide-react';
import { Property } from '../types';
import ProgressBar from './ProgressBar';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="relative w-full">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-52 object-cover"
        />

        {/* Pre-leased badge */}
        {property.isPreLeased && (
          <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded">
            Pre-leased
          </span>
        )}

        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <Bookmark size={16} className="text-gray-600" />
          </button>
          <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <Share2 size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Video button */}
        <button className="absolute bottom-4 left-4 flex items-center space-x-1.5 bg-black/60 text-white px-2.5 py-1.5 rounded-lg text-xs">
          <PlayCircle size={16} />
          <span>Watch Video</span>
        </button>
      </div>

      {/* Property content */}
      <div className="p-4">
        {/* Title & Location */}
        <Link to={`/property/${property.id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{property.location}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <span className="text-sm text-gray-500">Exp Yield</span>
              <Info size={14} className="ml-1 text-gray-400 flex-shrink-0" />
            </div>
            <span className="text-sm font-semibold text-green-600 truncate">
              {property.expectedYield}%
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <span className="text-sm text-gray-500">Total tokens</span>
              <Info size={14} className="ml-1 text-gray-400 flex-shrink-0" />
            </div>
            <span className="text-sm font-semibold truncate">
              {property.totalTokens.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <span className="text-sm text-gray-500">Lock-in</span>
              <Info size={14} className="ml-1 text-gray-400 flex-shrink-0" />
            </div>
            <span className="text-sm font-semibold truncate">
              {property.lockInPeriod}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2 w-full">
          <ProgressBar
            progress={property.percentInvested}
            color={property.expectedYield >= 25 ? "green" : "blue"}
          />
        </div>
        <div className="flex justify-between items-center text-sm mb-4">
          <span className="text-gray-600 truncate">
            {property.percentInvested}% Invested
          </span>
          <span className="text-gray-600 truncate">
            {property.tokensLeft.toLocaleString()} Tokens left
          </span>
        </div>

        {/* Investors & Rating */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0"
                  src={`https://randomuser.me/api/portraits/${
                    i % 2 ? 'women' : 'men'
                  }/${i + 10}.jpg`}
                  alt="Investor avatar"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 truncate">
              {property.investorCount}+ Investors
            </span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-400 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium">
              {property.rating}
            </span>
          </div>
        </div>

        {/* View details button */}
        <Link
          to={`/property/${property.id}/buy`}
          className="block w-full mt-4 py-2 text-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Let's invest
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
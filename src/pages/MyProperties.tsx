import  { useState } from 'react';
import { Search, Plus, Home, Upload, Eye, TrendingUp, MapPin, Coins, DollarSign } from 'lucide-react';

// Mock data for owned properties
const ownedProperties = [
  {
    id: 1,
    name: "Luxury Downtown Apartment",
    location: "Manhattan, NY",
    value: "$1,250,000",
    tokens: "1,250",
    invested: "$25,000",
    status: "Active",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
    roi: "+12.5%"
  },
  {
    id: 2,
    name: "Modern Beach House",
    location: "Miami, FL",
    value: "$850,000",
    tokens: "850",
    invested: "$17,000",
    status: "Sold",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
    roi: "+8.3%"
  },
  {
    id: 3,
    name: "Urban Loft Space",
    location: "Chicago, IL",
    value: "$675,000",
    tokens: "675",
    invested: "$13,500",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
    roi: "+15.2%"
  }
];

// Mock data for uploaded properties
const uploadedProperties = [
  {
    id: 4,
    name: "Commercial Office Building",
    location: "Austin, TX",
    value: "$2,100,000",
    tokens: "2,100",
    uploaded: "2024-05-15",
    status: "Under Review",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
    type: "Commercial"
  },
  {
    id: 5,
    name: "Suburban Family Home",
    location: "Phoenix, AZ",
    value: "$425,000",
    tokens: "425",
    uploaded: "2024-05-20",
    status: "Approved",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop",
    type: "Residential"
  }
];

type OwnedProperty = typeof ownedProperties[number];
type UploadedProperty = typeof uploadedProperties[number];

const statusColors: { [key: string]: string } = {
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Sold: 'bg-slate-100 text-slate-800 border-slate-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
  Approved: 'bg-green-100 text-green-800 border-green-200',
};

const MyProperties = () => {
  const [activeTab, setActiveTab] = useState('owned');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentData = activeTab === 'owned' ? ownedProperties : uploadedProperties;
  
  const filteredProperties = currentData.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const renderOwnedProperty = (property: OwnedProperty) => (
    <div key={property.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[property.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <span className="text-xs font-medium text-emerald-600">{property.roi}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-medium  text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {property.name}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <DollarSign className="w-4 h-4 text-green-600" />
              <TrendingUp className="w-3 h-3 text-green-500" />
            </div>
            <p className="text-xs text-gray-600 mt-1">Property Value</p>
            <p className="text-lg font-bold text-gray-900">{property.value}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <Coins className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">{property.tokens}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Tokens Owned</p>
            <p className="text-lg font-bold text-gray-900">{property.invested}</p>
          </div>
        </div>

        <button className="w-full  bg-primary-600 hover:bg-primary-700 transition-colors text-white py-3 rounded-xl duration-300 flex items-center justify-center gap-2 font-medium">
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );

  const renderUploadedProperty = (property: UploadedProperty) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex gap-2 mb-2">
        <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">Commercial</span>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">Under Review</span>
      </div>
      <img src={property.image} alt={property.name} className="w-full h-32 object-cover rounded mb-2" />
      <h2 className="text-base font-semibold mb-1">{property.name}</h2>
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {property.location}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <DollarSign className="w-4 h-4 text-green-600 mb-1" />
          <p className="text-xs text-gray-600">Est. Value</p>
          <p className="text-lg font-bold text-gray-900">{property.value}</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <Coins className="w-4 h-4 text-blue-600 mb-1" />
          <p className="text-xs text-gray-600">Tokens</p>
          <p className="text-lg font-bold text-gray-900">{property.tokens}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-600">Uploaded on</p>
        <p className="text-sm font-medium text-gray-900">{new Date(property.uploaded).toLocaleDateString()}</p>
      </div>

      <button className="w-full  text-white py-3 rounded-xl  bg-primary-600 hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center gap-2 font-medium">
        <Eye className="w-4 h-4" />
        Manage Property
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            My Properties
          </h1>
          <p className="text-gray-600">Manage your real estate portfolio and track your investments</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => handleTabChange('owned')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-3 font-semibold transition-all duration-300 ${
                activeTab === 'owned'
                  ? ' bg-primary-600 hover:bg-primary-70 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home className="w-5 h-5" />
              Owned Assets
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === 'owned' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {ownedProperties.length}
              </span>
            </button>
            
            <button
              onClick={() => handleTabChange('uploaded')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-3 font-semibold transition-all duration-300 ${
                activeTab === 'uploaded'
                  ? ' bg-primary-600 hover:bg-primary-70 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              Uploaded Assets
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === 'uploaded' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'
              }`}>
                {uploadedProperties.length}
              </span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'owned' ? 'owned' : 'uploaded'} properties...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          
          <button className={`flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ${
            activeTab === 'owned' 
              ? ' bg-primary-600 hover:bg-primary-700 transition-colors' 
              : ' bg-primary-600 hover:bg-primary-700 transition-colors'
          }`}>
            <Plus className="w-5 h-5" />
            {activeTab === 'owned' ? 'Buy New Property' : 'Upload Property'}
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {activeTab === 'owned'
            ? (currentProperties as OwnedProperty[]).map(renderOwnedProperty)
            : (currentProperties as UploadedProperty[]).map(renderUploadedProperty)
          }
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              activeTab === 'owned' ? 'bg-blue-100' : 'bg-purple-100'
            }`}>
              {activeTab === 'owned' ? (
                <Home className={`w-12 h-12 ${activeTab === 'owned' ? 'text-blue-600' : 'text-purple-600'}`} />
              ) : (
                <Upload className={`w-12 h-12 ${activeTab === 'owned' ? 'text-blue-600' : 'text-purple-600'}`} />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab === 'owned' ? 'owned' : 'uploaded'} properties found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No properties match "${searchQuery}"`
                : `You haven't ${activeTab === 'owned' ? 'invested in' : 'uploaded'} any properties yet.`
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : `${activeTab === 'owned' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white shadow-lg`
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === page
                      ? `${activeTab === 'owned' ? 'bg-blue-600' : 'bg-purple-600'} text-white shadow-lg`
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : `${activeTab === 'owned' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white shadow-lg`
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;
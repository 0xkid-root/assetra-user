import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Share2, PlayCircle, ChevronUp, ChevronDown, ExternalLink, Info, Building, Clock, DollarSign, Users, Check } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { properties } from '../data/mockData';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id) || properties[0];
  
  const [expandedSections, setExpandedSections] = useState({
    keyHighlights: true,
    propertyCost: true,
    tenantDetails: true,
    assetManager: true
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/projects" className="hover:text-primary-600">Projects</Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Property Hero */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="relative">
              <img src={property.image} alt={property.title} className="w-full h-96 object-cover" />
              
              {property.isPreLeased && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded">
                  Pre-leased
                </span>
              )}
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                  <Bookmark size={18} className="text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                  <Share2 size={18} className="text-gray-600" />
                </button>
              </div>
              
              <button className="absolute bottom-4 left-4 flex items-center space-x-1.5 bg-black/60 text-white px-3 py-2 rounded-lg text-sm">
                <PlayCircle size={18} />
                <span>Watch Video</span>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{property.title}</h1>
                  <div className="flex items-center text-gray-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Property Stats */}
              <div className="grid grid-cols-4 gap-6 mt-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span>Returns (P.A.)</span>
                    <Info size={14} className="ml-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-600 font-medium">+{property.expectedYield}%</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span>Price Per Token</span>
                    <Info size={14} className="ml-1 text-gray-400" />
                  </div>
                  <div className="text-gray-900 font-medium">₹{property.pricePerToken.toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span>Lock-in</span>
                    <Info size={14} className="ml-1 text-gray-400" />
                  </div>
                  <div className="text-gray-900 font-medium">{property.lockInPeriod}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span>Total Tokens</span>
                    <Info size={14} className="ml-1 text-gray-400" />
                  </div>
                  <div className="text-gray-900 font-medium">₹{property.totalValue.toLocaleString()}</div>
                </div>
              </div>
              
              {/* Property Progress */}
              <div className="py-6">
                <div className="mb-2">
                  <ProgressBar progress={property.percentInvested} color="green" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{property.percentInvested}% Invested</span>
                  <span className="text-gray-600">{property.tokensLeft.toLocaleString()} Tokens left</span>
                </div>
              </div>
              
              {/* Investors */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-2">
                    {[1, 2, 3].map((i) => (
                      <img 
                        key={i} 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 10}.jpg`}
                        alt={`Investor ${i}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">{property.investorCount} Investors</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 font-medium">{property.rating} Reviews</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex overflow-x-auto space-x-6 pb-1">
              <button className="px-4 py-2 text-primary-600 font-medium border-b-2 border-primary-600 whitespace-nowrap">
                Growth
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Overview
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Documents
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 whitespace-nowrap">
                FAQs
              </button>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div 
              className="flex justify-between items-center p-5 cursor-pointer"
              onClick={() => toggleSection('keyHighlights')}
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </span>
                <h3 className="text-lg font-medium text-gray-900">Key Highlights</h3>
              </div>
              <div>
                {expandedSections.keyHighlights ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.keyHighlights && (
              <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Building size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Asset Type</h4>
                    <p className="font-medium">Commercial Building</p>
                    <p className="text-sm text-gray-600">Premium Location</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Projected Appreciation</h4>
                    <p className="font-medium">8.4% per annum</p>
                    <p className="text-sm text-gray-600">Based on historical data</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3v2H7a1 1 0 000 2h1v1a1 1 0 01-1 1 1 1 0 100 2h6a1 1 0 100-2H9.83c.11-.313.17-.65.17-1v-1h1a1 1 0 100-2h-1V7a1 1 0 112 0 1 1 0 102 0 3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Asset Value</h4>
                    <p className="font-medium">₹5,00,00,000</p>
                    <p className="text-sm text-gray-600">Independent appraisal</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <DollarSign size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Price per SQFT</h4>
                    <p className="font-medium">₹11,000</p>
                    <p className="text-sm text-gray-600">Competitive market rate</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">SPV Name</h4>
                    <p className="font-medium">LLP Partnership</p>
                    <p className="text-sm text-gray-600">Dedicated entity</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ownership Type</h4>
                    <p className="font-medium">LLP Partnership</p>
                    <p className="text-sm text-gray-600">Limited liability protection</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Property Costing */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div 
              className="flex justify-between items-center p-5 cursor-pointer"
              onClick={() => toggleSection('propertyCost')}
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-500 mr-3">
                  <DollarSign size={20} />
                </span>
                <h3 className="text-lg font-medium text-gray-900">Property Costing</h3>
              </div>
              <div>
                {expandedSections.propertyCost ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.propertyCost && (
              <div className="p-5 pt-0">
                <div className="flex justify-between mb-3">
                  <button className="px-3 py-1.5 border-b-2 border-primary-600 text-primary-600 font-medium text-sm">
                    Cost Details
                  </button>
                  <button className="px-3 py-1.5 text-gray-600 font-medium text-sm">
                    Investment Summary
                  </button>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Total Cost</span>
                    <span className="font-medium">₹203,45,000</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                            Property Price
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-green-600">
                            85%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                        <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm">Property Price</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-sm">Legal Fees</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                        <span className="text-sm">Platform Fee</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm">Registration Fees</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Cost Per Token</span>
                      </div>
                      <span className="font-medium">₹1,000</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                        </svg>
                        <span>Additional Costs</span>
                      </div>
                      <span className="font-medium">₹15,000</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Value Change</span>
                      </div>
                      <span className="text-green-600 font-medium">+52.4K</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Investment Overview</span>
                      </div>
                      <span className="text-green-600 font-medium">+28.4% growth</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Tenant Details */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div 
              className="flex justify-between items-center p-5 cursor-pointer"
              onClick={() => toggleSection('tenantDetails')}
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-500 mr-3">
                  <Users size={20} />
                </span>
                <h3 className="text-lg font-medium text-gray-900">Tenant Details</h3>
              </div>
              <div>
                {expandedSections.tenantDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.tenantDetails && (
              <div className="p-5 pt-0">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Total Area (SFT)</h4>
                    <p className="font-medium">1,00,000</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Rent Per SFT</h4>
                    <p className="font-medium">₹5.5 Years</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Vacancy Rate (%)</h4>
                    <p className="font-medium">5.5 Years</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Total SFT Gross Rent</h4>
                    <p className="font-medium">₹1,00,00,000</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-medium mb-4">Rental Income</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-sm text-gray-500 mb-2">Gross Rent</h5>
                      <p className="font-medium">₹ 1,00,00,000</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="text-sm text-gray-500 mb-2">Expenses</h5>
                      <p className="font-medium">₹ 1,00,000</p>
                      <p className="text-xs text-gray-500">Expense Breakdown</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="text-sm text-gray-500 mb-2">Net Rent</h5>
                      <p className="font-medium">₹ 90,00,000</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Current Tenants</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center">
                          <img 
                            src="https://logo.clearbit.com/starbucks.com" 
                            alt="Starbucks" 
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=SB';
                            }}
                          />
                          <div>
                            <h5 className="font-medium">Starbucks</h5>
                            <p className="text-sm text-gray-500">Premium Retail</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Lease period</p>
                          <p className="font-medium">5.5 Years</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center">
                          <img 
                            src="https://logo.clearbit.com/adityabirla.com" 
                            alt="Aditya Birla" 
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=AB';
                            }}
                          />
                          <div>
                            <h5 className="font-medium">Aditya Birla Realty</h5>
                            <p className="text-sm text-gray-500">Office</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Lease period</p>
                          <p className="font-medium">6.5 Years</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src="https://logo.clearbit.com/wework.com" 
                            alt="WeWork" 
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=WW';
                            }}
                          />
                          <div>
                            <h5 className="font-medium">WeWork</h5>
                            <p className="text-sm text-gray-500">Co-working Space</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Lease period</p>
                          <p className="font-medium">7 Years</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Asset Manager */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div 
              className="flex justify-between items-center p-5 cursor-pointer"
              onClick={() => toggleSection('assetManager')}
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-500 mr-3">
                  <Users size={20} />
                </span>
                <h3 className="text-lg font-medium text-gray-900">Asset Manager</h3>
              </div>
              <div>
                {expandedSections.assetManager ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.assetManager && (
              <div className="p-5 pt-0">
                <div className="flex items-start mb-6">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Asset Manager"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-lg font-medium">Mani Suresh Narayana</h4>
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Verified</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Senior Real Estate Manager | 7 years experience</p>
                    <div className="flex items-center mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-600 ml-1">4.9/5.0 (22 reviews)</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-600">Hyderabad, India - English</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <button className="flex-1 flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50 mb-3 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Book an Appointment
                  </button>
                  <button className="flex-1 flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50 mb-3 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email
                  </button>
                </div>
                
                <div className="flex justify-between mt-6 pt-6 border-t border-gray-100">
                  <button className="px-4 py-2 text-primary-600 font-medium text-sm">Profile</button>
                  <button className="px-4 py-2 text-gray-600 font-medium text-sm">Portfolio</button>
                  <button className="px-4 py-2 text-gray-600 font-medium text-sm">Ratings</button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-4">Portfolio Overview</h4>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Properties</p>
                      <p className="font-medium">15</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="font-medium">₹45.2 Cr</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Avg. Return</p>
                      <p className="font-medium text-green-600">12.8%</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Occupancy</p>
                      <p className="font-medium">94%</p>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-4">Top Performing Properties</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div>
                        <h5 className="font-medium">Tech Park Hyderabad</h5>
                        <p className="text-sm text-gray-500">Commercial • 96% occupancy • 25,000 sq.ft</p>
                      </div>
                      <span className="text-green-600 font-medium">+15.2% ROI</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div>
                        <h5 className="font-medium">Retail Complex Bangalore</h5>
                        <p className="text-sm text-gray-500">Retail • 94% occupancy • 15,000 sq.ft</p>
                      </div>
                      <span className="text-green-600 font-medium">+12.5% ROI</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div>
                        <h5 className="font-medium">Office Tower Mumbai</h5>
                        <p className="text-sm text-gray-500">Office • 92% occupancy • 22,000 sq.ft</p>
                      </div>
                      <span className="text-green-600 font-medium">+14.5% ROI</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium mb-4">Choose Tokens</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Per token returns</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Est. ROI</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">₹ 34,000</span>
                  <span className="text-green-600 font-medium">26.4% <span className="text-green-500">↑</span></span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Your ownership</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Lock-in period</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">0%</span>
                  <span className="font-medium">1 year</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  to={`/property/${id}/buy`}
                  className="block w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-lg font-medium transition-colors"
                >
                  Let's invest
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-center mb-4">
                Your investment is legally protected
              </p>
              
              <div className="flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                    <Check size={20} className="text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500 text-center">Legally Protected</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 text-center">Blockchain Secured</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 text-center">Smart Contracts</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 text-center">Liquid Assets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
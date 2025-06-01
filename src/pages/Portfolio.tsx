import React, { useState } from 'react';
import { Building, ArrowUpRight, PieChart, BarChart3, TrendingUp, Filter } from 'lucide-react';
import { portfolioData, portfolioInvestments } from '../data/mockData';
import ProgressBar from '../components/ProgressBar';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">My Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-50 mr-3">
                <Building className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Investment Value</h3>
                <p className="text-xl font-semibold">₹32,45,000</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="mr-1 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Active
              </span>
              <span className="ml-2 text-sm text-gray-500">Across 5 properties</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-green-50 mr-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Returns</h3>
                <p className="text-xl font-semibold">₹4,85,250</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-green-600 font-medium">+14.9%</span> overall return
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-amber-50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Monthly Income</h3>
                <p className="text-xl font-semibold">₹32,450</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Next payout in 8 days
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Portfolio Overview
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'investments'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('investments')}
          >
            My Investments
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'transactions'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transaction History
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Properties</div>
                <div className="text-xl font-semibold">{portfolioData.properties}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Total Value</div>
                <div className="text-xl font-semibold">₹{portfolioData.totalValue}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Avg. Return</div>
                <div className="text-xl font-semibold text-green-600">{portfolioData.avgReturn}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Occupancy</div>
                <div className="text-xl font-semibold">{portfolioData.occupancy}%</div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Top Performing Properties</h3>
              
              <div className="space-y-4">
                {portfolioData.topPerformingProperties.map((property, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{property.name}</h4>
                        <p className="text-sm text-gray-500">{property.type} • {property.occupancy}% occupancy • {property.area} sq.ft</p>
                      </div>
                      <div className="text-green-600 font-medium">+{property.roi}% ROI</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Investment Distribution</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 border border-gray-100 rounded-lg">
                  <h4 className="font-medium mb-3">By Property Type</h4>
                  <div className="flex justify-between items-center">
                    <div className="space-y-3 w-full">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Commercial</span>
                          <span className="text-sm font-medium">64%</span>
                        </div>
                        <ProgressBar progress={64} color="blue" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Residential</span>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <ProgressBar progress={28} color="green" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Industrial</span>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <ProgressBar progress={8} color="orange" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 border border-gray-100 rounded-lg">
                  <h4 className="font-medium mb-3">By Location</h4>
                  <div className="flex justify-between items-center">
                    <div className="space-y-3 w-full">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Mumbai</span>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <ProgressBar progress={42} color="blue" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Bangalore</span>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <ProgressBar progress={35} color="green" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Hyderabad</span>
                          <span className="text-sm font-medium">23%</span>
                        </div>
                        <ProgressBar progress={23} color="orange" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'investments' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">My Investments</h3>
              <button className="flex items-center text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-200">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {portfolioInvestments.map((investment, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md flex-shrink-0 bg-gray-200 overflow-hidden mr-3">
                            <img
                              src={investment.image}
                              alt={investment.property}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{investment.property}</div>
                            <div className="text-xs text-gray-500">{investment.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {investment.location}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                        ₹{investment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        {investment.tokens}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                        {investment.returns}%
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        <button className="text-primary-600 hover:text-primary-900">
                          View <ArrowUpRight size={14} className="inline ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Transaction History</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search transactions"
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
                <button className="flex items-center text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-200">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {
                      date: 'May 15, 2025',
                      id: 'TXN123456789',
                      description: 'Investment - The Lake View Park',
                      amount: 120000,
                      type: 'debit',
                      status: 'Completed'
                    },
                    {
                      date: 'Apr 28, 2025',
                      id: 'DIV987654321',
                      description: 'Dividend - Tech Square',
                      amount: 8450,
                      type: 'credit',
                      status: 'Processed'
                    },
                    {
                      date: 'Apr 15, 2025',
                      id: 'DIV876543210',
                      description: 'Dividend - Metro Business Center',
                      amount: 7200,
                      type: 'credit',
                      status: 'Processed'
                    },
                    {
                      date: 'Mar 22, 2025',
                      id: 'TXN765432109',
                      description: 'Investment - Tech Square',
                      amount: 85000,
                      type: 'debit',
                      status: 'Completed'
                    },
                    {
                      date: 'Mar 10, 2025',
                      id: 'DIV654321098',
                      description: 'Dividend - The Lake View Park',
                      amount: 5300,
                      type: 'credit',
                      status: 'Processed'
                    }
                  ].map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {transaction.description}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                          transaction.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        <button className="text-primary-600 hover:text-primary-900">
                          View <ArrowUpRight size={14} className="inline ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
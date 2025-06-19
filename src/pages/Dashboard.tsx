import React, { useState } from 'react';
import { Bell, TrendingUp, DollarSign, Home, AlertTriangle, Star, ChevronRight, Eye, EyeOff, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  const transactions = [
    { date: '2024-07-20', type: 'Share Purchase', asset: 'Property A', amount: '$50,000', status: 'Completed', change: '+2.3%' },
    { date: '2024-07-15', type: 'Dividend Claim', asset: 'REIT B', amount: '$1,000', status: 'Completed', change: '+1.8%' },
    { date: '2024-07-10', type: 'Loan Repayment', asset: 'Property C', amount: '$20,000', status: 'Completed', change: '-0.5%' },
  ];

  const properties = [
    { name: 'Luxury Condos Downtown', value: '$2,000,000', return: '8.2%', status: 'High Demand', image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Commercial Plaza', value: '$1,500,000', return: '7.5%', status: 'Stable', image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Residential Complex', value: '$3,200,000', return: '9.1%', status: 'New Listing', image: 'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      

      <div className="p-6 space-y-8">

        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, Olivia ✨
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your investments today</p>
          </div>
         
        </div>

        {/* Portfolio Summary */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Portfolio Overview
            </h2>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              <span className="ml-1 text-sm">{balanceVisible ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm text-gray-600 font-medium">Total Investment Value</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {balanceVisible ? '$500,000' : '••••••'}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5% this month
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm text-gray-600 font-medium mb-3">Asset Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Property A</span>
                  <span className="font-semibold text-gray-900">$300,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">REIT B</span>
                  <span className="font-semibold text-gray-900">$200,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl group-hover:animate-bounce">📈</div>
              </div>
              <h3 className="text-sm text-gray-600 font-medium">Recent Performance</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">+5.2%</p>
              <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
            </div>
          </div>
        </section>

        {/* Financial Activity */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-purple-600" />
            Financial Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium mb-1">Unclaimed Dividends</p>
                  <p className="text-3xl font-bold text-green-600">1,500 USDC</p>
                  <p className="text-sm text-green-600 mt-2">Ready to claim</p>
                </div>
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center">
                  Claim
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg border border-red-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700 font-medium">Loan Status Alert</p>
                  </div>
                  <p className="text-xl font-bold text-red-600 mb-3">High LTV Warning</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Total Borrowed:</span>
                      <span className="font-semibold">100,000 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collateral Value:</span>
                      <span className="font-semibold">150,000 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LTV Ratio:</span>
                      <span className="font-bold text-red-600">66.67%</span>
                    </div>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2 mt-4">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Featured Properties */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            Featured Investment Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {property.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white ">
                    <div className="text-2xl font-bold">{property.return}</div>
                    <div className="text-sm opacity-90 ">Expected Return</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {property.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-700 mb-4">{property.value}</p>
                  <button className="w-full ple-500 bg-primary-600 hover:bg-primary-70 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance & Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compliance Alerts */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Compliance Alerts
            </h2>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mr-4">
                  <span className="text-white text-xl">📄</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold mb-2">KYC Verification Required</p>
                  <p className="text-sm text-gray-600 mb-4">Complete your verification to unlock all features</p>
                  <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                    Complete Now
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Platform Announcements */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Latest Updates
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mr-4">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-bold mb-2">Automated Reinvestment</h3>
                  <p className="text-sm text-gray-600 mb-4">Maximize returns with our new smart reinvestment feature</p>
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>


                {/* Recent Transactions */}
                <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Recent Transactions
          </h2>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className=" bg-primary-600 hover:bg-primary-70 text-white">
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Asset</th>
                    <th className="p-4 text-left font-semibold">Amount</th>
                    <th className="p-4 text-left font-semibold">Change</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 text-gray-700">{txn.date}</td>
                      <td className="p-4 text-gray-700 font-medium">{txn.type}</td>
                      <td className="p-4 text-gray-700">{txn.asset}</td>
                      <td className="p-4 text-gray-900 font-semibold">{txn.amount}</td>
                      <td className="p-4">
                        <span className={`flex items-center ${txn.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.change.startsWith('+') ? 
                            <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                          }
                          {txn.change}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
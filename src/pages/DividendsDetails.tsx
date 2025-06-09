import { useState } from "react"
import { Building2, Home, DollarSign, Search, TrendingUp, BarChart3, ArrowLeftRight,  Download, Filter,  Coins, Wallet, Clock, CheckCircle2 } from "lucide-react"

export default function DividendsDetails() {
  const [claimAmount, setClaimAmount] = useState("")
  const [activeNav, setActiveNav] = useState("Dividends")
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")

  const navigationItems = [
    { name: "Dashboard", icon: Home },
    { name: "Invest", icon: Search },
    { name: "Portfolio", icon: BarChart3 },
    { name: "Dividends", icon: DollarSign },
    { name: "Trade", icon: ArrowLeftRight },
  ]

  const unclaimedDividends = [
    {
      id: 1,
      name: "Property A",
      address: "123 Maple St, Apt 4B",
      icon: Building2,
      amount: 600,
      yield: 8.5,
      lastPayout: "2024-06-15"
    },
    {
      id: 2,
      name: "Property B",
      address: "456 Pine Ave, Unit 2C",
      icon: Building2,
      amount: 900,
      yield: 9.2,
      lastPayout: "2024-06-15"
    },
  ]

  const dividendHistory = [
    {
      property: "Property A",
      amount: "$600",
      date: "2024-07-15",
      status: "Claimed",
      yield: "8.5%"
    },
    {
      property: "Property B",
      amount: "$900",
      date: "2024-07-15",
      status: "Claimed",
      yield: "9.2%"
    },
    {
      property: "Property C",
      amount: "$1,200",
      date: "2024-06-15",
      status: "Claimed",
      yield: "7.8%"
    },
  ]

  const totalUnclaimed = unclaimedDividends.reduce((sum, div) => sum + div.amount, 0)
  const totalClaimed = 2700 // Example total

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dividend Dashboard</h1>
            <p className="text-gray-600">Track and manage your property dividend earnings</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-white transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-white transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${totalUnclaimed.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Unclaimed Dividends</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-medium">+8.3%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${totalClaimed.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Total Claimed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 text-sm font-medium">8.9%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">8.9%</h3>
            <p className="text-gray-600 text-sm">Avg. Yield</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-orange-600 text-sm font-medium">3 Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">5</h3>
            <p className="text-gray-600 text-sm">Properties</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Unclaimed & Claim */}
          <div className="lg:col-span-2 space-y-8">
            {/* Unclaimed Dividends */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Unclaimed Dividends</h2>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {unclaimedDividends.length} pending
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {unclaimedDividends.map((dividend) => (
                  <div key={dividend.id} className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{dividend.name}</h3>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">${dividend.amount}</div>
                            <div className="text-sm text-gray-500">{dividend.yield}% yield</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{dividend.address}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last payout: {dividend.lastPayout}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dividend History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Dividend History</h2>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border bg-white border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>This Month</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Property</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Yield</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividendHistory.map((record, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{record.property}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">{record.amount}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-green-600 font-medium">{record.yield}</div>
                        </td>
                        <td className="p-4 text-gray-600">{record.date}</td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Claim Panel */}
          <div className="space-y-6">
            {/* Quick Claim */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">Quick Claim</h3>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold mb-1">${totalUnclaimed.toLocaleString()}</div>
                <div className="text-blue-100">Total available to claim</div>
              </div>
              <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                Claim All Dividends
              </button>
            </div>

            {/* Custom Claim */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Claim</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USDC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={claimAmount}
                      onChange={e => setClaimAmount(e.target.value)}
                      className="w-full border bg-white border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium hover:text-blue-700">
                      Max
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-xl font-semibold shadow-sm">
                    Claim
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors py-3 rounded-xl font-semibold">
                    Reinvest
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-Reinvest Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Auto-Reinvest</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer " />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-4">Automatically reinvest dividends to compound your earnings</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Minimum threshold</label>
                  <input 
                    type="number" 
                    placeholder="$100" 
                    className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
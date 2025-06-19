import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Search, 
  Filter, 
  Download,
  
  DollarSign,
  TrendingUp,
  Activity,
  Eye,
  X,
  ChevronDown
} from 'lucide-react';

// Enhanced mock data with more transactions
const transactions = [
  {
    id: 'TXN-001',
    date: '2024-07-20',
    type: 'Share Purchase',
    asset: 'Property A',
    category: 'Real Estate',
    amount: 50000,
    status: 'Completed',
    change: '+2.3%',
    description: 'Purchased commercial property shares in downtown district'
  },
  {
    id: 'TXN-002',
    date: '2024-07-15',
    type: 'Dividend Claim',
    asset: 'REIT B',
    category: 'REIT',
    amount: 1000,
    status: 'Completed',
    change: '+1.8%',
    description: 'Quarterly dividend from REIT investment'
  },
  {
    id: 'TXN-003',
    date: '2024-07-10',
    type: 'Loan Repayment',
    asset: 'Property C',
    category: 'Real Estate',
    amount: 20000,
    status: 'Completed',
    change: '-0.5%',
    description: 'Monthly loan repayment for residential property'
  },
  {
    id: 'TXN-004',
    date: '2024-07-09',
    type: 'Pending Transfer',
    asset: 'Property D',
    category: 'Real Estate',
    amount: 5000,
    status: 'Pending',
    change: '0.0%',
    description: 'Transfer pending for property investment'
  },
  {
    id: 'TXN-005',
    date: '2024-07-05',
    type: 'Share Sale',
    asset: 'REIT C',
    category: 'REIT',
    amount: 15000,
    status: 'Completed',
    change: '+3.2%',
    description: 'Sold REIT shares at profit'
  },
  {
    id: 'TXN-006',
    date: '2024-07-01',
    type: 'Fee Payment',
    asset: 'Platform Fee',
    category: 'Fee',
    amount: 500,
    status: 'Failed',
    change: '-1.0%',
    description: 'Monthly platform management fee'
  }
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Failed: 'bg-red-100 text-red-700 border-red-200',
};

const TransactionDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'Completed');
    const totalAmount = completed.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = transactions.length;
    const completedTransactions = completed.length;
    const pendingTransactions = transactions.filter(t => t.status === 'Pending').length;
    
    return {
      totalAmount,
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      averageAmount: totalAmount / completedTransactions || 0
    };
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          txn.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          txn.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
      const matchesType = typeFilter === 'All' || txn.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Asset', 'Amount', 'Status', 'Change'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(txn => 
        [txn.id, txn.date, txn.type, txn.asset, txn.amount, txn.status, txn.change].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transaction Dashboard
          </h1>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalTransactions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.completedTransactions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.pendingTransactions}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, asset, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="All">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="All">All Types</option>
                  <option value="Share Purchase">Share Purchase</option>
                  <option value="Dividend Claim">Dividend Claim</option>
                  <option value="Loan Repayment">Loan Repayment</option>
                  <option value="Pending Transfer">Pending Transfer</option>
                  <option value="Share Sale">Share Sale</option>
                  <option value="Fee Payment">Fee Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="All">All Dates</option>
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 90 days">Last 90 days</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Transactions ({filteredTransactions.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="p-4 text-left font-semibold">ID</th>
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Type</th>
                  <th className="p-4 text-left font-semibold">Asset</th>
                  <th className="p-4 text-left font-semibold">Amount</th>
                  <th className="p-4 text-left font-semibold">Change</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-gray-700 font-mono text-sm">{txn.id}</td>
                    <td className="p-4 text-gray-700">{txn.date}</td>
                    <td className="p-4 text-gray-700 font-medium">{txn.type}</td>
                    <td className="p-4 text-gray-700">{txn.asset}</td>
                    <td className="p-4 text-gray-900 font-semibold">{formatCurrency(txn.amount)}</td>
                    <td className="p-4">
                      <span className={`flex items-center ${txn.change.startsWith('+') ? 'text-green-600' : txn.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                        {txn.change.startsWith('+') ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : txn.change.startsWith('-') ? (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        ) : (
                          <Clock className="w-4 h-4 mr-1" />
                        )}
                        {txn.change}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[txn.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedTransaction(txn)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-lg font-mono text-gray-900">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[selectedTransaction.status]}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Date</label>
                  <p className="text-lg text-gray-900">{selectedTransaction.date}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <p className="text-lg text-gray-900">{selectedTransaction.type}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Asset</label>
                  <p className="text-lg text-gray-900">{selectedTransaction.asset}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="text-lg text-gray-900">{selectedTransaction.category}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedTransaction.amount)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Change</label>
                  <span className={`flex items-center text-lg ${selectedTransaction.change.startsWith('+') ? 'text-green-600' : selectedTransaction.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                    {selectedTransaction.change.startsWith('+') ? (
                      <ArrowUpRight className="w-5 h-5 mr-1" />
                    ) : selectedTransaction.change.startsWith('-') ? (
                      <ArrowDownRight className="w-5 h-5 mr-1" />
                    ) : (
                      <Clock className="w-5 h-5 mr-1" />
                    )}
                    {selectedTransaction.change}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{selectedTransaction.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDashboard;
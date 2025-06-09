"use client"

import { useState } from "react"
import { 
  ArrowUpDown, 
  Clock, 
  ChevronDown,
  ExternalLink,
  History,
  Zap,
  TrendingUp,
  Shield,
  RefreshCw,
  Copy,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for networks
const networks = [
  { id: "ethereum", name: "Ethereum", icon: "🔷" },
  { id: "astar", name: "Astar", icon: "⭐" },
  { id: "polygon", name: "Polygon", icon: "🟣" },
  { id: "arbitrum", name: "Arbitrum", icon: "🌀" },
]

// Mock data for tokens
const tokens = [
  { id: "eth", name: "ETH", icon: "🔷", balance: "1.234", usdValue: "$2,468.00" },
  { id: "astr", name: "ASTR", icon: "⭐", balance: "1000", usdValue: "$150.00" },
  { id: "usdc", name: "USDC", icon: "💵", balance: "5000", usdValue: "$5,000.00" },
  { id: "usdt", name: "USDT", icon: "💵", balance: "3000", usdValue: "$3,000.00" },
]

// Mock data for recent transactions
const recentTransactions = [
  {
    id: 1,
    from: "Ethereum",
    to: "Astar",
    token: "ETH",
    amount: "0.5",
    status: "completed",
    timestamp: "2024-03-15 14:30",
    hash: "0x1234...5678",
    fee: "$12.50"
  },
  {
    id: 2,
    from: "Astar",
    to: "Ethereum",
    token: "ASTR",
    amount: "100",
    status: "pending",
    timestamp: "2024-03-15 13:45",
    hash: "0x8765...4321",
    fee: "$8.75"
  },
  {
    id: 3,
    from: "Polygon",
    to: "Arbitrum",
    token: "USDC",
    amount: "500",
    status: "completed",
    timestamp: "2024-03-15 12:15",
    hash: "0xabcd...efgh",
    fee: "$2.25"
  },
]

function BridgeAssets() {
  const [fromNetwork, setFromNetwork] = useState("")
  const [toNetwork, setToNetwork] = useState("")
  const [token, setToken] = useState("")
  const [amount, setAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleSwapNetworks = () => {
    setIsSwapping(true)
    setTimeout(() => {
      const temp = fromNetwork
      setFromNetwork(toNetwork)
      setToNetwork(temp)
      setIsSwapping(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl  bg-primary-600 hover:bg-primary-70" >
                <ArrowUpDown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>
                  Bridge Assets
                </h1>
                <p className="text-gray-600 mt-1">Cross-chain transfers made simple</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Bridged</p>
                <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$12,345.67</p>
                <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold" style={{ color: "#34C759" }}>2</p>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                  <Clock className="w-4 h-4" />
                  <span>~8 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bridge Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3" style={{ color: "#1A1A1A" }}>
                    <div className="p-2 rounded-lg  bg-primary-600 hover:bg-primary-70">
                      <ArrowUpDown className="w-5 h-5 text-white" />
                    </div>
                    Bridge Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Network Selection */}
                  <div className="space-y-6">
                    {/* From Network */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        From Network
                        <Shield className="w-4 h-4 text-green-500" />
                      </label>
                      <Select value={fromNetwork} onValueChange={(value) => {
                        console.log("From Network selected:", value);
                        setFromNetwork(value);
                      }}>
                        <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-gray-400 h-12 rounded-lg transition-colors">
                          <SelectValue placeholder="Select source network" />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          {networks.map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{network.icon}</span>
                                <span className="font-medium">{network.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={handleSwapNetworks}
                        className={`p-3 rounded-full  bg-primary-600 hover:bg-primary-70 shadow-md hover:shadow-lg transition-all duration-300 ${isSwapping ? 'animate-spin' : ''}`}
                        disabled={!fromNetwork || !toNetwork}
                      >
                        <RefreshCw className="w-5 h-5 text-white" />
                      </Button>
                    </div>

                    {/* To Network */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        To Network
                        <Shield className="w-4 h-4 text-green-500" />
                      </label>
                      <Select value={toNetwork} onValueChange={(value) => {
                        console.log("To Network selected:", value);
                        setToNetwork(value);
                      }}>
                        <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-gray-400 h-12 rounded-lg transition-colors">
                          <SelectValue placeholder="Select destination network" />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          {networks.map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{network.icon}</span>
                                <span className="font-medium">{network.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Token Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Token</label>
                    <Select value={token} onValueChange={setToken}>
                      <SelectTrigger className="w-full bg-gray-50 border-gray-300 hover:border-gray-400 h-12 rounded-lg transition-colors">
                        <SelectValue placeholder="Select token to bridge" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {tokens.map((token) => (
                          <SelectItem key={token.id} value={token.id}>
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{token.icon}</span>
                                <div>
                                  <div className="font-medium">{token.name}</div>
                                  <div className="text-xs text-gray-500">{token.usdValue}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{token.balance}</div>
                                <div className="text-xs text-gray-500">Available</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Amount</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="bg-gray-50 border-gray-300 hover:border-gray-400 text-right text-xl font-medium h-14 rounded-lg pr-20 transition-colors"
                        placeholder="0.0"
                      />
                      <Button
                        className="absolute right-2  bg-primary-600 hover:bg-primary-70 top-2 h-10 px-4 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                        onClick={() => {
                          const selectedToken = tokens.find(t => t.id === token)
                          if (selectedToken) setAmount(selectedToken.balance)
                        }}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  {/* Bridge Button */}
                  <Button 
                    className="w-full  bg-primary-600 hover:bg-primary-70 h-14 text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200" 
                    
                    disabled={!fromNetwork || !toNetwork || !token || !amount || fromNetwork === toNetwork}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Bridge Tokens
                  </Button>

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5" style={{ color: "#0055FF" }} />
                        <span className="text-sm font-medium" style={{ color: "#0055FF" }}>Estimated Time</span>
                      </div>
                      <p className="font-semibold" style={{ color: "#1A1A1A" }}>5-10 minutes</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Bridge Fee</span>
                      </div>
                      <p className="font-semibold" style={{ color: "#1A1A1A" }}>0.1% + Gas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div>
              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "#1A1A1A" }}>
                    <div className="p-2 rounded-lg  bg-primary-600 hover:bg-primary-70" >
                      <History className="w-5 h-5 text-white" />
                    </div>
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((tx, index) => (
                      <div key={tx.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg  bg-primary-600 hover:bg-primary-70">
                              <ArrowUpDown className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <span className="font-semibold text-lg" style={{ color: "#1A1A1A" }}>
                                {tx.amount} {tx.token}
                              </span>
                              <p className="text-sm text-gray-500">Fee: {tx.fee}</p>
                            </div>
                          </div>
                          <Badge 
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              tx.status === "completed" 
                                ? "bg-green-100 text-green-700 border border-green-200" 
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            }`}
                          >
                            {tx.status === "completed" ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                completed
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                pending
                              </div>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>{tx.from}</span>
                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                            <span>{tx.to}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{tx.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Hash: {tx.hash}</span>
                            <Button className="p-1 h-auto bg-transparent hover:bg-gray-200 text-gray-500">
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button className="p-1 h-auto bg-transparent hover:bg-gray-200 text-gray-500">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BridgeAssets
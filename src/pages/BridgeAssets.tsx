"use client"

import { useState } from "react"
import { 
  ArrowUpDown, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ExternalLink,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as SelectPrimitive from "@radix-ui/react-select"

// Mock data for networks
const networks = [
  { id: "ethereum", name: "Ethereum", icon: "🔷" },
  { id: "astar", name: "Astar", icon: "⭐" },
  { id: "polygon", name: "Polygon", icon: "🟣" },
  { id: "arbitrum", name: "Arbitrum", icon: "🌀" },
]

// Mock data for tokens
const tokens = [
  { id: "eth", name: "ETH", icon: "🔷", balance: "1.234" },
  { id: "astr", name: "ASTR", icon: "⭐", balance: "1000" },
  { id: "usdc", name: "USDC", icon: "💵", balance: "5000" },
  { id: "usdt", name: "USDT", icon: "💵", balance: "3000" },
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
  },
  {
    id: 2,
    from: "Astar",
    to: "Ethereum",
    token: "ASTR",
    amount: "100",
    status: "pending",
    timestamp: "2024-03-15 13:45",
  },
]

function BridgeAssets() {
  const [fromNetwork, setFromNetwork] = useState("")
  const [toNetwork, setToNetwork] = useState("")
  const [token, setToken] = useState("")
  const [amount, setAmount] = useState("")

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" >
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ArrowUpDown className="w-8 h-8" style={{ color: "#0055FF" }} />
              <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>
                Bridge Assets
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Bridged</p>
                <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$12,345.67</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold" style={{ color: "#34C759" }}>2</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bridge Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                    <ArrowUpDown className="w-5 h-5" />
                    Bridge Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* From Network */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#1A1A1A" }}>From Network</label>
                      <Select value={fromNetwork} onValueChange={setFromNetwork}>
                        <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              <div className="flex items-center gap-2">
                                <span>{network.icon}</span>
                                <span>{network.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* To Network */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#1A1A1A" }}>To Network</label>
                      <Select value={toNetwork} onValueChange={setToNetwork}>
                        <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              <div className="flex items-center gap-2">
                                <span>{network.icon}</span>
                                <span>{network.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Token Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#1A1A1A" }}>Token</label>
                      <Select value={token} onValueChange={setToken}>
                        <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map((token) => (
                            <SelectItem key={token.id} value={token.id}>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <span>{token.icon}</span>
                                  <span>{token.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">Balance: {token.balance}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#1A1A1A" }}>Amount</label>
                      <Input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="bg-gray-50 border-gray-200 text-right text-xl font-medium"
                        placeholder="0.0"
                      />
                    </div>

                    {/* Bridge Button */}
                    <Button 
                      className="w-full py-3 text-white font-medium text-lg" 
                      style={{ backgroundColor: "#34C759" }}
                      disabled={!fromNetwork || !toNetwork || !token || !amount || fromNetwork === toNetwork}
                    >
                      Bridge Tokens
                    </Button>

                    {/* Info Alert */}
                    <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Bridge Information</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Estimated time: 5-10 minutes
                          <br />
                          Bridge fee: 0.1%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div>
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                    <History className="w-5 h-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4" style={{ color: "#0055FF" }} />
                            <span className="font-medium" style={{ color: "#1A1A1A" }}>
                              {tx.amount} {tx.token}
                            </span>
                          </div>
                          <Badge 
                            variant={tx.status === "completed" ? "success" : "warning"}
                            className="text-xs"
                          >
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>{tx.from}</span>
                            <ChevronDown className="w-4 h-4" />
                            <span>{tx.to}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{tx.timestamp}</span>
                          </div>
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
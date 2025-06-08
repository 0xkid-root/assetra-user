"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  ArrowUpDown, 
  Droplets, 
  Clock, 
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Note: Ensure your tsconfig.json includes path aliases for "@/*" to resolve "@/components/*"
// Example: "paths": { "@/*": ["./src/*"] }

// Mock data for pools
const poolsData = [
  {
    id: 1,
    pair: "ASTR/USDC",
    totalLiquidity: 1234567,
    volume24h: 123456,
    apy: 12.34,
    fees24h: 1234,
    myLiquidity: 5000,
    change24h: 5.2
  },
  {
    id: 2,
    pair: "REIT/USDC",
    totalLiquidity: 765432,
    volume24h: 76543,
    apy: 8.76,
    fees24h: 765,
    myLiquidity: 2500,
    change24h: -2.1
  },
  {
    id: 3,
    pair: "ASTR/REIT",
    totalLiquidity: 456789,
    volume24h: 45678,
    apy: 5.67,
    fees24h: 456,
    myLiquidity: 0,
    change24h: 1.8
  },
  {
    id: 4,
    pair: "ETH/USDC",
    totalLiquidity: 2345678,
    volume24h: 234567,
    apy: 15.23,
    fees24h: 2345,
    myLiquidity: 7500,
    change24h: 8.4
  },
  {
    id: 5,
    pair: "BTC/USDC",
    totalLiquidity: 3456789,
    volume24h: 345678,
    apy: 18.90,
    fees24h: 3456,
    myLiquidity: 12000,
    change24h: 12.7
  }
]

// Mock data for recent trades
const recentTrades = [
  { id: 1, type: "Swap", from: "ASTR", to: "USDC", amount: 1000, value: 1234, time: "2 min ago", status: "Completed" },
  { id: 2, type: "Add Liquidity", from: "REIT", to: "USDC", amount: 500, value: 765, time: "15 min ago", status: "Completed" },
  { id: 3, type: "Swap", from: "USDC", to: "ASTR", amount: 2000, value: 1620, time: "1 hour ago", status: "Completed" },
  { id: 4, type: "Remove Liquidity", from: "ASTR", to: "REIT", amount: 750, value: 456, time: "2 hours ago", status: "Completed" }
]

// Mock data for available tokens
const availableTokens = [
  { symbol: "ASTR", name: "Astar Token", balance: 1500.50, price: 1.234, icon: "🌟" },
  { symbol: "USDC", name: "USD Coin", balance: 5000.00, price: 1.000, icon: "💵" },
  { symbol: "REIT", name: "Real Estate Token", balance: 250.25, price: 3.456, icon: "🏢" },
  { symbol: "ETH", name: "Ethereum", balance: 2.5, price: 2340.50, icon: "⚡" },
  { symbol: "BTC", name: "Bitcoin", balance: 0.1, price: 45678.90, icon: "₿" }
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const getChangeColor = (change: number) => {
  return change >= 0 ? "#34C759" : "#FF3B30"
}

const getChangeIcon = (change: number) => {
  return change >= 0 ? <span aria-label="Upward trend">↑</span> : <span aria-label="Downward trend">↓</span>
}

export default function Exchange() {
  const [fromToken, setFromToken] = useState("")
  const [toToken, setToToken] = useState("")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  const handleAmountChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || (parseFloat(value) >= 0 && !isNaN(value))) {
      setter(value)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E6F0FA" }}>
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ArrowUpDown className="w-8 h-8" style={{ color: "#0055FF" }} />
              <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>
                Exchange
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Portfolio Value</p>
                <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$27,125.50</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">24h Change</p>
                <p className="text-2xl font-bold" style={{ color: "#34C759" }}>+$1,234.56</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#E6F0FA" }}>
                    <TrendingUp className="w-5 h-5" style={{ color: "#0055FF" }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Volume (24h)</p>
                    <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$2.1M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#E8F5E8" }}>
                    <Droplets className="w-5 h-5" style={{ color: "#34C759" }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Liquidity</p>
                    <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$8.2M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFF3E6" }}>
                    <DollarSign className="w-5 h-5" style={{ color: "#FF9500" }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">My Liquidity</p>
                    <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$27,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#E8F5E8" }}>
                    <Clock className="w-5 h-5" style={{ color: "#34C759" }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rewards Earned</p>
                    <p className="text-2xl font-bold" style={{ color: "#34C759" }}>$1,234</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="swap" className="mb-8">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger
                value="swap"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0055FF] data-[state=active]:shadow-sm"
                style={{ color: "#1A1A1A" }}
              >
                Swap
              </TabsTrigger>
              <TabsTrigger
                value="pools"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0055FF] data-[state=active]:shadow-sm"
                style={{ color: "#1A1A1A" }}
              >
                Pools
              </TabsTrigger>
              <TabsTrigger
                value="limit"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0055FF] data-[state=active]:shadow-sm"
                style={{ color: "#1A1A1A" }}
              >
                Limit Orders
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0055FF] data-[state=active]:shadow-sm"
                style={{ color: "#1A1A1A" }}
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="swap" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Swap Interface */}
                <div className="lg:col-span-2">
                  <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                        <ArrowUpDown className="w-5 h-5" />
                        Swap Tokens
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* From Token */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: "#1A1A1A" }} htmlFor="from-amount">From</label>
                        <div className="flex gap-2">
                          <Select value={fromToken} onValueChange={setFromToken}>
                            <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTokens.map((token) => (
                                <SelectItem key={token.symbol} value={token.symbol}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{token.icon}</span>
                                    <div>
                                      <div className="font-medium">{token.symbol}</div>
                                      <div className="text-xs text-gray-500">{token.name}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="from-amount"
                            placeholder="0.0"
                            value={fromAmount}
                            onChange={handleAmountChange(setFromAmount)}
                            className="flex-1 bg-gray-50 border-gray-200 text-right text-xl font-medium"
                            aria-label="Amount to swap from"
                          />
                        </div>
                        {fromToken && (
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Balance: {availableTokens.find(t => t.symbol === fromToken)?.balance || 0}</span>
                            <span>≈ ${fromAmount ? (parseFloat(fromAmount) * (availableTokens.find(t => t.symbol === fromToken)?.price || 0)).toFixed(2) : '0.00'}</span>
                          </div>
                        )}
                      </div>

                      {/* Swap Arrow */}
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full w-10 h-10 p-0 border-2"
                          style={{ borderColor: "#0055FF", color: "#0055FF" }}
                          onClick={() => {
                            const temp = fromToken
                            setFromToken(toToken)
                            setToToken(temp)
                            const tempAmount = fromAmount
                            setFromAmount(toAmount)
                            setToAmount(tempAmount)
                          }}
                          aria-label="Swap tokens"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* To Token */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: "#1A1A1A" }} htmlFor="to-amount">To</label>
                        <div className="flex gap-2">
                          <Select value={toToken} onValueChange={setToToken}>
                            <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTokens.map((token) => (
                                <SelectItem key={token.symbol} value={token.symbol}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{token.icon}</span>
                                    <div>
                                      <div className="font-medium">{token.symbol}</div>
                                      <div className="text-xs text-gray-500">{token.name}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="to-amount"
                            placeholder="0.0"
                            value={toAmount}
                            onChange={handleAmountChange(setToAmount)}
                            className="flex-1 bg-gray-50 border-gray-200 text-right text-xl font-medium"
                            aria-label="Amount to swap to"
                          />
                        </div>
                        {toToken && (
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Balance: {availableTokens.find(t => t.symbol === toToken)?.balance || 0}</span>
                            <span>≈ ${toAmount ? (parseFloat(toAmount) * (availableTokens.find(t => t.symbol === toToken)?.price || 0)).toFixed(2) : '0.00'}</span>
                          </div>
                        )}
                      </div>

                      {/* Slippage Settings */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>Slippage Tolerance</span>
                          <div className="flex gap-1">
                            {["0.1", "0.5", "1.0"].map((value) => (
                              <Button
                                key={value}
                                variant={slippage === value ? "default" : "outline"}
                                size="sm"
                                className={`text-xs px-2 py-1 ${slippage === value ? 'bg-[#0055FF] text-white' : ''}`}
                                onClick={() => setSlippage(value)}
                              >
                                {value}%
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Minimum received</span>
                          <span>{toAmount ? (parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(4) : '0.0000'} {toToken}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Price impact</span>
                          <span style={{ color: "#34C759" }}>0.05%</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full py-3 text-white font-medium text-lg" 
                        style={{ backgroundColor: "#34C759" }}
                        disabled={!fromToken || !toToken || !fromAmount || fromToken === toToken}
                      >
                        {!fromToken || !toToken ? 'Select tokens' : fromToken === toToken ? 'Select different tokens' : !fromAmount ? 'Enter amount' : 'Swap'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Token Balances */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle style={{ color: "#1A1A1A" }}>Your Balances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableTokens.map((token) => (
                        <div key={token.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{token.icon}</span>
                            <div>
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>{token.symbol}</div>
                              <div className="text-xs text-gray-500">{token.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium" style={{ color: "#1A1A1A" }}>{token.balance.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">${(token.balance * token.price).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pools">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                    <Droplets className="w-5 h-5" />
                    Liquidity Pools
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-[#0055FF] text-[#0055FF] hover:bg-[#0055FF] hover:text-white"
                    >
                      Add Liquidity
                    </Button>
                    <Button
                      className="text-white font-medium"
                      style={{ backgroundColor: "#34C759" }}
                    >
                      Remove Liquidity
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="text-left py-3 px-2 font-medium" style={{ color: "#1A1A1A" }}>Pool</th>
                          <th scope="col" className="text-left py-3 px-2 font-medium" style={{ color: "#1A1A1A" }}>Total Liquidity</th>
                          <th scope="col" className="text-left py-3 px-2 font-medium" style={{ color: "#1A1A1A" }}>Volume (24h)</th>
                          <th scope="col" className="text-left py-3 px-2 font-medium" style={{ color: "#1A1A1A" }}>APY</th>
                          <th scope="col" className="text-left py-3 px-2 font-medium" style={{ color: "#1A1A1A" }}>My Liquidity</th>
                          <th scope="col" className="text-left py-3 px-2 font-medium" style={{ color: "#1A1A1A" }}>24h Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poolsData.map((pool) => (
                          <tr key={pool.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-2">
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>{pool.pair}</div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                {formatCurrency(pool.totalLiquidity)}
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                {formatCurrency(pool.volume24h)}
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="font-medium" style={{ color: "#34C759" }}>
                                {pool.apy.toFixed(2)}%
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                {pool.myLiquidity > 0 ? formatCurrency(pool.myLiquidity) : '-'}
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <div 
                                className="flex items-center gap-1 font-medium"
                                style={{ color: getChangeColor(pool.change24h) }}
                              >
                                {getChangeIcon(pool.change24h)}
                                {Math.abs(pool.change24h).toFixed(1)}%
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Fees & Rewards */}
              <Card className="bg-white border border-gray-200 shadow-sm mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                    <DollarSign className="w-5 h-5" />
                    Fees & Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Trading Fees</div>
                      <div className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>0.3%</div>
                      <div className="text-xs text-gray-500">per swap</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">LP Rewards</div>
                      <div className="text-2xl font-bold" style={{ color: "#34C759" }}>$1,234</div>
                      <div className="text-xs text-gray-500">earned this month</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">ASTR Rewards</div>
                      <div className="text-2xl font-bold" style={{ color: "#FF9500" }}>156.7</div>
                      <div className="text-xs text-gray-500">distributed to LPs</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Trading fees are 0.3% per swap. ASTR rewards are distributed to liquidity providers based on their share of the pool.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limit">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle style={{ color: "#1A1A1A" }}>Limit Orders</CardTitle>
                </CardHeader>
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gray-100">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium" style={{ color: "#1A1A1A" }}>
                        Limit Orders Coming Soon
                      </p>
                      <p className="text-gray-500 mt-1">
                        Set specific prices for your trades and let them execute automatically.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#0055FF] text-[#0055FF] hover:bg-[#0055FF] hover:text-white"
                    >
                      Get Notified
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle style={{ color: "#1A1A1A" }}>Trading History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: "#E6F0FA" }}>
                            <ArrowUpDown className="w-4 h-4" style={{ color: "#0055FF" }} />
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: "#1A1A1A" }}>
                              {trade.type}: {trade.from} → {trade.to}
                            </div>
                            <div className="text-sm text-gray-500">
                              {trade.amount} {trade.from} • {trade.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium" style={{ color: "#1A1A1A" }}>
                              ${trade.value.toLocaleString()}
                            </div>
                            <Badge
                              className="text-xs mt-1"
                              style={{
                                backgroundColor: trade.status === "Completed" ? "#E8F5E8" : "#FFF3E6",
                                color: trade.status === "Completed" ? "#34C759" : "#FF9500"
                              }}
                            >
                              {trade.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
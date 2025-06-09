"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, AlertTriangle, Shield, Clock, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function LoansDashboard() {
  const [depositShares, setDepositShares] = useState("")
  const [borrowAmount, setBorrowAmount] = useState("")
  const [repayAmount, setRepayAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("")

  // Mock data for active loans
  const activeLoans = [
    {
      id: 1,
      asset: "Property A - Luxury Condo",
      location: "Manhattan, NYC",
      collateralShares: 1000,
      collateralValue: 300000,
      borrowed: 100000,
      ltv: 33.33,
      healthFactor: 80,
      interestRate: 4.5,
      status: "Healthy"
    },
    {
      id: 2,
      asset: "Property B - Office Space",
      location: "Downtown LA",
      collateralShares: 750,
      collateralValue: 225000,
      borrowed: 90000,
      ltv: 40.0,
      healthFactor: 65,
      interestRate: 5.2,
      status: "Warning"
    },
    {
      id: 3,
      asset: "Property C - Retail Store",
      location: "Miami Beach, FL",
      collateralShares: 500,
      collateralValue: 150000,
      borrowed: 45000,
      ltv: 30.0,
      healthFactor: 90,
      interestRate: 3.8,
      status: "Healthy"
    }
  ]

  // Mock data for loan history
  const loanHistory = [
    { date: "2024-01-15", action: "Borrowed", amount: 50000, asset: "Property A" },
    { date: "2024-02-20", action: "Repaid", amount: 10000, asset: "Property A" },
    { date: "2024-03-10", action: "Borrowed", amount: 90000, asset: "Property B" },
    { date: "2024-04-05", action: "Deposited", amount: 75000, asset: "Property C" }
  ]

  // Mock data for available assets
  const availableAssets = [
    { id: "property-a", name: "Property A - Luxury Condo", value: 300000, available: 200 },
    { id: "property-b", name: "Property B - Office Space", value: 225000, available: 150 },
    { id: "property-c", name: "Property C - Retail Store", value: 150000, available: 300 },
    { id: "property-d", name: "Property D - Warehouse", value: 400000, available: 100 }
  ]

  const getHealthFactorColor = (factor) => {
    if (factor >= 70) return "#34C759"
    if (factor >= 40) return "#FF9500"
    return "#FF3B30"
  }

  const getStatusBadge = (status) => {
    const colors = {
      "Healthy": "bg-green-100 text-green-800 border-green-200",
      "Warning": "bg-orange-100 text-orange-800 border-orange-200",
      "Critical": "bg-red-100 text-red-800 border-red-200"
    }
    return colors[status] || colors["Healthy"]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8" style={{ color: "#0055FF" }} />
              <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>
                Loans Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Borrowed</p>
                <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$235,000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Collateral</p>
                <p className="text-2xl font-bold" style={{ color: "#34C759" }}>$675,000</p>
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
                    <p className="text-sm text-gray-500">Active Loans</p>
                    <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFF3E6" }}>
                    <Shield className="w-5 h-5" style={{ color: "#FF9500" }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Health Factor</p>
                    <p className="text-2xl font-bold" style={{ color: "#34C759" }}>78</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#E8F5E8" }}>
                    <Home className="w-5 h-5" style={{ color: "#34C759" }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Credit</p>
                    <p className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>$125,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFE6E6" }}>
                    <Clock className="w-5 h-5" style={{ color: "#FF3B30" }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Payment</p>
                    <p className="text-lg font-bold" style={{ color: "#1A1A1A" }}>Jun 15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="collateralized" className="mb-8">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger
                value="collateralized"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0055FF] data-[state=active]:shadow-sm"
                style={{ color: "#1A1A1A" }}
              >
                Collateralized Loans
              </TabsTrigger>
              <TabsTrigger
                value="uncollateralized"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0055FF] data-[state=active]:shadow-sm"
                style={{ color: "#1A1A1A" }}
              >
                Uncollateralized Loans
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0055FF] data-[state=active]:shadow-sm"
                style={{ color: "#1A1A1A" }}
              >
                Loan History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collateralized" className="space-y-8">
              {/* Active Loans */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                    <Shield className="w-5 h-5" />
                    Active Loans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            Asset
                          </th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            Collateral
                          </th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            Borrowed
                          </th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            LTV
                          </th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            Interest Rate
                          </th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            Health Factor
                          </th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: "#1A1A1A" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeLoans.map((loan) => (
                          <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                  {loan.asset}
                                </div>
                                <div className="text-sm text-gray-500">{loan.location}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                  {loan.collateralShares.toLocaleString()} Shares
                                </div>
                                <div className="text-sm text-gray-500">
                                  (${loan.collateralValue.toLocaleString()})
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                ${loan.borrowed.toLocaleString()} USDC
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                {loan.ltv}%
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium" style={{ color: "#1A1A1A" }}>
                                {loan.interestRate}% APY
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={loan.healthFactor} 
                                  className="w-16 h-2"
                                />
                                <span 
                                  className="font-medium text-sm"
                                  style={{ color: getHealthFactorColor(loan.healthFactor) }}
                                >
                                  {loan.healthFactor}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={`${getStatusBadge(loan.status)} text-xs`}>
                                {loan.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#0055FF] text-[#0055FF] hover:bg-[#0055FF] hover:text-white"
                              >
                                Manage
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deposit Collateral */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle style={{ color: "#1A1A1A" }}>Deposit Collateral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                        Asset
                      </label>
                      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Select Asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAssets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              <div className="flex flex-col">
                                <span>{asset.name}</span>
                                <span className="text-xs text-gray-500">
                                  ${asset.value.toLocaleString()} • {asset.available} shares available
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                        Shares
                      </label>
                      <Input
                        placeholder="Enter Shares"
                        value={depositShares}
                        onChange={(e) => setDepositShares(e.target.value)}
                        className="bg-gray-50 border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Est. Value: ${selectedAsset && depositShares ? 
                          (availableAssets.find(a => a.id === selectedAsset)?.value * parseInt(depositShares) / 1000 || 0).toLocaleString() 
                          : '0'}
                      </p>
                    </div>

                    <Button 
                      className="w-full text-white font-medium" 
                      style={{ backgroundColor: "#34C759" }}
                    >
                      Deposit Collateral
                    </Button>
                  </CardContent>
                </Card>

                {/* Borrow */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle style={{ color: "#1A1A1A" }}>Borrow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                        Amount (USDC)
                      </label>
                      <Input
                        placeholder="Enter Amount"
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                        className="bg-gray-50 border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Available to borrow: $125,000
                      </p>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: "#E6F0FA" }}>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "#1A1A1A" }}>Interest Rate</span>
                        <span style={{ color: "#0055FF" }}>4.2% APY</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span style={{ color: "#1A1A1A" }}>Monthly Payment</span>
                        <span style={{ color: "#1A1A1A" }}>
                          ${borrowAmount ? Math.round(borrowAmount * 0.042 / 12).toLocaleString() : '0'}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full text-white font-medium" 
                      style={{ backgroundColor: "#0055FF" }}
                    >
                      Borrow USDC
                    </Button>
                  </CardContent>
                </Card>

                {/* Repay */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle style={{ color: "#1A1A1A" }}>Repay</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                        Amount (USDC)
                      </label>
                      <Input
                        placeholder="Enter Amount"
                        value={repayAmount}
                        onChange={(e) => setRepayAmount(e.target.value)}
                        className="bg-gray-50 border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Total debt: $235,000
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRepayAmount("58750")}
                        className="flex-1 text-xs"
                      >
                        25%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRepayAmount("117500")}
                        className="flex-1 text-xs"
                      >
                        50%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRepayAmount("235000")}
                        className="flex-1 text-xs"
                      >
                        MAX
                      </Button>
                    </div>

                    <Button 
                      className="w-full text-white font-medium" 
                      style={{ backgroundColor: "#34C759" }}
                    >
                      Repay Loan
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Management */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                    <AlertTriangle className="w-5 h-5" style={{ color: "#FF9500" }} />
                    Risk Management & Liquidation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: "#1A1A1A" }}>
                        Liquidation Risk
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Your liquidation risk is determined by the health factor of your loans. If the health factor falls
                        below 1, your collateral may be liquidated to repay the loan.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Health Factor</span>
                          <span className="font-medium" style={{ color: "#34C759" }}>78 (Safe)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Liquidation Threshold</span>
                          <span className="font-medium" style={{ color: "#FF9500" }}>85% LTV</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: "#1A1A1A" }}>
                        Portfolio Overview
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Collateral Value</span>
                          <span className="font-medium">$675,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Borrowed</span>
                          <span className="font-medium">$235,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall LTV Ratio</span>
                          <span className="font-medium">34.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Credit</span>
                          <span className="font-medium" style={{ color: "#34C759" }}>$125,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="uncollateralized">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle style={{ color: "#1A1A1A" }}>Uncollateralized Loans</CardTitle>
                </CardHeader>
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gray-100">
                      <Shield className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium" style={{ color: "#1A1A1A" }}>
                        Uncollateralized Loans Coming Soon
                      </p>
                      <p className="text-gray-500 mt-1">
                        Credit-based lending without collateral requirements will be available in the future.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#0055FF] text-[#0055FF] hover:bg-[#0055FF] hover:text-white"
                    >
                      Join Waitlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle style={{ color: "#1A1A1A" }}>Loan History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loanHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium" style={{ color: "#1A1A1A" }}>
                            {item.action} ${item.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.asset} • {item.date}
                          </div>
                        </div>
                        <Badge 
                          className={`${
                            item.action === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                            item.action === 'Repaid' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {item.action}
                        </Badge>
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
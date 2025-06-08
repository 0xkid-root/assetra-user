"use client"

import { Search, Play, Bookmark, Share2, Info } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"

export default function BorrowDashboard() {
  const properties = [
    {
      id: 1,
      name: "The Lake View Park",
      location: "Financial District, Hyderabad",
      image: "/placeholder.svg?height=200&width=300",
      expYield: "26.4%",
      totalTokens: "5,000",
      lockIn: "1 year",
      invested: 32,
      tokensLeft: "3,400",
      investors: "19+",
      rating: "4.6",
      status: "Pre-leased",
    },
    {
      id: 2,
      name: "Metro Business Center",
      location: "Whitefield, Bangalore",
      image: "/placeholder.svg?height=200&width=300",
      expYield: "24.8%",
      totalTokens: "4,500",
      lockIn: "1 year",
      invested: 45,
      tokensLeft: "2,475",
      investors: "23+",
      rating: "4.8",
      status: "Pre-leased",
    },
    {
      id: 3,
      name: "Tech Square",
      location: "Bandra Kurla Complex, Mumbai",
      image: "/placeholder.svg?height=200&width=300",
      expYield: "28.2%",
      totalTokens: "6,000",
      lockIn: "1 year",
      invested: 18,
      tokensLeft: "4,920",
      investors: "12+",
      rating: "4.5",
      status: "Pre-leased",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#333333]">
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0AEC0] w-5 h-5" />
          <Input
            placeholder="Search by name or location..."
            className="pl-10 bg-white border-[#E2E8F0] text-[#333333] placeholder-[#A0AEC0] rounded-md"
          />
        </div>

        {/* Asset Categories */}
        <div className="flex gap-4 mb-8">
          <Button variant="outline" className="bg-white border-[#E2E8F0] text-[#333333] hover:bg-[#6B46C1] hover:text-white">
            Commercial <Badge className="ml-2 bg-[#6B46C1] text-white">12</Badge>
          </Button>
          <Button variant="outline" className="bg-white border-[#E2E8F0] text-[#333333] hover:bg-[#6B46C1] hover:text-white">
            Holiday Homes <Badge className="ml-2 bg-[#6B46C1] text-white">8</Badge>
          </Button>
          <Button variant="outline" className="bg-white border-[#E2E8F0] text-[#333333] hover:bg-[#6B46C1] hover:text-white">
            Residential <Badge className="ml-2 bg-[#6B46C1] text-white">15</Badge>
          </Button>
          <Button variant="outline" className="bg-white border-[#E2E8F0] text-[#333333] hover:bg-[#6B46C1] hover:text-white">
            Land Parcels <Badge className="ml-2 bg-[#6B46C1] text-white">6</Badge>
          </Button>
        </div>

        {/* Trending Assets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="bg-white border-[#E2E8F0] hover:border-[#38A169] transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    className="w-full h-40 rounded-lg object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-[#38A169] text-white">{property.status}</Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 w-6 h-6 text-white bg-black/50 hover:bg-black/70"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                  <div className="absolute top-2 right-10 flex gap-2">
                    <Button size="icon" variant="ghost" className="w-6 h-6 text-white bg-black/50 hover:bg-black/70">
                      <Bookmark className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="w-6 h-6 text-white bg-black/50 hover:bg-black/70">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-[#333333]">{property.name}</h3>
                  <p className="text-sm text-[#A0AEC0]">{property.location}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#A0AEC0]">Exp Yield</span>
                      <Info className="w-3 h-3 text-[#A0AEC0]" />
                    </div>
                    <span className="text-[#38A169] font-semibold">{property.expYield}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#A0AEC0]">Total tokens</span>
                      <Info className="w-3 h-3 text-[#A0AEC0]" />
                    </div>
                    <span className="text-[#333333]">{property.totalTokens}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#A0AEC0]">Lock-in</span>
                      <Info className="w-3 h-3 text-[#A0AEC0]" />
                    </div>
                    <span className="text-[#333333]">{property.lockIn}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={property.invested} className="h-2 bg-[#E2E8F0] text-[#6B46C1]" />
                  <div className="flex justify-between text-xs text-[#A0AEC0] mt-1">
                    <span>{property.invested}% Invested</span>
                    <span>{property.tokensLeft} Tokens left</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#E2E8F0] border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-[#E2E8F0] border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-[#E2E8F0] border-2 border-white"></div>
                    </div>
                    <span className="text-xs text-[#A0AEC0]">{property.investors} Investors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#F6E05E]">★</span>
                    <span className="text-sm text-[#333333]">{property.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
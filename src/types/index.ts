export interface Property {
  id: string;
  title: string;
  location: string;
  image: string;
  expectedYield: number;
  totalTokens: number;
  tokensLeft: number;
  percentInvested: number;
  lockInPeriod: string;
  investorCount: number;
  rating: number;
  isPreLeased: boolean;
  pricePerToken: number;
  totalValue: number;
  tenant?: string;
  leaseYears?: number;
}

export interface City {
  id: string;
  name: string;
  image: string;
  projectCount: number;
  returns: number;
}

export interface PortfolioData {
  properties: number;
  totalValue: string;
  avgReturn: number;
  occupancy: number;
  topPerformingProperties: {
    name: string;
    type: string;
    occupancy: number;
    area: string;
    roi: number;
  }[];
}

export interface PortfolioInvestment {
  property: string;
  image: string;
  type: string;
  location: string;
  amount: number;
  tokens: number;
  returns: number;
  status: string;
}
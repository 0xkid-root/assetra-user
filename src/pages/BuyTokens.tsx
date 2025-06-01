import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Info, Check, CreditCard, Wallet } from 'lucide-react';
import { properties } from '../data/mockData';

const BuyTokens: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id) || properties[0];
  
  const [step, setStep] = useState(1);
  const [numTokens, setNumTokens] = useState(120);
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'partial'>('partial');
  const [paymentProvider, setPaymentProvider] = useState<'cashfree' | 'stripe'>('cashfree');
  const [paymentType, setPaymentType] = useState<'fiat' | 'web3'>('fiat');
  
  const tokenValue = numTokens * property.pricePerToken;
  const llpFormationFee = tokenValue * 0.01; // 1%
  const legalFee = tokenValue * 0.015; // 1.5%
  const stampDuty = tokenValue * 0.075; // 7.5%
  const platformFee = tokenValue * 0.03; // 3%
  
  const totalInvestment = tokenValue + llpFormationFee + legalFee + stampDuty + platformFee;
  const partialPayment = totalInvestment * 0.1; // 10% down payment
  
  const annualReturns = tokenValue * 0.135; // 13.5% estimated ROI
  const monthlyDividend = annualReturns / 12;
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Buy property asset tokens</h2>
          <div className="text-sm text-gray-500">Step {step} of 2</div>
        </div>
        <div className="flex items-center mt-2">
          <ExternalLink size={16} className="text-primary-600 mr-1" />
          <Link to={`/property/${id}`} className="text-primary-600 hover:underline text-sm">
            Luxury Villa
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <div className="flex items-center text-green-600 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            1 Property Token = ₹816.6
          </div>
        </div>
      </div>
      
      {step === 1 ? (
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Buy Property Tokens</h3>
          <div className="flex items-center text-amber-600 bg-amber-50 text-sm p-2 rounded-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Shares Available: 380 (76%)</span>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">Your co-ownership</div>
              <div className="text-sm font-medium">Number of tokens</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-semibold text-primary-600">0.0%</div>
              <div className="flex items-center">
                <button 
                  className="p-1 rounded-full bg-red-100 text-red-600"
                  onClick={() => setNumTokens(Math.max(1, numTokens - 10))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <input 
                  type="number" 
                  className="w-16 mx-2 text-center border-gray-300 rounded-md"
                  value={numTokens}
                  onChange={(e) => setNumTokens(parseInt(e.target.value) || 1)}
                  min="1"
                  max="380"
                />
                <button 
                  className="p-1 rounded-full bg-green-100 text-green-600"
                  onClick={() => setNumTokens(Math.min(380, numTokens + 10))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Cost Breakdown</h3>
              <button className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Token value ({numTokens} tokens)</span>
                <span className="font-medium">₹{tokenValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">LLP formation fee (1%)</span>
                <span className="font-medium">₹{llpFormationFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Legal & Due-diligence (1.5%)</span>
                <span className="font-medium">₹{legalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stamp duty (7.5%)</span>
                <span className="font-medium">₹{stampDuty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform fee (3%)</span>
                <span className="font-medium">₹{platformFee.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold">Total Investment</span>
              <span className="text-lg font-semibold text-primary-600">₹{totalInvestment.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <h4 className="text-gray-900 font-medium">Annual Returns</h4>
                <Info size={16} className="ml-1 text-gray-400" />
              </div>
              <div className="text-xl font-semibold text-green-600">₹{annualReturns.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">Based on 13.5% estimated ROI</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <h4 className="text-gray-900 font-medium">Dividend Yield</h4>
                <Info size={16} className="ml-1 text-gray-400" />
              </div>
              <div className="text-xl font-semibold text-green-600">₹{monthlyDividend.toLocaleString()}</div>
              <div className="flex mt-1">
                <button className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mr-2">Monthly</button>
                <button className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Yearly</button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="col-span-1 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-2">
                <Check size={20} className="text-green-600" />
              </div>
              <span className="text-xs text-gray-500 text-center">Legally Protected</span>
            </div>
            
            <div className="col-span-1 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 text-center">Blockchain Secured</span>
            </div>
            
            <div className="col-span-1 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 text-center">Smart Contracts</span>
            </div>
            
            <div className="col-span-1 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-100 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 text-center">Liquid Assets</span>
            </div>
          </div>
          
          <button 
            onClick={() => setStep(2)} 
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            Next
            <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      ) : (
        <div className="p-6">
          <h3 className="text-lg font-medium mb-6">Payment Options</h3>
          
          <div className="space-y-4 mb-6">
            <label className="block p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mt-1"
                  checked={paymentMethod === 'full'}
                  onChange={() => setPaymentMethod('full')}
                />
                <div className="ml-3">
                  <div className="font-medium">Full payment now</div>
                  <div className="text-sm text-gray-500">Pay the entire amount and start earning returns immediately</div>
                </div>
                <div className="ml-auto">
                  <span className="font-medium">₹{totalInvestment.toLocaleString()}</span>
                </div>
              </div>
            </label>
            
            <label className="block p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
              <div className="flex items-start">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mt-1"
                  checked={paymentMethod === 'partial'}
                  onChange={() => setPaymentMethod('partial')}
                />
                <div className="ml-3">
                  <div className="font-medium">10% now, rest later</div>
                  <div className="text-sm text-gray-500">Pay 10% to secure your investment. Complete payment after agreement signatures</div>
                </div>
                <div className="ml-auto">
                  <span className="font-medium">₹{partialPayment.toLocaleString()}</span>
                  <div className="text-xs text-gray-500">+ ₹{(totalInvestment - partialPayment).toLocaleString()} later</div>
                </div>
              </div>
            </label>
          </div>
          
          <h3 className="text-lg font-medium mb-4">Payment method</h3>
          
          <div className="mb-6">
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 px-4 rounded-l-lg ${
                  paymentType === 'fiat'
                    ? 'bg-white border border-gray-300 text-gray-900 font-medium'
                    : 'bg-gray-100 text-gray-500'
                }`}
                onClick={() => setPaymentType('fiat')}
              >
                <div className="flex items-center justify-center">
                  <CreditCard size={20} className="mr-2" />
                  Fiat Method
                </div>
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-r-lg ${
                  paymentType === 'web3'
                    ? 'bg-white border border-gray-300 text-gray-900 font-medium'
                    : 'bg-gray-100 text-gray-500'
                }`}
                onClick={() => setPaymentType('web3')}
              >
                <div className="flex items-center justify-center">
                  <Wallet size={20} className="mr-2" />
                  Web3 Wallet
                </div>
              </button>
            </div>
            
            <div className="space-y-4">
              <label className={`block p-4 border rounded-lg ${paymentProvider === 'cashfree' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentProvider"
                    checked={paymentProvider === 'cashfree'}
                    onChange={() => setPaymentProvider('cashfree')}
                  />
                  <div className="ml-3">
                    <div className="font-medium flex items-center">
                      Cashfree
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Recommended</span>
                    </div>
                    <div className="text-sm text-gray-500">UPI, Cards, Net Banking</div>
                  </div>
                </div>
              </label>
              
              <label className={`block p-4 border rounded-lg ${paymentProvider === 'stripe' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentProvider"
                    checked={paymentProvider === 'stripe'}
                    onChange={() => setPaymentProvider('stripe')}
                  />
                  <div className="ml-3">
                    <div className="font-medium">Stripe</div>
                    <div className="text-sm text-gray-500">International Payments</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order Summary</h3>
              <button className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Property</span>
                <span className="font-medium">Luxury Villa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tokens</span>
                <span className="font-medium">{numTokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per token</span>
                <span className="font-medium">₹{property.pricePerToken.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ownership</span>
                <span className="font-medium">0.0%</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="font-medium">Total amount</span>
                <span className="font-semibold">₹{paymentMethod === 'partial' ? partialPayment.toLocaleString() : totalInvestment.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Ryzer Platform is using Escrow accounts for Fiat currency</p>
                <p className="text-sm text-green-700 mt-1">Payments are 100% safe with Regulated custodial providers with ABC custodian, India and ABCD custodian, USA.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setStep(1)} 
              className="flex items-center justify-center py-2 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
            <button 
              className="py-2 px-8 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Invest Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyTokens;
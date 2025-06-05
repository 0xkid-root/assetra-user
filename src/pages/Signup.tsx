import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Wallet, Shield, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useWeb3AuthConnect } from "@web3auth/modal/react";


const Signup = () => {
  const navigate = useNavigate();

  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
 // Add loading and error handling
 useEffect(() => {
  if (isConnected) {
    navigate('/dashboard');
  }
}, [isConnected, navigate]);


  // Array of images for the slideshow
  const images = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to handle automatic image transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);



  const features = [
    { icon: Shield, text: "Bank-level security" },
    { icon: TrendingUp, text: "Premium property investments" },
    { icon: Users, text: "Trusted by 10,000+ investors" }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Side: Slideshow with Gradient Overlay and Text */}
      <div className="lg:w-1/2 w-full h-64 lg:h-auto relative">
        {/* Slideshow Image */}
        <img
          src={images[currentImageIndex]}
          alt={`Featured Property ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="text-2xl font-semibold mb-2">Welcome to Assetra</h3>
          <p className="text-sm">Invest in premium properties with ease.</p>
        </div>
        
        {/* Slideshow Indicators */}
        <div className="absolute bottom-6 right-6 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side: Enhanced Signup Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600">Start your journey in real estate investment</p>
          </div>

          {/* Main Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {/* Status Messages */}
            {connectError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Connection Failed</p>
                  <p className="text-red-600 text-sm">{connectError.message}</p>
                </div>
              </div>
            )}


            {/* Connect Button */}
              <button
                onClick={()=> connect()}
                disabled={connectLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {connectLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect With Web3 Wallet</span>
                  </>
                )}
              </button>
            

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">Why choose Assetra?</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Signup;
import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useWeb3AuthConnect, useWeb3AuthDisconnect, } from "@web3auth/modal/react";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  
  // Add loading and error handling
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      console.error('Connection error:', connectError);
    }
  }, [connectError]);

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
    }, 4000); // Transition every 4 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  // Handle signup button click (navigate to dashboard for now)


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
      </div>

      {/* Right Side: Signup Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connect Your Wallet</h2>
          
          {connectError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {connectError.message}
            </div>
          )}

          <button
            onClick={() => connect()}
            disabled={connectLoading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connectLoading ? 'Connecting...' : 'Connect With Web3 Wallet'}
          </button>

          {isConnected && (
            <button
              onClick={() => disconnect()}
              disabled={disconnectLoading}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {disconnectLoading ? 'Disconnecting...' : 'Disconnect Wallet'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
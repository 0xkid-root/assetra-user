import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../App'; // Import the signup context

const Signup: React.FC = () => {
  const { setIsSignedUp } = useSignup(); // Access the signup state updater
  const navigate = useNavigate(); // For programmatic navigation

  // Array of images for the slideshow
  const images = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=',
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

  // Simulate a signup action (in a real app, this would be a form submission)
  const handleSignup = () => {
    setIsSignedUp(true); // Update signup state
    navigate('/'); // Navigate to the dashboard
  };

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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
          {/* Simulated Signup Form */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Enter your password"
            />
          </div>
          <button
            onClick={handleSignup}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign Up
          </button>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-primary-600 hover:underline">
              Go to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
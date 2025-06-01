import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      {/* Logo Icon Container */}
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
        {/* Placeholder for the building/documents icon */}
        <span className="text-white text-lg">📄</span> {/* This is a placeholder; ideally, use an SVG icon */}
      </div>
      {/* Text */}
      <span className="ml-2 text-white text-lg font-semibold">Assetra</span>
    </div>
  );
};

export default Logo;
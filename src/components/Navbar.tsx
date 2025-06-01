import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Settings, User, HelpCircle, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Add logo or navigation links if needed */}
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Notifications</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-2 hover:bg-gray-50">
                      <p className="text-sm text-gray-700">Your investment in Lake View Park is confirmed.</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50">
                      <p className="text-sm text-gray-700">New property added: Tech Square, Mumbai</p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday</p> {/* Fixed: Removed "Limestone" */}
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50">
                      <p className="text-sm text-gray-700">Complete your KYC to unlock premium investments</p>
                      <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link to="/notifications" className="text-sm text-primary-600 font-medium">View all notifications</Link>
                  </div>
                </div>
              )}
            </div>
            <button className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              Complete KYC
            </button>
            <div className="ml-4 relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User avatar"
                />
                <ChevronDown size={16} className={`ml-1 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">john.doe@example.com</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User size={16} className="mr-3 text-gray-400" />
                    Profile
                  </Link>
                  <Link
                    to="/profile?tab=settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} className="mr-3 text-gray-400" />
                    Settings
                  </Link>
                  <Link
                    to="/profile?tab=help"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <HelpCircle size={16} className="mr-3 text-gray-400" />
                    Help & Support
                  </Link>
                  <div className="border-t border-gray-100">
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
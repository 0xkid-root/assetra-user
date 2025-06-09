import React, { useState } from 'react';
import { Settings, Bell, Shield, Wallet, CreditCard, Users, HelpCircle, LogOut,ChevronDown } from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center p-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4">
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                  Verified
                </span>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'personal'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings size={18} className="mr-3" />
                Personal Information
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell size={18} className="mr-3" />
                Notifications
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield size={18} className="mr-3" />
                Security
              </button>

              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'payment'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Wallet size={18} className="mr-3" />
                Payment Methods
              </button>

              <button
                onClick={() => setActiveTab('kyc')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'kyc'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users size={18} className="mr-3" />
                KYC Verification
              </button>

              <button
                onClick={() => setActiveTab('help')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'help'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <HelpCircle size={18} className="mr-3" />
                Help & Support
              </button>

              <button
                className="w-full flex items-center px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} className="mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === 'personal' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Personal Information</h2>
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        defaultValue="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        defaultValue="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        defaultValue="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      defaultValue="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        defaultValue="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        defaultValue="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        defaultValue="10001"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium">Investment Updates</h3>
                      <p className="text-sm text-gray-500">Get notified about your investment performance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium">New Property Listings</h3>
                      <p className="text-sm text-gray-500">Be the first to know about new investment opportunities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium">Dividend Payments</h3>
                      <p className="text-sm text-gray-500">Get notified when you receive dividend payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium">Marketing Communications</h3>
                      <p className="text-sm text-gray-500">Receive updates about promotions and news</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Change Password</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        <p className="text-xs text-gray-500 mt-1">Currently disabled</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Login History</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">New York, United States</p>
                          <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">London, United Kingdom</p>
                          <p className="text-xs text-gray-500">Yesterday, 2:15 PM</p>
                        </div>
                        <button className="text-xs text-red-600 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Payment Methods</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Saved Cards</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <CreditCard className="h-8 w-8 text-blue-500 mr-3" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/24</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Default
                          </span>
                          <button className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Edit</span>
                            <Settings size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <CreditCard className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 8888</p>
                            <p className="text-sm text-gray-500">Expires 08/25</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Edit</span>
                            <Settings size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button className="mt-4 flex items-center text-primary-600 hover:text-primary-700">
                      <span className="mr-2">+</span>
                      Add new card
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Bank Accounts</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <Wallet className="h-8 w-8 text-green-500 mr-3" />
                          <div>
                            <p className="font-medium">Chase Bank ••••8523</p>
                            <p className="text-sm text-gray-500">Checking Account</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Primary
                          </span>
                          <button className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Edit</span>
                            <Settings size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button className="mt-4 flex items-center text-primary-600 hover:text-primary-700">
                      <span className="mr-2">+</span>
                      Link bank account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kyc' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">KYC Verification</h2>
                
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Verification Complete</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Your identity has been verified. You can now access all platform features.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Identity Verification</h3>
                      <p className="text-sm text-gray-500 mb-4">Government ID and facial recognition</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Address Verification</h3>
                      <p className="text-sm text-gray-500 mb-4">Proof of residence document</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Income Verification</h3>
                      <p className="text-sm text-gray-500 mb-4">Bank statements or tax returns</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Investment Profile</h3>
                      <p className="text-sm text-gray-500 mb-4">Investment experience and goals</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Verification History</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Identity Verification Completed</p>
                          <p className="text-xs text-gray-500">March 15, 2025</p>
                        </div>
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          View Details
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Address Verification Completed</p>
                          <p className="text-xs text-gray-500">March 14, 2025</p>
                        </div>
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Help & Support</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg">
                        <button className="w-full flex items-center justify-between p-4 text-left">
                          <span className="font-medium">How do I start investing?</span>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="border border-gray-200 rounded-lg">
                        <button className="w-full flex items-center justify-between p-4 text-left">
                          <span className="font-medium">What are the minimum investment requirements?</span>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="border border-gray-200 rounded-lg">
                        <button className="w-full flex items-center justify-between p-4 text-left">
                          <span className="font-medium">How do I withdraw my investments?</span>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Contact Support</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="What can we help you with?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Describe your issue"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Other Ways to Get Help</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Call Us</h4>
                        <p className="text-sm text-gray-500">Available Mon-Fri, 9AM-6PM EST</p>
                        <p className="text-sm font-medium mt-2">+1 (555) 123-4567</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Email Us</h4>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                        <p className="text-sm font-medium mt-2">support@ryzer.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
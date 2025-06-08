import React,{useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {  useWeb3AuthDisconnect, } from "@web3auth/modal/react";
import { Home, Building, BarChart3,  FileText,   ChevronLeft, ChevronRight, ShoppingBag, Plus, LogOut, Coins, HandCoins, ArrowLeftRight, Repeat,  ShieldPlus } from 'lucide-react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  useEffect(() => {
    if (disconnectError) {
      console.error('Disconnection error:', disconnectError);
    }
  }, [disconnectError]);

  const navigate = useNavigate();



  const handleDisconnect = async () => {
    try {
      await disconnect();
      navigate('/signup');
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200';

  return (
    <div className={`flex flex-col justify-between transition-all duration-300 bg-white h-screen ${
      isCollapsed ? 'w-20' : 'w-64'
    } shadow border-r border-gray-200 fixed top-0 left-0 z-20`}>
      <div>
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center">
            <Logo className={`transition-all ${isCollapsed ? 'w-8' : 'w-8 mr-3'}`} />
            {!isCollapsed && <span className="font-bold text-xl text-gray-800">Assetra</span>}
          </div>
          <button
            className="p-2 focus:outline-none bg-white border border-gray-200 rounded-full shadow hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={20} className="text-gray-600" /> : <ChevronLeft size={20} className="text-gray-600" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3 px-2">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Dashboard' : undefined}
          >
            <Home size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
          </Link>
          <Link
            to="/dashboard/marketplace"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/marketplace')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Properties' : undefined}
          >
            <ShoppingBag size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Marketplace</span>}
          </Link>
          <Link
            to="/dashboard/my-properties"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/my-properties')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Properties' : undefined}
          >
            <Building size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">My Properties</span>}
          </Link>
          <Link
            to="/dashboard/add-property"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/add-property')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Properties' : undefined}
          >
            <Plus size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Add Property</span>}
          </Link>

          <Link
            to="/dashboard/dividends"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/dividends')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Dividends' : undefined}
          >
            <Coins size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Dividends</span>}
          </Link>
  
          <Link
            to="/dashboard/portfolio"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/portfolio')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'My Portfolio' : undefined}
          >
            <BarChart3 size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">My Portfolio</span>}
          </Link>
          <Link
            to="/dashboard/transactions"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/transactions')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Transactions' : undefined}
          >
            <FileText size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Transactions</span>}
          </Link>

          <Link
            to="/dashboard/borrow"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/borrow')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Borrow' : undefined}
          >
            <HandCoins size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Borrow</span>}
          </Link>

          <Link
            to="/dashboard/exchange"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/exchange')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Exchange' : undefined}
          >
            <ArrowLeftRight size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Exchange</span>}
          </Link>
          
          <Link
            to="/dashboard/bridge-assets"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/bridge-assets')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Bridge Assets' : undefined}
          >
            <Repeat size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Bridge Assets</span>}
          </Link>
          <Link
            to="/dashboard/compliance"
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard/compliance')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Compliance' : undefined}
          >
            <ShieldPlus size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Compliance</span>}
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mb-6 px-2">
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleDisconnect}
            disabled={disconnectLoading}
            className={`flex items-center px-4 py-3 rounded-lg ${isActive('/settings')} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Disconnect' : undefined}
          >
            <LogOut size={20} className={`${isCollapsed ? 'text-gray-600' : 'mr-4 text-gray-600'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Disconnect</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;




import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';
import Portfolio from './pages/Portfolio';
import BuyTokens from './pages/BuyTokens';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import MyProperties from './pages/MyProperties';
import AddProperty from './pages/AddProperty';
import TransactionDetails from './pages/TransactionDetails';
import MarketPlaceDetails from './pages/MarketPlaceDetails';
import ProtectedRoute from './components/ProtectedRoute';
import DividendsDetails from './pages/DividendsDetails';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard if authenticated */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Standalone Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Protected Layout Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="property/:id" element={<PropertyDetails />} />
          <Route path="property/:id/buy" element={<BuyTokens />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-properties" element={<MyProperties />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="transactions" element={<TransactionDetails />} />
          <Route path="marketplace" element={<MarketPlaceDetails />} />
          <Route path="dividends" element={<DividendsDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'; // Add useState for signup state
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
import './index.css';

// Create a context to share signup state (optional, for better state management)
import { createContext, useContext } from 'react';

// Context to manage signup state
const SignupContext = createContext<{
  isSignedUp: boolean;
  setIsSignedUp: (value: boolean) => void;
}>({ isSignedUp: false, setIsSignedUp: () => {} });

function App() {
  const [isSignedUp, setIsSignedUp] = useState(false); // Track signup state

  return (
    <SignupContext.Provider value={{ isSignedUp, setIsSignedUp }}>
      <Router>
        <Routes>
          {/* Standalone Signup Route */}
          <Route path="/signup" element={<Signup />} />

          {/* Layout Routes */}
          <Route path="/" element={<Layout />}>
            {/* Redirect to /signup if not signed up, otherwise render Dashboard */}
            <Route
              index
              element={isSignedUp ? <Dashboard /> : <Navigate to="/signup" replace />}
            />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="property/:id/buy" element={<BuyTokens />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-properties" element={<MyProperties />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="transactions" element={<TransactionDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </SignupContext.Provider>
  );
}

export default App;

// Export a hook to access the signup context in other components
export const useSignup = () => useContext(SignupContext);
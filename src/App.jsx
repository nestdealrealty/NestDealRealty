import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import AdminDashboard from './pages/AdminDashboard';
import EmiCalculator from './pages/EmiCalculator';
import Footer from './components/Footer';
import './index.css';

// Nest Deal Realty - v1.1.0.2
function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            {/* Fallback route for demo purposes if they click any property */}
            <Route path="/property" element={<PropertyDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/emi-calculator" element={<EmiCalculator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

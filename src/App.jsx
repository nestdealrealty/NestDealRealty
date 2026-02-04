import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import './index.css';

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
          </Routes>

          <footer style={{ padding: '60px 0', backgroundColor: '#0f172a', color: 'white', textAlign: 'center', marginTop: 'auto' }}>
            <div className="container">
              <p>&copy; 2026 Nest Deal. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;

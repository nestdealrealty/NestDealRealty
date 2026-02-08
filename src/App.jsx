import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import AdminDashboard from './pages/AdminDashboard';
import EmiCalculator from './pages/EmiCalculator';
import PostProperty from './pages/PostProperty';
import Footer from './components/Footer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SavedProperties from './pages/SavedProperties';
import './index.css';

// Nest Deal Realty - v1.1.0.2
function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
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
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/saved-properties" element={<SavedProperties />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;

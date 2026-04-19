import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import AdminDashboard from './pages/AdminDashboard';
import EmiCalculator from './pages/EmiCalculator';
import PostProperty from './pages/PostProperty';
import PostProject from './pages/PostProject';
import PostPlotProject from './pages/PostPlotProject';
import ProjectDetails from './pages/ProjectDetails';
import Footer from './components/Footer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SavedProperties from './pages/SavedProperties';
import ExplorePage from './pages/ExplorePage';
import UserProperties from './pages/UserProperties';
import './index.css';

// Nest Deal Realty - v1.1.0.3
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
          <Route path="/property" element={<PropertyDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/post-plot-project" element={<PostPlotProject />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/saved-properties" element={<SavedProperties />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/my-properties" element={<UserProperties />} />
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

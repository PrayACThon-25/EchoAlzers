import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Treatment from './pages/Treatment';
import Chat from './pages/Chat';
import VideoConsult from './pages/VideoConsult';
import { HealthProvider } from './context/HealthContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <UserProvider>
      <HealthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="content">
              <div className="page-container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/treatment" element={<ProtectedRoute><Treatment /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                  <Route path="/video-consult" element={<ProtectedRoute><VideoConsult /></ProtectedRoute>} />
                </Routes>
              </div>
            </main>
          </div>
        </Router>
      </HealthProvider>
    </UserProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Treatment from './pages/Treatment';
import Chat from './pages/Chat';
import VideoConsult from './pages/VideoConsult';
import { HealthProvider } from './context/HealthContext';
import './App.css';

function App() {
  return (
    <HealthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="content">
            <div className="page-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/treatment" element={<Treatment />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/video-consult" element={<VideoConsult />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </HealthProvider>
  );
}

export default App;

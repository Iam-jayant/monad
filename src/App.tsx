import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitProject from './pages/SubmitProject';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section">
            <h1 className="logo">Signal</h1>
            <p className="tagline">Event-Based Quadratic Voting</p>
          </Link>

          <nav className="nav">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Events
            </Link>
            <Link
              to="/admin/create"
              className={`nav-link ${location.pathname === '/admin/create' ? 'active' : ''}`}
            >
              Create Event
            </Link>
          </nav>

          <div className="wallet-section">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/create" element={<AdminDashboard />} />

          <Route path="/event/:id" element={<VotingPage />} />
          <Route path="/event/:id/submit" element={<SubmitProject />} />
          <Route path="/event/:id/results" element={<ResultsPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          Built for Monad Testnet • Optimized for Parallel Execution
        </p>
      </footer>
    </div>
  );
}

export default App;

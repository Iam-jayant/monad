import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
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
          <div className="logo-section">
            <h1 className="logo">Signal</h1>
            <p className="tagline">Quadratic Voting on Monad</p>
          </div>

          <nav className="nav">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Vote
            </Link>
            <Link
              to="/submit"
              className={`nav-link ${location.pathname === '/submit' ? 'active' : ''}`}
            >
              Submit Project
            </Link>
            <Link
              to="/results"
              className={`nav-link ${location.pathname === '/results' ? 'active' : ''}`}
            >
              Results
            </Link>
          </nav>

          <div className="wallet-section">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<VotingPage />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/results" element={<ResultsPage />} />
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

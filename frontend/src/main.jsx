import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// --- IMPORT ALL PAGES ---
import App from './App.jsx';                 // Interview Interface
import RecruiterDashboard from './RecruiterDashboard.jsx';
import AllCandidates from './AllCandidates.jsx';
import Login from './Login.jsx';
import LandingPage from './LandingPage.jsx';
import StudentDashboard from './StudentDashboard.jsx';
import Signup from './Signup.jsx';           // <--- MAKE SURE THIS IS IMPORTED

import './index.css';

// Navigation Bar (Hidden on Login/Landing/Signup)
const NavBar = () => {
  const location = useLocation();
  // Hide navbar on these pages
  const hideNav = ['/login', '/', '/signup', '/recruiter']; 

  if (hideNav.includes(location.pathname)) return null;

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-1.5 rounded-full flex gap-1 shadow-2xl pointer-events-auto">
        <Link to="/interview" className="px-5 py-2 rounded-full font-medium text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">Practice</Link>
        <Link to="/student-dashboard" className="px-5 py-2 rounded-full font-medium text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">My Stats</Link>
        {/* <Link to="/recruiter" className="px-5 py-2 rounded-full font-medium text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">Recruiter</Link> */}
      </div>
    </nav>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />  {/* <--- THIS WAS MISSING */}

        {/* APP ROUTES */}
        <Route path="/interview" element={<App />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        
        {/* RECRUITER ROUTES */}
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/candidates" element={<AllCandidates />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
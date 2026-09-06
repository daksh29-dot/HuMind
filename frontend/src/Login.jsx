import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    
    // Check if Recruiter (Hardcoded for Demo Simplicity)
    if (email.includes('admin')) {
        localStorage.setItem('user_email', email);
        localStorage.setItem('role', 'recruiter');
        navigate('/recruiter');
        return;
    }

    // Real Supabase Auth for Candidates
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      // Save User Session
      localStorage.setItem('user_email', data.user.email);
      localStorage.setItem('role', 'candidate');
      navigate('/student-dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h1>
        
        <div className="space-y-4 mb-8 mt-8">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25"
        >
          {loading ? "Verifying..." : "Enter Dashboard"}
        </button>
        
        <p className="text-center text-slate-500 mt-6 text-sm">
          New here? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
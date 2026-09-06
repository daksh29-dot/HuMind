import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Mail } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // inside frontend/src/Signup.jsx
  
  const handleSignup = async () => {
    // 1. Basic Validation
    if (!email.includes('@')) return alert("Please enter a valid email.");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    setLoading(true);

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error; // If Supabase returns an error, catch it

        // 2. Success Handling
        alert("Success! Check your email for the confirmation link.");
        navigate('/login');
        
    } catch (error) {
        // 3. Log the exact error to console for debugging
        console.error("Signup Error:", error.message);
        alert(error.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
        <p className="text-slate-400 text-center mb-8">Join Coder's Legion today.</p>

        <div className="space-y-4 mb-8">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="email" 
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
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold">Log In</Link>
        </p>
      </div>
    </div>
  );
}
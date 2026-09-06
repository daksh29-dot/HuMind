import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Lock, ArrowRight, Building2 } from 'lucide-react';

export default function RecruiterLogin() {
  const [email, setEmail] = useState('hiring@techcorp.com'); // Pre-filled for demo speed
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple logic: If email has '@' and is not empty, log them in as recruiter
    if (email && email.includes('@')) {
        localStorage.setItem('user_email', email);
        localStorage.setItem('role', 'recruiter');
        navigate('/recruiter');
    } else {
        alert("Please enter a valid work email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px]"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
             <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Recruiter Portal</h1>
          <p className="text-slate-400 text-sm">Sign in to manage your pipeline</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">Work Email</label>
            <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-11 text-white focus:border-cyan-500 focus:outline-none transition-all placeholder:text-slate-600"
                    placeholder="name@company.com"
                />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-11 text-white focus:border-cyan-500 focus:outline-none transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                />
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
        >
          Access Dashboard <ArrowRight size={18} />
        </button>
        
        <p className="text-center text-slate-500 text-xs mt-6">
          Protected by Enterprise SSO. <span className="text-cyan-400 cursor-pointer hover:underline">Need help?</span>
        </p>
      </div>
    </div>
  );
}
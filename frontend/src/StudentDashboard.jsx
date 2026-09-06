import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Play, TrendingUp, AlertTriangle, CheckCircle, BookOpen, ArrowRight, Brain, LogOut } from 'lucide-react'; // Added LogOut icon

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      const userEmail = localStorage.getItem('user_email');
      if (!userEmail) return navigate('/login');

      const res = await axios.post(`${API_URL}/my_stats`, { email: userEmail });
      
      if (res.data && res.data.length > 0) {
        setData(res.data[0]); 
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.clear(); // Clear email and role
    navigate('/login');   // Redirect to Login
  };

  // --- STATE 1: LOADING ---
  if (loading) return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center">
        <Brain className="animate-spin text-indigo-500 mb-4" size={48} />
        <p className="text-slate-400 animate-pulse">Loading your profile...</p>
    </div>
  );

  // --- STATE 2: EMPTY (NO INTERVIEWS) ---
  if (!data) return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative">
      
      {/* Logout Button for Empty State */}
      <button 
        onClick={handleLogout}
        className="absolute top-6 right-6 text-slate-500 hover:text-white flex items-center gap-2 font-bold transition-all"
      >
        <LogOut size={18} /> Logout
      </button>

      <div className="text-center max-w-lg bg-slate-900/50 p-10 rounded-3xl border border-slate-800 backdrop-blur-sm shadow-2xl">
        <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <Play size={40} className="text-indigo-400 ml-1" />
        </div>
        <h2 className="text-2xl font-bold mb-3">No Interviews Found</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          You haven't completed any sessions yet. Start your first AI interview to generate your behavioral profile and get feedback.
        </p>
        <button 
          onClick={() => navigate('/interview')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mx-auto transform hover:scale-105"
        >
          Start First Interview <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // --- STATE 3: DASHBOARD (DATA EXISTS) ---
  const scores = data.culture_scores || {};
  const chartData = [
    { subject: 'Technical', A: scores.technical || 0, fullMark: 10 },
    { subject: 'Comm.', A: scores.communication || 0, fullMark: 10 },
    { subject: 'Prob. Solv.', A: scores.problem_solving || 0, fullMark: 10 },
    { subject: 'Ownership', A: scores.ownership || 0, fullMark: 10 },
    { subject: 'Resilience', A: scores.resilience || 0, fullMark: 10 },
  ];

  const getFeedback = (score, category) => {
    if (score >= 8) return { type: 'good', text: `Great job demonstrating ${category}!` };
    if (score >= 5) return { type: 'avg', text: `Your ${category} is okay, but try to be more specific.` };
    return { type: 'bad', text: `Critical: You failed to show ${category}. Use the STAR method.` };
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 pb-20 pt-20">
      
      {/* HEADER WITH LOGOUT */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Analysis</h1>
          <p className="text-slate-400">Latest Session: {new Date(data.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="flex gap-3">
            <button 
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-slate-700"
            >
              <LogOut size={18} /> Logout
            </button>
            
            <button 
              onClick={() => navigate('/interview')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
            >
              <Play size={18} /> New Session
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART SECTION */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden h-[350px]">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Skill Radar</h3>
             <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar name="Student" dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#818cf8" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-emerald-400" size={20} />
              AI Feedback
            </h3>
            <p className="text-slate-300 leading-relaxed italic border-l-4 border-emerald-500/50 pl-4">
              "{data.summary}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Show Errors */}
             {Object.entries(scores).filter(([k]) => k !== 'skills_list').map(([key, value]) => {
                const feedback = getFeedback(value, key);
                if (feedback.type !== 'bad' && feedback.type !== 'avg') return null;
                
                return (
                  <div key={key} className="bg-red-950/20 border border-red-500/30 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-red-200 font-bold capitalize">
                        <AlertTriangle size={16} /> {key.replace('_', ' ')}
                      </div>
                      <span className="text-red-400 font-mono font-bold">{value}/10</span>
                    </div>
                    <p className="text-red-100/70 text-sm">{feedback.text}</p>
                  </div>
                );
             })}
             
             {/* Show Wins */}
             {Object.entries(scores).filter(([k]) => k !== 'skills_list').map(([key, value]) => {
                const feedback = getFeedback(value, key);
                if (feedback.type !== 'good') return null;
                
                return (
                  <div key={key} className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-emerald-200 font-bold capitalize">
                        <CheckCircle size={16} /> {key.replace('_', ' ')}
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">{value}/10</span>
                    </div>
                    <p className="text-emerald-100/70 text-sm">{feedback.text}</p>
                  </div>
                );
             })}
          </div>
        </div>
      </div>
    </div>
  );
}
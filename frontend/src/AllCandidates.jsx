import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';
import { Users, Brain, Code, MessageCircle, Shield, Lightbulb, TrendingUp, Calendar, Mail } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


export default function AllCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/candidates`);
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely get scores
  const getScore = (val) => (val === undefined || val === null ? 0 : val);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 md:p-10 pb-20">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 pt-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="text-indigo-400" size={40} />
          Candidate Database
        </h1>
        <p className="text-slate-400">
          View all {candidates.length} interviewed candidates and their behavioral profiles.
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center text-slate-500 mt-20">
          <Brain className="animate-spin mx-auto mb-4" size={48} />
          <p>Loading profiles...</p>
        </div>
      )}

      {/* GRID LAYOUT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8">
        {candidates.map((candidate) => {
          const scores = candidate.culture_scores || {};
          
          // Chart Data
          const chartData = [
            { subject: 'Technical', A: getScore(scores.technical), fullMark: 10 },
            { subject: 'Comm.', A: getScore(scores.communication), fullMark: 10 },
            { subject: 'Prob. Solving', A: getScore(scores.problem_solving), fullMark: 10 },
            { subject: 'Ownership', A: getScore(scores.ownership), fullMark: 10 },
            { subject: 'Resilience', A: getScore(scores.resilience), fullMark: 10 },
          ];

          return (
            <div key={candidate.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all shadow-2xl">
              
              {/* HEADER */}
              <div className="bg-slate-950/50 p-6 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                    #{candidate.id}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Candidate #{candidate.id}</h3>
                    <div className="flex gap-2 mt-1">
                       {scores.skills_list && scores.skills_list.length > 0 ? 
                            scores.skills_list.slice(0, 4).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-xs bg-indigo-900/40 text-indigo-300 border border-indigo-500/20">
                                {s}
                              </span>
                            )) 
                            : <span className="text-slate-500 text-xs">No specific skills detected</span>
                       }
                    </div>
                  </div>
                </div>
                <div className="text-slate-500 text-sm font-medium">
                  {new Date(candidate.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* CONTENT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-slate-800">
                
                {/* TEXT & METRICS */}
                <div className="p-8 lg:col-span-2 space-y-6">
                  <p className="text-slate-300 italic bg-slate-950/30 p-4 rounded-xl border border-slate-800/50 leading-relaxed">
                    "{candidate.summary}"
                  </p>
                  
                  {/* SCORE BOXES */}
                  <div className="grid grid-cols-3 gap-3">
                    <ScoreBox label="Technical" score={scores.technical} icon={<Code size={14}/>} />
                    <ScoreBox label="Comm." score={scores.communication} icon={<MessageCircle size={14}/>} />
                    <ScoreBox label="Ownership" score={scores.ownership} icon={<Shield size={14}/>} />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button className="flex-1 bg-white text-slate-950 hover:bg-slate-200 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm">
                      <Calendar size={16} /> Schedule
                    </button>
                    <button className="px-4 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                      <Mail size={18} />
                    </button>
                  </div>
                </div>

                {/* RADAR CHART */}
                <div className="p-4 bg-slate-950/30 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar name="Candidate" dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#818cf8" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} itemStyle={{ color: '#fff' }}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ScoreBox = ({ label, score, icon }) => (
  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
    <div className="flex items-center gap-2 text-slate-400 mb-1 text-[10px] uppercase font-bold tracking-wider">
      {icon} {label}
    </div>
    <div className="text-lg font-bold text-white">
      {score !== undefined ? score : '-'} <span className="text-slate-600 text-xs font-normal">/10</span>
    </div>
  </div>
);
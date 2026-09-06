import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';
import { Search, Brain, Calendar, Mail, Filter, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function RecruiterDashboard() {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate(); // Hook for navigation

  
  // Load all candidates by default on start
  useEffect(() => {
    fetchAllCandidates();
  }, []);

  const fetchAllCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/candidates`);
      setCandidates(res.data);
    } catch (error) {
      console.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query) return fetchAllCandidates(); // Reset if empty
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/search_candidates`, { query_text: query });
      setCandidates(res.data.matches);
    } catch (error) {
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  
  // 1. ADD THIS FUNCTION BEFORE THE RETURN STATEMENT
    const handleEmail = (candidateEmail, score, name) => {
        if (!candidateEmail) return alert("No email found for this candidate.");
        
        const subject = `Invitation to Interview - Coder's Legion`;
        const body = `Hi there,\n\nWe reviewed your AI interview results on Coder's Legion and were impressed by your profile (Match Score: ${score}%).\n\nYour demonstration of resilience and technical problem-solving stood out to us.\n\nWe would like to invite you to the next round of interviews with our engineering team.\n\nPlease let us know your availability for next week.\n\nBest regards,\nHiring Team`;
        
        // Opens the user's default email client
        window.location.href = `mailto:${candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };
    // ... inside RecruiterDashboard function ...

    // 1. SHORTLIST ACTION
    const handleShortlist = (id) => {
      setCandidates(prev => prev.map(c => {
          if (c.id === id) {
              return { ...c, status: 'shortlisted' }; // Mark as shortlisted
          }
          return c;
      }));
    };

    // 2. REJECT ACTION (Remove from view)
    const handleReject = (id) => {
      if (window.confirm("Are you sure you want to reject this candidate?")) {
          setCandidates(prev => prev.filter(c => c.id !== id));
      }
    };
    
    // Calculate dynamic count for the Header
    const shortlistedCount = candidates.filter(c => c.status === 'shortlisted').length;
    // 2. UPDATE THE BUTTON IN THE JSX
    <button 
    onClick={() => handleEmail(candidate.user_email, matchScore)}
    className="flex-1 bg-slate-700 text-slate-300 hover:bg-slate-600 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
    >
    <Mail size={16} /> Contact
    </button>

  const handleLogout = () => {
    localStorage.clear(); // Clear session
    navigate('/login');   // Go back to login
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Helper for safe scores
  const getScore = (val) => (val === undefined || val === null ? 0 : val);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 md:p-10 pb-20">
      
      {/* --- RECRUITER HEADER (UPDATED) --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-8 pt-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
            <UserCheck size={32} className="text-cyan-400" />
            Recruiter Portal
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your talent pool, search by traits, and shortlist candidates.
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
            {/* LOGOUT BUTTON ADDED HERE */}
            <button 
              onClick={handleLogout}
              className="px-6 py-2 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300 font-bold transition-all text-sm h-[50px]"
            >
              Logout
            </button>

            {/* Stats Boxes */}
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-white">{candidates.length}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Total</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-emerald-400">{shortlistedCount}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">Shortlisted</div>
            </div>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="max-w-7xl mx-auto mb-10 sticky top-4 z-30">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-xl p-2 shadow-2xl flex items-center gap-2">
          <Search className="text-slate-500 ml-4" size={20} />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search for 'Resilient leader who knows Python'..."
            className="flex-1 bg-transparent text-white px-4 py-3 text-lg focus:outline-none placeholder:text-slate-600"
          />
          <button 
            onClick={handleSearch}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-lg font-bold transition-all"
          >
            {loading ? "Analyzing..." : "Search"}
          </button>
        </div>
      </div>

      {/* --- CANDIDATE GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6">
        {loading && <div className="text-center text-slate-500 py-20">Loading Talent Pool...</div>}
        
        {!loading && candidates.map((candidate) => {
           const scores = candidate.culture_scores || {};
           const matchScore = candidate.similarity ? Math.round(candidate.similarity * 100) : null;
           const trustColor = (candidate.trust_score || 100) > 80 ? 'text-emerald-400' : 'text-red-400';
           // Radar Data
           const chartData = [
            { subject: 'Technical', A: getScore(scores.technical), fullMark: 10 },
            { subject: 'Comm.', A: getScore(scores.communication), fullMark: 10 },
            { subject: 'Prob. Solving', A: getScore(scores.problem_solving), fullMark: 10 },
            { subject: 'Ownership', A: getScore(scores.ownership), fullMark: 10 },
            { subject: 'Resilience', A: getScore(scores.resilience), fullMark: 10 },
           ];

           return (
            <div key={candidate.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all shadow-lg flex flex-col lg:flex-row">
              
              {/* LEFT: INFO & SCORES */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg text-slate-300">
                        #{candidate.id}
                      </div>
                      <div>
                         {/* 👇 2. REPLACE THE OLD <H3> WITH THIS NEW BLOCK 👇 */}
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   {candidate.user_email || "Candidate"}
                   
                   {/* Trust Score Badge */}
                   <span className={`text-xs border px-2 py-0.5 rounded ${trustColor} border-current flex items-center gap-1`}>
                      {candidate.trust_score || 100}% Trust
                   </span>

                   {/* Keep the Match Score if you want it too */}
                   {matchScore && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">{matchScore}% Match</span>}
                 </h3>
                 {/* 👆 END OF NEW BLOCK 👆 */}
                         <div className="flex flex-wrap gap-2 mt-2">
                           {scores.skills_list?.slice(0,4).map((s,i) => (
                             <span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 border border-slate-600">{s}</span>
                           ))}
                         </div>
                      </div>
                    </div>
                    <div className="text-slate-500 text-xs font-mono">
                      {new Date(candidate.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800 italic mb-6">
                    "{candidate.summary}"
                  </p>
                </div>

                {/* ACTION BAR (Specific to Recruiter) */}
                <div className="flex gap-3 border-t border-slate-700/50 pt-4 mt-auto">
                  <button 
                    onClick={() => handleShortlist(candidate.id)}
                    disabled={candidate.status === 'shortlisted'}
                    className={`
                      flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all flex-1
                      ${candidate.status === 'shortlisted' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default' 
                        : 'bg-white text-slate-900 hover:bg-indigo-50'}
                    `}
                  >
                    {candidate.status === 'shortlisted' ? (
                        <> <CheckCircle size={16} /> Shortlisted </>
                    ) : (
                        <> <CheckCircle size={16} /> Shortlist </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleEmail(candidate.user_email, matchScore)}
                    className="flex-1 bg-slate-700 text-slate-300 hover:bg-slate-600 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={16} /> Contact
                  </button>
                  <button 
                    onClick={() => handleReject(candidate.id)}
                    className="bg-slate-800 text-slate-500 hover:bg-red-900/30 hover:text-red-400 hover:border-red-500/50 border border-slate-700 p-2 rounded-lg transition-all"
                    title="Reject Candidate"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              {/* RIGHT: CHART VISUALIZATION */}
              <div className="bg-slate-900/30 w-full lg:w-[300px] border-l border-slate-700/50 p-4 relative flex items-center justify-center">
                <div className="absolute top-3 left-3 text-xs font-bold text-slate-500 uppercase">Psychometric Profile</div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar name="Candidate" dataKey="A" stroke="#22d3ee" strokeWidth={2} fill="#22d3ee" fillOpacity={0.3} />
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
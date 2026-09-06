import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart3, Clock, CheckCircle, ChevronRight, Briefcase, Shield } from 'lucide-react';

export default function RecruiterLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500/30">
      
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <div className="bg-cyan-600 p-1.5 rounded-lg"><Briefcase size={20} className="text-white"/></div>
          Coder's Legion <span className="text-cyan-500 text-[10px] font-extrabold uppercase tracking-widest border border-cyan-500/30 px-2 py-0.5 rounded ml-2">Enterprise</span>
        </div>
        <div className="flex gap-4 items-center">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">For Candidates</button>
            <button 
            onClick={() => navigate('/recruiter-login')}
            className="bg-white text-slate-900 hover:bg-cyan-50 px-5 py-2 rounded-lg font-bold text-sm transition-all"
            >
            Recruiter Login
            </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative pt-20 pb-32 overflow-hidden text-center px-6">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-600/20 rounded-[100%] blur-[120px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <Shield size={12} /> AI-Powered Vetting
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto">
          Stop Filtering Resumes.<br/>
          Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Uncovering Potential.</span>
        </h1>
        
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Our AI conducts behavioral interviews at scale, analyzing soft skills, resilience, and technical aptitude 24/7—so you only talk to the best.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
            onClick={() => navigate('/recruiter-login')}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 hover:scale-105"
            >
            Access Talent Pool <ChevronRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white border border-slate-700 hover:bg-slate-800 transition-all">
            View Sample Report
            </button>
        </div>

        {/* STATS STRIP */}
        <div className="mt-20 max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16 border-y border-slate-800 bg-slate-900/40 py-8 backdrop-blur-sm rounded-2xl">
            <div className="text-center px-4">
                <div className="text-4xl font-bold text-white mb-1">85%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Reduction in Screening Time</div>
            </div>
            <div className="text-center px-4 border-l border-slate-800">
                <div className="text-4xl font-bold text-white mb-1">3x</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Better Retention Rates</div>
            </div>
            <div className="text-center px-4 border-l border-slate-800">
                <div className="text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Automated Interviewing</div>
            </div>
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card 
            icon={<Clock className="text-cyan-400" size={32} />}
            title="Asynchronous Screening"
            desc="Candidates take AI interviews on their own time. You wake up to a prioritized list of top performers sorted by score."
          />
          <Card 
            icon={<BarChart3 className="text-blue-400" size={32} />}
            title="Deep Psychometrics"
            desc="Go beyond keywords. We measure resilience, ownership, and communication skills using semantic vector analysis."
          />
          <Card 
            icon={<Users className="text-indigo-400" size={32} />}
            title="Volume Hiring"
            desc="Screen 1,000 candidates as easily as 10. Our system scales instantly to meet high-volume hiring demands."
          />
        </div>
      </div>
    </div>
  );
}

const Card = ({ icon, title, desc }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/80 hover:border-slate-700 transition-all group">
    <div className="mb-6 bg-slate-950 w-14 h-14 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-slate-600 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);
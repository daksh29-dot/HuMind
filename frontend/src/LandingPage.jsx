import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Shield, Target, ChevronRight, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
      
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg"><Brain size={24} className="text-white"/></div>
          Coder's Legion
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
          <a href="#impact" className="hover:text-white transition-colors">SDG Impact</a>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 rounded-full font-semibold transition-all text-sm backdrop-blur-md"
        >
          Sign In
        </button>
      </nav>

      {/* HERO SECTION */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-[100%] blur-[120px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <Zap size={12} fill="currentColor" /> AI-Powered Recruitment
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Hire for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Potential</span>,<br/>
            Not Just Keywords.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eliminate bias and uncover hidden talent. Our AI analyzes behavioral traits like resilience and ownership, giving you a complete 360° view of every candidate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/25"
            >
              Get Started <ChevronRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white border border-slate-700 hover:bg-slate-800 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/50">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield className="text-emerald-400" size={32} />}
            title="Bias Defense"
            desc="Our semantic vector engine ignores accents and demographics, focusing purely on the content and intent of the answer."
          />
          <FeatureCard 
            icon={<Brain className="text-indigo-400" size={32} />}
            title="Psychometric Scoring"
            desc="Automatically grades candidates on soft skills like 'Ownership' and 'Empathy' using the STAR methodology."
          />
          <FeatureCard 
            icon={<Target className="text-cyan-400" size={32} />}
            title="Skill Verification"
            desc="Detects behavioral inconsistencies. If a candidate claims to be an expert but gives vague answers, the AI flags it."
          />
        </div>
      </div>

    </div>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-all group">
    <div className="mb-6 bg-slate-950 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-slate-700 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);
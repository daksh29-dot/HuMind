import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Mic, Send, Square, Camera, CameraOff, Sparkles, Activity, MessageSquare, Play, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function App() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false); 
  
  // --- NEW TRUST SCORE STATE ---
  const [trustScore, setTrustScore] = useState(100);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warning, setWarning] = useState(null);

  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // --- SCROLL TO BOTTOM ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // --- TAB SWITCHING DETECTION ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted) {
        setTabSwitchCount(prev => prev + 1);
        setTrustScore(prev => Math.max(0, prev - 10)); // Penalize 10 points per switch
        setWarning("⚠️ Tab Switching Detected! Stay on this screen.");
        
        // Clear warning after 4 seconds
        setTimeout(() => setWarning(null), 4000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted]);

  // --- SPEECH SETUP ---
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; 
    recognition.lang = 'en-IN';     
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) setManualInput((prev) => finalTranscript);
    };

    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
  }, []);

  // --- START INTERVIEW HANDLER ---
  const startInterview = () => {
    setHasStarted(true);
    const greeting = "Hello!, I'm your AI recruiter. Let's start with a brief introduction about yourself and your technical background.";
    setTranscript([{ role: 'ai', text: greeting }]);
    speak(greeting);
  };

  const handleSend = async () => {
    if (!manualInput.trim()) return;
    if (isRecording) { recognitionRef.current.stop(); setIsRecording(false); }

    const userText = manualInput;

    // --- AI CONTENT DETECTION (Local Heuristic) ---
    // Checks for common AI patterns without extra API calls
    const aiPatterns = [
      "as an ai", "language model", "certainly", "here is the", "in conclusion", 
      "summary", "generate", "regenerate", "gpt", "openai"
    ];
    
    // Check if user input matches suspicious AI patterns
    if (aiPatterns.some(pattern => userText.toLowerCase().includes(pattern))) {
        setTrustScore(prev => Math.max(0, prev - 20)); // Penalize 20 points
        setWarning("⚠️ AI-Like Response Detected! Score Reduced.");
        setTimeout(() => setWarning(null), 4000);
    }
    // ----------------------------------------------

    setManualInput("");
    setIsLoading(true);
    
    const newHistory = [...transcript, { role: 'user', text: userText }];
    setTranscript(newHistory);



    const userTurnCount = transcript.filter(t => t.role === 'user').length + 1;
    const MAX_QUESTIONS = 5; // Set your limit here

    // --- 2. CHECK IF INTERVIEW IS OVER ---
    if (userTurnCount >= MAX_QUESTIONS) {
        // Stop calling the AI. Just finish.
        setIsLoading(false);
        alert("Maximum questions reached. Wrapping up interview...");
        
        // Call the finish function directly
        // We pass the newHistory so the final answer is included in the save
        await finishInterview(newHistory); 
        return;
    }


    const imageSrc = webcamRef.current?.getScreenshot();
    const base64Image = imageSrc ? imageSrc.split(',')[1] : null;

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        transcript_history: newHistory.map(t => `${t.role}: ${t.text}`).join("\n"),
        user_input: userText,
        image_base64: base64Image
      });
      const aiReply = response.data.reply;
      setTranscript([...newHistory, { role: 'ai', text: aiReply }]);
      speak(aiReply);
    } catch (error) {
      alert("Backend connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = async () => {
    if (transcript.length < 1) return alert("Please answer at least one question!");
    setIsLoading(true);
    
    const userEmail = localStorage.getItem('user_email') || "anonymous@demo.com";

    try {
      const fullText = transcript.map(t => `${t.role}: ${t.text}`).join("\n");
      
      // SEND EMAIL AND TRUST SCORE TO BACKEND
      await axios.post(`${API_URL}/analyze`, { 
          transcript: fullText,
          user_email: userEmail,
          trust_score: trustScore // <--- ADDED TRUST SCORE HERE
      });
      
      alert(`✅ Interview Saved! Final Trust Score: ${trustScore}%`);
      navigate('/student-dashboard'); 
    } catch (error) {
      alert("Error saving interview.");
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      setManualInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 flex flex-col items-center relative">
      
      {/* --- PROCTORING HUD (Head-Up Display) --- */}
      {hasStarted && (
        <div className="fixed top-6 right-6 z-50 flex gap-4">
           {/* Trust Score Badge */}
           <div className={`
             px-4 py-2 rounded-lg font-bold border backdrop-blur-md flex items-center gap-2 shadow-lg transition-colors duration-300
             ${trustScore > 80 ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 
               trustScore > 50 ? 'bg-yellow-900/30 border-yellow-500 text-yellow-400' : 
               'bg-red-900/30 border-red-500 text-red-400 animate-pulse'}
           `}>
             {trustScore > 80 ? <Eye size={18} /> : <EyeOff size={18} />}
             Trust Score: {trustScore}%
           </div>
        </div>
      )}

      {/* --- WARNING OVERLAY --- */}
      {warning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
           <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 border-2 border-red-400">
             <ShieldAlert fill="white" className="text-red-800" />
             {warning}
           </div>
        </div>
      )}

      {/* HEADER */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Sparkles size={24} className="text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Coder's Legion</h1>
            <p className="text-slate-400 text-xs font-medium tracking-wider uppercase">AI Interview System v1.0</p>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
        
        {/* LEFT COL: CAMERA & CONTROLS */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          <div className="relative flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
            {isCameraOn ? (
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" mirrored={true} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <CameraOff size={48} className="mb-2 opacity-50"/>
                <p className="text-sm font-medium">Camera Disabled</p>
              </div>
            )}
            
            <button 
              onClick={() => setIsCameraOn(!isCameraOn)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-white/80 hover:text-white"
            >
              {isCameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
            </button>
          </div>

          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col gap-4">
             <div className="relative">
                <textarea 
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Listening... (or type your answer)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none h-24"
                />
                <button 
                  onClick={toggleRecording}
                  className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  {isRecording ? <Square size={18} /> : <Mic size={18} />}
                </button>
             </div>

             <div className="flex gap-3">
               <button 
                 onClick={handleSend}
                 disabled={!manualInput.trim() || isLoading}
                 className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 <Send size={16} /> Submit Answer
               </button>
               <button 
                 onClick={finishInterview}
                 className="px-6 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 py-3 rounded-xl font-semibold text-sm transition-all"
               >
                 Finish
               </button>
             </div>
          </div>
        </div>

        {/* RIGHT COL: CHAT HISTORY */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col h-full overflow-hidden backdrop-blur-sm relative">
           
           {/* START OVERLAY WITH DISCLAIMER */}
           {!hasStarted && (
             <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 animate-pulse">
                  <Play size={32} className="text-white ml-1" />
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">Ready for your Interview?</h2>
               <p className="text-slate-400 mb-4 max-w-md">
                 The AI will analyze your speech patterns, confidence, and behavioral traits.
               </p>
               
               {/* --- DISCLAIMER --- */}
               <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg max-w-sm mb-8">
                  <p className="text-red-300 text-xs font-bold flex items-center justify-center gap-2">
                     <ShieldAlert size={14} /> 
                     ANTI-CHEATING ENABLED
                  </p>
                  <p className="text-red-400/80 text-[10px] mt-1">
                     Tab switching and loss of focus will lower your Trust Score.
                  </p>
               </div>

               <button 
                 onClick={startInterview}
                 className="bg-white text-slate-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg"
               >
                 Begin Interview
               </button>
             </div>
           )}

           <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
             <MessageSquare size={18} className="text-indigo-400" />
             <h2 className="font-semibold text-slate-200">Interview Transcript</h2>
           </div>

           <div className="flex-1 overflow-y-auto space-y-6 pr-2">
             {transcript.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`
                    max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}
                 `}>
                   <p className="text-[10px] font-bold opacity-50 mb-1 uppercase tracking-wider">
                     {msg.role === 'user' ? 'Candidate' : 'AI Recruiter'}
                   </p>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-sm border border-slate-800/50">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                 </div>
             )}
             <div ref={chatEndRef} />
           </div>
        </div>
      </main>
    </div>
  );
}
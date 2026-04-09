"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Save to localStorage for the quiz session
    localStorage.setItem('quiz_user_name', userName);
    localStorage.setItem('quiz_user_email', userEmail);

    // Minor delay for visual feedback
    setTimeout(() => {
      setIsLoading(false);
      router.push('/quiz');
    }, 800);
  };

  return (
    <main className="h-[calc(100vh-5rem)] overflow-hidden bg-[#0a1733] flex items-center justify-center p-4 selection:bg-[#720075]/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#720075]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Side: Branding / Copy */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-white/55">Live Hackathon Activity</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-semibold text-white tracking-tight leading-tight">
            Code. Compete. <br className="hidden lg:block" />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,#720075_0%,#ff7300_100%)]">Conquer.</span>
          </h1>

          <p className="text-white/85 text-lg max-w-lg leading-relaxed">
            Test your JavaScript knowledge under pressure. 10 questions. 2 minutes each. Ready to prove your skills and climb the leaderboard?
          </p>
        </div>

        {/* Right Side: Auth Box */}
        <motion.div
          className="order-1 lg:order-2 w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-panel p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/8 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join the Race'}
              </h2>
              <p className="text-white/55 text-sm">
                {isLogin ? 'Enter your details to continue' : 'Register to start your quiz attempt'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-normal text-white/55 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#720075] transition-all placeholder-white/30"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal text-white/55 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#720075] transition-all placeholder-white/30"
                  placeholder="you@example.com"
                />
              </div>

              {isLogin && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs font-normal text-white/55 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs text-white/55 hover:text-white">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    required
                    className="bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#720075] transition-all placeholder-white/30"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-white text-[#0a1733] font-bold rounded-xl px-4 py-3.5 hover:bg-white/88 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-[#0a1733]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Start Quiz'}</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-white/55 hover:text-white transition-colors"
                type="button"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}


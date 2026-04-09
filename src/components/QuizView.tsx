"use client";

import { useState, useEffect } from 'react';
import { questions, Question } from '@/data/questions';
import Timer from './Timer';
import CodeChallenge from './CodeChallenge';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<string | null>(null);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user info from localStorage
    const name = localStorage.getItem('quiz_user_name') || 'Anonymous';
    const email = localStorage.getItem('quiz_user_email') || 'no-email@provided.com';
    setUserName(name);
    setUserEmail(email);
  }, []);

  const question = questions[currentIdx];
  const SECONDS_PER_QUESTION = 120;

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          userName: userName || 'Anonymous',
          userEmail: userEmail || 'no-email@provided.com',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setScore(data.score);
      } else {
        console.error("Submission failed:", data.error);
      }
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMCQSelect = (optionIndex: number) => {
    setAnswers((prev: any) => ({ ...prev, [question.id]: optionIndex }));
  };

  const handleCodeChange = (code: string) => {
    setAnswers((prev: any) => ({ ...prev, [question.id]: code }));
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/5 border border-white/8 p-8 rounded-3xl shadow-2xl backdrop-blur-xl text-center max-w-md w-full relative overflow-hidden"
        >
          
          <div className="w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          
          <h2 className="text-3xl font-semibold mb-2">Quiz Completed!</h2>
          <p className="text-white/55 mb-6 font-medium">Well done, {userName}!</p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
             <p className="text-sm text-white/40 uppercase tracking-widest font-bold mb-1">Your Score</p>
             <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#720075] to-[#ff7300]">
               {score || "--/--"}
             </div>
          </div>

          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2 text-white">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
              <span className="ml-2 text-sm text-white/55">Recording results...</span>
            </div>
          ) : (
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white text-[#0a1733] rounded-xl font-bold hover:bg-white/88 transition-all w-full shadow-[0_4px_15px_rgba(255,255,255,0.1)]"
            >
              Return Home
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 text-gray-100">
      {/* Header section with progress & timer */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-4 relative overflow-hidden">
        <div className="flex justify-between items-center w-full">
          <span className="text-sm font-normal text-white/55 uppercase tracking-widest">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-normal">
            {question.type === 'mcq' ? 'Multiple Choice' : 'Coding Challenge'}
          </span>
        </div>
        <Timer 
          key={question.id} 
          durationSeconds={SECONDS_PER_QUESTION} 
          onTimeUp={handleNext} 
        />
      </div>

      {/* Main Question Card container with transitions */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-10 w-full flex flex-col gap-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                {question.title}
              </h2>
              {question.description && (
                <p className="text-white/85 md:text-lg whitespace-pre-line leading-relaxed">
                  {question.description}
                </p>
              )}
            </div>

            {/* If there is a code snippet to display (mostly for MCQ read-only) */}
            {question.codeSnippet && question.type === 'mcq' && (
              <div className="bg-black/50 text-white/85 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-white/10 shadow-inner">
                <pre><code>{question.codeSnippet}</code></pre>
              </div>
            )}

            {/* Answer Input Area depending on Type */}
            <div className="mt-4 flex-grow">
              {question.type === 'mcq' ? (
                <div className="flex flex-col gap-3">
                  {question.options?.map((opt, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleMCQSelect(i)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        answers[question.id] === i 
                          ? 'border-[#720075] bg-[#720075]/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        answers[question.id] === i ? 'border-[#720075] bg-[#720075]' : 'border-white/30'
                      }`}>
                        {answers[question.id] === i && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={`text-base md:text-lg ${answers[question.id] === i ? 'text-white' : 'text-white/85'}`}>{opt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <CodeChallenge 
                    initialCode={question.codeSnippet || ""} 
                    onChange={handleCodeChange}
                  />
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Type your code above. The timer applies. Do not rely heavily on autocomplete.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-8 border-t border-white/10 pt-6">
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-white text-[#0a1733] rounded-xl font-bold text-lg hover:bg-white/88 transition-all flex items-center gap-2 group"
              >
                {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


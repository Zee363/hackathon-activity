"use client";

import { useState } from 'react';
import { questions, Question } from '@/data/questions';
import Timer from './Timer';
import CodeChallenge from './CodeChallenge';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // TODO: Send to API
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
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
          className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-gray-400 mb-6">Your answers have been submitted successfully.</p>
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2 text-pink-500">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
              <span className="ml-2 text-sm text-gray-400">Saving results...</span>
            </div>
          ) : (
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-semibold hover:opacity-90 transition-all text-white w-full"
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
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-semibold">
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
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl relative z-10 w-full flex flex-col gap-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {question.title}
              </h2>
              {question.description && (
                <p className="text-gray-300 md:text-lg whitespace-pre-line leading-relaxed">
                  {question.description}
                </p>
              )}
            </div>

            {/* If there is a code snippet to display (mostly for MCQ read-only) */}
            {question.codeSnippet && question.type === 'mcq' && (
              <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-gray-700 shadow-inner">
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
                          ? 'border-pink-500 bg-pink-500/10' 
                          : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[question.id] === i ? 'border-pink-500' : 'border-gray-500'
                      }`}>
                        {answers[question.id] === i && <div className="w-3 h-3 rounded-full bg-pink-500" />}
                      </div>
                      <span className="text-base md:text-lg">{opt}</span>
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
            <div className="flex justify-end mt-8 border-t border-gray-800 pt-6">
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex border border-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)] items-center gap-2"
              >
                {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

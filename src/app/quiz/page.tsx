import QuizView from '@/components/QuizView';

export const metadata = {
  title: 'Quiz | Hackathon Activity',
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6 lg:px-8 selection:bg-pink-500/30">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
          Developer Quiz
        </h1>
        <div className="flex items-center gap-3">
          {/* User profile could go here, currently stubbed */}
          <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">
            JS
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <QuizView />
      </div>
    </main>
  );
}

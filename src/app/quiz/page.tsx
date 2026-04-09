import QuizView from '@/components/QuizView';

export const metadata = {
  title: 'Quiz | Hackathon Activity',
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[#0a1733] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#720075]/30">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[linear-gradient(135deg,#000000_0%,#720075_100%)] opacity-20 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-white">
          Developer Quiz
        </h1>
        <div className="flex items-center gap-3">
          {/* User profile could go here, currently stubbed */}
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white/55">
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

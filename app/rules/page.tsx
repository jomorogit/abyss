import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gray-900 flex items-center justify-center p-4 text-white relative overflow-hidden">
      
     
      <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="bg-gray-800/60 backdrop-blur-md border border-slate-700/50 p-8 sm:p-12 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 flex flex-col items-center">
        
       
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-4xl mb-6 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          📜
        </div>

     
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mb-3 uppercase tracking-wide">
          Раздел в разработке
        </h1>
        
   
        <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
          Мастера ещё пишут свитки. Правила игры находятся на стадии наполнения и скоро появятся здесь!
        </p>

      
        <Link 
          href="/" 
          className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-slate-200 hover:text-white font-bold py-3.5 px-6 rounded-xl border border-red-700/50 transition-all duration-300 shadow-lg hover:shadow-red-900/30 active:scale-[0.98]"
        >
          Вернуться в меню
        </Link>
      </div>
    </div>
  );
}
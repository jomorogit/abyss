import Image from "next/image";

export default function Home() {
  return (
   <div className="relative group flex items-center justify-center w-full min-h-screen select-none cursor-default bg-slate-950 overflow-hidden">
  
  <div className="absolute inset-0 flex items-center justify-center text-9xl font-bold text-cyan-500/30 blur-2xl opacity-40 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-90 group-hover:text-blue-500/50 mix-blend-screen">
    Abyss
  </div>

  
  <h1 className="relative text-9xl font-bold text-slate-100 tracking-wider transition-all duration-500 ease-out [text-shadow:0_0_20px_rgba(56,189,248,0.3)] group-hover:[text-shadow:0_0_40px_rgba(56,189,248,0.8),0_0_80px_rgba(59,130,246,0.6)] group-hover:text-white group-hover:scale-[1.02]">
    Abyss
  </h1>
</div>
  );
}

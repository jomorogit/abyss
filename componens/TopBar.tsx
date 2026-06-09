import React from 'react'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="w-full h-16 bg-[#182342] flex justify-center gap-12 items-center px-6 shadow-xl border-b border-slate-700/50 backdrop-blur-sm relative z-50">
      
      {/* Категория: Персонажи */}
      <div className="relative group h-full flex items-center">
        <span className="text-xl font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors duration-300">
          Персонажи
        </span>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-[#182342] border border-slate-700/50 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
          <Link href="/heros" className="px-5 py-3 text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors">
            Heroes
          </Link>
          <Link href="/enemys" className="px-5 py-3 text-slate-200 hover:text-rose-500 hover:bg-slate-800/50 transition-colors">
            Enemies
          </Link>
        </div>
      </div>

      {/* Категория: Снаряжение */}
      <div className="relative group h-full flex items-center">
        <span className="text-xl font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors duration-300">
          Снаряжение
        </span>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-[#182342] border border-slate-700/50 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
          <Link href="/weapons" className="px-5 py-3 text-slate-200 hover:text-amber-400 hover:bg-slate-800/50 transition-colors">
            Weapons
          </Link>
          <Link href="/armors" className="px-5 py-3 text-slate-200 hover:text-indigo-400 hover:bg-slate-800/50 transition-colors">
            Armors
          </Link>
          <Link href="/artifact" className="px-5 py-3 text-slate-200 hover:text-purple-400 hover:bg-slate-800/50 transition-colors">
            Artifacts
          </Link>
          <Link href="/bags" className="px-5 py-3 text-slate-200 hover:text-yellow-400 hover:bg-slate-800/50 transition-colors">
            Bags
          </Link>
        </div>
      </div>

      {/* Категория: Припасы */}
      <div className="relative group h-full flex items-center">
        <span className="text-xl font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors duration-300">
          Припасы
        </span>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-[#182342] border border-slate-700/50 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
          <Link href="/consumables" className="px-5 py-3 text-slate-200 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors">
            Consumables
          </Link>
          <Link href="/money" className="px-5 py-3 text-slate-200 hover:text-yellow-500 hover:bg-slate-800/50 transition-colors">
            Money
          </Link>
        </div>
      </div>

      {/* Категория: Справочник */}
      <div className="relative group h-full flex items-center">
        <span className="text-xl font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors duration-300">
          Справочник
        </span>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-[#182342] border border-slate-700/50 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
          <Link href="/rules" className="px-5 py-3 text-slate-200 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors">
            Rules
          </Link>
          <Link href="/drop" className="px-5 py-3 text-slate-200 hover:text-yellow-400 hover:bg-slate-800/50 transition-colors">
            Drop
          </Link>
        </div>
      </div>

    </div>
  )
}
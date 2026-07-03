"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopBar() {
 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

 
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  const navItems = [
    {
      title: "Персонажи",
      links: [
        { href: "/heros", label: "Heroes", hoverClass: "hover:text-cyan-400" },
        { href: "/enemys", label: "Enemies", hoverClass: "hover:text-rose-500" }
      ]
    },
    {
      title: "Снаряжение",
      links: [
        { href: "/weapons", label: "Weapons", hoverClass: "hover:text-amber-400" },
        { href: "/armors", label: "Armors", hoverClass: "hover:text-indigo-400" },
        { href: "/artifact", label: "Artifacts", hoverClass: "hover:text-purple-400" },
        { href: "/bags", label: "Bags", hoverClass: "hover:text-yellow-400" }
      ]
    },
    {
      title: "Припасы",
      links: [
        { href: "/consumables", label: "Consumables", hoverClass: "hover:text-emerald-400" },
        { href: "/money", label: "Money", hoverClass: "hover:text-yellow-500" }
      ]
    },
    {
      title: "Справочник",
      links: [
        { href: "/rules", label: "Rules", hoverClass: "hover:text-emerald-400" },
        { href: "/drop", label: "Drop", hoverClass: "hover:text-yellow-400" }
      ]
    }
  ];


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

   
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); 
      } else {
        // Если скроллим вверх
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

 
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

 
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setOpenCategory(null); 
  };

  return (
    <div 
      className={`fixed top-0 left-0 w-full bg-[#182342] shadow-xl border-b border-slate-700/50 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
    
      <div className="h-16 px-6 flex justify-between md:justify-center items-center md:gap-12 w-full max-w-7xl mx-auto">
        
      
        <div className="md:hidden text-xl font-bold text-slate-200">
          Меню
        </div>

      
        <button 
          className="md:hidden text-slate-200 hover:text-white transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Десктопное меню 🖥️ */}
        <div className="hidden md:flex h-full items-center gap-12">
          {navItems.map((category) => (
            <div key={category.title} className="relative group h-full flex items-center">
              <span className="text-xl font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors duration-300">
                {category.title}
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-[#182342] border border-slate-700/50 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
                {category.links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`px-5 py-3 text-slate-200 hover:bg-slate-800/50 transition-colors ${link.hoverClass}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

     
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#182342] border-t border-slate-700/50 flex flex-col px-4 py-2 max-h-[80vh] overflow-y-auto">
          {navItems.map((category) => (
            <div key={category.title} className="flex flex-col border-b border-slate-700/50 last:border-0">
              <button 
                onClick={() => setOpenCategory(openCategory === category.title ? null : category.title)}
                className="flex justify-between items-center py-4 text-lg font-semibold text-slate-200 hover:text-white transition-colors w-full text-left"
              >
                {category.title}
                <span className={`text-sm transition-transform duration-300 ${openCategory === category.title ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
            
              {openCategory === category.title && (
                <div className="flex flex-col bg-slate-800/30 rounded-lg mb-2 overflow-hidden animate-fadeIn">
                  {category.links.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={handleLinkClick}
                      className={`px-6 py-3 text-slate-300 hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 ${link.hoverClass}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
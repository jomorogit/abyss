import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>; 
}

export default async function ConsumableCardPage({ params }: PageProps) {
  const { id } = await params;

  const item = await prisma.consumables.findUnique({
    where: { id: id },
  });

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-gray-700 shadow-2xl">
          <h1 className="text-6xl font-black text-gray-700 mb-4">404 🛑</h1>
          <div className="text-2xl font-bold mb-2">Предмет утерян 💨</div>
          <p className="text-gray-400 mb-6">Расходник с ID {id} разбит или испарился.</p>
          <Link href="/consumables" className="text-emerald-500 hover:text-emerald-400 transition-colors underline underline-offset-4">
            Вернуться к полкам 🔙
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        
        <Link 
          href="/consumables" 
          className="inline-flex items-center text-gray-400 hover:text-emerald-500 mb-8 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Назад к списку
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
          
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[700px] bg-gradient-to-b from-gray-900 to-gray-950 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-700">
            
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
              <span className="bg-emerald-950/80 text-emerald-400 text-sm font-black px-4 py-2 rounded-lg backdrop-blur-md border border-emerald-900/50 shadow-lg uppercase tracking-widest">
                 {item.type}
              </span>
               <span className="bg-amber-500/90 text-gray-950 text-sm font-black px-4 py-2 rounded-lg backdrop-blur-md shadow-lg">
                 Tier {item.tier}
              </span>
            </div>

            <div className="relative w-full h-full">
              {item.image ? (
                <Image 
                  src={item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/${item.image}`} 
                  alt={item.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:scale-105 transition-transform duration-700"
                  priority={true} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 uppercase tracking-widest font-bold">
                  Нет изображения 🖼️
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {item.name}
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed italic border-l-4 border-emerald-900/50 pl-4">
              {item.description || 'Секрет создания этого предмета держится в тайне... 🤫'}
            </p>

            <div className="pt-8 border-t border-gray-700 flex flex-row gap-8 mt-auto">
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Покупка</div>
                <div className="text-3xl lg:text-4xl font-black text-green-400 drop-shadow-md">
                  {item.price_buy === 0 ? "Нельзя купить" : item.price_buy + " Silver"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Продажа</div>
                <div className="text-3xl lg:text-4xl font-black text-amber-500 drop-shadow-md">
                  {item.price_sell + " Silver"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
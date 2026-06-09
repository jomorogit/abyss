import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>; 
}

export default async function BagCardPage({ params }: PageProps) {
  const { id } = await params;

  const bagItem = await prisma.bags.findUnique({
    where: { id: id },
  });

  if (!bagItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-gray-700 shadow-2xl">
          <h1 className="text-6xl font-black text-gray-700 mb-4">404</h1>
          <div className="text-2xl font-bold mb-2">Предмет утерян</div>
          <p className="text-gray-400 mb-6">Сумка с ID {id} не найдена.</p>
          <Link href="/bags" className="text-blue-500 hover:text-blue-400 transition-colors underline underline-offset-4">
            Вернуться к списку сумок
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        
        <Link 
          href="/bags" 
          className="inline-flex items-center text-gray-400 hover:text-blue-500 mb-8 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Назад к списку
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
          
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[700px] bg-gradient-to-b from-gray-900 to-gray-950 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-700">
            
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-blue-950/80 text-blue-400 text-sm font-black px-4 py-2 rounded-lg backdrop-blur-md border border-blue-900/50 shadow-lg uppercase tracking-widest">
                {bagItem.type}
              </span>
               <span className="absolute top-10 left-0 z-10 bg-amber-500/90 text-gray-950 text-xl font-bold px-2.5 w-20 py-1 rounded-md shadow-sm">
                Tier {bagItem.tier}
              </span>
            </div>

            <div className="relative w-full h-full">
              {bagItem.image ? (
                <Image 
                  src={bagItem.image.startsWith('http') || bagItem.image.startsWith('/') ? bagItem.image : `/${bagItem.image}`} 
                  alt={bagItem.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:scale-105 transition-transform duration-700"
                  priority={true} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 uppercase tracking-widest font-bold">
                  Нет изображения
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {bagItem.name}
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed italic">
              {bagItem.description || 'Надежное хранилище для ваших вещей...'}
            </p>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="bg-blue-950/20 p-5 rounded-2xl border border-blue-900/30 flex flex-col items-center justify-center shadow-inner">
                <div className="text-blue-500/70 text-sm font-bold mb-1 uppercase tracking-widest">Вместимость (слотов)</div>
                <div className="text-4xl font-black text-blue-500 drop-shadow-md">{bagItem.slots}</div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-700 flex flex-row gap-8 mt-auto">
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Покупка</div>
                <div className="text-3xl lg:text-4xl font-black text-green-400 drop-shadow-md">
                  {bagItem.price_buy === 0 ? "Нельзя купить" : bagItem.price_buy + " Silver"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Продажа</div>
                <div className="text-3xl lg:text-4xl font-black text-amber-500 drop-shadow-md">
                  {bagItem.price_sell + " Silver"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
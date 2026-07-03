import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtifactCardPage({ params }: PageProps) {
  const { id } = await params;


  const artifactItem = await prisma.artifact.findUnique({
    where: { id: id },
  });

  
  if (!artifactItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-purple-900/50 shadow-2xl">
          <h1 className="text-6xl font-black text-purple-900 mb-4">404</h1>
          <div className="text-2xl font-bold mb-2">Реликвия утеряна</div>
          <p className="text-gray-400 mb-6">Предмет с ID {id} рассыпался в прах.</p>
          <Link href="/artifact" className="text-purple-500 hover:text-purple-400 transition-colors underline underline-offset-4">
            Вернуться в сокровищницу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        
    
        <Link 
          href="/artifact" 
          className="inline-flex items-center text-gray-400 hover:text-purple-500 mb-8 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Вернуться к списку артефактов
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
          
          
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[700px] bg-gradient-to-b from-gray-900 to-gray-950 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-700 overflow-hidden">
            
         
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-[80px] z-0"></div>

         
            <div className="absolute top-6 left-6 z-30 flex flex-col gap-3 pointer-events-none">
              <span className="bg-purple-950/80 text-purple-400 text-sm font-black px-4 py-2 rounded-lg backdrop-blur-md border border-purple-900/50 shadow-lg uppercase tracking-widest">
                {artifactItem.type}
              </span>
              <span className="bg-fuchsia-600/90 text-white text-sm font-black px-4 py-2 rounded-lg backdrop-blur-md shadow-lg border border-fuchsia-500">
                Tier {artifactItem.tier}
              </span>
            </div>

            <div className="relative w-full h-full z-10">
              {artifactItem.image ? (
                <Image 
                  src={artifactItem.image.startsWith('http') || artifactItem.image.startsWith('/') ? artifactItem.image : `/${artifactItem.image}`} 
                  alt={artifactItem.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_0_40px_rgba(217,70,239,0.3)] hover:scale-105 transition-transform duration-700 hover:rotate-3"
                  priority={true} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-purple-900/50 uppercase tracking-widest font-bold">
                  Невидимая материя
                </div>
              )}
            </div>
          </div>

         
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col relative z-10">
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
              {artifactItem.name}
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed italic border-l-4 border-purple-900/50 pl-4">
              {artifactItem.description || 'Древняя сила пульсирует внутри этого предмета...'}
            </p>
            
        
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-center mb-8">
              <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">Способ получения</div>
              <div className={`text-lg font-black ${artifactItem.isDroppable ? 'text-green-400' : 'text-gray-400'}`}>
                {artifactItem.isDroppable ? 'Можно выбить' : 'Только торговля'}
              </div>
            </div>

         
            <div className="space-y-4 mb-8">
              
             
              {artifactItem.skillPassive && (
                <div className="bg-fuchsia-950/20 p-5 rounded-2xl border border-fuchsia-900/50 shadow-inner">
                  <div className="text-fuchsia-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>Пассивная аура</span>
                  </div>
                  <div className="text-gray-200 text-lg">{artifactItem.skillPassive}</div>
                </div>
              )}

          
              {artifactItem.skillActive && (
                <div className="bg-purple-950/30 p-5 rounded-2xl border border-purple-800/50 shadow-inner">
                  <div className="text-purple-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>Заклинание (Активное)</span>
                  </div>
                  <div className="text-gray-200 text-lg">{artifactItem.skillActive}</div>
                </div>
              )}

              {!artifactItem.skillPassive && !artifactItem.skillActive && (
                <div className="text-gray-600 italic text-center p-4 border border-dashed border-gray-700 rounded-xl">
                  Этот предмет не обладает ярко выраженной магией...
                </div>
              )}
            </div>

         
            <div className="pt-8 border-t border-gray-700 flex flex-row gap-8 mt-auto">
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Покупка</div>
                <div className="text-3xl lg:text-4xl font-black text-green-400 drop-shadow-md">
                  {artifactItem.price_buy === 0 && artifactItem.isDroppable ? "Нельзя купить" : artifactItem.price_buy + " Silver"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Продажа</div>
                <div className="text-3xl lg:text-4xl font-black text-amber-500 drop-shadow-md">
                  {artifactItem.price_sell + " Silver"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>; 
}

export default async function WeaponCardPage({ params }: PageProps) {
  const { id } = await params;

  // Ищем оружие в базе
  const weaponItem = await prisma.weapon.findUnique({
    where: { id: id },
  });

  // Если оружие не найдено
  if (!weaponItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-gray-700 shadow-2xl">
          <h1 className="text-6xl font-black text-gray-700 mb-4">404</h1>
          <div className="text-2xl font-bold mb-2">Оружие сломано</div>
          <p className="text-gray-400 mb-6">Предмет с ID {id} не найден в арсенале.</p>
          <Link href="/weapons" className="text-orange-500 hover:text-orange-400 transition-colors underline underline-offset-4">
            Вернуться в оружейную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Кнопка "Назад" */}
        <Link 
          href="/weapons" 
          className="inline-flex items-center text-gray-400 hover:text-orange-500 mb-8 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Назад к стойкам с оружием
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
          
          {/* Левая часть: Изображение */}
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[700px] bg-gradient-to-b from-gray-900 to-gray-950 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-700">
            
            {/* Тип оружия */}
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-orange-950/80 text-orange-400 text-sm font-black px-4 py-2 rounded-lg backdrop-blur-md border border-orange-900/50 shadow-lg uppercase tracking-widest">
                {weaponItem.type}
              </span>
               <span className="absolute top-10 left-0 z-10 bg-amber-500/90 text-gray-950 text-xl font-bold px-2.5 py-1 rounded-md shadow-sm">
                Tier {weaponItem.tier}
              </span>
            </div>

            <div className="relative w-full h-full">
              {weaponItem.image ? (
                <Image 
                  src={weaponItem.image.startsWith('http') || weaponItem.image.startsWith('/') ? weaponItem.image : `/${weaponItem.image}`} 
                  alt={weaponItem.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:scale-105 transition-transform duration-700"
                  priority={true} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 uppercase tracking-widest font-bold">
                  Чертеж утерян
                </div>
              )}
            </div>
          </div>

          {/* Правая часть: Подробная информация */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {weaponItem.name}
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed italic">
              {weaponItem.description || 'Холодная сталь, жаждущая битвы...'}
            </p>
            
            {/* Урон и Выпадение */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-950/20 p-5 rounded-2xl border border-orange-900/30 flex flex-col items-center justify-center shadow-inner">
                <div className="text-orange-500/70 text-sm font-bold mb-1 uppercase tracking-widest">Базовый урон</div>
                <div className="text-4xl font-black text-orange-500 drop-shadow-md">{weaponItem.damage}</div>
              </div>

              <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700/50 flex flex-col items-center justify-center">
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Способ получения</div>
                <div className={`text-lg font-black mt-1 ${weaponItem.isDroppable ? 'text-green-400' : 'text-gray-400'}`}>
                  {weaponItem.isDroppable ? 'Можно выбить' : 'Только торговля'}
                </div>
              </div>
            </div>

            {/* Блоки Способностей */}
            <div className="space-y-4 mb-8">
              {/* Активный навык */}
              {weaponItem.skillActive && (
                <div className="bg-red-950/30 p-4 rounded-xl border-l-4 border-red-500">
                  <div className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span>Активный навык</span>
                  </div>
                  <div className="text-gray-200">{weaponItem.skillActive}</div>
                </div>
              )}

              {/* Пассивный навык */}
              {weaponItem.skillPassive && (
                <div className="bg-indigo-950/30 p-4 rounded-xl border-l-4 border-indigo-500">
                  <div className="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span>Пассивный эффект</span>
                  </div>
                  <div className="text-gray-200">{weaponItem.skillPassive}</div>
                </div>
              )}
            </div>

            {/* Футер с ценой покупки и продажи */}
            <div className="pt-8 border-t border-gray-700 flex flex-row gap-8 mt-auto">
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Покупка</div>
                <div className="text-3xl lg:text-4xl font-black text-green-400 drop-shadow-md">
                  {weaponItem.price_buy === 0 && weaponItem.isDroppable ? "Нельзя купить" : weaponItem.price_buy + " Silver"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Продажа</div>
                <div className="text-3xl lg:text-4xl font-black text-amber-500 drop-shadow-md">
                  {weaponItem.price_sell + " Silver"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
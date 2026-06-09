import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>; 
}

export default async function EnemyCardPage({ params }: PageProps) {
  const { id } = await params;

  // Ищем врага + подтягиваем категорию лута (если есть связь) 🗄️
  const enemyItem = await prisma.enemy.findUnique({
    where: { id: id },
    include: {
      loot: true, // Включаем связанные данные о луте
    }
  });

  // Если враг не найден 🛑
  if (!enemyItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-red-900 shadow-2xl">
          <h1 className="text-6xl font-black text-red-600 mb-4">404</h1>
          <div className="text-2xl font-bold mb-2">👹 След потерян</div>
          <p className="text-gray-400 mb-6">Монстр с ID {id} скрылся во мраке бездны.</p>
          <Link href="/enemys" className="text-red-500 hover:text-red-400 transition-colors underline underline-offset-4">
            Вернуться в бестиарий
          </Link>
        </div>
      </div>
    );
  }

  // Переводим шанс лута в проценты (например, 0.5 -> 50%)
  const lootChancePercent = Math.round(enemyItem.lootChance * 100);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Кнопка "Назад" 🔙 */}
        <Link 
          href="/enemys" 
          className="inline-flex items-center text-gray-400 hover:text-red-500 mb-8 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Вернуться в бестиарий
        </Link>

        <div className="bg-gray-800 border border-red-900/50 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(153,27,27,0.2)] flex flex-col lg:flex-row">
          
          {/* Левая часть: Изображение Монстра 🖼️ */}
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[700px] bg-gray-950 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-red-900/30">
            
            {/* Уровень угрозы */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
              <span className="bg-red-600/90 text-white text-xl font-black px-4 py-2 rounded-lg backdrop-blur-md shadow-lg border border-red-500">
                Угроза: Tier {enemyItem.tier}
              </span>
            </div>

            <div className="relative w-full h-full">
              {enemyItem.image ? (
                <Image 
                  src={enemyItem.image} 
                  alt={enemyItem.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:scale-105 transition-transform duration-500"
                  priority={true} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-red-900 uppercase tracking-widest font-bold">
                  <span className="text-6xl mb-4">🦇</span>
                  Тварь скрывается во тьме
                </div>
              )}
            </div>
          </div>

          {/* Правая часть: Подробная информация 📝 */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col relative overflow-hidden">
            
            {/* Кровавый градиент на фоне */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -z-10"></div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-red-500 mb-6 leading-tight drop-shadow-md">
              {enemyItem.name}
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed italic border-l-4 border-red-900/50 pl-4">
              {enemyItem.description || 'Об этом существе нет записей в архивах...'}
            </p>
            
            {/* Сетка боевых характеристик 📊 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 p-4 rounded-xl border border-red-900/50 text-center">
                <div className="text-red-500 text-sm font-bold mb-1 uppercase">❤️ Здоровье</div>
                <div className="text-3xl font-black text-white">{enemyItem.hp}</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-amber-900/50 text-center">
                <div className="text-amber-500 text-sm font-bold mb-1 uppercase">⚔️ Атака</div>
                <div className="text-3xl font-black text-white">{enemyItem.attack}</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-600/50 text-center">
                <div className="text-gray-400 text-sm font-bold mb-1 uppercase">🛡️ Броня</div>
                <div className="text-3xl font-black text-white">{enemyItem.armor}</div>
              </div>
            </div>

            {/* Способность Врага ✨ */}
            {enemyItem.skill && (
              <div className="bg-red-950/30 p-5 rounded-2xl border border-red-900/50 mb-8">
                <h3 className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2">☠️ Смертоносная способность</h3>
                <p className="text-lg text-red-200">{enemyItem.skill}</p>
              </div>
            )}

            {/* Бонус кубика 🎲 */}
            {enemyItem.cubeBonus > 0 && (
              <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-900/50 mb-8 flex justify-between items-center">
                <span className="text-indigo-400 font-bold uppercase text-sm tracking-wider">🎲 Усиление броска (Бонус)</span>
                <span className="text-2xl font-black text-indigo-400">+{enemyItem.cubeBonus}</span>
              </div>
            )}

            {/* Блок Лута 💰 */}
            <div className="mt-auto border-t border-red-900/30 pt-6">
              <h3 className="text-xl font-bold text-white mb-4">📦 Возможная добыча</h3>
              <div className="flex items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-700">
                <div>
                  <div className="text-gray-400 text-sm">Тип добычи:</div>
                  <div className="font-bold text-amber-400 text-lg">
                    {enemyItem.loot ? enemyItem.loot.type : 'Нет ценностей'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Шанс выпадения:</div>
                  <div className={`font-black text-2xl ${lootChancePercent > 50 ? 'text-green-500' : 'text-amber-500'}`}>
                    {lootChancePercent}%
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
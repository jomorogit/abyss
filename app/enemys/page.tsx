import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image'; 
import Link from 'next/link';

export default async function EnemysPage() {
  let enemiesArray = [];

  try {
    // Получаем врагов из базы 🗄️
    enemiesArray = await prisma.enemy.findMany({});
  } catch (error) {
    console.error("Ошибка при загрузке врагов:", error);
    return (
      <div className="p-4 text-red-500 font-medium">
        ❌ Не удалось загрузить бестиарий. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!enemiesArray || enemiesArray.length === 0) {
    return <div className="p-4 text-gray-500">Бестиарий пуст. Врагов нет.</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Бестиарий Бездны 👹</h1>
      
      {/* Сетка для карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {enemiesArray.map((enemy) => (
          <Link 
            href={`/enemys/${enemy.id}`} // 🎯 Ссылка на страницу конкретного врага
            key={enemy.id} 
            className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-red-500/50 transition-colors duration-300 group"
          >
            {/* Изображение врага 🖼️ */}
            <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700">
              {enemy.image ? (
                <Image 
                  src={enemy.image} 
                  alt={enemy.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  priority={false}
                />
              ) : (
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Нет изображения
                </div>
              )}
              
              {/* Бейдж Тира (Ранга опасности) ⚠️ */}
              <span className="absolute top-3 right-3 z-10 bg-red-600/90 text-white text-xl font-bold px-2.5 py-1 rounded-md shadow-sm">
                Tier {enemy.tier}
              </span>
            </div>

            {/* Контентная часть карточки 📝 */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-red-400 mb-2 line-clamp-1">
                {enemy.name}
              </h2>
              
              <p className="text-gray-400 text-[16px] mb-4 line-clamp-3 flex-grow">
                {enemy.description || 'Неизвестная тварь из глубин...'}
              </p>

              {/* Боевые характеристики 📊 */}
              <div className="grid grid-cols-3 gap-2 border-t border-red-900/30 pt-3 mt-auto text-sm">
                <div className="flex flex-col items-center bg-gray-900/50 p-2 rounded border border-gray-700">
                  <span className="text-red-500 font-bold">❤️ {enemy.hp}</span>
                </div>
                <div className="flex flex-col items-center bg-gray-900/50 p-2 rounded border border-gray-700">
                  <span className="text-amber-500 font-bold">⚔️ {enemy.attack}</span>
                </div>
                <div className="flex flex-col items-center bg-gray-900/50 p-2 rounded border border-gray-700">
                  <span className="text-gray-400 font-bold">🛡️ {enemy.armor}</span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
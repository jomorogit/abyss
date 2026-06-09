import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image'; 
import Link from 'next/link';

// 🎯 Выводим точный тип одного элемента из возвращаемого массива Prisma для героев
type HeroItem = Awaited<ReturnType<typeof prisma.hero.findMany>>[number];

export default async function HeroesPage() {
  // 📦 Строго типизируем массив, чтобы избежать ошибки неявного типа any
  let heroesArray: HeroItem[] = [];

  try {
    // Получаем героев из базы 🗄️
    heroesArray = await prisma.hero.findMany({});
  } catch (error) {
    console.error("Ошибка при загрузке героев:", error);
    return (
      <div className="p-4 text-red-500 font-medium">
        ❌ Не удалось загрузить список героев. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!heroesArray || heroesArray.length === 0) {
    return <div className="p-4 text-gray-500">Список героев пуст.</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Зал Героев</h1>
      
      {/* Сетка для карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {heroesArray.map((hero) => (
          <Link 
            href={`/heros/${hero.id}`} // 🎯 Ссылка на страницу конкретного героя
            key={hero.id} 
            className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-blue-500/50 transition-colors duration-300"
          >
            {/* Изображение героя 🖼️ */}
            <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700">
              {hero.image ? (
                <Image 
                  src={hero.image} 
                  alt={hero.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain"
                  priority={false}
                />
              ) : (
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Нет изображения
                </div>
              )}
              
              {/* Бейдж кубика 🎲 */}
              {hero.cubeBonus > 0 && (
                <span className="absolute top-3 left-3 z-10 bg-indigo-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                  🎲 Бонус кубика: +{hero.cubeBonus}
                </span>
              )}
            </div>

            {/* Контентная часть карточки 📝 */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-white mb-2 line-clamp-1">
                {hero.name}
              </h2>
              
              <p className="text-gray-400 text-[16px] mb-4 line-clamp-3 flex-grow">
                {hero.description || 'История этого героя неизвестна...'}
              </p>

              {/* Характеристики (Мини-статы) 📊 */}
              <div className="grid grid-cols-2 gap-2 border-t border-gray-700/50 pt-3 mt-auto text-sm">
                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                  <span className="text-red-400">❤️ HP</span>
                  <span className="font-bold text-white">{hero.hp}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                  <span className="text-blue-400">💧 Mana</span>
                  <span className="font-bold text-white">{hero.mana}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                  <span className="text-amber-400">⚔️ Атака</span>
                  <span className="font-bold text-white">{hero.attack}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                  <span className="text-gray-400">🛡️ Броня</span>
                  <span className="font-bold text-white">{hero.armor}</span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
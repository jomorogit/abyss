import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>; // В Next.js 15+ params — это Promise
}

export default async function ArmorCardPage({ params }: PageProps) {
  // 1. Ждем получения динамического id из URL ⏳
  const { id } = await params;

  // 2. Ищем конкретную броню в базе данных 🗄️
  const armorItem = await prisma.armor.findUnique({
    where: { id: id },
  });

  // 3. Если броня не найдена 🛑
  if (!armorItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-gray-700 shadow-2xl">
          <h1 className="text-6xl font-black text-gray-700 mb-4">404</h1>
          <div className="text-2xl font-bold mb-2">🛡️ Предмет утерян</div>
          <p className="text-gray-400 mb-6">Броня с ID {id} не найдена в базе бездны.</p>
          <Link href="/armors" className="text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-4">
            Вернуться в арсенал
          </Link>
        </div>
      </div>
    );
  }

  // 4. Отрисовка большая страницы предмета ✨
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      {/* Ограничитель ширины для больших экранов */}
      <div className="max-w-6xl mx-auto">
        
        {/* Кнопка "Назад" 🔙 */}
        <Link 
          href="/armors" 
          className="inline-flex items-center text-gray-400 hover:text-amber-400 mb-8 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Вернуться к списку снаряжения
        </Link>

        {/* Главный контейнер предмета */}
        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Левая часть: Огромное изображение 🖼️ */}
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[600px] bg-gray-950/50 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-700">
            
            {/* Бейджи поверх картинки */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
              {armorItem.type && (
                <span className="bg-gray-800/90 text-gray-300 text-sm font-bold px-4 py-2 rounded-lg backdrop-blur-md border border-gray-600 shadow-lg">
                  Тип: {armorItem.type}
                </span>
              )}
              <span className="bg-amber-500/90 text-gray-900 text-xl font-black px-4 py-2 rounded-lg backdrop-blur-md shadow-lg">
                Tier {armorItem.tier}
              </span>
            </div>

            {/* Сама картинка */}
            <div className="relative w-full h-full">
              {armorItem.image ? (
                <Image 
                  src={armorItem.image} 
                  alt={armorItem.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  priority={true} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 uppercase tracking-widest font-bold">
                  <span className="text-4xl mb-2">📷</span>
                  Нет изображения
                </div>
              )}
            </div>
          </div>

          {/* Правая часть: Подробная информация 📝 */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {armorItem.name}
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 leading-relaxed flex-grow">
              {armorItem.description || 'Загадочный элемент экипировки. Описание утеряно в веках...'}
            </p>
            
            {/* Сетка характеристик (Грид) 📊 */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              
              {/* Показатель брони */}
              <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700/50">
                <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">🛡️ Блок урона</div>
                <div className="text-2xl font-black text-white">{armorItem.damageBlock}</div>
              </div>

              {/* Статус дропа */}
              <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700/50">
                <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">🎲 Выпадение</div>
                <div className={`text-xl font-black mt-1 ${armorItem.isDroppable ? 'text-green-400' : 'text-gray-600'}`}>
                  {armorItem.isDroppable ? 'Доступно' : 'Отсутствует'}
                </div>
              </div>

            </div>

            {/* Футер с ценой покупки и продажи */}
            <div className="pt-8 border-t border-gray-700 flex flex-row gap-8 mt-auto">
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Покупка</div>
                <div className="text-3xl lg:text-4xl font-black text-green-400 drop-shadow-md">
                  {armorItem.price_buy === 0 && armorItem.isDroppable ? "Нельзя купить" : armorItem.price_buy + " Silver"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Продажа</div>
                <div className="text-3xl lg:text-4xl font-black text-amber-500 drop-shadow-md">
                  {armorItem.price_sell + " Silver"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image'; 
import Link from 'next/link';

// 🎯 Выводим точный тип одного элемента из возвращаемого массива Prisma для валюты
type MoneyItem = Awaited<ReturnType<typeof prisma.money.findMany>>[number];

export default async function MoneyPage() {
  // 📦 Явно типизируем массив, чтобы map знал структуру каждого объекта ценности
  let moneyArray: MoneyItem[] = [];

  try {
    moneyArray = await prisma.money.findMany({});
  } catch (error) {
    console.error("Ошибка при загрузке валюты:", error);
    return (
      <div className="p-4 text-red-500 font-medium">
        ❌ Не удалось загрузить список валюты. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!moneyArray || moneyArray.length === 0) {
    return <div className="p-4 text-gray-500">Казна пуста. Валюты нет. 🪙</div>;
  }

  return (
    <div className="p-6 sm:p-10 bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8 uppercase tracking-widest">
          Валюта и Ценности 🪙
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {moneyArray.map((item) => (
            <Link 
              href={`/money/${item.id}`} 
              key={item.id} 
              className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-yellow-500/50 transition-all duration-300 group"
            >
              <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700 p-6">
                
                {item.type && (
                  <div className="absolute top-4 left-4 z-30 pointer-events-none">
                    <span className="bg-yellow-900/80 text-yellow-400 text-xs font-black px-3 py-1.5 rounded-md border border-yellow-900/50 shadow-sm uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>
                )}

                <span className="absolute top-4 right-4 z-30 bg-amber-500/90 text-gray-950 text-xl font-bold px-3 py-1.5 rounded-md shadow-sm">
                  Tier {item.tier}
                </span>

                <div className="relative w-full h-full z-10">
                  {item.image ? (
                    <Image 
                      src={item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/${item.image}`} 
                      alt={item.name} 
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                      priority={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-700 text-sm uppercase tracking-widest font-bold">
                      Нет изображения 🖼️
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                  {item.name}
                </h3>
                
                <p className="text-gray-400 text-[16px] mb-4 line-clamp-3 flex-grow">
                  {item.description || 'Описание отсутствует...'}
                </p>

                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">Ценность:</span>
                    <span className="text-base font-black text-yellow-500">
                      {item.value} Silver
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
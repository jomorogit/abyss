import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image'; 
import Link from 'next/link';

// 🎯 Выводим точный тип одного элемента из возвращаемого массива Prisma для сумок
type BagItem = Awaited<ReturnType<typeof prisma.bags.findMany>>[number];

export default async function BagsPage() {
  // 📦 Строго типизируем массив, чтобы map знал все свойства объекта
  let bagsArray: BagItem[] = [];

  try {
    bagsArray = await prisma.bags.findMany({});
  } catch (error) {
    console.error("Ошибка при загрузке сумок:", error);
    return (
      <div className="p-4 text-red-500 font-medium">
        ❌ Не удалось загрузить список сумок. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!bagsArray || bagsArray.length === 0) {
    return <div className="p-4 text-gray-500">Лавка пуста. Сумок в наличии нет.</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Сумки и Рюкзаки</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bagsArray.map((bag) => (
          <Link 
            href={`/bags/${bag.id}`} 
            key={bag.id} 
            className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-blue-500/50 transition-colors duration-300 group"
          >
            <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700">
              {bag.image ? (
                <Image 
                  src={bag.image.startsWith('http') || bag.image.startsWith('/') ? bag.image : `/${bag.image}`} 
                  alt={bag.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                  priority={false}
                />
              ) : (
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Нет изображения
                </div>
              )}
              
              {bag.type && (
                <span className="absolute top-3 left-3 z-10 bg-gray-900/80 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-900/50 shadow-sm uppercase tracking-wider">
                  {bag.type}
                </span>
              )}

              <span className="absolute top-3 right-3 z-10 bg-amber-500/90 text-gray-950 text-xl font-bold px-2.5 py-1 rounded-md shadow-sm">
                Tier {bag.tier}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                {bag.name}
              </h2>
              
              <p className="text-gray-400 text-[16px] mb-4 line-clamp-3 flex-grow">
                {bag.description || 'Надежное хранилище для ваших вещей...'}
              </p>

              <div className="space-y-2 border-t border-gray-700/50 pt-3 mb-4 text-sm">
                <div className="flex justify-between items-center bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800">
                  <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">Вместимость</span>
                  <span className="text-xl font-black text-blue-500">{bag.slots}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-gray-700 pt-3 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm uppercase tracking-widest font-bold">Покупка</span>
                  <span className="text-lg font-extrabold text-green-400 drop-shadow-sm">
                    {bag.price_buy === 0 ? 'Нельзя купить' : bag.price_buy + ' Silver'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm uppercase tracking-widest font-bold">Продажа</span>
                  <span className="text-lg font-extrabold text-amber-500 drop-shadow-sm">
                    {bag.price_sell + ' Silver'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
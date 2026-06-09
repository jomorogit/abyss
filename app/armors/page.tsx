import React from 'react'
import { prisma } from '@/lib/db';
import Image from 'next/image'; 
import Link from 'next/link'; // 🔗 Импортируем компонент для ссылок

export default async function Page() {
  let armorArray = [];

  try {
    armorArray = await prisma.armor.findMany({});
  } catch (error) {
    console.error("Ошибка при загрузке брони:", error);
    return (
      <div className="p-4 text-red-500 font-medium">
        ❌ Не удалось загрузить броню. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!armorArray || armorArray.length === 0) {
    return <div className="p-4 text-gray-500">Список брони пуст.</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Доступное снаряжение</h1>
      
      {/* Сетка для карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {armorArray.map((item) => (
          <Link 
            href={`/armors/${item.id}`} // 🎯 Формируем динамическую ссылку прямо тут
            key={item.id} 
            className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-colors duration-300"
          >
            {/* Изображение брони */}
            <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700">
              {item.image ? (
                <Image 
                  src={item.image} 
                  alt={item.name} 
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
              
              {/* Тип брони (Heavy, Light, Cloth) */}
              {item.type && (
                <span className="absolute top-3 left-3 z-10 bg-gray-900/80 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm border border-gray-700">
                  {item.type}
                </span>
              )}

              {/* Тир/Ранг брони */}
              <span className="absolute top-3 right-3 z-10 bg-amber-500/90 text-gray-950 text-xl font-bold px-2.5 py-1 rounded-md shadow-sm">
                Tier {item.tier}
              </span>
            </div>

            {/* Контентная часть карточки */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-white mb-2 line-clamp-1">
                {item.name}
              </h2>
              
              <p className="text-gray-400 text-[16px] mb-4 line-clamp-3 flex-grow">
                {item.description || 'Описание отсутствует.'}
              </p>

              {/* Характеристики */}
              <div className="space-y-2 border-t border-gray-700/50 pt-3 mb-4 text-xs tracking-wide">
                
               <div className="flex justify-between">
                <div className="text-gray-500 text-xl font-medium mb-1 uppercase tracking-wider">Блок урона</div>
                <div className="text-2xl font-black text-white">{item.damageBlock}</div>
              </div>

                <div className="flex justify-between text-xl text-gray-400">
                  <span>Может выпасть:</span>
                  <span className={item.isDroppable ? 'text-green-400' : 'text-gray-500'}>
                    {item.isDroppable ? 'Да' : 'Нет'}
                  </span>
                </div>
              </div>

              {/* Футер карточки с ценами 💶 */}
              <div className="flex flex-col gap-2 border-t border-gray-700 pt-3 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Покупка:</span>
                  <span className="text-lg font-extrabold text-green-400">
                    {item.price_buy === 0 && item.isDroppable ? 'Нельзя купить' : item.price_buy + ' €'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Продажа:</span>
                  <span className="text-lg font-extrabold text-amber-500">
                    {item.price_sell + ' €'}
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
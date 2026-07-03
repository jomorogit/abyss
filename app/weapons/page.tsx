import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image'; 
import Link from 'next/link';


type WeaponItem = Awaited<ReturnType<typeof prisma.weapon.findMany>>[number];

export default async function WeaponsPage() {
 
  let weaponsArray: WeaponItem[] = [];

  try {
  
    weaponsArray = await prisma.weapon.findMany({});
  } catch (error) {
    console.error("Ошибка при загрузке оружия:", error);
    return (
      <div className="p-4 text-red-500 font-medium">
        ❌ Не удалось открыть оружейную. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!weaponsArray || weaponsArray.length === 0) {
    return <div className="p-4 text-gray-500">Оружейная пуста. Стеллажи покрылись пылью. 🕸️</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Оружейная</h1>
      
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {weaponsArray.map((weapon) => (
          <Link 
            href={`/weapons/${weapon.id}`} 
            key={weapon.id} 
            className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-orange-500/50 transition-colors duration-300 group"
          >
           
            <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700">
              {weapon.image ? (
                <Image 
                  src={weapon.image.startsWith('http') || weapon.image.startsWith('/') ? weapon.image : `/${weapon.image}`} 
                  alt={weapon.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                  priority={false}
                />
              ) : (
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Нет чертежа 📜
                </div>
              )}

              <span className="absolute top-3 right-3 z-10 bg-amber-500/90 text-gray-950 text-xl font-bold px-2.5 py-1 rounded-md shadow-sm">
                Tier {weapon.tier}
              </span>
            </div>

           
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-400 transition-colors">
                {weapon.name}
              </h2>
              
              <p className="text-gray-400 text-[16px] mb-4 line-clamp-3 flex-grow">
                {weapon.description || 'Клинок без истории... 📜'}
              </p>

          
              <div className="space-y-2 border-t border-gray-700/50 pt-3 mb-4 text-sm">
                <div className="flex justify-between items-center bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800">
                  <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">Урон</span>
                  <span className="text-xl font-black text-orange-500">{weapon.damage}</span>
                </div>
                
                <div className="flex justify-between items-center px-1">
                  <span className="text-gray-500 text-xl">Доступно в луте:</span>
                  <span className={weapon.isDroppable ? 'text-green-400 font-bold text-xl' : 'text-gray-600 text-xs'}>
                    {weapon.isDroppable ? 'Да' : 'Только покупка'}
                  </span>
                </div>
              </div>

             
              <div className="flex flex-col gap-2 border-t border-gray-700 pt-3 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Покупка</span>
                  <span className="text-lg font-extrabold text-green-400 drop-shadow-sm">
                    {weapon.price_buy === 0 && weapon.isDroppable ? 'Нельзя купить' : weapon.price_buy + ' Silver'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Продажа</span>
                  <span className="text-lg font-extrabold text-amber-500 drop-shadow-sm">
                    {weapon.price_sell + ' Silver'}
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
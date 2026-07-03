import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';


interface DropItem {
  id: string;
  name: string;
  image: string | null;
  tier: string;
  category: 'Оружие' | 'Броня' | 'Артефакт';
  href: string;
  price_buy: number;
  price_sell: number;
  isDroppable: boolean;
}


type WeaponItem = Awaited<ReturnType<typeof prisma.weapon.findMany>>[number];
type ArmorItem = Awaited<ReturnType<typeof prisma.armor.findMany>>[number];
type ArtifactItem = Awaited<ReturnType<typeof prisma.artifact.findMany>>[number];

export default async function DropPage() {
 
  const [weapons, armors, artifacts] = await Promise.all([
    prisma.weapon.findMany({ where: { isDroppable: true } }) as Promise<WeaponItem[]>,
    prisma.armor.findMany({ where: { isDroppable: true } }) as Promise<ArmorItem[]>,
    prisma.artifact.findMany({ where: { isDroppable: true } }) as Promise<ArtifactItem[]>,
  ]);

 
  const allDrops: DropItem[] = [
    ...weapons.map((w) => ({
      id: w.id,
      name: w.name,
      image: w.image,
      tier: String(w.tier).replace(/\D/g, '') || '1', 
      category: 'Оружие' as const,
      href: `/weapons/${w.id}`,
      price_buy: w.price_buy || 0,
      price_sell: w.price_sell || 0,
      isDroppable: w.isDroppable,
    })),
    ...armors.map((a) => ({
      id: a.id,
      name: a.name,
      image: a.image,
      tier: String(a.tier).replace(/\D/g, '') || '1',
      category: 'Броня' as const,
      href: `/armors/${a.id}`,
      price_buy: a.price_buy || 0,
      price_sell: a.price_sell || 0,
      isDroppable: a.isDroppable,
    })),
    ...artifacts.map((a) => ({
      id: a.id,
      name: a.name,
      image: a.image,
      tier: String(a.tier).replace(/\D/g, '') || '1',
      category: 'Артефакт' as const,
      href: `/artifact/${a.id}`,
      price_buy: a.price_buy || 0,
      price_sell: a.price_sell || 0,
      isDroppable: a.isDroppable,
    })),
  ];


  if (allDrops.length === 0) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-xl">Таблицы добычи пусты. 🛡️</div>
      </div>
    );
  }

 
  const groupedDrops = allDrops.reduce<Record<string, DropItem[]>>((acc, item) => {
    if (!acc[item.tier]) {
      acc[item.tier] = [];
    }
    acc[item.tier].push(item);
    return acc;
  }, {});

 
  const sortedTiers = Object.keys(groupedDrops).sort((a, b) => Number(a) - Number(b));

 
  const getCategoryColor = (category: 'Оружие' | 'Броня' | 'Артефакт') => {
    switch (category) {
      case 'Оружие': return 'bg-orange-900/80 text-orange-400 border-orange-900/50';
      case 'Броня': return 'bg-blue-900/80 text-blue-400 border-blue-900/50';
      case 'Артефакт': return 'bg-purple-900/80 text-purple-400 border-purple-900/50';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-2 uppercase tracking-widest">
          Возможная добыча
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          Список всех предметов, которые можно получить после победы над противниками.
        </p>

        {/* Выводим секции по каждому тиру */}
        {sortedTiers.map((tier) => (
          <div key={tier} className="mb-12">
            
            {/* Заголовок Тира */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-black text-gray-200">
                Tier {tier}
              </h2>
              <div className="h-px bg-gray-700 flex-grow"></div>
            </div>

          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedDrops[tier].map((item) => (
                <Link 
                  href={item.href}
                  key={`${item.category}-${item.id}`}
                  className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-gray-500 transition-all duration-300 group"
                >
                  
                  <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700 p-6">
                    
                   
                    <div className="absolute top-4 left-4 z-30 pointer-events-none">
                      <span className={`text-xs font-black px-3 py-1.5 rounded-md border uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>

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
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-gray-300 transition-colors">
                      {item.name}
                    </h3>
                    
                   
                    <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">Покупка:</span>
                        <span className="text-base font-black text-green-400">
                          {item.price_buy === 0 && item.isDroppable ? 'Нельзя купить' : item.price_buy + ' Silver'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">Продажа:</span>
                        <span className="text-base font-black text-amber-500">
                          {item.price_sell} Silver
                        </span>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
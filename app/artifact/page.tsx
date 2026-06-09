import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image'; 
import Link from 'next/link';

export default async function ArtifactsPage() {
  let artifactsArray = [];

  try {
    // Получаем артефакты из базы
    artifactsArray = await prisma.artifact.findMany({});
  } catch (error) {
    console.error("Ошибка при загрузке артефактов:", error);
    return (
      <div className="p-4 text-red-500 font-medium">
        Не удалось открыть сокровищницу. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!artifactsArray || artifactsArray.length === 0) {
    return <div className="p-4 text-gray-500">Сокровищница пуста. Артефакты еще не найдены.</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Древние Артефакты</h1>
      
      {/* Сетка для карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artifactsArray.map((artifact) => (
          <Link 
            href={`/artifact/${artifact.id}`} 
            key={artifact.id} 
            className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-purple-500/50 transition-colors duration-300 group"
          >
            {/* Изображение артефакта */}
            <div className="relative h-80 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-700">
              
              {/* Мистическое свечение на фоне */}
              <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-600/20 transition-colors duration-500 blur-xl z-0"></div>

              {artifact.image ? (
                <Image 
                  src={artifact.image.startsWith('http') || artifact.image.startsWith('/') ? artifact.image : `/${artifact.image}`} 
                  alt={artifact.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-500 z-10"
                  priority={false}
                />
              ) : (
                <div className="text-gray-600 text-sm uppercase tracking-wider z-10">
                  Скрыто во тьме
                </div>
              )}
              
              {/* Тип артефакта */}
              <span className="absolute top-3 left-3 z-20 bg-gray-900/80 text-purple-400 text-xs font-bold px-2.5 py-1 rounded-md border border-purple-900/50 shadow-sm uppercase tracking-wider">
                 {artifact.type}
              </span>

              {/* Тир артефакта */}
              <span className="absolute top-3 right-3 z-20 bg-fuchsia-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                Tier {artifact.tier}
              </span>
            </div>

            {/* Контентная часть карточки */}
            <div className="p-4 flex flex-col flex-grow z-10 relative">
              <h2 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                {artifact.name}
              </h2>
              
              <p className="text-gray-400 text-[16px] mb-4 line-clamp-3 flex-grow">
                {artifact.description || 'Древняя реликвия, тайны которой еще не раскрыты...'}
              </p>

              {/* Характеристики артефакта */}
              <div className="space-y-2 border-t border-gray-700/50 pt-3 mb-4 text-sm">
                
                {artifact.skillPassive && (
                  <div className="flex justify-between items-center px-1">
                    <span className="text-gray-500 text-xs uppercase">Пассивный эффект:</span>
                    <span className="text-fuchsia-400 font-bold text-xs">Есть</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center px-1">
                  <span className="text-gray-500 text-xs uppercase">Способ получения:</span>
                  <span className={artifact.isDroppable ? 'text-green-400 font-bold text-xs' : 'text-gray-600 text-xs'}>
                    {artifact.isDroppable ? 'Выпадает' : 'Покупка'}
                  </span>
                </div>
              </div>

              {/* Футер карточки с ценами */}
              <div className="flex flex-col gap-2 border-t border-gray-700 pt-3 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Покупка:</span>
                  <span className="text-lg font-extrabold text-green-400">
                    {artifact.price_buy === 0 && artifact.isDroppable ? 'Нельзя купить' : artifact.price_buy + ' Silver'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm uppercase tracking-wider">Продажа:</span>
                  <span className="text-lg font-extrabold text-amber-500">
                    {artifact.price_sell + ' Silver'}
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
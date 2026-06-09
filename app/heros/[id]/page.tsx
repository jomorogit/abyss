import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

// 🎯 Выводим базовые типы сущностей напрямую из методов Prisma (без импорта капризного Prisma)
type BaseHero = Awaited<ReturnType<typeof prisma.hero.findMany>>[number];
type SkillItem = Awaited<ReturnType<typeof prisma.heroSkill.findMany>>[number];

// Склеиваем их вместе, чтобы TypeScript знал структуру вложенного массива skills
type HeroWithSkills = BaseHero & {
  skills: SkillItem[];
};

interface PageProps {
  params: Promise<{ id: string }>; 
}

export default async function HeroCardPage({ params }: PageProps) {
  const { id } = await params;

  // Ищем героя + подтягиваем его уникальные скиллы 🗄️✨
  const heroItem = await prisma.hero.findUnique({
    where: { id: id },
    include: {
      skills: true, // Включаем связанные скиллы героя
    }
  }) as HeroWithSkills | null;

  // Если герой не найден в базе данных 🛑
  if (!heroItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-10 rounded-2xl border border-gray-700 shadow-2xl">
          <h1 className="text-6xl font-black text-gray-700 mb-4">404</h1>
          <div className="text-2xl font-bold mb-2">🦸‍♂️ Герой не найден</div>
          <p className="text-gray-400 mb-6">Персонаж с ID {id} отсутствует в таверне.</p>
          <Link href="/heroes" className="text-blue-500 hover:text-blue-400 transition-colors underline underline-offset-4">
            Вернуться в зал героев
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Кнопка "Назад" 🔙 */}
        <Link 
          href="/heroes" 
          className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-8 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Вернуться к списку героев
        </Link>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Левая часть: Изображение героя 🖼️ */}
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[700px] bg-gray-950/50 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-700">
            <div className="relative w-full h-full">
              {heroItem.image ? (
                <Image 
                  src={heroItem.image} 
                  alt={heroItem.name} 
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

          {/* Правая часть: Подробная информация и характеристики 📝 */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {heroItem.name}
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {heroItem.description || 'История этого героя пока не написана...'}
            </p>
            
            {/* Сетка основных характеристик 📊 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 p-4 rounded-2xl border border-red-900/30 text-center">
                <div className="text-red-500 text-sm font-bold mb-1">❤️ Здоровье</div>
                <div className="text-2xl font-black text-white">{heroItem.hp}</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-2xl border border-blue-900/30 text-center">
                <div className="text-blue-500 text-sm font-bold mb-1">💧 Мана</div>
                <div className="text-2xl font-black text-white">{heroItem.mana}</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-2xl border border-amber-900/30 text-center">
                <div className="text-amber-500 text-sm font-bold mb-1">⚔️ Атака</div>
                <div className="text-2xl font-black text-white">{heroItem.attack}</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-600/30 text-center">
                <div className="text-gray-400 text-sm font-bold mb-1">🛡️ Броня</div>
                <div className="text-2xl font-black text-white">{heroItem.armor}</div>
              </div>
            </div>

            {/* Дополнительные параметры 🎲 */}
            <div className="bg-indigo-900/20 p-5 rounded-2xl border border-indigo-500/30 mb-8 flex justify-between items-center">
              <span className="text-indigo-300 font-medium uppercase tracking-wider">🎲 Бонус броска кубика</span>
              <span className="text-2xl font-black text-indigo-400">+{heroItem.cubeBonus}</span>
            </div>

            {/* Блок уникальных способностей (Skills) ✨ */}
            <div className="mt-auto">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Уникальные способности ✨</h3>
              
              {heroItem.skills && heroItem.skills.length > 0 ? (
                <div className="space-y-3">
                  {/* 🛠️ Железобетонная инлайн-типизация skill: SkillItem для прохождения сборки */}
                  {heroItem.skills.map((skill: SkillItem) => (
                    <div key={skill.id} className="bg-gray-900/80 p-4 rounded-xl border border-gray-700">
                      <div className="font-bold text-amber-400 text-lg">{skill.skillName}</div>
                      {skill.description && (
                        <div className="text-gray-400 text-sm mt-1">{skill.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">Способности пока не изучены...</div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
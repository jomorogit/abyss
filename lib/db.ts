import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// 🎯 Правильное расширение глобального пространства типов для globalThis
declare global {
  // Использование var внутри global позволяет TS автоматически подмешать свойство в globalThis
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

// Защищаем от создания дубликатов подключений при Fast Refresh в Next.js
// Теперь globalThis.prisma валидна сама по себе, без всяких "as any"!
export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
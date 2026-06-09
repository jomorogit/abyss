// 🎯 Импортируем напрямую из сгенерированной папки, минуя капризный кэш TS-окружения!
import { PrismaClient } from "@prisma/client/index"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// 🎯 Расширяем глобальный объект без конфликтов типов
declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

// Защищаем от создания дубликатов подключений при Fast Refresh в Next.js
export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
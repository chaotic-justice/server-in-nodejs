// src/tests/helpers/reset-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
  console.log('resetting db...')
  await prisma.$transaction([
    prisma.post.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ])
}

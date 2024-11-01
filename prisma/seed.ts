import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  await prisma.post.deleteMany()

  console.log('Seeding...')

  const user1 = await prisma.user.create({
    data: {
      email: 'lisa@simpson.com',
      name: 'Lisa Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'USER',
      posts: {
        create: {
          title: 'Join us for Prisma Day 2019 in Hakuba',
          content: 'https://www.prisma.io/day/',
          published: true,
        },
      },
    },
  })
  const user2 = await prisma.user.create({
    data: {
      email: 'bart@simpson.com',
      name: 'Bart Simpson',
      role: 'ADMIN',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      posts: {
        create: [
          {
            title: 'Subscribe to GraphQL Weekly for community news',
            content: 'https://graphqlweekly.com/',
            published: true,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: false,
          },
        ],
      },
    },
  })

  console.log({ user1, user2 })

  const count = await prisma.user.count()
  console.log('user count', count)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

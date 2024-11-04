import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'nestjs-prisma'
import { AppModule } from 'src/app.module'
import request from 'supertest'
import { vi } from 'vitest'

describe('/auth', async () => {
  let app: INestApplication
  let prismaService: PrismaService
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, JwtService],
    }).compile()

    app = moduleFixture.createNestApplication()
    prismaService = moduleFixture.get<PrismaService>(PrismaService)
    jwtService = moduleFixture.get<JwtService>(JwtService)
    await app.init()
  })

  describe('[POST] /auth/signup', () => {
    const data = {
      email: 'test@yah.com',
      name: 'testusername',
      password: 'testpassword',
    }
    const signupMutationString = `
          mutation Mutation($data: SignupInput!) {
            signup(data: $data) {
              accessToken
              refreshToken
              user {
                id
                name
              }
            }
          }
        `

    it('should respond with a `200` status code and user details', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signupMutationString,
          variables: {
            data,
          },
        })
      const {
        data: {
          signup: { user },
        },
      } = body
      expect(status).toBe(200)
      expect(body.data.signup).toHaveProperty('accessToken')
      expect(body.data.signup).toHaveProperty('refreshToken')
      const newUser = await prismaService.user.findFirst()
      expect(newUser).not.toBeNull()
      expect(user).toEqual({
        name: 'testusername',
        id: newUser?.id,
      })
    })

    it('missing email param should throw an error', async () => {
      const data = {
        name: 'testusername',
        password: 'testpassword',
      }
      const { status, body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signupMutationString,
          variables: {
            data,
          },
        })
      expect(status).toBe(200)
      const error = body.errors[0]
      expect(error).not.toBeNull()
    })

    it('user should not be created if a user exists with the provided username', async () => {
      const data = {
        email: 'test@yah.com',
        name: 'testusername',
        password: 'testpassword',
      }
      await request(app.getHttpServer()).post('/graphql').send({
        query: signupMutationString,
        variables: {
          data,
        },
      })
      const { status } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signupMutationString,
          variables: {
            data,
          },
        })
      expect(status).toBe(200)
      const count = await prismaService.user.count()
      expect(count).toBe(1)
    })
  })
})

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'nestjs-prisma'
import { AppModule } from 'src/app.module'
import request from 'supertest'
import { vi } from 'vitest'

describe('jwt tokens should be valid', async () => {
  let app: INestApplication
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, JwtService],
    }).compile()

    app = moduleFixture.createNestApplication()
    jwtService = moduleFixture.get(JwtService)
    await app.init()
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  const signupInput = {
    data: {
      email: 'me-test@yah.com',
      name: 'me-test',
      password: 'testpassword',
    },
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

  it('me Query should fail after token expires', async () => {
    vi.useFakeTimers()
    const {
      body: {
        data: {
          signup: { accessToken, refreshToken },
        },
      },
    } = await request(app.getHttpServer()).post('/graphql').send({
      query: signupMutationString,
      variables: signupInput,
    })

    vi.advanceTimersByTime(1200000)

    try {
      jwtService.verify(accessToken)
    } catch (error) {
      expect(error).not.toBeNull()
    }
  })

  it('me Query should run', async () => {
    const {
      body: {
        data: {
          signup: { accessToken, refreshToken },
        },
      },
    } = await request(app.getHttpServer()).post('/graphql').send({
      query: signupMutationString,
      variables: signupInput,
    })

    const {
      body: {
        data: { me },
      },
    } = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
        query Query {
          me {
            name
            email
            role
          }
        }
      `,
      })
    expect(me).toEqual({
      name: 'me-test',
      email: 'me-test@yah.com',
      role: 'USER',
    })
  })
})

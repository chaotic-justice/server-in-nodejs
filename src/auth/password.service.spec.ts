import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { PasswordService } from './password.service'
import { compare } from 'bcrypt'
import { PrismaService } from 'nestjs-prisma'

jest.mock('bcrypt') // Mock the bcrypt module

describe('PasswordService', () => {
  let service: PasswordService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService, PrismaService, ConfigService],
    }).compile()

    service = module.get<PasswordService>(PasswordService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validatePassword', () => {
    it('should return true if password is valid', async () => {
      const password = 'myPassword'
      const hashedPassword = 'hashedPassword'

      // Mock the compare function to return true
      ;(compare as jest.Mock).mockResolvedValue(true)

      const result = await service.validatePassword(password, hashedPassword)
      expect(result).toBe(true)
      expect(compare).toHaveBeenCalledWith(password, hashedPassword)
    })

    it('should return false if password is invalid', async () => {
      const password = 'myPassword'
      const hashedPassword = 'hashedPassword'

      // Mock the compare function to return false
      ;(compare as jest.Mock).mockResolvedValue(false)

      const result = await service.validatePassword(password, hashedPassword)
      expect(result).toBe(false)
      expect(compare).toHaveBeenCalledWith(password, hashedPassword)
    })
  })
})

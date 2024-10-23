import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello jovanno??'
  }

  getHelloName(name: string): string {
    console.log('name', name)
    return `back to florence, ${name}!`
  }
}

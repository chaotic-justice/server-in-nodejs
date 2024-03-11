import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }

  getHelloName(name: string): string {
    console.log('name', name)
    return `goto florence, ${name}!`
  }
}

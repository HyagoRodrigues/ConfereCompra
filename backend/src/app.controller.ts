import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'API ConfereCompra está funcionando!',
      version: '1.0.0',
    };
  }
}

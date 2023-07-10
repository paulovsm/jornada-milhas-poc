import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitando CORS
  app.enableCors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();

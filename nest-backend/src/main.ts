import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { corsConfig } from './config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors(corsConfig);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

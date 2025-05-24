import { ConfigModule } from '@nestjs/config';

import { validate } from './env.validation';
export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  validate,
  load: [
    () => ({
      DB_CONNECTION: process.env.DB_CONNECTION,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_SSL: process.env.DB_SSL,
    }),
  ],
});

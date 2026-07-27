import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'flowpay_user',
  password: process.env.DB_PASSWORD || 'flowpay_password',
  database: process.env.DB_NAME || 'flowpay_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-sync DB schema in dev
  logging: process.env.NODE_ENV === 'development',
});

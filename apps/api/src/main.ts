import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Pipes & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configure Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('FlowPay Banking & Payments API Engine')
    .setDescription(
      'Production-Grade AI-Powered Distributed Banking, Double-Entry Accounting Ledger, Concurrency Protection & Real-time Fraud Engine',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Access Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health & Monitoring', 'System status and operational readiness')
    .addTag('Auth & Identity', 'JWT Access/Refresh tokens, Argon2id security & RBAC')
    .addTag('Ledger Engine', 'Immutable double-entry accounting journals and balances')
    .addTag('Payments & Wallet', 'P2P transfers, idempotency shields & concurrency protection')
    .addTag('AI & Fraud Intelligence', 'Gemini risk scoring and automated transaction advice')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 FlowPay API Engine running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Interactive OpenAPI Specs available on: http://localhost:${port}/api/docs`);
}

bootstrap();

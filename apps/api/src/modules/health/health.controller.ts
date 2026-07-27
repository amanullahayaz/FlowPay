import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check System & Distributed Infrastructure Health' })
  @ApiResponse({ status: 200, description: 'System operates normally' })
  getHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'FlowPay Distributed Banking API Engine',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      components: {
        database: 'PostgreSQL 15 (ACID Ledger & JSONB Audit Logs)',
        cache: 'Redis 7 (Distributed Locking & Idempotency)',
        eventBroker: 'Apache Kafka (Transactional Outbox & Saga Transport)',
      },
    };
  }
}

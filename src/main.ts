import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({
    origin: true,
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalGuards(new (AuthGuard('jwt'))());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)
  
  await app.listen(3001);
}
bootstrap();

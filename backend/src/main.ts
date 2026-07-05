import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { AppDataSource } from "./data-source";
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  if (process.env.NODE_ENV === 'production' && process.env.TYPEORM_SYNC === 'true') {
    console.warn(
      '[WARN] TYPEORM_SYNC=true en production : le schéma de la base peut être modifié ' +
      'automatiquement au démarrage. Utilisez des migrations TypeORM et passez ' +
      'TYPEORM_SYNC=false avant un vrai déploiement.'
    );
  }

  await AppDataSource.initialize();
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  // En l'absence de CORS_ORIGIN explicite, on retombe sur l'URL du frontend
  // en dev plutôt que d'autoriser toutes les origines (`true`), ce qui serait
  // dangereux si la variable est oubliée en production.
  if (!process.env.CORS_ORIGIN) {
    console.warn('[WARN] CORS_ORIGIN non défini, repli sur http://localhost:5173 (dev uniquement).');
  }
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' });

  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  });
  app.use(limiter);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('FinanceFlow API')
    .setDescription('API backend for FinanceFlow')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}

bootstrap();

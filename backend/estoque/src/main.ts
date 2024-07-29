import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { dataSource } from './database/orm-cli-config';

async function bootstrap() {
  await dataSource.initialize();
  await dataSource.runMigrations();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validationError: { target: false },
      exceptionFactory: (validationErrors = []) => {
        const errors = validationErrors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));

        const firstError =
          errors.length > 0
            ? Object.values(errors[0].constraints)[0]
            : 'Validation failed';

        return new BadRequestException({
          message: firstError,
          errors: errors,
        });
      },
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Estoque')
    .setDescription('Estoque API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

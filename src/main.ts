import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.error(errors);
        return new BadRequestException(errors);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Flight API')
    .setDescription('The Flight API Swagger Documentation')
    .setVersion(process.env.APP_VERSION)
    .addServer('http://localhost:3000', 'Local')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

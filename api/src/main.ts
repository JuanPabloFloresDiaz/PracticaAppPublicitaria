import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Eliminar propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Se genera un error si se envían propiedades adicionales
    transform: true, // Transformar los parámetros de cadena a sus tipos correctos
  }));

  // Habilitar CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

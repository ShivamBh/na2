import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

if (process.env.NODE_ENV == 'test') {
  console.log('----------TESTING IN PROCESS-----------');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('ECom Nest w/Testing')
    .setDescription('Ecom Test Api Docs')
    .setVersion('1.0')
    .addTag('ecommerce test')
    .setBasePath('api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  // app.setGlobalPrefix('/v1/api');
  await app.listen(3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { ProductModule } from './product/product.module';

let connectionString: string = '';

if (process.env.NODE_ENV == 'test') {
  connectionString = process.env.MONGO_URI_TEST;
} else {
  connectionString = process.env.MONGO_URI;
}

@Module({
  imports: [
    MongooseModule.forRoot(connectionString),
    SharedModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

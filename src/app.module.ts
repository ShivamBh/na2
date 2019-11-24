import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';

const connectionString = process.env.MONGO_URI;

@Module({
  imports: [MongooseModule.forRoot(connectionString), SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

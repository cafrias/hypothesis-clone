import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from './constants';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot(MONGO_URI), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './Users/users.module';
import { WorkspaceModule } from './Workspace/workspace.module';
import { ContactsModule } from './Contacts/contacts.module';
import { MessageModule } from './Message/message.module';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './Campaign/campaign.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './Shared/cache/cache.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: "localhost",
        port: 6379,
        ttl: 60
      }),
      isGlobal: true
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    WorkspaceModule,
    UsersModule,
    ContactsModule,
    MessageModule,
    CampaignModule,
    MongooseModule.forRoot(`${process.env.MONGO_URI}`)
  ],
  controllers: [],
  providers: [CacheService],
})
export class AppModule { }

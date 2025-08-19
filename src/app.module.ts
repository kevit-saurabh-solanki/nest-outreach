import { Module } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './Users/users.module';
import { WorkspaceModule } from './Workspace/workspace.module';
import { ContactsModule } from './Contacts/contacts.module';
import { MessageModule } from './Message/message.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    UsersModule,
    WorkspaceModule,
    ContactsModule,
    MessageModule,
    MongooseModule.forRoot(`mongodb+srv://saurabhsolanki:${process.env.MONGO_PASS}@cluster0.x0iofqd.mongodb.net/nestOutreach?retryWrites=true&w=majority&appName=Cluster0`)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

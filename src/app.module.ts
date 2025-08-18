import { Module } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './Users/users.module';
import { WorkspaceModule } from './Workspace/workspace.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    WorkspaceModule,
    MongooseModule.forRoot("mongodb+srv://saurabhsolanki:ldmCrql1x1TbWJ3C@cluster0.x0iofqd.mongodb.net/nestOutreach?retryWrites=true&w=majority&appName=Cluster0")
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

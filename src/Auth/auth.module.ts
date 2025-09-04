import  { Module } from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthControl } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema, UsersSchema } from 'src/Users/users.schema';
import { AuthGuard } from './auth.guard';
import { UserGuard } from './user.guard';
import { AdminGuard } from './admin.guard';

@Module({
    imports: [JwtModule.register({
        secret: process.env.JWT_KEY,
        signOptions: { expiresIn: "1h" }
    }),
    MongooseModule.forFeature([
        {
            name: UsersSchema.name,
            schema: usersSchema
        }
    ])],
    controllers: [AuthControl],
    providers: [AuthService, AuthGuard, UserGuard, AdminGuard],
    exports: [JwtModule]
})
export class AuthModule {}
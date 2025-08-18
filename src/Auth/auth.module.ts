import  { Module } from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthControl } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema, UsersSchema } from 'src/Users/users.schema';

@Module({
    imports: [JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: "1h" }
    }),
    MongooseModule.forFeature([
        {
            name: UsersSchema.name,
            schema: usersSchema
        }
    ])],
    controllers: [AuthControl],
    providers: [AuthService]
})
export class AuthModule {}
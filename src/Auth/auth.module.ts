import  { Module } from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthControl } from './auth.controller';

@Module({
    imports: [],
    controllers: [AuthControl],
    providers: [AuthService]
})
export class AuthModule {}
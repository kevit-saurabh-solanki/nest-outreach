import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { usersSchema, UsersSchema } from "./users.schema";
import { UsersControl } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: UsersSchema.name,
                schema: usersSchema
            }
        ])
    ],
    controllers: [UsersControl],
    providers: [UsersService]
})
export class UsersModule {}
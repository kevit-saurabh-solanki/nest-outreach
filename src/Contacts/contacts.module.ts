import { Module } from "@nestjs/common";
import { ContactsControl } from "./contacts.controller";
import { ContactsService } from "./contacts.service";
import { MongooseModule } from "@nestjs/mongoose";
import { contactsSchema, ContactsSchema } from "./contacts.schema";
import { usersSchema, UsersSchema } from "src/Users/users.schema";
import { workspaceSchema, WorkspaceSchema } from "src/Workspace/workspace.schema";
import { AuthModule } from "src/Auth/auth.module";
import { CacheService } from "src/Shared/cache/cache.service";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: ContactsSchema.name,
            schema: contactsSchema
        },
        {
            name: UsersSchema.name,
            schema: usersSchema
        },
        {
            name: WorkspaceSchema.name,
            schema: workspaceSchema
        }
    ]),
        AuthModule],
    controllers: [ContactsControl],
    providers: [ContactsService, CacheService]
})
export class ContactsModule { }
import { Module } from "@nestjs/common";
import { ContactsControl } from "./contacts.controller";
import { ContactsService } from "./contacts.service";
import { MongooseModule } from "@nestjs/mongoose";
import { contactsSchema, ContactsSchema } from "./contacts.schema";
import { usersSchema, UsersSchema } from "src/Users/users.schema";
import { workspaceSchema, WorkspaceSchema } from "src/Workspace/workspace.schema";
import { JwtModule } from "@nestjs/jwt";

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
    JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: "1h" }
    })],
    controllers: [ContactsControl],
    providers: [ContactsService]
})
export class ContactsModule { }
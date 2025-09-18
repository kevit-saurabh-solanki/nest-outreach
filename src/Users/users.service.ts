import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersSchema } from "./users.schema";
import mongoose, { Model, Types } from "mongoose";
import { updateUserDto, UsersDto } from "./users.dto";
import * as bcrypt from "bcrypt";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";

@Injectable()
export class UsersService {
    constructor(@InjectModel(UsersSchema.name) private usersModel: Model<UsersSchema>, @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>) { }

    //Add users-----------------------------------------------------------------------
    async addUser({ email, password, workspaceId, ...userData }: UsersDto) {
        try {
            const existingUser = await this.usersModel.findOne({ email: email }).exec();

            if (existingUser && existingUser.workspaceId) {
                if (existingUser.workspaceId.includes(workspaceId)) {
                    throw new ConflictException('User already exist in the workspace');
                }

                existingUser.workspaceId.push(workspaceId);
                return await existingUser.save();
            }

            // 4. If user does not exist at all → create new one
            const hashedPass = await bcrypt.hash(password, 10);
            const newUser = new this.usersModel({
                email,
                password: hashedPass,
                workspaceId: [workspaceId], // wrap in array since schema is array
                ...userData,
            });

            return await newUser.save();
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //Get all users------------------------------------------------------------------
    async getAllUsers() {
        try {
            const allUsers = await this.usersModel.find({}, { _id: 1, email: 1, role: 1, workspaceId: 1 }).exec();
            return allUsers;
        }
        catch (err) {
            console.log(err);
            return err; //500
        }
    }

    //Get users by id----------------------------------------------------------------
    async getUserById(userId: mongoose.Schema.Types.ObjectId) {
        try {
            const findUser = await this.usersModel.findOne({ _id: userId }, { _id: 1, email: 1, role: 1, workspaceId: 1 }).populate('workspaceId', 'name').exec();
            if (!findUser) throw new NotFoundException("User not found");
            return findUser;
        }
        catch (err) {
            console.log(err);
            return err; //500
        }
    }

    //delete a user-----------------------------------------------------------------
    async deleteUser(userId: mongoose.Types.ObjectId, workspaceId: mongoose.Types.ObjectId) {
        const user = await this.usersModel.findById(userId).exec();
        if (!user) throw new NotFoundException("User not found");

        if (user.workspaceId) {
            user.workspaceId = user.workspaceId.filter(
                id => id.toString() !== workspaceId.toString()
            );

            if (user.workspaceId.length === 0) {
                await this.usersModel.findByIdAndDelete(userId).exec();
                return { message: "User deleted completely" };
            }
        }

        await user.save();
        return { message: "User removed from workspace", user };
    }


    //edit a user---------------------------------------------------------------------
    async editUser(userId: mongoose.Schema.Types.ObjectId, { password, workspaceId, ...updateUserDto }: updateUserDto) {
        try {
            // If password is provided, hash & update
            if (password) {
                const editHashedPass = await bcrypt.hash(password, 10);
                await this.usersModel.findOneAndUpdate(
                    { _id: userId },
                    { password: editHashedPass },
                    { returnDocument: 'after' }
                ).exec();
            }

            // Update remaining fields
            const editedUser = await this.usersModel.findOneAndUpdate(
                { _id: userId },
                { ...updateUserDto },
                { returnDocument: 'after' }
            ).exec();

            if (!editedUser) throw new NotFoundException('User not found');

            return editedUser;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getUsersByWorkspaceId(workspaceId: string) {
        const users = await this.usersModel.find({ workspaceId: { $in: [workspaceId] } }, { password: 0, updatedAt: 0, createdAt: 0 }).exec();
        return users;
    }

}
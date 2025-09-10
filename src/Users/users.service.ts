import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersSchema } from "./users.schema";
import mongoose, { Model } from "mongoose";
import { updateUserDto, UsersDto } from "./users.dto";
import * as bcrypt from "bcrypt";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";

@Injectable()
export class UsersService {
    constructor(@InjectModel(UsersSchema.name) private usersModel: Model<UsersSchema>, @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>) { }

    //Add users-----------------------------------------------------------------------
    async addUser({ password, ...userData }: UsersDto) {
        try {
            // const foundWorkspace = await this.workspaceModel.findById(userData.workspaceId).exec();
            // if (!foundWorkspace) throw new NotFoundException("workspace not found");
            const hashedPass = await bcrypt.hash(password, 10);
            const newUser = new this.usersModel({ password: hashedPass, ...userData });
            return newUser.save();
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
    async deleteUser(userId: mongoose.Schema.Types.ObjectId) {
        try {
            const deletedUser = await this.usersModel.findOneAndDelete({ _id: userId }, { returnDocument: "after" }).exec()
            if (!deletedUser) throw new NotFoundException("User not found");
            return deletedUser;
        }
        catch (err) {
            console.log(err);
            return err; //500
        }
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

            // If workspaceId is provided, push it into array
            if (workspaceId) {
                await this.usersModel.findOneAndUpdate(
                    { _id: userId },
                    { $push: { workspaceId: workspaceId } },
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

}
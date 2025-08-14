import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersSchema } from "./users.schema";
import mongoose, { Model } from "mongoose";
import { updateUserDto, UsersDto } from "./users.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(@InjectModel(UsersSchema.name) private usersModel: Model<UsersSchema>) { }

    //Add users-----------------------------------------------------------------------
    async addUser({ password, ...userData }: UsersDto) {
        try {
            const foundUser = await this.usersModel.findOne({ $and: [{ email: userData.email }, { workspaceId: userData.workspaceId }] }).exec();
            if (foundUser) throw new ConflictException; //409
            bcrypt.hash(password, 10, async (e, hashedPass) => {
                if (e) {
                    console.log(e);
                    throw new InternalServerErrorException;
                }
                else {
                    const newUser = new this.usersModel({ password: hashedPass, ...userData });
                    const savedUser = await newUser.save();
                    const { isAdmin, ...savedUserDto } = savedUser;
                    return { ...savedUserDto };
                }
            })
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException; //500
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
            throw new InternalServerErrorException; //500
        }
    }

    //Get users by id----------------------------------------------------------------
    async getUserById(userId: mongoose.Schema.Types.ObjectId) {
        try {
            const findUser = await this.usersModel.findOne({ _id: userId }, { _id: 1, email: 1, role: 1, workspaceId: 1 }).exec();
            if (!findUser) throw new NotFoundException;
            return findUser;
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException; //500
        }
    }

    //delete a user-----------------------------------------------------------------
    async deleteUser(userId: mongoose.Schema.Types.ObjectId) {
        try {
            const deletedUser = await this.usersModel.findOneAndDelete({ _id: userId }, { returnDocument: "after" }).exec()
            if (!deletedUser) throw new NotFoundException;
            return { deleted_userId: deletedUser._id, deleted_email: deletedUser.email, deleted_role: deletedUser.role, deleted_workspaceId: deletedUser.workspaceId };
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException; //500
        }
    }

    //edit a user---------------------------------------------------------------------
    async editUser(userId: mongoose.Schema.Types.ObjectId, updateUserDto: updateUserDto) {
        try {
            const editedUser = await this.usersModel.findOneAndUpdate({ _id: userId }, { updateUserDto }, { returnDocument: "after" }).exec();
            if (!editedUser) throw new NotFoundException;
            return { edit_userId: editedUser._id, edit_email: editedUser.email, edit_role: editedUser.role, edit_workspaceId: editedUser.workspaceId };
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException; //500
        }
    }

}
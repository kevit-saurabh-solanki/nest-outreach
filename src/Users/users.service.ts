import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
    async addUser({ password, ...userData }: UsersDto, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const foundUser = await this.usersModel.findOne({ $and: [{ email: userData.email }, { workspaceId: userData.workspaceId }] }).exec();
            if (foundUser) throw new ConflictException("user already exist in the specified workspace"); //409
            const { workspaceId } = userData;
            const foundWorkspace = await this.workspaceModel.findById(workspaceId).exec();
            if (!foundWorkspace) throw new NotFoundException("workspace not found");
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
    async getAllUsers(req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const allUsers = await this.usersModel.find({}, { _id: 1, email: 1, role: 1, workspaceId: 1 }).exec();
            return allUsers;
        }
        catch (err) {
            console.log(err);
            return err; //500
        }
    }

    //Get users by id----------------------------------------------------------------
    async getUserById(userId: mongoose.Schema.Types.ObjectId, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const findUser = await this.usersModel.findOne({ _id: userId }, { _id: 1, email: 1, role: 1, workspaceId: 1 }).populate("workspaceId").exec();
            if (!findUser) throw new NotFoundException("User not found");
            return findUser;
        }
        catch (err) {
            console.log(err);
            return err; //500
        }
    }

    //delete a user-----------------------------------------------------------------
    async deleteUser(userId: mongoose.Schema.Types.ObjectId, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const deletedUser = await this.usersModel.findOneAndDelete({ _id: userId }, { returnDocument: "after" }).exec()
            if (!deletedUser) throw new NotFoundException("User not found");
            return { deleted_userId: deletedUser._id, deleted_email: deletedUser.email, deleted_role: deletedUser.role, deleted_workspaceId: deletedUser.workspaceId };
        }
        catch (err) {
            console.log(err);
            return err; //500
        }
    }

    //edit a user---------------------------------------------------------------------
    async editUser(userId: mongoose.Schema.Types.ObjectId, { password , ...updateUserDto }: updateUserDto, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            if (password) {
                const editHashedPass = await bcrypt.hash(password, 10);
                const editedUser = await this.usersModel.findOneAndUpdate({ _id: userId }, { password: editHashedPass }, { returnDocument: "after" }).exec();
                if (!editedUser) throw new NotFoundException("User not found");
            }
            const editedUser = await this.usersModel.findOneAndUpdate({_id: userId}, { ...updateUserDto }, { returnDocument: "after" }).exec();
            return editedUser;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

}
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { WorkspaceSchema } from "./workspace.schema";
import { Model } from "mongoose";
import { UpdateWorkspaceDto, WorkspaceDto } from "./workspace.dto";

@Injectable()
export class WorkspaceService {
    constructor(@InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>) { }

    //Create workspace--------------------------------------------------------------
    async createWorkspace(workspaceDto: WorkspaceDto, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const findWorkspace = await this.workspaceModel.findOne({ _id: workspaceDto._id }).exec();
            if (findWorkspace) throw new ConflictException;
            const newWorkspace = new this.workspaceModel(workspaceDto);
            const savedWorkspace = await newWorkspace.save();
            return savedWorkspace;
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException;
        }
    }

    //get all workspace--------------------------------------------------------------
    async getAllWorkspace(req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const allWorkspace = await this.workspaceModel.find({}, { createdAt: 0 }).exec();
            return allWorkspace;
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException;
        }
    }

    //get workspace by Id------------------------------------------------------------
    async getWorkspaceById(workspaceId: number, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const findWorkspace = await this.workspaceModel.findOne({ _id: workspaceId }, { createdAt: 0 }).exec();
            if (!findWorkspace) throw new NotFoundException
            return findWorkspace;
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException;
        }
    }

    //delete a workspace by Id-------------------------------------------------------
    async deleteWorkspaceById(workspaceId: number, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const deleteWorkspace = await this.workspaceModel.findOneAndDelete({ _id: workspaceId }, { returnDocument: "after" }).exec();
            if (!deleteWorkspace) throw new NotFoundException;
            return deleteWorkspace;
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException;
        }
    }

    //edit a workspace by Id---------------------------------------------------------
    async editWorkspaceById(workspaceId: number, updateWorkspaceDto: UpdateWorkspaceDto, req: any) {
        try {
            const isAdmin = req.users.isAdmin;
            if (!isAdmin) throw new UnauthorizedException;
            const editWorkspace = await this.workspaceModel.findOneAndUpdate({ _id: workspaceId }, { updateWorkspaceDto }, { returnDocument: "after" }).exec();
            if (!editWorkspace) throw new NotFoundException;
            return editWorkspace;
        }
        catch (err) {
            console.log(err);
            throw new InternalServerErrorException;
        }
    }
}
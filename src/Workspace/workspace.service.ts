import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { WorkspaceSchema } from "./workspace.schema";
import { Model } from "mongoose";
import { UpdateWorkspaceDto, WorkspaceDto } from "./workspace.dto";

@Injectable()
export class WorkspaceService {
    constructor(@InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>) { }

    //Create workspace--------------------------------------------------------------
    async createWorkspace(workspaceDto: WorkspaceDto) {
        try {
            const newWorkspace = new this.workspaceModel(workspaceDto);
            const savedWorkspace = await newWorkspace.save();
            return savedWorkspace;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //get all workspace--------------------------------------------------------------
    async getAllWorkspace(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const worksapces = await this.workspaceModel.find()
            .skip(skip)
            .limit(limit)
            .exec()

        const total = await this.workspaceModel.countDocuments();

        return {
            data: worksapces,
            page,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }

    //get workspace by Id------------------------------------------------------------
    async getWorkspaceById(workspaceId: string) {
        try {
            const findWorkspace = await this.workspaceModel.findOne({ _id: workspaceId }).exec();
            if (!findWorkspace) throw new NotFoundException("workspace not found");
            return findWorkspace;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //delete a workspace by Id-------------------------------------------------------
    async deleteWorkspaceById(workspaceId: string) {
        try {
            const deleteWorkspace = await this.workspaceModel.findOneAndDelete({ _id: workspaceId }, { returnDocument: "after" }).exec();
            if (!deleteWorkspace) throw new NotFoundException("workspace not found");
            return deleteWorkspace;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //edit a workspace by Id---------------------------------------------------------
    async editWorkspaceById(workspaceId: string, { ...updateWorkspaceDto }: UpdateWorkspaceDto) {
        try {
            const editWorkspace = await this.workspaceModel.findOneAndUpdate({ _id: workspaceId }, { ...updateWorkspaceDto }, { returnDocument: "after" }).exec();
            if (!editWorkspace) throw new NotFoundException("workspace not found");
            return editWorkspace;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
}
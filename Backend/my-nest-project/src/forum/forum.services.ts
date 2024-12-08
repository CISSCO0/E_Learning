import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument } from './models/forums.schema';

@Injectable()
export class ForumService {
  constructor(@InjectModel(Forum.name) private forumModel: Model<ForumDocument>) {}

  async getAllForums() {
    return this.forumModel.find().exec();
  }

  async getForumById(id: string) {
    return this.forumModel.findById(id).exec();
  }

  async createForum(data: any) {
    return this.forumModel.create(data);
  }

  async updateForum(id: string, updateData: any) {
    return this.forumModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteForum(id: string) {
    const forum = await this.forumModel.findById(id).exec();
    if (!forum) throw new Error('Forum not found');
    await this.forumModel.findByIdAndDelete(id).exec();
    return { message: 'Forum and associated threads deleted successfully.' };
  }
}

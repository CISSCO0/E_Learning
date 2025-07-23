import { Injectable , NotFoundException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum} from './models/forums.schema';
import { CreateForumDto } from './dto/createForum.dto';
import { UpdateforumDto } from './dto/update.dto';
@Injectable()
export class ForumService {
  constructor(@InjectModel(Forum.name) private forumModel: Model<Forum>) {}

  async getAllForums() {
    return this.forumModel.find().exec();
  }

  async getForumById(id: string) {
    return this.forumModel.findById(id).exec();
  }

  async getForumByCourse(courseId: string): Promise<Forum> {
         const forum = await this.forumModel.findOne({ courseId }).populate('threads').exec();
         if (!forum) throw new NotFoundException(`Forum for course ID ${courseId} not found`);
         return forum;
  }
  

  async createForum(data: CreateForumDto) {
    return this.forumModel.create(data);
  }


  async updateForum(id: string, updateData:UpdateforumDto) {
    return this.forumModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteForum(id: string) {
    const forum = await this.forumModel.findById(id).exec();
    if (!forum) throw new Error('Forum not found');
    await this.forumModel.findByIdAndDelete(id).exec();
    return { message: 'Forum and associated threads deleted successfully.' };
  }

  //deletes all forums realted to one course id 
  async delete(courseId: string): Promise<void> {
    // Find the forum associated with the course
    const forum = await this.forumModel.find({ courseId: courseId });
  
    if (!forum) {
      throw new BadRequestException(`Cannot delete course with ID ${courseId} because no forum exists.`);
    }
  
    // Delete the forum without deleting the associated threads
    await this.forumModel.deleteMany({ courseId: courseId });
    console.log(`Forum with courseId ${courseId} deleted`);
  }
  
}

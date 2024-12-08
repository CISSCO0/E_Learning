import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum } from './models/forum.schema';
import { Thread } from '../Threads/models/Thread.schema';
import { CreateThreadDto } from 'src/Threads/dto/create-thread.dto';

@Injectable()
export class ForumService {
  deleteForum(id: string): void | PromiseLike<void> {
    throw new Error('Method not implemented.');
  }
  findById(forumId: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Forum.name) private forumModel: Model<Forum>,
    @InjectModel(Thread.name) private threadModel: Model<Thread>,
    @InjectModel(Forum.name) private forumModell: Model<Forum>
  ) {}


  async addThreadToForum(forumId: string, threadTitle: string): Promise<Forum> {
    // Create a new thread
    const newThread = new this.threadModel({ title: threadTitle, messages: [] });
    await newThread.save();

    // Add the thread to the forum's threads array
    return this.forumModel.findByIdAndUpdate(
      forumId,
      { $push: { threads: newThread._id } },
      { new: true },
    );
  }


  async deleteThreadFromForum(forumId: string, threadId: string): Promise<Forum> {
    // Remove the thread document
    await this.threadModel.findByIdAndDelete(threadId);

    // Remove the thread ID from the forum's threads array
    return this.forumModel.findByIdAndUpdate(
      forumId,
      { $pull: { threads: threadId } },
      { new: true },
    );
  }

  // async updateThread(threadId: string, updatedData: Partial<Thread>): Promise<Thread> {
  //   return this.threadModel.findByIdAndUpdate(threadId, updatedData, { new: true });
  // }
  async createForum(courseId: string, instructorId: string): Promise<Forum> {
    const newForum = new this.forumModel({ courseId, instructorId, threads: [] });
    return newForum.save();
  }

  async getForumByCourse(courseId: string): Promise<Forum> {
    const forum = await this.forumModel.findOne({ courseId }).populate('threads').exec();
    if (!forum) throw new NotFoundException(`Forum for course ID ${courseId} not found`);
    return forum;
  }

  // async deleteForum(id: string): Promise<void> {
  //   const result = await this.forumModel.findByIdAndDelete(id).exec();
  //   if (!result) throw new NotFoundException(`Forum with ID ${id} not found`);
  // }


  async getThreads(courseId: string) {
    return await this.threadModel.find({ courseId }).exec();
  }

  async getAllForums() {
    return await this.forumModel.find().exec();
  }


  // async deleteForum(id: string): Promise<void> {
  //   // Find the forum to get its associated threads
  //   const forum = await this.forumModel.findById(id).exec();
  //   if (!forum) {
  //     throw new NotFoundException(`Forum with ID ${id} not found`);
  //   }
  
  //   // Delete all threads associated with the forum
  //   await this.threadModel.deleteMany({ _id: { $in: forum.threads } }).exec();
  
  //   // Delete the forum itself
  //   await this.forumModel.findByIdAndDelete(id).exec();
  // }

  async delete(courseId: string): Promise<void> {
    // Check if any threads are associated with the course
    const forum = await this.forumModel.findOne({ courseId: courseId });
    if (forum) {
      // Delete all threads associated with this forum
      const threadsResult = await this.threadModel.deleteMany({ _id: { $in: forum.threads } });
      console.log(`${threadsResult.deletedCount} threads deleted`);
  
      // Now, delete the forum
      await forum.deleteOne();
      console.log(`Forum with ID ${courseId} deleted`);
    } else {
      throw new BadRequestException(`Cannot delete course with ID ${courseId} because no forum exists.`);
    }
  }
  
  
 
  

}

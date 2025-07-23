import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './models/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<any> {
    try {
      const notification = new this.notificationModel({
        ...createNotificationDto,
        read: createNotificationDto.isRead ?? false, // Default to `false` if `isRead` is not provided
      });
  
      const savedNotification = await notification.save();
  
      // Format the response
      return {
        id: savedNotification._id.toString(), // Convert MongoDB ObjectID to string and rename `_id` to `id`
        senderId: savedNotification.senderId,
        receiverId: savedNotification.receiverId,
        content: savedNotification.content,
        isRead: savedNotification.read, // Rename `read` to `isRead`
        createdAt: savedNotification.createdAt,
      };
    } catch (error) {
      console.error('Error creating notification:', error.message);
      throw new Error('Failed to create notification.');
    }
  }
  
  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ receiverId: { $in: [userId] } }).exec();
}
  async findAll(): Promise<Notification[]> {
    try {
      return await this.notificationModel.find().exec();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  async findOne(id: string): Promise<Notification | number> {
    if (id === 'unread-count') {
      // Special case: When id is 'unread-count', fetch unread notification count
      const unreadCount = await this.notificationModel.countDocuments({ read: false });
      return unreadCount; // Returns the count of unread notifications
    } else {
      // Normal case: Fetch notification by its ObjectId
      const notification = await this.notificationModel.findById(id);
      if (!notification) {
        throw new Error('Notification not found');
      }
      return notification;
    }
  }
  

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    try {
      // Log the incoming data to verify it
      console.log('Received updateNotificationDto:', updateNotificationDto);
      
      const updateData: any = { ...updateNotificationDto };
  
      // Map `isRead` to `read` for schema compatibility
      if ('isRead' in updateNotificationDto) {
        updateData.read = updateNotificationDto.isRead;
        delete updateData.isRead; // Remove the original field
      }
  
      // Log the final object before performing the update
      console.log('Mapped Update Data:', updateData);
  
      // Ensure the update happens and the new document is returned
      const updatedNotification = await this.notificationModel
        .findByIdAndUpdate(
          id,
          { $set: updateData }, // Use $set to explicitly update fields
          { new: true, runValidators: true } // new: true returns the updated document
        )
        .exec();
  
      if (!updatedNotification) {
        throw new Error('Notification not found');
      }
  
      // Log the updated notification to verify the changes
      console.log('Updated Notification:', updatedNotification);
  
      return updatedNotification;
    } catch (error) {
      console.error('Error updating notification:', error.message);
      throw new Error(`Failed to update notification: ${error.message}`);
    }
  }
  
  
  
  

  async remove(id: string): Promise<Notification> {
    try {
      const removedNotification = await this.notificationModel.findByIdAndDelete(id).exec();
      if (!removedNotification) {
        throw new Error('Notification not found');
      }
      return removedNotification;
    } catch (error) {
      console.error('Error removing notification:', error);
      throw new Error('Failed to remove notification');
    }
  }

  // Optional: Mark notifications as read
  async markAsRead(id: string): Promise<Notification> {
    try {
      const updatedNotification = await this.notificationModel
        .findByIdAndUpdate(id, { read: true }, { new: true })
        .exec();
      if (!updatedNotification) {
        throw new Error('Notification not found');
      }
      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // New: Get unread notifications count
  async getUnreadCount(): Promise<any> {
    try {
      const count = await this.notificationModel.countDocuments({ read: false });
      return { unreadCount: count };
    } catch (error) {
      throw new Error('Failed to fetch unread count');
    }
  }

  // New: Bulk Send Notifications
  async bulkSend(
    userIds: string[], 
    message: string, 
    type: string,    // New parameter for type
    senderId: string = 'admin'  // Default to 'admin' if not provided
  ): Promise<Notification[]> {
    try {
      const notifications = userIds.map(userId => new this.notificationModel({
        receiverId: userId,
        content: message,
        senderId: senderId,    // Use the provided senderId or default to 'admin'
        type: type,            // Use the provided type
      }));
  
      return await this.notificationModel.insertMany(notifications);
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw new Error('Failed to send bulk notifications');
    }
  }
  
/*
  // New: Get notifications by type
  async findByType(type: string): Promise<Notification[]> {
    try {
      return await this.notificationModel.find({ type }).exec();
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      throw new Error('Failed to fetch notifications by type');
    }
  }

  // New: Real-time notifications via SSE or WebSocket
  async streamNotifications(res: any): Promise<void> {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const sendNotifications = async () => {
        const notifications = await this.findAll();
        res.write(`data: ${JSON.stringify(notifications)}\n\n`);
      };

      setInterval(sendNotifications, 5000); // Send notifications every 5 seconds
    } catch (error) {
      console.error('Error streaming notifications:', error);
      throw new Error('Failed to stream notifications');
    }
  }*/
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './models/logs.schema'; 
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  // Create a new log entry
  async create(createLogDto: CreateLogDto): Promise<Log> {
    try {
      const log = new this.logModel(createLogDto);
      return await log.save();
    } catch (error) {
      console.error('Create Log Error:', error.message); // Error message
      console.error('Error Details:', error); // Complete error object
      throw new BadRequestException('Failed to create log entry');
    }
  }
  

// Retrieve all logs with pagination
async findAll(page: number = 1, limit: number = 10): Promise<{ data: Log[]; total: number }> {
  try {
    const logs = await this.logModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.logModel.countDocuments();

    if (!logs.length) {
      throw new NotFoundException('No logs found');
    }

    return { data: logs, total };
  } catch (error) {
    throw new BadRequestException('Failed to retrieve logs');
  }
}



  // Retrieve a single log by ID
  async findOne(id: string): Promise<Log> {
    try {
      const log = await this.logModel.findById(id).exec();
      if (!log) {
        throw new NotFoundException(`Log with ID ${id} not found`);
      }
      return log;
    } catch (error) {
      throw new NotFoundException(`Log with ID ${id} not found`, error.message);
    }
  }

  // Update an existing log
  async update(id: string, updateLogDto: UpdateLogDto): Promise<Log> {
    if (id !== updateLogDto.id) {
      throw new BadRequestException('Log ID in the URL and body must match');
    }
  
    // Create an object for the fields to update
    const updateData: Partial<UpdateLogDto> = {};
  
    // Add only the fields that exist in the updateLogDto to the updateData object
    if (updateLogDto.event) {
      updateData.event = updateLogDto.event;
    }
  
    if (updateLogDto.adminId) {
      updateData.adminId = updateLogDto.adminId;
    }
  
    try {
      const updatedLog = await this.logModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!updatedLog) {
        throw new NotFoundException(`Log with ID ${id} not found`);
      }
      return updatedLog;
    } catch (error) {
      throw new BadRequestException('Failed to update log entry', error.message);
    }
  }
  
  // Delete a log by ID
  async remove(id: string): Promise<Log> {
    try {
      const deletedLog = await this.logModel.findByIdAndDelete(id).exec();
      if (!deletedLog) {
        throw new NotFoundException(`Log with ID ${id} not found`);
      }
      return deletedLog;
    } catch (error) {
      throw new NotFoundException(`Log with ID ${id} not found`, error.message);
    }
  }

  /*async searchByKey(key: string): Promise<Log[]> {
    try {
      // Ensure the key is non-empty and trimmed
      const trimmedKey = key.trim();
      if (!trimmedKey) {
        throw new BadRequestException('Search key cannot be empty');
      }
  
      // Retrieve logs containing the keyword in the 'event' field
      const logs = await this.logModel
        .find()
        .exec()
        .then((allLogs) =>
          allLogs.filter((log) =>
            log.event.toLowerCase().includes(trimmedKey.toLowerCase()),
          ),
        );
  
      if (!logs.length) {
        throw new NotFoundException(`No logs found matching the key: ${key}`);
      }
  
      return logs;
    } catch (error) {
      throw new BadRequestException('Failed to search logs', error.message);
    }
  }*/
}  

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Configuration } from './models/configurations.schema';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { CreateConfigurationDto } from './dto/create-configuration.dto';


@Injectable()
export class ConfigurationsService {
  constructor(@InjectModel(Configuration.name) private configurationModel: Model<Configuration>) {}

  // Search configurations by key
  async searchByKey(key: string) {
    if (!key) throw new BadRequestException('Search key is required');
    
    // Log the key for debugging
    console.log('Searching for key:', key);
  
    // Create a case-insensitive regex for the key
    const regex = new RegExp(`^${key}$`, 'i');  // Matches the key exactly (case-insensitive)
  
    // Search for the exact key in settings
    const result = await this.configurationModel.find({
      [`settings.${key}`]: { $regex: regex, $exists: true },
    }).exec();
  
    // Log the search result for debugging
    console.log('Search result:', result);
  
    return result;
  }
  
  // Get all configurations
  async findAll(): Promise<Configuration[]> {
    return this.configurationModel.find().exec();
  }

  // Get one configuration by ID
  async findOne(id: string): Promise<Configuration> {
    const configuration = await this.configurationModel.findById(id).exec();
    if (!configuration) throw new NotFoundException('Configuration not found');
    return configuration;
  }
 //...........................................................................................
  // Create a new configuration
  async create(createConfigDto: CreateConfigurationDto): Promise<Configuration> {
    const settingsKeys = Object.keys(createConfigDto.settings); // Get all keys from incoming settings
  
    // Query to find any existing configuration with overlapping keys in `settings`
    const existingConfig = await this.configurationModel
      .findOne({
        $or: settingsKeys.map((key) => ({
          [`settings.${key}`]: { $exists: true },
        })),
      })
      .exec();
  
    // Throw error if any matching configuration is found
    if (existingConfig) {
      throw new BadRequestException('A configuration with the same key already exists.');
    }
  
    // Create a new configuration document
    const newConfiguration = new this.configurationModel({
      settings: createConfigDto.settings, // Assign incoming settings
      createdBy: createConfigDto.createdBy, // Set `createdBy`
      updatedBy: createConfigDto.createdBy, // Set `updatedBy` to the same user
      createdAt: new Date(), // Set `createdAt` to the current timestamp
      updatedAt: new Date(), // Set `updatedAt` to the current timestamp
    });
  
    return newConfiguration.save(); // Save and return the created document
  }
  
  //................................................................................................
  
  // Update an existing configuration
  async update(id: string, updateConfigDto: UpdateConfigurationDto): Promise<Configuration> {
    const updatedConfiguration = await this.configurationModel
      .findByIdAndUpdate(id, updateConfigDto, { new: true })
      .exec();
    if (!updatedConfiguration) throw new NotFoundException('Configuration not found');
    return updatedConfiguration;
  }

  // Remove a configuration
  async remove(id: string): Promise<void> {
    const result = await this.configurationModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Configuration not found');
  }

  //............................................................................................................................
  // Bulk update configurations
  async bulkUpdate(bulkUpdateDto: UpdateConfigurationDto[]): Promise<any[]> {
    const results = await Promise.all(
      bulkUpdateDto.map(async (config) => {
        // Validate ObjectId format
        if (!Types.ObjectId.isValid(config.id)) {
          throw new BadRequestException(`Invalid ObjectId format for ID: ${config.id}`);
        }
  
        // Check if the configuration exists
        const existingConfig = await this.configurationModel.findById(config.id).exec();
        if (!existingConfig) {
          throw new NotFoundException(`Configuration with ID ${config.id} not found.`);
        }
  
        // Perform the update
        return this.configurationModel.updateOne({ _id: config.id }, config).exec();
      }),
    );
    return results;
  }
//..............................................................................................................................  

  // Get configurations by role
  async getByRole(role: string) {
    if (!role) {
      throw new BadRequestException('Role parameter is required');
    }
    return this.configurationModel.find({ roles: { $in: [role] } }).exec();
  }

  async createDefaultConfiguration(userId: string): Promise<Configuration> {
  // Validate that userId is a non-empty string
  if (!userId || typeof userId !== 'string') {
    throw new BadRequestException('Invalid userId format');
  }

  // Check if a configuration already exists for the user
  const existingConfig = await this.configurationModel.findOne({ createdBy: userId }).exec();
  if (existingConfig) {
    return existingConfig; // Return existing configuration
  }

  // Default configuration settings
  const defaultSettings: Record<string, string> = {
    theme: 'light',  // Default theme
    notificationsEnabled: 'true',  // Notifications enabled by default
    language: 'en',  // Default language is English
  };

  // Create a new configuration with default settings
  const newConfig = new this.configurationModel({
    settings: defaultSettings, // Assign default settings
    createdBy: userId,
    updatedBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Save and return the new configuration
  return await newConfig.save();
}

  
}

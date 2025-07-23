import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as util from 'util';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
const execPromise = util.promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupPath: string;
  private readonly keepDays: number;

  constructor(private readonly configService: ConfigService) {
    this.backupPath = this.configService.get<string>('BACKUP_PATH') || 'backups';
    this.keepDays = this.configService.get<number>('KEEP_DAYS') || 7;

    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
      this.logger.log(`Created backup directory at ${this.backupPath}`);
    }
  }

  /**
   * Create a database backup.
   */
  async createBackup(): Promise<void> {
    console.log('Manual backup triggered');
    try {
      const mongoUri = this.configService.get<string>('MONGO_URI');
      if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in environment variables');
      }

      const backupFolder = path.join(this.backupPath, new Date().toISOString().split('T')[0]);
      const backupCommand = `mongodump --uri="${mongoUri}" --out=${backupFolder}`;

      this.logger.log('Starting backup...');
      await execPromise(backupCommand);
      this.logger.log(`Backup successfully created at ${backupFolder}`);
    } catch (error) {
      this.logger.error('Failed to create backup', error.message);
    }
  }

  /**
   * Clean up old backups.
   */
  async cleanupOldBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.backupPath);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.keepDays);

      files.forEach((folder) => {
        const folderPath = path.join(this.backupPath, folder);
        const stats = fs.statSync(folderPath);

        if (stats.isDirectory() && new Date(stats.ctime) < cutoffDate) {
          fs.rmSync(folderPath, { recursive: true, force: true });
          this.logger.log(`Deleted old backup folder: ${folder}`);
        }
      });
    } catch (error) {
      this.logger.error('Failed to clean up old backups', error.message);
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledBackup(): Promise<void> {
    this.logger.log('Running scheduled backup...');
    await this.createBackup();
    await this.cleanupOldBackups();
  }
}

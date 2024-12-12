import { Controller, Post, UseGuards } from '@nestjs/common';
import { BackupService } from './backup.service';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('manual')
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Public()
  async triggerBackup() {
    await this.backupService.createBackup();
    return { message: 'Backup created successfully!' };
  }
}

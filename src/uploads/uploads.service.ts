import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly profileDir = join(process.cwd(), 'uploads/profile');

  constructor() {
    // Ensure uploads/profile exists
    if (!existsSync(this.profileDir)) {
      mkdirSync(this.profileDir, { recursive: true });
      this.logger.log(`📁 Created folder: ${this.profileDir}`);
    }
  }

  getProfileUrl(filename: string) {
    return `/uploads/profile/${filename}`;
  }

  getProfilePath(filename: string) {
    return join(this.profileDir, filename);
  }

  removeOldProfile(filename: string) {
    const filePath = this.getProfilePath(filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      this.logger.log(`🗑️ Removed old profile: ${filePath}`);
    }
  }

  handleFileUpload(file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully!',
      filename: file.filename,
      url: this.getProfileUrl(file.filename),
    };
  }
}

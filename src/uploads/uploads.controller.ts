import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';
import { UsersService } from '../users/users.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads/profile'),
        filename: (req: any, file, cb) => {
          const userId = req.user?.userId;
          const fileExt = extname(file.originalname);
          const finalName = `profile_${userId}${fileExt}`;
          cb(null, finalName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const newFilename = file.filename;

    // 1. Get old file from DB
    const user = await this.usersService.findById(userId);
    const oldPath = user?.profilePic;

    if (oldPath) {
      const oldFilename = oldPath.replace('/uploads/profile/', '');

      // 2. Remove old file if it's not same
      if (oldFilename !== newFilename) {
        this.uploadsService.removeOldProfile(oldFilename);
      }
    }

    // 3. Save new file path in DB
    const newPath = `/uploads/profile/${newFilename}`;
    await this.usersService.updateProfilePic(userId, newPath);

    return {
      message: 'Profile updated successfully!',
      filename: newFilename,
      url: newPath,
    };
  }
}

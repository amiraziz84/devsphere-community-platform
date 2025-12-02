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

          // Remove old profile file if exists
          cb(null, finalName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  async uploadProfile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user.userId;
    const finalName = file.filename;

    // Remove old file
    this.uploadsService.removeOldProfile(finalName);

    // Update DB
    const profilePath = `/uploads/profile/${finalName}`;
    await this.usersService.updateProfilePic(userId, profilePath);

    return {
      message: 'Profile updated successfully!',
      filename: finalName,
      url: profilePath,
    };
  }
}

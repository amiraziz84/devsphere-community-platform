import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  handleFileUpload(file: Express.Multer.File) {
    this.logger.log(`📁 File uploaded: ${file.originalname}`);
    return {
      message: 'File uploaded successfully!',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}

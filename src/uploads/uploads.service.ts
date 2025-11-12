import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  handleFileUpload(file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully!',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}

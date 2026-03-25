import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StorageService, StoredFileResult } from './storage.service';
import { UploadedBinaryFile } from './storage.types';

class UploadedFileResponseDto {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  storage: 'local' | 's3';
}

@ApiTags('files')
@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('files/upload') 
  @Render('files/upload')
  uploadPage() {
    return { pageTitle: 'Upload files' };
  }

  @Post('files/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Only JPEG, PNG and WEBP images are supported',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadMvc(
    @UploadedFile() file?: UploadedBinaryFile,
  ): Promise<{ pageTitle: string; uploaded: StoredFileResult }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const uploaded = await this.storageService.saveFile(file);
    return {
      pageTitle: 'Upload files',
      uploaded,
    };
  }

  @Post('api/files')
  @ApiOperation({ summary: 'Upload a file to object-storage-like backend' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UploadedFileResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async uploadApi(
    @UploadedFile() file?: UploadedBinaryFile,
  ): Promise<StoredFileResult> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.storageService.saveFile(file);
  }
}
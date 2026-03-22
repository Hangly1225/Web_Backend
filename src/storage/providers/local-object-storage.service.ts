import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { StoredFileResult } from '../storage.service';
import { UploadedBinaryFile } from '../storage.types';
import { ObjectStorageProvider } from './object-storage.interface';

@Injectable()
export class LocalObjectStorageService implements ObjectStorageProvider {
  private readonly uploadsDir = join(process.cwd(), 'public', 'uploads');

  canHandle() {
    return true;
  }

  async saveFile(file: UploadedBinaryFile): Promise<StoredFileResult> {
    await mkdir(this.uploadsDir, { recursive: true });

    const extension = extname(file.originalname) || '.bin';
    const fileName = `${randomUUID()}${extension}`;
    const filePath = join(this.uploadsDir, fileName);

    await writeFile(filePath, file.buffer);

    return {
      fileName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/${fileName}`,
      storage: 'local',
    };
  }
}
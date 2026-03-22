import { Injectable } from '@nestjs/common';
import { UploadedBinaryFile } from './storage.types';
import { LocalObjectStorageService } from './providers/local-object-storage.service';
import { S3CompatibleStorageService } from './providers/s3-compatible-storage.service';

export interface StoredFileResult {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  storage: 'local' | 's3';
}

@Injectable()
export class StorageService {
  constructor(
    private readonly s3CompatibleStorageService: S3CompatibleStorageService,
    private readonly localObjectStorageService: LocalObjectStorageService,
  ) {}

  async saveFile(file: UploadedBinaryFile): Promise<StoredFileResult> {
    if (this.s3CompatibleStorageService.canHandle()) {
      return this.s3CompatibleStorageService.saveFile(file);
    }

    return this.localObjectStorageService.saveFile(file);
  }
}
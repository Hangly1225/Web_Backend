import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { LocalObjectStorageService } from './providers/local-object-storage.service';
import { S3CompatibleStorageService } from './providers/s3-compatible-storage.service';

@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    LocalObjectStorageService,
    S3CompatibleStorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
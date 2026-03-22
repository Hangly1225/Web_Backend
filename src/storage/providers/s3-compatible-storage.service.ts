import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { StoredFileResult } from '../storage.service';
import { UploadedBinaryFile } from '../storage.types';
import { ObjectStorageProvider } from './object-storage.interface';

@Injectable()
export class S3CompatibleStorageService implements ObjectStorageProvider {
  canHandle() {
    return Boolean(
      process.env.S3_ENDPOINT &&
        process.env.S3_REGION &&
        process.env.S3_BUCKET &&
        process.env.S3_ACCESS_KEY_ID &&
        process.env.S3_SECRET_ACCESS_KEY,
    );
  }

  async saveFile(file: UploadedBinaryFile): Promise<StoredFileResult> {
    const bucket = process.env.S3_BUCKET as string;
    const endpoint = (process.env.S3_ENDPOINT as string).replace(/\/$/, '');
    const region = process.env.S3_REGION as string;
    const extension = extname(file.originalname) || '.bin';
    const fileName = `${randomUUID()}${extension}`;
    const objectKey = `uploads/${fileName}`;

    const client = new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
    });

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, '');
    const url = publicBaseUrl
      ? `${publicBaseUrl}/${objectKey}`
      : `${endpoint}/${bucket}/${objectKey}`;

    return {
      fileName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url,
      storage: 's3',
    };
  }
}

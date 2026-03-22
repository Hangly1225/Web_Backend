import { Injectable } from '@nestjs/common';
import { createHash, createHmac, randomUUID } from 'crypto';
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
    const region = process.env.S3_REGION as string;
    const endpoint = (process.env.S3_ENDPOINT as string).replace(/\/$/, '');
    const accessKeyId = process.env.S3_ACCESS_KEY_ID as string;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY as string;
    const extension = extname(file.originalname) || '.bin';
    const fileName = `${randomUUID()}${extension}`;
    const objectKey = `uploads/${fileName}`;

    const now = new Date();
    const amzDate = this.formatAmzDate(now);
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = this.sha256(file.buffer);
    const requestUrl = `${endpoint}/${bucket}/${objectKey}`;
    const requestPath = `/${bucket}/${objectKey}`;
    const host = new URL(endpoint).host;

    const canonicalHeaders = [
      `content-type:${file.mimetype}`,
      `host:${host}`,
      `x-amz-content-sha256:${payloadHash}`,
      `x-amz-date:${amzDate}`,
    ].join('\n');
    const signedHeaders =
      'content-type;host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest = [
      'PUT',
      requestPath,
      '',
      `${canonicalHeaders}\n`,
      signedHeaders,
      payloadHash,
    ].join('\n');

    const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      this.sha256(canonicalRequest),
    ].join('\n');

    const signingKey = this.getSignatureKey(
      secretAccessKey,
      dateStamp,
      region,
      's3',
    );
    const signature = createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex');
    const authorization = [
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(', ');

    const response = await fetch(requestUrl, {
      method: 'PUT',
      headers: {
        authorization,
        'content-type': file.mimetype,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
      },
      body: new Uint8Array(file.buffer),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`S3 upload failed: ${response.status} ${details}`);
    }

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

  private sha256(value: string | Buffer) {
    return createHash('sha256').update(value).digest('hex');
  }

  private hmac(key: string | Buffer, value: string) {
    return createHmac('sha256', key).update(value).digest();
  }

  private getSignatureKey(
    secretAccessKey: string,
    dateStamp: string,
    region: string,
    service: string,
  ) {
    const kDate = this.hmac(`AWS4${secretAccessKey}`, dateStamp);
    const kRegion = this.hmac(kDate, region);
    const kService = this.hmac(kRegion, service);
    return this.hmac(kService, 'aws4_request');
  }

  private formatAmzDate(value: Date) {
    return value.toISOString().replace(/[:-]|\.\d{3}/g, '');
  }
}

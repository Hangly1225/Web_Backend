import { UploadedBinaryFile } from '../storage.types';
import { StoredFileResult } from '../storage.service';

export interface ObjectStorageProvider {
  canHandle(): boolean;
  saveFile(file: UploadedBinaryFile): Promise<StoredFileResult>;
}

import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { IS3Service } from './s3.interface';
import { Readable } from 'stream';

@Injectable()
export class S3Service implements IS3Service {
  private s3: S3Client;
  private bucketName: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow('NCP_BUCKET_NAME');
    this.region = this.configService.getOrThrow('NCP_REGION');

    this.s3 = new S3Client({
      region: this.region,
      endpoint: this.configService.getOrThrow('NCP_OBJECT_STORAGE_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.getOrThrow('NCP_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('NCP_SECRET_KEY'),
      },
    });
  }

  async uploadFile(content: string, fileName: string): Promise<string> {
    return this.upload(content, fileName, 'text/plain');
  }

  async uploadBinary(content: Uint8Array, fileName: string): Promise<string> {
    return this.upload(content, fileName, 'application/octet-stream');
  }

  async downloadFile(key: string): Promise<string> {
    const buffer = await this.download(key);
    return buffer.toString('utf-8');
  }

  async downloadBinary(key: string): Promise<Uint8Array> {
    return this.download(key);
  }

  private async upload(
    content: string | Uint8Array,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const key = `${randomUUID()}-${fileName}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ACL: 'public-read',
        ContentType: contentType,
      }),
    );

    return `https://${this.bucketName}.kr.object.ncloudstorage.com/${key}`;
  }

  /** 파일 다운로드 (내용 읽기) */
  private async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3.send(command);
    const stream = response.Body as Readable;
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk as Uint8Array);
    }

    return Buffer.concat(chunks);
  }

  extractKeyFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // 앞의 '/' 제거
  }
}

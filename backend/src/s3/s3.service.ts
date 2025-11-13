import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { IS3Service } from './s3.interface';

@Injectable()
export class S3Service implements IS3Service {
  private s3: S3Client;
  private bucketName: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow("NCP_BUCKET_NAME");
    this.region = this.configService.getOrThrow("NCP_REGION");

    this.s3 = new S3Client({
      region: this.region,
      endpoint: this.configService.getOrThrow("NCP_OBJECT_STORAGE_ENDPOINT"),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.getOrThrow("NCP_ACCESS_KEY"),
        secretAccessKey: this.configService.getOrThrow("NCP_SECRET_KEY"),
      },
    });
  }

  async uploadFile(content: string, fileName: string): Promise<string> {
    const key = `${randomUUID()}-${fileName}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ACL: "public-read",
      })
    );

    // NCP Object Storage의 공개 URL 형식
    return `https://${this.bucketName}.kr.object.ncloudstorage.com/${key}`;
  }
}

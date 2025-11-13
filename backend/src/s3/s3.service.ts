import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { IS3Service } from "./s3.interface";

@Injectable()
export class S3Service implements IS3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.getOrThrow("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.getOrThrow("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.getOrThrow("AWS_SECRET_ACCESS_KEY"),
      },
    });
    this.bucketName = this.configService.getOrThrow("AWS_S3_BUCKET_NAME");
  }

    async uploadFile(content: string, fileName: string): Promise<string> {
        const key = `files/${randomUUID()}-${fileName}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: content,
            })
        );
        return `https://${this.bucketName}.s3.${this.configService.getOrThrow("AWS_REGION")}.amazonaws.com/${key}`;
    }
}
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { S3 } from 'aws-sdk';

@Injectable()
export class BookPhotosService {
  private readonly s3: S3;

  constructor(private readonly databaseService: DatabaseService) {
    this.s3 = new S3({
      region: 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async findAll() {
    return this.databaseService.bookPhoto.findMany();
  }

  async uploadPhoto(fileBuffer: Buffer, bucketName: string, key: string): Promise<string> {
    try {
      const params: S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: 'image/jpeg', // Update MIME type if necessary
      };

      const uploadResult = await this.s3.upload(params).promise();
      console.log('File uploaded successfully. File location:', uploadResult.Location);
      return uploadResult.Location;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deletePhoto(bucketName: string, fileName: string): Promise<void> {
    try {
      const params: S3.DeleteObjectRequest = {
        Bucket: bucketName,
        Key: fileName,
      };

      await this.s3.deleteObject(params).promise();
      console.log(`File ${fileName} deleted successfully from bucket ${bucketName}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
}

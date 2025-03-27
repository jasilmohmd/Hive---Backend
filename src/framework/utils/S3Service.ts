import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

class S3Service {
  private bucketName = process.env.AWS_S3_BUCKET_NAME as string;

  async uploadFile(fileBuffer: Buffer, fileName: string, isPublic: boolean): Promise<string> {
    // Use a prefix for public images; use "private/" prefix for private images.
    const key = isPublic ? `public/${uuidv4()}-${fileName}` : `private/${uuidv4()}-${fileName}`;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/jpeg',
    };

    try {
      await s3.upload(params).promise();
      return isPublic ? `https://${this.bucketName}.s3.amazonaws.com/${key}` : key;
    } catch (error) {
      // You might want to log the error here
      throw new Error(`Error uploading file: ${error}`);
    }
  }

  async getSignedUrl(fileKey: string, expiresIn = 600): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Expires: expiresIn,
    };

    try {
      return await s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      // You might want to log the error here
      throw new Error(`Error generating signed URL: ${error}`);
    }
  }
}

export default new S3Service();

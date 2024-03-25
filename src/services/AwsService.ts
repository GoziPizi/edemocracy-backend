import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from 'uuid'

class AwsService {

    private static aws3 = new S3({region: process.env.AWS_REGION})
    private static bucketName = process.env.AWS_BUCKET_NAME
    private static baseUrl = process.env.AWS_BASE_PUBLIC_URL

    private static async uploadFile(key: string, file: Express.Multer.File): Promise<string> {
        try {
            const upload = new Upload({
                client: this.aws3,
                params: {
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                },
            });

            await upload.done();
            return key;
        } catch (error) {
            throw new Error('Error uploading file');
        }
    }

    static async deleteFile(key: string): Promise<void> {
        await this.aws3.deleteObject({
            Bucket: this.bucketName,
            Key: key,
        });
    }

    static async uploadProfilePicture(file: Express.Multer.File, prefix: string): Promise<string> {
        const pictureUrl = `profile-picture/${prefix}-${Date.now()}_${uuidv4()}`;
        return this.uploadFile(pictureUrl, file);
    }

    static async uploadTopicPicture(file: Express.Multer.File, prefix: string): Promise<string> {
        const pictureKey = `topic-picture/${prefix}-${Date.now()}_${uuidv4()}`;
        await this.uploadFile(pictureKey, file);
        return `${this.baseUrl}${pictureKey}`;
    }
}

export default AwsService;
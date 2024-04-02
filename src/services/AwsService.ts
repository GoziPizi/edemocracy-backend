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

    static deleteFile = async (key: string) => {
        const pattern = /^https:\/\/edemocracy-dev.s3.eu-west-3.amazonaws.com/;
        if (pattern.test(key)) {
          key = key.replace('https://edemocracy-dev.s3.eu-west-3.amazonaws.com/', '');
        }
        try {
          await this.aws3.deleteObject({ Bucket: this.bucketName, Key: key })
        } catch (e) {
          console.log(e)
          throw new Error('Error deleting file')
        }
      }

    static async uploadIdentityPicture(file: Express.Multer.File): Promise<string> {
        const pictureKey = `identity-picture/${Date.now()}_${uuidv4()}`;
        await this.uploadFile(pictureKey, file);
        return `${this.baseUrl}${pictureKey}`;
    }

    static async uploadProfilePicture(file: Express.Multer.File, prefix: string): Promise<string> {
        const pictureUrl = `profile-picture/${prefix}-${Date.now()}_${uuidv4()}`;
        await this.uploadFile(pictureUrl, file);
        return `${this.baseUrl}${pictureUrl}`;
    }

    static async uploadTopicPicture(file: Express.Multer.File, prefix: string): Promise<string> {
        const pictureKey = `topic-picture/${prefix}-${Date.now()}_${uuidv4()}`;
        await this.uploadFile(pictureKey, file);
        return `${this.baseUrl}${pictureKey}`;
    }
}

export default AwsService;
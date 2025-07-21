import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env.js";

// Initialize S3 client
export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3
export async function uploadToS3(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    // Return the S3 URL
    return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

// Generate presigned URL for file access
export async function getPresignedUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
}

// Upload audio file
export async function uploadAudio(
  videoId: string,
  audioBuffer: Buffer
): Promise<string> {
  const key = `audio/${videoId}.mp3`;
  return uploadToS3(key, audioBuffer, "audio/mpeg");
}

// Upload video file
export async function uploadVideo(
  videoId: string,
  videoBuffer: Buffer
): Promise<string> {
  const key = `videos/${videoId}.mp4`;
  return uploadToS3(key, videoBuffer, "video/mp4");
}

// Upload thumbnail
export async function uploadThumbnail(
  videoId: string,
  thumbnailBuffer: Buffer
): Promise<string> {
  const key = `thumbnails/${videoId}.jpg`;
  return uploadToS3(key, thumbnailBuffer, "image/jpeg");
}

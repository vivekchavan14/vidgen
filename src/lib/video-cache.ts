import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

// Create a cache directory for videos
const CACHE_DIR = path.join(process.cwd(), 'public', 'cached-videos');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export async function cacheVideoFromS3(s3Url: string, videoId: string): Promise<string> {
  try {
    // Create a local filename
    const filename = `${videoId}.mp4`;
    const localPath = path.join(CACHE_DIR, filename);
    
    // Check if file already exists
    if (fs.existsSync(localPath)) {
      return `/cached-videos/${filename}`;
    }

    // Download from S3
    console.log(`Downloading video from S3: ${s3Url}`);
    const response = await fetch(s3Url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    // Save to local file
    const fileStream = createWriteStream(localPath);
    await pipelineAsync(response.body, fileStream);
    
    console.log(`Video cached locally: ${localPath}`);
    
    // Return the public URL path
    return `/cached-videos/${filename}`;
  } catch (error) {
    console.error('Error caching video:', error);
    throw error;
  }
}

export async function cleanupOldCachedVideos(maxAgeHours: number = 24): Promise<void> {
  try {
    const files = fs.readdirSync(CACHE_DIR);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      const ageInHours = (now - stats.mtime.getTime()) / (1000 * 60 * 60);
      
      if (ageInHours > maxAgeHours) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old cached video: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up cached videos:', error);
  }
}

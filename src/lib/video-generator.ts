import { getBackgroundVideo } from "./background-videos";
import { getCharacterAvatar } from "./character-avatars";

export interface VideoGenerationOptions {
  videoId: string;
  scriptText: string;
  audioUrl: string;
  topic: string;
  voice: string;
  videoStyle: string;
  duration: number;
}

// Generate a simple video preview (for now, we'll create an HTML5 video with our background)
export async function generateVideoPreview(options: VideoGenerationOptions): Promise<Buffer> {
  const { scriptText, topic, voice, videoStyle } = options;
  const backgroundVideo = getBackgroundVideo(videoStyle);
  const character = getCharacterAvatar(voice);
  
  // For now, we'll create a simple HTML representation that can be converted to video
  // In a real implementation, you might use FFmpeg or similar tools
  const videoMetadata = {
    title: topic,
    character: character.name,
    backgroundVideo: backgroundVideo.url,
    script: scriptText.substring(0, 200) + "...",
    duration: options.duration,
    style: videoStyle
  };
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(45deg, #FF6B6B, #4ECDC4); margin: 0; padding: 20px; }
        .video-info { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .character { font-size: 18px; color: #666; margin-bottom: 10px; }
        .script { font-size: 14px; line-height: 1.4; color: #444; margin-bottom: 15px; }
        .meta { font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="video-info">
        <div class="title">🧠 ${videoMetadata.title}</div>
        <div class="character">👤 Character: ${videoMetadata.character}</div>
        <div class="script">"${videoMetadata.script}"</div>
        <div class="meta">
          Style: ${videoMetadata.style.replace(/_/g, ' ')} | 
          Duration: ${videoMetadata.duration}s |
          Background: ${backgroundVideo.description}
        </div>
      </div>
    </body>
    </html>
  `;
  
  return Buffer.from(htmlContent);
}

// Generate a thumbnail for the video
export async function generateThumbnail(options: VideoGenerationOptions): Promise<Buffer> {
  const { topic, voice, videoStyle } = options;
  const character = getCharacterAvatar(voice);
  const backgroundVideo = getBackgroundVideo(videoStyle);
  
  // Create SVG thumbnail
  const svgContent = `
    <svg width="320" height="180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#4ECDC4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#45B7D1;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="320" height="180" fill="url(#bg)"/>
      
      <!-- Dark overlay -->
      <rect width="320" height="180" fill="rgba(0,0,0,0.4)"/>
      
      <!-- Character circle -->
      <circle cx="60" cy="60" r="30" fill="${character.backgroundColor}" stroke="white" stroke-width="3"/>
      <text x="60" y="70" text-anchor="middle" font-size="24" fill="white">${character.emoji}</text>
      
      <!-- Title -->
      <rect x="10" y="110" width="300" height="50" fill="rgba(0,0,0,0.8)" rx="5"/>
      <text x="160" y="130" text-anchor="middle" font-size="14" fill="white" font-weight="bold">
        ${topic.toUpperCase()}
      </text>
      <text x="160" y="150" text-anchor="middle" font-size="12" fill="#FFD700">
        🧠 BRAINROT • ${character.name}
      </text>
      
      <!-- Style badge -->
      <rect x="210" y="20" width="100" height="25" fill="rgba(255,0,0,0.8)" rx="12"/>
      <text x="260" y="37" text-anchor="middle" font-size="10" fill="white" font-weight="bold">
        ${videoStyle.split('_')[0]}
      </text>
    </svg>
  `;
  
  return Buffer.from(svgContent);
}

// Generate video info for preview
export function generateVideoInfo(options: VideoGenerationOptions) {
  const backgroundVideo = getBackgroundVideo(options.videoStyle);
  const character = getCharacterAvatar(options.voice);
  
  return {
    id: options.videoId,
    title: options.topic,
    character: character.name,
    characterImage: character.imageUrl,
    backgroundVideo: backgroundVideo.url,
    duration: options.duration,
    script: options.scriptText,
    style: options.videoStyle,
    voice: options.voice
  };
}

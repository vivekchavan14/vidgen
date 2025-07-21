// Background video service for different video styles using local assets

export interface BackgroundVideo {
  url: string;
  description: string;
  duration: number; // in seconds
}

// Local gameplay background videos from assets folder
export function getBackgroundVideo(videoStyle: string): BackgroundVideo {
  const backgroundVideos: Record<string, BackgroundVideo> = {
    "BRAINROT_CLASSIC": {
      url: "/assets/subwaysurfers_0.mp4",
      description: "Classic brainrot background with Subway Surfers",
      duration: 120 // Estimated duration, adjust based on actual video length
    },
    "SUBWAY_SURFERS": {
      url: "/assets/subwaysurfers_0.mp4", 
      description: "Subway Surfers endless runner gameplay",
      duration: 120
    },
    "MINECRAFT_PARKOUR": {
      url: "/assets/parkour1.mp4",
      description: "Minecraft parkour gameplay",
      duration: 180 // Estimated duration, adjust based on actual video length
    },
    "FAMILY_GUY_FUNNY_MOMENTS": {
      url: "/assets/subwaysurfers_0.mp4",
      description: "Family Guy style with Subway Surfers background",
      duration: 120
    },
    "SATISFYING_SLIME": {
      url: "/assets/parkour1.mp4",
      description: "Satisfying content with parkour background",
      duration: 180
    },
    "DISCORD_CHAT": {
      url: "/assets/subwaysurfers_0.mp4",
      description: "Discord chat with Subway Surfers background",
      duration: 120
    },
    "REDDIT_STORY": {
      url: "/assets/parkour1.mp4", 
      description: "Reddit story with parkour background",
      duration: 180
    },
    "ASMR_COOKING": {
      url: "/assets/subwaysurfers_0.mp4",
      description: "ASMR content with Subway Surfers background",
      duration: 120
    },
    "TIKTOK_COMPILATION": {
      url: "/assets/parkour1.mp4",
      description: "TikTok style with parkour background",
      duration: 180
    },
    "GAMING_HIGHLIGHTS": {
      url: "/assets/subwaysurfers_0.mp4",
      description: "Gaming highlights with Subway Surfers background", 
      duration: 120
    }
  };

  return backgroundVideos[videoStyle] || backgroundVideos["BRAINROT_CLASSIC"];
}

// Generate placeholder background video URLs for different styles
export function generateGameplayPlaceholder(style: string): string {
  const placeholders: Record<string, string> = {
    "SUBWAY_SURFERS": "https://via.placeholder.com/1080x1920/FF6B35/FFFFFF?text=SUBWAY+SURFERS+GAMEPLAY",
    "MINECRAFT_PARKOUR": "https://via.placeholder.com/1080x1920/4CAF50/FFFFFF?text=MINECRAFT+PARKOUR",
    "FAMILY_GUY_FUNNY_MOMENTS": "https://via.placeholder.com/1080x1920/FF9800/FFFFFF?text=FAMILY+GUY+MOMENTS",
    "GAMING_HIGHLIGHTS": "https://via.placeholder.com/1080x1920/9C27B0/FFFFFF?text=GAMING+HIGHLIGHTS",
    "BRAINROT_CLASSIC": "https://via.placeholder.com/1080x1920/F44336/FFFFFF?text=BRAINROT+CLASSIC"
  };

  return placeholders[style] || placeholders["BRAINROT_CLASSIC"];
}

// Get video style display name
export function getVideoStyleName(style: string): string {
  const styleNames: Record<string, string> = {
    "BRAINROT_CLASSIC": "Classic Brainrot",
    "SUBWAY_SURFERS": "Subway Surfers",
    "MINECRAFT_PARKOUR": "Minecraft Parkour", 
    "FAMILY_GUY_FUNNY_MOMENTS": "Family Guy Moments",
    "SATISFYING_SLIME": "Satisfying Slime",
    "DISCORD_CHAT": "Discord Chat",
    "REDDIT_STORY": "Reddit Story",
    "ASMR_COOKING": "ASMR Cooking",
    "TIKTOK_COMPILATION": "TikTok Compilation",
    "GAMING_HIGHLIGHTS": "Gaming Highlights"
  };

  return styleNames[style] || "Classic";
}

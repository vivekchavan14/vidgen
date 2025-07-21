// Character avatar generator using local images

export interface CharacterAvatar {
  imageUrl: string;
  backgroundColor: string;
  textColor: string;
  name: string;
  emoji: string; // Keep for fallback compatibility
}

export function getCharacterAvatar(voice: string): CharacterAvatar {
  const characterAvatars: Record<string, CharacterAvatar> = {
    "PETER_GRIFFIN": {
      imageUrl: "/assets/Peter_Griffin.png",
      backgroundColor: "#4CAF50", // Green (Peter's shirt)
      textColor: "white",
      name: "Peter Griffin",
      emoji: "👨"
    },
    "STEWIE_GRIFFIN": {
      imageUrl: "/assets/Stewie_Griffin.webp",
      backgroundColor: "#FF9800", // Orange (Stewie's shirt)
      textColor: "white",
      name: "Stewie Griffin",
      emoji: "👶"
    }
  };

  return characterAvatars[voice] || characterAvatars["PETER_GRIFFIN"];
}

// Generate SVG avatar for character
export function generateCharacterSVG(voice: string, size: number = 100): string {
  const avatar = getCharacterAvatar(voice);
  
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${avatar.backgroundColor}"/>
      <text x="${size/2}" y="${size/2 + 10}" font-family="Arial, sans-serif" font-size="${size * 0.4}" text-anchor="middle" fill="${avatar.textColor}">
        ${avatar.emoji}
      </text>
    </svg>
  `.trim();
}

// Generate character avatar URL (data URL)
export function getCharacterAvatarURL(voice: string, size: number = 100): string {
  const svg = generateCharacterSVG(voice, size);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

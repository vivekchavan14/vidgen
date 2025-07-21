import {
  AbsoluteFill,
  Audio,
  Img,
  Video,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "@remotion/core";
import React from "react";
import { getCharacterAvatar } from "../lib/character-avatars";
import { getBackgroundVideo } from "../lib/background-videos";

interface CompositionProps {
  scriptText: string;
  audioUrl: string;
  topic: string;
  voice: string;
  videoStyle?: string;
}

// Voice display function for Griffin characters
function getVoiceDisplay(voice: string): string {
  const voiceDisplayMap: Record<string, string> = {
    "PETER_GRIFFIN": "👨 Peter",
    "STEWIE_GRIFFIN": "👶 Stewie",
  };
  
  return voiceDisplayMap[voice] || "👨 Peter";
}

const BrainrotComposition: React.FC<CompositionProps> = ({
  scriptText,
  audioUrl,
  topic,
  voice,
  videoStyle = "BRAINROT_CLASSIC",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const characterAvatar = getCharacterAvatar(voice);
  const backgroundVideo = getBackgroundVideo(videoStyle);

  // Text animation - pulsing effect
  const textOpacity = interpolate(
    frame % (fps * 2),
    [0, fps * 0.5, fps * 1.5, fps * 2],
    [0.9, 1, 1, 0.9]
  );

  // Character image animation - bouncing effect
  const characterScale = 1 + Math.sin(frame * 0.08) * 0.1;
  const characterBounce = Math.sin(frame * 0.06) * 5;

  // Split script into words for dynamic display
  const words = scriptText.split(" ");
  const wordsPerSecond = 2.5; // Slightly slower for better readability
  const currentWordIndex = Math.floor((frame / fps) * wordsPerSecond);
  const visibleWords = words.slice(
    Math.max(0, currentWordIndex - 10),
    currentWordIndex + 1
  );

  return (
    <AbsoluteFill>
      {/* Background gameplay video */}
      <AbsoluteFill>
        <Video
          src={backgroundVideo.url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          playbackRate={1}
          loop
        />
      </AbsoluteFill>

      {/* Dark overlay for better text readability */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Character Image */}
      <div
        style={{
          position: "absolute",
          top: 60 + characterBounce,
          left: 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "4px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          transform: `scale(${characterScale})`,
          overflow: "hidden",
          backgroundColor: characterAvatar.backgroundColor,
        }}
      >
        <Img
          src={characterAvatar.imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Character Name Badge */}
      <div
        style={{
          position: "absolute",
          top: 190 + characterBounce,
          left: 50,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: 16,
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {characterAvatar.name}
      </div>

      {/* Topic Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 40,
          left: 240, // Leave space for character
          backgroundColor: "rgba(255, 215, 0, 0.9)",
          color: "black",
          padding: "16px 24px",
          borderRadius: "12px",
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          textTransform: "uppercase",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
          border: "3px solid white",
        }}
      >
        {topic}
      </div>

      {/* Dynamic Script Text */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 40,
          right: 40,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          color: "white",
          padding: "20px 30px",
          borderRadius: "16px",
          fontSize: 28,
          lineHeight: 1.4,
          textAlign: "center",
          fontWeight: "600",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          opacity: textOpacity,
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {visibleWords.join(" ") || "..."}
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          height: 8,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(frame / durationInFrames) * 100}%`,
            height: "100%",
            backgroundColor: "#FF6B35",
            borderRadius: "4px",
            transition: "width 0.1s ease",
          }}
        />
      </div>

      {/* Brainrot style indicators */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 24,
          color: "white",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          backgroundColor: "rgba(255, 0, 0, 0.8)",
          padding: "8px 16px",
          borderRadius: "20px",
          border: "2px solid white",
        }}
      >
        🧠 BRAINROT
      </div>

      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          fontSize: 20,
          color: "white",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          backgroundColor: "rgba(0, 150, 255, 0.8)",
          padding: "8px 16px",
          borderRadius: "20px",
          border: "2px solid white",
        }}
      >
        🎮 {videoStyle.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
      </div>

      {/* Audio track */}
      <Audio src={audioUrl} />
    </AbsoluteFill>
  );
};

export default BrainrotComposition;

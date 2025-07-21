import type { NextApiRequest, NextApiResponse } from "next";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

interface RenderVideoProps {
  scriptText: string;
  audioUrl: string;
  topic: string;
  voice: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { scriptText, audioUrl, topic, voice }: RenderVideoProps = req.body;

    // Create temporary directory for output
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    console.log("Starting video render...");

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), "src/remotion/index.ts"),
      webpackOverride: (config) => config,
    });

    console.log("Bundle created at:", bundleLocation);

    // Get composition
    const comps = await selectComposition({
      serveUrl: bundleLocation,
      id: "BrainrotVideo",
    });

    const composition = comps[0];
    if (!composition) {
      throw new Error("Composition not found");
    }

    console.log("Composition found:", composition.id);

    // Output file path
    const outputLocation = path.join(tempDir, `video-${Date.now()}.mp4`);

    // Render video
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
      inputProps: { scriptText, audioUrl, topic, voice },
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log("Video rendered at:", outputLocation);

    // Read the rendered video file
    const videoBuffer = fs.readFileSync(outputLocation);

    // Clean up temporary file
    fs.unlinkSync(outputLocation);

    // Return the video buffer as base64
    const base64Video = videoBuffer.toString("base64");

    res.status(200).json({
      success: true,
      video: base64Video,
      mimeType: "video/mp4",
    });
  } catch (error) {
    console.error("Error rendering video:", error);
    res.status(500).json({
      success: false,
      error: "Failed to render video",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

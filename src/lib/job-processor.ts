import { db } from "~/server/db";
import { generateScript, generateSpeech } from "./services";
import { uploadAudio, uploadVideo, uploadThumbnail } from "./aws";
import { generateThumbnail } from "./video-generator";

export async function processVideoGeneration(videoId: string, topic: string, voice: string, videoStyle: string = "BRAINROT_CLASSIC") {
  try {
    // Step 1: Generate script
    const scriptJobId = await createJob(videoId, "SCRIPT_GENERATION");
    const script = await generateScript(topic, voice);
    
    // Update video with script
    await db.video.update({
      where: { id: videoId },
      data: { scriptText: script },
    });
    
    await completeJob(scriptJobId);

    // Step 2: Generate audio
    const audioJobId = await createJob(videoId, "AUDIO_GENERATION");
    const audioBase64 = await generateSpeech(script, voice as any);
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const audioUrl = await uploadAudio(videoId, audioBuffer);

    // Update video with audio URL
    await db.video.update({
      where: { id: videoId },
      data: { audioUrl },
    });
    
    await completeJob(audioJobId);

    // Step 3: Render video and generate thumbnail
    const videoJobId = await createJob(videoId, "VIDEO_RENDERING");
    
    // Estimate duration based on script length
    const words = script.split(' ').length;
    const duration = Math.max(30, Math.round(words / 150 * 60)); // 150 words per minute
    
    let videoUrl: string;
    let thumbnailUrl: string | undefined;
    
    try {
      // Render actual video using API endpoint
      const renderResponse = await fetch('http://localhost:3000/api/render-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scriptText: script,
          audioUrl,
          topic,
          voice
        })
      });
      
      const renderResult = await renderResponse.json();
      
      if (!renderResult.success) {
        throw new Error(renderResult.error || 'Video rendering failed');
      }
      
      const videoBuffer = Buffer.from(renderResult.video, 'base64');
      videoUrl = await uploadVideo(videoId, videoBuffer);
      
      // Generate and upload thumbnail
      const thumbnailBuffer = await generateThumbnail({
        videoId,
        scriptText: script,
        audioUrl,
        topic,
        voice,
        videoStyle,
        duration
      });
      
      thumbnailUrl = await uploadThumbnail(videoId, thumbnailBuffer);
      
      console.log(`Generated video preview and thumbnail for ${videoId}`);
      
    } catch (uploadError) {
      console.error('Video/thumbnail generation failed:', uploadError);
      // Fallback to simple text content
      const fallbackContent = JSON.stringify({
        title: topic,
        character: voice,
        style: videoStyle,
        scriptLength: script.length,
        duration,
        message: "Video preview generation in progress..."
      }, null, 2);
      
      const fallbackBuffer = Buffer.from(fallbackContent);
      videoUrl = await uploadVideo(videoId, fallbackBuffer);
    }

    // Update video with final URLs, duration, and status
    await db.video.update({
      where: { id: videoId },
      data: { 
        videoUrl,
        thumbnailUrl,
        duration,
        status: "COMPLETED"
      },
    });
    
    await completeJob(videoJobId);

    return { videoUrl, audioUrl, script };
  } catch (error) {
    // Update video status on failure
    await db.video.update({
      where: { id: videoId },
      data: { status: "FAILED" },
    });
    
    // Mark any pending jobs as failed
    await db.job.updateMany({
      where: { 
        videoId,
        status: "PROCESSING"
      },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        finishedAt: new Date(),
      },
    });

    throw error;
  }
}

async function createJob(videoId: string, type: "SCRIPT_GENERATION" | "AUDIO_GENERATION" | "VIDEO_RENDERING") {
  const job = await db.job.create({
    data: {
      videoId,
      type,
      status: "PROCESSING",
      progress: 0,
    },
  });
  return job.id;
}

async function completeJob(jobId: string) {
  await db.job.update({
    where: { id: jobId },
    data: {
      status: "COMPLETED",
      progress: 100,
      finishedAt: new Date(),
    },
  });
}

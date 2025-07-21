import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { processVideoGeneration } from "~/lib/job-processor";
import { getCachedVideoUrl } from "~/lib/video-cache";

export const videoRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        topic: z.string().min(1, "Topic is required"),
        voice: z.enum([
          "PETER_GRIFFIN",
          "STEWIE_GRIFFIN"
        ]),
        videoStyle: z.enum([
          "BRAINROT_CLASSIC",
          "SUBWAY_SURFERS",
          "MINECRAFT_PARKOUR",
          "FAMILY_GUY_FUNNY_MOMENTS",
          "SATISFYING_SLIME",
          "DISCORD_CHAT",
          "REDDIT_STORY",
          "ASMR_COOKING",
          "TIKTOK_COMPILATION",
          "GAMING_HIGHLIGHTS"
        ]).default("BRAINROT_CLASSIC"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.db.video.create({
        data: {
          title: input.title,
          description: input.description,
          topic: input.topic,
          voice: input.voice,
          videoStyle: input.videoStyle,
          status: "PENDING",
        },
      });

      // Process video generation asynchronously
      // Note: This will run in the background - consider using a queue system for production
      processVideoGeneration(video.id, input.topic, input.voice, input.videoStyle).catch((error) => {
        console.error("Video generation failed:", error);
      });

      return video;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.video.findUnique({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const videos = await ctx.db.video.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined = undefined;
      if (videos.length > input.limit) {
        const nextItem = videos.pop();
        nextCursor = nextItem?.id;
      }

      return {
        videos,
        nextCursor,
      };
    }),

  getJobs: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.job.findMany({
        where: { videoId: input.videoId },
        orderBy: { createdAt: "asc" },
      });
    }),

  download: publicProcedure
    .input(z.object({ id: z.string(), type: z.enum(["video", "audio", "script"]) }))
    .query(async ({ ctx, input }) => {
      const video = await ctx.db.video.findUnique({
        where: { id: input.id },
      });

      if (!video) {
        throw new Error("Video not found");
      }

      switch (input.type) {
        case "video":
          return { url: video.videoUrl, filename: `${video.title}-video.mp4` };
        case "audio":
          return { url: video.audioUrl, filename: `${video.title}-audio.mp3` };
        case "script":
          return { 
            content: video.scriptText, 
            filename: `${video.title}-script.txt`,
            type: "text/plain"
          };
        default:
          throw new Error("Invalid download type");
      }
    }),

  getCachedVideoUrl: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const video = await ctx.db.video.findUnique({
        where: { id: input.id },
      });

      if (!video) {
        throw new Error("Video not found");
      }

      const cachedUrl = await getCachedVideoUrl(video.videoUrl);

      return { url: cachedUrl };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete associated jobs first
      await ctx.db.job.deleteMany({
        where: { videoId: input.id },
      });

      // Delete the video
      return ctx.db.video.delete({
        where: { id: input.id },
      });
    }),
});

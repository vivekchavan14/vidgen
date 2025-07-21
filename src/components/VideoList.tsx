"use client";

import { api } from "~/lib/trpc/provider";

export default function VideoList() {
  const { data: videosData, isLoading, error } = api.video.getAll.useQuery({
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
          <span className="text-white">Loading videos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8">
        <p className="text-red-200">Error loading videos: {error.message}</p>
      </div>
    );
  }

  const videos = videosData?.videos ?? [];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">My Videos</h2>
      
      {videos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">No videos yet!</p>
          <p className="text-sm text-gray-400">
            Create your first brainrot video using the Create Video tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const downloadVideo = api.video.download.useQuery(
    { id: video.id, type: "video" },
    { enabled: false }
  );
  const downloadAudio = api.video.download.useQuery(
    { id: video.id, type: "audio" },
    { enabled: false }
  );
  const downloadScript = api.video.download.useQuery(
    { id: video.id, type: "script" },
    { enabled: false }
  );

  const handleDownload = async (type: "video" | "audio" | "script") => {
    try {
      let downloadData;
      switch (type) {
        case "video":
          downloadData = await downloadVideo.refetch();
          break;
        case "audio":
          downloadData = await downloadAudio.refetch();
          break;
        case "script":
          downloadData = await downloadScript.refetch();
          break;
      }

      if (downloadData?.data) {
        if (type === "script") {
          // Download script as text file
          const blob = new Blob([downloadData.data.content || ""], { type: "text/plain" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = downloadData.data.filename || `${video.title}-script.txt`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          // Download video/audio from URL
          const url = downloadData.data.url;
          if (url) {
            const a = document.createElement("a");
            a.href = url;
            a.download = downloadData.data.filename || `${video.title}-${type}`;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to download ${type}:`, error);
      alert(`Failed to download ${type}. Please try again.`);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-200 border-green-500/30";
      case "PROCESSING":
        return "bg-blue-500/20 text-blue-200 border-blue-500/30";
      case "FAILED":
        return "bg-red-500/20 text-red-200 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
    }
  };

  const getVoiceEmoji = (voice: string) => {
    switch (voice) {
      case "PETER_GRIFFIN":
        return "👨";
      case "STEWIE_GRIFFIN":
        return "👶";
      default:
        return "🎭";
    }
  };

  const getVideoStyleEmoji = (style: string) => {
    switch (style) {
      case "BRAINROT_CLASSIC":
        return "🧠";
      case "SUBWAY_SURFERS":
        return "🏄";
      case "MINECRAFT_PARKOUR":
        return "⛏️";
      case "FAMILY_GUY_FUNNY_MOMENTS":
        return "😂";
      case "SATISFYING_SLIME":
        return "🌈";
      case "DISCORD_CHAT":
        return "💬";
      case "REDDIT_STORY":
        return "📖";
      case "ASMR_COOKING":
        return "🍳";
      case "TIKTOK_COMPILATION":
        return "📱";
      case "GAMING_HIGHLIGHTS":
        return "🎮";
      default:
        return "🎨";
    }
  };

  return (
    <div className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white truncate mr-2">{video.title}</h3>
        <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(video.status)}`}>
          {video.status}
        </span>
      </div>
      
      {video.description && (
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{video.description}</p>
      )}
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Topic:</span>
          <span className="text-white">{video.topic}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Voice:</span>
          <span className="text-white">
            {getVoiceEmoji(video.voice)} {video.voice.replace("_", " ")}
          </span>
        </div>
        
        {video.videoStyle && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Style:</span>
            <span className="text-white">
              {getVideoStyleEmoji(video.videoStyle)} {video.videoStyle.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Created:</span>
          <span className="text-white">
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {video.status === "COMPLETED" && (
        <div className="mt-4 pt-3 border-t border-white/20 space-y-3">
          {/* Video Preview */}
          {video.previewUrl && (
            <div className="w-full">
              <video
                controls
                className="w-full rounded-lg bg-black"
                poster={video.thumbnailUrl || undefined}
                preload="metadata"
              >
                <source src={video.previewUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {/* Download Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDownload("video")}
              className="flex items-center px-3 py-2 bg-green-600/20 text-green-200 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors text-sm"
              disabled={downloadVideo.isFetching}
            >
              {downloadVideo.isFetching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              )}
              Video
            </button>
            
            <button
              onClick={() => handleDownload("audio")}
              className="flex items-center px-3 py-2 bg-blue-600/20 text-blue-200 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
              disabled={downloadAudio.isFetching}
            >
              {downloadAudio.isFetching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M9 14l-2-2-2 2" />
                </svg>
              )}
              Audio
            </button>
            
            <button
              onClick={() => handleDownload("script")}
              className="flex items-center px-3 py-2 bg-purple-600/20 text-purple-200 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
              disabled={downloadScript.isFetching}
            >
              {downloadScript.isFetching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              Script
            </button>
          </div>
          
          {/* Legacy Watch Video Link (fallback if no preview) */}
          {!video.previewUrl && video.videoUrl && (
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm"
            >
              <span>Watch Video</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
      
      {video.status === "PROCESSING" && (
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
            <span className="text-sm text-blue-200">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}

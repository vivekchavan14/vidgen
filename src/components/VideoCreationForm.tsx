"use client";

import { useState } from "react";
import { api } from "~/lib/trpc/provider";

export default function VideoCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [voice, setVoice] = useState("PETER_GRIFFIN");
  const [videoStyle, setVideoStyle] = useState("BRAINROT_CLASSIC");

  const createVideo = api.video.create.useMutation({
    onSuccess: (data) => {
      console.log("Video creation started:", data);
      // Reset form
      setTitle("");
      setDescription("");
      setTopic("");
      setVoice("PETER_GRIFFIN");
      setVideoStyle("BRAINROT_CLASSIC");
      alert("Video generation started! Check the My Videos tab to see progress.");
    },
    onError: (error) => {
      console.error("Error creating video:", error);
      alert("Error creating video: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVideo.mutate({
      title,
      description,
      topic,
      voice,
      videoStyle,
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Video</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a catchy title for your video"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of your video"
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-white mb-2">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What should the video be about? (e.g., 'Quantum Physics', 'Ancient Rome')"
            required
          />
        </div>

        <div>
          <label htmlFor="voice" className="block text-sm font-medium text-white mb-2">
            🎭 Voice Character
          </label>
          <select
            id="voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PETER_GRIFFIN" className="text-gray-900">👨 Peter Griffin</option>
            <option value="STEWIE_GRIFFIN" className="text-gray-900">👶 Stewie Griffin</option>
          </select>
        </div>

        <div>
          <label htmlFor="videoStyle" className="block text-sm font-medium text-white mb-2">
            🎨 Video Style
          </label>
          <select
            id="videoStyle"
            value={videoStyle}
            onChange={(e) => setVideoStyle(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BRAINROT_CLASSIC" className="text-gray-900">🧠 Brainrot Classic</option>
            <option value="SUBWAY_SURFERS" className="text-gray-900">🏄 Subway Surfers</option>
            <option value="MINECRAFT_PARKOUR" className="text-gray-900">⛏️ Minecraft Parkour</option>
            <option value="FAMILY_GUY_FUNNY_MOMENTS" className="text-gray-900">😂 Family Guy Funny Moments</option>
            <option value="SATISFYING_SLIME" className="text-gray-900">🌈 Satisfying Slime</option>
            <option value="DISCORD_CHAT" className="text-gray-900">💬 Discord Chat</option>
            <option value="REDDIT_STORY" className="text-gray-900">📖 Reddit Story</option>
            <option value="ASMR_COOKING" className="text-gray-900">🍳 ASMR Cooking</option>
            <option value="TIKTOK_COMPILATION" className="text-gray-900">📱 TikTok Compilation</option>
            <option value="GAMING_HIGHLIGHTS" className="text-gray-900">🎮 Gaming Highlights</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={createVideo.isPending}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
        >
          {createVideo.isPending ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Video...
            </div>
          ) : (
            "🚀 Generate Video"
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-200">
          <strong>Note:</strong> Video generation can take 10-20 minutes. The AI will create a script, 
          generate audio using the selected voice, and render the final video with brainrot-style visuals.
        </p>
      </div>
    </div>
  );
}

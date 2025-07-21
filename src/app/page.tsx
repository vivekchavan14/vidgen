"use client";

import { useState } from "react";
import { api } from "~/lib/trpc/provider";
import VideoCreationForm from "~/components/VideoCreationForm";
import VideoList from "~/components/VideoList";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"create" | "videos">("create");

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🧠 Brainrot Video Generator
          </h1>
          <p className="text-xl text-gray-300">
            Create faceless educational videos in brainrot style using AI
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === "create"
                    ? "bg-white text-gray-900"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Create Video
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === "videos"
                    ? "bg-white text-gray-900"
                    : "text-white hover:bg-white/10"
                }`}
              >
                My Videos
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "create" ? <VideoCreationForm /> : <VideoList />}
        </div>
      </div>
    </main>
  );
}

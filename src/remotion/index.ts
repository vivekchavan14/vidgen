import { Composition } from "@remotion/core";
import { registerRoot } from "@remotion/core";
import BrainrotComposition from "./Composition";

registerRoot(() => {
  return (
    <>
      <Composition
        id="BrainrotVideo"
        component={BrainrotComposition}
        durationInFrames={150 * 30} // 30 seconds at 30 FPS, will be adjusted dynamically
        fps={30}
        width={1080}
        height={1920} // Vertical format for social media
        defaultProps={{
          scriptText: "Sample script text",
          audioUrl: "https://example.com/audio.mp3",
          topic: "Sample Topic",
          voice: "PETER_GRIFFIN",
          videoStyle: "BRAINROT_CLASSIC",
        }}
      />
    </>
  );
});

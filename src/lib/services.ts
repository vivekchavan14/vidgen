import OpenAI from "openai";
import Groq from "groq-sdk";
import axios from "axios";
import { env } from "~/env.js";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Initialize Groq client
export const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

// OpenAI TTS service with character-specific voice mapping
export async function generateSpeech(
  text: string,
  voiceType: string
): Promise<string> {
  const voiceMap: Record<string, string> = {
    "PETER_GRIFFIN": "onyx", // Deep, goofy voice for Peter
    "STEWIE_GRIFFIN": "echo", // Higher, more articulate for Stewie
    "DEFAULT": "alloy",
  };

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd", // Higher quality model (only $15/1M characters)
      voice: voiceMap[voiceType] || "alloy",
      input: text,
      speed: getVoiceSpeed(voiceType), // Adjust speed based on character
      response_format: "mp3", // Explicit format
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error generating speech with OpenAI:", error);
    throw new Error("Failed to generate speech with OpenAI TTS");
  }
}

// Helper function to get voice speed based on character
function getVoiceSpeed(voiceType: string): number {
  const speedMap: Record<string, number> = {
    "PETER_GRIFFIN": 0.9, // Slightly slower, goofy
    "STEWIE_GRIFFIN": 1.1, // Slightly faster, articulate
    "DEFAULT": 1.0,
  };
  
  return speedMap[voiceType] || 1.0;
}

// Character-specific speaking styles for Griffin family
function getCharacterStyle(voice: string): string {
  const styleMap: Record<string, string> = {
    "PETER_GRIFFIN": "Peter Griffin's conversational speaking style - talks directly to viewers like 'Hey there, family!', uses 'Lois', 'Holy crap!', 'Nyehehehe', tells random personal stories mid-explanation, gets distracted easily, asks rhetorical questions like 'You know what I mean?', makes pop culture references incorrectly, uses simple words, interrupts himself, acts like he's talking to friends at a bar",
    "STEWIE_GRIFFIN": "Stewie Griffin's conversational speaking style - addresses viewers condescendingly like 'Well hello there, you slack-jawed peasants', uses sophisticated vocabulary, says 'What the deuce?', 'Blast!', 'Victory is mine!', makes sarcastic asides, asks the audience questions mockingly, references his plans for world domination, speaks like he's lecturing inferior beings but in a charming way",
  };
  
  return styleMap[voice] || "a conversational, engaging style";
}

// Generate script using AI
export async function generateScript(topic: string, voice: string): Promise<string> {
  const characterStyle = getCharacterStyle(voice);
  
  const systemPrompt = `You are creating a SUPER CONVERSATIONAL "brainrot" style educational video script. The character should talk DIRECTLY to the viewer as if they're having a real conversation. The script MUST be:

🎯 CONVERSATIONAL REQUIREMENTS:
- Start with a direct greeting to viewers ("Hey what's up guys!" or "Well hello there!")
- Ask the audience questions throughout ("Have you ever wondered...?", "But wait, did you know...?")
- Use "you", "your", "we", "us" constantly - make it personal
- Include reaction prompts ("I know, crazy right?", "Wait for it...", "Are you ready for this?")
- Add pauses for effect ("And here's the thing...", "But here's where it gets interesting...")
- React to information as if discovering it live ("Wait, WHAT?!", "No way!", "That's insane!")
- Make side comments to the audience ("Between you and me...", "Don't tell anyone I said this...")

📝 CONTENT REQUIREMENTS:
- 2-3 minutes when spoken (300-450 words)
- Educational but entertaining with modern slang
- Written in ${characterStyle}
- Include "mind-blown" moments and unexpected facts
- Keep it engaging for Gen Z/millennial audience
- Feel like the character is genuinely excited to share this

💬 INTERACTION STYLE:
- Treat the audience like friends you're gossiping with
- Ask for engagement ("Let me know in the comments if...", "Smash that like if...")
- Create suspense ("But wait, there's more!", "You won't believe what happens next!")
- Use conversational fillers ("So like...", "And I'm like...", "You know what I mean?")

IMPORTANT: This should sound like the character is literally talking TO the viewer, not ABOUT a topic. Make it feel like a real conversation!`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Updated from deprecated mixtral-8x7b-32768
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a brainrot-style educational script about: ${topic}` }
      ],
      temperature: 0.8,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate script");
  }
}

import type { Codec } from './codec';
import type { AudioCodec } from './options/audio-codec';
export declare const canConcatAudioSeamlessly: (audioCodec: AudioCodec | null, chunkDurationInFrames: number) => boolean;
export declare const canConcatVideoSeamlessly: (codec: Codec) => codec is "h264";

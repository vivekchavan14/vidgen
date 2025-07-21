export declare const makeSharedElementSourceNode: ({ audioContext, ref, }: {
    audioContext: AudioContext;
    ref: React.RefObject<HTMLAudioElement | null>;
}) => {
    attemptToConnect: () => void;
    get: () => MediaElementAudioSourceNode;
};
export type SharedElementSourceNode = ReturnType<typeof makeSharedElementSourceNode>;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSharedElementSourceNode = void 0;
const makeSharedElementSourceNode = ({ audioContext, ref, }) => {
    let connected = null;
    return {
        attemptToConnect: () => {
            if (!connected && ref.current) {
                const mediaElementSourceNode = audioContext.createMediaElementSource(ref.current);
                connected = mediaElementSourceNode;
            }
        },
        get: () => {
            if (!connected) {
                throw new Error('Audio element not connected');
            }
            return connected;
        },
    };
};
exports.makeSharedElementSourceNode = makeSharedElementSourceNode;

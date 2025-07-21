"use strict";
// Cache the thumbnails of the timeline
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldFrames = exports.getAspectRatioFromCache = exports.getTimestampFromFrameDatabaseKey = exports.aspectRatioCache = exports.frameDatabase = exports.makeFrameDatabaseKey = void 0;
const makeFrameDatabaseKey = (src, timestamp) => `${src}|${timestamp}`;
exports.makeFrameDatabaseKey = makeFrameDatabaseKey;
exports.frameDatabase = new Map();
exports.aspectRatioCache = new Map();
const getTimestampFromFrameDatabaseKey = (key) => {
    const split = key.split('|');
    return Number(split[split.length - 1]);
};
exports.getTimestampFromFrameDatabaseKey = getTimestampFromFrameDatabaseKey;
const getAspectRatioFromCache = (src) => {
    const cached = exports.aspectRatioCache.get(src);
    if (cached) {
        return cached;
    }
    return null;
};
exports.getAspectRatioFromCache = getAspectRatioFromCache;
// a 16:9 thumbnail is 43x23px wide - 43 * 23 * 4 = 4052 bytes
// Our allowance is a 50MB frame cache, so we can store 12340 thumbnails
const MAX_FRAMES_IN_CACHE = 12340;
const clearOldFrames = () => {
    if (exports.frameDatabase.size <= MAX_FRAMES_IN_CACHE) {
        return;
    }
    const framesToRemove = Array.from(exports.frameDatabase.entries()).sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    for (const [key, frame] of framesToRemove.slice(0, framesToRemove.length - MAX_FRAMES_IN_CACHE)) {
        frame.frame.close();
        exports.frameDatabase.delete(key);
    }
};
exports.clearOldFrames = clearOldFrames;

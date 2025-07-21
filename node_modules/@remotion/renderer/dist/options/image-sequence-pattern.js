"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageSequencePatternOption = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const cliFlag = 'image-sequence-pattern';
let currentImageSequencePattern = null;
// Option for --image-sequence-pattern
exports.imageSequencePatternOption = {
    name: 'Image Sequence Pattern',
    cliFlag,
    ssrName: 'imageSequencePattern',
    description: () => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Pattern for naming image sequence files. Supports ", (0, jsx_runtime_1.jsx)("code", { children: "[frame]" }), " for the zero-padded frame number and ", (0, jsx_runtime_1.jsx)("code", { children: "[ext]" }), " for the file extension."] })),
    docLink: null,
    type: 'string',
    getValue: ({ commandLine }) => {
        if (currentImageSequencePattern !== null) {
            return {
                value: currentImageSequencePattern,
                source: 'config',
            };
        }
        return {
            value: commandLine[cliFlag],
            source: 'cli',
        };
    },
    setConfig: (pattern) => {
        currentImageSequencePattern = pattern;
    },
};

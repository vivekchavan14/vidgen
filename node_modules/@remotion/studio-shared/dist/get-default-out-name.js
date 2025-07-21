"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultOutLocation = void 0;
const getDefaultOutLocation = ({ compositionName, defaultExtension, type, compositionDefaultOutName, }) => {
    const nameToUse = compositionDefaultOutName !== null && compositionDefaultOutName !== void 0 ? compositionDefaultOutName : compositionName;
    if (type === 'sequence') {
        return `out/${nameToUse}`;
    }
    return `out/${nameToUse}.${defaultExtension}`;
};
exports.getDefaultOutLocation = getDefaultOutLocation;

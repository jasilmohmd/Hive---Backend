"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLiveKitSdk = loadLiveKitSdk;
let sdkPromise = null;
const importLiveKitSdk = new Function("return import('livekit-server-sdk')");
async function loadLiveKitSdk() {
    if (!sdkPromise) {
        sdkPromise = importLiveKitSdk();
    }
    return sdkPromise;
}

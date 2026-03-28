// Generate a loud, attention-grabbing alarm WAV file
// Pattern: dual-tone beeps like a phone ringtone, 4 seconds, loops seamlessly
const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 4; // seconds - will loop
const totalSamples = sampleRate * duration;
const numChannels = 1;
const bitsPerSample = 16;
const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
const blockAlign = numChannels * (bitsPerSample / 8);
const dataSize = totalSamples * blockAlign;

const buffer = Buffer.alloc(44 + dataSize);

// WAV header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(bitsPerSample, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Generate aggressive phone-call style alarm
// Pattern: 0.0-0.4s RING, 0.4-0.6s silence, 0.6-1.0s RING, 1.0-1.4s silence (repeats)
for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const cyclePos = t % 2.0; // 2-second cycle
    
    let sample = 0;
    
    // Ring pattern: two short bursts per cycle
    const isRing1 = cyclePos >= 0.0 && cyclePos < 0.5;
    const isRing2 = cyclePos >= 0.7 && cyclePos < 1.2;
    
    if (isRing1 || isRing2) {
        // European-style phone ring: mix of 425Hz and 850Hz with tremolo
        const tremolo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 20 * t); // 20Hz tremolo for urgency
        const tone1 = Math.sin(2 * Math.PI * 850 * t);
        const tone2 = Math.sin(2 * Math.PI * 1200 * t);
        const tone3 = Math.sin(2 * Math.PI * 640 * t) * 0.3;
        sample = (tone1 * 0.5 + tone2 * 0.35 + tone3) * tremolo * 0.95;
        
        // Soft attack/release to avoid clicks
        let localT, localDur;
        if (isRing1) {
            localT = cyclePos;
            localDur = 0.5;
        } else {
            localT = cyclePos - 0.7;
            localDur = 0.5;
        }
        const attackRelease = Math.min(localT / 0.01, 1) * Math.min((localDur - localT) / 0.01, 1);
        sample *= Math.max(0, Math.min(1, attackRelease));
    }
    
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
}

const outDir = path.join(__dirname, '..', 'public', 'sounds');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const outPath = path.join(outDir, 'order-alarm.wav');
fs.writeFileSync(outPath, buffer);
console.log(`Alarm sound generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

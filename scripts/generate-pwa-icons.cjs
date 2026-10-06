const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Ensure public directory exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate icon.svg
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="100%" stop-color="#052e16" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#86efac" />
      <stop offset="100%" stop-color="#22c55e" />
    </linearGradient>
  </defs>

  <!-- Background Shield / Squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Outer Ring Accent -->
  <circle cx="256" cy="256" r="216" fill="none" stroke="url(#goldGrad)" stroke-width="8" opacity="0.4" stroke-dasharray="14 10" />

  <!-- Central Agriculture Wheat & Plant Emblem -->
  <g transform="translate(256, 240)">
    <!-- Central Stalk -->
    <path d="M0,150 C0,60 0,-10 0,-90" stroke="#fef08a" stroke-width="10" stroke-linecap="round" fill="none" />

    <!-- Left Spikes -->
    <path d="M-6,-60 C-35,-85 -70,-65 -50,-35 C-35,-15 -10,-40 -6,-60 Z" fill="url(#goldGrad)" />
    <path d="M-6,-15 C-42,-35 -80,-15 -55,15 C-38,35 -10,0 -6,-15 Z" fill="url(#goldGrad)" />
    <path d="M-6,30 C-46,15 -85,40 -58,68 C-40,88 -10,48 -6,30 Z" fill="url(#goldGrad)" />
    <path d="M-6,75 C-42,65 -75,95 -48,118 C-30,132 -10,95 -6,75 Z" fill="url(#goldGrad)" />

    <!-- Right Spikes -->
    <path d="M6,-60 C35,-85 70,-65 50,-35 C35,-15 10,-40 6,-60 Z" fill="url(#goldGrad)" />
    <path d="M6,-15 C42,-35 80,-15 55,15 C38,35 10,0 6,-15 Z" fill="url(#goldGrad)" />
    <path d="M6,30 C46,15 85,40 58,68 C40,88 10,48 6,30 Z" fill="url(#goldGrad)" />
    <path d="M6,75 C42,65 75,95 48,118 C30,132 10,95 6,75 Z" fill="url(#goldGrad)" />

    <!-- Top Crown Spike -->
    <path d="M0,-140 C-18,-115 -12,-85 0,-70 C12,-85 18,-115 0,-140 Z" fill="url(#goldGrad)" />

    <!-- Fertilizer Droplet / Sprout Leaf -->
    <path d="M0,40 C-45,70 -45,130 0,165 C45,130 45,70 0,40 Z" fill="url(#leafGrad)" opacity="0.9" />
    <circle cx="0" cy="115" r="14" fill="#ffffff" opacity="0.9" />
  </g>

  <!-- Text Banner -->
  <rect x="100" y="405" width="312" height="52" rx="14" fill="#15803d" stroke="#fef08a" stroke-width="2.5" />
  <text x="256" y="438" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="3">IFFCO DBT POS</text>
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg, 'utf-8');
console.log('Created public/icon.svg');

// PNG Generation Helper
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, colorFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(height * (1 + width * 4));
  let pos = 0;
  for (let y = 0; y < height; y++) {
    raw[pos++] = 0; // Filter none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = colorFn(x, y, width, height);
      raw[pos++] = r;
      raw[pos++] = g;
      raw[pos++] = b;
      raw[pos++] = a;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Icon Drawing Function
function renderAppIcon(x, y, width, height, isMaskable = false) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = width / 2;

  // Background gradient: Rich forest green (#14532d to #052e16)
  const normY = y / height;
  let bgR = Math.round(20 * (1 - normY) + 5 * normY);
  let bgG = Math.round(83 * (1 - normY) + 46 * normY);
  let bgB = Math.round(45 * (1 - normY) + 22 * normY);

  if (!isMaskable) {
    // Rounded squircle corner check (corner radius ~ 22%)
    const cr = width * 0.22;
    const qx = Math.max(0, Math.abs(dx) - (cx - cr));
    const qy = Math.max(0, Math.abs(dy) - (cy - cr));
    if (Math.sqrt(qx * qx + qy * qy) > cr) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }
  }

  // Inner decorative ring
  const ringR = width * (isMaskable ? 0.38 : 0.42);
  const ringDist = Math.abs(dist - ringR);
  if (ringDist < width * 0.012) {
    return [234, 179, 8, 200]; // Gold ring accent
  }

  // Center Wheat / Sprout symbol
  const scale = isMaskable ? 0.72 : 0.85;
  const sx = (x - cx) / scale;
  const sy = (y - cy) / scale;

  // Central stalk line
  if (Math.abs(sx) <= width * 0.018 && sy >= -height * 0.25 && sy <= height * 0.32) {
    return [254, 240, 138, 255]; // Light gold
  }

  // Sprout / leaf droplet shape at center-bottom
  const dropDy = sy - height * 0.12;
  const dropDx = sx;
  const dropDist = Math.sqrt(dropDx * dropDx + dropDy * dropDy);
  if (dropDist < width * 0.12) {
    // Green gradient
    return [34, 197, 94, 255];
  }
  if (dropDist < width * 0.04) {
    return [255, 255, 255, 255]; // White inner core
  }

  // Golden wheat grains
  const grainPairs = [
    { yOffset: -height * 0.28, xOffset: 0, r: width * 0.045 },
    { yOffset: -height * 0.18, xOffset: width * 0.09, r: width * 0.05 },
    { yOffset: -height * 0.18, xOffset: -width * 0.09, r: width * 0.05 },
    { yOffset: -height * 0.07, xOffset: width * 0.11, r: width * 0.055 },
    { yOffset: -height * 0.07, xOffset: -width * 0.11, r: width * 0.055 },
    { yOffset: height * 0.04, xOffset: width * 0.11, r: width * 0.055 },
    { yOffset: height * 0.04, xOffset: -width * 0.11, r: width * 0.055 },
  ];

  for (const g of grainPairs) {
    const gdx = sx - g.xOffset;
    const gdy = sy - g.yOffset;
    const gDist = Math.sqrt(gdx * gdx * 1.3 + gdy * gdy * 0.8);
    if (gDist <= g.r) {
      return [234, 179, 8, 255]; // Bright Gold
    }
    if (gDist <= g.r + width * 0.008) {
      return [254, 240, 138, 220]; // Outer highlight
    }
  }

  return [bgR, bgG, bgB, 255];
}

// Generate PNGs
const iconsToGenerate = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon.ico', size: 64, maskable: false },
];

for (const icon of iconsToGenerate) {
  const filePath = path.join(publicDir, icon.name);
  const pngData = createPng(icon.size, icon.size, (x, y, w, h) => renderAppIcon(x, y, w, h, icon.maskable));
  fs.writeFileSync(filePath, pngData);
  console.log(`Generated ${icon.name} (${icon.size}x${icon.size}) - ${pngData.length} bytes`);
}

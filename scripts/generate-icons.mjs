// Generate PWA icons as simple SVGs converted to PNG-like format.
// For a real production build, use actual PNG files.
// These SVG icons will work as PWA icons in most browsers.

import { writeFileSync } from "fs";

function createSVGIcon(size, maskable = false) {
  const padding = maskable ? size * 0.1 : 0;
  const innerSize = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;
  const fontSize = innerSize * 0.35;
  const subFontSize = innerSize * 0.1;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${maskable ? 0 : size * 0.15}"/>
  <text x="${cx}" y="${cy - subFontSize * 0.5}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="white">CB</text>
  <text x="${cx}" y="${cy + fontSize * 0.6}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${subFontSize}" font-weight="400" fill="rgba(255,255,255,0.85)">ClaimBack</text>
</svg>`;
}

writeFileSync("public/icons/icon-192.svg", createSVGIcon(192));
writeFileSync("public/icons/icon-512.svg", createSVGIcon(512));
writeFileSync("public/icons/icon-maskable-512.svg", createSVGIcon(512, true));

console.log("SVG icons generated in public/icons/");

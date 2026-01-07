import fs from 'fs';
import icongen from 'icon-gen';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPathArg = process.argv[2];
const inputSvg = svgPathArg
  ? path.resolve(svgPathArg)
  : path.join(__dirname, '..', 'Logo.svg');

const outputDir = path.join(__dirname, '..', 'resources');
const tempDir = path.join(__dirname, '..', 'resources', 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function generatePNG(): Promise<void> {
  await sharp(inputSvg, { density: 600 })
    .resize(1024, 1024, { kernel: 'nearest' as const, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 0, adaptiveFiltering: false, palette: false })
    .toFile(path.join(outputDir, 'icon.png'));
}

async function generateICO(): Promise<void> {
  const basePng = path.join(outputDir, 'icon.png');
  const icoSizes = [16, 24, 32, 40, 48, 64, 96, 128, 256];
  let icoSourcePath: string;

  for (const size of icoSizes) {
    const tempPngPath = path.join(tempDir, `ico_${size}.png`);
    await sharp(basePng)
      .resize(size, size, {
        kernel: 'nearest' as const,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 0, adaptiveFiltering: false })
      .toFile(tempPngPath);

    if (size === 256) icoSourcePath = tempPngPath;
  }

  await icongen(icoSourcePath!, outputDir, {
    ico: { name: 'icon', sizes: icoSizes }
  } as any);
}

async function generateICNS(): Promise<void> {
  const basePng = path.join(outputDir, 'icon.png');
  const icnsSizes = [16, 32, 64, 128, 256, 512, 1024];
  let icnsSourcePath: string;

  for (const size of icnsSizes) {
    const tempPngPath = path.join(tempDir, `icns_${size}.png`);
    await sharp(basePng)
      .resize(size, size, {
        kernel: 'nearest' as const,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 0, adaptiveFiltering: false })
      .toFile(tempPngPath);

    if (size === 1024) icnsSourcePath = tempPngPath;
  }

  await icongen(icnsSourcePath!, outputDir, {
    icns: { name: 'icon', sizes: icnsSizes }
  } as any);
}

function cleanup(): void {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  try {
    if (!fs.existsSync(inputSvg)) {
      throw new Error(`SVG file not found at: ${inputSvg}`);
    }

    if (!inputSvg.toLowerCase().endsWith('.svg')) {
      throw new Error('Input file must be an SVG file');
    }

    console.log(`Generating icons from ${path.basename(inputSvg)}...`);

    await generatePNG();
    await generateICO();
    await generateICNS();

    cleanup();

    console.log('✓ Icons generated successfully!');

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    cleanup();
    process.exit(1);
  }
}

main();

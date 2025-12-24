const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');
const tempDir = path.join(os.tmpdir(), 'origin-landing-build');
const landingTarget = path.join(projectRoot, 'public', 'landing');

const copy = (src, dest) => fs.cpSync(src, dest, { recursive: true });
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

const main = () => {
  const requiredPaths = ['src', 'index.html', 'vite.config.ts', 'package.json'];
  requiredPaths.forEach((p) => {
    if (!fs.existsSync(path.join(projectRoot, p))) {
      console.error(`Missing ${p} in project root, cannot build landing SPA.`);
      process.exit(1);
    }
  });

  // Prepare temp directory (avoid path issues with special characters).
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy minimal files needed for Vite build.
  copy(path.join(projectRoot, 'src'), path.join(tempDir, 'src'));
  copy(path.join(projectRoot, 'index.html'), path.join(tempDir, 'index.html'));
  copy(path.join(projectRoot, 'vite.config.ts'), path.join(tempDir, 'vite.config.ts'));
  copy(path.join(projectRoot, 'package.json'), path.join(tempDir, 'package.json'));
  if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
    copy(path.join(projectRoot, 'package-lock.json'), path.join(tempDir, 'package-lock.json'));
  }
  const rootAssets = ['image.png'];
  rootAssets.forEach((asset) => {
    const assetPath = path.join(projectRoot, asset);
    if (fs.existsSync(assetPath)) {
      copy(assetPath, path.join(tempDir, asset));
    }
  });

  console.log('Installing SPA deps in temp dir...');
  run('npm install', tempDir);
  console.log('Building SPA...');
  run('npx vite build --base /landing/', tempDir);

  const buildOutput = path.join(tempDir, 'build');
  if (!fs.existsSync(buildOutput)) {
    console.error('Build output missing at', buildOutput);
    process.exit(1);
  }

  // Replace landing assets in /public/landing.
  fs.rmSync(landingTarget, { recursive: true, force: true });
  fs.mkdirSync(landingTarget, { recursive: true });
  copy(buildOutput, landingTarget);

  console.log('✅ Landing build complete. Output copied to', landingTarget);
};

main();

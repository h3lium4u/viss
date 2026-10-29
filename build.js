const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname);
const distDir = path.join(rootDir, "dist");

console.log("Building static output for Vercel deployment...");

// Clean existing dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy root index.html to dist/index.html
copyRecursive(path.join(rootDir, "index.html"), path.join(distDir, "index.html"));

// Copy webapp directory to dist/webapp
copyRecursive(path.join(rootDir, "webapp"), path.join(distDir, "webapp"));

console.log("Static build succeeded: Assets copied to /dist");

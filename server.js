const http = require("http");
const fs = require("fs");
const path = require("path");

const PRIMARY_PORT = process.env.PORT || 8080;
const SECONDARY_PORT = 5173;

const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".xml": "application/xml; charset=UTF-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".properties": "text/plain; charset=UTF-8"
};

function getCandidatePaths(safePath) {
  return [
    path.join(__dirname, "dist", safePath),
    path.join(__dirname, safePath),
    path.join(process.cwd(), "dist", safePath),
    path.join(process.cwd(), safePath),
    path.resolve(__dirname, "..", safePath),
    path.resolve(__dirname, "..", "dist", safePath)
  ];
}

function requestHandler(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  const candidates = getCandidatePaths(safePath);

  let targetPath = null;
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        const stat = fs.statSync(c);
        if (stat.isFile()) {
          targetPath = c;
          break;
        } else if (stat.isDirectory()) {
          const indexFile = path.join(c, "index.html");
          if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) {
            targetPath = indexFile;
            break;
          }
        }
      }
    } catch (e) {}
  }

  // Fallback to index.html if not found
  if (!targetPath) {
    const fallbackCandidates = getCandidatePaths("index.html");
    for (const fc of fallbackCandidates) {
      try {
        if (fs.existsSync(fc) && fs.statSync(fc).isFile()) {
          targetPath = fc;
          break;
        }
      } catch (e) {}
    }
  }

  if (!targetPath) {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=UTF-8",
      "Access-Control-Allow-Origin": "*"
    });
    res.end("404 Not Found: " + pathname);
    return;
  }

  const ext = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const stat = fs.statSync(targetPath);

  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stat.size,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=0, must-revalidate"
  });

  fs.createReadStream(targetPath).pipe(res);
}

// Local standalone server startup
if (require.main === module || !process.env.VERCEL) {
  function startServer(port) {
    const s = http.createServer(requestHandler);
    s.listen(port, "127.0.0.1", () => {
      console.log(`SAPUI5 Server listening at: http://127.0.0.1:${port}/ and http://localhost:${port}/`);
    });
    s.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} in use, skipping...`);
      }
    });
    return s;
  }

  startServer(PRIMARY_PORT);
  startServer(SECONDARY_PORT);

  console.log(`\n======================================================`);
  console.log(` SAPUI5 Assigned vs Not Assigned Dashboard`);
  console.log(` Server running at: http://127.0.0.1:${PRIMARY_PORT}/`);
  console.log(` Server running at: http://127.0.0.1:${SECONDARY_PORT}/`);
  console.log(`======================================================\n`);
}

// Export for Vercel Serverless Function runtime
module.exports = requestHandler;

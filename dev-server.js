const http = require("http");
const fs = require("fs");
const path = require("path");

const PRIMARY_PORT = process.env.PORT || 8080;
const SECONDARY_PORT = 5173;
const PUBLIC_DIR = path.resolve(__dirname);

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

function requestHandler(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  let filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log(`[404] ${req.method} ${pathname}`);
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      });
      res.end("404 Not Found: " + pathname);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    console.log(`[200] ${req.method} ${pathname} (${contentType})`);

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
}

function startServer(port) {
  const s = http.createServer(requestHandler);
  s.listen(port, "127.0.0.1", () => {
    console.log(`SAPUI5 Server listening at: http://127.0.0.1:${port}/ and http://localhost:${port}/`);
  });
  s.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, skipping...`);
    } else {
      console.error(`Server error on port ${port}:`, err);
    }
  });
  return s;
}

const server1 = startServer(PRIMARY_PORT);
const server2 = startServer(SECONDARY_PORT);

console.log(`\n======================================================`);
console.log(` SAPUI5 Assigned vs Not Assigned Dashboard`);
console.log(` Available on:`);
console.log(`   - http://127.0.0.1:${PRIMARY_PORT}/`);
console.log(`   - http://127.0.0.1:${SECONDARY_PORT}/`);
console.log(`   - http://127.0.0.1:${PRIMARY_PORT}/webapp/index.html`);
console.log(`======================================================\n`);

process.on("SIGINT", () => {
  server1.close();
  server2.close();
  process.exit(0);
});

const http = require("http");
const fs = require("fs");
const path = require("path");
const songsHandler = require("./api/songs");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url, `http://${host}`);
  const pathname = parsedUrl.pathname;

  // Polyfill response helpers for Vercel serverless function compatibility
  res.status = function (statusCode) {
    this.statusCode = statusCode;
    return this;
  };
  res.json = function (data) {
    this.setHeader("Content-Type", "application/json; charset=utf-8");
    this.end(JSON.stringify(data));
  };

  // Route: /api/songs
  if (pathname === "/api/songs") {
    req.query = Object.fromEntries(parsedUrl.searchParams.entries());
    try {
      return songsHandler(req, res);
    } catch (err) {
      console.error("API error:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  // Route: Static files from public/
  let filePath = path.join(PUBLIC_DIR, pathname === "/" ? "index.html" : pathname);
  
  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not Found");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Mini Spotify local dev server running at: http://localhost:${PORT}`);
});

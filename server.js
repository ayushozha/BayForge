const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const publicFiles = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/script.js", "script.js"],
  ["/assets/1.png", "assets/1.png"],
  ["/assets/2.png", "assets/2.png"],
  ["/assets/3.png", "assets/3.png"],
  ["/assets/4.png", "assets/4.png"],
  ["/assets/5.png", "assets/5.png"],
  ["/assets/6.png", "assets/6.png"],
  ["/assets/7.png", "assets/7.png"]
]);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8"
};

loadEnvFile(".env.local");
loadEnvFile(".env");

const port = Number(process.env.PORT || 4173);
const waitlistUrl =
  process.env.WAITLIST_API_URL ||
  "https://emailwaitlist.ayushojha.com/api/v1/subscribe";
const waitlistStatsUrl =
  process.env.WAITLIST_STATS_URL ||
  waitlistUrl.replace(/\/subscribe\/?$/, "/stats");
const waitlistApiKey = process.env.WAITLIST_API_KEY || "";

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/health") {
      return json(res, 200, { status: "ok" });
    }

    if (req.method === "GET" && url.pathname === "/favicon.ico") {
      res.writeHead(204, { "Cache-Control": "public, max-age=86400" });
      res.end();
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/subscribe") {
      return handleSubscribe(req, res);
    }

    if (req.method === "GET" && url.pathname === "/api/community-stats") {
      return handleCommunityStats(res);
    }

    if (req.method === "GET" && publicFiles.has(url.pathname)) {
      return serveFile(res, publicFiles.get(url.pathname));
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  } catch (error) {
    console.error(error);
    json(res, 500, { error: "Unexpected server error." });
  }
});

server.listen(port, () => {
  console.log(`Bay Forge landing running at http://localhost:${port}`);
  if (!waitlistApiKey) {
    console.log("WAITLIST_API_KEY is not set; signup requests will return 500.");
  }
});

async function handleSubscribe(req, res) {
  const body = await readJsonBody(req, 10 * 1024);
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!isEmail(email)) {
    return json(res, 400, { error: "Please enter a valid email address." });
  }

  if (!waitlistApiKey) {
    return json(res, 500, {
      error: "Waitlist is not configured yet. Set WAITLIST_API_KEY on the server."
    });
  }

  const metadata =
    body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? body.metadata
      : {};

  const upstreamPayload = {
    email,
    metadata: {
      ...metadata,
      source: metadata.source || "bayforge-landing",
      submitted_via: "bayforge-proxy"
    }
  };

  const upstream = await fetch(waitlistUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": waitlistApiKey
    },
    body: JSON.stringify(upstreamPayload)
  });

  const responseText = await upstream.text();
  const data = parseJson(responseText);

  if (upstream.ok) {
    const stats = await getCommunityStats().catch(() => null);
    return json(res, 201, {
      message: data.message || "Successfully joined the waitlist!",
      total: stats ? stats.total : null
    });
  }

  const fallback = {
    400: "Please enter a valid email address.",
    401: "Waitlist configuration is invalid.",
    409: "You're already on the Bay Forge list.",
    429: "Too many requests. Please try again in a minute."
  };

  return json(res, upstream.status, {
    error: data.error || data.message || fallback[upstream.status] || "Signup failed."
  });
}

async function handleCommunityStats(res) {
  if (!waitlistApiKey) {
    return json(res, 200, {
      configured: false,
      total: null,
      error: "WAITLIST_API_KEY is not set."
    });
  }

  try {
    const stats = await getCommunityStats();
    return json(res, 200, {
      configured: true,
      total: stats.total,
      today: stats.today,
      this_week: stats.this_week,
      this_month: stats.this_month
    });
  } catch {
    return json(res, 502, {
      configured: true,
      total: null,
      error: "Unable to load waitlist stats."
    });
  }
}

async function getCommunityStats() {
  const upstream = await fetch(waitlistStatsUrl, {
    method: "GET",
    headers: {
      "X-API-Key": waitlistApiKey
    }
  });

  if (!upstream.ok) {
    throw new Error(`Stats request failed with ${upstream.status}`);
  }

  const stats = await upstream.json();
  return {
    ...stats,
    total: typeof stats.total === "number" ? stats.total : null
  };
}

function serveFile(res, relativePath) {
  const absolutePath = path.join(rootDir, relativePath);

  fs.readFile(absolutePath, (error, file) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const extension = path.extname(absolutePath);
    res.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": [".html", ".css", ".js"].includes(extension)
        ? "no-cache"
        : "public, max-age=3600"
    });
    res.end(file);
  });
}

function readJsonBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", chunk => {
      raw += chunk;
      if (Buffer.byteLength(raw) > limitBytes) {
        reject(new Error("Request body too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });

    req.on("error", reject);
  });
}

function json(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function loadEnvFile(fileName) {
  const envPath = path.join(rootDir, fileName);
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

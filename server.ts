import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import https from "https";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Load our generated database once
  const dataPath = path.join(process.cwd(), 'src', 'data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // API route for PDF proxy using path parameter
  app.get("/api/pdf/:filename", async (req, res) => {
    const filename = req.params.filename;
    if (!filename) return res.status(400).send("No filename provided");

    const workingUrl = `https://www.miracolieucaristici.org/en/download/${filename}`;

    // Try fetching from the working server
    https.get(workingUrl, (proxyRes) => {
      if (proxyRes.statusCode !== 200) {
         res.status(404).send("PDF not found on upstream server");
         return;
      }
      res.setHeader('Content-Type', 'application/pdf');
      proxyRes.pipe(res);
    }).on('error', (e) => {
      res.status(500).send("Proxy error");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

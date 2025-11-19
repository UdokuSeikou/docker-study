import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();

// CORS 有効化（開発向け）
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/hello", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Hello from backend! HotReload!6",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
  console.log("Hot reload is enabled with nodemon");
});
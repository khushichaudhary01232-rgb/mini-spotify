const songs = require("../songs.json");

// Vercel serverless function: GET /api/songs?q=search
module.exports = (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const result = songs.filter(
    s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );
  res.status(200).json(result);
};

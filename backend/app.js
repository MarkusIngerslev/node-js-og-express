import express from "express";
import fs from "fs/promises";

// ===== const til at lave database ===== //
const app = express();
const port = 3333;

// ===== Lytter til at hvilken port node.js er på ===== //
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});

// ===== ROUTE "/" - GET ===== //
app.get("/", (req, res) => {
    res.send(`Main page for node.js 👍`);
});

// ===== ROUTE show Artist ===== //
app.get("/users", async (req, res) => {
    const data = await fs.readFile("./data/artists.json");
    const artist = JSON.parse(data);

    res.json(artist);
});

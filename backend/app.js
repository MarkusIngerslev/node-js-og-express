import express from "express";
import fs from "fs/promises";
import cors from "cors";

// ===== const til at lave database ===== //
const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

// ===== Lytter til at hvilken port node.js er på ===== //
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});

// ===== ROUTE "/" - GET ===== //
app.get("/", async (req, res) => {
    res.send(`Main page for node.js 👍`);
});

// ===== ROUTE show Artist ===== //
app.get("/artists", async (req, res) => {
    const data = await fs.readFile("./data/artists.json");
    const artist = JSON.parse(data);

    res.json(artist);
});

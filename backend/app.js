import express from "express";
import fs from "fs/promises";
import cors from "cors";

// ===== const til at lave database ===== //
const app = express();
const port = process.env.PORT || 3333;

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

// ===== Show artists ===== //
// ROUTE "/artists" - GET
app.get("/artists", async (req, res) => {
    try {
        const data = await fs.readFile("./data/artists.json");
        const artist = JSON.parse(data);

        res.json(artist);
    } catch (error) {
        console.error("Error reading or parsing the JSON file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===== Create artists ===== //
// ROUTE "/artists" - POST
app.post("/artists", async (req, res) => {
    try {
        // Konstant for den nye kunstner
        const newArtist = req.body;

        // Lav en unik id for den nye kunstner baseret på tidsstempel
        newArtist.id = Number(new Date().getTime());

        // Load den nuværende database af kunstnere
        const data = await fs.readFile("./data/artists.json");
        const artists = JSON.parse(data);

        // Tjek om kunstneren allerede eksisterer i databasen
        const artistExists = artists.some((artist) => artist.name.toLowerCase() === newArtist.name.toLowerCase());

        if (artistExists) {
            return res.status(409).json({ error: "This artist already exists!" });
        }

        // Tilføj den nye kunstner til databasen
        artists.push(newArtist);

        // Overskriv databasen med de opdaterede kunstnere
        await fs.writeFile("./data/artists.json", JSON.stringify(artists));
        console.log(`Ny kunstner tilføjet til databasen: ${newArtist.name}`);

        res.status(201).json(artists); // Brug status 201 (Created) for at angive, at noget er blevet oprettet.
    } catch (error) {
        console.error("Error adding artist to database:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===== Update artists ===== //
// ROUTE "/artists/:id" - put
app.put("/artists/:id", async (req, res) => {
    try {
        // const til at gemme den givene artists id
        const id = Number(req.params.id);
        // indlæs nuværende artister i databasen
        const data = await fs.readFile("./data/artists.json");
        const artists = JSON.parse(data);
        // find den givende artist der skal opdateres ud fra id
        let artistToUpdate = artists.find((artist) => artist.id === id);

        // tjek om artisten findes
        if (!artistToUpdate) {
            return res.status(404).json({ error: "Artist not found" });
        }

        // sæt alle artistens information til at være den ny sendte fra client
        const body = req.body;
        artistToUpdate.name = body.name;
        artistToUpdate.birthdate = body.birthdate;
        artistToUpdate.activeSince = body.activeSince;
        artistToUpdate.genres = body.genres;
        artistToUpdate.labels = body.labels;
        artistToUpdate.website = body.website;
        artistToUpdate.image = body.image;
        artistToUpdate.shortDescription = body.shortDescription;
        artistToUpdate.stillActive = body.stillActive;

        // overskriv den "gamle" artist med den nye i databasen
        fs.writeFile("./data/artists.json", JSON.stringify(artists));
        // send tilbage den nye database
        res.json(artists);
    } catch (error) {
        console.error("Error updating artist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===== Delete artists ===== //
// ROUTE "/artists/:id" - DELETE
app.delete("/artists/:id", async (req, res) => {
    try {
        // const til at gemme den givene artists id
        const id = Number(req.params.id);

        // indlæs nuværende artister i databasen
        const artistsData = await fs.readFile("./data/artists.json");
        const artists = JSON.parse(artistsData);

        // indlæst nuværende artister i favoriter
        const favoritsData = await fs.readFile("./data/favorits.json");
        const favorits = JSON.parse(favoritsData);

        // filtrer alle artister der ikke har et id der matcher den, der er blevet sendt
        const newArtists = artists.filter((artist) => artist.id !== id);
        const newFavorits = favorits.filter((favorit) => favorit.id !== id);

        // overskriv database filen med de artister der ikke matcher det sendte id
        await fs.writeFile("./data/artists.json", JSON.stringify(newArtists));
        await fs.writeFile("./data/favorits.json", JSON.stringify(newFavorits));

        res.json({ message: "Artist deleted successfully" });
    } catch (error) {
        console.error("Error deleting artist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===== Favorit artists ===== //
// ROUTE "/favorits" - GET
app.get("/favorits", async (req, res) => {
    try {
        const data = await fs.readFile("./data/favorits.json");
        const artist = JSON.parse(data);
        res.json(artist);
    } catch (error) {
        console.error("Error reading or parsing the JSON file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ROUTE "/favorits" - POST
app.post("/favorits", async (req, res) => {
    try {
        // Konstant for den nye artist
        const newArtist = req.body;

        // Lav en unik id for den nye artist baseret på tidsstempel
        newArtist.id = Number(new Date().getTime());

        // Load den nuværende database af favoritkunstnere
        const data = await fs.readFile("./data/favorits.json");
        const artists = JSON.parse(data);

        // Tjek om kunstneren allerede eksisterer i favoritterne
        const artistExists = artists.some((artist) => artist.name.toLowerCase() === newArtist.name.toLowerCase());

        if (artistExists) {
            return res.status(409).json({ error: "This artist already exists in favorites!" });
        }

        // Tilføj den nye kunstner til favoritterne
        artists.push(newArtist);

        // Overskriv databasen med de opdaterede favoritter
        await fs.writeFile("./data/favorits.json", JSON.stringify(artists));

        console.log(`Ny kunstner tilføjet til favoritter: ${newArtist.name}`);

        res.status(201).json(artists); // Brug status 201 (Created) for at angive, at noget er blevet oprettet.
    } catch (error) {
        console.error("Error adding artist to favorites:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ===== Error Handlinger ===== //
// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Error handler for ugyldige ruter
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

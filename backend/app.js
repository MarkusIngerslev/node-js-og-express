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

// ===== Create Artists ===== //
app.post("/artists", async (req, res) => {
    // constant for den nye artist
    const newArtist = req.body;
    // lav unik id for new artist
    newArtist.id = Number(new Date().getTime());

    // load nuværende database af artists
    const data = await fs.readFile("./data/artists.json");
    const artists = JSON.parse(data);

    artists.push(newArtist);
    fs.writeFile("./data/artists.json", JSON.stringify(artists));
    console.log(`Nu artist i databasen: ${newArtist}`);

    res.json(artists);
});

// ===== Update Artists ===== //
app.put("/artists/:id", async (req, res) => {
    // const til at gemme den givene artist id
    const id = Number(req.params.id);
    // console.log(id);

    // indlæs nuværende artister i databasen
    const data = await fs.readFile("./data/artists.json");
    const artists = JSON.parse(data);

    // find den givende artist der skal opdateres ud fra id
    let artistToUpdate = artists.find((artist) => artist.id === id);

    // sæt alle artistens information til at være den ny sendte fra client
    const body = req.body;
    artistToUpdate.name = body.name;
    artistToUpdate.birthdate = body.birthdate;
    artistToUpdate.activeSince = body.activeSince;
    // artistToUpdate.genres = body.genres;
    // artistToUpdate.labels = body.labels;
    artistToUpdate.website = body.website;
    artistToUpdate.image = body.image;
    artistToUpdate.shortDescription = body.shortDescription;
    artistToUpdate.stillActive = body.stillActive;

    // overskriv den "gamle" artist med den nye i databasen
    fs.writeFile("./data/artists.json", JSON.stringify(artists));
    // send tilbage den nye database
    res.json(artists);
});

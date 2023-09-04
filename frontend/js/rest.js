import { endpoint } from "./main.js";
import { trimAndCapitalize } from "./helpers.js";
import { updateArtistsGrid } from "./view.js";

// ===== CREATE ===== //
// Create (POST) artist til node.js (Database)
async function createArtist(event) {
    event.preventDefault();

    // tjek om stillAktiv er sat til ja eller nej
    let stillActive = false;
    if (event.target.stillActive.value == "true") {
        stillActive = true;
    }

    // opret en ny artist udfra form
    const newArtist = {
        name: event.target.name.value,
        birthdate: event.target.birthday.value,
        activeSince: Number(event.target.activeSince.value),
        genres: event.target.genres.value.split(",").map(trimAndCapitalize),
        labels: event.target.labels.value.split(",").map(trimAndCapitalize),
        website: event.target.website.value,
        image: event.target.image.value,
        shortDescription: event.target.description.value,
        stillActive: Boolean(stillActive),
    };
    // konverter newArtist til JSON
    const artistAsJson = JSON.stringify(newArtist);
    // send ny artist til server
    const response = await fetch(`${endpoint}/artists`, {
        method: "POST",
        body: artistAsJson,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // tjek response
    if (response.ok) {
        // if succes, update view grid
        updateArtistsGrid();
    }
}

// ===== UPDATE ===== //
// Update (PUT) artist til Node.js (Database)
async function updateArtist(event) {
    event.preventDefault();

    // tjek om stillAktiv er sat til ja eller nej
    let stillActive = false;
    if (event.target.stillActive.value == "true") {
        stillActive = true;
    }

    // update artist
    // sæt en ny artist ud fra form ændringer
    const artistToUpdate = {
        name: event.target.name.value,
        birthdate: event.target.birthday.value,
        activeSince: Number(event.target.activeSince.value),
        genres: event.target.genres.value.split(",").map(trimAndCapitalize),
        labels: event.target.labels.value.split(",").map(trimAndCapitalize),
        website: event.target.website.value,
        image: event.target.image.value,
        shortDescription: event.target.description.value,
        stillActive: Boolean(stillActive),
    };
    const artistAsJson = JSON.stringify(artistToUpdate);
    const response = await fetch(`${endpoint}/artists/${selectedArtist.id}`, {
        method: "PUT",
        body: artistAsJson,
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        // if succes, update view grid
        updateArtistsGrid();
    }
}

// ===== DELETE ===== //
// Delete (DELELTE) artist gennem node.js (database)
async function deleteArtist(id) {
    const res = await fetch(`${endpoint}/artists/${id}`, {
        method: "DELETE",
    });

    if (res.ok) {
        // if succes, update view grid
        updateArtistsGrid();
    }
}

// ===== FAVORIT ===== //

async function favoritArtist(artist) {
    // opret en ny artist udfra form
    const newArtist = {
        name: artist.name,
        birthdate: artist.birthdate,
        activeSince: Number(artist.activeSince),
        genres: artist.genres,
        labels: artist.labels,
        website: artist.website,
        image: artist.image,
        shortDescription: artist.shortDescription,
        stillActive: Boolean(artist.stillActive),
    };
    // konverter newArtist til JSON
    const artistAsJson = JSON.stringify(newArtist);
    // send ny artist til server
    const response = await fetch(`${endpoint}/favorits`, {
        method: "POST",
        body: artistAsJson,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // tjek response
    if (response.ok) {
        // log change
        console.log(`New artist added to favorits!`);
    }
}

export { createArtist, updateArtist, deleteArtist, favoritArtist };

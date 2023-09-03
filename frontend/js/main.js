// ===== Imports ===== //
import { trimAndCapitalize, updateDatalistGenres, updateDatalistLabels } from "./helpers.js";

// ===== Global Variabler ===== //
const endpoint = "http://localhost:3333";
let selectedArtist;

// ===== Opstart af app ===== //
// load window og kald funktion initApp
window.addEventListener("load", initApp);

// funktion der igang sætter programmet
function initApp() {
    // update grid view for artists
    updateArtistsGrid();

    // event listeners
    initEventlisteners();

    // filter datalist
    updateDatalistGenres([]);
}

function initEventlisteners() {
    // ##### ===== CREATE EVENTS ===== ##### //
    // eventlistener for at åbne og reset create dialog
    document.querySelector("#create-artist-btn").addEventListener("click", () => {
        document.querySelector(`#create-artist-form`).reset(); // Nulstiller formularen

        // åbner dialog vinduet når create-artist knap klikkes
        document.querySelector("#create-artist-dialog").showModal();
    });

    // eventlistener for at lukke create dialog
    document
        .querySelector("#close-create-dialog-btn")
        .addEventListener("click", () => document.querySelector("#create-artist-dialog").close());
    // eventlistener for submit i create-form
    document.querySelector("#create-artist-form").addEventListener("submit", createArtist);

    // ##### ===== UPDATE EVENTS ===== ##### //
    // eventlistener for at lukke update dialog
    document
        .querySelector("#close-update-dialog-btn")
        .addEventListener("click", () => document.querySelector("#update-artist-dialog").close());

    // eventlistener for submit i update-form
    document.querySelector("#update-artist-form").addEventListener("submit", updateArtist);

    // ##### ===== PAGE EVENTS ===== ##### //
    document.querySelector("#different-pages").addEventListener("change", updateArtistsGrid);
    document.querySelector("#genre-filter").addEventListener("input", () => {
        updateArtistsGrid();
    });
    document.querySelector("#label-filter").addEventListener("input", updateArtistsGrid);
}

// ===== READ ===== //
async function updateArtistsGrid() {
    const artistData = await readArtists();
    const genreFilter = document.querySelector("#genre-filter").value;
    const labelFilter = document.querySelector("#label-filter").value;

    // Hvis både genre- og etiketfiltrene er tomme, vis alle kunstnere
    if (!genreFilter && !labelFilter) {
        displayArtists(artistData);
    } else {
        // Filtrer kunstnere baseret på valgt genre og/eller etiket
        const filteredArtists = artistData.filter((artist) => {
            const matchGenre = !genreFilter || artist.genres.includes(genreFilter);
            const matchLabel = !labelFilter || artist.labels.includes(labelFilter);
            return matchGenre && matchLabel;
        });
        displayArtists(filteredArtists);
    }

    // Opdater datalisten for genrer og etiketter
    updateDatalistGenres(artistData);
    updateDatalistLabels(artistData);
}

// READ (GET) all artists from local node.js (database/backend)
async function readArtists() {
    // const til at få værdi for siden
    const showPage = document.querySelector("#different-pages").value;

    // if sætning til at se om man skal vises alle artister eller kun favoriter
    const response = await fetch(`${endpoint}/${showPage}`);
    const data = await response.json();
    return data;
}

// Create HTML and display all artists from given list
function displayArtists(list) {
    document.querySelector("#artists-grid").innerHTML = "";
    //loop through all artists and create an article with content for each
    for (const artist of list) {
        document.querySelector("#artists-grid").insertAdjacentHTML(
            "beforeend",
            /*html*/ `
            <article>
                <img src="${artist.image}">
                <h2>${artist.name}</h2>
                <p>${artist.birthdate}</p>
                 <div class="btns">
                    <button class="btn-update-artist">Update</button>
                    <button class="btn-delete-artist">Delete</button>
                    <button class="btn-favorit-artist">Favorit</button>
                </div>
            </article>
        `
        );
        document
            .querySelector("#artists-grid article:last-child .btn-delete-artist")
            .addEventListener("click", () => deleteArtist(artist.id));
        document
            .querySelector("#artists-grid article:last-child .btn-update-artist")
            .addEventListener("click", () => selectArtist(artist));
        document
            .querySelector("#artists-grid article:last-child .btn-favorit-artist")
            .addEventListener("click", () => favoritArtist(artist));
    }
}

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
// Udfyld dialog vindu med given artists oplysninger
function selectArtist(artist) {
    document.querySelector("#update-artist-form").reset();
    // sætter global variabel
    selectedArtist = artist;

    // sæt form input felter til den givende artist data
    const form = document.querySelector("#update-artist-form");
    // omkring kunstner
    form.name.value = artist.name;
    form.birthday.value = artist.birthdate;
    form.image.value = artist.image;
    form.website.value = artist.website;
    // omkring musik
    form.activeSince.value = artist.activeSince;
    form.stillActive.value = artist.stillActive;
    form.genres.value = artist.genres;
    form.labels.value = artist.labels;
    form.description.value = artist.shortDescription;

    // vis dialog vindu
    document.querySelector("#update-artist-dialog").showModal();
}

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

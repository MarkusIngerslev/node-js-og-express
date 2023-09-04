// ===== IMPORT ===== //
import { endpoint } from "./main.js";
import { updateDatalistGenres, updateDatalistLabels } from "./helpers.js";
import { deleteArtist, favoritArtist, selectArtist } from "./rest.js";

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

// ===== READ ===== //
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
                <p>${artist.activeSince}</p>
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

// ===== SORTERING ===== //
// Tjekker efter sortering
function sortCheck() {
    // Hent den valgte sorteringsmulighed
    const sortOption = document.querySelector("#sortering").value;

    // Kald en sorteringsfunktion baseret på den valgte mulighed
    if (sortOption === "name") {
        sortByArtistName();
    } else if (sortOption === "activeSince") {
        sortByActiveSince();
    }
}

// sortering efter navn
async function sortByArtistName() {
    // Hent kunstnerdata
    const artistData = await readArtists(); // Du skal have en funktion til at hente kunstnerdata.

    // Brug sort-metoden til at sortere kunstnerne efter navn
    artistData.sort((a, b) => a.name.localeCompare(b.name));

    // Opdater visningen med de sorterede kunstnere
    displayArtists(artistData);
}

// sortering efter activeSince
async function sortByActiveSince() {
    // Hent kunstnerdata
    const artistData = await readArtists(); // Du skal have en funktion til at hente kunstnerdata.

    // Brug sort-metoden til at sortere kunstnerne efter navn
    artistData.sort((a, b) => a.activeSince - b.activeSince);

    // Opdater visningen med de sorterede kunstnere
    displayArtists(artistData);
}

export { sortCheck, updateArtistsGrid };

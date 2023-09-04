// ===== IMPORT ===== //
import { endpoint } from "./main.js";
import { updateDatalistGenres, updateDatalistLabels } from "./helpers.js";
import { deleteArtist, favoritArtist, selectArtist } from "./rest.js";

// ===== READ ===== //
async function updateArtistsGrid() {
    const artistData = await readArtists();
    const genreFilter = document.querySelector("#genre-filter").value;
    const labelFilter = document.querySelector("#label-filter").value;
    const stillActiveFilter = document.querySelector("#stillActiveFilter").value;

    // Hvis både genre-, etiket- og stillActive-filtrene er tomme, vis alle kunstnere
    if (!genreFilter && !labelFilter && stillActiveFilter === "all") {
        displayArtists(artistData);
    } else {
        // Filtrer kunstnere baseret på valgt genre, etiket og stillActive
        const filteredArtists = artistData.filter((artist) => {
            const matchGenre = !genreFilter || artist.genres.includes(genreFilter);
            const matchLabel = !labelFilter || artist.labels.includes(labelFilter);
            const matchStillActive =
                stillActiveFilter === "all" ||
                (stillActiveFilter === "true" && artist.stillActive) ||
                (stillActiveFilter === "false" && !artist.stillActive);
            return matchGenre && matchLabel && matchStillActive;
        });
        displayArtists(filteredArtists);
    }

    // Opdater datalisterne for genrer og etiketter
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
    // Fjern tidligere indhold fra visningen
    document.querySelector("#artists-grid").innerHTML = "";

    // Iterér gennem kunstnerlisten og opret HTML-elementer for hver kunstner
    list.forEach((artist) => {
        // Konverter fødselsdatoen til et JavaScript Date-objekt
        const birthdate = new Date(artist.birthdate);

        // Formatér fødselsdatoen som ønsket (f.eks. "2. februar 1977")
        const formattedBirthdate = birthdate.toLocaleDateString("da-DK", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        document.querySelector("#artists-grid").insertAdjacentHTML(
            "beforeend",
            /*html*/ `
            <article class="artist-article">
                <div class="artist-image">
                    <img src="${artist.image}" alt="${artist.name}" />
                </div>
                <div class="artist-details">
                    <div class="artist-info">
                        <h2>${artist.name}</h2>
                        <p>${formattedBirthdate}</p>
                        <p>Har været aktiv siden: ${artist.activeSince}</p>
                    </div>
                    <div class="artist-genres">
                        <p>${artist.genres}</p>
                    </div>
                </div>
                <div class="artist-buttons">
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
    });
}

// ===== SORTERING ===== //
// Tjekker efter sortering
function sortCheck() {
    // Hent den valgte sorteringsmulighed
    const sortOption = document.querySelector("#sortering").value;

    // Kald en sorteringsfunktion baseret på den valgte mulighed
    if (sortOption === "nulstil") {
        resetSortingOption();
    } else if (sortOption === "oldest-artist" || sortOption === "youngest-artist") {
        sortByBirthdate(sortOption);
    } else if (sortOption === "name") {
        sortByArtistName();
    } else if (sortOption === "mostTimeActive" || sortOption === "leastTimeActive") {
        sortByActiveSince(sortOption);
    }
}

// sortering efter alder
async function sortByBirthdate(sortValue) {
    // Hent kunstnerdata
    const artistData = await readArtists();

    // Brug sort-metoden til at sortere kunstnerne efter alder
    if (sortValue === "oldest-artist") {
        artistData.sort((a, b) => a.birthdate.localeCompare(b.birthdate));
    } else if (sortValue === "youngest-artist") {
        artistData.sort((a, b) => b.birthdate.localeCompare(a.birthdate));
    }

    // Opdater visningen med de sorterede kunstnere
    displayArtists(artistData);
}

// sortering efter navn
async function sortByArtistName() {
    // Hent kunstnerdata
    const artistData = await readArtists();

    // Brug sort-metoden til at sortere kunstnerne efter navn
    artistData.sort((a, b) => a.name.localeCompare(b.name));

    // Opdater visningen med de sorterede kunstnere
    displayArtists(artistData);
}

// sortering efter activeSince
async function sortByActiveSince(sortValue) {
    // Hent kunstnerdata
    const artistData = await readArtists();

    // Brug sort-metoden til at sortere kunstnerne efter navn
    if (sortValue === "mostTimeActive") {
        artistData.sort((a, b) => a.activeSince - b.activeSince);
    } else if (sortValue === "leastTimeActive") {
        artistData.sort((a, b) => b.activeSince - a.activeSince);
    }

    // Opdater visningen med de sorterede kunstnere
    displayArtists(artistData);
}

async function resetSortingOption() {
    // Hent Kunstnerdata
    const artistData = await readArtists();

    // Opdater visningen med de oprindelige kunstnere
    displayArtists(artistData);
}

export { sortCheck, updateArtistsGrid };

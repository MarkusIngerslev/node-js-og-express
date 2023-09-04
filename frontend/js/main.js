// ===== Imports ===== //
import { sortCheck, updateArtistsGrid } from "./view.js";
import { createArtist, updateArtist, deleteArtist, favoritArtist } from "./rest.js";

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

    // filter for genre
    document.querySelector("#genre-filter").addEventListener("input", updateArtistsGrid);
    // filter for label
    document.querySelector("#label-filter").addEventListener("input", updateArtistsGrid);

    // sortering check
    document.querySelector("#sortering").addEventListener("change", sortCheck);
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

export { endpoint, displayArtists };

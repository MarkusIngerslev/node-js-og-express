// ===== Imports ===== //
import { sortCheck, updateArtistsGrid } from "./view.js";
import { createArtist, updateArtist } from "./rest.js";

// ===== Global Variabler ===== //
export const endpoint = "http://localhost:3333";

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

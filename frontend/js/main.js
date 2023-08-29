"use strict";
// ===== Global Variabler ===== //
const endpoint = "http://localhost:3333";
let selectedUser;

// ===== Opstart af app ===== //

window.addEventListener("load", initApp);

function initApp() {
    // update grid view for artists
    updateArtistsGrid();

    // To do, tilføj eventlistner for create kunstner
}

// ===== READ ===== //

async function updateArtistsGrid() {
    const artist = await readArtists();
    displayArtists(artist);
}

// READ (GET) all artists from local node.js (database/backend)
async function readArtists() {
    const res = await fetch(`${endpoint}/artists`);
    const data = await res.json();
    return data;
}

// Create HTML and display all users from given list
function displayUsers(list) {
    // reset <section id="users-grid" class="grid-container">...</section>
    document.querySelector("#artists-grid").innerHTML = "";
    //loop through all users and create an article with content for each
    for (const artist of list) {
        document.querySelector("#users-grid").insertAdjacentHTML(
            "beforeend",
            /*html*/ `
            <article>
                <img src="${artist.image}">
                <h2>${artist.name}</h2>
                <p>${artist.birthdate}</p>
                 <div class="btns">
                    <button class="btn-update-user">Update</button>
                    <button class="btn-delete-user">Delete</button>
                </div>
            </article>
        `
        );
        document
            .querySelector("#users-grid article:last-child .btn-delete-user")
            .addEventListener("click", () => deleteUser(artist.id));
        document
            .querySelector("#users-grid article:last-child .btn-update-user")
            .addEventListener("click", () => selectUser(artist));
    }
}

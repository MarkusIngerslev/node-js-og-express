"use strict";
// ===== Global Variabler ===== //
const endpoint = "http://localhost:3333";
let selectedUser;

// ===== Opstart af app ===== //

// load window og kald funktion initApp
window.addEventListener("load", initApp);

// funktion der igang sætter programmet
function initApp() {
    // update grid view for artists
    updateArtistsGrid();

    // To do, tilføj eventlistner for create kunstner
    // event listeners for inputs
    document.querySelector("#create-artist-btn").addEventListener("click", () => {
        document.querySelector(`#create-artist-form`).reset(); // Nulstiller formularen
        // åbner dialog vinduet når create-artist knap klikkes
        document.querySelector("#create-artist-dialog").showModal();
    });
    // eventlistener for close knap i create form
    document
        .querySelector("#close-dialog-btn")
        .addEventListener("click", () => document.querySelector("#create-artist-dialog").close());
    // eventlistener for submit i create-form
    document.querySelector("#create-artist-form").addEventListener("submit", createArtist);
}

// ===== READ ===== //
async function updateArtistsGrid() {
    const artist = await readArtists();
    displayArtists(artist);
}

// READ (GET) all artists from local node.js (database/backend)
async function readArtists() {
    const response = await fetch(`${endpoint}/artists`);
    const data = await response.json();
    return data;
}

// Create HTML and display all users from given list
function displayArtists(list) {
    // reset <section id="users-grid" class="grid-container">...</section>
    document.querySelector("#artists-grid").innerHTML = "";
    //loop through all users and create an article with content for each
    for (const artist of list) {
        document.querySelector("#artists-grid").insertAdjacentHTML(
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
            .querySelector("#artists-grid article:last-child .btn-delete-user")
            .addEventListener("click", () => deleteUser(artist.id));
        document
            .querySelector("#artists-grid article:last-child .btn-update-user")
            .addEventListener("click", () => selectUser(artist));
    }
}

// ===== CREATE ===== //
// Create (POST) artist to node.js (Database)
async function createArtist(event) {
    event.preventDefault();

    // tjek om stillAktiv er sat til ja or nej
    let stillActive = false;
    if (event.target.stillActive.value == "true") {
        stillActive = true;
    }

    // opret en ny artist udfra form
    const newArtist = {
        name: event.target.name.value,
        birthdate: event.target.birthday.value,
        activeSince: Number(event.target.activeSince.value),
        // genres: event.target.genres.value,
        // labels: event.target.labels.value,
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

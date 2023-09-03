// funktion til at fjerne mulige mellemrum og ændre til stort forbogstav i genres og labels
function trimAndCapitalize(word) {
    return word.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

// funktion til at kunne vælge mellem forskellige genres
function updateDatalistGenres(artistObject) {
    const datalist = document.querySelector("#genre-list");
    datalist.innerHTML = ""; // Fjern alle tidligere muligheder

    const uniqueGenres = new Set();

    artistObject.forEach((artist) => {
        artist.genres.forEach((genre) => {
            if (!uniqueGenres.has(genre)) {
                uniqueGenres.add(genre);
                const option = document.createElement("option");
                option.value = genre;
                datalist.appendChild(option);
            }
        });
    });
}

export { trimAndCapitalize, updateDatalistGenres };

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

function updateDatalistLabels(artistObject) {
    const datalist = document.querySelector("#label-list");
    datalist.innerHTML = ""; // Fjern alle tidligere muligheder

    const uniqueLabels = new Set();

    artistObject.forEach((artist) => {
        artist.labels.forEach((label) => {
            if (!uniqueLabels.has(label)) {
                uniqueLabels.add(label);
                const option = document.createElement("option");
                option.value = label;
                datalist.appendChild(option);
            }
        });
    });
}

export { trimAndCapitalize, updateDatalistGenres, updateDatalistLabels };

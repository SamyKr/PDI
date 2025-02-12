let image = document.getElementById("image");
let loupe = document.getElementById("zoom-loupe");
let coordsTable = document.getElementById("coordsTable");
let exportCSV = document.getElementById("exportCSV");

// Sélectionner un pixel sur l'image et demander les coordonnées
image.addEventListener("click", function(event) {
    let rect = image.getBoundingClientRect();
    let x = Math.round(event.clientX - rect.left);
    let y = Math.round(event.clientY - rect.top);

    let lambertCoords = prompt(`Coordonnées Lambert 93 pour (${x}, ${y}) au format X,Y :`);
    if (lambertCoords) {
        let row = document.createElement("tr");

        // Ajout des données dans les cellules
        let cellX = document.createElement("td");
        cellX.textContent = x;
        row.appendChild(cellX);

        let cellY = document.createElement("td");
        cellY.textContent = y;
        row.appendChild(cellY);

        let cellCoords = document.createElement("td");
        cellCoords.textContent = lambertCoords;
        row.appendChild(cellCoords);

        // Ajouter un bouton "Annuler"
        let cellActions = document.createElement("td");
        let cancelButton = document.createElement("button");
        cancelButton.textContent = "Annuler";
        cancelButton.classList.add("cancel-button");
        cancelButton.addEventListener("click", function() {
            row.remove();  // Supprimer la ligne
        });
        cellActions.appendChild(cancelButton);
        row.appendChild(cellActions);

        coordsTable.appendChild(row);
    }
});

// Export en CSV
exportCSV.addEventListener("click", function() {
    let csv = "Pixel X,Pixel Y,Coordonnées Lambert 93\n";
    let rows = coordsTable.querySelectorAll("tr");

    rows.forEach(row => {
        let cols = row.querySelectorAll("td");
        let rowData = [];
        cols.forEach(col => rowData.push(col.innerText));
        csv += rowData.join(",") + "\n";
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sortie/coordonnees_pixels.csv";
    link.click();
});

let zoomLevel = 1;
const zoomStep = 0.1;

function zoomImage(event) {
    event.preventDefault();

    // Calculer la position de la souris sur l'image
    const rect = image.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    // Déterminer si on fait un zoom avant ou arrière
    if (event.deltaY < 0) {
        zoomLevel += zoomStep;
    } else {
        zoomLevel -= zoomStep;
    }

    // Limiter les valeurs de zoom pour qu'elles restent raisonnables
    zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 7);

    // Calculer la position du zoom
    const scale = zoomLevel;
    const originX = (offsetX / rect.width) * 100;
    const originY = (offsetY / rect.height) * 100;

    // Appliquer le zoom centré sur le curseur de la souris
    image.style.transformOrigin = `${originX}% ${originY}%`;
    image.style.transform = `scale(${scale})`;
}

image.addEventListener("wheel", zoomImage);

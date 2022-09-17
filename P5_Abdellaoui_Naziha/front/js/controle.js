// coder la fonction validQty : Qte entre 1 et 100
function validQty(quantity) {

    if (quantity <= 0 || quantity > 100) {

        alert("Merci de choisir une quantité entre 1 et 100.");
        return false;

    } else {
        // quantité valide 
        return true;
    }
}
// coder la fonction validColor si une couleur a été selectionnée
function validColor(couleur) {

    if (couleur == "") {

        alert("Merci de choisir une couleur valide.");
        return false;

    } else {

        return true;
    }
}



// recuperer le contenu de mon localStorage sous format de tableau d'où le tableauPanier
function getPanier(){

    //tester si panier vide
    if (!localStorage.getItem("panier")){
        // retourner un tableau vide si j'ai rien choisi
        return [];
        
    } else {

       // transforme mon tableau en objet json
        return JSON.parse(localStorage.getItem("panier"));
    }
}

// sauvegarder dans le localStorage le tableau panier
function setPanier(tableauPanier){
    localStorage.setItem("panier", JSON.stringify(tableauPanier));
}

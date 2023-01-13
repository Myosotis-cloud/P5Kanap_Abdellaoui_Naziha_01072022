 
    const stringParams = window.location.search;
    console.log(stringParams);
    // méthode URLSearchParams découpe l'url en tableau (entries, keys, values, ...)
    const tabParams = new URLSearchParams(stringParams);
        console.log (tabParams);

    const monId = tabParams.get("id");
     console.log(monId);


    let produitData = [];

    const myProduct = async () => {
    await fetch (`http://localhost:3000/api/products/${monId}`)
        .then((res) => res.json())
        .then((art) => {
            produitData = art;
            console.log(produitData);


        });
    };

    function addProductCart(produit){               
        //preparer le panier 
        let panier = getPanier();
            // console.log ("panier"+panier);
        // je demarre avec un panier vide 
        let productExist = false;

        // Ajouter le produit dans le panier selon la condition suivante:
        panier.forEach(element => {
            
            // si le produit existe deja (id, couleur) => mettre à jour la quantité 
            if (element.id == produit.id && element.color == produit.color)
            {
                productExist = true; 
                let somme =  element.quantity + produit.quantity;
                if (validQty(somme)){
                    element.quantity = somme;
                }
                
            } 
        });
        
        // s'il n'existe pas => ajouter le produit tel qu'il est 
        if (productExist == false){

            panier.push(produit);
        }

        return panier;
    }



const productDisplay = async () => {
        // chargement de l'article de l'api
        await myProduct()
        // affichage image + alt
        let imgContenair = document.querySelector ('.item__img');
        let img          = document.createElement ('img');
        img.src          = produitData.imageUrl;
        img.alt          = produitData.altTxt;
        // console.log (produitData);
        console.log(produitData.altTxt);

        imgContenair.appendChild (img);
        // affichage nom de l'article
        let titlePriceContenair = document.querySelector ('.item__content__titlePrice');
        let id_title            = document.querySelector ('#title');
        let title               = document.createElement ('h1');
        title.textContent       = produitData.name.toUpperCase();

        // affichage du prix
        let id_price            = document.querySelector ('#price');
        let price               = document.createElement ('span');
        price.innerHTML         = `<p>Prix : <span id="price">${produitData.price}</span>€</p>`
        console.log(price);
        titlePriceContenair.appendChild (price);
        titlePriceContenair.appendChild (title);

        // affichage description de l'article
        let descripContenair    = document.querySelector ('.item__content__description');
        let id_description      = document.querySelector ('#description');
        let description         = document.createElement ('p');
        description.textContent = produitData.description;

        descripContenair.appendChild (description);


        // gestion des options de couleur - "boucle forEach"
        produitData.colors.forEach(function(color){
            let choixUser = document.getElementById ('colors');
            let option = document.createElement('option');

                // console.log(color);
                option.value = `${color}`;
                option.textContent = `${color}`;
                option.id = `${monId}`;
                    // console.log (option);

                choixUser.append (option);

        });



    let btn_ajout_panier = document.querySelector ('#addToCart');

    // écouter le bouton "ajouter au panier" - au click
    btn_ajout_panier.addEventListener ("click", (event) => {
        event.preventDefault();

        // let quantityContenair = document.querySelector ('.item__content__settings__quantity');
        let quantity        = parseInt(document.getElementById('quantity').value);   
        let selectedColor   = document.querySelector ('#colors').value;

        let validQuantity = validQty(quantity);
             console.log (validQuantity);

        let validCol = validColor(selectedColor);
            console.log(validCol);

        // Il faut valider la couleur et la quantité 
                if(validQuantity && validCol){

                    //Preparer un objet à sauvegarder 
                    // cet objet doit avoir les données suivantes: id , couleur et quantité 
                    let selectedProduct = {

                        id: monId,
                        color: selectedColor,
                        quantity: quantity,
                        
                    };
                    // console.log("selectedProduct"+selectedProduct)
                    // Ajouter dans le panier 
                    let newPanier = addProductCart(selectedProduct);
                        console.log (newPanier);
                    // Sauvegarde du panier
                    setPanier(newPanier);
                    let confirm = alert ("Votre article a bien été ajouté à votre panier.")
                    // Message à l'utilisateur
                        window.location.href = "cart.html";
                    
                }   

    });
        

};   

productDisplay ();

// recuperer le panier du LS
let recupPanier = getPanier();
    console.log (recupPanier);
// tableau-resultant de la fusion des données du LS et de l'API
let tableauResultat = [];
console.log (tableauResultat);



// Parcourir le panier du localStorage
for (let i = 0; i < recupPanier.length; i++) {

    // élements stockés dans le localStorage
    // console.log (recupPanier[i]);

    // pour chaque element dans le panier tu vas recuperer ses details de l'api   
    // combiner les details de l'api et les details de l'article dans le localStorage dans un seul objet et le stocker dans un tableau resultant 
    // requête GET pour récupérer les données sensibles de l'API
    fetch(`http://localhost:3000/api/products/${recupPanier[i].id}`)

        .then((reponse) => reponse.json())
        .then((data) => {

            // données dans l'API hors localStorage
            // console.log (data);

            // tableau-resultant contenant les détails de l'API et du localStorage

            let produitResultat = {

                id: recupPanier[i].id,
                color: recupPanier[i].color,
                quantity: recupPanier[i].quantity,
                image: data.imageUrl,
                alt: data.altTxt,
                title: data.name,
                description: data.description,
                price: data.price,

            }
            
            displayCart(produitResultat);
            
            tableauResultat.push(produitResultat);
            

            if (i == recupPanier.length - 1)
            {
                activateListenerDelete (produitResultat);
                // pareil pour le listener de la quantité // listener change
                activateListenerChange (produitResultat);
                calculatTotal();
                submitForm ();
                
            }
            
        })

        .catch((error) =>{
            console.log(error);
            alert("Une erreur est survenue sur le site ! Veuillez contacter l'administrateur!");
        });

}



/* ------ parcourir le tableau resultant et afficher les produit sur dom -------- */
function displayCart(produit) {

    let section = document.querySelector('#cart__items');
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.dataset.id = produit.id;
    article.dataset.color = produit.color;
    console.log(section);

    let divImg = document.createElement('div');
    divImg.classList.add('cart__item__img');

    let imageCart = document.createElement('img');
    imageCart.src = produit.image;
    imageCart.alt = produit.alt;

    divImg.appendChild(imageCart);

    let cardItemContent = document.createElement('div');
    cardItemContent.classList.add('cart__item__content');

    let descriptionContent = document.createElement('div');
    descriptionContent.classList.add('cart__item__content__description');
    console.log(descriptionContent);

    let title = document.createElement('h2');
    title.textContent = produit.title;

    let pColor = document.createElement('p');
    pColor.textContent = produit.color;

    let pPrice = document.createElement('p');
    pPrice.textContent = produit.price + " €";

    descriptionContent.appendChild(title);
    descriptionContent.appendChild(pColor);
    descriptionContent.appendChild(pPrice);


    let settings = document.createElement('div');
    settings.classList.add('cart__item__content__settings');

    let quantity = document.createElement('div');
    quantity.classList.add('cart__item__content__settings__quantity');
    let pQuantity = document.createElement('p');
    pQuantity.textContent = "Qté : ";

    quantity.appendChild(pQuantity);

    let input = document.createElement('input');
    input.type = "number";
    input.classList.add('itemQuantity');
    input.name = "itemQuantity";
    input.min = "1";
    input.max = "100";
    input.value = parseInt(produit.quantity);
    // input.addEventListener ('input', () => updateNewTotal (produit.id, input.value));

    quantity.appendChild(input);
    settings.appendChild(quantity);

    cardItemContent.appendChild(descriptionContent);
    cardItemContent.appendChild(settings);


    section.appendChild(article);
    article.appendChild(divImg);
    article.appendChild(cardItemContent);

    let deleteItem = document.createElement('div');
    deleteItem.classList.add('cart__item__content__settings__delete');

    let pTrash = document.createElement('p');
    pTrash.classList.add('deleteItem');

    pTrash.textContent = "supprimer";
    deleteItem.appendChild(pTrash);

    settings.appendChild(deleteItem);

    
}



/*-------------------Mise à jour de total Quantity et total Price ---------------------*/
function calculatTotal() {
    
    let totalQuantite = 0;
    let totalPrix = 0;
    
    tableauResultat.forEach(element => {
       
        totalQuantite += element.quantity;
        totalPrix += (element.price * element.quantity);
    
    });
    
    document.getElementById("totalQuantity").innerHTML = `${totalQuantite}`;
    document.getElementById("totalPrice").innerHTML = `${totalPrix}` + " €";

}

// ------------delete one article in the cart --------------------
function activateListenerDelete() {
 // liste input du panier
 let listInput = document.querySelectorAll(".deleteItem");
 // console.log (listInput);
    listInput.forEach(input => {
        input.addEventListener("click", () => {

     // il faut utiliser le closest pour recuperer l'element parent
     const closest = input.closest ('.cart__item');

     // puis recuperer le data id et data color 
     let id= closest.dataset.id;
     let color = closest.dataset.color;

     // utiliser le find dans le tableau de recupPanier et tableau resultant pour identifier la position de l'element de meme id et de meme color 
     const itemToDeleteInLocalStorage = recupPanier.find(element => element.id === id 
         && element.color === color);
     let positionInLocalStorage = recupPanier.indexOf(itemToDeleteInLocalStorage);
     
     const itemToDeleteinTableauResult = tableauResultat.find(element => element.id === id 
         && element.color === color);
         let positionInTableauResultat = tableauResultat.indexOf(itemToDeleteinTableauResult);
     
        console.log(positionInTableauResultat);
     // supprimer l'element des deux tableaux et du dom

    if (confirm ('Souhaitez-vous supprimer cet article ?')) {
        console.log ("oui");
        recupPanier.splice(positionInLocalStorage,1);
        tableauResultat.splice(positionInTableauResultat,1);
        closest.remove();
    } else {
        console.log ("annulation");
    }

     // sauvegarder le localStorage et calculer le nouveau total 
     setPanier (recupPanier);
     calculatTotal();
     

        });

    });
}

/* ----------------- Mise à jour du total (quantité et prix) au changement de l'input -------*/
function activateListenerChange (produit) {
    // liste input du panier
    let listInput = document.querySelectorAll(".itemQuantity");
        // console.log (listInput);
    listInput.forEach(input => {
       input.addEventListener("change", () => {
            
            // controler au debut la quantité saisie
            let isValid= validQty (parseInt(input.value));

            if(isValid){
            // il faut utiliser le closest pour recuperer l'element parent
            const closest = input.closest ('.cart__item');

            // puis recuperer le data id et data color 
            let id= closest.dataset.id;
            let color = closest.dataset.color;

            // utiliser le find dans le tableau de recupPanier et tableau resultant pour identifier la position de l'element de meme id et de meme color 
            const itemToUpdateInLocalStorage = recupPanier.find(element => element.id === id 
                && element.color === color);

            const itemToUpdateinTableauResult = tableauResultat.find(element => element.id === id 
                && element.color === color);
               console.log(itemToUpdateInLocalStorage);
            // Mettre à jour le contenu de la quantité 
            itemToUpdateInLocalStorage.quantity = parseInt(input.value);
            itemToUpdateinTableauResult.quantity = parseInt(input.value);

            // sauvegarder le localStorage et calculer le nouveau total 
            setPanier (recupPanier);
            calculatTotal();
            }

       });
    
    });
}

/*------------------------------------FORMULAIRE CLIENT -------------------------*/

// -----------------récupération des valeurs dans une fonction ----------------------

function submitForm () {
    // recup formulaire
    const form = document.querySelector ('.cart__order__form');
    // console.log (form);

    // ecouter l'input email au changement
    form.email.addEventListener ("change", function (){
        console.log (form.email);
        validEmail(this);
    });
    // ecouter l'input city au changement
    form.city.addEventListener ("change", function (){
        console.log (form.city);
        validCity(this);
    });
    // ecouter l'input address au changement
    form.address.addEventListener ("change", function (){
        console.log (form.address);
        validAddress(this);
    });
    // ecouter l'input lastName au changement
    form.lastName.addEventListener ("change", function (){
        console.log (form.lastName);
        validLastName(this);
    });
    // ecouter l'input firstName au changement
    form.firstName.addEventListener ("change", function (){
        console.log (form.firstName);
        validFirstName(this);
    });

 // ---------------- validation du formulaire à condition que nos fonctions soient toutes true -----------------------
    let btnOrder = document.getElementById ("order");
    btnOrder.addEventListener ('click', function (e){
        e.preventDefault ();

        if (validEmail(form.email) && validCity(form.city) && validAddress(form.address) && validLastName(form.lastName) && validFirstName(form.firstName)) {
            
            /*-----fonction qui récupère les valeurs de chaque input + l'id (server) nécessaires 
            pour générer un numéro de commande------*/
            const body = preparationEnvoi ();
            console.log (body);


            const options = {

                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            };
            //   methode POST (envoi des données au server)
            fetch("http://localhost:3000/api/products/order", options)
            .then ((response)=>{
                if (response.ok) {

                    return response.json();
                }

            }).then((orderDetails)=>{

                console.log (orderDetails);
                localStorage.clear ();
                let orderId = orderDetails.orderId;

                window.location.href = `./confirmation.html?orderId=${orderId}`;
            })

            form.submit ();

        } else {
            alert("Une erreur est survenue sur le site ! Veuillez contacter l'administrateur!");

        }
        
        
    });

    
    function preparationEnvoi () {
        const form = document.querySelector (".cart__order__form").elements;
        console.log(form);
        //-------- récupération de la valeur des inputs --------------*/
        let inputFirstName  = document.querySelector("#firstName").value;
        let inputLastName   = document.querySelector("#lastName").value;
        let inputAddress    = document.querySelector("#address").value;
        let inputCity       = document.querySelector("#city").value;
        let inputEmail      = document.querySelector("#email").value;

        let body = {
            contact: {
                firstName: inputFirstName,
                lastName: inputLastName,
                address: inputAddress,
                city: inputCity,
                email: inputEmail
            },
            products: getIds (),
        }
            return body;
    }

    // //-----------récupération de l'id du produit depuis le tableau-resultat (LS+données API)------------
    function getIds () {
        let products = [];
        // récupérer l'id de notre tableau-Résultat
        for (let i = 0; i < tableauResultat.length; i++) {
        // pousser l'id de l'article vers un tableau
            products.push(tableauResultat[i].id);
            
        }
            console.log (tableauResultat);
        return products;
    }


// ------------------------validation EMAIL--------------------------
    const validEmail = function (inputEmail) {
        // ----création de la reg exp pour validation de l'email-----
        let emailRegExp = new RegExp (
            '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$',
            'g'
        );

    // ------récupération de la balise p du "message d'erreur"-------
        let errorMsg  = inputEmail.nextElementSibling;
            console.log (errorMsg);
    // --------test de l'expression régulière -----------------------
            if (emailRegExp.test(inputEmail.value)) {
                errorMsg.innerHTML   = "Email validé avec succès !";
                errorMsg.style.color = "rgb(15, 242, 133)";
                return true;

            } else {    
                errorMsg.innerHTML   = "Email non valide !";
                errorMsg.style.color = "#ecf40c";
                return false;
            }
    }

// -----------------------------validation ADRESSE --------------------------------
    const validAddress = function (inputAddress) {
        // ----création de la reg exp pour validation de l'adresse-----
        let addressRegExp = new RegExp (
            "^[0-9]{1,4}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+",
            'g'
        );

    // ------récupération de la balise p du "message d'erreur"-------
        let errorMsg  = inputAddress.nextElementSibling;
            console.log (errorMsg);
    // --------test de l'expression régulière --------------------
            if (addressRegExp.test(inputAddress.value)) {
                errorMsg.innerHTML   = "Adresse validée avec succès !";
                errorMsg.style.color = "rgb(15, 242, 133)";
                return true;

            } else {    
                errorMsg.innerHTML = "Adresse non valide !";
                errorMsg.style.color = "#ecf40c";
                return false;
            }
    }

// -------------------------validation FIRSTNAME-LASTNAME-CITY------------------
    const validLastName = function (inputLastName) {
        // ----création de la reg exp pour validation de l'adresse-----
        let lastNameRegExp = new RegExp (
            "^[a-zA-Z ,.'-]+$",
            'g'
        );

// ------récupération de la balise p du "message d'erreur"-------
        let errorMsg  = inputLastName.nextElementSibling;
            console.log (errorMsg);
// --------test de l'expression régulière --------------------
        if (lastNameRegExp.test(inputLastName.value)) {
            errorMsg.innerHTML   = "Nom validé avec succès !";
            errorMsg.style.color = "rgb(15, 242, 133)";
            return true;

        } else {    
            errorMsg.innerHTML = "Nom non valide !";
            errorMsg.style.color = "#ecf40c";
            return false;
        }
    }

    const validFirstName = function (inputFirstName) {
        // ----création de la reg exp pour validation de l'adresse-----
        let firstNameRegExp = new RegExp (
            "^[a-zA-Z ,.'-]+$",
            'g'
        );

// ------récupération de la balise p du "message d'erreur"-------
        let errorMsg  = inputFirstName.nextElementSibling;
            console.log (errorMsg);
// --------test de l'expression régulière --------------------
        if (firstNameRegExp.test(inputFirstName.value)) {
            errorMsg.innerHTML   = "Prénom validé avec succès !";
            errorMsg.style.color = "rgb(15, 242, 133)";
            return true;

        } else {    
            errorMsg.innerHTML = "Prénom non valide !";
            errorMsg.style.color = "#ecf40c";
            return false;
        }
    }

    const validCity = function (inputCity) {
        // ----création de la reg exp pour validation de l'adresse-----
        let CityRegExp = new RegExp (
            "^[a-zA-Z ,.'-]+$",
            'g'
        );

// ------récupération de la balise p du "message d'erreur"-------
        let errorMsg  = inputCity.nextElementSibling;
            console.log (errorMsg);
// --------test de l'expression régulière --------------------
        if (CityRegExp.test(inputCity.value)) {
            errorMsg.innerHTML   = "Ville validée avec succès !";
            errorMsg.style.color = "rgb(15, 242, 133)";
            return true;

        } else {    
            errorMsg.innerHTML = "Ville non valide !";
            errorMsg.style.color = "#ecf40c";
            return false;
        }
    }

}

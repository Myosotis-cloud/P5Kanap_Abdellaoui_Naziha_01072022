fetch("http://localhost:3000/api/products") //lancement de l'API avec fetch
  .then(function(res) {
    if (res.ok) {
      return res.json(); //recupérer la réponse au format json
    }
  })
  .then(function(art) { //requêter l'API pour demander l'ensemble des produits
    // console.log(art);
    
    let productDisplay  = document.getElementById ('items');
     // boucle itérant tous nos éléments
      for(let i = 0; i < art.length; i++){
        console.log(art[i]);
        // création de nos éléments dans une boucle et affichage de nos éléménts sur page accueil08
    let productLink     = document.createElement ('a');
      productLink.href  = `./product.html?id=${art[i]._id}`;
      console.log(productLink);

      productDisplay.appendChild(productLink);
      // console.log(productLink);
    
    let article = document.createElement ('article');
      productLink.appendChild(article);
      // console.log(article);

    let imageProduct      = document.createElement ('img');
      imageProduct.src    = `${art[i].imageUrl}`;
      imageProduct.alt    = `${art[i].altTxt}`;
      article.append(imageProduct);
      // console.log (imageProduct);

    let nameProduct = document.createElement ('h3');
      nameProduct.textContent = `${art[i].name}`;
      article.append(nameProduct);
      // console.log (nameProduct);

    let paragraphe              = document.createElement ('p');
      paragraphe.textContent    = `${art[i].description}`;
      article.append(paragraphe);
      // console.log (paragraphe);

    }
  })
  .catch(function(err) {
    alert('une erreur est survenue.');
    // Une erreur est survenue
  });
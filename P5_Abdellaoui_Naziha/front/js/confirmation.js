/*----------------appelle-du-localstorage-------------- */
const stringParams = window.location.search;
    console.log(stringParams);
    // méthode URLSearchParams découpe l'url en tableau (entries, keys, values, ...)
    const tabParams = new URLSearchParams(stringParams);
        console.log (tabParams);

    const idConfirm = tabParams.get("orderId");
     console.log(idConfirm);
  

let refOrder = document.querySelector("#orderId");
refOrder.innerHTML = `${idConfirm}`;

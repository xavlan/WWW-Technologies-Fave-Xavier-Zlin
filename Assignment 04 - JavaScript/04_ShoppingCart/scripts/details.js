//get product id from url
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let productTitle = "";
let productPrice = 0;


const url = `https://fakestoreapi.com/products/${productId}`;



fetch(url)
    .then(response => response.json())
    .then(product => {
        const detailsDiv = document.getElementById("productDetails");
        
        //save info for the add button
        productTitle = product.title;
        productPrice = product.price;

        //show product info and image(assignment 2)
        detailsDiv.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}" style="max-width: 150px; display: block; margin-bottom: 15px;">
            <p>${product.description}</p>
            <p><strong>Price: $${product.price.toFixed(2)}</strong></p>
        `;
    })
    .catch(error => console.error("error fetching details:", error));




//handle add to cart click
document.getElementById("addToCartBtn").addEventListener("click", () => {
    const qty = Number(document.getElementById("quantity").value);

    // get cart from storage or empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // create item obj
    const cartItem = {
        id: productId,
        title: productTitle,
        price: productPrice,
        qty: qty
    };



    // push to array
    cart.push(cartItem);


    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product successfully added to your cart!");
});
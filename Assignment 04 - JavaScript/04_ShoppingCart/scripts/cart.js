const cartTable = document.getElementById("cartTable");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// assignment 1: calc total price
function calculateTotal() {
    let totalAmount = 0;
    cart.forEach(item => {
        totalAmount += (item.price * item.qty);
    });
    document.getElementById("total").innerHTML = `<strong>Total: $${totalAmount.toFixed(2)}</strong>`;
}



// load cart items
cart.forEach((product, index) => {
    const row = document.createElement("tr");
    const subTotal = product.price * product.qty;

    row.innerHTML = `
        <td>${product.title}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
            <input type="number" min="1" value="${product.qty}" data-index="${index}">
        </td>
        <td>$${subTotal.toFixed(2)}</td>
        <td>
            <button class="remove" data-index="${index}">Remove</button>
        </td>
    `;

    cartTable.appendChild(row);
});

// show total on load
calculateTotal();


// remove items
document.querySelectorAll("button.remove").forEach(button => {
    button.addEventListener("click", event => {
        const index = event.target.dataset.index;
        
        // remove from array and save
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        

        location.reload();
    });
});



// update quantities
document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("change", event => {
        const index = event.target.dataset.index;
        const newQty = Number(event.target.value);
        
        if(newQty > 0) {
            // update qty and save
            cart[index].qty = newQty;
            localStorage.setItem("cart", JSON.stringify(cart));
            
            location.reload();
        }
    });
});
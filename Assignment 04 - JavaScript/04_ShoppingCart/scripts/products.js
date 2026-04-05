const url = "https://fakestoreapi.com/products";

fetch(url)
    .then(response => response.json())
    .then(products => {
        const table = document.getElementById("productTable");

        products.forEach(product => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <a href="details.html?id=${product.id}">
                        ${product.title}
                    </a>
                </td>
                <td>$${product.price.toFixed(2)}</td>
            `;

            table.appendChild(row);
        });
    })
    .catch(error => console.error("Error fetching products:", error));
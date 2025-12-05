const socket = io();
const form = document.getElementById("productForm");
const productList = document.getElementById("product-list");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    data.price = Number(data.price);
    data.stock = Number(data.stock);

    // Emitir evento a socket.io
    socket.emit("newProduct", data);

   
    await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    form.reset();
});

// Escuchar actualizaciones
socket.on("updateProducts", (products) => {
    productList.innerHTML = "";
    products.forEach(p => {
        productList.innerHTML += `<li><strong>${p.title}</strong> — $${p.price}</li>`;
    });
});

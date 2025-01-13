document.addEventListener('DOMContentLoaded', loadProducts);
document.getElementById('productForm').addEventListener('submit', addProduct);
document.getElementById('filterExpiring').addEventListener('change', filterExpiringProducts);

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const today = new Date();

    // Solo mostrar productos que están próximos a vencer al cargar la página
    products.forEach(product => {
        const expirationDate = new Date(product.fecha_vencimiento);
        const daysToExpire = (expirationDate - today) / (1000 * 60 * 60 * 24);
        if (daysToExpire <= 7 && daysToExpire >= 0) {
            addProductToGrid(product);
        }
    });

    checkExpiringProducts(products);
}

function addProduct(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const lote = document.getElementById('lote').value;
    const fechaVencimiento = document.getElementById('fecha_vencimiento').value;
    const estado = document.getElementById('estado').value;

    const product = { nombre, lote, fecha_vencimiento: fechaVencimiento, estado };
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    // Solo agregar el producto a la cuadrícula si está próximo a vencer
    const expirationDate = new Date(fechaVencimiento);
    const daysToExpire = (expirationDate - new Date()) / (1000 * 60    * 60 * 24);
    if (daysToExpire <= 7 && daysToExpire >= 0) {
        addProductToGrid(product);
    }

    document.getElementById('productForm').reset();
    checkExpiringProducts(products);
}

function addProductToGrid(product) {
    const productGrid = document.getElementById('productGrid');
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <h3>${product.nombre}</h3>
        <p><strong>Lote:</strong> ${product.lote}</p>
        <p><strong>Fecha de Vencimiento:</strong> ${product.fecha_vencimiento}</p>
        <p><strong>Estado:</strong> ${product.estado}</p>
        <button onclick="editProduct(this)">Editar</button>
        <button onclick="deleteProduct(this)">Eliminar</button>
    `;
    productGrid.appendChild(productCard);
}

function deleteProduct(button) {
    const productCard = button.parentElement;
    const nombre = productCard.querySelector('h3').textContent;
    const lote = productCard.querySelector('p').textContent.split(': ')[1];
    const fechaVencimiento = productCard.querySelectorAll('p')[1].textContent.split(': ')[1];
    const estado = productCard.querySelectorAll('p')[2].textContent.split(': ')[1];

    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(product => !(product.nombre === nombre && product.lote === lote && product.fecha_vencimiento === fechaVencimiento && product.estado === estado));
    localStorage.setItem('products', JSON.stringify(products));

    productCard.remove();
    checkExpiringProducts(products);
}

function editProduct(button) {
    const productCard = button.parentElement;
    const nombre = productCard.querySelector('h3').textContent;
    const lote = productCard.querySelector('p').textContent.split(': ')[1];
    const fechaVencimiento = productCard.querySelectorAll('p')[1].textContent.split(': ')[1];
    const estado = productCard.querySelectorAll('p')[2].textContent.split(': ')[1];

    // Rellenar el formulario con los datos del producto
    document.getElementById('nombre').value = nombre;
    document.getElementById('lote').value = lote;
    document.getElementById('fecha_vencimiento').value = fechaVencimiento;
    document.getElementById('estado').value = estado;

    // Eliminar el producto actual para poder agregarlo de nuevo después de editar
    deleteProduct(button);
}

function checkExpiringProducts(products) {
    const today = new Date();
    const expiringProducts = products.filter(product => {
        const expirationDate = new Date(product.fecha_vencimiento);
        const daysToExpire = (expirationDate - today) / (1000 * 60 * 60 * 24);
        return daysToExpire <= 7 && daysToExpire >= 0; // Productos que vencen en 7 días
    });

    const notification = document.getElementById('notification');
    if (expiringProducts.length > 0) {
        notification.innerHTML = `¡Atención! Hay ${expiringProducts.length} producto(s) próximo(s) a vencer.`;
        notification.classList.remove('hidden');
    } else {
        notification.classList.add('hidden');
    }
}

function searchProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const productGrid = document.getElementById('productGrid');
    const products = JSON.parse(localStorage.getItem('products')) || [];

    productGrid.innerHTML = ''; // Limpiar la cuadrícula antes de buscar

    products.forEach(product => {
        if (product.nombre.toLowerCase().includes(searchTerm)) {
            addProductToGrid(product);
        }
    });
}

function filterExpiringProducts() {
    const isChecked = document.getElementById('filterExpiring').checked;
    const productGrid = document.getElementById('productGrid');
    const products = JSON.parse(localStorage.getItem('products')) || [];

    productGrid.innerHTML = ''; // Limpiar la cuadrícula antes de aplicar el filtro

    products.forEach(product => {
        const expirationDate = new Date(product.fecha_vencimiento);
        const daysToExpire = (expirationDate - new Date()) / (1000 * 60 * 60 * 24);
        // Mostrar productos que están próximos a vencer si el checkbox está marcado
        if (isChecked && (daysToExpire <= 7 && daysToExpire >= 0)) {
            addProductToGrid(product);
        } 
        // Si el checkbox no está marcado, mostrar todos los productos
        else if (!isChecked) {
            addProductToGrid(product);
        }
    });
}

// Función para restablecer los datos
function resetData() {
    localStorage.removeItem('products'); // Eliminar todos los productos del almacenamiento local
    document.getElementById('productGrid').innerHTML = ''; // Limpiar la cuadrícula
    document.getElementById('notification').classList.add('hidden'); // Ocultar la notificación
    document.getElementById('productForm').reset(); // Reiniciar el formulario
}
function logout() {
    // Aquí puedes realizar cualquier limpieza necesaria, como eliminar datos del almacenamiento local
    localStorage.removeItem('products'); // Opcional: limpiar productos si es necesario
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = 'index.html'; // Cambia 'login.html' por la URL de tu página de inicio de sesión
}
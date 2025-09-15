/* ============================================
   PÁGINA DE DETALLE DE PRODUCTO - MUNDO MASCOTA
   ============================================
   
   Este archivo contiene toda la lógica para la página de detalle de producto.
   Se encarga de mostrar la información completa de un producto específico,
   incluyendo imágenes, especificaciones, productos relacionados y funcionalidades
   de compra.
   
   FUNCIONALIDADES PRINCIPALES:
   - Cargar información del producto desde la URL
   - Mostrar imágenes del producto con galería
   - Mostrar especificaciones técnicas
   - Mostrar productos relacionados
   - Manejar cantidad y agregar al carrito
   - Cambiar imagen principal al hacer clic en miniaturas
   
   ¿CÓMO FUNCIONA?
   1. Se obtiene el ID del producto desde la URL (?id=123)
   2. Se busca el producto en el arreglo de productos
   3. Se actualiza toda la información en la página
   4. Se cargan productos relacionados de la misma categoría
   ============================================ */

// Variable global para almacenar el producto actual
let currentProduct = null;

/**
 * INICIALIZACIÓN DE LA PÁGINA DE DETALLE
 * 
 * Esta función se ejecuta cuando el DOM está cargado y verifica
 * si estamos en la página de detalle de producto.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de detalle de producto
    if (window.location.pathname.includes('detalle-producto.html')) {
        loadProductDetail();
    }
});

/**
 * CARGAR DETALLE DEL PRODUCTO DESDE LA URL
 * 
 * Esta función obtiene el ID del producto desde la URL y carga
 * toda la información necesaria para mostrar el detalle.
 * 
 * PROCESO:
 * 1. Extraer el ID del producto de la URL (?id=123)
 * 2. Buscar el producto en el arreglo de productos
 * 3. Si no se encuentra, mostrar error y redirigir
 * 4. Si se encuentra, cargar toda la información
 */
function loadProductDetail() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Verificar que se proporcionó un ID válido
    if (!productId) {
        showNotification('Producto no encontrado', 'error');
        redirectToProducts();
        return;
    }

    // Buscar el producto en el arreglo de productos
    const product = productsData.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        redirectToProducts();
        return;
    }

    // Guardar el producto actual y cargar la información
    currentProduct = product;
    displayProductDetail();
    loadRelatedProducts();
}

/**
 * MOSTRAR INFORMACIÓN DETALLADA DEL PRODUCTO
 * 
 * Esta función actualiza todos los elementos de la página con la información
 * del producto seleccionado. Se ejecuta después de cargar el producto.
 */
function displayProductDetail() {
    // Verificar que tenemos un producto cargado
    if (!currentProduct) return;

    // ACTUALIZAR TÍTULO DE LA PÁGINA
    document.title = `${currentProduct.name} - Tienda Online`;

    // ACTUALIZAR BREADCRUMB (miga de pan)
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = currentProduct.name;
    }

    // ACTUALIZAR IMAGEN PRINCIPAL
    const productImage = document.getElementById('product-image');
    if (productImage) {
        productImage.src = currentProduct.image;
        productImage.alt = currentProduct.name;
        // Si la imagen no carga, mostrar una imagen de respaldo
        productImage.onerror = function() {
            this.src = '../images/placeholder.jpg';
        };
    }

    // ACTUALIZAR IMÁGENES MINIATURA
    updateThumbnailImages();

    // ACTUALIZAR NOMBRE DEL PRODUCTO
    const productName = document.getElementById('product-name');
    if (productName) {
        productName.textContent = currentProduct.name;
    }

    // ACTUALIZAR CATEGORÍA
    const productCategory = document.getElementById('product-category');
    if (productCategory) {
        productCategory.textContent = currentProduct.category;
    }

    // ACTUALIZAR PRECIO
    const productPrice = document.getElementById('product-price');
    if (productPrice) {
        productPrice.textContent = formatPrice(currentProduct.price);
    }

    // ACTUALIZAR ESTADO DE STOCK
    const productStock = document.getElementById('product-stock');
    if (productStock) {
        if (currentProduct.stock > 0) {
            productStock.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i>En Stock (${currentProduct.stock} disponibles)`;
        } else {
            productStock.innerHTML = `<i class="bi bi-x-circle-fill text-danger me-2"></i>Sin Stock`;
        }
    }

    // ACTUALIZAR DESCRIPCIÓN
    const productDescription = document.getElementById('product-description');
    if (productDescription) {
        productDescription.textContent = currentProduct.description;
    }

    // ACTUALIZAR DESCRIPCIÓN DETALLADA
    const detailedDescription = document.getElementById('detailed-description');
    if (detailedDescription) {
        detailedDescription.innerHTML = generateDetailedDescription(currentProduct);
    }

    // ACTUALIZAR ESPECIFICACIONES TÉCNICAS
    updateSpecifications();

    // ACTUALIZAR BOTÓN DE AGREGAR AL CARRITO
    updateAddToCartButton();
}

/**
 * ACTUALIZAR IMÁGENES MINIATURA
 * 
 * Esta función actualiza las imágenes en miniatura de la galería.
 * La primera miniatura muestra la imagen principal, y las demás
 * muestran variaciones de la imagen para simular una galería real.
 */
function updateThumbnailImages() {
    // Obtener todas las imágenes miniatura
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const baseImage = currentProduct.image;
    
    // Actualizar cada miniatura
    thumbnails.forEach((thumb, index) => {
        if (index === 0) {
            // La primera miniatura muestra la imagen principal
            thumb.src = baseImage;
        } else {
            // Las demás muestran variaciones de la imagen para demostración
            // En una aplicación real, estas serían imágenes diferentes del producto
            thumb.src = baseImage.replace('.jpg', `_${index + 1}.jpg`);
        }
        // Si la imagen no carga, mostrar la imagen principal
        thumb.onerror = function() {
            this.src = baseImage;
        };
    });
}

/**
 * Generate detailed description
 */
// Generar descripción detallada del producto
function generateDetailedDescription(product) {
    return `
        <p>${product.description}</p>
        <p>Este producto de alta calidad está diseñado específicamente para el cuidado y bienestar de tu mascota. 
        Fabricado con materiales seguros y de primera calidad, garantiza la satisfacción y felicidad de tu compañero peludo.</p>
        <ul>
            <li>Materiales seguros para mascotas</li>
            <li>Diseño ergonómico y cómodo</li>
            <li>Fácil de usar y mantener</li>
            <li>Garantía de 30 días</li>
            <li>Asesoría veterinaria incluida</li>
        </ul>
    `;
}

/**
 * Update product specifications
 */
// Actualizar especificaciones del producto
function updateSpecifications() {
    const specs = {
        category: currentProduct.categoria || 'Producto para Mascotas',
        brand: 'Mundo Mascota',
        model: currentProduct.nombre || 'Modelo Estándar',
        dimensions: 'Dimensiones variables según el producto',
        weight: 'Peso variable según el producto'
    };

    // Actualizar tabla de especificaciones
    const specElements = {
        'spec-category': specs.category,
        'spec-brand': specs.brand,
        'spec-model': specs.model,
        'spec-dimensions': specs.dimensions,
        'spec-weight': specs.weight
    };

    Object.entries(specElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

/**
 * Update add to cart button state
 */
function updateAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (!addToCartBtn) return;

    if (currentProduct.stock <= 0) {
        addToCartBtn.disabled = true;
        addToCartBtn.innerHTML = '<i class="bi bi-x-circle"></i> Sin Stock';
        addToCartBtn.className = 'btn btn-secondary btn-lg';
    } else {
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = '<i class="bi bi-cart-plus"></i> Añadir al Carrito';
        addToCartBtn.className = 'btn btn-primary btn-lg';
    }
}

/**
 * Load related products
 */
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;

    // Get products from the same category
    const relatedProducts = productsData
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No hay productos relacionados disponibles</p></div>';
        return;
    }

    relatedContainer.innerHTML = relatedProducts.map(product => `
        <div class="col-lg-3 col-md-6">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;" onerror="this.src='../images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${product.name}</h6>
                    <p class="card-text text-muted small">${product.description.substring(0, 60)}...</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-bold text-success">${formatPrice(product.price)}</span>
                            <small class="text-muted">Stock: ${product.stock}</small>
                        </div>
                        <div class="d-grid gap-2">
                            <a href="detalle-producto.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                                Ver Detalles
                            </a>
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                                <i class="bi bi-cart-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Change main image when thumbnail is clicked
 */
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}

/**
 * Decrease quantity
 */
function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }
}

/**
 * Increase quantity
 */
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const maxValue = Math.min(currentProduct.stock, 10);
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
        }
    }
}

/**
 * Add product to cart from detail page
 */
function addToCartFromDetail() {
    if (!currentProduct) return;

    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput?.value) || 1;

    if (currentProduct.stock <= 0) {
        showNotification('Este producto no está disponible', 'error');
        return;
    }

    if (quantity > currentProduct.stock) {
        showNotification(`Solo hay ${currentProduct.stock} unidades disponibles`, 'error');
        return;
    }

    addToCart(currentProduct.id, quantity);
}

/**
 * Redirect to products page
 */
function redirectToProducts() {
    setTimeout(() => {
        window.location.href = 'productos.html';
    }, 2000);
}

// Export functions for global access
window.changeMainImage = changeMainImage;
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.addToCartFromDetail = addToCartFromDetail;


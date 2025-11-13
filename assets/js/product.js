// Configuration des produits
const products = {
    'robe-soiree': [
        {
            id: 1,
            name: "Robe de soirée Élégance",
            price: 45000,
            image: "assets/images/robe-soiree1.jpg",
            category: "Robes de soirée",
            description: "Robe de soirée élégante pour occasions spéciales"
        },
        {
            id: 2,
            name: "Robe cocktail Perle",
            price: 38000,
            image: "assets/images/robe-soiree2.jpg",
            category: "Robes de soirée",
            description: "Robe cocktail sophistiquée avec perles"
        }
    ],
    'tenue-traditionnelle': [
        {
            id: 3,
            name: "Tenue traditionnelle Reine",
            price: 75000,
            image: "assets/images/tenue-trad1.jpg",
            category: "Tenues traditionnelles",
            description: "Tenue traditionnelle africaine royale"
        },
        {
            id: 4,
            name: "Boubou cérémonie",
            price: 55000,
            image: "assets/images/tenue-trad2.jpg",
            category: "Tenues traditionnelles",
            description: "Boubou de cérémonie élégant"
        }
    ],
    'accessoires': [
        {
            id: 5,
            name: "Collier Perles Africaines",
            price: 15000,
            image: "assets/images/accessoire1.jpg",
            category: "Accessoires",
            description: "Collier en perles traditionnelles"
        },
        {
            id: 6,
            name: "Boucles d'oreilles Or",
            price: 12000,
            image: "assets/images/accessoire2.jpg",
            category: "Accessoires",
            description: "Boucles d'oreilles en or 18 carats"
        }
    ]
};

// Fonction pour charger les produits d'une catégorie
function loadProducts(category) {
    const productGrid = document.getElementById('product-grid');
    const categoryProducts = products[category] || [];
    
    if (categoryProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-products">Aucun produit disponible dans cette catégorie.</p>';
        return;
    }

    let html = '';
    categoryProducts.forEach(product => {
        html += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, '${category}')">
                        <i class="fas fa-shopping-cart"></i> Ajouter au panier
                    </button>
                </div>
            </div>
        `;
    });

    productGrid.innerHTML = html;
}

// Fonction pour ajouter au panier depuis les pages produits
function addToCart(productId, category) {
    const categoryProducts = products[category];
    const product = categoryProducts.find(p => p.id === productId);
    
    if (product) {
        panierGlobal.ajouterProduit(product);
    }
}

// Fonction pour charger tous les produits (page collections)
function loadAllProducts() {
    const productGrid = document.getElementById('product-grid');
    let allProducts = [];
    
    // Rassembler tous les produits
    Object.keys(products).forEach(category => {
        allProducts = allProducts.concat(products[category]);
    });

    if (allProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-products">Aucun produit disponible.</p>';
        return;
    }

    let html = '';
    allProducts.forEach(product => {
        html += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button class="btn btn-primary" onclick="addToCartFromCollection(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Ajouter au panier
                    </button>
                </div>
            </div>
        `;
    });

    productGrid.innerHTML = html;
}

// Fonction pour ajouter au panier depuis la page collections
function addToCartFromCollection(productId) {
    let productFound = null;
    
    // Chercher le produit dans toutes les catégories
    Object.keys(products).forEach(category => {
        const product = products[category].find(p => p.id === productId);
        if (product) {
            productFound = product;
        }
    });

    if (productFound) {
        panierGlobal.ajouterProduit(productFound);
    }
}

// Initialisation des pages produits
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si on est sur une page de catégorie
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'robe-soiree.html') {
        loadProducts('robe-soiree');
    } else if (page === 'tenue-traditionnelle.html') {
        loadProducts('tenue-traditionnelle');
    } else if (page === 'accessoires.html') {
        loadProducts('accessoires');
    } else if (page === 'collections.html') {
        loadAllProducts();
    }
    
    updateCartCount();
});
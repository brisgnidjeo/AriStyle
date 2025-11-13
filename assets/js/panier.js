// Données des produits pour affichage dans le panier
const produitsData = {
    1: { name: "Robe Glamour Paillettes", price: 75000, image: "../assets/images/robe1.jfif", category: "Robes de Soirée" },
    2: { name: "Robe Cocktail Élégante", price: 45000, image: "../assets/images/robe2.jfif", category: "Robes de Soirée" },
    3: { name: "Robe Sirène Sophistiquée", price: 85000, image: "../assets/images/robe3.jfif", category: "Robes de Soirée" },
    4: { name: "Costume Noir Prestige", price: 155000, image: "../assets/images/costume1.jfif", category: "Costumes" },
    5: { name: "Costume Bleu Marine", price: 145000, image: "../assets/images/costume2.jfif", category: "Costumes" },
    6: { name: "Boubou Grand Homme", price: 95000, image: "../assets/images/tradition1.jfif", category: "Tenues Traditionnelles" },
    7: { name: "Robe Ankara Moderne", price: 65000, image: "../assets/images/tradition2.jfif", category: "Tenues Traditionnelles" },
    8: { name: "Jean Slim Stretch", price: 32000, image: "../assets/images/casual1.jfif", category: "Mode Casual" },
    9: { name: "T-shirt Classique", price: 24000, image: "../assets/images/casual2.jfif", category: "Mode Casual" }
};

// Fonction pour afficher le contenu du panier
function afficherPanier() {
    const cartContent = document.getElementById('cart-content');
    const cart = panierGlobal;

    if (cart.items.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h2>Votre panier est vide</h2>
                <p>Découvrez nos collections et ajoutez vos articles préférés.</p>
                <a href="collections.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block; padding: 12px 30px; text-decoration: none;">Découvrir les collections</a>
            </div>
        `;
        return;
    }

    let html = `
        <div class="cart-items">
            <div style="display: grid; grid-template-columns: 100px 1fr auto auto auto; gap: 20px; padding: 15px 0; border-bottom: 2px solid #eee; font-weight: bold; margin-bottom: 20px;">
                <div>Image</div>
                <div>Produit</div>
                <div>Prix</div>
                <div>Quantité</div>
                <div>Action</div>
            </div>
    `;

    cart.items.forEach(item => {
        const produit = produitsData[item.id];
        if (produit) {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${produit.image}" alt="${produit.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'">
                    </div>
                    <div class="cart-item-details">
                        <h3>${produit.name}</h3>
                        <p>${produit.category}</p>
                    </div>
                    <div class="cart-item-price">${formatPrice(produit.price)}</div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
    });

    html += `</div>`;

    // Récapitulatif du panier
    const subtotal = cart.getTotal();
    const discount = cart.getDiscount();
    const total = cart.getFinalTotal();

    html += `
        <div class="cart-summary">
            <h2>Récapitulatif de la commande</h2>
            
            ${discount > 0 ? `
                <div class="discount-info">
                    <i class="fas fa-gift"></i> Félicitations ! Vous bénéficiez d'une remise de ${formatPrice(discount)}
                </div>
            ` : ''}
            
            <div class="summary-row">
                <span>Sous-total (${cart.getItemCount()} article${cart.getItemCount() > 1 ? 's' : ''})</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            
            ${discount > 0 ? `
                <div class="summary-row discount">
                    <span>Remise</span>
                    <span>-${formatPrice(discount)}</span>
                </div>
            ` : ''}
            
            <div class="summary-row total">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
            </div>
            
            <button class="checkout-btn" onclick="proceedToCheckout()">
                <i class="fas fa-lock"></i> Procéder au paiement
            </button>
            
            <div class="continue-shopping">
                <a href="collections.html"><i class="fas fa-arrow-left"></i> Continuer mes achats</a>
            </div>
        </div>
    `;

    cartContent.innerHTML = html;
    updateCartCount();
}

// Fonctions pour gérer le panier
function updateQuantity(productId, newQuantity) {
    panierGlobal.updateQuantity(productId, newQuantity);
    afficherPanier();
}

function removeFromCart(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit du panier ?')) {
        panierGlobal.removeItem(productId);
        afficherPanier();
    }
}

function proceedToCheckout() {
    if (panierGlobal.items.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (isLoggedIn) {
        window.location.href = 'commande.html';
    } else {
        if (confirm('Vous devez vous connecter pour passer commande. Voulez-vous vous connecter maintenant ?')) {
            window.location.href = 'connexion.html';
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    afficherPanier();
    updateCartCount();
});
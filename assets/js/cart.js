// cart.js - Gestion du panier

class Panier {
    constructor() {
        this.items = this.chargerPanier();
    }

    chargerPanier() {
        const panier = localStorage.getItem('panier');
        return panier ? JSON.parse(panier) : [];
    }

    sauvegarderPanier() {
        localStorage.setItem('panier', JSON.stringify(this.items));
        this.updateCartCount();
    }

    ajouterProduit(produit) {
        const existingItem = this.items.find(item => item.id === produit.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: produit.id,
                name: produit.name,
                price: produit.price,
                image: produit.image,
                category: produit.category,
                quantity: 1
            });
        }
        
        this.sauvegarderPanier();
        this.showNotification('Produit ajouté au panier !');
    }

    supprimerProduit(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.sauvegarderPanier();
        this.showNotification('Produit retiré du panier');
    }

    modifierQuantite(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.supprimerProduit(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.sauvegarderPanier();
        }
    }

    viderPanier() {
        this.items = [];
        this.sauvegarderPanier();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getDiscount() {
        // Simulation de réduction
        const total = this.getTotal();
        return total > 50000 ? Math.floor(total * 0.1) : 0; // 10% de réduction au-dessus de 50,000 FCFA
    }

    getFinalTotal() {
        return this.getTotal() - this.getDiscount();
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-badge, #cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    showNotification(message) {
        // Créer une notification toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// Initialiser le panier global
const panierGlobal = new Panier();

// Fonction utilitaire pour formater les prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF'
    }).format(price).replace('XOF', 'FCFA');
}

// Fonction pour ajouter au panier (accessible globalement)
function ajouterAuPanier(produit) {
    panierGlobal.ajouterProduit(produit);
}

// Fonction pour mettre à jour l'affichage du compteur
function updateCartCount() {
    panierGlobal.updateCartCount();
}

// Fonction pour rediriger vers le panier
function redirectToCart() {
    window.location.href = 'panier.html';
}

// Ajouter des styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .icon-btn {
        cursor: pointer;
        transition: transform 0.2s;
    }
    
    .icon-btn:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// Initialiser le compteur au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Corriger les écouteurs d'événements pour les icônes du panier
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.querySelector('.fa-shopping-cart') || this.querySelector('.bi-cart-fill')) {
                e.preventDefault();
                redirectToCart();
            }
        });
    });
});

// Redirection vers le panier
function redirectToCart() {
    window.location.href = 'panier.html';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Gestion du clic sur l'icône panier
    const cartIcons = document.querySelectorAll('.fa-shopping-cart');
    cartIcons.forEach(icon => {
        const button = icon.closest('.icon-btn');
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                redirectToCart();
            });
        }
    });
});
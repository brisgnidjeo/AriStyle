// Système d'authentification
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
    }

    // Charger les utilisateurs depuis localStorage
    loadUsers() {
        const saved = localStorage.getItem('aristyle_users');
        return saved ? JSON.parse(saved) : [];
    }

    // Sauvegarder les utilisateurs
    saveUsers() {
        localStorage.setItem('aristyle_users', JSON.stringify(this.users));
    }

    // Obtenir l'utilisateur connecté
    getCurrentUser() {
        const saved = localStorage.getItem('aristyle_current_user');
        return saved ? JSON.parse(saved) : null;
    }

    // Sauvegarder l'utilisateur connecté
    saveCurrentUser(user) {
        localStorage.setItem('aristyle_current_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // Inscription
    register(userData) {
        // Vérifier si l'email existe déjà
        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Cet email est déjà utilisé' };
        }

        // Créer le nouvel utilisateur
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Inscription réussie !', user: newUser };
    }

    // Connexion
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.saveCurrentUser(user);
            return { success: true, message: 'Connexion réussie !', user };
        }
        
        return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Déconnexion
    logout() {
        localStorage.removeItem('aristyle_current_user');
        this.currentUser = null;
    }

    // Vérifier si l'utilisateur est connecté
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Instance globale
const auth = new AuthSystem();
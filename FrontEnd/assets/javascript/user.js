// Récupération des éléments du formulaire
const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorContainer = document.getElementById('erreur-message');

// Gestion de la soumission du formulaire
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire

  const email = emailInput.value;
  const password = passwordInput.value;

  // Envoi des informations de connexion à l'API
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        // Récupération du token d'authentification de la réponse
        return response.json();
      } else {
        // Affichage d'un message d'erreur en cas d'informations utilisateur/mot de passe incorrectes
        errorContainer.textContent = 'Informations utilisateur/mot de passe incorrectes';
        errorContainer.style.display = 'block';
        throw new Error('Informations utilisateur/mot de passe incorrectes');
      }
    })
    .then((data) => {
      // Stockage du token d'authentification dans le local storage
      localStorage.setItem('token', data.token);

      // Redirection vers la page d'accueil en cas de connexion réussie
      window.location.href = 'index.html';
    })
    .catch((error) => console.error(error));
});
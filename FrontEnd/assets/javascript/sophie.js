 // Récupération des éléments nécessaires
 const btnModifier = document.getElementById('btn-modifier');
 const modal = document.getElementById('modal');
 const closeModalBtn = document.getElementById('close-modal');
 const imagesContainer = document.getElementById('images-container');
 const addButton = document.getElementById('modal-title');
 const imageUploadInput = document.getElementById('image-upload');
 const previewImage = document.getElementById('preview-image');
 const uploadWrapper = document.querySelector('.upload-wrapper');
 const imageTitleInput = document.getElementById('image-title');
 const imageCategorySelect = document.getElementById('image-category');
 const addPhotoButton = document.getElementById('add-photo-button');
 const backButton = document.getElementById('back-button');
 const modal1 = document.querySelector('.modal1');
 const modal2 = document.querySelector('.modal2');
 const ContentDisappear = document.querySelector('.ajouter-photo');

 // Fonction pour gérer l'ouverture de la fenêtre modale
 function openModal() {
   modal.style.display = 'block';
   modal.setAttribute('aria-hidden', 'false');
   document.body.classList.add('modal-open');

   // Appel à l'API pour récupérer les travaux de l'architecte
   fetch('http://localhost:5678/api/works')
     .then(response => response.json())
     .then(data => {
       // Réinitialiser le conteneur des images
       imagesContainer.innerHTML = '';

       // Parcourir les travaux et afficher les images avec les options de suppression
       data.forEach(work => {
         const imageElement = document.createElement('img');
         imageElement.src = work.imageUrl;
         imageElement.alt = work.title;

         const imageWrapper = document.createElement('div');
         imageWrapper.classList.add('image-wrapper');
         imageWrapper.appendChild(imageElement);

         const deleteButton = document.createElement('button');
         deleteButton.classList.add('delete-button');
         deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Utilisation de l'icône de poubelle de Font Awesome
         deleteButton.addEventListener('click', () => {
           // Appeler une fonction de suppression avec l'ID du travail à supprimer
           deleteWork(work.id);
         });
         imageWrapper.appendChild(deleteButton);

         const editLabel = document.createElement('p');
         editLabel.classList.add('edit-label');
         editLabel.textContent = 'éditer';
         imageWrapper.appendChild(editLabel);

         // Ajouter l'image et les options au conteneur
         imagesContainer.appendChild(imageWrapper);

         // Ajouter un saut de ligne après chaque 5 images
         if (imagesContainer.children.length % 5 === 0) {
           imagesContainer.appendChild(document.createElement('br'));
         }
       });
     })
     .catch(error => {
       console.error('Une erreur s\'est produite lors de la récupération des travaux:', error);
     });
 }

 // Fonction pour gérer la fermeture de la fenêtre modale
 function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  // Supprimer le contenu de l'élément de prévisualisation de l'image
  previewImage.src = '';
  uploadWrapper.classList.remove('has-preview');
  ContentDisappear.classList.remove('disappear');
}

 // Gestion de l'ouverture de la fenêtre modale
 btnModifier.addEventListener('click', openModal);

 // Gestion de la fermeture de la fenêtre modale en cliquant sur le bouton de fermeture
 closeModalBtn.addEventListener('click', closeModal);

 // Gestion de la fermeture de la fenêtre modale en cliquant en dehors de celle-ci
 modal.addEventListener('click', (event) => {
   if (event.target === modal) {
     closeModal();
   }
 });

 // Gestion de l'ouverture de la fenêtre modale d'ajout de photo
 addButton.addEventListener('click', () => {
   modal1.style.display = 'none';
   modal2.style.display = 'block';
 });

 // Fonction pour supprimer un travail
 function deleteWork(workId) {
   // Appel à l'API pour supprimer le travail avec l'ID spécifié
   fetch(`http://localhost:5678/api/works/${workId}`, {
     headers: {Authorization:GetBearerToken()},
     method: 'DELETE'
   })
     .then(response => {
       if (response.ok) {
         refreshGallery();
         // Le travail a été supprimé avec succès, actualiser la liste des travaux dans le modal
         openModal();
       } else {
         console.error('Une erreur s\'est produite lors de la suppression du travail:', response.status);
       }
     })
     .catch(error => {
       console.error('Une erreur s\'est produite lors de la suppression du travail:', error);
     });
 }

// Gestion de l'événement de changement de l'input de téléchargement de l'image
imageUploadInput.addEventListener('change', () => {
 const file = imageUploadInput.files[0];

 // Vérifier si un fichier a été sélectionné
 if (file) {
   // Créer un objet URL pour afficher le preview de l'image
   const imageURL = URL.createObjectURL(file);
   // Afficher l'image dans l'élément de prévisualisation
   previewImage.src = imageURL;
   // Ajouter la classe has-preview à upload-wrapper
   uploadWrapper.classList.add('has-preview');
   ContentDisappear.classList.add('disappear');

 } else {
   // Réinitialiser l'élément de prévisualisation si aucun fichier n'est sélectionné
   previewImage.src = '';
   // Supprimer la classe has-preview de upload-wrapper
   uploadWrapper.classList.remove('has-preview');
   ContentDisappear.classList.remove('disappear');
 }
});
 
// Gestion de l'événement de changement de l'input de téléchargement de l'image
imageUploadInput.addEventListener('change', () => {
  const file = imageUploadInput.files[0];

  // Vérifier si un fichier a été sélectionné
  if (file) {
    // Créer un objet URL pour afficher le preview de l'image
    const imageURL = URL.createObjectURL(file);
    // Afficher l'image dans l'élément de prévisualisation
    previewImage.src = imageURL;
    // Ajouter la classe has-preview à upload-wrapper
    uploadWrapper.classList.add('has-preview');
    ContentDisappear.classList.add('disappear');
  } else {
    // Réinitialiser l'élément de prévisualisation si aucun fichier n'est sélectionné
    previewImage.src = '';
    // Supprimer la classe has-preview de upload-wrapper
    uploadWrapper.classList.remove('has-preview');
    ContentDisappear.classList.remove('disappear');
  }
});


// Fonction pour ajouter une nouvelle photo à la galerie
function addNewPhoto(event) {
  event.preventDefault(); // Empêche le rafraichissement de la page

  const file = imageUploadInput.files[0];
  const title = imageTitleInput.value;
  const category = imageCategorySelect.value;

  if (file && title && category) {
    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);

    // Envoyer la requête POST à l'API
    fetch('http://localhost:5678/api/works', {
      headers: { Authorization: GetBearerToken() },
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        // Vider les champs du formulaire
        imageUploadInput.value = '';
        imageTitleInput.value = '';
        imageCategorySelect.value = '';

        // Fermer le modal d'ajout de photo
        closeModal();

        // Créer un nouvel élément d'image avec les données de la nouvelle photo
        const newImageElement = createImageElement(data);

        // Ajouter la nouvelle image à la galerie existante
        gallery.appendChild(newImageElement);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de l\'ajout de la photo:', error);
      });
  } else {
    // Afficher un message d'erreur lorsque tous les champs ne sont pas remplis
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = 'Veuillez remplir tous les champs.';
  }
}

// Gestion de l'événement du bouton "Valider" dans le modal d'ajout de photo
addPhotoButton.addEventListener('click', addNewPhoto);


 // Pour récupérer les catégories depuis l'API
 fetch('http://localhost:5678/api/works')
 .then(response => response.json())
 .then(data => {
   const categories = [];

   // Parcourir les travaux et ajouter les catégories à la liste sans doublons
   data.forEach(work => {
     const category = work.category;
     if (!categories.some(cat => cat.id === category.id)) {
       categories.push(category);
     }
   });

   // Utiliser la liste de catégories pour générer les options du select
   categories.forEach(category => {
     const option = document.createElement('option');
     option.value = category.id;
     option.textContent = category.name;
     imageCategorySelect.appendChild(option);
   });
 })
 .catch(error => {
   console.error('Une erreur s\'est produite lors de la récupération des travaux:', error);
 });


 // Fonction pour afficher le modal d'ajout de photo
 function showAddPhotoModal() {
   modal1.style.display = 'none';
   modal2.style.display = 'block';
 }

 // Fonction pour revenir au modal de la galerie photo
 function goBackToGallery() {
   modal2.style.display = 'none';
   modal1.style.display = 'block';
 }



 // Gestion de l'événement du bouton "Ajouter une photo"
 addButton.addEventListener('click', showAddPhotoModal);

 // Gestion de l'événement du bouton de retour
 backButton.addEventListener('click', goBackToGallery);


 function GetBearerToken(){
 return 'Bearer ' + localStorage.getItem('token');
}

// Fonction pour vérifier l'état de connexion de l'utilisateur
function checkUserLogin() {
    // Vérifier le token dans le local storage
    let token =  localStorage.getItem('token');
    let userConnected = token != null && token != undefined && token != '';
  
    if (userConnected) {
      // L'utilisateur est connecté
      document.body.classList.add('edit');
      const loginLink = document.querySelector('nav ul li a[href="login.html"]');
      loginLink.textContent = 'Logout';
      loginLink.addEventListener('click', logoutUser);
  
      const barreModal = document.getElementById('barre-modal');
      barreModal.style.display = 'block';
  
      const modifierLinks = document.querySelectorAll('.modifier');
      modifierLinks.forEach(link => {
        link.style.display = 'block';
        link.addEventListener('click', openModal);
      });
  
      const modifier2Links = document.querySelectorAll('.modifier2');
      modifier2Links.forEach(link => {
        link.style.display = 'block';
        link.addEventListener('click', openModal);
      });
  
      const filtersSection = document.querySelector('.filters');
      filtersSection.style.display = 'none';
    } else {
      // L'utilisateur n'est pas connecté
      const barreModal = document.getElementById('barre-modal');
      barreModal.style.display = 'none';
  
      const modifierLinks = document.querySelectorAll('.modifier');
      modifierLinks.forEach(link => {
        link.style.display = 'none';
      });
  
      const modifier2Links = document.querySelectorAll('.modifier2');
      modifier2Links.forEach(link => {
        link.style.display = 'none';
      });
  
      const filtersSection = document.querySelector('.filters');
      filtersSection.style.display = 'block';
  
      const loginLink = document.querySelector('nav ul li a[href="login.html"]');
      loginLink.textContent = 'Login';
    }
  }
  
  // Fonction pour déconnecter l'utilisateur
  function logoutUser() {
    localStorage.removeItem('token');
    // Recharger la page
    window.location.reload();
  }
  
  
  // Appel de la fonction pour vérifier l'état de connexion de l'utilisateur
  checkUserLogin();
  
  
          // Récupération des éléments HTML nécessaires
  const gallery = document.querySelector('.gallery');
  const filters = document.querySelector('.filters');
  
  // Fonction pour ajouter un projet à la galerie
  function addWorkToGallery(work) {
    const workElement = document.createElement('div');
    workElement.classList.add('work');
    const workImage = document.createElement('img');
    workImage.src = work.imageUrl;
    workImage.alt = work.title;
    const workTitle = document.createElement('h4');
    workTitle.textContent = work.title;
    workElement.appendChild(workImage);
    workElement.appendChild(workTitle);
    gallery.appendChild(workElement);
  }
  
  // Récupération des projets de l'architecte depuis l'API
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
      // Ajout de tous les travaux à la galerie
      works.forEach(work => {
        addWorkToGallery(work);
      });
  
      // Récupération des catégories depuis l'API
      fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
          // Création du filtre "Tous"
          const allFilter = document.createElement('button');
          allFilter.textContent = 'Tous';
          allFilter.addEventListener('click', () => {
            gallery.innerHTML = '';
            works.forEach(work => {
              addWorkToGallery(work);
            });
          });
          filters.appendChild(allFilter);
          // Création des filtres pour chaque catégorie
          categories.forEach(category => {
            const categoryFilter = document.createElement('button');
            categoryFilter.textContent = category.name;
            categoryFilter.addEventListener('click', () => {
              gallery.innerHTML = '';
              const filteredWorks = works.filter(work => work.categoryId === category.id);
              filteredWorks.forEach(work => {
                addWorkToGallery(work);
              });
            });
            filters.appendChild(categoryFilter);
          });
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
  
    window.addEventListener('DOMContentLoaded', () => {
    checkUserLogin();
  });
  
    // Fonction pour rafraîchir la galerie
    function refreshGallery() {
      // Récupération des projets de l'architecte depuis l'API
      fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
          // Supprimer tous les éléments de la galerie
          while (gallery.firstChild) {
            gallery.firstChild.remove();
          }
    
          // Ajout de tous les travaux à la galerie
          works.forEach(work => {
            addWorkToGallery(work);
          });
        })
        .catch(error => console.error(error));
    }

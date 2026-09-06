export function copyCurrentUrlToClipboard() {
    const currentUrl = window.location.href; // Récupère l'URL courante

    // Utiliser l'API du presse-papiers pour copier l'URL
    navigator.clipboard.writeText(currentUrl)
        .then(() => {
            console.log('URL copiée dans le presse-papiers avec succès!');
        })
        .catch(err => {
            console.error('Échec lors de la copie de l\'URL :', err);
        });
}

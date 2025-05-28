const API_URL = 'http://localhost:3000/suivi';

export default class SuiviController {
  async getAllSuivis() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erreur lors du chargement des suivis');
    return await response.json();
  }

  async addSuivi(newSuivi) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSuivi)
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout du suivi");
    return await response.json();
  }

  async deleteSuivi(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du suivi');
  }

  async updateSuivi(id, updatedFields) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du suivi");
    return await response.json();
  }
}

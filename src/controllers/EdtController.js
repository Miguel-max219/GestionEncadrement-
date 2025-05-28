const API_URL = 'http://localhost:3000';

export default class EdtController {
  async getAllEdt() {
    const response = await fetch(`${API_URL}/edt`);
    if (!response.ok) throw new Error('Erreur lors du chargement des emplois du temps');
    return await response.json();
  }

  async addEdt(newEdt) {
    const response = await fetch(`${API_URL}/edt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEdt)
    });
    if (!response.ok) throw new Error('Erreur lors de l\'ajout');
    const result = await response.json();
    console.log('Élément ajouté :', result);
    return result;
  }

  async deleteEdt(id) {
    const response = await fetch(`${API_URL}/edt/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  }

  async getProfesseurs() {
    const response = await fetch(`${API_URL}/professeurs`);
    if (!response.ok) throw new Error('Erreur lors du chargement des professeurs');
    return await response.json();
  }

  async getSalles() {
    const response = await fetch(`${API_URL}/salles`);
    if (!response.ok) throw new Error('Erreur lors du chargement des salles');
    return await response.json();
  }

  async updateEdt(id, updatedEdt) {
    const response = await fetch(`${API_URL}/edt/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEdt)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour');
    const result = await response.json();
    console.log('Élément mis à jour :', result);
    return result;
  }
}
export default class SuiviModel {
  constructor() {
    this.suivi = [];
  }

  async load() {
    const response = await fetch('/Database/db.json');
    const data = await response.json();
    this.suivi = data.suivi || [];
    return this.suivi;
  }

  create(item) {
    item.id = Date.now(); // Génère un ID unique basé sur l’heure actuelle
    this.suivi.push({ ...item });
    return item;
  }

  readAll() {
    return this.suivi;
  }

  update(id, newItem) {
    const index = this.suivi.findIndex(s => s.id === id);
    if (index !== -1) {
      this.suivi[index] = { ...this.suivi[index], ...newItem };
      return this.suivi[index];
    }
    return null;
  }

  delete(id) {
    const index = this.suivi.findIndex(s => s.id === id);
    if (index !== -1) {
      return this.suivi.splice(index, 1)[0];
    }
    return null;
  }
}

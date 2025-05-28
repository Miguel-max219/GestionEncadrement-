import { defineStore } from 'pinia'

export const useEncadrementStore = defineStore('encadrement', {
  state: () => ({
    encadrements: [],
    nextId: 1  // Compteur pour générer des IDs uniques
  }),
  actions: {
    addEncadrement(encadrement) {
      // Trouver le plus grand ID existant
      const maxId = this.encadrements.length > 0
        ? Math.max(...this.encadrements.map(e => e.id))
        : 0
      encadrement.id = maxId + 1
      this.encadrements.push(encadrement)
      this.saveToStorage()
    },
    deleteEncadrement(id) {
      this.encadrements = this.encadrements.filter(e => e.id !== id)
      this.saveToStorage()
    },
    updateEncadrement(updatedEncadrement) {
      const index = this.encadrements.findIndex(e => e.id === updatedEncadrement.id)
      if (index !== -1) {
        this.encadrements[index] = { ...updatedEncadrement }
        // Mettre à jour le localStorage
        localStorage.setItem('encadrements', JSON.stringify(this.encadrements))
      }
    },
    // Charger les données du localStorage au démarrage
    loadFromStorage() {
      const savedEncadrements = localStorage.getItem('encadrements')
      const savedNextId = localStorage.getItem('nextId')
      if (savedEncadrements) {
        this.encadrements = JSON.parse(savedEncadrements)
      }
      if (savedNextId) {
        this.nextId = parseInt(savedNextId)
      }
    },
    saveToStorage() {
      localStorage.setItem('encadrements', JSON.stringify(this.encadrements))
      localStorage.setItem('nextId', this.nextId.toString())
    }
  }
})
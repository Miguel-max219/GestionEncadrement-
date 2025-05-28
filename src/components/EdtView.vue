<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <!-- Titre principal de la page -->
    <h2 class="text-2xl font-bold mb-4 text-blue-700">Ajouter un emploi du temps</h2>

    <!-- Formulaire pour ajouter un emploi du temps -->
    <form @submit.prevent="addEdt()" class="space-y-3 mb-6">
      <!-- Sélection du professeur -->
      <select v-model="form.profid" required class="w-full border rounded px-3 py-2">
        <option value="" disabled>Choisir un professeur</option>
        <option v-for="prof in professeurs" :key="prof.id" :value="prof.id">
          {{ prof.prenom }} {{ prof.nom }}
        </option>
      </select>

      <!-- Champ pour sélectionner la date -->
      <input v-model="form.jour" placeholder="Jour" required type="date" class="w-full border rounded px-3 py-2" />

      <!-- Champ pour sélectionner l'heure de début -->
      <input v-model="form.heuredebut" placeholder="Heure début" required type="time"
        class="w-full border rounded px-3 py-2" />

      <!-- Champ pour sélectionner l'heure de fin -->
      <input v-model="form.heurefin" placeholder="Heure fin" required type="time"
        class="w-full border rounded px-3 py-2" />

      <!-- Sélection du type de lieu (salle ou en ligne) -->
      <select v-model="form.typeLieu" required class="w-full border rounded px-3 py-2">
        <option value="" disabled>Type de lieu</option>
        <option value="salle">Salle</option>
        <option value="en ligne">En ligne</option>
      </select>

      <!-- Si le type de lieu est une salle, afficher la liste des salles -->
      <template v-if="form.typeLieu === 'salle'">
        <select v-model="form.lieu" required class="w-full border rounded px-3 py-2">
          <option value="" disabled>Choisir une salle</option>
          <option v-for="salle in salles" :key="salle.id" :value="salle.nom">{{ salle.nom }}</option>
        </select>
      </template>

      <!-- Si le type de lieu est en ligne, afficher un champ pour l'URL de la visio -->
      <template v-else-if="form.typeLieu === 'en ligne'">
        <input v-model="form.urlVisio" placeholder="URL de la visio" required type="url"
          class="w-full border rounded px-3 py-2" />
      </template>

      <!-- Champ pour saisir l'activité -->
      <input v-model="form.activite" placeholder="Activité" required class="w-full border rounded px-3 py-2" />

      <!-- Bouton pour soumettre -->
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Ajouter
      </button>
    </form>
  </div>
</template>

<script>
import EdtController from '../controllers/EdtController';

export default {
  data() {
    return {
      // Liste des professeurs
      professeurs: [],
      // Liste des salles
      salles: [],
      // Instance du contrôleur pour gérer les appels API
      controller: new EdtController(),
      // Données du formulaire
      form: {
        profid: '',
        jour: '',
        heuredebut: '',
        heurefin: '',
        typeLieu: '',
        lieu: '',
        urlVisio: '',
        activite: ''
      }
    };
  },
  async mounted() {
    try {
      // Charger les professeurs depuis l'API
      this.professeurs = await this.controller.getProfesseurs();
      // Charger les salles depuis l'API
      this.salles = await this.controller.getSalles();
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
  },
  methods: {
    // Ajouter un nouvel emploi du temps
    async addEdt() {
      try {
        const newItem = await this.controller.addEdt(this.form);
        console.log('Emploi du temps ajouté :', newItem);
        this.resetForm(); // Réinitialiser le formulaire
        this.$router.push('/tableau'); // Rediriger vers la liste des emplois du temps
      } catch (error) {
        console.error('Erreur lors de l\'ajout :', error);
      }
    },
    // Réinitialiser le formulaire
    resetForm() {
      this.form = { profid: '', jour: '', heuredebut: '', heurefin: '', typeLieu: '', lieu: '', urlVisio: '', activite: '' };
    }
  }
};
</script>
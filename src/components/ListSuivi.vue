<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-center">Liste des Suivis</h2>

    <input
      type="text"
      v-model="filtreRecherche"
      placeholder="Filtrer par nom du prof ou étudiant..."
      class="block w-full max-w-md mx-auto mb-6 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
    />

    <table v-if="suivisFiltres.length" class="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="border border-gray-300 px-4 py-2">Professeur</th>
          <th class="border border-gray-300 px-4 py-2">Étudiant</th>
          <th class="border border-gray-300 px-4 py-2">Créneau</th>
          <th class="border border-gray-300 px-4 py-2">Tâche</th>
          <th class="border border-gray-300 px-4 py-2">Description</th>
          <th class="border border-gray-300 px-4 py-2">Commentaire</th>
          <th class="border border-gray-300 px-4 py-2">Date début</th>
          <th class="border border-gray-300 px-4 py-2">Date limite</th>
          <th class="border border-gray-300 px-4 py-2">Date fin</th>
          <th class="border border-gray-300 px-4 py-2">Statut</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="s in suivisFiltres"
          :key="s.id"
          :class="{
            'bg-green-100': s.tache_effectue,
            'bg-red-100': estEnRetard(s),
            'hover:bg-gray-100': true
          }"
        >
          <td class="border border-gray-300 px-4 py-2">{{ getProfNameBySuivi(s) }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ getEtudiantNameBySuivi(s) }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ getCreneauLabel(s.id_edt) }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.tache }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.description }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.commentaire_tache }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.date_commence_tache }}</td>
          <td class="border border-gray-300 px-4 py-2 text-red-600 font-semibold" v-if="estEnRetard(s)">
            {{ s.date_delai_tache }}
          </td>
          <td class="border border-gray-300 px-4 py-2" v-else>{{ s.date_delai_tache }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.date_fini_tache || '-' }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.tache_effectue ? 'Terminée' : 'En cours' }}</td>
          <td class="border border-gray-300 px-4 py-2 space-x-2">
            <button @click="modifierSuivi(s)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Modifier
            </button>
            <button @click="supprimerSuivi(s.id)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Supprimer
            </button>
            <button
              @click="effectuerSuivi(s)"
              v-if="!s.tache_effectue"
              class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Effectuer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="text-center text-gray-500">Aucun suivi enregistré.</p>

    <div v-if="suiviEnEdition" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 class="text-xl font-bold mb-4">Modifier le suivi</h3>
        <form @submit.prevent="validerModification" class="space-y-4">
          <div>
            <label class="block text-gray-700">Tâche</label>
            <input type="text" v-model="suiviEnEdition.tache" required class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label class="block text-gray-700">Description</label>
            <textarea v-model="suiviEnEdition.description" required class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"></textarea>
          </div>

          <div>
            <label class="block text-gray-700">Commentaire</label>
            <textarea v-model="suiviEnEdition.commentaire_tache" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"></textarea>
          </div>

          <div>
            <label class="block text-gray-700">Date de début</label>
            <input type="date" v-model="suiviEnEdition.date_commence_tache" required class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label class="block text-gray-700">Date limite</label>
            <input type="date" v-model="suiviEnEdition.date_delai_tache" required class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label class="block text-gray-700">Statut</label>
            <select v-model="suiviEnEdition.tache_effectue" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
              <option :value="true">Terminée</option>
              <option :value="false">En cours</option>
            </select>
          </div>

          <div v-if="suiviEnEdition.tache_effectue === true">
            <label class="block text-gray-700">Date fin</label>
            <input type="date" v-model="suiviEnEdition.date_fini_tache" required class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />
          </div>

          <div class="flex justify-end space-x-4">
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Valider</button>
            <button type="button" @click="annulerModification" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      edtList: [],
      professeurs: [],
      etudiants: [],
      suivis: [],
      suiviEnEdition: null,
      filtreRecherche: '',
    };
  },
  computed: {
    suivisFiltres() {
      const filtre = this.filtreRecherche.toLowerCase().trim();
      if (!filtre) return this.suivis;

      return this.suivis.filter((suivi) => {
        const profNom = this.getProfNameBySuivi(suivi).toLowerCase();
        const etuNom = this.getEtudiantNameBySuivi(suivi).toLowerCase();
        return profNom.includes(filtre) || etuNom.includes(filtre);
      });
    },
  },
  methods: {
    async chargerDonnees() {
      const response = await fetch('/Database/db.json');
      const data = await response.json();
      this.edtList = data.edt || [];
      this.professeurs = data.professeurs || [];
      this.etudiants = data.etudiants || [];

      const sauvegarde = localStorage.getItem('suivis');
      this.suivis = sauvegarde ? JSON.parse(sauvegarde) : data.suivi || [];
    },

    getProfNameBySuivi(suivi) {
      const edt = this.edtList.find((e) => e.id === suivi.id_edt);
      const prof = edt && this.professeurs.find((p) => p.id === edt.profid);
      return prof ? `${prof.nom} ${prof.prenom}` : 'Prof inconnu';
    },

    getEtudiantNameBySuivi(suivi) {
      const etu = this.etudiants.find((e) => e.id === suivi.id_etudiant);
      return etu ? `${etu.nom} ${etu.prenom}` : 'Étudiant inconnu';
    },

    getCreneauLabel(id_edt) {
      const edt = this.edtList.find((e) => e.id === id_edt);
      return edt ? `${edt.jour} - ${edt.heuredebut} à ${edt.heurefin}` : 'Créneau inconnu';
    },

    estEnRetard(suivi) {
      return (
        suivi.tache_effectue &&
        suivi.date_fini_tache &&
        suivi.date_delai_tache &&
        suivi.date_fini_tache > suivi.date_delai_tache
      );
    },

    modifierSuivi(suivi) {
      this.suiviEnEdition = { ...suivi };
    },

    annulerModification() {
      this.suiviEnEdition = null;
    },

    validerModification() {
      if (this.suiviEnEdition.tache_effectue && !this.suiviEnEdition.date_fini_tache) {
        alert('Veuillez renseigner la date de fin si la tâche est terminée.');
        return;
      }

      const index = this.suivis.findIndex((s) => s.id === this.suiviEnEdition.id);
      if (index !== -1) {
        this.suivis.splice(index, 1, { ...this.suiviEnEdition });
        localStorage.setItem('suivis', JSON.stringify(this.suivis));
        this.suiviEnEdition = null;
      }
    },

    supprimerSuivi(id) {
      if (confirm('Voulez-vous vraiment supprimer ce suivi ?')) {
        this.suivis = this.suivis.filter((s) => s.id !== id);
        localStorage.setItem('suivis', JSON.stringify(this.suivis));
      }
    },

    effectuerSuivi(suivi) {
      const index = this.suivis.findIndex((item) => item.id === suivi.id);
      if (index !== -1) {
        const aujourdHui = new Date().toISOString().slice(0, 10);
        this.suivis[index].tache_effectue = true;
        this.suivis[index].date_fini_tache = aujourdHui;
        localStorage.setItem('suivis', JSON.stringify(this.suivis));
      }
    },
  },
  mounted() {
    this.chargerDonnees();
  },
};
</script>

<style scoped>
.table-suivi {
  width: 100%;
  border-collapse: collapse;
}

.table-suivi th,
.table-suivi td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.table-suivi tbody tr.fini {
  background-color: #d4edda;
}

.table-suivi tbody tr.retard .date-rouge {
  color: red;
  font-weight: bold;
}

.date-rouge {
  color: red;
  font-weight: bold;
}

button {
  margin-right: 5px;
  padding: 4px 8px;
  cursor: pointer;
}

.modal {
  background: #f5f5f5;
  padding: 20px;
  border: 1px solid #aaa;
  margin-top: 20px;
}

.filtre-input {
  margin-bottom: 15px;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  font-size: 1rem;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-500 {
  color: #6b7280;
}

.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.bg-blue-600 {
  background-color: #3182ce;
}

.bg-red-500 {
  background-color: #e53e3e;
}

.bg-red-600 {
  background-color: #c53030;
}

.bg-green-500 {
  background-color: #48bb78;
}

.bg-green-600 {
  background-color: #38a169;
}

.rounded {
  border-radius: 0.375rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.w-full {
  width: 100%;
}

.max-w-lg {
  max-width: 32rem;
}

.p-6 {
  padding: 1.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.text-red-600 {
  color: #e53e3e;
}

.font-semibold {
  font-weight: 600;
}

.hover\:bg-blue-600:hover {
  background-color: #3182ce;
}

.hover\:bg-red-600:hover {
  background-color: #c53030;
}

.hover\:bg-green-600:hover {
  background-color: #38a169;
}
</style>

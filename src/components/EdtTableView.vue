<template>
  <div class="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4 text-blue-700">Liste des emplois du temps</h2>
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Date</th>
          <th class="border border-gray-300 px-4 py-2">Heure</th>
          <th class="border border-gray-300 px-4 py-2">Lieu</th>
          <th class="border border-gray-300 px-4 py-2">Activité</th>
          <th class="border border-gray-300 px-4 py-2">Professeur</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedEdtList" :key="item.id">
          <td class="border border-gray-300 px-4 py-2">{{ item.jour }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.heuredebut }} - {{ item.heurefin }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <span v-if="item.typeLieu === 'salle'">{{ item.lieu }}</span>
            <span v-else>
              <a :href="item.urlVisio" class="text-blue-600 underline" target="_blank">{{ item.urlVisio }}</a>
            </span>
          </td>
          <td class="border border-gray-300 px-4 py-2">{{ item.activite }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ getProfName(item.profid) }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <button @click="edit(item)" class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
              Modifier
            </button>
            <button @click="remove(item.id)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-4 gap-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Précédent
      </button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>

    <!-- Popup de modification -->
    <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-xl font-bold mb-4 text-blue-700">Modifier l'emploi du temps</h3>
        <form @submit.prevent="updateEdt">
          <select v-model="form.profid" required class="w-full border rounded px-3 py-2 mb-3">
            <option value="" disabled>Choisir un professeur</option>
            <option v-for="prof in professeurs" :key="prof.id" :value="prof.id">
              {{ prof.prenom }} {{ prof.nom }}
            </option>
          </select>
          <input v-model="form.jour" placeholder="Jour" required type="date" class="w-full border rounded px-3 py-2 mb-3" />
          <input v-model="form.heuredebut" placeholder="Heure début" required type="time"
            class="w-full border rounded px-3 py-2 mb-3" />
          <input v-model="form.heurefin" placeholder="Heure fin" required type="time"
            class="w-full border rounded px-3 py-2 mb-3" />
          <select v-model="form.typeLieu" required class="w-full border rounded px-3 py-2 mb-3">
            <option value="" disabled>Type de lieu</option>
            <option value="salle">Salle</option>
            <option value="en ligne">En ligne</option>
          </select>
          <template v-if="form.typeLieu === 'salle'">
            <select v-model="form.lieu" required class="w-full border rounded px-3 py-2 mb-3">
              <option value="" disabled>Choisir une salle</option>
              <option v-for="salle in salles" :key="salle.id" :value="salle.nom">{{ salle.nom }}</option>
            </select>
          </template>
          <template v-else-if="form.typeLieu === 'en ligne'">
            <input v-model="form.urlVisio" placeholder="URL de la visio" required type="url"
              class="w-full border rounded px-3 py-2 mb-3" />
          </template>
          <input v-model="form.activite" placeholder="Activité" required class="w-full border rounded px-3 py-2 mb-3" />
          <div class="flex gap-2">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
            <button type="button" @click="cancelEdit"
              class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import EdtController from '../controllers/EdtController';

export default {
  data() {
    return {
      edtList: [],
      professeurs: [],
      salles: [],
      controller: new EdtController(),
      form: {
        profid: '',
        jour: '',
        heuredebut: '',
        heurefin: '',
        typeLieu: '',
        lieu: '',
        urlVisio: '',
        activite: ''
      },
      isEditing: false,
      editId: null,
      currentPage: 1, // Page actuelle
      itemsPerPage: 5 // Nombre d'éléments par page
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.edtList.length / this.itemsPerPage);
    },
    paginatedEdtList() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.edtList.slice(start, end);
    }
  },
  async mounted() {
    try {
      this.professeurs = await this.controller.getProfesseurs();
      this.salles = await this.controller.getSalles();
      this.edtList = await this.controller.getAllEdt();
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
  },
  methods: {
    async updateEdt() {
      try {
        const updatedItem = await this.controller.updateEdt(this.editId, this.form);
        const index = this.edtList.findIndex(item => item.id === this.editId);
        if (index !== -1) {
          this.edtList[index] = updatedItem;
        }
        this.cancelEdit();
      } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
      }
    },
    async remove(id) {
      try {
        await this.controller.deleteEdt(id);
        this.edtList = this.edtList.filter(item => item.id !== id);
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
      }
    },
    edit(item) {
      this.form = { ...item };
      this.isEditing = true;
      this.editId = item.id;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editId = null;
      this.form = {
        profid: '',
        jour: '',
        heuredebut: '',
        heurefin: '',
        typeLieu: '',
        lieu: '',
        urlVisio: '',
        activite: ''
      };
    },
    getProfName(profid) {
      const prof = this.professeurs.find(p => p.id === String(profid));
      return prof ? `${prof.prenom} ${prof.nom}` : 'Inconnu';
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
};
</script>
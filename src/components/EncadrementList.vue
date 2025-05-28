<template>
  <div class="encadrement-list">
    <h2>Liste des Encadrements</h2>
    <div class="actions">
      <button @click="showAddForm" class="btn-add">Ajouter un encadrement</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Étudiant ID</th>
          <th>Encadreur ID</th>
          <th>Date Début</th>
          <th>Date Fin</th>
          <th class="sujet-col">Sujet</th>
          <th>Lieu</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in encadrements" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.etudiantId }}</td>
          <td>{{ item.encadreurId }}</td>
          <td>{{ item.dateDebut }}</td>
          <td>{{ item.dateFin }}</td>
          <td class="sujet-col">{{ item.sujet }}</td>
          <td>{{ item.lieu }}</td>
          <td class="actions-col">
            <span @click="editItem(item)" class="icon-btn" title="Modifier">
              <!-- Icône crayon (édition) -->
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-9.1 9.1-2.1.4.4-2.1 9.1-9.1z" stroke="#2196F3" stroke-width="2" fill="none"/>
                <path d="M13.5 4.5l2 2" stroke="#2196F3" stroke-width="2"/>
              </svg>
            </span>
            <span @click="deleteItem(item.id)" class="icon-btn" title="Supprimer">
              <!-- Icône poubelle (suppression) -->
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="5" y="7" width="10" height="9" rx="2" stroke="#f44336" stroke-width="2"/>
                <path d="M3 7h14" stroke="#f44336" stroke-width="2"/>
                <path d="M8 7V5a2 2 0 0 1 4 0v2" stroke="#f44336" stroke-width="2"/>
              </svg>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useEncadrementStore } from '../stores/encadrement'

export default {
  name: 'EncadrementList',
  data() {
    return {
      store: useEncadrementStore()
    }
  },
  computed: {
    encadrements() {
      return this.store.encadrements
    }
  },
  methods: {
    showAddForm() {
      this.$router.push('/add')
    },
    editItem(id) {
      // S'assurer que l'ID est correctement passé
      this.$router.push(`/edit/${id}`)
    },
    deleteItem(id) {
      if(confirm('Êtes-vous sûr de vouloir supprimer cet encadrement ?')) {
        // Vérification supplémentaire avant la suppression
        const encadrementToDelete = this.encadrements.find(e => e.id === id)
        if (encadrementToDelete) {
          this.store.deleteEncadrement(id)
        } else {
          alert('Encadrement introuvable')
        }
      }
    }
  },
  created() {
    this.store.loadFromStorage()
  }
}
</script>

<style scoped>
.encadrement-list {
  padding: 20px;
}

table {
  width: 100%;
  table-layout: auto; /* Permet aux colonnes de s'ajuster */
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  white-space: normal; /* Permet le retour à la ligne */
}

th {
  background-color: #4d4d4d;
}

th.sujet-col, td.sujet-col {
  min-width: 200px;
  max-width: 400px;
  width: 30%;
}

th.actions-col, td.actions-col {
  text-align: center;
  min-width: 160px;
  width: 15%;
}

.btn-add {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.icon-btn {
  display: inline-block;
  cursor: pointer;
  margin: 0 5px;
  vertical-align: middle;
  transition: transform 0.1s;
}
.icon-btn:hover {
  transform: scale(1.2);
}
</style>
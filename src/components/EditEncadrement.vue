<template>
  <div class="encadrement-form" v-if="form">
    <h2>Modifier un encadrement</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>ID Étudiant:</label>
        <input type="number" v-model="form.etudiantId" required>
      </div>
      <div class="form-group">
        <label>ID Encadreur:</label>
        <input type="number" v-model="form.encadreurId" required>
      </div>
      <div class="form-group">
        <label>Date Début:</label>
        <input type="date" v-model="form.dateDebut" required>
      </div>
      <div class="form-group">
        <label>Date Fin:</label>
        <input type="date" v-model="form.dateFin" required>
      </div>
      <div class="form-group">
        <label>Sujet:</label>
        <input type="text" v-model="form.sujet" required>
      </div>
      <div class="form-group">
        <label>Lieu:</label>
        <input type="text" v-model="form.lieu" required>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Modifier</button>
        <button type="button" @click="$router.push('/')" class="btn-cancel">Annuler</button>
      </div>
    </form>
  </div>
  <div v-else>
    <p>Encadrement introuvable.</p>
  </div>
</template>

<script>
import { useEncadrementStore } from '../stores/encadrement'

export default {
  name: 'EditEncadrement',
  data() {
    return {
      store: useEncadrementStore(),
      form: null
    }
  },
  created() {
    const id = parseInt(this.$route.params.id)
    const encadrement = this.store.encadrements.find(e => e.id === id)
    if (encadrement) {
      // Copie profonde pour éviter la modification directe
      this.form = JSON.parse(JSON.stringify(encadrement))
    }
  },
  methods: {
    handleSubmit() {
      this.store.updateEncadrement({ ...this.form })
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* Tu peux copier le style du formulaire existant ici */
.encadrement-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.btn-submit {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-cancel {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit:hover {
  background-color: #45a049;
}
.btn-cancel:hover {
  background-color: #da190b;
}
</style>

<template>
  <div>
    <h1>Liste des Professeurs</h1>

    <form @submit.prevent="isEditing ? updateProfesseur() : addProfesseur()">
      <input v-model.number="form.id" placeholder="ID" required type="number" min="1" :readonly="isEditing" />
      <input v-model="form.nom" placeholder="Nom" required />
      <input v-model="form.prenom" placeholder="Prénom" required />
      <input v-model="form.email" placeholder="Email" required />
      <input v-model="form.telephone" placeholder="Téléphone" required />
      <input v-model="form.specialite" placeholder="Spécialité" required />
      <input v-model="form.departement" placeholder="Département" required />
      <input v-model="form.role" placeholder="Rôle" required />
      <button type="submit">{{ isEditing ? 'Modifier' : 'Ajouter' }}</button>
      <button v-if="isEditing" type="button" @click="resetForm">Annuler</button>
    </form>

    <table border="1" cellpadding="5">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Spécialité</th>
          <th>Département</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prof in professeurs" :key="prof.id">
          <td>{{ prof.id }}</td>
          <td>{{ prof.nom }}</td>
          <td>{{ prof.prenom }}</td>
          <td>{{ prof.email }}</td>
          <td>{{ prof.telephone }}</td>
          <td>{{ prof.specialite }}</td>
          <td>{{ prof.departement }}</td>
          <td>{{ prof.role }}</td>
          <td>
            <button @click="editProfesseur(prof)">Modifier</button>
            <button @click="deleteProfesseur(prof.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import './ProfesseurCrud.css'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/professeurs'

const professeurs = ref([])
const isEditing = ref(false)

const form = ref({
  id: '',
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  specialite: '',
  departement: '',
  role: '',
  etudiantsEncadres: []
})

const fetchProfesseurs = async () => {
  const res = await axios.get(API_URL)
  professeurs.value = res.data
}

const addProfesseur = async () => {
  const exists = professeurs.value.some(p => p.id === form.value.id)
  if (exists) {
    alert("Cet ID existe déjà !")
    return
  }
  await axios.post(API_URL, { ...form.value, etudiantsEncadres: [] })
  resetForm()
  fetchProfesseurs()
}

const updateProfesseur = async () => {
  try {
    await axios.put(`${API_URL}/${form.value.id}`, { ...form.value })
    resetForm()
    fetchProfesseurs()
  } catch (error) {
    console.error("Erreur lors de la modification :", error)
    alert("Erreur lors de la modification.")
  }
}

const deleteProfesseur = async (id) => {
  if (confirm("Voulez-vous vraiment supprimer ce professeur ?")) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchProfesseurs()
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
      alert("Erreur lors de la suppression.")
    }
  }
}

const editProfesseur = (prof) => {
  isEditing.value = true
  form.value = { ...prof }
}

const resetForm = () => {
  isEditing.value = false
  form.value = {
    id: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    departement: '',
    role: '',
    etudiantsEncadres: []
  }
}

onMounted(fetchProfesseurs)
</script>

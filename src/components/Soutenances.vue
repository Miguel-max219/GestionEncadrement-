<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-center">Gestion des Soutenances</h1>

    <div class="space-y-4">
      <label class="block">
        <span class="text-gray-700">Étudiant :</span>
        <select v-model="soutenance.etudiantId" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
          <option disabled value="">Choisir...</option>
          <option v-for="e in etudiants" :value="e.id" :key="e.id">{{ e.nom }} {{ e.prenom }}</option>
        </select>
      </label>

      <label class="block">
        <span class="text-gray-700">Encadrant :</span>
        <select v-model="soutenance.professeurId" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
          <option disabled value="">Choisir...</option>
          <option v-for="p in professeurs" :value="p.id" :key="p.id">{{ p.nom }} {{ p.prenom }}</option>
        </select>
      </label>

      <label class="block">
        <span class="text-gray-700">Titre du projet :</span>
        <input type="text" v-model="soutenance.titre" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
      </label>

      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <input type="checkbox" v-model="soutenance.projetValide" class="form-checkbox h-5 w-5 text-blue-600">
          <span class="ml-2 text-gray-700">Projet validé</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="soutenance.memoireValide" class="form-checkbox h-5 w-5 text-blue-600">
          <span class="ml-2 text-gray-700">Mémoire validé</span>
        </label>
      </div>

      <div v-if="soutenance.projetValide && soutenance.memoireValide" class="space-y-4">
        <label class="block">
          <span class="text-gray-700">Date :</span>
          <input type="date" v-model="soutenance.date" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
        </label>
        <label class="block">
          <span class="text-gray-700">Heure :</span>
          <input type="time" v-model="soutenance.heure" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
        </label>
        <label class="block">
          <span class="text-gray-700">Lieu :</span>
          <input type="text" v-model="soutenance.lieu" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
        </label>
      </div>

      <button @click="isEditing ? modifierSoutenance() : ajouterSoutenance()" class="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
        {{ isEditing ? "Modifier la soutenance" : "Ajouter la soutenance" }}
      </button>
      <button v-if="isEditing" @click="annulerModification" class="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700">
        Annuler
      </button>
    </div>

    <h2 class="text-xl font-bold mt-8 mb-4 text-center">Liste des Soutenances</h2>
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">Étudiant</th>
          <th class="border border-gray-300 px-4 py-2">Encadrant</th>
          <th class="border border-gray-300 px-4 py-2">Titre</th>
          <th class="border border-gray-300 px-4 py-2">Projet</th>
          <th class="border border-gray-300 px-4 py-2">Mémoire</th>
          <th class="border border-gray-300 px-4 py-2">Date</th>
          <th class="border border-gray-300 px-4 py-2">Heure</th>
          <th class="border border-gray-300 px-4 py-2">Lieu</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in liste" :key="s.id" class="text-center">
          <td class="border border-gray-300 px-4 py-2">{{ nomEtudiant(s.etudiantId) }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ nomProfesseur(s.professeurId) }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.titre }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.projetValide ? "Oui" : "Non" }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.memoireValide ? "Oui" : "Non" }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.date || "-" }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.heure || "-" }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ s.lieu || "-" }}</td>
          <td class="border border-gray-300 px-4 py-2 space-x-2">
            <button @click="chargerSoutenance(s)" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Modifier
            </button>
            <button @click="supprimerSoutenance(s.id)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      etudiants: [],
      professeurs: [],
      liste: [],
      soutenance: {
        etudiantId: "",
        professeurId: "",
        titre: "",
        projetValide: false,
        memoireValide: false,
        date: "",
        heure: "",
        lieu: ""
      },
      isEditing: false,
    };
  },
  methods: {
    nomEtudiant(id) {
      const e = this.etudiants.find(e => e.id === id);
      return e ? e.nom : "Inconnu";
    },
    nomProfesseur(id) {
      const p = this.professeurs.find(p => p.id === id);
      return p ? p.nom : "Inconnu";
    },
    async charger() {
      const e = await fetch("http://localhost:3000/etudiants");
      const p = await fetch("http://localhost:3000/professeurs");
      const s = await fetch("http://localhost:3000/soutenances");

      this.etudiants = await e.json();
      this.professeurs = await p.json();
      this.liste = await s.json();
    },
    async ajouterSoutenance() {
      await fetch("http://localhost:3000/soutenances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.soutenance)
      });
      this.resetForm();
      this.charger();
    },
    async modifierSoutenance() {
      await fetch(`http://localhost:3000/soutenances/${this.soutenance.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.soutenance)
      });
      this.resetForm();
      this.charger();
    },
    async supprimerSoutenance(id) {
      if (confirm("Voulez-vous vraiment supprimer cette soutenance ?")) {
        await fetch(`http://localhost:3000/soutenances/${id}`, {
          method: "DELETE"
        });
        this.charger();
      }
    },
    chargerSoutenance(s) {
      this.soutenance = { ...s };
      this.isEditing = true;
    },
    annulerModification() {
      this.resetForm();
    },
    resetForm() {
      this.soutenance = {
        etudiantId: "",
        professeurId: "",
        titre: "",
        projetValide: false,
        memoireValide: false,
        date: "",
        heure: "",
        lieu: ""
      };
      this.isEditing = false;
    }
  },
  mounted() {
    this.charger();
  }
};
</script>
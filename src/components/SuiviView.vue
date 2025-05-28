<template>
  <div class="suivi-container">
    <h2>Ajouter un Suivi</h2>

    <form @submit.prevent="ajouterSuivi">
      <label for="edt">Sélectionnez un créneau :</label>
      <select v-model="nouveauSuivi.id_edt" required @change="mettreAJourEtudiants">
        <option disabled value="">-- Choisir un créneau --</option>
        <option v-for="e in edtList" :key="e.id" :value="e.id">
          {{ e.jour }} - {{ e.heuredebut }} à {{ e.heurefin }} | Prof : {{ getProfName(e.profid) }}
        </option>
      </select>

      <label for="etudiant">Étudiant :</label>
      <select v-model="nouveauSuivi.id_etudiant" required>
        <option disabled value="">-- Choisir un étudiant --</option>
        <option v-for="et in etudiantsFiltres" :key="et.id" :value="et.id">
          {{ et.nom }} {{ et.prenom }}
        </option>
      </select>

      <label>Tâche :</label>
      <input v-model="nouveauSuivi.tache" required />

      <label>Description :</label>
      <textarea v-model="nouveauSuivi.description"></textarea>

      <label>Commentaire :</label>
      <textarea v-model="nouveauSuivi.commentaire_tache"></textarea>

      <label>Date de début :</label>
      <input type="date" v-model="nouveauSuivi.date_commence_tache" required />

      <label>Date limite :</label>
      <input type="date" v-model="nouveauSuivi.date_delai_tache" required />

      <label>
        <input type="checkbox" v-model="nouveauSuivi.tache_effectue" />
        Tâche effectuée
      </label>

      <label>Date de fin :</label>
      <input type="date" v-model="nouveauSuivi.date_fini_tache" :disabled="!nouveauSuivi.tache_effectue" />

      <button type="submit">Ajouter le Suivi</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      edtList: [],
      professeurs: [],
      etudiants: [],
      encadrements: [],
      suivis: [],
      etudiantsFiltres: [],
      nouveauSuivi: {
        id_edt: '',
        id_etudiant: '',
        tache: '',
        description: '',
        commentaire_tache: '',
        date_commence_tache: '',
        date_delai_tache: '',
        tache_effectue: false,
        date_fini_tache: ''
      }
    };
  },
  methods: {
    async chargerDonnees() {
      const response = await fetch('/Database/db.json');
      const data = await response.json();
      this.edtList = data.edt || [];
      this.professeurs = data.professeurs || [];
      this.etudiants = data.etudiants || [];
      this.encadrements = data.encadrement || [];
      this.chargerSuivis();
    },

    chargerSuivis() {
      const sauvegarde = localStorage.getItem('suivis');
      this.suivis = sauvegarde ? JSON.parse(sauvegarde) : [];
    },

    enregistrerSuivis() {
      localStorage.setItem('suivis', JSON.stringify(this.suivis));
    },

    ajouterSuivi() {
      const nouveau = {
        ...this.nouveauSuivi,
        id: Date.now()
      };
      this.suivis.push(nouveau);
      this.enregistrerSuivis();
      this.reinitialiserFormulaire();
    },

    reinitialiserFormulaire() {
      this.nouveauSuivi = {
        id_edt: '',
        id_etudiant: '',
        tache: '',
        description: '',
        commentaire_tache: '',
        date_commence_tache: '',
        date_delai_tache: '',
        tache_effectue: false,
        date_fini_tache: ''
      };
      this.etudiantsFiltres = [];
    },

    mettreAJourEtudiants() {
      const edt = this.edtList.find(e => e.id == this.nouveauSuivi.id_edt);
      if (!edt) return;
      const encadrements = this.encadrements.filter(enc => enc.encadreurid == edt.profid);
      const idsEtudiants = encadrements.map(enc => enc.etudiantid.toString());
      this.etudiantsFiltres = this.etudiants.filter(e => idsEtudiants.includes(e.id));
    },

    /*getEdtLabel(id) {
      const edt = this.edtList.find(e => e.id == id);
      return edt
        ? `${edt.jour} - ${edt.heuredebut} à ${edt.heurefin} | Prof : ${this.getProfName(edt.profid)}`
        : 'Non trouvé';
    },*/

    getProfName(profid) {
      const prof = this.professeurs.find(p => p.id == profid);
      return prof ? `${prof.nom} ${prof.prenom}` : 'Inconnu';
    },

    /*getEtudiantName(etudiantid) {
      const etu = this.etudiants.find(e => e.id == etudiantid);
      return etu ? `${etu.nom} ${etu.prenom}` : 'Inconnu';
    }*/
  },
  mounted() {
    this.chargerDonnees();
  }
};
</script>

<style scoped>
.suivi-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #e6f0ff; /* fond bleu clair */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(30, 70, 150, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #003366;
}

h2, h3 {
  color: #004aad; /* bleu plus foncé */
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

form > * {
  margin-bottom: 15px;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
}

input[type="text"],
input[type="date"],
select,
textarea {
  padding: 8px;
  border: 1.5px solid #3399ff;
  border-radius: 5px;
  font-size: 14px;
  color: #003366;
}

input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.1);
  cursor: pointer;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

button {
  background-color: #004aad;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #003366;
}
</style>

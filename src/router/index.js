import { createRouter, createWebHistory } from 'vue-router';
import EdtView from '../components/EdtView.vue';
import EdtTableView from '../components/EdtTableView.vue';
import EncadrementList from '../components/EncadrementList.vue';
import EncadrementForm from '../components/EncadrementForm.vue';
import SuiviView from '../components/SuiviView';
import listSuivi from '../components/ListSuivi';
import Soutenances from '../components/Soutenances.vue';
import professeurs from '../components/ProfesseurCrud.vue'


const routes = [
  {
    path: '/edt',
    name: 'Edt',
    component: EdtView
  },


  {
    path: '/tableau',
    name: 'EdtTable',
    component: EdtTableView
  },

  {
    path: '/add',
    name: 'add',
    component: EncadrementForm
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: EncadrementList
  },

  {
    path: '/suivi',
    name: 'Suivi',
    component: SuiviView
  },

  {
    path: '/listeSuivi',
    name: 'SuiviList',
    component: listSuivi
  },

  
  {
    path: '/soutenances',
    name: 'Soutenances',
    component: Soutenances
  },
  

  {
    path: '/professeurs',
    name: 'Professeurs',
    component: professeurs
  },
  {
    path: '/edit/:id',
    name: 'EditEncadrement',
    component: ()=> import('../components/EditEncadrement.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
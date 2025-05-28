<template>
  <nav class="fixed top-0 left-0 w-full z-50 backdrop-blur bg-white/70 p-4 shadow">
    <ul class="flex gap-6 justify-center">
      <li>
        <router-link to="/suivi" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Gestion des Suivi d'encadrements
        </router-link>
      </li>
      <li>
        <router-link to="/listeSuivi" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Listes des suivi d'encadrements
        </router-link>
      </li>
      <li>
        <router-link to="/add" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Gestion des encadrements
        </router-link>
      </li>
      <li>
        <router-link to="/edit/:id" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Listes des encadrements
        </router-link>
      </li>
      <li>
        <router-link to="/edt" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Emploi du temps
        </router-link>
      </li>
      <li>
        <router-link to="/tableau" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Tableaux des encadrements
        </router-link>
      </li>
      <li>
        <router-link to="/soutenances" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Soutenances
        </router-link>
      </li>
       <li>
        <router-link to="/professeurs" class="text-blue-600 font-semibold hover:underline" active-class="underline">
          Gestion des professeurs
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>
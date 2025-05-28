<template>
  <div id="app">
    <Navbar />
    <router-view @data-updated="reloadCalendarData" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
  methods: {
    reloadCalendarData() {
      this.$root.$emit('reload-calendar-data');
    }
  }
};
</script>

<style>
#app {
  padding-top: 72px; /* Ajuste selon la hauteur de ta navbar */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
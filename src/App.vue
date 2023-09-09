<script setup>
import { computed } from 'vue'
import store from './store'
import AppBar from './components/AppBar.vue'

const drawer = computed({
  get: () => store.getters['drawer/getDrawer'],
  set: val => store.commit('drawer/setDrawer', val),
})
</script>

<template>
  <v-app>
    <AppBar v-model:drawer="drawer" />

    <v-main class="fixed left-0 right-0 top-0 bottom-0">
      <router-view />
    </v-main>
  </v-app>
</template>

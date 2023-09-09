<script setup>
import { computed } from 'vue'

const props = defineProps({
  drawer: Boolean,
})

const emit = defineEmits(['update:drawer'])

const drawer = computed({
  get: () => props.drawer,
  set: val => emit('update:drawer', val),
})
</script>

<template>
  <v-app-bar app dark clipped-left color="primary">
    <v-toolbar-title>
      <v-btn icon dark @click.stop="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-icon>mdi-tree</v-icon>
      <span class="ml-2">IForest</span>
    </v-toolbar-title>

    <v-spacer />

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-app-bar>
</template>

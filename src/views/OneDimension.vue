<script setup>
import { ref } from 'vue'
import { calcDepthsHarmony } from './iforest/thiforest'
import ForestView from './components/ForestView.vue'
import ConfigDrawer from './components/ConfigDrawer.vue'

const drawer = ref(true)
const data = ref([])

function handleChangeLines(newVal) {
  // Calc depths
  calcDepthsHarmony(newVal).then((depths) => {
    // update points
    let sum = 0
    const points = [
      0,
      ...newVal.map((sum = 0, n => sum += n)),
    ]
      .map(x => [x])

    data.value = points.map((point, i) => ({
      point: point[0],
      depth: depths[i],
    }))
  })
}
</script>

<template>
  <v-app>
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

    <ConfigDrawer v-model:drawer="drawer" @change="handleChangeLines" />

    <v-main class="fixed left-0 right-0 top-0 bottom-0">
      <ForestView :data="data" :r="10" />
    </v-main>
  </v-app>
</template>

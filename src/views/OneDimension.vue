<script setup>
import { computed, ref } from 'vue'
import store from '../store'
import { calcDepthsHarmony } from '../iforest/thiforest'
import ForestView from '../components/ForestView.vue'
import ConfigDrawer from '../components/ConfigDrawer.vue'

const drawer = computed({
  get: () => store.getters['drawer/getDrawer'],
  set: val => store.commit('drawer/setDrawer', val),
})
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
  <div>
    <ConfigDrawer v-model:drawer="drawer" @change="handleChangeLines" />

    <v-main class="fixed left-0 right-0 top-0 bottom-0">
      <ForestView :data="data" :r="10" />
    </v-main>
  </div>
</template>

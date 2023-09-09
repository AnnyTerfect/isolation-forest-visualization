<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps(['drawer'])

const emits = defineEmits(['update:drawer', 'change'])

const step = 0.01

const lines = ref(Array(5).fill(1))
const checks = ref(Array(5).fill(false))

const drawer = computed({
  get() {
    return props.drawer
  },
  set(newVal) {
    emits('update:drawer', newVal)
  },
})
const allSynced = computed(() => checks.value.every(d => d))

function addLine() {
  lines.value.push(10)
  checks.value.push(false)
}
function deleteLine(index) {
  lines.value.splice(index, 1)
  checks.value.splice(index, 1)
}
function handleValueChange(index) {
  if (checks.value[index])
    lines.value = lines.value.map((_, i) => checks.value[i] ? lines.value[index] : lines.value[i])
}
function handleClickSyncAll() {
  checks.value.fill(!allSynced.value)
}
function handleClickRandom() {
  lines.value = lines.value.map((_, index) => {
    if (checks.value[index])
      return Math.ceil(Math.random() * 10)

    return lines.value[index]
  })
}
function handleClickKeepSumRandom() {
  const sum = lines.value.filter((_, index) => checks.value[index]).reduce((a, b) => a + b, 0)
  lines.value = lines.value.map((_, index) => {
    if (checks.value[index])
      return Math.random()

    return lines.value[index]
  })
  const newSum = lines.value.filter((_, index) => checks.value[index]).reduce((a, b) => a + b, 0)
  lines.value = lines.value.map((_, index) => {
    if (checks.value[index])
      return lines.value[index] * sum / newSum

    return lines.value[index]
  })
}

watch(
  () => lines.value,
  newVal => emits('change', newVal.map(d => Number(d))),
  { deep: true },
)

onMounted(() => {
  emits('change', lines.value.map(d => Number(d)))
})
</script>

<template>
  <v-navigation-drawer v-model="drawer" app fixed clipped class="w-400" width="400">
    <v-card class="!flex !flex-col pa-0 fill-height">
      <v-card-title class="mt-5 text-h4">
        Lengths
      </v-card-title>

      <v-card-text class="fill-height overflow-y-scroll">
        <div v-for="(_, index) in lines" :key="index" class="flex flex-row items-center my-6">
          <v-checkbox v-model="checks[index]" class="w-20" density="compact" hide-details />
          <v-btn
            icon flat density="compact"
            @click="() => (lines[index] -= step) && handleValueChange(index)"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-slider
            v-model="lines[index]" class="w-1/1" hide-details="" max="10" :step="step" thumb-label="always"
            @update:model-value="() => handleValueChange(index)"
          />
          <v-btn
            icon flat density="compact"
            @click="() => (lines[index] += step) && handleValueChange(index)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon flat class="ml-3" @click="() => deleteLine(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
        <v-btn flat class="mt-3" block @click="addLine">
          <v-icon>mdi-plus</v-icon>
          Add line
        </v-btn>
      </v-card-text>

      <v-card-text>
        <v-btn block @click="handleClickSyncAll">
          {{ allSynced ? 'Unsync all' : 'Sync all' }}
        </v-btn>
        <v-btn class="mt-3" block @click="handleClickRandom">
          Random
        </v-btn>
        <v-btn class="mt-3" block @click="handleClickKeepSumRandom">
          Keep Sum Random
        </v-btn>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  r: {
    type: Number,
    default: 10,
  },
})

const container = ref(null)
const width = ref(0)
const height = ref(0)

const processedData = computed(() => {
  if (!props.data)
    return []
  const X = props.data.map(d => d.point)
  const max = Math.max(...X)
  const min = Math.min(...X)
  return props.data.map(d => ({
    ...d,
    point: (d.point - min) / (max - min),
  }))
})

function resize() {
  width.value = container.value ? container.value.clientWidth : 0
  height.value = container.value ? container.value.clientHeight : 0
}

onMounted(() => {
  nextTick(() => {
    resize()

    const observer = new ResizeObserver(() => {
      resize()
    })
    observer.observe(container.value)
  })
})
</script>

<template>
  <div class="p-3 h-full">
    <v-card class="w-full h-full">
      <div ref="container" class="w-full h-full">
        <svg
          class="w-full h-full" :viewBox="container ? `${-r} ${-r} ${width + 2 * r} ${height + 2 * r}` : null" @mouseup="handleMouseUp" @mousemove="handleMouseMove"
          @mousedown="handleMouseDown"
        >
          <g v-for="(d, i) in processedData" :key="i">
            <circle style="fill: rgb(var(--v-theme-primary))" :cx="d.point * width" :cy="height - r" :r="r" />
            <rect
              :x="d.point * width - r / 2" style="fill: rgb(var(--v-theme-primary))"
              :y="height - r - d.depth / data.length * height" :width="r" :height="d.depth / data.length * height"
            />
            <text
              :x="d.point * width" :y="height - r - d.depth / data.length * height - 10" style="fill: rgb(var(--v-theme-primary))"
              :text-anchor="d.point < 0.2 ? 'start' : d.point < 0.8 ? 'middle' : 'end'" dominant-baseline="baseline"
            >
              {{ d.depth.toFixed(10) }}
            </text>
            <path
              :d="`M0 ${height - r - d.depth / data.length * height} H ${width}`" stroke="rgb(var(--v-theme-primary))"
              class="stroke-1 stroke-dash-2 opacity-30"
            />
          </g>
        </svg>
      </div>
    </v-card>
  </div>
</template>

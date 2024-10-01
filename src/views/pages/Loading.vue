<script lang="ts" setup>
interface Props {
  isVisible: boolean
}
const props = defineProps<Props>()
</script>

<template>
  <div
    v-if="props.isVisible"
    id="loading-bg"
  >
    <div class="scaling-squares-spinner">
      <div class="square" />
      <div class="square" />
      <div class="square" />
      <div class="square" />
    </div>
  </div>
</template>

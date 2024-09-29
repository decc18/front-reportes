<script lang="ts" setup>
interface Props {
    isVisible: boolean
}
const props = defineProps<Props>()
console.log("isVisible:"+props.isVisible)
</script>
<template>
    <div id="loading-bg" v-if="props.isVisible">
      <div class="scaling-squares-spinner">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
      </div>
    </div>
  </template>
  
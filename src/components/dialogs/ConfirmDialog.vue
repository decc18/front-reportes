<script setup lang="ts">
interface Props {
  confirmationQuestion: string
  isDialogVisible: boolean
  confirmTitle: string
  confirmMsg: string
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const unsubscribed = ref(false)
const cancelled = ref(false)

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
  unsubscribed.value = true
}

const onCancel = () => {
  emit('confirm', false)
  emit('update:isDialogVisible', false)
  cancelled.value = true
}
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="my-4"
          size="x-large"
        >
          <span class="text-4xl">!</span>
        </VBtn>

        <h6 class="text-lg font-weight-medium">
          {{ props.confirmationQuestion }}
        </h6>
      </VCardText>
      <VCardText class="d-flex align-center justify-center gap-4">
        <VBtn
          variant="elevated"
          @click="onConfirmation"
        >
          Confirmar
        </VBtn>

        <VBtn
          color="secondary"
          variant="outlined"
          @click="onCancel"
        >
          Cancelar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

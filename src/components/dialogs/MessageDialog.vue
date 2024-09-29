<script setup lang="ts">
const router = useRouter()
interface Props {
  isDialogMessageVisible: boolean
  msg: string
  isOk: boolean
  cerrarSesion: boolean
}

interface Emit {
  (e: 'update:isDialogMessageVisible', value: boolean): void
}

const updateModelValue = async (val: boolean) => {
  emit('update:isDialogMessageVisible', val)
  //useCookie('accessToken').value = null
  if(props.cerrarSesion){
    useCookie('accessToken').value = null
    await router.push('/login')
  }
}
const props = defineProps<Props>()

const emit = defineEmits<Emit>()


</script>

<template>
    <VDialog
    max-width="500"
    :model-value="props.isDialogMessageVisible"
  >
    <VCard>
      <VCardText class="text-center px-10 py-6">
        <VBtn
          v-if="props.isOk === true"
          icon
          color="success"
          class="my-4"
          size="x-large"
        >
          <span class="text-xl">
            <VIcon icon="ri-check-line" />
          </span>
        </VBtn>
        <VBtn
         v-if="props.isOk === false"
          icon
          
          color="error"
          class="my-4"
          size="x-large"
        >
          <span class="text-2xl font-weight-light">X</span>
        </VBtn>

        <h1  v-if="props.isOk === true && props.cerrarSesion === false" class="text-h4 mb-4">
          Proceso realizado con éxito
        </h1>
        <h1  v-if="props.isOk === false && props.cerrarSesion === false" class="text-h4 mb-4">
          Error al realizar la solicitud
        </h1>
        <h1  v-if="props.isOk === false && props.cerrarSesion === true" class="text-h4 mb-4">
          Sesión Finalizada
        </h1>
        <p>{{ props.msg }}</p>

        <VBtn
         v-if="props.isOk === false"
           color="error"
          
          @click="updateModelValue(false)"
        >
          Aceptar
        </VBtn>
        <VBtn
         v-if="props.isOk === true"
           color="primary"
          @click="updateModelValue(false)"
        >
        Aceptar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

</template>

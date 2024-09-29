<script setup lang="ts">
import type { UsuarioAuth } from '@/types/userAuthType'

definePage({
  meta: {
    layout: 'blank',
  },
})

const errors = ref<Record<string, string | undefined>>({
  usuario: undefined,
  nemonico: undefined,
  password: undefined,
})

const router = useRouter()
const route = useRoute()

const credenciales = ref({
  usuario: 'satcom',
  nemonico: 'ADMIN',
  password: 'satcom',
})

const usuario = route.query.usuario as string
const nemonico = route.query.nemonico as string
const password = route.query.password as string

// Verificamos que los parámetros estén presentes
if (usuario && nemonico && password) {
  // Asignamos los valores a las credenciales
  credenciales.value.usuario = usuario
  credenciales.value.nemonico = nemonico
  credenciales.value.password = password

  const res = await $api('api/Autenticacion/Login', {
    method: 'POST',
    body: {
      usuario: credenciales.value.usuario,
      nemonico: credenciales.value.nemonico,
      password: credenciales.value.password,
    },
    onResponseError({ response }) {
      console.log(response._data.errors)
      errors.value = response._data.errors
    },
  })

  const datosUsuario = computed((): UsuarioAuth => res)

  useCookie<UsuarioAuth>('userData').value = datosUsuario.value
  useCookie('accessToken').value = datosUsuario.value.token

  await nextTick(() => {
    router.replace(route.query.to ? String(route.query.to) : '/')
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-1 pa-sm-7"
      max-width="448"
    >
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

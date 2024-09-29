<script setup lang="ts">
import type { UsuarioAuth } from '@/types/userAuthType';
import { isLoading } from "@/utils/spinner";
import logo from '@images/pages/ADMINLogo1.png';
import { VForm } from 'vuetify/components/VForm';
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
const refVForm = ref<VForm>()

const credenciales = ref({
  usuario: 'satcom',
  nemonico: 'ADMIN',
  password: 'satcom'
})


const login = async () => {
  try {
    const res = await $api('api/Autenticacion/Login', {
      method: 'POST',
      body: {
        usuario: credenciales.value.usuario,
        nemonico: credenciales.value.nemonico,
        password: credenciales.value.password,
      },
      onResponseError({ response }) {
        console.log(response._data.errors);
        errors.value = response._data.errors
      },
      
    })

    const datosUsuario = computed((): UsuarioAuth => res)
    
    useCookie<UsuarioAuth>('userData').value = datosUsuario.value
    useCookie('accessToken').value = datosUsuario.value.token

    // Redirect to `to` query if exist or redirect to index route
    // ❗ nextTick is required to wait for DOM updates and later redirect
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
    
  }
  catch (err) {
    console.error(err)
    isLoading.value = false;
  }
}


const onSubmit = () => {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        login()
    })
}

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-1 pa-sm-7"
      max-width="448"
    >
      <VCardItem class="justify-center pb-1">
        <img
                :src="logo"
                  class="my-6 w-100"
                
              >
      </VCardItem>

      <VCardText>
        <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="credenciales.usuario" 
                autofocus
                label="Usuario"
                placeholder=""
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="credenciales.nemonico" 
                label="Nemónico"
                type="text"
                placeholder="johndoe@email.com"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="credenciales.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :rules="[requiredValidator]"
              />
              <VBtn
              class="my-6"
                block
                type="submit"
              >
                Ingresar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
   
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

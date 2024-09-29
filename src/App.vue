<script setup lang="ts">
import { useTheme } from 'vuetify'
import { cerrarSesion, isMessageDialogVisible, isOk, message } from '@/utils/message'
import { isLoading } from '@/utils/spinner'
import Loading from '@/views/pages/Loading.vue'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { hexToRgb } from '@layouts/utils'
import { initConfigStore, useConfigStore } from '@core/stores/config'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />
      <Loading :is-visible="isLoading" />
      <MessageDialog
        v-model:isDialogMessageVisible="isMessageDialogVisible"
        :msg="message"
        :is-ok="isOk"
        :cerrar-sesion="cerrarSesion"
      />
    </VApp>
  </VLocaleProvider>
</template>

<!-- eslint-disable indent -->
<script setup lang="ts">
import { onUnmounted } from 'vue'
import messageHelper from '@/utils/messageHelper'
import { isLoading } from '@/utils/spinner'
import type { typeContacto } from '@/types/emisorTypes'
import type { typAccion, typHisotrial } from '@/types/reporteType'

type estadosReporte = 'Generado' | 'Incompleto' | 'Error' | 'Procesando' | null

const searchQuery = ref('')
const selectedStatus = ref<estadosReporte>(null)
const selectedRows = ref<string[]>([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const isDialogVisible = ref(false)
const isSnackbarVisible = ref(false)
const mensajeSnackbar = ref('')
const isDialogHisVisible = ref(false)
const idHistorialEliminar = ref(0)
const idHistorialDetalle = ref(0)

const isDialogContactosVisible = ref(false)

const contactosTableHeaders = [
  { title: 'Email', key: 'correoElectronico' },
]

const datosContacto = ref<typeContacto[]>([])
const selectedItems = ref<typeContacto[]>([])
const timelineItems = ref<typAccion[]>([])
const progress = ref(0)

progress.value = 0

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// 👉 headers
const headers = [
  { title: 'Id', key: 'idHistorial' },
  { title: 'Nombre reporte', key: 'nombre' },
  { title: 'Codigo negocio', key: 'codigo' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

isLoading.value = true

// 👉 obtener historial de reportes
const { data: datosReporte, execute: fetchReportes, error } = await useApi<any>(createUrl('api/Reporte/ConsultarReportesGenerados', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}),
)

if (error.value != null)
  messageHelper.throwError(error.value)

isLoading.value = false

const reportes = computed((): typHisotrial[] => datosReporte.value.datos)
const totalregistros = computed(() => datosReporte.value.totalRegistros)

const mostrarPopupContactos = async (id: number) => {
  idHistorialDetalle.value = id
  selectedItems.value = ([])

  const datosCorreo = await $api(`api/Emisor/ObtenerContactosEmisor?idHistorial=${idHistorialDetalle.value}`, { method: 'GET' })
  const contactosTemp = computed((): typeContacto[] => datosCorreo)

  datosContacto.value = contactosTemp.value
  isDialogContactosVisible.value = true
}

// Variable para almacenar el nuevo email
const newEmail = ref('')

// Función para agregar un nuevo email a la lista
const addEmail = () => {
  if (newEmail.value.trim() !== '') {
    datosContacto.value.push({ correoElectronico: newEmail.value, idContacto: -1 })
    newEmail.value = '' // Limpiar el campo de entrada después de agregar
  }
}

const closeDialog = async () => {
  isDialogContactosVisible.value = false

  const lista = selectedItems.value.map(item => item).join('; ')

  await $api(`api/Reporte/EnviarCorreoAdjunto?idHistorial=${idHistorialDetalle.value}&lista=${lista}`, { method: 'POST' })
  messageHelper.mensaje('Reporte notificado con éxito')
}

const mostrarPopupHistorial = async (id: number) => {
  const datos = await $api(`api/Reporte/ConsultarAccionesReporte?idHistorial=${id}`, { method: 'GET' })
  const datosHis = computed((): typAccion[] => datos)

  timelineItems.value = datosHis.value
  idHistorialDetalle.value = id
  isDialogHisVisible.value = true
}

const mostrarPopupEliminar = async (id: number) => {
  idHistorialEliminar.value = id
  isDialogVisible.value = true
}

const computedMoreList = computed(() => {
  return (paramId: number) => ([
    {
      title: 'Ver Detalles',
      value: 'detalles',
      onClick: () => mostrarPopupHistorial(paramId),
      prependIcon: 'ri-eye-line',
    },
    {
      title: 'Programar',
      value: 'programar',
      prependIcon: 'ri-24-hours-fill',
      to: { name: 'apps-reportes-programar-reporte', params: { id: paramId } },
    },
    {
      title: 'Eliminar',
      value: 'eliminar',
      onClick: () => mostrarPopupEliminar(paramId),
      prependIcon: 'ri-delete-bin-7-line',
    },
  ])
})

const eliminarReporte = async (confirmed: boolean) => {
  isDialogVisible.value = false
  if (confirmed) {
    try {
      await $api(`api/Reporte/EliminarReporte?idHistorial=${idHistorialEliminar.value}`, { method: 'DELETE' })
      fetchReportes()
      messageHelper.mensaje('Reporte eliminado con éxito')
    }
    catch (errorE) {
      messageHelper.throwError(errorE)
    }
  }
}

const descargarReporte = async (id: number, filePath: string) => {
  const blob = await $api(`api/Reporte/DescargarReporte?idHistorial=${id}`, {
    method: 'POST',
    responseType: 'blob', // Indicamos que esperamos un archivo
  })

  const fileName = filePath.split('/').pop() || 'archivo_descargado'

  // Crear un enlace para descargar el archivo
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.setAttribute('download', fileName) // Nombre del archivo a descargar
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const getChipColor = (estado: string) => {
  switch (estado) {
    case 'Generado':
      return 'success'
    case 'Procesando':
      return 'success'
    case 'Incompleto':
      return 'warning'
    case 'Error':
      return 'error'
    default:
      return 'info'
  }
}

const timerId = setInterval(async () => {
  try {
    const datosReporteHis = await $apiBackGound('api/Reporte/ConsultarEstadoReporte', { method: 'GET' })
    if (datosReporteHis === true) {
      isSnackbarVisible.value = true
      mensajeSnackbar.value = '¡Reporte actualizado!'
      fetchReportes()
    }
  }
  catch (errorInt) {
    console.error('Error en la consulta del estado del reporte:', errorInt)
  }
}, 10000)

onUnmounted(() => {
  clearInterval(timerId)
})
</script>

<template>
  <section v-if="reportes">
    <VCard id="invoice-list">
      <VCardItem title="Reportes Generados">
        <!--
          <template #append>
          <IconBtn
          class="me-1"
          @click="fetchReportes"
          >
          <VTooltip
          activator="parent"
          location="top"
          >
          Actualizar Estado
          </VTooltip>
          <VIcon icon="ri-refresh-line" />
          </IconBtn>
          </template>
        -->
      </VCardItem>
      <VDivider />
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <VBtn
          prepend-icon="ri-add-line"
          :to="{ name: 'apps-reportes-generar-reporte' }"
        >
          Nuevo Reporte
        </VBtn>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 300px;">
            <VTextField
              v-model="searchQuery"
              placeholder="Buscar reporte"
            />
          </div>

          <div style="inline-size: 200px;">
            <VSelect
              v-model="selectedStatus"
              placeholder="Estado"
              clearable
              clear-icon="ri-close-line"
              :items="['Generado', 'Procesando', 'Incompleto', 'Error']"
            />
          </div>
        </div>
      </VCardText>

      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items-length="totalregistros"
        :headers="headers"
        :items="reportes"
        hover
        item-value="idHistorial"
        class="text-no-wrap rounded-0"
        @update:options="updateOptions"
      >
        <!-- idHistorial -->

        <template #item.idHistorial="{ item }">
          <!--
            <RouterLink :to="{ name: 'apps-reportes-generar-reporte', params: { id: item.idHistorial } }">
            {{ item.idHistorial }}
            </RouterLink>
          -->
          {{ item.idHistorial }}
        </template>

        <template #item.codigo="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6">
              {{ item.codigoNegocio }}
            </h6>
            <span class="text-body-2">Tipo: {{ item.tipo }} - Proceso: {{ item.tipoProceso }} </span>
          </div>
        </template>

        <template #item.nombre="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6">
              {{ item.nombreReporte }}
            </h6>
            <span class="text-body-2">Fecha: {{ formatoFechaHora(item.fechaCreacion) }} - Duración: {{ convertToSeconds(item.tiempoGeneracion) }}</span>
          </div>
        </template>
        <template #item.estado="{ item }">
          <VProgressCircular
            v-if="item.getEstadoGeneracion === 'Procesando'"
            :rotate="360"
            :size="30"
            :width="3"
            indeterminate
            :color="getChipColor(item.getEstadoGeneracion)"
          >
            <VTooltip
              activator="parent"
              location="top"
            >
              Procesando
            </VTooltip>
          </VProgressCircular>
          <VChip
            v-if="item.getEstadoGeneracion !== 'Procesando'"
            variant="outlined"
            label
            size="small"
            :color="getChipColor(item.getEstadoGeneracion)"
            rounded="sm"
          >
            {{ item.getEstadoGeneracion }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.acciones="{ item }">
          <div class="text-no-wrap">
            <IconBtn
              :disabled="item.estadoGeneracion !== 2"
              size="small"
              @click="descargarReporte(item.idHistorial, item.pathArchivo)"
            >
              <VTooltip
                activator="parent"
                location="top"
              >
                Descargar
              </VTooltip>
              <VIcon icon="ri-download-line" />
            </IconBtn>
            <IconBtn
              :disabled="item.estadoGeneracion !== 2"
              size="small"
              @click="mostrarPopupContactos(item.idHistorial)"
            >
              <VTooltip
                activator="parent"
                location="top"
              >
                Enviar por correo
              </VTooltip>
              <VIcon icon="ri-mail-send-line" />
            </IconBtn>
            <IconBtn size="small">
              <VTooltip
                activator="parent"
                location="top"
              >
                Otras Opciones
              </VTooltip>
              <VIcon icon="ri-more-2-line" />
              <VMenu activator="parent">
                <VList
                  :items="computedMoreList(item.idHistorial)"
                  item-props
                />
              </VMenu>
            </IconBtn>
          </div>
        </template>

        <!-- Pagination -->
        <template #bottom>
          <VDivider />

          <div class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1">
            <div class="d-flex align-center gap-x-2 text-medium-emphasis text-base">
              Filas por página:
              <VSelect
                v-model="itemsPerPage"
                class="per-page-select"
                variant="plain"
                :items="[10, 20, 25, 50, 100]"
              />
            </div>

            <p class="d-flex align-center text-base text-high-emphasis me-2 mb-0">
              {{ paginationMeta({ page, itemsPerPage }, totalregistros) }}
            </p>

            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn
                class="flip-in-rtl"
                icon="ri-arrow-left-s-line"
                variant="text"
                density="comfortable"
                color="high-emphasis"
                :disabled="page <= 1"
                @click="page <= 1 ? page = 1 : page--"
              />

              <VBtn
                class="flip-in-rtl"
                icon="ri-arrow-right-s-line"
                density="comfortable"
                variant="text"
                color="high-emphasis"
                :disabled="page >= Math.ceil(totalregistros / itemsPerPage)"
                @click="page >= Math.ceil(totalregistros / itemsPerPage) ? page = Math.ceil(totalregistros / itemsPerPage) : page++ "
              />
            </div>
          </div>
        </template>
      </VDataTableServer>
      <!-- !SECTION -->
    </VCard>
  </section>
  <section v-else>
    <VCard id="invoice-list">
      <VCardItem title="Reportes Generados" />
      <VDivider />
    </VCard>
    <VCard>
      <VCardTitle>No existe información</VCardTitle>
    </VCard>
  </section>
  <ConfirmDialog
    v-model:isDialogVisible="isDialogVisible"
    confirmation-question="¿Estás segura de eliminar el reporte?"
    confirm-title="!Eliminado!"
    confirm-msg="El reporte fue eliminado con éxito."
    @confirm="eliminarReporte"
  />
  <VDialog
    v-model="isDialogContactosVisible"
    width="500"
  >
    <!-- Dialog Content -->
    <VCard title="Enviar Correo">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="isDialogContactosVisible = false"
      />
      <VCardText>
        <VRow class="mb-4">
          <VCol cols="8">
            <VTextField
              v-model="newEmail"
              class="me-8"
              :rules="[emailValidator]"
              label="Agregar Email"
              placeholder="prueba@gmail.com"
            />
          </VCol>
          <VCol cols="4">
            <VBtn
              class="me-4"
              type="submit"
              @click="addEmail"
            >
              Agregar
            </VBtn>
          </VCol>
        </VRow>
        <VDivider />
        <!-- Tabla de contactos -->
        <VDataTable
          v-model="selectedItems"
          :headers="contactosTableHeaders"
          :items="datosContacto"
          show-select
          item-value="correoElectronico"
          hover
        >
          <template #bottom />
        </VDataTable>
        <VForm @submit.prevent="() => {}" />
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="isDialogContactosVisible = false"
        >
          Cerrar
        </VBtn>
        <VBtn
          :disabled="selectedItems.length === 0"
          @click="closeDialog"
        >
          Aceptar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog
    v-model="isDialogHisVisible"
    width="500"
  >
    <!-- Dialog Content -->
    <VCard title="Historial Reporte">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="isDialogHisVisible = false"
      />
      <VCardText>
        <VTimeline
          side="end"
          align="start"
          line-inset="9"
          truncate-line="start"
          density="compact"
        >
          <VTimelineItem
            v-for="(item) in timelineItems"
            :key="item.idAccion"
            size="x-small"
            dot-color="primary"
          >
            <div class="d-flex justify-space-between align-center flex-wrap mb-2">
              <span class="app-timeline-title">{{ item.getTipoAccion }}</span>
              <span class="app-timeline-meta">{{ formatoFechaHora(item.fechaCreacion.toString()) }}</span>
            </div>
            <div class="app-timeline-text mt-1">
              {{ item.accionDetalle }}
            </div>
          </VTimelineItem>
        </VTimeline>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn @click="isDialogHisVisible = false">
          Aceptar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <VSnackbar
    v-model="isSnackbarVisible"
    location="top end"
    :timeout="4000"
  >
    {{ mensajeSnackbar }}
  </VSnackbar>
</template>

  <style lang="scss">
  #invoice-list {
    .invoice-list-actions {
      inline-size: 16rem;
    }
  }
  </style>

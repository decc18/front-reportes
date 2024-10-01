<!-- eslint-disable indent -->
<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import type { typCampo, typHisotrial, typRespReporte, typSelect } from '@/types/reporteType'
import { isLoading } from '@/utils/spinner'

type tipoReporte = 'Emision' | 'Recepcion' | 'Administrador' | 'Soporte' | null

const router = useRouter()
const searchQuery = ref('')
const selectedStatus = ref<tipoReporte>(null)
const campos = ref<typCampo[]>([])
const refForm = ref<VForm>()
const selectedRows = ref<string[]>([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const isDialogVisible = ref(false)
const nombreReporte = ref('')
const idReporteSeleccionado = ref(0)

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// 👉 headers
const headers = [
  { title: 'Nombre reporte', key: 'nombre' },
  { title: 'Codigo negocio', key: 'codigo' },
  { title: 'Procesamiento', key: 'procesamiento', sortable: false },
  { title: 'Estado', key: 'estado', sortable: false },
  { title: 'Acciones', key: 'menuacciones', sortable: false },
]

isLoading.value = true

// 👉 obtener historial de reportes
const { data: datosReporte, error } = await useApi<any>(createUrl('api/Reporte/ConsultarDatosReportes', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

if (error.value != null)
  messageHelper.throwError(error.value)

isLoading.value = false

const reportes = computed((): typHisotrial[] => datosReporte.value.datos)
const totalregistros = computed(() => datosReporte.value.totalRegistros)

const getDescripcionEstado = (estado: number) => {
  switch (estado) {
    case 0:
      return 'Activo'
    case 1:
      return 'Inactivo'
    case 2:
      return 'Bloqueado'
    case 3:
      return 'Eliminado'
    default:
      return 'No definido'
  }
}

const getTipoProcesamiento = (tipo: boolean) => {
  switch (tipo) {
    case true:
      return 'Online'
    case false:
      return 'Offline'
  }
}

const getColorTipoProcesamiento = (tipo: boolean) => {
  switch (tipo) {
    case true:
      return 'info'
    case false:
      return 'secondary'
  }
}

const getChipColor = (estado: number) => {
  switch (estado) {
    case 0:
      return 'success'
    case 1:
      return 'warning'
    case 2:
      return 'secondary'
    default:
      return 'info'
  }
}

// Valores para los campos que se llenarán dinámicamente
const formValues = ref<{ [key: string]: any }>({})

const mostrarPopUpCrearReporte = async (id: number, descrip: string) => {
  nombreReporte.value = descrip
  idReporteSeleccionado.value = id
  formValues.value = ({})

  const datosConsultaReporte = await $api(`api/Reporte/ConsultarCamposReporte?idReporte=${id}`, { method: 'GET' })
  const camposReporte = computed((): typCampo[] => datosConsultaReporte)

  camposReporte.value.forEach(campo => {
    if (campo.tipoComponente === 'Date' && !formValues.value[campo.parametroSp]) {
      // Asignar la fecha actual en formato YYYY-MM-DD
      formValues.value[campo.parametroSp] = new Date().toISOString().slice(0, 10)
    }
    if (campo.tipoComponente === 'Select') {
      // Asignar la fecha actual en formato YYYY-MM-DD
      console.log(campo.itemsLista)
    }
  })
  console.log(camposReporte.value)
  campos.value = camposReporte.value
  isDialogVisible.value = true
}

const handleSubmit = async () => {
  // Esperamos que la promesa se resuelva
  const validationResult = await refForm.value?.validate()

  // Verificamos el valor del resultado después de que se haya resuelto
  if (validationResult?.valid) {
    isDialogVisible.value = false

    const formValuesString = JSON.stringify(formValues.value)

    const datosReporteGen = await $api(`api/Reporte/GenerarNuevoReporte?idReporte=${idReporteSeleccionado.value}&valores=${formValuesString}`, { method: 'POST' })
    const respReporte = computed((): typRespReporte => datosReporteGen)

    if (respReporte.value.estado === true)
      messageHelper.mensaje(respReporte.value.mensaje)
    else
      messageHelper.throwCodeError(500, respReporte.value.mensaje)

    await router.push('/apps/reportes')
  }
}

const changeValueItem = async (id: string, catalogo: string) => {
  console.log(catalogo)

  campos.value.forEach(async campoLista => {
    if (catalogo === 'Emisores' && campoLista.tipoComponente === 'Select' && campoLista.catalogo !== '' && campoLista.catalogo !== 'Emisores') {
      campoLista.itemsLista = ([])
      formValues.value[campoLista.parametroSp] = null
    }

    if (campoLista.catalogoPadre === catalogo) {
      const datoscatalogo = await $api(`api/Reporte/ConsultarCatalogo?catalogo=${campoLista.catalogo}&idcatalogoPadre=${id}&catalogoPadre=${catalogo}`, { method: 'GET' })

      datoscatalogo.forEach(async (estable: typSelect) => {
        campoLista.itemsLista.push({ id: estable.id, valor: estable.valor })
      })
    }
  })
}
</script>

<template>
  <section v-if="reportes">
    <VCard id="invoice-list">
      <VCardItem title="Nuevo Reporte" />
      <VDivider />
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <VBtn
          prepend-icon="ri-24-hours-fill"
          :to="{ name: 'apps-reportes-programar-reporte' }"
        >
          Programar Reporte
        </VBtn>

        <VSpacer />
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
              placeholder="Tipo Reporte"
              clearable
              clear-icon="ri-close-line"
              :items="['Emision', 'Recepcion', 'Administrador', 'Soporte']"
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
        <template #item.estado="{ item }">
          <VChip
            variant="outlined"
            label
            size="small"
            :color="getChipColor(item.estado)"
            rounded="sm"
          >
            {{ getDescripcionEstado(item.estado) }}
          </VChip>
        </template>
        <template #item.nombre="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6">
              {{ item.nombre }}
            </h6>
            <span class="text-body-2">{{ item.descripcion }}</span>
          </div>
        </template>
        <template #item.codigo="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6">
              {{ item.codigoNegocio }}
            </h6>
            <span class="text-body-2">Tipo: {{ item.getTipo }} </span>
          </div>
        </template>
        <template #item.procesamiento="{ item }">
          <VChip
            variant="outlined"
            label
            size="small"
            :color="getColorTipoProcesamiento(item.esOnline)"
            rounded="sm"
          >
            {{ getTipoProcesamiento(item.esOnline) }}
          </VChip>
        </template>
        <!-- Actions -->
        <template #item.menuacciones="{ item }">
          <div class="text-no-wrap">
            <IconBtn
              :disabled="item.estado === 2"
              size="small"
              @click="mostrarPopUpCrearReporte(item.idReporte, item.descripcion)"
            >
              <VTooltip
                activator="parent"
                location="top"
              >
                Generar Reporte
              </VTooltip>
              <VIcon icon="ri-sticky-note-add-line" />
            </IconBtn>
            <IconBtn
              :disabled="item.estado === 2"
              size="small"
            >
              <VTooltip
                activator="parent"
                location="top"
              >
                Programar Reporte
              </VTooltip>
              <VIcon icon="ri-24-hours-fill" />
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
    <VCard>
      <VCardTitle>No Invoice Found</VCardTitle>
    </VCard>
  </section>
  <VDialog
    v-model="isDialogVisible"
    width="700"
  >
    <!-- Dialog Content -->
    <VCard :title="nombreReporte">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="isDialogVisible = false"
      />
      <VCardText class="mt-4">
        <VForm
          ref="refForm"
          @submit.prevent="handleSubmit"
        >
          <VRow>
            <!-- Iteramos sobre el array de campos -->
            <VCol
              v-for="campo in campos"
              :key="campo.idCampo"
              cols="12"
              md="6"
            >
              <template v-if="campo.tipoComponente === 'Date' && campo.visible === true">
                <AppDateTimePicker
                  v-model="formValues[campo.parametroSp]"
                  prepend-inner-icon="ri-calendar-line"
                  :label="campo.nombreCampo"
                  :placeholder="campo.placeholder"
                  :required="campo.requerido"
                  :rules="[
                    campo.requerido ? (v: string) => !!v || campo.mensajeError : 'Campo requerido',
                  ]"
                  :config="{ position: 'auto right' }"
                />
              </template>

              <template v-else-if="['int', 'decimal', 'text'].includes(campo.tipoComponente) && campo.visible === true">
                <VTextField
                  v-model="formValues[campo.parametroSp]"
                  density="compact"
                  class="refer-link-input"
                  :label="campo.nombreCampo"
                  :placeholder="campo.placeholder || ''"
                  :required="campo.requerido"
                  :type="campo.tipoComponente === 'text' ? 'text' : 'number'"
                  :step="campo.tipoComponente === 'decimal' ? '0.01' : '1'"
                  :rules="[
                    campo.requerido ? (v: string | number) => !!v || campo.mensajeError : null,
                    campo.tipoComponente === 'int'
                      ? (v: string | number) => Number.isInteger(Number(v)) || 'Debe ser un número entero'
                      : null,
                    campo.tipoComponente === 'decimal'
                      ? (v: string | number) => !isNaN(parseFloat(String(v))) || 'Debe ser un número decimal válido'
                      : null,
                    campo.tipoComponente === 'text'
                      ? (v: string | number) => /^[a-zA-Z0-9]*$/.test(String(v)) || 'Solo se permiten caracteres alfanuméricos'
                      : null,
                  ]"
                >
                  <template #prepend-inner>
                    <VIcon
                      :icon="campo.tipoComponente === 'int' ? 'ri-sort-number-desc' : campo.tipoComponente === 'decimal' ? 'ri-money-dollar-box-line' : campo.tipoComponente === 'text' ? 'ri-sort-alphabet-desc' : 'icon-default'"
                      size="18"
                    />
                  </template>
                </VTextField>
              </template>
              <template v-else-if="campo.tipoComponente === 'Select' && campo.visible === true">
                <VSelect
                  v-if="campo.tipoComponente === 'Select'"
                  v-model="formValues[campo.parametroSp]"
                  :disabled="!campo.itemsLista?.length"
                  :label="campo.nombreCampo"
                  :placeholder="campo.placeholder || ''"
                  :items="campo.itemsLista"
                  item-title="valor"
                  item-value="id"
                  :required="campo.requerido"
                  :rules="[campo.requerido ? (v: string | number) => !!v || campo.mensajeError : null]"
                  filterable
                  @update:model-value="changeValueItem($event, campo.catalogo)"
                />
              </template>

              <!-- Agrega más tipos de componentes según sea necesario -->
            </VCol>

            <!-- Botones para submit y reset -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-end gap-4"
            >
              <VBtn
                color="secondary"
                variant="tonal"
                @click="isDialogVisible = false"
              >
                Cancelar
              </VBtn>
              <VBtn type="submit">
                Generar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
  #invoice-list {
    .invoice-list-actions {
      inline-size: 8rem;
    }
  }
</style>

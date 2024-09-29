import { cerrarSesion, isMessageDialogVisible, isOk, message } from '@/utils/message'

export default {
  async mensaje(msg: string) {
    isMessageDialogVisible.value = true
    isOk.value = true
    message.value = msg
  },
  async throwErrorGeneric(error: Error) {
    isMessageDialogVisible.value = true
    isOk.value = false
    message.value = error.message
  },
  async throwCodeError(codigo: any, mensaje: string) {
    if (codigo === 401) {
      isMessageDialogVisible.value = true
      isOk.value = false
      cerrarSesion.value = true
      message.value = mensaje
    }
    else {
      console.log(message.value)
      isMessageDialogVisible.value = true
      isOk.value = false
      cerrarSesion.value = false
      message.value = mensaje
    }
  },
  async throwError(error: any) {
    console.log(error.value)
    if (error.value === 'Unauthorized') {
      isMessageDialogVisible.value = true
      isOk.value = false
      cerrarSesion.value = true
      message.value = 'Sesion caducada, por favor ingresar nuevamente con sus credenciales'
    }
    else if (error.value === 'Failed to fetch') {
      isMessageDialogVisible.value = true
      isOk.value = false
      cerrarSesion.value = false
      message.value = 'Existe un error con la comunicación con el servicio'
    }
    else {
      isMessageDialogVisible.value = true
      isOk.value = false
      cerrarSesion.value = false
      message.value = error.message
    }
  },
}

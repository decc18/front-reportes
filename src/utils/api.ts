import { ofetch } from 'ofetch'
import messageHelper from '@/utils/messageHelper'
import { isLoading } from '@/utils/spinner'

export const $api = ofetch.create({
  timeout: 1000 * 60,
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value

    isLoading.value = true
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
  async onResponse({ response }) {
    isLoading.value = false
    if (response.ok === false)
      messageHelper.throwCodeError(response.status, response._data ?? response.statusText)
  },
  async onRequestError() {
    messageHelper.throwCodeError(500, 'Error al realizar la invocación al servicio API')
    isLoading.value = false
  },
})

export const $apiBackGound = ofetch.create({
  timeout: 1000 * 60,
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
})

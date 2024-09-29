import messageHelper from "@/utils/messageHelper";
import { isLoading } from "@/utils/spinner";
import { ofetch } from 'ofetch';

export const $api = ofetch.create({
  timeout: 1000*60,
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options,  }) {
    const accessToken = useCookie('accessToken').value
    isLoading.value = true;
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
  async onResponse({ request, response, options  }) {
    isLoading.value = false;
    if (!response.ok) {
      messageHelper.throwCodeError(response.status, response.statusText);
    } 
  },
  async onRequestError({ request, options, error }) {
    // Log error
    console.log("[fetch request error]", request, error);
    messageHelper.throwCodeError(500, "Error al realizar la invocación al Api");
    isLoading.value = false;
  }
})

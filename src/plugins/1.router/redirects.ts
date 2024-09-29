import type { RouteRecordRaw } from 'vue-router/auto'
import type { UsuarioAuth } from '@/types/userAuthType'

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie<UsuarioAuth>('userData')
      if (userData.value === null)
        return { name: 'login' }

      const userRole = userData?.value?.tipoUsuario
      if (userRole === 'Root')
        return { name: 'apps-reportes' }

      return { name: 'login', query: to.query }
    },
  },
  {
    path: '/apps/',
    name: 'reportes',
    redirect: () => ({ name: 'apps-reportes' }),
  },
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/app/index.vue',
    name: 'apps-reportes',
    component: () => import('@/pages/apps/reportes/index.vue'),
  },
]

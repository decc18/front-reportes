<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'

const router = useRouter()
const userData = useCookie<any>('userData')

const logout = async () => {
  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null

  // Remove "userData" from cookie
  userData.value = null

  // Redirect to login page
  await router.push('/login')
  
}

</script>

<template>
  <VBadge
    dot
    bordered
    location="bottom right"
    offset-x="2"
    offset-y="2"
    color="success"
    class="user-profile-badge"
  >
    <VAvatar
      class="cursor-pointer"
      size="38"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="15px"
      >
        <VList>
          <VListItem class="px-4">
            <div class="d-flex gap-x-2 align-center">
              <VAvatar>
                <VImg :src="avatar1" />
              </VAvatar>

              <div>
                <div class="text-body-2 font-weight-medium text-high-emphasis">
                  Satcom
                </div>
                <div class="text-capitalize text-caption text-disabled">
                  Root
                </div>
              </div>
            </div>
          </VListItem>
          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VListItem class="px-4">
              <VBtn
                block
                color="primary"
                size="small"
                append-icon="ri-logout-box-r-line"
                @click="logout"
              >
                Salir
              </VBtn>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style lang="scss">
.user-profile-badge {
  &.v-badge--bordered.v-badge--dot .v-badge__badge::after {
    color: rgb(var(--v-theme-background));
  }
}
</style>

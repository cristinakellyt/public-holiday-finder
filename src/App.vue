<template>
  <TheHeader />
  <div class="main-content">
    <RouterView />
  </div>
  <BaseToast />
</template>

<script setup lang="ts">
//Vue
import { onMounted } from 'vue'
//Components
import TheHeader from '@/components/layout/TheHeader.vue'
import BaseToast from '@/components/BasicComponents/BaseToast.vue'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
//Utils
import { devLog } from '@/utils/logger'

const publicHolidaysStore = usePublicHolidaysStore()
const lastCountrySearchedStore = useLastCountrySearchedStore()

onMounted(async () => {
  try {
    // Fetch available countries
    await publicHolidaysStore.getAvailableCountries()
    // Load stored states from Local Storage and preload them in the state management
    lastCountrySearchedStore.loadLastCountrySearched()
  } catch (error) {
    devLog('Error at start-up: ', error)
  }
})
</script>

<style lang="scss">
.main-content {
  margin-top: $header-height;
}
</style>

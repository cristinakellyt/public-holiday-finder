<template>
  <main>
    <BaseWidth v-if="availableCountries.length > 0">
      <SearchCountry />
      <TableHolidaysWorldwide />
    </BaseWidth>
  </main>
</template>

<script setup lang="ts">
//Vue
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
//Components
import SearchCountry from '@/components/SearchCountry.vue'
import TableHolidaysWorldwide from '@/components/TableHolidaysWorldwide.vue'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'

const publicHolidaysStore = usePublicHolidaysStore()
const { availableCountries } = storeToRefs(publicHolidaysStore)

onMounted(async () => {
  try {
    await publicHolidaysStore.fetchAvailableCountries()
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped lang="scss"></style>

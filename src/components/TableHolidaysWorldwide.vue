<template>
  <div class="table-holidays-worldwide">
    <BaseTable v-if="tableData.length > 0" :options="tableOptions" :table-data="tableData">
      <template #title>
        <h2>Public Holidays Worldwide</h2>
      </template>
      <template #date="{ rowData }">
        {{ dateFormatter(rowData.date) }}
      </template>
      <template #name="{ rowData }">
        <div class="centralized-container" @click="goToURL(rowData.wikipediaLink)">
          <span class="name" :class="{ link: rowData.wikipediaLink }">{{ rowData.name }}</span>
          <img
            v-if="rowData.wikipediaLink"
            :src="icRedirectLink"
            alt="redirect-link"
            class="redirect-link"
          />
        </div>
      </template>
      <template #country="{ rowData }">
        <div class="centralized-container">
          <img v-if="rowData.flagUrl" :src="rowData.flagUrl" alt="country-flag" />
          <span>{{ rowData.countryName }}</span>
        </div>
      </template>
    </BaseTable>
    <BasePagination
      v-if="tableData.length > pageSize"
      :page-size="pageSize"
      :total-items="tableData.length"
      :current-page="currentPage"
      @updateCurrentPage="updatePage"
    />
  </div>
</template>

<script setup lang="ts">
//Vue
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Utils
import dateFormatter from '@/utils/dateFormatter'
import goToURL from '@/utils/goToURL'
//Icons
import icRedirectLink from '@/assets/icons/ic_redirect_link.svg'

const publicHolidaysStore = usePublicHolidaysStore()

const tableOptions = {
  headings: {
    date: 'Date',
    name: 'Name',
    country: 'Country',
  },
}

const { publicHolidaysWorldwide } = storeToRefs(publicHolidaysStore)
const currentPage = ref(1)
const pageSize = ref(5)
const tableData = ref(publicHolidaysWorldwide.value)

//Fetch public holidays worldwide and fill data with flags and country name to display in table
onMounted(async () => {
  try {
    await publicHolidaysStore.fetchPublicHolidaysWorldwide()
    getPaginatedData()
  } catch (error) {
    console.error(error)
  }
})

function updatePage(page: number) {
  currentPage.value = page
  getPaginatedData()
}

function getPaginatedData() {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  tableData.value = publicHolidaysWorldwide.value.slice(startIndex, endIndex)
}
</script>

<style scoped lang="scss">
.table-holidays-worldwide {
  width: 100%;
}

.name {
  .link {
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: $color-primary;
    }
  }
}

.centralized-container {
  @include flex-gap(row, pxToRem(10), center, flex-start);
  width: max-content;
}

.redirect-link {
  width: pxToRem(16);
  height: pxToRem(16);
  cursor: pointer;
}
</style>

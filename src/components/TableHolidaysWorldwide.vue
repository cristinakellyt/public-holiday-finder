<template>
  <div class="table-holidays-worldwide" v-if="tableData !== null">
    <BaseTable :options="tableOptions" :table-data="tablePaginatedData">
      <!-- Title -->
      <template #title>
        <h2 class="title">Public Holidays Worldwide</h2>
      </template>
      <!-- Date -->
      <template #date="{ rowData }">
        {{ dateFormatter(rowData.date) }}
      </template>
      <!-- Holiday Name -->
      <template #name="{ rowData }">
        <div role="link">
          <!-- If wikipedia link is not empty, we can click on the name and it will redirect to the wikipedia page -->
          <a
            v-if="rowData.wikipediaLink"
            class="name"
            :class="{ link: rowData.wikipediaLink }"
            :href="rowData.wikipediaLink"
            target="_blank"
            >{{ rowData.name }}

            <img
              v-if="rowData.wikipediaLink"
              :src="icRedirectLink"
              alt="redirect-link"
              class="redirect-icon"
            />
          </a>
          <span v-else class="name">{{ rowData.name }}</span>
        </div>
      </template>
      <!-- Country -->
      <template #country="{ rowData }">
        <div class="centralized-container">
          <img v-if="rowData.flagUrl" :src="rowData.flagUrl" alt="country-flag" />
          <span>{{ rowData.countryName }}</span>
        </div>
      </template>
    </BaseTable>
    <!-- Pagination -->
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
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Utils
import dateFormatter from '@/utils/dateFormatter'
//Icons
import icRedirectLink from '@/assets/icons/ic_redirect_link.svg'
//Types
import type { PublicHoliday } from '@/types/publicHolidays'

const publicHolidaysStore = usePublicHolidaysStore()

const tableOptions = {
  headings: {
    date: 'Date',
    name: 'Name',
    country: 'Country',
  },
}

const tableData = ref<PublicHoliday[] | null>(null)
const tablePaginatedData = ref<PublicHoliday[]>([])
const currentPage = ref(1)
const pageSize = ref(5)

//Fetch public holidays worldwide and fill data with flags and country name to display in table
onMounted(async () => {
  tableData.value = await publicHolidaysStore.getPublicHolidaysWorldwide()
  getPaginatedData()
})

const updatePage = (page: number) => {
  currentPage.value = page
  getPaginatedData()
}

const getPaginatedData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  tablePaginatedData.value = tableData.value?.slice(startIndex, endIndex) ?? []
}
</script>

<style scoped lang="scss">
.table-holidays-worldwide {
  width: 100%;

  .title {
    font-weight: 500;
  }
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
  @include flex-direction-align-justify(row, pxToRem(10), center, flex-start);

  span {
    text-align: center;
  }
}

.redirect-icon {
  width: pxToRem(14);
  height: pxToRem(14);
  cursor: pointer;
  margin-left: pxToRem(5);
  margin-bottom: pxToRem(2);
}

@include media-query($mobile-large) {
  .centralized-container {
    @include flex-direction-align-justify(column, pxToRem(10), center, center);
  }
}
</style>

<template>
  <div class="last-searched-country-wrapper">
    <BaseTable :table-data="tableData" :options="tableOptions" @sort="handleSort">
      <!-- Title -->
      <template #title>
        <h2 class="title">
          Public Holidays in {{ lastCountrySearched.countryName }}
          <img
            v-if="lastCountrySearched.countryFlagUrl"
            :src="lastCountrySearched.countryFlagUrl"
            alt="country-flag"
          />
        </h2>
      </template>
      <!-- Sort Icon -->
      <template #sort-icon="{ column }">
        <img
          v-if="tableOptions.sortable?.includes(column)"
          :src="
            currentSortColumn === column && sortDirection === 'asc'
              ? icSortAscending
              : icSortDescending
          "
          alt="sort"
        />
      </template>
      <!-- Date -->
      <template #date="{ rowData }">
        {{ rowData.date ? dateFormatter(rowData.date) : '' }}
      </template>
      <!-- Holiday Name -->
      <template #name="{ rowData }">
        <div class="centralized-container">
          <!-- If wikipedia link is not empty, we can click on the name and it will redirect to the wikipedia page -->
          <a
            v-if="rowData.wikipediaLink"
            class="name"
            :class="{ link: rowData.wikipediaLink }"
            :href="rowData.wikipediaLink"
            target="_blank"
            >{{ rowData.name }}</a
          >
          <img
            v-if="rowData.wikipediaLink"
            :src="icRedirectLink"
            alt="redirect-link"
            class="redirect-link"
          />
          <span v-else class="name">{{ rowData.name }}</span>
        </div>
      </template>
      <!-- Type -->
      <template #type="{ rowData }">
        {{ rowData.types.join(', ') }}
      </template>
    </BaseTable>
    <!-- Pagination -->
    <BasePagination
      v-if="lastCountrySearched.holidays.length > pageSize"
      :page-size="pageSize"
      :total-items="lastCountrySearched.holidays.length"
      :current-page="currentPage"
      @updateCurrentPage="updatePage"
    />
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Types
import type { TableOptions } from '@/types/tableOptions'
import type { PublicHoliday } from '@/types/publicHolidays'
//Stores
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
//Utils
import dateFormatter from '@/utils/dateFormatter'
//Icons
import icRedirectLink from '@/assets/icons/ic_redirect_link.svg'
import icSortAscending from '@/assets/icons/ic_ascending.svg'
import icSortDescending from '@/assets/icons/ic_descending.svg'

const lastCountrySearchedStore = useLastCountrySearchedStore()

const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
const countrySearchedCopy = ref(JSON.parse(JSON.stringify(lastCountrySearched.value)))
const tableData = ref(lastCountrySearched.value.holidays)
const currentPage = ref(1)
const pageSize = ref(5)

const tableOptions = ref<TableOptions>({
  headings: {
    date: 'Date',
    name: 'Name',
    type: 'Type',
  },
  sortable: ['date', 'name'],
})

const sortDirection = ref<'asc' | 'desc'>('asc')
const currentSortColumn = ref<string | null>(null)

const handleSort = (column: string) => {
  // If clicking the same column that was previously sorted
  if (currentSortColumn.value === column) {
    // Toggle the sort direction between ascending and descending
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // If clicking a new column, set it as current and default to ascending
    currentSortColumn.value = column
    sortDirection.value = 'asc'
  }

  // Sort the holidays array
  countrySearchedCopy.value.holidays.sort((a: PublicHoliday, b: PublicHoliday) => {
    // Handle null/undefined values by pushing them to the end
    if (!a[column as keyof PublicHoliday]) return 1
    if (!b[column as keyof PublicHoliday]) return -1

    // Set sort modifier: 1 for ascending, -1 for descending
    const modifier = sortDirection.value === 'asc' ? 1 : -1

    // Special handling for date columns
    if (column === 'date') {
      // Convert dates to timestamps and compare them
      return modifier * (new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    // For non-date columns, use string comparison
    return (
      modifier *
      (a[column as keyof PublicHoliday] as string).localeCompare(
        b[column as keyof PublicHoliday] as string,
      )
    )
  })
  updatePage(1)
}

const updatePage = (page: number) => {
  currentPage.value = page
  getPaginatedData()
}

const getPaginatedData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = currentPage.value * pageSize.value
  tableData.value = countrySearchedCopy.value.holidays.slice(startIndex, endIndex)
  //Fill tableData with empty rows if the number of holidays is not a multiple of pageSize
  const currentTableRows = tableData.value.length
  const missingRows = pageSize.value - currentTableRows
  for (let i = 0; i < missingRows; i++) {
    //Create fake row
    tableData.value.push({
      date: '',
      localName: '',
      name: '',
      countryCode: '',
      global: false,
      counties: [],
      launchYear: 0,
      types: [],
    })
  }
}

//if the lastCountrySearched changes, set currentPage to 1
watch(
  () => lastCountrySearched.value,
  (newValue, oldValue) => {
    if (newValue.countryName !== oldValue.countryName) {
      updatePage(1)
    }
  },
)

onMounted(() => {
  getPaginatedData()
})
</script>

<style scoped lang="scss">
// .last-searched-country-wrapper {
// max-width: pxToRem(800);
// }

.title {
  @include flex-gap(row, pxToRem(10), center, center);
  font-size: pxToRem(22);
  font-weight: 500;
}

.subtitle {
  font-size: pxToRem(12);
  color: $pure-white;
  font-weight: 500;
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
}

.redirect-link {
  width: pxToRem(16);
  height: pxToRem(16);
  cursor: pointer;
}

:deep(.base-table) {
  #dateHead {
    width: 20%;
  }

  #nameHead {
    width: 60%;
  }

  #typeHead {
    width: 20%;
  }
}
</style>

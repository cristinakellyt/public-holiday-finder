<template>
  <div class="last-searched-country-wrapper">
    <BaseTable :table-data="tableData" :options="tableOptions" @sort="handleSort">
      <!-- Title -->
      <template #title>
        <h2 class="title">
          <span
            v-if="
              (!countryHolidaysByYear && filterYear?.toString().length !== 4) || filterYearHasError
            "
          >
            Next
          </span>
          Public Holidays in {{ lastCountrySearched.countryName }}
          <img
            v-if="lastCountrySearched.countryFlagUrl"
            :src="lastCountrySearched.countryFlagUrl"
            alt="country-flag"
          />
          <span v-if="countryHolidaysByYear && filterYear?.toString().length === 4">
            in {{ filterYear }}
          </span>
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
    <div class="bottom-table-wrapper">
      <!-- Filter by year -->
      <div class="filter-by-year-wrapper">
        <BaseInput
          v-model="filterYear"
          :input="filterYear ? filterYear : undefined"
          :debounce="200"
          :max-length="4"
          @inputChange="handleFilterYear"
          placeholder="Filter by year"
          type="number"
          field-name="filterYear"
          :text-error="filterYearHasError ? `Year ${filterYear} is out of range` : null"
          label-text="Filter by year:"
        />
      </div>

      <!-- Pagination -->
      <BasePagination
        v-if="lastCountrySearched.holidays.length > pageSize"
        :page-size="pageSize"
        :total-items="lastCountrySearched.holidays.length"
        :current-page="currentPage"
        @updateCurrentPage="updatePage"
      />
    </div>
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
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Utils
import dateFormatter from '@/utils/dateFormatter'
//Icons
import icRedirectLink from '@/assets/icons/ic_redirect_link.svg'
import icSortAscending from '@/assets/icons/ic_ascending.svg'
import icSortDescending from '@/assets/icons/ic_descending.svg'

const lastCountrySearchedStore = useLastCountrySearchedStore()
const publicHolidaysStore = usePublicHolidaysStore()

const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
const countrySearchedCopy = ref(lastCountrySearched.value)
const countryHolidaysByYear = ref<PublicHoliday[] | null>(null)

const tableData = ref(lastCountrySearched.value.holidays)

const filterYear = ref<number | null>(null)
const filterYearHasError = ref(false)
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

  if (countryHolidaysByYear.value === null || filterYearHasError.value) {
    console.log('all holidays')
    tableData.value = countrySearchedCopy.value.holidays.slice(startIndex, endIndex)
  } else {
    console.log('holidays by year')
    tableData.value = countryHolidaysByYear.value.slice(startIndex, endIndex)
  }

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
      console.log(lastCountrySearched, 'las')
      filterYear.value = null
      countrySearchedCopy.value = JSON.parse(JSON.stringify(lastCountrySearched.value))
      updatePage(1)
    }
  },
)

const handleFilterYear = async (inputValue: string) => {
  filterYear.value = Number(inputValue)
  filterYearHasError.value = false

  if (!filterYear.value) {
    countryHolidaysByYear.value = null
    updatePage(1)
    return
  }

  if (filterYear.value.toString().length > 4) {
    countryHolidaysByYear.value = null
    filterYearHasError.value = true

    updatePage(1)
    return
  }

  //If filterYear is not a 4 digit number, set errorFilterYear to true
  if (filterYear.value.toString().length === 4) {
    countryHolidaysByYear.value = await publicHolidaysStore.getPublicHolidaysByYear(
      filterYear.value,
      lastCountrySearched.value.countryCode,
    )

    if (countryHolidaysByYear.value !== null) {
      filterYearHasError.value = false
    } else {
      filterYearHasError.value = true
    }
    updatePage(1)
  }
}

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

.bottom-table-wrapper {
  width: 100%;
  height: auto;
  @include flex-gap(row, pxToRem(10), center, space-between);

  .filter-by-year-wrapper {
    max-width: pxToRem(250);
  }

  .error-message {
    color: $red;
    font-size: pxToRem(12);
    font-weight: 500;
  }
}
</style>

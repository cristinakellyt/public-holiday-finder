<template>
  <div class="last-searched-country-section-wrapper">
    <!-- Title -->
    <h2 class="section-title">
      Check out the information of the last searched country:
      <span class="country-name">{{ lastCountrySearched.name }}</span>
      <img
        v-if="lastCountrySearched.flagUrl"
        :src="lastCountrySearched.flagUrl"
        alt="country-flag"
      />
    </h2>
    <!-- Content -->
    <div class="content-wrapper">
      <!-- Country Info -->
      <div class="content-top">
        <CountryInfo />
      </div>

      <!-- NEW TABLE -->
      <div class="content-bottom">
        <CountryHolidayTable />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//Components
import CountryInfo from '@/components/CountryInfo.vue'
import CountryHolidayTable from '@/components/CountryHolidayTable.vue'
//Stores
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
import { storeToRefs } from 'pinia'

const lastCountrySearchedStore = useLastCountrySearchedStore()

const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
</script>

<style scoped lang="scss">
.last-searched-country-section-wrapper {
  margin-top: pxToRem(20);
  width: 100%;
  height: auto;

  .section-title {
    @include flex-gap(row, pxToRem(10), center, center);
    font-size: pxToRem(24);
    font-weight: 500;

    .country-name {
      text-decoration: underline;
      color: $color-primary-2;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: $color-primary;
      }
    }
  }
}

.content-wrapper {
  @include flex-gap(column, pxToRem(50), center, center);
  width: 100%;
  margin: pxToRem(20) 0 pxToRem(30) 0;

  :deep(.base-table-wrapper) {
    padding: 0;
    margin-bottom: pxToRem(20);
    background-color: $pure-white;
  }
}

.content-top,
.content-bottom {
  width: 100%;
  height: auto;
}

// .content-right {
//   width: 50%;
// }
</style>

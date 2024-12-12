<template>
  <div class="last-searched-country-section-wrapper">
    <!-- Title -->
    <h2 class="section-title">
      Check out the information of the last searched country:
      <span class="country-name">{{ lastCountrySearched.countryName }}</span>
      <img
        v-if="lastCountrySearched.countryFlagUrl"
        :src="lastCountrySearched.countryFlagUrl"
        alt="country-flag"
      />
    </h2>
    <!-- Content -->
    <div class="content-wrapper">
      <!-- Holidays -->
      <div class="content-left">
        <LastSearchedCountryHolidayTable />
      </div>
      <!-- Country Info -->
      <div class="content-right">
        <CountryInfo />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//Components
import LastSearchedCountryHolidayTable from '@/components/LastSearchedCountryHolidayTable.vue'
import CountryInfo from '@/components/CountryInfo.vue'
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
  @include flex-gap(row, pxToRem(50), flex-start, flex-start);
  width: 100%;
  margin-top: pxToRem(20);

  :deep(.base-table-wrapper) {
    padding: 0;
    margin-bottom: pxToRem(20);
    background-color: $pure-white;
  }
}

.content-left {
  width: 50%;
  height: pxToRem(500);
}

.content-right {
  width: 50%;
}
</style>

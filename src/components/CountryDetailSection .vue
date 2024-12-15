<template>
  <div class="last-searched-country-section-wrapper" v-if="!errorStatus">
    <!-- Title -->
    <h2 class="section-title">
      <span class="country-name">Details about {{ lastCountrySearched.name }}</span>
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
        <CountryInfo
          v-if="countryData"
          :country-details="countryData"
          @onSaved="toggleFavoriteCountry"
        />
      </div>

      <!-- Holiday Table -->
      <div class="content-bottom">
        <CountryHolidayTable v-if="lastCountrySearched.holidays.length > 0" />
        <!-- Error Status for when no holidays were found -->
        <p class="error-status" v-else>No holidays found for this country.</p>
      </div>
    </div>
    <!-- Loading Status -->
    <div v-if="loadingStatus && !errorStatus">
      <BaseSpinner :isLoading="true" />
    </div>
  </div>
  <!-- Error Status for when the API has an error -->
  <div class="error-status" v-else-if="errorStatus">
    <p>Error fetching data, please try again later.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Components
import CountryInfo from '@/components/CountryInfo.vue'
import CountryHolidayTable from '@/components/CountryHolidayTable.vue'
//Stores
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
import { useFavoritesCountriesStore } from '@/stores/favoritesCountriesStore'
//Types
import type { CountryInfo as TypeCountryInfo } from '@/types/country'
import { ToastType, ToastPosition } from '@/types/toast'
//Utils
import { toastManager } from '@/utils/ToastManager'

const lastCountrySearchedStore = useLastCountrySearchedStore()
const publicHolidaysStore = usePublicHolidaysStore()
const favoritesCountriesStore = useFavoritesCountriesStore()
const { lastCountrySearched, loadingStatus, errorStatus } = storeToRefs(lastCountrySearchedStore)

const countryData = ref<TypeCountryInfo | null>(null)

watch(
  () => lastCountrySearched.value,
  async () => {
    countryData.value = await publicHolidaysStore.getCountryInfo(
      lastCountrySearched.value.countryCode,
    )
  },
  { immediate: true },
)

const updateCountryData = async (countryCode: string) => {
  countryData.value = await publicHolidaysStore.getCountryInfo(countryCode)
}

const toggleFavoriteCountry = (isFavorite: boolean, countryCode: string) => {
  const countryName = lastCountrySearched.value.name
  if (isFavorite) {
    favoritesCountriesStore.addFavoriteCountry(countryCode)
    toastManager.addToast(
      `${countryName} added to favorites`,
      ToastType.INFO,
      ToastPosition.TOP_CENTER,
    )
  } else {
    favoritesCountriesStore.removeFavoriteCountry(countryCode)
    toastManager.addToast(
      `${countryName} removed from favorites`,
      ToastType.INFO,
      ToastPosition.TOP_CENTER,
    )
  }
  updateCountryData(countryCode)
}
</script>

<style scoped lang="scss">
.last-searched-country-section-wrapper {
  margin-top: pxToRem(20);
  width: 100%;
  height: auto;
  position: relative;

  .section-title {
    @include flex-direction-align-justify(row, pxToRem(10), center, center);
    font-weight: 500;

    .country-name {
      color: $color-primary-2;
      font-size: inherit;
    }
  }
}

.content-wrapper {
  @include flex-direction-align-justify(column, 0, center, center);
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

.error-status {
  color: $red;
  font-size: pxToRem(16);
  font-weight: 500;
}

@include media-query($tablet) {
  .content-wrapper {
    margin: pxToRem(15) 0 pxToRem(15) 0;
  }
}
</style>

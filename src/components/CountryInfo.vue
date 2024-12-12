<template>
  <div class="country-info-wrapper">
    <!-- Map -->
    <CountryMap class="map-wrapper" :country-code="lastCountrySearched.countryCode" />
    <!-- Country Info -->
    <div class="info-text">
      <span class="info-text-title">Official Name: </span>
      <span class="country-info-official-name">{{ countryInfo.officialName }}</span>
    </div>
    <div class="info-text">
      <span class="info-text-title">Region: </span>
      <span class="country-info-region">{{ countryInfo.region }}</span>
    </div>
    <div class="info-text">
      <span class="info-text-title">This country has {{ getTextForBorders() }}</span>
      <!-- Show only if there are borders -->
      <div class="border-info-wrapper" v-if="countryInfo.borders.length > 0">
        <span
          class="border-names"
          :class="{ unavailable: isBorderUnavailable(border.countryCode) }"
          v-for="(border, index) in countryInfo.borders"
          :key="index"
          @click="selectCountry(border.countryCode)"
        >
          <img :src="border.flagUrl" alt="border-flag" />{{ border.commonName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//Vue
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Components
import CountryMap from '@/components/CountryMap.vue'
//Stores
import { useCountryStore } from '@/stores/countryStore'
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'

const lastCountrySearchedStore = useLastCountrySearchedStore()
const countryStore = useCountryStore()
const publicHolidaysStore = usePublicHolidaysStore()

const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
const { countryInfo } = storeToRefs(countryStore)
const { availableCountries } = storeToRefs(publicHolidaysStore)

onMounted(async () => {
  await countryStore.fetchCountryInfo(lastCountrySearched.value.countryCode)
})

//watch lastCountrySearched
watch(lastCountrySearched, async () => {
  await countryStore.fetchCountryInfo(lastCountrySearched.value.countryCode)
})

const selectCountry = async (countryCode: string) => {
  if (countryCode === lastCountrySearched.value.countryCode) return
  //check if countryCode exists in availableCountries
  const country = availableCountries.value.find((country) => country.countryCode === countryCode)
  if (country) {
    await lastCountrySearchedStore.setLastCountrySearched(countryCode)
  }
}

const isBorderUnavailable = (countryCode: string) => {
  return !availableCountries.value.find((country) => country.countryCode === countryCode)
}

const getTextForBorders = () => {
  return countryInfo.value.borders.length > 0 ? 'borders with: ' : 'no borders'
}
</script>

<style scoped lang="scss">
.country-info-wrapper {
  width: 80%;
  margin: 0 auto;
  @include flex-gap(column, pxToRem(10), flex-start, flex-start);
  background-color: $green-1;
  padding: pxToRem(10);
  border-radius: pxToRem(10);
  box-shadow: pxToRem(2) pxToRem(3) pxToRem(6) 0 $color-primary-2;

  .map-wrapper {
    width: 100%;
    height: pxToRem(300);
  }
}

.info-text {
  font-size: pxToRem(16);

  .info-text-title {
    font-weight: 500;
  }
}

.border-info-wrapper {
  @include flex-gap(row, pxToRem(10), flex-start, flex-start);
  flex-wrap: wrap;
  margin-top: pxToRem(10);
}

.border-names {
  background-color: $pure-white;
  padding: pxToRem(5);
  border-radius: pxToRem(5);
  box-shadow: 1px 1px 0 0 $color-primary-2;
  @include flex-gap(row, pxToRem(5), center, flex-start);
  width: max-content;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: $color-primary-2;
    transform: translateY(-5px);
    color: $pure-white;
  }
}

.unavailable {
  opacity: 0.6;
  pointer-events: none;
}
</style>

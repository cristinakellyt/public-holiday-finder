<template>
  <div class="country-info-wrapper" v-if="countryInfo">
    <!-- TODO: add favorite feature and fix the icons -->
    <img
      class="favorite-icon"
      v-if="isCountryFavorite"
      :src="icFavoriteFullGreen"
      alt="favorite"
      @click="favoriteCountry"
    />
    <img
      v-else
      class="favorite-icon"
      :src="icFavoriteEmpty"
      alt="favorite"
      @click="favoriteCountry"
    />
    <div class="content-wrapper">
      <!-- Map -->
      <CountryMap class="map-wrapper" :country-code="lastCountrySearched.countryCode" />
      <div class="content-info">
        <!-- Country Info -->
        <div class="info-text">
          <span class="bold">Official Name: </span>
          <span class="country-info-official-name">{{ countryInfo.officialName }}</span>
        </div>
        <p class="bold info-text">
          {{ getTextForTodayIsHoliday }}
        </p>
        <div class="info-text">
          <span class="bold">Region: </span>
          <span class="country-info-region">{{ countryInfo.region }}</span>
        </div>
        <div class="info-text">
          <span class="bold">This country has {{ getTextForBorders }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
//Vue
import { computed, onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
//Components
import CountryMap from '@/components/CountryMap.vue'
//Stores
import { useCountryStore } from '@/stores/countryStore'
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Icons
import icFavoriteEmpty from '@/assets/icons/ic_favorite_empty.svg'
import icFavoriteFullGreen from '@/assets/icons/ic_favorite_full_green.svg'

const lastCountrySearchedStore = useLastCountrySearchedStore()
const countryStore = useCountryStore()
const publicHolidaysStore = usePublicHolidaysStore()

const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
const { countryInfo } = storeToRefs(countryStore)
const { availableCountries } = storeToRefs(publicHolidaysStore)
const isCountryFavorite = ref(false)
const isTodayPublicHoliday = ref<boolean | null>(null)

onMounted(async () => {
  await countryStore.getCountryInfo(lastCountrySearched.value.countryCode)
  isTodayPublicHoliday.value = await publicHolidaysStore.isTodayPublicHoliday(
    lastCountrySearched.value.countryCode,
  )
})

//watch lastCountrySearched
watch(lastCountrySearched, async () => {
  await countryStore.getCountryInfo(lastCountrySearched.value.countryCode)
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

const favoriteCountry = () => {
  isCountryFavorite.value = !isCountryFavorite.value
}

const getTextForBorders = computed(() => {
  if (countryInfo.value === null) return 'Error fetching country info'
  return countryInfo.value.borders.length > 0 ? 'borders with: ' : 'no borders'
})

const getTextForTodayIsHoliday = computed(() => {
  if (isTodayPublicHoliday.value === null)
    return 'Sorry, we are not able to check if today is a public holiday in this country'

  if (isTodayPublicHoliday.value) {
    return `Today is a public holiday in ${lastCountrySearched.value.countryName}! It's ${lastCountrySearched.value.holidays[0].name}`
  } else {
    return `Today is not a public holiday in ${lastCountrySearched.value.countryName}`
  }
})
</script>

<style scoped lang="scss">
.country-info-wrapper {
  //   width: 80%;
  //   margin: 0 auto;
  @include flex-gap(column, pxToRem(10), flex-start, flex-start);
  background-color: $green-1;
  padding: pxToRem(10);
  border-radius: pxToRem(10);
  box-shadow: pxToRem(2) pxToRem(3) pxToRem(6) 0 $color-primary-2;

  .map-wrapper {
    width: 100%;
    height: pxToRem(300);
  }

  .content-wrapper {
    @include flex-gap(row, pxToRem(10), flex-start, space-between);
    width: 100%;
    height: auto;
  }

  .content-info {
    @include flex-gap(column, pxToRem(10), flex-start, flex-start);
    width: 100%;
    height: auto;
  }
}

.info-text {
  font-size: pxToRem(16);
}
.bold {
  font-weight: 500;
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
    transform: translateY(-3px);
    color: $pure-white;
  }
}

.unavailable {
  opacity: 0.6;
  pointer-events: none;
}

.favorite-icon {
  width: pxToRem(24);
  height: pxToRem(24);
  cursor: pointer;
  margin-left: auto;
  margin-right: pxToRem(10);
}
</style>

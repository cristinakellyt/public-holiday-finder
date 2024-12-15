<template>
  <div class="country-info-wrapper" v-if="props.countryDetails">
    <img
      class="favorite-icon"
      :src="getIconForFavorite"
      alt="favorite"
      @click="toggleFavoriteCountry"
    />
    <div class="content-wrapper">
      <!-- Map -->
      <CountryMap class="map-wrapper" :country-code="props.countryDetails.countryCode" />
      <div class="content-info">
        <!-- Country Info -->
        <div>
          <span class="bold">Official Name: </span>
          <span class="country-info-official-name">{{ props.countryDetails.officialName }}</span>
        </div>
        <p class="bold">
          {{ getTextForTodayIsHoliday }}
        </p>
        <div>
          <span class="bold">Region: </span>
          <span class="country-info-region">{{ props.countryDetails.region }}</span>
        </div>
        <div>
          <span class="bold">This country has {{ getTextForBorders }}</span>
          <!-- Show only if there are borders -->
          <div class="border-info-wrapper" v-if="props.countryDetails.borders.length > 0">
            <span
              class="border-names"
              :class="{ unavailable: isBorderUnavailable(border.countryCode) }"
              v-for="(border, index) in props.countryDetails.borders"
              :key="index"
              @click="selectCountry(border.countryCode)"
            >
              <img v-if="border.flagUrl" :src="border.flagUrl" alt="border-flag" />{{
                border.commonName
              }}
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
import { useRouter } from 'vue-router'
//Components
import CountryMap from '@/components/CountryMap.vue'
//Stores
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Icons
import icFavoriteEmpty from '@/assets/icons/ic_favorite_empty.svg'
import icFavoriteFullGreen from '@/assets/icons/ic_favorite_full_green.svg'
//Types
import type { CountryInfo } from '@/types/country'

const lastCountrySearchedStore = useLastCountrySearchedStore()
const publicHolidaysStore = usePublicHolidaysStore()
const router = useRouter()

const emit = defineEmits(['onSaved'])

const props = defineProps<{
  countryDetails: CountryInfo
}>()
const isCountryFavorite = ref(props.countryDetails.isFavorite)

watch(
  () => props.countryDetails.isFavorite,
  (newValue) => {
    isCountryFavorite.value = newValue
  },
)

const { availableCountries } = storeToRefs(publicHolidaysStore)

const countryInfo = ref<CountryInfo | null>(null)

onMounted(async () => {
  await updateCountryInfo()
})

const updateCountryInfo = async () => {
  countryInfo.value = await publicHolidaysStore.getCountryInfo(props.countryDetails.countryCode)
}

const selectCountry = async (countryCode: string) => {
  if (countryCode === props.countryDetails.countryCode) return
  //check if countryCode exists in availableCountries
  const country = availableCountries.value.find((country) => country.countryCode === countryCode)
  if (country) {
    await lastCountrySearchedStore.setLastCountrySearched(countryCode)
  }

  // If the card is used as a favorite, redirect to home
  if (isCountryFavorite.value) {
    router.push({ name: 'home' })
  }
}

const isBorderUnavailable = (countryCode: string) => {
  return !availableCountries.value.find((country) => country.countryCode === countryCode)
}

const toggleFavoriteCountry = () => {
  if (isCountryFavorite.value) {
    emit('onSaved', false, props.countryDetails.countryCode)
  } else {
    emit('onSaved', true, props.countryDetails.countryCode)
  }
}

const getIconForFavorite = computed(() => {
  return isCountryFavorite.value ? icFavoriteFullGreen : icFavoriteEmpty
})

const getTextForBorders = computed(() => {
  if (countryInfo.value === null) return 'Error fetching country info'
  return countryInfo.value.borders.length > 0 ? 'borders with: ' : 'no borders'
})

const getTextForTodayIsHoliday = computed(() => {
  if (countryInfo.value?.isHolidayToday === null)
    return 'Sorry, we are not able to check if today is a public holiday in this country'

  if (countryInfo.value?.isHolidayToday) {
    return `Today is a public holiday in ${props.countryDetails.commonName}! `
  } else {
    return `Today is not a public holiday in ${props.countryDetails.commonName}`
  }
})

//watch changes in props.countryDetails and update countryInfo
watch(
  () => props.countryDetails,
  async () => {
    await updateCountryInfo()
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.country-info-wrapper {
  @include flex-direction-align-justify(column, pxToRem(10), flex-start, flex-start);
  background-color: $green-1;
  padding: pxToRem(10);
  border-radius: pxToRem(10);
  box-shadow: pxToRem(2) pxToRem(3) pxToRem(6) 0 $color-primary-2;
  margin-bottom: pxToRem(50);

  .map-wrapper {
    width: 100%;
    height: pxToRem(300);
  }

  .content-wrapper {
    @include flex-direction-align-justify(row, pxToRem(10), flex-start, space-between);
    width: 100%;
    height: auto;
  }

  .content-info {
    @include flex-direction-align-justify(column, pxToRem(10), flex-start, flex-start);
    width: 100%;
    height: auto;
  }
}
.bold {
  font-weight: 500;
}

.border-info-wrapper {
  @include flex-direction-align-justify(row, pxToRem(10), flex-start, flex-start);
  flex-wrap: wrap;
  margin-top: pxToRem(10);
}

.border-names {
  background-color: $pure-white;
  padding: pxToRem(5);
  border-radius: pxToRem(5);
  box-shadow: 1px 1px 0 0 $color-primary-2;
  @include flex-direction-align-justify(row, pxToRem(5), center, flex-start);
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

@include media-query($tablet) {
  .country-info-wrapper {
    .content-wrapper {
      @include flex-direction-align-justify(column, pxToRem(16), center, center);
    }

    .content-info {
      width: auto;
    }
  }
}
</style>

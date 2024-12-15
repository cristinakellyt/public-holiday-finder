<template>
  <header class="header-wrapper">
    <BaseWidth>
      <nav class="header-nav">
        <div class="header-title" @click="navigateTo('home')">
          <img class="calendar-icon" :src="icCalendar" alt="calendar" />
          <h1 class="header-title-text" @click="navigateTo('home')">Public Holidays</h1>
        </div>
        <div class="header-options">
          <img
            src="@/assets/icons/ic_favorite.svg"
            alt="favorite"
            title="Favorite"
            class="favorite-icon"
            @click="navigateTo('saved-country')"
          />
          <img src="@/assets/icons/ic_info.svg" alt="info" title="Info" class="info-icon" />
        </div>
      </nav>
    </BaseWidth>
  </header>
</template>

<script setup lang="ts">
//Vue Router
import { useRouter } from 'vue-router'
//Icons
import icCalendar from '@/assets/icons/ic_calendar.svg'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push({ name: path })
}
</script>

<style scoped lang="scss">
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: $color-primary;
  border-bottom: pxToRem(1) solid $green-1;
  box-shadow: pxToRem(1) pxToRem(-1) pxToRem(8) 0 rgba(0, 0, 0, 0.1);

  :deep(.base-width) {
    padding: pxToRem(16) pxToRem(32);
  }
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    color: $pure-white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: pxToRem(8);

    .calendar-icon {
      width: pxToRem(32);
      height: pxToRem(32);
    }

    .header-title-text {
      font-weight: 500;
      color: $pure-white;
    }
  }

  .header-options {
    display: flex;
    gap: pxToRem(24);

    .favorite-icon,
    .info-icon {
      cursor: pointer;
    }
  }
}

@media (max-width: $mobile-large) {
  .header-nav {
    .header-title {
      .calendar-icon {
        width: pxToRem(24);
        height: pxToRem(24);
      }
    }
  }
}
</style>

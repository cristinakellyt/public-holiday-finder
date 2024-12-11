<template>
  <header class="header-wrapper">
    <BaseWidth>
      <nav class="header-nav">
        <h1 class="header-title">Public Holidays Finder</h1>
        <div class="header-options">
          <img
            src="@/assets/icons/ic_favorite.svg"
            alt="favorite"
            title="Favorite"
            class="favorite-icon"
          />
          <img src="@/assets/icons/ic_info.svg" alt="info" title="Info" class="info-icon" />
        </div>
      </nav>
    </BaseWidth>
  </header>
</template>

<style scoped lang="scss">
.header-wrapper {
  background-color: $color-primary;
  border-bottom: pxToRem(1) solid $green-1;
  box-shadow: 1px -1px 8px 0 rgba(0, 0, 0, 0.1);

  :deep(.base-width) {
    padding: pxToRem(16) pxToRem(32);
  }

  .header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-title {
      font-size: pxToRem(28);
      font-weight: 500;
      color: $pure-white;
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
}
</style>

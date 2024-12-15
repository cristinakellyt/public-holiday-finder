<template>
  <BaseModal :has-buttons="true" @close="closeModal">
    <template #title>
      <h2>Welcome to Public Holidays Finder!</h2>
    </template>
    <template #text>
      <p>
        This app allows you to find public holidays for any country available in our database.
        <br /><br />
        <span class="bold">Features:</span>
        <ul>
          <li class="highlight bold">- Discover public holidays by country.</li>
          <li class="highlight bold">- Access details about each holiday, through links to Wikipedia.</li>
          <li class="highlight bold">- View holidays by year or upcoming holidays.</li>
          <li class="highlight bold">- Save favorite countries for quick access.</li>
        </ul>
        <br />
        To get started, use the search bar to find a country, and explore its public holidays!
        <br /><br />
        Enjoy your journey through the world of public holidays!
      </p>
    </template>
    <template #buttons>
      <BaseButton class="button-close" @click="closeModal" text="Close" size="medium" />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.button-close {
  max-width: pxToRem(100);
  margin-left: auto;
}

.bold {
  font-weight: 600;
}
.highlight {
  color: $color-primary-2;
  margin-left: pxToRem(10);
}
</style>

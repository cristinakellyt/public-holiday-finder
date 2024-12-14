<template>
  <div class="base-table-wrapper">
    <div class="title-base-table-wrapper">
      <slot name="title" class="title-base-table" />
    </div>
    <table class="base-table">
      <thead>
        <tr class="head-base-table">
          <td
            v-for="(value, keyName, index) in options.headings"
            :id="`${keyName}Head`"
            :key="index"
            class="cell-base-table"
          >
            <div
              class="header-content"
              :class="{ sortable: options.sortable?.includes(keyName) }"
              @click="options.sortable?.includes(keyName) && emitSort(keyName)"
            >
              {{ value }}
              <slot name="sort-icon" :column="keyName" />
            </div>
          </td>
        </tr>
      </thead>
      <tbody v-if="tableData">
        <tr v-for="rowData in tableData" :key="rowData.id" class="row-base-table">
          <td
            v-for="(value, keyName, index) in options.headings"
            :key="index"
            :class="`cell-base-table ${keyName}`"
            class="cell-base-table"
          >
            <slot :name="keyName" :row-data="rowData" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps({
  options: {
    type: Object,
    required: true,
  },
  tableData: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['sort'])

const emitSort = (column: string) => {
  emit('sort', column)
}
</script>

<style lang="scss" scoped>
.base-table-wrapper {
  padding: pxToRem(30) 0;
}

.title-base-table-wrapper {
  background-color: $color-primary-2;
  width: 100%;
  padding: pxToRem(14) pxToRem(10);
  text-align: center;
  color: $pure-white;
  border-bottom: pxToRem(1) solid $gray-300;
  border-top-left-radius: pxToRem(10);
  border-top-right-radius: pxToRem(10);
}

/* table styling */
.base-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.head-base-table {
  font-weight: 700;
  color: $color-primary-2;
  font-size: pxToRem(16);
  letter-spacing: 0;
  line-height: pxToRem(16);
  height: pxToRem(40);
  white-space: nowrap;

  .cell-base-table {
    padding: pxToRem(18) pxToRem(16);
    background-color: $green-1;
    border: none;
    position: relative;
    z-index: 1;

    &:nth-child(1) {
      padding-left: pxToRem(32);
    }

    &:last-child {
      padding-right: pxToRem(32);
    }
  }
}

.row-base-table {
  vertical-align: middle;
  height: pxToRem(60);

  .cell-base-table {
    background-color: $pure-white;
    padding: pxToRem(18) pxToRem(16);
    border-bottom: pxToRem(1) solid $gray-200;
    font-weight: 500;

    &:nth-child(1) {
      padding-left: pxToRem(32);
    }

    &:last-child {
      padding-right: pxToRem(32);
    }
  }
}

.sortable {
  cursor: pointer;
}

.header-content {
  display: flex;
  align-items: center;
  gap: pxToRem(8);
}

.sort-icon {
  font-size: pxToRem(14);
}
</style>

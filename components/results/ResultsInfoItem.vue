<template>
  <div class="result-info-item">
    <p class="result-info-item__title">{{ keyName }}</p>
    <p>{{ value }}</p>
    <p>{{ valueSumOfNumbers }}</p>
    <p>{{ getIsEven }}</p>
  </div>
</template>

<script>
export default {
  name: 'ResultsInfoItem',
  props: {
    keyName: {
      type: String,
      default() {
        return ''
      },
    },
    value: {
      type: Number,
      default() {
        return 0
      },
    },
  },
  computed: {
    valueSumOfNumbers() {
      return this.value
        .toString()
        .replace(/\D/, '')
        .split('')
        .reduce((total, currentVal) => +total + +currentVal, 0)
    },

    getIsEven() {
      return !(+this.valueSumOfNumbers % 2)
    },
  },
}
</script>

<style lang="scss">
.result-info-item {
  color: $gray1;
  display: grid;
  grid-template-columns: 1fr repeat(3, 100px);
  align-items: center;
  margin-bottom: 10px;

  &__title {
    font-weight: 600;
  }
}
</style>

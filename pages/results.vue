<template>
  <div class="results-page">
    <div v-if="info" class="results-info">
      <div class="results-info__title">
        <p>{{ info.currency.name }} ({{ info.currency.code }})</p>
        <p class="results-info__date">{{ info.date }}</p>
      </div>
      <template v-for="keyName of keyNames">
        <lazy-results-info-item
          v-if="info.currencyInfo[keyName]"
          :key="keyName"
          :key-name="keyName"
          :value="info.currencyInfo[keyName]"
        />
      </template>
    </div>
    <div v-else class="results-page__error">
      <template v-if="!errorMessage">Упс что то полшо не так!</template>
      {{ errorMessage }}
    </div>
    <t-button @click="goToHome"> Вернутся на гавную </t-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SET_RESET_STATE } from '@/store/currency/config/actions.type'

export default {
  name: 'Results',
  data() {
    return {
      title: 'Результат',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    ...mapState('currency', {
      info: (state) => state.info,
      keyNames: (state) => state.keyNames,
      errorMessage: (state) => state.errorMessage,
    }),
  },
  mounted() {
    this.$root.$emit('set::title', this.title)
  },
  methods: {
    async goToHome() {
      await this.$router.push('/')

      this.$store.dispatch(`currency/${SET_RESET_STATE}`)
    },
  },
}
</script>

<style lang="scss">
.results-page {
  margin: auto;

  display: grid;
  align-items: center;
  grid-gap: 25px;

  .results-info {
    width: 500px;
    height: 300px;
    background: $gray11;
    box-shadow: 0 0 10px 5px $gray11;
    border-radius: 10px;
    padding: 15px 10px;

    &__title,
    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__title {
      margin-bottom: 20px;
    }

    &__date {
      font-weight: 600;
    }

    &__item {
    }
  }

  &__error {
    width: 400px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba($red, 0.3);

    color: $red;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>

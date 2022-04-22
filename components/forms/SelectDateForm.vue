<template>
  <form class="select-date" @submit.prevent="setData">
    <v-date-picker
      v-model="form.date"
      mode="date"
      :min-date="minDate"
      :max-date="maxDate"
    >
      <template #default="{ inputValue, inputEvents }">
        <wrapper-input small>
          <input class="field__input" :value="inputValue" v-on="inputEvents" />
        </wrapper-input>
      </template>
    </v-date-picker>

    <t-multiselect
      v-model="form.currency"
      :searchable="false"
      :show-labels="false"
      :label="'name'"
      :options="currencies"
    />

    <t-button
      type="submit"
      class="select-date__submit"
      :disabled="isInValidForm"
      :loading="processing"
    >
      Проверить
    </t-button>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import TMultiselect from '@/components/UI/TMultiselect'
import { currencies } from '@/config/constants/currencies'
import { dateRegex } from '@/config/regexes/dateRegex'
import { SET_ITEMS } from '@/store/currency/config/actions.type'

export default {
  name: 'SelectDateForm',
  components: { TMultiselect },
  data() {
    return {
      form: {
        date: new Date(),
        currency: '',
      },

      minDate: this.$dayjs.getDate().subtract(2, 'year').toDate(),
      maxDate: this.$dayjs.getDate().toDate(),

      currencies,
      dateRegex,
    }
  },
  computed: {
    ...mapState('currency', {
      processing: (state) => state.processing,
    }),

    isInValidForm() {
      return !this.form.currency || !this.form.date
    },
  },
  methods: {
    setData() {
      this.$store.dispatch(`currency/${SET_ITEMS}`, this.form)
    },
  },
}
</script>

<style lang="scss">
.select-date {
  display: grid;
  grid-template-rows: repeat(2, 46px);
  grid-gap: 10px;
  height: 100%;
  box-sizing: border-box;
  padding: 15px;

  &__submit {
    align-self: end;
  }
}
</style>

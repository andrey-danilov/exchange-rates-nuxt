import { StatusCodes } from 'http-status-codes'
import {
  ADD_DATA,
  RESET_STATE,
  SET_PROCESSING_FLAG,
  ADD_ERROR_MESSAGE,
} from '@/store/currency/config/mutations.type'

import {
  SET_ITEMS,
  SET_RESET_STATE,
} from '@/store/currency/config/actions.type'

const defaultState = {
  date: '',
  processing: false,
  currency: '',
  info: null,
  errorMessage: '',
  keyNames: ['saleRateNB', 'purchaseRateNB', 'saleRate', 'purchaseRate'],
}

export const state = () => ({
  date: defaultState.date,
  currency: defaultState.currency,
  processing: defaultState.processing,
  errorMessage: defaultState.errorMessage,
  info: defaultState.info,
  keyNames: defaultState.keyNames,
})

export const mutations = {
  [ADD_DATA](state, info) {
    state.info = info
  },

  [SET_PROCESSING_FLAG](state, payload = false) {
    state.processing = payload
  },

  [ADD_ERROR_MESSAGE](state, payload = false) {
    state.processing = payload
  },

  [RESET_STATE](state) {
    Object.keys(defaultState).forEach((key) => {
      state[key] = defaultState[key]
    })
  },
}

export const actions = {
  async [SET_ITEMS]({ commit, getters }, { date, currency }) {
    try {
      commit(SET_PROCESSING_FLAG, true)

      const { data, status } = await this.$api.currencyInfo.getInfo(
        this.$dayjs.format(date, 'DD.MM.YYYY')
      )

      this.$router.push('/results')

      const info = {
        date: data.date,
        currencyInfo: data.exchangeRate.find(
          (item) => item.currency === currency.code
        ),
        currency,
      }

      if (status === StatusCodes.OK) {
        commit(ADD_DATA, info)
      }
    } catch (error) {
      commit(ADD_ERROR_MESSAGE, 'Oops something went wrong!')

      return false
    } finally {
      commit(SET_PROCESSING_FLAG)
    }
  },

  [SET_RESET_STATE]({ commit }) {
    commit(RESET_STATE)
  },
}

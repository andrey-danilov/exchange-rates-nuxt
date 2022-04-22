import CurrencyInfo from '@/api/currencyInfo'

export default (context, inject) => {
  const factories = {
    currencyInfo: CurrencyInfo(context.$axios),
  }

  inject('api', factories)
}

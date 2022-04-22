export default (axios) => ({
  getInfo(date) {
    return axios.get('/p24api/exchange_rates?json', {
      params: { date },
    })
  },
})

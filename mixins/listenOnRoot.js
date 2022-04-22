export default {
  methods: {
    listenOnRoot(event, callback) {
      this.$root.$on(event, callback)
      this.$on('hook:beforeDestroy', () => {
        this.$root.$off(event, callback)
      })

      return this
    },
  },
}

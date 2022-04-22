import sha1 from 'crypto-js/sha1'

export default {
  props: {
    id: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      localId_: null,
    }
  },
  computed: {
    safeId() {
      // Computed property that returns a dynamic function for creating the ID.
      // Reacts to changes in both .id and .localId_ And regens a new function
      const id = this.id || this.localId_

      // We return a function that accepts an optional suffix string
      // So this computed prop looks and works like a method!!!
      // But benefits from Vue's Computed prop caching
      const fn = (suffix) => {
        if (!id) {
          return null
        }
        // eslint-disable-next-line no-param-reassign
        suffix = String(suffix || '').replace(/\s+/g, '_')

        return sha1(suffix ? id + '_' + suffix : id).toString()
      }

      return fn
    },
  },
  mounted() {
    // mounted only occurs client side
    this.$nextTick(() => {
      // Update dom with auto ID after dom loaded to prevent
      // SSR hydration errors.
      this.localId_ = `__CRMTOPY__${this._uid}`
    })
  },
}

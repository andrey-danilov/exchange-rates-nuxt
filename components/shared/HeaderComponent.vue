<template>
  <header class="header">{{ title }}</header>
</template>

<script>
import listenOnRoot from '@/mixins/listenOnRoot'

export default {
  name: 'HeaderComponent',
  mixins: [listenOnRoot],
  data() {
    return {
      title: '',
    }
  },
  mounted() {
    this.listenOnRoot('set::title', this.setTitle)
  },
  methods: {
    setTitle(title) {
      this.title = title
    },
  },
}
</script>

<style lang="scss">
.header {
  height: 40px;
  text-align: center;
  padding: 15px 0;
  font-size: 20px;
  color: $gray1;
}
</style>

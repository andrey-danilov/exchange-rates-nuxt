<template>
  <section class="home-page">
    <lazy-header-component />
    <nuxt />
  </section>
</template>

<script>
export default {}
</script>

<style lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;

  background-color: $gray9;
}
</style>

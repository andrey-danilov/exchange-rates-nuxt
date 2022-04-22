<template>
  <div class="home-page">
    <t-button class="open-modal" @click="openModal"> Выбрать дату </t-button>
    <modal :name="modalName" classes="custom-modal">
      <lazy-select-date-form />
    </modal>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      modalName: 'dateModal',
      title: 'Добро пожаловать',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    this.$root.$emit('set::title', this.title)
  },
  methods: {
    openModal() {
      this.$modal.show(this.modalName)
    },
  },
}
</script>

<style lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .open-modal {
    margin: auto;
  }

  .custom-modal {
    overflow: visible;
  }
}
</style>

<template>
  <div>
    <render></render>
  </div>
</template>

<script>
export default {
  data() {
    params: {
      id: 100
    }
  },
  mounted() {
    this.req(100, 200)
  }
}
</script>

<style></style>

<template>
  <v-progress-circular
    :size="70"
    :width="7"
    color="light-blue darken-4"
    indeterminate
  />
</template>

<style scoped>
.v-progress-circular {
  display: inline-block;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 200px;
  height: 100px;
  margin: auto;
}
</style>
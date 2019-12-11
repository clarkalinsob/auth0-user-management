<template>
  <v-app>
    <div v-if="!$auth.loading">
      <AppBar/>
      <div v-if="$auth.isAuthenticated">
        <NavigationDrawer/>
      </div>
      <v-content>
        <router-view/>
      </v-content>
    </div>
    <div v-if="$auth.loading">
      <v-progress-circular
        :size="70"
        :width="7"
        color="light-blue darken-4"
        indeterminate
    />
    </div>
  </v-app>
</template>

<script>
import NavigationDrawer from './components/NavigationDrawer'
import AppBar from './components/AppBar'

export default {
  name: 'App',
  components: {
    NavigationDrawer,
    AppBar
  },
  data: () => ({}),
  methods: {

  }
};
</script>

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
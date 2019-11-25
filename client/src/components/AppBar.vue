<template>
  <v-app-bar
      app
      color="light-blue darken-4"
      dark
      height='89'
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="../assets/logo-lmc-white.png"
          transition="scale-transition"
          width="150"
        />
      </div>

      <v-spacer></v-spacer>

      <div v-if="!$auth.loading">
        <v-btn
          v-if="!$auth.isAuthenticated" 
          @click="login"
          target="_blank"
          text
        >
          <span class="mr-2">Login</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        <v-btn
          v-if="$auth.isAuthenticated" 
          @click="logout"
          target="_blank"
          text
        >
          <span class="mr-2">Logout</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

</template>

<script>
// .. imports removed for brevity

export default {
  name: "home",
  components: {
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>
<template>
  <v-app-bar app color="light-blue darken-4" dark height="89">
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="../assets/egbertapps-logo.png"
        transition="scale-transition"
        width="140"
      />
    </div>
    <v-spacer />
    <div v-if="!$auth.loading">
      <v-btn v-if="!$auth.isAuthenticated" @click="login" target="_blank" text>
        <span class="mr-2">Login</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-btn v-if="$auth.isAuthenticated" @click="toBugStalker" target="_blank" text>
        <span class="mr-2">Bug Stalker</span>
        <v-icon>mdi-bug</v-icon>
      </v-btn>
      <v-btn v-if="$auth.isAuthenticated" @click="logout" target="_blank" text>
        <span class="mr-2">Logout</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
    toBugStalker() {
      window.open("https://bugstalker.clarkalinsob.com/dashboard");
    }
  }
};
</script>
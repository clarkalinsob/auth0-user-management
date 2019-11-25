<template>
  <div>
    <v-btn
      @click="callApi"
      target="_blank"
      text
    >
      <span class="mr-2">Call Users API</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
    <div v-if="!loading">
      <pre v-for="user in this.users" :key="user.email">{{ JSON.stringify(user) }}</pre>
    </div>
    <!-- <p >{{ apiMessage }}</p> -->
    <p v-if="loading">loading...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "users",
  data() {
    return {
      users: null,
      loading: null
    };
  },
  methods: {
    async callApi() {
      this.loading = true

      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently()

      // Use Axios to make a call to the API
      const { data } = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
        }
      });

      // eslint-disable-next-line
      console.log('data', data)
      if (data) {
          this.loading = false
          this.users = data.users
      }
    }
  }
};
</script>
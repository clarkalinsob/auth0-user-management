<template>
  <div>
    <v-btn
      @click="callApi"
      target="_blank"
      text
    >
      <span class="mr-2">Call API</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
    <p v-if="!loading">{{ apiMessage }}</p>
    <p v-if="loading">loading...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ExternalApi",
  data() {
    return {
      apiMessage: "",
      loading: null
    };
  },
  methods: {
    async callApi() {
      this.loading = true

      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently()

      // Use Axios to make a call to the API
      const { data } = await axios.get("/api/external", {
        headers: {
          Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
        }
      });

      if (data) {
        this.loading = false
        this.apiMessage = data;
      }
    }
  }
};
</script>
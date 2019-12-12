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

      const token = await this.$auth.getTokenSilently()

      const { data } = await axios.get(`${process.env.VUE_APP_URL}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data) {
        this.loading = false
        this.apiMessage = data;
      }
    }
  }
}
</script>
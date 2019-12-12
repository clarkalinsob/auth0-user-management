<template>
     <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-on:keyup.enter="searchForEmail"
            :hint="'Must have at least 3 characters to search'"
            v-model="searchEmail"
            :append-outer-icon="'mdi-magnify'"
            clear-icon="mdi-close-circle"
            clearable
            label="Search Email"
            type="text"
            @click:append-outer="searchForEmail"
            @click:clear="clearMessage"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
</template>


<script>
import axios from "axios";

export default {
  name: "SearchBar",
  data() {
    return {
      searchName: '',
      searchEmail: ''
    };
  },
  methods: {
      clearMessage () {
        this.searchName = ''
        this.searchEmail = ''
      },
      async searchForEmail () {
        this.loading = true
        const token = await this.$auth.getTokenSilently()
        const body = {
          email: this.searchEmail
        }
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
          }
        }

        const { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/users/search/email`, body, headers);
        
        if (data) {
          this.users = data.users
          this.loading = false
        }
      }
  },

};
</script>
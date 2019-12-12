<template>
  <div>
    <!-- <v-container>
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
    </v-container> -->

    <v-container v-if="errorMessage">
      {{ errorMessage }} 
    </v-container>

    <v-container v-if="!loading && !errorMessage">
      <UsersTable v-bind:propUsers="this.users"/>
    </v-container>

    <LoadingCircle v-if="loading"/>
  </div>
</template>

<script>
import axios from "axios";
import UsersTable from '../components/UsersTable'
import LoadingCircle from '../components/LoadingCircle'

export default {
  name: "Users",
  components: {
    UsersTable,
    LoadingCircle
  },
  data() {
    return {
      users: [],
      loading: null,
      errorMessage: '',

      // for search bar
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
      const { data: { error, users } } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/users/search/email`, body, headers);
      
      if (error) this.errorMessage = error.message
      else if (users) this.users = users

      this.loading = false
    }
  },
  mounted: async function () {
    this.loading = true
    const token = await this.$auth.getTokenSilently()
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
      }
    }
    const { data: { error, users } } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/users`, headers); 

    if (error) this.errorMessage = error.message
    else if (users) this.users = users

    this.loading = false
  }
}
</script>
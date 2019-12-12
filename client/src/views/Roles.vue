<template>
  <div>
    <v-container v-if="errorMessage">
      {{ errorMessage }}
    </v-container>
    <v-container v-if="!loading && !errorMessage">
      <RolesTable v-bind:propRoles="this.roles"/>
    </v-container>
    <LoadingCircle v-if="loading"/>
  </div>
</template>

<script>
import axios from "axios";
import RolesTable from '../components/RolesTable'
import LoadingCircle from '../components/LoadingCircle'

export default {
  name: "Roles",
  components: {
    RolesTable,
    LoadingCircle
  },
  data() {
    return {
      roles: [],
      loading: null,
      errorMessage: ''
    };
  },
  methods: {
    clearMessage () {
      this.searchName = ''
      this.searchEmail = ''
    }
  },
  mounted: async function() {
    this.loading = true
    const token = await this.$auth.getTokenSilently()

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const { data: { error, roles } } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/roles`, headers); 

    if (error) this.errorMessage = error.message
    else if (roles) this.roles = roles
    
    this.loading = false
  }
}
</script>
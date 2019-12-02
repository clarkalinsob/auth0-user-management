<template>
  <div>
    <div v-if="!loading">
      <RolesTable v-bind:propRoles="this.roles"/>
    </div>
    <div v-if="loading">
      <v-progress-circular
        :size="70"
        :width="7"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import RolesTable from '../components/RolesTable'

export default {
  name: "Roles",
  components: {
    RolesTable
  },
  data() {
    return {
      roles: [],
      loading: null
    };
  },
  methods: {
      clearMessage () {
        this.searchName = ''
        this.searchEmail = ''
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
    const { data } = await axios.get("/api/v1/roles", headers); 

    if (data) {
      this.roles = data.roles
      this.loading = false
    }
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
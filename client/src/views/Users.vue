<template>
  <div>
    <div v-if="!loading">
      <CrudTable v-bind:propUsers="this.users"/>
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
import CrudTable from '../components/CrudTable'

export default {
  name: "Users",
  components: {
    CrudTable
  },
  data() {
    return {
      users: [],
      loading: null
    };
  },
  mounted: async function () {
    this.loading = true

    // Get the access token from the auth wrapper
    const token = await this.$auth.getTokenSilently()

    // Use Axios to make a call to the API
    const { data } = await axios.get("/api/usm/users/v1", {
      headers: {
        Authorization: `Bearer ${token}`    // send the access token through the 'Authorization' header
      }
    });

    // eslint-disable-next-line
    console.log('data', data)
    if (data) {
      this.users = data.users
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
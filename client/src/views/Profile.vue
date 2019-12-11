<template>
  <v-container class="grey lighten-5">
    <div v-if="!loading">
      <v-row
        class="mb-6"
        no-gutters
        :justify="'space-between'"
      >
        <v-col cols="1" sm="1" md="1" lg="1">
          <v-avatar size="82">
            <img :src="user.picture" :alt="user.name">
          </v-avatar>
        </v-col>
        <v-col cols="6" sm="7" md="8" lg="9">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-2" v-text="user.name"/>
              <v-list-item-subtitle v-text="`user_id: ${user.user_id}`"/>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="auto">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn color="orange accent-4" height="4em" dark v-on="on">Actions
                <v-icon class="ml-2" small  v-text="'mdi-menu-down-outline'"/>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title v-text="'Block'"/>
              </v-list-item>
              <v-divider/>
              <v-list-item @click="showDeleteDialog(user)">
                <v-list-item-title v-text="'Delete'"/>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <v-tabs v-model="tab">
        <v-tab href="#tab-details" v-text="'Details'"/>
        <v-tab href="#tab-roles" v-text="'Roles'" @click="getRoles"/>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item :transition="false" :reverse-transition="false" :value="'tab-details'">
          <v-row no-gutters>
            <v-col cols="sm">
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="pa-2" v-text="'NAME'"/>
                    <v-list-item-title class="pa-2" v-text="user.name"/>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="pa-2" v-text="'PRIMARY IDENTITY PROVIDER'"/>
                    <v-list-item-title class="pa-2" v-text="getIdentityProvider(user.user_id)"/>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="sm">
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="pa-2" v-text="'EMAIL'"/>
                    <v-list-item-title class="pa-2" v-text="`${user.email} ${user.email_verified ? '(verified)' : '(pending)'}`"/>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="pa-2" v-text="'LATEST LOGIN'"/>
                    <v-list-item-title class="pa-2" v-text="getMoment(user.last_login)"/>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="sm">
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="pa-2" v-text="'SIGNED UP'"/>
                    <v-list-item-title class="pa-2" v-text="getMoment(user.created_at)"/>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="pa-2" v-text="'LOGIN COUNT'"/>
                    <v-list-item-title class="pa-2" v-text="user.logins_count"/>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item :transition="false" :reverse-transition="false" :value="'tab-roles'">
          <v-row class="pl-8 pr-8">
            <v-col>
              <v-list-item-title class="pt-4" v-text="'All Roles assigned to this User.'"/>
            </v-col>
            <v-col cols="auto">
              <v-btn color="light-blue darken-4" height="4em" dark v-text="'Assign Roles'" @click="onAssignRolesBtn"/>
            </v-col>
          </v-row>
          <AssignRolesDialog :visible="showAssignRolesDialog" :userId="user.user_id" @close="showAssignRolesDialog = false" @assign="onAssign"/>
          <LoadingCircleSmall v-if="roleLoading"/>
          <v-simple-table v-if="!roleLoading">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Description</th>
                  <th class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in roles" :key="role.id">
                  <td>{{ role.name }}</td>
                  <td>{{ role.description }}</td>
                  <td>
                    <v-btn color="red darken-3" icon dark @click="showDeleteDialog(role)">
                      <v-icon v-text="'mdi-delete'"/>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <DeleteDialog 
      :visible="showDialog" 
      :type="type"
      :api="api" 
      :item="selectedItem" 
      :user="user" 
      @deleted="deleted" 
      @close="showDialog = false"
    />
    <LoadingCircle v-if="loading"/>
  </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import LoadingCircle from '../components/LoadingCircle'
import LoadingCircleSmall from '../components/LoadingCircleSmall'
import DeleteDialog from '../components/DeleteDialog'
import AssignRolesDialog from '../components/AssignRolesDialog'

export default {
  name: 'Profile',
  components: {
    LoadingCircle,
    LoadingCircleSmall,
    DeleteDialog,
    AssignRolesDialog
  },
  data () {
    return {
      type: '',
      api: '',
      showDialog: false,
      showAssignRolesDialog: false,
      tab: null,
      loading: false,
      roleLoading: false,
      selectedItem: null,
      roleIndex: -1,
      user: {},
      roles: [],
      errorMsg: ''
    }
  },
  mounted: async function() {
    await this.getUser()
  },
  methods: {
    async getUser () {
      this.loading = true

      const token = await this.$auth.getTokenSilently()
      const { data: { user, error }} = await axios.get(`/api/v1/users/${this.$route.params.id}`, {
          headers: {
          Authorization: `Bearer ${token}`
        },
      });
      
      if (error) this.errorMsg = error
      else if (user) this.user = user
      
      this.loading = false
    },

    async getRoles() {
      this.roleLoading = true

      const token = await this.$auth.getTokenSilently()
      const { data: { roles, error }} = await axios.get(`/api/v1/users/${this.user.user_id}/roles`, {
          headers: {
          Authorization: `Bearer ${token}`
        },
      });
      
      if (error) this.errorMsg = error
      else if (roles) this.roles = roles

      this.roleLoading = false
    },

    getMoment (time) {
      return moment(time).format('lll')
    },

    getIdentityProvider (str) {
      const provider = typeof str === 'string' && str.includes('google') ? 'Google / Gmail' : 'Auth0'
      return provider
    },

    showDeleteDialog (item) {
      if (item.user_id) {
        this.type = 'User'
        this.api = `users/${item.user_id}/delete`
      } else {
        this.type = 'Role'
        this.api = `users/${this.user.user_id}/roles/delete`
      }
      
      this.selectedItem = item
      this.showDialog = true
    },

    deleted ({ type }) {
      if (type === 'User') this.$router.push({ path: '/users' })
      else this.roles.splice(this.roles.indexOf(this.selectedItem), 1)

      this.showDialog = false
    },

    onAssignRolesBtn () {
      this.showAssignRolesDialog = true
    },

    onAssign (data) {
      if (data.status === 200) this.getRoles()
    }
  },
}
</script>
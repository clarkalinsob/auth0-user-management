<template>
  <v-dialog v-model="show" max-width="40em">
    <v-card>
      <v-card-title>
        <span class="headline" v-text="'Add Roles'"/>
      </v-card-title>
      <v-divider/>
      <v-card-text class="mt-3" v-text="'Select roles to assign to this user. You may assign up to 50 roles per user.'"/>  
      <v-container>
        <LoadingCircleSmall v-if="roleLoading"/>
        <v-select 
          v-if="!roleLoading"
          class="pl-2 pr-2"
          v-model="selectedRoles"
          :items="mapRoles(roles, 'name')"
          :menu-props="{ offsetY: true }"
          label="Roles"
          hide-selected
          deletable-chips
          chips
          outlined
          multiple
          placeholder="Select Roles"
        ></v-select>
        <v-chip class="ml-2" color='red darken-3' dark v-if="errorMsg">
          {{ errorMsg }}
        </v-chip>
      </v-container>
      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="light-blue darken-4" text @click="show = false" v-text="'Cancel'"/>
        <v-btn color="light-blue darken-4" text :loading="loading" @click="assignRoles">Assign</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import LoadingCircleSmall from '../components/LoadingCircleSmall'

export default {
  name: 'AssignRolesDialog',
  components: {
    LoadingCircleSmall
  },
  props: {
    userId: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      roleLoading: false,
      roles: [],
      selectedRoles: [],
      errorMsg: ''
    }
  },
  methods: {
    async getRolesCallback () {
      this.roleLoading = true
      this.roles = []
      this.selectedRoles = []
      this.errorMsg = ''
      
      const token = await this.$auth.getTokenSilently()
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }

      const userRoles = await this.getUserRoles(headers)
      let rawRoles = await this.getRawRoles(headers)

      userRoles.forEach(userRole => {
        rawRoles = rawRoles.filter(rawRole => rawRole.name !== userRole.name)        
      })

      this.roles = rawRoles
      this.roleLoading = false
    },

    async getUserRoles (headers) {
      const { data: { roles }} = await axios.get(`/api/v1/users/${this.userId}/roles`, headers);

      return roles
    },

    async getRawRoles (headers) {
      const { data: { roles }} = await axios.get(`/api/v1/roles`, headers);
      
      return roles
    },

    mapRoles (roles, key) {
      const mappedRoles = roles.map(role => {
        return role[key]
      }) 

      return mappedRoles
    },

    async assignRoles () {
      if (this.selectedRoles.length > 0) {
        this.loading = true
        let addRoles = []

        this.selectedRoles.forEach(selectedRole => {
          const found = this.roles.find(role => role.name === selectedRole)   
          if (found) addRoles.push(found)
        })

        const token = await this.$auth.getTokenSilently()

        const data = await axios.post(`/api/v1/users/${this.userId}/roles`, this.mapRoles(addRoles, 'id'), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.loading = false
        this.show = false
        this.$emit('assign', data)
      } else this.errorMsg = 'There are no selected Roles'
    }
  },
  computed: {
    show: {
      get () {
        if (this.visible) this.getRolesCallback()
        return this.visible
      },
      set (value) {
        if (!value) this.$emit('close')
      }
    }
  }
}
</script>
<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="name"
    class="elevation-1 pt-2"
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mb-4">
        <v-toolbar-title v-text="'Users'"/>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer/>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="orange accent-4" height="4em" dark class="mt-2 mb-2" v-on="on">
              <v-icon class="pr-2" medium v-text="'mdi-plus'"/>
              Create User
            </v-btn> 
          </template>
          <v-card>
            <v-card-title>
              <span class="headline" v-text="`${formTitle}`"/>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row v-if="editedIndex !== -1">
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.name" label="Name"/>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.email" label="Email"/>
                  </v-col>
                </v-row>
                <v-row v-if="editedIndex === -1">
                  <v-col cols="12">
                    <v-text-field v-model="createItem.given_name" label="Given Name"/>
                    {{ inputErrors.givenNameErrorMsg }}
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="createItem.family_name" label="Family Name"/>
                    {{ inputErrors.familyNameErrorMsg }}
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="createItem.email" label="Email"/>
                    {{ inputErrors.emailErrorMsg }}
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="createItem.password" type="password" label="Password"/>
                    {{ inputErrors.passwordErrorMsg }}
                  </v-col>
                    {{ responseError }}
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="light-blue darken-4" text @click="close" v-text="'Cancel'"/>
              <v-btn color="light-blue darken-4" text :loading="loading" @click="editedIndex === -1 ? onSaveCreate() : onSaveEdit()" v-text="'Save'"/>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <AssignRolesDialog :visible="showAssignRolesDialog" :userId="editedItem.user_id" @close="showAssignRolesDialog = false"/>
        <DeleteDialog 
          :visible="showDeleteDialog" 
          :type="'User'"
          :api="`users/${editedItem.id}/delete`" 
          :item="editedItem" 
          @deleted="deleted" 
          @close="showDeleteDialog = false"
        />
      </v-toolbar>
    </template>
    <template v-slot:item.picture="{ item }">
      <v-avatar size="36px">
        <img
          :src="item.picture"
          :alt="item.name"
        >
      </v-avatar>
    </template>
    <template v-slot:item.email_verified="{ item }">
      {{ item.email_verified ? 'Verified': 'Not Verified' }}
    </template>
    <template v-slot:item.last_login="{ item }">
      {{ getLastLogin(item.last_login) }}
    </template>
    <template v-slot:item.action="{ item }">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="light-blue darken-4" icon large dark v-on="on">
            <v-icon large v-text="'mdi-dots-horizontal'"/>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="{ path: `/users/${item.user_id}`, params: { user: item } }" >
            <v-list-item-title v-text="'View Details'"/>
          </v-list-item>
          <v-list-item @click="assignRoles(item)">
            <v-list-item-title v-text="'Assign Roles'"/>
          </v-list-item>
          <v-list-item>
            <v-list-item-title v-text="'Block'"/>
          </v-list-item>
          <v-divider/>
          <v-list-item @click="deleteItem(item)">
            <v-list-item-title v-text="'Delete'"/>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template v-slot:no-data>
      <h3 v-text="'No data to show'"/>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import DeleteDialog from '../components/DeleteDialog'
import AssignRolesDialog from '../components/AssignRolesDialog'

export default {
  name: 'UserTable',
  props: ['propUsers'],
  components: {
    DeleteDialog,
    AssignRolesDialog
  },
  data () {
    return {
      type: '',
      dialog: false,
      showDeleteDialog: false,
      showAssignRolesDialog: false,
      loading: null,
      inputErrors: {
        givenNameErrorMsg: '',
        familyNameErrorMsg: '',
        emailErrorMsg: '',
        passwordErrorMsg: ''
      },
      responseError: '',
      headers: [
        { text: 'Avatar', align: 'left', sortable: false, value: 'picture' },
        { text: 'Name', sortable: true, value: 'name' },
        { text: 'Email', sortable: true, value: 'email' },
        { text: 'Email Status', sortable: true, value: 'email_verified' },
        { text: 'Last Login', sortable: true, value: 'last_login' },
        { text: 'Actions', sortable: false, value: 'action' },
      ],
      users: this.propUsers,
      editedIndex: -1,
      editedItem: {
        name: '',
        email: '',
        email_verified: '',
        last_login: '',
      },
      defaultItem: {
        name: '',
        email: '',
        email_verified: '',
        last_login: ''
      },
      createItem: {
        given_name: '',
        family_name: '',
        email: '',
        password: ''
      }
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    getLastLogin (date) {
      return moment(date).fromNow()
    },
    
    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.showDeleteDialog = true
    },

    close () {
      Object.keys(this.inputErrors).forEach(key => this.inputErrors[key] = '');
      Object.keys(this.createItem).forEach(key =>  this.createItem[key] = '');
      this.responseError = ''
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    deleted ({ type }) {
      if (type === 'User') this.users.splice(this.users.indexOf(this.editedIndex), 1)
      this.showDeleteDialog = false
    },

    onSaveEdit () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
      } else {
        this.users.push(this.editedItem)
      }
      this.close()
    },

    async onSaveCreate () {
      let checker = false
      if (this.createItem.given_name.trim() === '') {
        this.inputErrors.givenNameErrorMsg = '"Given Name" is not allowed to be empty'
        checker = true
      }
      if (this.createItem.family_name.trim() === '') {
        this.inputErrors.familyNameErrorMsg = '"Family Name" is not allowed to be empty'
        checker = true
      }
      if (this.createItem.password.trim() === '') {
        this.inputErrors.passwordErrorMsg = '"Password" is not allowed to be empty'
        checker = true
      } 
      if (this.createItem.email.trim() === '') {
        this.inputErrors.emailErrorMsg = '"Email" is not allowed to be empty'
        checker = true
      } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!this.createItem.email.match(regEx)) {
          this.inputErrors.emailErrorMsg = '"Email" must be a valid email address'
          checker = true
        }
      }

      // if there are no errors, post to API
      if (!checker) {
        Object.keys(this.inputErrors).forEach(key => this.inputErrors[key] = '');
        await this.postToApi(this.createItem, 'add')
      }
    },

    async postToApi (item, action) {
      this.loading = true
      
      const url = action === 'add' ? `/api/v1/users` :`/api/v1/users/${item.id}/${action}`
      const token = await this.$auth.getTokenSilently()
      const { data: { user, error } } = await axios.post(url, item, {
          headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (error) this.responseError = error
      else if (user) {
        action === 'add' ? this.users.push(user) : Object.assign(this.users[this.editedIndex], user)
        this.close()
      }

      this.loading = false
    },

    assignRoles (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.showAssignRolesDialog = true
    }
  },
}
</script>
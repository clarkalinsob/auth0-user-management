<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Users</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New User</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.email_verified" label="Email Verified"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.last_login" label="Last Login"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        edit
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <h3>No data to show</h3>
    </template>
  </v-data-table>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['propUsers'],
    data () {
        return {
            dialog: false,
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
      },
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
        const index = this.users.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
        } else {
          this.users.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
<template>
  <v-data-table
    :headers="headers"
    :items="roles"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Roles</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Role</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.name" label="Name*" required></v-text-field>
                    {{ errorMessage }}
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text :loading="loading" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Delete Role</span>
            </v-card-title>

            <v-card-text v-model="editedItem.name">
              <v-container>
                Are you sure you want to delete role "{{ editedItem.name }}" ?
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text :loading="loading" @click="deleteRole">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>



      </v-toolbar>
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
  import axios from 'axios'

  export default {
    props: ['propRoles'],
    data () {
      return {
        loading: null,
        errorMessage: '',
        dialog: false,
        deleteDialog: false,
        headers: [
          { text: 'Name', align: 'left', sortable: true, value: 'name' },
          { text: 'Description', sortable: true, value: 'description' },
          { text: 'Actions', sortable: false, value: 'action' },
        ],
        roles: this.propRoles,
        editedIndex: -1,
        editedItem: {
          name: '',
          description: '',
        },
        defaultItem: {
          name: '',
          description: '',
        },
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Role' : 'Edit Role'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      deleteDialog (val) {
        val || this.close()
      }
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.roles.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.roles.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.deleteDialog = true
      },

      close () {
        this.errorMessage = ''
        this.dialog = false
        this.deleteDialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async deleteRole () {
        this.loading = true
        const params = this.editedItem.id

        const token = await this.$auth.getTokenSilently()
        const { data } = await axios.post(`/api/v1/roles/${params}/delete`, this.editedItem, {
            headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if (data) {
          this.roles.splice(this.editedIndex, 1)
          this.loading = false
        }
        
        this.close()
      },

      async save () {
        if (this.editedIndex > -1) {
          if (this.editedItem.name.trim() === '') {
            this.errorMessage = '"Name" is not allowed to be empty'
          } else {
            await this.postToApi(this.editedItem)
          }
        } else {
          if (this.editedItem.name.trim() === '') {
            this.errorMessage = '"Name" is not allowed to be empty'
          } else {
            await this.postToApi(this.editedItem)
          }
        }
      },

      async postToApi (item) {
        this.loading = true

        const token = await this.$auth.getTokenSilently()
        const { data } = await axios.post("/api/v1/roles", item, {
            headers: {
            Authorization: `Bearer ${token}`
          },
        });

        data ? this.loading = false : this.loading = true

        if (data.role) {
          this.roles.push(data.role)
          this.close()
        } else if (data.error) {
          this.errorMessage = data.error
        }
      }
    },
  }
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
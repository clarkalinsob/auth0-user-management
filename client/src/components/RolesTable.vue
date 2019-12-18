<template>
  <v-data-table
    :headers="headers"
    :items="roles"
    sort-by="name"
    class="elevation-1 pt-2"
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="mb-4">
        <v-toolbar-title v-text="'Roles'"/>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="orange accent-4" height="4em" dark class="mt-4 mb-2" v-on="on">
              <v-icon class="pr-2" medium v-text="'mdi-plus'"/>
              Create Role
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline" v-text="`${formTitle}`"/>
            </v-card-title>
            <v-divider/>
            <v-card-text>
              <v-row no-gutters class="mt-7">
                <v-col no-gutters cols="12">
                  <v-text-field v-model="editedItem.name" outlined label="Name" placeholder="Enter name"/>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.description" outlined label="Description" placeholder="Enter description"/>  
                </v-col>
                <v-col cols="12" class="mb-1" v-if="nameErrorMsg">
                  <v-chip color='red darken-3' dark>
                    {{ nameErrorMsg }}
                  </v-chip>
                </v-col>
                <v-col cols="12" v-if="descriptionErrorMsg">
                  <v-chip color='red darken-3' dark>
                    {{ descriptionErrorMsg }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="light-blue darken-4" text @click="close" v-text="'Cancel'"/>
              <v-btn color="light-blue darken-4" text :loading="loading" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <DeleteDialog 
          :visible="showDialog" 
          :type="'Role'"
          :api="`roles/${editedItem.id}/delete`" 
          :item="editedItem" 
          @deleted="deleted" 
          @close="showDialog = false"
        />
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="light-blue darken-4" icon large dark v-on="on">
            <v-icon large v-text="'mdi-dots-horizontal'"/>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="editItem(item)">
            <v-list-item-title v-text="'Edit'"/>
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
import DeleteDialog from '../components/DeleteDialog'

export default {
  name: "RolesTable",
  components: {
    DeleteDialog
  },
  props: ['propRoles'],
  data () {
    return {
      showDialog: false,
      loading: null,
      nameErrorMsg: '',
      descriptionErrorMsg: '',
      dialog: false,
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
      return this.editedIndex === -1 ? 'Create Role' : 'Edit Role'
    },
  },
  watch: {
    dialog (val) {
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
      this.showDialog = true
    },

    close () {
      this.nameErrorMsg = ''
      this.descriptionErrorMsg = ''
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    deleted ({ type }) {
      if (type === 'Role') this.roles.splice(this.roles.indexOf(this.editedIndex), 1)
      this.editedIndex = -1
      this.editedItem = {}
      this.showDialog = false
    },

    async save () {
      (this.editedIndex > -1) ? this.checkInputs('edit') : this.checkInputs('add')
    },

    async checkInputs (action) {
      this.nameErrorMsg = ''
      this.descriptionErrorMsg = ''

      if (this.editedItem.name.trim() === '') {
        this.nameErrorMsg = '"Name" is not allowed to be empty'
      } 
      if (this.editedItem.description.trim() === '') {
        this.descriptionErrorMsg = '"Description" is not allowed to be empty'
      }
      if (!this.nameErrorMsg && !this.descriptionErrorMsg) {
        await this.postToApi(this.editedItem, action)  
      }
    },

    async postToApi (item, action) {
      this.loading = true
      
      const url = action === 'add' ? `${process.env.VUE_APP_URL}/api/v1/roles` :`${process.env.VUE_APP_URL}/api/v1/roles/${item.id}/${action}`
      const token = await this.$auth.getTokenSilently()
      const { data: { role, error } } = await axios.post(url, item, {
          headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (error) this.nameErrorMsg = error
      else if (role) {
        action === 'add' ? this.roles.push(role) : Object.assign(this.roles[this.editedIndex], role)
        this.close()
      }

      this.loading = false
    }
  }
}
</script>
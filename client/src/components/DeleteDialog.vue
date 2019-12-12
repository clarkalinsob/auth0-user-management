<template>
  <v-dialog v-model="show" max-width="30em">
    <v-card>
    <v-card-title>
      <span class="headline" v-text="`Delete ${type}?`"/>
    </v-card-title>
    <v-divider/>
    <v-card-text class="mt-3 mb-3">
      Are you sure you want to delete "{{ item ? item.name : '' }}" ?
    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-spacer/>
      <v-btn color="light-blue darken-4" text @click="show = false" v-text="'Cancel'"/>
      <v-btn color="light-blue darken-4" text :loading="loading" @click="deleteItem">Delete</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DeleteDialog',
  props: {
    type: String,
    api: String,
    user: Object,
    item: Object,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async deleteItem () {
      this.loading = true

      const token = await this.$auth.getTokenSilently()
      const data = await axios.post(`${process.env.VUE_APP_URL}/api/v1/${this.api}`, this.item, {
          headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (data.status === 200) this.loading = false

      this.show = false
      this.$emit('deleted', { type: this.type })
    },
  },
  computed: {
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) this.$emit('close')
      }
    }
  }
}
</script>
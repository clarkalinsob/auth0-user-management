<template>
  <v-navigation-drawer
    app
    dark
    expand-on-hover
    mobile-break-point
  >
    <template v-slot:prepend>
      <v-list>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="$auth.user.picture">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ $auth.user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ $auth.user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>  
      </v-list>
    </template>
    <v-divider/>
    <v-list nav dense>
      <v-list-item to="/">
        <v-list-item-icon>
          <v-icon>mdi-folder</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item to="/users">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Users</v-list-item-title>
      </v-list-item>
      <v-list-item to="/roles">
        <v-list-item-icon>
          <v-icon>mdi-account-tie</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Roles</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
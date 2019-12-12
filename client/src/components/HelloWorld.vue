<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">Welcome!</h1>
        <p class="subheading font-weight-regular">
          This page is temporarily unavailable. <br>
          Please go to the official site <a href="https://lmcenter.net" target="_blank">here</a> instead.  
        </p>
      </v-flex>
      <v-flex mb-5 xs12>
      <h2 class="headline font-weight-bold mb-3">What's next?</h2>
        <p class="subheading font-weight-regular">
          A new feature to improve User Management is currently in development.<br> 
          Will be available soon!
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>

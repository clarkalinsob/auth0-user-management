import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Import the plugin here
import { Auth0Plugin } from './auth'

import vuetify from './plugins/vuetify'

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENT_ID,
  audience: process.env.AUDIENCE,
  onRedirectCallback: appState => {
    router.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname)
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

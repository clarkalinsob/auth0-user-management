module.exports = {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://localhost:3001"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
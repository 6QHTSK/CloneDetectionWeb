<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
// process.env.DEV && require("./mock.js")
export default defineComponent({
  name: 'App'
})
</script>

<template>
  <div class="flex column items-center">
    <q-icon :name="icon" style="font-size: 140px"></q-icon>
    <p class="text-h6">{{title}}</p>
    <p class="text-caption" style="text-align: center">{{ caption }}</p>
  </div>
</template>

<script>
export default {
  name: 'Index-item',
  props: ['icon','title','caption'],
  setup () {
    return {}
  }
}
</script>

<template>
  <div v-if="$store.state.widgets.length" id="app">
    <div v-for="(widget, index) in widgets" :key="index">
      <component :is="widget.default" v-if="$store.state.widgets[index].visible" />
    </div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  get widgets() {
    const widgets = require.context('@/widgets/', true, /.widget.vue$/)
    return widgets.keys().map(relativePath => {
      return {
        ...widgets(relativePath),
        path: path.resolve(`src/widgets/${relativePath}`),
      }
    })
  }

  mounted() {
    this.$store.dispatch('getCurrentLocation')
    this.$store.commit('resetWidgets')
    this.widgets.forEach(module => {
      this.$store.dispatch('addWidget', {
        path: module.path,
        visible: true,
      })
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 60px;
}
</style>

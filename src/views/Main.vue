<template>
  <main v-if="$store.state.widgets.length" :color="primaryColor">
    <div v-for="(widget, index) in widgets" :key="index">
      <component :is="widget.default" v-if="$store.state.widgets[index].visible" />
    </div>
  </main>
</template>

<script lang="ts">
import path from 'path'
import { mapState } from 'vuex'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  computed: {
    ...mapState(['primaryColor']),
  },
})
export default class Widgets extends Vue {
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
main {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>

<template>
  <div class="settings">
    <h1>Settings</h1>

    <section v-if="color">
      <label for="color">Primary color</label>
      <input id="color" v-model="color" type="color" />
    </section>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  computed: {
    ...mapState(['primaryColor']),
  },
  watch: {
    color(value: string) {
      this.$store.commit('setPrimaryColor', value)
    },
  },
})
export default class Settings extends Vue {
  primaryColor!: string
  color = ''

  mounted() {
    this.color = this.primaryColor
  }
}
</script>

<style lang="scss" scoped></style>

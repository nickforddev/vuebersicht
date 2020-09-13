<template>
  <div class="settings">
    <h1>Settings</h1>

    <section v-if="color">
      <label for="color">Primary color</label>
      <input id="color" v-model="color" type="color" />
    </section>

    <section>
      <button type="button" @click="save">Save</button>
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

  save() {
    window.close()
  }
}
</script>

<style lang="scss" scoped>
section {
  margin-bottom: 20px;

  label {
    padding-right: 10px;
  }
}
</style>

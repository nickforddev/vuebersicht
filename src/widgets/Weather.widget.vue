<template>
  <div class="weather-container">
    <div v-if="loaded && place.latitude && place.longitude" class="weather">
      <VueWeatherWidget
        :api-key="apiKey"
        :latitude="place.latitude.toString()"
        :longitude="place.longitude.toString()"
        :units="units"
        :language="language"
        class="weather-widget"
        text-color="white"
        bar-color="white"
      >
        <template v-slot:title>
          {{ `${place.city}, ${place.state}` }}
        </template>
      </VueWeatherWidget>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import VueWeatherWidget from 'vue-weather-widget/src/VueWeatherWidget.vue'
import { sleep } from '@/utils'

@Component({
  components: { VueWeatherWidget },
  computed: {
    ...mapGetters(['language', 'isUS']),
  },
})
export default class Weather extends Vue {
  apiKey = process.env.DARKSKY_API_KEY
  loaded = false
  isUS!: boolean
  language!: string

  get place() {
    return this.$store.state.place
  }

  get units() {
    return this.isUS ? 'us' : 'si'
  }

  async mounted() {
    this.tick()
  }

  async tick() {
    this.loaded = false
    await this.$nextTick()
    this.loaded = true
    await sleep(3_600_000) // 1 hour
    this.tick()
  }
}
</script>

<style lang="scss" scoped>
.weather-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.weather {
  position: absolute;
  bottom: 34px;
  left: 300px;
  width: 620px;
}

.weather-widget {
  transform: scale(1);
}

::v-deep {
  .weather_container {
    font-weight: 400;
  }

  .vww__header {
    margin: 0 14px 0 22px;
    padding-left: 0;
    font-size: 1.3em;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-align: left;
    border-bottom: 1px solid white;
  }

  .vww__daily .vww__day > span {
    margin-bottom: 10px;
  }

  .vww__currently {
    .vww__temp {
      font-weight: 200;

      .vww__dir {
        top: 10px;
      }

      .vww__wind {
        font-size: 12px;
        line-height: 2em;
      }
    }
    .vww__summary {
      font-weight: 400;
      width: 100%;
      max-height: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .vww__alert {
    top: 0;
    right: 12px;
    left: 0;
    width: auto;
    text-align: right;

    a {
      position: relative;
      top: -4px;
      text-decoration: none;
      color: turquoise;
    }
  }
}
</style>

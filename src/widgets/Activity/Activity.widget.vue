<template>
  <div class="activity">
    <div class="chart-container">
      <CPU />
    </div>
    <div class="chart-container">
      <Disk />
    </div>
    <div class="chart-container">
      <Network />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CPU from './CPU.vue'
import Disk from './Disk.vue'
import Network from './Network.vue'

@Component({
  components: {
    CPU,
    Disk,
    Network,
  },
})
export default class Activity extends Vue {}
</script>

<style lang="scss" scoped>
.activity {
  position: fixed;
  top: 20px;
  left: 30px;
  width: 100%;
  display: flex;

  .chart-container {
    display: flex;
    align-items: center;
    margin-right: 10px;

    ::v-deep {
      .chart {
        width: 60px !important;
      }

      .bar-chart {
        width: 80px !important;
        height: 30px;
        margin-top: 10px;
        margin-bottom: -10px;
      }

      .meta {
        color: #fff;
        font-size: 0.6em;
        padding-left: 2px;
        padding-top: 8px;
        line-height: 2em;
      }
      canvas {
        width: 100%;
      }
    }
  }
}
</style>

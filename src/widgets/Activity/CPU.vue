<template>
  <div>
    <Doughnut class="chart" :chart-data="chartData" />
    <div class="meta">{{ value }}%</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { sleep, run } from '@/utils'
import { getColor } from './types'
import Doughnut from './Doughnut.vue'

@Component({
  components: { Doughnut },
})
export default class Activity extends Vue {
  value = 0

  async tick(): Promise<void> {
    this.value = Number(await run(`ps -A -o %cpu | awk '{s+=$1} END {printf("%.1f",s/8);}'`))
    await sleep(2000)
    this.tick()
  }

  get chartData(): object {
    const free = 100 - this.value
    const color = getColor(this.value)

    return {
      datasets: [
        {
          label: 'Activity',
          borderColor: 'transparent',
          backgroundColor: [color, 'rgba(255, 255, 255, 0.1)'],
          data: [this.value, free],
        },
      ],
    }
  }

  mounted(): void {
    this.tick()
  }
}
</script>

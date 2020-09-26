<template>
  <div>
    <Doughnut class="chart" :chart-data="chartData" />
    <div v-if="info" class="meta">{{ info }}</div>
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
export default class Disk extends Vue {
  value = ''
  info = ''

  async tick(): Promise<void> {
    this.value = (await run(
      `df -H | grep '/dev/' | while read -r line; do fs=$(echo $line | awk '{print $1}'); name=$(diskutil info $fs | grep 'Volume Name' | awk '{print substr($0, index($0,$3))}'); echo $(echo $line | awk '{print $2, $3, $4, $5}') $(echo $name | awk '{print substr($0, index($0,$1))}'); done`,
    )) as string
    await sleep(1000000)
    this.tick()
  }

  mounted(): void {
    this.tick()
  }

  parseOutput(output: string): number[] {
    const disks = output.split('\n')
    const disk = disks[0]
    const args = disk.split(' ')
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [total, _, free] = args
    const freeNum = parseInt(free, 10)
    const totalNum = parseInt(total, 10)
    return [freeNum, totalNum]
  }

  get chartData(): object {
    const [free, total] = this.parseOutput(this.value as string)
    const used = total - free
    const color = getColor((used / total) * 100)
    if (this.value) {
      this.info = `${free}GB/${total}GB`
    }
    return {
      datasets: [
        {
          label: 'Activity',
          borderColor: 'transparent',
          backgroundColor: [color, 'rgba(255, 255, 255, 0.1)'],
          data: [used, free],
        },
      ],
    }
  }
}
</script>

<style lang="scss" scoped></style>

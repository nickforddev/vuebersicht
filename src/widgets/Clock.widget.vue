<template>
  <div class="clock">
    <div class="time">
      {{ time }}
    </div>
    <div class="period">
      {{ period }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { sleep } from '@/utils'

@Component({
  computed: {
    ...mapGetters(['isUS']),
  },
})
export default class Clock extends Vue {
  time: string | null = null
  period: string | null = null
  isUS!: boolean

  getTime(): string {
    const isUS = this.isUS
    const now = new Date()
    const hours24 = now.getHours()
    const hours12 = hours24 > 12 ? hours24 - 12 : hours24
    const hours = isUS ? hours12 : hours24
    const minutes = now
      .getMinutes()
      .toString()
      .padStart(2, '0')
    const seconds = now
      .getSeconds()
      .toString()
      .padStart(2, '0')
    const period = hours24 >= 12 ? 'pm' : 'am'
    this.period = period
    return `${hours}:${minutes}:${seconds}`
  }

  async tick(): Promise<void> {
    this.time = this.getTime()
    // const [time, period] = (await run('date +"%l:%M:%S/%p"') as string).split('/')
    await sleep(1000)
    this.tick()
  }

  mounted(): void {
    this.tick()
  }
}
</script>

<style scoped lang="scss">
.clock {
  position: fixed;
  bottom: 20px;
  right: 30px;
  color: white;
  vertical-align: text-bottom;
  font-family: 'Helvetica Neue';
  font-weight: 100;

  .time {
    display: inline-block;
    font-size: 5em;
  }

  .period {
    display: inline-block;
    padding-left: 6px;
    text-transform: uppercase;
    font-size: 1.6em;
    font-weight: 200;
  }
}
</style>

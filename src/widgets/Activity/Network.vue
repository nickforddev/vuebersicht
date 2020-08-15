<template>
  <div class="network">
    <div class="chart-in">
      <Bar class="bar-chart" :chart-data="inChartData" :options="inOptions" />
    </div>
    <div class="chart-out">
      <Bar class="bar-chart" :chart-data="outChartData" :options="outOptions" />
    </div>
    <div class="meta">
      <span class="in">{{ inText }}{{ units }}↓</span>
      <span class="out">{{ outText }}{{ units }}↑</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// eslint-disable-next-line import/no-webpack-loader-syntax
import networkScript from 'raw-loader!./scripts/network.sh'
import { run, sleep } from '@/utils'
import Bar from './Bar.vue'

const dataPointCount = 10

@Component({
  components: { Bar },
})
export default class Network extends Vue {
  value = ''
  valuesIn: number[] = new Array(dataPointCount).fill(0)
  valuesOut: number[] = new Array(dataPointCount).fill(0)

  inText = ''
  outText = ''

  units = ''

  mounted(): void {
    this.tick()
  }

  async tick(): Promise<void> {
    try {
      this.value = (await run(networkScript)) as string
      this.parseOutput()
    } catch (error) {
      console.warn(error) // eslint-disable-line
    } finally {
      await sleep(5000)
      this.tick()
    }
  }

  parseOutput() {
    const data = this.value.split(' ')
    const dataIn = parseFloat(data[0])
    const dataOut = parseFloat(data[1])

    // Push the in value on the stack
    if (this.valuesIn.length >= dataPointCount) {
      this.valuesIn.shift()
    }
    this.valuesIn.push(dataIn / 10000)
    this.inText = this.valuesIn.join(',')

    // Push the out value on the stack
    if (this.valuesOut.length >= dataPointCount) {
      this.valuesOut.shift()
    }
    this.valuesOut.push(dataOut / 10000)
    this.inText = this.valuesOut.join(',')

    // Convert to kb instead of bytes
    let inData = dataIn / 1000
    let outData = dataOut / 1000
    let units = 'kb'

    if (inData > 1000 || outData > 1000) {
      inData /= 1000
      outData /= 1000
      units = 'mb'
    }
    inData = Math.round(inData * 10) / 10
    outData = Math.round(outData * 10) / 10

    this.inText = inData.toString()
    this.outText = outData.toString()
    this.units = units
  }

  get inChartData() {
    return {
      labels: new Array(dataPointCount).fill(''),
      datasets: [
        {
          label: 'Network',
          backgroundColor: 'turquoise',
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 2,
          minBarLength: 2,
          data: this.valuesIn,
        },
      ],
    }
  }

  get inOptions() {
    return {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: Math.max.apply(this, this.valuesIn),
            },
            gridLines: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    }
  }

  get outChartData() {
    return {
      labels: new Array(dataPointCount).fill(''),
      datasets: [
        {
          label: 'Out',
          backgroundColor: '#fb84fb',
          barPercentage: 0.8,
          barThickness: 2,
          maxBarThickness: 6,
          minBarLength: 2,
          data: this.valuesOut,
        },
      ],
    }
  }

  get outOptions() {
    return {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: Math.max.apply(this, this.valuesOut),
            },
            gridLines: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    }
  }
}
</script>

<style lang="scss" scoped>
.in {
  color: turquoise;
}
.out {
  color: #fb84fb;
}
</style>

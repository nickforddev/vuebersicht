<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Bar, mixins } from 'vue-chartjs'
import { ChartData, ChartOptions } from 'chart.js'

const { reactiveProp } = mixins

@Component({
  mixins: [reactiveProp],
})
export default class BarChart extends Mixins(Bar) {
  @Prop({ type: Object, default: null })
  chartData!: ChartData

  @Prop({ type: Object, default: null })
  options?: ChartOptions

  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style lang="scss" scoped></style>

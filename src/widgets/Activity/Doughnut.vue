<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Doughnut, mixins } from 'vue-chartjs'
import { ChartData, ChartOptions } from 'chart.js'

const { reactiveProp } = mixins

@Component({
  mixins: [reactiveProp],
})
export default class DoughnutChart extends Mixins(Doughnut) {
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

<template>
  <div>
    <div id="discountDataId" class="pie-wrap"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  props: ['discountCharts'],
  data () {
    return {
      chartPie: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawPieChart()
    })
  },
  watch: {
    discountCharts () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      const that = this
      this.chartPie = echarts.init(document.getElementById('discountDataId'), 'macarons')

      this.chartPie.setOption({
        title: {
          text: '近七天优惠汇总'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '1.5%',
          containLabel: true
        },
        legend: {},
        dataset: {
          dimensions: this.discountCharts.dimensions,
          source: this.discountCharts.source
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: this.discountCharts.series
      })
    }
  }
}
</script>
<style scope>
.pie-wrap {
  width: 100%;
  height: 300px;
}
</style>

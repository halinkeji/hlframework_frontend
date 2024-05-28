<template>
  <div id="chartDom" class="pie-sum"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  props: ['sevenSummary'],
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
    sevenSummary () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      this.chartPie = echarts.init(document.getElementById('chartDom'), 'macarons')
      this.chartPie.setOption({
        title: {
          text: '近一个月平台财务汇总'
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

        legend: {
          data: this.sevenSummary.legend
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '1.5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.sevenSummary.time_data
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.sevenSummary.series
      })
    }
  }
}
</script>
<style scope>
.pie-sum {
  width: 100%;
  height: 500px;
}
</style>

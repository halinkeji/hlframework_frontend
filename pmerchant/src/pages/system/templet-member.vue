<template>
  <div id="memberChart" class="member-line"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/shine'
export default {
  props: ['memberChartData'],
  data () {
    return {
      memberChart: null
    }
  },
  mounted () {},
  computed: {},
  watch: {
    memberChartData () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      this.memberChart = echarts.init(document.getElementById('memberChart'), 'macarons')

      this.memberChart.setOption({
        title: {
          textStyle: {
            fontSize: 13
          },
          text: '会员积分排行(前三)',
          x: 'left'
        },

        grid: {
          left: '3%',
          right: '3.5%',
          bottom: '1.5%',
          containLabel: true
        },

        xAxis: {
          data: this.memberChartData.xAxisData ? this.memberChartData.xAxisData : [],
          type: 'category',
          boundaryGap: false,
          nameLocation: 'middle',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1976D2'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1976D2'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: this.memberChartData && this.memberChartData.series ? this.memberChartData.series : []
      })
    }
  }
}
</script>
<style scope>
.member-line {
  width: 100%;
  height: 240px;
}
</style>

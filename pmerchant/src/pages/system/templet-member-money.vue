<template>
  <div id="memberMoneyChartDataId" class="member-line"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/shine'
export default {
  props: ['memberMoneyChartData'],
  data () {
    return {
      memberMoneyChartDataId: null
    }
  },
  mounted () {},
  computed: {},
  watch: {
    memberMoneyChartData () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      this.memberMoneyChartDataId = echarts.init(document.getElementById('memberMoneyChartDataId'), 'macarons')

      this.memberMoneyChartDataId.setOption({
        title: {
          textStyle: {
            fontSize: 13
          },
          text: '会员储值排行(前三)',
          x: 'left'
        },

        grid: {
          left: '3%',
          right: '3.5%',
          bottom: '1.5%',
          containLabel: true
        },

        xAxis: {
          data: this.memberMoneyChartData.xAxisData ? this.memberMoneyChartData.xAxisData : [],
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
        series: this.memberMoneyChartData && this.memberMoneyChartData.series ? this.memberMoneyChartData.series : []
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

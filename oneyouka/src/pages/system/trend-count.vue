<template>
  <div>
    <div id="chartDom" class="pie-wrap"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  props: ['oilTrend'],
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
    oilTrend () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      this.chartPie = echarts.init(
        document.getElementById('chartDom'),
        'macarons'
      )
      this.chartPie.setOption({
        title: {
          text: '每日油价'
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
          data: this.oilTrend.legend
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.oilTrend.time_data
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.oilTrend.series
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

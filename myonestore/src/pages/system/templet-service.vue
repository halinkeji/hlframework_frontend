<template>
  <div id="serviceCount" class="pie-service" ></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  props: ['servicePayCount'],
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
    servicePayCount () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      this.chartPie = echarts.init(
        document.getElementById('serviceCount'),
        'macarons'
      )
      this.chartPie.setOption({

        title: {
          text: '消费汇总'
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
          data: this.servicePayCount.legend
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '1.5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.servicePayCount.time_data
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.servicePayCount.series
      })
    }
  }
}
</script>
<style scope>
.pie-service {
  width: 100%;
  height: 300px;
}
</style>

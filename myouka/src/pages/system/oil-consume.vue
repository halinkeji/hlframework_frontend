<template>
  <div>
    <div id="oilConsumeId" class="pie-wrap"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/infographic'
export default {
  props: ['oilConsumsData'],
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
    oilConsumsData () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      const that = this
      this.chartPie = echarts.init(
        document.getElementById('oilConsumeId'),
        'infographic'
      )
      this.chartPie.setOption({
        title: {
          text: '油品销售统计'
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
          data: that.oilConsumsData.legend
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
            data: that.oilConsumsData.time_data
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: that.oilConsumsData.series
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

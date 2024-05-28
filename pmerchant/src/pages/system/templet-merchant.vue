<template>
  <div id="chartMerchantPie" class="pie-wrap"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/shine'
export default {
  props: ['merchantSummaryPie'],
  data () {
    return {
      chartPie: null
    }
  },
  mounted () {},
  computed: {
    memberCountColumn () {
      if (this.merchantSummaryPie) {
        return this.merchantSummaryPie.map(item => {
          return item.name
        })
      }
      return []
    }
  },
  watch: {
    memberCountColumn () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      this.chartPie = echarts.init(
        document.getElementById('chartMerchantPie'),
        'macarons'
      )
      this.chartPie.setOption({
        title: {
          textStyle: {
            fontSize: 13
          },
          text: '商家分析',
          x: 'left'

        },
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.memberCountColumn
        },
        yAxis: {
          type: 'value'
        },

        series: [
          {
            barWidth: 80,
            name: '商家状态',
            type: 'bar',
            data: this.merchantSummaryPie,
            animationEasing: 'cubicInOut',
            animationDuration: 2400
          }
        ]
      })
    }
  }
}
</script>
<style scope>
.pie-wrap {
  width: 100%;
  height: 240px;
}
</style>

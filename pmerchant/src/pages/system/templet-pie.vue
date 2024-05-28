<template>
  <div id="chartPie" class="pie-wrap"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/shine'
export default {
  props: ['memberSummaryPie'],
  data () {
    return {
      chartPie: null
    }
  },
  mounted () {},
  computed: {
    memberCountColumn () {
      if (this.memberSummaryPie) {
        return this.memberSummaryPie.map((item) => {
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
      this.chartPie = echarts.init(document.getElementById('chartPie'), 'macarons')

      this.chartPie.setOption({
        title: {
          textStyle: {
            fontSize: 13
          },
          text: '会员分析',
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
            name: '访问来源',
            type: 'bar',
            data: this.memberSummaryPie,
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
  height: 300px;
}
</style>

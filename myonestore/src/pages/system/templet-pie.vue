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
        return this.memberSummaryPie.map(item => {
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
      const mytextStyle = {
        color: '#333',
        fontSize: 18
      }
      const mylabel = {
        show: true,
        position: 'right',
        offset: [30, 40],
        formatter: '{b} : {c} ({d}%)',
        textStyle: mytextStyle
      }
      this.chartPie = echarts.init(
        document.getElementById('chartPie'),
        'macarons'
      )
      this.chartPie.setOption({
        title: {
          text: '会员统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: this.memberCountColumn,
          left: 'center',
          top: 'bottom',
          orient: 'horizontal'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            data: this.memberSummaryPie,
            animationEasing: 'cubicInOut',
            animationDuration: 2400,
            label: {
              emphasis: mylabel
            }
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

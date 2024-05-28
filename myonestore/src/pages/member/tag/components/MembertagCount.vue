<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs q-px-xl">
      <div id="chartPie" class="pie-member-tag"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'MembertagCount',
  components: {},
  data () {
    return {
      labelData: [],
      data: []
    }
  },
  created () {
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      this.$store.dispatch('membertag/getMembertagCount').then((res) => {
        if (res.code == 200 && res.data) {
          this.myEcharts(res.data)
        }
      })
    },

    myEcharts (labelData) {
      this.chartPie = echarts.init(document.getElementById('chartPie'), 'macarons')
      const option = {
        title: {
          text: '会员标签使用统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: labelData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.chartPie.setOption(option)
    }
  }
}
</script>
<style scope>
.pie-member-tag {
  width: 80%;
  height: 600px;
}
</style>

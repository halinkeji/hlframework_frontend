<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <shift-count @getPeriod="init" />
    </div>
    <div class="col-shrink q-px-xs bg-white full-height row justify-center">
      <div class="col-12">
        <q-table
          bordered
          :title="staffData.title"
          :data="staffData.dataList"
          :columns="staffData.tabelColumns"
          row-key="name"
          no-data-label="空"
          flat
          title-class="text-subtitle2 text-weight-bold"
          hide-bottom
          separator="cell"
          :pagination="{
            rowsPerPage: 0,
          }"
        />
      </div>
      <div class="col-10">
        <div id="staffCountCharts" class="pie-service"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import ShiftCount from '../../count.vue'
export default {
  name: 'StaffCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      staffData: {},

      startTime: '',
      endTime: ''
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    init (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.$nextTick(() => {
        this.getSummaryList()
      })
    },

    // 获取汇总数据
    getSummaryList () {
      const obj = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getStaffCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.staffData = res.data ? res.data : {}
            this.showChart(res.data)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    getXAxisData (data) {
      const xAxisData = []
      data.forEach(item => {
        if (item.field != 'pru_name') {
          xAxisData.push(item.label)
        }
      })

      return xAxisData
    },
    getLegendAndSeriesData (data) {
      const legend = []
      const series = []
      data.forEach(item => {
        if (item.pru_name != '总计') {
          legend.push(item.pru_name)
          series.push({
            name: item.pru_name,
            type: 'line',
            stack: 'Total',
            data: Object.values(item)
          })
        }
      })

      return {
        series,
        legend
      }
    },
    showChart (value) {
      const that = this
      this.chartPie = echarts.init(document.getElementById('staffCountCharts'), 'macarons')

      this.chartPie.setOption({
        title: {
          text: '绩效统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: that.getLegendAndSeriesData(value.dataList).legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.getXAxisData(value.tabelColumns)
        },
        yAxis: {
          type: 'value'
        },
        series: that.getLegendAndSeriesData(value.dataList).series

      })
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0.0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
<style scope>
.pie-service {
  width: 100%;
  height: 400px;
}
</style>

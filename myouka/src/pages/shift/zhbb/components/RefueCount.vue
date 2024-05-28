<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <shift-count @getPeriod="init" />
    </div>
    <div class="col-shrink q-pa-sm full-height bg-white">
      <div class="row full-width" v-if="consumeData && consumeData.title">
        <q-table
          bordered
          :title="consumeData.title"
          :data="consumeData.dataList"
          :columns="consumeData.tabelColumns"
          row-key="name"
          no-data-label="空"
          flat
          title-class="text-subtitle2 text-weight-bold"
          hide-bottom
          separator="cell"
          class="full-width"
          :pagination="{
            rowsPerPage: 0,
          }"
        />
      </div>

      <div class="row full-width" v-if="discountData && discountData.title">
        <q-table
          bordered
          :title="discountData.title"
          :data="discountData.dataList"
          :columns="discountData.tabelColumns"
          row-key="name"
          no-data-label="空"
          flat
          title-class="text-subtitle2 text-weight-bold "
          hide-bottom
          separator="cell"
          class="full-width"
          :pagination="{
            rowsPerPage: 0,
          }"
        />
      </div>

      <div class="row q-mt-lg">
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
  name: 'RefueCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      consumeData: {},
      discountData: {},
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
        .dispatch('shift/getCountList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumeData = res.data && res.data.consumeData ? res.data.consumeData : {}
            this.discountData = res.data && res.data.discountData ? res.data.discountData : {}

            this.showChart(this.consumeData)
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
      data.forEach((item) => {
        xAxisData.push(item.label)
      })

      return xAxisData
    },
    getLegendAndSeriesData (data) {
      const legend = []
      const series = []
      data.forEach((item) => {
        legend.push(item.pru_name)

        const newData = Object.values(item)
        newData.splice(0, 1)

        series.push({
          name: item.pru_name,
          type: 'bar',
          stack: 'Total',
          data: newData,
          barWidth: '50px'
        })
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

    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
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

<style></style>

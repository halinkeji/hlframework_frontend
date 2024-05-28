<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <shift-count @getPeriod="init" />
    </div>

    <div class="col-shrink q-px-xs full-height bg-white q-mt-xs">
      <q-scroll-area class="fit full-height">
        <div class="row q-col-gutter-xs">
          <div class="col-3" v-for="(item, key) in canCountData">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <q-item class="text-center">
                  <q-item-section>
                    <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.backCan) }}</q-item-label>
                    <q-item-label caption>回罐</q-item-label>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section>
                    <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.takeCount) }}</q-item-label>
                    <q-item-label caption>取回</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="text-center">
                  <q-item-section>
                    <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.turnBack) }}</q-item-label>
                    <q-item-label caption>调拨-调回</q-item-label>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section>
                    <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.borrowBack) }}</q-item-label>
                    <q-item-label caption>油站-借回</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center">
                {{ item.oc_name }}
              </q-card-section>
            </q-card>
          </div>
          <div class="row q-mt-md full-width">
            <div id="oilCanCharts" class="pie-service"></div>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import ShiftCount from '../../count.vue'
export default {
  name: 'OilCanCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      canCountData: [],
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
        .dispatch('shift/getOilCanCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.canCountData = res.data ? res.data : []
            if (res.data && res.data.length > 0) {
              this.showChart(res.data)
            }
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
    showChart (value) {
      const that = this
      this.chartPie = echarts.init(document.getElementById('oilCanCharts'), 'macarons')
      const source = value.map((item) => {
        return {
          oc_name: item.oc_name,
          takeCount: that.formatAmount(item.takeCount).toString(),
          turnBack: that.formatAmount(item.turnBack).toString(),
          backCan: that.formatAmount(item.backCan).toString(),
          borrowBack: that.formatAmount(item.borrowBack).toString()
        }
      })

      this.chartPie.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['oc_name', 'takeCount', 'turnBack', 'backCan', 'borrowBack'],
          source: source
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar', name: '回罐' },
          { type: 'bar', name: '取回' },
          { type: 'bar', name: '调拨-调回' },
          { type: 'bar', name: '油站-借回' }
        ]
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

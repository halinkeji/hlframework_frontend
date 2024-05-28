<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <shift-count @getPeriod="init" />
    </div>
    <div class="col-shrink q-pa-sm full-height bg-white">
      <div class="row q-col-gutter-xs">
        <div class="col-3" v-for="(item, key) in couponData">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <q-item class="text-center">
                <q-item-section>
                  <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.totalQuantity) }}</q-item-label>
                  <q-item-label caption>使用数量</q-item-label>
                </q-item-section>
                <q-separator vertical />
                <q-item-section>
                  <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.totalAmount) }}</q-item-label>
                  <q-item-label caption>抵现金额</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-center">
              {{ item.label }}
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-mt-md">
        <div id="couponCountCharts" class="pie-service"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import ShiftCount from '../../count.vue'
export default {
  name: 'CouponCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      couponData: [],
      startTime: '',
      endTime: ''
    }
  },
  created () {},
  computed: {},
  mounted () {

  },
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
        .dispatch('shift/getCouponCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.couponData = res.data ? res.data : []
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
      this.chartPie = echarts.init(document.getElementById('couponCountCharts'), 'macarons')
      const source = value.map(item => {
        return {
          label: item.label,
          totalQuantity: that.formatAmount(item.totalQuantity).toString(),
          totalAmount: that.formatAmount(item.totalAmount).toString()
        }
      })

      this.chartPie.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['label', 'totalQuantity', 'totalAmount'],
          source: source
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar', name: '使用数量' }, { type: 'bar', name: '抵现金额' }]
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

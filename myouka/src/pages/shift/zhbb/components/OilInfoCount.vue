<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <shift-count @getPeriod="init" />

    <div class="col-shrink q-px-xs full-height bg-white q-mt-xs" >
      <q-scroll-area class="fit full-height">
        <div class="row q-col-gutter-xs">
          <div class="col-3" v-for="(item, key) in oilCountData">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <q-item class="text-center">
                  <q-item-section>
                    <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.consumeOilRise) }}</q-item-label>
                    <q-item-label caption>销售升数</q-item-label>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section>
                    <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.rechargeMoneyCount) }}</q-item-label>
                    <q-item-label caption>销售金额</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center">
                {{ item.op_name }}
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-mt-md">
          <div id="oilSellCharts" class="pie-service"></div>
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
  name: 'OilInfoCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      oilCountData: [],
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
        .dispatch('shift/getOilInfoCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilCountData = res.data ? res.data : []
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
      this.chartPie = echarts.init(document.getElementById('oilSellCharts'), 'macarons')
      const source = value.map((item) => {
        return {
          op_name: item.op_name,
          consumeOilRise: that.formatAmount(item.consumeOilRise).toString(),
          rechargeMoneyCount: that.formatAmount(item.rechargeMoneyCount).toString()
        }
      })

      this.chartPie.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['op_name', 'consumeOilRise', 'rechargeMoneyCount'],
          source: source
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar', name: '销售升数' },
          { type: 'bar', name: '销售金额' }
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

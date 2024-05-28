<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <shift-count @getPeriod="init" />
    </div>
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pb-xl">
      <div class="row">
        <div class="col-4 q-pa-md" v-for="(item, key) in balanceCountData">
          <q-card class="shadow-1">
            <q-card-section class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ formatAmount(item.value) }} </q-item-label>
                  <!-- <q-item-label class="text-dark text-weight-thin text-overline">升</q-item-label> -->
                </q-item-section>
                <q-item-section side>
                  <q-icon :name="item.icon" :color="item.color" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" :background-color="item.color">
                <div class="text-blue-1 text-subtitle1">{{ item.label }}</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs full-height row justify-center">
      <div class="col-6">
        <div id="balanceCharts" class="pie-service"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import ShiftCount from '../../count.vue'
export default {
  name: 'BalanceCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      balanceCountData: [],
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
        .dispatch('shift/getBalanceCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.balanceCountData = res.data ? res.data : []
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
    showChart (value) {
      this.chartPie = echarts.init(document.getElementById('balanceCharts'), 'macarons')

      this.chartPie.setOption({
        title: {
          text: '增加/扣除统计'
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
          data: ['增加', '减少']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['增加', '减少']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [
              {
                value: value[0].value,
                type: 'bar',
                itemStyle: {
                  color: '#21ba45'
                }
              },
              {
                type: 'bar',
                value: value[1].value,
                itemStyle: {
                  color: '#027be3'
                }
              }
            ],
            type: 'bar',
            barWidth: '50px'
          }
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

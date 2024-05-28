<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        门店资产统计
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
        <q-scroll-area class="fit full-height">
          <div class="row q-gutter-sm q-py-sm">
            <div class="col-3">
              <q-input outlined readonly dense v-model="startTime" label="开始时间">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="startTime" minimal @input="changeTime" :options="optionStartDate" mask="YYYY/MM/DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined readonly dense v-model="endTime" label="结束时间">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="endTime" minimal :options="optionEedDate" mask="YYYY/MM/DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-1">
              <q-btn color="primary" unelevated label="查询" @click="getchartsData" />
            </div>
          </div>

          <div class="q-py-sm">
            <q-table
              :pagination="{
                rowsPerPage: 0,
              }"
              row-key="field"
              hide-bottom
              separator="cell"
              :data="resultRecord"
              :columns="columns"
              flat
              bordered
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="cp_gross_profit" :props="props">
                   <span class="text-caption"> {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span>
                     <span class="text-subtitle1"> {{ formatAmount(props.row.cp_gross_profit) }} </span>
                  </q-td>

                   <q-td key="cp_erp_cost" :props="props">
                   <span class="text-caption">{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} </span>
                   <span class="text-subtitle1">  {{ formatAmount(props.row.cp_erp_cost) }} </span>
                  </q-td>

                   <q-td key="cp_kzls_cost" :props="props">
                    <span class="text-caption">{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span>
                     <span class="text-subtitle1"> {{ formatAmount(props.row.cp_kzls_cost) }} </span>
                  </q-td>

                   <q-td key="cp_discounts_cost" :props="props">
                    <span class="text-caption">{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span>
                     <span class="text-subtitle1"> {{ formatAmount(props.row.cp_discounts_cost) }} </span>
                  </q-td>

                   <q-td key="cp_total_balance" :props="props">
                   <span class="text-caption">{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span>
                   <span class="text-subtitle1">{{ formatAmount(props.row.cp_total_balance) }}</span>
                  </q-td>

                   <q-td key="cp_total_integral" :props="props">
                    <span class="text-subtitle1"> {{ formatAmount(props.row.cp_total_integral) }} </span>
                  </q-td>

                   <q-td key="cp_charts_date" :props="props">
                    <span class="text-subtitle1"> {{ $q_date.formatDate(props.row.cp_charts_date * 1000, 'YYYY/MM/DD') }} </span>
                  </q-td>

                   <q-td key="id" :props="props">
                      <q-btn color="primary" unelevated label="更新统计" @click="updateCharts(props.row)" />
                  </q-td>

                </q-tr>
              </template>
            </q-table>
          </div>

          <div class="q-mt-sm">
            <div id="serviceChart" :style="{ height: '500px' }"></div>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
import echarts from 'echarts'
import { date } from 'quasar'
export default {
  name: 'chartsService',
  components: { echarts },
  data () {
    return {
      selectDate: 7,

      startTime: '',
      endTime: '',
      resultRecord: [],
      memberData: [],
      context: '',

      columns: [
        {
          name: 'cp_gross_profit',
          label: '毛利润',
          align: 'center',
          field: 'cp_gross_profit',
          format: this.formatRowDate
        },
        {
          name: 'cp_erp_cost',
          label: 'erp成本',
          align: 'center',
          field: 'cp_erp_cost',
          format: this.formatRowDate
        },
        {
          name: 'cp_kzls_cost',
          label: '开支成本',
          align: 'center',
          field: 'cp_kzls_cost',
          format: this.formatRowDate
        },
        {
          name: 'cp_discounts_cost',
          label: '优惠折扣成本',
          align: 'center',
          field: 'cp_discounts_cost',
          format: this.formatRowDate
        },
        {
          name: 'cp_total_balance',
          label: '现有总储值',
          align: 'center',
          field: 'cp_total_balance',
          format: this.formatRowDate
        },
        {
          name: 'cp_total_integral',
          label: '现有总积分',
          align: 'center',
          field: 'cp_total_integral',
          format: this.formatRowDate
        },
        {
          name: 'cp_charts_date',
          label: '统计日期',
          align: 'center',
          field: 'cp_charts_date',
          format: this.formatDate
        },
        {
          name: 'id',
          label: '操作',
          align: 'center',
          field: 'id',
          format: this.formatDate
        }
      ]
    }
  },
  created () {
    this.setDateArea()
  },
  mounted () {},
  computed: {},
  methods: {
    setDateArea () {
      const nowTime = new Date()
      this.startTime = date.formatDate(date.subtractFromDate(nowTime, { days: 7 }), 'YYYY/MM/DD')
      this.endTime = date.formatDate(date.subtractFromDate(nowTime, { days: 1 }), 'YYYY/MM/DD')

      this.$nextTick(() => {
        this.getchartsData()
      })
    },
    formatDate (val, row) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY/MM/DD')
      }
    },
    changeTime () {
      this.endTime = ''
    },
    optionStartDate (nowDate) {
      return nowDate < date.formatDate(new Date(), 'YYYY/MM/DD')
    },
    optionEedDate (nowDate) {
      return (
        nowDate < date.formatDate(new Date(), 'YYYY/MM/DD') &&
        nowDate != this.startTime &&
        nowDate > date.formatDate(date.subtractFromDate(this.startTime, { days: 7 }), 'YYYY/MM/DD') &&
        nowDate < date.formatDate(date.addToDate(this.startTime, { days: 7 }), 'YYYY/MM/DD')
      )
    },
    formatRowDate (val, row) {
      return this.formatAmount(val)
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    getchartsData () {
      if (!this.startTime || !this.endTime) {
        this.$q.notify({
          message: '错误',
          caption: '请选择时间段',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })

        return false
      }

      const params = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('charts/getPopertyCountData', params)
        .then((res) => {
          if (res.code == 200) {
            this.resultRecord = res.data.resultRecord ? res.data.resultRecord : []
            const resultData = res.data ? res.data : {}
            this.drawLine(resultData.xAxis, resultData.seriesData, resultData.yAxis, resultData.legendData)
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    updateCharts (item) {
      console.log('item', item)
      const params = {
        cp_charts_date: item.cp_charts_date
      }
      this.$store
        .dispatch('charts/setPopertyCountData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right',
              timeout: 500
            })
            this.getchartsData()
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    drawLine (xAxis, seriesData, yAxis, legendData) {
      // console.log('xAxis, seriesData, yAxis, legendData', xAxis, seriesData, yAxis, legendData)
      const serviceChart = echarts.init(document.getElementById('serviceChart'), 'macarons')
      serviceChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {},
        legend: {
          data: legendData
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: yAxis,
        series: seriesData
      })
    }
  }
}
</script>
<style scoped>
.my-custom-toggle {
  border: 1px solid #e2e2e2;
  border-radius: 0px;
}
</style>

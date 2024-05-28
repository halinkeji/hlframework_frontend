<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        会员{{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}分析
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
        <q-scroll-area class="fit full-height">
          <div class="row">
            <div class="bg-white q-py-sm col-4 q-px-sm" v-if="totalCount && totalCount.length > 0">
              <div class="row">
                <div class="q-px-sm col-12 q-pt-sm" v-for="(item, key) in totalCount" :key="key">
                  <q-card flat bordered>
                    <q-card-section align="center" class="q-py-lg">
                      <div class="text-h5">
                        {{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ formatAmount(item.value) }}
                      </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions class="bg-primary text-white" align="center">
                      <div class="q-py-sm">
                        {{ item.lbael }}
                      </div>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
            <div class="row q-gutter-sm q-py-sm col">
              <div class="col">
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
              <div class="col">
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
              <div class="col">
                <q-btn color="primary" unelevated label="查询" @click="getchartsData" />
              </div>

              <div class="col-12">
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
                      <q-td key="add" :props="props">
                        <span class="text-caption">
                          {{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span
                        >
                        <span class="text-subtitle1"> {{ formatAmount(props.row.add) }} </span>
                      </q-td>

                      <q-td key="reduce" :props="props">
                        <span class="text-caption">
                          {{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        </span>
                        <span class="text-subtitle1"> {{ formatAmount(props.row.reduce) }} </span>
                      </q-td>

                      <q-td key="count_date" :props="props">
                        <span class="text-subtitle1"> {{ props.row.count_date }} </span>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
          </div>

          <div class="q-py-sm ">
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
      totalCount: [],
      columns: [
        {
          name: 'add',
          label: '增加',
          align: 'center',
          field: 'add'
        },
        {
          name: 'reduce',
          label: '使用',
          align: 'center',
          field: 'reduce'
        },
        {
          name: 'count_date',
          label: '时间',
          align: 'center',
          field: 'count_date'
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
        .dispatch('charts/getBalanceAnalyseData', params)
        .then((res) => {
          if (res.code == 200) {
            this.totalCount = res.data.totalCount ? res.data.totalCount : []
            this.resultRecord = res.data.resultRecord ? res.data.resultRecord : []
            const resultData = res.data ? res.data : {}
            this.drawLine(resultData.xAxis, resultData.seriesData, resultData.legendData)
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

    drawLine (xAxis, seriesData, legendData) {
      const serviceChart = echarts.init(document.getElementById('serviceChart'), 'macarons')
      serviceChart.setOption({

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        grid: {
          left: '3%',
          right: '3.5%',
          bottom: '1.5%',
          containLabel: true
        },
        toolbox: {

        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1976D2'
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      })
    }
  }
}
</script>

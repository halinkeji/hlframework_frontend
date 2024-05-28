<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        业务消费报表
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
        <q-scroll-area class="fit full-height">
          <div class="bg-white q-px-md row">
            <div class="col-10 row q-gutter-x-sm items-center">
              <div class="q-pr-md">按日期</div>
              <div class="col-md-2 col-lg-2 col-sm-4 col-xs-4">
                <q-input outlined readonly dense v-model="startTime" label="开始时间">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="startTime" :options="optionStartDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="确定"
                              color="primary"
                              flat
                              @click="
                                selectDate = -1;
                                getchartsData;
                              "
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-2 col-lg-2 col-sm-4 col-xs-4">
                <q-input outlined readonly dense label="结束时间" v-model="endTime">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="endTime" :options="optionEndDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="确定"
                              color="primary"
                              flat
                              @click="
                                selectDate = -1;
                                getchartsData;
                              "
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn :color="selectDate == 0 ? 'primary' : 'grey'" class="q-mt-xs " unelevated label="今天" @click="setDateArea()" />
              <q-btn :color="selectDate == 1 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="昨天" @click="setDateArea(1)" />
              <q-btn :color="selectDate == 2 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本周" @click="setDateArea(2)" />
              <q-btn :color="selectDate == 3 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上周" @click="setDateArea(3)" />
              <q-btn :color="selectDate == 4 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本月" @click="setDateArea(4)" />
              <q-btn :color="selectDate == 5 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上月" @click="setDateArea(5)" />
              <q-btn :color="selectDate == 6 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本季" @click="setDateArea(6)" />
              <q-btn :color="selectDate == 7 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上季" @click="setDateArea(7)" />
              <q-btn :color="selectDate == 8 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本年" @click="setDateArea(8)" />
              <q-btn :color="selectDate == 9 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上年" @click="setDateArea(9)" />
              <!-- <q-btn :color="selectDate == 0 ? 'primary' : 'grey'" unelevated label="今天" @click="setDateArea()" class="col-md-2 col-lg-1 col-sm-3 col-xs-3 q-px-sm" />
              <q-btn :color="selectDate == 1 ? 'primary' : 'grey'" unelevated label="昨天" @click="setDateArea(1)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
              <q-btn :color="selectDate == 3 ? 'primary' : 'grey'" unelevated label="近三天" @click="setDateArea(3)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
              <q-btn :color="selectDate == 7 ? 'primary' : 'grey'" unelevated label="近一周" @click="setDateArea(7)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
              <q-btn :color="selectDate == 30 ? 'primary' : 'grey'" unelevated label="近一月" @click="setDateArea(30)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" /> -->
            </div>
          </div>

          <div class="bg-white q-py-sm  q-px-sm" v-if="chartsData.payData && chartsData.payData.length > 0">
            <div class="row">
              <div class="q-px-sm col-2 q-pt-sm" v-for="(item, key) in chartsData.payData" :key="key">
                <q-card flat bordered>
                  <q-card-section align="center" class="q-py-lg">
                    <div class="text-h5">
                      {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ item.amount }}
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions class="bg-primary text-white" align="center">
                    <div class="q-py-sm">
                      {{ item.title }}
                    </div>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>
          <div class="q-pa-md bg-white">
            <q-btn-group spread unelevated class=" my-custom-toggle">
              <q-btn :color="payType == 'noLimit' ? 'primary' : ''" :flat="payType == 'noLimit' ? false : true" @click="getPaytype('noLimit')" class="col" label="不限" />
              <q-btn :color="payType == item.field ? 'primary' : ''" :flat="payType == item.field ? false : true" :key="key + '-btn'" @click="getPaytype(item.field)" class="col" :label="item.name" v-for="(item,key) in chartsData.paymentChannel" />
            </q-btn-group>
          </div>
          <div id="serviceChart" class="col-12 bg-white " :style="{ height: '500px' }"></div>
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
      selectDate: 0,
      payType: 'noLimit',
      startTime: '',
      endTime: '',
      chartsData: {},
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.setDateArea()
  },
  mounted () {},
  computed: {},
  methods: {
    drawLine () {
      const serviceChart = echarts.init(document.getElementById('serviceChart'))
      serviceChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: true,
            lineStyle: {
              width: 1,
              type: 'dashed',
              opacity: 1,
              color: '#1976D2'
            }
          }
        },
        legend: {
          type: 'plain',
          top: '3%'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          },
          right: '1%',
          top: '3%'
        },

        grid: {
          left: '3%',
          right: '3.5%',
          bottom: '1.5%',
          containLabel: true
        },

        xAxis: {
          data: this.chartsData.xAxisData ? this.chartsData.xAxisData : [],
          type: 'category',
          boundaryGap: false,
          nameLocation: 'middle',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1976D2'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1976D2'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: this.chartsData && this.chartsData.series ? this.chartsData.series : []
      })
    },
    setDateArea (val) {
      this.selectDate = val || 0
      const newDate = new Date()
      const startDate = date.formatDate(date.startOfDate(newDate, 'day'), 'YYYY-MM-DD')
      const endDate = date.formatDate(date.endOfDate(newDate, 'day'), 'YYYY-MM-DD')
      if (val) {
        this.startTime = this.getDateArea(val).startTime
        this.endTime = this.getDateArea(val).endTime
      } else {
        this.startTime = startDate
        this.endTime = endDate
      }

      this.getchartsData()
    },
    getDateArea (val) {
      const day = new Date()
      let startTime = date.formatDate(date.startOfDate(day, 'day'), 'YYYY-MM-DD')
      let endTime = date.formatDate(date.endOfDate(day, 'day'), 'YYYY-MM-DD')
      if (val) {
        switch (val) {
          case 1: // 昨天
            startTime = date.formatDate(date.subtractFromDate(startTime, { days: val }), 'YYYY-MM-DD')
            endTime = date.formatDate(date.subtractFromDate(endTime, { days: 1 }), 'YYYY-MM-DD')
            break
          case 2: // 本周
            var weekday = new Date().getDay() || 7
            startTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday + 1)), 'YYYY-MM-DD')
            endTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday + 7)), 'YYYY-MM-DD')
            break
          case 3: // 上周
            var weekday = day.getDay() || 7
            startTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday - 6)), 'YYYY-MM-DD')
            endTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday)), 'YYYY-MM-DD')
            break
          case 4: // 本月
            startTime = date.formatDate(new Date(new Date().setDate(1)), 'YYYY-MM-DD')
            endTime = date.formatDate(new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)), 'YYYY-MM-DD')
            break
          case 5: // 上月
            startTime = date.formatDate(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)), 'YYYY-MM-DD')
            endTime = date.formatDate(new Date(new Date().setDate(0)), 'YYYY-MM-DD')
            break
          case 6: // 本季
            var month = new Date().getMonth()
            var newmonth
            var newmonth1
            if (month < 3) {
              newmonth = new Date(new Date().setMonth(0))
              newmonth1 = new Date(new Date().setMonth(3))
            } else if (month > 2 && month < 6) {
              newmonth = new Date(new Date().setMonth(3))
              newmonth1 = new Date(new Date().setMonth(6))
            } else if (month > 5 && month < 9) {
              newmonth = new Date(new Date().setMonth(6))
              newmonth1 = new Date(new Date().setMonth(9))
            } else if (month > 8 && month < 11) {
              newmonth = new Date(new Date().setMonth(9))
              newmonth1 = new Date(new Date().setMonth(12))
            }
            startTime = date.formatDate(new Date(newmonth.setDate(1)), 'YYYY-MM-DD')
            endTime = date.formatDate(new Date(newmonth1.setDate(0)), 'YYYY-MM-DD')
            break
          case 7: // 上季
            var month = new Date().getMonth()
            var newmonth
            var newmonth1
            if (month < 3) {
              newmonth = new Date(new Date().setMonth(9))
              newmonth1 = new Date(new Date().setMonth(12))
            } else if (month > 2 && month < 6) {
              newmonth = new Date(new Date().setMonth(0))
              newmonth1 = new Date(new Date().setMonth(3))
            } else if (month > 5 && month < 9) {
              newmonth = new Date(new Date().setMonth(3))
              newmonth1 = new Date(new Date().setMonth(6))
            } else if (month > 8 && month < 11) {
              newmonth = new Date(new Date().setMonth(6))
              newmonth1 = new Date(new Date().setMonth(9))
            }
            startTime = date.formatDate(new Date(newmonth.setDate(1)), 'YYYY-MM-DD')
            endTime = date.formatDate(new Date(newmonth1.setDate(0)), 'YYYY-MM-DD')
            break
          case 8: // 本年时间
            var year = day.getFullYear()
            startTime = year + '-01-01'
            endTime = year + '-12-31'
            break
          case 9: // 上一年度的时间
            var year = day.getFullYear() - 1
            startTime = year + '-01-01'
            endTime = year + '-12-31'
            break
          default:
            break
        }
        return { startTime, endTime }
      }
    },
    optionStartDate (nowDate) {
      const newDate = new Date()
      return nowDate <= date.formatDate(date.subtractFromDate(newDate, { days: 2 }), 'YYYY/MM/DD')
    },
    optionEndDate (nowDate) {
      const newDate = new Date()
      return (
        nowDate <= date.formatDate(date.subtractFromDate(newDate, { days: 1 }), 'YYYY/MM/DD') &&
        nowDate > date.formatDate(this.startTime, 'YYYY/MM/DD')
      )
    },
    getPaytype (payType) {
      this.payType = payType
      this.getchartsData()
    },
    getchartsData () {
      const params = {
        startTime: this.startTime,
        endTime: this.endTime,
        payType: this.payType
      }
      this.$store
        .dispatch('charts/getChartsServiceData', params)
        .then((res) => {
          if (res.code == 200) {
            this.chartsData = res.data ? res.data : {}
            this.drawLine()
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

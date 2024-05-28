<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink q-pa-sm full-height bg-white">
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
              <q-btn
                :class="selectDate == 0 ? 'bg_cinnabar' : 'bg-grey'"
                unelevated
                label="今天"
                @click="setDateArea()"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3 q-px-sm text-white"
              />
              <q-btn
                :class="selectDate == 1 ? 'bg_cinnabar' : 'bg-grey'"
                unelevated
                label="昨天"
                @click="setDateArea(1)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3 text-white"
              />
              <q-btn
                :class="selectDate == 3 ? 'bg_cinnabar' : 'bg-grey'"
                unelevated
                label="近三天"
                @click="setDateArea(3)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3 text-white"
              />
              <q-btn
                :class="selectDate == 7 ? 'bg_cinnabar' : 'bg-grey'"
                unelevated
                label="近一周"
                @click="setDateArea(7)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3 text-white"
              />
              <q-btn
                :class="selectDate == 30 ? 'bg_cinnabar' : 'bg-grey'"
                unelevated
                label="近一月"
                @click="setDateArea(30)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3 text-white"
              />
            </div>
          </div>

          <div class="bg-white q-py-sm  q-px-sm" v-if="starCountData && starCountData.length > 0">
            <div class="row">
              <div class="q-px-sm col-3 q-pt-sm" v-for="(item, key) in starCountData" :key="key">
                <q-card flat bordered>
                  <!-- <q-icon name="star" size="xs" class="color_cinnabar absolute-top-right"> </q-icon> -->
                  <q-card-section align="center" class="q-pa-none q-py-sm">
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-h6 text-weight-bold ">{{ formatAmount(item.comment_sum) }}</q-item-label>
                        <q-item-label caption>{{ item.sum_label }}</q-item-label>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-h6 text-weight-bold ">{{ formatAmount(item.comment_count) }}</q-item-label>
                        <q-item-label caption>{{ item.count_label }}</q-item-label>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-h6 text-weight-bold ">{{ formatAmount(formatAmount(item.comment_sum) / formatAmount(item.comment_count)) }}</q-item-label>
                        <q-item-label caption>{{ item.complex_label }}</q-item-label>
                      </q-item-section>

                    </q-item>

                  </q-card-section>
                  <q-separator />
                  <q-card-actions class="bg_cinnabar text-white" align="center">
                    <div class="q-py-sm">
                      {{ item.serve_label }}
                    </div>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
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
      selectDate: 7,

      startTime: '',
      endTime: '',
      chartsData: {},
      countData: [],
      starCountData: [],
      serveStarData: [],
      serveItem: 'all',
      userStarData: {}
    }
  },
  created () {
    this.setDateArea(7)
  },
  mounted () {},
  computed: {},
  methods: {
    drawLine () {
      const serviceChart = echarts.init(document.getElementById('serviceChart'))
      serviceChart.setOption({
        title: {
          text: '员工评分统计'
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: this.userStarData.dimensions,
          source: this.userStarData.source
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '1.5%',
          containLabel: true
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.userStarData.series
      })
    },
    setDateArea (val) {
      this.selectDate = val || 0
      const newDate = new Date()
      const startDate = date.formatDate(date.startOfDate(newDate, 'day'), 'YYYY-MM-DD')
      const endDate = date.formatDate(date.endOfDate(newDate, 'day'), 'YYYY-MM-DD')
      if (val) {
        this.startTime = date.formatDate(date.subtractFromDate(startDate, { days: val }), 'YYYY-MM-DD')
        this.endTime = date.formatDate(date.subtractFromDate(endDate, { days: 1 }), 'YYYY-MM-DD')
      } else {
        this.startTime = startDate
        this.endTime = endDate
      }

      this.getchartsData()
    },
    setServeCondition (val) {
      this.serveItem = val
      this.$nextTick(() => {
        this.getchartsData()
      })
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

    getchartsData () {
      const params = {
        startTime: this.startTime,
        endTime: this.endTime,
        serveItem: this.serveItem
      }
      this.$store
        .dispatch('comment/getChartCount', params)
        .then((res) => {
          if (res.code == 200) {
            this.starCountData = res.data && res.data.starCountData ? res.data.starCountData : []
            this.serveStarData = res.data && res.data.serveStarData ? res.data.serveStarData : []
            this.userStarData = res.data && res.data.userStarData ? res.data.userStarData : {}
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
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        卡项储值报表
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
        <q-scroll-area class="fit full-height">
          <div class="bg-white q-px-md row">
            <div class="col-9 q-py-sm" v-if="is_main_store">
              <q-select
                label="查询油站"
                use-chips
                @input="setDateArea(selectDate)"
                clearable
                v-model="selectStoreData"
                option-value="id"
                option-label="name"
                multiple
                emit-value
                map-options
                dense
                outlined
                :options="libInStoreList"
              />
            </div>
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
                :color="selectDate == 0 ? 'primary' : 'grey'"
                unelevated
                label="今天"
                @click="setDateArea()"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3 q-px-sm"
              />
              <q-btn
                :color="selectDate == 1 ? 'primary' : 'grey'"
                unelevated
                label="昨天"
                @click="setDateArea(1)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3"
              />
              <q-btn
                :color="selectDate == 3 ? 'primary' : 'grey'"
                unelevated
                label="近三天"
                @click="setDateArea(3)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3"
              />
              <q-btn
                :color="selectDate == 7 ? 'primary' : 'grey'"
                unelevated
                label="近一周"
                @click="setDateArea(7)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3"
              />
              <q-btn
                :color="selectDate == 30 ? 'primary' : 'grey'"
                unelevated
                label="近一月"
                @click="setDateArea(30)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3"
              />
            </div>
          </div>

          <div class="row q-col-gutter-xs">
            <div class="col-3" v-for="(item, key) in balanceGroupData">
              <q-card flat bordered class="my-card">
                <q-card-section>
                  <q-item class="text-center">
                    <q-item-section>
                      <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.totalAmount) }}</q-item-label>
                      <q-item-label caption>当前总储值</q-item-label>
                    </q-item-section>
                    <q-separator vertical />
                    <q-item-section>
                      <q-item-label class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.totalConsumeAmount) }}</q-item-label>
                      <q-item-label caption>当前总消费</q-item-label>
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

          <div id="cardBalanceId" class="col-12 bg-white" :style="{ height: '500px' }"></div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
import echarts from 'echarts'
import { date } from 'quasar'

export default {
  name: 'cardCharts',
  components: {
    echarts
  },
  data () {
    return {
      goodsId: '',
      goodsName: '',
      selectDate: 0,
      startTime: '',
      endTime: '',
      chartsData: {},
      countData: [],
      context: '',
      gridOptions: {},
      columnDefs: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'mrc_goodsName',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '次数',
          field: 'mrc_count',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: [],
      balanceGroupData: []
    }
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.setDateArea(7)
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    drawLine (data) {
      const cardBalanceId = echarts.init(document.getElementById('cardBalanceId'))

      cardBalanceId.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: data.dimensions ? data.dimensions : [],
          source: data.sourceData ? data.sourceData : []
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar', color: '#1976D2' }, { type: 'bar', color: '#26c6da' }, { type: 'bar', color: '#259958 ' }, { type: 'bar', color: '#ffa726' }]
      })
      return false
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
        selectStoreData: this.selectStoreData,
        startTime: this.startTime,
        endTime: this.endTime

      }
      this.$store
        .dispatch('charts/getCardBalanceCharts', params)
        .then((res) => {
          if (res.code == 200) {
            this.balanceGroupData = res.data && res.data.totalData ? res.data.totalData : []

            if (res.data) {
              this.drawLine(res.data.chartData)
            }
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
    // 获取选中规格商品数据
    getSelectedGoodsData (data) {
      if (data) {
        this.goodsId = data.id
        this.goodsName = data.goo_name
        this.getchartsData()
      }
    },
    // 选择商品
    selectGoodsBut () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType()
        }, 500)
      })
    },
    clearButton () {
      this.goodsId = ''
      this.goodsName = ''
      this.getchartsData()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getchartsData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getchartsData()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
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
    },
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-充次商品TOP排行榜'
      })
    }
  }
}
</script>

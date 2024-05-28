<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        会员充时报表
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
                              selectDate = -1
                              getchartsData
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
                              selectDate = -1
                              getchartsData
                            "
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-btn :color="selectDate == 0 ? 'primary' : 'grey'" unelevated label="今天" @click="setDateArea()" class="col-md-2 col-lg-1 col-sm-3 col-xs-3 q-px-sm" />
            <q-btn :color="selectDate == 1 ? 'primary' : 'grey'" unelevated label="昨天" @click="setDateArea(1)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
            <q-btn :color="selectDate == 3 ? 'primary' : 'grey'" unelevated label="近三天" @click="setDateArea(3)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
            <q-btn :color="selectDate == 7 ? 'primary' : 'grey'" unelevated label="近一周" @click="setDateArea(7)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
            <q-btn :color="selectDate == 30 ? 'primary' : 'grey'" unelevated label="近一月" @click="setDateArea(30)" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
          </div>
        </div>
        <div class="bg-white  q-pt-sm q-px-md row">
          <div class=" row items-center col-5 q-gutter-x-sm">
            <div class="q-pr-md">按商品</div>
            <q-input outlined v-model="goodsName" class="col-md-6 col-lg-6 col-sm-8 col-xs-8" dense label="商品" readonly />
            <q-btn color="primary" unelevated label="选择商品" @click="selectGoodsBut" class="col-2" />
            <q-btn color="grey" unelevated label="重置" @click="clearButton" class="q-px-md" />
          </div>
        </div>
        <div class="bg-white q-py-sm  q-px-sm" v-if="chartsData.totalData && chartsData.totalData.length > 0">
          <div class="row">
            <div class="q-px-sm col-2 q-pt-sm" v-for="(item, key) in chartsData.totalData" :key="key">
              <q-card flat bordered>
                <q-card-section align="center" class="q-py-lg">
                  <div class="text-h5">{{ item.amount }}</div>
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
        <div id="goodsCharts" class="col-12 bg-white " :style="{ height: '500px' }"></div>
        <div class="q-mt-sm">
          <div class="q-mt-sm q-pa-md bg-white">
            <div class="full-width text-weight-bold q-mb-md">
              充时商品TOP排行榜
              <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportBut" class="q-ml-lg q-px-md" />
            </div>
            <div style="height:240px">
              <ag-grid-vue
                ref="agGridTable"
                :gridOptions="gridOptions"
                class="ag-theme-balham full-height hl_header_center hl_content_center"
                :columnDefs="columnDefs"
                :suppressMovableColumns="true"
                :rowData="timingData"
                :rowDragManaged="true"
                colResizeDefault="shift"
                :animateRows="false"
                @first-data-rendered="onFirstDataRendered"
                @gridReady="onFirstDataRendered"
                :floatingFilter="false"
                :enableCellTextSelection="true"
                rowHeight="40"
                :context="context"
                :localeText="localeText"
                rowSelection="multiple"
                :suppressCellSelection="true"
                :suppressRowClickSelection="true"
                :stopEditingWhenGridLosesFocus="true"
                :suppressRowDeselection="true"
                :suppressRowTransform="true"
              ></ag-grid-vue>
            </div>
          </div>
        </div>
        <div>
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
        <goods-lists ref="specificationTree" @dataList="getSelectedGoodsData"></goods-lists>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
import echarts from 'echarts'
import { date } from 'quasar'
import goodsLists from './components/goodsLists'
export default {
  name: 'chartsAddTiming',
  components: {
    echarts,
    goodsLists
  },
  data () {
    return {
      goodsId: '',
      goodsName: '',
      selectDate: 0,
      startTime: '',
      endTime: '',
      chartsData: {},
      timingData: [],
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
          field: 'rtd_goods_name',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '时长（分钟）',
          field: 'rtd_duration_total',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.setDateArea()
  },
  mounted () {},
  computed: {},
  methods: {
    drawLine () {
      const goodsCharts = echarts.init(document.getElementById('goodsCharts'))
      goodsCharts.setOption({
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
        series: [
          {
            name: '新增计时',
            data: this.chartsData.addTimingData ? this.chartsData.addTimingData : [],
            type: 'line',
            color: 'rgb(255,255,0)',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 5,
              shadowColor: 'rgb(255,255,0,0.4)',
              shadowBlur: 8,
              shadowOffsetY: 8
            }
          }
        ]
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
    optionStartDate (nowDate) {
      const newDate = new Date()
      return nowDate <= date.formatDate(date.subtractFromDate(newDate, { days: 2 }), 'YYYY/MM/DD')
    },
    optionEndDate (nowDate) {
      const newDate = new Date()
      return nowDate <= date.formatDate(date.subtractFromDate(newDate, { days: 1 }), 'YYYY/MM/DD') && nowDate > date.formatDate(this.startTime, 'YYYY/MM/DD')
    },
    getchartsData () {
      const params = {
        goodsId: this.goodsId,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('charts/getChartsAddTimingData', params)
        .then((res) => {
          if (res.code == 200) {
            this.chartsData = res.data.analysisData ? res.data.analysisData : {}
            this.timingData = res.data.list ? res.data.list : []
            this.page.pageTotal = res.data ? parseInt(res.data.page.totalCount) : 0
            this.timingData.forEach((row, index) => {
              row.rank = index + 1 + (this.page.pageIndex - 1) * this.page.pageSize
            })
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
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-充时商品TOP排行榜'
      })
    }
  }
}
</script>

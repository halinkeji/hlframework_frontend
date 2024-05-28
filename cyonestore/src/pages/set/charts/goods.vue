<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        商品销售报表
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
          <div class="q-mt-sm row">
            <div class="q-mt-sm q-pa-md bg-white col-6">
              <div class="full-width text-weight-bold q-mb-md">
                销售商品数量TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonQuantity" class="q-ml-lg q-px-md" />
              </div>
              <div style="height:240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsQuantity"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsQuantity"
                  :suppressMovableColumns="true"
                  :rowData="goodsQuantityData"
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
              <div>
                <hl-pagination
                  @size-change="sizeChangeHandleQuantity"
                  @current-change="currentChangeHandleQuantity"
                  :current-page="pageQuantity.pageIndex"
                  :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
                  :page-size="pageQuantity.pageSize"
                  :total="pageQuantity.pageTotal"
                ></hl-pagination>
              </div>
            </div>
            <div class="q-mt-sm q-pa-md bg-white col-6">
              <div class="full-width text-weight-bold q-mb-md">
                销售商品金额TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonAmount" class="q-ml-lg q-px-md" />
              </div>
              <div style="height:240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsAmount"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsAmount"
                  :suppressMovableColumns="true"
                  :rowData="goodsAmountData"
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
              <div>
                <hl-pagination
                  @size-change="sizeChangeHandleAmount"
                  @current-change="currentChangeHandleAmount"
                  :current-page="pageAmount.pageIndex"
                  :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
                  :page-size="pageAmount.pageSize"
                  :total="pageAmount.pageTotal"
                ></hl-pagination>
              </div>
            </div>
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
  name: 'chartsGoods',
  components: {
    echarts
  },
  data () {
    return {
      selectDate: 7,
      startTime: '',
      endTime: '',
      chartsData: {},
      goodsQuantityData: [],
      goodsAmountData: [],
      context: '',
      gridOptionsQuantity: {},
      gridOptionsAmount: {},
      columnDefsQuantity: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'cid_goo_name',
          width: this.nowpx(0.55) + 'px'
        },
        {
          headerName: '数量',
          field: 'cid_consumeNumber',
          width: this.nowpx(0.25) + 'px'
        }
      ],
      columnDefsAmount: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'cid_goo_name',
          width: this.nowpx(0.55) + 'px'
        },
        {
          headerName: '金额',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.cid_totalPrice
          },
          field: 'cid_consumeNumber',
          width: this.nowpx(0.25) + 'px'
        }
      ],
      pageQuantity: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      pageAmount: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.setDateArea(7)
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
            name: '消费金额',
            data: this.chartsData.goodsPriceData ? this.chartsData.goodsPriceData : [],
            type: 'line',
            color: 'rgb(255,80,124)',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 5,
              shadowColor: 'rgb(255,80,124,0.4)',
              shadowBlur: 8,
              shadowOffsetY: 8
            }
          },
          {
            name: '消费数量',
            data: this.chartsData.goodsQuantityData ? this.chartsData.goodsQuantityData : [],
            type: 'line',
            color: 'rgb(100,149,237)',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 5,
              shadowColor: 'rgb(100,149,237,0.4)',
              shadowBlur: 8,
              shadowOffsetY: 8
            }
          },
          {
            name: '进货金额',
            data: this.chartsData.inGoodsPriceData ? this.chartsData.inGoodsPriceData : [],
            type: 'line',
            color: 'rgb(138,43,226)',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 5,
              shadowColor: 'rgb(138,43,226,0.4)',
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
        startTime: this.startTime,
        endTime: this.endTime,
        pageQuantity: this.pageQuantity.pageIndex,
        pSizeQuantity: this.pageQuantity.pageSize,
        pageAmount: this.pageAmount.pageIndex,
        pSizeAmount: this.pageAmount.pageSize
      }
      this.$store
        .dispatch('charts/getChartsGoodsData', params)
        .then((res) => {
          if (res.code == 200) {
            this.chartsData = res.data.analysisData ? res.data.analysisData : {}
            this.goodsQuantityData = res.data.listQuantity ? res.data.listQuantity : []
            this.goodsAmountData = res.data.listAmount ? res.data.listAmount : []
            this.pageQuantity.pageTotal = res.data ? parseInt(res.data.pageQuantity.totalCount) : 0
            this.pageAmount.pageTotal = res.data ? parseInt(res.data.pageAmount.totalCount) : 0
            this.goodsQuantityData.forEach((row, index) => {
              row.rank = index + 1 + (this.pageQuantity.pageIndex - 1) * this.pageQuantity.pageSize
            })
            this.goodsAmountData.forEach((row, index) => {
              row.rank = index + 1 + (this.pageAmount.pageIndex - 1) * this.pageAmount.pageSize
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
    sizeChangeHandleQuantity (val) {
      this.pageQuantity.pageSize = val
      this.pageQuantity.pageIndex = 1
      this.getchartsData()
    },
    currentChangeHandleQuantity (val) {
      this.pageQuantity.pageIndex = val
      this.getchartsData()
    },
    sizeChangeHandleAmount (val) {
      this.pageAmount.pageSize = val
      this.pageAmount.pageIndex = 1
      this.getchartsData()
    },
    currentChangeHandleAmount (val) {
      this.pageAmount.pageIndex = val
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
    exportButtonQuantity () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptionsQuantity.api.exportDataAsCsv({
        fileName: date + '-销售商品数量TOP排行榜'
      })
    },
    exportButtonAmount () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptionsAmount.api.exportDataAsCsv({
        fileName: date + '-销售商品金额TOP排行榜'
      })
    }
  }
}
</script>

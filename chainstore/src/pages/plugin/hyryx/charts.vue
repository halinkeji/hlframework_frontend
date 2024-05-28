<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        会员日营销报表
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white ">
        <q-scroll-area class="fit full-height">
          <div class="col-12  q-ma-md" v-if="is_main_store">
            <q-select
              label="查询门店"
              @input="setDateArea(selectDate)"
              clearable
              v-model="selectStoreData"
              use-chips
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
          <div class="bg-white q-px-md row q-gutter-y-sm">
            <div class="col-10 row q-gutter-x-sm items-center">
              <div class="q-pr-md">按日期</div>
              <div class="col-md-2 col-lg-2 col-sm-4 col-xs-4">
                <q-input outlined readonly dense v-model="startTime" label="开始时间">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="startTime" :options="optionStartDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat @click="getchartsData" />
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
                            <q-btn v-close-popup label="确定" color="primary" flat @click="getchartsData" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
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
              <q-btn
                :color="selectDate == 90 ? 'primary' : 'grey'"
                unelevated
                label="近三月"
                @click="setDateArea(90)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3 q-px-sm"
              />
              <q-btn
                :color="selectDate == 180 ? 'primary' : 'grey'"
                unelevated
                label="近半年"
                @click="setDateArea(180)"
                class="col-md-2 col-lg-1 col-sm-3 col-xs-3"
              />
            </div>
            <div class="col-10 row q-gutter-x-sm items-center">
              <div class="q-pr-md">按级别</div>
              <div class="col-md-3 col-lg-3 col-sm-6 col-xs-6">
                <q-select
                  outlined
                  dense
                  clearable
                  v-model="memberLevelId"
                  option-label="mcl_level_name"
                  option-value="id"
                  :options="memberLevelAllData"
                  label="会员级别"
                  emit-value
                  map-options
                />
              </div>
              <q-btn color="primary" unelevated label="查询" @click="setDateArea()" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
            </div>
            <div class="col-10 row q-gutter-x-sm items-center">
              <div class="q-pr-md">按规则</div>
              <div class="col-md-3 col-lg-3 col-sm-6 col-xs-6">
                <q-select
                  outlined
                  dense
                  clearable
                  v-model="ruleId"
                  option-label="phr_name"
                  option-value="id"
                  :options="ruleData"
                  label="营销规则"
                  emit-value
                  map-options
                />
              </div>
              <q-btn color="primary" unelevated label="查询" @click="setDateArea()" class="col-md-2 col-lg-1 col-sm-3 col-xs-3" />
            </div>
          </div>

          <div class="bg-white q-py-md  q-px-sm" v-if="chartsData.totalData && chartsData.totalData.length > 0">
            <div class="row">
              <div class="q-px-sm col-2 q-pt-sm" v-for="(item, key) in chartsData.totalData" :key="key">
                <q-card flat bordered>
                  <q-card-section align="center">
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
          <div id="serviceChart" class="col-12 bg-white " :style="{ height: '500px' }"></div>
          <div class="q-mt-sm">
            <div class="q-mt-sm q-pa-md bg-white">
              <div class="full-width text-weight-bold q-mb-md">
                会员参与会员日次数TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonMemberJoin" class="q-ml-lg q-px-md" />
              </div>
              <div style="height:240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsMemberJoin"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsMemberJoin"
                  :suppressMovableColumns="true"
                  :rowData="memberJoinData"
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
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="pageMemberJoin.pageIndex"
                  :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
                  :page-size="pageMemberJoin.pageSize"
                  :total="pageMemberJoin.pageTotal"
                ></hl-pagination>
              </div>
            </div>

            <div class="q-mt-sm q-pa-md bg-white">
              <div class="full-width text-weight-bold q-mb-md">
                各会员级别参与人数TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonLevel" class="q-ml-lg q-px-md" />
              </div>
              <div style="height:240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsLevel"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsLevel"
                  :suppressMovableColumns="true"
                  :rowData="memberLevelData"
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
            <div class="q-mt-sm q-pa-md bg-white">
              <div class="full-width text-weight-bold q-mb-md">
                会员折扣金额TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonDiscount" class="q-ml-lg q-px-md" />
              </div>
              <div style="height:240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsDiscount"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsDiscount"
                  :suppressMovableColumns="true"
                  :rowData="discountData"
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
            <div class="q-mt-sm q-pa-md bg-white">
              <div class="full-width text-weight-bold q-mb-md">
                会员赠送{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit }}TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonIntegral" class="q-ml-lg q-px-md" />
              </div>
              <div style="height:240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsIntegral"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsIntegral"
                  :suppressMovableColumns="true"
                  :rowData="integralData"
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
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
import echarts from 'echarts'
import { date } from 'quasar'
export default {
  name: 'hyryxCharts',
  components: { echarts },
  data () {
    return {
      selectDate: 7,
      memberLevelId: '',
      ruleId: '',
      startTime: '',
      endTime: '',
      chartsData: {},
      memberLevelAllData: [],
      ruleData: [],
      discountData: [],
      memberJoinData: [],
      integralData: [],
      memberLevelData: [],
      context: '',
      gridOptionsDiscount: {},
      gridOptionsMemberJoin: {},
      gridOptionsIntegral: {},
      gridOptionsLevel: {},
      columnDefsDiscount: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员名称',
          field: 'hr_member_name',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '折扣金额',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.hr_discount_amount
          },
          width: this.nowpx(0.2) + 'px'
        }
      ],
      columnDefsMemberJoin: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员名称',
          field: 'hr_member_name',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '次数',
          field: 'id',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      columnDefsIntegral: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员名称',
          field: 'hr_member_name',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'hr_give_integral',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      columnDefsLevel: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '级别名称',
          field: 'memberLevelName',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '参与人数',
          field: 'memberLevelQuantity',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      pageMemberJoin: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.getLevel()
    this.getRule()

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
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.memberLevelAllData = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getRule () {
      this.$store
        .dispatch('hyryx/getHyryxRuleLists')
        .then((res) => {
          if (res.code == 200) {
            this.ruleData = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
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
        series: [
          {
            name: '参与会员人数',
            data: this.chartsData.memberQuantityData ? this.chartsData.memberQuantityData : [],
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
            name: '实收交易总额',
            data: this.chartsData.realAmountData ? this.chartsData.realAmountData : [],
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
          },
          {
            name: '折扣总额',
            data: this.chartsData.discountAmountData ? this.chartsData.discountAmountData : [],
            type: 'line',

            color: 'rgb(0,169,0)',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 5,
              shadowColor: 'rgb(0,169,0,0.4)',
              shadowBlur: 8,
              shadowOffsetY: 8
            }
          },

          {
            name: '赠送' + this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit + '总额',
            data: this.chartsData.giveIntegralData ? this.chartsData.giveIntegralData : [],
            type: 'line',
            color: 'rgb(0,255,255)',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 5,
              shadowColor: 'rgb(0,255,255,0.4)',
              shadowBlur: 8,
              shadowOffsetY: 8
            }
          }
        ]
      })
    },
    setDateArea (val) {
      const newDate = new Date()
      const startDate = date.formatDate(date.startOfDate(newDate, 'day'), 'YYYY-MM-DD')
      const endDate = date.formatDate(date.endOfDate(newDate, 'day'), 'YYYY-MM-DD')
      if (val) {
        this.selectDate = val
        this.startTime = date.formatDate(date.subtractFromDate(startDate, { days: val }), 'YYYY-MM-DD')
        this.endTime = date.formatDate(date.subtractFromDate(endDate, { days: 1 }), 'YYYY-MM-DD')
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
        memberLevelId: this.memberLevelId,
        ruleId: this.ruleId,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.pageMemberJoin.pageIndex,
        pSize: this.pageMemberJoin.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('hyryx/getHyryxChartsData', params)
        .then((res) => {
          if (res.code == 200) {
            this.chartsData = res.data.analysisData ? res.data.analysisData : {}
            this.memberJoinData = res.data.listMemberJoin ? res.data.listMemberJoin : []
            this.pageMemberJoin.pageTotal = res.data ? parseInt(res.data.pageMemberJoin.totalCount) : 0
            this.memberJoinData.forEach((row, index) => {
              row.rank = index + 1 + (this.pageMemberJoin.pageIndex - 1) * this.pageMemberJoin.pageSize
            })
            this.memberLevelData = res.data.listLevel ? res.data.listLevel : []
            this.memberLevelData.forEach((row, index) => {
              row.rank = index + 1
            })
            this.discountData = res.data.listDiscount ? res.data.listDiscount : []
            this.discountData.forEach((row, index) => {
              row.rank = index + 1
            })
            this.integralData = res.data.listIntegral ? res.data.listIntegral : []
            this.integralData.forEach((row, index) => {
              row.rank = index + 1
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
    sizeChangeHandle (val) {
      this.pageMemberJoin.pageSize = val
      this.pageMemberJoin.pageIndex = 1
      this.getchartsData()
    },
    currentChangeHandle (val) {
      this.pageMemberJoin.pageIndex = val
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
    exportButtonDiscount () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptionsDiscount.api.exportDataAsCsv({
        fileName: date + '-会员折扣金额TOP排行榜'
      })
    },
    exportButtonMemberJoin () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptionsMemberJoin.api.exportDataAsCsv({
        fileName: date + '-会员参与会员日次数TOP排行榜'
      })
    },
    exportButtonIntegral () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptionsIntegral.api.exportDataAsCsv({
        fileName:
          date + '-会员赠送' + this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit + 'TOP排行榜'
      })
    },
    exportButtonLevel () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptionsLevel.api.exportDataAsCsv({
        fileName: date + '-各会员级别参与人数TOP排行榜'
      })
    }
  }
}
</script>

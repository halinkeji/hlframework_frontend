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
            <div class="col-9 q-py-sm" v-if="is_main_store">
              <q-select
                label="查询门店"
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
                                getchartsData();
                                selectDate = -1;
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
                                getchartsData();
                                selectDate = -1;
                              "
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-btn :color="selectDate == 0 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="今天" @click="setDateArea()" />
              <q-btn :color="selectDate == 1 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="昨天" @click="setDateArea(1)" />
              <q-btn :color="selectDate == 2 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本周" @click="setDateArea(2)" />
              <q-btn :color="selectDate == 3 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上周" @click="setDateArea(3)" />
              <q-btn :color="selectDate == 4 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本月" @click="setDateArea(4)" />
              <q-btn :color="selectDate == 5 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上月" @click="setDateArea(5)" />
              <q-btn :color="selectDate == 6 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本季" @click="setDateArea(6)" />
              <q-btn :color="selectDate == 7 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上季" @click="setDateArea(7)" />
              <q-btn :color="selectDate == 8 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="本年" @click="setDateArea(8)" />
              <q-btn :color="selectDate == 9 ? 'primary' : 'grey'" class="q-mt-xs" unelevated label="上年" @click="setDateArea(9)" />
            </div>
          </div>
          <div class="bg-white q-py-sm q-px-sm" v-if="chartsData.totalData && chartsData.totalData.length > 0">
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
          <div id="goodsCharts" class="col-12 bg-white" :style="{ height: '500px' }"></div>
          <div class="q-mt-sm row">
            <div class="q-mt-sm q-pa-md bg-white col-6">
              <div class="full-width text-weight-bold q-mb-md">
                销售商品数量TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonQuantity" class="q-ml-lg q-px-md" />
              </div>
              <div style="height: 240px">
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
            </div>
            <div class="q-mt-sm q-pa-md bg-white col-6">
              <div class="full-width text-weight-bold q-mb-md">
                销售商品金额TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonAmount" class="q-ml-lg q-px-md" />
              </div>
              <div style="height: 240px">
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
            </div>
          </div>
          <div class="q-mt-sm row">
            <div class="q-mt-sm q-pa-md bg-white col-6">
              <div class="full-width text-weight-bold q-mb-md">
                销售品类数量TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonTypeQuantity" class="q-ml-lg q-px-md" />
              </div>
              <div style="height: 240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsTypeQuantity"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsTypeQuantity"
                  :suppressMovableColumns="true"
                  :rowData="typeQuantityData"
                  @onRowClicked="showColumn"
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
            <div class="q-mt-sm q-pa-md bg-white col-6">
              <div class="full-width text-weight-bold q-mb-md">
                销售品类金额TOP排行榜
                <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonTypeAmount" class="q-ml-lg q-px-md" />
              </div>
              <div style="height: 240px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsTypeAmount"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnDefsTypeAmount"
                  :suppressMovableColumns="true"
                  :rowData="typeAmountData"
                  :rowDragManaged="true"
                  colResizeDefault="shift"
                  :animateRows="false"
                  @first-data-rendered="onFirstDataRendered"
                  @gridReady="onFirstDataRendered"
                  @onRowClicked="showColumn"
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
      <q-dialog @hide="showType" v-model="showType" persistent>
        <q-card
          :style="{
            width: parseInt($q.screen.width * 0.9) + 'px',
            'max-width': parseInt($q.screen.width * 0.9) + 'px',
          }"
          class="fit"
        >
          <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
            <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 row">
              <span class="text-h6 q-px-md"> 品类详情 </span>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup @click="showType = false" />
            </div>
            <div class="col-shrink q-pa-sm full-height bg-white">
              <div style="height: 400px" class="q-mb-xl">
                <div class="full-width text-weight-bold q-mb-sm">
                  销售商品金额TOP排行榜
                  <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonTypeAmounts" class="q-ml-lg q-px-md" />
                </div>
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptionsTypeAmounts"
                  class="ag-theme-balham full-height hl_header_center hl_content_center"
                  :columnDefs="columnsTypeAmount"
                  :suppressMovableColumns="true"
                  :rowData="typeAmount"
                  :defaultColDef="defaultColDef"
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
              <div class="q-mt-xl">
                <div style="height: 400px">
                  <div class="full-width text-weight-bold q-mb-md q-mt-sm">
                    销售商品数量TOP排行榜
                    <q-btn color="primary" dense unelevated label="导出CSV文件" @click="exportButtonTypeQuantitys" class="q-ml-lg q-px-md" />
                  </div>
                  <ag-grid-vue
                    ref="agGridTable"
                    :gridOptions="gridOptionsTypeQuantitys"
                    class="ag-theme-balham full-height hl_header_center hl_content_center"
                    :columnDefs="columnsTypeQuantity"
                    :defaultColDef="defaultColDef"
                    :suppressMovableColumns="true"
                    :rowData="typeQuantity"
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
          </div>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script>
import echarts from 'echarts';
import { date } from 'quasar';
import AgButton from './components/AgButton.vue';
export default {
  name: 'chartsGoods',
  components: {
    echarts,
    AgButton,
  },
  data() {
    return {
      showType: false,
      selectDate: 0,
      startTime: '',
      endTime: '',
      chartsData: {},
      goodsQuantityData: [],
      goodsAmountData: [],
      typeQuantityData: [],
      typeAmountData: [],
      typeQuantity: [],
      typeAmount: [],
      context: '',
      gridOptionsQuantity: {},
      gridOptionsAmount: {},
      gridOptionsTypeQuantity: {},
      gridOptionsTypeAmount: {},
      defaultColDef: {
        sortable: true,
      },
      columnDefsQuantity: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.2) + 'px',
        },
        {
          headerName: '商品名称',
          field: 'cid_goo_name',
          width: this.nowpx(0.55) + 'px',
        },
        {
          headerName: '数量',
          field: 'cid_consumeNumber',
          width: this.nowpx(0.25) + 'px',
        },
      ],
      columnDefsAmount: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.2) + 'px',
        },
        {
          headerName: '商品名称',
          field: 'cid_goo_name',
          width: this.nowpx(0.55) + 'px',
        },
        {
          headerName: '金额',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.cid_totalPrice;
          },
          field: 'cid_consumeNumber',
          width: this.nowpx(0.25) + 'px',
        },
      ],
      columnDefsTypeQuantity: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.2) + 'px',
        },
        {
          headerName: '分类名称',
          field: 'gt_name',
          width: this.nowpx(0.55) + 'px',
        },
        {
          headerName: '数量',
          field: 'cid_consumeNumber',
          width: this.nowpx(0.25) + 'px',
        },
        {
          headerName: '操作',
          field: 'id',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.13) + 'px',
        },
      ],
      columnDefsTypeAmount: [
        {
          headerName: '排行',
          field: 'rank',
          width: this.nowpx(0.2) + 'px',
        },
        {
          headerName: '分类名称',
          field: 'gt_name',
          width: this.nowpx(0.55) + 'px',
        },
        {
          headerName: '金额',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.cid_totalPrice;
          },
          field: 'cid_consumeNumber',
          width: this.nowpx(0.25) + 'px',
        },
        {
          headerName: '操作',
          field: 'id',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.13) + 'px',
        },
      ],
      pageQuantity: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0,
      },
      pageAmount: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0,
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: [],
      columnsTypeAmount: [
        { headerName: '排行', field: 'rank' },
        { headerName: '商品名称', field: 'cid_goo_name' },
        { headerName: '金额', field: 'cid_totalPrice', comparator: (a, b) => a - b },
      ],
      columnsTypeQuantity: [
        { headerName: '排序', field: 'rank' },
        { headerName: '商品名称', field: 'cid_goo_name' },
        { headerName: '数量', field: 'cid_consumeNumber', comparator: (a, b) => a - b },
      ],
    };
  },
  created() {
    this.context = this;
    if (this.is_main_store) {
      this.getLibInStoreData();
    }
  },
  mounted() {
    this.setDateArea();
  },
  computed: {
    is_main_store() {
      return this.$store.getters['merchant/is_main_store'];
    },
  },
  methods: {
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    showColumn(event) {
      //event.data 选中的行内数据，event.event 为鼠标事件，等其他。可以log自己看一下
      console.log('a row was clicked', event.data);
    },
    drawLine() {
      const goodsCharts = echarts.init(document.getElementById('goodsCharts'));
      goodsCharts.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: true,
            lineStyle: {
              width: 1,
              type: 'dashed',
              opacity: 1,
              color: '#1976D2',
            },
          },
        },
        legend: {
          type: 'plain',
          top: '3%',
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
          right: '1%',
          top: '3%',
        },
        grid: {
          left: '3%',
          right: '3.5%',
          bottom: '1.5%',
          containLabel: true,
        },
        xAxis: {
          data: this.chartsData.xAxisData ? this.chartsData.xAxisData : [],
          type: 'category',
          boundaryGap: false,
          nameLocation: 'middle',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1976D2',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1976D2',
            },
          },
          axisTick: {
            show: false,
          },
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
              shadowOffsetY: 8,
            },
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
              shadowOffsetY: 8,
            },
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
              shadowOffsetY: 8,
            },
          },
        ],
      });
    },
    setDateArea(val) {
      this.selectDate = val || 0;
      const newDate = new Date();
      const startDate = date.formatDate(date.startOfDate(newDate, 'day'), 'YYYY-MM-DD');
      const endDate = date.formatDate(date.endOfDate(newDate, 'day'), 'YYYY-MM-DD');
      if (val) {
        this.startTime = this.getDateArea(val).startTime;
        this.endTime = this.getDateArea(val).endTime;
      } else {
        this.startTime = startDate;
        this.endTime = endDate;
      }
      this.getchartsData();
    },
    getDateArea(val) {
      var day = new Date();
      var startTime = date.formatDate(date.startOfDate(day, 'day'), 'YYYY-MM-DD');
      var endTime = date.formatDate(date.endOfDate(day, 'day'), 'YYYY-MM-DD');
      if (val) {
        switch (val) {
          case 1: //昨天
            startTime = date.formatDate(date.subtractFromDate(startTime, { days: val }), 'YYYY-MM-DD');
            endTime = date.formatDate(date.subtractFromDate(endTime, { days: 1 }), 'YYYY-MM-DD');
            break;
          case 2: //本周
            var weekday = new Date().getDay() || 7;
            startTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday + 1)), 'YYYY-MM-DD');
            endTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday + 7)), 'YYYY-MM-DD');
            break;
          case 3: //上周
            var weekday = day.getDay() || 7;
            startTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday - 6)), 'YYYY-MM-DD');
            endTime = date.formatDate(new Date(new Date().setDate(new Date().getDate() - weekday)), 'YYYY-MM-DD');
            break;
          case 4: //本月
            startTime = date.formatDate(new Date(new Date().setDate(1)), 'YYYY-MM-DD');
            endTime = date.formatDate(new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)), 'YYYY-MM-DD');
            break;
          case 5: //上月
            startTime = date.formatDate(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)), 'YYYY-MM-DD');
            endTime = date.formatDate(new Date(new Date().setDate(0)), 'YYYY-MM-DD');
            break;
          case 6: //本季
            var month = new Date().getMonth();
            var newmonth;
            var newmonth1;
            if (month < 3) {
              newmonth = new Date(new Date().setMonth(0));
              newmonth1 = new Date(new Date().setMonth(3));
            } else if (2 < month && month < 6) {
              newmonth = new Date(new Date().setMonth(3));
              newmonth1 = new Date(new Date().setMonth(6));
            } else if (5 < month && month < 9) {
              newmonth = new Date(new Date().setMonth(6));
              newmonth1 = new Date(new Date().setMonth(9));
            } else if (8 < month && month < 11) {
              newmonth = new Date(new Date().setMonth(9));
              newmonth1 = new Date(new Date().setMonth(12));
            }
            startTime = date.formatDate(new Date(newmonth.setDate(1)), 'YYYY-MM-DD');
            endTime = date.formatDate(new Date(newmonth1.setDate(0)), 'YYYY-MM-DD');
            break;
          case 7: //上季
            var month = new Date().getMonth();
            var newmonth;
            var newmonth1;
            if (month < 3) {
              newmonth = new Date(new Date().setMonth(9));
              newmonth1 = new Date(new Date().setMonth(12));
            } else if (2 < month && month < 6) {
              newmonth = new Date(new Date().setMonth(0));
              newmonth1 = new Date(new Date().setMonth(3));
            } else if (5 < month && month < 9) {
              newmonth = new Date(new Date().setMonth(3));
              newmonth1 = new Date(new Date().setMonth(6));
            } else if (8 < month && month < 11) {
              newmonth = new Date(new Date().setMonth(6));
              newmonth1 = new Date(new Date().setMonth(9));
            }
            startTime = date.formatDate(new Date(newmonth.setDate(1)), 'YYYY-MM-DD');
            endTime = date.formatDate(new Date(newmonth1.setDate(0)), 'YYYY-MM-DD');
            break;
          case 8: //本年时间
            var year = day.getFullYear();
            startTime = year + '-01-01';
            endTime = year + '-12-31';
            break;
          case 9: //上一年度的时间
            var year = day.getFullYear() - 1;
            startTime = year + '-01-01';
            endTime = year + '-12-31';
            break;
          default:
            break;
        }
        return { startTime, endTime };
      }
    },
    optionStartDate(nowDate) {
      const newDate = new Date();
      return nowDate <= date.formatDate(date.subtractFromDate(newDate, { days: 2 }), 'YYYY/MM/DD');
    },
    optionEndDate(nowDate) {
      const newDate = new Date();
      return (
        nowDate <= date.formatDate(date.subtractFromDate(newDate, { days: 1 }), 'YYYY/MM/DD') &&
        nowDate > date.formatDate(this.startTime, 'YYYY/MM/DD')
      );
    },
    getchartsData() {
      const params = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageQuantity: this.pageQuantity.pageIndex,
        pSizeQuantity: this.pageQuantity.pageSize,
        pageAmount: this.pageAmount.pageIndex,
        pSizeAmount: this.pageAmount.pageSize,
        selectStoreData: this.selectStoreData,
      };
      this.$store
        .dispatch('charts/getChartsGoodsData', params)
        .then((res) => {
          if (res.code == 200) {
            this.chartsData = res.data.analysisData ? res.data.analysisData : {};
            this.goodsQuantityData = res.data.listQuantity ? res.data.listQuantity : [];
            this.goodsAmountData = res.data.listAmount ? res.data.listAmount : [];
            this.pageQuantity.pageTotal = res.data ? parseInt(res.data.pageQuantity.totalCount) : 0;
            this.pageAmount.pageTotal = res.data ? parseInt(res.data.pageAmount.totalCount) : 0;

            this.goodsQuantityData.forEach((row, index) => {
              row.rank = index + 1 + (this.pageQuantity.pageIndex - 1) * this.pageQuantity.pageSize;
            });
            this.goodsAmountData.forEach((row, index) => {
              row.rank = index + 1 + (this.pageAmount.pageIndex - 1) * this.pageAmount.pageSize;
            });

            this.typeQuantityData = res.data.listTypeQuantity ? res.data.listTypeQuantity : [];
            this.typeAmountData = res.data.listTypeAmount ? res.data.listTypeAmount : [];

            this.typeQuantityData.forEach((row, index) => {
              row.rank = index + 1 + (this.pageQuantity.pageIndex - 1) * this.pageQuantity.pageSize;
            });
            this.typeAmountData.forEach((row, index) => {
              row.rank = index + 1 + (this.pageAmount.pageIndex - 1) * this.pageAmount.pageSize;
            });
            this.drawLine();
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
          });
        });
    },

    goShowType(val) {
      this.showType = true;
      const params = {
        startTime: this.startTime,
        endTime: this.endTime,
        typeId: val,
      };
      this.$store
        .dispatch('charts/getTypeCharts', params)
        .then((res) => {
          if (res.code == 200) {
            this.typeQuantity = res.data.listTypeQuantity ? res.data.listTypeQuantity : [];
            this.typeAmount = res.data.listTypeAmount ? res.data.listTypeAmount : [];

            this.typeQuantity.forEach((row, index) => {
              row.rank = index + 1 + (this.pageQuantity.pageIndex - 1) * this.pageQuantity.pageSize;
            });
            this.typeAmount.forEach((row, index) => {
              row.rank = index + 1 + (this.pageAmount.pageIndex - 1) * this.pageAmount.pageSize;
            });
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
          });
        });
    },
    clearButton() {
      this.goodsId = '';
      this.goodsName = '';
      this.getchartsData();
    },
    sizeChangeHandleQuantity(val) {
      this.pageQuantity.pageSize = val;
      this.pageQuantity.pageIndex = 1;
      this.getchartsData();
    },
    currentChangeHandleQuantity(val) {
      this.pageQuantity.pageIndex = val;
      this.getchartsData();
    },
    sizeChangeHandleAmount(val) {
      this.pageAmount.pageSize = val;
      this.pageAmount.pageIndex = 1;
      this.getchartsData();
    },
    currentChangeHandleAmount(val) {
      this.pageAmount.pageIndex = val;
      this.getchartsData();
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width - 274;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    },
    exportButtonQuantity() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptionsQuantity.api.exportDataAsCsv({
        fileName: date + '-销售商品数量TOP排行榜',
      });
    },
    exportButtonAmount() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptionsAmount.api.exportDataAsCsv({
        fileName: date + '-销售商品金额TOP排行榜',
      });
    },
    exportButtonTypeQuantity() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptionsTypeQuantity.api.exportDataAsCsv({
        fileName: date + '-销售品类数量TOP排行榜',
      });
    },
    exportButtonTypeAmount() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptionsTypeAmount.api.exportDataAsCsv({
        fileName: date + '-销售品类金额TOP排行榜',
      });
    },
    exportButtonTypeQuantitys() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptionsTypeQuantitys.api.exportDataAsCsv({
        fileName: date + '-销售商品数量TOP排行榜',
      });
    },
    exportButtonTypeAmounts() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptionsTypeAmounts.api.exportDataAsCsv({
        fileName: date + '-销售商品金额TOP排行榜',
      });
    },
  },
};
</script>

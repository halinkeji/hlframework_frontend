<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-lg q-gutter-x-xs row">
      <q-input class="col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchNumber" label="商品名称/条码/助记码/简称" dense />
      <q-select
        class="col-12 col-md-2 q-mt-sm"
        v-if="is_main_store"
        outlined
        option-value="id"
        option-label="cd_name"
        emit-value
        map-options
        v-model="depot_id"
        :options="depotData"
        dense
        label="仓库"
      />
      <div class="col-12 col-md-2 q-mt-sm">
        <hl-select-tree
          :list_width="400"
          @getItem="(item) => { goodsTypeId = item.id;}"
          @resetValue="goodsTypeId = ''"
          :dataList="goodsTypeData"
          textName="请选择分类"
          :inputLabel="'gt_name'"
          :inputValue="'id'"
          :showValue="goodsTypeId"
          ref="selectTreeRef"
        />
      </div>
      <q-select
        class="col-12 col-md-2 q-mt-sm"
        outlined
        :options="brandList"
        option-value="id"
        option-label="cp_name"
        emit-value
        map-options
        v-model="brand_id"
        dense
        label="品牌"
      />
      <q-select
        class="col-12 col-md-2 q-mt-sm"
        outlined
        :options="priorityList"
        option-value="id"
        option-label="cp_name"
        emit-value
        map-options
        v-model="priority_id"
        dense
        label="层次"
      />

      <q-btn color="primary" class="q-mt-sm" unelevated label="搜索" @click="getList" />
      <q-btn color="warning" @click="resetCondition" class="q-mt-sm" unelevated label="重置" />
      <q-btn
        color="primary"
        class="q-mt-sm"
        :disable="dataListSelections.length > 0 ? false : true"
        unelevated
        v-if="authorityMeta('warning')"
        @click="getWarning()"
      >
        预警设置
      </q-btn>
      <q-btn color="primary" class="q-mt-sm" unelevated @click="countExport" label="导出Xls文件" :disable="specificationNewsData.length == 0" />
      <q-btn anchor="bottom right" self="top left" flat class="q-mr-sm" icon="ion-help-circle" color="warning">
        <q-tooltip> 红色：同时达到预警（低于库存预警数量、小于库存预警时间）。 浅红色：低于库存预警数量。 橙色：小于库存预警时间。 </q-tooltip>
      </q-btn>
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table erp-number-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="specificationNewsData"
        rowSelection="multiple"
        @gridReady="onFirstDataRendered"
        :defaultColDef="defaultColDef"
        rowHeight="40"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCharts="true"
        :enableRangeSelection="true"
        :enableCellTextSelection="true"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="false"
        :rowMultiSelectWithClick="true"
        :localeText="localeText"
        :context="context"
        @rowSelected="rowSelectedAg"
        :rowClassRules="{
          'bg-rule-negative': (params) => {
            if (params.data.gn_count_warning) {
              return params.data.gn_count_warning > params.data.gn_number;
            }
          },
          'bg-rule-warning': (params) => {
            let outcome = Math.round(new Date().getTime() / 1000);
            if (params.data.gn_maturity_time) {
              return params.data.gn_maturity_time < outcome;
            }
            return false;
          },
          'bg-rule-red': (params) => {
            let a = false;
            let b = false;
            let outcome = Math.round(new Date().getTime() / 1000);
            if (params.data.gn_maturity_time && params.data.gn_maturity_time < outcome) {
              a = true;
            }
            if (params.data.gn_count_warning && params.data.gn_count_warning > params.data.gn_number) {
              b = true;
            }
            return a && b;
          },
        }"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :current-page="page.pageIndex"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
    <warning-popup ref="child" v-if="warningPopupStatus" @warning="getList"></warning-popup>
  </div>
</template>
<script>
import AgButton from './components/AgButton'
import WarningPopup from './components/WarningPopup'
import AgShowBuy from './components/AgShowBuy'
import AgShowWay from './components/AgShowWay'
export default {
  name: 'normal',
  components: {
    AgButton,
    AgShowBuy,
    AgShowWay,
    WarningPopup
  },
  data () {
    return {
      activeName: '0',
      goodsTypedata: [],
      components: { AgButton, WarningPopup },
      gridOptions: {},
      depotData: [],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '规格名称',
          field: 'sl_title',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '分类',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          field: 'goodsType',
          valueGetter: (p) => {
            if (p.data.goodsType) {
              return p.data.goodsType.gt_name
            } else {
              return ''
            }
          }
        },

        {
          headerName: '售价(' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit + ')',
          field: 'goo_price',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        // {
        //   headerName: '总库存',
        //   field: 'gn_number',
        //   filter: false,
        //   width: this.nowpx(0.1) + 'px',
        //   rowSpan: this.rowSpan,
        //   valueGetter: (p) => {
        //     if (p.data.gn_maturity_time) {
        //       return this.$q_date.formatDate(p.data.gn_maturity_time * 1000, 'YYYY-MM-DD HH:mm:ss')
        //     }
        //     return ''
        //   },
        //   cellClassRules: {
        //     'cell-span-erp-number': function (p) {
        //       if (p.value) {
        //         return true
        //       }
        //     }
        //   }
        // },
        {
          headerName: '库存',
          field: 'allNumber',
          sort: 'desc',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '库存金额',
          field: 'allNumberPrice',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },

        {
          headerName: '在购',
          field: 'buy_number',
          cellRendererFramework: 'AgShowBuy',
          filter: false,
          width: this.nowpx(0.05) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '在购金额',
          field: 'buyPrice',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '在途',
          field: 'way_number',
          cellRendererFramework: 'AgShowWay',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '在途金额',
          field: 'wayPrice',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '可用',
          field: 'edn_number',
          sort: 'desc',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '成本价',
          field: 'costPrice',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '成本金额',
          field: 'costCost',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '可用金额',
          field: 'edn_numberPrice',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '预警下限',
          field: 'gn_count_warning',
          filter: false,
          comparator: (a, b) => a - b,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '预警到期',
          field: 'gn_maturity_time',
          filter: false,
          width: this.nowpx(0.12) + 'px',
          valueGetter: (p) => {
            if (p.data.gn_maturity_time) {
              return this.$q_date.formatDate(p.data.gn_maturity_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          headerName: '品牌',
          width: this.nowpx(0.06) + 'px',
          field: 'band',
          valueGetter: (p) => {
            if (p.data.band) {
              return p.data.band.cp_name
            }
          }
        },
        {
          headerName: '商品层次',
          width: this.nowpx(0.06) + 'px',
          field: 'priority',
          valueGetter: (p) => {
            if (p.data.priority) {
              return p.data.priority.cp_name
            }
          }
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgButton',
          field: 'main_goods_id',
          width: this.nowpx(0.06) + 'px',
          pinned: 'right'
        }
      ],
      defaultColDef: {
        resizable: true, // 是否可以调整列大小，就是拖动改变列大小
        sortable: true
      },
      specificationNewsData: [], // 默认数据源
      selected: [],
      searchNumber: '',
      goodsTypeId: '',
      depot_id: '',
      priority_id: '',
      brand_id: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      dataListSelections: [],
      warningRules: [],
      warningPopupStatus: false,
      goodsTypeData: [],
      brandList: [],
      priorityList: []
    }
  },

  mounted () {
    this.context = this
    if (this.is_main_store) {
      this.getConfig()
      this.getLibInStoreData()
    }
  },
  created () {
    this.getGoodsType()
    this.getDepotList()
    this.getList()
    this.getPropertyAll()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getConfig () {
      this.gridOptions.api.setColumnDefs([])
      this.$nextTick(() => {
        const newAgColumnDefs = [
          {
            checkboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            width: this.nowpx(0.02) + 'px'
          },
          {
            headerName: '#',
            width: this.nowpx(0.04) + 'px',
            valueGetter: function (params) {
              return params.node ? params.node.rowIndex + 1 : null
            }
          },
          {
            headerName: '商品名称',
            field: 'goo_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.12) + 'px'
          },
          {
            headerName: '规格名称',
            field: 'sl_title',
            filter: false,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '条码',
            field: 'goo_code',
            filter: false,
            width: this.nowpx(0.08) + 'px'
          },

          {
            headerName: '分类',
            filter: false,
            width: this.nowpx(0.1) + 'px',
            field: 'goodsType',
            valueGetter: (p) => {
              if (p.data.goodsType) {
                return p.data.goodsType.gt_name
              } else {
                return '无'
              }
            }
          },
          {
            headerName: '品牌',
            width: this.nowpx(0.08) + 'px',
            field: 'band',
            valueGetter: (p) => {
              if (p.data.band) {
                return p.data.band.cp_name
              }
            }
          },
          {
            headerName: '商品层次',
            width: this.nowpx(0.08) + 'px',
            field: 'priority',
            valueGetter: (p) => {
              if (p.data.priority) {
                return p.data.priority.cp_name
              }
            }
          },
          {
            headerName: '售价(' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit + ')',
            field: 'goo_price',
            filter: false,
            width: this.nowpx(0.1) + 'px'
          },
          {
            headerName: '总库存',
            field: 'gn_number',
            filter: false,
            width: this.nowpx(0.1) + 'px'

          },
          {
            headerName: '在购',
            field: 'buy_number',
            cellRendererFramework: 'AgShowBuy',
            filter: false,
            width: this.nowpx(0.08) + 'px'
          },
          {
            headerName: '在途',
            field: 'way_number',
            cellRendererFramework: 'AgShowWay',
            filter: false,
            width: this.nowpx(0.08) + 'px'
          },
          {
            headerName: '可用',
            field: 'edn_number',
            sort: 'desc',
            filter: false,
            width: this.nowpx(0.1) + 'px'
          },
          {
            headerName: '成本价',
            field: 'costPrice',
            filter: false,
            comparator: (a, b) => a - b,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '成本金额',
            field: 'costCost',
            filter: false,
            comparator: (a, b) => a - b,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '预警下限',
            field: 'gn_count_warning',
            filter: false,
            width: this.nowpx(0.08) + 'px'
          },

          {
            headerName: '预警到期',
            field: 'gn_maturity_time',
            filter: false,
            width: this.nowpx(0.1) + 'px',
            valueGetter: (p) => {
              if (p.data.gn_maturity_time) {
                return this.$q_date.formatDate(p.data.gn_maturity_time * 1000, 'YYYY-MM-DD HH:mm:ss')
              }
              return ''
            }
          },
          {
            headerName: '操作',
            filter: false,
            cellRendererFramework: 'AgButton',
            field: 'main_goods_id',
            width: this.nowpx(0.1) + 'px',
            pinned: 'right'
          }
        ]
        this.gridOptions.api.setColumnDefs(newAgColumnDefs)
      })
    },
    getPropertyAll () {
      this.$store
        .dispatch('goods/getProperty')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.supplierList = res.data.supplier ? res.data.supplier : []
              this.brandList = res.data.brand ? res.data.brand : []
              this.priorityList = res.data.priority ? res.data.priority : []
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllListData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    getGoodsType () {
      const obj = {
        goodsType: [1]
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypeData = res.data
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    getWarning () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        this.warningPopupStatus = true
        const obj = dataListSelections.map((item) => {
          return {
            main_goods_id: item.main_goods_id,
            main_spe_id: item.main_spe_id
          }
        })
        this.$nextTick(() => {
          this.$refs.child.setWarning(obj)
        })
      }
    },

    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品库存管理记录'
      })
    },
    getList () {
      this.warningPopupStatus = false
      this.dataListSelections = []

      const obj = {
        inType: 1,
        type: this.goodsTypeId,
        text: this.searchNumber,
        depot_id: this.depot_id,
        priority_id: this.priority_id,
        brand_id: this.brand_id,
        ...this.page
      }
      this.$store
        .dispatch('erpNumber/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
            if (res.data) {
              this.setTopTabel(this.specificationNewsData)
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    selfAdaption (params) {
      params.api.sizeColumnsToFit()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit();
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    resetCondition () {
      this.searchNumber = ''
      this.goodsTypeId = ''
      this.depot_id = ''
      this.priority_id = ''
      this.brand_id = ''
      this.$refs.selectTreeRef.resetValueData()
      this.$nextTick(() => {
        this.getList()
      })
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          goo_price: '数据合计',
          show_status: true,
          allNumber: '',
          allNumberPrice: '',
          buy_number: '',
          buyPrice: '',
          way_number: '',
          wayPrice: '',
          edn_number: '',
          edn_numberPrice: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}
          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }

          rowData.push(oneRowData)
        })
        return rowData
      }
    },
    // 限制保留小数
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    countExport () {
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const obj = {
        text: this.search,
        supplierId: this.supplierId,
        depot_id: this.depot_id,
        startTime: startTime,
        endTime: endTime
      }

      this.$store
        .dispatch('exports/getNumberExport', obj)
        .then((res) => {
          if (res.code == 200) {
            window.location.href = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style>
.erp-number-table .cell-span-erp-number {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
.bg-rule-negative .cell-span-erp-number {
  color: white !important;
  background-color: #ffcdd2 !important;
}
.bg-rule-warning .cell-span-erp-number {
  color: white !important;
  background-color: #f2c037 !important;
}
.bg-rule-red .cell-span-erp-number {
  color: white !important;
  background-color: #d50000 !important;
}
</style>

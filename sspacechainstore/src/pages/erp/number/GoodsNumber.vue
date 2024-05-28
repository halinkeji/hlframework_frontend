<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-lg q-gutter-x-xs row">
      <q-input class=" col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchNumber" label="商品名称/条码/助记码/简称" dense />
      <!-- <q-select
        class=" col-12 col-md-2 q-mt-sm"
        outlined
        v-model="goodsTypeId"
        :options="goodsTypedata"
        option-value="id"
        option-label="gt_name"
        option-disable="inactive"
        emit-value
        map-options
        clearable
        dense
        label="请选择分类"
      /> -->
    <div class="col-12 col-md-4 q-mt-sm">
      <hl-select-tree
        :list_width="400"
        @getItem="
          (item) => {
            goodsTypeId = item.id
          }
        "
        @resetValue="goodsTypeId = ''"
        :dataList="goodsTypeData"
        textName="请选择分类"
        :inputLabel="'gt_name'"
        :inputValue="'id'"
        :showValue="goodsTypeId"
        ref="selectTreeRef"
      />
    </div>

      <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getList" />
      <q-btn color="warning" @click="resetCondition" class=" q-mt-sm" unelevated label="重置" />
      <q-btn color="primary" class=" q-mt-sm" :disable="dataListSelections.length > 0 ? false : true" unelevated v-if="authorityMeta('warning')" @click="getWarning()">
        预警设置
      </q-btn>
      <q-btn color="primary" class=" q-mt-sm  " unelevated @click="exportCsv" label="导出Csv文件" v-if="authorityMeta('out')" :disable="specificationNewsData.length == 0" />

      <q-btn anchor="bottom right" self="top left" flat class="q-mr-sm" icon="ion-help-circle" color="warning">
        <q-tooltip>
          红色：同时达到预警（低于库存预警数量、小于库存预警时间）。
          浅红色：低于库存预警数量。
          橙色：小于库存预警时间。
        </q-tooltip>
      </q-btn>
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table erp-number-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="specificationNewsData"
        rowSelection="multiple"
        @gridReady="onFirstDataRendered"
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
              return params.data.gn_count_warning > params.data.gn_number
            }
          },
          'bg-rule-warning': (params) => {
            let outcome = Math.round(new Date().getTime() / 1000)
            if (params.data.gn_maturity_time) {
              return params.data.gn_maturity_time < outcome
            }
            return false
          },
          'bg-rule-red': (params) => {
            let a = false
            let b = false
            let outcome = Math.round(new Date().getTime() / 1000)
            if (params.data.gn_maturity_time && params.data.gn_maturity_time < outcome) {
              a = true
            }
            if (params.data.gn_count_warning && params.data.gn_count_warning > params.data.gn_number) {
              b = true
            }
            return a && b
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
export default {
  name: 'normal',
  components: {
    AgButton,
    WarningPopup
  },
  data () {
    return {
      activeName: '0',
      goodsTypedata: [],
      components: { AgButton, WarningPopup },
      gridOptions: {},

      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.25) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }, {
          headerName: '规格名称',
          field: 'sl_title',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '分类',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          field: 'gt_name',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '售价(' + this.$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneyUnit + ')',
          field: 'goo_price',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '总库存',
          field: 'gn_number',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '仓库',
          field: 'depotName',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }, {
          headerName: '仓库库存',
          field: 'depotNumber',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '预警下限',
          field: 'gn_count_warning',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '预警到期',
          field: 'gn_maturity_time',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: p => {
            if (p.data.gn_maturity_time) {
              return this.$q_date.formatDate(
                p.data.gn_maturity_time * 1000,
                'YYYY-MM-DD HH:mm:ss'
              )
            }
            return ''
          },
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgButton',
          rowSpan: this.rowSpan,
          field: 'main_goods_id',
          width: this.nowpx(0.1) + 'px',
          pinned: 'right',
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      specificationNewsData: [], // 默认数据源
      selected: [],
      searchNumber: '',
      goodsTypeId: '',
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
      goodsTypeData: []
    }
  },

  mounted () {
    this.getGoodsType()
    this.getList()
  },
  created () {
    this.context = this
  },
  computed: {},
  methods: {
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
    rowSpan (params) {
      const fields = ['goo_name', 'main_goods_id', 'goo_code', 'goo_price', 'gt_name', 'sl_title', 'gn_number', 'storeName', 'depotName', 'storeNumber']
      const data = this.specificationNewsData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        
      
        // 判断 当前列是总库存的同时 规格ID必须一致
        if (prevRow && prevRow[property] === cellValue && prevRow.goods_id == row.goods_id  && (property == 'gn_number' ? prevRow.spec_id == row.spec_id : true) ) {
          return countRowspan
        } else {
          countRowspan = 1
          
          while (nextRow && nextRow[property] === cellValue && nextRow.goods_id == row.goods_id && (property == 'gn_number' ?  nextRow.spec_id == row.spec_id : true ) ) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    getList () {
      this.warningPopupStatus = false
      this.dataListSelections = []

      const obj = {
        inType: 1,
        type: this.goodsTypeId,
        text: this.searchNumber,
        ...this.page
      }
      this.$store
        .dispatch('erpnumber/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
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
        params.api.sizeColumnsToFit()
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    resetCondition () {
      this.searchNumber = ''
      this.goodsTypeId = ''
      this.$refs.selectTreeRef.resetValueData()
      this.$nextTick(() => {
        this.getList()
      })
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
  background-color: #FFCDD2 !important;
}
.bg-rule-warning .cell-span-erp-number {
  color: white !important;
  background-color: #F2C037 !important;
}
.bg-rule-red .cell-span-erp-number {
  color: white !important;
  background-color: #D50000 !important;

}
</style>

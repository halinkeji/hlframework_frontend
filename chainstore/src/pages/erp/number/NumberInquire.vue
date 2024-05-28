<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-sm q-pb-lg q-gutter-x-xs row">
        <q-input class=" col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchNumber" label="商品名称/条码" dense />

        <div class="col-12 col-md-2 q-mt-sm">
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

        <div class="col-12 col-md-3 q-mt-sm">
          <q-select
            label="查询门店"
            v-model="selectStoreData"
            option-value="id"
            option-label="name"
            multiple
            emit-value
            map-options
            dense
            outlined
            clearable
            use-chips
            :options="libInStoreList"
            @input="getDepotList"
          />
        </div>

        <div class="col-12 col-md-3 q-mt-sm">
          <q-select
            outlined
            option-value="id"
            clearable
            use-chips
            option-label="ed_name"
            multiple
            emit-value
            map-options
            v-model="depot_id"
            :options="depotData"
            dense
            label="仓库"
          />
        </div>

        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" @click="resetCondition" class=" q-mt-sm" unelevated label="重置" />
        <q-btn color="primary" class=" q-mt-sm  " unelevated @click="exportCsv" label="导出" />
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
          @first-data-rendered="onFirstDataRendered"
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
  </q-page>
</template>
<script>
import AgButton from './components/AgButton'
import WarningPopup from './components/WarningPopup'
export default {
  name: 'normal',
  components: {
    AgButton,
    WarningPopup,
  },
  data() {
    return {
      activeName: '0',
      goodsTypedata: [],
      components: { AgButton, WarningPopup },
      gridOptions: {},

      columnDefs: [
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.24) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '规格名称',
          field: 'sl_title',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },

        {
          headerName: '分类',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          field: 'gt_name',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },

        {
          headerName: '售价(' + this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneyUnit + ')',
          field: 'goo_price',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '总库存',
          field: 'gn_number',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },

        {
          headerName: '门店',
          field: 'storeName',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '门店库存',
          field: 'storeNumber',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowStoreSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '仓库',
          field: 'depotName',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '仓库库存',
          field: 'depotNumber',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
      ],
      specificationNewsData: [], // 默认数据源
      selected: [],
      searchNumber: '',
      goodsTypeId: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0,
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      dataListSelections: [],
      warningPopupStatus: false,
      selectStoreData: [],
      libInStoreList: [],
      depot_id: [],
      depotData: [],
    }
  },

  mounted() {
    this.getGoodsType()
    this.getList()
  },
  created() {
    this.context = this
    this.getLibInStoreData()
  },
  computed: {},
  methods: {
    getDepotList() {
      this.depotData = []
      this.$store
        .dispatch('erpdepot/getAllData', { selectedStoreId: this.selectStoreData })
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          })
        })
    },
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getGoodsType() {
      const obj = {
        goodsType: [1],
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
            color: 'red',
          })
        })
    },
    getWarning() {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        this.warningPopupStatus = true
        const obj = dataListSelections.map((item) => {
          return {
            main_goods_id: item.main_goods_id,
            main_spe_id: item.main_spe_id,
          }
        })
        this.$nextTick(() => {
          this.$refs.child.setWarning(obj)
        })
      }
    },

    exportCsv() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-库存记录',
      })
    },
    rowSpan(params) {
      const fields = ['goo_name', 'goo_code', 'goo_price', 'gt_name', 'sl_title', 'gn_number', 'storeName', 'depotName', 'storeNumber']
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
        if (
          prevRow &&
          prevRow[property] === cellValue &&
          prevRow.goods_id == row.goods_id &&
          (property == 'gn_number' ? prevRow.spec_id == row.spec_id : true)
        ) {
          return countRowspan
        } else {
          countRowspan = 1

          while (
            nextRow &&
            nextRow[property] === cellValue &&
            nextRow.goods_id == row.goods_id &&
            (property == 'gn_number' ? nextRow.spec_id == row.spec_id : true)
          ) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    rowStoreSpan(params) {
      const fields = ['goo_name', 'goo_code', 'goo_price', 'gt_name', 'sl_title', 'gn_number', 'storeName', 'depotName', 'storeNumber']
      const data = this.specificationNewsData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue && prevRow.goods_id == row.goods_id && parseInt(prevRow.store_id) == parseInt(row.store_id)) {
          return countRowspan
        } else {
          countRowspan = 1
          while (
            nextRow &&
            nextRow[property] === cellValue &&
            nextRow.goods_id == row.goods_id &&
            parseInt(nextRow.store_id) == parseInt(row.store_id)
          ) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    getList() {
      this.warningPopupStatus = false
      const obj = {
        goodsTypeId: this.goodsTypeId,
        text: this.searchNumber,
        ...this.page,
        depot_id: this.depot_id,
        selectStoreData: this.selectStoreData,
      }
      this.$store
        .dispatch('erpnumber/getDetailData', obj)
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
            color: 'red',
          })
        })
    },

    // 每页数
    sizeChangeHandle(val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val
      this.getList()
    },
    selfAdaption(params) {
      params.api.sizeColumnsToFit()
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    resetCondition() {
      this.searchNumber = ''
      this.goodsTypeId = ''
      this.$refs.selectTreeRef.resetValueData()
      this.selectStoreData = []
      this.depot_id = []
      this.depotData = []
      this.$nextTick(() => {
        this.getList()
      })
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
  },
}
</script>
<style>
.erp-number-table .cell-span-erp-number {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
.bg-rule-negative {
  color: white !important;
  background-color: #ffcdd2 !important;
}
.bg-rule-warning {
  color: white !important;
  background-color: #f2c037 !important;
}
.bg-rule-red {
  color: white !important;
  background-color: #d50000 !important;
}
</style>

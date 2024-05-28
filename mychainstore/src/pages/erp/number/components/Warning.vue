<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
        <q-input class=" col-12 col-md-2 q-mt-sm" outlined v-model="searchNumber" label="名称/条码/助记码/简称" dense />
        <q-select
          class=" col-12 col-md-2 q-mt-sm"
          outlined
          v-model="goodsTypeId"
          :options="goodsTypedata"
          option-value="id"
          option-label="gt_name"
          option-disable="inactive"
          emit-value
          map-options
          dense
          label="请选择分类"
        />
        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索"  @click="getList" />
        <q-btn
          color="warning"
          class=" q-mt-sm"
          unelevated
          label="重置"
          @click="
            goodsTypeId = ''
            searchNumber = ''
            getList()
          "
        />
        <q-btn color="primary" class=" q-mt-sm" :disable="dataListSelections.length > 0 ? false : true" unelevated v-if="authorityMeta('warning')" @click="getWarning()">
          预警设置
        </q-btn>
        <q-btn color="primary" class=" q-mt-sm  " unelevated @click="exportCsv" v-if="authorityMeta('outWarning')" label="导出Csv文件" :disable="specificationNewsData.length == 0" />
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
          rowHeight="50"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :context="context"
          :animateRows="false"
          :floatingFilter="false"
          :enableCharts="true"
          :enableRangeSelection="true"
          :enableCellTextSelection="true"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :rowMultiSelectWithClick="true"
          :localeText="localeText"
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
      <warning-popup ref="child" @warning="getList"></warning-popup>
    </div>
  </q-page>
</template>
<script>
import AgButton from './AgButton'
import XEUtils from 'xe-utils'
import WarningPopup from './WarningPopup.vue'
export default {
  name: 'normal',
  components: { AgButton, WarningPopup },
  data () {
    return {
      goodsTypedata: [],
      context: null,
      components: { AgButton },
      gridOptions: {},

      columnDefs: [
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.06) + 'px'
        },
        // 表格列数据
        {
          headerName: '商品名称', // 列标题
          field: 'goo_name', // 列与数据源对应的字段
          filter: false, // 是否过滤
          width: this.nowpx(0.2) + 'px',
          onCellValueChanged: function (p) {
            const itemsToUpdate = []
            const data = p.data
            data.goo_name = Math.floor(Math.random() * 20000 + 20000)
            itemsToUpdate.push(data)

            const res = p.api.applyTransaction({ update: itemsToUpdate })
          },
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
          headerName: '助记码',
          field: 'goo_pinYin',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '分类',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          valueGetter: (p) => {
            if (p.data.goodsType != null) {
              return p.data.goodsType
            }
          }
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '规格名称',
          field: 'specificationName',
          filter: false,
          width: this.nowpx(0.09) + 'px',
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
          headerName: '售价',
          field: 'goo_price',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '库存',
          field: 'gn_number',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '库存预警数量',
          field: 'gn_count_warning',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '库存预警时间',

          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.gn_maturity_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgButton',
          rowSpan: this.rowSpan,
          width: this.nowpx(0.09) + 'px',
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
      dataListSelections: []
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
      this.$store
        .dispatch('goodstype/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.goodsTypedata = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    getWarning () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item
        })
        this.$refs.child.setWarning(obj)
      }
    },

    rowSpan (params) {
      const fields = ['goo_name']
      const data = this.specificationNewsData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    getList () {
      // inType 1实物服务 2套餐
      this.dataListSelections = []
      const obj = {
        inType: 1,
        type: this.goodsTypeId,
        text: this.searchNumber,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        warning: 1
      }
      this.$store
        .dispatch('erpnumber/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            // this.specificationNewsData = res.data.list;
            this.toColTreeData(res.data.list)
            this.page.totalCount = parseInt(res.data.page.totalCount)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    // 转换横向树结构
    toColTreeData (specificationNewsData) {
      const options = { children: 'children' }
      const list = []
      const keyMap = {}
      XEUtils.eachTree(
        specificationNewsData,
        (item, index, result, paths, parent) => {
          keyMap[item.id] = item
          item.keys = parent ? parent.keys.concat([item.id]) : [item.id]
          item.keysId = ',' + item.id

          if (!item.children || !item.children.length) {
            const row = {}
            item.keys.forEach((key, index, v) => {
              const obj = keyMap[key]

              if (obj.goods_id > 0 || obj.goods_id) {
                row.id = obj.id
                row.goods_id = obj.goods_id
                row.specificationName = obj.sl_title
                row.goo_price = obj.sl_markedPrice
                row.gn_number = obj.sl_inventory
                row.goo_code = obj.sl_barCode
                row.goodsType = obj.goodsType ? obj.goodsType.gt_name : ''
                row.goo_type = 2
                row.totalCost = obj.sl_markedPrice
                row.storagePrice = obj.sl_warehousingPrice
              } else {
                row.id = 0
                row.goods_id = obj.id
                row.goo_name = obj.goo_name
                row.goo_pinYin = obj.goo_pinYin
                row.gt_name = obj.gt_name
                row.goo_code = obj.goo_code
                row.goo_nick = obj.goo_nick
                row.goo_price = obj.goo_price
                row.gn_number = obj.gn_number
                row.goo_type = 1
                row.goodsType = obj.goodsType ? obj.goodsType.gt_name : ''
                row.totalCost = obj.goo_price
                row.storagePrice = obj.goo_purchasePrice
              }

              row.goodsTypeId = obj.goodsTypeId
              row.frequency = 1
              row.limitTimes = 0
              row.limitStatus = true

              row.limitCycle = '1'
              row.originalPrice = row.totalCost
              row.quantity = 1

              row.discount = 100 // 折扣率
              row.discountAmount = row.storagePrice * row.frequency - row.storagePrice * (row.discount * 0.01) // 折扣金额
              row.quantity = row.storagePrice - row.storagePrice * (row.discount * 0.01) // 购货金额
              row.purchaseAmount = row.storagePrice * row.frequency // 折扣金额
            })
            list.push(row)
          }
        },
        options
      )

      this.specificationNewsData = list
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pSize = val
      this.getList()
    },
    selfAdaption (params) {
      params.api.sizeColumnsToFit()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-库存预警管理记录'
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
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
</style>

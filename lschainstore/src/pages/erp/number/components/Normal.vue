<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll q-gutter-x-xs row">
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
      <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getList" />
      <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" />
      <q-btn color="primary" class=" q-mt-sm" :disable="dataListSelections.length > 0 ? false : true" unelevated @click="getWarning()">
        预警设置
      </q-btn>
      <q-btn color="primary" class=" q-mt-sm  " unelevated @click="exportCsv" label="导出Csv文件" :disable="specificationNewsData.length == 0" />
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
        :context="context"
        @rowSelected="rowSelectedAg"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
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
  </q-page>
</template>
<script>
import AgButton from './AgButton'
import WarningPopup from './WarningPopup'

export default {
  name: 'normal',
  components: { AgButton, WarningPopup },
  data () {
    return {
      goodsTypedata: [],
      components: { AgButton, WarningPopup },
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
          width: this.nowpx(0.24) + 'px',

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
            if (p.data.goodsType) {
              return p.data.goodsType.gt_name
            } else {
              return ''
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
      context: null,
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
            caption: '操作失败',
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-预警记录'
      })
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
      this.dataListSelections = []
      const obj = {
        inType: 1,
        type: this.goodsTypeId,
        text: this.searchNumber,
        ...this.page,
        warning: 0
      }
      this.$store
        .dispatch('erpNumber/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data.list

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

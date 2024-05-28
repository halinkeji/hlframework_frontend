<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm">
      <q-btn color="primary"  unelevated @click="exportCsv" label="导出Csv文件" :disable="changeData.length == 0" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">

      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-table-number-view hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="changeData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TurnView',
  props: ['goods'],
  data () {
    return {
      activeName: '0',
      gridOptions: {},
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      changeData: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        // 表格列数据

        {
          headerName: ' 单据号',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.2) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '商品名称',
          field: 'etd_goods_name',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '规格名称',
          field: 'etd_spe_name'
        },
        {
          headerName: '调拨数量',
          field: 'etd_turn_number'
        },

        {
          headerName: '调拨状态',
          field: 'etd_status',
          valueGetter: (p) => {
            if (parseInt(p.data.etd_status) == 1) {
              return '成功调拨'
            }
            if (parseInt(p.data.etd_status) == 2) {
              return '等待确认'
            }
            if (parseInt(p.data.etd_status) == 3) {
              return '库存不足调拨失败'
            }
          }
        },
        {
          headerName: '调出门店',
          field: 'etd_out_depot_id',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          valueGetter: (params) => {
            return params.data && params.data.store && params.data.store.name ? params.data.store.name : ''
          }
        },
        {
          headerName: '调入门店',
          field: 'etd_out_depot_id',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          valueGetter: (params) => {
            return params.data && params.data.inStore && params.data.inStore.name ? params.data.inStore.name : ''
          }
        },
        {
          headerName: '调出仓库',
          field: 'etd_out_depot_id',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          valueGetter: (params) => {
            return params.data && params.data.outDepot && params.data.outDepot.ed_name ? params.data.outDepot.ed_name : ''
          }
        },
        {
          headerName: '调入仓库',
          field: 'etd_out_depot_id',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          valueGetter: (params) => {
            return params.data && params.data.inDepot && params.data.inDepot.ed_name ? params.data.inDepot.ed_name : ''
          }
        }
      ]
    }
  },
  computed: {},
  created () {
    this.getchangeData()
  },
  mounted () {},
  methods: {
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
        fileName: date + '-商品盘点记录'
      })
    },
    getchangeData () {
      const obj = {
        goodsId: this.goods,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }

      this.$store.dispatch('erpnumber/getTurnDataList', obj).then((res) => {
        if (res.code == 200) {
          this.page.totalCount = res.data ? res.data.page.totalCount : 0
          this.changeData = res.data ? res.data.list : []
          if (res.data) {
            this.setTopTabel(this.changeData)
          }
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getchangeData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getchangeData()
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          gii_inventoryInCode: '数据合计',
          etd_turn_number: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },
    // 限制保留小数
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    rowSpan (params) {
      const fields = ['gii_inventoryInCode']
      const data = this.changeData
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
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          rowData.push(oneRowData)
        })
        return rowData
      }
    }
  }
}
</script>
<style>
.erp-table-number-view .cell-span-erp-number-view {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>

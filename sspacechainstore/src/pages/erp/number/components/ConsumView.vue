<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm">
      <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="consumData.length == 0" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-table-number-view hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="consumData"
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
    <div class="col-shrink bg-white q-pb-md">
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
  name: 'ConsumView',
  props: ['goods'],
  data() {
    return {
      gridOptions: {},
      activeName: '0',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0,
      },
      consumData: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        // 表格列数据

        {
          headerName: ' 单据号',
          field: 'sc_invoiceCode',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '商品名称',
          field: 'cid_goo_name',
          filter: false,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '规格',
          field: 'cid_specificationName',
          filter: false,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },

        {
          headerName: '条码',
          field: 'cid_goo_code',
          filter: false,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function(p) {
              if (p.value) {
                return true
              }
            },
          },
        },
        {
          headerName: '销售数量',
          field: 'cid_consumeNumber',
          filter: false,
        },

        {
          headerName: '销售方式',
          field: 'sc_consumeTypeName',
          filter: false,
        },
        {
          headerName: ' 销售时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
        },

        {
          headerName: ' 操作员',
          valueGetter: (p) => {
            return p.data.user ? p.data.user.username : ''
          },
        },
      ],
    }
  },
  computed: {},
  created() {
    this.getConsumData()
  },
  mounted() {},
  methods: {
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
    exportCsv() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品销售记录',
      })
    },
    getConsumData() {
      const obj = {
        goodsId: this.goods,
        text: 'consume',
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
      }

      this.$store.dispatch('erpnumber/getConsum', obj).then((res) => {
        if (res.code == 200) {
          this.page.totalCount = res.data ? res.data.page.totalCount : 0
          this.consumData = res.data ? res.data.list : []
          if (res.data) {
            this.setTopTabel(this.consumData)
          }
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getConsumData()
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val
      this.getConsumData()
    },
    setTopTabel(list) {
      const newRows = this.countColumnData(list, [
        {
          sc_invoiceCode: '数据合计',
          cid_consumeNumber: '',
        },
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },
    rowSpan(params) {
      const fields = ['sc_invoiceCode', 'cid_goo_name', 'cid_specificationName', 'cid_goo_code']
      const data = this.consumData
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

    countColumnData(data = [], condition = []) {
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
    },
    // 限制保留小数
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
  },
}
</script>
<style>
.erp-table-number-view .cell-span-erp-number-view {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>

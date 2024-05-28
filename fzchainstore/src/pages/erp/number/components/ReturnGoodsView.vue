<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-btn color="primary" class=" q-mt-sm q-mb-md " unelevated @click="exportCsv" label="导出Csv文件" :disable="returnGoods.length == 0" />
    </div>
    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center  full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="returnGoods"
        :gridOptions="gridOptions"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
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
  name: 'ReturnGoodsView',
  props: ['goods'],
  data () {
    return {
      activeName: '0',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      gridOptions: {},
      returnGoods: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        // 表格列数据

        {
          headerName: ' 单据号',
          field: 'sc_invoiceCode',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '销售数量',
          field: 'cid_consumeNumber',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '销售方式',
          field: 'sc_consumeTypeName',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '退货时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: ' 操作员',
          valueGetter: (p) => {
            return p.data.user ? p.data.user.username : ''
          },
          width: this.nowpx(0.2) + 'px'
        }
      ]
    }
  },
  computed: {},
  created () {
    this.getReturnGoods()
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
        fileName: date + '-退货记录'
      })
    },
    getReturnGoods () {
      const obj = {
        goodsId: this.goods,
        text: 'returnGoods',
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }

      this.$store.dispatch('erpnumber/getConsum', obj).then((res) => {
        if (res.code == 200) {
          this.page.totalCount = res.data ? res.data.page.totalCount : 0
          this.returnGoods = res.data ? res.data.list : []
          if (res.data) {
            this.setTopTabel(this.returnGoods)
          }
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getReturnGoods()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getReturnGoods()
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          sc_invoiceCode: '数据合计',
          cid_consumeNumber: ''
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
            let bid
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += parseInt(value[j])
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

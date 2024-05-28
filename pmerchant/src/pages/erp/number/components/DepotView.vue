<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm">
      <q-btn color="primary"  unelevated @click="exportCsv" label="导出Csv文件" :disable="changeData.length == 0" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="changeData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :localeText="localeText"
        :gridOptions="gridOptions"
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
  name: 'ChangeView',
  props: ['goodsId'],
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
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '规格名称',
          field: 'sl_title',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '仓库名称',
          field: 'depot.ed_name',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '仓库数量',
          field: 'edn_number',
          filter: false,
          width: this.nowpx(0.1) + 'px'
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
        goodsId: this.goodsId,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }

      this.$store.dispatch('erpnumber/getGoodsDepotData', obj).then((res) => {
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
          goo_name: '数据合计',
          edn_number: ''
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

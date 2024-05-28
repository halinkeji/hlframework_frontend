<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-sm">
      <q-btn color="grey" unelevated :to="{ name: 'erpNumber' }" label="返回" />

      <div class="col-2">
        <q-input outlined @clear="getSaleData" clearable v-model="orderNumber" label="单据号" dense />
      </div>
      <q-btn color="primary"  unelevated @click="exportCsv" label="导出Csv文件" :disable="saleData.length == 0" />
    </div>
    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="saleData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :gridOptions="gridOptions"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
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
import AgShow from 'pages/erp/out/components/AgShow'
export default {
  name: 'OutReturnView',
  props: ['goods', 'archives_id', 'type'],
  components: { AgShow },
  data () {
    return {
      activeName: '0',
      gridOptions: {},
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      saleData: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: ' 单据号',
          field: 'cep_contract_number',
          cellRendererFramework: 'AgShow',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '数量',
          field: 'epd_out_quantity',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '购货商品名称',
          field: 'epd_archives_name',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'epd_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'epd_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '出库库仓 ',
          field: 'cep_depot_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '出库日期',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: ' 操作员',
          valueGetter: (p) => {
            return p.data.auditor ? p.data.auditor.username : ''
          },
          filter: false,
          width: this.nowpx(0.12) + 'px'
        }
      ],
      orderNumber: ''
    }
  },
  computed: {},
  created () {

  },
  mounted () {
    this.getSaleData()
  },
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
        fileName: date + '-销货记录'
      })
    },
    getSaleData () {
      const obj = {
        text: this.orderNumber,
        id: this.goods,
        archives_id: this.archives_id,
        type: this.type,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }

      this.$store.dispatch('erpNumber/getOut', obj).then((res) => {
        if (res.code == 200) {
          this.page.totalCount = res.data ? res.data.page.totalCount : 0
          this.saleData = res.data ? res.data.list : []
          if (res.data) {
            this.setTopTabel(this.saleData)
          }
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getSaleData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getSaleData()
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          cep_contract_number: '数据合计',
          epd_out_quantity: ''
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

<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <!-- <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-btn color="primary" class=" q-mt-sm q-mb-md " unelevated @click="exportCsv" label="导出Csv文件" :disable="saleReturnData.length == 0" />
    </div> -->

         <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-sm">
      <q-btn color="grey" unelevated :to="{ name: 'erpNumber' }" label="返回" />

      <div class="col-2">
        <q-input outlined @clear="getTransferData" clearable v-model="orderNumber" label="单据号" dense />
      </div>

      <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="transferData.length == 0" />
    </div>
    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="transferData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :gridOptions="gridOptions"
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
import AgShow from 'pages/erp/transfer/components/AgShow'
export default {
  name: 'TransferView',
  props: ['goods', 'archives_id'],
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
      transferData: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: ' 单据号',
          field: 'cet_order_number',
          cellRendererFramework: 'AgShow',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '调拨商品名称',
          field: 'epd_archives_name',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '规格 ',
          field: 'epd_spe_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: ' 创建日期',
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
    this.context = this
    this.getTransferData()
  },
  methods: {

    getTransferData () {
      const obj = {
        text: this.orderNumber,
        archives_detail_id: this.goods,
        archives_id: this.archives_id,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }

      this.$store.dispatch('erpNumber/getTransfer', obj).then((res) => {
        if (res.code == 200) {
          this.page.totalCount = res.data ? res.data.page.totalCount : 0
          this.transferData = res.data ? res.data.list : []
          // this.transferData = res.data ? res.data : []
          if (res.data) {
            this.setTopTabel(this.transferData)
          }
        }
      })
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
        fileName: date + '-销货退货记录'
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getTransferData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getTransferData()
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          // cet_order_number: '数据合计',
          epd_quantity: ''
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

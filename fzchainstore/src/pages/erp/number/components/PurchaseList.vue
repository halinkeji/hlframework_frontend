<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <!-- <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs ">
      <div class="row justify-center">
        <h6 class="no-margin">在购单据信息</h6>
        <q-space />
        <q-btn unelevated flat round dense icon="close" v-close-popup />
      </div>
    </div> -->

     <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-sm">
      <q-btn color="grey" unelevated :to="{ name: 'erpNumber' }" label="返回" />

      <div class="col-2">
        <q-input outlined @clear="getInData" clearable v-model="orderNumber" label="单据号" dense />
      </div>

      <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="goodsInData.length == 0" />
    </div>

    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="goodsInData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :gridOptions="gridOptions"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
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
import AgInput from 'pages/erp/purchase/components/AgInput'

export default {
  name: 'PurchaseView',
  props: ['goods', 'archives_id', 'type'],
  components: { AgInput },
  data () {
    return {
      gridOptions: {},
      context: null,
      components: {
        AgInput
      },
      goodsInData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: ' 单据号',
          field: 'cep_contract_number',
          // cellRendererFramework: 'AgInput',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '数量',
          field: 'epd_quantity',
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
          headerName: '入库仓 ',
          field: 'cep_depot_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '购货日期',
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
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      orderNumber: ''
    }
  },

  computed: {},
  created () {

  },
  mounted () {
    this.getInData()
    this.context = this
  },
  methods: {
    getInData () {
      const obj = {
        text: this.orderNumber,
        archives_detail_id: this.$route.query.id,
        archives_id: this.$route.query.archives_id,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }
      this.$store
        .dispatch('erpNumber/getPurchase', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.goodsInData = res.data ? res.data.list : []

            this.setTopTabel(this.goodsInData)
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
      this.getInData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
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
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          // cep_contract_number: '数据合计',
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
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-采购记录'
      })
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

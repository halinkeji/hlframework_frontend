<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-btn color="primary" class="q-mt-sm q-mb-md" unelevated @click="exportCsv" label="导出Csv文件" :disable="consumData.length == 0" />
    </div>
    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="consumData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :gridOptions="gridOptions"
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
export default {
  name: 'NumberlogView',
  props: ['goods'],
  data () {
    return {
      gridOptions: {},
      activeName: '0',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      consumData: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        // 表格列数据

        {
          headerName: ' 单据号',
          field: 'gnl_invoice_code',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '关联入库单据',
          field: 'gnl_link_invoice_code',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '商品名称',
          field: 'goods.goo_name',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '规格',
          field: 'spe.sl_title',
          filter: false,
          valueGetter: (p) => {
            if (p.data.spe) {
              return p.data.spe.sl_title
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '变更数量',
          field: 'gnl_number',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '变更方式',
          field: 'gnl_type',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.gnl_type == 1 ? '增加' : '减少'
          }
        },
        {
          headerName: '变更行为',
          field: 'gnl_operating_behavior',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '生产日期',
          field: 'gnl_product_time',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.gnl_product_time * 1000, 'YYYY-MM-DD ')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '保质期',
          field: 'gnl_shelf_life_time',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.gnl_shelf_life_time * 1000, 'YYYY-MM-DD ')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '操作时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: ' 操作员',
          valueGetter: (p) => {
            return p.data.user ? p.data.user.username : ''
          },
          width: this.nowpx(0.1) + 'px'
        }
      ]
    }
  },
  computed: {},
  created () {
    this.getConsumData()
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
        fileName: date + '-商品销售记录'
      })
    },
    getConsumData () {
      const obj = {
        goodsId: this.goods,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }

      this.$store.dispatch('erpNumber/getNumberLog', obj).then((res) => {
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
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getConsumData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getConsumData()
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          gnl_invoice_code: '数据合计',
          gnl_number: ''
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
